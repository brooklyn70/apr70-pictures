import type { Home, Media, Project, V9Home } from 'payload-types'
import { placeholderUrl, type PlaceholderOptions } from './placeholder'

// Generic layout-bearing global (About, Contact, Jobs, Pitch, Investors share
// the same shape as Home; types will be generated after next `payload generate:types`).
export type PageGlobalData = {
  id?: number
  layout?: unknown[] | null
  updatedAt?: string | null
  createdAt?: string | null
}

const trimSlash = (s: string) => s.replace(/\/$/, '')

// import.meta.env.PUBLIC_* is baked at build time in Astro; fall back to
// process.env so the Docker runtime env var is picked up when the build
// ran without PUBLIC_PAYLOAD_URL set.
const PAYLOAD_URL: string =
  (import.meta.env.PUBLIC_PAYLOAD_URL as string | undefined) ||
  (typeof process !== 'undefined' && process.env.PUBLIC_PAYLOAD_URL) ||
  ''

// ── Type helpers (until `payload generate:types` runs for the new globals) ──

export type FooterLink = {
  label: string
  href: string
  openInNewTab?: boolean | null
  id?: string | null
}

/** The house colour vocabulary. Mirrors DIVISION_ACCENT_OPTIONS in the CMS
 *  (cms/src/globals/SiteSettings.ts). Free-form hex is deliberately impossible:
 *  each token resolves in themes/marquee.css to an OKLCH pair with a dark AND a
 *  light variant that both pass contrast. */
export type AccentToken = 'flame' | 'amber' | 'imax' | 'sicilian-blue' | 'nrc-grey'

export type BrandKitData = {
  logoHeight?: number | null
  modeDefault?: 'system' | 'dark' | 'light' | null
  accent?: AccentToken | null
  linkHover?: 'accent' | 'flame' | 'amber' | 'imax' | 'sicilian-blue' | 'ink' | null
  highlight?: 'flame' | 'amber' | 'sicilian-blue' | 'ink' | null
}

/** The DISPATCH switch — Site Settings → DISPATCH in Payload. `enabled` is the
 *  whole public contract: false (or absent) means /dispatch does not exist. */
export type DispatchSettings = {
  enabled?: boolean | null
  navLabel?: string | null
}

/** The TROUPE switch — Site Settings → TROUPE. Unlike DISPATCH, `enabled` is
 *  only HALF the contract: /troupe also requires an audio file on the Troupe
 *  Programme. See TroupeProgramData below. */
export type TroupeSettings = {
  enabled?: boolean | null
  navLabel?: string | null
}

/** THE APR 70 TROUPE PRESENTS — the radio programme (/troupe).
 *  `audio` is the gate: no recording, no page. */
export type TroupeCastMember = {
  role?: string | null
  player?: string | null
}

export type TroupeProgramData = {
  programNumber?: string | null
  runtime?: string | null
  recordedOn?: string | null
  title?: string | null
  subtitle?: string | null
  property?: ProjectDoc | number | null
  logline?: string | null
  audio?: Media | number | null
  poster?: Media | number | null
  cast?: TroupeCastMember[] | null
  programmeNote?: string | null
  credits?: string | null
}

export type SiteSettingsData = {
  brandLabel?: string | null
  legalEntity?: string | null
  tagline?: string | null
  showFilmstripRails?: boolean | null
  dispatch?: DispatchSettings | null
  troupe?: TroupeSettings | null
  /* Favicons (v11) — `favicon` finally does something; the rest are optional. */
  faviconDark?: Media | number | null
  appleTouchIcon?: Media | number | null
  /* Division Brand (v11) — the per-division accent + tab icon, formerly hardcoded
     in 212.astro / 310.astro / nrc.astro. */
  accent212?: AccentToken | null
  favicon212?: Media | number | null
  accent310?: AccentToken | null
  favicon310?: Media | number | null
  accentNrc?: AccentToken | null
  faviconNrc?: Media | number | null
  lastDeployed?: string | null
  seededVersion?: string | null
  favicon?: Media | number | null
  navLogoLight?: Media | number | null
  navLogoDark?: Media | number | null
  brandKit?: BrandKitData | null
}

export type DivisionGlobalData = {
  id?: number
  headerLogo?: Media | number | null
  footerLogo?: Media | number | null
  faviconOverride?: Media | number | null
  layout?: unknown[] | null
  updatedAt?: string | null
  createdAt?: string | null
}

export type FooterLinksData = {
  primaryNav?: FooterLink[] | null
  divisionNav?: FooterLink[] | null
  moreNav?: FooterLink[] | null
}

// ── Typed errors ─────────────────────────────────────────────────────────────

/** Rich error for failed Payload REST calls (also summarized in `error` strings). */
export class PayloadHttpError extends Error {
  override readonly name = 'PayloadHttpError'

  constructor(
    message: string,
    readonly status: number,
    readonly url: string,
  ) {
    super(message)
  }
}

export type PayloadFetchResult<T> = {
  data: T | null
  error: string | null
  /** True when a cached success was returned past its fresh TTL but within stale window. */
  stale?: boolean
}

