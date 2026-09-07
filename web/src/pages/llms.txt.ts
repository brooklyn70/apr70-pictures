import type { APIRoute } from 'astro'
import { fetchV9SlateProjects, fetchSiteSettings } from '../lib/payload'
import { plainText } from '../lib/v9/inline'
import { NAP, SITE_URL, canonical, V9_PAGES, DIVISION_PAGES } from '../lib/v9/site'
import { SITE_LOCALES } from 'site-locales'
import { resolveEnabledLocales } from '../lib/i18n/enabled'
import { localePath } from '../lib/i18n/paths'

/**
 * /llms.txt — the curated, LLM-readable site summary (llmstxt.org shape),
 * built live from Payload so it never drifts from the pages.
 *
 * i18n: this file stays ENGLISH. Machines get one canonical story, in the
 * language the studio writes in; a per-locale llms.txt would be four more
 * surfaces to keep in sync for no reader. The one addition is a Languages
 * line naming the prefixes, and it only appears once a second locale is
 * actually enabled — while the site is English-only the file is byte-identical
 * to what it served before.
 */
export const GET: APIRoute = async () => {
  const { slate } = await fetchV9SlateProjects()
  const { settings } = await fetchSiteSettings()

  const enabled = resolveEnabledLocales(settings?.enabledLocales)
  const languagesLine =
    enabled.length > 1
      ? [
          `- Languages: ` +
            enabled
              .map((code) => {
                const meta = SITE_LOCALES.find((l) => l.code === code)
                return `${meta?.label ?? code} at ${canonical(localePath(code, '/'))}`
              })
              .join('; '),
        ]
      : []

  const lines: string[] = [
    `# ${NAP.name}`,
    '',
    `> ${NAP.description}`,
    '',
    `- Studio: ${NAP.name}, ${NAP.locality}, ${NAP.region}, ${NAP.country} (founded ${NAP.foundingYear})`,
    `- Writer-producer: ${NAP.founder}`,
    `- Divisions: ${NAP.divisions.join('; ')}`,
    `- Contact: ${NAP.email}`,
    `- Site: ${SITE_URL}`,
    ...languagesLine,
    '',
    '## Pages',
    '',
    ...V9_PAGES.map((p) => `- [${p.label}](${canonical(p.path)})`),
    ...DIVISION_PAGES.map((p) => `- [${p.label}](${canonical(p.path)})`),
    '',
    '## The slate (nine public properties, in order)',
    '',
    ...slate.map((p) => {
      const meta = plainText(p.metaLine)
      const log = plainText(p.logline) || plainText(p.shortLogline)
      return `- [${p.title}](${canonical(`/work/${p.slug}`)})${meta ? ` · ${meta}.` : ''}${log ? ` ${log}` : ''}`
    }),
    '',
    '## Facts',
    '',
    '- Scripts are written by people; Marco Caruso is the author of record.',
    '- Images and motion are machine-generated under studio direction and labeled where they appear.',
    '- Archival imagery is public domain only, verified, dated, and credited.',
    '- One further property travels only inside private materials while legal counsel review completes (ten on the working slate in all).',
    '',
    `For the full text version see ${canonical('/llms-full.txt')}.`,
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
