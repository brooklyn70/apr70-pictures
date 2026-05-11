import type { Home, Media } from 'payload-types'

const trimSlash = (s: string) => s.replace(/\/$/, '')

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

export function resolveMediaUrl(media: Media | null | undefined): string | undefined {
  if (!media?.url) return undefined
  const u = media.url
  if (u.startsWith('http://') || u.startsWith('https://')) return u
  const base = import.meta.env.PUBLIC_PAYLOAD_URL
    ? trimSlash(import.meta.env.PUBLIC_PAYLOAD_URL)
    : ''
  if (!base) return u
  return `${base}${u.startsWith('/') ? '' : '/'}${u}`
}

export async function fetchHomeGlobal(): Promise<{ home: Home | null; error: string | null }> {
  const apiBase = import.meta.env.PUBLIC_PAYLOAD_URL
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
