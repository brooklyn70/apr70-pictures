# BRIEF — apr70-pictures (v3 → V4 live on Vercel)

**Current (2026-07-18 ~7:45pm, Fable 5 — media consolidation + Crop Studio cull + filmatlas touches):**
**ALL PROPERTY MEDIA CONSOLIDATED FLAT.** Every image/video from the eleven `11-XX-*`
property trees on SharedData (929 images + 29 videos, from 02-stills, _light-law, _ratio-*,
ref/, moodboards, 10-web, source folders — everything) moved on the NAS itself into
`/Volumes/SharedData/11-00-property-images/` and `11-00-property-videos/`, renamed to
`<prop>-NN-<slug>-vNN.ext` (`angib-`, `alphayy-`, `cleopatra-`, `dahook-`, `ldv-`,
`movement-`, `seagate-`, `shadowmaster-`, `mayors-`, `brucculinu-`; heroes are
`<prop>-hero-NN`; same-name files across subfolders became -v01/-v02…). `_manifest.csv`
in the images folder maps every new name → original path (full undo). Emptied dirs removed;
docs/decks/scripts stayed put. **Crop Studio grew a cull feature:** checkbox per picture in
the roll + `D` verdict + "Move N to _trash" — files move to `_trash/` inside the folder,
never rm'd. Scan now lazy-seeds saliency and caches dimensions
(`.crop-studio-meta.json`): the 929-file folder opens in ~3.5s warm (was 2.5 min).
Browser-verified end to end. **Spec refs repointed:** all 194 refs in `specs/` +
`specs-light-law/` rewritten to absolute flat-folder paths via the manifest (0 dangling).
NOTE: Prompts-tab/regen.py OUTPUT still targets `11-XX/02-stills/_regen/` — decide at the
review gate whether new generations land flat (TASKS p9). **Filmatlas touches shipped:**
`storyYear`/`storyPlace` on Project (+migration `20260718_231500_story_meta`, additive,
runs at next deploy) rendering "1977 · Brooklyn" under property titles; scroll-progress
rail on /craft (native scroll-timeline + IO fallback, no GSAP dep added); ≥1920px token
bump in v9.css (col 72→80rem + display clamp nudge; marquee override handled inside the
block). Preflight 0, astro check 8 pre-existing.

