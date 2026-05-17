import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   -- New enum types (media kind/tag)
   CREATE TYPE "public"."enum_media_media_kind" AS ENUM('logo', 'favicon', 'wordmark', 'watermark', 'photo');
   CREATE TYPE "public"."enum_media_division_tag" AS ENUM('212', '310', 'nrc', 'corporate');

   -- New enum types (watermark position per global)
   CREATE TYPE "public"."enum_projects_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');
   CREATE TYPE "public"."enum_news_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');
   CREATE TYPE "public"."enum_home_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');
   CREATE TYPE "public"."enum_about_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');
   CREATE TYPE "public"."enum_contact_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');
   CREATE TYPE "public"."enum_jobs_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');
   CREATE TYPE "public"."enum_pitch_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');
   CREATE TYPE "public"."enum_investors_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');
   CREATE TYPE "public"."enum_212_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');
   CREATE TYPE "public"."enum_310_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');
   CREATE TYPE "public"."enum_nrc_blocks_hero_watermark_position" AS ENUM('bottom-right', 'bottom-left', 'center', 'top-right');

   -- New enum types (filmstrip format per global)
   CREATE TYPE "public"."enum_projects_blocks_filmstrip_format" AS ENUM('academy', 'super35', 'widescreen200', 'imax', 'v2-header', 'v2-footer');
   CREATE TYPE "public"."enum_news_blocks_filmstrip_format" AS ENUM('academy', 'super35', 'widescreen200', 'imax', 'v2-header', 'v2-footer');
   CREATE TYPE "public"."enum_home_blocks_filmstrip_format" AS ENUM('academy', 'super35', 'widescreen200', 'imax', 'v2-header', 'v2-footer');
   CREATE TYPE "public"."enum_about_blocks_filmstrip_format" AS ENUM('academy', 'super35', 'widescreen200', 'imax', 'v2-header', 'v2-footer');
   CREATE TYPE "public"."enum_contact_blocks_filmstrip_format" AS ENUM('academy', 'super35', 'widescreen200', 'imax', 'v2-header', 'v2-footer');
   CREATE TYPE "public"."enum_jobs_blocks_filmstrip_format" AS ENUM('academy', 'super35', 'widescreen200', 'imax', 'v2-header', 'v2-footer');
   CREATE TYPE "public"."enum_pitch_blocks_filmstrip_format" AS ENUM('academy', 'super35', 'widescreen200', 'imax', 'v2-header', 'v2-footer');
   CREATE TYPE "public"."enum_investors_blocks_filmstrip_format" AS ENUM('academy', 'super35', 'widescreen200', 'imax', 'v2-header', 'v2-footer');
   CREATE TYPE "public"."enum_212_blocks_filmstrip_format" AS ENUM('academy', 'super35', 'widescreen200', 'imax', 'v2-header', 'v2-footer');
   CREATE TYPE "public"."enum_310_blocks_filmstrip_format" AS ENUM('academy', 'super35', 'widescreen200', 'imax', 'v2-header', 'v2-footer');
   CREATE TYPE "public"."enum_nrc_blocks_filmstrip_format" AS ENUM('academy', 'super35', 'widescreen200', 'imax', 'v2-header', 'v2-footer');

   -- New hero slider items tables (one per global)
   CREATE TABLE "projects_blocks_hero_slider_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "media_id" integer,
    "title" varchar,
    "subtext" varchar
   );
   CREATE TABLE "news_blocks_hero_slider_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "media_id" integer,
    "title" varchar,
    "subtext" varchar
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
   CREATE TABLE "contact_blocks_hero_slider_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "media_id" integer,
    "title" varchar,
    "subtext" varchar
   );
   CREATE TABLE "jobs_blocks_hero_slider_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "media_id" integer,
    "title" varchar,
    "subtext" varchar
   );
   CREATE TABLE "pitch_blocks_hero_slider_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "media_id" integer,
    "title" varchar,
    "subtext" varchar
   );
   CREATE TABLE "investors_blocks_hero_slider_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "media_id" integer,
    "title" varchar,
    "subtext" varchar
   );
   CREATE TABLE "212_blocks_hero_slider_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "media_id" integer,
    "title" varchar,
    "subtext" varchar
   );
   CREATE TABLE "310_blocks_hero_slider_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "media_id" integer,
    "title" varchar,
    "subtext" varchar
   );
   CREATE TABLE "nrc_blocks_hero_slider_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "media_id" integer,
    "title" varchar,
    "subtext" varchar
   );

   -- media: new brand metadata columns
   ALTER TABLE "media" ADD COLUMN "media_kind" "enum_media_media_kind";
   ALTER TABLE "media" ADD COLUMN "division_tag" "enum_media_division_tag";

   -- division globals: logo columns
   ALTER TABLE "212" ADD COLUMN "header_logo_id" integer;
   ALTER TABLE "212" ADD COLUMN "footer_logo_id" integer;
   ALTER TABLE "212" ADD COLUMN "favicon_override_id" integer;
   ALTER TABLE "310" ADD COLUMN "header_logo_id" integer;
   ALTER TABLE "310" ADD COLUMN "footer_logo_id" integer;
   ALTER TABLE "310" ADD COLUMN "favicon_override_id" integer;
   ALTER TABLE "nrc" ADD COLUMN "header_logo_id" integer;
   ALTER TABLE "nrc" ADD COLUMN "footer_logo_id" integer;
   ALTER TABLE "nrc" ADD COLUMN "favicon_override_id" integer;

   -- site_settings: brand logo columns
   ALTER TABLE "site_settings" ADD COLUMN "favicon_id" integer;
   ALTER TABLE "site_settings" ADD COLUMN "nav_logo_light_id" integer;
   ALTER TABLE "site_settings" ADD COLUMN "nav_logo_dark_id" integer;

   -- hero blocks: lockup + watermark columns (all globals)
   ALTER TABLE "home_blocks_hero" ADD COLUMN "lockup_logo_id" integer;
   ALTER TABLE "home_blocks_hero" ADD COLUMN "watermark_logo_id" integer;
   ALTER TABLE "home_blocks_hero" ADD COLUMN "watermark_opacity" numeric DEFAULT 0.15;
   ALTER TABLE "home_blocks_hero" ADD COLUMN "watermark_position" "enum_home_blocks_hero_watermark_position" DEFAULT 'bottom-right';
   ALTER TABLE "home_blocks_hero" ADD COLUMN "watermark_show_on_mobile" boolean DEFAULT false;

   ALTER TABLE "projects_blocks_hero" ADD COLUMN "lockup_logo_id" integer;
   ALTER TABLE "projects_blocks_hero" ADD COLUMN "watermark_logo_id" integer;
   ALTER TABLE "projects_blocks_hero" ADD COLUMN "watermark_opacity" numeric DEFAULT 0.15;
   ALTER TABLE "projects_blocks_hero" ADD COLUMN "watermark_position" "enum_projects_blocks_hero_watermark_position" DEFAULT 'bottom-right';
   ALTER TABLE "projects_blocks_hero" ADD COLUMN "watermark_show_on_mobile" boolean DEFAULT false;

   ALTER TABLE "news_blocks_hero" ADD COLUMN "lockup_logo_id" integer;
   ALTER TABLE "news_blocks_hero" ADD COLUMN "watermark_logo_id" integer;
   ALTER TABLE "news_blocks_hero" ADD COLUMN "watermark_opacity" numeric DEFAULT 0.15;
   ALTER TABLE "news_blocks_hero" ADD COLUMN "watermark_position" "enum_news_blocks_hero_watermark_position" DEFAULT 'bottom-right';
   ALTER TABLE "news_blocks_hero" ADD COLUMN "watermark_show_on_mobile" boolean DEFAULT false;

   ALTER TABLE "about_blocks_hero" ADD COLUMN "lockup_logo_id" integer;
   ALTER TABLE "about_blocks_hero" ADD COLUMN "watermark_logo_id" integer;
   ALTER TABLE "about_blocks_hero" ADD COLUMN "watermark_opacity" numeric DEFAULT 0.15;
   ALTER TABLE "about_blocks_hero" ADD COLUMN "watermark_position" "enum_about_blocks_hero_watermark_position" DEFAULT 'bottom-right';
   ALTER TABLE "about_blocks_hero" ADD COLUMN "watermark_show_on_mobile" boolean DEFAULT false;

   ALTER TABLE "contact_blocks_hero" ADD COLUMN "lockup_logo_id" integer;
   ALTER TABLE "contact_blocks_hero" ADD COLUMN "watermark_logo_id" integer;
   ALTER TABLE "contact_blocks_hero" ADD COLUMN "watermark_opacity" numeric DEFAULT 0.15;
   ALTER TABLE "contact_blocks_hero" ADD COLUMN "watermark_position" "enum_contact_blocks_hero_watermark_position" DEFAULT 'bottom-right';
   ALTER TABLE "contact_blocks_hero" ADD COLUMN "watermark_show_on_mobile" boolean DEFAULT false;

   ALTER TABLE "jobs_blocks_hero" ADD COLUMN "lockup_logo_id" integer;
   ALTER TABLE "jobs_blocks_hero" ADD COLUMN "watermark_logo_id" integer;
   ALTER TABLE "jobs_blocks_hero" ADD COLUMN "watermark_opacity" numeric DEFAULT 0.15;
   ALTER TABLE "jobs_blocks_hero" ADD COLUMN "watermark_position" "enum_jobs_blocks_hero_watermark_position" DEFAULT 'bottom-right';
   ALTER TABLE "jobs_blocks_hero" ADD COLUMN "watermark_show_on_mobile" boolean DEFAULT false;

   ALTER TABLE "pitch_blocks_hero" ADD COLUMN "lockup_logo_id" integer;
   ALTER TABLE "pitch_blocks_hero" ADD COLUMN "watermark_logo_id" integer;
   ALTER TABLE "pitch_blocks_hero" ADD COLUMN "watermark_opacity" numeric DEFAULT 0.15;
   ALTER TABLE "pitch_blocks_hero" ADD COLUMN "watermark_position" "enum_pitch_blocks_hero_watermark_position" DEFAULT 'bottom-right';
   ALTER TABLE "pitch_blocks_hero" ADD COLUMN "watermark_show_on_mobile" boolean DEFAULT false;

   ALTER TABLE "investors_blocks_hero" ADD COLUMN "lockup_logo_id" integer;
   ALTER TABLE "investors_blocks_hero" ADD COLUMN "watermark_logo_id" integer;
   ALTER TABLE "investors_blocks_hero" ADD COLUMN "watermark_opacity" numeric DEFAULT 0.15;
   ALTER TABLE "investors_blocks_hero" ADD COLUMN "watermark_position" "enum_investors_blocks_hero_watermark_position" DEFAULT 'bottom-right';
   ALTER TABLE "investors_blocks_hero" ADD COLUMN "watermark_show_on_mobile" boolean DEFAULT false;

   ALTER TABLE "212_blocks_hero" ADD COLUMN "lockup_logo_id" integer;
   ALTER TABLE "212_blocks_hero" ADD COLUMN "watermark_logo_id" integer;
   ALTER TABLE "212_blocks_hero" ADD COLUMN "watermark_opacity" numeric DEFAULT 0.15;
   ALTER TABLE "212_blocks_hero" ADD COLUMN "watermark_position" "enum_212_blocks_hero_watermark_position" DEFAULT 'bottom-right';
   ALTER TABLE "212_blocks_hero" ADD COLUMN "watermark_show_on_mobile" boolean DEFAULT false;

   ALTER TABLE "310_blocks_hero" ADD COLUMN "lockup_logo_id" integer;
   ALTER TABLE "310_blocks_hero" ADD COLUMN "watermark_logo_id" integer;
   ALTER TABLE "310_blocks_hero" ADD COLUMN "watermark_opacity" numeric DEFAULT 0.15;
   ALTER TABLE "310_blocks_hero" ADD COLUMN "watermark_position" "enum_310_blocks_hero_watermark_position" DEFAULT 'bottom-right';
   ALTER TABLE "310_blocks_hero" ADD COLUMN "watermark_show_on_mobile" boolean DEFAULT false;

   ALTER TABLE "nrc_blocks_hero" ADD COLUMN "lockup_logo_id" integer;
   ALTER TABLE "nrc_blocks_hero" ADD COLUMN "watermark_logo_id" integer;
   ALTER TABLE "nrc_blocks_hero" ADD COLUMN "watermark_opacity" numeric DEFAULT 0.15;
   ALTER TABLE "nrc_blocks_hero" ADD COLUMN "watermark_position" "enum_nrc_blocks_hero_watermark_position" DEFAULT 'bottom-right';
   ALTER TABLE "nrc_blocks_hero" ADD COLUMN "watermark_show_on_mobile" boolean DEFAULT false;

   -- filmstrip blocks: format column (all globals)
   ALTER TABLE "home_blocks_filmstrip" ADD COLUMN "format" "enum_home_blocks_filmstrip_format" DEFAULT 'super35';
   ALTER TABLE "projects_blocks_filmstrip" ADD COLUMN "format" "enum_projects_blocks_filmstrip_format" DEFAULT 'super35';
   ALTER TABLE "news_blocks_filmstrip" ADD COLUMN "format" "enum_news_blocks_filmstrip_format" DEFAULT 'super35';
   ALTER TABLE "about_blocks_filmstrip" ADD COLUMN "format" "enum_about_blocks_filmstrip_format" DEFAULT 'super35';
   ALTER TABLE "contact_blocks_filmstrip" ADD COLUMN "format" "enum_contact_blocks_filmstrip_format" DEFAULT 'super35';
   ALTER TABLE "jobs_blocks_filmstrip" ADD COLUMN "format" "enum_jobs_blocks_filmstrip_format" DEFAULT 'super35';
   ALTER TABLE "pitch_blocks_filmstrip" ADD COLUMN "format" "enum_pitch_blocks_filmstrip_format" DEFAULT 'super35';
   ALTER TABLE "investors_blocks_filmstrip" ADD COLUMN "format" "enum_investors_blocks_filmstrip_format" DEFAULT 'super35';
   ALTER TABLE "212_blocks_filmstrip" ADD COLUMN "format" "enum_212_blocks_filmstrip_format" DEFAULT 'super35';
   ALTER TABLE "310_blocks_filmstrip" ADD COLUMN "format" "enum_310_blocks_filmstrip_format" DEFAULT 'super35';
   ALTER TABLE "nrc_blocks_filmstrip" ADD COLUMN "format" "enum_nrc_blocks_filmstrip_format" DEFAULT 'super35';

   -- FK constraints: division global logos
   ALTER TABLE "212" ADD CONSTRAINT "212_header_logo_id_media_id_fk" FOREIGN KEY ("header_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "212" ADD CONSTRAINT "212_footer_logo_id_media_id_fk" FOREIGN KEY ("footer_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "212" ADD CONSTRAINT "212_favicon_override_id_media_id_fk" FOREIGN KEY ("favicon_override_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "310" ADD CONSTRAINT "310_header_logo_id_media_id_fk" FOREIGN KEY ("header_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "310" ADD CONSTRAINT "310_footer_logo_id_media_id_fk" FOREIGN KEY ("footer_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "310" ADD CONSTRAINT "310_favicon_override_id_media_id_fk" FOREIGN KEY ("favicon_override_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "nrc" ADD CONSTRAINT "nrc_header_logo_id_media_id_fk" FOREIGN KEY ("header_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "nrc" ADD CONSTRAINT "nrc_footer_logo_id_media_id_fk" FOREIGN KEY ("footer_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "nrc" ADD CONSTRAINT "nrc_favicon_override_id_media_id_fk" FOREIGN KEY ("favicon_override_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

   -- FK constraints: site_settings brand logos
   ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_nav_logo_light_id_media_id_fk" FOREIGN KEY ("nav_logo_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_nav_logo_dark_id_media_id_fk" FOREIGN KEY ("nav_logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

   -- FK constraints: slider items tables
   ALTER TABLE "projects_blocks_hero_slider_items" ADD CONSTRAINT "projects_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "projects_blocks_hero_slider_items" ADD CONSTRAINT "projects_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "news_blocks_hero_slider_items" ADD CONSTRAINT "news_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "news_blocks_hero_slider_items" ADD CONSTRAINT "news_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "home_blocks_hero_slider_items" ADD CONSTRAINT "home_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "home_blocks_hero_slider_items" ADD CONSTRAINT "home_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "about_blocks_hero_slider_items" ADD CONSTRAINT "about_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "about_blocks_hero_slider_items" ADD CONSTRAINT "about_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "contact_blocks_hero_slider_items" ADD CONSTRAINT "contact_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "contact_blocks_hero_slider_items" ADD CONSTRAINT "contact_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "jobs_blocks_hero_slider_items" ADD CONSTRAINT "jobs_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "jobs_blocks_hero_slider_items" ADD CONSTRAINT "jobs_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pitch_blocks_hero_slider_items" ADD CONSTRAINT "pitch_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "pitch_blocks_hero_slider_items" ADD CONSTRAINT "pitch_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "investors_blocks_hero_slider_items" ADD CONSTRAINT "investors_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "investors_blocks_hero_slider_items" ADD CONSTRAINT "investors_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "212_blocks_hero_slider_items" ADD CONSTRAINT "212_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "212_blocks_hero_slider_items" ADD CONSTRAINT "212_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "310_blocks_hero_slider_items" ADD CONSTRAINT "310_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "310_blocks_hero_slider_items" ADD CONSTRAINT "310_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "nrc_blocks_hero_slider_items" ADD CONSTRAINT "nrc_blocks_hero_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "nrc_blocks_hero_slider_items" ADD CONSTRAINT "nrc_blocks_hero_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;

   -- FK constraints: hero lockup/watermark logos (all globals)
   ALTER TABLE "home_blocks_hero" ADD CONSTRAINT "home_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "home_blocks_hero" ADD CONSTRAINT "home_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "projects_blocks_hero" ADD CONSTRAINT "projects_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "projects_blocks_hero" ADD CONSTRAINT "projects_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "news_blocks_hero" ADD CONSTRAINT "news_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "news_blocks_hero" ADD CONSTRAINT "news_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "about_blocks_hero" ADD CONSTRAINT "about_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "about_blocks_hero" ADD CONSTRAINT "about_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "contact_blocks_hero" ADD CONSTRAINT "contact_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "contact_blocks_hero" ADD CONSTRAINT "contact_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "jobs_blocks_hero" ADD CONSTRAINT "jobs_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "jobs_blocks_hero" ADD CONSTRAINT "jobs_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "pitch_blocks_hero" ADD CONSTRAINT "pitch_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "pitch_blocks_hero" ADD CONSTRAINT "pitch_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "investors_blocks_hero" ADD CONSTRAINT "investors_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "investors_blocks_hero" ADD CONSTRAINT "investors_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "212_blocks_hero" ADD CONSTRAINT "212_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "212_blocks_hero" ADD CONSTRAINT "212_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "310_blocks_hero" ADD CONSTRAINT "310_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "310_blocks_hero" ADD CONSTRAINT "310_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "nrc_blocks_hero" ADD CONSTRAINT "nrc_blocks_hero_lockup_logo_id_media_id_fk" FOREIGN KEY ("lockup_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "nrc_blocks_hero" ADD CONSTRAINT "nrc_blocks_hero_watermark_logo_id_media_id_fk" FOREIGN KEY ("watermark_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

   -- Indexes: division global logos
   CREATE INDEX "212_header_logo_idx" ON "212" USING btree ("header_logo_id");
   CREATE INDEX "212_footer_logo_idx" ON "212" USING btree ("footer_logo_id");
   CREATE INDEX "212_favicon_override_idx" ON "212" USING btree ("favicon_override_id");
   CREATE INDEX "310_header_logo_idx" ON "310" USING btree ("header_logo_id");
   CREATE INDEX "310_footer_logo_idx" ON "310" USING btree ("footer_logo_id");
   CREATE INDEX "310_favicon_override_idx" ON "310" USING btree ("favicon_override_id");
   CREATE INDEX "nrc_header_logo_idx" ON "nrc" USING btree ("header_logo_id");
   CREATE INDEX "nrc_footer_logo_idx" ON "nrc" USING btree ("footer_logo_id");
   CREATE INDEX "nrc_favicon_override_idx" ON "nrc" USING btree ("favicon_override_id");

   -- Indexes: site_settings brand logos
   CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
   CREATE INDEX "site_settings_nav_logo_light_idx" ON "site_settings" USING btree ("nav_logo_light_id");
   CREATE INDEX "site_settings_nav_logo_dark_idx" ON "site_settings" USING btree ("nav_logo_dark_id");

   -- Indexes: hero slider items tables
   CREATE INDEX "projects_blocks_hero_slider_items_order_idx" ON "projects_blocks_hero_slider_items" USING btree ("_order");
   CREATE INDEX "projects_blocks_hero_slider_items_parent_id_idx" ON "projects_blocks_hero_slider_items" USING btree ("_parent_id");
   CREATE INDEX "projects_blocks_hero_slider_items_media_idx" ON "projects_blocks_hero_slider_items" USING btree ("media_id");
   CREATE INDEX "news_blocks_hero_slider_items_order_idx" ON "news_blocks_hero_slider_items" USING btree ("_order");
   CREATE INDEX "news_blocks_hero_slider_items_parent_id_idx" ON "news_blocks_hero_slider_items" USING btree ("_parent_id");
   CREATE INDEX "news_blocks_hero_slider_items_media_idx" ON "news_blocks_hero_slider_items" USING btree ("media_id");
   CREATE INDEX "home_blocks_hero_slider_items_order_idx" ON "home_blocks_hero_slider_items" USING btree ("_order");
   CREATE INDEX "home_blocks_hero_slider_items_parent_id_idx" ON "home_blocks_hero_slider_items" USING btree ("_parent_id");
   CREATE INDEX "home_blocks_hero_slider_items_media_idx" ON "home_blocks_hero_slider_items" USING btree ("media_id");
   CREATE INDEX "about_blocks_hero_slider_items_order_idx" ON "about_blocks_hero_slider_items" USING btree ("_order");
   CREATE INDEX "about_blocks_hero_slider_items_parent_id_idx" ON "about_blocks_hero_slider_items" USING btree ("_parent_id");
   CREATE INDEX "about_blocks_hero_slider_items_media_idx" ON "about_blocks_hero_slider_items" USING btree ("media_id");
   CREATE INDEX "contact_blocks_hero_slider_items_order_idx" ON "contact_blocks_hero_slider_items" USING btree ("_order");
   CREATE INDEX "contact_blocks_hero_slider_items_parent_id_idx" ON "contact_blocks_hero_slider_items" USING btree ("_parent_id");
   CREATE INDEX "contact_blocks_hero_slider_items_media_idx" ON "contact_blocks_hero_slider_items" USING btree ("media_id");
   CREATE INDEX "jobs_blocks_hero_slider_items_order_idx" ON "jobs_blocks_hero_slider_items" USING btree ("_order");
   CREATE INDEX "jobs_blocks_hero_slider_items_parent_id_idx" ON "jobs_blocks_hero_slider_items" USING btree ("_parent_id");
   CREATE INDEX "jobs_blocks_hero_slider_items_media_idx" ON "jobs_blocks_hero_slider_items" USING btree ("media_id");
   CREATE INDEX "pitch_blocks_hero_slider_items_order_idx" ON "pitch_blocks_hero_slider_items" USING btree ("_order");
   CREATE INDEX "pitch_blocks_hero_slider_items_parent_id_idx" ON "pitch_blocks_hero_slider_items" USING btree ("_parent_id");
   CREATE INDEX "pitch_blocks_hero_slider_items_media_idx" ON "pitch_blocks_hero_slider_items" USING btree ("media_id");
   CREATE INDEX "investors_blocks_hero_slider_items_order_idx" ON "investors_blocks_hero_slider_items" USING btree ("_order");
   CREATE INDEX "investors_blocks_hero_slider_items_parent_id_idx" ON "investors_blocks_hero_slider_items" USING btree ("_parent_id");
   CREATE INDEX "investors_blocks_hero_slider_items_media_idx" ON "investors_blocks_hero_slider_items" USING btree ("media_id");
   CREATE INDEX "212_blocks_hero_slider_items_order_idx" ON "212_blocks_hero_slider_items" USING btree ("_order");
   CREATE INDEX "212_blocks_hero_slider_items_parent_id_idx" ON "212_blocks_hero_slider_items" USING btree ("_parent_id");
   CREATE INDEX "212_blocks_hero_slider_items_media_idx" ON "212_blocks_hero_slider_items" USING btree ("media_id");
   CREATE INDEX "310_blocks_hero_slider_items_order_idx" ON "310_blocks_hero_slider_items" USING btree ("_order");
   CREATE INDEX "310_blocks_hero_slider_items_parent_id_idx" ON "310_blocks_hero_slider_items" USING btree ("_parent_id");
   CREATE INDEX "310_blocks_hero_slider_items_media_idx" ON "310_blocks_hero_slider_items" USING btree ("media_id");
   CREATE INDEX "nrc_blocks_hero_slider_items_order_idx" ON "nrc_blocks_hero_slider_items" USING btree ("_order");
   CREATE INDEX "nrc_blocks_hero_slider_items_parent_id_idx" ON "nrc_blocks_hero_slider_items" USING btree ("_parent_id");
   CREATE INDEX "nrc_blocks_hero_slider_items_media_idx" ON "nrc_blocks_hero_slider_items" USING btree ("media_id");

   -- Indexes: hero lockup/watermark logos (all globals)
   CREATE INDEX "home_blocks_hero_lockup_logo_idx" ON "home_blocks_hero" USING btree ("lockup_logo_id");
   CREATE INDEX "home_blocks_hero_watermark_logo_idx" ON "home_blocks_hero" USING btree ("watermark_logo_id");
   CREATE INDEX "projects_blocks_hero_lockup_logo_idx" ON "projects_blocks_hero" USING btree ("lockup_logo_id");
   CREATE INDEX "projects_blocks_hero_watermark_logo_idx" ON "projects_blocks_hero" USING btree ("watermark_logo_id");
   CREATE INDEX "news_blocks_hero_lockup_logo_idx" ON "news_blocks_hero" USING btree ("lockup_logo_id");
   CREATE INDEX "news_blocks_hero_watermark_logo_idx" ON "news_blocks_hero" USING btree ("watermark_logo_id");
   CREATE INDEX "about_blocks_hero_lockup_logo_idx" ON "about_blocks_hero" USING btree ("lockup_logo_id");
   CREATE INDEX "about_blocks_hero_watermark_logo_idx" ON "about_blocks_hero" USING btree ("watermark_logo_id");
   CREATE INDEX "contact_blocks_hero_lockup_logo_idx" ON "contact_blocks_hero" USING btree ("lockup_logo_id");
   CREATE INDEX "contact_blocks_hero_watermark_logo_idx" ON "contact_blocks_hero" USING btree ("watermark_logo_id");
   CREATE INDEX "jobs_blocks_hero_lockup_logo_idx" ON "jobs_blocks_hero" USING btree ("lockup_logo_id");
   CREATE INDEX "jobs_blocks_hero_watermark_logo_idx" ON "jobs_blocks_hero" USING btree ("watermark_logo_id");
   CREATE INDEX "pitch_blocks_hero_lockup_logo_idx" ON "pitch_blocks_hero" USING btree ("lockup_logo_id");
   CREATE INDEX "pitch_blocks_hero_watermark_logo_idx" ON "pitch_blocks_hero" USING btree ("watermark_logo_id");
   CREATE INDEX "investors_blocks_hero_lockup_logo_idx" ON "investors_blocks_hero" USING btree ("lockup_logo_id");
   CREATE INDEX "investors_blocks_hero_watermark_logo_idx" ON "investors_blocks_hero" USING btree ("watermark_logo_id");
   CREATE INDEX "212_blocks_hero_lockup_logo_idx" ON "212_blocks_hero" USING btree ("lockup_logo_id");
   CREATE INDEX "212_blocks_hero_watermark_logo_idx" ON "212_blocks_hero" USING btree ("watermark_logo_id");
   CREATE INDEX "310_blocks_hero_lockup_logo_idx" ON "310_blocks_hero" USING btree ("lockup_logo_id");
   CREATE INDEX "310_blocks_hero_watermark_logo_idx" ON "310_blocks_hero" USING btree ("watermark_logo_id");
   CREATE INDEX "nrc_blocks_hero_lockup_logo_idx" ON "nrc_blocks_hero" USING btree ("lockup_logo_id");
   CREATE INDEX "nrc_blocks_hero_watermark_logo_idx" ON "nrc_blocks_hero" USING btree ("watermark_logo_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   -- Remove hero lockup/watermark logo indexes
   DROP INDEX IF EXISTS "home_blocks_hero_lockup_logo_idx";
   DROP INDEX IF EXISTS "home_blocks_hero_watermark_logo_idx";
   DROP INDEX IF EXISTS "projects_blocks_hero_lockup_logo_idx";
   DROP INDEX IF EXISTS "projects_blocks_hero_watermark_logo_idx";
   DROP INDEX IF EXISTS "news_blocks_hero_lockup_logo_idx";
   DROP INDEX IF EXISTS "news_blocks_hero_watermark_logo_idx";
   DROP INDEX IF EXISTS "about_blocks_hero_lockup_logo_idx";
   DROP INDEX IF EXISTS "about_blocks_hero_watermark_logo_idx";
   DROP INDEX IF EXISTS "contact_blocks_hero_lockup_logo_idx";
   DROP INDEX IF EXISTS "contact_blocks_hero_watermark_logo_idx";
   DROP INDEX IF EXISTS "jobs_blocks_hero_lockup_logo_idx";
   DROP INDEX IF EXISTS "jobs_blocks_hero_watermark_logo_idx";
   DROP INDEX IF EXISTS "pitch_blocks_hero_lockup_logo_idx";
   DROP INDEX IF EXISTS "pitch_blocks_hero_watermark_logo_idx";
   DROP INDEX IF EXISTS "investors_blocks_hero_lockup_logo_idx";
   DROP INDEX IF EXISTS "investors_blocks_hero_watermark_logo_idx";
   DROP INDEX IF EXISTS "212_blocks_hero_lockup_logo_idx";
   DROP INDEX IF EXISTS "212_blocks_hero_watermark_logo_idx";
   DROP INDEX IF EXISTS "310_blocks_hero_lockup_logo_idx";
   DROP INDEX IF EXISTS "310_blocks_hero_watermark_logo_idx";
   DROP INDEX IF EXISTS "nrc_blocks_hero_lockup_logo_idx";
   DROP INDEX IF EXISTS "nrc_blocks_hero_watermark_logo_idx";

   -- Remove slider items indexes and drop tables
   DROP TABLE IF EXISTS "projects_blocks_hero_slider_items";
   DROP TABLE IF EXISTS "news_blocks_hero_slider_items";
   DROP TABLE IF EXISTS "home_blocks_hero_slider_items";
   DROP TABLE IF EXISTS "about_blocks_hero_slider_items";
   DROP TABLE IF EXISTS "contact_blocks_hero_slider_items";
   DROP TABLE IF EXISTS "jobs_blocks_hero_slider_items";
   DROP TABLE IF EXISTS "pitch_blocks_hero_slider_items";
   DROP TABLE IF EXISTS "investors_blocks_hero_slider_items";
   DROP TABLE IF EXISTS "212_blocks_hero_slider_items";
   DROP TABLE IF EXISTS "310_blocks_hero_slider_items";
   DROP TABLE IF EXISTS "nrc_blocks_hero_slider_items";

   -- Remove division global logo FKs and columns
   ALTER TABLE "212" DROP CONSTRAINT IF EXISTS "212_header_logo_id_media_id_fk";
   ALTER TABLE "212" DROP CONSTRAINT IF EXISTS "212_footer_logo_id_media_id_fk";
   ALTER TABLE "212" DROP CONSTRAINT IF EXISTS "212_favicon_override_id_media_id_fk";
   DROP INDEX IF EXISTS "212_header_logo_idx";
   DROP INDEX IF EXISTS "212_footer_logo_idx";
   DROP INDEX IF EXISTS "212_favicon_override_idx";
   ALTER TABLE "212" DROP COLUMN IF EXISTS "header_logo_id";
   ALTER TABLE "212" DROP COLUMN IF EXISTS "footer_logo_id";
   ALTER TABLE "212" DROP COLUMN IF EXISTS "favicon_override_id";

   ALTER TABLE "310" DROP CONSTRAINT IF EXISTS "310_header_logo_id_media_id_fk";
   ALTER TABLE "310" DROP CONSTRAINT IF EXISTS "310_footer_logo_id_media_id_fk";
   ALTER TABLE "310" DROP CONSTRAINT IF EXISTS "310_favicon_override_id_media_id_fk";
   DROP INDEX IF EXISTS "310_header_logo_idx";
   DROP INDEX IF EXISTS "310_footer_logo_idx";
   DROP INDEX IF EXISTS "310_favicon_override_idx";
   ALTER TABLE "310" DROP COLUMN IF EXISTS "header_logo_id";
   ALTER TABLE "310" DROP COLUMN IF EXISTS "footer_logo_id";
   ALTER TABLE "310" DROP COLUMN IF EXISTS "favicon_override_id";

   ALTER TABLE "nrc" DROP CONSTRAINT IF EXISTS "nrc_header_logo_id_media_id_fk";
   ALTER TABLE "nrc" DROP CONSTRAINT IF EXISTS "nrc_footer_logo_id_media_id_fk";
   ALTER TABLE "nrc" DROP CONSTRAINT IF EXISTS "nrc_favicon_override_id_media_id_fk";
   DROP INDEX IF EXISTS "nrc_header_logo_idx";
   DROP INDEX IF EXISTS "nrc_footer_logo_idx";
   DROP INDEX IF EXISTS "nrc_favicon_override_idx";
   ALTER TABLE "nrc" DROP COLUMN IF EXISTS "header_logo_id";
   ALTER TABLE "nrc" DROP COLUMN IF EXISTS "footer_logo_id";
   ALTER TABLE "nrc" DROP COLUMN IF EXISTS "favicon_override_id";

   -- Remove site_settings brand logo FKs and columns
   ALTER TABLE "site_settings" DROP CONSTRAINT IF EXISTS "site_settings_favicon_id_media_id_fk";
   ALTER TABLE "site_settings" DROP CONSTRAINT IF EXISTS "site_settings_nav_logo_light_id_media_id_fk";
   ALTER TABLE "site_settings" DROP CONSTRAINT IF EXISTS "site_settings_nav_logo_dark_id_media_id_fk";
   DROP INDEX IF EXISTS "site_settings_favicon_idx";
   DROP INDEX IF EXISTS "site_settings_nav_logo_light_idx";
   DROP INDEX IF EXISTS "site_settings_nav_logo_dark_idx";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "favicon_id";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "nav_logo_light_id";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "nav_logo_dark_id";

   -- Remove media brand columns
   ALTER TABLE "media" DROP COLUMN IF EXISTS "media_kind";
   ALTER TABLE "media" DROP COLUMN IF EXISTS "division_tag";

   -- Remove hero lockup/watermark FKs and columns (all globals)
   ALTER TABLE "home_blocks_hero" DROP CONSTRAINT IF EXISTS "home_blocks_hero_lockup_logo_id_media_id_fk";
   ALTER TABLE "home_blocks_hero" DROP CONSTRAINT IF EXISTS "home_blocks_hero_watermark_logo_id_media_id_fk";
   ALTER TABLE "home_blocks_hero" DROP COLUMN IF EXISTS "lockup_logo_id";
   ALTER TABLE "home_blocks_hero" DROP COLUMN IF EXISTS "watermark_logo_id";
   ALTER TABLE "home_blocks_hero" DROP COLUMN IF EXISTS "watermark_opacity";
   ALTER TABLE "home_blocks_hero" DROP COLUMN IF EXISTS "watermark_position";
   ALTER TABLE "home_blocks_hero" DROP COLUMN IF EXISTS "watermark_show_on_mobile";
   ALTER TABLE "home_blocks_filmstrip" DROP COLUMN IF EXISTS "format";

   ALTER TABLE "projects_blocks_hero" DROP CONSTRAINT IF EXISTS "projects_blocks_hero_lockup_logo_id_media_id_fk";
   ALTER TABLE "projects_blocks_hero" DROP CONSTRAINT IF EXISTS "projects_blocks_hero_watermark_logo_id_media_id_fk";
   ALTER TABLE "projects_blocks_hero" DROP COLUMN IF EXISTS "lockup_logo_id";
   ALTER TABLE "projects_blocks_hero" DROP COLUMN IF EXISTS "watermark_logo_id";
   ALTER TABLE "projects_blocks_hero" DROP COLUMN IF EXISTS "watermark_opacity";
   ALTER TABLE "projects_blocks_hero" DROP COLUMN IF EXISTS "watermark_position";
   ALTER TABLE "projects_blocks_hero" DROP COLUMN IF EXISTS "watermark_show_on_mobile";
   ALTER TABLE "projects_blocks_filmstrip" DROP COLUMN IF EXISTS "format";

   ALTER TABLE "news_blocks_hero" DROP CONSTRAINT IF EXISTS "news_blocks_hero_lockup_logo_id_media_id_fk";
   ALTER TABLE "news_blocks_hero" DROP CONSTRAINT IF EXISTS "news_blocks_hero_watermark_logo_id_media_id_fk";
   ALTER TABLE "news_blocks_hero" DROP COLUMN IF EXISTS "lockup_logo_id";
   ALTER TABLE "news_blocks_hero" DROP COLUMN IF EXISTS "watermark_logo_id";
   ALTER TABLE "news_blocks_hero" DROP COLUMN IF EXISTS "watermark_opacity";
   ALTER TABLE "news_blocks_hero" DROP COLUMN IF EXISTS "watermark_position";
   ALTER TABLE "news_blocks_hero" DROP COLUMN IF EXISTS "watermark_show_on_mobile";
   ALTER TABLE "news_blocks_filmstrip" DROP COLUMN IF EXISTS "format";

   ALTER TABLE "about_blocks_hero" DROP CONSTRAINT IF EXISTS "about_blocks_hero_lockup_logo_id_media_id_fk";
   ALTER TABLE "about_blocks_hero" DROP CONSTRAINT IF EXISTS "about_blocks_hero_watermark_logo_id_media_id_fk";
   ALTER TABLE "about_blocks_hero" DROP COLUMN IF EXISTS "lockup_logo_id";
   ALTER TABLE "about_blocks_hero" DROP COLUMN IF EXISTS "watermark_logo_id";
   ALTER TABLE "about_blocks_hero" DROP COLUMN IF EXISTS "watermark_opacity";
   ALTER TABLE "about_blocks_hero" DROP COLUMN IF EXISTS "watermark_position";
   ALTER TABLE "about_blocks_hero" DROP COLUMN IF EXISTS "watermark_show_on_mobile";
   ALTER TABLE "about_blocks_filmstrip" DROP COLUMN IF EXISTS "format";

   ALTER TABLE "contact_blocks_hero" DROP CONSTRAINT IF EXISTS "contact_blocks_hero_lockup_logo_id_media_id_fk";
   ALTER TABLE "contact_blocks_hero" DROP CONSTRAINT IF EXISTS "contact_blocks_hero_watermark_logo_id_media_id_fk";
   ALTER TABLE "contact_blocks_hero" DROP COLUMN IF EXISTS "lockup_logo_id";
   ALTER TABLE "contact_blocks_hero" DROP COLUMN IF EXISTS "watermark_logo_id";
   ALTER TABLE "contact_blocks_hero" DROP COLUMN IF EXISTS "watermark_opacity";
   ALTER TABLE "contact_blocks_hero" DROP COLUMN IF EXISTS "watermark_position";
   ALTER TABLE "contact_blocks_hero" DROP COLUMN IF EXISTS "watermark_show_on_mobile";
   ALTER TABLE "contact_blocks_filmstrip" DROP COLUMN IF EXISTS "format";

   ALTER TABLE "jobs_blocks_hero" DROP CONSTRAINT IF EXISTS "jobs_blocks_hero_lockup_logo_id_media_id_fk";
   ALTER TABLE "jobs_blocks_hero" DROP CONSTRAINT IF EXISTS "jobs_blocks_hero_watermark_logo_id_media_id_fk";
   ALTER TABLE "jobs_blocks_hero" DROP COLUMN IF EXISTS "lockup_logo_id";
   ALTER TABLE "jobs_blocks_hero" DROP COLUMN IF EXISTS "watermark_logo_id";
   ALTER TABLE "jobs_blocks_hero" DROP COLUMN IF EXISTS "watermark_opacity";
   ALTER TABLE "jobs_blocks_hero" DROP COLUMN IF EXISTS "watermark_position";
   ALTER TABLE "jobs_blocks_hero" DROP COLUMN IF EXISTS "watermark_show_on_mobile";
   ALTER TABLE "jobs_blocks_filmstrip" DROP COLUMN IF EXISTS "format";

   ALTER TABLE "pitch_blocks_hero" DROP CONSTRAINT IF EXISTS "pitch_blocks_hero_lockup_logo_id_media_id_fk";
   ALTER TABLE "pitch_blocks_hero" DROP CONSTRAINT IF EXISTS "pitch_blocks_hero_watermark_logo_id_media_id_fk";
   ALTER TABLE "pitch_blocks_hero" DROP COLUMN IF EXISTS "lockup_logo_id";
   ALTER TABLE "pitch_blocks_hero" DROP COLUMN IF EXISTS "watermark_logo_id";
   ALTER TABLE "pitch_blocks_hero" DROP COLUMN IF EXISTS "watermark_opacity";
   ALTER TABLE "pitch_blocks_hero" DROP COLUMN IF EXISTS "watermark_position";
   ALTER TABLE "pitch_blocks_hero" DROP COLUMN IF EXISTS "watermark_show_on_mobile";
   ALTER TABLE "pitch_blocks_filmstrip" DROP COLUMN IF EXISTS "format";

   ALTER TABLE "investors_blocks_hero" DROP CONSTRAINT IF EXISTS "investors_blocks_hero_lockup_logo_id_media_id_fk";
   ALTER TABLE "investors_blocks_hero" DROP CONSTRAINT IF EXISTS "investors_blocks_hero_watermark_logo_id_media_id_fk";
   ALTER TABLE "investors_blocks_hero" DROP COLUMN IF EXISTS "lockup_logo_id";
   ALTER TABLE "investors_blocks_hero" DROP COLUMN IF EXISTS "watermark_logo_id";
   ALTER TABLE "investors_blocks_hero" DROP COLUMN IF EXISTS "watermark_opacity";
   ALTER TABLE "investors_blocks_hero" DROP COLUMN IF EXISTS "watermark_position";
   ALTER TABLE "investors_blocks_hero" DROP COLUMN IF EXISTS "watermark_show_on_mobile";
   ALTER TABLE "investors_blocks_filmstrip" DROP COLUMN IF EXISTS "format";

   ALTER TABLE "212_blocks_hero" DROP CONSTRAINT IF EXISTS "212_blocks_hero_lockup_logo_id_media_id_fk";
   ALTER TABLE "212_blocks_hero" DROP CONSTRAINT IF EXISTS "212_blocks_hero_watermark_logo_id_media_id_fk";
   ALTER TABLE "212_blocks_hero" DROP COLUMN IF EXISTS "lockup_logo_id";
   ALTER TABLE "212_blocks_hero" DROP COLUMN IF EXISTS "watermark_logo_id";
   ALTER TABLE "212_blocks_hero" DROP COLUMN IF EXISTS "watermark_opacity";
   ALTER TABLE "212_blocks_hero" DROP COLUMN IF EXISTS "watermark_position";
   ALTER TABLE "212_blocks_hero" DROP COLUMN IF EXISTS "watermark_show_on_mobile";
   ALTER TABLE "212_blocks_filmstrip" DROP COLUMN IF EXISTS "format";

   ALTER TABLE "310_blocks_hero" DROP CONSTRAINT IF EXISTS "310_blocks_hero_lockup_logo_id_media_id_fk";
   ALTER TABLE "310_blocks_hero" DROP CONSTRAINT IF EXISTS "310_blocks_hero_watermark_logo_id_media_id_fk";
   ALTER TABLE "310_blocks_hero" DROP COLUMN IF EXISTS "lockup_logo_id";
   ALTER TABLE "310_blocks_hero" DROP COLUMN IF EXISTS "watermark_logo_id";
   ALTER TABLE "310_blocks_hero" DROP COLUMN IF EXISTS "watermark_opacity";
   ALTER TABLE "310_blocks_hero" DROP COLUMN IF EXISTS "watermark_position";
   ALTER TABLE "310_blocks_hero" DROP COLUMN IF EXISTS "watermark_show_on_mobile";
   ALTER TABLE "310_blocks_filmstrip" DROP COLUMN IF EXISTS "format";

   ALTER TABLE "nrc_blocks_hero" DROP CONSTRAINT IF EXISTS "nrc_blocks_hero_lockup_logo_id_media_id_fk";
   ALTER TABLE "nrc_blocks_hero" DROP CONSTRAINT IF EXISTS "nrc_blocks_hero_watermark_logo_id_media_id_fk";
   ALTER TABLE "nrc_blocks_hero" DROP COLUMN IF EXISTS "lockup_logo_id";
   ALTER TABLE "nrc_blocks_hero" DROP COLUMN IF EXISTS "watermark_logo_id";
   ALTER TABLE "nrc_blocks_hero" DROP COLUMN IF EXISTS "watermark_opacity";
   ALTER TABLE "nrc_blocks_hero" DROP COLUMN IF EXISTS "watermark_position";
   ALTER TABLE "nrc_blocks_hero" DROP COLUMN IF EXISTS "watermark_show_on_mobile";
   ALTER TABLE "nrc_blocks_filmstrip" DROP COLUMN IF EXISTS "format";

   -- Drop enum types
   DROP TYPE IF EXISTS "public"."enum_media_media_kind";
   DROP TYPE IF EXISTS "public"."enum_media_division_tag";
   DROP TYPE IF EXISTS "public"."enum_projects_blocks_hero_watermark_position";
   DROP TYPE IF EXISTS "public"."enum_news_blocks_hero_watermark_position";
   DROP TYPE IF EXISTS "public"."enum_home_blocks_hero_watermark_position";
   DROP TYPE IF EXISTS "public"."enum_about_blocks_hero_watermark_position";
   DROP TYPE IF EXISTS "public"."enum_contact_blocks_hero_watermark_position";
   DROP TYPE IF EXISTS "public"."enum_jobs_blocks_hero_watermark_position";
   DROP TYPE IF EXISTS "public"."enum_pitch_blocks_hero_watermark_position";
   DROP TYPE IF EXISTS "public"."enum_investors_blocks_hero_watermark_position";
   DROP TYPE IF EXISTS "public"."enum_212_blocks_hero_watermark_position";
   DROP TYPE IF EXISTS "public"."enum_310_blocks_hero_watermark_position";
   DROP TYPE IF EXISTS "public"."enum_nrc_blocks_hero_watermark_position";
   DROP TYPE IF EXISTS "public"."enum_projects_blocks_filmstrip_format";
   DROP TYPE IF EXISTS "public"."enum_news_blocks_filmstrip_format";
   DROP TYPE IF EXISTS "public"."enum_home_blocks_filmstrip_format";
   DROP TYPE IF EXISTS "public"."enum_about_blocks_filmstrip_format";
   DROP TYPE IF EXISTS "public"."enum_contact_blocks_filmstrip_format";
   DROP TYPE IF EXISTS "public"."enum_jobs_blocks_filmstrip_format";
   DROP TYPE IF EXISTS "public"."enum_pitch_blocks_filmstrip_format";
   DROP TYPE IF EXISTS "public"."enum_investors_blocks_filmstrip_format";
   DROP TYPE IF EXISTS "public"."enum_212_blocks_filmstrip_format";
   DROP TYPE IF EXISTS "public"."enum_310_blocks_filmstrip_format";
   DROP TYPE IF EXISTS "public"."enum_nrc_blocks_filmstrip_format";
  `)
}
