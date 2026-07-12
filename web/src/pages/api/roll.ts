import type { APIRoute } from 'astro'

/**
 * POST /api/roll — same-origin proxy for Founding Roll enrollment (v10).
 * Forwards {name, email, note, consent, source} to the Payload
 * founding-roll collection. Keeps the CMS origin out of the browser, adds
 * a honeypot check and a light per-IP throttle. No third parties are ever
 * contacted; the entry lands in Payload and nowhere else.
 */

const PAYLOAD_URL: string =
  (import.meta.env.PUBLIC_PAYLOAD_URL as string | undefined) ||
  (typeof process !== 'undefined' && process.env.PUBLIC_PAYLOAD_URL) ||
  ''

/* light throttle: max 5 enrollments per IP per 10 minutes (in-memory) */
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function throttled(ip: string): boolean {
  const now = Date.now()
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (list.length >= MAX_PER_WINDOW) {
    hits.set(ip, list)
    return true
  }
  list.push(now)
  hits.set(ip, list)
  return false
}

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!PAYLOAD_URL) return json(503, { error: 'The roll is not reachable right now.' })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return json(400, { error: 'Bad request.' })
  }

  /* honeypot: real visitors never fill this */
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return json(200, { ok: true })
  }

  const ip = clientAddress ?? 'unknown'
  if (throttled(ip)) return json(429, { error: 'Too many enrollments from here. Try again later.' })

  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : ''
  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 254) : ''
  const note = typeof body.note === 'string' ? body.note.trim().slice(0, 500) : ''
  const source = typeof body.source === 'string' ? body.source.trim().slice(0, 120) : ''
  const consent = body.consent === true

  if (!name || !email) return json(400, { error: 'A name and an email are both needed.' })
  if (!consent) return json(400, { error: 'Enrollment needs your consent.' })

  try {
    const res = await fetch(`${PAYLOAD_URL.replace(/\/$/, '')}/api/founding-roll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, note: note || undefined, consent, source: source || undefined }),
    })
    const data = (await res.json().catch(() => ({}))) as {
      doc?: { rollNumber?: number }
      errors?: { message?: string }[]
    }
    if (!res.ok) {
      const raw = JSON.stringify(data)
      const friendly = /unique|duplicate|already/i.test(raw)
        ? 'That email is already on the roll.'
        : 'The roll could not take the name. Try again.'
      return json(res.status >= 500 ? 502 : 400, { error: friendly })
    }
    return json(201, { ok: true, rollNumber: data.doc?.rollNumber ?? null })
  } catch {
    return json(502, { error: 'The roll could not be reached. Try again in a moment.' })
  }
}
