# BRIEF — apr70-pictures (v3)

**Updated:** 2026-05-13 evening (globals + seeder + pages plan)
**Phase:** Phase 4 — content globals, extended seeder, Astro page build

---

## Current live state (verified 2026-05-13)

Stack fully deployed on NAS. All four containers healthy:
- `apr70v3-postgres-1` healthy
- `apr70v3-cms-1` healthy (Next.js + Payload on port 3000)
- `apr70v3-web-1` running (Astro SSR on port 4321)
- `apr70v3-nginx-1` running (port 8080)

First admin user created. Payload admin accessible at `/admin`.

---

## Route status

- `/` — LIVE, renders 4 blocks (hero, twoCol x2, divisionShowcase) from `home` global
- `/test-hero` — dev artifact, delete before launch
- All other routes — MISSING (about, work, contact, jobs, pitch, investors, 212, 310, nrc, news/*, privacy, terms)

---

## CMS global/collection inventory

| Name | Slug | Status |
|------|------|--------|
| Home | `home` | EXISTS — seeded (4 blocks) |
| SiteSettings | `site-settings` | EXISTS — seeded (seededVersion=0.1.0) |
| FooterLinks | `footer-links` | EXISTS in schema — NOT seeded (empty) |
| About | `about` | MISSING — to be created |
| Contact | `contact` | MISSING — to be created |
| Jobs | `jobs` | MISSING — to be created |
| Pitch | `pitch` | MISSING — to be created |
| Investors | `investors` | MISSING — to be created |
| Users | (collection) | EXISTS — first user created |
| Media | (collection) | EXISTS — empty (no media migration yet) |
| Projects | (collection) | DOES NOT EXIST |
| NewsArticle | (collection) | DOES NOT EXIST |

---

## Current plan (in progress this session)

1. Add 5 Payload globals: About, Contact, Jobs, Pitch, Investors — full 11-block layout field each
2. Register all 5 in `cms/src/payload.config.ts`
3. Extend `cms/scripts/migrate-v2/apply.ts` seeder to v0.2.0:
   - Seed all 5 new globals from existing v2 JSON synthesizers
   - Seed `footer-links` if data supports it
4. Build 5 Astro SSR pages: about, contact, jobs, pitch, investors
5. Add 5 fetch functions to `web/src/lib/payload.ts`
6. Commit + push; NAS needs `git pull + docker compose up -d --build`

---

## V2 content available for seeding

- `v2-export/content/pages/`: about.json, contact.json, jobs.json, pitch.json, partners.json (= investors), footer-more.json, quotes.json, slate.json
- `v2-export/content/projects/`: 9 project JSONs
- `v2-export/content/news/`: 5 news JSONs

All synthesizers for about/contact/jobs/pitch/partners already exist in `map-layout.ts`.

---

## NAS redeploy pattern

After this commit is pushed, on the NAS run:

```sh
cd /volume1/apps/apr70-pictures
git pull origin main
/usr/local/bin/docker compose -f docker-compose.yml -p apr70v3 up -d --build
# nginx waits for cms healthcheck (~30-90s) -- this is intentional
# After containers are up, run the seeder:
/usr/bin/docker compose -f /volume1/apps/apr70-pictures/docker-compose.yml -p apr70v3 --profile seed run --rm --no-deps cms-seeder pnpm exec tsx scripts/migrate-v2-to-v3.ts --apply --v2-root /v2-export/content
```

---

## Confirmed NAS paths

| Item | Value |
|------|-------|
| v3 repo on NAS | `/volume1/apps/apr70-pictures` |
| v2 content export | `/volume1/apps/apr70-pictures/v2-export/content` |
| v2 media source | `/volume1/apps/apr70/public/` (537 MB) |
| v3 media volume | Docker `apr70v3_cms_media` -> `/app/media` in cms container |

---

## What's done

- Phases 1-3 LOCKED: 11 blocks, Lexical Color Injector, MagneticNavIsland, SiteSettings, FooterLinks, Footer.astro.
- Phase 4 seed CLI: `--dry-run` accepted (83/83 blocks, 0 warnings). `--apply` seeds home + stamps site-settings.
- NAS Hop 1 complete: all 4 containers healthy, `/` live.
- First admin user created via browser at `/admin/create-first-user`.
- This session: 5 new globals, seeder v0.2.0, 5 Astro pages.