// ── Cache / SWR (in-process TTL + stale-while-revalidate + single-flight) ────
//
// Egress discipline (VMS lesson #2): every fetcher below runs through this
// cache, and the LIST fetchers cache mapped SLIM projections — never raw
// Payload docs. VMS burned 55 GB of Supabase egress in a month with 0 users
// from uncached full-catalogue reads (builds, dev servers, crawlers). Any
// deploy that points at Supabase ships WITH this layer, non-negotiable.
//
// Scope — the cache is PER-INSTANCE, in-process:
// - @astrojs/node standalone (NAS/local): one long-lived process, so TTLs
//   behave exactly as configured.
// - Vercel serverless (DEPLOY_TARGET=vercel): each function instance holds
//   its own Map. A cold start begins empty (first request pays one cms
//   round-trip per key) and N concurrent instances hold N copies. Fluid
//   Compute reuses instances, so hit rates are good in practice — but this
//   is a best-effort egress damper, not a shared cache. If cms/DB load ever
//   matters at scale, promote hot keys to a shared layer (Vercel Runtime
//   Cache / KV); keep the slim projections either way.
// - Single-flight dedupe (coldInflight/bgInflight) also only dedupes within
//   one instance.

const swrCache = new Map<string, { value: PayloadFetchResult<unknown>; at: number }>()
const coldInflight = new Map<string, Promise<void>>()
const bgInflight = new Map<string, Promise<void>>()
/** Latest cold-path result when nothing was written to swrCache (errors or empty). */
const coldLastResult = new Map<string, PayloadFetchResult<unknown>>()

function readPublicEnv(key: string): string | undefined {
  const fromImport =
    typeof import.meta !== 'undefined'
      ? (import.meta.env as Record<string, string | undefined>)[key]
      : undefined
  const fromProcess = typeof process !== 'undefined' ? process.env[key] : undefined
  return fromImport ?? fromProcess
}

function envFlagTrue(key: string): boolean {
  const v = readPublicEnv(key)
  return v === '1' || v === 'true'
}

function envIntSec(key: string, fallbackSec: number): number {
  const raw = readPublicEnv(key)
  const n = raw ? Number.parseInt(raw, 10) : NaN
  return Number.isFinite(n) && n >= 0 ? n : fallbackSec
}

function usePayloadCache(): boolean {
  if (import.meta.env.DEV) return envFlagTrue('PUBLIC_PAYLOAD_CACHE_IN_DEV')
  return !envFlagTrue('PUBLIC_PAYLOAD_CACHE_OFF')
}

function freshMs(): number {
  if (!usePayloadCache()) return 0
  return envIntSec('PUBLIC_PAYLOAD_CACHE_FRESH_SEC', 60) * 1000
}

function staleMs(): number {
  if (!usePayloadCache()) return 0
  return envIntSec('PUBLIC_PAYLOAD_CACHE_STALE_SEC', 300) * 1000
}

/** Clears in-memory Payload REST cache (e.g. after tests or admin publish hooks). */
export function clearPayloadCache(): void {
  swrCache.clear()
  coldInflight.clear()
  bgInflight.clear()
  coldLastResult.clear()
}

async function withSwrCache<T>(
  key: string,
  fetcher: () => Promise<PayloadFetchResult<T>>,
): Promise<PayloadFetchResult<T>> {
  if (!usePayloadCache() || freshMs() === 0) {
    return fetcher()
  }

  const fMs = freshMs()
  const sMs = staleMs()
  const now = Date.now()
  const existing = swrCache.get(key) as { value: PayloadFetchResult<T>; at: number } | undefined

  const hit =
    existing &&
    existing.value.error === null &&
    existing.value.data != null

  if (hit) {
    const age = now - existing.at
    if (age < fMs) {
      return { data: existing.value.data, error: null }
    }
    if (age < fMs + sMs) {
      void revalidateInBackground(key, fetcher)
      return { data: existing.value.data, error: null, stale: true }
    }
  }

  let wait = coldInflight.get(key)
  if (!wait) {
    wait = (async () => {
      try {
        const next = await fetcher()
        coldLastResult.set(key, next)
        if (next.error === null && next.data != null) {
          swrCache.set(key, { value: next, at: Date.now() })
        } else {
          swrCache.delete(key)
        }
      } finally {
        coldInflight.delete(key)
      }
    })()
    coldInflight.set(key, wait)
  }
  await wait

  const entry = swrCache.get(key) as { value: PayloadFetchResult<T>; at: number } | undefined
  if (entry && entry.value.error === null && entry.value.data != null) {
    return { ...entry.value }
  }

  const last = coldLastResult.get(key) as PayloadFetchResult<T> | undefined
  if (last) {
    return { ...last }
  }

  return { data: null, error: 'Unexpected empty Payload response' }
}

