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
 * Theme cull (Wave G2, 2026-07-06 rulings round 2): only screening-room
 * (default) + cutting-room are LIVE in the picker. photoplay / trade-paper /
 * picture-palace are retired from the visible list — their css/motion files
 * stay dormant on disk, and the slug stays in the TYPE union (the motion
 * dispatcher + dev theme-studio still reference them), but they are absent
 * from `DESIGNS`, so `isDesignSlug`/`resolveDesign` coerce any stored value of
 * theirs (and any legacy signature/noir/… slug) cleanly to screening-room.
 */

export type DesignSlug =
  | 'screening-room'
  | 'cutting-room'
  /* dormant — retired from the picker, css/motion kept on disk; never a live
     selection, always coerced to screening-room if stored. */
  | 'photoplay'
  | 'trade-paper'
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

/** LIVE picker slate — only these two are visitor-selectable (Wave G2 cull). */
export const DESIGNS: DesignManifest[] = [
  {
    slug: 'screening-room',
    name: 'Screening Room',
    blurb: 'Dark poster modernism. Futura Heavy at reel scale, orange leader, sprocket chrome. House lights down.',
    base: 'dark',
    swatch: ['#000000', '#E85D04', '#ffffff'],
  },
  {
    slug: 'cutting-room',
    name: 'Cutting Room',
    blurb: 'The bench. Timecode gutters, frame counters, Futura specimen blocks. Black and white, hard cuts only.',
    base: 'dark',
    swatch: ['#0a0a0a', '#f4f4f2', '#E85D04'],
    recommendedFor: ['nrc'],
  },
]

export const DEFAULT_DESIGN: DesignSlug = 'screening-room'

/** Sensible per-division skin for the dev theme-studio preview surface only.
 *  Restricted to LIVE themes after the cull. */
export const DIVISION_DEFAULT_DESIGN: Record<'212' | '310' | 'nrc', DesignSlug> = {
  '212': 'screening-room',
  '310': 'screening-room',
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
  font: 'apr70:font',
  accent: 'apr70:accent',
  pickerPos: 'apr70:picker-pos',
} as const

/* ============================================================
   FONT DEPLOYMENTS — visitor-selected global type preference.
   Four curated deployments using ONLY the faces already on disk
   (Futura Std, Futura Std Condensed, Barlow, Share Tech Mono,
   Georgia system stack — NO new webfont deps). Stamped as
   data-font on <html>; token rebinds live in theme-control.css
   (html[data-font="…"] overrides --font-display/-body/-mono).
   Persisted apr70:font. Default 'house'.
   ============================================================ */
export type FontDeployment = 'house' | 'condensed' | 'serif' | 'mono'

export interface FontOption {
  id: FontDeployment
  /** Picker label. */
  label: string
  /** One-line spec for the panel. */
  note: string
  /** Tiny specimen string rendered in the deployment's own display face. */
  specimen: string
}

export const FONT_OPTIONS: FontOption[] = [
  { id: 'house', label: 'House', note: 'Futura display · Barlow body', specimen: 'Aa' },
  { id: 'condensed', label: 'Condensed', note: 'Futura Condensed display', specimen: 'Aa' },
  { id: 'serif', label: 'Serif Text', note: 'Futura display · Georgia body', specimen: 'Aa' },
  { id: 'mono', label: 'Mono', note: 'Share Tech Mono labels & body', specimen: 'Aa' },
]

export const DEFAULT_FONT: FontDeployment = 'house'

const FONT_IDS = new Set(FONT_OPTIONS.map((f) => f.id))

export function isFontDeployment(value: unknown): value is FontDeployment {
  return typeof value === 'string' && FONT_IDS.has(value as FontDeployment)
}

export function resolveFont(value: unknown): FontDeployment {
  return isFontDeployment(value) ? value : DEFAULT_FONT
}

/* ============================================================
   DIVISION ACCENT — visitor-selected global --accent preference.
   Drives --accent (nav active, leader-tab chip, cursor-adjacent
   chrome). Stamped as data-accent on <html>; token rebinds live
   in theme-control.css (html[data-accent="…"]). Persisted
   apr70:accent. Default 'auto' = follow the active theme's accent
   (which is sicilian-orange on the house theme). See the accent
   precedence note in theme-control.css: page-forced > user-picked
   > theme default.
   ============================================================ */
export type AccentChoice = 'auto' | 'orange' | 'amber' | 'blue' | 'navy' | 'teal'

export interface AccentOption {
  id: AccentChoice
  label: string
  /** Swatch hex, or null for 'auto' (rendered as a theme-default chip). */
  hex: string | null
}

/** DESIGN.md palette. 'auto' first (default), then the five division inks. */
export const ACCENT_OPTIONS: AccentOption[] = [
  { id: 'auto', label: 'Auto', hex: null },
  { id: 'orange', label: 'Sicilian Orange', hex: '#E85D04' },
  { id: 'amber', label: '212 Amber', hex: '#824B07' },
  { id: 'blue', label: '310 Sicilian Blue', hex: '#0077B6' },
  { id: 'navy', label: 'NRC Navy', hex: '#001F3F' },
  { id: 'teal', label: '310 Teal', hex: '#077082' },
]

export const DEFAULT_ACCENT: AccentChoice = 'auto'

const ACCENT_IDS = new Set(ACCENT_OPTIONS.map((a) => a.id))

export function isAccentChoice(value: unknown): value is AccentChoice {
  return typeof value === 'string' && ACCENT_IDS.has(value as AccentChoice)
}

export function resolveAccent(value: unknown): AccentChoice {
  return isAccentChoice(value) ? value : DEFAULT_ACCENT
}

/** Logo-size slider bounds (nav mark height in px). */
export const LOGO_SIZE = { min: 24, max: 72, default: 34 } as const

export function resolveLogoSize(value: unknown): number {
  const n = typeof value === 'string' ? parseInt(value, 10) : typeof value === 'number' ? value : NaN
  if (!Number.isFinite(n)) return LOGO_SIZE.default
  return Math.min(LOGO_SIZE.max, Math.max(LOGO_SIZE.min, Math.round(n)))
}
