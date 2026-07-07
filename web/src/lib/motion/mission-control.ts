/**
 * Mission Control (T5 · Direction F) motion — TELEMETRY SETTLE.
 *
 * Doctrine (SPEC §3): motion serves reading. Mission Control's signature is
 * CALM: short, even, one-time staggered rises — telemetry settling into place.
 * No scrubbing, no character composes, no film-gate wipes, no loops, no drift.
 * The stillness IS the design. The whole module runs INSIDE the dispatcher's
 * `gsap.matchMedia('(prefers-reduced-motion: no-preference)')` gate (see
 * ./index.ts), so reduced-motion collapses everything to the fully-visible
 * static SSR default — no exceptions.
 *
 * CRITICAL (SPEC §3.5): the SSR / no-JS default is fully visible, static
 * content. Hidden/offset starts are applied from JS ONLY, right before
 * animating, via EXPLICIT `gsap.fromTo()` (never a CSS pre-hide, never a bare
 * `gsap.from()` whose captured end-state a dispatcher re-init could strand at a
 * hidden value). `fromTo` pins the end, so entrances always resolve.
 *
 * BLINK GUARD (mirrors screening-room.ts): the motion layer boots via
 * requestIdleCallback (~600ms after paint), so snapping already-VISIBLE content
 * to a hidden start would flash. `safeEntrance()` only runs a snap-to-hidden
 * entrance for an element off-screen at boot, or when we booted within the first
 * paint window. Below-fold ScrollTrigger entrances are unaffected — they play on
 * scroll-in. Blocks expose stable `data-motion` hooks; this module selects them.
 *
 * Choreography mirrors the approved mockup
 * (design-source/directions/direction-f-mission-control.html), "telemetry settle":
 *   nav settles down · nameplate + meta rise once (after the splash) · identity
 *   passage settles as one calm block · dispatch panel rises · cover lines +
 *   deck + plate settle · doors stagger-rise, logos settle · slate rows file in ·
 *   about window + close settle. Every move is the SAME even power2.out rise.
 */
import type { MotionApi, ThemeMotion } from './index'

type Vars = Parameters<MotionApi['gsap']['fromTo']>[2]

/* One-time-on-load guards persist across theme re-inits (the dispatcher re-runs
   this module when the visitor toggles back to Mission Control). Scroll-triggered
   pieces are safe to recreate; on-load settles must not re-fire. */
let navSettleDone = false
let composeDone = false

/** Run `cb` once the entrance splash (if any) has cleared. The splash is a
 *  JS-injected `.apr-splash` overlay (front door, once per session, ≤2.2s).
 *  We never touch splash.ts; we simply wait for its element to be removed so the
 *  nameplate settles as the splash blurs out. No splash → run immediately. */
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
  // Safety: the splash hard-caps at 2.2s; settle no later than 2.6s regardless.
  const safety = window.setTimeout(run, 2600)
}

const fontsReady: Promise<unknown> =
  typeof document !== 'undefined' && (document as Document).fonts
    ? (document as Document).fonts.ready
    : Promise.resolve()