async function revalidateInBackground<T>(
  key: string,
  fetcher: () => Promise<PayloadFetchResult<T>>,
): Promise<void> {
  if (bgInflight.has(key)) return
  const p = (async () => {
    try {
      const next = await fetcher()
      const cur = swrCache.get(key) as { value: PayloadFetchResult<T>; at: number } | undefined
      const hadOk =
        cur &&
        cur.value.error === null &&
        cur.value.data != null
      if (next.error === null && next.data != null) {
        swrCache.set(key, { value: next, at: Date.now() })
      } else if (!hadOk) {
        swrCache.delete(key)
      }
    } finally {
      bgInflight.delete(key)
    }
  })()
  bgInflight.set(key, p)
}

// ── Low-level HTTP ───────────────────────────────────────────────────────────

async function payloadGetJson(url: string): Promise<{ json: unknown } | { error: string }> {
  if (!PAYLOAD_URL) {
    return { error: 'Set PUBLIC_PAYLOAD_URL for build/runtime (see web/.env.example).' }
  }
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(25_000),
    })
    if (!res.ok) {
      const err = new PayloadHttpError(
        `Payload returned ${res.status} ${res.statusText} for ${url}`,
        res.status,
        url,
      )
      return { error: err.message }
    }
    const raw = await res.json()
    return { json: raw }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown fetch error'
    return { error: message }
  }
}

// ── Generic parse helpers ─────────────────────────────────────────────────────

function parseHomeResponse(raw: unknown): Home | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as Record<string, unknown>
  if (obj.doc && typeof obj.doc === 'object') {
    return obj.doc as Home
  }
  if ('id' in obj || 'layout' in obj) {
    return obj as Home
  }
  return null
}

function parseGlobalResponse<T>(raw: unknown): T | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as Record<string, unknown>
  if (obj.doc && typeof obj.doc === 'object') return obj.doc as T
  return raw as T
}

// ── Media URL resolver ────────────────────────────────────────────────────────

// On NAS/Docker, relative media paths resolve via the nginx reverse proxy.
// On Vercel the web origin has no media proxy, so Vercel builds set
// PUBLIC_MEDIA_BASE to the CMS origin and media URLs become absolute.
const MEDIA_BASE =
  ((import.meta.env.PUBLIC_MEDIA_BASE as string | undefined) ?? '').replace(/\/+$/, '')

// Accepts a Media doc or any of its generated size entries — both carry a `url`.
export function resolveMediaUrl(
  media: { url?: string | null } | null | undefined,
): string | undefined {
  if (!media?.url) return undefined
  const u = media.url
  if (u.startsWith('http://') || u.startsWith('https://')) return u
  return `${MEDIA_BASE}${u.startsWith('/') ? '' : '/'}${u}`
}

/**
 * The generated tiers, as a srcset.
 *
 * Without this the site hands browsers the original — 3-11MB PNG masters that then get
 * downscaled client-side, while thumb/card/hero sit unused on disk. The originals stay the
 * masters; these are what actually ship.
 */
export function resolveMediaSrcset(media: Media | null | undefined): string | undefined {
  const sizes = media?.sizes as
    | Record<string, { url?: string | null; width?: number | null } | undefined>
    | undefined
  if (!sizes) return undefined

  const entries: string[] = []
  for (const key of ['thumb', 'card', 'hero']) {
    const size = sizes[key]
    const url = resolveMediaUrl(size)
    if (url && size?.width) entries.push(`${url} ${size.width}w`)
  }
  return entries.length ? entries.join(', ') : undefined
}

/**
 * Returns a usable image URL for a block. Real Media wins; when missing,
 * falls back to a branded placeholder so iteration pages always render.
 * Pass `opts.aspect` to match the block's display ratio and `opts.division`
 * to tint the placeholder (`212`/`310`/`nrc`/`null`).
 */
export function resolveMediaSrcOrPlaceholder(
  media: Media | null | undefined,
  opts: PlaceholderOptions = {},
): { src: string; isPlaceholder: boolean; alt: string; width?: number; height?: number } {
  const real = resolveMediaUrl(media ?? undefined)
  if (real) {
    return {
      src: real,
      isPlaceholder: false,
      alt: media?.alt ?? '',
      width: media?.width ?? undefined,
      height: media?.height ?? undefined,
    }
  }
  return {
    src: placeholderUrl(opts),
    isPlaceholder: true,
    alt: '',
  }
}

// ── Generic fetcher ───────────────────────────────────────────────────────────

async function fetchGlobalUncached<T>(
  slug: string,
  depth = 1,
): Promise<PayloadFetchResult<T>> {
  const apiBase = PAYLOAD_URL
  if (!apiBase) {
    return { data: null, error: 'Set PUBLIC_PAYLOAD_URL for build/runtime (see web/.env.example).' }
  }
  const url = `${trimSlash(apiBase)}/api/globals/${slug}?depth=${depth}`
  const got = await payloadGetJson(url)
  if ('error' in got) return { data: null, error: got.error }
  const data = parseGlobalResponse<T>(got.json)
  if (!data) return { data: null, error: `Unexpected Payload response for /api/globals/${slug}` }
  return { data, error: null }
}

