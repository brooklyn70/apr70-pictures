import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * DISPATCH switch (Marco 2026-07-13).
 *
 * Adds the `dispatch` group to site_settings — the two columns behind the
 * "Publish the DISPATCH page" checkbox in the admin. The public /dispatch
 * route reads this on every render (site is SSR), so ticking the box in
 * Payload takes the page live on refresh: no rebuild, no deploy.
 *
 * Ships DEFAULT false — the page stays dark until Marco says otherwise.
 * The DispatchIssue content itself was never dropped; only the admin tile
 * was hidden in the v10 trim, and this release un-hides it.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "dispatch_enabled" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "dispatch_nav_label" varchar DEFAULT 'Dispatch';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "dispatch_enabled";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "dispatch_nav_label";
  `)
}
