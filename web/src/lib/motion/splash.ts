/**
 * Logo splash intro — RULED IN by Marco (SPEC §3.6b). v2 port with the guards
 * v2 lacked:
 *   - front door only (`/`);
 *   - once per session (sessionStorage flag);
 *   - skipped entirely under prefers-reduced-motion;
 *   - injected by JS only — SSR markup never contains it, so no-JS visitors are
 *     never blocked and content is always readable underneath;
 *   - total runtime capped ≤ 2.2s (hard safety timeout);
 *   - dismissible by ANY input (pointer / key / wheel / touch).
 *
 * Sequence: logo dissolves in → 5 sprocket holes climb bottom-to-top in the
 * theme accent → blur+opacity exit reveals the page. Paints on the theme
 * surface (--bg-0) and uses the visitor's picked mark (data-logo-src).
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
  const rule = styles.getPropertyValue('--rule-strong').trim() || 'rgba(255,255,255,0.24)'

  const overlay = document.createElement('div')
  overlay.className = 'apr-splash'
  overlay.setAttribute('role', 'presentation')
  overlay.setAttribute('aria-hidden', 'true')

  const inner = document.createElement('div')
  inner.className = 'apr-splash__inner'

  const img = document.createElement('img')
  img.className = 'apr-splash__logo'
  img.src = logoSrc
  img.alt = ''

  const holesWrap = document.createElement('div')
  holesWrap.className = 'apr-splash__holes'
  const holes: HTMLElement[] = []
  for (let i = 0; i < 5; i++) {
    const h = document.createElement('span')
    h.className = 'apr-splash__hole'
    holes.push(h)
    holesWrap.appendChild(h)
  }

  inner.appendChild(img)
  inner.appendChild(holesWrap)
  overlay.appendChild(inner)
  document.body.appendChild(overlay)

  let dismissed = false
  let safety = 0
  let tl: gsap.core.Timeline

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

  gsap.set(img, { opacity: 0 })
  gsap.set(holes, { backgroundColor: 'transparent', borderColor: rule })

  tl = gsap.timeline({ onComplete: finish })
  tl.to(img, { opacity: 1, duration: 0.7, ease: 'power2.out' })
  tl.to(
    holes,
    {
      backgroundColor: accent,
      borderColor: accent,
      duration: 0.12,
      // Holes render column-reverse, so DOM order 0→4 climbs bottom-to-top.
      stagger: { each: 0.08, from: 'start' },
    },
    '-=0.15',
  )
  tl.to({}, { duration: 0.12 })
  tl.to(overlay, { opacity: 0, filter: 'blur(12px)', duration: 0.6, ease: 'power3.in' })

  // Hard cap: no matter what, the splash is gone by 2.2s.
  safety = window.setTimeout(finish, 2200)
}
