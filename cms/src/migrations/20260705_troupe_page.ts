import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the Troupe Presents page global (`troupe`, rendered at /troupe) with a
 * curated block set: hero, playbill (new block), richText, twoCol, cta,
 * quotes, stats, divider. Table/enum shapes mirror the pitch global tables
 * from 20260513_131001 plus the hero brand fields from 20260515_201608.
 *
 * UNAPPLIED on branch v4-radio — run `pnpm payload migrate` at merge time.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_troupe_blocks_hero_variant" AS ENUM('default', 'split', 'fullscreen', 'slider-auto', 'slider-curated');
  CREATE TYPE "public"."enum_troupe_blocks_hero_division" AS ENUM('pictures-212', 'pictures-310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_troupe_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');
  CREATE TYPE "public"."enum_troupe_blocks_playbill_status" AS ENUM('in-production', 'coming-soon', 'released');
  CREATE TYPE "public"."enum_troupe_blocks_playbill_artwork" AS ENUM('on-air', 'microphone', 'script');
  CREATE TYPE "public"."enum_troupe_blocks_two_col_ratio" AS ENUM('1-3', '1-1', '1-2');
  CREATE TYPE "public"."enum_troupe_blocks_two_col_alignment" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_troupe_blocks_cta_buttons_variant" AS ENUM('solid', 'ghost', 'link');
  CREATE TYPE "public"."enum_troupe_blocks_quotes_layout" AS ENUM('stacked', 'carousel');
  CREATE TYPE "public"."enum_troupe_blocks_stats_stats_color_token" AS ENUM('none', '212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_troupe_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_troupe_blocks_divider_spacing" AS ENUM('compact', 'normal', 'wide');

  CREATE TABLE "troupe_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"media_id" integer,
  	"variant" "enum_troupe_blocks_hero_variant" DEFAULT 'default' NOT NULL,
  	"division" "enum_troupe_blocks_hero_division" DEFAULT 'corporate' NOT NULL,
  	"lockup_logo_id" integer,
  	"watermark_logo_id" integer,
  	"watermark_opacity" numeric DEFAULT 0.15,
  	"watermark_position" "enum_troupe_blocks_hero_watermark_position" DEFAULT 'bottom-right',
  	"watermark_show_on_mobile" boolean DEFAULT false,
  	"fade_duration" numeric DEFAULT 700,
  	"autoplay_delay" numeric DEFAULT 5000,
  	"show_indicator" boolean DEFAULT true,
  	"block_name" varchar
  );

  CREATE TABLE "troupe_blocks_hero_slider_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"subtext" varchar
  );

  CREATE TABLE "troupe_blocks_playbill_voices" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"voice" varchar NOT NULL,
  	"descriptor" varchar,
  	"roles" varchar NOT NULL,
  	"note" varchar
  );

  CREATE TABLE "troupe_blocks_playbill" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"program_number" varchar,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"runtime" varchar,
  	"scene_count" numeric,
  	"status" "enum_troupe_blocks_playbill_status" DEFAULT 'in-production' NOT NULL,
  	"poster_image_id" integer,
  	"artwork" "enum_troupe_blocks_playbill_artwork" DEFAULT 'on-air',
  	"notes" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "troupe_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"mega_scale" boolean DEFAULT false,
  	"block_name" varchar
  );

  CREATE TABLE "troupe_blocks_two_col" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"ratio" "enum_troupe_blocks_two_col_ratio" DEFAULT '1-3',
  	"alignment" "enum_troupe_blocks_two_col_alignment" DEFAULT 'top',
  	"block_name" varchar
  );

  CREATE TABLE "troupe_blocks_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_troupe_blocks_cta_buttons_variant" DEFAULT 'solid' NOT NULL
  );

  CREATE TABLE "troupe_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "troupe_blocks_quotes_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"attribution" varchar
  );

  CREATE TABLE "troupe_blocks_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum_troupe_blocks_quotes_layout" DEFAULT 'stacked' NOT NULL,
  	"block_name" varchar
  );

  CREATE TABLE "troupe_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"color_token" "enum_troupe_blocks_stats_stats_color_token" DEFAULT 'none'
  );

  CREATE TABLE "troupe_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"columns" "enum_troupe_blocks_stats_columns" DEFAULT '4' NOT NULL,
  	"block_name" varchar
  );

  CREATE TABLE "troupe_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"spacing" "enum_troupe_blocks_divider_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );

  CREATE TABLE "troupe" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  ALTER TABLE "troupe_blocks_hero" ADD CONSTRAINT "troupe_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "troupe_blocks_hero" ADD CONSTRAINT "troupe_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "troupe_blocks_hero" ADD CONSTRAINT "troupe_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "troupe_blocks_hero" ADD CONSTRAINT "troupe_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_hero_slider_items" ADD CONSTRAINT "troupe_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "troupe_blocks_hero_slider_items" ADD CONSTRAINT "troupe_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_playbill_voices" ADD CONSTRAINT "troupe_blocks_playbill_voices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe_blocks_playbill"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_playbill" ADD CONSTRAINT "troupe_blocks_playbill_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "troupe_blocks_playbill" ADD CONSTRAINT "troupe_blocks_playbill_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_rich_text" ADD CONSTRAINT "troupe_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_two_col" ADD CONSTRAINT "troupe_blocks_two_col_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_cta_buttons" ADD CONSTRAINT "troupe_blocks_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_cta" ADD CONSTRAINT "troupe_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_quotes_quotes" ADD CONSTRAINT "troupe_blocks_quotes_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_quotes" ADD CONSTRAINT "troupe_blocks_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_stats_stats" ADD CONSTRAINT "troupe_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_stats" ADD CONSTRAINT "troupe_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_divider" ADD CONSTRAINT "troupe_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX "troupe_blocks_hero_order_idx" ON "troupe_blocks_hero" USING btree ("_order");
  CREATE INDEX "troupe_blocks_hero_parent_id_idx" ON "troupe_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "troupe_blocks_hero_path_idx" ON "troupe_blocks_hero" USING btree ("_path");
  CREATE INDEX "troupe_blocks_hero_media_idx" ON "troupe_blocks_hero" USING btree ("media_id");
  CREATE INDEX "troupe_blocks_hero_lockup_logo_idx" ON "troupe_blocks_hero" USING btree ("lockup_logo_id");
  CREATE INDEX "troupe_blocks_hero_watermark_logo_idx" ON "troupe_blocks_hero" USING btree ("watermark_logo_id");
  CREATE INDEX "troupe_blocks_hero_slider_items_order_idx" ON "troupe_blocks_hero_slider_items" USING btree ("_order");
  CREATE INDEX "troupe_blocks_hero_slider_items_parent_id_idx" ON "troupe_blocks_hero_slider_items" USING btree ("_parent_id");
  CREATE INDEX "troupe_blocks_hero_slider_items_media_idx" ON "troupe_blocks_hero_slider_items" USING btree ("media_id");
  CREATE INDEX "troupe_blocks_playbill_voices_order_idx" ON "troupe_blocks_playbill_voices" USING btree ("_order");
  CREATE INDEX "troupe_blocks_playbill_voices_parent_id_idx" ON "troupe_blocks_playbill_voices" USING btree ("_parent_id");
  CREATE INDEX "troupe_blocks_playbill_order_idx" ON "troupe_blocks_playbill" USING btree ("_order");
  CREATE INDEX "troupe_blocks_playbill_parent_id_idx" ON "troupe_blocks_playbill" USING btree ("_parent_id");
  CREATE INDEX "troupe_blocks_playbill_path_idx" ON "troupe_blocks_playbill" USING btree ("_path");
  CREATE INDEX "troupe_blocks_playbill_poster_image_idx" ON "troupe_blocks_playbill" USING btree ("poster_image_id");
  CREATE INDEX "troupe_blocks_rich_text_order_idx" ON "troupe_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "troupe_blocks_rich_text_parent_id_idx" ON "troupe_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "troupe_blocks_rich_text_path_idx" ON "troupe_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "troupe_blocks_two_col_order_idx" ON "troupe_blocks_two_col" USING btree ("_order");
  CREATE INDEX "troupe_blocks_two_col_parent_id_idx" ON "troupe_blocks_two_col" USING btree ("_parent_id");
  CREATE INDEX "troupe_blocks_two_col_path_idx" ON "troupe_blocks_two_col" USING btree ("_path");
  CREATE INDEX "troupe_blocks_cta_buttons_order_idx" ON "troupe_blocks_cta_buttons" USING btree ("_order");
  CREATE INDEX "troupe_blocks_cta_buttons_parent_id_idx" ON "troupe_blocks_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "troupe_blocks_cta_order_idx" ON "troupe_blocks_cta" USING btree ("_order");
  CREATE INDEX "troupe_blocks_cta_parent_id_idx" ON "troupe_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "troupe_blocks_cta_path_idx" ON "troupe_blocks_cta" USING btree ("_path");
  CREATE INDEX "troupe_blocks_quotes_quotes_order_idx" ON "troupe_blocks_quotes_quotes" USING btree ("_order");
  CREATE INDEX "troupe_blocks_quotes_quotes_parent_id_idx" ON "troupe_blocks_quotes_quotes" USING btree ("_parent_id");
  CREATE INDEX "troupe_blocks_quotes_order_idx" ON "troupe_blocks_quotes" USING btree ("_order");
  CREATE INDEX "troupe_blocks_quotes_parent_id_idx" ON "troupe_blocks_quotes" USING btree ("_parent_id");
  CREATE INDEX "troupe_blocks_quotes_path_idx" ON "troupe_blocks_quotes" USING btree ("_path");
  CREATE INDEX "troupe_blocks_stats_stats_order_idx" ON "troupe_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "troupe_blocks_stats_stats_parent_id_idx" ON "troupe_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "troupe_blocks_stats_order_idx" ON "troupe_blocks_stats" USING btree ("_order");
  CREATE INDEX "troupe_blocks_stats_parent_id_idx" ON "troupe_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "troupe_blocks_stats_path_idx" ON "troupe_blocks_stats" USING btree ("_path");
  CREATE INDEX "troupe_blocks_divider_order_idx" ON "troupe_blocks_divider" USING btree ("_order");
  CREATE INDEX "troupe_blocks_divider_parent_id_idx" ON "troupe_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "troupe_blocks_divider_path_idx" ON "troupe_blocks_divider" USING btree ("_path");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "troupe_blocks_hero_slider_items" CASCADE;
  DROP TABLE IF EXISTS "troupe_blocks_hero" CASCADE;
  DROP TABLE IF EXISTS "troupe_blocks_playbill_voices" CASCADE;
  DROP TABLE IF EXISTS "troupe_blocks_playbill" CASCADE;
  DROP TABLE IF EXISTS "troupe_blocks_rich_text" CASCADE;
  DROP TABLE IF EXISTS "troupe_blocks_two_col" CASCADE;
  DROP TABLE IF EXISTS "troupe_blocks_cta_buttons" CASCADE;
  DROP TABLE IF EXISTS "troupe_blocks_cta" CASCADE;
  DROP TABLE IF EXISTS "troupe_blocks_quotes_quotes" CASCADE;
  DROP TABLE IF EXISTS "troupe_blocks_quotes" CASCADE;
  DROP TABLE IF EXISTS "troupe_blocks_stats_stats" CASCADE;
  DROP TABLE IF EXISTS "troupe_blocks_stats" CASCADE;
  DROP TABLE IF EXISTS "troupe_blocks_divider" CASCADE;
  DROP TABLE IF EXISTS "troupe" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_troupe_blocks_hero_variant";
  DROP TYPE IF EXISTS "public"."enum_troupe_blocks_hero_division";
  DROP TYPE IF EXISTS "public"."enum_troupe_blocks_hero_watermark_position";
  DROP TYPE IF EXISTS "public"."enum_troupe_blocks_playbill_status";
  DROP TYPE IF EXISTS "public"."enum_troupe_blocks_playbill_artwork";
  DROP TYPE IF EXISTS "public"."enum_troupe_blocks_two_col_ratio";
  DROP TYPE IF EXISTS "public"."enum_troupe_blocks_two_col_alignment";
  DROP TYPE IF EXISTS "public"."enum_troupe_blocks_cta_buttons_variant";
  DROP TYPE IF EXISTS "public"."enum_troupe_blocks_quotes_layout";
  DROP TYPE IF EXISTS "public"."enum_troupe_blocks_stats_stats_color_token";
  DROP TYPE IF EXISTS "public"."enum_troupe_blocks_stats_columns";
  DROP TYPE IF EXISTS "public"."enum_troupe_blocks_divider_spacing";
  `)
}
