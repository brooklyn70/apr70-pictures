import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* Hero line: one sentence set over the hero photo-fold on /work/<slug>
   (Marco, 2026-09-04: the one-liners live on the project pages only, over the
   image; the home page carries none). Nullable, additive, story_meta pattern:
   hand-written, no snapshot json — strip it from a future migrate:create diff. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "hero_line" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "projects" DROP COLUMN IF EXISTS "hero_line";`)
}
