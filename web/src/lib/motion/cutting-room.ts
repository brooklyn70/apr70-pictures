/**
 * Cutting Room (T4) motion — HARD CUTS. The anti-smooth theme.
 *
 * Doctrine (SPEC §2 T4 + §3): everything advances like a flatbed pulling frames.
 * No dissolves, no smoothing, no SplitText softness — every reveal is a steps()
 * hard cut. On-load composes CUT their letters/rows in one frame at a time;
 * scroll-linked reads SNAP words on between discrete frames rather than fading.
 *
 * Runs INSIDE the dispatcher's reduced-motion matchMedia gate (see ./index.ts),
 * so reduced-motion collapses to the fully-visible static SSR default. Hidden
 * starts are applied from JS only, via EXPLICIT gsap.fromTo() (never gsap.from,
 * never a CSS pre-hide) so a dispatcher re-init can never strand an element at
 * its hidden start. onInterrupt heals any tween the re-init kills mid-cut.
 *
 * BLINK GUARD (mirrors screening-room.ts): the layer boots via requestIdleCallback
 * up to ~600ms after paint; snapping already-visible content to a hidden start
 * would flash. safeEntrance() only runs a snap-to-hidden entrance for an element
 * off-screen at boot, or when we booted inside the first paint window. Below-fold
 * ScrollTrigger reveals are unaffected — they cut in on scroll.
 */
import type { MotionApi, ThemeMotion } from './index'

type Vars = Parameters<MotionApi['gsap']['fromTo']>[2]

/* One-time-on-load guards persist across theme re-inits (the dispatcher re-runs
   this module when the visitor toggles back to Cutting Room). */
let navSettleDone = false
let composeDone = false

/** Run `cb` once the entrance splash (front door, once per session) has cleared. */
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
  const safety = window.setTimeout(run, 2600)
}

const fontsReady: Promise<unknown> =
  typeof document !== 'undefined' && (document as Document).fonts
    ? (document as Document).fonts.ready
    : Promise.resolve()

