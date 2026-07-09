/**
 * Logo splash intro — RULED IN by Marco (SPEC §3.6b), now a faithful port of
 * the v2 site's opening animation (APR_70/src/components/LogoReveal.tsx),
 * per Marco's ruling that the intro be "pulled directly from v2".
 *
 * The v2 timeline, beat for beat:
 *   1. DISSOLVE IN  — the mark fades 0→1 over 0.8s (power2.out), hold 0.3s.
 *      Sprocket holes start transparent so the wordmark arrives unperforated.
 *   2. SPROCKET ELEVATOR — the mark's hole pairs light bottom-to-top, one
 *      pair every 0.08s+0.1s, each pair in a DIVISION color (v2 PAIR_COLORS):
 *      212 Sicilian Orange → 310 Sicilian Blue → 310 IMAX teal → 212 Amber →
 *      white (here: --fg-1, so the final beat reads in light mode too).
 *      Hold 0.2s.
 *   3. CINEMATIC BLUR OUT — blur(12px) + fade over 0.8s (power3.in), then a
 *      200ms beat before teardown reveals the page.
 *   Safety timeout: 8s hard cap (v2's), set before any async work.
 *
 * Guards v2 lacked, kept verbatim from the previous splash:
 *   - front door only (`/`);
 *   - once per session (sessionStorage flag);
 *   - skipped entirely under prefers-reduced-motion;
 *   - injected by JS only — SSR markup never contains it, so no-JS visitors
 *     are never blocked and content is always readable underneath;
 *   - dismissible by ANY input (pointer / key / wheel / touch).
 *
 * The elevator lights the logo's ACTUAL sprocket-hole geometry (not a
 * synthetic column beside it): the visitor's picked mark (data-logo-src on
 * <html>, set pre-paint and already mode-correct for the current data-theme)
 * is fetched + inlined; every `<rect rx="...">` in these marks IS a sprocket
 * hole (wordmark/background never carry `rx` — a stable discriminator across
 * every variant in public/logos/). Holes group into rows by y so mirrored
 * left/right pairs light together, largest y (bottom) first — exactly v2's
 * HOLE_PAIRS order. If the fetch/parse fails, falls back to a plain <img>
 * (dissolve + blur only, no elevator) rather than erroring.
 *
 * Overlay paints on the theme surface (--bg-0); base .apr-splash layout CSS
 * lives in tokens.css. The v2 sizing (wrapper clamp(220px, 60vw, 1000px),
 * mark at 85% of it) is injected as a <style> tag here and fully removed on
 * teardown, keeping this port one-file.
 */
import type { MotionApi } from './index'

const SESSION_KEY = 'apr70:splash-shown'
const STYLE_ID = 'apr-splash-v2-style'

