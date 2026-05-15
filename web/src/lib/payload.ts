import type { Home, Media } from 'payload-types'

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

export type SiteSettingsData = {
  brandLabel?: string | null
  legalEntity?: string | null
  tagline?: string | null
  showFilmstripRails?: boolean | null
  lastDeployed?: string | null
  seededVersion?: string | null
  favicon?: Media | number | null
  navLogoLight?: Media | number | null
  navLogoDark?: Media | number | null
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

// ── Cache / SWR (in-process; effective with @astrojs/node standalone) ─────────

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

export function resolveMediaUrl(media: Media | null | undefined): string | undefined {
  if (!media?.url) return undefined
  const u = media.url
  if (u.startsWith('http://') || u.startsWith('https://')) return u
  const base = PAYLOAD_URL
    ? trimSlash(PAYLOAD_URL)
    : ''
  if (!base) return u
  return `${base}${u.startsWith('/') ? '' : '/'}${u}`
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

export type ProjectDoc = {
  id: number
  title: string
  slug: string
  division?: string | null
  subtitle?: string | null
  status?: string | null
  year?: string | null
  heroImage?: unknown
  layout?: unknown[] | null
}

export type NewsArticleDoc = {
  id: number
  title: string
  slug: string
  date?: string | null
  deck?: string | null
  featured?: boolean | null
  layout?: unknown[] | null
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

async function fetchCollection<T>(
  collection: string,
  params = '',
): Promise<PayloadFetchResult<T[]>> {
  const key = `col:${collection}:${params}`
  return withSwrCache(key, () => fetchCollectionUncached<T>(collection, params))
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

export async function fetchProjects(): Promise<{
  projects: ProjectDoc[]
  error: string | null
  stale?: boolean
}> {
  const { data, error, stale } = await fetchCollection<ProjectDoc>('projects')
  return { projects: data ?? [], error, stale }
}

export async function fetchProject(
  slug: string,
): Promise<{ project: ProjectDoc | null; error: string | null; stale?: boolean }> {
  const { data, error, stale } = await fetchCollectionDoc<ProjectDoc>('projects', slug)
  return { project: data, error, stale }
}

export async function fetchNewsArticles(): Promise<{
  articles: NewsArticleDoc[]
  error: string | null
  stale?: boolean
}> {
  const { data, error, stale } = await fetchCollection<NewsArticleDoc>(
    'news',
    '&sort=-date',
  )
  return { articles: data ?? [], error, stale }
}

export async function fetchNewsArticle(
  slug: string,
): Promise<{ article: NewsArticleDoc | null; error: string | null; stale?: boolean }> {
  const { data, error, stale } = await fetchCollectionDoc<NewsArticleDoc>('news', slug)
  return { article: data, error, stale }
}
