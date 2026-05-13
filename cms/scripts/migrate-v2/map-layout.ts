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
  if (Array.isArray(doc.layout)) return doc.layout
  if (Array.isArray(doc.blocks)) return doc.blocks
  return null
}

export function inferDocumentId(doc: Record<string, unknown>, fallback: string): string {
  if (typeof doc.slug === 'string' && doc.slug.trim()) return doc.slug.trim()
  if (typeof doc.id === 'string' && doc.id.trim()) return doc.id.trim()
  if (typeof doc.entrySlug === 'string' && doc.entrySlug.trim()) return doc.entrySlug.trim()
  return fallback
}

/** Normalize v2 colorToken (--amber, --teal, --offwhite) → v3 token slug */
function normalizeColorToken(raw: unknown): string {
  if (typeof raw !== 'string') return 'nrc-grey'
  const t = raw.replace('--', '').toLowerCase()
  if (t === 'amber') return '212-amber'
  if (t === 'teal' || t === 'imax') return '310-imax'
  if (t === 'blue' || t === 'sicilian-blue') return '310-sicilian-blue'
  if (t === 'orange' || t === 'sicilian-orange') return '212-sicilian-orange'
  if (t === 'navy' || t === 'nrc-navy') return 'nrc-navy'
  return 'nrc-grey'
}

/** Create a minimal Lexical JSON structure for plain text. */
function createSimpleLexical(text: string): unknown {
  if (!text) return null
  const lines = text.split('\n').filter((l) => l.trim().length > 0)
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: lines.map((line) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        children: [{ type: 'text', text: line, version: 1 }],
      })),
    },
  }
}

// ─── Per-schema synthesizers ──────────────────────────────────────────────────

function synthesizeHomepageBlocks(doc: Record<string, unknown>): unknown[] {
  const layout: unknown[] = []

  if (doc.craftHeadline) {
    layout.push({ blockType: 'hero', variant: 'default', heading: doc.craftHeadline, division: 'corporate' })
  }

  if (doc.aboutHeadline || doc.aboutBody) {
    layout.push({
      blockType: 'twoCol',
      leftHeading: doc.aboutHeadline ?? 'About',
      rightBody: createSimpleLexical(String(doc.aboutBody ?? '')),
      ratio: '1-3',
      alignment: 'top',
    })
  }

  if (doc.principlesHeadline || doc.principlesBody) {
    layout.push({
      blockType: 'twoCol',
      leftHeading: doc.principlesHeadline ?? 'Principles',
      rightBody: createSimpleLexical(String(doc.principlesBody ?? '')),
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
      divisions: Array.isArray(doc.divisions)
        ? (doc.divisions as any[]).map((d) => ({
            name: d.name,
            colorToken: normalizeColorToken(d.colorToken),
            description: d.description,
          }))
        : [],
    })
  }

  return layout
}

function synthesizeAboutBlocks(doc: Record<string, unknown>): unknown[] {
  const layout: unknown[] = []

  if (doc.heroHeadline) {
    layout.push({ blockType: 'hero', variant: 'default', heading: doc.heroHeadline, division: 'corporate' })
  }

  if (doc.companyHeading || doc.companyBody) {
    layout.push({
      blockType: 'twoCol',
      leftHeading: doc.companyHeading ?? 'The Company',
      rightBody: createSimpleLexical(
        [doc.companyLede, doc.companyBody].filter(Boolean).join('\n\n'),
      ),
      ratio: '1-3',
      alignment: 'top',
    })
  }

  if (doc.principlesHeading || doc.principlesBody) {
    layout.push({
      blockType: 'twoCol',
      leftHeading: doc.principlesHeading ?? 'Principles',
      rightBody: createSimpleLexical(
        [doc.principlesLede, doc.principlesBody].filter(Boolean).join('\n\n'),
      ),
      ratio: '1-1',
      alignment: 'top',
    })
  }

  if (doc.divisionsHeading || doc.divisions) {
    layout.push({
      blockType: 'divisionShowcase',
      variant: 'v0-baseline',
      heading: doc.divisionsHeading,
      divisions: Array.isArray(doc.divisions)
        ? (doc.divisions as any[]).map((d) => ({
            name: d.name,
            colorToken: normalizeColorToken(d.colorToken),
            description: d.description,
          }))
        : [],
    })
  }

  return layout
}

