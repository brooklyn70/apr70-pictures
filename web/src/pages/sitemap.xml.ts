import type { APIRoute } from 'astro'
import { fetchV9SlateProjects, fetchSiteSettings } from '../lib/payload'
import { canonical, V9_PAGES, DIVISION_PAGES } from '../lib/v9/site'

/** /sitemap.xml — the five v9 pages + the nine public properties, canonical
 *  https://apr70.com URLs. Built live from Payload.
 *  /dispatch joins the map only while its Payload switch is on — the same
 *  condition under which the route serves a 200 instead of a 404. */
export const GET: APIRoute = async () => {
  const { slate } = await fetchV9SlateProjects()
  const { settings } = await fetchSiteSettings()

  const urls = [
    ...V9_PAGES.map((p) => canonical(p.path)),
    ...DIVISION_PAGES.map((p) => canonical(p.path)),
    ...(settings?.dispatch?.enabled === true ? [canonical('/dispatch')] : []),
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
