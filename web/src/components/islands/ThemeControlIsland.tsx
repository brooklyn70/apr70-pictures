import './theme-control.css'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DESIGNS,
  DEFAULT_DESIGN,
  designThemeMode,
  resolveDesign,
  resolveMode,
  isThemeMode,
  resolveLogoSize,
  LOGO_SIZE,
  FONT_OPTIONS,
  DEFAULT_FONT,
  resolveFont,
  ACCENT_OPTIONS,
  DEFAULT_ACCENT,
  resolveAccent,
  STORAGE_KEYS,
  type DesignSlug,
  type ThemeMode,
  type FontDeployment,
  type AccentChoice,
} from '../../designs/manifest'
import {
  LOGO_OPTIONS,
  DEFAULT_LOGO,
  resolveLogo,
  logoSrc,
  logosByGroup,
  type LogoChoiceId,
} from '../../designs/logos'

/**
 * ThemeControlIsland (v3, Wave G2) — the single moveable "Display" panel.
 * Global chrome (mounted from Layout.astro, client:load — NOT a Payload block).
 *
 * Sections: Theme (2 live chips) · Type size (S/M/L/XL) · Logo (the FULL mark
 * library, grouped + scrollable) · Font (4 deployments) · Accent (division
 * swatch row). The light/dark MODE toggle moved OUT of the panel and into the
 * menu bar (SiteNav) per the VMS pattern — the panel only observes mode now, to
 * keep logo previews + the brand-mark ink in sync.
 *
 * Draggable (pointer capture, clamped), collapsible to a pill, keyboard
 * accessible (Type size + panel-open reachable by keyboard), focus-visible
 * rings, styled from tokens so it holds up on both live themes.
 *
 * localStorage: apr70:design | apr70:mode | apr70:logo | apr70:logo-size |
 * apr70:font-scale | apr70:font | apr70:accent | apr70:picker-pos. The pre-paint
 * stamp lives in Layout.astro <head>; font/accent are ALSO restored here from
 * localStorage so persistence holds even before/without that stamp.
 */

/**
 * v9 (2026-07-10): the panel slims to Theme (3 chips, names from
 * site-settings.v9Chrome) · Type size · Logo size. The Logo-library, Font,
 * and Accent pickers are UNMOUNTED for v9 — themes own typography now — but
 * their code stays intact below behind this flag.
 */
const SHOW_LIBRARY_SECTIONS = false

export type ThemeControlLabels = {
  displayLabel?: string | null
  panelTitle?: string | null
  themeLabel?: string | null
  scaleLabel?: string | null
  logoLabel?: string | null
  /** CMS names for the theme chips, keyed by design slug. */
  themeNames?: Partial<Record<DesignSlug, string | null>>
}

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
function syncBrandMark(logo: LogoChoiceId, mode: ThemeMode) {
  const src = logoSrc(logo, mode)
  const doc = document.documentElement
  doc.setAttribute('data-logo', logo)
  doc.setAttribute('data-logo-src', src)
  document.querySelectorAll<HTMLImageElement>('img[data-brand-wordmark]').forEach((img) => {
    if (img.getAttribute('src') !== src) img.setAttribute('src', src)
  })
}

/** Stamp the font deployment on <html> (token rebinds are CSS in theme-control.css). */
function applyFont(id: FontDeployment) {
  document.documentElement.setAttribute('data-font', id)
}

/** Stamp the accent preference on <html>. 'auto' removes the attribute so the
 *  theme/base --accent flows untouched (see precedence note in theme-control.css). */
function applyAccent(id: AccentChoice) {
  const doc = document.documentElement
  if (id === 'auto') doc.removeAttribute('data-accent')
  else doc.setAttribute('data-accent', id)
}

type Pos = { x: number; y: number }

