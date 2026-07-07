/**
 * Brand-mark catalogue — the FULL house logo library (Wave G2).
 *
 * Marco browses ALL his marks here: the v2 lockups in `web/public/logos/`,
 * plus the studio originals under `web/public/brand/apr70-logos/**` (wordmark
 * lockups, monograms, division marks). Grouped into four families for the
 * panel picker: Wordmarks · Sprocket variants · Monograms · Division marks.
 *
 * Ink-mode pairing: a mark that ships as a black/white twin resolves its file
 * automatically from the active mode (dark base -> white ink, light base ->
 * black ink) so a monochrome mark never lands on a matching background and
 * disappears — the visitor never picks the ink, only the mark. Fixed-colour
 * marks (coloured lockups, division blocks) render the same file in both modes.
 *
 * SKIPPED on disk (per brief): the letterhead/, business_cards/, favicons/
 * directories, and .png twins where an .svg exists (all marks here are .svg).
 *
 * Persisted in localStorage under `apr70:logo`. The legacy ids
 * full-plain..primary-orange are preserved, so any stored v1 value still
 * resolves. Anything unknown falls back to DEFAULT_LOGO.
 */

/** Ink-paired mark: black/white twins resolved by mode. */
type LogoInk = { dark: string; light: string }
/** Fixed-colour mark: same file in both modes (no ink twin). */
type LogoFixed = { fixed: string }
type LogoSrc = LogoInk | LogoFixed

export type LogoGroup = 'Wordmarks' | 'Sprocket variants' | 'Monograms' | 'Division marks'

/** Render order for the grouped picker. */
export const LOGO_GROUPS: LogoGroup[] = [
  'Wordmarks',
  'Sprocket variants',
  'Monograms',
  'Division marks',
]

/** Opaque picker key. Validated at runtime via the IDS set below — a large,
 *  data-driven catalogue is not worth a hand-maintained union. */
export type LogoChoiceId = string

export interface LogoOption {
  id: LogoChoiceId
  /** Picker label, e.g. "Full · Amber". */
  label: string
  group: LogoGroup
  src: LogoSrc
}

/* Base directories. */
const L = '/logos/' //                                  v2 lockups (black/white twins)
const B = '/brand/apr70-logos/apr70-apr70pictures/logo/' // studio wordmark originals
const M = '/brand/apr70-logos/apr70-apr70pictures/monogram/'
const D212 = '/brand/apr70-logos/212-pictures/'
const D310 = '/brand/apr70-logos/310-pictures/'
const DNRC = '/brand/apr70-logos/new-renaissance-cinema/'

/** Ink-paired src for files named `${base}black${tail}` / `${base}white${tail}`.
 *  dark mode -> white ink, light mode -> black ink. */
const ink = (base: string, tail = '.svg'): LogoInk => ({
  dark: `${base}white${tail}`,
  light: `${base}black${tail}`,
})

