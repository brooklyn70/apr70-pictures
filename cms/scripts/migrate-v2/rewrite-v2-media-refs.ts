/**
 * Replace v2 numeric Payload media ids in layout JSON with v3 `media` collection ids.
 * Mirrors the key rules in `stripV2MediaRefs` (apply.ts).
 */
export function rewriteV2MediaRefs(value: unknown, v2ToV3: ReadonlyMap<number, number>): unknown {
  if (Array.isArray(value)) return value.map((x) => rewriteV2MediaRefs(x, v2ToV3))
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const isMediaKey = k === 'media' || k === 'heroImage' || k.toLowerCase().includes('media')
      if (isMediaKey && typeof v === 'number') {
        const mapped = v2ToV3.get(v)
        out[k] = mapped !== undefined ? mapped : null
      } else {
        out[k] = rewriteV2MediaRefs(v, v2ToV3)
      }
    }
    return out
  }
  return value
}