export default function ThemeControlIsland({ labels }: { labels?: ThemeControlLabels } = {}) {
  const [open, setOpen] = useState(false)
  /* Defaults on BOTH server and first client render — reading <html> attrs in
     the initializer forks the trees and breaks hydration. The mount effect
     syncs state to the pre-paint stamp. */
  const [design, setDesign] = useState<DesignSlug>(DEFAULT_DESIGN)
  const [mode, setMode] = useState<ThemeMode>(designThemeMode(DEFAULT_DESIGN))
  /** Whether the visitor pinned a mode (apr70:mode). Set by the nav mode toggle
      now; the panel only reads it (for the logo-preview ink). */
  const [userMode, setUserMode] = useState(false)
  const [logo, setLogo] = useState<LogoChoiceId>(DEFAULT_LOGO)
  const [logoSize, setLogoSize] = useState<number>(LOGO_SIZE.default)
  const [scale, setScale] = useState<FontScaleId>('m')
  const [font, setFont] = useState<FontDeployment>(DEFAULT_FONT)
  const [accent, setAccent] = useState<AccentChoice>(DEFAULT_ACCENT)
  /** null = default CSS anchor (bottom-right). Set once dragged / restored. */
  const [pos, setPos] = useState<Pos | null>(null)

  /* Adopt the visitor's persisted choices (stamped pre-paint on <html>). */
  useEffect(() => {
    const doc = document.documentElement
    const d = resolveDesign(doc.getAttribute('data-design'))
    setDesign(d)
    const source = doc.getAttribute('data-mode-source')
    const pinned = source === 'user'
    setUserMode(pinned)
    const attrMode = doc.getAttribute('data-theme')
    const effMode = pinned && isThemeMode(attrMode) ? attrMode : resolveMode(pinned ? attrMode : null, d)
    setMode(effMode)
    const activeLogo = resolveLogo(doc.getAttribute('data-logo'))
    setLogo(activeLogo)
    setLogoSize(resolveLogoSize(doc.getAttribute('data-logo-size')))
    setScale(resolveScale(doc.getAttribute('data-font-scale')))

    /* Font + accent: prefer the pre-paint stamp, else localStorage, else
       default. Applying here guarantees restore even if the Layout pre-paint
       patch is deferred to the orchestrator. */
    const f = resolveFont(doc.getAttribute('data-font') ?? storageGet(STORAGE_KEYS.font))
    setFont(f)
    applyFont(f)
    const a = resolveAccent(doc.getAttribute('data-accent') ?? storageGet(STORAGE_KEYS.accent))
    setAccent(a)
    applyAccent(a)

    /* Make sure the SSR/pre-paint brand mark matches the current logo + mode. */
    syncBrandMark(activeLogo, effMode)
  }, [])

  /* Mode now lives in the nav. Observe <html> so the panel's logo-preview ink +
     the brand mark stay correct when the nav toggle (or a theme change) flips
     the mode. Filtered to mode attrs, so our own data-logo writes never loop. */
  useEffect(() => {
    const doc = document.documentElement
    const obs = new MutationObserver(() => {
      const pinned = doc.getAttribute('data-mode-source') === 'user'
      setUserMode(pinned)
      const attrMode = doc.getAttribute('data-theme')
      const m: ThemeMode = isThemeMode(attrMode)
        ? attrMode
        : designThemeMode(resolveDesign(doc.getAttribute('data-design')))
      setMode((prev) => (prev === m ? prev : m))
      syncBrandMark(resolveLogo(doc.getAttribute('data-logo')), m)
    })
    obs.observe(doc, { attributes: true, attributeFilter: ['data-theme', 'data-mode-source'] })
    return () => obs.disconnect()
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
  /** Set true when a pointer gesture just ended as a real drag (moved past
   *  the threshold) so the click that the browser fires right after pointerup
   *  regardless of movement doesn't also re-trigger tap activation. Keyboard
   *  activation (Enter/Space on the pill) never touches pointer events at
   *  all, so it always reaches onClick unaffected. */
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

  const selectDesign = (slug: DesignSlug) => {
    setDesign(slug)
    const doc = document.documentElement
    doc.setAttribute('data-design', slug)
    // Mode follows the new theme's default unless the visitor pinned one.
    const nextMode: ThemeMode = userMode ? mode : designThemeMode(slug)
    if (!userMode) {
      setMode(nextMode)
      doc.setAttribute('data-theme', nextMode)
      doc.setAttribute('data-mode-source', 'theme')
    }
    syncBrandMark(logo, nextMode)
    storageSet(STORAGE_KEYS.design, slug)
  }

  const selectLogo = (id: LogoChoiceId) => {
    setLogo(id)
    syncBrandMark(id, mode)
    storageSet(STORAGE_KEYS.logo, id)
  }

  /** Trailing debounce for the logo-size persisted write — the range input
   *  fires onChange on every pixel of drag; only the resting value needs to
   *  hit localStorage. The CSS var + attribute update stays synchronous
   *  (cheap, needed for live visual feedback while dragging). */
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

  const selectScale = (id: FontScaleId) => {
    setScale(id)
    const value = FONT_SCALES.find((f) => f.id === id)?.value ?? '1'
    const doc = document.documentElement
    doc.style.setProperty('--font-scale', value)
    doc.setAttribute('data-font-scale', id)
    storageSet(STORAGE_KEYS.fontScale, id)
  }

  const selectFont = (id: FontDeployment) => {
    setFont(id)
    applyFont(id)
    storageSet(STORAGE_KEYS.font, id)
  }

  const selectAccent = (id: AccentChoice) => {
    setAccent(id)
    applyAccent(id)
    storageSet(STORAGE_KEYS.accent, id)
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

  /** Authoritative "open the panel" activation — fires for mouse click,
   *  touch tap, AND keyboard Enter/Space on the pill (native button
   *  behavior), unlike the pointer handlers above which only see real
   *  pointer input. Suppressed once, right after a real drag, because the
   *  browser still fires a click following pointerup regardless of movement. */
  const activatePill = () => {
    if (justDraggedRef.current) {
      justDraggedRef.current = false
      return
    }
    setOpen(true)
  }

  /* Escape closes the panel from anywhere inside it (keyboard parity with
     the close button). */
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

  const activeDesign = DESIGNS.find((d) => d.slug === design) ?? DESIGNS[0]
  const themeName = (slug: DesignSlug, fallback: string) => labels?.themeNames?.[slug] || fallback
  const activeAccentLabel =
    accent === 'auto'
      ? 'Auto · follows theme'
      : ACCENT_OPTIONS.find((a) => a.id === accent)?.label ?? 'Auto'

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
            {/* Theme */}
            <div className="tc-section" role="group" aria-label={labels?.themeLabel || 'Theme'}>
              <span className="tc-section__label">{labels?.themeLabel || 'Theme'}</span>
              <div className="tc-themes">
                {DESIGNS.map((d) => (
                  <button
                    key={d.slug}
                    type="button"
                    className="tc-theme"
                    aria-pressed={design === d.slug}
                    onClick={() => selectDesign(d.slug)}
                  >
                    <span className="tc-theme__chips" aria-hidden="true">
                      {d.swatch.map((hex, i) => (
                        <span key={i} className="tc-chip" style={{ background: hex }} />
                      ))}
                    </span>
                    <span className="tc-theme__text">
                      <span className="tc-theme__name">{themeName(d.slug, d.name)}</span>
                      <span className="tc-theme__blurb">{d.blurb}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Type size */}
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

            {/* Logo — the FULL mark library, grouped + scrollable.
                UNMOUNTED for v9 (SHOW_LIBRARY_SECTIONS) — code kept intact. */}
            {SHOW_LIBRARY_SECTIONS && (
            <div className="tc-section" role="group" aria-label="Logo">
              <span className="tc-section__label">
                Logo
                <span className="tc-section__value">{LOGO_OPTIONS.length} marks</span>
              </span>
              <div className="tc-logos-scroll" tabIndex={0} aria-label="Logo library">
                {logosByGroup().map(({ group, options }) => (
                  <div key={group} className="tc-logo-group">
                    <span className="tc-logo-group__label">{group}</span>
                    <div className="tc-logos">
                      {options.map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          className="tc-logo"
                          aria-pressed={logo === o.id}
                          title={o.label}
                          onClick={() => selectLogo(o.id)}
                        >
                          <img
                            className="tc-logo__img"
                            src={logoSrc(o.id, mode)}
                            alt=""
                            loading="lazy"
                          />
                          <span className="tc-logo__name">{o.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Logo size — V5 (Marco 2026-07-07): the mandatory icon resizer.
                Live while dragging (CSS var update is synchronous); the
                persisted write is debounced in selectLogoSize. */}
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

            {/* Font — UNMOUNTED for v9 (themes own typography); code intact. */}
            {SHOW_LIBRARY_SECTIONS && (
            <div className="tc-section" role="group" aria-label="Font">
              <span className="tc-section__label">Font</span>
              <div className="tc-fonts">
                {FONT_OPTIONS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="tc-font"
                    data-font-id={f.id}
                    aria-pressed={font === f.id}
                    onClick={() => selectFont(f.id)}
                  >
                    <span className="tc-font__specimen" aria-hidden="true">
                      {f.specimen}
                    </span>
                    <span className="tc-font__text">
                      <span className="tc-font__name">{f.label}</span>
                      <span className="tc-font__note">{f.note}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
            )}

            {/* Division accent — UNMOUNTED for v9; code intact. */}
            {SHOW_LIBRARY_SECTIONS && (
            <div className="tc-section" role="group" aria-label="Division accent">
              <span className="tc-section__label">
                Accent
                <span className="tc-section__value">{activeAccentLabel}</span>
              </span>
              <div className="tc-accents">
                {ACCENT_OPTIONS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    className="tc-accent"
                    aria-pressed={accent === a.id}
                    aria-label={a.label}
                    title={a.label}
                    onClick={() => selectAccent(a.id)}
                  >
                    <span
                      className="tc-accent__chip"
                      data-auto={a.hex === null ? 'true' : undefined}
                      style={a.hex ? { background: a.hex } : undefined}
                    />
                  </button>
                ))}
              </div>
            </div>
            )}
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
          <span className="tc-pill__chips" aria-hidden="true">
            {activeDesign.swatch.map((hex, i) => (
              <span key={i} className="tc-chip" style={{ background: hex }} />
            ))}
          </span>
          {labels?.displayLabel || 'Display'}
        </button>
      )}
    </div>
  )
}
