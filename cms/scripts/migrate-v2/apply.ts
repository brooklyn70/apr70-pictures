/**
 * Phase 4 — live seed (--apply).
 *
 * Uses Payload Local API (no HTTP, direct DB access) to upsert:
 *   - `home` global layout blocks from mapped v2 content
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

const SEED_VERSION = '0.1.0'

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
  warnings: string[]
  errors: string[]
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
      warnings,
      errors,
    }
  }

  // Find the homepage document — that's what seeds the Home global layout
  let homeLayout: unknown[] = []
  for (const f of files) {
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
    const basenameId = path.basename(f.relativePath, path.extname(f.relativePath))
    const id = doc && typeof doc === 'object'
      ? inferDocumentId(doc as Record<string, unknown>, basenameId)
      : basenameId

    if (id === 'homepage' || id === 'home') {
      const mapped = mapV2DocumentToLayout(doc, { sourcePath: f.relativePath, basenameId })
      warnings.push(...mapped.warnings)
      homeLayout = mapped.layout
      break
    }
  }

  if (homeLayout.length === 0) {
    errors.push('No homepage document found or it mapped to 0 blocks. Aborting.')
    return {
      generatedAt: new Date().toISOString(),
      mode: 'apply',
      seedVersion: SEED_VERSION,
      v2Root,
      homeLayoutBlocksWritten: 0,
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

    // ── 4. Stamp SiteSettings with seed metadata ───────────────────────────────
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
    homeLayoutBlocksWritten: homeLayout.length,
    warnings,
    errors,
  }
}

export function formatApplyReportConsole(report: ApplyReport): string {
  const lines = [
    `apr70 v2 \u2192 v3 seed (apply)  seedVersion=${report.seedVersion}`,
    `v2Root: ${report.v2Root}`,
    `generatedAt: ${report.generatedAt}`,
    '',
    `Home layout blocks written: ${report.homeLayoutBlocksWritten}`,
    `Warnings: ${report.warnings.length}`,
    `Errors: ${report.errors.length}`,
  ]
  for (const w of report.warnings) lines.push(`  WARN  ${w}`)
  for (const e of report.errors) lines.push(`  ERROR ${e}`)
  if (report.errors.length === 0) {
    lines.push('')
    lines.push('Seed complete. Verify in Payload admin: /admin -> Globals -> Home.')
    lines.push(`SiteSettings.seededVersion set to ${report.seedVersion}.`)
  }
  return lines.join('\n')
}
