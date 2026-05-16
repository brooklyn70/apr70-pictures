# BRIEF — apr70-pictures (v3)

**Updated:** 2026-05-16 (Both seeds executed. Brand logos in Media but NOT rendering on pages.)
**Phase:** 5 — Seeds complete. Logo rendering bug is top priority.
**Seeder:** v0.3.2 applied. 69 media rows. 10 brand SVGs. 4 globals updated.

---

## NAS live state

All four containers healthy on kimaserver:8080.
Postgres, CMS (Payload on :3000), Web (Astro SSR on :4321), nginx (:8080).
Orchestrator container up. Uses 1Password Service Account (cloud-based, works from any network).

## BUG: Logos in Media but not rendering on pages

Brand SVGs uploaded to Media (IDs 60-69). Division globals have headerLogo/footerLogo/faviconOverride set. But logos do NOT appear on /212, /310, /nrc pages. Debug locally first. See handoff doc for investigation plan.

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
| Media | (collection) | 69 rows: 59 v2 images + 10 brand SVGs. Projects linked. |
| Projects | `projects` | 9 documents seeded |
| News | `news` | 4 documents seeded |

## Known data issues

- 2 projects have null status (v2 `bible`/`pitch` — set manually in admin)
- News article media fields still null (news images not in v2 export)
- 12 v2 HTML files (slide-decks/treatments) correctly rejected by media migration

## What's next

1. **FIX: Logo rendering on division pages** — Debug locally (`pnpm dev`). Logos are in CMS but not appearing on pages. Likely depth/URL resolution issue. See `docs/handoff/opus-2026-05-16-seed-complete-logos-not-rendering.md`.
2. **Division Showcase Variants** — 5 variants (v0-v4) at `/dev/division-variants`. Awaiting `[requires-gui]` Director review.
3. **HeroSliderIsland** — `[gemini]` line in TASKS.md. (Still paused).
4. **Visual QA** — `[requires-gui]` for rendered brand logos once fix lands.

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

## Auto-stop note (2026-05-15 22:13 UTC)

- Branch: main
- Tip: e8179b5

## Auto-stop note (2026-05-16 15:47 UTC)

- Branch: main
- Tip: 77ee878
