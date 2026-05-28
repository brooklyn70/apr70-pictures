# BRIEF — apr70-pictures (v3)

**Updated:** 2026-05-27 ~9:10pm EDT  
**Phase:** 6 — Division Showcase + content scaffolding. All 6 division-homepage Stitch screens generated. Ready for Marco's canonical-variant pick.  
**This session (Opus, 2026-05-27 continuation):** ✅ Confirmed prior session `cbc6c17` already pushed to origin/main. ✅ Generated remaining 2 NRC Stitch screens sequentially — Art Film + Deconstructed Gallery variants on project `6601419679785046440`. 🚫 News.html design fetch from `https://api.anthropic.com/v1/design/h/HWgp9WOoBly2CcrSfof9MA` returned 404 — auth-gated or stale URL. Needs Marco to provide a working source.  
**Stitch tally:** 212 ✅ (Title Card + Editorial) | 310 ✅ (IMAX Scale + Architectural) | NRC ✅ (Art Film + Deconstructed Gallery).  
**Next session priorities:** (1) Marco reviews all 6 division screens in Stitch UI and picks canonical variant per division. (2) Extract chosen designs via `stitch-design:extract-static-html` to `docs/handoff/stitch-html-round4/`. (3) Marco provides accessible News.html design source so Priority 4 can proceed. (4) Convert canonical variants to Astro components for `/212`, `/310`, `/nrc` once chosen.  
**Handoff:** `docs/handoff/opus-2026-05-27-nrc-stitch-complete.md` — this session's continuation log with new NRC screen IDs.  
**Placeholder system:** `web/public/brand/placeholders/` (16 SVGs). Helper `resolveMediaSrcOrPlaceholder()` in `web/src/lib/payload.ts`. Preview at `/dev/placeholders`. Regenerate via `node web/scripts/gen-placeholders.mjs`.  
**Approved design:** v0-slate-stack — logo left, tagline + ledger right, cursor-follow glow. Canonical HTML in `docs/handoff/stitch-html-round3/r3-back-to-claude-*.html`.

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

1. **COMMIT** — Stage + commit + push the v0-slate-stack changes. See handoff for exact git commands. Also archive stale handoff docs to `docs/handoff/archive/`.
2. **TypeScript check** — `pnpm --filter web typecheck` in the project root. Then browse `http://localhost:4322/dev/division-variants` — v0-slate-stack should appear first.
3. **Division homepage Stitch work** — Upload DESIGN.md + generate 4 screens per project for 212, 310, NRC. Full prompts in handoff doc. Project IDs: 212=`10388160894163022728`, 310=`13932882577618101661`, NRC=`6601419679785046440`.
4. **Wire v0-slate-stack into division seed** — After QA approves, update seed.ts so `/212`, `/310`, `/nrc` use `v0-slate-stack` variant.
5. **NAS deploy** — Push to NAS, run `pnpm payload migrate`. See "Logo bug" section.
6. **Session C (filmstrip)** — DEFERRED. Plan at `/Users/marco/.claude/plans/read-docs-handoff-opus-2026-05-16-review-gleaming-hickey.md` Phase 3.

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

## Auto-stop note (2026-05-17 02:04 UTC)

- Branch: main
- Tip: d0f674e

## Auto-stop note (2026-05-17 02:17 UTC)

- Branch: main
- Tip: db9e144

## Auto-stop note (2026-05-17 11:03 UTC)

- Branch: main
- Tip: 8242296

## Auto-stop note (2026-05-17 11:08 UTC)

- Branch: main
- Tip: c5a7fb3

## Auto-stop note (2026-05-17 11:15 UTC)

- Branch: main
- Tip: 62f8a6a

## Auto-stop note (2026-05-17 11:20 UTC)

- Branch: main
- Tip: a027f97

## Auto-stop note (2026-05-17 11:23 UTC)

- Branch: main
- Tip: 636a91e

## Auto-stop note (2026-05-17 12:09 UTC)

- Branch: main
- Tip: 6383ab6

## Auto-stop note (2026-05-17 13:00 UTC)

- Branch: main
- Tip: 95cebbb

## Auto-stop note (2026-05-17 13:02 UTC)

- Branch: main
- Tip: fdd9e6a

## Auto-stop note (2026-05-17 13:03 UTC)

- Branch: main
- Tip: fedf431

