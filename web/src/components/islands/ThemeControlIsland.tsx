import './theme-control.css'

import { useCallback, useEffect, useRef, useState } from 'react'
import { LOGO_SIZE, resolveLogoSize, STORAGE_KEYS } from '../../designs/manifest'

/**
 * ThemeControlIsland — the free-floating "Display" panel, restyled to the v8
 * design (Marco's reversal, 2026-07-11). ONE design now; the Theme segment
 * offers v8's three MODES:
 *   Marquee night (dark) · House lights (light) · System (follow the OS)
 * applied as data-theme on <html> (system = attribute removed) and persisted
 * as localStorage apr70-theme = dark | light | system.
 *
 * The other two dials survive from v9: Type size (v8 steps — S 87.5%, M 100%,
 * L 112.5%, XL 125%, via html[data-scale], persisted apr70:font-scale) and
 * Logo size (--logo-h px, persisted apr70:logo-size).
 *
 * Still draggable (pointer capture, clamped, persisted apr70:picker-pos),
 * collapsible to a pill, keyboard accessible. The legacy v4 sections (design
 * library, font deployments, accent swatches, logo library) are GONE — the
 * v8 system has no such dials, and this island no longer stamps data-font /
 * data-accent / data-design on <html>.
 */

export type ThemeMode = 'dark' | 'light' | 'system'

export type ThemeControlLabels = {
  displayLabel?: string | null
  panelTitle?: string | null
  themeLabel?: string | null
  scaleLabel?: string | null
  logoLabel?: string | null
  /** CMS names for the three modes (site-settings.v9Chrome: themePremiere ->
      dark, themeMatinee -> light, themeLateshow -> system). */
  themeNames?: Partial<Record<ThemeMode, string | null>>
}

const THEME_KEY = 'apr70-theme'

const MODES: Array<{ id: ThemeMode; fallback: string }> = [
  { id: 'dark', fallback: 'Marquee night' },
  { id: 'light', fallback: 'House lights' },
  { id: 'system', fallback: 'System' },
]

