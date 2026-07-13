/**
 * fix-billing-blocks.ts — one billing string per property, stored once.
 *
 * THE BUG (found by the auteur-investor panel, 2026-07-13; four of five investors
 * caught it independently):
 *
 * The billing block ("Feature · New Renaissance Cinema with (212) Pictures · drafted")
 * lived in TWO places:
 *   1. Project.metaLine            — read by /nrc, /212, /310 and the property page
 *   2. the slateList block's per-row `meta` override — read by / and /slate
 *
 * They drifted. When Sea Gate and Da Hook moved to New Renaissance Cinema
 * (2026-07-12), metaLine was updated but the slate overrides were not, so the same
 * picture wore "(212) Pictures" on the slate and "New Renaissance Cinema" on /nrc.
 * That breaks the co-production law the site publishes itself at /nrc:
 *
 *   "Every APR 70 feature carries this banner, and its home territory, (212) or
 *    (310), joins as co-production."
 *
 * Sea Gate and Da Hook were ALSO wrong in metaLine itself: both omitted the
 * "with (212) Pictures" co-production partner that A Need Grows in Brooklyn and
 * Alpha YY correctly carry.
 *
 * THE FIX
 *   - Project.metaLine becomes the single source of truth, with the status wrapped
 *     in ==highlight== markup so every surface renders it identically.
 *   - Every per-row `meta` override is cleared to null, so nothing can drift again.
 *   - The "the page →" affordance moves out of the data and into SlateList.astro,
 *     where it belongs: it is a link affordance, not a billing fact.
 *
 * RULED 2026-07-13 (Marco) — the second half of the same bug:
 *   /nrc defines New Renaissance Cinema as "Feature films built for permanence"
 *   and then hung two SERIES on it (Shadowmaster, U Bruculinu). This looked like a
 *   canon question. It was not. The division canon (11.06 Divisions, status: canon,
 *   2026-07-06) already bills BOTH as features — "Feature first" and "Feature
 *   (probable)" — and the V10 Change Register had already logged the site's "Series"
 *   label as known, unfixed drift. So the site was simply wrong, and the /nrc
 *   definition needs no rewrite: once both are Features, it stops contradicting
 *   itself. Marco's ruling: "NRC is features only." Both flipped to Feature below.
 *
 * Run from cms/:  npx tsx scripts/fix-billing-blocks.ts --dry-run
 *                 npx tsx scripts/fix-billing-blocks.ts --apply
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const APPLY = process.argv.includes('--apply')

/** The canonical billing block for every public property. Status is highlighted.
 *  The co-production law (Marco, 2026-07-13): a FEATURE carries New Renaissance
 *  Cinema, and its home territory joins as co-production — (212) if it is NY,
 *  (310) if it is West Coast. A feature set in NEITHER carries NRC alone.
 *  A SERIES carries its territory alone and never wears the NRC banner. */
const CANON: Record<string, string> = {
  'a-need-grows-in-brooklyn':
    'Feature · New Renaissance Cinema with (212) Pictures · ==drafted==',
  'la-dolce-vita': 'Series · (310) Pictures · ==pilot + nine on the page==',
  // FIXED: was "Feature · New Renaissance Cinema · drafted" (no co-production partner)
  'sea-gate': 'Feature · New Renaissance Cinema with (212) Pictures · ==drafted==',
  'alpha-yy': 'Feature · New Renaissance Cinema with (212) Pictures · ==drafted==',
  // FIXED: was "Feature · New Renaissance Cinema · in development" (no partner)
  'da-hook': 'Feature · New Renaissance Cinema with (212) Pictures · ==in development==',
  'the-movement': 'Series · (212) Pictures · ==in development==',
  'cleopatra': 'Series · (310) Pictures · ==in development==',
  // RULED (Marco, 2026-07-13): NRC is features only. Both of these were billed
  // "Series" by the site alone — the division canon has said "Feature" for each
  // since 2026-07-06. Site copy was the drift; canon was right.
  //
  // Shadowmaster is SET IN LOS ANGELES (Marco, 2026-07-13 — the setting was an
  // empty stub until this ruling), so it takes the (310) co-production arm.
  'shadowmaster': 'Feature · New Renaissance Cinema with (310) Pictures · ==in development==',
  // U Bruculinu is Sicily — neither coast. It is the stateless picture: NRC alone.
  'u-bruculinu': 'Feature · New Renaissance Cinema · ==in development==',
}

const payload = await getPayload({ config })

console.log(APPLY ? '── APPLYING ──\n' : '── DRY RUN (nothing written) ──\n')

// ── 1. The canonical field ────────────────────────────────────────────────────
const { docs: projects } = await payload.find({ collection: 'projects', limit: 50, depth: 0 })
let changed = 0

for (const p of projects as any[]) {
  const want = CANON[p.slug]
  if (!want) continue
  if (p.metaLine === want) {
    console.log(`  =  ${p.title}`)
    continue
  }
  console.log(`  ✎  ${p.title}`)
  console.log(`       was:  ${p.metaLine}`)
  console.log(`       now:  ${want}`)
  changed++
  if (APPLY) {
    await payload.update({ collection: 'projects', id: p.id, data: { metaLine: want } as never })
  }
}

// ── 2. Kill every per-row override, so there is only ONE source ───────────────
let cleared = 0
for (const slug of ['v9-home', 'v9-slate'] as const) {
  const g: any = await payload.findGlobal({ slug, depth: 0 })
  const sections = (g.sections ?? []) as any[]
  let touched = false

  for (const s of sections) {
    if (s.blockType !== 'slateList') continue
    for (const row of s.rows ?? []) {
      if (row.meta) {
        console.log(`  ✂  ${slug}: cleared override on "${row.title ?? '(row)'}"`)
        console.log(`       was:  ${row.meta}`)
        row.meta = null
        cleared++
        touched = true
      }
    }
  }
  if (APPLY && touched) {
    await payload.updateGlobal({ slug, data: { sections } as never })
  }
}

console.log(
  `\n  ${changed} billing string(s) corrected · ${cleared} duplicate override(s) removed`,
)
console.log(
  APPLY
    ? '  Written. Project.metaLine is now the single source of truth.\n'
    : '  Dry run. Re-run with --apply to write.\n',
)
process.exit(0)
