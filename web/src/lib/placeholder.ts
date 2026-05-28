// Render-time placeholder picker. Returns a URL under /brand/placeholders/
// for any block that hasn't been given a Media reference yet. See
// web/public/brand/placeholders/README.md.

export type PlaceholderAspect = '16x9' | '4x3' | '1x1' | '9x16'
export type PlaceholderDivision = 'default' | '212' | '310' | 'nrc'

export interface PlaceholderOptions {
  aspect?: PlaceholderAspect
  /**
   * Division tint hint. Accepts the canonical division code (`212`/`310`/`nrc`),
   * the long form (`pictures-212`/`pictures-310`), or null/undefined for the
   * neutral slate placeholder.
   */
  division?: string | null
}

const ASPECTS: ReadonlySet<PlaceholderAspect> = new Set(['16x9', '4x3', '1x1', '9x16'])

function normalizeDivision(d?: string | null): PlaceholderDivision {
  if (!d) return 'default'
  const s = String(d).toLowerCase()
  if (s.includes('212')) return '212'
  if (s.includes('310')) return '310'
  if (s.includes('nrc')) return 'nrc'
  return 'default'
}

export function placeholderUrl(opts: PlaceholderOptions = {}): string {
  const aspect: PlaceholderAspect = opts.aspect && ASPECTS.has(opts.aspect) ? opts.aspect : '16x9'
  const division = normalizeDivision(opts.division)
  return `/brand/placeholders/placeholder-${aspect}-${division}.svg`
}
