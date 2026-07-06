/**
 * Screening Room (T1) motion — CHROME (Wave A) + FRONT-DOOR CONTENT (Wave B).
 *
 * Doctrine (SPEC §3): motion serves reading. Nothing auto-scrolls; everything is
 * a one-time compose on load, a scroll-driven scrub, or a micro-interaction. The
 * whole module runs INSIDE the dispatcher's `gsap.matchMedia('(prefers-reduced-
 * motion: no-preference)')` gate (see ./index.ts), so reduced-motion collapses
 * everything to the fully-visible static SSR default — no exceptions.
 *
 * CRITICAL (SPEC §3.5 + the v2 study §3 pre-hide flaw, inverted): the SSR / no-JS
 * default is fully visible, static content. Hidden/offset states are applied from
 * JS ONLY, right before animating — via EXPLICIT `gsap.fromTo()` (never a CSS
 * pre-hide, and never a bare `gsap.from()` whose end value is captured from the
 * element's live state: if the dispatcher re-inits the module and a prior tween
 * left an element hidden, a `from()` would capture end-opacity 0 and strand it
 * visible-never. `fromTo` pins the end explicitly, so entrances always resolve).
 * Blocks expose stable `data-motion` hooks; this module selects them.
 *
 * BLINK GUARD: the motion layer boots via requestIdleCallback (up to ~600ms after
 * paint), so an entrance that snaps already-VISIBLE content to a hidden start
 * would flash. `safeEntrance()` therefore only runs a snap-to-hidden entrance for
 * an element off-screen at boot, or when we booted within the first paint window.
 * Content already on screen at a late boot is left static (no yank). Below-fold
 * ScrollTrigger entrances are unaffected — they play on scroll-in.
 *
 * Choreography mirrors the approved mockup
 * (design-source/directions/direction-a-screening-room.html):
 *   nameplate letters compose on load (AFTER the splash when it plays) · identity
 *   strip word scrub · dispatch band slide-in · cover display film-gate wipe +
 *   opposing drift · display heads dissolve on exit · doors stagger-rise + logos
 *   settle from 1.35 · slate rows file in · about window words develop.
 */
import type { MotionApi, ThemeMotion } from './index'

type Vars = Parameters<MotionApi['gsap']['fromTo']>[2]

/* One-time-on-load guards persist across theme re-inits (dispatcher re-runs this
   module when the visitor toggles back to Screening Room). Scroll-triggered
   pieces are safe to recreate; on-load composes must not re-fire. */
let navSettleDone = false
let composeDone = false

/** Run `cb` once the entrance splash (if any) has cleared. The splash is a
 *  JS-injected `.apr-splash` overlay (front door, once per session, ≤2.2s).
 *  We never touch splash.ts; we simply wait for its element to be removed so the
 *  nameplate composes as the splash blurs out. No splash → run immediately. */
function afterSplash(cb: () => void): void {
  const splash = document.querySelector('.apr-splash')
  if (!splash) {
    cb()
    return
  }
  let fired = false
  const run = () => {
    if (fired) return
    fired = true
    obs.disconnect()
    window.clearTimeout(safety)
    cb()
  }
  const obs = new MutationObserver(() => {
    if (!document.querySelector('.apr-splash')) run()
  })
  obs.observe(document.body, { childList: true })
  // Safety: the splash hard-caps at 2.2s; compose no later than 2.6s regardless.
  const safety = window.setTimeout(run, 2600)
}

const fontsReady: Promise<unknown> =
  typeof document !== 'undefined' && (document as Document).fonts
    ? (document as Document).fonts.ready
    : Promise.resolve()

