/**
 * Theme registry — apr70 design layer.
 *
 * Each "design" is a named skin: shared block content rendered through a
 * scoped set of token overrides under `[data-design="<slug>"]`
 * (see `web/src/styles/designs.css`). Content is untouched — only the palette,
 * surface ramp, and display font rebind.
 *
 * v4 (2026-07-05): themes are GLOBAL and visitor-selected. The choice lives in
 * localStorage (`apr70:design`), is stamped pre-paint by Layout.astro, and is
 * changed live via ThemeControlIsland. Divisions no longer force a skin; the
 * Payload `theme` field is dormant (schema kept) and DIVISION_DEFAULT_DESIGN
 * remains only for the dev theme-studio preview surface.
 */

export type DesignSlug =
  | 'signature'
  | 'noir'
  | 'amber-heat'
  | 'imax-deep'
  | 'daylight'

export interface DesignManifest {
  slug: DesignSlug
  name: string
  blurb: string
  /** Base surface the theme paints on. Drives the preview chip + light-mode hint. */
  base: 'dark' | 'light'
  /** 1–3 representative hexes for the picker swatch. */
  swatch: string[]
  recommendedFor?: Array<'212' | '310' | 'nrc'>
}

export const DESIGNS: DesignManifest[] = [
  {
    slug: 'signature',
    name: 'Signature',
    blurb: 'The house style — amber / IMAX teal / NRC grey on true black. Vignelli-Munari, sprocket DNA.',
    base: 'dark',
    swatch: ['#000000', '#824B07', '#077082'],
  },
  {
    slug: 'noir',
    name: 'Noir',
    blurb: 'Stark monochrome. Pure black, white type, a single grey accent. Maximum contrast, zero warmth.',
    base: 'dark',
    swatch: ['#000000', '#ffffff', '#c8c8c8'],
    recommendedFor: ['nrc'],
  },
  {
    slug: 'amber-heat',
    name: 'Amber Heat',
    blurb: 'Warm and editorial. Sicilian amber + orange lead on a near-black warm ground. New York television.',
    base: 'dark',
    swatch: ['#0a0705', '#824B07', '#E85D04'],
    recommendedFor: ['212'],
  },
  {
    slug: 'imax-deep',
    name: 'IMAX Deep',
    blurb: 'Cool and cinematic. IMAX teal + Sicilian blue over deep navy. Elevated genre, global scale.',
    base: 'dark',
    swatch: ['#001F3F', '#077082', '#0077B6'],
    recommendedFor: ['310'],
  },
  {
    slug: 'daylight',
    name: 'Daylight',
    blurb: 'Bright museum-wall editorial. Off-white surface, near-black ink, amber accent. The light alternative.',
    base: 'light',
    swatch: ['#FAFAF8', '#1A1A1A', '#824B07'],
  },
]

export const DEFAULT_DESIGN: DesignSlug = 'signature'

/** Sensible per-division skin when admin hasn't overridden in Payload. */
export const DIVISION_DEFAULT_DESIGN: Record<'212' | '310' | 'nrc', DesignSlug> = {
  '212': 'amber-heat',
  '310': 'imax-deep',
  nrc: 'noir',
}

const SLUGS = new Set(DESIGNS.map((d) => d.slug))

export function isDesignSlug(value: unknown): value is DesignSlug {
  return typeof value === 'string' && SLUGS.has(value as DesignSlug)
}

/** Coerce any input (Payload field, query param, undefined) to a valid slug. */
export function resolveDesign(value: unknown, fallback: DesignSlug = DEFAULT_DESIGN): DesignSlug {
  return isDesignSlug(value) ? value : fallback
}

/** Theme base maps to the existing light/dark token mode for `data-theme`. */
export function designThemeMode(slug: DesignSlug): 'light' | 'dark' {
  return DESIGNS.find((d) => d.slug === slug)?.base === 'light' ? 'light' : 'dark'
}
