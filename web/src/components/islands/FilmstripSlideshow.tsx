import './filmstrip-slideshow.css'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * FilmstripSlideshow (v9) — one frame at a time on the film stock. Used by
 * moodGrid sections (slideshow: true) and the property galleries.
 *
 * Progressive enhancement: the SSR pass (and any visitor without JS) gets the
 * plain v9-framegrid; after mount the same items re-render as the filmstrip.
 * Inline it never autoplays; the v13 CINEMA VIEW (expand button, or click the
 * middle of the picture) is the one place a slideshow can be switched on —
 * full browser width, PLAY advances every 4.5s, any manual move stops it,
 * ESC or the close button exits. Arrow keys work while the region has focus; touch swipes
 * via pointer events; under prefers-reduced-motion transitions are cuts
 * (handled in CSS — the .v9 reduced-motion rule zeroes the fade).
 *
 * FOUR WAYS TO ADVANCE, all the same action: the arrows under the frame, the
 * dots, arrow keys, and — since 2026-07-13 — clicking the left or right SIDE of
 * the picture itself. A swipe covers touch.
 *
 * The frame renders at the PICTURE'S OWN ASPECT, capped to the window (see
 * filmstrip-slideshow.css) — no letterbox bed, no rails; the film-stock chrome
 * was retired 2026-07-13 (v12, "no cookie cutter"). The whole picture is always
 * visible and always fits on screen. That is a local exception to the
 * crop-to-box law, which governs GRIDS; this is the one surface where a visitor
 * looks at a single picture properly.
 */

export type FilmstripItem = {
  src: string
  srcset?: string
  width?: number
  height?: number
  alt: string
  caption?: string | null
  captionHtml?: string | null
  credit?: string | null
  wide?: boolean | null
  focalX?: number | null
  focalY?: number | null
}

const SIZES_GRID = '(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw'
const SIZES_STAGE = '(max-width: 900px) 100vw, 900px'

type Props = {
  items: FilmstripItem[]
  /** Accessible name for the region (e.g. "Development frames · Sea Gate"). */
  label: string
}

const focalPos = (it: FilmstripItem) =>
  `${typeof it.focalX === 'number' ? it.focalX : 50}% ${typeof it.focalY === 'number' ? it.focalY : 50}%`

/* AI mark (v13): the caption/credit disclosure line is the single source of
   truth for whether a frame is machine-generated. See isAiFrameText in
   ../v9/media.ts — duplicated here because the island must stay self-contained
   for hydration. Keep the regex in lockstep. */
