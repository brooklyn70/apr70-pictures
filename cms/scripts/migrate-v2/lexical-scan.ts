const VALID_COLOR_TOKENS = new Set([
  '212-amber',
  '212-sicilian-orange',
  '310-imax',
  'nrc-grey',
  '310-sicilian-blue',
  'nrc-navy',
])

/**
 * Walk arbitrary JSON and collect Color Injector token slugs from Lexical-like nodes
 * (`color` on text-shaped objects) plus plausible media path strings.
 */
export function scanLexicalAndMediaRefs(value: unknown): {
  colorTokens: Set<string>
  mediaLikePaths: Set<string>
} {
  const colorTokens = new Set<string>()
  const mediaLikePaths = new Set<string>()

  const visit = (v: unknown): void => {
    if (v === null || v === undefined) return
    if (typeof v === 'string') {
      if (
        (v.startsWith('/') && /\.(webp|png|jpe?g|gif|svg|avif)$/i.test(v)) ||
        v.startsWith('media/') ||
        v.includes('/uploads/')
      ) {
        mediaLikePaths.add(v)
      }
      return
    }
    if (Array.isArray(v)) {
      for (const item of v) visit(item)
      return
    }
    if (typeof v === 'object') {
      const o = v as Record<string, unknown>
      if (typeof o.color === 'string' && VALID_COLOR_TOKENS.has(o.color)) {
        colorTokens.add(o.color)
      }
      if (typeof o.src === 'string') mediaLikePaths.add(o.src)
      if (typeof o.url === 'string') mediaLikePaths.add(o.url)
      for (const k of Object.keys(o)) visit(o[k])
    }
  }

  visit(value)
  return { colorTokens, mediaLikePaths }
}

export function countLexicalRoots(value: unknown): number {
  let n = 0
  const visit = (v: unknown): void => {
    if (v === null || v === undefined) return
    if (Array.isArray(v)) {
      for (const item of v) visit(item)
      return
    }
    if (typeof v === 'object') {
      const o = v as Record<string, unknown>
      if (o.root && typeof o.root === 'object') {
        const r = o.root as Record<string, unknown>
        if (r.type === 'root') n += 1
      }
      for (const k of Object.keys(o)) visit(o[k])
    }
  }
  visit(value)
  return n
}
