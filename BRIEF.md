# BRIEF — apr70-pictures (v3)

**Updated:** 2026-05-13 evening (Phase 5 collections + seeder complete)
**Repo tip:** abb2817 on main
**Phase:** Phase 5 — Projects + News live; media migration + visual polish next

---

## NAS live state (verified 2026-05-13 ~19:15)

All four containers healthy:
- `apr70v3-postgres-1` healthy
- `apr70v3-cms-1` healthy (Next.js + Payload on port 3000)
- `apr70v3-web-1` running (Astro SSR on port 4321)
- `apr70v3-nginx-1` running (port 8080)

Seeder: v0.3.0. SiteSettings.seededVersion = 0.3.0.

---

## Route status

| Route | Status |
|-------|--------|
| `/` | LIVE — 4 blocks (hero, twoCol x2, divisionShowcase) |
| `/about` | LIVE — 4 blocks |
| `/contact` | LIVE — 4 blocks |
| `/jobs` | LIVE — 5 blocks |
| `/pitch` | LIVE — 6 blocks |
| `/investors` | LIVE — 4 blocks |
| `/work` | LIVE — 9 project cards |
| `/work/[slug]` | LIVE — 9 projects with BlockRenderer |
| `/news` | LIVE — 4 articles |
| `/news/[slug]` | LIVE — 4 articles with BlockRenderer |
| `/test-hero` | Dev artifact — delete before launch |
| `/212`, `/310`, `/nrc` | MISSING — Phase 5+ (division globals) |
| `/privacy`, `/terms` | MISSING |

---

## CMS global/collection inventory

| Name | Slug | Status |
|------|------|--------|
| Home | `home` | EXISTS — seeded (4 blocks) |
| SiteSettings | `site-settings` | EXISTS — seeded (v0.3.0) |
| FooterLinks | `footer-links` | EXISTS in schema — NOT seeded |
| About | `about` | EXISTS — seeded (4 blocks) |
| Contact | `contact` | EXISTS — seeded (4 blocks) |
| Jobs | `jobs` | EXISTS — seeded (5 blocks) |
| Pitch | `pitch` | EXISTS — seeded (6 blocks) |
| Investors | `investors` | EXISTS — seeded (4 blocks) |
| Users | (collection) | EXISTS — 1 admin user |
| Media | (collection) | EXISTS — empty (no media migration yet) |
| Projects | (collection `projects`) | EXISTS — 9 documents seeded |
| NewsArticle | (collection `news`) | EXISTS — 4 documents seeded |

---

## What was done this session (2026-05-13 evening)

- Fixed seeder: replaced `getPayload()` Local API with REST API fetch calls
- Seeder v0.2.0: seeded 5 new page globals (about, contact, jobs, pitch, investors)
- Seeder v0.3.0: seeded 9 projects + 4 news articles via REST API
- Created `cms/src/collections/Project.ts` and `NewsArticle.ts`
- Registered collections in `payload.config.ts`
- Generated migration `20260513_185804` via `payload migrate:create` on NAS
- Built `web/src/pages/work.astro`, `work/[slug].astro`, `news/index.astro`, `news/[slug].astro`
- Added `fetchProjects`, `fetchProject`, `fetchNewsArticles`, `fetchNewsArticle` to `payload.ts`
- Fixed: postgres 63-char identifier limit (renamed `news-articles` → `news`)
- Fixed: project status normalization (bible/pitch → null)
- Fixed: v2 media ID stripping from layout blocks

---

## Known state of seeded data

- Project status: `bible` and `pitch` v2 values normalized to `null`. Those 2 projects have no status in Payload admin — set manually.
- Project heroImage and layout media: all stripped to `null` (v2 media IDs meaningless until media migration runs)
- News article media: same — stripped to null

---

## NAS redeploy pattern

```sh
cd /volume1/apps/apr70-pictures
git pull origin main
/usr/local/bin/docker compose -f docker-compose.yml -p apr70v3 up -d --build
# Wait for CMS healthcheck (~30-90s)
# Then run seeder if content changed:
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

## What's next (Phase 5+)

1. **Media migration** — rsync v2 media to v3 volume, create Media rows, re-run seeder with real relationships
2. **Division pages** — `/212`, `/310`, `/nrc` Astro pages + Payload globals
3. **Footer links seeding** — from `footer-more.json`
4. **Visual QA** — all pages need style/layout review (requires-gui)
5. **HeroSliderIsland** — GSAP crossfade (Phase 5 TASKS.md — gemini task)
6. **FilmstripBlock renderer** — CSS scroll-snap (gemini task)
7. **Delete `/test-hero`** dev artifact
8. **`payload.ts` typed client** — error handling, SWR caching

See `TASKS.md` for full backlog.

---

## What's done (cumulative)

- Phases 1–3 LOCKED: 11 blocks, Lexical Color Injector, MagneticNavIsland, SiteSettings, FooterLinks, Footer.astro
- Phase 4: all 4 containers live, home seeded, admin up, 5 page globals seeded
- Phase 4b: REST API seeder, 5 Astro pages (about/contact/jobs/pitch/investors)
- Phase 5a: Projects + News collections, 9 projects + 4 news articles seeded, /work + /news routes live

## Auto-stop note (2026-05-13 19:15 UTC)

- Branch: main
- Tip: 44fe152
