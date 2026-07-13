import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * TROUPE switch + Troupe Programme (Marco 2026-07-13).
 *
 * Creates the `troupe_program` global (the radio play, and its cast array) and
 * adds the two `troupe_*` columns behind the "Publish the TROUPE page" checkbox.
 * /troupe reads both on every render (the site is SSR), so the page publishes
 * itself the day the recording is uploaded — no rebuild, no deploy.
 *
 * ⚠️ HAND-EDITED AFTER GENERATION, ON PURPOSE. `payload migrate:create` also
 * emitted ADD/DROP COLUMN for `dispatch_enabled` and `dispatch_nav_label`,
 * because 20260713_dispatch_switch.ts was hand-written and left no schema
 * snapshot for the generator to diff against — so Payload believed those columns
 * were missing. They are NOT: that migration is applied and those columns exist.
 * Left as generated, `up()` would have thrown ("column already exists") and,
 * far worse, `down()` would have DROPPED the two dispatch columns and silently
 * killed the DISPATCH switch. Both dispatch statements are removed here; this
 * migration owns the troupe changes only. IF NOT EXISTS / IF EXISTS guards added
 * so a re-run is a no-op rather than an error.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "troupe_program" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"program_number" varchar DEFAULT 'No. 1',
  	"runtime" varchar,
  	"recorded_on" timestamp(3) with time zone,
  	"title" varchar,
  	"subtitle" varchar,
  	"property_id" integer,
  	"logline" varchar,
  	"audio_id" integer,
  	"poster_id" integer,
  	"programme_note" varchar,
  	"credits" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "troupe_program_cast" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" varchar,
  	"player" varchar
  );

  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "troupe_enabled" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "troupe_nav_label" varchar DEFAULT 'Troupe';

  ALTER TABLE "troupe_program_cast" DROP CONSTRAINT IF EXISTS "troupe_program_cast_parent_id_fk";
  ALTER TABLE "troupe_program_cast" ADD CONSTRAINT "troupe_program_cast_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe_program"("id") ON DELETE cascade ON UPDATE no action;

  ALTER TABLE "troupe_program" DROP CONSTRAINT IF EXISTS "troupe_program_property_id_projects_id_fk";
  ALTER TABLE "troupe_program" ADD CONSTRAINT "troupe_program_property_id_projects_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;

  ALTER TABLE "troupe_program" DROP CONSTRAINT IF EXISTS "troupe_program_audio_id_media_id_fk";
  ALTER TABLE "troupe_program" ADD CONSTRAINT "troupe_program_audio_id_media_id_fk" FOREIGN KEY ("audio_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

  ALTER TABLE "troupe_program" DROP CONSTRAINT IF EXISTS "troupe_program_poster_id_media_id_fk";
  ALTER TABLE "troupe_program" ADD CONSTRAINT "troupe_program_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

  CREATE INDEX IF NOT EXISTS "troupe_program_cast_order_idx" ON "troupe_program_cast" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "troupe_program_cast_parent_id_idx" ON "troupe_program_cast" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "troupe_program_property_idx" ON "troupe_program" USING btree ("property_id");
  CREATE INDEX IF NOT EXISTS "troupe_program_audio_idx" ON "troupe_program" USING btree ("audio_id");
  CREATE INDEX IF NOT EXISTS "troupe_program_poster_idx" ON "troupe_program" USING btree ("poster_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  /* Deliberately does NOT touch dispatch_* — see the note above. */
  await db.execute(sql`
  DROP TABLE IF EXISTS "troupe_program_cast" CASCADE;
  DROP TABLE IF EXISTS "troupe_program" CASCADE;
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "troupe_enabled";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "troupe_nav_label";`)
}