function synthesizeContactBlocks(doc: Record<string, unknown>): unknown[] {
  const layout: unknown[] = []

  layout.push({
    blockType: 'hero',
    variant: 'default',
    heading: doc.heroHeading ?? 'Get in touch.',
    subtext: doc.subtext,
    division: 'corporate',
  })

  const contactBody = [
    doc.officeAddress ? `Office\n${doc.officeAddress}` : null,
    doc.entity ? `Legal Entity\n${doc.entity}` : null,
    doc.submissionsEmail ? `General Inquiries\n${doc.submissionsEmail}` : null,
  ]
    .filter(Boolean)
    .join('\n\n')

  if (contactBody) {
    layout.push({
      blockType: 'twoCol',
      leftHeading: 'Contact',
      rightBody: createSimpleLexical(contactBody),
      ratio: '1-2',
      alignment: 'top',
    })
  }

  if (doc.founderBio) {
    layout.push({
      blockType: 'twoCol',
      leftHeading: 'Founder',
      rightBody: createSimpleLexical(String(doc.founderBio)),
      ratio: '1-3',
      alignment: 'top',
    })
  }

  layout.push({
    blockType: 'cta',
    heading: 'Send an Inquiry',
    buttons: [{ label: 'submissions@aprpictures.com', url: 'mailto:submissions@aprpictures.com', variant: 'solid' }],
  })

  return layout
}

function synthesizeJobsBlocks(doc: Record<string, unknown>): unknown[] {
  const layout: unknown[] = []

  layout.push({
    blockType: 'hero',
    variant: 'default',
    heading: 'WORK WITH US.',
    subtext: doc.subtext,
    division: 'corporate',
  })

  if (Array.isArray(doc.sections)) {
    for (const section of doc.sections as any[]) {
      if (!section.heading && !section.body) continue
      layout.push({
        blockType: 'twoCol',
        leftHeading: section.heading ?? '',
        rightBody: createSimpleLexical(section.body ?? ''),
        ratio: '1-2',
        alignment: 'top',
      })
    }
  }

  layout.push({
    blockType: 'cta',
    heading: 'Get in touch.',
    buttons: [{ label: 'submissions@aprpictures.com', url: 'mailto:submissions@aprpictures.com', variant: 'ghost' }],
  })

  return layout
}

function synthesizePitchBlocks(doc: Record<string, unknown>): unknown[] {
  const layout: unknown[] = []

  layout.push({
    blockType: 'hero',
    variant: 'default',
    heading: doc.heading ?? 'SUBMIT A PITCH',
    subtext: doc.subtext,
    division: 'corporate',
  })

  if (doc.whatWeMakeHeading || doc.whatWeMakeBody) {
    layout.push({
      blockType: 'twoCol',
      leftHeading: doc.whatWeMakeHeading ?? 'We make films people want to see.',
      rightBody: createSimpleLexical(String(doc.whatWeMakeBody ?? '')),
      ratio: '1-2',
      alignment: 'top',
    })
  }

  if (doc.whatWeAreLookingForHeading || doc.whatWeAreLookingForBody) {
    layout.push({
      blockType: 'twoCol',
      leftHeading: doc.whatWeAreLookingForHeading ?? 'What we develop.',
      rightBody: createSimpleLexical(String(doc.whatWeAreLookingForBody ?? '')),
      ratio: '1-2',
      alignment: 'top',
    })
  }

  if (doc.requirementsHeading || doc.requirements) {
    const reqText = Array.isArray(doc.requirements)
      ? (doc.requirements as any[]).map((r) => `${r.label}\n${r.text}`).join('\n\n')
      : ''
    layout.push({
      blockType: 'twoCol',
      leftHeading: doc.requirementsHeading ?? 'What to include.',
      rightBody: createSimpleLexical(reqText),
      ratio: '1-2',
      alignment: 'top',
    })
  }

  if (doc.howToSubmitHeading || doc.howToSubmitBody) {
    layout.push({
      blockType: 'twoCol',
      leftHeading: doc.howToSubmitHeading ?? 'Send it here.',
      rightBody: createSimpleLexical(String(doc.howToSubmitBody ?? '')),
      ratio: '1-2',
      alignment: 'top',
    })
  }

  layout.push({
    blockType: 'cta',
    heading: 'Ready to submit?',
    buttons: [{ label: 'submissions@aprpictures.com', url: 'mailto:submissions@aprpictures.com', variant: 'solid' }],
  })

  return layout
}

