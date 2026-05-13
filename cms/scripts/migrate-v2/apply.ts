/**
 * Phase 4 — live seed (--apply).
 *
 * Uses the Payload REST API to upsert:
 *   - `home` global layout blocks from mapped v2 content
 *   - `about`, `contact`, `jobs`, `pitch`, `investors` global layout blocks
 *   - `site-settings` seededVersion + lastDeployed
 *
 * Idempotent: POST to a global replaces the layout array on every run.
 * Safe to re-run; does not duplicate rows.
 *
 * Prerequisites:
 *   - CMS_URL env var (default: http://cms:3000)
 *   - PAYLOAD_SEED_EMAIL and PAYLOAD_SEED_PASSWORD env vars
 *   - v3 CMS container running and healthy
 */

import { discoverJsonDocuments } from './discover.js'
import { inferDocumentId, mapV2DocumentToLayout } from './map-layout.js'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const SEED_VERSION = '0.3.0'
const CMS_URL = process.env.CMS_URL ?? 'http://cms:3000'

export type ApplyOptions = {
  v2Root: string
  reportPath?: string
}

export type ApplyReport = {
  generatedAt: string
  mode: 'apply'
  seedVersion: string
  v2Root: string
  homeLayoutBlocksWritten: number
  aboutLayoutBlocksWritten: number
  contactLayoutBlocksWritten: number
  jobsLayoutBlocksWritten: number
  pitchLayoutBlocksWritten: number
  investorsLayoutBlocksWritten: number
  projectsWritten: number
  newsArticlesWritten: number
  warnings: string[]
  errors: string[]
}

/** Authenticate with Payload REST API and return a JWT token. */
async function login(): Promise<string> {
  const email = process.env.PAYLOAD_SEED_EMAIL
  const password = process.env.PAYLOAD_SEED_PASSWORD
  if (!email || !password) {
    throw new Error('PAYLOAD_SEED_EMAIL and PAYLOAD_SEED_PASSWORD env vars are required')
  }
  const res = await fetch(`${CMS_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Login failed: ${res.status} ${body}`)
  }
  const data = (await res.json()) as { token?: string }
  if (!data.token) throw new Error('Login response missing token')
  return data.token
}

/** POST to a Payload global slug to update its data. */
async function updateGlobal(slug: string, data: Record<string, unknown>, token: string): Promise<void> {
  const res = await fetch(`${CMS_URL}/api/globals/${slug}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`updateGlobal(${slug}) failed: ${res.status} ${body}`)
  }
}

/** Upsert a collection document by slug field. Creates if missing, patches if exists. */
async function upsertDoc(
  collection: string,
  slugValue: string,
  data: Record<string, unknown>,
  token: string,
): Promise<void> {
  const findRes = await fetch(
    `${CMS_URL}/api/${collection}?where[slug][equals]=${encodeURIComponent(slugValue)}&depth=0&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  if (!findRes.ok) {
    const body = await findRes.text()
    throw new Error(`upsertDoc(${collection}/${slugValue}) find failed: ${findRes.status} ${body}`)
  }
  const found = (await findRes.json()) as { docs?: Array<{ id: number }> }
  const existing = found.docs?.[0]

  if (existing) {
    const patchRes = await fetch(`${CMS_URL}/api/${collection}/${existing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
      body: JSON.stringify(data),
    })
    if (!patchRes.ok) {
      const body = await patchRes.text()
      throw new Error(`upsertDoc(${collection}/${slugValue}) patch failed: ${patchRes.status} ${body}`)
    }
  } else {
    const postRes = await fetch(`${CMS_URL}/api/${collection}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
      body: JSON.stringify(data),
    })
    if (!postRes.ok) {
      const body = await postRes.text()
      throw new Error(`upsertDoc(${collection}/${slugValue}) create failed: ${postRes.status} ${body}`)
    }
  }
}

/** Load, parse, and infer id for a single JSON file. Returns null on failure with warning pushed. */
async function loadAndParse(
  absolutePath: string,
  relativePath: string,
  warnings: string[],
): Promise<{ doc: Record<string, unknown>; id: string } | null> {
  let text: string
  try {
    text = await readFile(absolutePath, 'utf8')
  } catch (e) {
    warnings.push(`${relativePath}: read failed: ${String(e)}`)
    return null
  }
  let doc: unknown
  try {
    doc = JSON.parse(text)
  } catch (e) {
    warnings.push(`${relativePath}: JSON parse failed: ${String(e)}`)
    return null
  }
  if (!doc || typeof doc !== 'object') {
    warnings.push(`${relativePath}: root is not an object; skipped`)
    return null
  }
  const basenameId = path.basename(relativePath, path.extname(relativePath))
  const id = inferDocumentId(doc as Record<string, unknown>, basenameId)
  return { doc: doc as Record<string, unknown>, id }
}

