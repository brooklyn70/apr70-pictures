# Claude Code Handoff — 2026-05-13 Afternoon

**From:** Claude Sonnet 4.6 (this session)
**To:** Claude Sonnet 4.6 (next session)
**Repo:** `brooklyn70/apr70-pictures` — local path `/Users/marco/websites/apr70-pictures`
**NAS stack:** live at `kimaserver:8080`
**Repo tip at handoff:** 3eca748 on main

---

## What was accomplished this session

Starting state: /212, /310, /nrc routes MISSING. Globals not in Payload schema.

Ending state: all 3 division routes return HTTP 200. Payload globals exist in DB with empty layout arrays.

### Completed work

1. **3 Payload globals created** — `cms/src/globals/Division212.ts`, `Division310.ts`, `DivisionNRC.ts`. Slugs: `212`, `310`, `nrc`. All 10 blocks in layout field, same pattern as `About.ts`.

2. **Registered in `cms/src/payload.config.ts`** — `Division212`, `Division310`, `DivisionNRC` added to globals array.

3. **Fetch functions added to `web/src/lib/payload.ts`** — `fetchDivision212Global`, `fetchDivision310Global`, `fetchDivisionNRCGlobal`. All call `fetchGlobal<PageGlobalData>('212'|'310'|'nrc')`.

4. **3 Astro pages created** — `web/src/pages/212.astro`, `310.astro`, `nrc.astro`. BlockRenderer pattern, same as `about.astro`.

5. **Migration 20260513_194834** — Generated via volume-mount pattern on NAS, pulled to local, registered in `cms/src/migrations/index.ts`.
   - **Gotcha:** The auto-generated migration was a bloated 3027-line full schema dump (only the first migration has a JSON snapshot so Payload diffed from that). Replaced it with a clean 852-line targeted migration containing only 212/310/nrc enums, tables, FK constraints, and indexes.
   - Applied successfully on NAS. All 3 globals verified via `GET /api/globals/{212,310,nrc}` → `{"layout":[]}`.

6. **CMS + web containers rebuilt and restarted on NAS.**

---

## Verified live state

```
GET http://kimaserver:8080/api/globals/212  → {"layout":[]}  200
GET http://kimaserver:8080/api/globals/310  → {"layout":[]}  200
GET http://kimaserver:8080/api/globals/nrc  → {"layout":[]}  200
GET http://kimaserver:8080/212              → 200
GET http://kimaserver:8080/310             → 200
GET http://kimaserver:8080/nrc             → 200
```

All 4 containers healthy on NAS.

---

## Key files changed this session

```
cms/src/globals/Division212.ts          — NEW: Payload global slug "212"
cms/src/globals/Division310.ts          — NEW: Payload global slug "310"
cms/src/globals/DivisionNRC.ts          — NEW: Payload global slug "nrc"
cms/src/payload.config.ts               — 3 new globals registered
cms/src/migrations/20260513_194834.ts   — NEW: targeted delta migration (212/310/nrc only)
cms/src/migrations/index.ts             — 4 migrations registered
web/src/lib/payload.ts                  — 3 new fetch functions
web/src/pages/212.astro                 — NEW
web/src/pages/310.astro                 — NEW
web/src/pages/nrc.astro                 — NEW
BRIEF.md                                — updated
```

---

## What's next (priority order)

### 1. Add content to division pages (requires-gui)
The 3 division globals exist in Payload but have no layout blocks. Go to `kimaserver:8080/admin` and add blocks to each:
- `/admin/globals/212` — hero block + a DivisionBlock or TwoColBlock
- `/admin/globals/310` — same pattern
- `/admin/globals/nrc` — same pattern

If you want to seed initial content programmatically, add `updateGlobal('212', {...}, token)` calls to `cms/scripts/migrate-v2/apply.ts` (look at how investors is seeded as a model). No v2 JSON exists for division pages — content must be synthesized.

### 2. Footer links seeding
`footer-links` global exists in schema, NOT seeded. V2 source: `v2-export/content/pages/footer-more.json`. Read `cms/src/globals/FooterLinks.ts` first — it has `primaryNav`, `divisionNav`, `moreNav` arrays, NOT a layout blocks field, so the approach is different from page globals.

### 3. Media migration (NAS shell task)
```sh
# On NAS:
rsync -av --no-delete /volume1/apps/apr70/public/ \
  $(docker inspect apr70v3_cms_media --format '{{.Mountpoint}}')
# Then create Media collection rows and re-run seeder with real relationships
```

### 4. Delete /test-hero dev artifact
`web/src/pages/test-hero.astro` — delete it, commit, push, redeploy web container.

### 5. Visual QA (requires-gui)
All pages need style/layout review.

---

## Migration pattern reminder (for future globals)

The volume-mount `migrate:create` generates a FULL SCHEMA DUMP if the migration JSON snapshot is missing for intermediate migrations. This is a known issue with this repo's migration history. Solution for next time:

Either:
- Accept the bloated migration and replace it with a targeted one (same approach as this session)
- OR: add a `.json` snapshot file for each migration before running migrate:create

The `.json` file format is Drizzle's internal schema snapshot. For now, the replace-after-generate approach works fine.

---

## CLAUDE.md hard rules reminder

- No hardcoded page layouts — BlockRenderer only
- Context handoff at 55% (rule #14)
- Preflight before NAS deploy: `pnpm preflight` from `cms/`
- No emoji in commits or code
- GSAP only for animation
