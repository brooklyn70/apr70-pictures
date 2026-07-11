/**
 * dev-shadow-push.ts — scratch tool, NOT part of the app.
 *
 * Pushes the CURRENT payload config schema (drizzle push) into a throwaway
 * shadow database so the exact DDL for a hand-written migration can be
 * derived with pg_dump + diff. Used because migrate:create is blocked by the
 * numeric "212"/"310" global slugs (see 20260705_v4_zine_blocks.ts).
 *
 * Usage:
 *   createdb the shadow db first, then
 *   SHADOW_DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/apr70_v9_shadow \
 *     NODE_ENV=development npx tsx scripts/dev-shadow-push.ts
 */
import 'dotenv/config'

async function main(): Promise<void> {
  const url = process.env.SHADOW_DATABASE_URL
  if (!url || !/127\.0\.0\.1|localhost/.test(url)) {
    console.error('dev-shadow-push: SHADOW_DATABASE_URL must be set and local. No changes made.')
    process.exit(1)
  }
  if (/apr70_cms\b/.test(url)) {
    console.error('dev-shadow-push: refusing to push into apr70_cms (the real local DB).')
    process.exit(1)
  }

  // The app config reads DATABASE_URL at import time; point it at the shadow
  // DB and flip push on by monkey-patching after import is not possible, so
  // we rebuild the adapter here with the same collections/globals.
  process.env.DATABASE_URL = url

  const { buildConfig } = await import('payload')
  const { postgresAdapter } = await import('@payloadcms/db-postgres')
  const sharp = (await import('sharp')).default
  const path = (await import('path')).default

  const { Users } = await import('../src/collections/Users.js')
  const { Media } = await import('../src/collections/Media.js')
  const { Project } = await import('../src/collections/Project.js')
  const { NewsArticle } = await import('../src/collections/NewsArticle.js')
  const { DispatchIssue } = await import('../src/collections/DispatchIssue.js')
  const { aprLexicalEditor } = await import('../src/editor/aprLexicalEditor.js')
  const { Home } = await import('../src/globals/Home.js')
  const { SiteSettings } = await import('../src/globals/SiteSettings.js')
  const { FooterLinks } = await import('../src/globals/FooterLinks.js')
  const { About } = await import('../src/globals/About.js')
  const { Contact } = await import('../src/globals/Contact.js')
  const { Jobs } = await import('../src/globals/Jobs.js')
  const { Pitch } = await import('../src/globals/Pitch.js')
  const { Investors } = await import('../src/globals/Investors.js')
  const { Division212 } = await import('../src/globals/Division212.js')
  const { Division310 } = await import('../src/globals/Division310.js')
  const { DivisionNRC } = await import('../src/globals/DivisionNRC.js')
  const { TroupePage } = await import('../src/globals/TroupePage.js')
  const { V9Home, V9Slate, V9Craft, V9Methods, V9Contact } = await import('../src/globals/v9Pages.js')

  const config = await buildConfig({
    secret: 'shadow-push-only',
    collections: [Users, Media, Project, NewsArticle, DispatchIssue],
    globals: [Home, SiteSettings, FooterLinks, About, Contact, Jobs, Pitch, Investors, Division212, Division310, DivisionNRC, TroupePage, V9Home, V9Slate, V9Craft, V9Methods, V9Contact],
    editor: aprLexicalEditor,
    typescript: { outputFile: path.resolve(process.cwd(), '.shadow-payload-types.ts') },
    db: postgresAdapter({
      pool: { connectionString: url },
      push: true,
    }),
    sharp,
  })

  const { getPayload } = await import('payload')
  const payload = await getPayload({ config })
  // Touch the DB so init completes.
  await payload.db.drizzle.execute('select 1')
  console.log('dev-shadow-push: schema pushed to', url)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
