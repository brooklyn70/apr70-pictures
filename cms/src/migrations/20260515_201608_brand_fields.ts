import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_media_media_kind" AS ENUM('logo', 'favicon', 'wordmark', 'watermark', 'photo');
  CREATE TYPE "public"."enum_media_division_tag" AS ENUM('212', '310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_projects_blocks_hero_variant" AS ENUM('default', 'split', 'fullscreen', 'slider-auto', 'slider-curated');
  CREATE TYPE "public"."enum_projects_blocks_hero_division" AS ENUM('pictures-212', 'pictures-310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_projects_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');
  CREATE TYPE "public"."enum_projects_blocks_two_col_ratio" AS ENUM('1-3', '1-1', '1-2');
  CREATE TYPE "public"."enum_projects_blocks_two_col_alignment" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_projects_blocks_cta_buttons_variant" AS ENUM('solid', 'ghost', 'link');
  CREATE TYPE "public"."enum_projects_blocks_quotes_layout" AS ENUM('stacked', 'carousel');
  CREATE TYPE "public"."enum_projects_blocks_filmstrip_tiles_division" AS ENUM('none', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_projects_blocks_filmstrip_source" AS ENUM('custom-media', 'from-projects');
  CREATE TYPE "public"."enum_projects_blocks_filmstrip_format" AS ENUM('academy', 'super35', 'widescreen200', 'imax', 'v2-header', 'v2-footer');
  CREATE TYPE "public"."enum_projects_blocks_filmstrip_project_filter" AS ENUM('all', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_projects_blocks_division_showcase_divisions_color_token" AS ENUM('212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_projects_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  CREATE TYPE "public"."enum_projects_blocks_stats_stats_color_token" AS ENUM('none', '212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_projects_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_projects_blocks_divider_spacing" AS ENUM('compact', 'normal', 'wide');
  CREATE TYPE "public"."enum_projects_division" AS ENUM('212', '310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('development', 'production', 'released', 'optioned');
  CREATE TYPE "public"."enum_news_blocks_hero_variant" AS ENUM('default', 'split', 'fullscreen', 'slider-auto', 'slider-curated');
  CREATE TYPE "public"."enum_news_blocks_hero_division" AS ENUM('pictures-212', 'pictures-310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_news_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');
  CREATE TYPE "public"."enum_news_blocks_two_col_ratio" AS ENUM('1-3', '1-1', '1-2');
  CREATE TYPE "public"."enum_news_blocks_two_col_alignment" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_news_blocks_cta_buttons_variant" AS ENUM('solid', 'ghost', 'link');
  CREATE TYPE "public"."enum_news_blocks_quotes_layout" AS ENUM('stacked', 'carousel');
  CREATE TYPE "public"."enum_news_blocks_filmstrip_tiles_division" AS ENUM('none', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_news_blocks_filmstrip_source" AS ENUM('custom-media', 'from-projects');
  CREATE TYPE "public"."enum_news_blocks_filmstrip_format" AS ENUM('academy', 'super35', 'widescreen200', 'imax', 'v2-header', 'v2-footer');
  CREATE TYPE "public"."enum_news_blocks_filmstrip_project_filter" AS ENUM('all', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_news_blocks_division_showcase_divisions_color_token" AS ENUM('212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_news_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  CREATE TYPE "public"."enum_news_blocks_stats_stats_color_token" AS ENUM('none', '212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_news_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_news_blocks_divider_spacing" AS ENUM('compact', 'normal', 'wide');
  CREATE TYPE "public"."enum_home_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');
  CREATE TYPE "public"."enum_home_blocks_filmstrip_format" AS ENUM('academy', 'super35', 'widescreen200', 'imax', 'v2-header', 'v2-footer');
  CREATE TYPE "public"."enum_about_blocks_hero_variant" AS ENUM('default', 'split', 'fullscreen', 'slider-auto', 'slider-curated');
  CREATE TYPE "public"."enum_about_blocks_hero_division" AS ENUM('pictures-212', 'pictures-310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_about_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');
  CREATE TYPE "public"."enum_about_blocks_two_col_ratio" AS ENUM('1-3', '1-1', '1-2');
  CREATE TYPE "public"."enum_about_blocks_two_col_alignment" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_about_blocks_cta_buttons_variant" AS ENUM('solid', 'ghost', 'link');
  CREATE TYPE "public"."enum_about_blocks_quotes_layout" AS ENUM('stacked', 'carousel');
  CREATE TYPE "public"."enum_about_blocks_filmstrip_tiles_division" AS ENUM('none', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_about_blocks_filmstrip_source" AS ENUM('custom-media', 'from-projects');
  CREATE TYPE "public"."enum_about_blocks_filmstrip_format" AS ENUM('academy', 'super35', 'widescreen200', 'imax', 'v2-header', 'v2-footer');
  CREATE TYPE "public"."enum_about_blocks_filmstrip_project_filter" AS ENUM('all', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_about_blocks_division_showcase_divisions_color_token" AS ENUM('212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_about_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  CREATE TYPE "public"."enum_about_blocks_stats_stats_color_token" AS ENUM('none', '212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_about_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_about_blocks_divider_spacing" AS ENUM('compact', 'normal', 'wide');
  CREATE TYPE "public"."enum_contact_blocks_hero_variant" AS ENUM('default', 'split', 'fullscreen', 'slider-auto', 'slider-curated');
  CREATE TYPE "public"."enum_contact_blocks_hero_division" AS ENUM('pictures-212', 'pictures-310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_contact_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');
  CREATE TYPE "public"."enum_contact_blocks_two_col_ratio" AS ENUM('1-3', '1-1', '1-2');
  CREATE TYPE "public"."enum_contact_blocks_two_col_alignment" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_contact_blocks_cta_buttons_variant" AS ENUM('solid', 'ghost', 'link');
  CREATE TYPE "public"."enum_contact_blocks_quotes_layout" AS ENUM('stacked', 'carousel');
  CREATE TYPE "public"."enum_contact_blocks_filmstrip_tiles_division" AS ENUM('none', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_contact_blocks_filmstrip_source" AS ENUM('custom-media', 'from-projects');
  CREATE TYPE "public"."enum_contact_blocks_filmstrip_format" AS ENUM('academy', 'super35', 'widescreen200', 'imax', 'v2-header', 'v2-footer');
  CREATE TYPE "public"."enum_contact_blocks_filmstrip_project_filter" AS ENUM('all', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_contact_blocks_division_showcase_divisions_color_token" AS ENUM('212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_contact_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  CREATE TYPE "public"."enum_contact_blocks_stats_stats_color_token" AS ENUM('none', '212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_contact_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_contact_blocks_divider_spacing" AS ENUM('compact', 'normal', 'wide');
  CREATE TYPE "public"."enum_jobs_blocks_hero_variant" AS ENUM('default', 'split', 'fullscreen', 'slider-auto', 'slider-curated');
  CREATE TYPE "public"."enum_jobs_blocks_hero_division" AS ENUM('pictures-212', 'pictures-310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_jobs_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');
  CREATE TYPE "public"."enum_jobs_blocks_two_col_ratio" AS ENUM('1-3', '1-1', '1-2');
  CREATE TYPE "public"."enum_jobs_blocks_two_col_alignment" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_jobs_blocks_cta_buttons_variant" AS ENUM('solid', 'ghost', 'link');
  CREATE TYPE "public"."enum_jobs_blocks_quotes_layout" AS ENUM('stacked', 'carousel');
  CREATE TYPE "public"."enum_jobs_blocks_filmstrip_tiles_division" AS ENUM('none', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_jobs_blocks_filmstrip_source" AS ENUM('custom-media', 'from-projects');
  CREATE TYPE "public"."enum_jobs_blocks_filmstrip_format" AS ENUM('academy', 'super35', 'widescreen200', 'imax', 'v2-header', 'v2-footer');
  CREATE TYPE "public"."enum_jobs_blocks_filmstrip_project_filter" AS ENUM('all', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_jobs_blocks_division_showcase_divisions_color_token" AS ENUM('212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_jobs_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  CREATE TYPE "public"."enum_jobs_blocks_stats_stats_color_token" AS ENUM('none', '212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_jobs_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_jobs_blocks_divider_spacing" AS ENUM('compact', 'normal', 'wide');
  CREATE TYPE "public"."enum_pitch_blocks_hero_variant" AS ENUM('default', 'split', 'fullscreen', 'slider-auto', 'slider-curated');
  CREATE TYPE "public"."enum_pitch_blocks_hero_division" AS ENUM('pictures-212', 'pictures-310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_pitch_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');
  CREATE TYPE "public"."enum_pitch_blocks_two_col_ratio" AS ENUM('1-3', '1-1', '1-2');
  CREATE TYPE "public"."enum_pitch_blocks_two_col_alignment" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_pitch_blocks_cta_buttons_variant" AS ENUM('solid', 'ghost', 'link');
  CREATE TYPE "public"."enum_pitch_blocks_quotes_layout" AS ENUM('stacked', 'carousel');
  CREATE TYPE "public"."enum_pitch_blocks_filmstrip_tiles_division" AS ENUM('none', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_pitch_blocks_filmstrip_source" AS ENUM('custom-media', 'from-projects');
  CREATE TYPE "public"."enum_pitch_blocks_filmstrip_format" AS ENUM('academy', 'super35', 'widescreen200', 'imax', 'v2-header', 'v2-footer');
  CREATE TYPE "public"."enum_pitch_blocks_filmstrip_project_filter" AS ENUM('all', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_pitch_blocks_division_showcase_divisions_color_token" AS ENUM('212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_pitch_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  CREATE TYPE "public"."enum_pitch_blocks_stats_stats_color_token" AS ENUM('none', '212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_pitch_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pitch_blocks_divider_spacing" AS ENUM('compact', 'normal', 'wide');
  CREATE TYPE "public"."enum_investors_blocks_hero_variant" AS ENUM('default', 'split', 'fullscreen', 'slider-auto', 'slider-curated');
  CREATE TYPE "public"."enum_investors_blocks_hero_division" AS ENUM('pictures-212', 'pictures-310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_investors_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');
  CREATE TYPE "public"."enum_investors_blocks_two_col_ratio" AS ENUM('1-3', '1-1', '1-2');
  CREATE TYPE "public"."enum_investors_blocks_two_col_alignment" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_investors_blocks_cta_buttons_variant" AS ENUM('solid', 'ghost', 'link');
  CREATE TYPE "public"."enum_investors_blocks_quotes_layout" AS ENUM('stacked', 'carousel');
  CREATE TYPE "public"."enum_investors_blocks_filmstrip_tiles_division" AS ENUM('none', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_investors_blocks_filmstrip_source" AS ENUM('custom-media', 'from-projects');
  CREATE TYPE "public"."enum_investors_blocks_filmstrip_format" AS ENUM('academy', 'super35', 'widescreen200', 'imax', 'v2-header', 'v2-footer');
  CREATE TYPE "public"."enum_investors_blocks_filmstrip_project_filter" AS ENUM('all', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_investors_blocks_division_showcase_divisions_color_token" AS ENUM('212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_investors_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  CREATE TYPE "public"."enum_investors_blocks_stats_stats_color_token" AS ENUM('none', '212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_investors_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_investors_blocks_divider_spacing" AS ENUM('compact', 'normal', 'wide');
  CREATE TYPE "public"."enum_212_blocks_hero_variant" AS ENUM('default', 'split', 'fullscreen', 'slider-auto', 'slider-curated');
  CREATE TYPE "public"."enum_212_blocks_hero_division" AS ENUM('pictures-212', 'pictures-310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_212_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');
  CREATE TYPE "public"."enum_212_blocks_two_col_ratio" AS ENUM('1-3', '1-1', '1-2');
  CREATE TYPE "public"."enum_212_blocks_two_col_alignment" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_212_blocks_cta_buttons_variant" AS ENUM('solid', 'ghost', 'link');
  CREATE TYPE "public"."enum_212_blocks_quotes_layout" AS ENUM('stacked', 'carousel');
  CREATE TYPE "public"."enum_212_blocks_filmstrip_tiles_division" AS ENUM('none', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_212_blocks_filmstrip_source" AS ENUM('custom-media', 'from-projects');
  CREATE TYPE "public"."enum_212_blocks_filmstrip_format" AS ENUM('academy', 'super35', 'widescreen200', 'imax', 'v2-header', 'v2-footer');
  CREATE TYPE "public"."enum_212_blocks_filmstrip_project_filter" AS ENUM('all', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_212_blocks_division_showcase_divisions_color_token" AS ENUM('212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_212_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  CREATE TYPE "public"."enum_212_blocks_stats_stats_color_token" AS ENUM('none', '212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_212_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_212_blocks_divider_spacing" AS ENUM('compact', 'normal', 'wide');
  CREATE TYPE "public"."enum_310_blocks_hero_variant" AS ENUM('default', 'split', 'fullscreen', 'slider-auto', 'slider-curated');
  CREATE TYPE "public"."enum_310_blocks_hero_division" AS ENUM('pictures-212', 'pictures-310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_310_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');
  CREATE TYPE "public"."enum_310_blocks_two_col_ratio" AS ENUM('1-3', '1-1', '1-2');
  CREATE TYPE "public"."enum_310_blocks_two_col_alignment" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_310_blocks_cta_buttons_variant" AS ENUM('solid', 'ghost', 'link');
  CREATE TYPE "public"."enum_310_blocks_quotes_layout" AS ENUM('stacked', 'carousel');
  CREATE TYPE "public"."enum_310_blocks_filmstrip_tiles_division" AS ENUM('none', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_310_blocks_filmstrip_source" AS ENUM('custom-media', 'from-projects');
  CREATE TYPE "public"."enum_310_blocks_filmstrip_format" AS ENUM('academy', 'super35', 'widescreen200', 'imax', 'v2-header', 'v2-footer');
  CREATE TYPE "public"."enum_310_blocks_filmstrip_project_filter" AS ENUM('all', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_310_blocks_division_showcase_divisions_color_token" AS ENUM('212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_310_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  CREATE TYPE "public"."enum_310_blocks_stats_stats_color_token" AS ENUM('none', '212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_310_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_310_blocks_divider_spacing" AS ENUM('compact', 'normal', 'wide');
  CREATE TYPE "public"."enum_nrc_blocks_hero_variant" AS ENUM('default', 'split', 'fullscreen', 'slider-auto', 'slider-curated');
  CREATE TYPE "public"."enum_nrc_blocks_hero_division" AS ENUM('pictures-212', 'pictures-310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_nrc_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');
  CREATE TYPE "public"."enum_nrc_blocks_two_col_ratio" AS ENUM('1-3', '1-1', '1-2');
  CREATE TYPE "public"."enum_nrc_blocks_two_col_alignment" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_nrc_blocks_cta_buttons_variant" AS ENUM('solid', 'ghost', 'link');
  CREATE TYPE "public"."enum_nrc_blocks_quotes_layout" AS ENUM('stacked', 'carousel');
  CREATE TYPE "public"."enum_nrc_blocks_filmstrip_tiles_division" AS ENUM('none', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_nrc_blocks_filmstrip_source" AS ENUM('custom-media', 'from-projects');
  CREATE TYPE "public"."enum_nrc_blocks_filmstrip_format" AS ENUM('academy', 'super35', 'widescreen200', 'imax', 'v2-header', 'v2-footer');
  CREATE TYPE "public"."enum_nrc_blocks_filmstrip_project_filter" AS ENUM('all', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_nrc_blocks_division_showcase_divisions_color_token" AS ENUM('212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_nrc_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  CREATE TYPE "public"."enum_nrc_blocks_stats_stats_color_token" AS ENUM('none', '212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_nrc_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_nrc_blocks_divider_spacing" AS ENUM('compact', 'normal', 'wide');
  CREATE TABLE "212" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_logo_id" integer,
  	"footer_logo_id" integer,
  	"favicon_override_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "310" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_logo_id" integer,
  	"footer_logo_id" integer,
  	"favicon_override_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "projects_blocks_hero_slider_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"subtext" varchar
  );
  
  CREATE TABLE "projects_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"media_id" integer,
  	"variant" "enum_projects_blocks_hero_variant" DEFAULT 'default' NOT NULL,
  	"division" "enum_projects_blocks_hero_division" DEFAULT 'corporate' NOT NULL,
  	"lockup_logo_id" integer,
  	"watermark_logo_id" integer,
  	"watermark_opacity" numeric DEFAULT 0.15,
  	"watermark_position" "enum_projects_blocks_hero_watermark_position" DEFAULT 'bottom-right',
  	"watermark_show_on_mobile" boolean DEFAULT false,
  	"fade_duration" numeric DEFAULT 700,
  	"autoplay_delay" numeric DEFAULT 5000,
  	"show_indicator" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"mega_scale" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_two_col" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"ratio" "enum_projects_blocks_two_col_ratio" DEFAULT '1-3',
  	"alignment" "enum_projects_blocks_two_col_alignment" DEFAULT 'top',
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"description" jsonb
  );
  
  CREATE TABLE "projects_blocks_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_projects_blocks_cta_buttons_variant" DEFAULT 'solid' NOT NULL
  );
  
  CREATE TABLE "projects_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_quotes_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"attribution" varchar
  );
  
  CREATE TABLE "projects_blocks_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum_projects_blocks_quotes_layout" DEFAULT 'stacked' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_filmstrip_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"division" "enum_projects_blocks_filmstrip_tiles_division" DEFAULT 'none'
  );
  
  CREATE TABLE "projects_blocks_filmstrip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_projects_blocks_filmstrip_source" DEFAULT 'custom-media' NOT NULL,
  	"format" "enum_projects_blocks_filmstrip_format" DEFAULT 'super35',
  	"project_filter" "enum_projects_blocks_filmstrip_project_filter" DEFAULT 'all',
  	"show_perforations" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_division_showcase_divisions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"color_token" "enum_projects_blocks_division_showcase_divisions_color_token" DEFAULT '212-amber' NOT NULL,
  	"subtitle" varchar,
  	"description" varchar,
  	"media_id" integer
  );
  
  CREATE TABLE "projects_blocks_division_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_projects_blocks_division_showcase_variant" DEFAULT 'v0-baseline' NOT NULL,
  	"heading" varchar,
  	"subtext" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"color_token" "enum_projects_blocks_stats_stats_color_token" DEFAULT 'none'
  );
  
  CREATE TABLE "projects_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"columns" "enum_projects_blocks_stats_columns" DEFAULT '4' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"spacing" "enum_projects_blocks_divider_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"division" "enum_projects_division",
  	"subtitle" varchar,
  	"status" "enum_projects_status",
  	"year" varchar,
  	"hero_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "news_blocks_hero_slider_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"subtext" varchar
  );
  
  CREATE TABLE "news_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"media_id" integer,
  	"variant" "enum_news_blocks_hero_variant" DEFAULT 'default' NOT NULL,
  	"division" "enum_news_blocks_hero_division" DEFAULT 'corporate' NOT NULL,
  	"lockup_logo_id" integer,
  	"watermark_logo_id" integer,
  	"watermark_opacity" numeric DEFAULT 0.15,
  	"watermark_position" "enum_news_blocks_hero_watermark_position" DEFAULT 'bottom-right',
  	"watermark_show_on_mobile" boolean DEFAULT false,
  	"fade_duration" numeric DEFAULT 700,
  	"autoplay_delay" numeric DEFAULT 5000,
  	"show_indicator" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "news_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"mega_scale" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "news_blocks_two_col" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"ratio" "enum_news_blocks_two_col_ratio" DEFAULT '1-3',
  	"alignment" "enum_news_blocks_two_col_alignment" DEFAULT 'top',
  	"block_name" varchar
  );
  
  CREATE TABLE "news_blocks_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"description" jsonb
  );
  
  CREATE TABLE "news_blocks_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "news_blocks_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_news_blocks_cta_buttons_variant" DEFAULT 'solid' NOT NULL
  );
  
  CREATE TABLE "news_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "news_blocks_quotes_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"attribution" varchar
  );
  
  CREATE TABLE "news_blocks_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum_news_blocks_quotes_layout" DEFAULT 'stacked' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "news_blocks_filmstrip_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"division" "enum_news_blocks_filmstrip_tiles_division" DEFAULT 'none'
  );
  
  CREATE TABLE "news_blocks_filmstrip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_news_blocks_filmstrip_source" DEFAULT 'custom-media' NOT NULL,
  	"format" "enum_news_blocks_filmstrip_format" DEFAULT 'super35',
  	"project_filter" "enum_news_blocks_filmstrip_project_filter" DEFAULT 'all',
  	"show_perforations" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "news_blocks_division_showcase_divisions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"color_token" "enum_news_blocks_division_showcase_divisions_color_token" DEFAULT '212-amber' NOT NULL,
  	"subtitle" varchar,
  	"description" varchar,
  	"media_id" integer
  );
  
  CREATE TABLE "news_blocks_division_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_news_blocks_division_showcase_variant" DEFAULT 'v0-baseline' NOT NULL,
  	"heading" varchar,
  	"subtext" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "news_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"color_token" "enum_news_blocks_stats_stats_color_token" DEFAULT 'none'
  );
  
  CREATE TABLE "news_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"columns" "enum_news_blocks_stats_columns" DEFAULT '4' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "news_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"spacing" "enum_news_blocks_divider_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"date" timestamp(3) with time zone,
  	"deck" varchar,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_blocks_hero_slider_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"subtext" varchar
  );
  
  CREATE TABLE "about_blocks_hero_slider_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"subtext" varchar
  );
  
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
  	"lockup_logo_id" integer,
  	"watermark_logo_id" integer,
  	"watermark_opacity" numeric DEFAULT 0.15,
  	"watermark_position" "enum_about_blocks_hero_watermark_position" DEFAULT 'bottom-right',
  	"watermark_show_on_mobile" boolean DEFAULT false,
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
  	"format" "enum_about_blocks_filmstrip_format" DEFAULT 'super35',
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
  
  CREATE TABLE "contact_blocks_hero_slider_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"subtext" varchar
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
  	"lockup_logo_id" integer,
  	"watermark_logo_id" integer,
  	"watermark_opacity" numeric DEFAULT 0.15,
  	"watermark_position" "enum_contact_blocks_hero_watermark_position" DEFAULT 'bottom-right',
  	"watermark_show_on_mobile" boolean DEFAULT false,
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
  	"format" "enum_contact_blocks_filmstrip_format" DEFAULT 'super35',
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
  
  CREATE TABLE "jobs_blocks_hero_slider_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"subtext" varchar
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
  	"lockup_logo_id" integer,
  	"watermark_logo_id" integer,
  	"watermark_opacity" numeric DEFAULT 0.15,
  	"watermark_position" "enum_jobs_blocks_hero_watermark_position" DEFAULT 'bottom-right',
  	"watermark_show_on_mobile" boolean DEFAULT false,
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
  	"format" "enum_jobs_blocks_filmstrip_format" DEFAULT 'super35',
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
  
  CREATE TABLE "pitch_blocks_hero_slider_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"subtext" varchar
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
  	"lockup_logo_id" integer,
  	"watermark_logo_id" integer,
  	"watermark_opacity" numeric DEFAULT 0.15,
  	"watermark_position" "enum_pitch_blocks_hero_watermark_position" DEFAULT 'bottom-right',
  	"watermark_show_on_mobile" boolean DEFAULT false,
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
  	"format" "enum_pitch_blocks_filmstrip_format" DEFAULT 'super35',
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
  
  CREATE TABLE "investors_blocks_hero_slider_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"subtext" varchar
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
  	"lockup_logo_id" integer,
  	"watermark_logo_id" integer,
  	"watermark_opacity" numeric DEFAULT 0.15,
  	"watermark_position" "enum_investors_blocks_hero_watermark_position" DEFAULT 'bottom-right',
  	"watermark_show_on_mobile" boolean DEFAULT false,
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
  	"format" "enum_investors_blocks_filmstrip_format" DEFAULT 'super35',
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
  
  CREATE TABLE "212_blocks_hero_slider_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"subtext" varchar
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
  	"lockup_logo_id" integer,
  	"watermark_logo_id" integer,
  	"watermark_opacity" numeric DEFAULT 0.15,
  	"watermark_position" "enum_212_blocks_hero_watermark_position" DEFAULT 'bottom-right',
  	"watermark_show_on_mobile" boolean DEFAULT false,
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
  	"format" "enum_212_blocks_filmstrip_format" DEFAULT 'super35',
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
  
  CREATE TABLE "310_blocks_hero_slider_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"subtext" varchar
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
  	"lockup_logo_id" integer,
  	"watermark_logo_id" integer,
  	"watermark_opacity" numeric DEFAULT 0.15,
  	"watermark_position" "enum_310_blocks_hero_watermark_position" DEFAULT 'bottom-right',
  	"watermark_show_on_mobile" boolean DEFAULT false,
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
  	"format" "enum_310_blocks_filmstrip_format" DEFAULT 'super35',
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
  
  CREATE TABLE "nrc_blocks_hero_slider_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"subtext" varchar
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
  	"lockup_logo_id" integer,
  	"watermark_logo_id" integer,
  	"watermark_opacity" numeric DEFAULT 0.15,
  	"watermark_position" "enum_nrc_blocks_hero_watermark_position" DEFAULT 'bottom-right',
  	"watermark_show_on_mobile" boolean DEFAULT false,
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
  	"format" "enum_nrc_blocks_filmstrip_format" DEFAULT 'super35',
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
  
  CREATE TABLE "nrc" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_logo_id" integer,
  	"footer_logo_id" integer,
  	"favicon_override_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "media" ADD COLUMN "media_kind" "enum_media_media_kind";
  ALTER TABLE "media" ADD COLUMN "division_tag" "enum_media_division_tag";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "news_id" integer;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "lockup_logo_id" integer;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "watermark_logo_id" integer;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "watermark_opacity" numeric DEFAULT 0.15;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "watermark_position" "enum_home_blocks_hero_watermark_position" DEFAULT 'bottom-right';
  ALTER TABLE "home_blocks_hero" ADD COLUMN "watermark_show_on_mobile" boolean DEFAULT false;
  ALTER TABLE "home_blocks_filmstrip" ADD COLUMN "format" "enum_home_blocks_filmstrip_format" DEFAULT 'super35';
  ALTER TABLE "site_settings" ADD COLUMN "favicon_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "nav_logo_light_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "nav_logo_dark_id" integer;
  ALTER TABLE "212" ADD CONSTRAINT "212_header_logo_id_media_id_fk" FOREIGN KEY ("header_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "212" ADD CONSTRAINT "212_footer_logo_id_media_id_fk" FOREIGN KEY ("footer_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "212" ADD CONSTRAINT "212_favicon_override_id_media_id_fk" FOREIGN KEY ("favicon_override_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "310" ADD CONSTRAINT "310_header_logo_id_media_id_fk" FOREIGN KEY ("header_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "310" ADD CONSTRAINT "310_footer_logo_id_media_id_fk" FOREIGN KEY ("footer_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "310" ADD CONSTRAINT "310_favicon_override_id_media_id_fk" FOREIGN KEY ("favicon_override_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_hero_slider_items" ADD CONSTRAINT "projects_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_hero_slider_items" ADD CONSTRAINT "projects_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_hero" ADD CONSTRAINT "projects_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_hero" ADD CONSTRAINT "projects_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_hero" ADD CONSTRAINT "projects_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_hero" ADD CONSTRAINT "projects_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_rich_text" ADD CONSTRAINT "projects_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_two_col" ADD CONSTRAINT "projects_blocks_two_col_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_grid_items" ADD CONSTRAINT "projects_blocks_grid_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_grid_items" ADD CONSTRAINT "projects_blocks_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_grid" ADD CONSTRAINT "projects_blocks_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_cta_buttons" ADD CONSTRAINT "projects_blocks_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_cta" ADD CONSTRAINT "projects_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_quotes_quotes" ADD CONSTRAINT "projects_blocks_quotes_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_quotes" ADD CONSTRAINT "projects_blocks_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_filmstrip_tiles" ADD CONSTRAINT "projects_blocks_filmstrip_tiles_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_filmstrip_tiles" ADD CONSTRAINT "projects_blocks_filmstrip_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_filmstrip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_filmstrip" ADD CONSTRAINT "projects_blocks_filmstrip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_division_showcase_divisions" ADD CONSTRAINT "projects_blocks_division_showcase_divisions_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_division_showcase_divisions" ADD CONSTRAINT "projects_blocks_division_showcase_divisions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_division_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_division_showcase" ADD CONSTRAINT "projects_blocks_division_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_stats_stats" ADD CONSTRAINT "projects_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_stats" ADD CONSTRAINT "projects_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_divider" ADD CONSTRAINT "projects_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_blocks_hero_slider_items" ADD CONSTRAINT "news_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_blocks_hero_slider_items" ADD CONSTRAINT "news_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_hero" ADD CONSTRAINT "news_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_blocks_hero" ADD CONSTRAINT "news_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_blocks_hero" ADD CONSTRAINT "news_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_blocks_hero" ADD CONSTRAINT "news_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_rich_text" ADD CONSTRAINT "news_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_two_col" ADD CONSTRAINT "news_blocks_two_col_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_grid_items" ADD CONSTRAINT "news_blocks_grid_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_blocks_grid_items" ADD CONSTRAINT "news_blocks_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_grid" ADD CONSTRAINT "news_blocks_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_cta_buttons" ADD CONSTRAINT "news_blocks_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_cta" ADD CONSTRAINT "news_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_quotes_quotes" ADD CONSTRAINT "news_blocks_quotes_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_quotes" ADD CONSTRAINT "news_blocks_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_filmstrip_tiles" ADD CONSTRAINT "news_blocks_filmstrip_tiles_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_blocks_filmstrip_tiles" ADD CONSTRAINT "news_blocks_filmstrip_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_filmstrip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_filmstrip" ADD CONSTRAINT "news_blocks_filmstrip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_division_showcase_divisions" ADD CONSTRAINT "news_blocks_division_showcase_divisions_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_blocks_division_showcase_divisions" ADD CONSTRAINT "news_blocks_division_showcase_divisions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_division_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_division_showcase" ADD CONSTRAINT "news_blocks_division_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_stats_stats" ADD CONSTRAINT "news_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_stats" ADD CONSTRAINT "news_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_divider" ADD CONSTRAINT "news_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_slider_items" ADD CONSTRAINT "home_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_slider_items" ADD CONSTRAINT "home_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_hero_slider_items" ADD CONSTRAINT "about_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_blocks_hero_slider_items" ADD CONSTRAINT "about_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_hero" ADD CONSTRAINT "about_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_blocks_hero" ADD CONSTRAINT "about_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_blocks_hero" ADD CONSTRAINT "about_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
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
  ALTER TABLE "contact_blocks_hero_slider_items" ADD CONSTRAINT "contact_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_blocks_hero_slider_items" ADD CONSTRAINT "contact_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_hero" ADD CONSTRAINT "contact_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_blocks_hero" ADD CONSTRAINT "contact_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_blocks_hero" ADD CONSTRAINT "contact_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
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
  ALTER TABLE "jobs_blocks_hero_slider_items" ADD CONSTRAINT "jobs_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs_blocks_hero_slider_items" ADD CONSTRAINT "jobs_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_hero" ADD CONSTRAINT "jobs_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs_blocks_hero" ADD CONSTRAINT "jobs_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs_blocks_hero" ADD CONSTRAINT "jobs_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
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
  ALTER TABLE "pitch_blocks_hero_slider_items" ADD CONSTRAINT "pitch_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pitch_blocks_hero_slider_items" ADD CONSTRAINT "pitch_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_hero" ADD CONSTRAINT "pitch_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pitch_blocks_hero" ADD CONSTRAINT "pitch_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pitch_blocks_hero" ADD CONSTRAINT "pitch_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
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
  ALTER TABLE "investors_blocks_hero_slider_items" ADD CONSTRAINT "investors_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "investors_blocks_hero_slider_items" ADD CONSTRAINT "investors_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_hero" ADD CONSTRAINT "investors_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "investors_blocks_hero" ADD CONSTRAINT "investors_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "investors_blocks_hero" ADD CONSTRAINT "investors_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
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
  ALTER TABLE "212_blocks_hero_slider_items" ADD CONSTRAINT "212_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "212_blocks_hero_slider_items" ADD CONSTRAINT "212_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_hero" ADD CONSTRAINT "212_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "212_blocks_hero" ADD CONSTRAINT "212_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "212_blocks_hero" ADD CONSTRAINT "212_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
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
  ALTER TABLE "310_blocks_hero_slider_items" ADD CONSTRAINT "310_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "310_blocks_hero_slider_items" ADD CONSTRAINT "310_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_hero" ADD CONSTRAINT "310_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "310_blocks_hero" ADD CONSTRAINT "310_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "310_blocks_hero" ADD CONSTRAINT "310_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
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
  ALTER TABLE "nrc_blocks_hero_slider_items" ADD CONSTRAINT "nrc_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "nrc_blocks_hero_slider_items" ADD CONSTRAINT "nrc_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_hero" ADD CONSTRAINT "nrc_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "nrc_blocks_hero" ADD CONSTRAINT "nrc_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "nrc_blocks_hero" ADD CONSTRAINT "nrc_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
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
  ALTER TABLE "nrc" ADD CONSTRAINT "nrc_header_logo_id_media_id_fk" FOREIGN KEY ("header_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "nrc" ADD CONSTRAINT "nrc_footer_logo_id_media_id_fk" FOREIGN KEY ("footer_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "nrc" ADD CONSTRAINT "nrc_favicon_override_id_media_id_fk" FOREIGN KEY ("favicon_override_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "212_header_logo_idx" ON "212" USING btree ("header_logo_id");
  CREATE INDEX "212_footer_logo_idx" ON "212" USING btree ("footer_logo_id");
  CREATE INDEX "212_favicon_override_idx" ON "212" USING btree ("favicon_override_id");
  CREATE INDEX "310_header_logo_idx" ON "310" USING btree ("header_logo_id");
  CREATE INDEX "310_footer_logo_idx" ON "310" USING btree ("footer_logo_id");
  CREATE INDEX "310_favicon_override_idx" ON "310" USING btree ("favicon_override_id");
  CREATE INDEX "projects_blocks_hero_slider_items_order_idx" ON "projects_blocks_hero_slider_items" USING btree ("_order");
  CREATE INDEX "projects_blocks_hero_slider_items_parent_id_idx" ON "projects_blocks_hero_slider_items" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_hero_slider_items_media_idx" ON "projects_blocks_hero_slider_items" USING btree ("media_id");
  CREATE INDEX "projects_blocks_hero_order_idx" ON "projects_blocks_hero" USING btree ("_order");
  CREATE INDEX "projects_blocks_hero_parent_id_idx" ON "projects_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_hero_path_idx" ON "projects_blocks_hero" USING btree ("_path");
  CREATE INDEX "projects_blocks_hero_media_idx" ON "projects_blocks_hero" USING btree ("media_id");
  CREATE INDEX "projects_blocks_hero_lockup_logo_idx" ON "projects_blocks_hero" USING btree ("lockup_logo_id");
  CREATE INDEX "projects_blocks_hero_watermark_logo_idx" ON "projects_blocks_hero" USING btree ("watermark_logo_id");
  CREATE INDEX "projects_blocks_rich_text_order_idx" ON "projects_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "projects_blocks_rich_text_parent_id_idx" ON "projects_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_rich_text_path_idx" ON "projects_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "projects_blocks_two_col_order_idx" ON "projects_blocks_two_col" USING btree ("_order");
  CREATE INDEX "projects_blocks_two_col_parent_id_idx" ON "projects_blocks_two_col" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_two_col_path_idx" ON "projects_blocks_two_col" USING btree ("_path");
  CREATE INDEX "projects_blocks_grid_items_order_idx" ON "projects_blocks_grid_items" USING btree ("_order");
  CREATE INDEX "projects_blocks_grid_items_parent_id_idx" ON "projects_blocks_grid_items" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_grid_items_media_idx" ON "projects_blocks_grid_items" USING btree ("media_id");
  CREATE INDEX "projects_blocks_grid_order_idx" ON "projects_blocks_grid" USING btree ("_order");
  CREATE INDEX "projects_blocks_grid_parent_id_idx" ON "projects_blocks_grid" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_grid_path_idx" ON "projects_blocks_grid" USING btree ("_path");
  CREATE INDEX "projects_blocks_cta_buttons_order_idx" ON "projects_blocks_cta_buttons" USING btree ("_order");
  CREATE INDEX "projects_blocks_cta_buttons_parent_id_idx" ON "projects_blocks_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_cta_order_idx" ON "projects_blocks_cta" USING btree ("_order");
  CREATE INDEX "projects_blocks_cta_parent_id_idx" ON "projects_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_cta_path_idx" ON "projects_blocks_cta" USING btree ("_path");
  CREATE INDEX "projects_blocks_quotes_quotes_order_idx" ON "projects_blocks_quotes_quotes" USING btree ("_order");
  CREATE INDEX "projects_blocks_quotes_quotes_parent_id_idx" ON "projects_blocks_quotes_quotes" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_quotes_order_idx" ON "projects_blocks_quotes" USING btree ("_order");
  CREATE INDEX "projects_blocks_quotes_parent_id_idx" ON "projects_blocks_quotes" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_quotes_path_idx" ON "projects_blocks_quotes" USING btree ("_path");
  CREATE INDEX "projects_blocks_filmstrip_tiles_order_idx" ON "projects_blocks_filmstrip_tiles" USING btree ("_order");
  CREATE INDEX "projects_blocks_filmstrip_tiles_parent_id_idx" ON "projects_blocks_filmstrip_tiles" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_filmstrip_tiles_media_idx" ON "projects_blocks_filmstrip_tiles" USING btree ("media_id");
  CREATE INDEX "projects_blocks_filmstrip_order_idx" ON "projects_blocks_filmstrip" USING btree ("_order");
  CREATE INDEX "projects_blocks_filmstrip_parent_id_idx" ON "projects_blocks_filmstrip" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_filmstrip_path_idx" ON "projects_blocks_filmstrip" USING btree ("_path");
  CREATE INDEX "projects_blocks_division_showcase_divisions_order_idx" ON "projects_blocks_division_showcase_divisions" USING btree ("_order");
  CREATE INDEX "projects_blocks_division_showcase_divisions_parent_id_idx" ON "projects_blocks_division_showcase_divisions" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_division_showcase_divisions_media_idx" ON "projects_blocks_division_showcase_divisions" USING btree ("media_id");
  CREATE INDEX "projects_blocks_division_showcase_order_idx" ON "projects_blocks_division_showcase" USING btree ("_order");
  CREATE INDEX "projects_blocks_division_showcase_parent_id_idx" ON "projects_blocks_division_showcase" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_division_showcase_path_idx" ON "projects_blocks_division_showcase" USING btree ("_path");
  CREATE INDEX "projects_blocks_stats_stats_order_idx" ON "projects_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "projects_blocks_stats_stats_parent_id_idx" ON "projects_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_stats_order_idx" ON "projects_blocks_stats" USING btree ("_order");
  CREATE INDEX "projects_blocks_stats_parent_id_idx" ON "projects_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_stats_path_idx" ON "projects_blocks_stats" USING btree ("_path");
  CREATE INDEX "projects_blocks_divider_order_idx" ON "projects_blocks_divider" USING btree ("_order");
  CREATE INDEX "projects_blocks_divider_parent_id_idx" ON "projects_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_divider_path_idx" ON "projects_blocks_divider" USING btree ("_path");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_hero_image_idx" ON "projects" USING btree ("hero_image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "news_blocks_hero_slider_items_order_idx" ON "news_blocks_hero_slider_items" USING btree ("_order");
  CREATE INDEX "news_blocks_hero_slider_items_parent_id_idx" ON "news_blocks_hero_slider_items" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_hero_slider_items_media_idx" ON "news_blocks_hero_slider_items" USING btree ("media_id");
  CREATE INDEX "news_blocks_hero_order_idx" ON "news_blocks_hero" USING btree ("_order");
  CREATE INDEX "news_blocks_hero_parent_id_idx" ON "news_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_hero_path_idx" ON "news_blocks_hero" USING btree ("_path");
  CREATE INDEX "news_blocks_hero_media_idx" ON "news_blocks_hero" USING btree ("media_id");
  CREATE INDEX "news_blocks_hero_lockup_logo_idx" ON "news_blocks_hero" USING btree ("lockup_logo_id");
  CREATE INDEX "news_blocks_hero_watermark_logo_idx" ON "news_blocks_hero" USING btree ("watermark_logo_id");
  CREATE INDEX "news_blocks_rich_text_order_idx" ON "news_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "news_blocks_rich_text_parent_id_idx" ON "news_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_rich_text_path_idx" ON "news_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "news_blocks_two_col_order_idx" ON "news_blocks_two_col" USING btree ("_order");
  CREATE INDEX "news_blocks_two_col_parent_id_idx" ON "news_blocks_two_col" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_two_col_path_idx" ON "news_blocks_two_col" USING btree ("_path");
  CREATE INDEX "news_blocks_grid_items_order_idx" ON "news_blocks_grid_items" USING btree ("_order");
  CREATE INDEX "news_blocks_grid_items_parent_id_idx" ON "news_blocks_grid_items" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_grid_items_media_idx" ON "news_blocks_grid_items" USING btree ("media_id");
  CREATE INDEX "news_blocks_grid_order_idx" ON "news_blocks_grid" USING btree ("_order");
  CREATE INDEX "news_blocks_grid_parent_id_idx" ON "news_blocks_grid" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_grid_path_idx" ON "news_blocks_grid" USING btree ("_path");
  CREATE INDEX "news_blocks_cta_buttons_order_idx" ON "news_blocks_cta_buttons" USING btree ("_order");
  CREATE INDEX "news_blocks_cta_buttons_parent_id_idx" ON "news_blocks_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_cta_order_idx" ON "news_blocks_cta" USING btree ("_order");
  CREATE INDEX "news_blocks_cta_parent_id_idx" ON "news_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_cta_path_idx" ON "news_blocks_cta" USING btree ("_path");
  CREATE INDEX "news_blocks_quotes_quotes_order_idx" ON "news_blocks_quotes_quotes" USING btree ("_order");
  CREATE INDEX "news_blocks_quotes_quotes_parent_id_idx" ON "news_blocks_quotes_quotes" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_quotes_order_idx" ON "news_blocks_quotes" USING btree ("_order");
  CREATE INDEX "news_blocks_quotes_parent_id_idx" ON "news_blocks_quotes" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_quotes_path_idx" ON "news_blocks_quotes" USING btree ("_path");
  CREATE INDEX "news_blocks_filmstrip_tiles_order_idx" ON "news_blocks_filmstrip_tiles" USING btree ("_order");
  CREATE INDEX "news_blocks_filmstrip_tiles_parent_id_idx" ON "news_blocks_filmstrip_tiles" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_filmstrip_tiles_media_idx" ON "news_blocks_filmstrip_tiles" USING btree ("media_id");
  CREATE INDEX "news_blocks_filmstrip_order_idx" ON "news_blocks_filmstrip" USING btree ("_order");
  CREATE INDEX "news_blocks_filmstrip_parent_id_idx" ON "news_blocks_filmstrip" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_filmstrip_path_idx" ON "news_blocks_filmstrip" USING btree ("_path");
  CREATE INDEX "news_blocks_division_showcase_divisions_order_idx" ON "news_blocks_division_showcase_divisions" USING btree ("_order");
  CREATE INDEX "news_blocks_division_showcase_divisions_parent_id_idx" ON "news_blocks_division_showcase_divisions" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_division_showcase_divisions_media_idx" ON "news_blocks_division_showcase_divisions" USING btree ("media_id");
  CREATE INDEX "news_blocks_division_showcase_order_idx" ON "news_blocks_division_showcase" USING btree ("_order");
  CREATE INDEX "news_blocks_division_showcase_parent_id_idx" ON "news_blocks_division_showcase" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_division_showcase_path_idx" ON "news_blocks_division_showcase" USING btree ("_path");
  CREATE INDEX "news_blocks_stats_stats_order_idx" ON "news_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "news_blocks_stats_stats_parent_id_idx" ON "news_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_stats_order_idx" ON "news_blocks_stats" USING btree ("_order");
  CREATE INDEX "news_blocks_stats_parent_id_idx" ON "news_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_stats_path_idx" ON "news_blocks_stats" USING btree ("_path");
  CREATE INDEX "news_blocks_divider_order_idx" ON "news_blocks_divider" USING btree ("_order");
  CREATE INDEX "news_blocks_divider_parent_id_idx" ON "news_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_divider_path_idx" ON "news_blocks_divider" USING btree ("_path");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "home_blocks_hero_slider_items_order_idx" ON "home_blocks_hero_slider_items" USING btree ("_order");
  CREATE INDEX "home_blocks_hero_slider_items_parent_id_idx" ON "home_blocks_hero_slider_items" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_hero_slider_items_media_idx" ON "home_blocks_hero_slider_items" USING btree ("media_id");
  CREATE INDEX "about_blocks_hero_slider_items_order_idx" ON "about_blocks_hero_slider_items" USING btree ("_order");
  CREATE INDEX "about_blocks_hero_slider_items_parent_id_idx" ON "about_blocks_hero_slider_items" USING btree ("_parent_id");
  CREATE INDEX "about_blocks_hero_slider_items_media_idx" ON "about_blocks_hero_slider_items" USING btree ("media_id");
  CREATE INDEX "about_blocks_hero_order_idx" ON "about_blocks_hero" USING btree ("_order");
  CREATE INDEX "about_blocks_hero_parent_id_idx" ON "about_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "about_blocks_hero_path_idx" ON "about_blocks_hero" USING btree ("_path");
  CREATE INDEX "about_blocks_hero_media_idx" ON "about_blocks_hero" USING btree ("media_id");
  CREATE INDEX "about_blocks_hero_lockup_logo_idx" ON "about_blocks_hero" USING btree ("lockup_logo_id");
  CREATE INDEX "about_blocks_hero_watermark_logo_idx" ON "about_blocks_hero" USING btree ("watermark_logo_id");
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
  CREATE INDEX "contact_blocks_hero_slider_items_order_idx" ON "contact_blocks_hero_slider_items" USING btree ("_order");
  CREATE INDEX "contact_blocks_hero_slider_items_parent_id_idx" ON "contact_blocks_hero_slider_items" USING btree ("_parent_id");
  CREATE INDEX "contact_blocks_hero_slider_items_media_idx" ON "contact_blocks_hero_slider_items" USING btree ("media_id");
  CREATE INDEX "contact_blocks_hero_order_idx" ON "contact_blocks_hero" USING btree ("_order");
  CREATE INDEX "contact_blocks_hero_parent_id_idx" ON "contact_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "contact_blocks_hero_path_idx" ON "contact_blocks_hero" USING btree ("_path");
  CREATE INDEX "contact_blocks_hero_media_idx" ON "contact_blocks_hero" USING btree ("media_id");
  CREATE INDEX "contact_blocks_hero_lockup_logo_idx" ON "contact_blocks_hero" USING btree ("lockup_logo_id");
  CREATE INDEX "contact_blocks_hero_watermark_logo_idx" ON "contact_blocks_hero" USING btree ("watermark_logo_id");
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
  CREATE INDEX "jobs_blocks_hero_slider_items_order_idx" ON "jobs_blocks_hero_slider_items" USING btree ("_order");
  CREATE INDEX "jobs_blocks_hero_slider_items_parent_id_idx" ON "jobs_blocks_hero_slider_items" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_hero_slider_items_media_idx" ON "jobs_blocks_hero_slider_items" USING btree ("media_id");
  CREATE INDEX "jobs_blocks_hero_order_idx" ON "jobs_blocks_hero" USING btree ("_order");
  CREATE INDEX "jobs_blocks_hero_parent_id_idx" ON "jobs_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_hero_path_idx" ON "jobs_blocks_hero" USING btree ("_path");
  CREATE INDEX "jobs_blocks_hero_media_idx" ON "jobs_blocks_hero" USING btree ("media_id");
  CREATE INDEX "jobs_blocks_hero_lockup_logo_idx" ON "jobs_blocks_hero" USING btree ("lockup_logo_id");
  CREATE INDEX "jobs_blocks_hero_watermark_logo_idx" ON "jobs_blocks_hero" USING btree ("watermark_logo_id");
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
  CREATE INDEX "pitch_blocks_hero_slider_items_order_idx" ON "pitch_blocks_hero_slider_items" USING btree ("_order");
  CREATE INDEX "pitch_blocks_hero_slider_items_parent_id_idx" ON "pitch_blocks_hero_slider_items" USING btree ("_parent_id");
  CREATE INDEX "pitch_blocks_hero_slider_items_media_idx" ON "pitch_blocks_hero_slider_items" USING btree ("media_id");
  CREATE INDEX "pitch_blocks_hero_order_idx" ON "pitch_blocks_hero" USING btree ("_order");
  CREATE INDEX "pitch_blocks_hero_parent_id_idx" ON "pitch_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pitch_blocks_hero_path_idx" ON "pitch_blocks_hero" USING btree ("_path");
  CREATE INDEX "pitch_blocks_hero_media_idx" ON "pitch_blocks_hero" USING btree ("media_id");
  CREATE INDEX "pitch_blocks_hero_lockup_logo_idx" ON "pitch_blocks_hero" USING btree ("lockup_logo_id");
  CREATE INDEX "pitch_blocks_hero_watermark_logo_idx" ON "pitch_blocks_hero" USING btree ("watermark_logo_id");
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
  CREATE INDEX "investors_blocks_hero_slider_items_order_idx" ON "investors_blocks_hero_slider_items" USING btree ("_order");
  CREATE INDEX "investors_blocks_hero_slider_items_parent_id_idx" ON "investors_blocks_hero_slider_items" USING btree ("_parent_id");
  CREATE INDEX "investors_blocks_hero_slider_items_media_idx" ON "investors_blocks_hero_slider_items" USING btree ("media_id");
  CREATE INDEX "investors_blocks_hero_order_idx" ON "investors_blocks_hero" USING btree ("_order");
  CREATE INDEX "investors_blocks_hero_parent_id_idx" ON "investors_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "investors_blocks_hero_path_idx" ON "investors_blocks_hero" USING btree ("_path");
  CREATE INDEX "investors_blocks_hero_media_idx" ON "investors_blocks_hero" USING btree ("media_id");
  CREATE INDEX "investors_blocks_hero_lockup_logo_idx" ON "investors_blocks_hero" USING btree ("lockup_logo_id");
  CREATE INDEX "investors_blocks_hero_watermark_logo_idx" ON "investors_blocks_hero" USING btree ("watermark_logo_id");
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
  CREATE INDEX "investors_blocks_divider_path_idx" ON "investors_blocks_divider" USING btree ("_path");
  CREATE INDEX "212_blocks_hero_slider_items_order_idx" ON "212_blocks_hero_slider_items" USING btree ("_order");
  CREATE INDEX "212_blocks_hero_slider_items_parent_id_idx" ON "212_blocks_hero_slider_items" USING btree ("_parent_id");
  CREATE INDEX "212_blocks_hero_slider_items_media_idx" ON "212_blocks_hero_slider_items" USING btree ("media_id");
  CREATE INDEX "212_blocks_hero_order_idx" ON "212_blocks_hero" USING btree ("_order");
  CREATE INDEX "212_blocks_hero_parent_id_idx" ON "212_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "212_blocks_hero_path_idx" ON "212_blocks_hero" USING btree ("_path");
  CREATE INDEX "212_blocks_hero_media_idx" ON "212_blocks_hero" USING btree ("media_id");
  CREATE INDEX "212_blocks_hero_lockup_logo_idx" ON "212_blocks_hero" USING btree ("lockup_logo_id");
  CREATE INDEX "212_blocks_hero_watermark_logo_idx" ON "212_blocks_hero" USING btree ("watermark_logo_id");
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
  CREATE INDEX "310_blocks_hero_slider_items_order_idx" ON "310_blocks_hero_slider_items" USING btree ("_order");
  CREATE INDEX "310_blocks_hero_slider_items_parent_id_idx" ON "310_blocks_hero_slider_items" USING btree ("_parent_id");
  CREATE INDEX "310_blocks_hero_slider_items_media_idx" ON "310_blocks_hero_slider_items" USING btree ("media_id");
  CREATE INDEX "310_blocks_hero_order_idx" ON "310_blocks_hero" USING btree ("_order");
  CREATE INDEX "310_blocks_hero_parent_id_idx" ON "310_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "310_blocks_hero_path_idx" ON "310_blocks_hero" USING btree ("_path");
  CREATE INDEX "310_blocks_hero_media_idx" ON "310_blocks_hero" USING btree ("media_id");
  CREATE INDEX "310_blocks_hero_lockup_logo_idx" ON "310_blocks_hero" USING btree ("lockup_logo_id");
  CREATE INDEX "310_blocks_hero_watermark_logo_idx" ON "310_blocks_hero" USING btree ("watermark_logo_id");
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
  CREATE INDEX "nrc_blocks_hero_slider_items_order_idx" ON "nrc_blocks_hero_slider_items" USING btree ("_order");
  CREATE INDEX "nrc_blocks_hero_slider_items_parent_id_idx" ON "nrc_blocks_hero_slider_items" USING btree ("_parent_id");
  CREATE INDEX "nrc_blocks_hero_slider_items_media_idx" ON "nrc_blocks_hero_slider_items" USING btree ("media_id");
  CREATE INDEX "nrc_blocks_hero_order_idx" ON "nrc_blocks_hero" USING btree ("_order");
  CREATE INDEX "nrc_blocks_hero_parent_id_idx" ON "nrc_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "nrc_blocks_hero_path_idx" ON "nrc_blocks_hero" USING btree ("_path");
  CREATE INDEX "nrc_blocks_hero_media_idx" ON "nrc_blocks_hero" USING btree ("media_id");
  CREATE INDEX "nrc_blocks_hero_lockup_logo_idx" ON "nrc_blocks_hero" USING btree ("lockup_logo_id");
  CREATE INDEX "nrc_blocks_hero_watermark_logo_idx" ON "nrc_blocks_hero" USING btree ("watermark_logo_id");
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
  CREATE INDEX "nrc_blocks_divider_path_idx" ON "nrc_blocks_divider" USING btree ("_path");
  CREATE INDEX "nrc_header_logo_idx" ON "nrc" USING btree ("header_logo_id");
  CREATE INDEX "nrc_footer_logo_idx" ON "nrc" USING btree ("footer_logo_id");
  CREATE INDEX "nrc_favicon_override_idx" ON "nrc" USING btree ("favicon_override_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero" ADD CONSTRAINT "home_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_hero" ADD CONSTRAINT "home_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_nav_logo_light_id_media_id_fk" FOREIGN KEY ("nav_logo_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_nav_logo_dark_id_media_id_fk" FOREIGN KEY ("nav_logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "home_blocks_hero_lockup_logo_idx" ON "home_blocks_hero" USING btree ("lockup_logo_id");
  CREATE INDEX "home_blocks_hero_watermark_logo_idx" ON "home_blocks_hero" USING btree ("watermark_logo_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_nav_logo_light_idx" ON "site_settings" USING btree ("nav_logo_light_id");
  CREATE INDEX "site_settings_nav_logo_dark_idx" ON "site_settings" USING btree ("nav_logo_dark_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "212" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "310" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_hero_slider_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_two_col" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_cta_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_quotes_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_filmstrip_tiles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_filmstrip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_division_showcase_divisions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_division_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_stats_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_divider" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_hero_slider_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_two_col" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_cta_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_quotes_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_filmstrip_tiles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_filmstrip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_division_showcase_divisions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_division_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_stats_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_divider" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_hero_slider_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_blocks_hero_slider_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_blocks_two_col" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_blocks_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_blocks_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_blocks_cta_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_blocks_quotes_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_blocks_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_blocks_filmstrip_tiles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_blocks_filmstrip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_blocks_division_showcase_divisions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_blocks_division_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_blocks_stats_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_blocks_divider" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_blocks_hero_slider_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_blocks_two_col" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_blocks_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_blocks_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_blocks_cta_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_blocks_quotes_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_blocks_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_blocks_filmstrip_tiles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_blocks_filmstrip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_blocks_division_showcase_divisions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_blocks_division_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_blocks_stats_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_blocks_divider" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs_blocks_hero_slider_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs_blocks_two_col" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs_blocks_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs_blocks_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs_blocks_cta_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs_blocks_quotes_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs_blocks_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs_blocks_filmstrip_tiles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs_blocks_filmstrip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs_blocks_division_showcase_divisions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs_blocks_division_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs_blocks_stats_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs_blocks_divider" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pitch_blocks_hero_slider_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pitch_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pitch_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pitch_blocks_two_col" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pitch_blocks_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pitch_blocks_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pitch_blocks_cta_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pitch_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pitch_blocks_quotes_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pitch_blocks_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pitch_blocks_filmstrip_tiles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pitch_blocks_filmstrip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pitch_blocks_division_showcase_divisions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pitch_blocks_division_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pitch_blocks_stats_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pitch_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pitch_blocks_divider" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pitch" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investors_blocks_hero_slider_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investors_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investors_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investors_blocks_two_col" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investors_blocks_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investors_blocks_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investors_blocks_cta_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investors_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investors_blocks_quotes_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investors_blocks_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investors_blocks_filmstrip_tiles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investors_blocks_filmstrip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investors_blocks_division_showcase_divisions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investors_blocks_division_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investors_blocks_stats_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investors_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investors_blocks_divider" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "212_blocks_hero_slider_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "212_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "212_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "212_blocks_two_col" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "212_blocks_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "212_blocks_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "212_blocks_cta_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "212_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "212_blocks_quotes_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "212_blocks_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "212_blocks_filmstrip_tiles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "212_blocks_filmstrip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "212_blocks_division_showcase_divisions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "212_blocks_division_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "212_blocks_stats_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "212_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "212_blocks_divider" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "310_blocks_hero_slider_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "310_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "310_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "310_blocks_two_col" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "310_blocks_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "310_blocks_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "310_blocks_cta_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "310_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "310_blocks_quotes_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "310_blocks_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "310_blocks_filmstrip_tiles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "310_blocks_filmstrip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "310_blocks_division_showcase_divisions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "310_blocks_division_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "310_blocks_stats_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "310_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "310_blocks_divider" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nrc_blocks_hero_slider_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nrc_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nrc_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nrc_blocks_two_col" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nrc_blocks_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nrc_blocks_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nrc_blocks_cta_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nrc_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nrc_blocks_quotes_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nrc_blocks_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nrc_blocks_filmstrip_tiles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nrc_blocks_filmstrip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nrc_blocks_division_showcase_divisions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nrc_blocks_division_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nrc_blocks_stats_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nrc_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nrc_blocks_divider" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nrc" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "212" CASCADE;
  DROP TABLE "310" CASCADE;
  DROP TABLE "projects_blocks_hero_slider_items" CASCADE;
  DROP TABLE "projects_blocks_hero" CASCADE;
  DROP TABLE "projects_blocks_rich_text" CASCADE;
  DROP TABLE "projects_blocks_two_col" CASCADE;
  DROP TABLE "projects_blocks_grid_items" CASCADE;
  DROP TABLE "projects_blocks_grid" CASCADE;
  DROP TABLE "projects_blocks_cta_buttons" CASCADE;
  DROP TABLE "projects_blocks_cta" CASCADE;
  DROP TABLE "projects_blocks_quotes_quotes" CASCADE;
  DROP TABLE "projects_blocks_quotes" CASCADE;
  DROP TABLE "projects_blocks_filmstrip_tiles" CASCADE;
  DROP TABLE "projects_blocks_filmstrip" CASCADE;
  DROP TABLE "projects_blocks_division_showcase_divisions" CASCADE;
  DROP TABLE "projects_blocks_division_showcase" CASCADE;
  DROP TABLE "projects_blocks_stats_stats" CASCADE;
  DROP TABLE "projects_blocks_stats" CASCADE;
  DROP TABLE "projects_blocks_divider" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "news_blocks_hero_slider_items" CASCADE;
  DROP TABLE "news_blocks_hero" CASCADE;
  DROP TABLE "news_blocks_rich_text" CASCADE;
  DROP TABLE "news_blocks_two_col" CASCADE;
  DROP TABLE "news_blocks_grid_items" CASCADE;
  DROP TABLE "news_blocks_grid" CASCADE;
  DROP TABLE "news_blocks_cta_buttons" CASCADE;
  DROP TABLE "news_blocks_cta" CASCADE;
  DROP TABLE "news_blocks_quotes_quotes" CASCADE;
  DROP TABLE "news_blocks_quotes" CASCADE;
  DROP TABLE "news_blocks_filmstrip_tiles" CASCADE;
  DROP TABLE "news_blocks_filmstrip" CASCADE;
  DROP TABLE "news_blocks_division_showcase_divisions" CASCADE;
  DROP TABLE "news_blocks_division_showcase" CASCADE;
  DROP TABLE "news_blocks_stats_stats" CASCADE;
  DROP TABLE "news_blocks_stats" CASCADE;
  DROP TABLE "news_blocks_divider" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "home_blocks_hero_slider_items" CASCADE;
  DROP TABLE "about_blocks_hero_slider_items" CASCADE;
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
  DROP TABLE "contact_blocks_hero_slider_items" CASCADE;
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
  DROP TABLE "jobs_blocks_hero_slider_items" CASCADE;
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
  DROP TABLE "pitch_blocks_hero_slider_items" CASCADE;
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
  DROP TABLE "investors_blocks_hero_slider_items" CASCADE;
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
  DROP TABLE "212_blocks_hero_slider_items" CASCADE;
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
  DROP TABLE "310_blocks_hero_slider_items" CASCADE;
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
  DROP TABLE "nrc_blocks_hero_slider_items" CASCADE;
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
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_news_fk";
  
  ALTER TABLE "home_blocks_hero" DROP CONSTRAINT "home_blocks_hero_lockup_logo_id_media_id_fk";
  
  ALTER TABLE "home_blocks_hero" DROP CONSTRAINT "home_blocks_hero_watermark_logo_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_favicon_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_nav_logo_light_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_nav_logo_dark_id_media_id_fk";
  
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  DROP INDEX "payload_locked_documents_rels_news_id_idx";
  DROP INDEX "home_blocks_hero_lockup_logo_idx";
  DROP INDEX "home_blocks_hero_watermark_logo_idx";
  DROP INDEX "site_settings_favicon_idx";
  DROP INDEX "site_settings_nav_logo_light_idx";
  DROP INDEX "site_settings_nav_logo_dark_idx";
  ALTER TABLE "media" DROP COLUMN "media_kind";
  ALTER TABLE "media" DROP COLUMN "division_tag";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "news_id";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "lockup_logo_id";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "watermark_logo_id";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "watermark_opacity";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "watermark_position";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "watermark_show_on_mobile";
  ALTER TABLE "home_blocks_filmstrip" DROP COLUMN "format";
  ALTER TABLE "site_settings" DROP COLUMN "favicon_id";
  ALTER TABLE "site_settings" DROP COLUMN "nav_logo_light_id";
  ALTER TABLE "site_settings" DROP COLUMN "nav_logo_dark_id";
  DROP TYPE "public"."enum_media_media_kind";
  DROP TYPE "public"."enum_media_division_tag";
  DROP TYPE "public"."enum_projects_blocks_hero_variant";
  DROP TYPE "public"."enum_projects_blocks_hero_division";
  DROP TYPE "public"."enum_projects_blocks_hero_watermark_position";
  DROP TYPE "public"."enum_projects_blocks_two_col_ratio";
  DROP TYPE "public"."enum_projects_blocks_two_col_alignment";
  DROP TYPE "public"."enum_projects_blocks_cta_buttons_variant";
  DROP TYPE "public"."enum_projects_blocks_quotes_layout";
  DROP TYPE "public"."enum_projects_blocks_filmstrip_tiles_division";
  DROP TYPE "public"."enum_projects_blocks_filmstrip_source";
  DROP TYPE "public"."enum_projects_blocks_filmstrip_format";
  DROP TYPE "public"."enum_projects_blocks_filmstrip_project_filter";
  DROP TYPE "public"."enum_projects_blocks_division_showcase_divisions_color_token";
  DROP TYPE "public"."enum_projects_blocks_division_showcase_variant";
  DROP TYPE "public"."enum_projects_blocks_stats_stats_color_token";
  DROP TYPE "public"."enum_projects_blocks_stats_columns";
  DROP TYPE "public"."enum_projects_blocks_divider_spacing";
  DROP TYPE "public"."enum_projects_division";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum_news_blocks_hero_variant";
  DROP TYPE "public"."enum_news_blocks_hero_division";
  DROP TYPE "public"."enum_news_blocks_hero_watermark_position";
  DROP TYPE "public"."enum_news_blocks_two_col_ratio";
  DROP TYPE "public"."enum_news_blocks_two_col_alignment";
  DROP TYPE "public"."enum_news_blocks_cta_buttons_variant";
  DROP TYPE "public"."enum_news_blocks_quotes_layout";
  DROP TYPE "public"."enum_news_blocks_filmstrip_tiles_division";
  DROP TYPE "public"."enum_news_blocks_filmstrip_source";
  DROP TYPE "public"."enum_news_blocks_filmstrip_format";
  DROP TYPE "public"."enum_news_blocks_filmstrip_project_filter";
  DROP TYPE "public"."enum_news_blocks_division_showcase_divisions_color_token";
  DROP TYPE "public"."enum_news_blocks_division_showcase_variant";
  DROP TYPE "public"."enum_news_blocks_stats_stats_color_token";
  DROP TYPE "public"."enum_news_blocks_stats_columns";
  DROP TYPE "public"."enum_news_blocks_divider_spacing";
  DROP TYPE "public"."enum_home_blocks_hero_watermark_position";
  DROP TYPE "public"."enum_home_blocks_filmstrip_format";
  DROP TYPE "public"."enum_about_blocks_hero_variant";
  DROP TYPE "public"."enum_about_blocks_hero_division";
  DROP TYPE "public"."enum_about_blocks_hero_watermark_position";
  DROP TYPE "public"."enum_about_blocks_two_col_ratio";
  DROP TYPE "public"."enum_about_blocks_two_col_alignment";
  DROP TYPE "public"."enum_about_blocks_cta_buttons_variant";
  DROP TYPE "public"."enum_about_blocks_quotes_layout";
  DROP TYPE "public"."enum_about_blocks_filmstrip_tiles_division";
  DROP TYPE "public"."enum_about_blocks_filmstrip_source";
  DROP TYPE "public"."enum_about_blocks_filmstrip_format";
  DROP TYPE "public"."enum_about_blocks_filmstrip_project_filter";
  DROP TYPE "public"."enum_about_blocks_division_showcase_divisions_color_token";
  DROP TYPE "public"."enum_about_blocks_division_showcase_variant";
  DROP TYPE "public"."enum_about_blocks_stats_stats_color_token";
  DROP TYPE "public"."enum_about_blocks_stats_columns";
  DROP TYPE "public"."enum_about_blocks_divider_spacing";
  DROP TYPE "public"."enum_contact_blocks_hero_variant";
  DROP TYPE "public"."enum_contact_blocks_hero_division";
  DROP TYPE "public"."enum_contact_blocks_hero_watermark_position";
  DROP TYPE "public"."enum_contact_blocks_two_col_ratio";
  DROP TYPE "public"."enum_contact_blocks_two_col_alignment";
  DROP TYPE "public"."enum_contact_blocks_cta_buttons_variant";
  DROP TYPE "public"."enum_contact_blocks_quotes_layout";
  DROP TYPE "public"."enum_contact_blocks_filmstrip_tiles_division";
  DROP TYPE "public"."enum_contact_blocks_filmstrip_source";
  DROP TYPE "public"."enum_contact_blocks_filmstrip_format";
  DROP TYPE "public"."enum_contact_blocks_filmstrip_project_filter";
  DROP TYPE "public"."enum_contact_blocks_division_showcase_divisions_color_token";
  DROP TYPE "public"."enum_contact_blocks_division_showcase_variant";
  DROP TYPE "public"."enum_contact_blocks_stats_stats_color_token";
  DROP TYPE "public"."enum_contact_blocks_stats_columns";
  DROP TYPE "public"."enum_contact_blocks_divider_spacing";
  DROP TYPE "public"."enum_jobs_blocks_hero_variant";
  DROP TYPE "public"."enum_jobs_blocks_hero_division";
  DROP TYPE "public"."enum_jobs_blocks_hero_watermark_position";
  DROP TYPE "public"."enum_jobs_blocks_two_col_ratio";
  DROP TYPE "public"."enum_jobs_blocks_two_col_alignment";
  DROP TYPE "public"."enum_jobs_blocks_cta_buttons_variant";
  DROP TYPE "public"."enum_jobs_blocks_quotes_layout";
  DROP TYPE "public"."enum_jobs_blocks_filmstrip_tiles_division";
  DROP TYPE "public"."enum_jobs_blocks_filmstrip_source";
  DROP TYPE "public"."enum_jobs_blocks_filmstrip_format";
  DROP TYPE "public"."enum_jobs_blocks_filmstrip_project_filter";
  DROP TYPE "public"."enum_jobs_blocks_division_showcase_divisions_color_token";
  DROP TYPE "public"."enum_jobs_blocks_division_showcase_variant";
  DROP TYPE "public"."enum_jobs_blocks_stats_stats_color_token";
  DROP TYPE "public"."enum_jobs_blocks_stats_columns";
  DROP TYPE "public"."enum_jobs_blocks_divider_spacing";
  DROP TYPE "public"."enum_pitch_blocks_hero_variant";
  DROP TYPE "public"."enum_pitch_blocks_hero_division";
  DROP TYPE "public"."enum_pitch_blocks_hero_watermark_position";
  DROP TYPE "public"."enum_pitch_blocks_two_col_ratio";
  DROP TYPE "public"."enum_pitch_blocks_two_col_alignment";
  DROP TYPE "public"."enum_pitch_blocks_cta_buttons_variant";
  DROP TYPE "public"."enum_pitch_blocks_quotes_layout";
  DROP TYPE "public"."enum_pitch_blocks_filmstrip_tiles_division";
  DROP TYPE "public"."enum_pitch_blocks_filmstrip_source";
  DROP TYPE "public"."enum_pitch_blocks_filmstrip_format";
  DROP TYPE "public"."enum_pitch_blocks_filmstrip_project_filter";
  DROP TYPE "public"."enum_pitch_blocks_division_showcase_divisions_color_token";
  DROP TYPE "public"."enum_pitch_blocks_division_showcase_variant";
  DROP TYPE "public"."enum_pitch_blocks_stats_stats_color_token";
  DROP TYPE "public"."enum_pitch_blocks_stats_columns";
  DROP TYPE "public"."enum_pitch_blocks_divider_spacing";
  DROP TYPE "public"."enum_investors_blocks_hero_variant";
  DROP TYPE "public"."enum_investors_blocks_hero_division";
  DROP TYPE "public"."enum_investors_blocks_hero_watermark_position";
  DROP TYPE "public"."enum_investors_blocks_two_col_ratio";
  DROP TYPE "public"."enum_investors_blocks_two_col_alignment";
  DROP TYPE "public"."enum_investors_blocks_cta_buttons_variant";
  DROP TYPE "public"."enum_investors_blocks_quotes_layout";
  DROP TYPE "public"."enum_investors_blocks_filmstrip_tiles_division";
  DROP TYPE "public"."enum_investors_blocks_filmstrip_source";
  DROP TYPE "public"."enum_investors_blocks_filmstrip_format";
  DROP TYPE "public"."enum_investors_blocks_filmstrip_project_filter";
  DROP TYPE "public"."enum_investors_blocks_division_showcase_divisions_color_token";
  DROP TYPE "public"."enum_investors_blocks_division_showcase_variant";
  DROP TYPE "public"."enum_investors_blocks_stats_stats_color_token";
  DROP TYPE "public"."enum_investors_blocks_stats_columns";
  DROP TYPE "public"."enum_investors_blocks_divider_spacing";
  DROP TYPE "public"."enum_212_blocks_hero_variant";
  DROP TYPE "public"."enum_212_blocks_hero_division";
  DROP TYPE "public"."enum_212_blocks_hero_watermark_position";
  DROP TYPE "public"."enum_212_blocks_two_col_ratio";
  DROP TYPE "public"."enum_212_blocks_two_col_alignment";
  DROP TYPE "public"."enum_212_blocks_cta_buttons_variant";
  DROP TYPE "public"."enum_212_blocks_quotes_layout";
  DROP TYPE "public"."enum_212_blocks_filmstrip_tiles_division";
  DROP TYPE "public"."enum_212_blocks_filmstrip_source";
  DROP TYPE "public"."enum_212_blocks_filmstrip_format";
  DROP TYPE "public"."enum_212_blocks_filmstrip_project_filter";
  DROP TYPE "public"."enum_212_blocks_division_showcase_divisions_color_token";
  DROP TYPE "public"."enum_212_blocks_division_showcase_variant";
  DROP TYPE "public"."enum_212_blocks_stats_stats_color_token";
  DROP TYPE "public"."enum_212_blocks_stats_columns";
  DROP TYPE "public"."enum_212_blocks_divider_spacing";
  DROP TYPE "public"."enum_310_blocks_hero_variant";
  DROP TYPE "public"."enum_310_blocks_hero_division";
  DROP TYPE "public"."enum_310_blocks_hero_watermark_position";
  DROP TYPE "public"."enum_310_blocks_two_col_ratio";
  DROP TYPE "public"."enum_310_blocks_two_col_alignment";
  DROP TYPE "public"."enum_310_blocks_cta_buttons_variant";
  DROP TYPE "public"."enum_310_blocks_quotes_layout";
  DROP TYPE "public"."enum_310_blocks_filmstrip_tiles_division";
  DROP TYPE "public"."enum_310_blocks_filmstrip_source";
  DROP TYPE "public"."enum_310_blocks_filmstrip_format";
  DROP TYPE "public"."enum_310_blocks_filmstrip_project_filter";
  DROP TYPE "public"."enum_310_blocks_division_showcase_divisions_color_token";
  DROP TYPE "public"."enum_310_blocks_division_showcase_variant";
  DROP TYPE "public"."enum_310_blocks_stats_stats_color_token";
  DROP TYPE "public"."enum_310_blocks_stats_columns";
  DROP TYPE "public"."enum_310_blocks_divider_spacing";
  DROP TYPE "public"."enum_nrc_blocks_hero_variant";
  DROP TYPE "public"."enum_nrc_blocks_hero_division";
  DROP TYPE "public"."enum_nrc_blocks_hero_watermark_position";
  DROP TYPE "public"."enum_nrc_blocks_two_col_ratio";
  DROP TYPE "public"."enum_nrc_blocks_two_col_alignment";
  DROP TYPE "public"."enum_nrc_blocks_cta_buttons_variant";
  DROP TYPE "public"."enum_nrc_blocks_quotes_layout";
  DROP TYPE "public"."enum_nrc_blocks_filmstrip_tiles_division";
  DROP TYPE "public"."enum_nrc_blocks_filmstrip_source";
  DROP TYPE "public"."enum_nrc_blocks_filmstrip_format";
  DROP TYPE "public"."enum_nrc_blocks_filmstrip_project_filter";
  DROP TYPE "public"."enum_nrc_blocks_division_showcase_divisions_color_token";
  DROP TYPE "public"."enum_nrc_blocks_division_showcase_variant";
  DROP TYPE "public"."enum_nrc_blocks_stats_stats_color_token";
  DROP TYPE "public"."enum_nrc_blocks_stats_columns";
  DROP TYPE "public"."enum_nrc_blocks_divider_spacing";`)
}
