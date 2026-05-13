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
