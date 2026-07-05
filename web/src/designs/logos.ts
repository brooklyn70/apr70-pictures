/**
 * Brand-mark catalogue — visitor-selectable apr70 logo variants.
 *
 * The picker choice is mark style + sprocket accent only. The black-vs-white
 * FILE is never chosen by the visitor: it auto-resolves from the active
 * design's base mode (dark base -> white mark, light base -> black mark) so a
 * monochrome mark never lands on a matching background and disappears.
 *
 * Files live in web/public/logos/ (copied from the v2 APR_70 repo).
 * Persisted in localStorage under `apr70:logo`.
 */

export type LogoChoiceId =
  | 'full-plain'
  | 'full-amber'
  | 'full-blue'
  | 'full-navy'
  | 'full-orange'
  | 'primary-plain'

export interface LogoOption {
  id: LogoChoiceId
  /** Picker label, e.g. "Full - Amber". */
  label: string
  mark: 'full' | 'primary'
  /** Filename suffix between the ink color and `.svg`. */
  suffix: '' | '_amber_sprockets' | '_blue_sprockets' | '_navy_sprockets' | '_orange_sprockets'
}

export const LOGO_OPTIONS: LogoOption[] = [
  { id: 'full-plain', label: 'Full · Plain', mark: 'full', suffix: '' },
  { id: 'full-amber', label: 'Full · Amber', mark: 'full', suffix: '_amber_sprockets' },
  { id: 'full-blue', label: 'Full · Blue', mark: 'full', suffix: '_blue_sprockets' },
  { id: 'full-navy', label: 'Full · Navy', mark: 'full', suffix: '_navy_sprockets' },
  { id: 'full-orange', label: 'Full · Orange', mark: 'full', suffix: '_orange_sprockets' },
  { id: 'primary-plain', label: 'Primary · Plain', mark: 'primary', suffix: '' },
]

export const DEFAULT_LOGO: LogoChoiceId = 'full-plain'

const IDS = new Set(LOGO_OPTIONS.map((o) => o.id))

export function isLogoChoice(value: unknown): value is LogoChoiceId {
  return typeof value === 'string' && IDS.has(value as LogoChoiceId)
}

export function resolveLogo(value: unknown): LogoChoiceId {
  return isLogoChoice(value) ? value : DEFAULT_LOGO
}

/** Resolve the actual SVG path for a choice under a given base mode. */
export function logoSrc(id: LogoChoiceId, mode: 'light' | 'dark'): string {
  const opt = LOGO_OPTIONS.find((o) => o.id === id) ?? LOGO_OPTIONS[0]
  const ink = mode === 'light' ? 'black' : 'white'
  return `/logos/apr70_logo_${opt.mark}_${ink}${opt.suffix}.svg`
}

/** Full choice-id -> { dark, light } src map (fed to the pre-paint inline script). */
export function logoFileMap(): Record<LogoChoiceId, { dark: string; light: string }> {
  return Object.fromEntries(
    LOGO_OPTIONS.map((o) => [o.id, { dark: logoSrc(o.id, 'dark'), light: logoSrc(o.id, 'light') }]),
  ) as Record<LogoChoiceId, { dark: string; light: string }>
}