const cuttingRoomMotion: ThemeMotion = ({ gsap, SplitText }: MotionApi) => {
  const splits: Array<{ revert: () => void }> = []

  const bootedEarly =
    (typeof document !== 'undefined' && document.readyState !== 'complete') ||
    (typeof performance !== 'undefined' && performance.now() < 400)

  const inViewport = (el: Element): boolean => {
    const r = el.getBoundingClientRect()
    return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth
  }
  const safeEntrance = (el: Element): boolean => bootedEarly || !inViewport(el)

  /** Hard-cut group entrance: only enter targets we can snap without a blink. */
  const cut = (selector: string, from: Vars, to: Vars): void => {
    const targets = gsap.utils.toArray<HTMLElement>(selector).filter(safeEntrance)
    if (targets.length) gsap.fromTo(targets, from, to)
  }

  // ── CHROME · nav event-list cuts in, one entry per frame ────────────────────
  const nav = document.querySelector('.site-nav')
  if (nav) {
    if (navSettleDone) {
      gsap.set([nav, '.site-nav__link'], { clearProps: 'opacity,transform' })
    } else {
      navSettleDone = true
      if (document.querySelector('.apr-splash') || safeEntrance(nav)) {
        const healNav = () => gsap.set([nav, '.site-nav__link'], { opacity: 1 })
        gsap.fromTo(
          nav,
          { opacity: 0 },
          { opacity: 1, duration: 0.12, ease: 'steps(1)', onInterrupt: healNav },
        )
        // Each link is a hard cut, filed in sequence like EDL events.
        gsap.fromTo(
          '.site-nav__link',
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.08,
            delay: 0.12,
            stagger: 0.07,
            ease: 'steps(1)',
            onInterrupt: healNav,
          },
        )
      }
    }
  }

  // ── 1 · NAMEPLATE composes: display-face specimen letters CUT in frame by frame ───
  if (!composeDone) {
    composeDone = true
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
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.06,
                ease: 'steps(1)',
                stagger: { each: 0.045, from: 'start' },
                onInterrupt: () => gsap.set(split.chars, { opacity: 1 }),
              },
            )
          }
          gsap.fromTo(
            '[data-motion="nameplate-meta"]',
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.08,
              delay: 0.4,
              stagger: 0.12,
              ease: 'steps(1)',
              onInterrupt: () => gsap.set('[data-motion="nameplate-meta"]', { opacity: 1 }),
            },
          )
        })
      })
    }
  }

  // ── 2 · IDENTITY STRIP dissolves in as one block (Marco 2026-07-07: the
  //  word-by-word snap scrub read as sloppy "loading text" — gentle whole-block
  //  dissolve, per v2).
  cut(
    '[data-motion="identity-read"]',
    { opacity: 0, y: 12 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="identity-read"]', start: 'top 85%', once: true },
    },
  )

  // ── 3 · DISPATCH BAND cuts in as a block ────────────────────────────────────
  cut(
    '[data-motion="dispatch-band"] > *',
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.08,
      stagger: 0.06,
      ease: 'steps(1)',
      scrollTrigger: { trigger: '[data-motion="dispatch-band"]', start: 'top 88%' },
    },
  )

  // ── 4 · COVER display: the film gate pulls the frame across in hard steps ───
  gsap.utils.toArray<HTMLElement>('[data-motion="cover-line"]').forEach((line, i) => {
    if (safeEntrance(line)) {
      gsap.fromTo(
        line,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.5,
          delay: i * 0.12,
          ease: 'steps(7)',
          scrollTrigger: { trigger: line, start: 'top 84%' },
          onInterrupt: () => gsap.set(line, { clipPath: 'inset(0 0% 0 0)' }),
        },
      )
    }
  })
  // Section heads: no dissolve on exit (the anti-smooth theme) — a plain cut in.
  cut(
    '[data-motion="dissolve-head"]',
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.08,
      ease: 'steps(1)',
      scrollTrigger: { trigger: '[data-motion="dissolve-head"]', start: 'top 90%' },
    },
  )
  cut(
    '[data-motion="cover-reveal"]',
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.08,
      stagger: 0.1,
      ease: 'steps(1)',
      scrollTrigger: { trigger: '[data-motion="cover-reveal"]', start: 'top 88%' },
    },
  )
  cut(
    '[data-motion="cover-plate"]',
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.1,
      ease: 'steps(1)',
      scrollTrigger: { trigger: '[data-motion="cover-plate"]', start: 'top 86%' },
    },
  )

  // ── 5 · THREE DOORS: clip bins cut into place, one bin per frame ────────────
  cut(
    '[data-motion="door"]',
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.08,
      stagger: 0.12,
      ease: 'steps(1)',
      scrollTrigger: { trigger: '[data-motion="doors"]', start: 'top 82%' },
    },
  )
  // Logos: a 2-frame snap into register (no smooth scale-settle).
  gsap.utils.toArray<HTMLElement>('[data-motion="door-logo"]').forEach((img) => {
    if (!safeEntrance(img)) return
    gsap.fromTo(
      img,
      { opacity: 0, scale: 1.12 },
      {
        opacity: 1,
        scale: 1,
        transformOrigin: 'left center',
        duration: 0.16,
        ease: 'steps(2)',
        scrollTrigger: { trigger: img, start: 'top 85%' },
        onInterrupt: () => gsap.set(img, { opacity: 1, scale: 1 }),
      },
    )
  })

  // ── 6 · THE SLATE files in: each EDL event cuts on in sequence ──────────────
  cut(
    '[data-motion="slate-row"]',
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.06,
      stagger: 0.08,
      ease: 'steps(1)',
      scrollTrigger: { trigger: '[data-motion="slate"]', start: 'top 82%' },
    },
  )

  // ── 7 · The 2 a.m. WINDOW dissolves in as one block (Marco 2026-07-07: no
  //  word-by-word snap — gentle whole-block dissolve, per v2).
  cut(
    '[data-motion="about-window"]',
    { opacity: 0, y: 12 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="about-window"]', start: 'top 85%', once: true },
    },
  )
  cut(
    '[data-motion="about-reveal"]',
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.08,
      stagger: 0.14,
      ease: 'steps(1)',
      scrollTrigger: { trigger: '[data-motion="about-reveal"]', start: 'top 86%' },
    },
  )

  // Cleanup: revert SplitText DOM so a theme switch leaves clean markup.
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

export default cuttingRoomMotion