const missionControlMotion: ThemeMotion = ({ gsap }: MotionApi) => {
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

  /** The telemetry-settle primitive: an even, one-time rise on scroll-in. */
  const settle = (
    selector: string,
    opts: { y?: number; duration?: number; stagger?: number; start?: string; trigger?: string } = {},
  ): void => {
    const { y = 16, duration = 0.55, stagger = 0.08, start = 'top 86%', trigger } = opts
    entrance(
      selector,
      { y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration,
        stagger,
        ease: 'power2.out',
        scrollTrigger: { trigger: trigger || selector, start },
      },
    )
  }

  // ── CHROME — one-time nav settle ────────────────────────────────────────────
  // RESILIENCE (mirrors screening-room.ts): the dispatcher re-inits this module
  // on a data-design change and kills/reverts in-flight tweens, which can strand
  // a nav-link stagger partway. Guards: (a) `onInterrupt` snaps to the final
  // visible state if killed mid-flight; (b) on a re-init (navSettleDone already
  // set) we clear any stranded inline state so the chrome is unconditionally
  // visible. (SiteNav also keeps its own 2s safety net.)
  const nav = document.querySelector('.site-nav')
  if (nav) {
    if (navSettleDone) {
      gsap.set([nav, '.site-nav__link'], { clearProps: 'opacity,transform' })
    } else {
      navSettleDone = true
      if (document.querySelector('.apr-splash') || safeEntrance(nav)) {
        const healNav = () => gsap.set([nav, '.site-nav__link'], { opacity: 1, y: 0 })
        gsap.fromTo(
          nav,
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', onInterrupt: healNav },
        )
        gsap.fromTo(
          '.site-nav__link',
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.45, delay: 0.08, stagger: 0.05, ease: 'power2.out', onInterrupt: healNav },
        )
      }
    }
  }

  // ── 1 · NAMEPLATE settles once, after the splash (rise, not char-compose) ────
  if (!composeDone) {
    composeDone = true
    const splashPresent = !!document.querySelector('.apr-splash')
    if (splashPresent || bootedEarly) {
      fontsReady.then(() => {
        afterSplash(() => {
          const healLines = () => gsap.set('[data-motion="nameplate-line"]', { opacity: 1, y: 0 })
          gsap.fromTo(
            '[data-motion="nameplate-line"]',
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.09, ease: 'power2.out', onInterrupt: healLines },
          )
          gsap.fromTo(
            '[data-motion="nameplate-meta"]',
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: 0.35,
              stagger: 0.12,
              ease: 'power2.out',
              onInterrupt: () => gsap.set('[data-motion="nameplate-meta"]', { opacity: 1, y: 0 }),
            },
          )
        })
      })
    }
  }

  // ── 2 · IDENTITY STRIP settles as one calm block (no word scrub) ─────────────
  settle('[data-motion="identity-read"]', { y: 14, duration: 0.6, start: 'top 84%' })

  // ── 3 · DISPATCH panel rises into place ──────────────────────────────────────
  settle('[data-motion="dispatch-band"]', { y: 18, duration: 0.6, start: 'top 88%' })

  // ── 4 · COVER: display lines + deck + plate settle (no gate-wipe, no drift) ──
  settle('[data-motion="cover-line"]', { y: 20, duration: 0.6, stagger: 0.1, start: 'top 84%', trigger: '[data-motion="cover"]' })
  settle('[data-motion="cover-reveal"]', { y: 18, duration: 0.6, stagger: 0.1, start: 'top 88%' })
  entrance(
    '[data-motion="cover-plate"]',
    { opacity: 0, y: 22 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="cover-plate"]', start: 'top 86%' },
    },
  )

  // ── 5 · THREE DOORS stagger-rise; logos settle (no oversized-scale snap) ─────
  settle('[data-motion="door"]', { y: 22, duration: 0.6, stagger: 0.1, start: 'top 84%', trigger: '[data-motion="doors"]' })
  entrance(
    '[data-motion="door-logo"]',
    { opacity: 0, y: 10 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="doors"]', start: 'top 82%' },
    },
  )

  // ── 6 · THE SLATE files in: rows settle one after another ────────────────────
  settle('[data-motion="slate-row"]', { y: 12, duration: 0.45, stagger: 0.06, start: 'top 86%', trigger: '[data-motion="slate"]' })

  // ── 7 · The 2 a.m. WINDOW + close settle in (no word develop) ────────────────
  settle('[data-motion="about-window"]', { y: 16, duration: 0.7, start: 'top 82%', trigger: '[data-motion="about"]' })
  settle('[data-motion="about-reveal"]', { y: 16, duration: 0.7, stagger: 0.14, start: 'top 85%' })

  // No SplitText DOM to revert; the dispatcher kills the ScrollTriggers and
  // reverts the matchMedia scope on a theme switch. Nothing else to clean up.
}

export default missionControlMotion
