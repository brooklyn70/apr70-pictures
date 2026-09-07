/**
 * The small dictionary — ONLY the strings that are not CMS-sourced.
 *
 * Everything a visitor reads on a page comes from Payload. What is left over
 * lives here: the entity description that feeds JSON-LD / meta / llms.txt, the
 * division names, the page labels llms.txt uses, and the hardcoded English
 * fallbacks that keep the chrome alive when the CMS is unreachable.
 *
 * Rule (Marco, plan §G.1 row 10): agents do NOT invent translated copy. Each
 * non-English entry below is `{}` — the accessor falls back to `en` field by
 * field, so a half-filled locale renders English for the rest rather than
 * blanks. Translations arrive in a separate, reviewed step and are pasted in
 * here (or, for anything editorial, into the Payload locale tab instead).
 */
import { DEFAULT_LOCALE, type SiteLocale } from 'site-locales'

export type Dictionary = {
  /** Entity description: Organization JSON-LD, default meta description, llms.txt. */
  siteDescription: string
  /** The three houses, in canonical order. */
  divisions: readonly [string, string, string]
  /** Labels for the five primary pages, keyed by path. */
  pages: Readonly<Record<'/' | '/slate' | '/craft' | '/methods' | '/contact', string>>
  /** Labels for the three division pages, keyed by path. */
  divisionPages: Readonly<Record<'/212' | '/310' | '/nrc', string>>
  /** Accessible name for the language switcher (chrome.languageLabel overrides). */
  languageLabel: string
  /** Display-panel fallbacks — used only when the CMS chrome strings are empty. */
  display: {
    displayLabel: string
    panelTitle: string
    themeLabel: string
    themeDark: string
    themeLight: string
    themeSystem: string
  }
}

const EN: Dictionary = {
  siteDescription:
    'APR 70 Pictures is an independent film and television studio in Long Island City, New York. Human-written scripts, classic storytelling, modern production methods, with machine-generated imagery disclosed wherever it appears.',
  divisions: ['(212) Pictures', '(310) Pictures', 'New Renaissance Cinema'],
  pages: {
    '/': 'Home',
    '/slate': 'Slate',
    '/craft': 'Craft',
    '/methods': 'Methods',
    '/contact': 'Contact',
  },
  divisionPages: {
    '/212': '(212) Pictures',
    '/310': '(310) Pictures',
    '/nrc': 'New Renaissance Cinema',
  },
  languageLabel: 'Language',
  display: {
    displayLabel: 'Display',
    panelTitle: 'Display',
    themeLabel: 'Theme',
    themeDark: 'Marquee night',
    themeLight: 'House lights',
    themeSystem: 'System',
  },
}

/** Structure only. Do not fill these in without Marco's signed-off translation. */
const OVERRIDES: Partial<Record<SiteLocale, Partial<Dictionary>>> = {
  pt: {},
  it: {},
  fr: {},
  de: {},
}

/**
 * The dictionary for `locale`, field by field over English. Nested groups fall
 * back key by key too, so a locale that translates only `languageLabel` keeps
 * English for everything else instead of losing the rest.
 */
export function dict(locale: SiteLocale = DEFAULT_LOCALE): Dictionary {
  const over = OVERRIDES[locale]
  if (!over) return EN
  return {
    ...EN,
    ...over,
    pages: { ...EN.pages, ...(over.pages ?? {}) },
    divisionPages: { ...EN.divisionPages, ...(over.divisionPages ?? {}) },
    display: { ...EN.display, ...(over.display ?? {}) },
  }
}