/* v8 type-scale steps (html[data-scale] rules live in themes/marquee.css). */
const FONT_SCALES = [
  { id: 's', label: 'S' },
  { id: 'm', label: 'M' },
  { id: 'l', label: 'L' },
  { id: 'xl', label: 'XL' },
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

function resolveThemeMode(value: unknown): ThemeMode {
  return value === 'dark' || value === 'light' ? value : 'system'
}

type Pos = { x: number; y: number }

export default function ThemeControlIsland({ labels }: { labels?: ThemeControlLabels } = {}) {
  const [open, setOpen] = useState(false)
  /* Defaults on BOTH server and first client render — reading <html> attrs in
     the initializer forks the trees and breaks hydration. The mount effect
     syncs state to the pre-paint stamp. */
  const [mode, setMode] = useState<ThemeMode>('system')
  const [scale, setScale] = useState<FontScaleId>('m')
  const [logoSize, setLogoSize] = useState<number>(LOGO_SIZE.default)
  /** null = default CSS anchor (bottom-right). Set once dragged / restored. */
  const [pos, setPos] = useState<Pos | null>(null)

  /* Adopt the visitor's persisted choices (stamped pre-paint on <html>). */
  useEffect(() => {
    const doc = document.documentElement
    setMode(resolveThemeMode(storageGet(THEME_KEY) ?? doc.getAttribute('data-theme')))
    setScale(resolveScale(doc.getAttribute('data-scale') ?? storageGet(STORAGE_KEYS.fontScale)))
    setLogoSize(resolveLogoSize(doc.getAttribute('data-logo-size') ?? storageGet(STORAGE_KEYS.logoSize)))
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
  /** Set true when a pointer gesture just ended as a real drag so the click
   *  the browser fires right after pointerup doesn't also re-trigger tap
   *  activation. Keyboard activation never touches pointer events, so it
   *  always reaches onClick unaffected. */
  const justDraggedRef = useRef(false)

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
    const raw = storageGet(STORAGE_KEYS.pickerPos)
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

  /* ---- the three dials ---- */

  const selectMode = (v: ThemeMode) => {
    setMode(v)
    const doc = document.documentElement
    if (v === 'system') doc.removeAttribute('data-theme')
    else doc.setAttribute('data-theme', v)
    storageSet(THEME_KEY, v)
  }

  const selectScale = (id: FontScaleId) => {
    setScale(id)
    document.documentElement.setAttribute('data-scale', id)
    storageSet(STORAGE_KEYS.fontScale, id)
  }

  /** Trailing debounce for the logo-size persisted write — the range input
   *  fires onChange on every pixel of drag; only the resting value needs to
   *  hit localStorage. The CSS var update stays synchronous. */
  const logoSizeWriteTimer = useRef<number | null>(null)

  const selectLogoSize = (px: number) => {
    const size = resolveLogoSize(px)
    setLogoSize(size)
    const doc = document.documentElement
    doc.style.setProperty('--logo-h', `${size}px`)
    doc.setAttribute('data-logo-size', String(size))
    if (logoSizeWriteTimer.current) window.clearTimeout(logoSizeWriteTimer.current)
    logoSizeWriteTimer.current = window.setTimeout(() => {
      storageSet(STORAGE_KEYS.logoSize, String(size))
    }, 200)
  }

  /* ---- drag (pointer events + capture, clamped, persisted) ---- */

  const onDragStart = (e: React.PointerEvent<HTMLElement>) => {
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
      justDraggedRef.current = true
      const el = rootRef.current
      if (el) {
        const rect = el.getBoundingClientRect()
        storageSet(
          STORAGE_KEYS.pickerPos,
          JSON.stringify({ x: Math.round(rect.left), y: Math.round(rect.top) }),
        )
      }
    } else if (tapAction) {
      tapAction()
    }
  }

  /** Authoritative "open the panel" activation — mouse click, touch tap AND
   *  keyboard Enter/Space on the pill. Suppressed once right after a real
   *  drag (the browser fires a click after pointerup regardless). */
  const activatePill = () => {
    if (justDraggedRef.current) {
      justDraggedRef.current = false
      return
    }
    setOpen(true)
  }

  /* Escape closes the panel from anywhere inside it. */
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const posStyle = pos
    ? { left: `${pos.x}px`, top: `${pos.y}px`, right: 'auto', bottom: 'auto' }
    : undefined

  const modeName = (id: ThemeMode, fallback: string) => labels?.themeNames?.[id] || fallback

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
            <span className="tc-panel__title">{labels?.panelTitle || 'Display'}</span>
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
            {/* Theme — the v8 three-way mode switch */}
            <div className="tc-section" role="group" aria-label={labels?.themeLabel || 'Theme'}>
              <span className="tc-section__label">{labels?.themeLabel || 'Theme'}</span>
              <div className="tc-segment tc-segment--stack">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className="tc-seg"
                    aria-pressed={mode === m.id}
                    onClick={() => selectMode(m.id)}
                  >
                    {modeName(m.id, m.fallback)}
                  </button>
                ))}
              </div>
            </div>

            {/* Type size — v8 steps S/M/L/XL */}
            <div className="tc-section" role="group" aria-label={labels?.scaleLabel || 'Type size'}>
              <span className="tc-section__label">{labels?.scaleLabel || 'Type size'}</span>
              <div className="tc-segment tc-segment--4">
                {FONT_SCALES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="tc-seg"
                    aria-pressed={scale === f.id}
                    onClick={() => selectScale(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Logo size — live while dragging; persisted write debounced */}
            <div className="tc-section" role="group" aria-label={labels?.logoLabel || 'Logo size'}>
              <span className="tc-section__label">
                {labels?.logoLabel || 'Logo size'}
                <span className="tc-section__value">{logoSize}px</span>
              </span>
              <div className="tc-range-row">
                <span className="tc-range-end" aria-hidden="true">A</span>
                <input
                  className="tc-range"
                  type="range"
                  min={LOGO_SIZE.min}
                  max={LOGO_SIZE.max}
                  step={1}
                  value={logoSize}
                  aria-label="Brand mark size in pixels"
                  onChange={(e) => selectLogoSize(Number(e.currentTarget.value))}
                />
                <span className="tc-range-end tc-range-end--big" aria-hidden="true">A</span>
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
          onPointerUp={(e) => onDragEnd(e)}
          onPointerCancel={(e) => onDragEnd(e)}
          onClick={activatePill}
        >
          <span className="tc-pill__bulb" aria-hidden="true" />
          {labels?.displayLabel || 'Display'}
        </button>
      )}
    </div>
  )
}
