import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the per-division `theme` skin selector to the 212 / 310 / nrc globals.
 * Option values mirror web/src/designs/manifest.ts (DesignSlug).
 * Column is nullable — empty means "use the division's default skin".
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_212_theme" AS ENUM('signature', 'noir', 'amber-heat', 'imax-deep', 'daylight');
    CREATE TYPE "public"."enum_310_theme" AS ENUM('signature', 'noir', 'amber-heat', 'imax-deep', 'daylight');
    CREATE TYPE "public"."enum_nrc_theme" AS ENUM('signature', 'noir', 'amber-heat', 'imax-deep', 'daylight');
    ALTER TABLE "212" ADD COLUMN IF NOT EXISTS "theme" "enum_212_theme";
    ALTER TABLE "310" ADD COLUMN IF NOT EXISTS "theme" "enum_310_theme";
    ALTER TABLE "nrc" ADD COLUMN IF NOT EXISTS "theme" "enum_nrc_theme";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "212" DROP COLUMN IF EXISTS "theme";
    ALTER TABLE "310" DROP COLUMN IF EXISTS "theme";
    ALTER TABLE "nrc" DROP COLUMN IF EXISTS "theme";
    DROP TYPE IF EXISTS "public"."enum_212_theme";
    DROP TYPE IF EXISTS "public"."enum_310_theme";
    DROP TYPE IF EXISTS "public"."enum_nrc_theme";
  `)
}
