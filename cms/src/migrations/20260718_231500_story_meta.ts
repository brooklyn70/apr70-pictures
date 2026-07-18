import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* v13 deferred design touch: optional story setting meta on properties.
   Renders as the small mono "1977 · Brooklyn" line under the title on
   /work/<slug>; both columns nullable so every page degrades gracefully.
   Hand-written additive migration (frame_ratio pattern) — no snapshot json,
   so a future migrate:create may re-diff these columns; strip them there. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "story_year" varchar;
  ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "story_place" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "projects" DROP COLUMN IF EXISTS "story_year";
  ALTER TABLE "projects" DROP COLUMN IF EXISTS "story_place";`)
}
