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

/** 
 * Create a minimal Lexical JSON structure for plain text. 
 * Essential for v3 blocks that require richText (like TwoColBlock.rightBody).
 */
function createSimpleLexical(text: string): unknown {
  if (!text) return null
  const lines = text.split('\n').filter(l => l.trim().length > 0)
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: lines.map(line => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        children: [{
          type: 'text',
          text: line,
          version: 1,
        }],
      })),
    },
  }
}

/** Map flat v2 homepage fields to v3 layout blocks */
function synthesizeHomepageBlocks(doc: Record<string, unknown>): unknown[] {
  const layout: unknown[] = []
  
  if (doc.craftHeadline) {
    layout.push({
      blockType: 'hero',
      variant: 'default',
      heading: doc.craftHeadline,
      division: 'corporate',
    })
  }

  if (doc.aboutHeadline || doc.aboutBody) {
    layout.push({
      blockType: 'twoCol',
      leftHeading: doc.aboutHeadline || 'About',
      rightBody: createSimpleLexical(String(doc.aboutBody || '')),
      ratio: '1-3',
      alignment: 'top',
    })
  }

  if (doc.principlesHeadline || doc.principlesBody) {
    layout.push({
      blockType: 'twoCol',
      leftHeading: doc.principlesHeadline || 'Principles',
      rightBody: createSimpleLexical(String(doc.principlesBody || '')),
      ratio: '1-1',
      alignment: 'top',
    })
  }

  if (doc.divisionsHeading || doc.divisions) {
    layout.push({
      blockType: 'divisionShowcase',
      variant: 'v0-baseline',
      heading: doc.divisionsHeading,
      subtext: doc.divisionsSubtext,
      divisions: Array.isArray(doc.divisions) ? doc.divisions.map((d: any) => ({
        name: d.name,
        colorToken: d.colorToken?.replace('--', '') === 'amber' ? '212-amber' : 
                   d.colorToken?.replace('--', '') === 'teal' ? '310-imax' : 'nrc-grey',
        description: d.description,
      })) : [],
    })
  }

  return layout
}

/** Map v2 project fields to v3 layout blocks */
function synthesizeProjectBlocks(doc: Record<string, unknown>): unknown[] {
  const layout: unknown[] = []
  
  // Hero
  layout.push({
    blockType: 'hero',
    variant: 'split',
    heading: doc.title,
    subtext: doc.subtitle,
    media: doc.heroImageMedia || null, // Assuming relation is preserved or handled by media migrator
    division: doc.division === '212' ? 'pictures-212' : doc.division === '310' ? 'pictures-310' : 'nrc',
  })

  // Body content
  if (doc.logline || doc.detail) {
    const body = `${doc.logline ? `${doc.logline}\n\n` : ''}${doc.detail || ''}`
    layout.push({
      blockType: 'twoCol',
      leftHeading: 'Overview',
      rightBody: createSimpleLexical(body),
      ratio: '1-2',
      alignment: 'top',
    })
  }

  // Gallery
  if (Array.isArray(doc.images) && doc.images.length > 0) {
    layout.push({
      blockType: 'filmstrip',
      title: 'Gallery',
      slides: doc.images.map((img: any) => ({
        media: img.imageMedia || null,
        caption: img.character || img.bio || '',
      })),
    })
  }

  return layout
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
  const id = inferDocumentId(rec, ctx.basenameId)

  // 1. Check for flat v2 schemas (Homepage, Project, etc.)
  let layout: unknown[] = []
  let blocksInput = 0
  let blocksSkippedUnknownType = 0

  if (id === 'homepage' || id === 'home') {
    layout = synthesizeHomepageBlocks(rec)
    blocksInput = layout.length // Synthesized
  } else if (ctx.sourcePath.includes('/projects/')) {
    layout = synthesizeProjectBlocks(rec)
    blocksInput = layout.length // Synthesized
  } else {
    // 2. Fallback to existing layout/blocks array logic
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
