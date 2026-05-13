# Claude Code Handoff — 2026-05-13 Evening

**From:** Claude Sonnet 4.6 (this session)
**To:** Claude Sonnet 4.6 (next session)
**Repo:** `brooklyn70/apr70-pictures` — local path `/Users/marco/websites/apr70-pictures`
**NAS stack:** live at `kimaserver:8080`
**Repo tip at handoff:** 3e32487 on main

---

## What was accomplished this session

Starting state: seeder was hanging on `getPayload()`. Nothing was seeded except home + site-settings.

Ending state: all content routes live, 9 projects + 4 news articles seeded.

### Completed work (in order)

1. **Rewrote `apply.ts` seeder** — replaced `getPayload()` Local API with REST API (`fetch` to `/api/users/login` then `/api/globals/{slug}`). The Local API hung indefinitely with 8 globals registered.

2. **Seeder v0.2.0** — seeded 5 page globals: about, contact, jobs, pitch, investors. All live.

3. **Added `Project` + `NewsArticle` collections** to Payload CMS:
   - `cms/src/collections/Project.ts` — slug `projects`, fields: title, slug, division, subtitle, status, year, heroImage, layout: Block[]
   - `cms/src/collections/NewsArticle.ts` — slug `news` (NOT `news-articles` — postgres 63-char identifier limit), fields: title, slug, date, deck, featured, layout: Block[]
   - Registered in `cms/src/payload.config.ts`

4. **Generated migration `20260513_185804`** via `payload migrate:create` in the seeder container with volume-mounted migrations dir. Applied on NAS.

5. **Seeder v0.3.0** — added `upsertDoc()` REST helper, seeds 9 projects + 4 news articles. Notable fixes applied:
   - Status values `bible` / `pitch` normalized to `null` (not in schema select options)
   - v2 media IDs (integers like `21`) stripped to `null` via `stripV2MediaRefs()` — media not migrated yet
   - Path filter bug fixed: `f.kind === 'project'` and `includes('news/')` instead of leading-slash patterns
   - `map-layout.ts` dispatch fixed: added `startsWith('projects/')` / `startsWith('news/')` alongside `includes('/projects/')` / `includes('/news/')`

6. **Built 4 Astro pages**: `work.astro`, `work/[slug].astro`, `news/index.astro`, `news/[slug].astro`

7. **Added fetch functions** to `web/src/lib/payload.ts`: `fetchProjects`, `fetchProject`, `fetchNewsArticles`, `fetchNewsArticle`

8. **Context handoff rule** added to CLAUDE.md (hard rule #14) and saved to project memory.

9. **Credentials**: admin user is `caruso@apr70.com`. Password is in `/Users/marco/websites/apr70-pictures/.env` (gitignored) and on NAS at `/volume1/apps/apr70-pictures/.env`.

---

## Current live routes

| Route | Status |
|-------|--------|
| `/` | LIVE |
| `/about`, `/contact`, `/jobs`, `/pitch`, `/investors` | LIVE |
| `/work` | LIVE — 9 project cards |
| `/work/[slug]` | LIVE — 9 projects |
| `/news` | LIVE — 4 articles |
| `/news/[slug]` | LIVE — 4 articles |
| `/212`, `/310`, `/nrc` | MISSING |
| `/test-hero` | Dev artifact — delete before launch |

---

## What's next (priority order for a claude agent)

### 1. Division pages — `/212`, `/310`, `/nrc` (highest value, unblocked)

Each division needs:
- A Payload Global (`212`, `310`, `nrc`) — same pattern as `About.ts`, all 10 blocks
- A migration (use the volume-mount `migrate:create` pattern — see below)
- An Astro page in `web/src/pages/`
- A fetch function in `web/src/lib/payload.ts`

The division content in v2 is in `v2-export/content/pages/` — check the existing files for structure. There may not be dedicated division page JSONs; if not, synthesize minimal content (hero + divisionShowcase block referencing the relevant division).

### 2. Footer links seeding

`footer-links` global exists in schema, not seeded. V2 source: `v2-export/content/pages/footer-more.json`. Add `updateGlobal('footer-links', ..., token)` call to `apply.ts` after the investors global upsert. The synthesizer `synthesizeFooterMoreBlocks` exists in `map-layout.ts` but it emits richText — the `FooterLinks` global has a different schema (primaryNav, divisionNav, moreNav arrays). Read `cms/src/globals/FooterLinks.ts` first to understand the shape.

### 3. Delete `/test-hero` dev artifact

`web/src/pages/test-hero.astro` — just delete it.

### 4. Media migration (NAS shell task — can be done independently)

```sh
# On NAS:
rsync -av --no-delete /volume1/apps/apr70/public/ \
  $(docker inspect apr70v3_cms_media --format '{{.Mountpoint}}')
# Then create Media collection rows and re-run seeder to wire relationships
```

---

## How to generate a Payload migration (the volume-mount pattern)

After adding new globals/collections and pushing:

```sh
# On NAS — rebuild seeder, then generate migration with volume mount:
/usr/local/bin/docker compose -f /volume1/apps/apr70-pictures/docker-compose.yml \
  -p apr70v3 --profile seed build cms-seeder

/usr/local/bin/docker compose -f /volume1/apps/apr70-pictures/docker-compose.yml \
  -p apr70v3 --profile seed run --rm --no-deps \
  -v /volume1/apps/apr70-pictures/cms/src/migrations:/app/src/migrations \
  cms-seeder pnpm payload migrate:create

# Migration file appears on NAS at cms/src/migrations/YYYYMMDD_HHMMSS.ts
# Pull it to local:
ssh apr70-nas "cat /volume1/apps/apr70-pictures/cms/src/migrations/YYYYMMDD_HHMMSS.ts" \
  > /Users/marco/websites/apr70-pictures/cms/src/migrations/YYYYMMDD_HHMMSS.ts

# Register it in cms/src/migrations/index.ts, commit + push, then apply:
/usr/local/bin/docker compose ... --profile seed run --rm --no-deps cms-seeder \
  node_modules/.bin/payload migrate
```

---

## Key files

```
cms/src/payload.config.ts          — 4 collections, 8 globals registered
cms/src/collections/Project.ts     — slug: projects
cms/src/collections/NewsArticle.ts — slug: news (not news-articles)
cms/src/migrations/index.ts        — 3 migrations registered
cms/scripts/migrate-v2/apply.ts    — seeder v0.3.0, REST API, upsertDoc
cms/scripts/migrate-v2/map-layout.ts — synthesizers (correct, don't remove fixes)
web/src/lib/payload.ts             — all fetch functions
web/src/pages/work.astro           — project list
web/src/pages/work/[slug].astro    — project detail
web/src/pages/news/index.astro     — news list
web/src/pages/news/[slug].astro    — news detail
docker-compose.yml                 — cms-seeder has CMS_URL + PAYLOAD_SEED_* env vars
.env (gitignored)                  — PAYLOAD_SEED_EMAIL + PAYLOAD_SEED_PASSWORD
```

---

## CLAUDE.md hard rules reminder

- No hardcoded page layouts — BlockRenderer only
- context handoff at 55% (rule #14 — YOU ARE READING THIS, CHECK YOUR CONTEXT)
- Preflight before NAS deploy: `pnpm preflight` from `cms/`
- No emoji in commits or code
- GSAP only for animation