async function fetchGlobal<T>(slug: string, depth = 1): Promise<PayloadFetchResult<T>> {
  const key = `global:${slug}:d${depth}`
  return withSwrCache(key, () => fetchGlobalUncached<T>(slug, depth))
}

// ── Public fetchers ───────────────────────────────────────────────────────────

export async function fetchHomeGlobal(): Promise<{
  home: Home | null
  error: string | null
  stale?: boolean
}> {
  const apiBase = PAYLOAD_URL
  if (!apiBase) {
    return {
      home: null,
      error: 'Set PUBLIC_PAYLOAD_URL for build/runtime (see web/.env.example).',
    }
  }
  const url = `${trimSlash(apiBase)}/api/globals/home?depth=2`
  const key = 'global:home:d2'
  const { data, error, stale } = await withSwrCache<Home>(key, async () => {
    const got = await payloadGetJson(url)
    if ('error' in got) return { data: null, error: got.error }
    const parsed = parseHomeResponse(got.json)
    if (!parsed) return { data: null, error: 'Unexpected Payload response for /api/globals/home' }
    return { data: parsed, error: null }
  })
  return { home: data, error, stale }
}

export async function fetchSiteSettings(): Promise<{
  settings: SiteSettingsData | null
  error: string | null
  stale?: boolean
}> {
  const { data, error, stale } = await fetchGlobal<SiteSettingsData>('site-settings', 2)
  return { settings: data, error, stale }
}

export async function fetchFooterLinks(): Promise<{
  footerLinks: FooterLinksData | null
  error: string | null
  stale?: boolean
}> {
  const { data, error, stale } = await fetchGlobal<FooterLinksData>('footer-links')
  return { footerLinks: data, error, stale }
}

export async function fetchAboutGlobal(): Promise<{
  about: PageGlobalData | null
  error: string | null
  stale?: boolean
}> {
  const { data, error, stale } = await fetchGlobal<PageGlobalData>('about')
  return { about: data, error, stale }
}

export async function fetchContactGlobal(): Promise<{
  contact: PageGlobalData | null
  error: string | null
  stale?: boolean
}> {
  const { data, error, stale } = await fetchGlobal<PageGlobalData>('contact')
  return { contact: data, error, stale }
}

export async function fetchJobsGlobal(): Promise<{
  jobs: PageGlobalData | null
  error: string | null
  stale?: boolean
}> {
  const { data, error, stale } = await fetchGlobal<PageGlobalData>('jobs')
  return { jobs: data, error, stale }
}

export async function fetchPitchGlobal(): Promise<{
  pitch: PageGlobalData | null
  error: string | null
  stale?: boolean
}> {
  const { data, error, stale } = await fetchGlobal<PageGlobalData>('pitch')
  return { pitch: data, error, stale }
}

export async function fetchInvestorsGlobal(): Promise<{
  investors: PageGlobalData | null
  error: string | null
  stale?: boolean
}> {
  const { data, error, stale } = await fetchGlobal<PageGlobalData>('investors')
  return { investors: data, error, stale }
}

/**
 * Troupe Presents page global (/troupe). The global only exists after the
 * 20260705_troupe_page migration runs; callers must fall back to the static
 * layout in lib/troupe.ts when this returns null.
 */
export async function fetchTroupeGlobal(): Promise<{
  troupe: PageGlobalData | null
  error: string | null
  stale?: boolean
}> {
  const { data, error, stale } = await fetchGlobal<PageGlobalData>('troupe', 2)
  return { troupe: data, error, stale }
}

export async function fetchDivision212Global(): Promise<{
  division212: DivisionGlobalData | null
  error: string | null
  stale?: boolean
}> {
  const { data, error, stale } = await fetchGlobal<DivisionGlobalData>('212', 2)
  return { division212: data, error, stale }
}

export async function fetchDivision310Global(): Promise<{
  division310: DivisionGlobalData | null
  error: string | null
  stale?: boolean
}> {
  const { data, error, stale } = await fetchGlobal<DivisionGlobalData>('310', 2)
  return { division310: data, error, stale }
}

export async function fetchDivisionNRCGlobal(): Promise<{
  divisionNRC: DivisionGlobalData | null
  error: string | null
  stale?: boolean
}> {
  const { data, error, stale } = await fetchGlobal<DivisionGlobalData>('nrc', 2)
  return { divisionNRC: data, error, stale }
}

// ── Collection types ──────────────────────────────────────────────────────────

/** One slideshow plate on a project (gallery array row). Credit is required for provenance. */
export type ProjectGalleryItem = {
  id?: string | null
  /** Media relation (populated at depth 1) — wins over imageUrl. */
  image?: Media | number | null
  /** External image URL fallback. */
  imageUrl?: string | null
  caption?: string | null
  credit?: string | null
}

/** Pitch-deck slot (group) — renders on EVERY property page. */
export type ProjectPitchDeck = {
  status?: 'reserved' | 'available' | null
  file?: Media | number | null
  note?: string | null
}

