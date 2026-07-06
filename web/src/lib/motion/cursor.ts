/**
 * Trailing-dot cursor — site-wide motion layer (v2 port, per the interaction
 * study). A 7px dot follows the pointer with a GSAP lerp. Body-wide
 * `cursor: crosshair` remains the fallback; this overlay is added ONLY on
 * fine-pointer, motion-OK devices, so touch + reduced-motion never see it (and
 * the mousemove listener is never even attached). Colour reads --accent-aware
 * --cursor-color with mix-blend-mode:difference, so it reads on every theme.
 *
 * Improvement over v2: a single `gsap.quickTo` per axis instead of a fresh
 * `gsap.to` tween per mousemove event.
 */
import type { MotionApi } from './index'

let active = false

export function initCursor({ gsap }: MotionApi): void {
  if (typeof window === 'undefined' || active) return
  if (window.matchMedia('(pointer: coarse)').matches) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  active = true

  const dot = document.createElement('div')
  dot.className = 'apr-cursor-dot'
  dot.setAttribute('aria-hidden', 'true')
  document.body.appendChild(dot)

  const xTo = gsap.quickTo(dot, 'x', { duration: 0.75, ease: 'power3.out' })
  const yTo = gsap.quickTo(dot, 'y', { duration: 0.75, ease: 'power3.out' })

  let shown = false
  const onMove = (e: MouseEvent) => {
    if (!shown) {
      shown = true
      dot.setAttribute('data-visible', 'true')
    }
    xTo(e.clientX)
    yTo(e.clientY)
  }

  window.addEventListener('mousemove', onMove, { passive: true })
}
