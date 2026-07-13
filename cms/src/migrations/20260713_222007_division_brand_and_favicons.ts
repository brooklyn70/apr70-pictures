import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Division Brand + real favicons (Marco 2026-07-13).
 *
 * - The per-division accent was HARDCODED in 212.astro / 310.astro / nrc.astro.
 *   Changing a division's colour meant a code edit and a deploy. Now it is three
 *   selects in Site Settings → Division Brand.
 * - The `favicon` upload field has existed since the v10 brand-kit migration and
 *   the SITE IGNORED IT — V9Layout hardcoded /favicon.svg, so uploading one did
 *   nothing. Wired now, and joined by a dark-tab variant, an Apple touch icon,
 *   and a per-division tab icon.
 *
 * A division favicon is a browser-tab icon, NOT a mark on the page, so it does not
 * reverse "condition 6" (no pictorial division marks in the layout; ruled the same
 * day — see the division canon).
 *
 * Additive and idempotent. Unlike the troupe migration, the generator emitted no
 * collateral this time (that one tried to drop the DISPATCH columns because the
 * hand-written dispatch migration left no snapshot to diff against — this one has
 * a clean baseline). Guards added anyway so a re-run is a no-op.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_site_settings_accent212" AS ENUM('flame', 'amber', 'imax', 'sicilian-blue', 'nrc-grey');
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_site_settings_accent310" AS ENUM('flame', 'amber', 'imax', 'sicilian-blue', 'nrc-grey');
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_site_settings_accent_nrc" AS ENUM('flame', 'amber', 'imax', 'sicilian-blue', 'nrc-grey');
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "favicon_dark_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "apple_touch_icon_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "accent212" "enum_site_settings_accent212" DEFAULT 'flame';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "favicon212_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "accent310" "enum_site_settings_accent310" DEFAULT 'sicilian-blue';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "favicon310_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "accent_nrc" "enum_site_settings_accent_nrc" DEFAULT 'nrc-grey';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "favicon_nrc_id" integer;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_dark_id_media_id_fk" FOREIGN KEY ("favicon_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_apple_touch_icon_id_media_id_fk" FOREIGN KEY ("apple_touch_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon212_id_media_id_fk" FOREIGN KEY ("favicon212_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon310_id_media_id_fk" FOREIGN KEY ("favicon310_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_nrc_id_media_id_fk" FOREIGN KEY ("favicon_nrc_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_favicon_dark_idx" ON "site_settings" USING btree ("favicon_dark_id");
  CREATE INDEX "site_settings_apple_touch_icon_idx" ON "site_settings" USING btree ("apple_touch_icon_id");
  CREATE INDEX "site_settings_favicon212_idx" ON "site_settings" USING btree ("favicon212_id");
  CREATE INDEX "site_settings_favicon310_idx" ON "site_settings" USING btree ("favicon310_id");
  CREATE INDEX "site_settings_favicon_nrc_idx" ON "site_settings" USING btree ("favicon_nrc_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  /* Touches ONLY its own columns. Never dispatch_*, never troupe_*. */
  await db.execute(sql`
  ALTER TABLE "site_settings" DROP CONSTRAINT IF EXISTS "site_settings_favicon_dark_id_media_id_fk";
  ALTER TABLE "site_settings" DROP CONSTRAINT IF EXISTS "site_settings_apple_touch_icon_id_media_id_fk";
  ALTER TABLE "site_settings" DROP CONSTRAINT IF EXISTS "site_settings_favicon212_id_media_id_fk";
  ALTER TABLE "site_settings" DROP CONSTRAINT IF EXISTS "site_settings_favicon310_id_media_id_fk";
  ALTER TABLE "site_settings" DROP CONSTRAINT IF EXISTS "site_settings_favicon_nrc_id_media_id_fk";

  DROP INDEX IF EXISTS "site_settings_favicon_dark_idx";
  DROP INDEX IF EXISTS "site_settings_apple_touch_icon_idx";
  DROP INDEX IF EXISTS "site_settings_favicon212_idx";
  DROP INDEX IF EXISTS "site_settings_favicon310_idx";
  DROP INDEX IF EXISTS "site_settings_favicon_nrc_idx";

  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "favicon_dark_id";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "apple_touch_icon_id";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "accent212";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "favicon212_id";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "accent310";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "favicon310_id";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "accent_nrc";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "favicon_nrc_id";

  DROP TYPE IF EXISTS "public"."enum_site_settings_accent212";
  DROP TYPE IF EXISTS "public"."enum_site_settings_accent310";
  DROP TYPE IF EXISTS "public"."enum_site_settings_accent_nrc";`)
}
