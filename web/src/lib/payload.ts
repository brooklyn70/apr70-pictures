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
}

export type FooterLinksData = {
  primaryNav?: FooterLink[] | null
  divisionNav?: FooterLink[] | null
  moreNav?: FooterLink[] | null
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

async function fetchGlobal<T>(
  slug: string,
  depth = 1,
): Promise<{ data: T | null; error: string | null }> {
  const apiBase = PAYLOAD_URL
  if (!apiBase) {
    return { data: null, error: 'Set PUBLIC_PAYLOAD_URL for build/runtime (see web/.env.example).' }
  }
  const url = `${trimSlash(apiBase)}/api/globals/${slug}?depth=${depth}`
  try {
    const res = await fetch(url)
    if (!res.ok) return { data: null, error: `Payload returned ${res.status} for ${url}` }
    const raw = await res.json()
    const data = parseGlobalResponse<T>(raw)
    if (!data) return { data: null, error: `Unexpected Payload response for /api/globals/${slug}` }
    return { data, error: null }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown fetch error'
    return { data: null, error: message }
  }
}

// ── Public fetchers ───────────────────────────────────────────────────────────

export async function fetchHomeGlobal(): Promise<{ home: Home | null; error: string | null }> {
  const apiBase = PAYLOAD_URL
  if (!apiBase) {
    return {
      home: null,
      error: 'Set PUBLIC_PAYLOAD_URL for build/runtime (see web/.env.example).',
    }
  }

  const url = `${trimSlash(apiBase)}/api/globals/home?depth=2`

  try {
    const res = await fetch(url)
    if (!res.ok) {
      return { home: null, error: `Payload returned ${res.status} for ${url}` }
    }
    const raw = await res.json()
    const data = parseHomeResponse(raw)
    if (!data) {
      return { home: null, error: 'Unexpected Payload response for /api/globals/home' }
    }
    return { home: data, error: null }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown fetch error'
    return { home: null, error: message }
  }
}

export async function fetchSiteSettings(): Promise<{
  settings: SiteSettingsData | null
  error: string | null
}> {
  const { data, error } = await fetchGlobal<SiteSettingsData>('site-settings')
  return { settings: data, error }
}

export async function fetchFooterLinks(): Promise<{
  footerLinks: FooterLinksData | null
  error: string | null
}> {
  const { data, error } = await fetchGlobal<FooterLinksData>('footer-links')
  return { footerLinks: data, error }
}

export async function fetchAboutGlobal(): Promise<{
  about: PageGlobalData | null
  error: string | null
}> {
  const { data, error } = await fetchGlobal<PageGlobalData>('about')
  return { about: data, error }
}

export async function fetchContactGlobal(): Promise<{
  contact: PageGlobalData | null
  error: string | null
}> {
  const { data, error } = await fetchGlobal<PageGlobalData>('contact')
  return { contact: data, error }
}

export async function fetchJobsGlobal(): Promise<{
  jobs: PageGlobalData | null
  error: string | null
}> {
  const { data, error } = await fetchGlobal<PageGlobalData>('jobs')
  return { jobs: data, error }
}

export async function fetchPitchGlobal(): Promise<{
  pitch: PageGlobalData | null
  error: string | null
}> {
  const { data, error } = await fetchGlobal<PageGlobalData>('pitch')
  return { pitch: data, error }
}

export async function fetchInvestorsGlobal(): Promise<{
  investors: PageGlobalData | null
  error: string | null
}> {
  const { data, error } = await fetchGlobal<PageGlobalData>('investors')
  return { investors: data, error }
}

export async function fetchDivision212Global(): Promise<{
  division212: PageGlobalData | null
  error: string | null
}> {
  const { data, error } = await fetchGlobal<PageGlobalData>('212')
  return { division212: data, error }
}

export async function fetchDivision310Global(): Promise<{
  division310: PageGlobalData | null
  error: string | null
}> {
  const { data, error } = await fetchGlobal<PageGlobalData>('310')
  return { division310: data, error }
}

export async function fetchDivisionNRCGlobal(): Promise<{
  divisionNRC: PageGlobalData | null
  error: string | null
}> {
  const { data, error } = await fetchGlobal<PageGlobalData>('nrc')
  return { divisionNRC: data, error }
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

async function fetchCollection<T>(
  collection: string,
  params = '',
): Promise<{ docs: T[]; error: string | null }> {
  const apiBase = PAYLOAD_URL
  if (!apiBase) return { docs: [], error: 'Set PUBLIC_PAYLOAD_URL' }
  const url = `${trimSlash(apiBase)}/api/${collection}?depth=1&limit=100${params}`
  try {
    const res = await fetch(url)
    if (!res.ok) return { docs: [], error: `Payload returned ${res.status} for ${url}` }
    const raw = (await res.json()) as CollectionResponse<T>
    return { docs: raw.docs ?? [], error: null }
  } catch (e) {
    return { docs: [], error: e instanceof Error ? e.message : 'Unknown fetch error' }
  }
}

async function fetchCollectionDoc<T>(
  collection: string,
  slug: string,
): Promise<{ doc: T | null; error: string | null }> {
  const apiBase = PAYLOAD_URL
  if (!apiBase) return { doc: null, error: 'Set PUBLIC_PAYLOAD_URL' }
  const url = `${trimSlash(apiBase)}/api/${collection}?where[slug][equals]=${encodeURIComponent(slug)}&depth=1&limit=1`
  try {
    const res = await fetch(url)
    if (!res.ok) return { doc: null, error: `Payload returned ${res.status} for ${url}` }
    const raw = (await res.json()) as CollectionResponse<T>
    const doc = raw.docs?.[0] ?? null
    return { doc, error: doc ? null : `No ${collection} found with slug "${slug}"` }
  } catch (e) {
    return { doc: null, error: e instanceof Error ? e.message : 'Unknown fetch error' }
  }
}

export async function fetchProjects(): Promise<{ projects: ProjectDoc[]; error: string | null }> {
  const { docs, error } = await fetchCollection<ProjectDoc>('projects')
  return { projects: docs, error }
}

export async function fetchProject(
  slug: string,
): Promise<{ project: ProjectDoc | null; error: string | null }> {
  const { doc, error } = await fetchCollectionDoc<ProjectDoc>('projects', slug)
  return { project: doc, error }
}

export async function fetchNewsArticles(): Promise<{
  articles: NewsArticleDoc[]
  error: string | null
}> {
  const { docs, error } = await fetchCollection<NewsArticleDoc>(
    'news',
    '&sort=-date',
  )
  return { articles: docs, error }
}

export async function fetchNewsArticle(
  slug: string,
): Promise<{ article: NewsArticleDoc | null; error: string | null }> {
  const { doc, error } = await fetchCollectionDoc<NewsArticleDoc>('news', slug)
  return { article: doc, error }
}
