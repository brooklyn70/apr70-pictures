/**
 * Picture Palace (T5) motion — ILLUMINATION. The house lights come up.
 *
 * Doctrine (SPEC §2 T5 + §3): letters/elements illuminate in SEQUENCE (staggered
 * brightness), at most TWO subtle flickers on arrival, and footlight glow BLOOMS
 * on scroll arrival. Nothing auto-scrolls, loops, or tickers — every effect is a
 * one-time compose on load or a scroll-driven bloom.
 *
 * Runs INSIDE the dispatcher's reduced-motion matchMedia gate (see ./index.ts),
 * so reduced-motion collapses to the fully-lit static SSR default. Hidden/dim
 * starts are applied from JS only via EXPLICIT gsap.fromTo() (never gsap.from,
 * never a CSS pre-hide) so a dispatcher re-init can never strand an element dark;
 * onInterrupt heals any tween the re-init kills mid-illumination.
 *
 * The footlight glows read a CSS var --pp-glow (default 1 = lit without JS). We
 * bloom it 0→1 only for glow hosts that were off-screen at boot, so a late boot
 * never blinks an already-lit hero back to dark.
 */
import type { MotionApi, ThemeMotion } from './index'

type Vars = Parameters<MotionApi['gsap']['fromTo']>[2]

/* One-time-on-load guards persist across theme re-inits. */
let navSettleDone = false
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

const fontsReady: Promise<unknown> =
  typeof document !== 'undefined' && (document as Document).fonts
    ? (document as Document).fonts.ready
    : Promise.resolve()

