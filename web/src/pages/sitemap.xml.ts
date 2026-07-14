import type { APIRoute } from 'astro'
import {
  fetchV9SlateProjects,
  fetchSiteSettings,
  fetchTroupeProgram,
  resolveMediaUrl,
} from '../lib/payload'
import { canonical, V9_PAGES, DIVISION_PAGES } from '../lib/v9/site'

/** /sitemap.xml — the five v9 pages + the nine public properties, canonical
 *  https://apr70.com URLs. Built live from Payload.
 *  /dispatch joins while its Payload switch is on.
 *  /troupe joins only under the same double gate as the page + nav:
 *  switch on AND a recording uploaded. */
export const GET: APIRoute = async () => {
  const { slate } = await fetchV9SlateProjects()
  const { settings } = await fetchSiteSettings()

  const dispatchLive = settings?.dispatch?.enabled === true

  let troupeLive = false
  if (settings?.troupe?.enabled === true) {
    const { programme } = await fetchTroupeProgram()
    troupeLive = Boolean(resolveMediaUrl(programme?.audio as never))
  }

  const urls = [
    ...V9_PAGES.map((p) => canonical(p.path)),
    ...DIVISION_PAGES.map((p) => canonical(p.path)),
    ...(dispatchLive ? [canonical('/dispatch')] : []),
    ...(troupeLive ? [canonical('/troupe')] : []),
    ...slate.map((p) => canonical(`/work/${p.slug}`)),
  ]

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n') +
    `\n</urlset>\n`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
