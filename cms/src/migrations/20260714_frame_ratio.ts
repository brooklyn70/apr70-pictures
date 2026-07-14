import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Frame ratio on media (Marco 2026-07-14).
 *
 * Images were authored with no target aspect ratio, so the ratio was decided at paint time by
 * whichever CSS box they happened to land in — cover silently cropping heads off, contain
 * letterboxing, object-position sliding the frame around. The fix is to decide at the source:
 * every upload is cropped to a house ratio by the `cropToFrame` beforeOperation hook, and
 * `frameRatio` is the per-image choice it reads.
 *
 *   standard  2.00:1  the streaming ratio (The Crown, Ozark, Severance). The workhorse.
 *   hero      2.39:1  scope. Full-bleed slots only.
 *   native    no crop. Archival maps, engravings and period photographs are records, not
 *             film frames; cropping them is vandalism. Also strips and panoramas.
 *
 * 16:9 is deliberately absent — it is the television ratio, and this is a film company.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_media_frame_ratio" AS ENUM('standard', 'hero', 'native');
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "frame_ratio" "enum_media_frame_ratio" DEFAULT 'standard';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "media" DROP COLUMN IF EXISTS "frame_ratio";

  DROP TYPE IF EXISTS "public"."enum_media_frame_ratio";`)
}