const screeningRoomMotion: ThemeMotion = ({ gsap, SplitText }: MotionApi) => {
  const splits: Array<{ revert: () => void }> = []

  /* First-paint window: within it, snapping visible content to a hidden start is
     imperceptible. `document.readyState !== 'complete'` = load hasn't fired yet;
     the time bound catches fast loads where load already fired. */
  const bootedEarly =
    (typeof document !== 'undefined' && document.readyState !== 'complete') ||
    (typeof performance !== 'undefined' && performance.now() < 400)

  const inViewport = (el: Element): boolean => {
    const r = el.getBoundingClientRect()
    return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth
  }
  /** Safe to run a snap-to-hidden entrance on this element without a blink? */
  const safeEntrance = (el: Element): boolean => bootedEarly || !inViewport(el)

  /** Group entrance: only animate the targets we can enter without a blink.
   *  Explicit fromTo so a re-init never strands an element at its hidden start. */
  const entrance = (selector: string, from: Vars, to: Vars): void => {
    const targets = gsap.utils.toArray<HTMLElement>(selector).filter(safeEntrance)
    if (targets.length) gsap.fromTo(targets, from, to)
  }

  // ── CHROME — one-time nav settle (Wave A) ──────────────────────────────────
  // RESILIENCE: the dispatcher re-inits this module on a data-design change and,
  // in doing so, kills/reverts in-flight tweens — which reproducibly STALLED the
  // nav-link stagger partway (links stuck half-faded). Guards: (a) `onInterrupt`
  // snaps to the final visible state if the tween is killed mid-flight; (b) on a
  // re-init (navSettleDone already set) we clear any stranded inline state so the
  // chrome is unconditionally visible. (Wave A also keeps a SiteNav safety net.)
  const nav = document.querySelector('.site-nav')
  if (nav) {
    if (navSettleDone) {
      gsap.set([nav, '.site-nav__link'], { clearProps: 'opacity,transform' })
    } else {
      navSettleDone = true
      // On first visit the splash occludes the nav; on a late return-visit boot
      // the nav is already visible, so only settle when it won't yank a visible bar.
      if (document.querySelector('.apr-splash') || safeEntrance(nav)) {
        const healNav = () => gsap.set([nav, '.site-nav__link'], { opacity: 1, y: 0 })
        gsap.fromTo(
          nav,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', onInterrupt: healNav },
        )
        gsap.fromTo(
          '.site-nav__link',
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.45, delay: 0.1, stagger: 0.05, ease: 'power2.out', onInterrupt: healNav },
        )
      }
    }
  }

  // ── 1 · NAMEPLATE composes itself, letter by letter, after the splash ───────
  if (!composeDone) {
    composeDone = true
    // Compose when the splash will mask the snap (first visit) or we booted early
    // enough that the snap is imperceptible; else the nameplate stays static.
    const splashPresent = !!document.querySelector('.apr-splash')
    if (splashPresent || bootedEarly) {
      fontsReady.then(() => {
        afterSplash(() => {
          const lines = gsap.utils.toArray<HTMLElement>('[data-motion="nameplate-line"]')
          if (lines.length) {
            const split = new SplitText(lines, { type: 'chars' })
            splits.push(split)
            gsap.fromTo(
              split.chars,
              { yPercent: 110, opacity: 0 },
              {
                yPercent: 0,
                opacity: 1,
                duration: 1.0,
                ease: 'power4.out',
                stagger: { each: 0.04, from: 'start' },
                // If killed mid-compose (dispatcher re-init), snap the letters visible.
                onInterrupt: () => gsap.set(split.chars, { yPercent: 0, opacity: 1 }),
              },
            )
          }
          gsap.fromTo(
            '[data-motion="nameplate-meta"]',
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: 0.5,
              stagger: 0.15,
              ease: 'power2.out',
              onInterrupt: () => gsap.set('[data-motion="nameplate-meta"]', { opacity: 1, y: 0 }),
            },
          )
        })
      })
    }
  }

  // ── 2 · IDENTITY STRIP reads itself: words develop as you scroll ────────────
  // (A scroll-linked read, not an entrance yank — the signature "scroll is the
  //  read." Its dimmed start is intended and unaffected by the blink guard.)
  fontsReady.then(() => {
    const read = document.querySelector('[data-motion="identity-read"]')
    if (read) {
      const s = new SplitText(read, { type: 'words' })
      splits.push(s)
      gsap.fromTo(
        s.words,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: { trigger: read, start: 'top 82%', end: 'bottom 45%', scrub: true },
        },
      )
    }
  })

  // ── 3 · DISPATCH BAND: the leader tab slides through ────────────────────────
  entrance(
    '[data-motion="dispatch-band"] > *',
    { x: -28, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: '[data-motion="dispatch-band"]', start: 'top 88%' },
    },
  )

  // ── 4 · COVER display: lines wipe in like a film gate, then drift on scrub ───
  gsap.utils.toArray<HTMLElement>('[data-motion="cover-line"]').forEach((line, i) => {
    if (safeEntrance(line)) {
      gsap.fromTo(
        line,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.9,
          delay: i * 0.14,
          ease: 'power4.inOut',
          scrollTrigger: { trigger: line, start: 'top 82%' },
        },
      )
    }
    // Drift is a scroll-linked transform starting from the natural position — no
    // snap, so it always runs.
    gsap.to(line, {
      xPercent: [4, -5, 7][i % 3],
      ease: 'none',
      scrollTrigger: { trigger: '[data-motion="cover"]', start: 'top 70%', end: 'bottom top', scrub: true },
    })
  })
  entrance(
    '[data-motion="cover-reveal"]',
    { opacity: 0, y: 22 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="cover-reveal"]', start: 'top 88%' },
    },
  )
  entrance(
    '[data-motion="cover-plate"]',
    { opacity: 0, scale: 0.96 },
    {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="cover-plate"]', start: 'top 85%' },
    },
  )

  // ── 5 · Section heads DISSOLVE as they leave (a dissolve, not a cut) ─────────
  // (Scroll-linked exit from the natural state — no snap; always safe.)
  gsap.utils.toArray<HTMLElement>('[data-motion="dissolve-head"]').forEach((el) => {
    gsap.to(el, {
      opacity: 0.14,
      filter: 'blur(6px)',
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'bottom 26%', end: 'bottom -6%', scrub: true },
    })
  })

  // ── 6 · THREE DOORS: panels rise, marks settle from oversized ───────────────
  entrance(
    '[data-motion="door"]',
    { y: 44, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.85,
      stagger: 0.14,
      ease: 'power3.out',
      scrollTrigger: { trigger: '[data-motion="doors"]', start: 'top 82%' },
    },
  )
  gsap.utils.toArray<HTMLElement>('[data-motion="door-logo"]').forEach((img) => {
    if (!safeEntrance(img)) return
    gsap.fromTo(
      img,
      { scale: 1.35 },
      {
        scale: 1,
        transformOrigin: 'left center',
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: img, start: 'top 85%' },
      },
    )
  })

  // ── 7 · THE SLATE files in: rows advance one frame at a time ────────────────
  entrance(
    '[data-motion="slate-row"]',
    { x: -34, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.55,
      stagger: 0.09,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="slate"]', start: 'top 82%' },
    },
  )

  // ── 8 · The 2 a.m. WINDOW develops out of the dark as you arrive ────────────
  fontsReady.then(() => {
    const win = document.querySelector('[data-motion="about-window"]')
    if (win) {
      const s = new SplitText(win, { type: 'words' })
      splits.push(s)
      gsap.fromTo(
        s.words,
        { opacity: 0.08 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: { trigger: '[data-motion="about"]', start: 'top 75%', end: 'top 30%', scrub: true },
        },
      )
    }
    entrance(
      '[data-motion="about-reveal"]',
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: '[data-motion="about-reveal"]', start: 'top 85%' },
      },
    )
  })

  // Cleanup: revert SplitText DOM so a theme switch leaves clean markup. The
  // dispatcher kills the ScrollTriggers + reverts the matchMedia scope.
  return () => {
    splits.forEach((s) => {
      try {
        s.revert()
      } catch {
        /* already reverted */
      }
    })
  }
}

export default screeningRoomMotion
