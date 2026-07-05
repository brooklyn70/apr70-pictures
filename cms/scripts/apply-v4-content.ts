/**
 * apply-v4-content.ts — V4 zine content apply (idempotent).
 *
 * Upserts the V4 copy bundle (single source: web/src/content/v4.ts) into
 * whatever database DATABASE_URI (preferred) or DATABASE_URL points at,
 * via the Payload local API:
 *
 *   1. Home global        — layout := DISPATCH front door
 *                            (zineMasthead + 3 zinePassage teasers)
 *   2. 212 / 310 / nrc    — layout := the bundle's division zinePassage
 *                            (text-forward ruling: replaces the old visual
 *                            starter layouts; division logos/favicons are
 *                            separate fields and are untouched)
 *   3. Projects           — the 7 bundle synopses as zineSynopsis layouts:
 *                            adds Sea Gate (missing from site data), retitles
 *                            "The Maltese Falcon (Working Title)" -> "Da Hook"
 *                            (slug `falcon` kept, URLs stable), "U Brucculinu"
 *                            -> "U Bruculinu" (canon spelling), Shadowmaster
 *                            -> NRC, A Need Grows in Brooklyn -> NRC lead,
 *                            Alpha YY -> NRC lead (division only; no bundle
 *                            synopsis exists for it)
 *   4. DISPATCH issue     — numbered-never-dated indicia pass: displayTitle
 *                            "Vol. 01 No. 01", releaseDate cleared, season/
 *                            isoDate de-dated, cover kicker "INAUGURAL ISSUE",
 *                            archive card seasons cleared. Slug is kept for
 *                            idempotent matching (never rendered).
 *   5. SiteSettings       — tagline := footer studio one-liner
 *
 * GUARD: refuses to run unless APPLY_V4=yes is set.
 * PREREQ: migrations through 20260705_v4_zine_blocks must be applied first
 *         (this script writes rows into the new zine block tables).
 *
 * Run from cms/:  APPLY_V4=yes pnpm apply:v4
 *           or :  APPLY_V4=yes npx tsx scripts/apply-v4-content.ts
 */

import 'dotenv/config'

async function main(): Promise<void> {
  if (process.env.APPLY_V4 !== 'yes') {
    console.error(
      'apply-v4-content: refusing to run. Set APPLY_V4=yes to apply the V4 content. No changes made.',
    )
    process.exit(1)
  }

  // The brief's contract is DATABASE_URI; payload.config.ts reads DATABASE_URL.
  if (process.env.DATABASE_URI) {
    process.env.DATABASE_URL = process.env.DATABASE_URI
  }
  if (!process.env.DATABASE_URL) {
    console.error('apply-v4-content: no DATABASE_URI/DATABASE_URL set. No changes made.')
    process.exit(1)
  }

  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config.js')
  const {
    V4_FRONT_DOOR_BLOCKS,
    V4_DIVISION_PASSAGES,
    V4_PROPERTIES,
    V4_FOOTER,
    V4_DISPATCH_INDICIA,
  } = await import('../../web/src/content/v4.js')

  // Generated types are stale (blocked by the numeric "212"/"310" global
  // slugs breaking `payload generate:types`), so the local API is used
  // untyped here. Shapes mirror the block configs in src/blocks/Zine*.ts.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = (await getPayload({ config })) as any

  const summary: string[] = []

  // ── 1. Home global — the DISPATCH front door ──────────────────────────────
  await payload.updateGlobal({
    slug: 'home',
    data: { layout: V4_FRONT_DOOR_BLOCKS },
  })
  summary.push('home: layout := zineMasthead + 3 zinePassage teasers')

  // ── 2. Division globals ───────────────────────────────────────────────────
  for (const slug of ['212', '310', 'nrc'] as const) {
    await payload.updateGlobal({
      slug,
      data: { layout: [V4_DIVISION_PASSAGES[slug]] },
    })
    summary.push(`${slug}: layout := bundle division zinePassage`)
  }

  // ── 3. Projects — the 7 bundle synopses + Alpha YY division fix ──────────
  for (const prop of V4_PROPERTIES) {
    const found = await payload.find({
      collection: 'projects',
      where: { slug: { equals: prop.slug } },
      depth: 0,
      limit: 1,
    })
    const existing = found.docs?.[0]
    const data = {
      title: prop.title,
      division: prop.division,
      subtitle: prop.subtitle,
      layout: [prop.synopsis],
    }
    if (existing) {
      await payload.update({ collection: 'projects', id: existing.id, data })
      summary.push(`projects/${prop.slug}: updated (${prop.title}, ${prop.division})`)
    } else {
      await payload.create({
        collection: 'projects',
        data: { ...data, slug: prop.slug, status: 'development' },
      })
      summary.push(`projects/${prop.slug}: created (${prop.title}, ${prop.division})`)
    }
  }

  {
    // Alpha YY — NRC lead per bundle CANON FLAGS item 3 (division only).
    const found = await payload.find({
      collection: 'projects',
      where: { slug: { equals: 'alphayy' } },
      depth: 0,
      limit: 1,
    })
    const alphayy = found.docs?.[0]
    if (alphayy) {
      await payload.update({
        collection: 'projects',
        id: alphayy.id,
        data: { division: 'nrc' },
      })
      summary.push('projects/alphayy: division := nrc')
    } else {
      summary.push('projects/alphayy: not found — skipped')
    }
  }

  // ── 4. DISPATCH issue — numbered, never dated ─────────────────────────────
  {
    let found = await payload.find({
      collection: 'dispatch-issues',
      where: { current: { equals: true } },
      depth: 0,
      limit: 1,
    })
    let issue = found.docs?.[0]
    if (!issue) {
      found = await payload.find({
        collection: 'dispatch-issues',
        where: { slug: { equals: 'vol-01-no-01-spring-2026' } },
        depth: 0,
        limit: 1,
      })
      issue = found.docs?.[0]
    }
    if (issue) {
      const archive = ((issue.archive ?? []) as Array<Record<string, unknown>>).map(
        (card) => ({ ...card, season: null }),
      )
      await payload.update({
        collection: 'dispatch-issues',
        id: issue.id,
        data: {
          displayTitle: V4_DISPATCH_INDICIA.displayTitle,
          releaseDate: null,
          indicia: {
            volume: V4_DISPATCH_INDICIA.volume,
            number: V4_DISPATCH_INDICIA.number,
            season: V4_DISPATCH_INDICIA.season,
            isoDate: null,
          },
          cover: { kicker: V4_DISPATCH_INDICIA.coverKicker },
          archive,
        },
      })
      summary.push(`dispatch-issues/${issue.slug}: indicia numbered-never-dated pass`)
    } else {
      summary.push('dispatch-issues: no current issue found — skipped')
    }
  }

  // ── 5. Site settings — footer studio one-liner ────────────────────────────
  await payload.updateGlobal({
    slug: 'site-settings',
    data: { tagline: V4_FOOTER.studioLine },
  })
  summary.push('site-settings: tagline := footer studio one-liner')

  console.log('\napply-v4-content: done.\n')
  for (const line of summary) console.log('  - ' + line)
  console.log('')
  process.exit(0)
}

main().catch((err) => {
  console.error('apply-v4-content: failed —', err)
  process.exit(1)
})
