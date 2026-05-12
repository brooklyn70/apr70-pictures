import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

import { discoverJsonDocuments } from './discover.js'
import { aggregateScansForLayout, inferDocumentId, mapV2DocumentToLayout } from './map-layout.js'
import type { MigrationReport } from './types.js'

const SEED_CLI_VERSION = '0.1.0'

export type DryRunOptions = {
  v2Root: string
  reportPath?: string
}

export async function runDryRun(opts: DryRunOptions): Promise<MigrationReport> {
  const v2Root = path.resolve(opts.v2Root)
  const files = await discoverJsonDocuments(v2Root)

  const warnings: string[] = []
  if (!existsSync(path.join(v2Root, 'content'))) {
    warnings.push(
      `v2-root has no "content/" directory (${v2Root}). Nothing was scanned. Many v2 checkouts keep editorial content in Payload/Keystatic cloud, not flat JSON under git — add an export that mirrors Keystatic paths (content/pages, content/projects) or extend the migrator to read v2 Postgres/API.`,
    )
  }
  const pageIds: string[] = []
  const projectIds: string[] = []
  let parseFailures = 0
  let blocksInput = 0
  let blocksOutput = 0
  let blocksSkippedUnknownType = 0
  let pages = 0
  let projects = 0
  let unknownKind = 0
  const allColor = new Set<string>()
  const allMedia = new Set<string>()
  let lexicalRootsScanned = 0

  let sampleFirstPage: MigrationReport['sampleFirstPage'] = null

  for (const f of files) {
    if (f.kind === 'unknown') unknownKind += 1
    if (f.kind === 'page') pages += 1
    if (f.kind === 'project') projects += 1

    let text: string
    try {
      text = await readFile(f.absolutePath, 'utf8')
    } catch (e) {
      parseFailures += 1
      warnings.push(`${f.relativePath}: read failed: ${String(e)}`)
      continue
    }

    let doc: unknown
    try {
      doc = JSON.parse(text) as unknown
    } catch (e) {
      parseFailures += 1
      warnings.push(`${f.relativePath}: JSON parse failed: ${String(e)}`)
      continue
    }

    const basenameId = path.basename(f.relativePath, path.extname(f.relativePath))
    const inferredId =
      doc && typeof doc === 'object'
        ? inferDocumentId(doc as Record<string, unknown>, basenameId)
        : basenameId

    if (f.kind === 'page') pageIds.push(inferredId)
    else if (f.kind === 'project') projectIds.push(inferredId)

    const mapped = mapV2DocumentToLayout(doc, {
      sourcePath: f.relativePath,
      basenameId,
    })
    warnings.push(...mapped.warnings)
    blocksInput += mapped.blocksInput
    blocksOutput += mapped.blocksOutput
    blocksSkippedUnknownType += mapped.blocksSkippedUnknownType

    const agg = aggregateScansForLayout(mapped.layout)
    lexicalRootsScanned += agg.lexicalRoots
    for (const c of agg.colorTokens) allColor.add(c)
    for (const m of agg.mediaPaths) allMedia.add(m)

    if (!sampleFirstPage && f.kind === 'page' && mapped.layout.length > 0) {
      sampleFirstPage = {
        sourcePath: f.relativePath,
        inferredId,
        mappedLayout: mapped.layout,
      }
    }
  }

  const report: MigrationReport = {
    generatedAt: new Date().toISOString(),
    mode: 'dry-run',
    seedVersion: SEED_CLI_VERSION,
    v2Root,
    summary: {
      jsonFilesScanned: files.length,
      pages,
      projects,
      unknownKind,
      parseFailures,
      blocksInput,
      blocksOutput,
      blocksSkippedUnknownType,
      lexicalRootsScanned,
      colorInjectorTokensFound: [...allColor].sort(),
      mediaLikePathsFound: [...allMedia].sort(),
    },
    ids: {
      pages: [...new Set(pageIds)].sort(),
      projects: [...new Set(projectIds)].sort(),
    },
    warnings,
    sampleFirstPage,
  }

  if (opts.reportPath) {
    await writeFile(opts.reportPath, JSON.stringify(report, null, 2), 'utf8')
  }

  return report
}

export function formatReportConsole(report: MigrationReport): string {
  const s = report.summary
  const lines = [
    `apr70 v2 → v3 seed (dry-run)  seedVersion=${report.seedVersion}`,
    `v2Root: ${report.v2Root}`,
    `generatedAt: ${report.generatedAt}`,
    '',
    'Summary:',
    `  jsonFilesScanned: ${s.jsonFilesScanned}`,
    `  pages (path-classified): ${s.pages}`,
    `  projects (path-classified): ${s.projects}`,
    `  unknownKind: ${s.unknownKind}`,
    `  parseFailures: ${s.parseFailures}`,
    `  blocksInput: ${s.blocksInput}`,
    `  blocksOutput (mapped): ${s.blocksOutput}`,
    `  blocksSkippedUnknownType: ${s.blocksSkippedUnknownType}`,
    `  lexicalRootsScanned: ${s.lexicalRootsScanned}`,
    `  colorInjectorTokensFound: ${s.colorInjectorTokensFound.join(', ') || '(none)'}`,
    `  mediaLikePathsFound: ${s.mediaLikePathsFound.length}`,
    '',
    `Page ids (${report.ids.pages.length}): ${report.ids.pages.join(', ') || '(none)'}`,
    `Project ids (${report.ids.projects.length}): ${report.ids.projects.join(', ') || '(none)'}`,
    '',
    `Warnings (${report.warnings.length}):`,
  ]
  const warnPreview = report.warnings.slice(0, 40)
  for (const w of warnPreview) lines.push(`  - ${w}`)
  if (report.warnings.length > warnPreview.length) {
    lines.push(`  … ${report.warnings.length - warnPreview.length} more`)
  }
  if (report.sampleFirstPage) {
    lines.push('')
    lines.push(`Sample first page (${report.sampleFirstPage.sourcePath}, id=${report.sampleFirstPage.inferredId}):`)
    lines.push(JSON.stringify(report.sampleFirstPage.mappedLayout, null, 2))
  } else {
    lines.push('')
    lines.push('Sample first page: (none — no page-classified JSON with mapped blocks)')
  }
  return lines.join('\n')
}
