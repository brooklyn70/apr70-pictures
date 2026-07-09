import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Property page v2-style rebuild — additive Project fields:
 *
 *  - projects.synopsis            (textarea — the property synopsis)
 *  - projects_gallery             (array: image upload OR external URL, caption,
 *                                  credit REQUIRED for provenance)
 *  - projects.pitch_deck_*        (group: status reserved|available, file, note)
 *
 * Hand-written (migrate:create is blocked by the numeric "212"/"310" global
 * slugs), following the DDL conventions of 20260705_v4_zine_blocks.ts.
 * All statements are idempotent so the migration is safe on mixed states.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_pitch_deck_status" AS ENUM('reserved', 'available');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "synopsis" varchar;
    ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "pitch_deck_status" "enum_projects_pitch_deck_status" DEFAULT 'reserved';
    ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "pitch_deck_file_id" integer REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "pitch_deck_note" varchar;
    CREATE INDEX IF NOT EXISTS "projects_pitch_deck_pitch_deck_file_idx" ON "projects" USING btree ("pitch_deck_file_id");

    CREATE TABLE IF NOT EXISTS "projects_gallery" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action,
      "image_url" varchar,
      "caption" varchar,
      "credit" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "projects_gallery_order_idx" ON "projects_gallery" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "projects_gallery_parent_id_idx" ON "projects_gallery" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "projects_gallery_image_idx" ON "projects_gallery" USING btree ("image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "projects_gallery";
    ALTER TABLE "projects" DROP COLUMN IF EXISTS "synopsis";
    ALTER TABLE "projects" DROP COLUMN IF EXISTS "pitch_deck_status";
    ALTER TABLE "projects" DROP COLUMN IF EXISTS "pitch_deck_file_id";
    ALTER TABLE "projects" DROP COLUMN IF EXISTS "pitch_deck_note";
    DROP TYPE IF EXISTS "public"."enum_projects_pitch_deck_status";
  `)
}
