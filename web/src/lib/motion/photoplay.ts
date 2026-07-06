/**
 * Photoplay (T2) motion — the picture-magazine signature.
 *
 * Doctrine (SPEC §3) + the T2 contract: motion serves reading, restrained.
 * The whole module runs INSIDE the dispatcher's reduced-motion matchMedia gate
 * (see ./index.ts), so reduced-motion collapses everything to the fully-visible
 * static SSR default. Signatures (SPEC §2 · T2):
 *   · PLATES DEVELOP LIKE PRINTS — the cover plate resolves out of an over-
 *     developed, low-opacity state (contrast/brightness settle) as you arrive.
 *   · COVER LINES STAMP IN — display lines land with a tiny rotation + scale
 *     settle (a rubber stamp), not the poster's film-gate wipe.
 *   · restrained scroll reads — the editor's-note lede and the 2 a.m. window
 *     develop word by word; nothing drifts or flies.
 *
 * Reuses the screening-room.ts resilience patterns verbatim (they are proven):
 *   · EXPLICIT gsap.fromTo (never .from) so a dispatcher re-init never strands
 *     an element at its hidden start;
 *   · a first-paint / off-screen BLINK GUARD (safeEntrance) so a late idle boot
 *     never yanks already-visible content to a hidden start;
 *   · onInterrupt heals to the final visible state when a tween is killed mid-
 *     flight by a theme switch;
 *   · SplitText DOM reverted on cleanup so a theme switch leaves clean markup.
 */
import type { MotionApi, ThemeMotion } from './index'

type Vars = Parameters<MotionApi['gsap']['fromTo']>[2]

/* One-time-on-load compose guard persists across theme re-inits (the dispatcher
   re-runs this module when the visitor toggles back to Photoplay). */
let composeDone = false

/** Run `cb` once the entrance splash (if any) has cleared. No splash → now. */
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