## Auto-stop note (2026-05-17 13:15 UTC)

- Branch: main
- Tip: 29e511e

## Auto-stop note (2026-05-17 13:25 UTC)

- Branch: main
- Tip: c551b2d

## Auto-stop note (2026-05-17 13:27 UTC)

- Branch: main
- Tip: a951fc9

## Auto-stop note (2026-05-17 16:50 UTC)

- Branch: main
- Tip: 5c9fd55

## Auto-stop note (2026-05-17 16:56 UTC)

- Branch: main
- Tip: 4b7cb10

## Auto-stop note (2026-05-17 16:59 UTC)

- Branch: main
- Tip: 70e3145

## Auto-stop note (2026-05-17 16:59 UTC)

- Branch: main
- Tip: 9758027

## Auto-stop note (2026-05-17 17:01 UTC)

- Branch: main
- Tip: f6ed756

## Auto-stop note (2026-05-17 17:02 UTC)

- Branch: main
- Tip: c9b4426

## Auto-stop note (2026-05-17 17:04 UTC)

- Branch: main
- Tip: e4de0d7

## Auto-stop note (2026-05-17 17:05 UTC)

- Branch: main
- Tip: 92d43cd

## Auto-stop note (2026-05-17 17:06 UTC)

- Branch: main
- Tip: 56f0075

## Auto-stop note (2026-05-17 17:11 UTC)

- Branch: main
- Tip: 4dd8bf1

## Auto-stop note (2026-05-17 17:13 UTC)

- Branch: main
- Tip: 8eb3e21

## Auto-stop note (2026-05-17 17:18 UTC)

- Branch: main
- Tip: ae19b0d

## Auto-stop note (2026-05-17 17:24 UTC)

- Branch: main
- Tip: c771b40

## Auto-stop note (2026-05-17 22:52 UTC)

- Branch: main
- Tip: 6df8482

## Auto-stop note (2026-05-17 22:53 UTC)

- Branch: main
- Tip: 2554b19

## Auto-stop note (2026-05-17 22:56 UTC)

- Branch: main
- Tip: 7f86d6f

## Auto-stop note (2026-05-17 22:59 UTC)

- Branch: main
- Tip: f3ac579

## Auto-stop note (2026-05-17 23:00 UTC)

- Branch: main
- Tip: 4fe1b91

## Auto-stop note (2026-05-17 23:00 UTC)

- Branch: main
- Tip: db3e8e9

## Auto-stop note (2026-05-17 23:02 UTC)

- Branch: main
- Tip: aa0b3f1

## Auto-stop note (2026-05-17 23:08 UTC)

- Branch: main
- Tip: 645b6f5

## Auto-stop note (2026-05-17 23:27 UTC)

- Branch: main
- Tip: 5b7bb03

## Auto-stop note (2026-05-17 23:34 UTC)

- Branch: main
- Tip: a706b93

## Auto-stop note (2026-05-17 23:37 UTC)

- Branch: main
- Tip: f274b33

## Auto-stop note (2026-05-17 23:47 UTC)

- Branch: main
- Tip: 2383491

## Auto-stop note (2026-05-17 23:47 UTC)

- Branch: main
- Tip: a4523d4

## Auto-stop note (2026-05-17 23:52 UTC)

- Branch: main
- Tip: af88f7f

## Auto-stop note (2026-05-17 23:57 UTC)

- Branch: main
- Tip: ced772a

## Auto-stop note (2026-05-18 00:00 UTC)

- Branch: main
- Tip: cb611aa

## Auto-stop note (2026-05-18 00:03 UTC)

- Branch: main
- Tip: 39b31ce

## Auto-stop note (2026-05-18 00:14 UTC)

- Branch: main
- Tip: 2aaa77c

## Auto-stop note (2026-05-18 00:15 UTC)

- Branch: main
- Tip: 5351a7c

## Auto-stop note (2026-05-18 00:33 UTC)

- Branch: main
- Tip: b4f3872

## Auto-stop note (2026-05-18 08:48 UTC)

- Branch: main
- Tip: 8c47b1d

## Auto-stop note (2026-05-18 09:11 UTC)

- Branch: main
- Tip: 9cd9399

## Auto-stop note (2026-05-18 09:12 UTC)

- Branch: main
- Tip: 3ac0d9a

