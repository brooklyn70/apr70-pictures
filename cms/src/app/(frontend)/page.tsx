export const dynamic = 'force-dynamic'
export const revalidate = 0

import { getPayload } from 'payload'
import config from '@/payload.config'

export default async function HomePage() {
  const payload = await getPayload({ config: await config })

  let home: unknown = null
  let homeError: string | null = null
  try {
    home = await payload.findGlobal({ slug: 'home', depth: 2 })
  } catch (e) {
    homeError = e instanceof Error ? e.message : String(e)
  }

  const layout = (home as { layout?: unknown[] } | null)?.layout ?? []

  return (
    <html lang="en">
      <body style={{ fontFamily: 'monospace', padding: '2rem', background: '#111', color: '#eee' }}>
        <h1 style={{ color: '#f90' }}>APR 70 CMS — Home Global Debug</h1>

        {homeError && (
          <pre style={{ background: '#300', padding: '1rem', color: '#f88' }}>
            ERROR: {homeError}
          </pre>
        )}

        <h2>layout blocks ({layout.length})</h2>
        <pre style={{ background: '#1a1a1a', padding: '1rem', overflow: 'auto' }}>
          {JSON.stringify(home, null, 2)}
        </pre>

        <p style={{ marginTop: '2rem' }}>
          <a href="/admin" style={{ color: '#6af' }}>→ Go to Admin</a>
        </p>
      </body>
    </html>
  )
}
