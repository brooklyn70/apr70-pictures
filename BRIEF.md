# BRIEF — apr70-pictures (v3)

**Updated:** 2026-05-13 evening (housekeeping + orchestrator test)
**Phase:** 5 in progress — footer seeding, division content, media migration next
**Seeder:** v0.3.0

---

## NAS live state

All four containers healthy on kimaserver:8080.
Postgres, CMS (Payload on :3000), Web (Astro SSR on :4321), nginx (:8080).
Orchestrator container up. Uses 1Password Service Account (cloud-based, works from any network).

## Route status

| Route | Status |
|-------|--------|
| `/` | LIVE — 4 blocks |
| `/about` | LIVE — 4 blocks |
| `/contact` | LIVE — 4 blocks |
| `/jobs` | LIVE — 5 blocks |
| `/pitch` | LIVE — 6 blocks |
| `/investors` | LIVE — 4 blocks |
| `/work` | LIVE — 9 project cards |
| `/work/[slug]` | LIVE — 9 projects |
| `/news` | LIVE — 4 articles |
| `/news/[slug]` | LIVE — 4 articles |
| `/212`, `/310`, `/nrc` | LIVE — empty (net-new, add blocks via admin) |
| `/privacy`, `/terms` | MISSING |

## CMS inventory

| Name | Slug | Status |
|------|------|--------|
| Home | `home` | Seeded (4 blocks) |
| SiteSettings | `site-settings` | Seeded (v0.3.0) |
| FooterLinks | `footer-links` | Schema exists — NOT seeded |
| About | `about` | Seeded (4 blocks) |
| Contact | `contact` | Seeded (4 blocks) |
| Jobs | `jobs` | Seeded (5 blocks) |
| Pitch | `pitch` | Seeded (6 blocks) |
| Investors | `investors` | Seeded (4 blocks) |
| Division 212 | `212` | Empty |
| Division 310 | `310` | Empty |
| Division NRC | `nrc` | Empty |
| Media | (collection) | Empty — no media migration yet |
| Projects | `projects` | 9 documents seeded |
| News | `news` | 4 documents seeded |

## Known data issues

- 2 projects have null status (v2 `bible`/`pitch` — set manually in admin)
- All media refs stripped to null (until media migration)

## What's next

1. **Footer links seeding** — `v2-export/content/pages/footer-more.json` to FooterLinks global (claude)
2. **Division page content** — net-new, author in admin or synthesize (requires-gui / claude)
3. **Media migration** — needs rework as `[nas-shell]` or manual session (see handoff)
4. **HeroSliderIsland** — React + GSAP crossfade (gemini)
5. **FilmstripBlock renderer** — CSS scroll-snap (gemini)
6. **Visual QA** — all pages (requires-gui)
7. **payload.ts typed client** — error handling, SWR caching (cursor+claude)

## NAS redeploy

```sh
cd /volume1/apps/apr70-pictures && git pull origin main
/usr/local/bin/docker compose -f docker-compose.yml -p apr70v3 up -d --build
```

## NAS paths

| Item | Path |
|------|------|
| v3 repo | `/volume1/apps/apr70-pictures` |
| v2 content | `/volume1/apps/apr70-pictures/v2-export/content` |
| v2 media | `/volume1/apps/apr70/public/` (537 MB) |
| v3 media volume | Docker `apr70v3_cms_media` → `/app/media` in cms |

## Orchestrator

Run: `sudo docker exec apr70-orchestrator op run -- python -m orchestrator.main --once`
Dry-run: same but `--dry-run`
Telegram only works when wrapped with `op run --`.

## Auto-stop note (2026-05-13 21:37 UTC)

- Branch: main
- Tip: 22b5773

## Auto-stop note (2026-05-14 09:33 UTC)

- Branch: main
- Tip: abc8c47

## Auto-stop note (2026-05-14 09:41 UTC)

- Branch: main
- Tip: d5752f6

## Auto-stop note (2026-05-14 09:41 UTC)

- Branch: main
- Tip: b0cf8c5

## Auto-stop note (2026-05-14 09:49 UTC)

- Branch: main
- Tip: fda0439