export async function runApply(opts: ApplyOptions): Promise<ApplyReport> {
  const v2Root = path.resolve(opts.v2Root)
  const warnings: string[] = []
  const errors: string[] = []

  // ── 1. Discover + map all v2 documents ──────────────────────────────────────
  const files = await discoverJsonDocuments(v2Root)
  if (files.length === 0) {
    errors.push(`No JSON files found under ${v2Root}. Aborting — nothing to seed.`)
    return {
      generatedAt: new Date().toISOString(),
      mode: 'apply',
      seedVersion: SEED_VERSION,
      v2Root,
      homeLayoutBlocksWritten: 0,
      aboutLayoutBlocksWritten: 0,
      contactLayoutBlocksWritten: 0,
      jobsLayoutBlocksWritten: 0,
      pitchLayoutBlocksWritten: 0,
      investorsLayoutBlocksWritten: 0,
      projectsWritten: 0,
      newsArticlesWritten: 0,
      warnings,
      errors,
    }
  }

  // Index documents by id so we can look up each global
  const docIndex = new Map<string, { doc: Record<string, unknown>; relativePath: string }>()
  for (const f of files) {
    const result = await loadAndParse(f.absolutePath, f.relativePath, warnings)
    if (!result) continue
    docIndex.set(result.id, { doc: result.doc, relativePath: f.relativePath })
  }

  // Map each target global from its v2 document
  function mapGlobal(id: string): unknown[] {
    const entry = docIndex.get(id)
    if (!entry) {
      warnings.push(`No v2 document found with id '${id}'; global will be empty.`)
      return []
    }
    const mapped = mapV2DocumentToLayout(entry.doc, { sourcePath: entry.relativePath, basenameId: id })
    warnings.push(...mapped.warnings)
    return mapped.layout
  }

  const homeLayout = mapGlobal('homepage') ?? mapGlobal('home')
  const aboutLayout = mapGlobal('about')
  const contactLayout = mapGlobal('contact')
  const jobsLayout = mapGlobal('jobs')
  const pitchLayout = mapGlobal('pitch')
  // v2 partners.json maps to investors global
  const investorsLayout = (() => {
    const entry = docIndex.get('partners')
    if (!entry) {
      warnings.push("No v2 document found with id 'partners'; investors global will be empty.")
      return []
    }
    const mapped = mapV2DocumentToLayout(entry.doc, { sourcePath: entry.relativePath, basenameId: 'partners' })
    warnings.push(...mapped.warnings)
    return mapped.layout
  })()

  if ((homeLayout as unknown[]).length === 0) {
    errors.push('No homepage document found or it mapped to 0 blocks. Aborting.')
    return {
      generatedAt: new Date().toISOString(),
      mode: 'apply',
      seedVersion: SEED_VERSION,
      v2Root,
      homeLayoutBlocksWritten: 0,
      aboutLayoutBlocksWritten: 0,
      contactLayoutBlocksWritten: 0,
      jobsLayoutBlocksWritten: 0,
      pitchLayoutBlocksWritten: 0,
      investorsLayoutBlocksWritten: 0,
      projectsWritten: 0,
      newsArticlesWritten: 0,
      warnings,
      errors,
    }
  }

  // ── 2. Authenticate with Payload REST API ────────────────────────────────────
  const token = await login()

  // ── 3. Upsert Home global layout ──────────────────────────────────────────
  await updateGlobal('home', { layout: homeLayout }, token)

  // ── 4. Upsert About global layout ─────────────────────────────────────────
  if ((aboutLayout as unknown[]).length > 0) {
    await updateGlobal('about', { layout: aboutLayout }, token)
  } else {
    warnings.push('about: 0 blocks mapped; skipping updateGlobal for about.')
  }

  // ── 5. Upsert Contact global layout ───────────────────────────────────────
  if ((contactLayout as unknown[]).length > 0) {
    await updateGlobal('contact', { layout: contactLayout }, token)
  } else {
    warnings.push('contact: 0 blocks mapped; skipping updateGlobal for contact.')
  }

  // ── 6. Upsert Jobs global layout ──────────────────────────────────────────
  if ((jobsLayout as unknown[]).length > 0) {
    await updateGlobal('jobs', { layout: jobsLayout }, token)
  } else {
    warnings.push('jobs: 0 blocks mapped; skipping updateGlobal for jobs.')
  }

  // ── 7. Upsert Pitch global layout ─────────────────────────────────────────
  if ((pitchLayout as unknown[]).length > 0) {
    await updateGlobal('pitch', { layout: pitchLayout }, token)
  } else {
    warnings.push('pitch: 0 blocks mapped; skipping updateGlobal for pitch.')
  }

  // ── 8. Upsert Investors global layout ─────────────────────────────────────
  if ((investorsLayout as unknown[]).length > 0) {
    await updateGlobal('investors', { layout: investorsLayout }, token)
  } else {
    warnings.push('investors: 0 blocks mapped; skipping updateGlobal for investors.')
  }

  // ── 9. Seed Projects collection ────────────────────────────────────────────
  let projectsWritten = 0
  for (const f of files.filter((f) => f.kind === 'project')) {
    const result = await loadAndParse(f.absolutePath, f.relativePath, warnings)
    if (!result) continue
    const { doc, id } = result
    const mapped = mapV2DocumentToLayout(doc, { sourcePath: f.relativePath, basenameId: id })
    warnings.push(...mapped.warnings)
    const projectData: Record<string, unknown> = {
      title: doc.title ?? id,
      slug: typeof doc.slug === 'string' ? doc.slug : id,
      division: doc.division ?? null,
      subtitle: doc.subtitle ?? doc.projectFormat ?? null,
      status: doc.status ?? null,
      year: doc.year ?? null,
      layout: mapped.layout,
    }
    try {
      await upsertDoc('projects', projectData.slug as string, projectData, token)
      projectsWritten += 1
    } catch (e) {
      errors.push(`projects/${id}: ${String(e)}`)
    }
  }

  // ── 10. Seed NewsArticles collection ──────────────────────────────────────
  let newsArticlesWritten = 0
  for (const f of files.filter((f) => f.relativePath.replaceAll('\\', '/').includes('news/'))) {
    const result = await loadAndParse(f.absolutePath, f.relativePath, warnings)
    if (!result) continue
    const { doc, id } = result
    // Skip the site_intro meta entry — it is not a real article
    if (doc.entryType === 'site_intro') continue
    const mapped = mapV2DocumentToLayout(doc, { sourcePath: f.relativePath, basenameId: id })
    warnings.push(...mapped.warnings)
    const articleData: Record<string, unknown> = {
      title: doc.title ?? id,
      slug: typeof doc.slug === 'string' ? doc.slug : id,
      date: doc.date ?? null,
      deck: doc.deck ?? null,
      featured: doc.featured ?? false,
      layout: mapped.layout,
    }
    try {
      await upsertDoc('news', articleData.slug as string, articleData, token)
      newsArticlesWritten += 1
    } catch (e) {
      errors.push(`news/${id}: ${String(e)}`)
    }
  }

  // ── 11. Stamp SiteSettings with seed metadata ──────────────────────────────
  await updateGlobal(
    'site-settings',
    { seededVersion: SEED_VERSION, lastDeployed: new Date().toISOString() },
    token,
  )

  return {
    generatedAt: new Date().toISOString(),
    mode: 'apply',
    seedVersion: SEED_VERSION,
    v2Root,
    homeLayoutBlocksWritten: (homeLayout as unknown[]).length,
    aboutLayoutBlocksWritten: (aboutLayout as unknown[]).length,
    contactLayoutBlocksWritten: (contactLayout as unknown[]).length,
    jobsLayoutBlocksWritten: (jobsLayout as unknown[]).length,
    pitchLayoutBlocksWritten: (pitchLayout as unknown[]).length,
    investorsLayoutBlocksWritten: (investorsLayout as unknown[]).length,
    projectsWritten,
    newsArticlesWritten,
    warnings,
    errors,
  }
}