const photoplayMotion: ThemeMotion = ({ gsap, SplitText }: MotionApi) => {
  const splits: Array<{ revert: () => void }> = []

  const bootedEarly =
    (typeof document !== 'undefined' && document.readyState !== 'complete') ||
    (typeof performance !== 'undefined' && performance.now() < 400)

  const inViewport = (el: Element): boolean => {
    const r = el.getBoundingClientRect()
    return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth
  }
  const safeEntrance = (el: Element): boolean => bootedEarly || !inViewport(el)

  /** Group entrance — explicit fromTo, blink-guarded. */
  const entrance = (selector: string, from: Vars, to: Vars): void => {
    const targets = gsap.utils.toArray<HTMLElement>(selector).filter(safeEntrance)
    if (targets.length) gsap.fromTo(targets, from, to)
  }

  // ── 1 · NAMEPLATE stamps in (after the splash), a tiny rotation settle ──────
  if (!composeDone) {
    composeDone = true
    const splashPresent = !!document.querySelector('.apr-splash')
    if (splashPresent || bootedEarly) {
      fontsReady.then(() => {
        afterSplash(() => {
          const lines = gsap.utils.toArray<HTMLElement>('[data-motion="nameplate-line"]')
          if (lines.length) {
            gsap.fromTo(
              lines,
              { opacity: 0, scale: 1.08, rotate: -1.4, transformOrigin: 'left center' },
              {
                opacity: 1,
                scale: 1,
                rotate: 0,
                duration: 0.7,
                stagger: 0.12,
                ease: 'back.out(1.5)',
                onInterrupt: () => gsap.set(lines, { opacity: 1, scale: 1, rotate: 0 }),
              },
            )
          }
          gsap.fromTo(
            '[data-motion="nameplate-meta"]',
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay: 0.35,
              stagger: 0.14,
              ease: 'power2.out',
              onInterrupt: () => gsap.set('[data-motion="nameplate-meta"]', { opacity: 1, y: 0 }),
            },
          )
        })
      })
    }
  }

  // ── 2 · THE EDITOR'S NOTE settles in (restrained) ───────────────────────────
  // NOTE: deliberately a whole-paragraph settle, NOT a SplitText word-develop —
  // splitting the passage wraps its first word in an inline-block, which
  // detaches the CSS `::first-letter` drop cap (the editor's-note signature).
  entrance(
    '[data-motion="identity-read"]',
    { opacity: 0, y: 12 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="identity-read"]', start: 'top 86%' },
    },
  )

  // ── 3 · DISPATCH BAND settles in (restrained) ───────────────────────────────
  entrance(
    '[data-motion="dispatch-band"] > *',
    { y: 14, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.07,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="dispatch-band"]', start: 'top 90%' },
    },
  )

  // ── 4 · COVER LINES STAMP IN — rotation + scale settle (the T2 move) ─────────
  gsap.utils.toArray<HTMLElement>('[data-motion="cover-line"]').forEach((line, i) => {
    if (!safeEntrance(line)) return
    gsap.fromTo(
      line,
      { opacity: 0, scale: 1.22, rotate: i % 2 ? 2.5 : -3, transformOrigin: 'left center' },
      {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 0.7,
        delay: i * 0.12,
        ease: 'back.out(1.6)',
        onInterrupt: () => gsap.set(line, { opacity: 1, scale: 1, rotate: 0 }),
        scrollTrigger: { trigger: line, start: 'top 86%' },
      },
    )
  })
  entrance(
    '[data-motion="cover-reveal"]',
    { opacity: 0, y: 16 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="cover-reveal"]', start: 'top 88%' },
    },
  )

  // ── 5 · THE PLATE DEVELOPS LIKE A PRINT — contrast/brightness settle ────────
  gsap.utils.toArray<HTMLElement>('[data-motion="cover-plate"] .front-cover__img').forEach((img) => {
    if (!safeEntrance(img)) return
    // clearProps on land so the mode-correct CSS base filter resumes.
    const heal = () => gsap.set(img, { clearProps: 'filter,opacity' })
    gsap.fromTo(
      img,
      { opacity: 0.16, filter: 'sepia(0.85) contrast(1.7) brightness(1.45)' },
      {
        opacity: 1,
        filter: 'sepia(0.4) contrast(1.02) brightness(1.01)',
        duration: 1.15,
        ease: 'power2.out',
        onComplete: () => gsap.set(img, { clearProps: 'filter' }),
        onInterrupt: heal,
        scrollTrigger: { trigger: '[data-motion="cover-plate"]', start: 'top 85%' },
      },
    )
  })
  // the framed plate itself settles up (restrained)
  entrance(
    '[data-motion="cover-plate"]',
    { opacity: 0, y: 18 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="cover-plate"]', start: 'top 88%' },
    },
  )

  // ── 6 · THREE DOORS — plate cards rise, marks settle from oversized ──────────
  entrance(
    '[data-motion="door"]',
    { y: 34, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.75,
      stagger: 0.13,
      ease: 'power3.out',
      scrollTrigger: { trigger: '[data-motion="doors"]', start: 'top 84%' },
    },
  )
  gsap.utils.toArray<HTMLElement>('[data-motion="door-logo"]').forEach((img) => {
    if (!safeEntrance(img)) return
    gsap.fromTo(
      img,
      { scale: 1.25 },
      {
        scale: 1,
        transformOrigin: 'center',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: img, start: 'top 86%' },
      },
    )
  })

  // ── 7 · THE SLATE files in ──────────────────────────────────────────────────
  entrance(
    '[data-motion="slate-row"]',
    { x: -22, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="slate"]', start: 'top 84%' },
    },
  )

  // ── 8 · THE 2 A.M. WINDOW develops out of the dark back page ─────────────────
  fontsReady.then(() => {
    const win = document.querySelector('[data-motion="about-window"]')
    if (win) {
      const s = new SplitText(win, { type: 'words' })
      splits.push(s)
      gsap.fromTo(
        s.words,
        { opacity: 0.1 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: { trigger: '[data-motion="about"]', start: 'top 78%', end: 'top 32%', scrub: true },
        },
      )
    }
    entrance(
      '[data-motion="about-reveal"]',
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.18,
        ease: 'power2.out',
        scrollTrigger: { trigger: '[data-motion="about-reveal"]', start: 'top 86%' },
      },
    )
  })

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

export default photoplayMotion
