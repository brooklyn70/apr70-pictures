/**
 * Trade Paper (T3) motion — the ANTI-SPECTACLE theme.
 *
 * Doctrine (SPEC §3) + the T3 contract: nothing flies, everything is filed.
 * The whole module runs INSIDE the dispatcher's reduced-motion matchMedia gate
 * (see ./index.ts), so reduced-motion collapses everything to the fully-visible
 * static SSR default. Signatures (SPEC §2 · T3):
 *   · RULES DRAW THEMSELVES — the masthead rule and the section under-bars wipe
 *     open left→right (a `scaleX` on a rule element, driven by the CSS custom
 *     property `--rule-x`, which defaults to 1 so no-JS/reduced-motion shows the
 *     finished rule).
 *   · COLUMNS SETTLE — blocks arrive with a small opacity + a few px of lift.
 *     Nothing drifts, wipes theatrically, or splits into flying characters.
 *   · NO SplitText — the paper of record does not perform.
 *
 * Reuses the screening-room.ts resilience patterns (proven): EXPLICIT
 * gsap.fromTo (never .from); a first-paint / off-screen BLINK GUARD so a late
 * idle boot never yanks visible content; onInterrupt heals to the finished
 * state when a theme switch kills a tween mid-flight.
 */
import type { MotionApi, ThemeMotion } from './index'

type Vars = Parameters<MotionApi['gsap']['fromTo']>[2]

/* One-time-on-load compose guard persists across theme re-inits. */
let composeDone = false

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

const tradePaperMotion: ThemeMotion = ({ gsap }: MotionApi) => {
  const bootedEarly =
    (typeof document !== 'undefined' && document.readyState !== 'complete') ||
    (typeof performance !== 'undefined' && performance.now() < 400)

  const inViewport = (el: Element): boolean => {
    const r = el.getBoundingClientRect()
    return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth
  }
  const safeEntrance = (el: Element): boolean => bootedEarly || !inViewport(el)

  /** Column settle — a restrained fade + small lift, explicit fromTo. */
  const settle = (selector: string, from: Vars, to: Vars): void => {
    const targets = gsap.utils.toArray<HTMLElement>(selector).filter(safeEntrance)
    if (targets.length) gsap.fromTo(targets, from, to)
  }

  /** A rule that draws itself: animate --rule-x 0→1 (a scaleX on the element's
   *  rule pseudo). Default CSS is 1, so a heal / no-JS shows the full rule. */
  const drawRule = (el: Element, opts: { scroll?: boolean; delay?: number } = {}): void => {
    if (!safeEntrance(el)) return
    const heal = () => gsap.set(el, { '--rule-x': 1 })
    gsap.fromTo(
      el,
      { '--rule-x': 0 },
      {
        '--rule-x': 1,
        duration: 0.9,
        delay: opts.delay ?? 0,
        ease: 'power2.inOut',
        onInterrupt: heal,
        ...(opts.scroll
          ? { scrollTrigger: { trigger: el as HTMLElement, start: 'top 86%' } }
          : {}),
      },
    )
  }

  // ── 1 · THE MASTHEAD settles; its rule draws itself (after the splash) ───────
  if (!composeDone) {
    composeDone = true
    const splashPresent = !!document.querySelector('.apr-splash')
    if (splashPresent || bootedEarly) {
      afterSplash(() => {
        gsap.fromTo(
          '[data-motion="nameplate-meta"]',
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.2,
            stagger: 0.12,
            ease: 'power2.out',
            onInterrupt: () => gsap.set('[data-motion="nameplate-meta"]', { opacity: 1, y: 0 }),
          },
        )
        const plate = document.querySelector('.front-nameplate')
        if (plate) drawRule(plate, { delay: 0.35 })
      })
    }
  }

  // ── 2 · IDENTITY — the justified lede simply settles (no per-word theatre) ───
  settle(
    '[data-motion="identity-read"]',
    { opacity: 0, y: 10 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="identity-read"]', start: 'top 88%' },
    },
  )

  // ── 3 · DISPATCH running-head settles ────────────────────────────────────────
  settle(
    '[data-motion="dispatch-band"] > *',
    { opacity: 0, y: 8 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.06,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="dispatch-band"]', start: 'top 92%' },
    },
  )

  // ── 4 · LEAD STORY — the column settles; the plate settles (no develop) ───────
  settle(
    '[data-motion="cover-line"]',
    { opacity: 0, y: 10 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="cover"]', start: 'top 84%' },
    },
  )
  settle(
    '[data-motion="cover-reveal"], [data-motion="cover-plate"]',
    { opacity: 0, y: 10 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="cover"]', start: 'top 82%' },
    },
  )

  // ── 5 · THREE DOORS — the column head's amber under-bar draws itself ─────────
  const doorsHead = document.querySelector('.front-doors__head')
  if (doorsHead) drawRule(doorsHead, { scroll: true })
  settle(
    '[data-motion="door"]',
    { opacity: 0, y: 12 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="doors"]', start: 'top 84%' },
    },
  )

  // ── 6 · THE SLATE — index head under-bar draws; rows file in ─────────────────
  const slateHead = document.querySelector('.front-slate__head')
  if (slateHead) drawRule(slateHead, { scroll: true })
  settle(
    '[data-motion="slate-row"]',
    { opacity: 0, y: 8 },
    {
      opacity: 1,
      y: 0,
      duration: 0.45,
      stagger: 0.06,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="slate"]', start: 'top 86%' },
    },
  )

  // ── 7 · THE LEADER COLUMN (about) settles ────────────────────────────────────
  settle(
    '[data-motion="about-window"], [data-motion="about-reveal"]',
    { opacity: 0, y: 10 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.14,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="about"]', start: 'top 84%' },
    },
  )

  // No SplitText, no scrubbed reads — nothing to revert.
  return undefined
}

export default tradePaperMotion
