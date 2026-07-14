/**
 * Re-import the reviewed crops into Payload and force it to regenerate every size tier.
 *
 * Swapping a file on disk does NOT do this: media rows are keyed by filename, so the row keeps
 * its old width/height and its stale thumb/card/hero. Only pushing the bytes back through
 * Payload's upload pipeline refreshes them — which is what payload.update({ filePath }) does.
 *
 * The cropToFrame hook runs on the way through. Crops already on ratio pass unchanged (the
 * crop is idempotent), and rows marked `native` are never touched.
 *
 *   CROPS_DIR=/path/to/crops pnpm tsx scripts/reimport-frames.ts --dry
 *   CROPS_DIR=/path/to/crops pnpm tsx scripts/reimport-frames.ts --apply
 */
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import { sql } from '@payloadcms/db-postgres'
import config from '../src/payload.config'

const DRY = !process.argv.includes('--apply')
const CROPS_DIR = process.env.CROPS_DIR
const MANIFEST = process.env.MANIFEST ?? (CROPS_DIR ? path.join(CROPS_DIR, '..', 'manifest.json') : '')
// Payload's upload staticDir defaults to the collection slug, resolved from cwd.
const MEDIA_DIR = process.env.MEDIA_DIR ?? path.resolve(process.cwd(), 'media')

type Row = { id: number; file: string; slot: string; class: 'HERO' | 'STD' | 'NATIVE'; note?: string }

const FRAME_RATIO: Record<Row['class'], 'hero' | 'standard' | 'native'> = {
  HERO: 'hero',
  STD: 'standard',
  NATIVE: 'native',
}

async function main() {
  if (!CROPS_DIR || !fs.existsSync(CROPS_DIR)) throw new Error(`CROPS_DIR not found: ${CROPS_DIR}`)
  if (!fs.existsSync(MANIFEST)) throw new Error(`manifest not found: ${MANIFEST}`)

  // Same guard as seed-v9: never point this at a remote database.
  const db = process.env.DATABASE_URL ?? ''
  if (!/127\.0\.0\.1|localhost/.test(db)) {
    throw new Error(`refusing to run against a non-local DATABASE_URL: ${db.replace(/:[^:@]+@/, ':***@')}`)
  }

  const rows: Row[] = JSON.parse(fs.readFileSync(MANIFEST, 'utf8')).rows
  const payload = await getPayload({ config })
  const drizzle = (payload.db as unknown as { drizzle: { execute: (q: unknown) => Promise<unknown> } })
    .drizzle

  let updated = 0
  let skipped = 0
  const failed: string[] = []

  for (const row of rows) {
    const filePath = path.join(CROPS_DIR, row.file)
    if (!fs.existsSync(filePath)) {
      failed.push(`${row.file} — no crop staged`)
      continue
    }
    const frameRatio = FRAME_RATIO[row.class]

    if (DRY) {
      const bytes = fs.statSync(filePath).size
      console.log(`  would update id=${String(row.id).padStart(3)} [${frameRatio.padEnd(8)}] ${(bytes / 1e6).toFixed(1).padStart(5)}MB  ${row.file}`)
      skipped++
      continue
    }

    try {
      // Payload dedupes an incoming filename against BOTH the filesystem and the database —
      // and docWithFilenameExists does not exclude the row being updated, so a doc always
      // collides with itself and gets renamed. That is not cosmetic: incrementName's regex
      // /(.*)-(\d+)$/ reads `egyptian-premiere-1926` as base + counter and returns
      // `egyptian-premiere-1927`, silently redating a 1926 archival photograph. The -1 suffix
      // it appends to everything else would also break seed-v9, which is idempotent by filename.
      //
      // So: take the old files off disk AND null the row's filename, leaving nothing to
      // collide with. Payload then writes the name we asked for.
      const existing = (await payload.findByID({
        collection: 'media',
        id: row.id,
        depth: 0,
      })) as { filename?: string | null; sizes?: Record<string, { filename?: string | null }> }

      const stale = [
        existing.filename,
        ...Object.values(existing.sizes ?? {}).map((s) => s?.filename),
      ].filter((n): n is string => Boolean(n))

      for (const name of stale) {
        const p = path.join(MEDIA_DIR, name)
        if (fs.existsSync(p)) fs.unlinkSync(p)
      }

      await drizzle.execute(sql`UPDATE media SET filename = NULL WHERE id = ${row.id}`)

      await payload.update({
        collection: 'media',
        id: row.id,
        data: { frameRatio },
        filePath, // re-runs the upload pipeline: new bytes, fresh width/height, fresh tiers
      })

      const after = (await payload.findByID({ collection: 'media', id: row.id, depth: 0 })) as {
        filename?: string | null
      }
      if (after.filename !== row.file) {
        failed.push(`${row.file} — Payload renamed it to ${after.filename}`)
        process.stdout.write('R')
        continue
      }

      updated++
      process.stdout.write('.')
    } catch (e) {
      failed.push(`${row.file} — ${(e as Error).message.slice(0, 90)}`)
      process.stdout.write('x')
    }
  }

  console.log('\n')
  console.log(DRY ? `DRY RUN — ${skipped} rows would be re-imported. Re-run with --apply.` : `re-imported: ${updated}`)
  if (failed.length) {
    console.log(`\nfailed: ${failed.length}`)
    for (const f of failed) console.log('  ' + f)
  }
  process.exit(failed.length ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
