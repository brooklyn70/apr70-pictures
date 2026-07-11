import type { APIRoute } from 'astro'
import { fetchV9SlateProjects, fetchV9Project, fetchV9Page } from '../lib/payload'
import { plainText } from '../lib/v9/inline'
import { NAP, SITE_URL, canonical, creativeWorkType } from '../lib/v9/site'

/**
 * /llms-full.txt — the expanded machine-readable dossier: identity, methods
 * (the disclosure ledger), and every public property in full (metaLine,
 * logline, provenance, prose, request policy). Built live from Payload.
 */
export const GET: APIRoute = async () => {
  const [{ slate }, { page: methods }] = await Promise.all([
    fetchV9SlateProjects(),
    fetchV9Page('v9-methods'),
  ])

  const lines: string[] = [
    `# ${NAP.name} · full text`,
    '',
    `> ${NAP.description}`,
    '',
    `- Studio: ${NAP.name}, ${NAP.locality}, ${NAP.region}, ${NAP.country} (founded ${NAP.foundingYear})`,
    `- Writer-producer: ${NAP.founder}`,
    `- Divisions: ${NAP.divisions.join('; ')}`,
    `- Contact: ${NAP.email}`,
    `- Site: ${SITE_URL}`,
    '',
  ]

  // The disclosure ledger, verbatim from /methods.
  const ledger = (methods?.sections ?? []).find((s) => s.blockType === 'ledger')
  if (ledger && 'rows' in ledger && ledger.rows?.length) {
    lines.push('## Methods · the disclosure ledger', '')
    for (const row of ledger.rows) {
      if (!row.term && !row.definition) continue
      lines.push(`- **${plainText(row.term)}**: ${plainText(row.definition)}`)
    }
    lines.push('')
  }

  lines.push('## The slate · nine public properties', '')

  for (const item of slate) {
    const { project } = await fetchV9Project(item.slug)
    const p = project ?? null
    lines.push(`### ${item.title}`, '')
    lines.push(`- URL: ${canonical(`/work/${item.slug}`)}`)
    const meta = plainText(p?.metaLine ?? item.metaLine)
    if (meta) lines.push(`- Format: ${meta} (schema.org type: ${creativeWorkType(meta)})`)
    const log = plainText(p?.logline ?? item.logline)
    if (log) lines.push(`- Logline: ${log}`)
    const prov = plainText(p?.provenance ?? item.provenance)
    if (prov) lines.push(`- Provenance: ${prov}`)
    const prose = plainText(p?.bodyProse)
    if (prose) lines.push('', prose)
    const request = plainText(p?.requestBody)
    if (request) lines.push('', `Materials: ${request}`)
    lines.push('')
  }

  lines.push(
    '## Working with the studio',
    '',
    `Scripts, synopses, and episode grids are shared privately with producers, representatives, and financiers. Requests go to ${NAP.email}; the reply comes from the writer.`,
    '',
  )

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
