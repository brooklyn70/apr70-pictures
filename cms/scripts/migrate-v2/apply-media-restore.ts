/**
 * Phase 4 — After v2 files are rsync'd onto the CMS media volume: create `media` rows
 * and PATCH `projects` + `news` layouts so block media relations point at v3 ids.
 *
 * Env:
 *   CMS_URL, PAYLOAD_SEED_EMAIL, PAYLOAD_SEED_PASSWORD (same as migrate:v2:apply)
 *   MEDIA_ROOT — absolute path to mounted v2 public tree (default: /app/media in stack)
 */

import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { discoverJsonDocuments } from './discover.js'
import { importV2MediaFiles } from './import-v2-media.js'
import { inferDocumentId, mapV2DocumentToLayout } from './map-layout.js'
import { CMS_URL, payloadJwtLogin } from './payload-rest.js'
import { rewriteV2MediaRefs } from './rewrite-v2-media-refs.js'
import {
  collectV2MediaPathsFromNewsDoc,
  collectV2MediaPathsFromProjectDoc,
} from './v2-media-id-map.js'

const MEDIA_ROOT = process.env.MEDIA_ROOT ?? '/app/media'

export type ApplyMediaRestoreReport = {
  generatedAt: string
  v2Root: string
  mediaRoot: string
  uniqueV2MediaIds: number
  import: {
    imported: number
    reused: number
    skippedMissingFile: number
    skippedTooLarge: number
  }
  projectsPatched: number
  newsPatched: number
  warnings: string[]
  errors: string[]
}

async function findCollectionIdBySlug(
  collection: string,
  slug: string,
  token: string,
): Promise<number | null> {
  const res = await fetch(
    `${CMS_URL}/api/${collection}?where[slug][equals]=${encodeURIComponent(slug)}&depth=0&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  if (!res.ok) return null
  const data = (await res.json()) as { docs?: Array<{ id: number }> }
  const id = data.docs?.[0]?.id
  return typeof id === 'number' ? id : null
}

async function patchCollectionLayout(
  collection: string,
  id: number,
  layout: unknown[],
  token: string,
): Promise<void> {
  const res = await fetch(`${CMS_URL}/api/${collection}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({ layout }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`PATCH /api/${collection}/${id} failed: ${res.status} ${body}`)
  }
}