export const LOGO_OPTIONS: LogoOption[] = [
  /* ---- Wordmarks: plain lockups + studio version refinements ---- */
  { id: 'full-plain', label: 'Full · Plain', group: 'Wordmarks', src: ink(`${L}apr70_logo_full_`) },
  { id: 'primary-plain', label: 'Primary · Plain', group: 'Wordmarks', src: ink(`${L}apr70_logo_primary_`) },
  { id: 'full-v5', label: 'Full · v5', group: 'Wordmarks', src: ink(`${B}apr70_logo_full_`, '_v5.svg') },
  { id: 'full-v6', label: 'Full · v6', group: 'Wordmarks', src: ink(`${B}apr70_logo_full_`, '_v6.svg') },
  { id: 'primary-v5', label: 'Primary · v5', group: 'Wordmarks', src: ink(`${B}apr70_logo_primary_`, '_v5.svg') },
  { id: 'primary-v6', label: 'Primary · v6', group: 'Wordmarks', src: ink(`${B}apr70_logo_primary_`, '_v6.svg') },
  { id: 'full-color-blue', label: 'Full · Blue ink', group: 'Wordmarks', src: { fixed: `${B}apr70_logo_full_blue_v5.svg` } },
  { id: 'full-color-orange', label: 'Full · Orange ink', group: 'Wordmarks', src: { fixed: `${B}apr70_logo_full_orange_v5.svg` } },

  /* ---- Sprocket variants: colourway sprocket-hole marks ---- */
  { id: 'full-amber', label: 'Full · Amber sprockets', group: 'Sprocket variants', src: ink(`${L}apr70_logo_full_`, '_amber_sprockets.svg') },
  { id: 'full-blue', label: 'Full · Blue sprockets', group: 'Sprocket variants', src: ink(`${L}apr70_logo_full_`, '_blue_sprockets.svg') },
  { id: 'full-navy', label: 'Full · Navy sprockets', group: 'Sprocket variants', src: ink(`${L}apr70_logo_full_`, '_navy_sprockets.svg') },
  { id: 'full-orange', label: 'Full · Orange sprockets', group: 'Sprocket variants', src: ink(`${L}apr70_logo_full_`, '_orange_sprockets.svg') },
  { id: 'primary-amber', label: 'Primary · Amber sprockets', group: 'Sprocket variants', src: ink(`${L}apr70_logo_primary_`, '_amber_sprockets.svg') },
  { id: 'primary-blue', label: 'Primary · Blue sprockets', group: 'Sprocket variants', src: ink(`${L}apr70_logo_primary_`, '_blue_sprockets.svg') },
  { id: 'primary-navy', label: 'Primary · Navy sprockets', group: 'Sprocket variants', src: ink(`${L}apr70_logo_primary_`, '_navy_sprockets.svg') },
  { id: 'primary-orange', label: 'Primary · Orange sprockets', group: 'Sprocket variants', src: ink(`${L}apr70_logo_primary_`, '_orange_sprockets.svg') },
  { id: 'full-orange-sprockets-v6', label: 'Full · Orange sprockets v6', group: 'Sprocket variants', src: ink(`${B}apr70_logo_full_`, '_orange_sprockets_v6.svg') },
  { id: 'full-blue-sprockets-v6', label: 'Full · Blue sprockets v6', group: 'Sprocket variants', src: ink(`${B}apr70_logo_full_`, '_blue_sprockets_v6.svg') },

  /* ---- Monograms ---- */
  { id: 'mono-v5', label: 'Monogram · v5', group: 'Monograms', src: ink(`${M}apr70_monogram_`, '_v5.svg') },
  { id: 'mono-v3', label: 'Monogram · v3', group: 'Monograms', src: ink(`${M}apr70_monogram_`, '_v3.svg') },
  { id: 'mono-v6', label: 'Monogram · v6', group: 'Monograms', src: ink(`${M}apr70_monogram_`, '_v6.svg') },
  { id: 'mono-blue', label: 'Monogram · Blue sprockets', group: 'Monograms', src: ink(`${M}apr70_monogram_`, '_blue_sprockets_v5.svg') },
  { id: 'mono-orange', label: 'Monogram · Orange sprockets', group: 'Monograms', src: ink(`${M}apr70_monogram_`, '_orange_sprockets_v5.svg') },
  { id: 'mono-color-blue', label: 'Monogram · Blue ink', group: 'Monograms', src: { fixed: `${M}apr70_monogram_blue_v5.svg` } },
  { id: 'mono-color-orange', label: 'Monogram · Orange ink', group: 'Monograms', src: { fixed: `${M}apr70_monogram_orange_v5.svg` } },

  /* ---- Division marks (fixed colour) ---- */
  { id: 'div-212-hero', label: '(212) · Hero', group: 'Division marks', src: { fixed: `${D212}212_hero.svg` } },
  { id: 'div-212-footer', label: '(212) · Footer', group: 'Division marks', src: { fixed: `${D212}212_footer.svg` } },
  { id: 'div-212-card', label: '(212) · Card', group: 'Division marks', src: { fixed: `${D212}212_card_front.svg` } },
  { id: 'div-310-hero', label: '(310) · Hero', group: 'Division marks', src: { fixed: `${D310}310_hero.svg` } },
  { id: 'div-310-footer', label: '(310) · Footer', group: 'Division marks', src: { fixed: `${D310}310_footer.svg` } },
  { id: 'div-310-card', label: '(310) · Card', group: 'Division marks', src: { fixed: `${D310}310_card_front.svg` } },
  { id: 'div-nrc-v1', label: 'NRC · v1', group: 'Division marks', src: { fixed: `${DNRC}nrc_v1.svg` } },
  { id: 'div-nrc-v2', label: 'NRC · v2', group: 'Division marks', src: { fixed: `${DNRC}nrc_v2.svg` } },
  { id: 'div-nrc-v3', label: 'NRC · v3', group: 'Division marks', src: { fixed: `${DNRC}nrc_v3.svg` } },
  { id: 'div-nrc-footer', label: 'NRC · Footer', group: 'Division marks', src: { fixed: `${DNRC}nrc_footer.svg` } },
]

/** Default nav/splash mark — the plain full lockup (reliable ink twins). */
export const DEFAULT_LOGO: LogoChoiceId = 'full-plain'

const IDS = new Set(LOGO_OPTIONS.map((o) => o.id))
const BY_ID = new Map(LOGO_OPTIONS.map((o) => [o.id, o]))

export function isLogoChoice(value: unknown): value is LogoChoiceId {
  return typeof value === 'string' && IDS.has(value)
}

export function resolveLogo(value: unknown): LogoChoiceId {
  return isLogoChoice(value) ? value : DEFAULT_LOGO
}

/** Grouped view for the picker UI (preserves catalogue order within a group). */
export function logosByGroup(): Array<{ group: LogoGroup; options: LogoOption[] }> {
  return LOGO_GROUPS.map((group) => ({
    group,
    options: LOGO_OPTIONS.filter((o) => o.group === group),
  }))
}

/** Resolve the actual SVG path for a choice under a given mode. Fixed-colour
 *  marks ignore the mode; ink-paired marks pick the legible ink. */
export function logoSrc(id: LogoChoiceId, mode: 'light' | 'dark'): string {
  const opt = BY_ID.get(id) ?? LOGO_OPTIONS[0]
  return 'fixed' in opt.src ? opt.src.fixed : opt.src[mode]
}

/** Full choice-id -> { dark, light } src map (fed to the pre-paint inline
 *  script + the body brand-mark sync). Fixed marks map to the same file. */
export function logoFileMap(): Record<LogoChoiceId, { dark: string; light: string }> {
  return Object.fromEntries(
    LOGO_OPTIONS.map((o) => {
      const dark = 'fixed' in o.src ? o.src.fixed : o.src.dark
      const light = 'fixed' in o.src ? o.src.fixed : o.src.light
      return [o.id, { dark, light }]
    }),
  )
}