function synthesizeQuotesBlocks(doc: Record<string, unknown>): unknown[] {
  const layout: unknown[] = []

  if (!Array.isArray(doc.pages)) return layout

  for (const page of doc.pages as any[]) {
    if (!Array.isArray(page.quotes) || page.quotes.length === 0) continue
    layout.push({
      blockType: 'quotes',
      route: page.route,
      variant: 'stacked',
      items: page.quotes.map((q: any) => ({ quote: q.quote, attribution: q.attribution })),
    })
  }

  return layout
}

function synthesizeSlateBlocks(doc: Record<string, unknown>): unknown[] {
  const layout: unknown[] = []

  layout.push({
    blockType: 'hero',
    variant: 'default',
    heading: doc.heading ?? 'Current Slate.',
    subtext: doc.subtext,
    division: 'corporate',
  })

  if (doc.tagline) {
    layout.push({ blockType: 'richText', content: createSimpleLexical(String(doc.tagline)) })
  }

  if (doc.ctaLabel && doc.ctaHref) {
    layout.push({
      blockType: 'cta',
      heading: '',
      buttons: [{ label: doc.ctaLabel, url: doc.ctaHref, variant: 'ghost' }],
    })
  }

  return layout
}

function synthesizePartnersBlocks(doc: Record<string, unknown>): unknown[] {
  const layout: unknown[] = []

  layout.push({
    blockType: 'hero',
    variant: 'default',
    heading: doc.heroHeading ?? 'Stories Across Generations.',
    subtext: [doc.heroTagline, doc.heroBody, doc.subtext].filter(Boolean).join(' — '),
    division: 'corporate',
  })

  if (Array.isArray(doc.stats) && doc.stats.length > 0) {
    layout.push({
      blockType: 'stats',
      stats: (doc.stats as any[]).map((s) => ({ value: s.value, label: s.label })),
    })
  }

  if (doc.slateHeading || doc.divisions) {
    layout.push({
      blockType: 'divisionShowcase',
      variant: 'v0-baseline',
      heading: doc.slateHeading,
      subtext: doc.slateSubtext,
      divisions: Array.isArray(doc.divisions)
        ? (doc.divisions as any[]).map((d) => ({
            name: d.name,
            colorToken: normalizeColorToken(d.colorToken),
            description: d.desc,
          }))
        : [],
    })
  }

  if (doc.inquiryHeading || doc.inquiryBody) {
    layout.push({
      blockType: 'cta',
      heading: doc.inquiryHeading ?? 'Ready to talk?',
      buttons: [{ label: 'Get in touch', url: '/contact', variant: 'solid' }],
    })
  }

  return layout
}

/** footer-more is nav data — map to a richText note so it appears in the report */
function synthesizeFooterMoreBlocks(doc: Record<string, unknown>): unknown[] {
  if (!Array.isArray(doc.links) || doc.links.length === 0) return []
  const lines = (doc.links as any[]).map((l) => `${l.label} → ${l.route}`).join('\n')
  return [
    {
      blockType: 'richText',
      _migrationNote: 'footer-more nav links — wire into FooterLinks global in Payload admin',
      content: createSimpleLexical(lines),
    },
  ]
}