/** Full doc shape — returned ONLY by single-doc fetchers (detail pages need `layout`). */
export type ProjectDoc = {
  id: number
  title: string
  slug: string
  division?: string | null
  subtitle?: string | null
  status?: string | null
  year?: string | null
  heroImage?: unknown
  synopsis?: string | null
  gallery?: ProjectGalleryItem[] | null
  pitchDeck?: ProjectPitchDeck | null
  layout?: unknown[] | null
}

/** Full doc shape — returned ONLY by single-doc fetchers (detail pages need `layout`). */
export type NewsArticleDoc = {
  id: number
  title: string
  slug: string
  date?: string | null
  deck?: string | null
  featured?: boolean | null
  layout?: unknown[] | null
}

// ── Slim projections (what LIST fetchers return and cache) ───────────────────
// Only the fields the frontend actually renders. `layout` (the heavy block
// tree) is deliberately absent: list surfaces never render it, and caching it
// is exactly the full-catalogue egress mistake VMS made.

export type SlimMediaRef = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

export type ProjectCard = {
  id: number
  title: string
  slug: string
  division?: string | null
  subtitle?: string | null
  status?: string | null
  year?: string | null
  heroImage?: SlimMediaRef | null
}

export type NewsCard = {
  id: number
  title: string
  slug: string
  date?: string | null
  deck?: string | null
  featured?: boolean | null
}

function slimMedia(input: unknown): SlimMediaRef | null {
  if (!input || typeof input !== 'object' || !('url' in input)) return null
  const m = input as Record<string, unknown>
  return {
    url: typeof m.url === 'string' ? m.url : null,
    alt: typeof m.alt === 'string' ? m.alt : null,
    width: typeof m.width === 'number' ? m.width : null,
    height: typeof m.height === 'number' ? m.height : null,
  }
}

function mapProjectCard(raw: unknown): ProjectCard | null {
  if (!raw || typeof raw !== 'object') return null
  const doc = raw as Record<string, unknown>
  if (typeof doc.id !== 'number' || typeof doc.slug !== 'string') return null
  return {
    id: doc.id,
    title: typeof doc.title === 'string' ? doc.title : '',
    slug: doc.slug,
    division: typeof doc.division === 'string' ? doc.division : null,
    subtitle: typeof doc.subtitle === 'string' ? doc.subtitle : null,
    status: typeof doc.status === 'string' ? doc.status : null,
    year: typeof doc.year === 'string' ? doc.year : null,
    heroImage: slimMedia(doc.heroImage),
  }
}

function mapNewsCard(raw: unknown): NewsCard | null {
  if (!raw || typeof raw !== 'object') return null
  const doc = raw as Record<string, unknown>
  if (typeof doc.id !== 'number' || typeof doc.slug !== 'string') return null
  return {
    id: doc.id,
    title: typeof doc.title === 'string' ? doc.title : '',
    slug: doc.slug,
    date: typeof doc.date === 'string' ? doc.date : null,
    deck: typeof doc.deck === 'string' ? doc.deck : null,
    featured: typeof doc.featured === 'boolean' ? doc.featured : null,
  }
}

type CollectionResponse<T> = {
  docs: T[]
  totalDocs: number
  page: number
  totalPages: number
}

// ── Collection fetchers ───────────────────────────────────────────────────────

async function fetchCollectionUncached<T>(
  collection: string,
  params = '',
): Promise<PayloadFetchResult<T[]>> {
  const apiBase = PAYLOAD_URL
  if (!apiBase) return { data: null, error: 'Set PUBLIC_PAYLOAD_URL' }
  const url = `${trimSlash(apiBase)}/api/${collection}?depth=1&limit=100${params}`
  const got = await payloadGetJson(url)
  if ('error' in got) return { data: null, error: got.error }
  const raw = got.json as CollectionResponse<T>
  return { data: raw.docs ?? [], error: null }
}

/**
 * List fetcher with egress discipline: fetches with a `select`-narrowed query,
 * maps each doc through `project` to a slim shape, and caches THE SLIM ARRAY —
 * the raw Payload docs are never stored.
 */
async function fetchSlimList<TSlim>(
  cacheKey: string,
  collection: string,
  params: string,
  project: (raw: unknown) => TSlim | null,
): Promise<PayloadFetchResult<TSlim[]>> {
  return withSwrCache(cacheKey, async () => {
    const got = await fetchCollectionUncached<unknown>(collection, params)
    if (got.error !== null || got.data == null) {
      return { data: null, error: got.error ?? `Unexpected empty ${collection} response` }
    }
    const slim = got.data.map(project).filter((item): item is NonNullable<TSlim> => item != null)
    return { data: slim, error: null }
  })
}

async function fetchCollectionDocUncached<T>(
  collection: string,
  slug: string,
): Promise<PayloadFetchResult<T>> {
  const apiBase = PAYLOAD_URL
  if (!apiBase) return { data: null, error: 'Set PUBLIC_PAYLOAD_URL' }
  const url = `${trimSlash(apiBase)}/api/${collection}?where[slug][equals]=${encodeURIComponent(slug)}&depth=1&limit=1`
  const got = await payloadGetJson(url)
  if ('error' in got) return { data: null, error: got.error }
  const raw = got.json as CollectionResponse<T>
  const doc = raw.docs?.[0] ?? null
  if (!doc) return { data: null, error: `No ${collection} found with slug "${slug}"` }
  return { data: doc, error: null }
}

