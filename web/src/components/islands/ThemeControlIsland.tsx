import './theme-control.css'

import { useEffect, useState } from 'react'

/**
 * ThemeControlIsland — the "Display" panel, restyled to the v8 design
 * (Marco's reversal, 2026-07-11). ONE design now; the panel is down to the
 * single dial that survives: v8's three MODES —
 *   Marquee night (dark) · House lights (light) · System (follow the OS)
 * applied as data-theme on <html> (system = attribute removed) and persisted
 * as localStorage apr70-theme = dark | light | system.
 *
 * v10 catalog (2026-07-12): the type-size dial (S/M/L/XL) and the logo-size
 * slider are REMOVED, along with the free-floating drag behavior — visitor
 * controls over layout-affecting dials are gone, only the theme mode
 * survives. The panel is now fixed bottom-right, collapsible to a pill,
 * keyboard accessible (Enter/Space/Escape). --logo-h stays a live CSS
 * token (SiteNav still reads it) — this island just no longer writes to it.
 */

export type ThemeMode = 'dark' | 'light' | 'system'

export type ThemeControlLabels = {
  displayLabel?: string | null
  panelTitle?: string | null
  themeLabel?: string | null
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

function resolveThemeMode(value: unknown): ThemeMode {
  return value === 'dark' || value === 'light' ? value : 'system'
}

export default function ThemeControlIsland({ labels }: { labels?: ThemeControlLabels } = {}) {
  const [open, setOpen] = useState(false)
  /* Default on BOTH server and first client render — reading <html> attrs in
     the initializer forks the trees and breaks hydration. The mount effect
     syncs state to the pre-paint stamp. */
  const [mode, setMode] = useState<ThemeMode>('system')

  /* Adopt the visitor's persisted choice (stamped pre-paint on <html>). */
  useEffect(() => {
    const doc = document.documentElement
    setMode(resolveThemeMode(storageGet(THEME_KEY) ?? doc.getAttribute('data-theme')))
  }, [])

  /* Escape closes the panel from anywhere inside it. */
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const selectMode = (v: ThemeMode) => {
    setMode(v)
    const doc = document.documentElement
    if (v === 'system') doc.removeAttribute('data-theme')
    else doc.setAttribute('data-theme', v)
    storageSet(THEME_KEY, v)
  }

  const modeName = (id: ThemeMode, fallback: string) => labels?.themeNames?.[id] || fallback

  return (
    <div className={open ? 'theme-control theme-control--open' : 'theme-control'}>
      {open ? (
        <section className="tc-panel" aria-label="Display settings">
          <header className="tc-panel__head">
            <span className="tc-panel__title">{labels?.panelTitle || 'Display'}</span>
            <button
              type="button"
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
          </div>
        </section>
      ) : (
        <button
          type="button"
          className="tc-pill"
          aria-label="Open display settings"
          aria-expanded={false}
          onClick={() => setOpen(true)}
        >
          <span className="tc-pill__bulb" aria-hidden="true" />
          {labels?.displayLabel || 'Display'}
        </button>
      )}
    </div>
  )
}
