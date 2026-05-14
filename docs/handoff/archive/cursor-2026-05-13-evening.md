# Cursor Handoff — 2026-05-13 Evening

**From:** Claude Code (Claude Sonnet 4.6)
**To:** Cursor agent
**Repo:** `brooklyn70/apr70-pictures` — local path `/Users/marco/websites/apr70-pictures`
**NAS stack:** live at `kimaserver:8080`

---

## What you are walking into

A Payload CMS v3 + Astro SSR site running on a Synology NAS in Docker. The
stack is fully deployed and `/` is live. Five new content pages (about,
contact, jobs, pitch, investors) have their Payload globals, DB tables, and
Astro frontend pages all built — but the pages are empty because the seeder
that populates them is broken.

**Your job is to fix the seeder and get those 5 pages live.**

---

## The one blocker: `getPayload()` hangs in the seeder

### File: `cms/scripts/migrate-v2/apply.ts`

The seeder calls `getPayload({ config })` (Payload Local API). It connects to
postgres (confirmed via `pg_stat_activity`) then stalls indefinitely — CPU near
zero, no DB queries issued. The hang is inside Payload's JS initialization.

This affects Payload v3.84.1 when 8 globals with full 11-block layout schemas
are registered. The exact cause is unknown but it is reproducible and was not
present with 3 globals.

### The fix: replace Local API calls with REST API calls

The CMS container is running and healthy at `http://cms:3000` (inside Docker
network) or `http://kimaserver:8080` (from outside). Instead of calling
`getPayload()`, call the Payload REST API directly.

**In `cms/scripts/migrate-v2/apply.ts`, replace the `getPayload` block with
`fetch()` calls:**

```ts
// Auth
const loginRes = await fetch(`${CMS_URL}/api/users/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: process.env.PAYLOAD_SEED_EMAIL, password: process.env.PAYLOAD_SEED_PASSWORD }),
})
const { token } = await loginRes.json()

// Seed a global
await fetch(`${CMS_URL}/api/globals/about`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
  body: JSON.stringify({ layout: aboutLayout }),
})
```

`CMS_URL` should be `process.env.CMS_URL || 'http://cms:3000'` so it works
both inside Docker and from localhost.

The credentials (`PAYLOAD_SEED_EMAIL`, `PAYLOAD_SEED_PASSWORD`) need to be
added as env vars to the `cms-seeder` service in `docker-compose.yml`.

**The synthesizers in `map-layout.ts` are correct and produce valid layout
arrays. Do not change them.** Only the write path in `apply.ts` needs updating.

---

## Globals to seed (in order)

| Global slug | V2 source file | Synthesizer in map-layout.ts |
|-------------|----------------|------------------------------|
| `home` | `pages/homepage.json` | `synthesizeHomepageBlocks` |
| `about` | `pages/about.json` | `synthesizeAboutBlocks` |
| `contact` | `pages/contact.json` | `synthesizeContactBlocks` |
| `jobs` | `pages/jobs.json` | `synthesizeJobsBlocks` |
| `pitch` | `pages/pitch.json` | `synthesizePitchBlocks` |
| `investors` | `pages/partners.json` | `synthesizePartnersBlocks` |

V2 content is at `/v2-export/content/` (mounted into the seeder container at
`/v2-export/content`).

---

## After fixing the seeder

Once `apply.ts` works, run the seeder on the NAS:

```sh
# Rebuild the seeder image
/usr/local/bin/docker compose -f /volume1/apps/apr70-pictures/docker-compose.yml \
  -p apr70v3 --profile seed build cms-seeder

# Run the seeder
/usr/local/bin/docker compose -f /volume1/apps/apr70-pictures/docker-compose.yml \
  -p apr70v3 --profile seed run --rm --no-deps cms-seeder \
  pnpm exec tsx scripts/migrate-v2-to-v3.ts --apply --v2-root /v2-export/content
```

Then verify in a browser:
- `kimaserver:8080/about` renders blocks
- `kimaserver:8080/contact` renders blocks
- `kimaserver:8080/jobs` renders blocks
- `kimaserver:8080/pitch` renders blocks
- `kimaserver:8080/investors` renders blocks

---

## What is already correct (do not change)

| Item | State |
|------|-------|
| `cms/src/globals/About.ts` (and Contact, Jobs, Pitch, Investors) | Correct Payload GlobalConfig |
| `cms/src/payload.config.ts` | All 8 globals registered |
| `cms/src/migrations/20260513_131001.ts` | Applied — all tables exist |
| `web/src/pages/about.astro` (and contact, jobs, pitch, investors) | Built, SSR, wired to BlockRenderer |
| `web/src/lib/payload.ts` | Has fetchAboutGlobal etc., uses process.env fallback |
| `cms/Dockerfile` | Seeder is `FROM deps AS seeder` — correct |

---

## Key files

```
cms/scripts/migrate-v2/apply.ts         ← FIX THIS
cms/scripts/migrate-v2/map-layout.ts    ← read-only, synthesizers are correct
cms/src/globals/About.ts                ← correct
cms/src/payload.config.ts              ← correct
cms/src/migrations/index.ts            ← correct (2 migrations)
web/src/pages/about.astro              ← correct
web/src/lib/payload.ts                 ← correct
docker-compose.yml                      ← may need cms-seeder env vars added
```

---

## Project conventions (from CLAUDE.md)

- No hardcoded page layouts — all pages use `<BlockRenderer blocks={page.layout} />`
- No emoji in code or commits
- TypeScript throughout
- Preflight before NAS deploy: `pnpm preflight` from `cms/` must exit 0
- Commit then push; NAS pulls from git

---

## After the seeder is fixed — what's next (Phase 5+)

1. Footer links global (`footer-links`) needs seeding from `footer-more.json`
2. Projects collection needs to be created + 9 v2 projects seeded
3. NewsArticle collection needs to be created + 5 news articles seeded
4. `/work`, `/212`, `/310`, `/nrc` routes need Astro pages + globals
5. HeroSliderIsland (GSAP crossfade) — not yet built
6. Media migration (rsync + Media collection rows)

See `TASKS.md` for the full prioritized backlog.