**Previous (2026-07-18 ~6:30pm, Fable 5 — Light Law fleet + AI Mark + admin pickers):**
**LIGHT LAW CAMPAIGN COMPLETE, NOTHING SWAPPED INTO THE SITE.** Ten from-scratch shot lists
(8 shots each) authored from the scripts/canon with scene citations quoted per shot
(`tools/still-regen/specs-light-law/`); 80 masters at 6336×2688 in each property's
`02-stills/_light-law/`. Total spend 1,960 credits (~$9.80), balance 4,162. Marco ruled
mid-run that prompts need his oversight — so the REVIEW GATE IS THE NEXT STEP: he reads
specs (each notes[] quotes its scene) + frames, culls, then picks go to CMS. Agents left
per-property rulings queues in their spec notes (angib uncast parts, alpha-yy Argentinian.jpg,
cleo Brooklyn-vs-LA, da-hook B&W, ubr spelling/faces/treatment-vs-deck, movement seven-faces).
**Provider A/B ruled:** gpt-image-2 (16cr) caps at 3696×1584 and its safety filter refused a
cast-ref shot — nano-banana-pro (24cr, native 6336×2688) stays the fleet model; regen.py now
takes --model/--specdir/--out. **AI MARK live on staging** (Site Settings → AI Mark; corner
tag ON, diagonal band available; keys off the caption's "AI-generated" line so archival
photos can never be stamped). **Deploy lesson ENCODED:** the ai_mark deploy broke staging
(cms queried columns before migrating — down ~25 min, recovered via seed-profile migrate);
deploy-v10-to-nas.sh now runs migrations as step 5c before up. **Admin pickers fixed:** the
eight Site Settings brand fields are relationship pickers now (browse whole tagged library,
swap in place, no remove-first); Marco's untagged sprockets logo (media id 96 on NAS) was
invisible to the filtered pickers — tagged 'logo'. New uploads MUST get a Media Kind tag. **v13 SHIPPED.** Three Marco
rulings executed: (1) header nav restyled to the route line's exact marquee look (mono face,
accent superscript indices 01–04, no underline; active = ink) — edits in `v9.css`,
`themes/marquee.css`, `V9Layout.astro`; route line kept on the front page as the zine's
contents device. (2) Mode-toggle alignment fixed at the ROOT (`.v9-nav` was
`align-items: baseline`; svg-only button has no baseline — row centres now, old nudge
deleted from `mode-toggle.css`). (3) Property galleries: new **cinema view** in
`FilmstripSlideshow.tsx` — full browser-width overlay (portal, z-100, scroll lock), PLAY
slideshow @4.5s, manual move pauses, ESC/× close, focus restore; open via expand button or
the picture's middle third. Browser-verified both modes on dev (nav zoom shots, autoplay
counter advance, ESC). `SITE_VERSION` → v13. Voice ruling: site keeps the studio "we";
founder already disclosed in JSON-LD; no copy touched (recommended one founder's line for
/methods or /contact — Marco's call, pasteable in /admin). **Light Law recorded**
(`tools/still-regen/LIGHT-LAW.md` + TASKS Phase 9): next stills pass regenerates ALL
properties, prompts derived from the SCRIPT with scene citations, natural/found light,
less Hollywood — LDV worst offender, goes first. Preflight 0, astro check 8 errors all
pre-existing. MASTER-RECAP ledger has the v13 row (shots not refreshed — visual QA rides
Marco's next pass).

**Current (2026-07-16 ~11:50am, Opus 4.8 — still-gen wave):** **ALL NINE remaining property
shot-lists authored AND generated.** 9 specs (6 shots each, Limelight voice) in
`tools/still-regen/specs/` — sea-gate, shadowmaster (v2 treatment won), the-mayors (6 eras),
alpha-yy, cleopatra, da-hook (Falcon→Red Hook 1970), la-dolce-vita, movement, u-brucculinu.
**108/108 masters verified on disk** at 6336×2688 (21:9 4K native) in each property's
`02-stills/_regen/`, prompts.json copied beside them, `reference-manifest.md` (ref vs AI
classification) in every `02-stills/`. Ledger: 134 entries in vault `apr70-still-prompts/prompts.jsonl`.
~2,616 credits spent, 12,482 remain. Run regen with `/opt/homebrew/bin/python3.14` (framework
3.14 + brew 3.12 have broken SSL). KIE throws transient "plan"/"internal" errors under
concurrency — rerun the property, exists-skip fills gaps. **ANGIB SHIPPED TOO** — Marco ruled casting 2026-07-16 (canonical Marc = marc-labeled real
photos + hero-portrait-v5 direction; Sunny = Chrissy files; Boo Boo + Housie Mousie = corner-boys
shot, NEW 13th shot). 26/26 masters in angib `_regen/`, border-swept clean, hero/corner-boys/stoop
visually verified. **STORY WAVE SHIPPED (same day, ~5-7pm):** Marco ruled the Story Law (tools/still-regen/STORY-LAW.md —
every shot pushes the story; alpha-yy hero image is the canonical example). All 10 specs got 5-6 appended
story shots (Mayors got 11 press frames, one per administration 1950→2026), his named beats verbatim
(joy-ride, hospital slap, LAX custody, Buenos Aires, Siena crypt, Michelangelo's/Enrico, after-the-job
catwalk, Nova + the avatar that can't refuse). **264/264 masters verified, zero defects.** VIDEO: model
ruled bytedance/seedance-2-fast @ 720p 6s (270 cr; first frame must be ≤6000px — downscale to 3168x1344;
full seedance-2 1080p = 612 cr for upgrades). Fleet of 9 story-frame clips + Mayors' 1080p blackout test
clip → each {prop}/02-stills/_regen/_video/, ledgered. FLEET COMPLETE 9/9, 0 fails, 1,782 cr.
Final balance 6,122 credits. Fleet script: session scratchpad video-fleet.py (rebuildable from ledger). **Marco rulings queue:**
cleopatra one-face
(01-cleo-k2a) + reigns-reset flag, da-hook B&W vs color, mayors 2026 faceless/Mamdani,
movement seven-faces canon, u-brucculinu spelling + Santo/Elena faces, LDV webp cast
supersedes pngs. Stale `.claude/.context-meter` (16.5MB) was hard-blocking agent Bash —
reset; Stop-hook reset needs a look.

**Previous (2026-07-14 ~4:15pm, Fable 5 — Prompt tab session):** Crop Studio got its
**Prompts tab** (ten-property shot-list desk over `tools/still-regen/specs/`, per-shot
generate, ledger-before-download, `_regen/` output) — built, browser-verified, code-reviewed
(8 findings, all fixed: stale-prompt race, v-number collision, regen.py folder unified to
`_regen`, traversal guard, KIE gating, shared `makeWideMaster()`), ref thumbs enlarged
per Marco. Desktop launcher: `~/Desktop/Crop Studio.app`. **Server restart still needed**
for the fixes (routes load at boot). **Extend batch FINISHED** — composite + show Marco
the nine frames, first thing. Next: ten shot lists (explore-digest BEFORE fan-out), then
Marco generates from the tab, then video hero. Handoff:
`docs/handoff/fable-2026-07-14-prompt-tab-built-reviewed.md`.

**Previous (2026-07-14 earlier):** Public slate = **ten properties** (nine on `/slate`; **The Mayors** private for legal counsel — row kept, `publicSlate=false`). Restore playbook: `docs/decisions/2026-07-13-ten-properties-mayors-private.md`. Staging on NAS ships `SITE_VERSION` v12 from branch `main`. **Git rule:** one long-lived branch (`main`); version bumps only change `SITE_VERSION`; feature work uses short-lived branches. Archive tags: `archive/v9-branch`, `archive/v10-branch`, `archive/pre-main-ff-v11`. Old GitHub monolith `brooklyn70/apr70-website` is archived.

**Updated:** 2026-07-05 (Fable 5 orchestrated session)
**Phase:** V4 SHIPPED TO VERCEL STAGING — https://apr70-web.vercel.app (Astro serverless) + https://apr70-cms-brooklyn70-brooklyn70s-projects.vercel.app (Payload → Supabase `apr70` ref rrxeqsryndjoivcsnkqq). NAS still serves apr70.com, untouched; DNS cutover deliberately NOT done.
**What shipped (5 worktree branches merged to main):** (1) Global visitor-facing theme system — 5 designs via draggable ThemeControlIsland (design + logo assortment + font scale, localStorage, no-FOUC pre-paint); divisions unified (logo inside global theme, per-division skins dormant). (2) `/troupe` — APR 70 Troupe Presents No. 1, playbill block, spoiler-safe DRAFT copy, placeholder SVGs + PD ledger in vault. (3) Zine re-arrange — `/` = DISPATCH-masthead front door, `/news` joined Layout.astro, zineMasthead/zinePassage/zineSynopsis blocks, `/work` text-forward with 7 draft synopses, Sea Gate created, falcon→Da Hook, indicia numbered-never-dated. (4) Infra — DEPLOY_TARGET adapter switch, pool discipline, slim-projection SWR cache, S3-gated R2. (5) Copy bundle + n8n note in vault `11.05 V4 Launch/03-public-site/`.
**Verification:** local 70/70 Playwright matrix (5 designs × 375/1440), 3 bugs fixed (hydration forks, dev media proxy, /news overflow); live smoke green (Sea Gate/Da Hook/no-Maltese/indicia/picker). `astro check` baseline 26, 0 net-new.
**Read:** `docs/decisions/2026-07-05-vercel-supabase-runbook.md` → "As deployed" section for every Vercel/Supabase gotcha (prebuilt-only web deploys, gsap ssr.noExternal, tsconfig scripts exclusion, protection disabled, troupe seed path).
**Open:** R2 bucket + S3 keys (media 404s on Vercel until then — Marco's Cloudflare dashboard); n8n copy pass (Apex offline); Marco's copy edit in /admin (everything DRAFT-marked); DNS cutover (Marco, last); QUARTERLY editorial copy on /news is body copy not indicia — Marco's call.

---

# Previous brief (2026-05-28, DISPATCH ship) follows

**Updated:** 2026-05-28 ~5:25am EDT  
**Phase:** 6 — DISPATCH (News page) end-to-end SHIPPED TO NAS 2026-05-29 (Opus). Migration `20260528_020717_dispatch_schema` applied; `brand_fields` confirmed in ledger (logo columns present on 212/310/nrc); DISPATCH Vol.01 No.01 seeded (`dispatch_issues`=1). `/news` live at 52KB; all routes 200; containers healthy. NAS migrate/seed runs via `docker compose -p apr70v3 --profile seed run --build --rm migrate` then `... run --rm cms-seeder node_modules/.bin/tsx scripts/migrate-v2/run-dispatch-seed.ts` (the running cms image is slim Next standalone — no pnpm/CLI; use the seed profile).  
**This session (Opus, 2026-05-28):** Executed prior handoff. ✅ Generated + applied Payload migration `20260528_020717_dispatch_schema.ts` (creates dispatch_issues + nested array/enum tables). ✅ Ported all 14 DISPATCH JSX components to Astro under `web/src/components/dispatch/` (FilmstripRail, Nav, CornerAccent, Masthead, Cover, SectionRail, Contents, Editorial, Feature, Dispatches, Trades, Classifieds, Archive, Colophon). ✅ Built `web/src/components/islands/DispatchReader.tsx` — React island, `client:idle`, ESC closes, hydrates feature article from inline JSON, Contents entries open from `[data-dispatch-open]` clicks. ✅ Rewrote `web/src/pages/news/index.astro` — bypasses standard Layout, imports `global.css` + `dispatch.css`, fetches current issue via `fetchCurrentDispatchIssue()`, renders full magazine in section order, mounts Reader. ✅ Added DispatchIssueDoc types + SWR-cached fetcher to `web/src/lib/payload.ts`. ✅ Added bridge-tokens block to `dispatch.css` (aliases `--apr-imax`→`--apr-teal`, `--apr-grey`→`--apr-offwhite`, defines `--mag-gutter`, `--mag-max`, `--accent`, etc.) so the import-free file is self-contained. ✅ Fixed ApplyReport type drift in `apply.ts` (added `dispatchIssuesWritten` to both early-return paths). ✅ Added `scripts/migrate-v2/run-dispatch-seed.ts` — standalone seed runner for local dev. ✅ Seeded Vol. 01 No. 01 to local Postgres. ✅ Preflight passes; `pnpm astro check` reports 26 errors / 0 new (matches pre-existing baseline). ✅ Curl `GET /news` returns 200 (~198KB) with all sections + hydrated Reader island.  
**Stitch tally:** 212 ✅ | 310 ✅ | NRC ✅ — all 6 division-homepage screens still awaiting Marco's canonical pick.  
**Next session priorities:** (1) NAS deploy: push to origin/main, `ssh apr70-nas` pull + `docker compose -p apr70v3 up -d --build cms web`, `docker exec apr70v3-cms-1 pnpm payload migrate`, then run dispatch seed against NAS. (2) Marco's canonical-pick per division for the Stitch homepage screens → port to Astro. (3) Decide fate of `web/src/pages/news/[slug].astro` (still in place; Reader is the canonical surface).  
**Handoff:** `docs/handoff/opus-2026-05-28-dispatch-frontend-shipped.md`.  
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

## Auto-stop note (2026-05-28 01:56 UTC)

- Branch: main
- Tip: a7af56b

## Auto-stop note (2026-05-28 09:26 UTC)

- Branch: main
- Tip: 06375dd

## Auto-stop note (2026-05-28 09:28 UTC)

- Branch: main
- Tip: 73457ca

## Auto-stop note (2026-05-28 09:28 UTC)

- Branch: main
- Tip: 87d56c9

## Auto-stop note (2026-05-28 09:41 UTC)

- Branch: main
- Tip: f4817d3

## Auto-stop note (2026-05-28 12:44 UTC)

- Branch: main
- Tip: 50875e8

## Auto-stop note (2026-05-29 00:22 UTC)

- Branch: main
- Tip: 985e6c5

## Auto-stop note (2026-05-29 00:46 UTC)

- Branch: main
- Tip: 4027e7c

## Auto-stop note (2026-05-29 00:48 UTC)

- Branch: main
- Tip: 694f56a

## Auto-stop note (2026-05-29 00:54 UTC)

- Branch: main
- Tip: 136dd0d

## Auto-stop note (2026-05-29 00:56 UTC)

- Branch: main
- Tip: f81e8e1

## Auto-stop note (2026-05-29 00:57 UTC)

- Branch: main
- Tip: 90c329f

## Auto-stop note (2026-05-29 01:00 UTC)

- Branch: main
- Tip: 3ed283b

## Auto-stop note (2026-05-29 01:02 UTC)

- Branch: main
- Tip: 661e761

## Auto-stop note (2026-05-29 01:04 UTC)

- Branch: main
- Tip: 85baa35

## Auto-stop note (2026-05-29 01:05 UTC)

- Branch: main
- Tip: 598776e

## Auto-stop note (2026-07-14 03:05 UTC)

- Branch: v11
- Tip: 51a37cc

## Auto-stop note (2026-07-14 10:45 UTC)

- Branch: v11
- Tip: 063d3a6

## Auto-stop note (2026-07-14 10:55 UTC)

- Branch: v11
- Tip: 26baf2e

## Auto-stop note (2026-07-14 13:08 UTC)

- Branch: v11
- Tip: 69e5457

## Auto-stop note (2026-07-14 13:21 UTC)

- Branch: v11
- Tip: 682b425

## Auto-stop note (2026-07-14 13:26 UTC)

- Branch: v11
- Tip: 8042fa1

## Auto-stop note (2026-07-14 13:39 UTC)

- Branch: v11
- Tip: a9f635a

## Auto-stop note (2026-07-14 16:43 UTC)

- Branch: main
- Tip: 45e48d1

## Auto-stop note (2026-07-14 17:37 UTC)

- Branch: main
- Tip: 542cd54

## Auto-stop note (2026-07-14 18:05 UTC)

- Branch: main
- Tip: e520823

## Auto-stop note (2026-07-14 18:07 UTC)

- Branch: main
- Tip: f60fa93

## Auto-stop note (2026-07-14 18:09 UTC)

- Branch: main
- Tip: 9de6146

## Auto-stop note (2026-07-14 19:03 UTC)

- Branch: main
- Tip: a8e42a2

## Auto-stop note (2026-07-14 19:07 UTC)

- Branch: main
- Tip: a29df7f

## Auto-stop note (2026-07-14 19:24 UTC)

- Branch: main
- Tip: 188d6f5

## Auto-stop note (2026-07-14 19:28 UTC)

- Branch: main
- Tip: 5920986

## Auto-stop note (2026-07-14 19:32 UTC)

- Branch: main
- Tip: cfcc5cf

## Auto-stop note (2026-07-14 19:44 UTC)

- Branch: main
- Tip: c4e65fe

## Auto-stop note (2026-07-14 19:52 UTC)

- Branch: main
- Tip: 113f1b9

## Auto-stop note (2026-07-14 19:52 UTC)

- Branch: main
- Tip: 23aea3e

## Auto-stop note (2026-07-14 19:53 UTC)

- Branch: main
- Tip: c202db8

## Auto-stop note (2026-07-14 19:53 UTC)

- Branch: main
- Tip: 3fb3253

## Auto-stop note (2026-07-14 19:59 UTC)

- Branch: main
- Tip: 15bb11d

## Auto-stop note (2026-07-14 20:03 UTC)

- Branch: main
- Tip: 82411f1

## Auto-stop note (2026-07-14 20:28 UTC)

- Branch: main
- Tip: 0d5bfb7

## Auto-stop note (2026-07-14 23:44 UTC)

- Branch: main
- Tip: 8cb52ee

## Auto-stop note (2026-07-15 00:58 UTC)

- Branch: main
- Tip: 6b6aa94