export function maybeRunSplash({ gsap }: MotionApi): void {
  if (typeof window === 'undefined') return
  if (window.location.pathname !== '/') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return
    sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    /* sessionStorage blocked (private mode): allow this one view. */
  }

  const doc = document.documentElement
  const styles = getComputedStyle(doc)
  const logoSrc = doc.getAttribute('data-logo-src') || '/favicon.svg'
  const token = (name: string, fallback: string) =>
    styles.getPropertyValue(name).trim() || fallback

  // v2 PAIR_COLORS, resolved from the division tokens (tokens.css) with the
  // exact v2 hexes as fallbacks. Bottom pair first. The fifth beat was white
  // in v2 (black-bg only); --fg-1 is that same white in dark mode and stays
  // legible on the light surface.
  const pairColors = [
    token('--apr-orange', '#E85D04'), // 212 Sicilian Orange
    token('--apr-blue', '#0077B6'), //   310 Sicilian Blue
    token('--apr-imax', '#077082'), //   310 IMAX teal
    token('--apr-amber', '#824B07'), //  212 Amber
    token('--fg-1', '#ffffff'), //       white (v2) / theme foreground
  ]

  // v2 wrapper sizing: clamp(220px, 60vw, 1000px) with the mark at 85% of it.
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = [
    `.apr-splash__inner{width:clamp(220px,60vw,1000px);}`,
    `.apr-splash__logo{width:85%;height:auto;max-height:60vh;}`,
  ].join('\n')
  document.head.appendChild(style)

  const overlay = document.createElement('div')
  overlay.className = 'apr-splash'
  overlay.setAttribute('role', 'presentation')
  overlay.setAttribute('aria-hidden', 'true')

  const inner = document.createElement('div')
  inner.className = 'apr-splash__inner'
  overlay.appendChild(inner)
  document.body.appendChild(overlay)

  let dismissed = false
  let safety = 0
  let tl: gsap.core.Timeline | null = null

  const removeDismiss = () => {
    window.removeEventListener('pointerdown', onInput)
    window.removeEventListener('keydown', onInput)
    window.removeEventListener('wheel', onInput)
    window.removeEventListener('touchstart', onInput)
  }
  const finish = () => {
    if (dismissed) return
    dismissed = true
    if (safety) window.clearTimeout(safety)
    tl?.kill()
    overlay.remove()
    style.remove()
    removeDismiss()
  }
  function onInput() {
    finish()
  }

  window.addEventListener('pointerdown', onInput, { passive: true })
  window.addEventListener('keydown', onInput)
  window.addEventListener('wheel', onInput, { passive: true })
  window.addEventListener('touchstart', onInput, { passive: true })

  // Hard cap: no matter what (including a stalled logo fetch below), the
  // splash is gone by 8s — v2's safety timer. Set immediately, before any
  // async work, so it holds even if the fetch never resolves.
  safety = window.setTimeout(finish, 8000)

  void loadLogo()

  /** Fetch + inline the picked mark so we can animate its real hole rects.
   *  Falls back to a plain <img> (no elevator) on any failure. */
  async function loadLogo(): Promise<void> {
    let logoEl: HTMLElement | SVGElement
    let holeRows: Element[][] = []

    try {
      const res = await fetch(logoSrc)
      if (!res.ok) throw new Error(`logo fetch failed: ${res.status}`)
      const text = await res.text()
      const parsed = new DOMParser().parseFromString(text, 'image/svg+xml')
      const svg = parsed.querySelector('svg')
      if (!svg || parsed.querySelector('parsererror')) throw new Error('bad svg markup')

      const inlined = document.importNode(svg, true)
      inlined.classList.add('apr-splash__logo')
      inlined.setAttribute('aria-hidden', 'true')
      inlined.removeAttribute('width')
      inlined.removeAttribute('height')
      logoEl = inlined

      // Every hole rect in these marks carries `rx` (rounded perforation
      // corner); the wordmark/background never do — a stable discriminator
      // across every logo family (full 480x160 / primary 320x100 / any ink).
      const holes = Array.from(inlined.querySelectorAll('rect[rx]'))
      const rows = new Map<string, Element[]>()
      holes.forEach((hole) => {
        const y = hole.getAttribute('y') || '0'
        const row = rows.get(y)
        if (row) row.push(hole)
        else rows.set(y, [hole])
      })
      // Largest y (bottom of the mark, SVG y-down) lights first — v2's
      // HOLE_PAIRS order.
      holeRows = Array.from(rows.entries())
        .sort(([a], [b]) => parseFloat(b) - parseFloat(a))
        .map(([, els]) => els)

      // v2 beat 0: all holes start transparent so the dissolve-in shows the
      // unlit strip; the elevator then fills them in division colors.
      holes.forEach((hole) => hole.setAttribute('fill', 'transparent'))
    } catch {
      const img = document.createElement('img')
      img.className = 'apr-splash__logo'
      img.src = logoSrc
      img.alt = ''
      logoEl = img
    }

    // The visitor may have already dismissed (input fired) while we awaited.
    if (dismissed) return
    inner.appendChild(logoEl)

    gsap.set(logoEl, { opacity: 0, filter: 'blur(0px)' })
    tl = gsap.timeline({
      onComplete: () => {
        // v2 held 200ms on black after the blur before handing off.
        window.setTimeout(finish, 200)
      },
    })

    // Phase 1: dissolve in.
    tl.to(logoEl, { opacity: 1, duration: 0.8, ease: 'power2.out' })
    tl.to({}, { duration: 0.3 })

    // Phase 2: sprocket elevator — bottom to top, one division color per
    // pair (cycled if a mark carries more rows than v2's five).
    holeRows.forEach((row, i) => {
      const color = pairColors[i % pairColors.length]
      tl!.to(
        {},
        {
          duration: 0.1,
          onStart: () => {
            row.forEach((hole) => hole.setAttribute('fill', color))
          },
        },
        '+=0.08',
      )
    })

    tl.to({}, { duration: 0.2 })

    // Phase 3: cinematic blur out — reveals the page underneath.
    tl.to(overlay, {
      filter: 'blur(12px)',
      opacity: 0,
      duration: 0.8,
      ease: 'power3.in',
    })
  }
}
