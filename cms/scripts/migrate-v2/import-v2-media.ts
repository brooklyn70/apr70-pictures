/**
 * Create Payload `media` rows for v2 files on the CMS media volume (idempotent by stable filename).
 */

import { createReadStream } from 'node:fs'
import { access, stat } from 'node:fs/promises'
import path from 'node:path'

import { CMS_URL } from './payload-rest.js'
import { v2PublicPathToRelativeFsPath } from './v2-media-id-map.js'

const MIME_BY_EXT: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.html': 'text/html',
  '.htm': 'text/html',
}

function guessMime(fsPath: string): string {
  const ext = path.extname(fsPath).toLowerCase()
  return MIME_BY_EXT[ext] ?? 'application/octet-stream'
}

function stableUploadFilename(v2Id: number, v2PublicPath: string): string {
  const rel = v2PublicPathToRelativeFsPath(v2PublicPath)
  const base = path.posix.basename(rel.replaceAll(path.sep, '/'))
  return `v2-id-${v2Id}-${base}`
}

function migrationAltText(v2Id: number, relFs: string): string {
  return `[v2-media-id:${v2Id}] ${relFs}`
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

async function findMediaIdByFilename(token: string, filename: string): Promise<number | null> {
  const res = await fetch(
    `${CMS_URL}/api/media?where[filename][equals]=${encodeURIComponent(filename)}&depth=0&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  if (!res.ok) return null
  const data = (await res.json()) as { docs?: Array<{ id: number }> }
  const id = data.docs?.[0]?.id
  return typeof id === 'number' ? id : null
}

async function findMediaIdByAltExact(token: string, alt: string): Promise<number | null> {
  const res = await fetch(
    `${CMS_URL}/api/media?where[alt][equals]=${encodeURIComponent(alt)}&depth=0&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  if (!res.ok) return null
  const data = (await res.json()) as { docs?: Array<{ id: number }> }
  const id = data.docs?.[0]?.id
  return typeof id === 'number' ? id : null
}

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

async function postMediaUpload(
  token: string,
  absolutePath: string,
  uploadFilename: string,
  alt: string,
): Promise<number> {
  const mime = guessMime(absolutePath)
  const size = (await stat(absolutePath)).size

  const fileStream = createReadStream(absolutePath)
  const fileBlob = new Blob([await streamToBuffer(fileStream)], { type: mime })

  const form = new FormData()
  form.append('file', fileBlob, uploadFilename)
  form.append('_payload', JSON.stringify({ alt }))

  const res = await fetch(`${CMS_URL}/api/media`, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}` },
    body: form,
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`POST /api/media failed (${uploadFilename}, ${size} bytes): ${res.status} ${body}`)
  }
  const doc = (await res.json()) as { doc?: { id: number }; id?: number }
  const id = doc.doc?.id ?? doc.id
  if (typeof id !== 'number') throw new Error(`POST /api/media: missing id in response for ${uploadFilename}`)
  return id
}

export type ImportV2MediaOptions = {
  mediaRoot: string
  idToV2Path: ReadonlyMap<number, string>
  token: string
  /** Skip files larger than this (bytes). Default 512 MB. */
  maxFileBytes?: number
}

export type ImportV2MediaResult = {
  v2ToV3: Map<number, number>
  imported: number
  reused: number
  skippedMissingFile: number
  skippedTooLarge: number
  warnings: string[]
  errors: string[]
}

/**
 * For each v2 media id, ensure a `media` document exists (upload if missing).
 * Uses stable Payload `filename` = `v2-id-{id}-{originalBasename}` for idempotency.
 */
export async function importV2MediaFiles(opts: ImportV2MediaOptions): Promise<ImportV2MediaResult> {
  const maxFileBytes = opts.maxFileBytes ?? 512 * 1024 * 1024
  const v2ToV3 = new Map<number, number>()
  const warnings: string[] = []
  const errors: string[] = []
  let imported = 0
  let reused = 0
  let skippedMissingFile = 0
  let skippedTooLarge = 0

  const sortedIds = [...opts.idToV2Path.keys()].sort((a, b) => a - b)

  for (const v2Id of sortedIds) {
    const v2Path = opts.idToV2Path.get(v2Id)
    if (!v2Path) continue

    const relFs = v2PublicPathToRelativeFsPath(v2Path)
    const abs = path.join(opts.mediaRoot, relFs)
    const uploadFilename = stableUploadFilename(v2Id, v2Path)
    const alt = migrationAltText(v2Id, relFs)

    let existing = await findMediaIdByFilename(opts.token, uploadFilename)
    if (existing === null) {
      existing = await findMediaIdByAltExact(opts.token, alt)
    }
    if (existing !== null) {
      v2ToV3.set(v2Id, existing)
      reused += 1
      continue
    }

    if (!(await fileExists(abs))) {
      warnings.push(`v2 media ${v2Id}: file missing on volume (${abs})`)
      skippedMissingFile += 1
      continue
    }

    let size = 0
    try {
      size = (await stat(abs)).size
    } catch (e) {
      warnings.push(`v2 media ${v2Id}: stat failed (${abs}): ${String(e)}`)
      skippedMissingFile += 1
      continue
    }

    if (size > maxFileBytes) {
      warnings.push(`v2 media ${v2Id}: skip large file (${size} bytes > ${maxFileBytes}): ${abs}`)
      skippedTooLarge += 1
      continue
    }

    try {
      const v3Id = await postMediaUpload(opts.token, abs, uploadFilename, alt)
      v2ToV3.set(v2Id, v3Id)
      imported += 1
    } catch (e) {
      errors.push(`v2 media ${v2Id}: ${String(e)}`)
    }
  }

  return { v2ToV3, imported, reused, skippedMissingFile, skippedTooLarge, warnings, errors }
}
