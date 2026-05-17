# BRIEF — apr70-pictures (v3)

**Updated:** 2026-05-17 (Logo fix verified locally. Migration applied. NAS deploy pending Marco approval.)
**Phase:** 5 — Logo bug fixed (migration applied), orchestrator retired, ready for NAS deploy.
**Handoff:** `docs/handoff/gemini-2026-05-16-1713.md`

---

## NAS live state

All four containers healthy on kimaserver:8080.
Postgres, CMS (Payload on :3000), Web (Astro SSR on :4321), nginx (:8080).

## Logo bug — FIXED (pending NAS deploy)

Root cause: `brand_fields` migration (20260515_201608_brand_fields) was never applied to NAS postgres. Columns `header_logo_id`, `footer_logo_id`, `favicon_override_id` on `212`/`310`/`nrc` tables did not exist. Also missing: `media_kind`/`division_tag` on `media`, hero brand columns, filmstrip `format` columns.

Fix: Migration rewritten as proper incremental SQL (was a broken dev-snapshot). Verified locally: migration applies cleanly, brand seed runs, `GET /api/globals/212?depth=2` returns populated `headerLogo` object.

**NAS deploy steps** (run after Marco approves `git push`):
```sh
ssh apr70-nas "cd /volume1/apps/apr70-pictures && git pull origin main && /usr/local/bin/docker compose -f docker-compose.yml -p apr70v3 up -d cms"
# Then in cms container:
docker exec apr70v3-cms-1 pnpm payload migrate
# Logos were already set in admin UI; they'll now persist to DB.
# If logos vanished: re-run brand seed (needs admin credentials).
```

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

1. **NAS deploy** — Push to NAS, run `pnpm payload migrate` in the cms container. See "Logo bug" section above.
2. **Division CSS redesign** — V0 and V5 CSS/art direction need a full redo (Gemini failed). See `docs/handoff/gemini-2026-05-16-1713.md` for design spec and `docs/plans/` for session plan. Use Claude Code (Session B = v0-baseline, Session C = v5-animated-filmstrip).
3. **Visual QA** — `[requires-gui]` for rendered brand logos once NAS is redeployed.
4. **HeroSliderIsland** — `[gemini]` line in TASKS.md. (Still paused).

### Task tags (who owns what)

| Tag | Meaning |
|-----|---------|
| `cursor+claude` | IDE + agent friendly |
| `claude` | Long-context / architecture |
| `gemini` | Visual, multimodal, motion-heavy block work |
| `nas-headless` / `nas-shell` | Runs directly on NAS via SSH/shell |
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

## Reference materials

Design and research reference moved to `/Users/marco/websites/apr70-website-reference-repository/` on 2026-05-15. See that repo's README for contents. Key folders: `filmstrip-research/`, `design-system-reference/`, `news-page-reference/` (vintage cinema magazines for news/project page design direction).

## Context enforcement (rule #14)

Hard-stop hook wired in `.claude/settings.json` via `PreToolUse`/`PostToolUse`. Tracks accumulated tool output in `.claude/.context-meter`. At 250KB, warns agent then blocks non-handoff tools. Stop hook resets meter. See `CLAUDE.md` rule #14 and `.claude/hooks/context-gate.sh`.

## Auto-stop note (2026-05-16 16:43 UTC)

- Branch: main
- Tip: b44e51d

## Auto-stop note (2026-05-16 16:53 UTC)

- Branch: main
- Tip: 4592962

## Auto-stop note (2026-05-16 22:04 UTC)

- Branch: main
- Tip: e1894d9

## Auto-stop note (2026-05-17 00:54 UTC)

- Branch: main
- Tip: 57658ab

## Auto-stop note (2026-05-17 00:59 UTC)

- Branch: main
- Tip: a4b2251

## Auto-stop note (2026-05-17 01:17 UTC)

- Branch: main
- Tip: 0409c61

## Auto-stop note (2026-05-17 01:19 UTC)

- Branch: main
- Tip: 6bb6f81

## Auto-stop note (2026-05-17 01:21 UTC)

- Branch: main
- Tip: 2316faa

## Auto-stop note (2026-05-17 02:02 UTC)

- Branch: main
- Tip: af0b317

## Auto-stop note (2026-05-17 02:03 UTC)

- Branch: main
- Tip: d79f5e1
