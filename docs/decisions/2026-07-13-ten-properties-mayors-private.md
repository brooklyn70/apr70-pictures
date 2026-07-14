# Decision — Ten properties; The Mayors private until counsel clears

**Date:** 2026-07-13  
**Status:** Active until Marco says otherwise  
**Ruling (Marco):** The public slate is **ten properties**. Nine are on `/slate`. **The Mayors** is the one private title — left off the public site while legal counsel review completes. LADV Universe is **not** an eleventh property.

## What exists today (do not delete)

| Field | Value |
|-------|--------|
| Collection | `projects` |
| Title | The Mayors |
| Slug | `mayors` |
| Typical local id | `6` (confirm with a query; do not hardcode forever) |
| `public_slate` / `publicSlate` | `false` |
| Public URL | `/work/mayors` → **302 → `/slate`** (by design while private) |

The project row, media, and detail page stay in the CMS. Only public listing and direct public access are gated.

## Public copy law (while private)

Use **ten** / **nine on the slate** / **one private while legal counsel review completes**. Do **not** say eleven, and do not imply two titles are private.

Surfaces that must stay aligned (three layers — see CLAUDE.md hard rule 16):

1. Vault canon: `11.12 V9 Build/02-copy` (`slate.md`, `index.md`, `chrome.md` as needed)
2. Live Postgres (local + NAS after deploy) — page globals / site settings copy
3. `web/src/pages/llms.txt.ts` (and any seed defaults that re-arm copy)

Change Register flag: vault `11.14 V10 Build/00 V10 Change Register.md` — properties count marked **RESOLVED** at ten.

## When Marco asks to put The Mayors back on the public slate

1. **CMS:** Admin → Projects → The Mayors → set `publicSlate` = true, set `slateOrder` among the ten, save/publish.
2. **Verify:** `/slate` lists ten public cards including Mayors; `/work/mayors` returns **200** (not 302 to `/slate`).
3. **Copy (all three layers):** Retire the “one private / counsel review” language. Public count becomes **ten properties** with **all ten** on the slate (or whatever Marco specifies that day — confirm wording with him). Update vault `02-copy`, live DB, `llms.txt` / seed.
4. **Deploy** if staging/production need the DB + web changes; diff `site_settings` local vs NAS before dump (logo height etc.).
5. **Recap:** Note the restore in Change Register / MASTER-RECAP lawyer packet line so the next agent does not re-hide it.

## What not to do

- Do not delete the Mayors project to “fix” the count.
- Do not invent an eleventh property to match old “Eleven properties” copy.
- Do not flip `publicSlate` without updating the ten/nine/one counsel language — and the reverse.
