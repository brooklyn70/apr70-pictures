import type { APIRoute } from 'astro'
import {
  fetchV9SlateProjects,
  fetchSiteSettings,
  fetchTroupeProgram,
  resolveMediaUrl,
} from '../lib/payload'
import { canonical, V9_PAGES, DIVISION_PAGES } from '../lib/v9/site'
import { htmlLangFor, type SiteLocale } from 'site-locales'
import { resolveEnabledLocales } from '../lib/i18n/enabled'
import { localePath } from '../lib/i18n/paths'

/** /sitemap.xml — the five v9 pages + the nine public properties, canonical
 *  https://apr70.com URLs. Built live from Payload.
 *  /dispatch joins while its Payload switch is on.
 *  /troupe joins only under the same double gate as the page + nav:
 *  switch on AND a recording uploaded.
 *
 *  i18n (2026-09-07): the sitemap enumerates every ENABLED locale's URL, and
 *  each <url> carries an <xhtml:link rel="alternate" hreflang> for every
 *  enabled locale plus x-default -> English, which is the shape Google asks
 *  for (every URL in a set lists the whole set, itself included). While only
 *  English is enabled the file is the same list it always was, plus the two
 *  self-referencing alternate lines. */
export const GET: APIRoute = async () => {
  const { slate } = await fetchV9SlateProjects()
  const { settings } = await fetchSiteSettings()

  const enabled: SiteLocale[] = resolveEnabledLocales(settings?.enabledLocales)
  const dispatchLive = settings?.dispatch?.enabled === true

  let troupeLive = false
  if (settings?.troupe?.enabled === true) {
    const { programme } = await fetchTroupeProgram()
    troupeLive = Boolean(resolveMediaUrl(programme?.audio as never))
  }

  /** The locale-neutral path list. Each becomes one <url> per enabled locale. */
  const paths = [
    ...V9_PAGES.map((p) => p.path),
    ...DIVISION_PAGES.map((p) => p.path),
    ...(dispatchLive ? ['/dispatch'] : []),
    ...(troupeLive ? ['/troupe'] : []),
    ...slate.map((p) => `/work/${p.slug}`),
  ]

  const escape = (s: string) => s.replace(/&/g, '&amp;')

  const entry = (path: string, locale: SiteLocale): string => {
    const alternates = [
      ...enabled.map(
        (code) =>
          `    <xhtml:link rel="alternate" hreflang="${htmlLangFor(code)}" href="${escape(
            canonical(localePath(code, path)),
          )}"/>`,
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${escape(
        canonical(localePath('en', path)),
      )}"/>`,
    ].join('\n')
    return `  <url>\n    <loc>${escape(canonical(localePath(locale, path)))}</loc>\n${alternates}\n  </url>`
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    enabled.flatMap((locale) => paths.map((path) => entry(path, locale))).join('\n') +
    `\n</urlset>\n`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
