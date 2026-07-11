import type { APIRoute } from 'astro'
import { fetchV9SlateProjects } from '../lib/payload'
import { plainText } from '../lib/v9/inline'
import { NAP, SITE_URL, canonical, V9_PAGES } from '../lib/v9/site'

/**
 * /llms.txt — the curated, LLM-readable site summary (llmstxt.org shape),
 * built live from Payload so it never drifts from the pages.
 */
export const GET: APIRoute = async () => {
  const { slate } = await fetchV9SlateProjects()

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
    '',
    '## Pages',
    '',
    ...V9_PAGES.map((p) => `- [${p.label}](${canonical(p.path)})`),
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
    '- Two further properties travel only inside private materials (eleven on the working slate in all).',
    '',
    `For the full text version see ${canonical('/llms-full.txt')}.`,
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
