import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_212_blocks_hero_variant" AS ENUM('default', 'split', 'fullscreen', 'slider-auto', 'slider-curated');
  CREATE TYPE "public"."enum_212_blocks_hero_division" AS ENUM('pictures-212', 'pictures-310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_212_blocks_two_col_ratio" AS ENUM('1-3', '1-1', '1-2');
  CREATE TYPE "public"."enum_212_blocks_two_col_alignment" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_212_blocks_cta_buttons_variant" AS ENUM('solid', 'ghost', 'link');
  CREATE TYPE "public"."enum_212_blocks_quotes_layout" AS ENUM('stacked', 'carousel');
  CREATE TYPE "public"."enum_212_blocks_filmstrip_tiles_division" AS ENUM('none', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_212_blocks_filmstrip_source" AS ENUM('custom-media', 'from-projects');
  CREATE TYPE "public"."enum_212_blocks_filmstrip_project_filter" AS ENUM('all', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_212_blocks_division_showcase_divisions_color_token" AS ENUM('212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_212_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  CREATE TYPE "public"."enum_212_blocks_stats_stats_color_token" AS ENUM('none', '212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_212_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_212_blocks_divider_spacing" AS ENUM('compact', 'normal', 'wide');
  CREATE TYPE "public"."enum_310_blocks_hero_variant" AS ENUM('default', 'split', 'fullscreen', 'slider-auto', 'slider-curated');
  CREATE TYPE "public"."enum_310_blocks_hero_division" AS ENUM('pictures-212', 'pictures-310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_310_blocks_two_col_ratio" AS ENUM('1-3', '1-1', '1-2');
  CREATE TYPE "public"."enum_310_blocks_two_col_alignment" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_310_blocks_cta_buttons_variant" AS ENUM('solid', 'ghost', 'link');
  CREATE TYPE "public"."enum_310_blocks_quotes_layout" AS ENUM('stacked', 'carousel');
  CREATE TYPE "public"."enum_310_blocks_filmstrip_tiles_division" AS ENUM('none', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_310_blocks_filmstrip_source" AS ENUM('custom-media', 'from-projects');
  CREATE TYPE "public"."enum_310_blocks_filmstrip_project_filter" AS ENUM('all', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_310_blocks_division_showcase_divisions_color_token" AS ENUM('212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_310_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  CREATE TYPE "public"."enum_310_blocks_stats_stats_color_token" AS ENUM('none', '212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_310_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_310_blocks_divider_spacing" AS ENUM('compact', 'normal', 'wide');
  CREATE TYPE "public"."enum_nrc_blocks_hero_variant" AS ENUM('default', 'split', 'fullscreen', 'slider-auto', 'slider-curated');
  CREATE TYPE "public"."enum_nrc_blocks_hero_division" AS ENUM('pictures-212', 'pictures-310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_nrc_blocks_two_col_ratio" AS ENUM('1-3', '1-1', '1-2');
  CREATE TYPE "public"."enum_nrc_blocks_two_col_alignment" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_nrc_blocks_cta_buttons_variant" AS ENUM('solid', 'ghost', 'link');
  CREATE TYPE "public"."enum_nrc_blocks_quotes_layout" AS ENUM('stacked', 'carousel');
  CREATE TYPE "public"."enum_nrc_blocks_filmstrip_tiles_division" AS ENUM('none', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_nrc_blocks_filmstrip_source" AS ENUM('custom-media', 'from-projects');
  CREATE TYPE "public"."enum_nrc_blocks_filmstrip_project_filter" AS ENUM('all', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_nrc_blocks_division_showcase_divisions_color_token" AS ENUM('212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_nrc_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  CREATE TYPE "public"."enum_nrc_blocks_stats_stats_color_token" AS ENUM('none', '212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_nrc_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_nrc_blocks_divider_spacing" AS ENUM('compact', 'normal', 'wide');
  CREATE TABLE "212" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "310" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "nrc" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "212_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"media_id" integer,
  	"variant" "enum_212_blocks_hero_variant" DEFAULT 'default' NOT NULL,
  	"division" "enum_212_blocks_hero_division" DEFAULT 'corporate' NOT NULL,
  	"fade_duration" numeric DEFAULT 700,
  	"autoplay_delay" numeric DEFAULT 5000,
  	"show_indicator" boolean DEFAULT true,
  	"block_name" varchar
  );

  CREATE TABLE "212_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"mega_scale" boolean DEFAULT false,
  	"block_name" varchar
  );

  CREATE TABLE "212_blocks_two_col" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"ratio" "enum_212_blocks_two_col_ratio" DEFAULT '1-3',
  	"alignment" "enum_212_blocks_two_col_alignment" DEFAULT 'top',
  	"block_name" varchar
  );

  CREATE TABLE "212_blocks_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"description" jsonb
  );

  CREATE TABLE "212_blocks_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "212_blocks_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_212_blocks_cta_buttons_variant" DEFAULT 'solid' NOT NULL
  );

  CREATE TABLE "212_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "212_blocks_quotes_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"attribution" varchar
  );

  CREATE TABLE "212_blocks_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum_212_blocks_quotes_layout" DEFAULT 'stacked' NOT NULL,
  	"block_name" varchar
  );

  CREATE TABLE "212_blocks_filmstrip_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"division" "enum_212_blocks_filmstrip_tiles_division" DEFAULT 'none'
  );

  CREATE TABLE "212_blocks_filmstrip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_212_blocks_filmstrip_source" DEFAULT 'custom-media' NOT NULL,
  	"project_filter" "enum_212_blocks_filmstrip_project_filter" DEFAULT 'all',
  	"show_perforations" boolean DEFAULT true,
  	"block_name" varchar
  );

  CREATE TABLE "212_blocks_division_showcase_divisions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"color_token" "enum_212_blocks_division_showcase_divisions_color_token" DEFAULT '212-amber' NOT NULL,
  	"subtitle" varchar,
  	"description" varchar,
  	"media_id" integer
  );

  CREATE TABLE "212_blocks_division_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_212_blocks_division_showcase_variant" DEFAULT 'v0-baseline' NOT NULL,
  	"heading" varchar,
  	"subtext" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "212_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"color_token" "enum_212_blocks_stats_stats_color_token" DEFAULT 'none'
  );

  CREATE TABLE "212_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"columns" "enum_212_blocks_stats_columns" DEFAULT '4' NOT NULL,
  	"block_name" varchar
  );

  CREATE TABLE "212_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"spacing" "enum_212_blocks_divider_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );

  CREATE TABLE "310_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"media_id" integer,
  	"variant" "enum_310_blocks_hero_variant" DEFAULT 'default' NOT NULL,
  	"division" "enum_310_blocks_hero_division" DEFAULT 'corporate' NOT NULL,
  	"fade_duration" numeric DEFAULT 700,
  	"autoplay_delay" numeric DEFAULT 5000,
  	"show_indicator" boolean DEFAULT true,
  	"block_name" varchar
  );

  CREATE TABLE "310_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"mega_scale" boolean DEFAULT false,
  	"block_name" varchar
  );

  CREATE TABLE "310_blocks_two_col" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"ratio" "enum_310_blocks_two_col_ratio" DEFAULT '1-3',
  	"alignment" "enum_310_blocks_two_col_alignment" DEFAULT 'top',
  	"block_name" varchar
  );

  CREATE TABLE "310_blocks_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"description" jsonb
  );

  CREATE TABLE "310_blocks_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "310_blocks_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_310_blocks_cta_buttons_variant" DEFAULT 'solid' NOT NULL
  );

  CREATE TABLE "310_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "310_blocks_quotes_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"attribution" varchar
  );

  CREATE TABLE "310_blocks_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum_310_blocks_quotes_layout" DEFAULT 'stacked' NOT NULL,
  	"block_name" varchar
  );

  CREATE TABLE "310_blocks_filmstrip_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"division" "enum_310_blocks_filmstrip_tiles_division" DEFAULT 'none'
  );

  CREATE TABLE "310_blocks_filmstrip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_310_blocks_filmstrip_source" DEFAULT 'custom-media' NOT NULL,
  	"project_filter" "enum_310_blocks_filmstrip_project_filter" DEFAULT 'all',
  	"show_perforations" boolean DEFAULT true,
  	"block_name" varchar
  );

  CREATE TABLE "310_blocks_division_showcase_divisions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"color_token" "enum_310_blocks_division_showcase_divisions_color_token" DEFAULT '212-amber' NOT NULL,
  	"subtitle" varchar,
  	"description" varchar,
  	"media_id" integer
  );

  CREATE TABLE "310_blocks_division_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_310_blocks_division_showcase_variant" DEFAULT 'v0-baseline' NOT NULL,
  	"heading" varchar,
  	"subtext" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "310_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"color_token" "enum_310_blocks_stats_stats_color_token" DEFAULT 'none'
  );

  CREATE TABLE "310_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"columns" "enum_310_blocks_stats_columns" DEFAULT '4' NOT NULL,
  	"block_name" varchar
  );

  CREATE TABLE "310_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"spacing" "enum_310_blocks_divider_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );

  CREATE TABLE "nrc_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"media_id" integer,
  	"variant" "enum_nrc_blocks_hero_variant" DEFAULT 'default' NOT NULL,
  	"division" "enum_nrc_blocks_hero_division" DEFAULT 'corporate' NOT NULL,
  	"fade_duration" numeric DEFAULT 700,
  	"autoplay_delay" numeric DEFAULT 5000,
  	"show_indicator" boolean DEFAULT true,
  	"block_name" varchar
  );

  CREATE TABLE "nrc_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"mega_scale" boolean DEFAULT false,
  	"block_name" varchar
  );

  CREATE TABLE "nrc_blocks_two_col" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"ratio" "enum_nrc_blocks_two_col_ratio" DEFAULT '1-3',
  	"alignment" "enum_nrc_blocks_two_col_alignment" DEFAULT 'top',
  	"block_name" varchar
  );

  CREATE TABLE "nrc_blocks_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"description" jsonb
  );

  CREATE TABLE "nrc_blocks_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "nrc_blocks_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_nrc_blocks_cta_buttons_variant" DEFAULT 'solid' NOT NULL
  );

  CREATE TABLE "nrc_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "nrc_blocks_quotes_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"attribution" varchar
  );

  CREATE TABLE "nrc_blocks_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum_nrc_blocks_quotes_layout" DEFAULT 'stacked' NOT NULL,
  	"block_name" varchar
  );

  CREATE TABLE "nrc_blocks_filmstrip_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"division" "enum_nrc_blocks_filmstrip_tiles_division" DEFAULT 'none'
  );

  CREATE TABLE "nrc_blocks_filmstrip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_nrc_blocks_filmstrip_source" DEFAULT 'custom-media' NOT NULL,
  	"project_filter" "enum_nrc_blocks_filmstrip_project_filter" DEFAULT 'all',
  	"show_perforations" boolean DEFAULT true,
  	"block_name" varchar
  );

  CREATE TABLE "nrc_blocks_division_showcase_divisions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"color_token" "enum_nrc_blocks_division_showcase_divisions_color_token" DEFAULT '212-amber' NOT NULL,
  	"subtitle" varchar,
  	"description" varchar,
  	"media_id" integer
  );

  CREATE TABLE "nrc_blocks_division_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_nrc_blocks_division_showcase_variant" DEFAULT 'v0-baseline' NOT NULL,
  	"heading" varchar,
  	"subtext" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "nrc_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"color_token" "enum_nrc_blocks_stats_stats_color_token" DEFAULT 'none'
  );

  CREATE TABLE "nrc_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"columns" "enum_nrc_blocks_stats_columns" DEFAULT '4' NOT NULL,
  	"block_name" varchar
  );

  CREATE TABLE "nrc_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"spacing" "enum_nrc_blocks_divider_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );

  ALTER TABLE "212_blocks_hero" ADD CONSTRAINT "212_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "212_blocks_hero" ADD CONSTRAINT "212_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_rich_text" ADD CONSTRAINT "212_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_two_col" ADD CONSTRAINT "212_blocks_two_col_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_grid_items" ADD CONSTRAINT "212_blocks_grid_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "212_blocks_grid_items" ADD CONSTRAINT "212_blocks_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_grid" ADD CONSTRAINT "212_blocks_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_cta_buttons" ADD CONSTRAINT "212_blocks_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_cta" ADD CONSTRAINT "212_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_quotes_quotes" ADD CONSTRAINT "212_blocks_quotes_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_quotes" ADD CONSTRAINT "212_blocks_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_filmstrip_tiles" ADD CONSTRAINT "212_blocks_filmstrip_tiles_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "212_blocks_filmstrip_tiles" ADD CONSTRAINT "212_blocks_filmstrip_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_filmstrip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_filmstrip" ADD CONSTRAINT "212_blocks_filmstrip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_division_showcase_divisions" ADD CONSTRAINT "212_blocks_division_showcase_divisions_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "212_blocks_division_showcase_divisions" ADD CONSTRAINT "212_blocks_division_showcase_divisions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_division_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_division_showcase" ADD CONSTRAINT "212_blocks_division_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_stats_stats" ADD CONSTRAINT "212_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_stats" ADD CONSTRAINT "212_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_divider" ADD CONSTRAINT "212_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_hero" ADD CONSTRAINT "310_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "310_blocks_hero" ADD CONSTRAINT "310_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_rich_text" ADD CONSTRAINT "310_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_two_col" ADD CONSTRAINT "310_blocks_two_col_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_grid_items" ADD CONSTRAINT "310_blocks_grid_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "310_blocks_grid_items" ADD CONSTRAINT "310_blocks_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_grid" ADD CONSTRAINT "310_blocks_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_cta_buttons" ADD CONSTRAINT "310_blocks_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_cta" ADD CONSTRAINT "310_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_quotes_quotes" ADD CONSTRAINT "310_blocks_quotes_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_quotes" ADD CONSTRAINT "310_blocks_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_filmstrip_tiles" ADD CONSTRAINT "310_blocks_filmstrip_tiles_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "310_blocks_filmstrip_tiles" ADD CONSTRAINT "310_blocks_filmstrip_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_filmstrip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_filmstrip" ADD CONSTRAINT "310_blocks_filmstrip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_division_showcase_divisions" ADD CONSTRAINT "310_blocks_division_showcase_divisions_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "310_blocks_division_showcase_divisions" ADD CONSTRAINT "310_blocks_division_showcase_divisions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_division_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_division_showcase" ADD CONSTRAINT "310_blocks_division_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_stats_stats" ADD CONSTRAINT "310_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_stats" ADD CONSTRAINT "310_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_divider" ADD CONSTRAINT "310_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_hero" ADD CONSTRAINT "nrc_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "nrc_blocks_hero" ADD CONSTRAINT "nrc_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_rich_text" ADD CONSTRAINT "nrc_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_two_col" ADD CONSTRAINT "nrc_blocks_two_col_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_grid_items" ADD CONSTRAINT "nrc_blocks_grid_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "nrc_blocks_grid_items" ADD CONSTRAINT "nrc_blocks_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_grid" ADD CONSTRAINT "nrc_blocks_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_cta_buttons" ADD CONSTRAINT "nrc_blocks_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_cta" ADD CONSTRAINT "nrc_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_quotes_quotes" ADD CONSTRAINT "nrc_blocks_quotes_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_quotes" ADD CONSTRAINT "nrc_blocks_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_filmstrip_tiles" ADD CONSTRAINT "nrc_blocks_filmstrip_tiles_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "nrc_blocks_filmstrip_tiles" ADD CONSTRAINT "nrc_blocks_filmstrip_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_filmstrip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_filmstrip" ADD CONSTRAINT "nrc_blocks_filmstrip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_division_showcase_divisions" ADD CONSTRAINT "nrc_blocks_division_showcase_divisions_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "nrc_blocks_division_showcase_divisions" ADD CONSTRAINT "nrc_blocks_division_showcase_divisions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_division_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_division_showcase" ADD CONSTRAINT "nrc_blocks_division_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_stats_stats" ADD CONSTRAINT "nrc_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_stats" ADD CONSTRAINT "nrc_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_divider" ADD CONSTRAINT "nrc_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "212_blocks_hero_order_idx" ON "212_blocks_hero" USING btree ("_order");
  CREATE INDEX "212_blocks_hero_parent_id_idx" ON "212_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "212_blocks_hero_path_idx" ON "212_blocks_hero" USING btree ("_path");
  CREATE INDEX "212_blocks_hero_media_idx" ON "212_blocks_hero" USING btree ("media_id");
  CREATE INDEX "212_blocks_rich_text_order_idx" ON "212_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "212_blocks_rich_text_parent_id_idx" ON "212_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "212_blocks_rich_text_path_idx" ON "212_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "212_blocks_two_col_order_idx" ON "212_blocks_two_col" USING btree ("_order");
  CREATE INDEX "212_blocks_two_col_parent_id_idx" ON "212_blocks_two_col" USING btree ("_parent_id");
  CREATE INDEX "212_blocks_two_col_path_idx" ON "212_blocks_two_col" USING btree ("_path");
  CREATE INDEX "212_blocks_grid_items_order_idx" ON "212_blocks_grid_items" USING btree ("_order");
  CREATE INDEX "212_blocks_grid_items_parent_id_idx" ON "212_blocks_grid_items" USING btree ("_parent_id");
  CREATE INDEX "212_blocks_grid_items_media_idx" ON "212_blocks_grid_items" USING btree ("media_id");
  CREATE INDEX "212_blocks_grid_order_idx" ON "212_blocks_grid" USING btree ("_order");
  CREATE INDEX "212_blocks_grid_parent_id_idx" ON "212_blocks_grid" USING btree ("_parent_id");
  CREATE INDEX "212_blocks_grid_path_idx" ON "212_blocks_grid" USING btree ("_path");
  CREATE INDEX "212_blocks_cta_buttons_order_idx" ON "212_blocks_cta_buttons" USING btree ("_order");
  CREATE INDEX "212_blocks_cta_buttons_parent_id_idx" ON "212_blocks_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "212_blocks_cta_order_idx" ON "212_blocks_cta" USING btree ("_order");
  CREATE INDEX "212_blocks_cta_parent_id_idx" ON "212_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "212_blocks_cta_path_idx" ON "212_blocks_cta" USING btree ("_path");
  CREATE INDEX "212_blocks_quotes_quotes_order_idx" ON "212_blocks_quotes_quotes" USING btree ("_order");
  CREATE INDEX "212_blocks_quotes_quotes_parent_id_idx" ON "212_blocks_quotes_quotes" USING btree ("_parent_id");
  CREATE INDEX "212_blocks_quotes_order_idx" ON "212_blocks_quotes" USING btree ("_order");
  CREATE INDEX "212_blocks_quotes_parent_id_idx" ON "212_blocks_quotes" USING btree ("_parent_id");
  CREATE INDEX "212_blocks_quotes_path_idx" ON "212_blocks_quotes" USING btree ("_path");
  CREATE INDEX "212_blocks_filmstrip_tiles_order_idx" ON "212_blocks_filmstrip_tiles" USING btree ("_order");
  CREATE INDEX "212_blocks_filmstrip_tiles_parent_id_idx" ON "212_blocks_filmstrip_tiles" USING btree ("_parent_id");
  CREATE INDEX "212_blocks_filmstrip_tiles_media_idx" ON "212_blocks_filmstrip_tiles" USING btree ("media_id");
  CREATE INDEX "212_blocks_filmstrip_order_idx" ON "212_blocks_filmstrip" USING btree ("_order");
  CREATE INDEX "212_blocks_filmstrip_parent_id_idx" ON "212_blocks_filmstrip" USING btree ("_parent_id");
  CREATE INDEX "212_blocks_filmstrip_path_idx" ON "212_blocks_filmstrip" USING btree ("_path");
  CREATE INDEX "212_blocks_division_showcase_divisions_order_idx" ON "212_blocks_division_showcase_divisions" USING btree ("_order");
  CREATE INDEX "212_blocks_division_showcase_divisions_parent_id_idx" ON "212_blocks_division_showcase_divisions" USING btree ("_parent_id");
  CREATE INDEX "212_blocks_division_showcase_divisions_media_idx" ON "212_blocks_division_showcase_divisions" USING btree ("media_id");
  CREATE INDEX "212_blocks_division_showcase_order_idx" ON "212_blocks_division_showcase" USING btree ("_order");
  CREATE INDEX "212_blocks_division_showcase_parent_id_idx" ON "212_blocks_division_showcase" USING btree ("_parent_id");
  CREATE INDEX "212_blocks_division_showcase_path_idx" ON "212_blocks_division_showcase" USING btree ("_path");
  CREATE INDEX "212_blocks_stats_stats_order_idx" ON "212_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "212_blocks_stats_stats_parent_id_idx" ON "212_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "212_blocks_stats_order_idx" ON "212_blocks_stats" USING btree ("_order");
  CREATE INDEX "212_blocks_stats_parent_id_idx" ON "212_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "212_blocks_stats_path_idx" ON "212_blocks_stats" USING btree ("_path");
  CREATE INDEX "212_blocks_divider_order_idx" ON "212_blocks_divider" USING btree ("_order");
  CREATE INDEX "212_blocks_divider_parent_id_idx" ON "212_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "212_blocks_divider_path_idx" ON "212_blocks_divider" USING btree ("_path");
  CREATE INDEX "310_blocks_hero_order_idx" ON "310_blocks_hero" USING btree ("_order");
  CREATE INDEX "310_blocks_hero_parent_id_idx" ON "310_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "310_blocks_hero_path_idx" ON "310_blocks_hero" USING btree ("_path");
  CREATE INDEX "310_blocks_hero_media_idx" ON "310_blocks_hero" USING btree ("media_id");
  CREATE INDEX "310_blocks_rich_text_order_idx" ON "310_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "310_blocks_rich_text_parent_id_idx" ON "310_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "310_blocks_rich_text_path_idx" ON "310_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "310_blocks_two_col_order_idx" ON "310_blocks_two_col" USING btree ("_order");
  CREATE INDEX "310_blocks_two_col_parent_id_idx" ON "310_blocks_two_col" USING btree ("_parent_id");
  CREATE INDEX "310_blocks_two_col_path_idx" ON "310_blocks_two_col" USING btree ("_path");
  CREATE INDEX "310_blocks_grid_items_order_idx" ON "310_blocks_grid_items" USING btree ("_order");
  CREATE INDEX "310_blocks_grid_items_parent_id_idx" ON "310_blocks_grid_items" USING btree ("_parent_id");
  CREATE INDEX "310_blocks_grid_items_media_idx" ON "310_blocks_grid_items" USING btree ("media_id");
  CREATE INDEX "310_blocks_grid_order_idx" ON "310_blocks_grid" USING btree ("_order");
  CREATE INDEX "310_blocks_grid_parent_id_idx" ON "310_blocks_grid" USING btree ("_parent_id");
  CREATE INDEX "310_blocks_grid_path_idx" ON "310_blocks_grid" USING btree ("_path");
  CREATE INDEX "310_blocks_cta_buttons_order_idx" ON "310_blocks_cta_buttons" USING btree ("_order");
  CREATE INDEX "310_blocks_cta_buttons_parent_id_idx" ON "310_blocks_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "310_blocks_cta_order_idx" ON "310_blocks_cta" USING btree ("_order");
  CREATE INDEX "310_blocks_cta_parent_id_idx" ON "310_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "310_blocks_cta_path_idx" ON "310_blocks_cta" USING btree ("_path");
  CREATE INDEX "310_blocks_quotes_quotes_order_idx" ON "310_blocks_quotes_quotes" USING btree ("_order");
  CREATE INDEX "310_blocks_quotes_quotes_parent_id_idx" ON "310_blocks_quotes_quotes" USING btree ("_parent_id");
  CREATE INDEX "310_blocks_quotes_order_idx" ON "310_blocks_quotes" USING btree ("_order");
  CREATE INDEX "310_blocks_quotes_parent_id_idx" ON "310_blocks_quotes" USING btree ("_parent_id");
  CREATE INDEX "310_blocks_quotes_path_idx" ON "310_blocks_quotes" USING btree ("_path");
  CREATE INDEX "310_blocks_filmstrip_tiles_order_idx" ON "310_blocks_filmstrip_tiles" USING btree ("_order");
  CREATE INDEX "310_blocks_filmstrip_tiles_parent_id_idx" ON "310_blocks_filmstrip_tiles" USING btree ("_parent_id");
  CREATE INDEX "310_blocks_filmstrip_tiles_media_idx" ON "310_blocks_filmstrip_tiles" USING btree ("media_id");
  CREATE INDEX "310_blocks_filmstrip_order_idx" ON "310_blocks_filmstrip" USING btree ("_order");
  CREATE INDEX "310_blocks_filmstrip_parent_id_idx" ON "310_blocks_filmstrip" USING btree ("_parent_id");
  CREATE INDEX "310_blocks_filmstrip_path_idx" ON "310_blocks_filmstrip" USING btree ("_path");
  CREATE INDEX "310_blocks_division_showcase_divisions_order_idx" ON "310_blocks_division_showcase_divisions" USING btree ("_order");
  CREATE INDEX "310_blocks_division_showcase_divisions_parent_id_idx" ON "310_blocks_division_showcase_divisions" USING btree ("_parent_id");
  CREATE INDEX "310_blocks_division_showcase_divisions_media_idx" ON "310_blocks_division_showcase_divisions" USING btree ("media_id");
  CREATE INDEX "310_blocks_division_showcase_order_idx" ON "310_blocks_division_showcase" USING btree ("_order");
  CREATE INDEX "310_blocks_division_showcase_parent_id_idx" ON "310_blocks_division_showcase" USING btree ("_parent_id");
  CREATE INDEX "310_blocks_division_showcase_path_idx" ON "310_blocks_division_showcase" USING btree ("_path");
  CREATE INDEX "310_blocks_stats_stats_order_idx" ON "310_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "310_blocks_stats_stats_parent_id_idx" ON "310_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "310_blocks_stats_order_idx" ON "310_blocks_stats" USING btree ("_order");
  CREATE INDEX "310_blocks_stats_parent_id_idx" ON "310_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "310_blocks_stats_path_idx" ON "310_blocks_stats" USING btree ("_path");
  CREATE INDEX "310_blocks_divider_order_idx" ON "310_blocks_divider" USING btree ("_order");
  CREATE INDEX "310_blocks_divider_parent_id_idx" ON "310_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "310_blocks_divider_path_idx" ON "310_blocks_divider" USING btree ("_path");
  CREATE INDEX "nrc_blocks_hero_order_idx" ON "nrc_blocks_hero" USING btree ("_order");
  CREATE INDEX "nrc_blocks_hero_parent_id_idx" ON "nrc_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "nrc_blocks_hero_path_idx" ON "nrc_blocks_hero" USING btree ("_path");
  CREATE INDEX "nrc_blocks_hero_media_idx" ON "nrc_blocks_hero" USING btree ("media_id");
  CREATE INDEX "nrc_blocks_rich_text_order_idx" ON "nrc_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "nrc_blocks_rich_text_parent_id_idx" ON "nrc_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "nrc_blocks_rich_text_path_idx" ON "nrc_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "nrc_blocks_two_col_order_idx" ON "nrc_blocks_two_col" USING btree ("_order");
  CREATE INDEX "nrc_blocks_two_col_parent_id_idx" ON "nrc_blocks_two_col" USING btree ("_parent_id");
  CREATE INDEX "nrc_blocks_two_col_path_idx" ON "nrc_blocks_two_col" USING btree ("_path");
  CREATE INDEX "nrc_blocks_grid_items_order_idx" ON "nrc_blocks_grid_items" USING btree ("_order");
  CREATE INDEX "nrc_blocks_grid_items_parent_id_idx" ON "nrc_blocks_grid_items" USING btree ("_parent_id");
  CREATE INDEX "nrc_blocks_grid_items_media_idx" ON "nrc_blocks_grid_items" USING btree ("media_id");
  CREATE INDEX "nrc_blocks_grid_order_idx" ON "nrc_blocks_grid" USING btree ("_order");
  CREATE INDEX "nrc_blocks_grid_parent_id_idx" ON "nrc_blocks_grid" USING btree ("_parent_id");
  CREATE INDEX "nrc_blocks_grid_path_idx" ON "nrc_blocks_grid" USING btree ("_path");
  CREATE INDEX "nrc_blocks_cta_buttons_order_idx" ON "nrc_blocks_cta_buttons" USING btree ("_order");
  CREATE INDEX "nrc_blocks_cta_buttons_parent_id_idx" ON "nrc_blocks_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "nrc_blocks_cta_order_idx" ON "nrc_blocks_cta" USING btree ("_order");
  CREATE INDEX "nrc_blocks_cta_parent_id_idx" ON "nrc_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "nrc_blocks_cta_path_idx" ON "nrc_blocks_cta" USING btree ("_path");
  CREATE INDEX "nrc_blocks_quotes_quotes_order_idx" ON "nrc_blocks_quotes_quotes" USING btree ("_order");
  CREATE INDEX "nrc_blocks_quotes_quotes_parent_id_idx" ON "nrc_blocks_quotes_quotes" USING btree ("_parent_id");
  CREATE INDEX "nrc_blocks_quotes_order_idx" ON "nrc_blocks_quotes" USING btree ("_order");
  CREATE INDEX "nrc_blocks_quotes_parent_id_idx" ON "nrc_blocks_quotes" USING btree ("_parent_id");
  CREATE INDEX "nrc_blocks_quotes_path_idx" ON "nrc_blocks_quotes" USING btree ("_path");
  CREATE INDEX "nrc_blocks_filmstrip_tiles_order_idx" ON "nrc_blocks_filmstrip_tiles" USING btree ("_order");
  CREATE INDEX "nrc_blocks_filmstrip_tiles_parent_id_idx" ON "nrc_blocks_filmstrip_tiles" USING btree ("_parent_id");
  CREATE INDEX "nrc_blocks_filmstrip_tiles_media_idx" ON "nrc_blocks_filmstrip_tiles" USING btree ("media_id");
  CREATE INDEX "nrc_blocks_filmstrip_order_idx" ON "nrc_blocks_filmstrip" USING btree ("_order");
  CREATE INDEX "nrc_blocks_filmstrip_parent_id_idx" ON "nrc_blocks_filmstrip" USING btree ("_parent_id");
  CREATE INDEX "nrc_blocks_filmstrip_path_idx" ON "nrc_blocks_filmstrip" USING btree ("_path");
  CREATE INDEX "nrc_blocks_division_showcase_divisions_order_idx" ON "nrc_blocks_division_showcase_divisions" USING btree ("_order");
  CREATE INDEX "nrc_blocks_division_showcase_divisions_parent_id_idx" ON "nrc_blocks_division_showcase_divisions" USING btree ("_parent_id");
  CREATE INDEX "nrc_blocks_division_showcase_divisions_media_idx" ON "nrc_blocks_division_showcase_divisions" USING btree ("media_id");
  CREATE INDEX "nrc_blocks_division_showcase_order_idx" ON "nrc_blocks_division_showcase" USING btree ("_order");
  CREATE INDEX "nrc_blocks_division_showcase_parent_id_idx" ON "nrc_blocks_division_showcase" USING btree ("_parent_id");
  CREATE INDEX "nrc_blocks_division_showcase_path_idx" ON "nrc_blocks_division_showcase" USING btree ("_path");
  CREATE INDEX "nrc_blocks_stats_stats_order_idx" ON "nrc_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "nrc_blocks_stats_stats_parent_id_idx" ON "nrc_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "nrc_blocks_stats_order_idx" ON "nrc_blocks_stats" USING btree ("_order");
  CREATE INDEX "nrc_blocks_stats_parent_id_idx" ON "nrc_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "nrc_blocks_stats_path_idx" ON "nrc_blocks_stats" USING btree ("_path");
  CREATE INDEX "nrc_blocks_divider_order_idx" ON "nrc_blocks_divider" USING btree ("_order");
  CREATE INDEX "nrc_blocks_divider_parent_id_idx" ON "nrc_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "nrc_blocks_divider_path_idx" ON "nrc_blocks_divider" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "212_blocks_hero" CASCADE;
  DROP TABLE "212_blocks_rich_text" CASCADE;
  DROP TABLE "212_blocks_two_col" CASCADE;
  DROP TABLE "212_blocks_grid_items" CASCADE;
  DROP TABLE "212_blocks_grid" CASCADE;
  DROP TABLE "212_blocks_cta_buttons" CASCADE;
  DROP TABLE "212_blocks_cta" CASCADE;
  DROP TABLE "212_blocks_quotes_quotes" CASCADE;
  DROP TABLE "212_blocks_quotes" CASCADE;
  DROP TABLE "212_blocks_filmstrip_tiles" CASCADE;
  DROP TABLE "212_blocks_filmstrip" CASCADE;
  DROP TABLE "212_blocks_division_showcase_divisions" CASCADE;
  DROP TABLE "212_blocks_division_showcase" CASCADE;
  DROP TABLE "212_blocks_stats_stats" CASCADE;
  DROP TABLE "212_blocks_stats" CASCADE;
  DROP TABLE "212_blocks_divider" CASCADE;
  DROP TABLE "212" CASCADE;
  DROP TABLE "310_blocks_hero" CASCADE;
  DROP TABLE "310_blocks_rich_text" CASCADE;
  DROP TABLE "310_blocks_two_col" CASCADE;
  DROP TABLE "310_blocks_grid_items" CASCADE;
  DROP TABLE "310_blocks_grid" CASCADE;
  DROP TABLE "310_blocks_cta_buttons" CASCADE;
  DROP TABLE "310_blocks_cta" CASCADE;
  DROP TABLE "310_blocks_quotes_quotes" CASCADE;
  DROP TABLE "310_blocks_quotes" CASCADE;
  DROP TABLE "310_blocks_filmstrip_tiles" CASCADE;
  DROP TABLE "310_blocks_filmstrip" CASCADE;
  DROP TABLE "310_blocks_division_showcase_divisions" CASCADE;
  DROP TABLE "310_blocks_division_showcase" CASCADE;
  DROP TABLE "310_blocks_stats_stats" CASCADE;
  DROP TABLE "310_blocks_stats" CASCADE;
  DROP TABLE "310_blocks_divider" CASCADE;
  DROP TABLE "310" CASCADE;
  DROP TABLE "nrc_blocks_hero" CASCADE;
  DROP TABLE "nrc_blocks_rich_text" CASCADE;
  DROP TABLE "nrc_blocks_two_col" CASCADE;
  DROP TABLE "nrc_blocks_grid_items" CASCADE;
  DROP TABLE "nrc_blocks_grid" CASCADE;
  DROP TABLE "nrc_blocks_cta_buttons" CASCADE;
  DROP TABLE "nrc_blocks_cta" CASCADE;
  DROP TABLE "nrc_blocks_quotes_quotes" CASCADE;
  DROP TABLE "nrc_blocks_quotes" CASCADE;
  DROP TABLE "nrc_blocks_filmstrip_tiles" CASCADE;
  DROP TABLE "nrc_blocks_filmstrip" CASCADE;
  DROP TABLE "nrc_blocks_division_showcase_divisions" CASCADE;
  DROP TABLE "nrc_blocks_division_showcase" CASCADE;
  DROP TABLE "nrc_blocks_stats_stats" CASCADE;
  DROP TABLE "nrc_blocks_stats" CASCADE;
  DROP TABLE "nrc_blocks_divider" CASCADE;
  DROP TABLE "nrc" CASCADE;
  DROP TYPE "public"."enum_212_blocks_hero_variant";
  DROP TYPE "public"."enum_212_blocks_hero_division";
  DROP TYPE "public"."enum_212_blocks_two_col_ratio";
  DROP TYPE "public"."enum_212_blocks_two_col_alignment";
  DROP TYPE "public"."enum_212_blocks_cta_buttons_variant";
  DROP TYPE "public"."enum_212_blocks_quotes_layout";
  DROP TYPE "public"."enum_212_blocks_filmstrip_tiles_division";
  DROP TYPE "public"."enum_212_blocks_filmstrip_source";
  DROP TYPE "public"."enum_212_blocks_filmstrip_project_filter";
  DROP TYPE "public"."enum_212_blocks_division_showcase_divisions_color_token";
  DROP TYPE "public"."enum_212_blocks_division_showcase_variant";
  DROP TYPE "public"."enum_212_blocks_stats_stats_color_token";
  DROP TYPE "public"."enum_212_blocks_stats_columns";
  DROP TYPE "public"."enum_212_blocks_divider_spacing";
  DROP TYPE "public"."enum_310_blocks_hero_variant";
  DROP TYPE "public"."enum_310_blocks_hero_division";
  DROP TYPE "public"."enum_310_blocks_two_col_ratio";
  DROP TYPE "public"."enum_310_blocks_two_col_alignment";
  DROP TYPE "public"."enum_310_blocks_cta_buttons_variant";
  DROP TYPE "public"."enum_310_blocks_quotes_layout";
  DROP TYPE "public"."enum_310_blocks_filmstrip_tiles_division";
  DROP TYPE "public"."enum_310_blocks_filmstrip_source";
  DROP TYPE "public"."enum_310_blocks_filmstrip_project_filter";
  DROP TYPE "public"."enum_310_blocks_division_showcase_divisions_color_token";
  DROP TYPE "public"."enum_310_blocks_division_showcase_variant";
  DROP TYPE "public"."enum_310_blocks_stats_stats_color_token";
  DROP TYPE "public"."enum_310_blocks_stats_columns";
  DROP TYPE "public"."enum_310_blocks_divider_spacing";
  DROP TYPE "public"."enum_nrc_blocks_hero_variant";
  DROP TYPE "public"."enum_nrc_blocks_hero_division";
  DROP TYPE "public"."enum_nrc_blocks_two_col_ratio";
  DROP TYPE "public"."enum_nrc_blocks_two_col_alignment";
  DROP TYPE "public"."enum_nrc_blocks_cta_buttons_variant";
  DROP TYPE "public"."enum_nrc_blocks_quotes_layout";
  DROP TYPE "public"."enum_nrc_blocks_filmstrip_tiles_division";
  DROP TYPE "public"."enum_nrc_blocks_filmstrip_source";
  DROP TYPE "public"."enum_nrc_blocks_filmstrip_project_filter";
  DROP TYPE "public"."enum_nrc_blocks_division_showcase_divisions_color_token";
  DROP TYPE "public"."enum_nrc_blocks_division_showcase_variant";
  DROP TYPE "public"."enum_nrc_blocks_stats_stats_color_token";
  DROP TYPE "public"."enum_nrc_blocks_stats_columns";
  DROP TYPE "public"."enum_nrc_blocks_divider_spacing";`)
}