const isAi = (it: FilmstripItem) =>
  /ai[\s-]?generated/i.test(`${it.caption ?? ''} ${it.captionHtml ?? ''} ${it.credit ?? ''}`)

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
  /* v13 cinema view: an overlay at full browser WIDTH (not the Fullscreen
     API — Marco 2026-07-18: "not full screen, but at least browser width"),
     with the one optional slideshow (autoplay) the site has. */
  const [cinema, setCinema] = useState(false)
  const [playing, setPlaying] = useState(false)
  const touch = useRef<{ id: number; x: number } | null>(null)
  const expandRef = useRef<HTMLButtonElement | null>(null)
  const cinemaRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (items.length > 1) setEnhanced(true)
  }, [items.length])

  /* The slideshow proper. Only runs in cinema; any manual move stops it. */
  useEffect(() => {
    if (!playing || !cinema) return
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length)
    }, 4500)
    return () => window.clearInterval(t)
  }, [playing, cinema, items.length])

  /* Cinema chrome: scroll lock, window-level keys (the overlay may not hold
     focus), focus in on open / back to the expand button on close. */
  useEffect(() => {
    if (!cinema) return
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    cinemaRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPlaying(false)
        setCinema(false)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setPlaying(false)
        setIndex((i) => (i + 1) % items.length)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setPlaying(false)
        setIndex((i) => (i - 1 + items.length) % items.length)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      expandRef.current?.focus()
    }
  }, [cinema, items.length])

  if (!items.length) return null

  const count = items.length
  const go = (next: number) => setIndex(((next % count) + count) % count)
  const manualGo = (next: number) => {
    setPlaying(false)
    go(next)
  }
  const openCinema = () => setCinema(true)
  const closeCinema = () => {
    setPlaying(false)
    setCinema(false)
  }

  /* No-JS / SSR / single-frame form: the plain grid. */
  if (!enhanced) {
    return (
      <div className="v9-framegrid" aria-label={label}>
        {items.map((it, i) => (
          <figure key={i} className={it.wide ? 'v9-frame v9-frame--wide' : 'v9-frame'}>
            <div className="v9-frame__box" data-ai-frame={isAi(it) ? 'true' : undefined}>
              <img
                src={it.src}
                srcSet={it.srcset}
                sizes={SIZES_GRID}
                width={it.width}
                height={it.height}
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
    if (cinema) return // the window-level handler owns the keys while open
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
  const onPointerUpCinema = (e: React.PointerEvent) => {
    const t = touch.current
    if (!t || t.id !== e.pointerId) return
    touch.current = null
    const dx = e.clientX - t.x
    if (Math.abs(dx) > 40) manualGo(index + (dx < 0 ? 1 : -1))
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
            data-ai-frame={isAi(it) ? 'true' : undefined}
            aria-hidden={i !== index}
          >
            {/* Natural aspect, no crop — objectPosition would be inert here. */}
            <img
              src={it.src}
              srcSet={it.srcset}
              sizes={SIZES_STAGE}
              width={it.width}
              height={it.height}
              alt={it.alt}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
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
        {/* v13: the middle third — previously "left alone" — now opens the
            cinema view. The labeled expand button below is the accessible
            path; this is the mouse affordance (cursor: zoom-in). */}
        <button
          type="button"
          className="fs__zone fs__zone--open"
          tabIndex={-1}
          aria-hidden="true"
          onClick={openCinema}
        />
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
          <button
            type="button"
            ref={expandRef}
            className="fs__btn fs__btn--expand"
            aria-label="Open cinema view"
            aria-haspopup="dialog"
            onClick={openCinema}
          >
            &#x2922;
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

      {cinema &&
        createPortal(
          <div
            className="fs-cinema"
            role="dialog"
            aria-modal="true"
            aria-label={label}
            ref={cinemaRef}
            tabIndex={-1}
          >
            <div
              className="fs-cinema__stage"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUpCinema}
              onPointerCancel={() => (touch.current = null)}
            >
              {items.map((it, i) => (
                <div
                  key={i}
                  className="fs-cinema__slide"
                  data-active={i === index ? 'true' : undefined}
                  data-ai-frame={isAi(it) ? 'true' : undefined}
                  aria-hidden={i !== index}
                >
                  <img
                    src={it.src}
                    srcSet={it.srcset}
                    sizes="100vw"
                    width={it.width}
                    height={it.height}
                    alt={it.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
              <button
                type="button"
                className="fs__zone fs__zone--prev"
                tabIndex={-1}
                aria-hidden="true"
                onClick={() => manualGo(index - 1)}
              />
              <button
                type="button"
                className="fs__zone fs__zone--next"
                tabIndex={-1}
                aria-hidden="true"
                onClick={() => manualGo(index + 1)}
              />
            </div>

            <div className="fs-cinema__bar">
              <div className="fs__nav">
                <button
                  type="button"
                  className="fs__btn"
                  aria-label="Previous frame"
                  onClick={() => manualGo(index - 1)}
                >
                  &larr;
                </button>
                <button
                  type="button"
                  className="fs__btn"
                  aria-label="Next frame"
                  onClick={() => manualGo(index + 1)}
                >
                  &rarr;
                </button>
                <button
                  type="button"
                  className="fs__btn fs__btn--play"
                  aria-pressed={playing}
                  onClick={() => setPlaying((p) => !p)}
                >
                  {playing ? 'Pause' : 'Play'}
                </button>
              </div>
              <span className="fs__counter" aria-live="polite">
                {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
              </span>
              <div className="fs__caption">
                <Capline item={active} />
              </div>
              <button
                type="button"
                className="fs__btn fs-cinema__close"
                aria-label="Close cinema view"
                onClick={closeCinema}
              >
                &times;
              </button>
            </div>
          </div>,
          document.body,
        )}
    </section>
  )
}
