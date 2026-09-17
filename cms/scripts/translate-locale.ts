/**
 * translate-locale.ts — first-draft machine translation pipeline (replayable).
 *
 * Three subcommands, each taking `--locale=<code>`:
 *
 *   pnpm translate:extract -- --locale=pt
 *     Reads every localized field on the LIVE v10 site surface — the five v9
 *     page globals (with their `sections` blocks), Site Settings, all Projects
 *     (including publicSlate=false), and every Media doc's `alt` — in the
 *     English (`en`) locale, via Payload's local API. Writes an ordered snapshot
 *     to docs/i18n/drafts/en.snapshot.json. Never writes to the database.
 *
 *   pnpm translate:draft -- --locale=pt
 *     Sends the snapshot to claude-opus-5, one request per document (media
 *     alts batched ~50 per request), and writes the translated draft to
 *     docs/i18n/drafts/<locale>.json — same shape as the snapshot, plus
 *     a `_meta` block. Never touches the database.
 *
 *   pnpm translate:apply -- --locale=pt [--apply] [--force]
 *     Reads docs/i18n/drafts/<locale>.json and writes each field via the
 *     Payload local API with `locale: '<code>'`, leaving every non-localized
 *     field, and every other locale, untouched. Default (no --apply) is a dry
 *     run that only prints field counts. Idempotent: with --apply, a field
 *     that already carries a non-empty value in the target locale is skipped
 *     unless --force is also passed.
 *
 * Field discovery is NOT hardcoded: this script walks Payload's own resolved
 * field config (payload.config.globals / payload.config.collections) the same
 * way Payload itself does, recursing through row/group/array/blocks/tabs, and
 * treats every `text` / `textarea` / `richText` field marked `localized: true`
 * as translatable. This is the same inventory documented by hand in
 * docs/i18n/localized-fields.md (195 fields) — walking the config keeps this
 * script from drifting out of sync with that inventory as fields change.
 *
 * richText (Lexical) fields are never handed to the model as a JSON tree.
 * draft extracts the ordered list of non-empty text-node strings, sends that
 * array, and reinserts the translated strings into a deep copy of the
 * original tree in the same order — the tree shape (marks, links, formatting)
 * is untouched.
 *
 * Run from cms/:
 *   pnpm translate:extract -- --locale=pt
 *   pnpm translate:draft -- --locale=pt
 *   pnpm translate:apply -- --locale=pt --apply
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

import { SITE_LOCALE_CODES, DEFAULT_LOCALE } from '../src/locales.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CMS_ROOT = path.resolve(__dirname, '..')
const REPO_ROOT = path.resolve(CMS_ROOT, '..')
const DRAFTS_DIR = path.join(REPO_ROOT, 'docs/i18n/drafts')
const SNAPSHOT_PATH = path.join(DRAFTS_DIR, 'en.snapshot.json')
const draftPathFor = (locale: string) => path.join(DRAFTS_DIR, `${locale}.json`)

const V9_GLOBAL_SLUGS = ['v9-home', 'v9-slate', 'v9-craft', 'v9-methods', 'v9-contact'] as const
const SITE_SETTINGS_SLUG = 'site-settings'
const MEDIA_BATCH_SIZE = 50
const MODEL = 'claude-opus-5'

// ── CLI ───────────────────────────────────────────────────────────────────

const SUBCOMMANDS = ['extract', 'draft', 'apply'] as const
type Subcommand = (typeof SUBCOMMANDS)[number]

function fail(msg: string): never {
  console.error(`translate-locale: ${msg}`)
  process.exit(1)
}

const sub = process.argv[2] as Subcommand | undefined
if (!sub || !SUBCOMMANDS.includes(sub)) {
  fail(`first argument must be one of: ${SUBCOMMANDS.join(', ')}. No changes made.`)
}

const localeArg = process.argv.find((a) => a.startsWith('--locale='))
const LOCALE = localeArg ? localeArg.slice('--locale='.length) : ''
if (!LOCALE) fail('missing --locale=<code>. No changes made.')
if (!(SITE_LOCALE_CODES as string[]).includes(LOCALE)) {
  fail(`unknown locale "${LOCALE}". Known locales: ${SITE_LOCALE_CODES.join(', ')}. No changes made.`)
}
if (LOCALE === DEFAULT_LOCALE) fail(`locale "${LOCALE}" is the default locale — nothing to translate.`)

const APPLY = process.argv.includes('--apply')
const FORCE = process.argv.includes('--force')
if (FORCE && !APPLY) fail('--force only makes sense with --apply. No changes made.')

// ── Generic field walker (mirrors Payload's own field-config shape) ────────

type FieldPathEntry = { path: string; type: 'text' | 'textarea' | 'richText'; value: unknown; defaultValue?: unknown }

/**
 * `all: true` collects every localized text/textarea/richText field regardless of
 * whether its current value is empty, and carries the field config's `defaultValue`
 * along — needed by apply's idempotency check (see the defaultValue note there).
 * Default (`all` unset) only collects non-empty fields — what extract/draft want.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function walkFields(fields: any[] | undefined, data: any, prefix: string, out: FieldPathEntry[], opts: { all?: boolean } = {}): void {
  if (!Array.isArray(fields) || data == null) return
  for (const f of fields) {
    if (f.type === 'row' || f.type === 'collapsible') {
      walkFields(f.fields, data, prefix, out, opts)
      continue
    }
    if (f.type === 'tabs') {
      for (const tab of f.tabs ?? []) {
        if (tab.name) walkFields(tab.fields, data?.[tab.name], prefix ? `${prefix}.${tab.name}` : tab.name, out, opts)
        else walkFields(tab.fields, data, prefix, out, opts)
      }
      continue
    }
    const name: string | undefined = f.name
    if (!name) continue
    const path_ = prefix ? `${prefix}.${name}` : name
    const value = data?.[name]
    if (f.type === 'group') {
      walkFields(f.fields, value, path_, out, opts)
      continue
    }
    if (f.type === 'array') {
      if (Array.isArray(value)) value.forEach((item, i) => walkFields(f.fields, item, `${path_}.${i}`, out, opts))
      continue
    }
    if (f.type === 'blocks') {
      if (Array.isArray(value)) {
        value.forEach((item, i) => {
          const blockDef = (f.blocks ?? []).find((b: { slug: string }) => b.slug === item?.blockType)
          if (blockDef) walkFields(blockDef.fields, item, `${path_}.${i}`, out, opts)
        })
      }
      continue
    }
    if ((f.type === 'text' || f.type === 'textarea' || f.type === 'richText') && f.localized) {
      if (opts.all) {
        out.push({ path: path_, type: f.type, value, defaultValue: f.defaultValue })
        continue
      }
      const empty =
        value === undefined ||
        value === null ||
        value === '' ||
        (f.type === 'richText' && isEmptyLexical(value))
      if (!empty) out.push({ path: path_, type: f.type, value })
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isEmptyLexical(tree: any): boolean {
  const texts: string[] = []
  extractLexicalTexts(tree, texts)
  return texts.length === 0
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractLexicalTexts(node: any, out: string[]): void {
  if (!node || typeof node !== 'object') return
  if (node.type === 'text' && typeof node.text === 'string' && node.text.trim() !== '') {
    out.push(node.text)
  }
  if (Array.isArray(node.children)) for (const c of node.children) extractLexicalTexts(c, out)
  if (node.root) extractLexicalTexts(node.root, out)
}

/** Deep copy `tree`, replacing text-node strings in document order from `texts`. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reinsertLexicalTexts(node: any, texts: string[], idx: { i: number }): any {
  if (!node || typeof node !== 'object') return node
  if (Array.isArray(node)) return node.map((n) => reinsertLexicalTexts(n, texts, idx))
  const clone: Record<string, unknown> = { ...node }
  if (clone.type === 'text' && typeof clone.text === 'string' && (clone.text as string).trim() !== '') {
    clone.text = texts[idx.i]
    idx.i += 1
  }
  if (Array.isArray(clone.children)) clone.children = reinsertLexicalTexts(clone.children, texts, idx)
  if (clone.root) clone.root = reinsertLexicalTexts(clone.root, texts, idx)
  return clone
}

function getAtPath(obj: unknown, path_: string): unknown {
  const parts = path_.split('.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cur: any = obj
  for (const p of parts) {
    if (cur == null) return undefined
    cur = cur[/^\d+$/.test(p) ? Number(p) : p]
  }
  return cur
}

function setAtPath(obj: unknown, path_: string, value: unknown): void {
  const parts = path_.split('.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cur: any = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i]
    const key = /^\d+$/.test(p) ? Number(p) : p
    if (cur[key] == null) return // structure vanished under us — skip, do not create
    cur = cur[key]
  }
  const last = parts[parts.length - 1]
  cur[/^\d+$/.test(last) ? Number(last) : last] = value
}

// ── Doc identity ─────────────────────────────────────────────────────────
// Snapshot/draft keys: "<collectionOrGlobal>:<id or slug>"

type FieldMap = Record<string, unknown>
type DocMap = Record<string, FieldMap>

const globalKey = (slug: string) => `${slug}:${slug}`
const projectKey = (slug: string) => `projects:${slug}`
const mediaKey = (id: number | string) => `media:${id}`

// ── Payload bootstrap (shared by extract + apply) ───────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getPayloadInstance(): Promise<any> {
  if (!process.env.DATABASE_URL) fail('DATABASE_URL not set. No changes made.')
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config.js')
  return getPayload({ config })
}

// ── extract ─────────────────────────────────────────────────────────────

async function runExtract(): Promise<void> {
  const payload = await getPayloadInstance()
  const snapshot: DocMap = {}
  let fieldTotal = 0

  for (const slug of V9_GLOBAL_SLUGS) {
    const cfg = payload.config.globals.find((g: { slug: string }) => g.slug === slug)
    if (!cfg) fail(`global "${slug}" not found in payload config`)
    const doc = await payload.findGlobal({ slug, locale: 'en', depth: 0 })
    const entries: FieldPathEntry[] = []
    walkFields(cfg.fields, doc, '', entries)
    if (entries.length) {
      snapshot[globalKey(slug)] = Object.fromEntries(entries.map((e) => [e.path, e.value]))
      fieldTotal += entries.length
    }
  }

  {
    const cfg = payload.config.globals.find((g: { slug: string }) => g.slug === SITE_SETTINGS_SLUG)
    if (!cfg) fail(`global "${SITE_SETTINGS_SLUG}" not found in payload config`)
    const doc = await payload.findGlobal({ slug: SITE_SETTINGS_SLUG, locale: 'en', depth: 0 })
    const entries: FieldPathEntry[] = []
    walkFields(cfg.fields, doc, '', entries)
    if (entries.length) {
      snapshot[globalKey(SITE_SETTINGS_SLUG)] = Object.fromEntries(entries.map((e) => [e.path, e.value]))
      fieldTotal += entries.length
    }
  }

  {
    const cfg = payload.config.collections.find((c: { slug: string }) => c.slug === 'projects')
    if (!cfg) fail('collection "projects" not found in payload config')
    const { docs } = await payload.find({ collection: 'projects', limit: 1000, depth: 0, locale: 'en' })
    for (const doc of docs) {
      const entries: FieldPathEntry[] = []
      walkFields(cfg.fields, doc, '', entries)
      if (entries.length) {
        snapshot[projectKey(doc.slug)] = Object.fromEntries(entries.map((e) => [e.path, e.value]))
        fieldTotal += entries.length
      }
    }
  }

  {
    const { docs } = await payload.find({ collection: 'media', limit: 1000, depth: 0, locale: 'en' })
    for (const doc of docs) {
      if (typeof doc.alt === 'string' && doc.alt.trim() !== '') {
        snapshot[mediaKey(doc.id)] = { alt: doc.alt }
        fieldTotal += 1
      }
    }
  }

  fs.mkdirSync(DRAFTS_DIR, { recursive: true })
  fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2) + '\n')

  console.log('\ntranslate-locale extract')
  console.log('────────────────────────')
  console.log(`documents          : ${Object.keys(snapshot).length}`)
  console.log(`localized fields    : ${fieldTotal}`)
  console.log(`wrote               : ${path.relative(REPO_ROOT, SNAPSHOT_PATH)}`)
  process.exit(0)
}

// ── draft ───────────────────────────────────────────────────────────────

const LANGUAGES: Record<string, { name: string; usage: string; exonym: string }> = {
  pt: {
    name: 'Brazilian Portuguese',
    usage: '${LANG.usage}',
    exonym: '${LANG.exonym}',
  },
  it: {
    name: 'Italian',
    usage: 'Use standard Italian as written in Italy; formal register without the Lei address (the site speaks to a general public, not to one reader).',
    exonym: 'keep their Italian exonyms only where a standard one exists, e.g. Venezia, New York stays New York',
  },
  fr: {
    name: 'French',
    usage: 'Use standard French as written in France, with French typographic conventions (espace before : ; ? ! as non-breaking where possible, guillemets « » for quotations).',
    exonym: 'keep their French exonyms only where a standard one exists, e.g. Venise, New York stays New York',
  },
  de: {
    name: 'German',
    usage: 'Use standard German as written in Germany (new orthography, ß where correct); address the public in the formal Sie only where the original addresses the reader directly.',
    exonym: 'keep their German exonyms only where a standard one exists, e.g. Venedig, New York stays New York',
  },
}
const LANG = LANGUAGES[LOCALE]
if (!LANG) fail(`no translator guidance for locale '${LOCALE}' (known: ${Object.keys(LANGUAGES).join(', ')}). No changes made.`)

const SYSTEM_PROMPT = `You are the house translator for APR 70 Pictures, an independent New York film and television studio with three divisions: (212) Pictures, (310) Pictures, and New Renaissance Cinema. Translate the JSON values from English into ${LANG.name} for the studio's public website. Register: cinematic, spare, confident, editorial — the voice of a studio's title cards and programme notes, never marketing copy. Keep every key and the structure identical. Do not translate: the names 'APR 70 Pictures', '(212) Pictures', '(310) Pictures', 'New Renaissance Cinema', 'AI Mark', film and property titles, people's names, place names that are proper nouns (Red Hook, Sea Gate, Long Island City, Taormina, Modica, Venice ${LANG.exonym}), keycodes and short uppercase codes, numbers, dates, URLs, email addresses, HTML/markup, placeholders. Preserve line breaks, punctuation tokens, en/em dashes and middots. ${LANG.usage} Output ONLY the JSON object.`

type UsageTotals = { requests: number; inputTokens: number; outputTokens: number }

function stripFence(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function callModel(client: any, input: Record<string, unknown>, usage: UsageTotals): Promise<Record<string, unknown>> {
  const inputJson = JSON.stringify(input)
  const maxTokens = Math.min(32000, Math.max(4096, Math.ceil((inputJson.length / 3) * 4)))
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system: SYSTEM_PROMPT,
    // Translation is mechanical, not a hard reasoning task — low effort keeps
    // adaptive thinking (on by default for claude-opus-5) cheap without
    // disabling it outright (disabling has its own failure modes).
    output_config: { effort: 'low' },
    messages: [{ role: 'user', content: inputJson }],
  })
  usage.requests += 1
  usage.inputTokens += msg.usage?.input_tokens ?? 0
  usage.outputTokens += msg.usage?.output_tokens ?? 0
  const text = msg.content.find((b: { type: string }) => b.type === 'text')?.text ?? ''
  return JSON.parse(stripFence(text))
}

function keyShapeOf(o: Record<string, unknown>): string[] {
  return Object.keys(o).sort()
}

/** Guard: identical key set; for array values, identical array length. Throws on mismatch. */
function assertShape(input: Record<string, unknown>, output: Record<string, unknown>): void {
  const ka = keyShapeOf(input)
  const kb = keyShapeOf(output)
  const missing = ka.filter((k) => !kb.includes(k))
  const extra = kb.filter((k) => !ka.includes(k))
  if (missing.length || extra.length) {
    throw new Error(`key shape mismatch — missing:[${missing.join(',')}] extra:[${extra.join(',')}]`)
  }
  for (const k of ka) {
    const iv = input[k]
    const ov = output[k]
    if (Array.isArray(iv)) {
      if (!Array.isArray(ov) || ov.length !== iv.length) {
        throw new Error(`array length mismatch at "${k}" — expected ${Array.isArray(iv) ? iv.length : '?'}, got ${Array.isArray(ov) ? ov.length : typeof ov}`)
      }
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function callModelWithRetry(client: any, input: Record<string, unknown>, usage: UsageTotals): Promise<Record<string, unknown>> {
  try {
    const out = await callModel(client, input, usage)
    assertShape(input, out)
    return out
  } catch (err) {
    console.warn(`  retrying once after: ${(err as Error).message.slice(0, 200)}`)
    const out = await callModel(client, input, usage)
    assertShape(input, out)
    return out
  }
}

async function runDraft(): Promise<void> {
  if (!fs.existsSync(SNAPSHOT_PATH)) fail(`missing ${path.relative(REPO_ROOT, SNAPSHOT_PATH)} — run translate:extract first.`)
  if (!process.env.ANTHROPIC_API_KEY) fail('ANTHROPIC_API_KEY missing (source the Vik Muniz workflow env first).')

  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const client = new Anthropic()

  const snapshotRaw = fs.readFileSync(SNAPSHOT_PATH, 'utf8')
  const snapshot: DocMap = JSON.parse(snapshotRaw)
  const snapshotHash = crypto.createHash('sha256').update(snapshotRaw).digest('hex').slice(0, 16)

  const usage: UsageTotals = { requests: 0, inputTokens: 0, outputTokens: 0 }
  const draft: DocMap = {}

  const docKeys = Object.keys(snapshot).filter((k) => !k.startsWith('media:'))
  const mediaKeys = Object.keys(snapshot).filter((k) => k.startsWith('media:'))

  let fieldTotal = 0
  let docFieldTotal = 0

  // ── one request per non-media document ──────────────────────────────────
  for (const docKey of docKeys) {
    const fields = snapshot[docKey]
    // Lexical fields go in as an ordered string array; everything else as-is.
    const modelInput: Record<string, unknown> = {}
    const lexicalTrees: Record<string, unknown> = {}
    for (const [fieldPath, value] of Object.entries(fields)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const texts: string[] = []
        extractLexicalTexts(value, texts)
        modelInput[fieldPath] = texts
        lexicalTrees[fieldPath] = value
      } else {
        modelInput[fieldPath] = value
      }
    }
    console.log(`draft: ${docKey} (${Object.keys(modelInput).length} fields)`)
    const out = await callModelWithRetry(client, modelInput, usage)

    const docOut: FieldMap = {}
    for (const [fieldPath, translated] of Object.entries(out)) {
      if (lexicalTrees[fieldPath]) {
        const idx = { i: 0 }
        docOut[fieldPath] = reinsertLexicalTexts(lexicalTrees[fieldPath], translated as string[], idx)
      } else {
        docOut[fieldPath] = translated
      }
      docFieldTotal += 1
    }
    draft[docKey] = docOut
  }

  // ── media alts, batched ~50 per request ─────────────────────────────────
  for (let i = 0; i < mediaKeys.length; i += MEDIA_BATCH_SIZE) {
    const batch = mediaKeys.slice(i, i + MEDIA_BATCH_SIZE)
    const modelInput: Record<string, string> = {}
    for (const k of batch) modelInput[k] = snapshot[k].alt as string
    console.log(`draft: media batch ${i / MEDIA_BATCH_SIZE + 1} (${batch.length} alts)`)
    const out = await callModelWithRetry(client, modelInput, usage)
    for (const k of batch) {
      draft[k] = { alt: out[k] }
      docFieldTotal += 1
    }
  }

  fieldTotal = docFieldTotal

  const meta = {
    model: MODEL,
    date: new Date().toISOString().slice(0, 10),
    sourceSnapshotHash: snapshotHash,
    docCount: Object.keys(draft).length,
    fieldCount: fieldTotal,
    requests: usage.requests,
    inputTokens: usage.inputTokens,
    outputTokens: usage.outputTokens,
  }

  const out = { _meta: meta, ...draft }
  fs.writeFileSync(draftPathFor(LOCALE), JSON.stringify(out, null, 2) + '\n')

  console.log('\ntranslate-locale draft')
  console.log('───────────────────────')
  console.log(`documents           : ${meta.docCount}`)
  console.log(`fields translated   : ${meta.fieldCount}`)
  console.log(`requests            : ${meta.requests}`)
  console.log(`input tokens        : ${meta.inputTokens}`)
  console.log(`output tokens       : ${meta.outputTokens}`)
  console.log(`wrote               : ${path.relative(REPO_ROOT, draftPathFor(LOCALE))}`)
  process.exit(0)
}

// ── apply ───────────────────────────────────────────────────────────────

async function runApply(): Promise<void> {
  const draftPath = draftPathFor(LOCALE)
  if (!fs.existsSync(draftPath)) fail(`missing ${path.relative(REPO_ROOT, draftPath)} — run translate:draft first.`)
  const draft: DocMap & { _meta?: unknown } = JSON.parse(fs.readFileSync(draftPath, 'utf8'))
  const { _meta, ...docs } = draft

  const payload = await getPayloadInstance()
  const projectsCfg = payload.config.collections.find((c: { slug: string }) => c.slug === 'projects')
  const mediaCfg = payload.config.collections.find((c: { slug: string }) => c.slug === 'media')

  let writtenTotal = 0
  let skippedTotal = 0
  const perDoc: { key: string; written: number; skipped: number }[] = []

  for (const [docKey, fields] of Object.entries(docs)) {
    const [kind, idOrSlug] = docKey.split(/:(.*)/s)
    let current: Record<string, unknown> | null = null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cfgFields: any[] | undefined

    if ((V9_GLOBAL_SLUGS as readonly string[]).includes(kind) || kind === SITE_SETTINGS_SLUG) {
      const cfg = payload.config.globals.find((g: { slug: string }) => g.slug === kind)
      cfgFields = cfg?.fields
      current = await payload.findGlobal({ slug: kind, locale: LOCALE, fallbackLocale: false, depth: 0 })
    } else if (kind === 'projects') {
      cfgFields = projectsCfg?.fields
      const { docs: found } = await payload.find({
        collection: 'projects',
        where: { slug: { equals: idOrSlug } },
        limit: 1,
        locale: LOCALE,
        fallbackLocale: false,
        depth: 0,
      })
      current = found[0] ?? null
    } else if (kind === 'media') {
      cfgFields = mediaCfg?.fields
      current = await payload.findByID({ collection: 'media', id: idOrSlug, locale: LOCALE, fallbackLocale: false, depth: 0 }).catch(() => null)
    }

    if (!current) {
      console.warn(`  skip ${docKey}: document not found`)
      continue
    }

    // Payload substitutes a field's static `defaultValue` when the stored
    // locale value is undefined (e.g. SiteSettings.aiMark.text defaults to
    // "APR 70 · AI GEN") — even with fallbackLocale:false. That default can
    // read as "non-empty" for a field pt has never actually had a value for.
    // Build a path -> defaultValue map from the same structural read so the
    // idempotency check below can tell "genuinely translated" from "just the
    // untouched default" and still write the field.
    const defaultEntries: FieldPathEntry[] = []
    if (cfgFields) walkFields(cfgFields, current, '', defaultEntries, { all: true })
    const defaultsByPath = new Map(defaultEntries.map((e) => [e.path, e.defaultValue]))

    const working = structuredClone(current)
    let written = 0
    let skipped = 0
    for (const [fieldPath, translatedValue] of Object.entries(fields as FieldMap)) {
      const existing = getAtPath(working, fieldPath)
      const dv = defaultsByPath.get(fieldPath)
      const isUntouchedDefault = dv !== undefined && existing === dv
      const existingEmpty =
        existing === undefined ||
        existing === null ||
        existing === '' ||
        isUntouchedDefault ||
        (existing && typeof existing === 'object' && !Array.isArray(existing) && isEmptyLexical(existing))
      if (!existingEmpty) {
        skipped += 1
        if (!FORCE) continue
      }
      setAtPath(working, fieldPath, translatedValue)
      written += 1
    }
    perDoc.push({ key: docKey, written, skipped })
    writtenTotal += written
    skippedTotal += skipped

    if (APPLY && written > 0) {
      if ((V9_GLOBAL_SLUGS as readonly string[]).includes(kind) || kind === SITE_SETTINGS_SLUG) {
        await payload.updateGlobal({ slug: kind, data: working, locale: LOCALE })
      } else if (kind === 'projects') {
        await payload.update({ collection: 'projects', id: (current as { id: unknown }).id, data: working, locale: LOCALE })
      } else if (kind === 'media') {
        await payload.update({ collection: 'media', id: idOrSlug, data: working, locale: LOCALE })
      }
    }
  }

  console.log(`\ntranslate-locale apply — locale=${LOCALE} — ${APPLY ? (FORCE ? 'APPLIED (--force)' : 'APPLIED') : 'DRY RUN (no writes)'}`)
  console.log('──────────────────────────────────────────────────────────────')
  for (const d of perDoc) {
    console.log(`  ${d.key.padEnd(28)} ${APPLY ? 'wrote' : 'would write'} ${String(d.written).padStart(3)}  skip ${d.skipped}`)
  }
  console.log('──────────────────────────────────────────────────────────────')
  console.log(`documents            : ${perDoc.length}`)
  console.log(`fields ${APPLY ? 'written' : 'would write'}    : ${writtenTotal}`)
  console.log(`fields skipped       : ${skippedTotal} (already non-empty in ${LOCALE}${FORCE ? ', ignored by --force' : ''})`)
  process.exit(0)
}

// ── main ────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (sub === 'extract') return runExtract()
  if (sub === 'draft') return runDraft()
  if (sub === 'apply') return runApply()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
