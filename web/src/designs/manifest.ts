/**
 * Theme registry — apr70 design layer (V4 five-theme slate).
 *
 * Each "design" is a full DESIGN, not a palette: its own typography deployment,
 * layout personality, texture and motion signature, deployed under
 * `[data-design="<slug>"]` (see `web/src/styles/themes/<slug>.css`). Content is
 * untouched — the theme layer restyles it.
 *
 * v4 (2026-07-06): themes are GLOBAL and visitor-selected (localStorage
 * `apr70:design`), stamped pre-paint by Layout.astro, changed live by the
 * control panel. Light/dark is now INDEPENDENT of theme (see `resolveMode`):
 * every theme ships a DEFAULT mode, and a visible toggle overrides it
 * (localStorage `apr70:mode`; null = follow the theme default).
 *
 * Legacy slugs (signature/noir/amber-heat/imax-deep/daylight) are retired;
 * any stored legacy value falls back cleanly to screening-room.
 */

export type DesignSlug =
  | 'screening-room'
  | 'photoplay'
  | 'trade-paper'
  | 'cutting-room'
  | 'picture-palace'

export type ThemeMode = 'light' | 'dark'

export interface DesignManifest {
  slug: DesignSlug
  name: string
  /** One line of personality for the control-panel chip. */
  blurb: string
  /** The theme's DEFAULT light/dark mode (overridable by the mode toggle). */
  base: ThemeMode
  /** 1–3 representative hexes for the picker swatch. */
  swatch: string[]
  recommendedFor?: Array<'212' | '310' | 'nrc'>
}

export const DESIGNS: DesignManifest[] = [
  {
    slug: 'screening-room',
    name: 'Screening Room',
    blurb: 'Dark poster modernism. Futura Heavy at reel scale, orange leader, sprocket chrome. House lights down.',
    base: 'dark',
    swatch: ['#000000', '#E85D04', '#ffffff'],
  },
  {
    slug: 'photoplay',
    name: 'Photoplay',
    blurb: 'Picture-magazine glamour. Condensed cover lines, halftone plates, issue seals. Ivory paper, developed like a print.',
    base: 'light',
    swatch: ['#f4efe4', '#171006', '#E85D04'],
    recommendedFor: ['212'],
  },
  {
    slug: 'trade-paper',
    name: 'Trade Paper',
    blurb: 'Broadsheet of record. Justified columns, drop caps, double rules. Nothing flies; everything is filed.',
    base: 'light',
    swatch: ['#eae6dd', '#1c1208', '#824B07'],
  },
  {
    slug: 'cutting-room',
    name: 'Cutting Room',
    blurb: 'The bench. Timecode gutters, frame counters, Share Tech Mono. Black and white, hard cuts only.',
    base: 'dark',
    swatch: ['#0a0a0a', '#f4f4f2', '#E85D04'],
    recommendedFor: ['nrc'],
  },
  {
    slug: 'picture-palace',
    name: 'Picture Palace',
    blurb: 'Night-marquee deco. Vertical letter towers, footlight glow, brass hairlines. Blue on a deco night.',
    base: 'dark',
    swatch: ['#050810', '#0077B6', '#ffffff'],
    recommendedFor: ['310'],
  },
]

export const DEFAULT_DESIGN: DesignSlug = 'screening-room'

/** Sensible per-division skin for the dev theme-studio preview surface only. */
export const DIVISION_DEFAULT_DESIGN: Record<'212' | '310' | 'nrc', DesignSlug> = {
  '212': 'photoplay',
  '310': 'picture-palace',
  nrc: 'cutting-room',
}

const SLUGS = new Set(DESIGNS.map((d) => d.slug))

export function isDesignSlug(value: unknown): value is DesignSlug {
  return typeof value === 'string' && SLUGS.has(value as DesignSlug)
}

/** Coerce any input (Payload field, query param, legacy localStorage, undefined)
 *  to a valid slug — legacy slugs land on the default, never a broken state. */
export function resolveDesign(value: unknown, fallback: DesignSlug = DEFAULT_DESIGN): DesignSlug {
  return isDesignSlug(value) ? value : fallback
}

/** The DEFAULT light/dark mode a theme paints on (before any mode override). */
export function designThemeMode(slug: DesignSlug): ThemeMode {
  return DESIGNS.find((d) => d.slug === slug)?.base === 'light' ? 'light' : 'dark'
}

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark'
}

/** Effective mode: an explicitly-stored mode overrides; otherwise follow the
 *  active theme's default. `null`/invalid stored value = follow the theme. */
export function resolveMode(stored: unknown, design: DesignSlug): ThemeMode {
  return isThemeMode(stored) ? stored : designThemeMode(design)
}

/** localStorage keys owned by the theme/control layer. */
export const STORAGE_KEYS = {
  design: 'apr70:design',
  mode: 'apr70:mode',
  logo: 'apr70:logo',
  logoSize: 'apr70:logo-size',
  fontScale: 'apr70:font-scale',
  pickerPos: 'apr70:picker-pos',
} as const

/** Logo-size slider bounds (nav mark height in px). */
export const LOGO_SIZE = { min: 24, max: 72, default: 34 } as const

export function resolveLogoSize(value: unknown): number {
  const n = typeof value === 'string' ? parseInt(value, 10) : typeof value === 'number' ? value : NaN
  if (!Number.isFinite(n)) return LOGO_SIZE.default
  return Math.min(LOGO_SIZE.max, Math.max(LOGO_SIZE.min, Math.round(n)))
}
