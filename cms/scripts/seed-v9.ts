/**
 * seed-v9.ts — V9 content seed (idempotent).
 *
 * Parses the v9 copy canon (markdown + `::section` grammar) from the vault:
 *   ~/vault/10 Work/11 APR70 Pictures/11.12 V9 Build/02-copy/
 *     chrome.md, index.md, slate.md, craft.md, methods.md, contact.md,
 *     properties/*.md (nine public properties)
 * and upserts, via the Payload local API:
 *
 *   1. Media       — every image referenced by the copy, uploaded from
 *                    ~/websites/apr70-v8/site/ (fallback ~/websites/apr70-v9/
 *                    site-media/). Matched by filename so re-runs are
 *                    idempotent. Missing files are logged PENDING and
 *                    skipped; a later re-run picks them up.
 *   2. Projects    — the nine v9 properties, matched by v9 slug OR legacy
 *                    slug alias (brooklyn→a-need-grows-in-brooklyn,
 *                    falcon→da-hook, …); slugs are normalized to the v9
 *                    slugs. publicSlate=true + slateOrder set; every other
 *                    project gets publicSlate=false.
 *   3. V9 globals  — v9-home / v9-slate / v9-craft / v9-methods /
 *                    v9-contact section stacks translated 1:1 from the copy.
 *   4. SiteSettings.v9Chrome — the chrome.md strings.
 *
 * Run from cms/:
 *   pnpm seed:v9:dry     (npx tsx scripts/seed-v9.ts --dry-run)
 *   pnpm seed:v9:apply   (npx tsx scripts/seed-v9.ts --apply)
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'

// ── CLI + safety guards ──────────────────────────────────────────────────────

const APPLY = process.argv.includes('--apply')
const DRY = process.argv.includes('--dry-run')
if (APPLY === DRY) {
  console.error('seed-v9: pass exactly one of --dry-run or --apply. No changes made.')
  process.exit(1)
}

// The V9 Build folder left the live vault on 2026-07-25 (archived to SharedData). The canon is
// edited there now (rule 16, third layer). Override with V9_COPY_DIR; else the vault path if it
// still exists, else the archive.
const COPY_DIR_CANDIDATES = [
  process.env.V9_COPY_DIR,
  '/Users/marco/vault/10 Work/11 APR70 Pictures/11.12 V9 Build/02-copy',
  '/Users/marco/Volumes/SharedData/00-01-vault-media/_vault-archive/2026-07-25-apr70-website-builds/11.12 V9 Build/02-copy',
  '/Volumes/SharedData/00-01-vault-media/_vault-archive/2026-07-25-apr70-website-builds/11.12 V9 Build/02-copy',
].filter((d): d is string => Boolean(d))
const COPY_DIR = COPY_DIR_CANDIDATES.find((d) => fs.existsSync(d)) ?? COPY_DIR_CANDIDATES[0]
const MEDIA_SOURCES = [
  '/Users/marco/websites/apr70-v8/site',
  '/Users/marco/websites/apr70-v9/site-media',
]

// ── Copy-format parser ───────────────────────────────────────────────────────

type Entry = { key: string; value: string } | { para: string }
type Section = { kind: string; flags: string[]; entries: Entry[] }
type CopyDoc = { frontmatter: Record<string, string>; sections: Section[] }

const KNOWN_KEYS = new Set([
  'src', 'alt', 'kicker', 'h1', 'caption', 'href', 'label', 'scene', 'slug', 'h',
  'lede', 'more', 'quote', 'cite', 'note', 'title', 'logline', 'provenance', 'meta',
  'dev', 'aria', 'dt', 'dd', 'link', 'name', 'blurb', 'wide', 'colophon', 'copyright',
  'brand-aria', 'brand-alt', 'skip-label', 'display-label', 'panel-title',
  'theme-label', 'theme-aria', 'theme-premiere', 'theme-matinee', 'theme-lateshow',
  'scale-label', 'scale-aria', 'logo-label', 'logo-aria', 'top-label', 'prev-label',
  'next-label', 'slate-return', 'cta',
])

function parseCopy(raw: string): CopyDoc {
  const lines = raw.split('\n')
  let i = 0
  const frontmatter: Record<string, string> = {}
  if (lines[0]?.trim() === '---') {
    i = 1
    for (; i < lines.length && lines[i].trim() !== '---'; i++) {
      const m = lines[i].match(/^([A-Za-z0-9-]+):\s*(.*)$/)
      if (m) frontmatter[m[1]] = m[2].trim()
    }
    i++ // past closing ---
  }
  const sections: Section[] = []
  let current: Section | null = null
  let paraBuf: string[] = []
  const flushPara = () => {
    if (current && paraBuf.length) {
      current.entries.push({ para: paraBuf.join(' ').trim() })
      paraBuf = []
    }
  }
  for (; i < lines.length; i++) {
    const line = lines[i]
    const secM = line.match(/^::section\s+([a-z0-9-]+)((?:\s+[a-z0-9]+)*)\s*$/)
    if (secM) {
      flushPara()
      current = { kind: secM[1], flags: secM[2].trim() ? secM[2].trim().split(/\s+/) : [], entries: [] }
      sections.push(current)
      continue
    }
    if (!current) continue // pre-section prose (chrome.md intro line)
    if (!line.trim()) { flushPara(); continue }
    const kvM = line.match(/^([a-z][a-z0-9-]*):\s(.*)$/)
    if (kvM && KNOWN_KEYS.has(kvM[1])) {
      flushPara()
      current.entries.push({ key: kvM[1], value: kvM[2].trim() })
    } else {
      paraBuf.push(line.trim())
    }
  }
  flushPara()
  return { frontmatter, sections }
}

const kv = (s: Section, key: string): string | undefined => {
  for (const e of s.entries) if ('key' in e && e.key === key) return e.value
  return undefined
}
const paras = (s: Section): string[] =>
  s.entries.filter((e): e is { para: string } => 'para' in e).map((e) => e.para)

/** Group repeated key/value runs into items, starting a new item at `startKey`. */
function groups(s: Section, startKey: string): Record<string, string>[] {
  const out: Record<string, string>[] = []
  let cur: Record<string, string> | null = null
  for (const e of s.entries) {
    if (!('key' in e)) continue
    if (e.key === startKey) {
      cur = {}
      out.push(cur)
    }
    if (cur) cur[e.key] = e.value
  }
  return out
}

