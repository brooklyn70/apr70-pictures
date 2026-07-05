import './theme-control.css'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DESIGNS,
  DEFAULT_DESIGN,
  designThemeMode,
  resolveDesign,
  type DesignSlug,
} from '../../designs/manifest'
import {
  LOGO_OPTIONS,
  DEFAULT_LOGO,
  resolveLogo,
  logoSrc,
  type LogoChoiceId,
} from '../../designs/logos'

/**
 * ThemeControlIsland — the single moveable "Display" dropdown.
 * Global chrome (mounted from Layout.astro, client:load — NOT a Payload block).
 *
 * Three sections in one panel: design picker, logo picker, type size.
 * Draggable (pointer capture, clamped to viewport), collapsible to a pill.
 *
 * localStorage: apr70:design | apr70:logo | apr70:font-scale | apr70:picker-pos
 * The matching pre-paint script lives in Layout.astro <head> (no-FOUC stamp).
 */

const KEY_DESIGN = 'apr70:design'
const KEY_LOGO = 'apr70:logo'
const KEY_SCALE = 'apr70:font-scale'
const KEY_POS = 'apr70:picker-pos'

const FONT_SCALES = [
  { id: 's', label: 'S', value: '0.9' },
  { id: 'm', label: 'M', value: '1' },
  { id: 'l', label: 'L', value: '1.1' },
  { id: 'xl', label: 'XL', value: '1.2' },
] as const
type FontScaleId = (typeof FONT_SCALES)[number]['id']

const EDGE = 8

function storageGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function storageSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* private mode etc — selection still applies for this page view */
  }
}

function resolveScale(value: unknown): FontScaleId {
  return FONT_SCALES.some((f) => f.id === value) ? (value as FontScaleId) : 'm'
}

/** Push the resolved brand-mark src into <html> + every swappable header img. */
function syncBrandMark(logo: LogoChoiceId, mode: 'light' | 'dark') {
  const src = logoSrc(logo, mode)
  const doc = document.documentElement
  doc.setAttribute('data-logo', logo)
  doc.setAttribute('data-logo-src', src)
  document.querySelectorAll<HTMLImageElement>('img[data-brand-wordmark]').forEach((img) => {
    if (img.getAttribute('src') !== src) img.setAttribute('src', src)
  })
}

type Pos = { x: number; y: number }

