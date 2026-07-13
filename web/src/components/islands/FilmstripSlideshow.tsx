import './filmstrip-slideshow.css'

import { useEffect, useRef, useState } from 'react'

/**
 * FilmstripSlideshow (v9) — one frame at a time on the film stock. Used by
 * moodGrid sections (slideshow: true) and the property galleries.
 *
 * Progressive enhancement: the SSR pass (and any visitor without JS) gets the
 * plain v9-framegrid; after mount the same items re-render as the filmstrip.
 * Never autoplays. Arrow keys work while the region has focus; touch swipes
 * via pointer events; under prefers-reduced-motion transitions are cuts
 * (handled in CSS — the .v9 reduced-motion rule zeroes the fade).
 *
 * FOUR WAYS TO ADVANCE, all the same action: the arrows under the frame, the
 * dots, arrow keys, and — since 2026-07-13 — clicking the left or right SIDE of
 * the picture itself. A swipe covers touch.
 *
 * The frame is CONTAINED and capped to the window (see filmstrip-slideshow.css):
 * the whole picture is always visible and always fits on screen. That is a local
 * exception to the crop-to-box law, which governs GRIDS; this is the one surface
 * where a visitor looks at a single picture properly. The rails are unpunched —
 * the sprocket holes were retired 2026-07-13.
 */

export type FilmstripItem = {
  src: string
  alt: string
  caption?: string | null
  captionHtml?: string | null
  credit?: string | null
  wide?: boolean | null
  focalX?: number | null
  focalY?: number | null
}

type Props = {
  items: FilmstripItem[]
  /** Accessible name for the region (e.g. "Development frames · Sea Gate"). */
  label: string
}

const focalPos = (it: FilmstripItem) =>
  `${typeof it.focalX === 'number' ? it.focalX : 50}% ${typeof it.focalY === 'number' ? it.focalY : 50}%`

function Capline({ item }: { item: FilmstripItem }) {
  if (!item.caption && !item.captionHtml && !item.credit) return null
  return (
    <span className="v9-capline">
      {item.captionHtml ? (
        <span dangerouslySetInnerHTML={{ __html: item.captionHtml }} />
      ) : (
        <span>{item.caption}</span>
      )}
      {item.credit ? <span className="v9-capline__credit">{item.credit}</span> : null}
    </span>
  )
}

export default function FilmstripSlideshow({ items, label }: Props) {
  const [enhanced, setEnhanced] = useState(false)
  const [index, setIndex] = useState(0)
  const touch = useRef<{ id: number; x: number } | null>(null)

  useEffect(() => {
    if (items.length > 1) setEnhanced(true)
  }, [items.length])

  if (!items.length) return null

  const count = items.length
  const go = (next: number) => setIndex(((next % count) + count) % count)

  /* No-JS / SSR / single-frame form: the plain grid. */
  if (!enhanced) {
    return (
      <div className="v9-framegrid" aria-label={label}>
        {items.map((it, i) => (
          <figure key={i} className={it.wide ? 'v9-frame v9-frame--wide' : 'v9-frame'}>
            <div className="v9-frame__box">
              <img
                src={it.src}
                alt={it.alt}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: focalPos(it) }}
              />
            </div>
            <figcaption>
              <Capline item={it} />
            </figcaption>
          </figure>
        ))}
      </div>
    )
  }

  const active = items[index]

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(index + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(index - 1)
    }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return
    touch.current = { id: e.pointerId, x: e.clientX }
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const t = touch.current
    if (!t || t.id !== e.pointerId) return
    touch.current = null
    const dx = e.clientX - t.x
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1))
  }

  return (
    <section
      className="fs"
      role="group"
      aria-roledescription="slideshow"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className="fs__stock">
        <div className="fs__rail" aria-hidden="true" />
        <div
          className="fs__viewport"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (touch.current = null)}
        >
          {items.map((it, i) => (
            <div
              key={i}
              className="fs__slide"
              data-active={i === index ? 'true' : undefined}
              aria-hidden={i !== index}
            >
              <img
                src={it.src}
                alt={it.alt}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                style={{ objectPosition: focalPos(it) }}
              />
            </div>
          ))}

          {/* Click the sides of the picture to advance (Marco 2026-07-13).
              aria-hidden: the arrows below already expose these two actions to
              keyboard and screen-reader users; these zones are the mouse
              affordance for the same thing, and announcing them twice is noise. */}
          <button
            type="button"
            className="fs__zone fs__zone--prev"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => go(index - 1)}
          />
          <button
            type="button"
            className="fs__zone fs__zone--next"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => go(index + 1)}
          />
        </div>
        <div className="fs__rail" aria-hidden="true" />
      </div>

      <div className="fs__bar">
        <div className="fs__nav">
          <button
            type="button"
            className="fs__btn"
            aria-label="Previous frame"
            onClick={() => go(index - 1)}
          >
            &larr;
          </button>
          <button
            type="button"
            className="fs__btn"
            aria-label="Next frame"
            onClick={() => go(index + 1)}
          >
            &rarr;
          </button>
        </div>
        <span className="fs__counter" aria-live="polite">
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
        <div className="fs__caption">
          <Capline item={active} />
        </div>
      </div>

      <div className="fs__dots" role="tablist" aria-label="Frames">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            className="fs__dot"
            aria-label={`Frame ${i + 1}`}
            aria-current={i === index ? 'true' : undefined}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </section>
  )
}