export async function runApplyMediaRestore(v2Root: string): Promise<ApplyMediaRestoreReport> {
  const resolvedRoot = path.resolve(v2Root)
  const warnings: string[] = []
  const errors: string[] = []
  const idToPath = new Map<number, string>()

  const files = await discoverJsonDocuments(resolvedRoot)

  for (const f of files) {
    if (!f.absolutePath.endsWith('.json')) continue
    const rel = f.relativePath.replaceAll('\\', '/')
    const isProject = f.kind === 'project' || rel.includes('/projects/')
    const isNews = rel.includes('/news/')
    if (!isProject && !isNews) continue

    let text: string
    try {
      text = await readFile(f.absolutePath, 'utf8')
    } catch (e) {
      warnings.push(`${f.relativePath}: read failed: ${String(e)}`)
      continue
    }
    let doc: unknown
    try {
      doc = JSON.parse(text)
    } catch (e) {
      warnings.push(`${f.relativePath}: JSON parse failed: ${String(e)}`)
      continue
    }
    if (!doc || typeof doc !== 'object') continue
    const rec = doc as Record<string, unknown>

    if (isNews) {
      if (rec.entryType === 'site_intro') continue
      const { idToPath: m, warnings: w } = collectV2MediaPathsFromNewsDoc(rec, f.relativePath)
      for (const [k, v] of m) {
        const prev = idToPath.get(k)
        if (prev === undefined) idToPath.set(k, v)
        else if (prev !== v) {
          warnings.push(`${f.relativePath}: news media id ${k} path conflict; keeping first`)
        }
      }
      warnings.push(...w)
    }

    if (isProject) {
      const { idToPath: m, warnings: w } = collectV2MediaPathsFromProjectDoc(rec, f.relativePath)
      for (const [k, v] of m) {
        const prev = idToPath.get(k)
        if (prev === undefined) idToPath.set(k, v)
        else if (prev !== v) {
          warnings.push(`${f.relativePath}: project media id ${k} path conflict; keeping first`)
        }
      }
      warnings.push(...w)
    }
  }

  const token = await payloadJwtLogin()

  const importResult = await importV2MediaFiles({
    mediaRoot: MEDIA_ROOT,
    idToV2Path: idToPath,
    token,
  })
  warnings.push(...importResult.warnings)
  errors.push(...importResult.errors)

  const v2ToV3 = importResult.v2ToV3

  let projectsPatched = 0
  let newsPatched = 0

  for (const f of files.filter((x) => x.kind === 'project' || x.relativePath.replaceAll('\\', '/').includes('/projects/'))) {
    if (!f.absolutePath.endsWith('.json')) continue
    let text: string
    try {
      text = await readFile(f.absolutePath, 'utf8')
    } catch {
      continue
    }
    let doc: unknown
    try {
      doc = JSON.parse(text)
    } catch {
      continue
    }
    if (!doc || typeof doc !== 'object') continue
    const rec = doc as Record<string, unknown>
    const basenameId = path.basename(f.relativePath, path.extname(f.relativePath))
    const id = inferDocumentId(rec, basenameId)
    const slug = typeof rec.slug === 'string' ? rec.slug : id
    const mapped = mapV2DocumentToLayout(doc, { sourcePath: f.relativePath, basenameId: id })
    warnings.push(...mapped.warnings)
    const layout = rewriteV2MediaRefs(mapped.layout, v2ToV3) as unknown[]

    const docId = await findCollectionIdBySlug('projects', slug, token)
    if (docId === null) {
      warnings.push(`projects slug=${slug}: not found in Payload; run migrate:v2:apply first`)
      continue
    }
    try {
      await patchCollectionLayout('projects', docId, layout, token)
      projectsPatched += 1
    } catch (e) {
      errors.push(`projects/${slug}: ${String(e)}`)
    }
  }

  for (const f of files.filter((x) => x.relativePath.replaceAll('\\', '/').includes('/news/'))) {
    if (!f.absolutePath.endsWith('.json')) continue
    let text: string
    try {
      text = await readFile(f.absolutePath, 'utf8')
    } catch {
      continue
    }
    let doc: unknown
    try {
      doc = JSON.parse(text)
    } catch {
      continue
    }
    if (!doc || typeof doc !== 'object') continue
    const rec = doc as Record<string, unknown>
    if (rec.entryType === 'site_intro') continue

    const basenameId = path.basename(f.relativePath, path.extname(f.relativePath))
    const id = inferDocumentId(rec, basenameId)
    const slug = typeof rec.slug === 'string' ? rec.slug : id
    const mapped = mapV2DocumentToLayout(doc, { sourcePath: f.relativePath, basenameId: id })
    warnings.push(...mapped.warnings)
    const layout = rewriteV2MediaRefs(mapped.layout, v2ToV3) as unknown[]

    const docId = await findCollectionIdBySlug('news', slug, token)
    if (docId === null) {
      warnings.push(`news slug=${slug}: not found in Payload; run migrate:v2:apply first`)
      continue
    }
    try {
      await patchCollectionLayout('news', docId, layout, token)
      newsPatched += 1
    } catch (e) {
      errors.push(`news/${slug}: ${String(e)}`)
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    v2Root: resolvedRoot,
    mediaRoot: MEDIA_ROOT,
    uniqueV2MediaIds: idToPath.size,
    import: {
      imported: importResult.imported,
      reused: importResult.reused,
      skippedMissingFile: importResult.skippedMissingFile,
      skippedTooLarge: importResult.skippedTooLarge,
    },
    projectsPatched,
    newsPatched,
    warnings,
    errors,
  }
}

export function formatApplyMediaRestoreConsole(report: ApplyMediaRestoreReport): string {
  const lines = [
    'apr70 v2 -> v3 media restore',
    `v2Root: ${report.v2Root}`,
    `mediaRoot: ${report.mediaRoot}`,
    `generatedAt: ${report.generatedAt}`,
    '',
    `Unique v2 media ids in export: ${report.uniqueV2MediaIds}`,
    `Media rows created (new uploads): ${report.import.imported}`,
    `Media rows reused (already imported): ${report.import.reused}`,
    `Skipped (missing file on volume): ${report.import.skippedMissingFile}`,
    `Skipped (over size limit): ${report.import.skippedTooLarge}`,
    '',
    `Projects layout patched: ${report.projectsPatched}`,
    `News layout patched: ${report.newsPatched}`,
    '',
    `Warnings: ${report.warnings.length}`,
    `Errors: ${report.errors.length}`,
  ]
  for (const w of report.warnings) lines.push(`  WARN  ${w}`)
  for (const e of report.errors) lines.push(`  ERROR ${e}`)
  if (report.errors.length === 0) {
    lines.push('')
    lines.push('Verify in Payload admin: /admin -> Media, Projects, News.')
  }
  return lines.join('\n')
}
