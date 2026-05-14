/**
 * Build v2 numeric media id → public URL path (leading slash) from project / news JSON.
 * Paths match rsync source layout under the v2 public root (mounted at /app/media).
 */

export type V2MediaIdMapResult = {
  /** v2 Payload media id → path like `/slate/foo/hero/bar.png` */
  idToPath: Map<number, string>
  warnings: string[]
}

function addPair(
  map: Map<number, string>,
  warnings: string[],
  id: unknown,
  pathVal: unknown,
  context: string,
): void {
  if (typeof id !== 'number' || !Number.isFinite(id)) return
  if (typeof pathVal !== 'string' || !pathVal.startsWith('/')) {
    warnings.push(`${context}: media id ${id} has no usable string path; skipped`)
    return
  }
  const existing = map.get(id)
  if (existing !== undefined && existing !== pathVal) {
    warnings.push(`${context}: media id ${id} path conflict (${existing} vs ${pathVal}); keeping first`)
    return
  }
  map.set(id, pathVal)
}

/** Collect hero, gallery, and attachment media paths from a v2 project document. */
export function collectV2MediaPathsFromProjectDoc(doc: Record<string, unknown>, sourcePath: string): V2MediaIdMapResult {
  const idToPath = new Map<number, string>()
  const warnings: string[] = []
  const ctx = sourcePath

  addPair(idToPath, warnings, doc.heroImageMedia, doc.heroImage, ctx)

  const images = doc.images
  if (Array.isArray(images)) {
    for (const row of images) {
      if (!row || typeof row !== 'object') continue
      const r = row as Record<string, unknown>
      addPair(idToPath, warnings, r.imageMedia, r.path, ctx)
    }
  }

  const attachments = doc.attachments
  if (Array.isArray(attachments)) {
    for (const row of attachments) {
      if (!row || typeof row !== 'object') continue
      const r = row as Record<string, unknown>
      addPair(idToPath, warnings, r.attachmentMedia, r.url, ctx)
    }
  }

  return { idToPath, warnings }
}

/** Collect image paths from a v2 news article document. */
export function collectV2MediaPathsFromNewsDoc(doc: Record<string, unknown>, sourcePath: string): V2MediaIdMapResult {
  const idToPath = new Map<number, string>()
  const warnings: string[] = []
  const ctx = sourcePath

  const images = doc.images
  if (Array.isArray(images)) {
    for (const row of images) {
      if (!row || typeof row !== 'object') continue
      const r = row as Record<string, unknown>
      addPair(idToPath, warnings, r.imageMedia, r.path, ctx)
    }
  }

  const video = doc.video
  if (video && typeof video === 'object') {
    const v = video as Record<string, unknown>
    addPair(idToPath, warnings, v.posterMedia, v.poster, ctx)
  }

  return { idToPath, warnings }
}

/** `/foo/bar%20x.png` → `foo/bar x.png` (relative path for fs and FormData names). */
export function v2PublicPathToRelativeFsPath(v2Path: string): string {
  const trimmed = v2Path.replace(/^\/+/, '')
  return trimmed
    .split('/')
    .map((seg) => {
      try {
        return decodeURIComponent(seg)
      } catch {
        return seg
      }
    })
    .join('/')
}
