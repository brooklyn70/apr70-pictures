import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_blocks_hero_variant" AS ENUM('default', 'split', 'fullscreen', 'slider-auto', 'slider-curated');
  CREATE TYPE "public"."enum_home_blocks_hero_division" AS ENUM('pictures-212', 'pictures-310', 'nrc', 'corporate');
  CREATE TYPE "public"."enum_home_blocks_two_col_ratio" AS ENUM('1-3', '1-1', '1-2');
  CREATE TYPE "public"."enum_home_blocks_two_col_alignment" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_home_blocks_cta_buttons_variant" AS ENUM('solid', 'ghost', 'link');
  CREATE TYPE "public"."enum_home_blocks_quotes_layout" AS ENUM('stacked', 'carousel');
  CREATE TYPE "public"."enum_home_blocks_filmstrip_tiles_division" AS ENUM('none', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_home_blocks_filmstrip_source" AS ENUM('custom-media', 'from-projects');
  CREATE TYPE "public"."enum_home_blocks_filmstrip_project_filter" AS ENUM('all', '212', '310', 'nrc');
  CREATE TYPE "public"."enum_home_blocks_division_showcase_divisions_color_token" AS ENUM('212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_home_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  CREATE TYPE "public"."enum_home_blocks_stats_stats_color_token" AS ENUM('none', '212-amber', '212-sicilian-orange', '310-imax', 'nrc-grey', '310-sicilian-blue', 'nrc-navy');
  CREATE TYPE "public"."enum_home_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_home_blocks_divider_spacing" AS ENUM('compact', 'normal', 'wide');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"media_id" integer,
  	"variant" "enum_home_blocks_hero_variant" DEFAULT 'default' NOT NULL,
  	"division" "enum_home_blocks_hero_division" DEFAULT 'corporate' NOT NULL,
  	"fade_duration" numeric DEFAULT 700,
  	"autoplay_delay" numeric DEFAULT 5000,
  	"show_indicator" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"mega_scale" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_two_col" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"ratio" "enum_home_blocks_two_col_ratio" DEFAULT '1-3',
  	"alignment" "enum_home_blocks_two_col_alignment" DEFAULT 'top',
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"description" jsonb
  );
  
  CREATE TABLE "home_blocks_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_home_blocks_cta_buttons_variant" DEFAULT 'solid' NOT NULL
  );
  
  CREATE TABLE "home_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_quotes_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"attribution" varchar
  );
  
  CREATE TABLE "home_blocks_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum_home_blocks_quotes_layout" DEFAULT 'stacked' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_filmstrip_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"division" "enum_home_blocks_filmstrip_tiles_division" DEFAULT 'none'
  );
  
  CREATE TABLE "home_blocks_filmstrip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_home_blocks_filmstrip_source" DEFAULT 'custom-media' NOT NULL,
  	"project_filter" "enum_home_blocks_filmstrip_project_filter" DEFAULT 'all',
  	"show_perforations" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_division_showcase_divisions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"color_token" "enum_home_blocks_division_showcase_divisions_color_token" DEFAULT '212-amber' NOT NULL,
  	"subtitle" varchar,
  	"description" varchar,
  	"media_id" integer
  );
  
  CREATE TABLE "home_blocks_division_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_home_blocks_division_showcase_variant" DEFAULT 'v0-baseline' NOT NULL,
  	"heading" varchar,
  	"subtext" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"color_token" "enum_home_blocks_stats_stats_color_token" DEFAULT 'none'
  );
  
  CREATE TABLE "home_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"columns" "enum_home_blocks_stats_columns" DEFAULT '4' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"spacing" "enum_home_blocks_divider_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_label" varchar DEFAULT 'APR 70 Pictures' NOT NULL,
  	"legal_entity" varchar DEFAULT 'APR 70 Pictures LLC' NOT NULL,
  	"tagline" varchar,
  	"show_filmstrip_rails" boolean DEFAULT true,
  	"last_deployed" timestamp(3) with time zone,
  	"seeded_version" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_links_primary_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "footer_links_division_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "footer_links_more_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "footer_links" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero" ADD CONSTRAINT "home_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_hero" ADD CONSTRAINT "home_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_rich_text" ADD CONSTRAINT "home_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_two_col" ADD CONSTRAINT "home_blocks_two_col_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_grid_items" ADD CONSTRAINT "home_blocks_grid_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_grid_items" ADD CONSTRAINT "home_blocks_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_grid" ADD CONSTRAINT "home_blocks_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_cta_buttons" ADD CONSTRAINT "home_blocks_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_cta" ADD CONSTRAINT "home_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_quotes_quotes" ADD CONSTRAINT "home_blocks_quotes_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_quotes" ADD CONSTRAINT "home_blocks_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_filmstrip_tiles" ADD CONSTRAINT "home_blocks_filmstrip_tiles_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_filmstrip_tiles" ADD CONSTRAINT "home_blocks_filmstrip_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_filmstrip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_filmstrip" ADD CONSTRAINT "home_blocks_filmstrip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_division_showcase_divisions" ADD CONSTRAINT "home_blocks_division_showcase_divisions_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_division_showcase_divisions" ADD CONSTRAINT "home_blocks_division_showcase_divisions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_division_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_division_showcase" ADD CONSTRAINT "home_blocks_division_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_stats_stats" ADD CONSTRAINT "home_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_stats" ADD CONSTRAINT "home_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_divider" ADD CONSTRAINT "home_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_links_primary_nav" ADD CONSTRAINT "footer_links_primary_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_links_division_nav" ADD CONSTRAINT "footer_links_division_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_links_more_nav" ADD CONSTRAINT "footer_links_more_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_links"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_blocks_hero_order_idx" ON "home_blocks_hero" USING btree ("_order");
  CREATE INDEX "home_blocks_hero_parent_id_idx" ON "home_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_hero_path_idx" ON "home_blocks_hero" USING btree ("_path");
  CREATE INDEX "home_blocks_hero_media_idx" ON "home_blocks_hero" USING btree ("media_id");
  CREATE INDEX "home_blocks_rich_text_order_idx" ON "home_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "home_blocks_rich_text_parent_id_idx" ON "home_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_rich_text_path_idx" ON "home_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "home_blocks_two_col_order_idx" ON "home_blocks_two_col" USING btree ("_order");
  CREATE INDEX "home_blocks_two_col_parent_id_idx" ON "home_blocks_two_col" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_two_col_path_idx" ON "home_blocks_two_col" USING btree ("_path");
  CREATE INDEX "home_blocks_grid_items_order_idx" ON "home_blocks_grid_items" USING btree ("_order");
  CREATE INDEX "home_blocks_grid_items_parent_id_idx" ON "home_blocks_grid_items" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_grid_items_media_idx" ON "home_blocks_grid_items" USING btree ("media_id");
  CREATE INDEX "home_blocks_grid_order_idx" ON "home_blocks_grid" USING btree ("_order");
  CREATE INDEX "home_blocks_grid_parent_id_idx" ON "home_blocks_grid" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_grid_path_idx" ON "home_blocks_grid" USING btree ("_path");
  CREATE INDEX "home_blocks_cta_buttons_order_idx" ON "home_blocks_cta_buttons" USING btree ("_order");
  CREATE INDEX "home_blocks_cta_buttons_parent_id_idx" ON "home_blocks_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_cta_order_idx" ON "home_blocks_cta" USING btree ("_order");
  CREATE INDEX "home_blocks_cta_parent_id_idx" ON "home_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_cta_path_idx" ON "home_blocks_cta" USING btree ("_path");
  CREATE INDEX "home_blocks_quotes_quotes_order_idx" ON "home_blocks_quotes_quotes" USING btree ("_order");
  CREATE INDEX "home_blocks_quotes_quotes_parent_id_idx" ON "home_blocks_quotes_quotes" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_quotes_order_idx" ON "home_blocks_quotes" USING btree ("_order");
  CREATE INDEX "home_blocks_quotes_parent_id_idx" ON "home_blocks_quotes" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_quotes_path_idx" ON "home_blocks_quotes" USING btree ("_path");
  CREATE INDEX "home_blocks_filmstrip_tiles_order_idx" ON "home_blocks_filmstrip_tiles" USING btree ("_order");
  CREATE INDEX "home_blocks_filmstrip_tiles_parent_id_idx" ON "home_blocks_filmstrip_tiles" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_filmstrip_tiles_media_idx" ON "home_blocks_filmstrip_tiles" USING btree ("media_id");
  CREATE INDEX "home_blocks_filmstrip_order_idx" ON "home_blocks_filmstrip" USING btree ("_order");
  CREATE INDEX "home_blocks_filmstrip_parent_id_idx" ON "home_blocks_filmstrip" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_filmstrip_path_idx" ON "home_blocks_filmstrip" USING btree ("_path");
  CREATE INDEX "home_blocks_division_showcase_divisions_order_idx" ON "home_blocks_division_showcase_divisions" USING btree ("_order");
  CREATE INDEX "home_blocks_division_showcase_divisions_parent_id_idx" ON "home_blocks_division_showcase_divisions" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_division_showcase_divisions_media_idx" ON "home_blocks_division_showcase_divisions" USING btree ("media_id");
  CREATE INDEX "home_blocks_division_showcase_order_idx" ON "home_blocks_division_showcase" USING btree ("_order");
  CREATE INDEX "home_blocks_division_showcase_parent_id_idx" ON "home_blocks_division_showcase" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_division_showcase_path_idx" ON "home_blocks_division_showcase" USING btree ("_path");
  CREATE INDEX "home_blocks_stats_stats_order_idx" ON "home_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "home_blocks_stats_stats_parent_id_idx" ON "home_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_stats_order_idx" ON "home_blocks_stats" USING btree ("_order");
  CREATE INDEX "home_blocks_stats_parent_id_idx" ON "home_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_stats_path_idx" ON "home_blocks_stats" USING btree ("_path");
  CREATE INDEX "home_blocks_divider_order_idx" ON "home_blocks_divider" USING btree ("_order");
  CREATE INDEX "home_blocks_divider_parent_id_idx" ON "home_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_divider_path_idx" ON "home_blocks_divider" USING btree ("_path");
  CREATE INDEX "footer_links_primary_nav_order_idx" ON "footer_links_primary_nav" USING btree ("_order");
  CREATE INDEX "footer_links_primary_nav_parent_id_idx" ON "footer_links_primary_nav" USING btree ("_parent_id");
  CREATE INDEX "footer_links_division_nav_order_idx" ON "footer_links_division_nav" USING btree ("_order");
  CREATE INDEX "footer_links_division_nav_parent_id_idx" ON "footer_links_division_nav" USING btree ("_parent_id");
  CREATE INDEX "footer_links_more_nav_order_idx" ON "footer_links_more_nav" USING btree ("_order");
  CREATE INDEX "footer_links_more_nav_parent_id_idx" ON "footer_links_more_nav" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home_blocks_hero" CASCADE;
  DROP TABLE "home_blocks_rich_text" CASCADE;
  DROP TABLE "home_blocks_two_col" CASCADE;
  DROP TABLE "home_blocks_grid_items" CASCADE;
  DROP TABLE "home_blocks_grid" CASCADE;
  DROP TABLE "home_blocks_cta_buttons" CASCADE;
  DROP TABLE "home_blocks_cta" CASCADE;
  DROP TABLE "home_blocks_quotes_quotes" CASCADE;
  DROP TABLE "home_blocks_quotes" CASCADE;
  DROP TABLE "home_blocks_filmstrip_tiles" CASCADE;
  DROP TABLE "home_blocks_filmstrip" CASCADE;
  DROP TABLE "home_blocks_division_showcase_divisions" CASCADE;
  DROP TABLE "home_blocks_division_showcase" CASCADE;
  DROP TABLE "home_blocks_stats_stats" CASCADE;
  DROP TABLE "home_blocks_stats" CASCADE;
  DROP TABLE "home_blocks_divider" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "footer_links_primary_nav" CASCADE;
  DROP TABLE "footer_links_division_nav" CASCADE;
  DROP TABLE "footer_links_more_nav" CASCADE;
  DROP TABLE "footer_links" CASCADE;
  DROP TYPE "public"."enum_home_blocks_hero_variant";
  DROP TYPE "public"."enum_home_blocks_hero_division";
  DROP TYPE "public"."enum_home_blocks_two_col_ratio";
  DROP TYPE "public"."enum_home_blocks_two_col_alignment";
  DROP TYPE "public"."enum_home_blocks_cta_buttons_variant";
  DROP TYPE "public"."enum_home_blocks_quotes_layout";
  DROP TYPE "public"."enum_home_blocks_filmstrip_tiles_division";
  DROP TYPE "public"."enum_home_blocks_filmstrip_source";
  DROP TYPE "public"."enum_home_blocks_filmstrip_project_filter";
  DROP TYPE "public"."enum_home_blocks_division_showcase_divisions_color_token";
  DROP TYPE "public"."enum_home_blocks_division_showcase_variant";
  DROP TYPE "public"."enum_home_blocks_stats_stats_color_token";
  DROP TYPE "public"."enum_home_blocks_stats_columns";
  DROP TYPE "public"."enum_home_blocks_divider_spacing";`)
}
