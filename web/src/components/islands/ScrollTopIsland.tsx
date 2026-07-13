import { useEffect, useRef, useState } from 'react'

/**
 * ScrollTopIsland (v9) — small fixed control, bottom-LEFT (mobile thumb
 * reach; the Display pill owns bottom-right). Appears after ~1.2 viewports
 * of scroll. Real <button>, keyboard focusable. Smooth scroll, except an
 * instant jump under prefers-reduced-motion. Present on every v9 page.
 * Label comes from site-settings.v9Chrome.topLabel.
 */

type Props = { label?: string | null }

export default function ScrollTopIsland({ label }: Props) {
  const [shown, setShown] = useState(false)
  const ticking = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        setShown(window.scrollY > window.innerHeight * 1.2)
        ticking.current = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  /* The arrow alone (Marco 2026-07-13). The words "Back to top" are gone from the
     face of the control — an up-arrow in the corner of a scrolled page needs no
     caption. The label survives as the ACCESSIBLE name, so screen readers and the
     tooltip still say it; the CMS still owns the wording. Never ship a bare glyph
     with no accessible name. */
  const name = label || 'Back to top'

  return (
    <button
      type="button"
      className="v9-scrolltop"
      data-shown={shown ? 'true' : 'false'}
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      aria-label={name}
      title={name}
      onClick={toTop}
    >
      <span className="v9-scrolltop__glyph" aria-hidden="true">
        &uarr;
      </span>
    </button>
  )
}