async function fetchCollectionDoc<T>(
  collection: string,
  slug: string,
): Promise<PayloadFetchResult<T>> {
  const key = `doc:${collection}:${slug}`
  return withSwrCache(key, () => fetchCollectionDocUncached<T>(collection, slug))
}

// REST-side slimming for the projects list: `select` narrows the project
// columns, `populate[media]` narrows the depth-1 heroImage doc. Even if a
// Payload version ignores `populate`, mapProjectCard slims before caching.
const PROJECT_CARD_PARAMS =
  '&select[title]=true&select[slug]=true&select[division]=true&select[subtitle]=true' +
  '&select[status]=true&select[year]=true&select[heroImage]=true' +
  '&populate[media][url]=true&populate[media][alt]=true' +
  '&populate[media][width]=true&populate[media][height]=true'

export async function fetchProjects(): Promise<{
  projects: ProjectCard[]
  error: string | null
  stale?: boolean
}> {
  const { data, error, stale } = await fetchSlimList<ProjectCard>(
    'col:projects:card',
    'projects',
    PROJECT_CARD_PARAMS,
    mapProjectCard,
  )
  return { projects: data ?? [], error, stale }
}

export async function fetchProject(
  slug: string,
): Promise<{ project: ProjectDoc | null; error: string | null; stale?: boolean }> {
  const { data, error, stale } = await fetchCollectionDoc<ProjectDoc>('projects', slug)
  return { project: data, error, stale }
}

const NEWS_CARD_PARAMS =
  '&sort=-date&select[title]=true&select[slug]=true&select[date]=true' +
  '&select[deck]=true&select[featured]=true'

export async function fetchNewsArticles(): Promise<{
  articles: NewsCard[]
  error: string | null
  stale?: boolean
}> {
  const { data, error, stale } = await fetchSlimList<NewsCard>(
    'col:news:card',
    'news',
    NEWS_CARD_PARAMS,
    mapNewsCard,
  )
  return { articles: data ?? [], error, stale }
}

export async function fetchNewsArticle(
  slug: string,
): Promise<{ article: NewsArticleDoc | null; error: string | null; stale?: boolean }> {
  const { data, error, stale } = await fetchCollectionDoc<NewsArticleDoc>('news', slug)
  return { article: data, error, stale }
}

// ── V9 (2026-07-10): page globals, chrome, slate ─────────────────────────────
// The five "Site v9 · <Page>" globals share one sections union (generated
// types); the chrome strings live on site-settings.v9Chrome. All fetchers run
// through the SWR cache above.

/** One v9 page section (the 11-block union from the generated types). */
export type V9Section = NonNullable<V9Home['sections']>[number]

export type V9PageData = {
  seoTitle?: string | null
  seoDescription?: string | null
  sections?: V9Section[] | null
}

export type V9PageSlug = 'v9-home' | 'v9-slate' | 'v9-craft' | 'v9-methods' | 'v9-contact'

export async function fetchV9Page(slug: V9PageSlug): Promise<{
  page: V9PageData | null
  error: string | null
  stale?: boolean
}> {
  // depth 2, not 1 (v11): a slateList row links a Project, and that Project's
  // heroImage is one level deeper again. At depth 1 the Project expands but its
  // heroImage stays a bare ID, so every slate row rendered without its frame.
  // The page globals are SWR-cached, so this costs one deeper read per TTL, not
  // one per request.
  const { data, error, stale } = await fetchGlobal<V9PageData>(slug, 2)
  return { page: data, error, stale }
}

export type V9NavLink = { href: string; label: string; id?: string | null }

export type V9ChromeData = {
  displayLabel?: string | null
  panelTitle?: string | null
  themeLabel?: string | null
  themePremiere?: string | null
  themeMatinee?: string | null
  themeLateshow?: string | null
  scaleLabel?: string | null
  logoLabel?: string | null
  topLabel?: string | null
  prevLabel?: string | null
  nextLabel?: string | null
  slateReturn?: string | null
  cta?: string | null
  colophon?: string | null
  copyright?: string | null
  navLinks?: V9NavLink[] | null
}

/** v9Chrome off site-settings, with hard fallbacks so chrome never renders blank. */
export async function fetchV9Chrome(): Promise<{
  chrome: V9ChromeData
  error: string | null
}> {
  const { data, error } = await fetchGlobal<SiteSettingsData & { v9Chrome?: V9ChromeData | null }>(
    'site-settings',
    2,
  )
  const chrome: V9ChromeData = data?.v9Chrome ?? {}
  return {
    chrome: {
      topLabel: 'Back to top',
      prevLabel: 'Previous property',
      nextLabel: 'Next property',
      slateReturn: 'The whole slate',
      cta: 'Request materials',
      copyright: '© 2026 APR 70 Pictures.',
      ...Object.fromEntries(Object.entries(chrome).filter(([, v]) => v != null)),
    },
    error,
  }
}

