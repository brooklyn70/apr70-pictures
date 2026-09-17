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
  // pt: DRAFT 2026-09-07 (Claude, pt-BR), pending Marco's sign-off with the
  // rest of the Portuguese pass (docs/i18n/review/pt-2026-09-07.md). Not public
  // until `pt` is enabled in Site Settings.
  pt: {
    siteDescription:
      'A APR 70 Pictures é um estúdio independente de cinema e televisão em Long Island City, Nova York. Roteiros escritos por pessoas, narrativa clássica, métodos de produção modernos, com imagens geradas por máquina identificadas onde quer que apareçam.',
    pages: {
      '/': 'Início',
      '/slate': 'Slate',
      '/craft': 'Ofício',
      '/methods': 'Métodos',
      '/contact': 'Contato',
    },
    languageLabel: 'Idioma',
    display: {
      displayLabel: 'Exibição',
      panelTitle: 'Exibição',
      themeLabel: 'Tema',
      themeDark: 'Noite de marquise',
      themeLight: 'Luzes da sala',
      themeSystem: 'Sistema',
    },
  },
  // it / fr / de: DRAFT 2026-09-07 (Claude), pending Marco's sign-off with each
  // locale's review doc (docs/i18n/review/). Not public until enabled.
  it: {
    siteDescription:
      'APR 70 Pictures è uno studio indipendente di cinema e televisione a Long Island City, New York. Sceneggiature scritte da persone, narrazione classica, metodi di produzione moderni, con le immagini generate da macchina dichiarate ovunque compaiano.',
    pages: { '/': 'Home', '/slate': 'Slate', '/craft': 'Mestiere', '/methods': 'Metodi', '/contact': 'Contatti' },
    languageLabel: 'Lingua',
    display: {
      displayLabel: 'Schermo',
      panelTitle: 'Schermo',
      themeLabel: 'Tema',
      themeDark: 'Notte in sala',
      themeLight: 'Luci di sala',
      themeSystem: 'Sistema',
    },
  },
  fr: {
    siteDescription:
      'APR 70 Pictures est un studio indépendant de cinéma et de télévision à Long Island City, New York. Des scénarios écrits par des personnes, un récit classique, des méthodes de production modernes, et des images générées par machine signalées partout où elles apparaissent.',
    pages: { '/': 'Accueil', '/slate': 'Slate', '/craft': 'Métier', '/methods': 'Méthodes', '/contact': 'Contact' },
    languageLabel: 'Langue',
    display: {
      displayLabel: 'Affichage',
      panelTitle: 'Affichage',
      themeLabel: 'Thème',
      themeDark: 'Nuit de marquise',
      themeLight: 'Lumières de salle',
      themeSystem: 'Système',
    },
  },
  de: {
    siteDescription:
      'APR 70 Pictures ist ein unabhängiges Film- und Fernsehstudio in Long Island City, New York. Von Menschen geschriebene Drehbücher, klassisches Erzählen, moderne Produktionsmethoden, und maschinell erzeugte Bilder werden überall dort ausgewiesen, wo sie erscheinen.',
    pages: { '/': 'Start', '/slate': 'Slate', '/craft': 'Handwerk', '/methods': 'Methoden', '/contact': 'Kontakt' },
    languageLabel: 'Sprache',
    display: {
      displayLabel: 'Anzeige',
      panelTitle: 'Anzeige',
      themeLabel: 'Thema',
      themeDark: 'Kinonacht',
      themeLight: 'Saallicht',
      themeSystem: 'System',
    },
  },
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
