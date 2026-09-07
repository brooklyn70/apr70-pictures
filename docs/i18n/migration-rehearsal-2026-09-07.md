# i18n migration rehearsal — 2026-09-07

**Migration:** `cms/src/migrations/20260907_195421_i18n_localization.ts`
**Rehearsal database:** local Postgres 16 in Docker (`apr70-i18n-postgres`, `127.0.0.1:5433/apr70_cms`),
restored from a fresh copy of the live NAS database. 20 migrations applied, last
`20260904_070000_hero_line`; 206 media rows, 10 projects.

The one unacceptable outcome for this migration is losing existing English content.
This document is the evidence that it does not.

---

## What the migration does

1. Creates **301 `<table>_locales` companion tables** plus the `_locales` enum, the
   `site_settings_enabled_locales` table, and `media.ai_frame`.
2. **Copies every existing English value into the new `_locales` tables** with
   `_locale = 'en'`, and seeds `site_settings_enabled_locales` with `en`.
3. **Only then** drops the 631 now-obsolete single-locale columns.

Step 2 is hand-written. Payload's generator does not emit it: left as generated, the
migration would create the empty companion tables and then drop the columns holding
every English string on the site. This was confirmed by inspecting the generated
file (`INSERT INTO` count in `up()` was zero) before it was rewritten.

`down()` is the mirror, in the mirrored order: re-add the columns, copy the `'en'`
rows back into them, then drop the companion tables. Columns that are `NOT NULL` are
re-added with a temporary default (a populated table will not otherwise accept them)
which is dropped again after the values are restored.

### Two defects in the generated migration, corrected by hand

Three columns — `projects.story_year`, `projects.story_place`, `projects.hero_line` —
were added by hand-written migrations (`20260718_231500_story_meta`,
`20260904_070000_hero_line`) that shipped **without snapshot JSON**, exactly as their
own comments warn ("strip them there"). The generator therefore diffed against a
stale snapshot and:

- emitted `ALTER TABLE "projects" ADD COLUMN "story_year"` in `up()`, which would
  have failed against the live database — **removed**;
- never emitted the `DROP COLUMN` for `story_place` and `hero_line`, which are now
  localized and must move — **added**, with the matching re-add in `down()`.

---

## Commands, in order

```sh
# 0. safety net, before anything
docker exec apr70-i18n-postgres pg_dump -U postgres -Fc apr70_cms > before-i18n-migration.pgc

# 1. generate (17 drizzle rename prompts, all answered "create column")
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5433/apr70_cms \
PAYLOAD_SECRET=… pnpm -C cms payload migrate:create i18n_localization

# 2. (hand work) review the SQL, add the data move, fix the two defects above

# 3. apply
DATABASE_URL=… PAYLOAD_SECRET=… pnpm -C cms migrate

# 4. prove reversibility, then finish applied
DATABASE_URL=… PAYLOAD_SECRET=… pnpm -C cms payload migrate:down
DATABASE_URL=… PAYLOAD_SECRET=… pnpm -C cms migrate

# 5. types, backfill, build
DATABASE_URL=… PAYLOAD_SECRET=… pnpm -C cms generate:types
DATABASE_URL=… PAYLOAD_SECRET=… pnpm -C cms aimark:apply
DATABASE_URL=… PAYLOAD_SECRET=… pnpm -C cms preflight
```

SQL is read back through `docker exec -i apr70-i18n-postgres psql -U postgres -d apr70_cms`
(the `-i` is mandatory — CLAUDE.md rule 16).

---

## Evidence 1 — the exhaustive count, all 631 columns

Not a sample. For **every one of the 631 columns that moved**, the number of non-empty
values was counted on the base column before the migration, and on the `_locales`
table (`WHERE _locale = 'en'`) after it.

| | columns compared | columns holding data | non-empty values |
|---|---|---|---|
| before `migrate` (base columns) | 631 | 268 | **1019** |
| after `migrate` (`_locales`, `_locale='en'`) | 631 | 268 | **1019** |
| after `migrate:down` (base columns again) | 631 | 268 | **1019** |
| after `migrate` again (`_locales`) | 631 | 268 | **1019** |

**Per-column mismatches: none.** Every column carries exactly the same number of
non-empty values it carried before, in both directions, across a full down/up round trip.

## Evidence 2 — spot checks

| Check | Before | After |
|---|---|---|
| Home page, first section heading | `The classics never go out of style.` | same, `_locale = en`, in `v9_home_blocks_photo_fold_locales` |
| Site Settings colophon | `APR 70 PICTURES, Long Island City, New York. Established 202…` | same, `_locale = en`, in `site_settings_locales` |
| Project loglines | 10 projects, 9 with a logline (`mayors` blank) | all 10 rows in `projects_locales`, `_locale = en`, same values |
| Media `alt` | 206 non-empty of 206 rows | 206 rows in `media_locales`, `_locale = en` |
| `media.alt` base column | present | gone (moved) |
| `media.ai_frame` | absent | present |
| `site_settings_enabled_locales` | absent | present, seeded `en` |

## Evidence 3 — the API, against the migrated database

Admin booted with `PORT=3001 pnpm -C cms dev`:

| Request | Result |
|---|---|
| `GET /admin` | `200` |
| `GET /api/globals/site-settings?locale=pt&fallback-locale=en` | `200`, `v9Chrome.cta` = `Request materials →` (English served through the fallback), `enabledLocales` = `["en"]` |
| `GET /api/globals/site-settings?locale=all` | `200`, every localized field is a per-locale map (`{"en": "…"}`) |
| `GET /api/media/59` | `aiFrame: true`, alt intact |

`pnpm -C cms preflight` (the full Next build of the admin) exits 0.

---

## Deploy order

Unchanged from the existing deploy script, which already runs Payload migrations
before starting the new cms container: **migrate first, then start**. The migration
is one transaction per `db.execute` block and takes ~1.6 s against a copy of the live
database. Take the NAS database dump first anyway.

The AI-mark backfill is a separate, idempotent step to run **after** the migration:
`pnpm -C cms aimark:apply`. It flagged **39 of 206** media documents on the rehearsal
database. Re-running it flags 0 more.