/** Slim slate row — the nine public properties, ordered. Powers /slate context,
 *  the /work prev-next ring, llms.txt, and the sitemap. */
export type V9SlateItem = {
  id: number
  title: string
  slug: string
  slateOrder?: number | null
  logline?: string | null
  shortLogline?: string | null
  provenance?: string | null
  metaLine?: string | null
  /** v11: the key frame. The slate used to list nine motion pictures with no
   *  pictures on it; every row now carries its own frame. */
  heroImage?: Media | number | null
}

function mapV9SlateItem(raw: unknown): V9SlateItem | null {
  if (!raw || typeof raw !== 'object') return null
  const doc = raw as Record<string, unknown>
  if (typeof doc.id !== 'number' || typeof doc.slug !== 'string') return null
  return {
    id: doc.id,
    title: typeof doc.title === 'string' ? doc.title : '',
    slug: doc.slug,
    slateOrder: typeof doc.slateOrder === 'number' ? doc.slateOrder : null,
    logline: typeof doc.logline === 'string' ? doc.logline : null,
    shortLogline: typeof doc.shortLogline === 'string' ? doc.shortLogline : null,
    provenance: typeof doc.provenance === 'string' ? doc.provenance : null,
    metaLine: typeof doc.metaLine === 'string' ? doc.metaLine : null,
    heroImage: (doc.heroImage ?? null) as Media | number | null,
  }
}

// depth=1 resolves heroImage into a Media doc. The projection stays slim: one
// extra relation, nine rows, and it is what puts a picture on every slate row.
const V9_SLATE_PARAMS =
  '&where[publicSlate][equals]=true&sort=slateOrder&depth=1' +
  '&select[title]=true&select[slug]=true&select[slateOrder]=true&select[logline]=true' +
  '&select[shortLogline]=true&select[provenance]=true&select[metaLine]=true' +
  '&select[heroImage]=true'

export async function fetchV9SlateProjects(): Promise<{
  slate: V9SlateItem[]
  error: string | null
  stale?: boolean
}> {
  const { data, error, stale } = await fetchSlimList<V9SlateItem>(
    'col:projects:v9slate',
    'projects',
    V9_SLATE_PARAMS,
    mapV9SlateItem,
  )
  return { slate: data ?? [], error, stale }
}

/** The public properties one division owns, ordered by slateOrder. Powers the
 *  division pages (/212 · /310 · /nrc). Same slim projection + egress discipline
 *  as the whole-slate fetcher, filtered to publicSlate=true AND division=<div>. */
export async function fetchDivisionSlate(division: '212' | '310' | 'nrc'): Promise<{
  slate: V9SlateItem[]
  error: string | null
  stale?: boolean
}> {
  const params =
    `&where[publicSlate][equals]=true&where[division][equals]=${division}&sort=slateOrder&depth=1` +
    '&select[title]=true&select[slug]=true&select[slateOrder]=true&select[logline]=true' +
    '&select[shortLogline]=true&select[provenance]=true&select[metaLine]=true' +
    '&select[heroImage]=true'
  const { data, error, stale } = await fetchSlimList<V9SlateItem>(
    `col:projects:division:${division}`,
    'projects',
    params,
    mapV9SlateItem,
  )
  return { slate: data ?? [], error, stale }
}

/** Full v9 property doc (generated Project type has every v9 field). */
export async function fetchV9Project(slug: string): Promise<{
  project: Project | null
  error: string | null
  stale?: boolean
}> {
  const { data, error, stale } = await fetchCollectionDoc<Project>('projects', slug)
  return { project: data, error, stale }
}

// ── DISPATCH Issue (magazine layout for /news) ────────────────────────────────

export type DispatchHeadlineWord = { text: string; style?: 'normal' | 'accent' | 'outline' | null }
export type DispatchCoverline = { num?: string | null; head?: string | null; deck?: string | null }
export type DispatchContentsEntry = {
  folio: string
  title: string
  deck?: string | null
  by?: string | null
}
export type DispatchContentsGroup = {
  label: string
  meta?: string | null
  entries?: DispatchContentsEntry[] | null
}
export type DispatchTitlePart = { text: string; italic?: boolean | null }
export type DispatchMetaRow = { key: string; value: string }
export type DispatchParagraphVariant = 'text' | 'first' | 'pull' | 'small' | 'head'
export type DispatchParagraph = {
  variant: DispatchParagraphVariant
  text: string
  attr?: string | null
}
export type DispatchFactboxField = {
  key: string
  value: string
  accent?: 'none' | 'amber' | 'teal' | 'orange' | null
}
export type DispatchRelated = { idx?: string | null; name: string; meta?: string | null }
export type DispatchDispatchCard = {
  division: '212' | '310' | 'nrc'
  date: string
  title: string
  body?: string | null
  status?: string | null
  link?: string | null
  ghost?: string | null
}
export type DispatchTrade = {
  pub: string
  city?: string | null
  headline: string
  deck?: string | null
  attr?: string | null
}
export type DispatchCalendarEntry = {
  date: string
  title: string
  sub?: string | null
  tag?: string | null
}
export type DispatchClassified = {
  cat: string
  title: string
  body?: string | null
  meta?: string | null
}
export type DispatchArchiveCard = {
  vol?: string | null
  no?: string | null
  season?: string | null
  mast?: string | null
  line?: string | null
  state?: string | null
  isCurrent?: boolean | null
}

