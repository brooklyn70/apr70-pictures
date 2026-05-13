# BRIEF — apr70-pictures (v3)

**Updated:** 2026-05-13 late (seeder hang diagnosed; handoff to Cursor)
**Repo tip:** ee3a4ea on main
**Phase:** Phase 4 — seeder v0.2.0 blocked; workaround needed

---

## NAS live state (verified 2026-05-13)

All four containers healthy:
- `apr70v3-postgres-1` healthy
- `apr70v3-cms-1` healthy (Next.js + Payload on port 3000)
- `apr70v3-web-1` running (Astro SSR on port 4321)
- `apr70v3-nginx-1` running (port 8080)

Verified endpoints:
- `GET kimaserver:8080/` → 200, renders 4 home blocks
- `GET kimaserver:8080/admin` → 200, first user created

---

## Route status

| Route | Status |
|-------|--------|
| `/` | LIVE — 4 blocks (hero, twoCol x2, divisionShowcase) |
| `/about` | Built (Astro page exists) — **not yet seeded** |
| `/contact` | Built — **not yet seeded** |
| `/jobs` | Built — **not yet seeded** |
| `/pitch` | Built — **not yet seeded** |
| `/investors` | Built — **not yet seeded** |
| `/test-hero` | Dev artifact — delete before launch |
| All others | Missing (work, 212, 310, nrc, news/*, privacy, terms) |

---

## CMS global/collection inventory

| Name | Slug | Status |
|------|------|--------|
| Home | `home` | EXISTS — seeded (4 blocks, home only) |
| SiteSettings | `site-settings` | EXISTS — seeded (seededVersion=0.1.0) |
| FooterLinks | `footer-links` | EXISTS in schema — NOT seeded |
| About | `about` | EXISTS in schema + DB tables — NOT seeded |
| Contact | `contact` | EXISTS in schema + DB tables — NOT seeded |
| Jobs | `jobs` | EXISTS in schema + DB tables — NOT seeded |
| Pitch | `pitch` | EXISTS in schema + DB tables — NOT seeded |
| Investors | `investors` | EXISTS in schema + DB tables — NOT seeded |
| Users | (collection) | EXISTS — first user created |
| Media | (collection) | EXISTS — empty (no media migration yet) |
| Projects | (collection) | DOES NOT EXIST |
| NewsArticle | (collection) | DOES NOT EXIST |

---

## The seeder hang — current blocker

### What works
- `cms-seeder` image builds successfully
- DB connection is established (confirmed via `pg_stat_activity`)
- Migration `20260513_131001` was applied — all ~120 new tables exist
- `payload migrate` runs and exits cleanly

### What doesn't work
`getPayload()` in the seeder script (`cms/scripts/migrate-v2/apply.ts`) hangs
indefinitely after printing the email-adapter WARN. It connects to postgres
but stalls inside Payload's JS initialization before running any queries.
Container CPU stays near zero — it's waiting on something in the JS event loop.

### Diagnosis so far
- Not a DB connection problem (connection is established)
- Not a missing table problem (all tables exist)
- Not a corepack/network problem (image builds fine)
- Happens with both `FROM builder AS seeder` and `FROM deps AS seeder`
- Consistent across all seeder images built after 5 new globals were added
- Likely: Payload v3.84.1 `getPayload()` has a hanging Promise during
  initialization when 8 globals are registered with full block schemas —
  possibly schema introspection or import map resolution

### Recommended fix for next agent (Cursor)
**Rewrite the seeder to call the Payload REST API instead of the Local API.**
The CMS container is already running and healthy. Rather than calling
`getPayload()` in a subprocess, call:
- `POST /api/users/login` → get JWT token
- `PUT /api/globals/about` with `{ layout: [...] }` body
- Repeat for contact, jobs, pitch, investors, home

This is in `cms/scripts/migrate-v2/apply.ts` — replace the `getPayload()`
block with `fetch()` calls to `http://cms:3000/api/globals/{slug}`.

The synthesizers in `map-layout.ts` are correct and already produce valid block
arrays. Only the write mechanism needs to change.

---

## Key files for seeder fix

| File | Purpose |
|------|---------|
| `cms/scripts/migrate-v2/apply.ts` | Seeder entry — replace getPayload with REST calls |
| `cms/scripts/migrate-v2/map-layout.ts` | Synthesizers — do not change, they work |
| `cms/src/globals/About.ts` etc. | Global schemas — correct, do not change |
| `cms/src/migrations/20260513_131001.ts` | Migration — applied, do not change |
| `web/src/pages/about.astro` etc. | Frontend pages — built, do not change |

---

## V2 content for seeding

- `v2-export/content/pages/`: about.json, contact.json, jobs.json, pitch.json, partners.json (= investors), footer-more.json
- `v2-export/content/projects/`: 9 project JSONs (alphayy, brooklyn, cleo, falcon, ladolcevita, mayors, movement, shadowmaster, ubrucculinu)
- `v2-export/content/news/`: 5 news JSONs

---

## NAS redeploy pattern (for reference)

```sh
cd /volume1/apps/apr70-pictures
git pull origin main
/usr/local/bin/docker compose -f docker-compose.yml -p apr70v3 up -d --build
# CMS healthcheck gates nginx (~30-90s) -- intentional
```

After containers are up, run seeder (once REST approach is implemented):
```sh
/usr/local/bin/docker compose -f docker-compose.yml -p apr70v3 \
  --profile seed run --rm --no-deps cms-seeder \
  pnpm exec tsx scripts/migrate-v2-to-v3.ts --apply --v2-root /v2-export/content
```

---

## Confirmed NAS paths

| Item | Value |
|------|-------|
| v3 repo on NAS | `/volume1/apps/apr70-pictures` |
| v2 content export | `/volume1/apps/apr70-pictures/v2-export/content` |
| v2 media source | `/volume1/apps/apr70/public/` (537 MB) |
| v3 media volume | Docker `apr70v3_cms_media` → `/app/media` in cms container |

---

## What's done (cumulative)

- Phases 1–3 LOCKED: 11 blocks, Lexical Color Injector, MagneticNavIsland, SiteSettings, FooterLinks, Footer.astro
- Phase 4 stack: all 4 containers live on NAS, `/` rendering, admin up
- First admin user created
- 5 new Payload globals added (About, Contact, Jobs, Pitch, Investors)
- DB migration applied — all tables exist
- 5 Astro SSR pages built (about, contact, jobs, pitch, investors)
- `payload-types.ts` regenerated with all 8 globals
- Seeder v0.2.0 written but blocked on `getPayload()` hang

## Auto-stop note (2026-05-13 16:59 UTC)

- Branch: main
- Tip: 79d5962

## Auto-stop note (2026-05-13 17:02 UTC)

- Branch: main
- Tip: 7a8d6d6

## Auto-stop note (2026-05-13 17:03 UTC)

- Branch: main
- Tip: 09c43ae

## Auto-stop note (2026-05-13 17:05 UTC)

- Branch: main
- Tip: f40dd7b

## Auto-stop note (2026-05-13 17:08 UTC)

- Branch: main
- Tip: daa11a4

## Auto-stop note (2026-05-13 17:10 UTC)

- Branch: main
- Tip: 2ffbd27

## Auto-stop note (2026-05-13 17:14 UTC)

- Branch: main
- Tip: 724c9fc

## Auto-stop note (2026-05-13 17:48 UTC)

- Branch: main
- Tip: 20231d7

## Auto-stop note (2026-05-13 17:49 UTC)

- Branch: main
- Tip: 18261b7