export function formatApplyReportConsole(report: ApplyReport): string {
  const lines = [
    `apr70 v2 -> v3 seed (apply)  seedVersion=${report.seedVersion}`,
    `v2Root: ${report.v2Root}`,
    `generatedAt: ${report.generatedAt}`,
    '',
    `Home layout blocks written:      ${report.homeLayoutBlocksWritten}`,
    `About layout blocks written:     ${report.aboutLayoutBlocksWritten}`,
    `Contact layout blocks written:   ${report.contactLayoutBlocksWritten}`,
    `Jobs layout blocks written:      ${report.jobsLayoutBlocksWritten}`,
    `Pitch layout blocks written:     ${report.pitchLayoutBlocksWritten}`,
    `Investors layout blocks written: ${report.investorsLayoutBlocksWritten}`,
    `Projects written:                ${report.projectsWritten}`,
    `News articles written:           ${report.newsArticlesWritten}`,
    `Warnings: ${report.warnings.length}`,
    `Errors: ${report.errors.length}`,
  ]
  for (const w of report.warnings) lines.push(`  WARN  ${w}`)
  for (const e of report.errors) lines.push(`  ERROR ${e}`)
  if (report.errors.length === 0) {
    lines.push('')
    lines.push('Seed complete. Verify in Payload admin: /admin -> Globals.')
    lines.push(`SiteSettings.seededVersion set to ${report.seedVersion}.`)
  }
  return lines.join('\n')
}