const picturePalaceMotion: ThemeMotion = ({ gsap, SplitText }: MotionApi) => {
  const splits: Array<{ revert: () => void }> = []

  const bootedEarly =
    (typeof document !== 'undefined' && document.readyState !== 'complete') ||
    (typeof performance !== 'undefined' && performance.now() < 400)

  const inViewport = (el: Element): boolean => {
    const r = el.getBoundingClientRect()
    return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth
  }
  const safeEntrance = (el: Element): boolean => bootedEarly || !inViewport(el)

  /** Illuminate a group from dim → full, only for targets safe to start dark. */
  const illuminate = (selector: string, from: Vars, to: Vars): void => {
    const targets = gsap.utils.toArray<HTMLElement>(selector).filter(safeEntrance)
    if (targets.length) gsap.fromTo(targets, from, to)
  }

  /** Bloom a footlight glow host (animates its --pp-glow 0→1) on scroll arrival. */
  const bloom = (selector: string, trigger?: string): void => {
    gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
      if (!safeEntrance(el)) return
      gsap.fromTo(
        el,
        { '--pp-glow': 0 },
        {
          '--pp-glow': 1,
          duration: 1.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: trigger ?? el, start: 'top 85%' },
          onInterrupt: () => gsap.set(el, { '--pp-glow': 1 }),
        },
      )
    })
  }

  // ── CHROME · nav marquee cells light up in sequence ─────────────────────────
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
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: 'power2.out', onInterrupt: healNav },
        )
        gsap.fromTo(
          '.site-nav__link',
          { opacity: 0.25 },
          {
            opacity: 1,
            duration: 0.5,
            delay: 0.15,
            stagger: 0.07,
            ease: 'power2.out',
            onInterrupt: healNav,
          },
        )
      }
    }
  }

  // ── 1 · NAMEPLATE marquee: letters illuminate in sequence, then ≤2 flickers ─
  if (!composeDone) {
    composeDone = true
    const splashPresent = !!document.querySelector('.apr-splash')
    if (splashPresent || bootedEarly) {
      fontsReady.then(() => {
        afterSplash(() => {
          const lines = gsap.utils.toArray<HTMLElement>('[data-motion="nameplate-line"]')
          const wordmark = document.querySelector<HTMLElement>('.front-nameplate__wordmark')
          if (lines.length) {
            const split = new SplitText(lines, { type: 'chars' })
            splits.push(split)
            const healChars = () => gsap.set(split.chars, { opacity: 1 })
            const tl = gsap.timeline()
            // letters warm up one after another (brightness = opacity here)
            tl.fromTo(
              split.chars,
              { opacity: 0.12 },
              {
                opacity: 1,
                duration: 0.55,
                ease: 'power2.out',
                stagger: { each: 0.05, from: 'start' },
                onInterrupt: healChars,
              },
            )
            // exactly two subtle arrival flickers on the whole marquee, then steady
            if (wordmark) {
              tl.to(wordmark, { opacity: 0.62, duration: 0.06, ease: 'steps(1)' }, '+=0.15')
                .to(wordmark, { opacity: 1, duration: 0.08, ease: 'steps(1)' })
                .to(wordmark, { opacity: 0.72, duration: 0.05, ease: 'steps(1)' }, '+=0.09')
                .to(wordmark, { opacity: 1, duration: 0.1, ease: 'power1.out' })
            }
          }
          gsap.fromTo(
            '[data-motion="nameplate-meta"]',
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.7,
              delay: 0.55,
              stagger: 0.15,
              ease: 'power2.out',
              onInterrupt: () => gsap.set('[data-motion="nameplate-meta"]', { opacity: 1 }),
            },
          )
        })
      })
    }
  }
  // the marquee footlights + bulbs bloom up with the letters
  bloom('.front-nameplate')

  // ── 2 · IDENTITY STRIP develops word by word on scroll (a soft house glow) ──
  fontsReady.then(() => {
    const read = document.querySelector('[data-motion="identity-read"]')
    if (read) {
      const s = new SplitText(read, { type: 'words' })
      splits.push(s)
      gsap.fromTo(
        s.words,
        { opacity: 0.18 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: { trigger: read, start: 'top 82%', end: 'bottom 46%', scrub: true },
        },
      )
    }
  })

  // ── 3 · DISPATCH BAND lights on arrival ─────────────────────────────────────
  illuminate(
    '[data-motion="dispatch-band"] > *',
    { opacity: 0.2 },
    {
      opacity: 1,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="dispatch-band"]', start: 'top 88%' },
    },
  )

  // ── 4 · COVER: the vertical blades illuminate bottom-to-top; plate blooms ────
  gsap.utils.toArray<HTMLElement>('[data-motion="cover-line"]').forEach((line, i) => {
    if (!safeEntrance(line)) return
    gsap.fromTo(
      line,
      { opacity: 0.12 },
      {
        opacity: 1,
        duration: 0.75,
        delay: i * 0.18,
        ease: 'power2.out',
        scrollTrigger: { trigger: '[data-motion="cover"]', start: 'top 78%' },
        onInterrupt: () => gsap.set(line, { opacity: 1 }),
      },
    )
  })
  illuminate(
    '[data-motion="dissolve-head"]',
    { opacity: 0.2 },
    {
      opacity: 1,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="dissolve-head"]', start: 'top 88%' },
    },
  )
  illuminate(
    '[data-motion="cover-reveal"]',
    { opacity: 0 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="cover-reveal"]', start: 'top 88%' },
    },
  )
  illuminate(
    '[data-motion="cover-plate"]',
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="cover-plate"]', start: 'top 85%' },
    },
  )
  bloom('.front-cover__plate', '[data-motion="cover"]')

  // ── 5 · THREE DOORS: marquee cells light up in sequence ─────────────────────
  // Illuminate via BRIGHTNESS (not opacity): the door panels stay fully opaque
  // so the brass grid behind them never bleeds through mid-tween; brightening
  // is also the truer "lights coming up" metaphor. Self-heals to full on kill.
  {
    const doors = gsap.utils.toArray<HTMLElement>('[data-motion="door"]').filter(safeEntrance)
    if (doors.length) {
      gsap.fromTo(
        doors,
        { filter: 'brightness(0.45)' },
        {
          filter: 'brightness(1)',
          duration: 0.8,
          stagger: 0.14,
          ease: 'power2.out',
          scrollTrigger: { trigger: '[data-motion="doors"]', start: 'top 82%' },
          onInterrupt: () => gsap.set(doors, { filter: 'brightness(1)' }),
          onComplete: () => gsap.set(doors, { clearProps: 'filter' }),
        },
      )
    }
  }

  // ── 6 · THE SLATE programme fills the board in sequence ─────────────────────
  illuminate(
    '[data-motion="slate-row"]',
    { opacity: 0.12 },
    {
      opacity: 1,
      duration: 0.55,
      stagger: 0.09,
      ease: 'power2.out',
      scrollTrigger: { trigger: '[data-motion="slate"]', start: 'top 82%' },
    },
  )

  // ── 7 · The 2 a.m. WINDOW develops; the footlight blooms up ─────────────────
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
          scrollTrigger: { trigger: '[data-motion="about"]', start: 'top 76%', end: 'top 32%', scrub: true },
        },
      )
    }
    illuminate(
      '[data-motion="about-reveal"]',
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.9,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: '[data-motion="about-reveal"]', start: 'top 85%' },
      },
    )
  })
  bloom('.front-about', '[data-motion="about"]')

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

export default picturePalaceMotion
