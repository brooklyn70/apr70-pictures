import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  /* NB: migrate:create also diffed in frame_ratio + the logo-height default —
     both already live (20260714_frame_ratio migration / Marco's ruled 64).
     Stripped to the ai_mark statements only; the snapshot .json keeps the
     full schema so future diffs stay clean. */
  await db.execute(sql`
  CREATE TYPE "public"."enum_site_settings_ai_mark_style" AS ENUM('corner', 'diagonal');
  ALTER TABLE "site_settings" ADD COLUMN "ai_mark_enabled" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "ai_mark_style" "enum_site_settings_ai_mark_style" DEFAULT 'corner';
  ALTER TABLE "site_settings" ADD COLUMN "ai_mark_text" varchar DEFAULT 'APR 70 · AI GEN';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "site_settings" DROP COLUMN "ai_mark_enabled";
  ALTER TABLE "site_settings" DROP COLUMN "ai_mark_style";
  ALTER TABLE "site_settings" DROP COLUMN "ai_mark_text";
  DROP TYPE "public"."enum_site_settings_ai_mark_style";`)
}
