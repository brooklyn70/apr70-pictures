# BRIEF — apr70-pictures (v3)

**Updated:** 2026-05-14 (filmstrip research pack in `docs/reference/filmstrip-research/`; Gemini handoff updated)  
**Handoff:** `docs/handoff/composer-2026-05-14-phase5-next.md`
**Phase:** 5 in progress — run apply-media on NAS if not done; Gemini blocks next
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
2. **HeroSliderIsland / FilmstripBlock** — `[gemini]` lines in TASKS.md (not Cursor-only). Filmstrip visual research: `docs/reference/filmstrip-research/` (see README there).
3. **Visual QA** — `[requires-gui]` when Gemini/Cursor ship UI changes.

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

## Auto-stop note (2026-05-14 10:04 UTC)

- Branch: main
- Tip: 52db66b

## Auto-stop note (2026-05-14 10:07 UTC)

- Branch: main
- Tip: 32248e7

## Auto-stop note (2026-05-14 10:14 UTC)

- Branch: main
- Tip: 6944c5d

## Auto-stop note (2026-05-14 12:47 UTC)

- Branch: main
- Tip: a9eb8cd

## Auto-stop note (2026-05-14 12:53 UTC)

- Branch: main
- Tip: 0fb4113

## Auto-stop note (2026-05-14 12:59 UTC)

- Branch: main
- Tip: c5fbcbb

## Auto-stop note (2026-05-14 13:10 UTC)

- Branch: main
- Tip: 4c2d951

## Auto-stop note (2026-05-14 14:19 UTC)

- Branch: main
- Tip: 01dfca1

## Auto-stop note (2026-05-14 14:36 UTC)

- Branch: main
- Tip: 77b2b7d

## Auto-stop note (2026-05-14 14:43 UTC)

- Branch: main
- Tip: 465b27e

## Auto-stop note (2026-05-14 14:59 UTC)

- Branch: main
- Tip: 0e7b6fe
