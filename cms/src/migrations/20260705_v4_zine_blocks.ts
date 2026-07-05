import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * V4 zine re-arrangement — block tables for the three new zine blocks:
 *
 *  - zineMasthead  (Home global)            — DISPATCH front-door identity masthead
 *  - zinePassage   (Home + 212/310/nrc)     — text-forward teaser / division copy section
 *  - zineSynopsis  (Projects collection)    — synopsis-as-hero property treatment
 *
 * Hand-written (generate:types / migrate:create are blocked by the numeric
 * "212"/"310" global slugs), following the DDL conventions of
 * 20260513_024245.ts. All statements are idempotent (IF NOT EXISTS) so the
 * migration is safe to apply on databases in mixed states.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "home_blocks_zine_masthead" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "offices_line" varchar,
      "issue_label" varchar,
      "dek" varchar,
      "block_name" varchar
    );
    CREATE INDEX IF NOT EXISTS "home_blocks_zine_masthead_order_idx" ON "home_blocks_zine_masthead" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "home_blocks_zine_masthead_parent_id_idx" ON "home_blocks_zine_masthead" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "home_blocks_zine_masthead_path_idx" ON "home_blocks_zine_masthead" USING btree ("_path");

    CREATE TABLE IF NOT EXISTS "home_blocks_zine_passage" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "kicker" varchar,
      "heading" varchar NOT NULL,
      "lede" varchar,
      "body" varchar,
      "block_name" varchar
    );
    CREATE INDEX IF NOT EXISTS "home_blocks_zine_passage_order_idx" ON "home_blocks_zine_passage" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "home_blocks_zine_passage_parent_id_idx" ON "home_blocks_zine_passage" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "home_blocks_zine_passage_path_idx" ON "home_blocks_zine_passage" USING btree ("_path");

    CREATE TABLE IF NOT EXISTS "home_blocks_zine_passage_links" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL REFERENCES "public"."home_blocks_zine_passage"("id") ON DELETE cascade ON UPDATE no action,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "href" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "home_blocks_zine_passage_links_order_idx" ON "home_blocks_zine_passage_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "home_blocks_zine_passage_links_parent_id_idx" ON "home_blocks_zine_passage_links" USING btree ("_parent_id");

    CREATE TABLE IF NOT EXISTS "212_blocks_zine_passage" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "public"."212"("id") ON DELETE cascade ON UPDATE no action,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "kicker" varchar,
      "heading" varchar NOT NULL,
      "lede" varchar,
      "body" varchar,
      "block_name" varchar
    );
    CREATE INDEX IF NOT EXISTS "212_blocks_zine_passage_order_idx" ON "212_blocks_zine_passage" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "212_blocks_zine_passage_parent_id_idx" ON "212_blocks_zine_passage" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "212_blocks_zine_passage_path_idx" ON "212_blocks_zine_passage" USING btree ("_path");

    CREATE TABLE IF NOT EXISTS "212_blocks_zine_passage_links" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL REFERENCES "public"."212_blocks_zine_passage"("id") ON DELETE cascade ON UPDATE no action,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "href" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "212_blocks_zine_passage_links_order_idx" ON "212_blocks_zine_passage_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "212_blocks_zine_passage_links_parent_id_idx" ON "212_blocks_zine_passage_links" USING btree ("_parent_id");

    CREATE TABLE IF NOT EXISTS "310_blocks_zine_passage" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "public"."310"("id") ON DELETE cascade ON UPDATE no action,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "kicker" varchar,
      "heading" varchar NOT NULL,
      "lede" varchar,
      "body" varchar,
      "block_name" varchar
    );
    CREATE INDEX IF NOT EXISTS "310_blocks_zine_passage_order_idx" ON "310_blocks_zine_passage" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "310_blocks_zine_passage_parent_id_idx" ON "310_blocks_zine_passage" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "310_blocks_zine_passage_path_idx" ON "310_blocks_zine_passage" USING btree ("_path");

    CREATE TABLE IF NOT EXISTS "310_blocks_zine_passage_links" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL REFERENCES "public"."310_blocks_zine_passage"("id") ON DELETE cascade ON UPDATE no action,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "href" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "310_blocks_zine_passage_links_order_idx" ON "310_blocks_zine_passage_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "310_blocks_zine_passage_links_parent_id_idx" ON "310_blocks_zine_passage_links" USING btree ("_parent_id");

    CREATE TABLE IF NOT EXISTS "nrc_blocks_zine_passage" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "public"."nrc"("id") ON DELETE cascade ON UPDATE no action,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "kicker" varchar,
      "heading" varchar NOT NULL,
      "lede" varchar,
      "body" varchar,
      "block_name" varchar
    );
    CREATE INDEX IF NOT EXISTS "nrc_blocks_zine_passage_order_idx" ON "nrc_blocks_zine_passage" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "nrc_blocks_zine_passage_parent_id_idx" ON "nrc_blocks_zine_passage" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "nrc_blocks_zine_passage_path_idx" ON "nrc_blocks_zine_passage" USING btree ("_path");

    CREATE TABLE IF NOT EXISTS "nrc_blocks_zine_passage_links" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL REFERENCES "public"."nrc_blocks_zine_passage"("id") ON DELETE cascade ON UPDATE no action,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "href" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "nrc_blocks_zine_passage_links_order_idx" ON "nrc_blocks_zine_passage_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "nrc_blocks_zine_passage_links_parent_id_idx" ON "nrc_blocks_zine_passage_links" USING btree ("_parent_id");

    CREATE TABLE IF NOT EXISTS "projects_blocks_zine_synopsis" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "kicker" varchar,
      "title" varchar NOT NULL,
      "working_draft" boolean DEFAULT true,
      "logline" varchar,
      "body" varchar NOT NULL,
      "note" varchar,
      "block_name" varchar
    );
    CREATE INDEX IF NOT EXISTS "projects_blocks_zine_synopsis_order_idx" ON "projects_blocks_zine_synopsis" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "projects_blocks_zine_synopsis_parent_id_idx" ON "projects_blocks_zine_synopsis" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "projects_blocks_zine_synopsis_path_idx" ON "projects_blocks_zine_synopsis" USING btree ("_path");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "home_blocks_zine_passage_links";
    DROP TABLE IF EXISTS "home_blocks_zine_passage";
    DROP TABLE IF EXISTS "home_blocks_zine_masthead";
    DROP TABLE IF EXISTS "212_blocks_zine_passage_links";
    DROP TABLE IF EXISTS "212_blocks_zine_passage";
    DROP TABLE IF EXISTS "310_blocks_zine_passage_links";
    DROP TABLE IF EXISTS "310_blocks_zine_passage";
    DROP TABLE IF EXISTS "nrc_blocks_zine_passage_links";
    DROP TABLE IF EXISTS "nrc_blocks_zine_passage";
    DROP TABLE IF EXISTS "projects_blocks_zine_synopsis";
  `)
}