## Auto-stop note (2026-05-18 09:21 UTC)

- Branch: main
- Tip: cb344df

## Auto-stop note (2026-05-18 09:29 UTC)

- Branch: main
- Tip: 85a8336

## Auto-stop note (2026-05-18 09:42 UTC)

- Branch: main
- Tip: c441eb1

## Auto-stop note (2026-05-18 09:49 UTC)

- Branch: main
- Tip: ad617b5

## Auto-stop note (2026-05-18 10:07 UTC)

- Branch: main
- Tip: 5a049f1

## Auto-stop note (2026-05-18 12:56 UTC)

- Branch: main
- Tip: af61a27

## Auto-stop note (2026-05-18 13:03 UTC)

- Branch: main
- Tip: b0931d9

## Auto-stop note (2026-05-18 13:05 UTC)

- Branch: main
- Tip: 67976b5

## Auto-stop note (2026-05-18 13:06 UTC)

- Branch: main
- Tip: 941b6d3

## Auto-stop note (2026-05-18 15:38 UTC)

- Branch: main
- Tip: 324ae70

## Auto-stop note (2026-05-18 16:04 UTC)

- Branch: main
- Tip: 830d986

## Auto-stop note (2026-05-18 16:44 UTC)

- Branch: main
- Tip: 2441b81

## Auto-stop note (2026-05-18 16:54 UTC)

- Branch: main
- Tip: e27333e

## Auto-stop note (2026-05-18 17:08 UTC)

- Branch: main
- Tip: 96357df

## Auto-stop note (2026-05-18 19:58 UTC)

- Branch: main
- Tip: 122de57

## Auto-stop note (2026-05-18 20:13 UTC)

- Branch: main
- Tip: 77eb21d

## Auto-stop note (2026-05-18 21:10 UTC)

- Branch: main
- Tip: c3634b2

## Auto-stop note (2026-05-18 21:19 UTC)

- Branch: main
- Tip: 1d419dc

## Auto-stop note (2026-05-18 21:43 UTC)

- Branch: main
- Tip: 4df7aa4

## Auto-stop note (2026-05-19 00:34 UTC)

- Branch: main
- Tip: 222d215

## Auto-stop note (2026-05-19 01:10 UTC)

- Branch: main
- Tip: 4307f6b

## Auto-stop note (2026-05-19 09:51 UTC)

- Branch: main
- Tip: 4ed4995

## Auto-stop note (2026-05-19 09:59 UTC)

- Branch: main
- Tip: 06e2d9c

## Auto-stop note (2026-05-19 10:01 UTC)

- Branch: main
- Tip: 0cc2a83

## Auto-stop note (2026-05-19 10:09 UTC)

- Branch: main
- Tip: a8e37f6

## Auto-stop note (2026-05-19 21:14 UTC)

- Branch: main
- Tip: c0c41b6

## Auto-stop note (2026-05-19 21:27 UTC)

- Branch: main
- Tip: aa074a4

## Auto-stop note (2026-05-19 21:27 UTC)

- Branch: main
- Tip: 8197390

## Auto-stop note (2026-05-19 21:43 UTC)

- Branch: main
- Tip: d1b675c

## Auto-stop note (2026-05-26 00:33 UTC)

- Branch: main
- Tip: 36cc329

## Auto-stop note (2026-05-26 00:34 UTC)

- Branch: main
- Tip: 3ebad66

## Auto-stop note (2026-05-26 16:51 UTC)

- Branch: main
- Tip: e6ac0c2

## Auto-stop note (2026-05-26 16:55 UTC)

- Branch: main
- Tip: 10c12ad

## Auto-stop note (2026-05-26 16:57 UTC)

- Branch: main
- Tip: cac5f25

## Auto-stop note (2026-05-26 17:01 UTC)

- Branch: main
- Tip: e2810f5

## Auto-stop note (2026-05-26 17:11 UTC)

- Branch: main
- Tip: ab350f7

## Auto-stop note (2026-05-26 17:17 UTC)

- Branch: main
- Tip: 2467a65

## Auto-stop note (2026-05-28 00:27 UTC)

- Branch: main
- Tip: f600944

## Auto-stop note (2026-05-28 00:52 UTC)

- Branch: main
- Tip: cbc6c17

## Auto-stop note (2026-05-28 01:11 UTC)

- Branch: main
- Tip: 1422478
