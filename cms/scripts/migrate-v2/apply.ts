/**
 * Phase 4 — live seed (--apply).
 *
 * Uses Payload Local API (no HTTP, direct DB access) to upsert:
 *   - `home` global layout blocks from mapped v2 content
 *   - `about`, `contact`, `jobs`, `pitch`, `investors` global layout blocks
 *   - `site-settings` seededVersion + lastDeployed
 *
 * Idempotent: updateGlobal replaces the layout array on every run.
 * Safe to re-run; does not duplicate rows.
 *
 * Prerequisites:
 *   - DATABASE_URL env var pointing at the v3 Postgres instance
 *   - PAYLOAD_SECRET env var
 *   - v3 stack running (postgres container healthy)
 */

import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import { discoverJsonDocuments } from './discover.js'
import { inferDocumentId, mapV2DocumentToLayout } from './map-layout.js'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const SEED_VERSION = '0.2.0'

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
  warnings: string[]
  errors: string[]
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
      warnings,
      errors,
    }
  }

  // ── 2. Initialise Payload Local API ─────────────────────────────────────────
  const payload = await getPayload({ config })

  try {
    // ── 3. Upsert Home global layout ──────────────────────────────────────────
    await payload.updateGlobal({
      slug: 'home',
      data: { layout: homeLayout as any },
    })

    // ── 4. Upsert About global layout ─────────────────────────────────────────
    if ((aboutLayout as unknown[]).length > 0) {
      await payload.updateGlobal({
        slug: 'about',
        data: { layout: aboutLayout as any },
      })
    } else {
      warnings.push('about: 0 blocks mapped; skipping updateGlobal for about.')
    }

    // ── 5. Upsert Contact global layout ───────────────────────────────────────
    if ((contactLayout as unknown[]).length > 0) {
      await payload.updateGlobal({
        slug: 'contact',
        data: { layout: contactLayout as any },
      })
    } else {
      warnings.push('contact: 0 blocks mapped; skipping updateGlobal for contact.')
    }

    // ── 6. Upsert Jobs global layout ──────────────────────────────────────────
    if ((jobsLayout as unknown[]).length > 0) {
      await payload.updateGlobal({
        slug: 'jobs',
        data: { layout: jobsLayout as any },
      })
    } else {
      warnings.push('jobs: 0 blocks mapped; skipping updateGlobal for jobs.')
    }

    // ── 7. Upsert Pitch global layout ─────────────────────────────────────────
    if ((pitchLayout as unknown[]).length > 0) {
      await payload.updateGlobal({
        slug: 'pitch',
        data: { layout: pitchLayout as any },
      })
    } else {
      warnings.push('pitch: 0 blocks mapped; skipping updateGlobal for pitch.')
    }

    // ── 8. Upsert Investors global layout ─────────────────────────────────────
    if ((investorsLayout as unknown[]).length > 0) {
      await payload.updateGlobal({
        slug: 'investors',
        data: { layout: investorsLayout as any },
      })
    } else {
      warnings.push('investors: 0 blocks mapped; skipping updateGlobal for investors.')
    }

    // ── 9. Stamp SiteSettings with seed metadata ───────────────────────────────
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        seededVersion: SEED_VERSION,
        lastDeployed: new Date().toISOString(),
      } as any,
    })
  } finally {
    // Close the DB pool so the process can exit cleanly
    await (payload.db as any).pool?.end?.()
  }

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
