/**
 * Logo splash intro — RULED IN by Marco (SPEC §3.6b). v2 port with the guards
 * v2 lacked:
 *   - front door only (`/`);
 *   - once per session (sessionStorage flag);
 *   - skipped entirely under prefers-reduced-motion;
 *   - injected by JS only — SSR markup never contains it, so no-JS visitors are
 *     never blocked and content is always readable underneath;
 *   - total runtime capped ≤ 2.2s (hard safety timeout, set before any async
 *     work so it holds even if the logo fetch below stalls);
 *   - dismissible by ANY input (pointer / key / wheel / touch).
 *
 * Sequence: the visitor's picked brand mark dissolves in → its OWN sprocket
 * holes climb bottom-to-top in the theme accent → blur+opacity exit reveals
 * the page. Paints on the theme surface (--bg-0).
 *
 * The climb lights the logo's ACTUAL sprocket-hole geometry (not a synthetic
 * column beside it): the SVG is fetched + inlined, every `<rect rx="...">` in
 * it IS a sprocket hole (the wordmark/background use `<text>`/plain `<rect>`
 * with no `rx` — a stable discriminator across every mark variant in
 * public/logos/, full or primary, whatever the visitor has picked). Holes are
 * grouped into rows by their y position so a mirrored left/right pair lights
 * together, then rows climb bottom-to-top. No duplicate/floating hole column.
 * If the fetch/parse ever fails, this falls back to a plain <img> (fade +
 * dissolve only, no climb) rather than erroring or duplicating anything.
 */
import type { MotionApi } from './index'

const SESSION_KEY = 'apr70:splash-shown'

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
  const logoSrc = doc.getAttribute('data-logo-src') || '/logos/apr70_logo_full_white.svg'
  const accent = styles.getPropertyValue('--accent').trim() || '#E85D04'

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
  // splash is gone by 2.2s. Set immediately — independent of the async load.
  safety = window.setTimeout(finish, 2200)

  void loadLogo()

  /** Fetch + inline the picked mark so we can animate its real hole rects.
   *  Falls back to a plain <img> (no climb) on any failure. */
  async function loadLogo(): Promise<void> {
    let logoEl: Element
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
      // Largest y (bottom of the mark, SVG y-down) climbs first.
      holeRows = Array.from(rows.entries())
        .sort(([a], [b]) => parseFloat(b) - parseFloat(a))
        .map(([, els]) => els)
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

    gsap.set(logoEl, { opacity: 0 })
    tl = gsap.timeline({ onComplete: finish })
    tl.to(logoEl, { opacity: 1, duration: 0.7, ease: 'power2.out' })

    holeRows.forEach((row, i) => {
      tl!.to(
        row,
        { attr: { fill: accent }, duration: 0.12 },
        i === 0 ? '-=0.15' : '<+=0.08',
      )
    })

    tl.to({}, { duration: 0.12 })
    tl.to(overlay, { opacity: 0, filter: 'blur(12px)', duration: 0.6, ease: 'power3.in' })
  }
}
