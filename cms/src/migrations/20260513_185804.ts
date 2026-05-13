import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_blocks_hero_variant" AS ENUM('default', 'split', 'fullscreen', 'slider-auto', 'slider-curated');
  CREATE TYPE "public"."enum_projects_blocks_hero_division" AS ENUM('pictures-212', 'pictures-310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_projects_blocks_two_col_ratio" AS ENUM('1-3', '1-1', '1-2');
  CREATE TYPE "public"."enum_projects_blocks_two_col_alignment" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_projects_blocks_cta_buttons_variant" AS ENUM('solid', 'ghost', 'link');
  CREATE TYPE "public"."enum_projects_blocks_quotes_layout" AS ENUM('stacked', 'carousel');
  CREATE TYPE "public"."enum_projects_blocks_filmstrip_tiles_division" AS ENUM('none', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_projects_blocks_filmstrip_source" AS ENUM('custom-media', 'from-projects');
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
  CREATE TYPE "public"."enum_news_blocks_two_col_ratio" AS ENUM('1-3', '1-1', '1-2');
  CREATE TYPE "public"."enum_news_blocks_two_col_alignment" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_news_blocks_cta_buttons_variant" AS ENUM('solid', 'ghost', 'link');
  CREATE TYPE "public"."enum_news_blocks_quotes_layout" AS ENUM('stacked', 'carousel');
  CREATE TYPE "public"."enum_news_blocks_filmstrip_tiles_division" AS ENUM('none', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_news_blocks_filmstrip_source" AS ENUM('custom-media', 'from-projects');
  CREATE TYPE "public"."enum_news_blocks_filmstrip_project_filter" AS ENUM('all', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_news_blocks_division_showcase_divisions_color_token" AS ENUM('212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_news_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  CREATE TYPE "public"."enum_news_blocks_stats_stats_color_token" AS ENUM('none', '212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_news_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_news_blocks_divider_spacing" AS ENUM('compact', 'normal', 'wide');
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
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "news_id" integer;
  ALTER TABLE "projects_blocks_hero" ADD CONSTRAINT "projects_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
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
  ALTER TABLE "news_blocks_hero" ADD CONSTRAINT "news_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
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
  CREATE INDEX "projects_blocks_hero_order_idx" ON "projects_blocks_hero" USING btree ("_order");
  CREATE INDEX "projects_blocks_hero_parent_id_idx" ON "projects_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_hero_path_idx" ON "projects_blocks_hero" USING btree ("_path");
  CREATE INDEX "projects_blocks_hero_media_idx" ON "projects_blocks_hero" USING btree ("media_id");
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
  CREATE INDEX "news_blocks_hero_order_idx" ON "news_blocks_hero" USING btree ("_order");
  CREATE INDEX "news_blocks_hero_parent_id_idx" ON "news_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_hero_path_idx" ON "news_blocks_hero" USING btree ("_path");
  CREATE INDEX "news_blocks_hero_media_idx" ON "news_blocks_hero" USING btree ("media_id");
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
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
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
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_news_fk";
  
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  DROP INDEX "payload_locked_documents_rels_news_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "news_id";
  DROP TYPE "public"."enum_projects_blocks_hero_variant";
  DROP TYPE "public"."enum_projects_blocks_hero_division";
  DROP TYPE "public"."enum_projects_blocks_two_col_ratio";
  DROP TYPE "public"."enum_projects_blocks_two_col_alignment";
  DROP TYPE "public"."enum_projects_blocks_cta_buttons_variant";
  DROP TYPE "public"."enum_projects_blocks_quotes_layout";
  DROP TYPE "public"."enum_projects_blocks_filmstrip_tiles_division";
  DROP TYPE "public"."enum_projects_blocks_filmstrip_source";
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
  DROP TYPE "public"."enum_news_blocks_two_col_ratio";
  DROP TYPE "public"."enum_news_blocks_two_col_alignment";
  DROP TYPE "public"."enum_news_blocks_cta_buttons_variant";
  DROP TYPE "public"."enum_news_blocks_quotes_layout";
  DROP TYPE "public"."enum_news_blocks_filmstrip_tiles_division";
  DROP TYPE "public"."enum_news_blocks_filmstrip_source";
  DROP TYPE "public"."enum_news_blocks_filmstrip_project_filter";
  DROP TYPE "public"."enum_news_blocks_division_showcase_divisions_color_token";
  DROP TYPE "public"."enum_news_blocks_division_showcase_variant";
  DROP TYPE "public"."enum_news_blocks_stats_stats_color_token";
  DROP TYPE "public"."enum_news_blocks_stats_columns";
  DROP TYPE "public"."enum_news_blocks_divider_spacing";`)
}