export default function ThemeControlIsland() {
  const [open, setOpen] = useState(false)
  /* Defaults on BOTH server and first client render — reading the <html>
     attributes in the initializer forked the trees (pill swatch styles) and
     broke hydration on non-default designs. The mount effect below syncs
     state to the pre-paint stamp. */
  const [design, setDesign] = useState<DesignSlug>(DEFAULT_DESIGN)
  const [logo, setLogo] = useState<LogoChoiceId>(DEFAULT_LOGO)
  const [scale, setScale] = useState<FontScaleId>('m')
  /** null = default CSS anchor (bottom-right). Set once dragged / restored. */
  const [pos, setPos] = useState<Pos | null>(null)

  /* Adopt the visitor's persisted choices (stamped pre-paint on <html>). */
  useEffect(() => {
    const doc = document.documentElement
    setDesign(resolveDesign(doc.getAttribute('data-design')))
    setLogo(resolveLogo(doc.getAttribute('data-logo')))
    setScale(resolveScale(doc.getAttribute('data-font-scale')))
  }, [])

  const rootRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{
    pointerId: number
    startX: number
    startY: number
    originX: number
    originY: number
    moved: boolean
  } | null>(null)

  const mode = designThemeMode(design)

  const clampPos = useCallback((p: Pos): Pos => {
    const el = rootRef.current
    const w = el?.offsetWidth ?? 120
    const h = el?.offsetHeight ?? 44
    return {
      x: Math.min(Math.max(p.x, EDGE), Math.max(EDGE, window.innerWidth - w - EDGE)),
      y: Math.min(Math.max(p.y, EDGE), Math.max(EDGE, window.innerHeight - h - EDGE)),
    }
  }, [])

  /* Restore persisted position after mount (avoids SSR hydration mismatch). */
  useEffect(() => {
    const raw = storageGet(KEY_POS)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as Partial<Pos>
      if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
        setPos(clampPos({ x: parsed.x, y: parsed.y }))
      }
    } catch {
      /* stale value — ignore */
    }
  }, [clampPos])

  /* Keep the panel on-screen across resizes and open/close size changes. */
  useEffect(() => {
    if (pos) setPos(clampPos(pos))
    const onResize = () => setPos((p) => (p ? clampPos(p) : p))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, clampPos])

  const selectDesign = (slug: DesignSlug) => {
    setDesign(slug)
    const doc = document.documentElement
    doc.setAttribute('data-design', slug)
    doc.setAttribute('data-theme', designThemeMode(slug))
    syncBrandMark(logo, designThemeMode(slug))
    storageSet(KEY_DESIGN, slug)
  }

  const selectLogo = (id: LogoChoiceId) => {
    setLogo(id)
    syncBrandMark(id, mode)
    storageSet(KEY_LOGO, id)
  }

  const selectScale = (id: FontScaleId) => {
    setScale(id)
    const value = FONT_SCALES.find((f) => f.id === id)?.value ?? '1'
    const doc = document.documentElement
    doc.style.setProperty('--font-scale', value)
    doc.setAttribute('data-font-scale', id)
    storageSet(KEY_SCALE, id)
  }

  /* ---- drag (pointer events + capture, clamped, persisted) ---- */

  const onDragStart = (e: React.PointerEvent<HTMLElement>) => {
    // Buttons inside the header (close) keep their own click behavior.
    if ((e.target as HTMLElement).closest('[data-no-drag]')) return
    const el = rootRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    drag.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: rect.left,
      originY: rect.top,
      moved: false,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onDragMove = (e: React.PointerEvent<HTMLElement>) => {
    const d = drag.current
    if (!d || d.pointerId !== e.pointerId) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (!d.moved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return
    d.moved = true
    setPos(clampPos({ x: d.originX + dx, y: d.originY + dy }))
  }

  const onDragEnd = (e: React.PointerEvent<HTMLElement>, tapAction?: () => void) => {
    const d = drag.current
    if (!d || d.pointerId !== e.pointerId) return
    drag.current = null
    if (d.moved) {
      const el = rootRef.current
      if (el) {
        const rect = el.getBoundingClientRect()
        storageSet(KEY_POS, JSON.stringify({ x: Math.round(rect.left), y: Math.round(rect.top) }))
      }
    } else if (tapAction) {
      tapAction()
    }
  }

  const posStyle = pos ? { left: `${pos.x}px`, top: `${pos.y}px`, right: 'auto', bottom: 'auto' } : undefined

  return (
    <div
      ref={rootRef}
      className={open ? 'theme-control theme-control--open' : 'theme-control'}
      style={posStyle}
    >
      {open ? (
        <section className="tc-panel" aria-label="Display settings">
          <header
            className="tc-panel__head"
            onPointerDown={onDragStart}
            onPointerMove={onDragMove}
            onPointerUp={(e) => onDragEnd(e)}
            onPointerCancel={(e) => onDragEnd(e)}
          >
            <span className="tc-panel__grip" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="tc-panel__title">Display</span>
            <button
              type="button"
              data-no-drag
              className="tc-panel__close"
              aria-label="Collapse display settings"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>
          </header>

          <div className="tc-panel__body">
            <div className="tc-section" role="group" aria-label="Design">
              <span className="tc-section__label">Design</span>
              <div className="tc-designs">
                {DESIGNS.map((d) => (
                  <button
                    key={d.slug}
                    type="button"
                    className="tc-design"
                    aria-pressed={design === d.slug}
                    onClick={() => selectDesign(d.slug)}
                  >
                    <span className="tc-design__chips" aria-hidden="true">
                      {d.swatch.map((hex, i) => (
                        <span key={i} className="tc-design__chip" style={{ background: hex }} />
                      ))}
                    </span>
                    <span className="tc-design__name">{d.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="tc-section" role="group" aria-label="Logo">
              <span className="tc-section__label">Logo</span>
              <div className="tc-logos">
                {LOGO_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className="tc-logo"
                    aria-pressed={logo === o.id}
                    onClick={() => selectLogo(o.id)}
                  >
                    <img className="tc-logo__img" src={logoSrc(o.id, mode)} alt="" loading="lazy" />
                    <span className="tc-logo__name">{o.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="tc-section" role="group" aria-label="Type size">
              <span className="tc-section__label">Type size</span>
              <div className="tc-scales">
                {FONT_SCALES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="tc-scale"
                    aria-pressed={scale === f.id}
                    onClick={() => selectScale(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <button
          type="button"
          className="tc-pill"
          aria-label="Open display settings"
          aria-expanded={false}
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={(e) => onDragEnd(e, () => setOpen(true))}
          onPointerCancel={(e) => onDragEnd(e)}
        >
          <span className="tc-pill__chips" aria-hidden="true">
            {(DESIGNS.find((d) => d.slug === design) ?? DESIGNS[0]).swatch.map((hex, i) => (
              <span key={i} className="tc-design__chip" style={{ background: hex }} />
            ))}
          </span>
          Display
        </button>
      )}
    </div>
  )
}
