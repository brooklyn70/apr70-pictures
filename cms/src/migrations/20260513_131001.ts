import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_about_blocks_hero_variant" AS ENUM('default', 'split', 'fullscreen', 'slider-auto', 'slider-curated');
  CREATE TYPE "public"."enum_about_blocks_hero_division" AS ENUM('pictures-212', 'pictures-310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_about_blocks_two_col_ratio" AS ENUM('1-3', '1-1', '1-2');
  CREATE TYPE "public"."enum_about_blocks_two_col_alignment" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_about_blocks_cta_buttons_variant" AS ENUM('solid', 'ghost', 'link');
  CREATE TYPE "public"."enum_about_blocks_quotes_layout" AS ENUM('stacked', 'carousel');
  CREATE TYPE "public"."enum_about_blocks_filmstrip_tiles_division" AS ENUM('none', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_about_blocks_filmstrip_source" AS ENUM('custom-media', 'from-projects');
  CREATE TYPE "public"."enum_about_blocks_filmstrip_project_filter" AS ENUM('all', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_about_blocks_division_showcase_divisions_color_token" AS ENUM('212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_about_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  CREATE TYPE "public"."enum_about_blocks_stats_stats_color_token" AS ENUM('none', '212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_about_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_about_blocks_divider_spacing" AS ENUM('compact', 'normal', 'wide');
  CREATE TYPE "public"."enum_contact_blocks_hero_variant" AS ENUM('default', 'split', 'fullscreen', 'slider-auto', 'slider-curated');
  CREATE TYPE "public"."enum_contact_blocks_hero_division" AS ENUM('pictures-212', 'pictures-310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_contact_blocks_two_col_ratio" AS ENUM('1-3', '1-1', '1-2');
  CREATE TYPE "public"."enum_contact_blocks_two_col_alignment" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_contact_blocks_cta_buttons_variant" AS ENUM('solid', 'ghost', 'link');
  CREATE TYPE "public"."enum_contact_blocks_quotes_layout" AS ENUM('stacked', 'carousel');
  CREATE TYPE "public"."enum_contact_blocks_filmstrip_tiles_division" AS ENUM('none', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_contact_blocks_filmstrip_source" AS ENUM('custom-media', 'from-projects');
  CREATE TYPE "public"."enum_contact_blocks_filmstrip_project_filter" AS ENUM('all', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_contact_blocks_division_showcase_divisions_color_token" AS ENUM('212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_contact_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  CREATE TYPE "public"."enum_contact_blocks_stats_stats_color_token" AS ENUM('none', '212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_contact_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_contact_blocks_divider_spacing" AS ENUM('compact', 'normal', 'wide');
  CREATE TYPE "public"."enum_jobs_blocks_hero_variant" AS ENUM('default', 'split', 'fullscreen', 'slider-auto', 'slider-curated');
  CREATE TYPE "public"."enum_jobs_blocks_hero_division" AS ENUM('pictures-212', 'pictures-310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_jobs_blocks_two_col_ratio" AS ENUM('1-3', '1-1', '1-2');
  CREATE TYPE "public"."enum_jobs_blocks_two_col_alignment" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_jobs_blocks_cta_buttons_variant" AS ENUM('solid', 'ghost', 'link');
  CREATE TYPE "public"."enum_jobs_blocks_quotes_layout" AS ENUM('stacked', 'carousel');
  CREATE TYPE "public"."enum_jobs_blocks_filmstrip_tiles_division" AS ENUM('none', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_jobs_blocks_filmstrip_source" AS ENUM('custom-media', 'from-projects');
  CREATE TYPE "public"."enum_jobs_blocks_filmstrip_project_filter" AS ENUM('all', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_jobs_blocks_division_showcase_divisions_color_token" AS ENUM('212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_jobs_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  CREATE TYPE "public"."enum_jobs_blocks_stats_stats_color_token" AS ENUM('none', '212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_jobs_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_jobs_blocks_divider_spacing" AS ENUM('compact', 'normal', 'wide');
  CREATE TYPE "public"."enum_pitch_blocks_hero_variant" AS ENUM('default', 'split', 'fullscreen', 'slider-auto', 'slider-curated');
  CREATE TYPE "public"."enum_pitch_blocks_hero_division" AS ENUM('pictures-212', 'pictures-310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_pitch_blocks_two_col_ratio" AS ENUM('1-3', '1-1', '1-2');
  CREATE TYPE "public"."enum_pitch_blocks_two_col_alignment" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_pitch_blocks_cta_buttons_variant" AS ENUM('solid', 'ghost', 'link');
  CREATE TYPE "public"."enum_pitch_blocks_quotes_layout" AS ENUM('stacked', 'carousel');
  CREATE TYPE "public"."enum_pitch_blocks_filmstrip_tiles_division" AS ENUM('none', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_pitch_blocks_filmstrip_source" AS ENUM('custom-media', 'from-projects');
  CREATE TYPE "public"."enum_pitch_blocks_filmstrip_project_filter" AS ENUM('all', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_pitch_blocks_division_showcase_divisions_color_token" AS ENUM('212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_pitch_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  CREATE TYPE "public"."enum_pitch_blocks_stats_stats_color_token" AS ENUM('none', '212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_pitch_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pitch_blocks_divider_spacing" AS ENUM('compact', 'normal', 'wide');
  CREATE TYPE "public"."enum_investors_blocks_hero_variant" AS ENUM('default', 'split', 'fullscreen', 'slider-auto', 'slider-curated');
  CREATE TYPE "public"."enum_investors_blocks_hero_division" AS ENUM('pictures-212', 'pictures-310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_investors_blocks_two_col_ratio" AS ENUM('1-3', '1-1', '1-2');
  CREATE TYPE "public"."enum_investors_blocks_two_col_alignment" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_investors_blocks_cta_buttons_variant" AS ENUM('solid', 'ghost', 'link');
  CREATE TYPE "public"."enum_investors_blocks_quotes_layout" AS ENUM('stacked', 'carousel');
  CREATE TYPE "public"."enum_investors_blocks_filmstrip_tiles_division" AS ENUM('none', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_investors_blocks_filmstrip_source" AS ENUM('custom-media', 'from-projects');
  CREATE TYPE "public"."enum_investors_blocks_filmstrip_project_filter" AS ENUM('all', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_investors_blocks_division_showcase_divisions_color_token" AS ENUM('212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_investors_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  CREATE TYPE "public"."enum_investors_blocks_stats_stats_color_token" AS ENUM('none', '212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_investors_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_investors_blocks_divider_spacing" AS ENUM('compact', 'normal', 'wide');
  CREATE TABLE "about_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"media_id" integer,
  	"variant" "enum_about_blocks_hero_variant" DEFAULT 'default' NOT NULL,
  	"division" "enum_about_blocks_hero_division" DEFAULT 'corporate' NOT NULL,
  	"fade_duration" numeric DEFAULT 700,
  	"autoplay_delay" numeric DEFAULT 5000,
  	"show_indicator" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"mega_scale" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_blocks_two_col" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"ratio" "enum_about_blocks_two_col_ratio" DEFAULT '1-3',
  	"alignment" "enum_about_blocks_two_col_alignment" DEFAULT 'top',
  	"block_name" varchar
  );
  
  CREATE TABLE "about_blocks_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"description" jsonb
  );
  
  CREATE TABLE "about_blocks_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_blocks_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_about_blocks_cta_buttons_variant" DEFAULT 'solid' NOT NULL
  );
  
  CREATE TABLE "about_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_blocks_quotes_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"attribution" varchar
  );
  
  CREATE TABLE "about_blocks_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum_about_blocks_quotes_layout" DEFAULT 'stacked' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_blocks_filmstrip_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"division" "enum_about_blocks_filmstrip_tiles_division" DEFAULT 'none'
  );
  
  CREATE TABLE "about_blocks_filmstrip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_about_blocks_filmstrip_source" DEFAULT 'custom-media' NOT NULL,
  	"project_filter" "enum_about_blocks_filmstrip_project_filter" DEFAULT 'all',
  	"show_perforations" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_blocks_division_showcase_divisions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"color_token" "enum_about_blocks_division_showcase_divisions_color_token" DEFAULT '212-amber' NOT NULL,
  	"subtitle" varchar,
  	"description" varchar,
  	"media_id" integer
  );
  
  CREATE TABLE "about_blocks_division_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_about_blocks_division_showcase_variant" DEFAULT 'v0-baseline' NOT NULL,
  	"heading" varchar,
  	"subtext" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"color_token" "enum_about_blocks_stats_stats_color_token" DEFAULT 'none'
  );
  
  CREATE TABLE "about_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"columns" "enum_about_blocks_stats_columns" DEFAULT '4' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"spacing" "enum_about_blocks_divider_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"media_id" integer,
  	"variant" "enum_contact_blocks_hero_variant" DEFAULT 'default' NOT NULL,
  	"division" "enum_contact_blocks_hero_division" DEFAULT 'corporate' NOT NULL,
  	"fade_duration" numeric DEFAULT 700,
  	"autoplay_delay" numeric DEFAULT 5000,
  	"show_indicator" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "contact_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"mega_scale" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "contact_blocks_two_col" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"ratio" "enum_contact_blocks_two_col_ratio" DEFAULT '1-3',
  	"alignment" "enum_contact_blocks_two_col_alignment" DEFAULT 'top',
  	"block_name" varchar
  );
  
  CREATE TABLE "contact_blocks_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"description" jsonb
  );
  
  CREATE TABLE "contact_blocks_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "contact_blocks_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_contact_blocks_cta_buttons_variant" DEFAULT 'solid' NOT NULL
  );
  
  CREATE TABLE "contact_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "contact_blocks_quotes_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"attribution" varchar
  );
  
  CREATE TABLE "contact_blocks_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum_contact_blocks_quotes_layout" DEFAULT 'stacked' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "contact_blocks_filmstrip_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"division" "enum_contact_blocks_filmstrip_tiles_division" DEFAULT 'none'
  );
  
  CREATE TABLE "contact_blocks_filmstrip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_contact_blocks_filmstrip_source" DEFAULT 'custom-media' NOT NULL,
  	"project_filter" "enum_contact_blocks_filmstrip_project_filter" DEFAULT 'all',
  	"show_perforations" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "contact_blocks_division_showcase_divisions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"color_token" "enum_contact_blocks_division_showcase_divisions_color_token" DEFAULT '212-amber' NOT NULL,
  	"subtitle" varchar,
  	"description" varchar,
  	"media_id" integer
  );
  
  CREATE TABLE "contact_blocks_division_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_contact_blocks_division_showcase_variant" DEFAULT 'v0-baseline' NOT NULL,
  	"heading" varchar,
  	"subtext" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "contact_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"color_token" "enum_contact_blocks_stats_stats_color_token" DEFAULT 'none'
  );
  
  CREATE TABLE "contact_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"columns" "enum_contact_blocks_stats_columns" DEFAULT '4' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "contact_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"spacing" "enum_contact_blocks_divider_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "jobs_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"media_id" integer,
  	"variant" "enum_jobs_blocks_hero_variant" DEFAULT 'default' NOT NULL,
  	"division" "enum_jobs_blocks_hero_division" DEFAULT 'corporate' NOT NULL,
  	"fade_duration" numeric DEFAULT 700,
  	"autoplay_delay" numeric DEFAULT 5000,
  	"show_indicator" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"mega_scale" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_two_col" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"ratio" "enum_jobs_blocks_two_col_ratio" DEFAULT '1-3',
  	"alignment" "enum_jobs_blocks_two_col_alignment" DEFAULT 'top',
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"description" jsonb
  );
  
  CREATE TABLE "jobs_blocks_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_jobs_blocks_cta_buttons_variant" DEFAULT 'solid' NOT NULL
  );
  
  CREATE TABLE "jobs_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_quotes_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"attribution" varchar
  );
  
  CREATE TABLE "jobs_blocks_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum_jobs_blocks_quotes_layout" DEFAULT 'stacked' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_filmstrip_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"division" "enum_jobs_blocks_filmstrip_tiles_division" DEFAULT 'none'
  );
  
  CREATE TABLE "jobs_blocks_filmstrip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_jobs_blocks_filmstrip_source" DEFAULT 'custom-media' NOT NULL,
  	"project_filter" "enum_jobs_blocks_filmstrip_project_filter" DEFAULT 'all',
  	"show_perforations" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_division_showcase_divisions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"color_token" "enum_jobs_blocks_division_showcase_divisions_color_token" DEFAULT '212-amber' NOT NULL,
  	"subtitle" varchar,
  	"description" varchar,
  	"media_id" integer
  );
  
  CREATE TABLE "jobs_blocks_division_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_jobs_blocks_division_showcase_variant" DEFAULT 'v0-baseline' NOT NULL,
  	"heading" varchar,
  	"subtext" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"color_token" "enum_jobs_blocks_stats_stats_color_token" DEFAULT 'none'
  );
  
  CREATE TABLE "jobs_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"columns" "enum_jobs_blocks_stats_columns" DEFAULT '4' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"spacing" "enum_jobs_blocks_divider_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "pitch_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"media_id" integer,
  	"variant" "enum_pitch_blocks_hero_variant" DEFAULT 'default' NOT NULL,
  	"division" "enum_pitch_blocks_hero_division" DEFAULT 'corporate' NOT NULL,
  	"fade_duration" numeric DEFAULT 700,
  	"autoplay_delay" numeric DEFAULT 5000,
  	"show_indicator" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pitch_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"mega_scale" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pitch_blocks_two_col" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"ratio" "enum_pitch_blocks_two_col_ratio" DEFAULT '1-3',
  	"alignment" "enum_pitch_blocks_two_col_alignment" DEFAULT 'top',
  	"block_name" varchar
  );
  
  CREATE TABLE "pitch_blocks_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"description" jsonb
  );
  
  CREATE TABLE "pitch_blocks_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pitch_blocks_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_pitch_blocks_cta_buttons_variant" DEFAULT 'solid' NOT NULL
  );
  
  CREATE TABLE "pitch_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pitch_blocks_quotes_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"attribution" varchar
  );
  
  CREATE TABLE "pitch_blocks_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum_pitch_blocks_quotes_layout" DEFAULT 'stacked' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pitch_blocks_filmstrip_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"division" "enum_pitch_blocks_filmstrip_tiles_division" DEFAULT 'none'
  );
  
  CREATE TABLE "pitch_blocks_filmstrip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_pitch_blocks_filmstrip_source" DEFAULT 'custom-media' NOT NULL,
  	"project_filter" "enum_pitch_blocks_filmstrip_project_filter" DEFAULT 'all',
  	"show_perforations" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pitch_blocks_division_showcase_divisions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"color_token" "enum_pitch_blocks_division_showcase_divisions_color_token" DEFAULT '212-amber' NOT NULL,
  	"subtitle" varchar,
  	"description" varchar,
  	"media_id" integer
  );
  
  CREATE TABLE "pitch_blocks_division_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pitch_blocks_division_showcase_variant" DEFAULT 'v0-baseline' NOT NULL,
  	"heading" varchar,
  	"subtext" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pitch_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"color_token" "enum_pitch_blocks_stats_stats_color_token" DEFAULT 'none'
  );
  
  CREATE TABLE "pitch_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"columns" "enum_pitch_blocks_stats_columns" DEFAULT '4' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pitch_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"spacing" "enum_pitch_blocks_divider_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pitch" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "investors_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"media_id" integer,
  	"variant" "enum_investors_blocks_hero_variant" DEFAULT 'default' NOT NULL,
  	"division" "enum_investors_blocks_hero_division" DEFAULT 'corporate' NOT NULL,
  	"fade_duration" numeric DEFAULT 700,
  	"autoplay_delay" numeric DEFAULT 5000,
  	"show_indicator" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "investors_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"mega_scale" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "investors_blocks_two_col" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"ratio" "enum_investors_blocks_two_col_ratio" DEFAULT '1-3',
  	"alignment" "enum_investors_blocks_two_col_alignment" DEFAULT 'top',
  	"block_name" varchar
  );
  
  CREATE TABLE "investors_blocks_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"description" jsonb
  );
  
  CREATE TABLE "investors_blocks_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "investors_blocks_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_investors_blocks_cta_buttons_variant" DEFAULT 'solid' NOT NULL
  );
  
  CREATE TABLE "investors_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "investors_blocks_quotes_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"attribution" varchar
  );
  
  CREATE TABLE "investors_blocks_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum_investors_blocks_quotes_layout" DEFAULT 'stacked' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "investors_blocks_filmstrip_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"division" "enum_investors_blocks_filmstrip_tiles_division" DEFAULT 'none'
  );
  
  CREATE TABLE "investors_blocks_filmstrip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_investors_blocks_filmstrip_source" DEFAULT 'custom-media' NOT NULL,
  	"project_filter" "enum_investors_blocks_filmstrip_project_filter" DEFAULT 'all',
  	"show_perforations" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "investors_blocks_division_showcase_divisions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"color_token" "enum_investors_blocks_division_showcase_divisions_color_token" DEFAULT '212-amber' NOT NULL,
  	"subtitle" varchar,
  	"description" varchar,
  	"media_id" integer
  );
  
  CREATE TABLE "investors_blocks_division_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_investors_blocks_division_showcase_variant" DEFAULT 'v0-baseline' NOT NULL,
  	"heading" varchar,
  	"subtext" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "investors_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"color_token" "enum_investors_blocks_stats_stats_color_token" DEFAULT 'none'
  );
  
  CREATE TABLE "investors_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"columns" "enum_investors_blocks_stats_columns" DEFAULT '4' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "investors_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"spacing" "enum_investors_blocks_divider_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "investors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "about_blocks_hero" ADD CONSTRAINT "about_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_blocks_hero" ADD CONSTRAINT "about_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_rich_text" ADD CONSTRAINT "about_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_two_col" ADD CONSTRAINT "about_blocks_two_col_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_grid_items" ADD CONSTRAINT "about_blocks_grid_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_blocks_grid_items" ADD CONSTRAINT "about_blocks_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_grid" ADD CONSTRAINT "about_blocks_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_cta_buttons" ADD CONSTRAINT "about_blocks_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_cta" ADD CONSTRAINT "about_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_quotes_quotes" ADD CONSTRAINT "about_blocks_quotes_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_quotes" ADD CONSTRAINT "about_blocks_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_filmstrip_tiles" ADD CONSTRAINT "about_blocks_filmstrip_tiles_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_blocks_filmstrip_tiles" ADD CONSTRAINT "about_blocks_filmstrip_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_filmstrip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_filmstrip" ADD CONSTRAINT "about_blocks_filmstrip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_division_showcase_divisions" ADD CONSTRAINT "about_blocks_division_showcase_divisions_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_blocks_division_showcase_divisions" ADD CONSTRAINT "about_blocks_division_showcase_divisions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_division_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_division_showcase" ADD CONSTRAINT "about_blocks_division_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_stats_stats" ADD CONSTRAINT "about_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_stats" ADD CONSTRAINT "about_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_divider" ADD CONSTRAINT "about_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_hero" ADD CONSTRAINT "contact_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_blocks_hero" ADD CONSTRAINT "contact_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_rich_text" ADD CONSTRAINT "contact_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_two_col" ADD CONSTRAINT "contact_blocks_two_col_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_grid_items" ADD CONSTRAINT "contact_blocks_grid_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_blocks_grid_items" ADD CONSTRAINT "contact_blocks_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_grid" ADD CONSTRAINT "contact_blocks_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_cta_buttons" ADD CONSTRAINT "contact_blocks_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_cta" ADD CONSTRAINT "contact_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_quotes_quotes" ADD CONSTRAINT "contact_blocks_quotes_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_quotes" ADD CONSTRAINT "contact_blocks_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_filmstrip_tiles" ADD CONSTRAINT "contact_blocks_filmstrip_tiles_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_blocks_filmstrip_tiles" ADD CONSTRAINT "contact_blocks_filmstrip_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_filmstrip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_filmstrip" ADD CONSTRAINT "contact_blocks_filmstrip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_division_showcase_divisions" ADD CONSTRAINT "contact_blocks_division_showcase_divisions_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_blocks_division_showcase_divisions" ADD CONSTRAINT "contact_blocks_division_showcase_divisions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_division_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_division_showcase" ADD CONSTRAINT "contact_blocks_division_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_stats_stats" ADD CONSTRAINT "contact_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_stats" ADD CONSTRAINT "contact_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_divider" ADD CONSTRAINT "contact_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_hero" ADD CONSTRAINT "jobs_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs_blocks_hero" ADD CONSTRAINT "jobs_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_rich_text" ADD CONSTRAINT "jobs_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_two_col" ADD CONSTRAINT "jobs_blocks_two_col_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_grid_items" ADD CONSTRAINT "jobs_blocks_grid_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs_blocks_grid_items" ADD CONSTRAINT "jobs_blocks_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_grid" ADD CONSTRAINT "jobs_blocks_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_cta_buttons" ADD CONSTRAINT "jobs_blocks_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_cta" ADD CONSTRAINT "jobs_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_quotes_quotes" ADD CONSTRAINT "jobs_blocks_quotes_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_quotes" ADD CONSTRAINT "jobs_blocks_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_filmstrip_tiles" ADD CONSTRAINT "jobs_blocks_filmstrip_tiles_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs_blocks_filmstrip_tiles" ADD CONSTRAINT "jobs_blocks_filmstrip_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_filmstrip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_filmstrip" ADD CONSTRAINT "jobs_blocks_filmstrip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_division_showcase_divisions" ADD CONSTRAINT "jobs_blocks_division_showcase_divisions_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs_blocks_division_showcase_divisions" ADD CONSTRAINT "jobs_blocks_division_showcase_divisions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_division_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_division_showcase" ADD CONSTRAINT "jobs_blocks_division_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_stats_stats" ADD CONSTRAINT "jobs_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_stats" ADD CONSTRAINT "jobs_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_divider" ADD CONSTRAINT "jobs_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_hero" ADD CONSTRAINT "pitch_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pitch_blocks_hero" ADD CONSTRAINT "pitch_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_rich_text" ADD CONSTRAINT "pitch_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_two_col" ADD CONSTRAINT "pitch_blocks_two_col_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_grid_items" ADD CONSTRAINT "pitch_blocks_grid_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pitch_blocks_grid_items" ADD CONSTRAINT "pitch_blocks_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_grid" ADD CONSTRAINT "pitch_blocks_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_cta_buttons" ADD CONSTRAINT "pitch_blocks_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_cta" ADD CONSTRAINT "pitch_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_quotes_quotes" ADD CONSTRAINT "pitch_blocks_quotes_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_quotes" ADD CONSTRAINT "pitch_blocks_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_filmstrip_tiles" ADD CONSTRAINT "pitch_blocks_filmstrip_tiles_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pitch_blocks_filmstrip_tiles" ADD CONSTRAINT "pitch_blocks_filmstrip_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_filmstrip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_filmstrip" ADD CONSTRAINT "pitch_blocks_filmstrip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_division_showcase_divisions" ADD CONSTRAINT "pitch_blocks_division_showcase_divisions_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pitch_blocks_division_showcase_divisions" ADD CONSTRAINT "pitch_blocks_division_showcase_divisions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_division_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_division_showcase" ADD CONSTRAINT "pitch_blocks_division_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_stats_stats" ADD CONSTRAINT "pitch_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_stats" ADD CONSTRAINT "pitch_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_divider" ADD CONSTRAINT "pitch_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_hero" ADD CONSTRAINT "investors_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "investors_blocks_hero" ADD CONSTRAINT "investors_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_rich_text" ADD CONSTRAINT "investors_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_two_col" ADD CONSTRAINT "investors_blocks_two_col_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_grid_items" ADD CONSTRAINT "investors_blocks_grid_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "investors_blocks_grid_items" ADD CONSTRAINT "investors_blocks_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_grid" ADD CONSTRAINT "investors_blocks_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_cta_buttons" ADD CONSTRAINT "investors_blocks_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_cta" ADD CONSTRAINT "investors_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_quotes_quotes" ADD CONSTRAINT "investors_blocks_quotes_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_quotes" ADD CONSTRAINT "investors_blocks_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_filmstrip_tiles" ADD CONSTRAINT "investors_blocks_filmstrip_tiles_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "investors_blocks_filmstrip_tiles" ADD CONSTRAINT "investors_blocks_filmstrip_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_filmstrip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_filmstrip" ADD CONSTRAINT "investors_blocks_filmstrip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_division_showcase_divisions" ADD CONSTRAINT "investors_blocks_division_showcase_divisions_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "investors_blocks_division_showcase_divisions" ADD CONSTRAINT "investors_blocks_division_showcase_divisions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_division_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_division_showcase" ADD CONSTRAINT "investors_blocks_division_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_stats_stats" ADD CONSTRAINT "investors_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_stats" ADD CONSTRAINT "investors_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_divider" ADD CONSTRAINT "investors_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_blocks_hero_order_idx" ON "about_blocks_hero" USING btree ("_order");
  CREATE INDEX "about_blocks_hero_parent_id_idx" ON "about_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "about_blocks_hero_path_idx" ON "about_blocks_hero" USING btree ("_path");
  CREATE INDEX "about_blocks_hero_media_idx" ON "about_blocks_hero" USING btree ("media_id");
  CREATE INDEX "about_blocks_rich_text_order_idx" ON "about_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "about_blocks_rich_text_parent_id_idx" ON "about_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "about_blocks_rich_text_path_idx" ON "about_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "about_blocks_two_col_order_idx" ON "about_blocks_two_col" USING btree ("_order");
  CREATE INDEX "about_blocks_two_col_parent_id_idx" ON "about_blocks_two_col" USING btree ("_parent_id");
  CREATE INDEX "about_blocks_two_col_path_idx" ON "about_blocks_two_col" USING btree ("_path");
  CREATE INDEX "about_blocks_grid_items_order_idx" ON "about_blocks_grid_items" USING btree ("_order");
  CREATE INDEX "about_blocks_grid_items_parent_id_idx" ON "about_blocks_grid_items" USING btree ("_parent_id");
  CREATE INDEX "about_blocks_grid_items_media_idx" ON "about_blocks_grid_items" USING btree ("media_id");
  CREATE INDEX "about_blocks_grid_order_idx" ON "about_blocks_grid" USING btree ("_order");
  CREATE INDEX "about_blocks_grid_parent_id_idx" ON "about_blocks_grid" USING btree ("_parent_id");
  CREATE INDEX "about_blocks_grid_path_idx" ON "about_blocks_grid" USING btree ("_path");
  CREATE INDEX "about_blocks_cta_buttons_order_idx" ON "about_blocks_cta_buttons" USING btree ("_order");
  CREATE INDEX "about_blocks_cta_buttons_parent_id_idx" ON "about_blocks_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "about_blocks_cta_order_idx" ON "about_blocks_cta" USING btree ("_order");
  CREATE INDEX "about_blocks_cta_parent_id_idx" ON "about_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "about_blocks_cta_path_idx" ON "about_blocks_cta" USING btree ("_path");
  CREATE INDEX "about_blocks_quotes_quotes_order_idx" ON "about_blocks_quotes_quotes" USING btree ("_order");
  CREATE INDEX "about_blocks_quotes_quotes_parent_id_idx" ON "about_blocks_quotes_quotes" USING btree ("_parent_id");
  CREATE INDEX "about_blocks_quotes_order_idx" ON "about_blocks_quotes" USING btree ("_order");
  CREATE INDEX "about_blocks_quotes_parent_id_idx" ON "about_blocks_quotes" USING btree ("_parent_id");
  CREATE INDEX "about_blocks_quotes_path_idx" ON "about_blocks_quotes" USING btree ("_path");
  CREATE INDEX "about_blocks_filmstrip_tiles_order_idx" ON "about_blocks_filmstrip_tiles" USING btree ("_order");
  CREATE INDEX "about_blocks_filmstrip_tiles_parent_id_idx" ON "about_blocks_filmstrip_tiles" USING btree ("_parent_id");
  CREATE INDEX "about_blocks_filmstrip_tiles_media_idx" ON "about_blocks_filmstrip_tiles" USING btree ("media_id");
  CREATE INDEX "about_blocks_filmstrip_order_idx" ON "about_blocks_filmstrip" USING btree ("_order");
  CREATE INDEX "about_blocks_filmstrip_parent_id_idx" ON "about_blocks_filmstrip" USING btree ("_parent_id");
  CREATE INDEX "about_blocks_filmstrip_path_idx" ON "about_blocks_filmstrip" USING btree ("_path");
  CREATE INDEX "about_blocks_division_showcase_divisions_order_idx" ON "about_blocks_division_showcase_divisions" USING btree ("_order");
  CREATE INDEX "about_blocks_division_showcase_divisions_parent_id_idx" ON "about_blocks_division_showcase_divisions" USING btree ("_parent_id");
  CREATE INDEX "about_blocks_division_showcase_divisions_media_idx" ON "about_blocks_division_showcase_divisions" USING btree ("media_id");
  CREATE INDEX "about_blocks_division_showcase_order_idx" ON "about_blocks_division_showcase" USING btree ("_order");
  CREATE INDEX "about_blocks_division_showcase_parent_id_idx" ON "about_blocks_division_showcase" USING btree ("_parent_id");
  CREATE INDEX "about_blocks_division_showcase_path_idx" ON "about_blocks_division_showcase" USING btree ("_path");
  CREATE INDEX "about_blocks_stats_stats_order_idx" ON "about_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "about_blocks_stats_stats_parent_id_idx" ON "about_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "about_blocks_stats_order_idx" ON "about_blocks_stats" USING btree ("_order");
  CREATE INDEX "about_blocks_stats_parent_id_idx" ON "about_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "about_blocks_stats_path_idx" ON "about_blocks_stats" USING btree ("_path");
  CREATE INDEX "about_blocks_divider_order_idx" ON "about_blocks_divider" USING btree ("_order");
  CREATE INDEX "about_blocks_divider_parent_id_idx" ON "about_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "about_blocks_divider_path_idx" ON "about_blocks_divider" USING btree ("_path");
  CREATE INDEX "contact_blocks_hero_order_idx" ON "contact_blocks_hero" USING btree ("_order");
  CREATE INDEX "contact_blocks_hero_parent_id_idx" ON "contact_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "contact_blocks_hero_path_idx" ON "contact_blocks_hero" USING btree ("_path");
  CREATE INDEX "contact_blocks_hero_media_idx" ON "contact_blocks_hero" USING btree ("media_id");
  CREATE INDEX "contact_blocks_rich_text_order_idx" ON "contact_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "contact_blocks_rich_text_parent_id_idx" ON "contact_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "contact_blocks_rich_text_path_idx" ON "contact_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "contact_blocks_two_col_order_idx" ON "contact_blocks_two_col" USING btree ("_order");
  CREATE INDEX "contact_blocks_two_col_parent_id_idx" ON "contact_blocks_two_col" USING btree ("_parent_id");
  CREATE INDEX "contact_blocks_two_col_path_idx" ON "contact_blocks_two_col" USING btree ("_path");
  CREATE INDEX "contact_blocks_grid_items_order_idx" ON "contact_blocks_grid_items" USING btree ("_order");
  CREATE INDEX "contact_blocks_grid_items_parent_id_idx" ON "contact_blocks_grid_items" USING btree ("_parent_id");
  CREATE INDEX "contact_blocks_grid_items_media_idx" ON "contact_blocks_grid_items" USING btree ("media_id");
  CREATE INDEX "contact_blocks_grid_order_idx" ON "contact_blocks_grid" USING btree ("_order");
  CREATE INDEX "contact_blocks_grid_parent_id_idx" ON "contact_blocks_grid" USING btree ("_parent_id");
  CREATE INDEX "contact_blocks_grid_path_idx" ON "contact_blocks_grid" USING btree ("_path");
  CREATE INDEX "contact_blocks_cta_buttons_order_idx" ON "contact_blocks_cta_buttons" USING btree ("_order");
  CREATE INDEX "contact_blocks_cta_buttons_parent_id_idx" ON "contact_blocks_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "contact_blocks_cta_order_idx" ON "contact_blocks_cta" USING btree ("_order");
  CREATE INDEX "contact_blocks_cta_parent_id_idx" ON "contact_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "contact_blocks_cta_path_idx" ON "contact_blocks_cta" USING btree ("_path");
  CREATE INDEX "contact_blocks_quotes_quotes_order_idx" ON "contact_blocks_quotes_quotes" USING btree ("_order");
  CREATE INDEX "contact_blocks_quotes_quotes_parent_id_idx" ON "contact_blocks_quotes_quotes" USING btree ("_parent_id");
  CREATE INDEX "contact_blocks_quotes_order_idx" ON "contact_blocks_quotes" USING btree ("_order");
  CREATE INDEX "contact_blocks_quotes_parent_id_idx" ON "contact_blocks_quotes" USING btree ("_parent_id");
  CREATE INDEX "contact_blocks_quotes_path_idx" ON "contact_blocks_quotes" USING btree ("_path");
  CREATE INDEX "contact_blocks_filmstrip_tiles_order_idx" ON "contact_blocks_filmstrip_tiles" USING btree ("_order");
  CREATE INDEX "contact_blocks_filmstrip_tiles_parent_id_idx" ON "contact_blocks_filmstrip_tiles" USING btree ("_parent_id");
  CREATE INDEX "contact_blocks_filmstrip_tiles_media_idx" ON "contact_blocks_filmstrip_tiles" USING btree ("media_id");
  CREATE INDEX "contact_blocks_filmstrip_order_idx" ON "contact_blocks_filmstrip" USING btree ("_order");
  CREATE INDEX "contact_blocks_filmstrip_parent_id_idx" ON "contact_blocks_filmstrip" USING btree ("_parent_id");
  CREATE INDEX "contact_blocks_filmstrip_path_idx" ON "contact_blocks_filmstrip" USING btree ("_path");
  CREATE INDEX "contact_blocks_division_showcase_divisions_order_idx" ON "contact_blocks_division_showcase_divisions" USING btree ("_order");
  CREATE INDEX "contact_blocks_division_showcase_divisions_parent_id_idx" ON "contact_blocks_division_showcase_divisions" USING btree ("_parent_id");
  CREATE INDEX "contact_blocks_division_showcase_divisions_media_idx" ON "contact_blocks_division_showcase_divisions" USING btree ("media_id");
  CREATE INDEX "contact_blocks_division_showcase_order_idx" ON "contact_blocks_division_showcase" USING btree ("_order");
  CREATE INDEX "contact_blocks_division_showcase_parent_id_idx" ON "contact_blocks_division_showcase" USING btree ("_parent_id");
  CREATE INDEX "contact_blocks_division_showcase_path_idx" ON "contact_blocks_division_showcase" USING btree ("_path");
  CREATE INDEX "contact_blocks_stats_stats_order_idx" ON "contact_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "contact_blocks_stats_stats_parent_id_idx" ON "contact_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "contact_blocks_stats_order_idx" ON "contact_blocks_stats" USING btree ("_order");
  CREATE INDEX "contact_blocks_stats_parent_id_idx" ON "contact_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "contact_blocks_stats_path_idx" ON "contact_blocks_stats" USING btree ("_path");
  CREATE INDEX "contact_blocks_divider_order_idx" ON "contact_blocks_divider" USING btree ("_order");
  CREATE INDEX "contact_blocks_divider_parent_id_idx" ON "contact_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "contact_blocks_divider_path_idx" ON "contact_blocks_divider" USING btree ("_path");
  CREATE INDEX "jobs_blocks_hero_order_idx" ON "jobs_blocks_hero" USING btree ("_order");
  CREATE INDEX "jobs_blocks_hero_parent_id_idx" ON "jobs_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_hero_path_idx" ON "jobs_blocks_hero" USING btree ("_path");
  CREATE INDEX "jobs_blocks_hero_media_idx" ON "jobs_blocks_hero" USING btree ("media_id");
  CREATE INDEX "jobs_blocks_rich_text_order_idx" ON "jobs_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "jobs_blocks_rich_text_parent_id_idx" ON "jobs_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_rich_text_path_idx" ON "jobs_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "jobs_blocks_two_col_order_idx" ON "jobs_blocks_two_col" USING btree ("_order");
  CREATE INDEX "jobs_blocks_two_col_parent_id_idx" ON "jobs_blocks_two_col" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_two_col_path_idx" ON "jobs_blocks_two_col" USING btree ("_path");
  CREATE INDEX "jobs_blocks_grid_items_order_idx" ON "jobs_blocks_grid_items" USING btree ("_order");
  CREATE INDEX "jobs_blocks_grid_items_parent_id_idx" ON "jobs_blocks_grid_items" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_grid_items_media_idx" ON "jobs_blocks_grid_items" USING btree ("media_id");
  CREATE INDEX "jobs_blocks_grid_order_idx" ON "jobs_blocks_grid" USING btree ("_order");
  CREATE INDEX "jobs_blocks_grid_parent_id_idx" ON "jobs_blocks_grid" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_grid_path_idx" ON "jobs_blocks_grid" USING btree ("_path");
  CREATE INDEX "jobs_blocks_cta_buttons_order_idx" ON "jobs_blocks_cta_buttons" USING btree ("_order");
  CREATE INDEX "jobs_blocks_cta_buttons_parent_id_idx" ON "jobs_blocks_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_cta_order_idx" ON "jobs_blocks_cta" USING btree ("_order");
  CREATE INDEX "jobs_blocks_cta_parent_id_idx" ON "jobs_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_cta_path_idx" ON "jobs_blocks_cta" USING btree ("_path");
  CREATE INDEX "jobs_blocks_quotes_quotes_order_idx" ON "jobs_blocks_quotes_quotes" USING btree ("_order");
  CREATE INDEX "jobs_blocks_quotes_quotes_parent_id_idx" ON "jobs_blocks_quotes_quotes" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_quotes_order_idx" ON "jobs_blocks_quotes" USING btree ("_order");
  CREATE INDEX "jobs_blocks_quotes_parent_id_idx" ON "jobs_blocks_quotes" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_quotes_path_idx" ON "jobs_blocks_quotes" USING btree ("_path");
  CREATE INDEX "jobs_blocks_filmstrip_tiles_order_idx" ON "jobs_blocks_filmstrip_tiles" USING btree ("_order");
  CREATE INDEX "jobs_blocks_filmstrip_tiles_parent_id_idx" ON "jobs_blocks_filmstrip_tiles" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_filmstrip_tiles_media_idx" ON "jobs_blocks_filmstrip_tiles" USING btree ("media_id");
  CREATE INDEX "jobs_blocks_filmstrip_order_idx" ON "jobs_blocks_filmstrip" USING btree ("_order");
  CREATE INDEX "jobs_blocks_filmstrip_parent_id_idx" ON "jobs_blocks_filmstrip" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_filmstrip_path_idx" ON "jobs_blocks_filmstrip" USING btree ("_path");
  CREATE INDEX "jobs_blocks_division_showcase_divisions_order_idx" ON "jobs_blocks_division_showcase_divisions" USING btree ("_order");
  CREATE INDEX "jobs_blocks_division_showcase_divisions_parent_id_idx" ON "jobs_blocks_division_showcase_divisions" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_division_showcase_divisions_media_idx" ON "jobs_blocks_division_showcase_divisions" USING btree ("media_id");
  CREATE INDEX "jobs_blocks_division_showcase_order_idx" ON "jobs_blocks_division_showcase" USING btree ("_order");
  CREATE INDEX "jobs_blocks_division_showcase_parent_id_idx" ON "jobs_blocks_division_showcase" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_division_showcase_path_idx" ON "jobs_blocks_division_showcase" USING btree ("_path");
  CREATE INDEX "jobs_blocks_stats_stats_order_idx" ON "jobs_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "jobs_blocks_stats_stats_parent_id_idx" ON "jobs_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_stats_order_idx" ON "jobs_blocks_stats" USING btree ("_order");
  CREATE INDEX "jobs_blocks_stats_parent_id_idx" ON "jobs_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_stats_path_idx" ON "jobs_blocks_stats" USING btree ("_path");
  CREATE INDEX "jobs_blocks_divider_order_idx" ON "jobs_blocks_divider" USING btree ("_order");
  CREATE INDEX "jobs_blocks_divider_parent_id_idx" ON "jobs_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_divider_path_idx" ON "jobs_blocks_divider" USING btree ("_path");
  CREATE INDEX "pitch_blocks_hero_order_idx" ON "pitch_blocks_hero" USING btree ("_order");
  CREATE INDEX "pitch_blocks_hero_parent_id_idx" ON "pitch_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pitch_blocks_hero_path_idx" ON "pitch_blocks_hero" USING btree ("_path");
  CREATE INDEX "pitch_blocks_hero_media_idx" ON "pitch_blocks_hero" USING btree ("media_id");
  CREATE INDEX "pitch_blocks_rich_text_order_idx" ON "pitch_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pitch_blocks_rich_text_parent_id_idx" ON "pitch_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pitch_blocks_rich_text_path_idx" ON "pitch_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pitch_blocks_two_col_order_idx" ON "pitch_blocks_two_col" USING btree ("_order");
  CREATE INDEX "pitch_blocks_two_col_parent_id_idx" ON "pitch_blocks_two_col" USING btree ("_parent_id");
  CREATE INDEX "pitch_blocks_two_col_path_idx" ON "pitch_blocks_two_col" USING btree ("_path");
  CREATE INDEX "pitch_blocks_grid_items_order_idx" ON "pitch_blocks_grid_items" USING btree ("_order");
  CREATE INDEX "pitch_blocks_grid_items_parent_id_idx" ON "pitch_blocks_grid_items" USING btree ("_parent_id");
  CREATE INDEX "pitch_blocks_grid_items_media_idx" ON "pitch_blocks_grid_items" USING btree ("media_id");
  CREATE INDEX "pitch_blocks_grid_order_idx" ON "pitch_blocks_grid" USING btree ("_order");
  CREATE INDEX "pitch_blocks_grid_parent_id_idx" ON "pitch_blocks_grid" USING btree ("_parent_id");
  CREATE INDEX "pitch_blocks_grid_path_idx" ON "pitch_blocks_grid" USING btree ("_path");
  CREATE INDEX "pitch_blocks_cta_buttons_order_idx" ON "pitch_blocks_cta_buttons" USING btree ("_order");
  CREATE INDEX "pitch_blocks_cta_buttons_parent_id_idx" ON "pitch_blocks_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "pitch_blocks_cta_order_idx" ON "pitch_blocks_cta" USING btree ("_order");
  CREATE INDEX "pitch_blocks_cta_parent_id_idx" ON "pitch_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pitch_blocks_cta_path_idx" ON "pitch_blocks_cta" USING btree ("_path");
  CREATE INDEX "pitch_blocks_quotes_quotes_order_idx" ON "pitch_blocks_quotes_quotes" USING btree ("_order");
  CREATE INDEX "pitch_blocks_quotes_quotes_parent_id_idx" ON "pitch_blocks_quotes_quotes" USING btree ("_parent_id");
  CREATE INDEX "pitch_blocks_quotes_order_idx" ON "pitch_blocks_quotes" USING btree ("_order");
  CREATE INDEX "pitch_blocks_quotes_parent_id_idx" ON "pitch_blocks_quotes" USING btree ("_parent_id");
  CREATE INDEX "pitch_blocks_quotes_path_idx" ON "pitch_blocks_quotes" USING btree ("_path");
  CREATE INDEX "pitch_blocks_filmstrip_tiles_order_idx" ON "pitch_blocks_filmstrip_tiles" USING btree ("_order");
  CREATE INDEX "pitch_blocks_filmstrip_tiles_parent_id_idx" ON "pitch_blocks_filmstrip_tiles" USING btree ("_parent_id");
  CREATE INDEX "pitch_blocks_filmstrip_tiles_media_idx" ON "pitch_blocks_filmstrip_tiles" USING btree ("media_id");
  CREATE INDEX "pitch_blocks_filmstrip_order_idx" ON "pitch_blocks_filmstrip" USING btree ("_order");
  CREATE INDEX "pitch_blocks_filmstrip_parent_id_idx" ON "pitch_blocks_filmstrip" USING btree ("_parent_id");
  CREATE INDEX "pitch_blocks_filmstrip_path_idx" ON "pitch_blocks_filmstrip" USING btree ("_path");
  CREATE INDEX "pitch_blocks_division_showcase_divisions_order_idx" ON "pitch_blocks_division_showcase_divisions" USING btree ("_order");
  CREATE INDEX "pitch_blocks_division_showcase_divisions_parent_id_idx" ON "pitch_blocks_division_showcase_divisions" USING btree ("_parent_id");
  CREATE INDEX "pitch_blocks_division_showcase_divisions_media_idx" ON "pitch_blocks_division_showcase_divisions" USING btree ("media_id");
  CREATE INDEX "pitch_blocks_division_showcase_order_idx" ON "pitch_blocks_division_showcase" USING btree ("_order");
  CREATE INDEX "pitch_blocks_division_showcase_parent_id_idx" ON "pitch_blocks_division_showcase" USING btree ("_parent_id");
  CREATE INDEX "pitch_blocks_division_showcase_path_idx" ON "pitch_blocks_division_showcase" USING btree ("_path");
  CREATE INDEX "pitch_blocks_stats_stats_order_idx" ON "pitch_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "pitch_blocks_stats_stats_parent_id_idx" ON "pitch_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "pitch_blocks_stats_order_idx" ON "pitch_blocks_stats" USING btree ("_order");
  CREATE INDEX "pitch_blocks_stats_parent_id_idx" ON "pitch_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pitch_blocks_stats_path_idx" ON "pitch_blocks_stats" USING btree ("_path");
  CREATE INDEX "pitch_blocks_divider_order_idx" ON "pitch_blocks_divider" USING btree ("_order");
  CREATE INDEX "pitch_blocks_divider_parent_id_idx" ON "pitch_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "pitch_blocks_divider_path_idx" ON "pitch_blocks_divider" USING btree ("_path");
  CREATE INDEX "investors_blocks_hero_order_idx" ON "investors_blocks_hero" USING btree ("_order");
  CREATE INDEX "investors_blocks_hero_parent_id_idx" ON "investors_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "investors_blocks_hero_path_idx" ON "investors_blocks_hero" USING btree ("_path");
  CREATE INDEX "investors_blocks_hero_media_idx" ON "investors_blocks_hero" USING btree ("media_id");
  CREATE INDEX "investors_blocks_rich_text_order_idx" ON "investors_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "investors_blocks_rich_text_parent_id_idx" ON "investors_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "investors_blocks_rich_text_path_idx" ON "investors_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "investors_blocks_two_col_order_idx" ON "investors_blocks_two_col" USING btree ("_order");
  CREATE INDEX "investors_blocks_two_col_parent_id_idx" ON "investors_blocks_two_col" USING btree ("_parent_id");
  CREATE INDEX "investors_blocks_two_col_path_idx" ON "investors_blocks_two_col" USING btree ("_path");
  CREATE INDEX "investors_blocks_grid_items_order_idx" ON "investors_blocks_grid_items" USING btree ("_order");
  CREATE INDEX "investors_blocks_grid_items_parent_id_idx" ON "investors_blocks_grid_items" USING btree ("_parent_id");
  CREATE INDEX "investors_blocks_grid_items_media_idx" ON "investors_blocks_grid_items" USING btree ("media_id");
  CREATE INDEX "investors_blocks_grid_order_idx" ON "investors_blocks_grid" USING btree ("_order");
  CREATE INDEX "investors_blocks_grid_parent_id_idx" ON "investors_blocks_grid" USING btree ("_parent_id");
  CREATE INDEX "investors_blocks_grid_path_idx" ON "investors_blocks_grid" USING btree ("_path");
  CREATE INDEX "investors_blocks_cta_buttons_order_idx" ON "investors_blocks_cta_buttons" USING btree ("_order");
  CREATE INDEX "investors_blocks_cta_buttons_parent_id_idx" ON "investors_blocks_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "investors_blocks_cta_order_idx" ON "investors_blocks_cta" USING btree ("_order");
  CREATE INDEX "investors_blocks_cta_parent_id_idx" ON "investors_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "investors_blocks_cta_path_idx" ON "investors_blocks_cta" USING btree ("_path");
  CREATE INDEX "investors_blocks_quotes_quotes_order_idx" ON "investors_blocks_quotes_quotes" USING btree ("_order");
  CREATE INDEX "investors_blocks_quotes_quotes_parent_id_idx" ON "investors_blocks_quotes_quotes" USING btree ("_parent_id");
  CREATE INDEX "investors_blocks_quotes_order_idx" ON "investors_blocks_quotes" USING btree ("_order");
  CREATE INDEX "investors_blocks_quotes_parent_id_idx" ON "investors_blocks_quotes" USING btree ("_parent_id");
  CREATE INDEX "investors_blocks_quotes_path_idx" ON "investors_blocks_quotes" USING btree ("_path");
  CREATE INDEX "investors_blocks_filmstrip_tiles_order_idx" ON "investors_blocks_filmstrip_tiles" USING btree ("_order");
  CREATE INDEX "investors_blocks_filmstrip_tiles_parent_id_idx" ON "investors_blocks_filmstrip_tiles" USING btree ("_parent_id");
  CREATE INDEX "investors_blocks_filmstrip_tiles_media_idx" ON "investors_blocks_filmstrip_tiles" USING btree ("media_id");
  CREATE INDEX "investors_blocks_filmstrip_order_idx" ON "investors_blocks_filmstrip" USING btree ("_order");
  CREATE INDEX "investors_blocks_filmstrip_parent_id_idx" ON "investors_blocks_filmstrip" USING btree ("_parent_id");
  CREATE INDEX "investors_blocks_filmstrip_path_idx" ON "investors_blocks_filmstrip" USING btree ("_path");
  CREATE INDEX "investors_blocks_division_showcase_divisions_order_idx" ON "investors_blocks_division_showcase_divisions" USING btree ("_order");
  CREATE INDEX "investors_blocks_division_showcase_divisions_parent_id_idx" ON "investors_blocks_division_showcase_divisions" USING btree ("_parent_id");
  CREATE INDEX "investors_blocks_division_showcase_divisions_media_idx" ON "investors_blocks_division_showcase_divisions" USING btree ("media_id");
  CREATE INDEX "investors_blocks_division_showcase_order_idx" ON "investors_blocks_division_showcase" USING btree ("_order");
  CREATE INDEX "investors_blocks_division_showcase_parent_id_idx" ON "investors_blocks_division_showcase" USING btree ("_parent_id");
  CREATE INDEX "investors_blocks_division_showcase_path_idx" ON "investors_blocks_division_showcase" USING btree ("_path");
  CREATE INDEX "investors_blocks_stats_stats_order_idx" ON "investors_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "investors_blocks_stats_stats_parent_id_idx" ON "investors_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "investors_blocks_stats_order_idx" ON "investors_blocks_stats" USING btree ("_order");
  CREATE INDEX "investors_blocks_stats_parent_id_idx" ON "investors_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "investors_blocks_stats_path_idx" ON "investors_blocks_stats" USING btree ("_path");
  CREATE INDEX "investors_blocks_divider_order_idx" ON "investors_blocks_divider" USING btree ("_order");
  CREATE INDEX "investors_blocks_divider_parent_id_idx" ON "investors_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "investors_blocks_divider_path_idx" ON "investors_blocks_divider" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "about_blocks_hero" CASCADE;
  DROP TABLE "about_blocks_rich_text" CASCADE;
  DROP TABLE "about_blocks_two_col" CASCADE;
  DROP TABLE "about_blocks_grid_items" CASCADE;
  DROP TABLE "about_blocks_grid" CASCADE;
  DROP TABLE "about_blocks_cta_buttons" CASCADE;
  DROP TABLE "about_blocks_cta" CASCADE;
  DROP TABLE "about_blocks_quotes_quotes" CASCADE;
  DROP TABLE "about_blocks_quotes" CASCADE;
  DROP TABLE "about_blocks_filmstrip_tiles" CASCADE;
  DROP TABLE "about_blocks_filmstrip" CASCADE;
  DROP TABLE "about_blocks_division_showcase_divisions" CASCADE;
  DROP TABLE "about_blocks_division_showcase" CASCADE;
  DROP TABLE "about_blocks_stats_stats" CASCADE;
  DROP TABLE "about_blocks_stats" CASCADE;
  DROP TABLE "about_blocks_divider" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "contact_blocks_hero" CASCADE;
  DROP TABLE "contact_blocks_rich_text" CASCADE;
  DROP TABLE "contact_blocks_two_col" CASCADE;
  DROP TABLE "contact_blocks_grid_items" CASCADE;
  DROP TABLE "contact_blocks_grid" CASCADE;
  DROP TABLE "contact_blocks_cta_buttons" CASCADE;
  DROP TABLE "contact_blocks_cta" CASCADE;
  DROP TABLE "contact_blocks_quotes_quotes" CASCADE;
  DROP TABLE "contact_blocks_quotes" CASCADE;
  DROP TABLE "contact_blocks_filmstrip_tiles" CASCADE;
  DROP TABLE "contact_blocks_filmstrip" CASCADE;
  DROP TABLE "contact_blocks_division_showcase_divisions" CASCADE;
  DROP TABLE "contact_blocks_division_showcase" CASCADE;
  DROP TABLE "contact_blocks_stats_stats" CASCADE;
  DROP TABLE "contact_blocks_stats" CASCADE;
  DROP TABLE "contact_blocks_divider" CASCADE;
  DROP TABLE "contact" CASCADE;
  DROP TABLE "jobs_blocks_hero" CASCADE;
  DROP TABLE "jobs_blocks_rich_text" CASCADE;
  DROP TABLE "jobs_blocks_two_col" CASCADE;
  DROP TABLE "jobs_blocks_grid_items" CASCADE;
  DROP TABLE "jobs_blocks_grid" CASCADE;
  DROP TABLE "jobs_blocks_cta_buttons" CASCADE;
  DROP TABLE "jobs_blocks_cta" CASCADE;
  DROP TABLE "jobs_blocks_quotes_quotes" CASCADE;
  DROP TABLE "jobs_blocks_quotes" CASCADE;
  DROP TABLE "jobs_blocks_filmstrip_tiles" CASCADE;
  DROP TABLE "jobs_blocks_filmstrip" CASCADE;
  DROP TABLE "jobs_blocks_division_showcase_divisions" CASCADE;
  DROP TABLE "jobs_blocks_division_showcase" CASCADE;
  DROP TABLE "jobs_blocks_stats_stats" CASCADE;
  DROP TABLE "jobs_blocks_stats" CASCADE;
  DROP TABLE "jobs_blocks_divider" CASCADE;
  DROP TABLE "jobs" CASCADE;
  DROP TABLE "pitch_blocks_hero" CASCADE;
  DROP TABLE "pitch_blocks_rich_text" CASCADE;
  DROP TABLE "pitch_blocks_two_col" CASCADE;
  DROP TABLE "pitch_blocks_grid_items" CASCADE;
  DROP TABLE "pitch_blocks_grid" CASCADE;
  DROP TABLE "pitch_blocks_cta_buttons" CASCADE;
  DROP TABLE "pitch_blocks_cta" CASCADE;
  DROP TABLE "pitch_blocks_quotes_quotes" CASCADE;
  DROP TABLE "pitch_blocks_quotes" CASCADE;
  DROP TABLE "pitch_blocks_filmstrip_tiles" CASCADE;
  DROP TABLE "pitch_blocks_filmstrip" CASCADE;
  DROP TABLE "pitch_blocks_division_showcase_divisions" CASCADE;
  DROP TABLE "pitch_blocks_division_showcase" CASCADE;
  DROP TABLE "pitch_blocks_stats_stats" CASCADE;
  DROP TABLE "pitch_blocks_stats" CASCADE;
  DROP TABLE "pitch_blocks_divider" CASCADE;
  DROP TABLE "pitch" CASCADE;
  DROP TABLE "investors_blocks_hero" CASCADE;
  DROP TABLE "investors_blocks_rich_text" CASCADE;
  DROP TABLE "investors_blocks_two_col" CASCADE;
  DROP TABLE "investors_blocks_grid_items" CASCADE;
  DROP TABLE "investors_blocks_grid" CASCADE;
  DROP TABLE "investors_blocks_cta_buttons" CASCADE;
  DROP TABLE "investors_blocks_cta" CASCADE;
  DROP TABLE "investors_blocks_quotes_quotes" CASCADE;
  DROP TABLE "investors_blocks_quotes" CASCADE;
  DROP TABLE "investors_blocks_filmstrip_tiles" CASCADE;
  DROP TABLE "investors_blocks_filmstrip" CASCADE;
  DROP TABLE "investors_blocks_division_showcase_divisions" CASCADE;
  DROP TABLE "investors_blocks_division_showcase" CASCADE;
  DROP TABLE "investors_blocks_stats_stats" CASCADE;
  DROP TABLE "investors_blocks_stats" CASCADE;
  DROP TABLE "investors_blocks_divider" CASCADE;
  DROP TABLE "investors" CASCADE;
  DROP TYPE "public"."enum_about_blocks_hero_variant";
  DROP TYPE "public"."enum_about_blocks_hero_division";
  DROP TYPE "public"."enum_about_blocks_two_col_ratio";
  DROP TYPE "public"."enum_about_blocks_two_col_alignment";
  DROP TYPE "public"."enum_about_blocks_cta_buttons_variant";
  DROP TYPE "public"."enum_about_blocks_quotes_layout";
  DROP TYPE "public"."enum_about_blocks_filmstrip_tiles_division";
  DROP TYPE "public"."enum_about_blocks_filmstrip_source";
  DROP TYPE "public"."enum_about_blocks_filmstrip_project_filter";
  DROP TYPE "public"."enum_about_blocks_division_showcase_divisions_color_token";
  DROP TYPE "public"."enum_about_blocks_division_showcase_variant";
  DROP TYPE "public"."enum_about_blocks_stats_stats_color_token";
  DROP TYPE "public"."enum_about_blocks_stats_columns";
  DROP TYPE "public"."enum_about_blocks_divider_spacing";
  DROP TYPE "public"."enum_contact_blocks_hero_variant";
  DROP TYPE "public"."enum_contact_blocks_hero_division";
  DROP TYPE "public"."enum_contact_blocks_two_col_ratio";
  DROP TYPE "public"."enum_contact_blocks_two_col_alignment";
  DROP TYPE "public"."enum_contact_blocks_cta_buttons_variant";
  DROP TYPE "public"."enum_contact_blocks_quotes_layout";
  DROP TYPE "public"."enum_contact_blocks_filmstrip_tiles_division";
  DROP TYPE "public"."enum_contact_blocks_filmstrip_source";
  DROP TYPE "public"."enum_contact_blocks_filmstrip_project_filter";
  DROP TYPE "public"."enum_contact_blocks_division_showcase_divisions_color_token";
  DROP TYPE "public"."enum_contact_blocks_division_showcase_variant";
  DROP TYPE "public"."enum_contact_blocks_stats_stats_color_token";
  DROP TYPE "public"."enum_contact_blocks_stats_columns";
  DROP TYPE "public"."enum_contact_blocks_divider_spacing";
  DROP TYPE "public"."enum_jobs_blocks_hero_variant";
  DROP TYPE "public"."enum_jobs_blocks_hero_division";
  DROP TYPE "public"."enum_jobs_blocks_two_col_ratio";
  DROP TYPE "public"."enum_jobs_blocks_two_col_alignment";
  DROP TYPE "public"."enum_jobs_blocks_cta_buttons_variant";
  DROP TYPE "public"."enum_jobs_blocks_quotes_layout";
  DROP TYPE "public"."enum_jobs_blocks_filmstrip_tiles_division";
  DROP TYPE "public"."enum_jobs_blocks_filmstrip_source";
  DROP TYPE "public"."enum_jobs_blocks_filmstrip_project_filter";
  DROP TYPE "public"."enum_jobs_blocks_division_showcase_divisions_color_token";
  DROP TYPE "public"."enum_jobs_blocks_division_showcase_variant";
  DROP TYPE "public"."enum_jobs_blocks_stats_stats_color_token";
  DROP TYPE "public"."enum_jobs_blocks_stats_columns";
  DROP TYPE "public"."enum_jobs_blocks_divider_spacing";
  DROP TYPE "public"."enum_pitch_blocks_hero_variant";
  DROP TYPE "public"."enum_pitch_blocks_hero_division";
  DROP TYPE "public"."enum_pitch_blocks_two_col_ratio";
  DROP TYPE "public"."enum_pitch_blocks_two_col_alignment";
  DROP TYPE "public"."enum_pitch_blocks_cta_buttons_variant";
  DROP TYPE "public"."enum_pitch_blocks_quotes_layout";
  DROP TYPE "public"."enum_pitch_blocks_filmstrip_tiles_division";
  DROP TYPE "public"."enum_pitch_blocks_filmstrip_source";
  DROP TYPE "public"."enum_pitch_blocks_filmstrip_project_filter";
  DROP TYPE "public"."enum_pitch_blocks_division_showcase_divisions_color_token";
  DROP TYPE "public"."enum_pitch_blocks_division_showcase_variant";
  DROP TYPE "public"."enum_pitch_blocks_stats_stats_color_token";
  DROP TYPE "public"."enum_pitch_blocks_stats_columns";
  DROP TYPE "public"."enum_pitch_blocks_divider_spacing";
  DROP TYPE "public"."enum_investors_blocks_hero_variant";
  DROP TYPE "public"."enum_investors_blocks_hero_division";
  DROP TYPE "public"."enum_investors_blocks_two_col_ratio";
  DROP TYPE "public"."enum_investors_blocks_two_col_alignment";
  DROP TYPE "public"."enum_investors_blocks_cta_buttons_variant";
  DROP TYPE "public"."enum_investors_blocks_quotes_layout";
  DROP TYPE "public"."enum_investors_blocks_filmstrip_tiles_division";
  DROP TYPE "public"."enum_investors_blocks_filmstrip_source";
  DROP TYPE "public"."enum_investors_blocks_filmstrip_project_filter";
  DROP TYPE "public"."enum_investors_blocks_division_showcase_divisions_color_token";
  DROP TYPE "public"."enum_investors_blocks_division_showcase_variant";
  DROP TYPE "public"."enum_investors_blocks_stats_stats_color_token";
  DROP TYPE "public"."enum_investors_blocks_stats_columns";
  DROP TYPE "public"."enum_investors_blocks_divider_spacing";`)
}