function synthesizeNewsBlocks(doc: Record<string, unknown>): unknown[] {
  const layout: unknown[] = []

  layout.push({
    blockType: 'hero',
    variant: 'default',
    heading: doc.title ?? 'News',
    subtext: doc.deck,
    division: 'corporate',
  })

  // Pass through existing Lexical content if it has real text children
  const lexical = doc.content as any
  const hasContent =
    lexical?.root?.children?.some((c: any) =>
      c.children?.some((t: any) => typeof t.text === 'string' && t.text.trim()),
    ) ?? false

  if (hasContent) {
    layout.push({ blockType: 'richText', content: lexical })
  } else if (doc.deck) {
    layout.push({ blockType: 'richText', content: createSimpleLexical(String(doc.deck)) })
  }

  if (Array.isArray(doc.images) && doc.images.length > 0) {
    layout.push({
      blockType: 'filmstrip',
      title: '',
      slides: (doc.images as any[]).map((img) => ({
        media: img.imageMedia ?? null,
        caption: img.alt ?? '',
      })),
    })
  }

  return layout
}

function synthesizeProjectBlocks(doc: Record<string, unknown>): unknown[] {
  const layout: unknown[] = []

  layout.push({
    blockType: 'hero',
    variant: 'split',
    heading: doc.title,
    subtext: doc.subtitle,
    media: doc.heroImageMedia ?? null,
    division: doc.division === '212' ? 'pictures-212' : doc.division === '310' ? 'pictures-310' : 'nrc',
  })

  if (doc.logline || doc.detail) {
    const body = `${doc.logline ? `${doc.logline}\n\n` : ''}${doc.detail ?? ''}`
    layout.push({
      blockType: 'twoCol',
      leftHeading: 'Overview',
      rightBody: createSimpleLexical(body),
      ratio: '1-2',
      alignment: 'top',
    })
  }

  if (Array.isArray(doc.images) && doc.images.length > 0) {
    layout.push({
      blockType: 'filmstrip',
      title: 'Gallery',
      slides: (doc.images as any[]).map((img) => ({
        media: img.imageMedia ?? null,
        caption: img.character ?? img.bio ?? '',
      })),
    })
  }

  return layout
}

// ─── Dispatch ─────────────────────────────────────────────────────────────────

export function mapV2DocumentToLayout(
  doc: unknown,
  ctx: { sourcePath: string; basenameId: string },
): MapResult {
  const warnings: string[] = []
  if (!doc || typeof doc !== 'object') {
    warnings.push(`${ctx.sourcePath}: document root is not an object; skipped`)
    return { layout: [], warnings, blocksInput: 0, blocksOutput: 0, blocksSkippedUnknownType: 0 }
  }

  const rec = doc as Record<string, unknown>
  const id = inferDocumentId(rec, ctx.basenameId)

  let layout: unknown[] = []
  let blocksSkippedUnknownType = 0

  const path = ctx.sourcePath.replaceAll('\\', '/')

  if (id === 'homepage' || id === 'home') {
    layout = synthesizeHomepageBlocks(rec)
  } else if (id === 'about') {
    layout = synthesizeAboutBlocks(rec)
  } else if (id === 'contact') {
    layout = synthesizeContactBlocks(rec)
  } else if (id === 'jobs') {
    layout = synthesizeJobsBlocks(rec)
  } else if (id === 'pitch') {
    layout = synthesizePitchBlocks(rec)
  } else if (id === 'quotes') {
    layout = synthesizeQuotesBlocks(rec)
  } else if (id === 'slate') {
    layout = synthesizeSlateBlocks(rec)
  } else if (id === 'partners') {
    layout = synthesizePartnersBlocks(rec)
  } else if (id === 'footer-more') {
    layout = synthesizeFooterMoreBlocks(rec)
  } else if (path.includes('/news/') || path.startsWith('news/')) {
    layout = synthesizeNewsBlocks(rec)
  } else if (path.includes('/projects/') || path.startsWith('projects/')) {
    layout = synthesizeProjectBlocks(rec)
  } else {
    // Fallback: try layout/blocks array
    const rawBlocks = getBlocksArray(rec)
    if (!rawBlocks) {
      warnings.push(
        `${ctx.sourcePath}: no synthesizer matched and no layout/blocks array found (empty migration for this file)`,
      )
      return { layout: [], warnings, blocksInput: 0, blocksOutput: 0, blocksSkippedUnknownType: 0 }
    }

    for (const item of rawBlocks) {
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
      layout.push({ blockType: slug, ...rest })
    }
  }

  return {
    layout,
    warnings,
    blocksInput: layout.length + blocksSkippedUnknownType,
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
