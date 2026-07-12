import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * v10: Brand Kit fields on site_settings (logo height, mode default, accent,
 * link rollover, selection highlight) + the founding-roll collection.
 *
 * Hand-trimmed from the auto-generated migration: earlier migrations in this
 * repo carry no drizzle snapshots, so migrate:create diffed against an empty
 * schema and emitted full-schema DDL. Only the actual v10 delta is kept here;
 * the companion .json snapshot (full current schema) is retained so future
 * migrate:create runs diff correctly.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_site_settings_brand_kit_mode_default" AS ENUM('system', 'dark', 'light');
  CREATE TYPE "public"."enum_site_settings_brand_kit_accent" AS ENUM('flame', 'amber', 'imax', 'sicilian-blue', 'nrc-grey');
  CREATE TYPE "public"."enum_site_settings_brand_kit_link_hover" AS ENUM('accent', 'flame', 'amber', 'imax', 'sicilian-blue', 'ink');
  CREATE TYPE "public"."enum_site_settings_brand_kit_highlight" AS ENUM('flame', 'amber', 'sicilian-blue', 'ink');
  CREATE TABLE "founding_roll" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"roll_number" numeric,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"note" varchar,
  	"consent" boolean DEFAULT false NOT NULL,
  	"source" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "founding_roll_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "brand_kit_logo_height" numeric DEFAULT 34;
  ALTER TABLE "site_settings" ADD COLUMN "brand_kit_mode_default" "enum_site_settings_brand_kit_mode_default" DEFAULT 'system';
  ALTER TABLE "site_settings" ADD COLUMN "brand_kit_accent" "enum_site_settings_brand_kit_accent" DEFAULT 'flame';
  ALTER TABLE "site_settings" ADD COLUMN "brand_kit_link_hover" "enum_site_settings_brand_kit_link_hover" DEFAULT 'accent';
  ALTER TABLE "site_settings" ADD COLUMN "brand_kit_highlight" "enum_site_settings_brand_kit_highlight" DEFAULT 'flame';
  CREATE UNIQUE INDEX "founding_roll_roll_number_idx" ON "founding_roll" USING btree ("roll_number");
  CREATE UNIQUE INDEX "founding_roll_email_idx" ON "founding_roll" USING btree ("email");
  CREATE INDEX "founding_roll_updated_at_idx" ON "founding_roll" USING btree ("updated_at");
  CREATE INDEX "founding_roll_created_at_idx" ON "founding_roll" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_founding_roll_fk" FOREIGN KEY ("founding_roll_id") REFERENCES "public"."founding_roll"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_founding_roll_id_idx" ON "payload_locked_documents_rels" USING btree ("founding_roll_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_founding_roll_fk";
  DROP INDEX "payload_locked_documents_rels_founding_roll_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "founding_roll_id";
  DROP TABLE "founding_roll" CASCADE;
  ALTER TABLE "site_settings" DROP COLUMN "brand_kit_logo_height";
  ALTER TABLE "site_settings" DROP COLUMN "brand_kit_mode_default";
  ALTER TABLE "site_settings" DROP COLUMN "brand_kit_accent";
  ALTER TABLE "site_settings" DROP COLUMN "brand_kit_link_hover";
  ALTER TABLE "site_settings" DROP COLUMN "brand_kit_highlight";
  DROP TYPE "public"."enum_site_settings_brand_kit_mode_default";
  DROP TYPE "public"."enum_site_settings_brand_kit_accent";
  DROP TYPE "public"."enum_site_settings_brand_kit_link_hover";
  DROP TYPE "public"."enum_site_settings_brand_kit_highlight";`)
}
