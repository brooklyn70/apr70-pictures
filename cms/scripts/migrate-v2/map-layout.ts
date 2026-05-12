/**
 * Map v2-ish JSON (Keystatic export / Payload-like layout arrays) to v3 Payload block shapes.
 * Unknown `blockType` values are skipped with warnings (dry-run contract).
 */

import { countLexicalRoots, scanLexicalAndMediaRefs } from './lexical-scan.js'

/** v3 Home global block slugs (cms/src/globals/Home.ts) */
export const V3_BLOCK_SLUGS = new Set([
  'hero',
  'richText',
  'twoCol',
  'grid',
  'cta',
  'quotes',
  'filmstrip',
  'divisionShowcase',
  'stats',
  'divider',
])

/** Legacy or alternate labels → v3 slug */
const BLOCK_TYPE_ALIASES: Record<string, string> = {
  'rich-text': 'richText',
  rich_text: 'richText',
  two_col: 'twoCol',
  'two-col': 'twoCol',
  division: 'divisionShowcase',
  division_showcase: 'divisionShowcase',
  'division-showcase': 'divisionShowcase',
}

export type MapResult = {
  layout: unknown[]
  warnings: string[]
  blocksInput: number
  blocksOutput: number
  blocksSkippedUnknownType: number
}

function normalizeBlockType(raw: unknown): string | null {
  if (typeof raw !== 'string' || !raw.trim()) return null
  const t = raw.trim()
  return BLOCK_TYPE_ALIASES[t] ?? BLOCK_TYPE_ALIASES[t.toLowerCase()] ?? t
}

function getBlocksArray(doc: Record<string, unknown>): unknown[] | null {
  const layout = doc.layout
  if (Array.isArray(layout)) return layout
  const blocks = doc.blocks
  if (Array.isArray(blocks)) return blocks
  const sections = doc.sections
  if (Array.isArray(sections)) return sections
  return null
}

function inferDocumentId(doc: Record<string, unknown>, fallback: string): string {
  if (typeof doc.slug === 'string' && doc.slug.trim()) return doc.slug.trim()
  if (typeof doc.id === 'string' && doc.id.trim()) return doc.id.trim()
  if (typeof doc.entrySlug === 'string' && doc.entrySlug.trim()) return doc.entrySlug.trim()
  return fallback
}

export function mapV2DocumentToLayout(
  doc: unknown,
  ctx: { sourcePath: string; basenameId: string },
): MapResult {
  const warnings: string[] = []
  if (!doc || typeof doc !== 'object') {
    warnings.push(`${ctx.sourcePath}: document root is not an object; skipped`)
    return {
      layout: [],
      warnings,
      blocksInput: 0,
      blocksOutput: 0,
      blocksSkippedUnknownType: 0,
    }
  }

  const rec = doc as Record<string, unknown>
  const rawBlocks = getBlocksArray(rec)
  if (!rawBlocks) {
    warnings.push(
      `${ctx.sourcePath}: no layout/blocks/sections array found (empty migration for this file)`,
    )
    return {
      layout: [],
      warnings,
      blocksInput: 0,
      blocksOutput: 0,
      blocksSkippedUnknownType: 0,
    }
  }

  let blocksInput = 0
  let blocksSkippedUnknownType = 0
  const layout: unknown[] = []

  for (const item of rawBlocks) {
    blocksInput += 1
    if (!item || typeof item !== 'object') {
      warnings.push(`${ctx.sourcePath}: block entry is not an object; skipped`)
      blocksSkippedUnknownType += 1
      continue
    }
    const b = item as Record<string, unknown>
    const rawType = b.blockType ?? b.type
    const slug = normalizeBlockType(rawType)
    if (!slug || !V3_BLOCK_SLUGS.has(slug)) {
      warnings.push(
        `${ctx.sourcePath}: unknown or unsupported blockType ${String(rawType)} (normalized: ${String(slug)})`,
      )
      blocksSkippedUnknownType += 1
      continue
    }

    const { ...rest } = b
    delete rest.blockType
    delete rest.type
    layout.push({
      blockType: slug,
      ...rest,
    })
  }

  return {
    layout,
    warnings,
    blocksInput,
    blocksOutput: layout.length,
    blocksSkippedUnknownType,
  }
}

export function aggregateScansForLayout(layout: unknown[]): {
  lexicalRoots: number
  colorTokens: Set<string>
  mediaPaths: Set<string>
} {
  const colorTokens = new Set<string>()
  const mediaPaths = new Set<string>()
  let lexicalRoots = 0
  for (const block of layout) {
    const { colorTokens: c, mediaLikePaths: m } = scanLexicalAndMediaRefs(block)
    for (const x of c) colorTokens.add(x)
    for (const x of m) mediaPaths.add(x)
    lexicalRoots += countLexicalRoots(block)
  }
  return { lexicalRoots, colorTokens, mediaPaths }
}

export { inferDocumentId }
