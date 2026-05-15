# BRIEF — apr70-pictures (v3)

**Updated:** 2026-05-15 (NAS redeployed with brand fields migration).
**Phase:** 5 — Brand integration deployed to NAS. Brand seed pending. Hero Slider still paused.
**Seeder:** v0.3.2 (brand seed runs on next `pnpm migrate:v2:apply`)

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

1. **Brand seed** — run `docker compose --profile seed run --rm cms-seeder` on NAS to upload SVGs and set defaults. Migration already applied.
2. **Division Showcase Variants** — 5 variants (v0-v4) implemented and available at `/dev/division-variants`. Awaiting `[requires-gui]` Director review to lock canonical variant.
3. **HeroSliderIsland** — `[gemini]` line in TASKS.md. (Still paused, as per previous handoff).
4. **Visual QA** — `[requires-gui]` for the new Division Showcase variants.

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

## Auto-stop note (2026-05-15 20:21 UTC)

- Branch: main
- Tip: cea1ab9

## Auto-stop note (2026-05-15 20:30 UTC)

- Branch: main
- Tip: 158dfef

## Auto-stop note (2026-05-15 20:34 UTC)

- Branch: main
- Tip: 495233e

## Auto-stop note (2026-05-15 20:35 UTC)

- Branch: main
- Tip: 751b7b5

## Auto-stop note (2026-05-15 21:10 UTC)

- Branch: main
- Tip: b51642f

## Auto-stop note (2026-05-15 21:28 UTC)

- Branch: main
- Tip: 1375f56

## Auto-stop note (2026-05-15 21:38 UTC)

- Branch: main
- Tip: 9435367

## Auto-stop note (2026-05-15 21:40 UTC)

- Branch: main
- Tip: b929046

## Auto-stop note (2026-05-15 21:44 UTC)

- Branch: main
- Tip: d275336

## Auto-stop note (2026-05-15 21:46 UTC)

- Branch: main
- Tip: 0e55315
