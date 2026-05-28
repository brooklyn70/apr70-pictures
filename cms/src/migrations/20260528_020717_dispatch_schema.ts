import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_dispatch_issues_cover_lines_style" AS ENUM('normal', 'accent', 'outline');
  CREATE TYPE "public"."enum_dispatch_issues_feature_paragraphs_variant" AS ENUM('text', 'first', 'pull', 'small', 'head');
  CREATE TYPE "public"."enum_dispatch_issues_feature_factbox_fields_accent" AS ENUM('none', 'amber', 'teal', 'orange');
  CREATE TYPE "public"."enum_dispatch_issues_dispatches_division" AS ENUM('212', '310', 'nrc');
  CREATE TABLE "dispatch_issues_cover_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"style" "enum_dispatch_issues_cover_lines_style" DEFAULT 'normal'
  );
  
  CREATE TABLE "dispatch_issues_cover_coverlines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"num" varchar,
  	"head" varchar,
  	"deck" varchar
  );
  
  CREATE TABLE "dispatch_issues_contents_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"folio" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"deck" varchar,
  	"by" varchar
  );
  
  CREATE TABLE "dispatch_issues_contents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"meta" varchar
  );
  
  CREATE TABLE "dispatch_issues_editorial_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "dispatch_issues_feature_title_parts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"italic" boolean DEFAULT false
  );
  
  CREATE TABLE "dispatch_issues_feature_meta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "dispatch_issues_feature_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_dispatch_issues_feature_paragraphs_variant" DEFAULT 'text' NOT NULL,
  	"text" varchar NOT NULL,
  	"attr" varchar
  );
  
  CREATE TABLE "dispatch_issues_feature_factbox_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"accent" "enum_dispatch_issues_feature_factbox_fields_accent" DEFAULT 'none'
  );
  
  CREATE TABLE "dispatch_issues_feature_related" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"idx" varchar,
  	"name" varchar NOT NULL,
  	"meta" varchar
  );
  
  CREATE TABLE "dispatch_issues_dispatches" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"division" "enum_dispatch_issues_dispatches_division" DEFAULT '212' NOT NULL,
  	"date" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"status" varchar,
  	"link" varchar,
  	"ghost" varchar
  );
  
  CREATE TABLE "dispatch_issues_trades" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pub" varchar NOT NULL,
  	"city" varchar,
  	"headline" varchar NOT NULL,
  	"deck" varchar,
  	"attr" varchar
  );
  
  CREATE TABLE "dispatch_issues_calendar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"sub" varchar,
  	"tag" varchar
  );
  
  CREATE TABLE "dispatch_issues_classifieds" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cat" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"meta" varchar
  );
  
  CREATE TABLE "dispatch_issues_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"vol" varchar,
  	"no" varchar,
  	"season" varchar,
  	"mast" varchar,
  	"line" varchar,
  	"state" varchar,
  	"is_current" boolean DEFAULT false
  );
  
  CREATE TABLE "dispatch_issues" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"display_title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"current" boolean DEFAULT false,
  	"release_date" timestamp(3) with time zone,
  	"indicia_volume" varchar DEFAULT 'VOL. 01' NOT NULL,
  	"indicia_number" varchar DEFAULT 'NO. 01' NOT NULL,
  	"indicia_season" varchar DEFAULT 'SPRING 2026' NOT NULL,
  	"indicia_reel" varchar DEFAULT 'REEL 086',
  	"indicia_iso_date" varchar DEFAULT 'APR · MAY · JUN 2026',
  	"indicia_print_run" varchar DEFAULT 'PRESSRUN 1,200',
  	"indicia_offices" varchar DEFAULT 'LIC NY 11101',
  	"indicia_tagline" varchar DEFAULT 'PRECISE. PURPOSEFUL. BUILT TO LAST.',
  	"cover_kicker" varchar,
  	"cover_deck" varchar,
  	"cover_byline" varchar,
  	"cover_cover_image_id" integer,
  	"editorial_eyebrow" varchar,
  	"editorial_title" varchar,
  	"editorial_lead" varchar,
  	"editorial_signature_name" varchar,
  	"editorial_signature_meta" varchar,
  	"editorial_quote" varchar,
  	"editorial_portrait_id" integer,
  	"feature_eyebrow" varchar,
  	"feature_deck" varchar,
  	"feature_jump_from" varchar,
  	"feature_jump_to" varchar,
  	"feature_hero_image_id" integer,
  	"feature_image_caption_caption" varchar,
  	"feature_image_caption_credit" varchar,
  	"feature_factbox_label" varchar DEFAULT 'AT A GLANCE',
  	"colophon_legal" varchar,
  	"colophon_type" varchar,
  	"colophon_baseline" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "projects_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "projects_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::text;
  DROP TYPE "public"."enum_projects_blocks_division_showcase_variant";
  CREATE TYPE "public"."enum_projects_blocks_division_showcase_variant" AS ENUM('v0-slate-stack', 'v0-baseline', 'v3-baseline-filmstrip', 'v4-animated-filmstrip');
  ALTER TABLE "projects_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::"public"."enum_projects_blocks_division_showcase_variant";
  ALTER TABLE "projects_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_projects_blocks_division_showcase_variant" USING "variant"::"public"."enum_projects_blocks_division_showcase_variant";
  ALTER TABLE "news_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "news_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::text;
  DROP TYPE "public"."enum_news_blocks_division_showcase_variant";
  CREATE TYPE "public"."enum_news_blocks_division_showcase_variant" AS ENUM('v0-slate-stack', 'v0-baseline', 'v3-baseline-filmstrip', 'v4-animated-filmstrip');
  ALTER TABLE "news_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::"public"."enum_news_blocks_division_showcase_variant";
  ALTER TABLE "news_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_news_blocks_division_showcase_variant" USING "variant"::"public"."enum_news_blocks_division_showcase_variant";
  ALTER TABLE "home_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "home_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::text;
  DROP TYPE "public"."enum_home_blocks_division_showcase_variant";
  CREATE TYPE "public"."enum_home_blocks_division_showcase_variant" AS ENUM('v0-slate-stack', 'v0-baseline', 'v3-baseline-filmstrip', 'v4-animated-filmstrip');
  ALTER TABLE "home_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::"public"."enum_home_blocks_division_showcase_variant";
  ALTER TABLE "home_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_home_blocks_division_showcase_variant" USING "variant"::"public"."enum_home_blocks_division_showcase_variant";
  ALTER TABLE "about_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "about_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::text;
  DROP TYPE "public"."enum_about_blocks_division_showcase_variant";
  CREATE TYPE "public"."enum_about_blocks_division_showcase_variant" AS ENUM('v0-slate-stack', 'v0-baseline', 'v3-baseline-filmstrip', 'v4-animated-filmstrip');
  ALTER TABLE "about_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::"public"."enum_about_blocks_division_showcase_variant";
  ALTER TABLE "about_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_about_blocks_division_showcase_variant" USING "variant"::"public"."enum_about_blocks_division_showcase_variant";
  ALTER TABLE "contact_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "contact_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::text;
  DROP TYPE "public"."enum_contact_blocks_division_showcase_variant";
  CREATE TYPE "public"."enum_contact_blocks_division_showcase_variant" AS ENUM('v0-slate-stack', 'v0-baseline', 'v3-baseline-filmstrip', 'v4-animated-filmstrip');
  ALTER TABLE "contact_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::"public"."enum_contact_blocks_division_showcase_variant";
  ALTER TABLE "contact_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_contact_blocks_division_showcase_variant" USING "variant"::"public"."enum_contact_blocks_division_showcase_variant";
  ALTER TABLE "jobs_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "jobs_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::text;
  DROP TYPE "public"."enum_jobs_blocks_division_showcase_variant";
  CREATE TYPE "public"."enum_jobs_blocks_division_showcase_variant" AS ENUM('v0-slate-stack', 'v0-baseline', 'v3-baseline-filmstrip', 'v4-animated-filmstrip');
  ALTER TABLE "jobs_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::"public"."enum_jobs_blocks_division_showcase_variant";
  ALTER TABLE "jobs_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_jobs_blocks_division_showcase_variant" USING "variant"::"public"."enum_jobs_blocks_division_showcase_variant";
  ALTER TABLE "pitch_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pitch_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::text;
  DROP TYPE "public"."enum_pitch_blocks_division_showcase_variant";
  CREATE TYPE "public"."enum_pitch_blocks_division_showcase_variant" AS ENUM('v0-slate-stack', 'v0-baseline', 'v3-baseline-filmstrip', 'v4-animated-filmstrip');
  ALTER TABLE "pitch_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::"public"."enum_pitch_blocks_division_showcase_variant";
  ALTER TABLE "pitch_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pitch_blocks_division_showcase_variant" USING "variant"::"public"."enum_pitch_blocks_division_showcase_variant";
  ALTER TABLE "investors_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "investors_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::text;
  DROP TYPE "public"."enum_investors_blocks_division_showcase_variant";
  CREATE TYPE "public"."enum_investors_blocks_division_showcase_variant" AS ENUM('v0-slate-stack', 'v0-baseline', 'v3-baseline-filmstrip', 'v4-animated-filmstrip');
  ALTER TABLE "investors_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::"public"."enum_investors_blocks_division_showcase_variant";
  ALTER TABLE "investors_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_investors_blocks_division_showcase_variant" USING "variant"::"public"."enum_investors_blocks_division_showcase_variant";
  ALTER TABLE "212_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "212_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::text;
  DROP TYPE "public"."enum_212_blocks_division_showcase_variant";
  CREATE TYPE "public"."enum_212_blocks_division_showcase_variant" AS ENUM('v0-slate-stack', 'v0-baseline', 'v3-baseline-filmstrip', 'v4-animated-filmstrip');
  ALTER TABLE "212_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::"public"."enum_212_blocks_division_showcase_variant";
  ALTER TABLE "212_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_212_blocks_division_showcase_variant" USING "variant"::"public"."enum_212_blocks_division_showcase_variant";
  ALTER TABLE "310_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "310_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::text;
  DROP TYPE "public"."enum_310_blocks_division_showcase_variant";
  CREATE TYPE "public"."enum_310_blocks_division_showcase_variant" AS ENUM('v0-slate-stack', 'v0-baseline', 'v3-baseline-filmstrip', 'v4-animated-filmstrip');
  ALTER TABLE "310_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::"public"."enum_310_blocks_division_showcase_variant";
  ALTER TABLE "310_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_310_blocks_division_showcase_variant" USING "variant"::"public"."enum_310_blocks_division_showcase_variant";
  ALTER TABLE "nrc_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "nrc_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::text;
  DROP TYPE "public"."enum_nrc_blocks_division_showcase_variant";
  CREATE TYPE "public"."enum_nrc_blocks_division_showcase_variant" AS ENUM('v0-slate-stack', 'v0-baseline', 'v3-baseline-filmstrip', 'v4-animated-filmstrip');
  ALTER TABLE "nrc_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::"public"."enum_nrc_blocks_division_showcase_variant";
  ALTER TABLE "nrc_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_nrc_blocks_division_showcase_variant" USING "variant"::"public"."enum_nrc_blocks_division_showcase_variant";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "dispatch_issues_id" integer;
  ALTER TABLE "dispatch_issues_cover_lines" ADD CONSTRAINT "dispatch_issues_cover_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_cover_coverlines" ADD CONSTRAINT "dispatch_issues_cover_coverlines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_contents_entries" ADD CONSTRAINT "dispatch_issues_contents_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues_contents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_contents" ADD CONSTRAINT "dispatch_issues_contents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_editorial_paragraphs" ADD CONSTRAINT "dispatch_issues_editorial_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_feature_title_parts" ADD CONSTRAINT "dispatch_issues_feature_title_parts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_feature_meta" ADD CONSTRAINT "dispatch_issues_feature_meta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_feature_paragraphs" ADD CONSTRAINT "dispatch_issues_feature_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_feature_factbox_fields" ADD CONSTRAINT "dispatch_issues_feature_factbox_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_feature_related" ADD CONSTRAINT "dispatch_issues_feature_related_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_dispatches" ADD CONSTRAINT "dispatch_issues_dispatches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_trades" ADD CONSTRAINT "dispatch_issues_trades_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_calendar" ADD CONSTRAINT "dispatch_issues_calendar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_classifieds" ADD CONSTRAINT "dispatch_issues_classifieds_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_archive" ADD CONSTRAINT "dispatch_issues_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues" ADD CONSTRAINT "dispatch_issues_cover_cover_image_id_media_id_fk" FOREIGN KEY ("cover_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "dispatch_issues" ADD CONSTRAINT "dispatch_issues_editorial_portrait_id_media_id_fk" FOREIGN KEY ("editorial_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "dispatch_issues" ADD CONSTRAINT "dispatch_issues_feature_hero_image_id_media_id_fk" FOREIGN KEY ("feature_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "dispatch_issues_cover_lines_order_idx" ON "dispatch_issues_cover_lines" USING btree ("_order");
  CREATE INDEX "dispatch_issues_cover_lines_parent_id_idx" ON "dispatch_issues_cover_lines" USING btree ("_parent_id");
  CREATE INDEX "dispatch_issues_cover_coverlines_order_idx" ON "dispatch_issues_cover_coverlines" USING btree ("_order");
  CREATE INDEX "dispatch_issues_cover_coverlines_parent_id_idx" ON "dispatch_issues_cover_coverlines" USING btree ("_parent_id");
  CREATE INDEX "dispatch_issues_contents_entries_order_idx" ON "dispatch_issues_contents_entries" USING btree ("_order");
  CREATE INDEX "dispatch_issues_contents_entries_parent_id_idx" ON "dispatch_issues_contents_entries" USING btree ("_parent_id");
  CREATE INDEX "dispatch_issues_contents_order_idx" ON "dispatch_issues_contents" USING btree ("_order");
  CREATE INDEX "dispatch_issues_contents_parent_id_idx" ON "dispatch_issues_contents" USING btree ("_parent_id");
  CREATE INDEX "dispatch_issues_editorial_paragraphs_order_idx" ON "dispatch_issues_editorial_paragraphs" USING btree ("_order");
  CREATE INDEX "dispatch_issues_editorial_paragraphs_parent_id_idx" ON "dispatch_issues_editorial_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "dispatch_issues_feature_title_parts_order_idx" ON "dispatch_issues_feature_title_parts" USING btree ("_order");
  CREATE INDEX "dispatch_issues_feature_title_parts_parent_id_idx" ON "dispatch_issues_feature_title_parts" USING btree ("_parent_id");
  CREATE INDEX "dispatch_issues_feature_meta_order_idx" ON "dispatch_issues_feature_meta" USING btree ("_order");
  CREATE INDEX "dispatch_issues_feature_meta_parent_id_idx" ON "dispatch_issues_feature_meta" USING btree ("_parent_id");
  CREATE INDEX "dispatch_issues_feature_paragraphs_order_idx" ON "dispatch_issues_feature_paragraphs" USING btree ("_order");
  CREATE INDEX "dispatch_issues_feature_paragraphs_parent_id_idx" ON "dispatch_issues_feature_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "dispatch_issues_feature_factbox_fields_order_idx" ON "dispatch_issues_feature_factbox_fields" USING btree ("_order");
  CREATE INDEX "dispatch_issues_feature_factbox_fields_parent_id_idx" ON "dispatch_issues_feature_factbox_fields" USING btree ("_parent_id");
  CREATE INDEX "dispatch_issues_feature_related_order_idx" ON "dispatch_issues_feature_related" USING btree ("_order");
  CREATE INDEX "dispatch_issues_feature_related_parent_id_idx" ON "dispatch_issues_feature_related" USING btree ("_parent_id");
  CREATE INDEX "dispatch_issues_dispatches_order_idx" ON "dispatch_issues_dispatches" USING btree ("_order");
  CREATE INDEX "dispatch_issues_dispatches_parent_id_idx" ON "dispatch_issues_dispatches" USING btree ("_parent_id");
  CREATE INDEX "dispatch_issues_trades_order_idx" ON "dispatch_issues_trades" USING btree ("_order");
  CREATE INDEX "dispatch_issues_trades_parent_id_idx" ON "dispatch_issues_trades" USING btree ("_parent_id");
  CREATE INDEX "dispatch_issues_calendar_order_idx" ON "dispatch_issues_calendar" USING btree ("_order");
  CREATE INDEX "dispatch_issues_calendar_parent_id_idx" ON "dispatch_issues_calendar" USING btree ("_parent_id");
  CREATE INDEX "dispatch_issues_classifieds_order_idx" ON "dispatch_issues_classifieds" USING btree ("_order");
  CREATE INDEX "dispatch_issues_classifieds_parent_id_idx" ON "dispatch_issues_classifieds" USING btree ("_parent_id");
  CREATE INDEX "dispatch_issues_archive_order_idx" ON "dispatch_issues_archive" USING btree ("_order");
  CREATE INDEX "dispatch_issues_archive_parent_id_idx" ON "dispatch_issues_archive" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "dispatch_issues_slug_idx" ON "dispatch_issues" USING btree ("slug");
  CREATE INDEX "dispatch_issues_cover_cover_cover_image_idx" ON "dispatch_issues" USING btree ("cover_cover_image_id");
  CREATE INDEX "dispatch_issues_editorial_editorial_portrait_idx" ON "dispatch_issues" USING btree ("editorial_portrait_id");
  CREATE INDEX "dispatch_issues_feature_feature_hero_image_idx" ON "dispatch_issues" USING btree ("feature_hero_image_id");
  CREATE INDEX "dispatch_issues_updated_at_idx" ON "dispatch_issues" USING btree ("updated_at");
  CREATE INDEX "dispatch_issues_created_at_idx" ON "dispatch_issues" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_dispatch_issues_fk" FOREIGN KEY ("dispatch_issues_id") REFERENCES "public"."dispatch_issues"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_dispatch_issues_id_idx" ON "payload_locked_documents_rels" USING btree ("dispatch_issues_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "dispatch_issues_cover_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "dispatch_issues_cover_coverlines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "dispatch_issues_contents_entries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "dispatch_issues_contents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "dispatch_issues_editorial_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "dispatch_issues_feature_title_parts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "dispatch_issues_feature_meta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "dispatch_issues_feature_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "dispatch_issues_feature_factbox_fields" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "dispatch_issues_feature_related" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "dispatch_issues_dispatches" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "dispatch_issues_trades" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "dispatch_issues_calendar" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "dispatch_issues_classifieds" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "dispatch_issues_archive" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "dispatch_issues" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "dispatch_issues_cover_lines" CASCADE;
  DROP TABLE "dispatch_issues_cover_coverlines" CASCADE;
  DROP TABLE "dispatch_issues_contents_entries" CASCADE;
  DROP TABLE "dispatch_issues_contents" CASCADE;
  DROP TABLE "dispatch_issues_editorial_paragraphs" CASCADE;
  DROP TABLE "dispatch_issues_feature_title_parts" CASCADE;
  DROP TABLE "dispatch_issues_feature_meta" CASCADE;
  DROP TABLE "dispatch_issues_feature_paragraphs" CASCADE;
  DROP TABLE "dispatch_issues_feature_factbox_fields" CASCADE;
  DROP TABLE "dispatch_issues_feature_related" CASCADE;
  DROP TABLE "dispatch_issues_dispatches" CASCADE;
  DROP TABLE "dispatch_issues_trades" CASCADE;
  DROP TABLE "dispatch_issues_calendar" CASCADE;
  DROP TABLE "dispatch_issues_classifieds" CASCADE;
  DROP TABLE "dispatch_issues_archive" CASCADE;
  DROP TABLE "dispatch_issues" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_dispatch_issues_fk";
  
  ALTER TABLE "projects_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "projects_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::text;
  DROP TYPE "public"."enum_projects_blocks_division_showcase_variant";
  CREATE TYPE "public"."enum_projects_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  ALTER TABLE "projects_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::"public"."enum_projects_blocks_division_showcase_variant";
  ALTER TABLE "projects_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_projects_blocks_division_showcase_variant" USING "variant"::"public"."enum_projects_blocks_division_showcase_variant";
  ALTER TABLE "news_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "news_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::text;
  DROP TYPE "public"."enum_news_blocks_division_showcase_variant";
  CREATE TYPE "public"."enum_news_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  ALTER TABLE "news_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::"public"."enum_news_blocks_division_showcase_variant";
  ALTER TABLE "news_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_news_blocks_division_showcase_variant" USING "variant"::"public"."enum_news_blocks_division_showcase_variant";
  ALTER TABLE "home_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "home_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::text;
  DROP TYPE "public"."enum_home_blocks_division_showcase_variant";
  CREATE TYPE "public"."enum_home_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  ALTER TABLE "home_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::"public"."enum_home_blocks_division_showcase_variant";
  ALTER TABLE "home_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_home_blocks_division_showcase_variant" USING "variant"::"public"."enum_home_blocks_division_showcase_variant";
  ALTER TABLE "about_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "about_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::text;
  DROP TYPE "public"."enum_about_blocks_division_showcase_variant";
  CREATE TYPE "public"."enum_about_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  ALTER TABLE "about_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::"public"."enum_about_blocks_division_showcase_variant";
  ALTER TABLE "about_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_about_blocks_division_showcase_variant" USING "variant"::"public"."enum_about_blocks_division_showcase_variant";
  ALTER TABLE "contact_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "contact_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::text;
  DROP TYPE "public"."enum_contact_blocks_division_showcase_variant";
  CREATE TYPE "public"."enum_contact_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  ALTER TABLE "contact_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::"public"."enum_contact_blocks_division_showcase_variant";
  ALTER TABLE "contact_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_contact_blocks_division_showcase_variant" USING "variant"::"public"."enum_contact_blocks_division_showcase_variant";
  ALTER TABLE "jobs_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "jobs_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::text;
  DROP TYPE "public"."enum_jobs_blocks_division_showcase_variant";
  CREATE TYPE "public"."enum_jobs_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  ALTER TABLE "jobs_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::"public"."enum_jobs_blocks_division_showcase_variant";
  ALTER TABLE "jobs_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_jobs_blocks_division_showcase_variant" USING "variant"::"public"."enum_jobs_blocks_division_showcase_variant";
  ALTER TABLE "pitch_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pitch_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::text;
  DROP TYPE "public"."enum_pitch_blocks_division_showcase_variant";
  CREATE TYPE "public"."enum_pitch_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  ALTER TABLE "pitch_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::"public"."enum_pitch_blocks_division_showcase_variant";
  ALTER TABLE "pitch_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pitch_blocks_division_showcase_variant" USING "variant"::"public"."enum_pitch_blocks_division_showcase_variant";
  ALTER TABLE "investors_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "investors_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::text;
  DROP TYPE "public"."enum_investors_blocks_division_showcase_variant";
  CREATE TYPE "public"."enum_investors_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  ALTER TABLE "investors_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::"public"."enum_investors_blocks_division_showcase_variant";
  ALTER TABLE "investors_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_investors_blocks_division_showcase_variant" USING "variant"::"public"."enum_investors_blocks_division_showcase_variant";
  ALTER TABLE "212_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "212_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::text;
  DROP TYPE "public"."enum_212_blocks_division_showcase_variant";
  CREATE TYPE "public"."enum_212_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  ALTER TABLE "212_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::"public"."enum_212_blocks_division_showcase_variant";
  ALTER TABLE "212_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_212_blocks_division_showcase_variant" USING "variant"::"public"."enum_212_blocks_division_showcase_variant";
  ALTER TABLE "310_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "310_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::text;
  DROP TYPE "public"."enum_310_blocks_division_showcase_variant";
  CREATE TYPE "public"."enum_310_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  ALTER TABLE "310_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::"public"."enum_310_blocks_division_showcase_variant";
  ALTER TABLE "310_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_310_blocks_division_showcase_variant" USING "variant"::"public"."enum_310_blocks_division_showcase_variant";
  ALTER TABLE "nrc_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "nrc_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::text;
  DROP TYPE "public"."enum_nrc_blocks_division_showcase_variant";
  CREATE TYPE "public"."enum_nrc_blocks_division_showcase_variant" AS ENUM('v0-baseline', 'v1-accordion', 'v2-cards', 'v3-split', 'v4-timeline');
  ALTER TABLE "nrc_blocks_division_showcase" ALTER COLUMN "variant" SET DEFAULT 'v0-baseline'::"public"."enum_nrc_blocks_division_showcase_variant";
  ALTER TABLE "nrc_blocks_division_showcase" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_nrc_blocks_division_showcase_variant" USING "variant"::"public"."enum_nrc_blocks_division_showcase_variant";
  DROP INDEX "payload_locked_documents_rels_dispatch_issues_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "dispatch_issues_id";
  DROP TYPE "public"."enum_dispatch_issues_cover_lines_style";
  DROP TYPE "public"."enum_dispatch_issues_feature_paragraphs_variant";
  DROP TYPE "public"."enum_dispatch_issues_feature_factbox_fields_accent";
  DROP TYPE "public"."enum_dispatch_issues_dispatches_division";`)
}
