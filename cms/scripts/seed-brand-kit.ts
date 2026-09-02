/**
 * seed-brand-kit — the brand media layer of the three-layer content law.
 *
 * Marco's ruling 2026-09-02 (plan §G.1 item 6): brand media used to exist in the
 * live DB only; a fresh database booted with empty Site Settings brand fields and
 * fell back to the static SVGs. This script uploads the canonical Punch kit
 * (SharedData/10-01-logos/2026-brand-jost-punch/) into the Payload media
 * collection with Media Kind + Division tags so the brand pickers see them.
 *
 * Idempotent: a file whose basename already exists in `media` is skipped. It
 * never deletes, never re-uploads, never touches Site Settings — wiring the eight
 * brand fields stays Marco's pick in /admin (or a later, ruled step).
 *
 *   pnpm seed:brand:dry     # list what would upload
 *   pnpm seed:brand:apply   # upload
 *
 * Source dir override: BRAND_KIT_DIR=/path/to/2026-brand-jost-punch
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const APPLY = process.argv.includes('--apply')
const DRY = process.argv.includes('--dry-run')
if (APPLY === DRY) {
  console.error('usage: tsx scripts/seed-brand-kit.ts (--dry-run | --apply)')
  process.exit(1)
}

const KIT = process.env.BRAND_KIT_DIR || '/Volumes/SharedData/10-01-logos/2026-brand-jost-punch'

type Kind = 'logo' | 'favicon' | 'wordmark' | 'watermark' | 'photo'
type Division = '212' | '310' | 'nrc' | 'corporate'

/** Which kit folders ship to the CMS, and the Media Kind each carries. The 112-asset
 *  web kit = 40 wordmark SVG + 8 monogram SVG + 32 favicon SVG + 32 favicon 512 PNG.
 *  Print masters (letterhead, business-card, other PNG sizes, .ico) stay on SharedData. */
const SOURCES: Array<{ dir: string; kind: Kind; filter?: (name: string) => boolean }> = [
  { dir: 'wordmark', kind: 'wordmark' },
  { dir: 'monogram', kind: 'logo' },
  { dir: 'favicons/svg', kind: 'favicon' },
  { dir: 'favicons/png', kind: 'favicon', filter: (n) => /_512\.png$/i.test(n) },
]

function divisionFor(name: string): Division {
  if (/^favicon-212_/i.test(name)) return '212'
  if (/^favicon-310_/i.test(name)) return '310'
  if (/^favicon-nrc_/i.test(name)) return 'nrc'
  return 'corporate'
}

function altFor(name: string, kind: Kind): string {
  const stem = name.replace(/\.[a-z0-9]+$/i, '')
  const words = stem.replace(/[-_]+/g, ' ')
  const label = kind === 'wordmark' ? 'APR 70 wordmark' : kind === 'logo' ? 'APR 70 monogram' : 'APR 70 favicon tile'
  return `${label} — ${words}`
}

async function main() {
  if (!fs.existsSync(KIT)) {
    console.error(`brand kit not found: ${KIT} (mount SharedData or set BRAND_KIT_DIR)`)
    process.exit(1)
  }
  const payload = await getPayload({ config })
  const summary = { uploaded: [] as string[], existing: 0, missingDirs: [] as string[] }

  for (const src of SOURCES) {
    const dir = path.join(KIT, src.dir)
    if (!fs.existsSync(dir)) {
      summary.missingDirs.push(src.dir)
      continue
    }
    const names = fs
      .readdirSync(dir)
      .filter((n) => /\.(svg|png)$/i.test(n) && !n.startsWith('.'))
      .filter((n) => (src.filter ? src.filter(n) : true))
      .sort()
    for (const name of names) {
      const found = await payload.find({
        collection: 'media',
        where: { filename: { equals: name } },
        depth: 0,
        limit: 1,
      })
      if (found.docs?.length) {
        summary.existing++
        continue
      }
      const data = { alt: altFor(name, src.kind), mediaKind: src.kind, divisionTag: divisionFor(name) }
      if (DRY) {
        summary.uploaded.push(`${src.dir}/${name} -> ${src.kind}/${data.divisionTag} (would upload)`)
        continue
      }
      await payload.create({ collection: 'media', data, filePath: path.join(dir, name) })
      summary.uploaded.push(`${src.dir}/${name} -> ${src.kind}/${data.divisionTag}`)
    }
  }

  console.log(JSON.stringify({ mode: DRY ? 'dry-run' : 'apply', kit: KIT, ...summary }, null, 2))
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
