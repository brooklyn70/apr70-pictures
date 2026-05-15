# BRIEF — apr70-pictures (v3)

**Updated:** 2026-05-15 (Brand integration Tasks 1-7 of 13 in working tree, uncommitted).
**Handoff:** `docs/handoff/opus-2026-05-15-brand-integration.md`
**Phase:** 5 in progress — Brand integration partially implemented (CMS schemas + migration + fetch layer done, Astro wiring Tasks 8-13 remain). Hero Slider still paused.
**Seeder:** v0.3.2

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
| `/212`, `/310`, `/nrc` | LIVE — starter layout from seeder when globals were empty (hero + twoCol + richText + cta); re-run apply skips if blocks already exist |
| `/privacy`, `/terms` | MISSING |

## CMS inventory

| Name | Slug | Status |
|------|------|--------|
| Home | `home` | Seeded (4 blocks) |
| SiteSettings | `site-settings` | Seeded (see `seededVersion` in admin) |
| FooterLinks | `footer-links` | `moreNav` from v2 footer-more.json when apply runs |
| About | `about` | Seeded (4 blocks) |
| Contact | `contact` | Seeded (4 blocks) |
| Jobs | `jobs` | Seeded (5 blocks) |
| Pitch | `pitch` | Seeded (6 blocks) |
| Investors | `investors` | Seeded (4 blocks) |
| Division 212 | `212` | Default 4 blocks if empty before apply |
| Division 310 | `310` | Default 4 blocks if empty before apply |
| Division NRC | `nrc` | Default 4 blocks if empty before apply |
| Media | (collection) | Rsync of v2 public to `apr70v3_cms_media` done 2026-05-14; populate rows + relink with `pnpm migrate:v2:apply-media` on `cms-seeder` |
| Projects | `projects` | 9 documents seeded |
| News | `news` | 4 documents seeded |

## Known data issues

- 2 projects have null status (v2 `bible`/`pitch` — set manually in admin)
- Project/news hero and filmstrip `media` fields are null until `migrate:v2:apply-media` is run against Payload (after rsync).

## What's next

1. **NAS:** After `git pull`, run `pnpm migrate:v2:apply-media` from `cms-seeder` (same env as apply; `MEDIA_ROOT=/app/media`; `--v2-root /v2-export/content`) to create Media docs and PATCH projects/news layouts. See handoff for the exact `docker compose` one-liner.
2. **Brand integration (IN PROGRESS)** — Tasks 1-7 of 13 done (uncommitted). CMS schemas, migration, and Astro fetch types complete. Remaining: Layout.astro favicon/logo wiring (T8), MagneticNavIsland logo (T9), division page favicon override (T10), HeroBlock lockup/watermark (T11), seed script (T12), verification (T13). Plan: `docs/superpowers/plans/2026-05-15-brand-integration.md`. Handoff: `docs/handoff/opus-2026-05-15-brand-integration.md`.
3. **HeroSliderIsland** — `[gemini]` line in TASKS.md. (FilmstripBlock renderer shipped 2026-05-14).
4. **Visual QA** — `[requires-gui]` when Gemini/Cursor ship UI changes.

### Task tags (who owns what)

| Tag | Meaning |
|-----|---------|
| `cursor+claude` | IDE + agent friendly |
| `claude` | Long-context / architecture |
| `gemini` | Visual, multimodal, motion-heavy block work |
| `nas-headless` / `nas-shell` | NAS orchestrator or shell |
| `requires-gui` | Marco sign-off on rendered UI |

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

Container on NAS is **not** polled from this repo; BRIEF last noted it up 2026-05-13. Code on `main` includes **`git pull --rebase` before push** (`apr70-orchestrator`); rebuild that image on NAS to pick it up.

Run: `sudo docker exec apr70-orchestrator op run -- python -m orchestrator.main --once`
Dry-run: same but `--dry-run`
Telegram only works when wrapped with `op run --`.

## Reference materials

Design and research reference moved to `/Users/marco/websites/apr70-website-reference-repository/` on 2026-05-15. See that repo's README for contents. Key folders: `filmstrip-research/`, `design-system-reference/`, `news-page-reference/` (vintage cinema magazines for news/project page design direction).

## Auto-stop note (2026-05-15 19:41 UTC)

- Branch: main
- Tip: 0e18e3f

## Auto-stop note (2026-05-15 19:47 UTC)

- Branch: main
- Tip: 178986e

## Auto-stop note (2026-05-15 20:10 UTC)

- Branch: main
- Tip: 3eabb3c