/** "text | credit-suffix" → [text, credit] (split on the last " | "). */
function splitCaption(v?: string): [string | undefined, string | undefined] {
  if (!v) return [undefined, undefined]
  const idx = v.lastIndexOf(' | ')
  if (idx === -1) return [v, undefined]
  return [v.slice(0, idx).trim(), v.slice(idx + 3).trim()]
}

/** "url | label" → [url, label]. */
function splitLink(v?: string): [string | undefined, string | undefined] {
  if (!v) return [undefined, undefined]
  const idx = v.indexOf(' | ')
  if (idx === -1) return [v.trim(), undefined]
  return [v.slice(0, idx).trim(), v.slice(idx + 3).trim()]
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.error('seed-v9: DATABASE_URL not set. No changes made.')
    process.exit(1)
  }
  if (!/127\.0\.0\.1|localhost/.test(process.env.DATABASE_URL)) {
    console.error(
      `seed-v9: DATABASE_URL is not local (${process.env.DATABASE_URL.replace(/:[^:@/]+@/, ':***@')}).\n` +
        'This seed only runs against the local docker Postgres. Aborting; no changes made.',
    )
    process.exit(1)
  }

  const read = (rel: string): CopyDoc =>
    parseCopy(fs.readFileSync(path.join(COPY_DIR, rel), 'utf8'))

  const chrome = read('chrome.md')
  const pages: Record<string, CopyDoc> = {
    'v9-home': read('index.md'),
    'v9-slate': read('slate.md'),
    'v9-craft': read('craft.md'),
    'v9-methods': read('methods.md'),
    'v9-contact': read('contact.md'),
  }
  const propertyFiles = fs
    .readdirSync(path.join(COPY_DIR, 'properties'))
    .filter((f) => f.endsWith('.md'))
    .sort()
  const properties = propertyFiles.map((f) => ({
    slug: f.replace(/\.md$/, ''),
    doc: read(path.join('properties', f)),
  }))

  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config.js')
  // Local API used loosely typed: block/section shapes mirror src/blocks/v9Sections.ts.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = (await getPayload({ config })) as any

  const summary = { mediaCreated: [] as string[], mediaExisting: 0, mediaPending: [] as string[],
    projectsCreated: [] as string[], projectsUpdated: [] as string[], projectsHidden: [] as string[],
    globalsUpdated: [] as string[] }

  // ── 1. Media upsert ────────────────────────────────────────────────────────
  const mediaIds = new Map<string, number | null>() // copy src path -> media id (null = pending)

  async function ensureMedia(src: string | undefined, alt: string | undefined): Promise<number | null> {
    if (!src) return null
    if (mediaIds.has(src)) return mediaIds.get(src) ?? null
    const filename = path.basename(src)
    const found = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      depth: 0,
      limit: 1,
    })
    if (found.docs?.length) {
      summary.mediaExisting++
      mediaIds.set(src, found.docs[0].id)
      return found.docs[0].id
    }
    const candidates = [
      ...MEDIA_SOURCES.map((d) => path.join(d, src)),
      ...MEDIA_SOURCES.map((d) => path.join(d, filename)),
    ]
    const filePath = candidates.find((p) => fs.existsSync(p))
    if (!filePath) {
      summary.mediaPending.push(src)
      mediaIds.set(src, null)
      return null
    }
    if (DRY) {
      summary.mediaCreated.push(`${src} (would upload from ${filePath})`)
      mediaIds.set(src, null)
      return null
    }
    const doc = await payload.create({
      collection: 'media',
      data: { alt: alt || filename, mediaKind: 'photo' },
      filePath,
    })
    summary.mediaCreated.push(src)
    mediaIds.set(src, doc.id)
    return doc.id
  }

  // Pre-register every image in copy-order so alts come from their first use.
  const allDocs = [...Object.values(pages), ...properties.map((p) => p.doc)]
  for (const doc of allDocs) {
    for (const s of doc.sections) {
      if (s.kind === 'photo-fold' || s.kind === 'archival') {
        await ensureMedia(kv(s, 'src'), kv(s, 'alt'))
      } else if (s.kind === 'mood-grid') {
        for (const item of groups(s, 'src')) await ensureMedia(item.src, item.alt)
      }
    }
  }

  // ── 2. Projects upsert ─────────────────────────────────────────────────────
  const LEGACY_SLUGS: Record<string, string[]> = {
    'a-need-grows-in-brooklyn': ['brooklyn'],
    'la-dolce-vita': ['ladolcevita'],
    'sea-gate': [],
    'alpha-yy': ['alphayy'],
    'da-hook': ['falcon'],
    'the-movement': ['movement'],
    cleopatra: ['cleo'],
    shadowmaster: [],
    'u-bruculinu': ['ubrucculinu'],
  }

  // The LEAD division is the one named first in the meta line; co-production
  // lines read "New Renaissance Cinema with (212) Pictures" (NRC lead).
  const divisionFromMeta = (meta = ''): string | undefined => {
    const hits = (
      [
        ['(212)', '212'],
        ['(310)', '310'],
        ['New Renaissance', 'nrc'],
      ] as const
    )
      .map(([needle, div]) => ({ div, at: meta.indexOf(needle) }))
      .filter((h) => h.at !== -1)
      .sort((a, b) => a.at - b.at)
    return hits[0]?.div
  }

  // Short loglines for the home mini-slate come from index.md's slate-list.
  const homeSlate = pages['v9-home'].sections.find((s) => s.kind === 'slate-list')
  const shortLoglines = new Map<string, string>()
  for (const row of homeSlate ? groups(homeSlate, 'title') : []) {
    const slug = row.href?.replace('/work/', '')
    if (slug && row.logline) shortLoglines.set(slug, row.logline)
  }

  const projectIds = new Map<string, number>() // v9 slug -> id

  for (const { slug, doc } of properties) {
    const head = doc.sections.find((s) => s.kind === 'property-head')
    const fold = doc.sections.find((s) => s.kind === 'photo-fold')
    const quote = doc.sections.find((s) => s.kind === 'quote-feature')
    const grid = doc.sections.find((s) => s.kind === 'mood-grid')
    const request = doc.sections.find((s) => s.kind === 'request')
    if (!head) {
      console.error(`seed-v9: ${slug}: no property-head section — skipped`)
      continue
    }

    const [heroCaption, heroCredit] = splitCaption(kv(fold ?? head, 'caption'))
    const heroImage = fold ? await ensureMedia(kv(fold, 'src'), kv(fold, 'alt')) : null

    const gallery = []
    for (const item of grid ? groups(grid, 'src') : []) {
      const [caption, credit] = splitCaption(item.caption)
      gallery.push({
        image: await ensureMedia(item.src, item.alt),
        caption,
        credit: credit || 'AI-generated development frame',
        wide: item.wide === 'true',
      })
    }

    const data: Record<string, unknown> = {
      title: kv(head, 'title'),
      slug,
      division: divisionFromMeta(kv(head, 'meta')),
      status: 'development',
      metaLine: kv(head, 'meta'),
      logline: kv(head, 'logline'),
      shortLogline: shortLoglines.get(slug) ?? null,
      provenance: kv(head, 'provenance') ?? null,
      bodyProse: paras(head).join('\n\n'),
      pageQuote: quote
        ? { quote: kv(quote, 'quote'), cite: kv(quote, 'cite'), note: kv(quote, 'note') ?? null }
        : undefined,
      heroImage,
      heroLine: fold ? (kv(fold, 'h1') ?? null) : null,
      heroCaption,
      heroCredit,
      gallery,
      requestBody: request ? paras(request).join('\n\n') : null,
      slateOrder: doc.frontmatter['slate-order'] ? Number(doc.frontmatter['slate-order']) : null,
      publicSlate: true,
    }

    // Match: v9 slug first, then legacy aliases, then exact title.
    let existing: { id: number; slug: string } | undefined
    for (const trySlug of [slug, ...(LEGACY_SLUGS[slug] ?? [])]) {
      const found = await payload.find({
        collection: 'projects', where: { slug: { equals: trySlug } }, depth: 0, limit: 1,
      })
      if (found.docs?.length) { existing = found.docs[0]; break }
    }
    if (!existing) {
      const found = await payload.find({
        collection: 'projects', where: { title: { equals: data.title } }, depth: 0, limit: 1,
      })
      if (found.docs?.length) existing = found.docs[0]
    }

    if (existing) {
      if (!DRY) await payload.update({ collection: 'projects', id: existing.id, data })
      projectIds.set(slug, existing.id)
      summary.projectsUpdated.push(
        existing.slug === slug ? slug : `${existing.slug} → ${slug} (slug normalized)`,
      )
    } else if (DRY) {
      summary.projectsCreated.push(`${slug} (would create)`)
    } else {
      const doc2 = await payload.create({ collection: 'projects', data })
      projectIds.set(slug, doc2.id)
      summary.projectsCreated.push(slug)
    }
  }

  // Any project not on the v9 public slate is hidden from it.
  const v9Slugs = new Set(properties.map((p) => p.slug))
  const others = await payload.find({ collection: 'projects', depth: 0, limit: 200 })
  for (const proj of others.docs ?? []) {
    if (v9Slugs.has(proj.slug)) continue
    if (proj.publicSlate !== false) {
      if (!DRY) {
        await payload.update({ collection: 'projects', id: proj.id, data: { publicSlate: false } })
      }
      summary.projectsHidden.push(proj.slug)
    }
  }

  // ── 3. V9 page globals ─────────────────────────────────────────────────────
  async function sectionToBlock(s: Section): Promise<Record<string, unknown> | null> {
    switch (s.kind) {
      case 'photo-fold': {
        const [caption, credit] = splitCaption(kv(s, 'caption'))
        return {
          blockType: 'photoFold',
          image: await ensureMedia(kv(s, 'src'), kv(s, 'alt')),
          kicker: kv(s, 'kicker') ?? null,
          heading: kv(s, 'h1') ?? null,
          caption, credit,
          vh100: s.flags.includes('vh100'),
          eager: s.flags.includes('eager'),
        }
      }
      case 'route-line':
        return { blockType: 'routeLine', links: groups(s, 'href').map((g) => ({ href: g.href, label: g.label })) }
      case 'text-fold': {
        const [moreHref, moreLabel] = splitLink(kv(s, 'more'))
        const [linkHref, linkLabel] = splitLink(kv(s, 'link'))
        return {
          blockType: 'textFold',
          scene: kv(s, 'scene') ?? null,
          sceneSlug: kv(s, 'slug') ?? null,
          heading: kv(s, 'h') ?? null,
          lede: kv(s, 'lede') ?? null,
          body: paras(s).join('\n\n') || null,
          quote: kv(s, 'quote') ?? null,
          cite: kv(s, 'cite') ?? null,
          moreHref, moreLabel, linkHref, linkLabel,
          ariaLabel: kv(s, 'aria') ?? null,
          tight: s.flags.includes('tight'),
          asH1: s.flags.includes('h1'),
        }
      }
      case 'quote-feature':
        return { blockType: 'quoteFeature', quote: kv(s, 'quote'), cite: kv(s, 'cite'), note: kv(s, 'note') ?? null }
      case 'slate-list':
        return {
          blockType: 'slateList',
          rows: groups(s, 'title').map((g) => ({
            project: g.href ? projectIds.get(g.href.replace('/work/', '')) ?? null : null,
            title: g.title, href: g.href, logline: g.logline ?? null,
            provenance: g.provenance ?? null, dev: g.dev === 'true',
            // meta is deliberately NOT seeded. The billing block has exactly one
            // home — Project.metaLine — and a per-row override here is what let the
            // two drift apart until four of five investors caught the contradiction
            // (fixed in v11 by fix-billing-blocks.ts). Seeding g.meta would rebuild
            // that second source of truth on the next re-seed and undo the fix.
            meta: null,
          })),
        }
      case 'footnote':
        return { blockType: 'footnote', body: paras(s).join('\n\n') }
      case 'request': {
        const [linkHref, linkLabel] = splitLink(kv(s, 'link'))
        return {
          blockType: 'request',
          scene: kv(s, 'scene') ?? null, sceneSlug: kv(s, 'slug') ?? null,
          heading: kv(s, 'h') ?? null, body: paras(s).join('\n\n') || null,
          linkHref, linkLabel,
        }
      }
      case 'ledger':
        return {
          blockType: 'ledger',
          ariaLabel: kv(s, 'aria') ?? null,
          rows: groups(s, 'dt').map((g) => ({ term: g.dt, definition: g.dd })),
        }
      case 'archival': {
        const [caption, credit] = splitCaption(kv(s, 'caption'))
        return {
          blockType: 'archival',
          image: await ensureMedia(kv(s, 'src'), kv(s, 'alt')),
          caption, credit,
        }
      }
      case 'division-strip':
        return { blockType: 'divisionStrip', divisions: groups(s, 'name').map((g) => ({ name: g.name, blurb: g.blurb })) }
      case 'mood-grid': {
        const items = []
        for (const g of groups(s, 'src')) {
          const [caption, credit] = splitCaption(g.caption)
          items.push({ image: await ensureMedia(g.src, g.alt), caption, credit, wide: g.wide === 'true' })
        }
        return {
          blockType: 'moodGrid',
          ariaLabel: kv(s, 'aria') ?? null,
          scene: kv(s, 'scene') ?? null, sceneSlug: kv(s, 'slug') ?? null,
          heading: kv(s, 'h') ?? null,
          slideshow: s.flags.includes('slideshow'),
          items,
        }
      }
      default:
        console.error(`seed-v9: unknown section kind "${s.kind}" — skipped`)
        return null
    }
  }

  for (const [slug, doc] of Object.entries(pages)) {
    const sections = []
    for (const s of doc.sections) {
      const block = await sectionToBlock(s)
      if (block) sections.push(block)
    }
    const data = {
      seoTitle: doc.frontmatter.title ?? null,
      seoDescription: doc.frontmatter.description ?? null,
      sections,
    }
    if (!DRY) await payload.updateGlobal({ slug, data })
    summary.globalsUpdated.push(`${slug} (${sections.length} sections)`)
  }

  // ── 4. SiteSettings.v9Chrome ───────────────────────────────────────────────
  const header = chrome.sections.find((s) => s.kind === 'header')
  const footer = chrome.sections.find((s) => s.kind === 'footer')
  if (header && footer) {
    const v9Chrome = {
      displayLabel: kv(header, 'display-label'),
      panelTitle: kv(header, 'panel-title'),
      themeLabel: kv(header, 'theme-label'),
      themePremiere: kv(header, 'theme-premiere'),
      themeMatinee: kv(header, 'theme-matinee'),
      themeLateshow: kv(header, 'theme-lateshow'),
      scaleLabel: kv(header, 'scale-label'),
      logoLabel: kv(header, 'logo-label'),
      topLabel: kv(header, 'top-label'),
      prevLabel: kv(header, 'prev-label'),
      nextLabel: kv(header, 'next-label'),
      slateReturn: kv(header, 'slate-return'),
      cta: kv(header, 'cta'),
      colophon: kv(footer, 'colophon'),
      copyright: kv(footer, 'copyright'),
      navLinks: groups(footer, 'href').map((g) => ({ href: g.href, label: g.label })),
    }
    if (!DRY) await payload.updateGlobal({ slug: 'site-settings', data: { v9Chrome } })
    summary.globalsUpdated.push(`site-settings.v9Chrome (${v9Chrome.navLinks.length} nav links)`)
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  const mode = DRY ? 'DRY RUN (no writes)' : 'APPLIED'
  console.log(`\nseed-v9 — ${mode}`)
  console.log('────────────────────────────────────────────')
  console.log(`media uploaded   : ${summary.mediaCreated.length}`)
  for (const m of summary.mediaCreated) console.log(`  + ${m}`)
  console.log(`media existing   : ${summary.mediaExisting}`)
  console.log(`media PENDING    : ${summary.mediaPending.length}`)
  for (const m of summary.mediaPending) console.log(`  ? ${m}`)
  console.log(`projects created : ${summary.projectsCreated.length} ${JSON.stringify(summary.projectsCreated)}`)
  console.log(`projects updated : ${summary.projectsUpdated.length}`)
  for (const p of summary.projectsUpdated) console.log(`  ~ ${p}`)
  console.log(`projects hidden  : ${summary.projectsHidden.length} ${JSON.stringify(summary.projectsHidden)}`)
  console.log(`globals updated  : ${summary.globalsUpdated.length}`)
  for (const g of summary.globalsUpdated) console.log(`  = ${g}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