export type DispatchIssueDoc = {
  id?: number
  slug: string
  displayTitle: string
  current?: boolean | null
  releaseDate?: string | null
  indicia: {
    volume: string
    number: string
    season: string
    reel?: string | null
    isoDate?: string | null
    printRun?: string | null
    offices?: string | null
    tagline?: string | null
  }
  cover: {
    kicker?: string | null
    deck?: string | null
    byline?: string | null
    coverImage?: Media | number | null
    lines?: DispatchHeadlineWord[] | null
    coverlines?: DispatchCoverline[] | null
  }
  contents?: DispatchContentsGroup[] | null
  editorial: {
    eyebrow?: string | null
    title?: string | null
    lead?: string | null
    paragraphs?: { text: string }[] | null
    signatureName?: string | null
    signatureMeta?: string | null
    quote?: string | null
    portrait?: Media | number | null
  }
  feature: {
    eyebrow?: string | null
    deck?: string | null
    jumpFrom?: string | null
    jumpTo?: string | null
    heroImage?: Media | number | null
    titleParts?: DispatchTitlePart[] | null
    meta?: DispatchMetaRow[] | null
    imageCaption?: { caption?: string | null; credit?: string | null } | null
    paragraphs?: DispatchParagraph[] | null
    factbox?: {
      label?: string | null
      fields?: DispatchFactboxField[] | null
    } | null
    related?: DispatchRelated[] | null
  }
  dispatches?: DispatchDispatchCard[] | null
  trades?: DispatchTrade[] | null
  calendar?: DispatchCalendarEntry[] | null
  classifieds?: DispatchClassified[] | null
  archive?: DispatchArchiveCard[] | null
  colophon: {
    legal?: string | null
    type?: string | null
    baseline?: string | null
  }
}

async function fetchCurrentDispatchUncached(): Promise<PayloadFetchResult<DispatchIssueDoc>> {
  const apiBase = PAYLOAD_URL
  if (!apiBase) return { data: null, error: 'Set PUBLIC_PAYLOAD_URL' }
  const url = `${trimSlash(apiBase)}/api/dispatch-issues?where[current][equals]=true&depth=2&limit=1`
  const got = await payloadGetJson(url)
  if ('error' in got) return { data: null, error: got.error }
  const raw = got.json as CollectionResponse<DispatchIssueDoc>
  const doc = raw.docs?.[0] ?? null
  if (!doc) return { data: null, error: 'No current DISPATCH issue found.' }
  return { data: doc, error: null }
}

export async function fetchCurrentDispatchIssue(): Promise<{
  issue: DispatchIssueDoc | null
  error: string | null
  stale?: boolean
}> {
  const key = 'dispatch:current'
  const { data, error, stale } = await withSwrCache(key, fetchCurrentDispatchUncached)
  return { issue: data, error, stale }
}

/** THE APR 70 TROUPE PRESENTS — the radio programme global.
 *  depth=2 so `audio`, `poster` and `property` arrive resolved rather than as
 *  bare ids. (Depth matters here: the v11 slate-frames bug was exactly this —
 *  at depth 1 a nested upload silently resolved to nothing.) */
async function fetchTroupeProgramUncached(): Promise<PayloadFetchResult<TroupeProgramData>> {
  const apiBase = PAYLOAD_URL
  if (!apiBase) return { data: null, error: 'Set PUBLIC_PAYLOAD_URL' }
  const url = `${trimSlash(apiBase)}/api/globals/troupe-program?depth=2`
  const got = await payloadGetJson(url)
  if ('error' in got) return { data: null, error: got.error }
  return { data: got.json as TroupeProgramData, error: null }
}

export async function fetchTroupeProgram(): Promise<{
  programme: TroupeProgramData | null
  error: string | null
  stale?: boolean
}> {
  const key = 'troupe:programme'
  const { data, error, stale } = await withSwrCache(key, fetchTroupeProgramUncached)
  return { programme: data, error, stale }
}

/** Founding Roll count (v10) — the roll is publicly readable by design
 *  (names + numbers only; contact fields are admin-gated in the CMS).
 *  Null on any failure so the section renders without the count. */
export async function fetchRollCount(): Promise<number | null> {
  if (!PAYLOAD_URL) return null
  try {
    const res = await fetch(`${trimSlash(PAYLOAD_URL)}/api/founding-roll?limit=0&depth=0`)
    if (!res.ok) return null
    const data = (await res.json()) as { totalDocs?: number }
    return typeof data.totalDocs === 'number' ? data.totalDocs : null
  } catch {
    return null
  }
}
