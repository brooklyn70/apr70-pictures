import './mode-toggle.css'

import { useEffect, useState } from 'react'

/**
 * ModeToggleIsland — the mode switch, in the nav, as a 17px icon.
 *
 * v11 (Marco 2026-07-13). It replaces the "Display" pill, which was a floating
 * box permanently parked over the artwork on every page, holding exactly ONE
 * control by the time v10 shipped. Marco's ruling: "if the one aspect of the
 * display button is dark and light mode, eliminate it and build it into the nav
 * with a small icon for light/dark. i don't like the pill box."
 *
 * Two investors reached the same verdict independently, with no knowledge of his
 * view. Hughes: "a floating pill reading DISPLAY with a red dot... it reads as a
 * REC indicator or a developer toggle... a dev artifact shipped to production."
 * Disney: "a debug button in the corner."
 *
 * SYSTEM IS GONE as a visitor choice (Marco's ruling). It survives where it
 * belongs: as the silent default. With nothing stored, the site follows the OS
 * (or the Brand Kit's modeDefault). The first click on this icon is the visitor
 * choosing, and from then on the choice is theirs and it persists.
 *
 * Storage key and semantics are unchanged from the pill, so a visitor who
 * already picked a mode keeps it: localStorage apr70-theme = "dark" | "light".
 */

export type Mode = 'dark' | 'light'

const THEME_KEY = 'apr70-theme'

function storageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function storageSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* Safari private mode: the toggle still works for the session. */
  }
}

/** What the page is showing RIGHT NOW, which is what the icon must reflect.
 *  The pre-paint script in V9Layout has already resolved system → an attribute,
 *  or left it absent, in which case the OS decides. */
function currentMode(): Mode {
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr === 'dark' || attr === 'light') return attr
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

type Props = {
  /** CMS labels, so the control stays Payload-driven like the pill was. */
  darkLabel?: string | null
  lightLabel?: string | null
}

export default function ModeToggleIsland({ darkLabel, lightLabel }: Props) {
  const [mode, setMode] = useState<Mode>('dark')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setMode(currentMode())
    setReady(true)

    // If the visitor has never chosen, keep following the OS live.
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onOsChange = () => {
      if (!storageGet(THEME_KEY)) setMode(currentMode())
    }
    mq.addEventListener('change', onOsChange)
    return () => mq.removeEventListener('change', onOsChange)
  }, [])

  const toggle = () => {
    const next: Mode = mode === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    storageSet(THEME_KEY, next)
    setMode(next)
  }

  // Name the ACTION, not the state (the v7 lesson: it is a light switch in a
  // cinema, not a settings menu). In the dark, the switch offers you the lights.
  const goingTo = mode === 'dark' ? lightLabel || 'House lights' : darkLabel || 'Marquee night'

  return (
    <button
      type="button"
      className="mode-toggle"
      onClick={toggle}
      aria-label={goingTo}
      title={goingTo}
      data-mode={ready ? mode : undefined}
    >
      {/* In the dark we show the sun: the thing you can turn on. */}
      <svg
        className="mode-toggle__sun"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
      </svg>
      <svg
        className="mode-toggle__moon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1z" />
      </svg>
    </button>
  )
}
