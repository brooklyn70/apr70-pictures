/**
 * The site version this CMS is dressed for.
 *
 * THE LAW (Marco 2026-07-13): the site and Payload ship together. When the
 * public site's version bumps, bump it HERE — this is the only place a
 * version number is written. Every admin-visible label that names a version
 * reads from this constant, so the admin can never again sit at v9 while the
 * site is at v10.
 *
 * Deliberately NOT tracked by this constant: the global slugs (`v9-home`,
 * `v9-slate`, …) and the `v9Chrome` field name. Those are database keys —
 * Postgres tables and columns are named after them. Renaming them is a data
 * migration, not a label change, and it buys nothing: they are invisible in
 * the admin UI except in the address bar.
 */
export const SITE_VERSION = 'v11'
