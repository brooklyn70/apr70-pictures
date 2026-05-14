/** Shared Payload REST helpers for migrate-v2 scripts. */

export const CMS_URL = process.env.CMS_URL ?? 'http://cms:3000'

export async function payloadJwtLogin(): Promise<string> {
  const email = process.env.PAYLOAD_SEED_EMAIL
  const password = process.env.PAYLOAD_SEED_PASSWORD
  if (!email || !password) {
    throw new Error('PAYLOAD_SEED_EMAIL and PAYLOAD_SEED_PASSWORD env vars are required')
  }
  const res = await fetch(`${CMS_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Login failed: ${res.status} ${body}`)
  }
  const data = (await res.json()) as { token?: string }
  if (!data.token) throw new Error('Login response missing token')
  return data.token
}
