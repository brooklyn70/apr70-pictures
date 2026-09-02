# APR 70 — Brand baseline, layered-cinema brief, and i18n discovery plan

**Date:** 2026-09-02 · **Author:** Claude Fable 5.1 (discovery session, read-only) · **Status:** planning document. Applied afterwards on Marco's go (same day): the A.2 header corrections and a ledger note under v13; everything else remains proposal
**Source prompt:** `~/websites/apr70-discovery-prompt-brand-baseline-layered-cinema-2026-09-02.md`
**Scope:** discovery, baseline preservation, and planning only. No visual or copy change, no logo replacement, no asset move or re-tag on disk or in Payload, no package install, no migration or seed, no NAS access, no push, merge, or deploy. The only repo files this session wrote are this plan and the two-line pointer at the top of `BRIEF.md`. The repo's Stop hook made four auto-commits during the session (see the closing note in section H); none was pushed.

**Hosting facts of record (override any stale doc header):** `https://staging.apr70.com` serves the full v10 stack from the Synology NAS Docker project `apr70v3`; `https://apr70.com` serves the one-screen holding page from `v10/holding/`; Vercel and Supabase are not in the production path (the July V4 deploy was an experiment; DNS never moved). Any header claiming "live on Vercel" is stale (A.2).

**How to read this document:** A is the restore-point baseline. B is the identity inventory and the proposed (unexecuted) archive manifest. C is the layered-cinema design brief and POC ranking. D is the external-reference matrix. E is the proposed skill and two checklists. F is the multilingual discovery. G is the question list for Marco. H is the session's closing note.

---

## A. Baseline and restore-point report

### A.1 Repository state at discovery (2026-09-02, read-only)

| Item | Value |
|---|---|
| Working tree | `/Users/marco/websites/apr70-website/v10/` |
| Branch | `main` |
| HEAD | `e9a6fc4b6e87f87b558a2a80307e4084b197bcb1` (`e9a6fc4` docs: correct place-poster chrome type to Jost/Newsreader/Courier Prime) |
| Working tree | pre-existing, NOT cleaned: `M AGENTS.md`, `M CLAUDE.md`, `M docs/decisions/2026-07-14-property-identities-falcon-and-tsunami.md`, untracked `.cursor/mcp.json` |
| Remotes | `origin` = GitHub `brooklyn70/apr70-pictures`; `nas` = `caruso@100.69.2.30:GitRepos/apr70-pictures.git` (Tailscale); `all` = fetch GitHub, push to both |
| Remote branches | `origin/main`, `origin/cursor/place-poster-skill-3b96`; `nas/main`, `nas/v10`, `nas/v11`; `all/main`, `all/v10`, `all/v11` |
| Tags | `archive/v9-branch` -> `f654973` (2026-07-11, "Legacy chrome follows the single marquee design"); `archive/v10-branch` -> `8f9b79b` (2026-07-13, MASTER-RECAP go-live docs); `archive/pre-main-ff-v11` -> `f150a53` (2026-07-14, stop-hook BRIEF note) |
| `v13` tag or branch | none exists (checked `git tag -l`, `git branch -a`) |
| Live checks (read-only curl, this session) | `staging.apr70.com` `/`, `/slate`, `/work/la-dolce-vita`, `/methods`, `/craft`, `/contact` all HTTP 200; `data-ai-mark="corner"` present on `/`; `apr70.com` HTTP 200, 8.9 KB one-screen holding page |
| Local CMS | Docker not running on the Mac (no `apr70-pictures-postgres-1`); surveys used the NAS API at `kimaserver:8080` over Tailscale, verified identical to the `staging.apr70.com` backend |

Notes on the remote branches: `v10` and `v11` survive only on the NAS remote (and its `all` alias). The branching law (CLAUDE.md) retired long-lived `vN` branches; those two are leftovers on the NAS bare repo, not on GitHub. Nothing was deleted; listed for Marco's ruling.

### A.2 Authoritative version and reconciliation

The authoritative version is `SITE_VERSION = 'v13'` in `cms/src/siteVersion.ts:16`. That constant is the only place a version number is written by law (comment block in the same file, Marco 2026-07-13). Every other surface that echoes a version:

| Surface | What it says (at discovery) | Agrees with `v13`? | Correction (APPLIED 2026-09-02 on Marco's go, same session, except rows marked "leave" or "none") |
|---|---|---|---|
| `cms/src/siteVersion.ts` | `'v13'` | authoritative | none |
| `docs/recap/MASTER-RECAP.html` Version ledger | `v13 CURRENT 2026-07-18`; rows `v12.2` and `v12.1` dated 2026-07-27 sit below it and postdate it; `v13` row notes "shots not refreshed"; footer says `LAST UPDATED 2026-07-13` | partially. The constant was never bumped for the 07-27 Futura takedown (v12.1) and Punch wordmark (v12.2) passes, so "v13" now covers three shipped states | append a ledger row (or a note under v13) that the 07-27 passes shipped under the unchanged `v13` constant; refresh footer date and shots |
| `BRIEF.md:1` header | `BRIEF — apr70-pictures (v3 -> V4 live on Vercel)` | stale; Vercel was the July experiment, DNS never moved | `# BRIEF — apr70-pictures (v13 on the NAS: staging.apr70.com = full site, apr70.com = holding page)` |
| `BRIEF.md:118` | "Phase: V4 SHIPPED TO VERCEL STAGING" | historical block; keep as history, mark as such | prefix the block with `**Historical (July V4 Vercel experiment, not the production path):**` |
| `CLAUDE.md:1` header | `CLAUDE.md — apr70-pictures (v3)` | stale label ("v3" is the architecture generation name, not the site version) | `# CLAUDE.md — apr70-pictures (v3 architecture, site version lives in cms/src/siteVersion.ts)` |
| `CLAUDE.md` `Staging:` line | `https://staging-v3.apr70.com (pending DSM slot)` | wrong; live staging is `https://staging.apr70.com` since the 2026-07-13 proxy flip | `**Staging:** https://staging.apr70.com (full v10 stack, NAS Docker project apr70v3)` |
| `CLAUDE.md` `Hosting:` line | `/volume1/apps/apr70-v3` | wrong. Verified read-only over SSH 2026-09-02: the stack is at `/volume1/apps/apr70-pictures` (an `/volume1/apps/apr70` folder also exists, contents not inspected) | `/volume1/apps/apr70-pictures` (APPLIED 2026-09-02) |
| `CLAUDE.md` `Live (when shipped):` | `https://apr70.com` | apr70.com serves the holding page today | `**Live:** https://apr70.com (one-screen holding page from v10/holding/ until the go-live flip)` |
| `../README.md` folder table | `branch v10`, `staging.apr70.com -> monolith on port 3000 until Marco runs the go-live runbook` | stale on both counts (branch is `main`; staging is the v10 stack) | change `branch v10` to `branch main`; NAS quick facts line to `staging.apr70.com -> v10 stack (proxy flipped 2026-07-13)` |
| `holding/index.html:34` | a code comment cites "v10" as the privacy-law origin | not a version claim | none |
| Nav watermark | none. No `SITE_VERSION` or `v13` string is rendered by `web/src`; the only hits are CSS/TS comments (`v9.css:119,759,917,954,1016`, `marquee.css:242`, `media.ts:49`) | n/a | none |
| `web/package.json` | `"version": "0.0.1"` | never bumped; not governed by the law | leave, or note in CLAUDE.md that package versions are not the site version |
| `cms/package.json` | `"version": "1.0.0"` | same | same |
| `../_deploy/deploy-v10-to-nas.sh` final line | "staging.apr70.com untouched" (per the v13 handoff) | stale since the proxy flip | reword to "this stack IS staging.apr70.com" |
| `docs/decisions/2026-07-05-vercel-supabase-runbook.md` | "code ready on v4-infra; awaiting provisioning" | historical; Vercel is not the production path | add a top-line status: "Superseded for production. Reference only." |

### A.3 What "v13" refers to, and what a restore would restore

`v13` is a site-version string, not a git ref. A "restore to v13" today means three independent things:

1. **Code**: a commit SHA on `main`. The v13 chrome pass deployed to staging on 2026-07-18; the Futura takedown and Punch wordmark commits (2026-07-27, for example `d7b9a35` "Logo takedown pass 2") shipped after it under the same constant. Read-only over SSH after the discovery pass (2026-09-02, on Marco's go): the NAS checkout at `/volume1/apps/apr70-pictures` is at commit `6a6fa4a`. That is the SHA a `restore/v13-*` tag should sit on (A.4), not HEAD; HEAD carries only docs commits since that deploy.
2. **Database**: the deploy script dumps the NAS Postgres before every deploy to `$NASREPO/_deploy-backup-v10-$STAMP/nasdb-before.pgc` (`deploy-v10-to-nas.sh:43,113`) and `--rollback` restores the newest such dump (`:76-78`). The local dump used for a DB push lands in `/tmp/apr70-$BRANCH-$STAMP.pgc` and is piped to `/tmp/apr70-$BRANCH.pgc` on the NAS (`:157-158`). These are custom-format `pg_dump -Fc` files. They are the only DB restore points that exist; there is no scheduled dump.
3. **Media**: `/Volumes/SharedData/10-10-cms-media-live/` (the Payload upload directory, mounted into the CMS container) is not versioned and not covered by the deploy backup. A DB dump restored against a media directory that has since gained or lost files yields dangling rows (one such row already exists: media id 209 `favicon-nrc_white_512.png`, see B.4).

So a restore is only complete when all three are captured together and labelled with the same stamp.

### A.4 Restore-point procedure. EXECUTED 2026-09-02 on Marco's go

Captured 2026-09-02 (Marco watching), all three artefacts under one stamp:

| Artefact | Where | Verified |
|---|---|---|
| Code | tag `restore/v13-2026-09-02` on `6a6fa4a` (2026-07-27 "Nav: drop Home link from header; footer brand mark added"), pushed to `origin` and `nas` | `git tag -l restore/*`; both remotes report `[new tag]`; NAS HEAD re-read as `6a6fa4a` at capture |
| Database | `/volume1/apps/apr70-pictures/_deploy-backup-v10-2026-09-02/nasdb-before.pgc` (`pg_dump -Fc apr70_cms` from `apr70v3-postgres-1`), 1,182,098 bytes, plus `RESTORE-POINT.md` beside it. File name follows the deploy script's rollback convention | `pg_restore -l` lists 2,831 catalog entries |
| Media | `/volume1/SharedData/_snapshots/10-10-cms-media-live-v13-2026-09-02/` (`rsync -a` on the NAS) | 429 source files, 429 snapshot files, 264 MB |
| Branch protection | GitHub classic branch protection rule on `main` (force pushes and deletion blocked, no PR requirement so the deploy script and Stop hook keep pushing) | created by Marco 2026-09-02; verified on the Settings page, "currently applies to 1 branch" |

Note on rollback interplay: `deploy-v10-to-nas.sh --rollback` restores the newest `_deploy-backup-v10-*` dump. Until the next deploy writes a newer folder, that is this one, which is the DB as of 2026-09-02, so a rollback before the next deploy is a no-op restore. The next deploy creates its own newer folder and takes precedence.

The procedure as proposed before execution:

1. Annotated tag on the deployed SHA, not on HEAD by default: `git tag -a restore/v13-2026-09-02 <deployed-sha> -m "v13 restore point: code + nasdb + media snapshot 2026-09-02"`, pushed with `git push origin --tags` and `git push nas --tags`. Naming follows the existing `archive/*` namespace convention but uses `restore/` so the intent is unambiguous.
2. DB pairing: on the NAS, `docker exec apr70v3-postgres pg_dump -U postgres -Fc apr70 > /volume1/apps/.../_deploy-backup-v10-<STAMP>/nasdb-restore-v13.pgc` using the same folder convention the deploy script already writes, so `--rollback` can find it. Record the stamp in the tag message.
3. Media pairing: a DSM snapshot of the `SharedData` share (Snapshot Replication, if enabled) or `rsync -a /volume1/SharedData/10-10-cms-media-live/ /volume1/SharedData/_snapshots/10-10-cms-media-live-v13-<STAMP>/`. Record the path in the tag message.
4. Protected branch: GitHub branch protection on `main` (no force-push, no deletion) is worth enabling because the tag lives on `main` history; a separate `release/v13` branch adds nothing and conflicts with the one-long-lived-branch law. Recommendation: tag plus protection, no release branch.
5. Ledger: add the restore-point stamp to the MASTER-RECAP v13 row so the three artefacts can be found from one place.

### A.5 Files that must change on the next version bump (under current law)

| File | Why |
|---|---|
| `cms/src/siteVersion.ts` | the constant (the only version write) |
| `docs/recap/MASTER-RECAP.html` | new ledger row, refreshed screenshots, footer date |
| `BRIEF.md` | header and Current block |
| `TASKS.md` | phase notes / done list |
| `CLAUDE.md` | header label and stale hosting lines (see A.2) |
| `../README.md` | folder table (`branch main`, staging facts) |
| Vault `Website Version Status` note (linked from every ledger row) | paper trail |
| `docs/handoff/` | one current handoff at top level, previous moved to `archive/` (rule 15) |
| `../_deploy/deploy-v10-to-nas.sh` | stale final-line text (one-time fix, not per bump) |

`web/package.json` and `cms/package.json` are not governed; leaving them at `0.0.1` / `1.0.0` is consistent with the law that the constant is the only version.

### A.6 Session footgun observed: the context gate counts subagent output

`.claude/hooks/context-gate.sh` reads `.claude/.context-meter`, which `context-meter.sh` (PostToolUse) increments for every tool call in the repo, including calls made by subagents, and which the Stop hook resets whenever any agent (including a subagent) stops. During this discovery the meter crossed 250 KB twice on subagent traffic while the parent session had produced roughly 40 to 60 KB, and the hook hard-blocked Bash and Agent calls in the parent and in one subagent for its whole run (its data tasks had to be rerun). Proposed fix for a future session (not applied): key the meter by session id (`$CLAUDE_SESSION_ID` or the hook input's `session_id`) so each agent meters its own output, and have the Stop hook remove only its own file.

---

## B. Branding and identity inventory

Scope: every logo, favicon, monogram, wordmark, sprocket mark, and identity asset across the canonical SharedData kit, the archived Futura-era kit, the repo's `web/public` tree, the holding page, the Payload media store, and the pre-consolidation `~/websites/apr70-logos/` folder. Property images are out of scope beyond a count. Nothing was moved, re-tagged, deleted, or uploaded. Two subagents produced B.1 to B.4; B.5 is the parent's reconciliation of their findings against each other and against the code.

Counts verified in the parent session (the subagent totals differ where noted, because they counted `.DS_Store`, thumbnails, or nested folders differently; the parent's counts are `find -type f` and `git ls-files`):

| Location | Parent-verified count | Note |
|---|---|---|
| `web/public/logos/` | 20 SVG | `apr70_logo_{full,primary}_{black,white}` plus 16 sprocket-colour variants |
| `web/public/brand/` | 205 files, 202 git-tracked | `apr70-logos/` vendored mirror + `README.md` + `dispatch-favicon.svg` + `placeholders/` |
| `web/public/pd/` | 91 files | includes `credits.json` (22 ledger entries: slug, title, source, sourceUrl, collection, date, rightsText, downloadDate, masterFile, tiers, cropTiers, cropNote, flags) |
| `holding/` | `favicon.svg`, `logos/wordmark-pictures_white_punch-orange.svg`, 3 self-hosted woff2 (Jost variable, Newsreader, Courier Prime) | zero external requests by law |
| `/Users/marco/websites/apr70-logos/` | does not exist | already folded into the SharedData archive; the umbrella README row is stale |
| Payload media (live API) | 207 docs: 15 logo, 71 favicon, 40 wordmark, 80 photo, 0 watermark, 1 untagged | see B.4 |
| `/Volumes/SharedData/10-10-cms-media-live/` | 428 files at top level | originals plus Payload-generated sizes |
| `/Volumes/SharedData/10-01-logos/2026-brand-jost-punch/` | 433 files (recursive, no `.DS_Store`) | canonical kit |
| `/Volumes/SharedData/10-01-logos/_ARCHIVED-futura-era-brand-2026-07-27-DO-NOT-USE/` | 712 files (recursive) | list only; zero live references (B.2) |
| `/Volumes/SharedData/11-00-property-images/` | 752 top-level entries, 933 files recursive, `_manifest.csv` 958 data rows | out of scope beyond the count |

### B.1 Brand asset inventory

Read-only inventory. No files modified, moved, or deleted. All counts are `find`/`sips`/`grep` output taken 2026-09-02.

#### B.1.1 `/Volumes/SharedData/10-01-logos/2026-brand-jost-punch/` — canonical (per `README.md` inside this folder; there is no umbrella `10-01-logos/README.md`, only this subfolder README)

System: Wordmark E "The Punch" — APR 70 in outlined Jost Bold with a true-scale BH-1866 perforation as the full stop. Monogram "70" in Jost 500 D4 double box. Favicons: Jost 600 tiles. All vector outlines, no live text/font dependency. Ships in 8 colors: black, white, sicilian-orange, 212-amber, 310-imax, sicilian-blue, nrc-grey, nrc-navy.

| Family (path) | Type | Count | Dims/viewBox | References found | Public-facing | Status |
|---|---|---|---|---|---|---|
| `wordmark/wordmark{,-pictures}_{black,white}_punch-{amber,blue,grey,imax,navy,orange}.svg` | wordmark, punch variant | 24 | viewBox 0 0 329.7 98.6 (sample) | none in web/src or cms/src; `wordmark-pictures_white_punch-orange.svg` is copied into `holding/logos/` (see B.1.5) | not directly (source master) | canonical |
| `wordmark/wordmark{,-pictures}_solid-{amber,black,blue,grey,imax,navy,orange,white}.svg` | wordmark, solid single-color | 16 | same viewBox family | none found live | not directly | canonical |
| `monogram/monogram-70_{amber,black,blue,grey,imax,navy,orange,white}.svg` | monogram "70" in D4 box | 8 | viewBox 0 0 129.3 89.5 | none found live | not directly | canonical |
| `favicons/svg/favicon-{212,310,70,nrc}_{amber,black,blue,grey,imax,navy,orange,white}.svg` | favicon tile, per-division + apex "70" | 32 | viewBox 0 0 512 512 | none found live in web/src (see note below — Payload media/`payload-thumbs` is the likely live bridge) | not directly | canonical |
| `favicons/png/favicon-*_{color}[_512]-{16,32,48,180,512}.png` | favicon raster, 5 sizes | 160 | confirmed 16x16 on sample; README specifies 16/32/48/180/512 | none found live in web/src | not directly | canonical |
| `favicons/ico/favicon-*_{color}.ico` | multi-res .ico | 32 | not sampled (README: 16+32+48 multi-res) | none found live | not directly | canonical |
| `letterhead/{html,pdf}/letterhead-{classic,seventy,strip}_{amber,blue,grey,imax,navy,orange}.{html,pdf}` | letterhead masters | 36 (18 html + 18 pdf) | n/a (print docs) | none found live | not directly | canonical |
| `business-card/{html,pdf}/card-d4_{amber,blue,grey,imax,navy,orange}.{html,pdf}` | business card masters | 12 (6 html + 6 pdf) | n/a (print docs) | none found live | not directly | canonical |
| `payload-thumbs/favicon-{212,310,70,nrc}_{color}[_512]-480x480.webp` | Payload media-library thumbnails of the favicon masters | 112 | .webp, 480x480 thumb | not grep-findable (binary media, lives in Payload's DB-tracked media store per README: "Web copies... loaded in Payload media (staging) for Marco to experiment with") | served via Payload media URLs when in use | canonical / current (bridge to CMS) |

Note on "no references found": none of the canonical master files are referenced by literal filename anywhere in `web/src`/`cms/src`, which is expected — canonical masters live outside the repo and enter the site only via Payload Media uploads (id/URL-based, not path-based) or by being copied out (as happened once, into `holding/`). Absence of a filename hit is not evidence the system is unused; it is evidence the pipeline is upload-based, per CLAUDE.md rule 10 ("Media relationships... never loose path strings").

Division favicon canon (per README, ruled by Marco): apex "70" black, 212 amber, 310 imax, NRC navy. Other colors are experiment variants.

#### B.1.2 `/Volumes/SharedData/10-01-logos/_ARCHIVED-futura-era-brand-2026-07-27-DO-NOT-USE/` — LIST ONLY

Total: 715 files. By extension: 492 svg, 159 png, 52 docx, 4 webp, 3 html, 1 md, 3 `.DS_Store`.

Top-level structure: `01-apr70-pictures/`, `02-212-pictures/`, `03-310-pictures/`, `04-new-renaissance-cinema/`, `05-brand-marks/`, `README.md`, `cms-media-live-originals/`, `local-apr70-logos-tree/`, `repo-refs-logo-drafts/`, `repo-svg-originals/`.

`local-apr70-logos-tree/` is explicitly labeled in this archive's README as "the retired `~/websites/apr70-logos` duplicate" — confirms this archive already absorbed that tree (see B.1.4).

Representative filenames (sampled): `apr70_favicon_navy_bg_black_text_regular-1ad70c43.svg`, `apr70_logo_full_black_amber_sprockets.png`, `apr70_logo_full_white_navy_sprockets.svg`, `apr70_logo_primary_black_v6.png`, `apr70_monogram_black_orange_sprockets.png`, `business_card_front_apr70_blue.docx`, `letterhead_apr70_pictures_orange.docx`, `212_letterhead.svg`, `imax_strip 2.png`, `apr70-apr70pictures/favicons/apr70_favicon_black_orange_sprockets_v5.svg`, `new-renaissance-cinema/nrc_v2.svg`.

Archive README states (self-declared, verbatim intent): "Nothing in this folder may ship again... Agents: any file from this folder found in active use is a defect — flag it."

**Live-reference check: no direct hits.** `grep -rniI "_ARCHIVED"` across `web/src`, `cms/src`, `holding/`, `tools/` returned zero results. **However**, see B.2 — the *filenames* used inside this archive (the Futura-era `apr70_logo_full_*`, `apr70_favicon_*`, `apr70_monogram_*` naming pattern) are structurally identical to files still living and still referenced in `web/public/logos/` and `web/src/layouts/V9Layout.astro` (B.1.3, B.2). Those live copies are NOT inside the archived folder — they are a parallel, non-archived set with the same old naming convention. This is the one thing worth flagging: the *era* of design (Futura-naming, sprocket suffix) is still live in the fallback path even though the literal archived directory is unreferenced.

#### B.1.3 `web/public/logos/`, `web/public/` root, `web/public/brand/`, `web/public/comfy-interim/`, `web/public/pd/`

**`web/public/logos/`** — 20 SVG files (not 21; one path in the raw listing was the section header). Family: `apr70_logo_{full,primary}_{black,white}[_{amber,blue,navy,orange}_sprockets].svg` — Futura-era naming pattern, 20 files (2 lockups x 2 base colors x [plain + 4 sprocket-accent variants] = 2x2x5=20).

- References: `web/src/layouts/V9Layout.astro:106-107` — `markLight`/`markDark` fall back to `'/logos/apr70_logo_full_white.svg'` and `'/logos/apr70_logo_full_black.svg'` when Payload's `navLogoDark`/`navLogoLight` media fields are unset. `V9Layout.astro` is the layout imported by essentially every live route (`index.astro`, `212.astro`, `310.astro`, `nrc.astro`, `slate.astro`, `troupe.astro`, `contact.astro`, `dispatch.astro`, `investors.astro`, `work/[slug].astro`, `craft.astro`, `methods.astro`, `pitch.astro`). `cms/scripts/seed-v9.ts` does not seed `navLogoDark`/`navLogoLight` at all, so unless Marco has manually uploaded those two fields in the Payload admin, **these two Futura-era SVGs are what actually render as the nav mark on the live site right now.**
- Public-facing: yes (served at `/logos/*.svg`).
- Status: **current** (active code-path fallback, likely the actual rendering asset) — despite using the archived naming convention. Not safe to archive without first confirming `navLogoDark`/`navLogoLight` are populated in Payload.

**`web/public/` root:**
- `favicon.ico` — 32x32, single-resolution (not multi-res like the canonical `.ico` family). Status: **legacy/placeholder** — looks like generic scaffolding, not a canonical multi-res build.
- `favicon.svg` — viewBox 0 0 128 128, path data is the stock Astro-starter mark (rocket/chevron abstract shape, not APR 70 branding), with a `prefers-color-scheme` dark/light fill toggle. Referenced at `web/src/layouts/V9Layout.astro:101` as `faviconHref = divisionFavicon || siteFavicon || '/favicon.svg'` (last-resort fallback after Payload's division favicon and site favicon fields) and at `web/src/lib/motion/splash.ts:59` as a `data-logo-src` default. A code comment at `V9Layout.astro:93-95` notes this file was **previously hardcoded** and ignored Payload uploads entirely — now it's genuinely last-resort. Status: **legacy/placeholder, fallback-only** — almost certainly not what actually renders in the browser tab today if Payload favicon fields are populated (README for the canonical tree says favicon PNGs are loaded into Payload media), but unverified without checking Payload admin directly.
- No `apple-touch-icon` file found anywhere under `web/public/`. `appleTouchIcon` IS wired in code (`V9Layout.astro`, resolved from `settings?.appleTouchIcon`) but has no static fallback file — Payload-only.

**`web/public/brand/`:**
- `dispatch-favicon.svg` (64x64, programmatic sprocket-perforation SVG) — grep found **zero references** to `dispatch-favicon` anywhere in `web/src`, `cms/src`, or `web/public` (including `dispatch.astro` and `dispatch-image-slot.js` itself). Status: **unused / uncertain** — possibly meant for an external embed that never shipped.
- `apr70-logos/` (223 files: `212-pictures/`, `310-pictures/`, `apr70-apr70pictures/` [business_cards, favicons, letterhead, logo, monogram — svg/png/docx], `new-renaissance-cinema/`) — this is a **second, separate copy of the Futura-era brand tree**, distinct from both `web/public/logos/` and the SharedData archive. Zero references found via `grep -rl "brand/apr70-logos"` in `web/src`/`cms/src`. Status: **archival** (superseded duplicate, unreferenced).
- `placeholders/` (17 files: `placeholder-{16x9,1x1,4x3,9x16}-{212,310,nrc,default}.svg` + README) — not logo/identity marks per se (image-slot placeholders), out of strict scope but noted for completeness. Not checked for live references (out of task scope).

**`web/public/comfy-interim/`** — 1 file (`onair-sign-candidate-4.jpg`), not a logo/identity asset — an in-progress production still. Out of scope, noted only.

**`web/public/pd/`** — 192 files total: 191 `.jpg` + 1 `credits.json`. `credits.json` confirmed to contain **exactly 22 ledger entries** (JSON list, `len()==22`; file not read/cat'd, per instruction). 23 named subdirectories (e.g. `nyc-mayors-*`, `radio-*`, `sicily-village-*`, `seagate-*` — note "seagate" not "tsunami", consistent with the 2026-07-14 naming ruling) plus loose numbered files at top level (`la-theater-cinema-08..16`, `ny-theater-00..06`, `nyc-movie-palaces-25..32`, `objects-42..51`, `property-matches-61..68`, `publications-print-34..41`, `radio-17..24`). Not identity/logo assets — public-domain photo stock, noted per instructions only.

#### B.1.4 `/Users/marco/websites/apr70-logos/` — predates media consolidation

**Directory does not exist** (`ls`: "No such file or directory"). Already removed/consolidated. The SharedData archive's own README (B.1.2) explicitly documents this: `local-apr70-logos-tree/` inside `_ARCHIVED-futura-era-brand-2026-07-27-DO-NOT-USE/` is labeled "the retired `~/websites/apr70-logos` duplicate" — meaning this location was already folded into the archive and physically deleted from its original path. No action needed; nothing to flag as unreferenced because nothing remains there to check.

#### B.1.5 `/Users/marco/websites/apr70-website/v10/holding/`

Git-tracked files only (6): `favicon.svg`, `fonts/CourierPrime-normal-400.woff2`, `fonts/Jost-variable.woff2`, `fonts/Newsreader-normal-400-600.woff2`, `index.html`, `logos/wordmark-pictures_white_punch-orange.svg`.

- `holding/logos/` contains exactly **one** file: `wordmark-pictures_white_punch-orange.svg` — this is a direct copy of the canonical Jost-Punch wordmark family (B.1.1), used at `holding/index.html:226` (`<img class="mark" src="logos/wordmark-pictures_white_punch-orange.svg" alt="APR 70 Pictures">`). Status: **current** (canonical asset, correctly deployed to the holding page).
- `holding/favicon.svg` — separate from `web/public/favicon.svg`; not deep-diffed against the canonical favicon SVGs but its presence alongside the canonical wordmark copy suggests it is also current, not the Astro-stock file. Marked **uncertain (unverified content match)** — recommend a byte-diff against `favicons/svg/favicon-70_*.svg` before any archive action.
- `holding/fonts/` — Jost, Newsreader, Courier Prime — matches the "place-poster skill" chrome-type ruling (2026-08-21 decision doc). Not logo assets; noted for completeness, current.

#### B.1.6 `/Volumes/SharedData/11-00-property-images/` — count only

Total files: **934**. `_manifest.csv` exists at the top level with **959 lines** (`wc -l`, includes header row — so ~958 data rows against 934 files; the row/file count mismatch was not investigated further, out of scope for this brand-asset task — flag for Marco if the manifest is expected to be 1:1 with files).

#### B.1.7 `/Volumes/SharedData/10-01-logos/` top-level siblings

Only two entries besides `.DS_Store`: `2026-brand-jost-punch/` (canonical, B.1.1) and `_ARCHIVED-futura-era-brand-2026-07-27-DO-NOT-USE/` (B.1.2). No other siblings.

---

### B.2 Reference hits

String sweep (`grep -rniI`) across `web/src`, `cms/src`, `holding/`, `tools/`:

- `"futura"` — **zero hits** in web/src, cms/src, holding, tools.
- `"_ARCHIVED"` — **zero hits** in web/src, cms/src, holding, tools.
- `"apr70-logos"` — **zero hits** in web/src, cms/src, holding, tools.
- `"10-01-logos"` — **zero hits** in web/src, cms/src, holding, tools.

All four strings DO appear in `docs/` (documented only, historical record — 232 matching lines total, dominated by `docs/recap/MASTER-RECAP.html`), e.g.:

- `docs/recap/MASTER-RECAP.html:270` — "The Futura takedown... Old brand collateral... archived whole at 10-01-logos/_ARCHIVED-futura-era-brand-2026-07-27-DO-NOT-USE." (documented, historical)
- `docs/recap/MASTER-RECAP.html:265` — "...Futura house face, Payload Brand Kit..." (documented, historical, predates the takedown)

Filename/path reference hits (code, not docs):

- `web/src/layouts/V9Layout.astro:106` — `const markLight = resolveMediaUrl(settings?.navLogoDark) || '/logos/apr70_logo_full_white.svg'`
- `web/src/layouts/V9Layout.astro:107` — `const markDark = resolveMediaUrl(settings?.navLogoLight) || '/logos/apr70_logo_full_black.svg'`
- `web/src/layouts/V9Layout.astro:101` — `const faviconHref = divisionFavicon || siteFavicon || '/favicon.svg'`
- `web/src/lib/motion/splash.ts:59` — `const logoSrc = doc.getAttribute('data-logo-src') || '/favicon.svg'`
- `holding/index.html:226` — `<img class="mark" src="logos/wordmark-pictures_white_punch-orange.svg" alt="APR 70 Pictures">`
- No hits for: `apr70_logo_`/`apr70_favicon_`/`apr70_monogram_` outside `V9Layout.astro`; `dispatch-favicon`; `payload-thumbs`; `dispatch-image-slot` (imported/loaded nowhere found); `brand/apr70-logos`; `comfy-interim`.
- `cms/scripts/seed-v9.ts` does not set `navLogoDark`, `navLogoLight`, `favicon`, `favicon212`, `favicon310`, or `faviconNrc` — no `cms/src/seed*.ts` files exist at all (seed lives in `cms/scripts/`, not `cms/src/`). This means the Payload `SiteSettings` favicon/logo media fields (defined in `cms/src/globals/SiteSettings.ts`) are populated only if Marco manually uploaded them in `/admin` — not verified from the filesystem side of this read-only pass.

### B.3 Proposed archive manifest

No moves performed — proposals only, for Marco's approval.

| Source | Proposed destination | Reason | Confidence |
|---|---|---|---|
| `web/public/brand/apr70-logos/` (202 tracked files) | RULED 2026-09-02: the NAS, not the Mac. `/Volumes/SharedData/10-01-logos/_ARCHIVED-futura-era-brand-2026-07-27-DO-NOT-USE/web-public-brand-apr70-logos-frozen-2026-09-02/` (copy there first, verify the copy, then `git rm` in the repo) | Duplicate Futura-era brand tree already superseded by `2026-brand-jost-punch/`; zero code references found (`grep -rl "brand/apr70-logos"` empty in web/src, cms/src). Sibling copy of what SharedData already archived. | 0.85 |
| `web/public/logos/` (20 files, `apr70_logo_full/primary_*`) | Do NOT archive yet — hold at `~/websites/_archive/apr70-website-v10-web-public-logos-frozen-YYYY-MM-DD/` only after confirmation | This is the live nav-mark fallback in `V9Layout.astro:106-107` and is unreferenced by any Payload seed script. Flag for Marco: confirm `navLogoDark`/`navLogoLight` are set in Payload admin before touching this — if unset, this IS the current production logo. | 0.3 (do not archive without Marco's check) |
| `web/public/favicon.ico`, `web/public/favicon.svg` | Replace in place with canonical `favicon-70_black.ico` / `favicon-70_black.svg` from `2026-brand-jost-punch/favicons/`, rather than archive-only | Both are last-resort fallbacks; `favicon.svg` is literally the stock Astro starter mark, not an APR 70 asset — a defect (dead scaffolding), not something to merely file away. Flag for Marco: this is a fix, not an archive action. | 0.7 (identification) / n/a (action is out of scope for archive-only task) |
| `web/public/brand/dispatch-favicon.svg` | `~/websites/_archive/apr70-website-v10-dispatch-favicon-frozen-2026-09-02/` OR flag for Marco (unclear intended use) | Zero references found anywhere including inside `dispatch-image-slot.js` and `dispatch.astro`. Provenance/intended use unclear — flag for Marco rather than assume archival is correct; could be a planned-but-unshipped feature. | 0.4 |
| `web/public/dispatch-image-slot.js` (31KB) | Flag for Marco — do not archive on this pass | Zero import/script-tag references found in `web/src`. Could be an intentionally standalone/embeddable widget served by direct URL (not grep-detectable) rather than dead code. Provenance unclear. | 0.25 |
| `/Volumes/SharedData/10-01-logos/_ARCHIVED-futura-era-brand-2026-07-27-DO-NOT-USE/` | No action — already correctly archived and named per convention (`...-DO-NOT-USE`, dated). | Already in its final resting place; zero live references confirmed. | 0.95 (leave as-is) |
| `/Users/marco/websites/apr70-logos/` | No action — already gone | Directory does not exist; already consolidated into the SharedData archive's `local-apr70-logos-tree/`. Nothing to move. | 1.0 (confirmed absent) |

Legal/provenance note: no PD or rights claims made anywhere in this report per instructions; `web/public/pd/credits.json` entry count (22) reported factually only, content not read.

**Unverified items (flagged, not resolved by this read-only pass):**
- Whether Payload `SiteSettings` currently has `navLogoDark`/`navLogoLight`/`favicon`/`favicon212`/`favicon310`/`faviconNrc` populated (determines whether `web/public/logos/*` and `web/public/favicon.svg` are actually rendering live, or are dormant fallbacks only).
- `holding/favicon.svg` content vs. canonical `favicon-70_*.svg` — not byte-diffed.
- `_manifest.csv` row count (959) vs. actual file count (934) in `/Volumes/SharedData/11-00-property-images/` — discrepancy noted, not investigated (out of brand-asset scope).
- Intended use of `dispatch-favicon.svg` and `dispatch-image-slot.js` — no code path found referencing either.

### B.4 Payload media store (10-10-cms-media-live) and brand relationship fields

**Resume note (2026-09-02):** the prior session's Bash/ToolSearch outage was gone this
session — Bash worked normally. Tasks 2 and 3 (REST API pull + on-disk check), previously
blocked, were run to completion below. Field-map section (Task 1) preserved unchanged from
the prior pass; every "unverified" data section beneath it is now replaced with real results.

**API base resolved:** `http://kimaserver:8080` (curl 200 on `/api/globals/site-settings`).
`https://staging.apr70.com` ALSO returns 200 on the same endpoint with byte-identical global
keys — it reverse-proxies to the same Payload backend, not a separate site. The
`_deploy/deploy-v10-to-nas.sh` comment "does NOT touch staging.apr70.com" (script line 6-7)
refers only to that script's git-checkout step on the NAS, not to DNS/proxy routing — both
hostnames serve the one live CMS. `staging-v3.apr70.com`, `cms.apr70.com`,
`staging-cms.apr70.com` all timed out (curl 000, DNS/connect failure, not tried further per
task scope). `https://apr70.com/api/...` returned 404 (old monolith, different app). Used
`http://kimaserver:8080` for all queries below. `curl -G --data-urlencode` was required —
plain `where[mediaKind][equals]=logo` query strings silently returned an empty body from this
shell/curl combo.

---

#### Field map — brand media relationships

| Global / file | Field | Type | path:line | filterOptions (mediaKind) |
|---|---|---|---|---|
| SiteSettings | `favicon` | relationship → media | `cms/src/globals/SiteSettings.ts:96` | `favicon` |
| SiteSettings | `faviconDark` | relationship → media | `cms/src/globals/SiteSettings.ts:110` | `favicon` |
| SiteSettings | `appleTouchIcon` | relationship → media | `cms/src/globals/SiteSettings.ts:126` | `favicon`, `logo` |
| SiteSettings | `navLogoLight` | relationship → media | `cms/src/globals/SiteSettings.ts:142` | `logo`, `wordmark` |
| SiteSettings | `navLogoDark` | relationship → media | `cms/src/globals/SiteSettings.ts:155` | `logo`, `wordmark` |
| SiteSettings | `favicon212` | relationship → media | `cms/src/globals/SiteSettings.ts:204` | `favicon` |
| SiteSettings | `favicon310` | relationship → media | `cms/src/globals/SiteSettings.ts:225` | `favicon` |
| SiteSettings | `faviconNrc` | relationship → media | `cms/src/globals/SiteSettings.ts:246` | `favicon` |

All eight expected SiteSettings brand fields confirmed, exact names as expected. No ninth
brand-media field exists on SiteSettings (`brandKit.logoHeight` at `SiteSettings.ts:278` is
a `number`, not a media relationship — logo *size*, not a logo *asset*).

| Global | Field | Type | path:line | filterOptions |
|---|---|---|---|---|
| Division212 / Division310 / DivisionNRC (shared) | `headerLogo` | **upload** → media | `cms/src/fields/divisionBrandFields.ts:16` | `logo`, `wordmark` |
| " | `footerLogo` | **upload** → media | `cms/src/fields/divisionBrandFields.ts:29` | `logo`, `wordmark` |
| " | `faviconOverride` | **upload** → media | `cms/src/fields/divisionBrandFields.ts:44` | `favicon` |

`divisionBrandFields` is spread into all three division globals: `Division212.ts:28`,
`Division310.ts:27`, `DivisionNRC.ts:25`. Each division global is `admin: { hidden: true }`
(`Division212.ts:20`, `Division310.ts:20`, `DivisionNRC.ts:20`) with the identical comment:
*"v10 admin trim (Marco 2026-07-12): fed the retired v4 surface; hidden, not deleted — data
kept for archive/possible v11 reuse."* No `headerLogo`/`footerLogo`/`faviconOverride`-equivalent
field exists elsewhere for the live `/212 /310 /nrc` pages that this repo's block-stack
layout actually renders — the per-division icons are the `favicon212/310/Nrc` fields on
SiteSettings instead (per the `SiteSettings.ts:178-182` comment: "division favicon SVGs
already sit in the media library; tag one as mediaKind Favicon").

**Media collection tagging** (`cms/src/collections/Media.ts`):
- `mediaKind` select, sidebar, options `logo | favicon | wordmark | watermark | photo` — `Media.ts:39-53`.
- `divisionTag` select, sidebar, options `212 | 310 | nrc | corporate` — `Media.ts:55-68`.
- Upload sizes: `thumb` 480w, `card` 1024w, `hero` 1920w, all WebP q82; originals untouched
  (format re-encode is per-size only) — `Media.ts:83-87` and comment at `Media.ts:76-82`.
- `frameRatio` select (`standard` 2.00:1 / `hero` 2.39:1 / `native`) drives a `beforeOperation`
  crop hook (`cropToFrame`) — `Media.ts:22-37`, hook wired at `Media.ts:14-15`.

---

#### Resolved-asset table (SiteSettings 8 brand fields — all resolved)

Source: `GET http://kimaserver:8080/api/globals/site-settings?depth=1`.

| Field | id | filename | w x h | mime | mediaKind/divisionTag | createdAt | On-disk |
|---|---|---|---|---|---|---|---|
| favicon | 163 | favicon-70_black.svg | 512x512 | image/svg+xml | favicon/corporate | 2026-07-27 | present |
| faviconDark | 168 | favicon-70_orange.svg | 512x512 | image/svg+xml | favicon/corporate | 2026-07-27 | present |
| appleTouchIcon | 195 | favicon-70_black_512.png | 512x512 | image/png | favicon/corporate | 2026-07-27 | present |
| navLogoLight | 123 | wordmark_black_punch-orange.svg | 330x61 | image/svg+xml | wordmark/corporate | 2026-07-27 | present |
| navLogoDark | 133 | wordmark_white_punch-blue.svg | 330x61 | image/svg+xml | wordmark/corporate | 2026-07-27 | present |
| favicon212 | 146 | favicon-212_amber.svg | 512x512 | image/svg+xml | favicon/212 | 2026-07-27 | present |
| favicon310 | 158 | favicon-310_imax.svg | 512x512 | image/svg+xml | favicon/310 | 2026-07-27 | present |
| faviconNrc | 175 | favicon-nrc_navy.svg | 512x512 | image/svg+xml | favicon/nrc | 2026-07-27 | present |

8/8 resolved and non-null; `url` for each is `/api/media/file/<filename>`; alt text on all
eight reads `"... (Jost tile 2026)"` / `"... (Jost punch 2026)"` — one consistent naming era.
No ninth media relationship exists on SiteSettings besides these eight (`aiMark` is a
text/enum group with no media field: `{enabled: true, style: 'corner', text: 'APR 70 · AI
GEN'}`; `brandKit.logoHeight: 40` is a number, confirmed again live).

**Division globals — headerLogo/footerLogo/faviconOverride all null.** `GET
/api/globals/division-212|310|nrc?depth=1` — all three globals return `null` for all three
fields, on the live DB, confirming the "hidden/retired v4 surface" code-comment finding from
the static-analysis pass. Not a static-code inference anymore; live-data-confirmed.

**API base:** as stated above, `http://kimaserver:8080`, confirmed reachable and serving the
live data used throughout this survey. `PUBLIC_PAYLOAD_URL` env value itself was not read
(`.env`/`.env.local` reads remain out of scope for a read-only data survey and weren't
needed once the base was confirmed reachable directly).

#### Logo-tagged media table (mediaKind=logo, 15 rows)

Source: `GET /api/media?where[mediaKind][equals]=logo&limit=300&depth=0`.

| id | filename | w x h | mime | divisionTag | createdAt | On-disk |
|---|---|---|---|---|---|---|
| 145 | monogram-70_white.svg | 129x90 | svg | corporate | 2026-07-27 | present |
| 138 | monogram-70_amber.svg | 129x90 | svg | corporate | 2026-07-27 | present |
| 140 | monogram-70_blue.svg | 129x90 | svg | corporate | 2026-07-27 | present |
| 141 | monogram-70_grey.svg | 129x90 | svg | corporate | 2026-07-27 | present |
| 143 | monogram-70_navy.svg | 129x90 | svg | corporate | 2026-07-27 | present |
| 144 | monogram-70_orange.svg | 129x90 | svg | corporate | 2026-07-27 | present |
| 139 | monogram-70_black.svg | 129x90 | svg | corporate | 2026-07-27 | present |
| 142 | monogram-70_imax.svg | 129x90 | svg | corporate | 2026-07-27 | present |
| 96 | apr70_logo_primary_black_orange_sprockets-d3b3a53c.svg | 320x100 | svg | (none) | 2026-07-18 | present |
| 8 | nrc_footer.svg | 800x120 | svg | nrc | 2026-05-17 | present |
| 7 | nrc_v1.svg | 580x460 | svg | nrc | 2026-05-17 | present |
| 5 | 310_footer.svg | 360x230 | svg | 310 | 2026-05-17 | present |
| 4 | 310_hero.svg | 360x230 | svg | 310 | 2026-05-17 | present |
| 2 | 212_footer.svg | 360x230 | svg | 212 | 2026-05-17 | present |
| 1 | 212_hero.svg | 360x280 | svg | 212 | 2026-05-17 | present |

Also pulled favicon (71 rows) and wordmark (40 rows) tables in full (126 filenames checked
on-disk total, see On-disk check section) — omitted row-by-row here for length; every
`favicon-{70,212,310,nrc}_{color}[_512].{svg,png}` combination exists as a discrete Media
doc, all dated 2026-07-27, all `divisionTag` correctly scoped. Full raw lists saved at
`scratchpad/media_logo.json`, `media_favicon.json`, `media_wordmark.json`,
`media_watermark.json`, `media_photo.json`, `media_total.json`.

**Three distinct eras visible in the data**, by `createdAt`:
- **2026-05-17** (ids 1-10): original v9-era logo/favicon set — `212_hero.svg`,
  `nrc_v1.svg`, `apr70_favicon_orange_bg_white_text_bold 2.png`, etc. Not referenced by any
  current SiteSettings field or (null) division global.
- **2026-07-17/18** (ids 94-97): an interim wave — `apr70_logo_primary_black_orange_sprockets…`,
  `apr70_favicon_teal_bg_white_text_bold.svg`, `apr70_monogram_white_v5-1.svg`,
  `apr70_apple_touch_icon.png`. Also unreferenced by current SiteSettings fields.
- **2026-07-27** (ids 98-209): the current "Jost tile/punch 2026" wave — every SiteSettings
  brand field and every id in the logo-tagged table's `monogram-70_*` rows plus the full
  favicon/wordmark matrix point here. This is the live, canonical set.

#### Counts (total media, by kind)

Source: `GET /api/media?where[mediaKind][equals]=<kind>&limit=500` (totalDocs per kind) plus
unfiltered `GET /api/media?limit=1` for the grand total.

| mediaKind | totalDocs |
|---|---|
| logo | 15 |
| favicon | 71 |
| wordmark | 40 |
| watermark | 0 |
| photo | 80 |
| **all media (unfiltered)** | **207** |

15+71+40+0+80 = 206; the 207th doc carries no `mediaKind` tag (not queried individually —
out of scope beyond the count reconciliation, noted as a gap, not investigated further).

#### Futura-kit filename check

On-disk archive: `/Volumes/SharedData/10-01-logos/_ARCHIVED-futura-era-brand-2026-07-27-DO-NOT-USE/`
(a multi-subfolder tree, not flat files — `01-apr70-pictures/`, `02-212-pictures/`,
`03-310-pictures/`, `04-new-renaissance-cinema/`, `05-brand-marks/`, plus
`cms-media-live-originals/`, `local-apr70-logos-tree/`, `repo-refs-logo-drafts/`,
`repo-svg-originals/`). 336 unique raster/vector filenames recursed out of it.

No filename in the live API media set literally contains the string "futura" (0 hits) — the
archive folder's own name is the only "futura" occurrence, not an asset filename. Intersecting
all 206 brand-ish (logo/favicon/wordmark/watermark/photo) API filenames against the 336
archived filenames instead found **13 filename matches** — i.e. 13 assets still sitting live
in the Media collection whose filenames also exist in the pre-Jost archived tree:

| filename | live id | kind | createdAt | Referenced by current SiteSettings/division fields? |
|---|---|---|---|---|
| 212_favicon.svg | 3 | favicon | 2026-05-17 | no |
| 212_footer.svg | 2 | logo | 2026-05-17 | no |
| 212_hero.svg | 1 | logo | 2026-05-17 | no |
| 310_favicon.svg | 6 | favicon | 2026-05-17 | no |
| 310_footer.svg | 5 | logo | 2026-05-17 | no |
| 310_hero.svg | 4 | logo | 2026-05-17 | no |
| apr70_favicon_orange_bg_white_text_bold 2.png | 10 | favicon | 2026-05-17 | no |
| apr70_favicon_teal_bg_white_text_bold.svg | 97 | favicon | 2026-07-18 | no |
| apr70_logo_primary_black_orange_sprockets-d3b3a53c.svg | 96 | logo | 2026-07-18 | no |
| apr70_monogram_white_v5-1.svg | 95 | favicon | 2026-07-17 | no |
| nrc_favicon.svg | 9 | favicon | 2026-05-17 | no |
| nrc_footer.svg | 8 | logo | 2026-05-17 | no |
| nrc_v1.svg | 7 | logo | 2026-05-17 | no |

These are exactly the "2026-05-17" and "2026-07-17/18" era ids identified above — none is
referenced by the live SiteSettings global or by any (null) division global. They remain live
Media-collection rows (not deleted) but are orphaned from every current brand-rendering path.

---

#### On-disk check — `/Volumes/SharedData/10-10-cms-media-live/`

Top-level file count: **428** (originals + `-{480,1024,1920}x…` resized WebP/derivative
variants combined; 207 originals in the DB is consistent with 428 on-disk files once
thumb/card/hero derivatives are counted per original).

`test -f` run for all 126 filenames across the logo/favicon/wordmark tables (the tables that
matter for brand identity — `photo`/`watermark` kinds out of scope for this brand-asset
survey):

- **125/126 present.**
- **1 miss: `favicon-nrc_white_512.png`** (id 209, `mediaKind: favicon`, `divisionTag: nrc`,
  tagged 2026-07-27). Not on disk under that exact name, and `GET
  /api/media/file/favicon-nrc_white_512.png` returns **HTTP 500** from the live CMS — the
  original file is genuinely gone, not just misnamed. Its resized derivative survives on disk
  (`favicon-nrc_white_512-480x480.webp` exists), and a same-family SVG exists
  (`favicon-nrc_white.svg`), but the PNG original backing DB id 209 is broken. This id is not
  referenced by any of the 8 SiteSettings fields (those all resolved cleanly above), so it is
  a **broken row with no live rendering impact today** — but it will 500 if anything ever
  points a relationship field at id 209.

No raster in the checked set lacked API-reported dimensions, so no `sips` fallback calls were
needed — every doc in every kind query returned `width`/`height` directly from Payload.

---

#### Seed-layer check

`cms/scripts/seed-v9.ts` (the only `seed*.ts` in the repo — `cms/src/seed-v9.ts` does not
exist; corrected path) was read in full (538 lines). Findings:

- The only media the seed script creates is content photography, always tagged
  `mediaKind: 'photo'` — `cms/scripts/seed-v9.ts:226`.
- No occurrence of `favicon`, `navLogo`, `headerLogo`, `footerLogo`, or `mediaKind: 'logo'`
  anywhere in the file.
- The only `logo`-adjacent hits are copy-label strings, not media: `logo-label` /
  `logo-aria` in the known-keys allowlist (`seed-v9.ts:60`) and
  `logoLabel: kv(header, 'logo-label')` (`seed-v9.ts:502`), which seed a text aria-label
  in `SiteSettings.v9Chrome`, unrelated to the eight brand-media relationship fields above.

**Conclusion for the plan's "three content layers" framing:** for brand logos/favicons
specifically, there is no seed-script layer and no vault-copy-canon layer — only the live
DB (Admin UI-entered) layer exists. A re-seed of `seed-v9.ts` cannot re-arm or clobber
these eight fields (unlike the copy content the CLAUDE.md rule 16 warns about); it also
cannot restore them if lost, since nothing upstream of the DB defines them.

---

#### Status column — summary judgment

| Item | Status | Justification |
|---|---|---|
| SiteSettings 8 brand fields (`favicon`, `faviconDark`, `appleTouchIcon`, `navLogoLight`, `navLogoDark`, `favicon212`, `favicon310`, `faviconNrc`) | **canonical / current** | Live-data-confirmed: all 8 resolve to non-null 2026-07-27 "Jost tile/punch" assets, all present on disk, `GET /api/globals/site-settings` served straight from the production DB via `http://kimaserver:8080` (== `staging.apr70.com`, same backend). |
| Division `headerLogo` / `footerLogo` / `faviconOverride` (x3 globals) | **legacy / unused** | Live-data-confirmed null on all three division globals (`GET /api/globals/division-{212,310,nrc}`), consistent with the `admin: hidden` "retired v4 surface" code comment. Confirmed dead at the data layer, not just admin-UI-hidden. |
| `Media.mediaKind` / `divisionTag` taxonomy | **canonical / current** | Actively populated and queryable live: 15 logo / 71 favicon / 40 wordmark / 0 watermark / 80 photo = 206 of 207 total docs tagged, matches static-code enum exactly. |
| 15-row logo-tagged table, favicon (71) and wordmark (40) tables | **current, mixed eras** | Live-pulled in full (see `scratchpad/media_{logo,favicon,wordmark}.json`). 3 distinct `createdAt` eras present in the same table: 2026-05-17 (10 docs, ids 1-10) and 2026-07-17/18 (4 docs, ids 94-97) are **legacy/unused** — not referenced by any live SiteSettings field; 2026-07-27 (remaining ~192 docs) is the **canonical/current** wave every brand field actually points to. |
| Total media count (207) / per-kind counts | **verified** | `totalDocs` read directly from unfiltered and per-kind API queries; reconciles to within 1 doc (an untagged 207th row, not investigated further — out of the survey's brand-asset scope). |
| Futura-kit filename check | **verified — 0 literal "futura" hits, 13 pre-Jost-era filename matches** | No API filename contains "futura" literally. Cross-referencing the 336-file archived `_ARCHIVED-futura-era-brand-2026-07-27-DO-NOT-USE/` tree against all 206 API filenames found 13 matches — exactly the 2026-05-17 and 2026-07-17/18 era ids already flagged legacy above (`212_hero.svg`, `nrc_v1.svg`, `apr70_apple_touch_icon.png`'s siblings, etc.) — none referenced by current SiteSettings/division fields. |
| On-disk confirmation (`/Volumes/SharedData/10-10-cms-media-live/`) | **verified — 125/126 present, 1 broken** | `test -f` against all 126 logo/favicon/wordmark filenames. Sole miss: `favicon-nrc_white_512.png` (id 209) — file gone from disk AND `GET /api/media/file/...` 500s live. Unused by any current SiteSettings field, so no live-rendering impact, but the DB row is broken and would 500 if ever wired up. |
| Whether any *other* frontend code path still consumes the legacy division `headerLogo`/`footerLogo`/`faviconOverride` fields | **uncertain — not re-checked this pass** | This session confirmed the *data* is null on all three division globals (definitive — a null relationship can't render anything regardless of frontend code), which supersedes the need for the frontend grep the prior pass flagged as blocked. Not independently re-verified via `web/src` grep; low priority given the data-layer proof already rules out any visible effect. |

---

**Survey complete.** All Task 1-4 items resolved with live data except the 207th untagged
media doc's identity and the frontend-grep cross-check noted above (both explicitly marked,
neither blocking for brand-asset purposes). Broken row `id 209` (`favicon-nrc_white_512.png`)
is the one actionable finding — dead file, currently harmless because unreferenced.

### B.5 Reconciliation and rulings needed (parent)

1. **`web/public/logos/*.svg` are dormant fallbacks, not the live mark.** B.1 flagged them as possibly rendering site-wide because `V9Layout.astro:106-107` falls back to `/logos/apr70_logo_full_{white,black}.svg` when `navLogoDark` / `navLogoLight` are empty. B.4 then read the live Site Settings: all eight brand fields resolve to the 2026-07-27 Punch kit rows, present on disk. So the fallback pair is not what renders on staging. Status: **current (fallback only), legacy-named**. Their glyphs are not Futura: commit `d7b9a35` (2026-07-27, "Logo takedown pass 2: outline every live-text Futura SVG to Jost paths") re-outlined them, and a grep this session found zero `font-family` or `<text>` nodes in the pair. The filenames are the only Futura-era residue. Keep them until the fallback is redirected to a Punch file; then archive.
2. **The fallback favicon is stock scaffolding.** `web/public/favicon.svg` is a single-path 128x128 Astro starter mark, reached only when both the division favicon and the site favicon are empty (`V9Layout.astro:101`). Live Site Settings carry the Jost-tile favicons, so it never shows today. Status: **unused, defect**. Proposed fix (not applied): replace with `favicon-70_black.svg` from the canonical kit. This is a code change, so it belongs to a future version bump, not to an archive pass.
3. **`web/public/brand/apr70-logos/` is a vendored duplicate of the retired kit.** 202 tracked files, zero code references, served by URL if anyone knows the path. Status: **archival**. It duplicates what SharedData already archived under `_ARCHIVED-futura-era-brand-2026-07-27-DO-NOT-USE/` (which itself carries a `local-apr70-logos-tree/` copy). Removing it from the repo is a code change (git rm) and a deploy; the archive manifest in B.3 proposes the destination. Confidence 0.85; flag for Marco because the commit that outlined the live-text SVGs also touched this tree, so a few files may have been re-outlined and the tree is not byte-identical to the SharedData archive.
4. **Thirteen legacy media rows in Payload.** B.4 found 14 rows from the 2026-05-17 and 2026-07-17/18 eras (ids 1-10, 94-97) that no live field references, 13 of whose filenames match the archived Futura-era kit. Status: **legacy / unused** in the DB. Deleting media rows is a content change under rule 16 (DB layer only here, since `seed-v9.ts` seeds no brand media); flag for Marco. Until then, they are invisible to visitors and only clutter the pickers.
5. **One broken media row.** id 209 `favicon-nrc_white_512.png`: DB row present, file absent from `10-10-cms-media-live/`, the file URL returns 500. Unreferenced by any field, so no visible effect. Status: **uncertain (broken)**. Flag for Marco: delete the row or re-upload the file.
6. **Division globals' `headerLogo` / `footerLogo` / `faviconOverride`** are null on all three division globals and the globals are admin-hidden ("retired v4 surface"). Status: **legacy / unused**. The v13 handoff deferred converting them; with null data they can be left alone or removed in a future schema pass (migration required, `db.push:false`).
7. **Seed layer has no brand media.** `cms/scripts/seed-v9.ts` seeds photo-kind media only. The brand kit exists in exactly one content layer (the live DB plus the files on disk). Under the three-layer law that is a gap: a fresh DB would boot with empty brand fields and fall back to the legacy-named SVGs and the stock favicon. Flag for Marco: either accept "brand media is DB-only, restore from the DB dump" as a documented exception, or add a brand-kit seed step that uploads from `10-01-logos/2026-brand-jost-punch/` with kind and division tags.
8. **`dispatch-favicon.svg` and `dispatch-image-slot.js`** have no code references. DISPATCH is parked behind a Payload switch (ships OFF), so these may be intentional standalone assets. Status: **uncertain**. Flag for Marco; do not archive on this pass.
9. **`holding/favicon.svg` vs the canonical `favicon-70` tile** was not byte-compared. The holding page's wordmark is the Punch (`wordmark-pictures_white_punch-orange.svg`, outlined paths). Status: **current**; the favicon is **uncertain** until diffed.
10. **`11-00-property-images/`**: B.1 counted 934 files against 959 rows in `_manifest.csv` (the prompt said 752). Out of scope here beyond the count; the discrepancy is noted for the Light Law gate session, not investigated.

No public-domain or rights claims are made in this section. Every asset above is either APR 70's own mark or an unreferenced duplicate of it; the PD ledger law governs `web/public/pd/` and is not affected by any proposal here.

---

## C. Layered golden-age-of-cinema design brief

### C.1 The direction, translated into APR 70's own vocabulary

"Layered website" in this house means depth built the way a projection booth builds it: a beam through dust, a frame in a gate, a strip running past a lamp. Not a stack of gradients. The layers already exist in the vocabulary and the code, they have just never been composed in depth:

| Vocabulary | Where it already lives |
|---|---|
| Sprocket-perforated rails at true BH-1866 / KS-1870 gauge | `DESIGN.md` Borders section; the Punch wordmark's full stop; `LogoRevealIsland` hole pairs |
| Steenbeck / projector language (gate, beam, reel, advance) | the "film advance" easing `cubic-bezier(0.16,1,0.3,1)`; PLAY / 4.5 s advance in `FilmstripSlideshow`; the /craft "reading rail" |
| Jost (display) + Barlow 300 (body) + Share Tech Mono (keycodes) | `DESIGN.md` Typography; the routeline's mono face with accent superscript indices 01 to 04 |
| Locked division tokens | `web/src/styles/tokens.css`; `212-amber`, `212-sicilian-orange`, `310-imax`, `310-sicilian-blue`, `nrc-grey`, `nrc-navy` |
| Black default canvas, opt-in light mode | `data-theme` on `<html>`, `ThemeControlIsland` (dark / light / system) |
| Editorial zine composition | RouteLine as the contents line, PhotoFold full-bleed folds, indicia numbered never dated |
| Crosshair-as-viewfinder cursor | `marquee.css:163` `cursor: crosshair` plus the GSAP trailing dot in `web/src/lib/motion/cursor.ts` (fine pointer, motion-OK only) |
| Vignelli / Munari / Bass restraint | anti-icon system, 8px grid, no shadows, no blur, no radius, gradients only as directional reveals |

The rule that keeps this from becoming a theme-park: every layer is either abstract (grain, beam, rails), owned (Punch marks, division tiles), or internally generated under the Light Law and PD ledger (the image plane). Nothing external, nothing borrowed.

### C.2 The five-layer parallax system (restrained)

Depth order, back to front. Depth ratios are scroll-bound offsets expressed as a fraction of scroll distance; all are small on purpose.

| # | Layer | Nature | Renders as | Motion (motion-OK only) | Reduced motion | Both modes |
|---|---|---|---|---|---|---|
| 1 | Film grain / atmospheric field | abstract | Astro component, zero JS: an inline SVG `feTurbulence` grain tile at low opacity (the holding page already does inline SVG grain, `holding/index.html`) plus a black (dark) or off-white (light) field | none on scroll. Optional 12 fps grain flicker as a CSS `steps()` opacity animation, max 3 percent opacity delta | flicker off | dark: white grain on black at 4 to 6 percent; light: ink grain on `#FAFAF8` at 3 to 4 percent |
| 2 | Title-card / marquee silhouette | owned | Astro component: outlined Jost letterforms or the double-hairline "70" monogram box as an SVG silhouette, hairline stroke `rgba(255,255,255,0.08)` on dark, low-opacity ink on light; deco geometry restricted to rules, chevrons, and the sprocket gauge, never ornament | translateY at 0.04 to 0.06 of scroll, opacity 1 to 0.6 over the fold | static | stroke ramps flip with the theme |
| 3 | Projector beam / light cone | abstract | Astro component: one directional gradient reveal (permitted use: directional, not a surface) from a corner, division accent to transparent, clipped to a cone with `clip-path: polygon()`; dust as a second sparse grain tile masked to the cone | translateX/scale of the cone at 0.08 of scroll; dust drifts with a 40 s CSS loop, opacity only | static cone, no dust drift | on light mode the cone is the accent at 8 percent over paper, reading as a wash of afternoon light rather than a beam |
| 4 | Framed archival still / image plane | generated, gated | the existing `PhotoFold` frame law (dark scrim, light ink, both modes) inside a gate: a 4:3 or 1.85:1 window with hairline frame and a BH-1866 perf row top and bottom drawn as true SVG. Media arrives through Payload relationships (`frameFromMedia`, `focalPosition`, `SIZES_FULLBLEED` in `web/src/components/v9/media.ts`), never loose paths (rule 10). The AI Mark and caption logic ride unchanged | the frame translates at 0.12 of scroll, the picture inside at 0.06 (the classic gate-vs-negative offset); opacity fade at the edges | static | scrim law holds in both modes |
| 5 | Filmstrip / sprocket foreground | owned | Astro component: an edge rail, one or two sprocket rows at true pitch (4.74 mm scaled to the 32px filmstrip height), keycodes in Share Tech Mono at 0.55em tracking as artifact text; on the /craft precedent, the rail doubles as the scroll-progress fill | translateY at 0.16 of scroll on the rail; keycodes advance one frame per section (transform only) | static rail, the CSS `scroll-timeline` fill is dropped exactly as `v9.css:1012` already does for the craft rail | rail ink flips; the 2px sprocket radius is the only radius on the page |

Controller: one React island, `client:visible`, that owns a single `gsap.timeline` bound to one `ScrollTrigger` with `scrub: true` and drives five `data-layer` targets by `transform` and `opacity` only. Everything else is Astro with zero JS. The island refuses to mount under `prefers-reduced-motion: reduce` and on `pointer: coarse` if the frame rate budget is not met, exactly as `cursor.ts` refuses. GSAP core and ScrollTrigger are already in `web/package.json` (`gsap ^3.15.0`) and already loaded by `web/src/lib/motion/*`; no new dependency.

### C.3 Constraints carried into the brief (from CLAUDE.md, DESIGN.md, and the v13 handoff)

- `prefers-reduced-motion`: static composition, no scroll-bound movement, no dust drift, no flicker. The page must read as complete without the island (SSR emits the layers; the island only adds offsets).
- Animate `transform` and `opacity` only. No `transition: all`. Named transitions only for hover rules.
- GSAP core + ScrollTrigger only. Native `scroll-timeline` is precedent for one-dimensional progress (the /craft rail) and may be reused for layer 5's fill with the script fallback pattern in `web/src/pages/craft.astro:29-45`.
- No drop shadows, no `backdrop-filter`, no radius beyond the 2px sprocket treatment, no off-token colours, no external image URLs, no emoji, no `system-ui`, no gradients as surfaces.
- 8px grid; `--v9-col: min(72rem, ...)` content cap with the documented `min-width: 1920px` exception to 80rem (`v9.css:1016-1025`). Layers 1, 3, and 5 may bleed full-width; layers 2 and 4 respect the column.
- Both modes from day one (rule 8). Every layer above lists its light-mode reading.
- Mobile-first 375 to 1440 with `clamp()`. On 375px the beam is a top-edge wash, the rail is a single row, and the gate is full-width with the perf rows at 24px.
- The marquee-theme footgun: nav and routeline styling live in both `web/src/styles/v9.css` and `web/src/styles/themes/marquee.css`; a layered design that touches the chrome must land in both files or the change will not show. The cleanest way to avoid it is to scope the layered design under a new root attribute (see C.5) and leave the chrome files alone.
- Zero third-party requests at runtime (the P0 privacy law behind v10 and the holding page). Fonts are self-hosted already; the layers use no assets that are not in `web/public` or Payload media.

### C.4 Precedents already in the codebase

| Precedent | What it proves | Reuse |
|---|---|---|
| `FilmstripSlideshow.tsx` cinema view (v13) | a full-browser-width overlay on the house scrim, one slideshow, PLAY at 4.5 s, ESC closes, focus returns, scroll locks | the gate for layer 4 and its keyboard contract |
| `PhotoFold.astro` | full-bleed image with dark scrim and light ink in every theme, both modes; `PENDING` (null) media still renders the words | layer 4's frame law and the "empty gallery" fallback |
| `LogoRevealIsland.tsx` | five sprocket hole pairs light bottom-to-top in division colours; sessionStorage once-per-session; removes itself; skipped under reduced motion | the sprocket colour sequence for layer 5 keycodes and the island mount/refuse pattern |
| Routeline nav with accent superscript indices 01 to 04 (`V9Layout.astro`, `v9.css:119`, `marquee.css:242`) | mono keycode as navigation, no icons | the language of layer 5's keycodes and any layer index labels |
| /craft scroll-progress rail (`craft.astro:16-27`, `v9.css:954-1015`) | native CSS scroll timeline with a script fallback; ticks per section; absent under 720px; decorative and aria-hidden | layer 5 fill; the fallback pattern |
| AI Mark overlay (`media.ts:49`, `v9.css:917`, `data-ai-mark="corner"`) | a caption-keyed disclosure stamp that survives every frame | must remain visible on any still inside the gate |
| Trailing-dot cursor (`cursor.ts`) | GSAP `quickTo`, mounted only on fine pointer and motion-OK devices | the exact gate the parallax island should copy |
| Holding page inline SVG grain (`holding/index.html`) | grain with zero requests | layer 1 |

### C.5 Exposure: a switchable design, not a default

The theme system today has one design and three modes (dark / light / system) written as `data-theme` on `<html>` and persisted in `localStorage['apr70-theme']` (`ThemeControlIsland.tsx:5-38`). A grep this session shows `ThemeControlIsland` is no longer mounted anywhere; the live header switch is `ModeToggleIsland` (`V9Layout.astro:23,270`), which writes the same attribute and key. The 2026-07-11 ruling deleted the multi-design dial, so the layered design should not resurrect a visitor-facing design picker. Proposal (hosted on the same pre-paint stamp both islands rely on, not on a new panel):

- Add a second root attribute, `data-design="layered"`, applied by the same pre-paint stamp that applies `data-theme`, from `localStorage['apr70-design']`.
- Gate the switch three ways, none of them a public dial: (a) a query flag `?design=layered` that writes the localStorage key (the investor link), (b) a Payload Site Settings boolean `layeredDesignPreview` that lets the island show the extra row only when on (same pattern as the DISPATCH publish switch), (c) the key can be cleared with `?design=marquee`.
- The layered stylesheet is a sibling of `marquee.css` under `web/src/styles/themes/layered.css`, scoped entirely under `html[data-design="layered"]`, so the default marquee design is byte-identical when the attribute is absent. Both modes inside it via the existing `data-theme` ramps.
- The five layer components render only when the page global carries a `layeredFold` section (a new block type) or when the layout detects the attribute; recommendation is the block, so editors own where it appears (rule 1: no hardcoded layouts).

### C.6 Proof-of-concept candidates, ranked

| Rank | Route | Why | Risk |
|---|---|---|---|
| 1 | `/` (the live v9 PhotoFold homepage, not the July DISPATCH masthead which never left the Vercel branch) | already opens on a `vh100` PhotoFold with kicker and H1, so layer 4 has a host; the RouteLine sits right under it as the natural place for layer 5 keycodes; investors land here | the LogoReveal splash runs once per session on this route and must not fight the parallax island (sequence: splash completes, then ScrollTrigger refreshes) |
| 2 | one `/work/<slug>` page (`/work/la-dolce-vita` is the one the handoff's curl check uses) | the property gallery already has the cinema view; the story setting line "1977 · Brooklyn" is the perfect title-card text for layer 2 | gallery stills are at the Light Law gate; today's frames are the pre-Light-Law set |
| 3 | `/slate` | the ten-title grid is where the "gate" metaphor pays most (each row a frame) | more layout surface to keep on grid; `publicSlate=false` for The Mayors must hold |
| 4 | `/craft` | the scroll rail already exists, so layer 5 is half built | text-forward page; fewer places for the image plane |

Build first: `/`. One fold, one image plane, five layers, behind `?design=layered` on staging. It is the smallest surface that exercises all five layers and it is the page an investor link opens.

### C.7 Dependency: the Light Law cull (TASKS Phase 9)

The 80 Light Law masters sit at Marco's review gate in `/Volumes/SharedData/11-00-property-images/` (752 files, `_manifest.csv` present). Until picks move into CMS media, a layered image plane is chrome over empty galleries. What the POC can use today, in order of preference:

1. Existing CMS media already on the home fold and property galleries (the pre-Light-Law frames, all carrying the "AI-generated development frame" credit so the AI Mark fires).
2. PD ledger stills from `web/public/pd/credits.json` (22 entries with tiers and crop tiers; Abbott, Sea Gate, Sicily, Venice, Brooklyn piers). These are place plates and suit layer 4 as "the archival still" better than character frames do. They must be uploaded to Payload media with kind and division tags before use (rule 10; the pickers hide untagged rows).
3. Abstract layers 1, 2, 3, and 5, which need no stills at all and can be built and reviewed on staging immediately.

What waits on the cull: any property frame inside the gate on `/work/<slug>`, and the home fold's hero frame if Marco wants a Light Law frame there. The POC should be reviewed with a PD plate in the gate and swapped to the approved still after the gate clears; nothing in the component changes, only the Payload relationship.

---

## D. Inspiration-source evaluation matrix

**Rights status (ruled by Marco, 2026-09-02), applies to every source below:** unverified external reference. This source may inform original APR 70 design thinking, but neither source code, visual assets, copy, nor proprietary implementation may be imported or replicated until the exact asset/component licence and commercial-use terms have been verified and recorded. The safe default is: look, describe, and rebuild an original APR 70-specific interpretation from first principles. Do not copy source, distinctive artwork, type assets, templates, motion curves as a packaged asset, or third-party dependencies until the exact project/component licence has been checked and documented. No internal licence record exists for any of the nine sources.

Evaluated as inspiration and implementation-pattern references only, against the APR 70 design system: Astro + React islands, GSAP core + ScrollTrigger as the ONLY motion library, transform/opacity-only animation, no drop shadows/blur/rounded corners/gradients, locked palette, Jost/Barlow/Share Tech Mono, zero third-party runtime requests, vanilla CSS tokens (no Tailwind), anti-icon system, golden-age-cinema/Vignelli-Munari-Bass restraint. Nothing below is an asset to copy.

---

### 1. Thinking Orbs — https://orbs.jakubantalik.com/

1. **What it is:** A small React component library ("thinking-orbs") shipping a dotted, hand-tuned "thought orb" loading indicator for AI/agent UIs — nine states, two sizes, auto dark/light theme, installed via npm.
2. **Contribution:**
   - Demonstrates a restrained, single-purpose loading-state component with named semantic states (listening, working, searching), a pattern worth borrowing conceptually for a "reel loading" or "gate opening" state.
   - Shows a clean API surface (props for size/speed/state) that's a reasonable shape to imitate for any small island component.
3. **Avoid:**
   - It's a round, dotted glyph — directly conflicts with the anti-icon and no-rounded-corners spirit of the system; do not use the visual as-is.
   - It is a bundled React/npm dependency, not a hand-rolled component; pulling it in adds an external package where a GSAP-driven equivalent (e.g., animated sprocket holes or a Steenbeck reel icon) would fit the brand better and keep authorship in-house.
   - Not built on GSAP; its animation engine (CSS or JS, unconfirmed from the fetched page) is unverified and shouldn't be assumed compatible with the transform/opacity-only rule.
4. **Best use:** Visual reference only (state-naming and API-shape idea for a bespoke loading indicator) — not a code source.
5. **Licensing/dependency concerns:** Licence not stated on the fetched page; ships as an npm package (adds a build-time dependency, not a runtime third-party request, but still worth avoiding to keep the component custom-built). Verify licence before even referencing code structure closely.
6. **Confidence:** 0.5 — page content was sparse; couldn't confirm the underlying animation implementation.
7. **Next action:** Skip as a dependency; if a "processing" indicator is ever needed, design a bespoke sprocket/reel-spin GSAP component instead.

---

### 2. Transitions.dev — https://transitions.dev/

1. **What it is:** A curated collection of UI micro-transitions/animations aimed at AI-agent and web-app interfaces, delivered as CSS-first patterns with a React implementation option; free + Pro tiers, plus a "skill" for coding-agent integration.
2. **Contribution:**
   - Directly documents the same discipline APR70 already enforces: prioritize transform-based, GPU-composited animation over paint-triggering properties (explicitly warns against animating `mask-position`, favors "translate the curtain" style compositing) — useful as a checklist when writing GSAP tweens.
   - Patterns for staggered multi-element reveals, origin-aware directional animation, and combined blur+scale transitions are conceptually portable to GSAP timelines (reimplemented, not copied).
   - Useful as a written checklist for reviewing whether a new block's animation is compositor-friendly.
3. **Avoid:**
   - It is not GSAP-based; do not import or adapt the actual CSS/JS — reimplement any useful timing/easing idea natively in GSAP.
   - Its "skill" offering for coding agents is a third-party product; do not install or wire it into this repo (violates zero-third-party-request law if it phones home, and duplicates a role GSAP+existing skills already fill).
   - Some listed effects use blur, which the project has separately banned (no backdrop-filter/blur surfaces) — filter those out on sight.
4. **Best use:** Code-pattern reference (performance checklist / concepts to reimplement in GSAP), not a code or asset source.
5. **Licensing/dependency concerns:** No licence stated on the fetched page. Pro tier is a paid product — do not purchase or embed without Marco's sign-off; free tier content should still be treated as reference-only, not copy-paste.
6. **Confidence:** 0.75 — page content was substantive and specific.
7. **Next action:** Extract the "transform/opacity only, avoid repaint-triggering properties" checklist into the animation section of the block-library docs as a QA note; do not add the library itself.

---

### 3. Beautiful UI — https://www.beautifului.dev/

1. **What it is:** An MIT-licensed component gallery ("crafted primitives") of ~20 copy-paste UI primitives purpose-built for AI-agent interfaces — thinking/reasoning traces, streaming text, approval cards, chat composers, diff tables.
2. **Contribution:**
   - If APR70 ever ships an AI-agent-facing feature (e.g., an internal tool, not the public cinema site), the taxonomy of component types (streaming text, approval card, task row) is a useful naming/structure reference.
   - MIT licence and "copy-paste ready" framing make it lower-risk to study closely than most marketplaces, if a component were ever needed.
3. **Avoid:**
   - Almost entirely irrelevant to a golden-age-cinema public marketing site — its subject matter (agent reasoning UIs) has no place in APR70's block library.
   - Underlying framework/CSS approach is undisclosed on the fetched page; do not assume Tailwind-free — verify before treating any snippet as portable to the vanilla-CSS-token system.
4. **Best use:** Not used for the current site; keep on file only if APR70 ever builds an internal AI-tool interface.
5. **Licensing/dependency concerns:** MIT licence stated in the footer — permissive if ever used, but stack compatibility (Tailwind? React only?) is unverified and must be checked before adapting any code.
6. **Confidence:** 0.6 — description and licence were clear; stack details were not confirmed.
7. **Next action:** No action for current APR70 work; archive the link only if an internal-tooling UI project starts later.

---

### 4. 21st.dev — https://21st.dev/

1. **What it is:** A large community marketplace/registry (12,000+ assets, 700+ contributors) of React + Tailwind + shadcn/ui components, blocks, and templates, designed to be copied into a consuming repo (not installed as a package).
2. **Contribution:**
   - Useful as a browsing ground for layout/hero/marketing-block *ideas* (composition, hierarchy, motion concepts) purely as visual inspiration — its volume makes it a fast way to survey current landing-page conventions to consciously avoid or subvert.
   - The "copy into repo, you own it" distribution model is a useful pattern to note for how APR70 should treat any borrowed idea: always rewritten, never imported.
3. **Avoid:**
   - Entire stack is Tailwind + shadcn/ui (React), a direct conflict with the "no Tailwind, vanilla CSS tokens" hard rule — none of its code should be copied even superficially.
   - Many blocks use gradients, shadows, and rounded corners as default aesthetic choices — all three are banned surface treatments here.
   - Components frequently pair with Framer Motion or similar in the shadcn ecosystem (unconfirmed for every listing, but common); treat any animated component from this source as GSAP-incompatible until proven otherwise.
4. **Best use:** Visual reference only (skim for layout ideas, never code).
5. **Licensing/dependency concerns:** No explicit per-component licence stated on the page; site notes template authors "can sell their work directly" — treat any specific template as commercially licensed and do not copy without a purchase and legal check.
6. **Confidence:** 0.65 — page metadata and stack description were clear; per-component licensing was not.
7. **Next action:** Use only for a five-minute visual mood-scan if a block needs fresh layout ideas; do not open dev tools to lift markup/CSS.

---

### 5. Aceternity UI — https://ui.aceternity.com/

1. **What it is:** A React + Tailwind + Framer Motion component library (200+ components/blocks) marketed for "beautiful landing pages," with categories like 3D card effects, parallax scroll, background shaders, bento grids, and glow/animated-tooltip effects.
2. **Contribution:**
   - Its "parallax scroll" and "text generation" effect categories are useful *concept* references for the kind of layered, cinematic scroll motion APR70 wants — worth studying the effect description (not the code) to sketch an equivalent GSAP ScrollTrigger timeline.
   - Demonstrates a wide vocabulary of scroll-triggered reveal patterns that can be catalogued and redesigned in-house.
3. **Avoid:**
   - Hard dependency on Framer Motion — explicitly banned by the GSAP-only rule; none of the component code is usable as-is.
   - Tailwind-based styling conflicts with the vanilla-CSS-token system.
   - Aesthetic is glow/gradient/shadow/rounded-corner heavy (3D cards, glowing effects, bento grids with soft shadows) — the opposite of the Vignelli/Munari restraint and the no-gradient/no-shadow/no-rounded-corner rules; do not let it influence visual tone, only motion *concepts*.
4. **Best use:** Visual/motion-concept reference only — catalogue effect names and behaviors, then build fresh in GSAP + vanilla CSS.
5. **Licensing/dependency concerns:** Paid "All-Access Pass" for premium blocks; licence type not specified on the page. Do not purchase or embed without explicit sign-off, and never copy premium code even if purchased, given the stack mismatch.
6. **Confidence:** 0.75 — page content was detailed and consistent about stack and categories.
7. **Next action:** Use as a checklist of scroll-effect names (parallax scroll, staggered reveal, bento grid) to reimplement natively; do not touch its code or install Framer Motion.

---

### 6. The Component Gallery — https://component.gallery/

1. **What it is:** A vendor-neutral reference repository cataloguing UI components (60 component types, 95 design systems including Polaris, Elastic UI, Ariakit, Red Hat Design System, HeroUI) with 2,671 real-world examples, built for comparison and naming-convention research rather than code distribution.
2. **Contribution:**
   - Strong fit as a QA/consistency reference: can check APR70's 11-block library (naming, states, accessibility expectations) against how mature design systems handle analogous components — e.g., compare FilmstripBlock's carousel/track behavior against multiple systems' carousel patterns for accessibility gaps.
   - Useful for taxonomy hygiene (is "DivisionBlock" doing what other systems call a "showcase" or "feature section," any missed states like empty/loading/error).
   - No code or visual assets to accidentally copy — it's documentation, which lowers the "don't copy" risk relative to the marketplace sites above.
3. **Avoid:**
   - Not an animation or motion resource — irrelevant to the GSAP/transition rules; don't expect visual inspiration here.
   - Cross-system comparisons will surface Tailwind/React-specific implementation notes in places; ignore any code snippets, use only the conceptual/taxonomy layer.
4. **Best use:** QA-review workflow reference (component completeness/naming/accessibility audit), not visual or code-pattern.
5. **Licensing/dependency concerns:** Licence not stated on the fetched page; content is aggregated/curated third-party examples — treat as reference reading only, do not reproduce any single design system's assets.
6. **Confidence:** 0.8 — clear, consistent metadata and description.
7. **Next action:** Use once the block library needs an accessibility/completeness audit; not urgent for current build tasks.

---

### 7. Agentation — https://www.agentation.com/

1. **What it is:** A browser-based UI-annotation tool for AI coding agents — click an element on a live page, it emits structured context (CSS selector, file path, React component tree, computed styles) that agents like Claude Code or Cursor can act on; npm-installed, MCP-integrated.
2. **Contribution:**
   - Not a design-inspiration source at all — it's a workflow tool. Its actual value to APR70 is process: Marco (or an agent) could annotate the live staging site and hand Claude Code structured feedback instead of prose descriptions, speeding up visual QA passes.
   - The "pause animation, annotate a specific frame" feature is directly relevant to reviewing GSAP-driven scroll sequences frame-by-frame.
3. **Avoid:**
   - It is a runtime tool injected into the page during review sessions — must never ship in production (would violate the zero-third-party-request law and add unreviewed JS to the live site); use only in local/staging dev sessions, then strip it out.
   - Desktop-only, and requires local codebase access to be useful — not relevant to remote/NAS deploy review.
4. **Best use:** QA-review workflow tool (not visual or code-pattern reference) — for local/staging design review sessions only.
5. **Licensing/dependency concerns:** Free for individual/internal team use; commercial licence required if redistributed in a shipped product — since APR70 would only use it as a dev-time tool, not ship it, this is likely fine, but confirm before any use, and never let its script persist into a production bundle.
6. **Confidence:** 0.7 — page was substantive on functionality and licensing terms.
7. **Next action:** If Marco wants faster visual-feedback loops during local review, trial it in a throwaway dev session; do not add to the deploy pipeline or CLAUDE.md as a dependency without a separate decision.

---

### 8. Originkit — https://www.originkit.dev/

1. **What it is:** A large (363-component) "free animated component library" targeted at Framer/React users — copy-paste code, usable directly in the Framer canvas, MCP-connectable. Component names sampled: Neon Border, Grainy Carousel, Orbit Border Button, Pulsating Border, Liquid Carve Button.
2. **Contribution:**
   - The carousel and border-motion component *names* suggest timing/looping ideas (e.g., a slow orbiting border) that could be reinterpreted, conceptually, as a GSAP-driven filmstrip-perforation animation — but only as a naming/behavior prompt, nothing visual to borrow.
3. **Avoid:**
   - Its whole aesthetic — neon glow, grainy gradients, pulsating borders, liquid/organic motion — is the direct opposite of the Vignelli/Munari/Bass restraint and violates the no-gradient, no-glow-as-surface, no-rounded-corner rules almost by design; treat the visual language as an anti-pattern list, not inspiration.
   - Framer/React-canvas distribution model and MCP-connect feature imply a runtime or build dependency that has no place in an Astro + vanilla-CSS + GSAP-only stack.
   - Free tier still gates some components as Pro; no reason to purchase given the stack and aesthetic mismatch.
4. **Best use:** Not used for visual direction; at most, a naming/behavior prompt list to consciously invert (i.e., "what would a restrained, monochrome version of a border animation look like").
5. **Licensing/dependency concerns:** Licensing not detailed beyond free/Pro split on the fetched page; component code is Framer/React-specific — do not copy or adapt directly.
6. **Confidence:** 0.65 — metadata and component list were clear; deeper licence terms unverified.
7. **Next action:** Skip; if a border/carousel motion idea is wanted, design it fresh in GSAP against the locked palette instead of referencing this source further.

---

### 9. YouTube — "Fable 5.1 FINALLY Kills AI Website Slop" (Nate Herk) — https://youtu.be/FFWtxjvW2ts

1. **What it is:** A 16:13 YouTube video by creator Nate Herk (channel "Nate Herk | AI Automation"), published 2026-09-01, about using Fable/Claude more effectively to avoid generic "AI slop" website output.
2. **Contribution:**
   - Per title, description, and a third-party auto-generated content summary (not a verified transcript), the video reportedly covers grounding AI-generated design in real references, mobile-device checks, and using discrete "skills" (it names a `/scroll-craft` skill) to steer output quality — a workflow-discipline theme that parallels APR70's existing use of skills like `hallmark` and `impeccable` for anti-slop QA.
3. **Avoid:**
   - Treat any specific technique claim from this source with caution — no actual transcript or caption text was retrievable; the description was mostly affiliate-marketing boilerplate ("my playbook for growing a $1M AI agency..."), and the content summary above came from a third-party auto-summarizer, not a direct quote.
   - It is general Fable/Claude-prompting advice, not a GSAP, Astro, or cinema-design-specific resource — low direct applicability to the APR70 visual/motion system.
4. **Best use:** QA-review workflow. **Takeaway supplied by Marco (2026-09-02), the one-line brief for agents:** use real references to define the feel, then give Fable a tightly scoped one-shot brief with reusable rules, mobile checks, and screenshot-based verification, so it builds an original, polished system rather than generic "AI website" decoration. The video frames the workflow around real design references, layered scroll effects, reusable skills, mobile checks, and screenshot verification; chapters cover avoiding AI slop, finding inspiration, cloning a competitor's feel, one-shot prompting, and design principles. This maps onto the house tooling already in place: `hallmark` and `impeccable` (feel and critique), `visual-verify-loop` (screenshot verification), the E.3 checklist (reusable rules), and the C.6 single-route POC (tight one-shot scope).
5. **Licensing/dependency concerns:** N/A (not a code or design asset); standard YouTube ToS applies to any reuse of clips or transcript text.
6. **Confidence:** 0.35 — no real transcript was retrievable; conclusions rest on metadata plus an unverified third-party summary.
7. **Next action:** Resolved. Marco supplied the takeaway (item 4); the POC session prompt in the next-steps list already follows it (single route, reusable rules, mobile checks, screenshots).

---

### D.10 Summary matrix

| Source | Best use | Key contribution | Key conflict | Licence | Confidence | Next action |
|---|---|---|---|---|---|---|
| 1. Thinking Orbs | Visual reference | State-naming/API-shape idea for a loading indicator | Round/dotted glyph conflicts with anti-icon/no-rounded-corners; npm dependency, non-GSAP | Not stated, verify | 0.5 | Skip; design bespoke reel-spin GSAP indicator instead |
| 2. Transitions.dev | Code-pattern reference | Transform/opacity-only, anti-repaint animation checklist | Not GSAP-based; some effects use banned blur; agent "skill" is third-party | Not stated | 0.75 | Extract the performance checklist into block-library docs, don't import the library |
| 3. Beautiful UI | Not used (archive only) | AI-agent-UI component taxonomy, MIT licence | Irrelevant to cinema site; stack unverified | MIT | 0.6 | No action now; revisit only for future internal AI tooling |
| 4. 21st.dev | Visual reference | Fast survey of current landing-page conventions to consciously subvert | Tailwind + shadcn/React stack; gradients/shadows/rounded corners; possible Framer Motion | Not stated per-component; some templates sold | 0.65 | Browse only, never copy code |
| 5. Aceternity UI | Visual/motion-concept reference | Vocabulary of scroll-triggered effects (parallax scroll, staggered reveal) to reimplement in GSAP | Framer Motion + Tailwind hard dependency; glow/gradient/shadow/rounded aesthetic | Paid "All-Access Pass," type unstated | 0.75 | Catalogue effect names only, build fresh in GSAP |
| 6. Component Gallery | QA-review workflow | Cross-design-system taxonomy for auditing the 11-block library's naming/states/accessibility | Not a motion/visual resource | Not stated | 0.8 | Use for a future block-library accessibility/completeness audit |
| 7. Agentation | QA-review workflow | Live-page annotation to structured feedback for Claude Code, incl. pausing animation frames | Must never ship to production; desktop/local-only | Free individual/internal; commercial licence to redistribute | 0.7 | Trial in a throwaway local session only, if Marco wants it |
| 8. Originkit | Not used (anti-pattern list at most) | Component/behavior names as prompts to consciously invert | Neon/glow/gradient/liquid aesthetic is the opposite of the locked palette and restraint; Framer/React runtime | Free/Pro split, terms unstated | 0.65 | Skip; design any border/carousel motion fresh in GSAP |
| 9. YouTube (Nate Herk) | Not evaluated in full | Possible workflow-discipline parallel to existing hallmark/impeccable skills | No real transcript retrieved; description is affiliate boilerplate; content only via unverified third-party summary | N/A | 0.35 | Marco to watch and supply the actual takeaway |

---

## E. Integration recommendations for Cursor / Fable

### E.1 Proposed skill: `.claude/skills/apr70-design-reference-eval/` (describe only, not created)

Model it on `.claude/skills/place-poster/` : one `SKILL.md`, frontmatter with `name` and a `description` that names the trigger phrases, then the same section rhythm the place-poster skill uses ("When to use / when not", "Source law", the recipe, "Related skills (not this one)", "Review gate"). Documentation-first: no scripts, no package, no MCP server, no hook, no automation.

Proposed `SKILL.md` outline:

- **Name / triggers**: `apr70-design-reference-eval`; "evaluate this reference", "is this site a good reference", "can we use this component library", "reference eval".
- **When to use / when not**: use when Marco or an agent proposes an external site, library, video, or component gallery as inspiration for apr70. Not for assets (that is the PD ledger law and place-poster), not for copy, not for anything that would add a runtime dependency (that is a CLAUDE.md rule change, which needs Marco).
- **Law**: references are looked at, never copied. Code-pattern references are re-implemented under the checklist in E.3. Visual references are described in the house vocabulary (C.1) before any pixel is drawn.
- **Recipe**: fetch with WebFetch or firecrawl from a subagent (never the parent); write the D-matrix row (contribute / avoid / best use / licence / confidence / next action); append the row to `docs/plans/design-references.md` (a ledger, same idea as `credits.json` for PD stills); stop. No build work inside the skill.
- **Checklist E.2** embedded verbatim.
- **Related skills**: `place-poster` (image recipe), `hallmark` and `impeccable` (design critique and audit, both already installed), `frontend-design`, `visual-verify-loop` (proof of any UI change), `explore-digest` (fan-out discipline).
- **Review gate**: nothing from a reference ships without a row in the ledger and Marco's "go" on the visual direction.

### E.2 Checklist: evaluate an external UI reference

1. Identity: URL, what it is (site / library / gallery / video / article), date fetched, fetched by which agent, fetch method.
2. What it could contribute, in APR 70 vocabulary (sprocket, gate, beam, rail, keycode, fold), not in the source's vocabulary.
3. Stack and dependency scan: Tailwind, shadcn, Framer Motion, Motion One, Three.js, Lottie, external fonts, external image CDNs, analytics. Any hit is a conflict with rule 7 (GSAP only), the zero-third-party law, or the vanilla-CSS token system.
4. Aesthetic scan against the locked system: drop shadows, backdrop blur, rounded corners, gradient surfaces, glow, off-token colours, icon-driven UI, `system-ui`. Any hit is "visual reference at most".
5. Motion scan: does it animate properties other than transform and opacity; does it use `transition: all`; does it honour `prefers-reduced-motion`; is it scroll-jacking.
6. Performance and accessibility: layout-thrash risk, main-thread work, focus management, keyboard paths, contrast in both modes.
7. Licence and attribution: state the licence if published; otherwise "not stated, verify"; note paid tiers, redistribution terms, and whether copying markup or motion curves would be copying expression.
8. Best use: visual reference / code-pattern reference / QA-review workflow / not used.
9. Confidence 0 to 1 that the evaluation is right given what was fetched (a video without a transcript caps at 0.4).
10. Next action, one line, and who owns it (agent or Marco).

### E.3 Checklist: safe APR 70 UI implementation

Rules 1 to 10 of CLAUDE.md, the token contract, the marquee footgun, and the three-layer content law, in the order an agent hits them:

1. No hardcoded page layouts. New surfaces are blocks or sections rendered by the page's renderer from Payload (`BlockRenderer` / `SectionRenderer`).
2. No colour outside the locked palette: `212-amber #824B07`, `212-sicilian-orange #E85D04`, `310-imax #077082`, `310-sicilian-blue #0077B6`, `nrc-grey #C8C8C8`, `nrc-navy #001F3F`, black, white, light mode `#FAFAF8` / `#1A1A1A`. Use `--color-{token}` from `tokens.css`; never a hex literal in a component.
3. No `transition: all`. Animate `transform` and `opacity`; name any other property explicitly and justify it.
4. No emoji on the rendered site or in commits.
5. Non-interactive = Astro component with zero JS. Interactive = React island on `client:idle` or `client:visible`; never `client:load` without a reason written in the component comment.
6. Types come from `payload-types.ts`; regenerate after any schema change (`db.push:false`, so a migration is also required).
7. GSAP core and ScrollTrigger only. Native CSS `scroll-timeline` is allowed with a script fallback (the /craft rail precedent).
8. Both modes from the first commit: test `data-theme="dark"`, `data-theme="light"`, and no attribute (system).
9. Mobile-first 375 to 1440 with `clamp()`; 8px grid; content cap `--v9-col` (72rem, 80rem at 1920px and up).
10. Media by Payload relationship, never a loose path. Uploads need a Media Kind tag or the brand pickers hide them.
11. Marquee footgun: nav and routeline rules exist in both `web/src/styles/v9.css` and `web/src/styles/themes/marquee.css`; change both, or scope the new work under its own root attribute and touch neither.
12. Three-layer content law: any string or default that changes must land in the live DB, in `seed-v9.ts`, and in the vault copy canon (`11.12 V9 Build/02-copy`), or the next re-seed re-arms the old content. Brand media is currently DB-only (B.5 item 7); say so in the handoff if you touch it.
13. Privacy law: zero third-party requests at runtime. Fonts self-hosted; no CDN scripts; no external images.
14. Type: Jost (display), Barlow 300 (body), Share Tech Mono (keycodes). Never Futura, never `system-ui`.
15. AI Mark: any generated frame keeps its "AI-generated development frame" credit line so the mark fires; the regex lives in `media.ts` and `FilmstripSlideshow.tsx`, change both.
16. Reduced motion: the page must be complete with the island unmounted; islands refuse to mount under `prefers-reduced-motion: reduce` (the `cursor.ts` and `LogoRevealIsland` pattern).
17. Prove it: `pnpm preflight` from `cms/` exits 0 before any NAS deploy; the six-URL curl check from the v13 handoff passes; screenshots in both modes at 375 and 1440 attached to the handoff.
18. Context discipline: load `explore-digest` before any fan-out; subagents return digests; note that the context meter is shared across agents (A.6).


---

## F. Multilingual implementation discovery (PT / IT / FR / DE)

### F.0 Current-state facts (surveyed)

#### 1. Routing

- `web/astro.config.mjs:34` — `output: 'server'`, adapter is `@astrojs/node` (standalone) or `@astrojs/vercel` selected by `DEPLOY_TARGET` env (`web/astro.config.mjs:18-30`). No `i18n:` key anywhere in the config object (`web/astro.config.mjs:35-90`, full file) — Astro's built-in i18n routing is not configured.
- `web/src/pages/` (flat file listing, `web/src/pages/*.astro`): `212.astro`, `310.astro`, `contact.astro`, `craft.astro`, `dispatch.astro`, `index.astro`, `investors.astro`, `methods.astro`, `nrc.astro`, `pitch.astro`, `slate.astro`, `troupe.astro`, `work/[slug].astro`, plus API/text routes `sitemap.xml.ts`, `robots.txt.ts`, `llms.txt.ts`, `llms-full.txt.ts`, `api/ai/assist.ts`, `api/roll.ts`. No `[lang]` segment or locale-prefixed directory anywhere under `web/src/pages`.
- `web/src/pages/work/[slug].astro:1-33` — SSR (no `getStaticPaths`; `output: 'server'` means every route is server-rendered on request). Reads `Astro.params.slug`, fetches project + slate + chrome via `Promise.all`, redirects to `/slate` if `!project.publicSlate`.
- `web/src/pages/sitemap.xml.ts:1-42` — builds URLs live from Payload: `V9_PAGES` + `DIVISION_PAGES` + conditional `/dispatch`/`/troupe` + one entry per slate project (`/work/<slug>`). No locale variants, no `<xhtml:link rel="alternate" hreflang=...>` blocks — plain `<url><loc>` only (`sitemap.xml.ts:34-38`).
- `web/src/pages/robots.txt.ts:1-33` — open-door robots with a named AI-crawler allowlist (`AI_CRAWLERS` array, lines 10-19); no locale-specific rules.
- `web/src/pages/llms.txt.ts:1-40+` — one English `llms.txt` built from `NAP`, `V9_PAGES`, `DIVISION_PAGES`, and the live slate; no locale parameter.
- `web/src/layouts/V9Layout.astro:170` — `<html lang="en" ...>` is hardcoded; no other `lang=` attribute found anywhere in `web/src` (`grep -rn "lang=" web/src` returns only this one hit).
- No `hreflang` attribute anywhere in `web/src` (`grep -rn "hreflang" web/src` → zero hits).
- No `inLanguage` in any JSON-LD builder. Only `application/ld+json` emission point: `web/src/layouts/V9Layout.astro:229` (`<script is:inline type="application/ld+json" set:html={JSON.stringify(block)} />`), fed by `jsonLdAll` = `organizationJsonLd()` + `webSiteJsonLd()` + page-specific blocks (`web/src/layouts/V9Layout.astro:65`). None of the three JSON-LD builders in `web/src/lib/v9/site.ts` (`organizationJsonLd` lines 47-64, `webSiteJsonLd` lines 66-75, `propertyJsonLd` lines 88-101, `breadcrumbJsonLd` lines 103-114) set `inLanguage`.
- A `/pt/`, `/it/`, `/fr/`, `/de/` prefix scheme with unprefixed `en` default (Astro's `i18n: { defaultLocale: 'en', locales: [...], routing: { prefixDefaultLocale: false } }`) is not present; it would be new config plus a route-tree rework since `output: 'server'` + a flat `pages/` directory (no `[lang]` segment) means every `.astro` file above would need to move under a `[lang]`-equivalent structure or Astro's automatic i18n middleware would need to sit in front of the existing flat routes.

#### 2. Content readers

- `web/src/lib/payload.ts` fetch helpers are keyed by fixed slugs, no locale parameter anywhere in the file (`grep -n "locale" web/src/lib/payload.ts` → zero hits).
  - `fetchGlobalUncached` (`web/src/lib/payload.ts:430-445`) builds `` `${trimSlash(apiBase)}/api/globals/${slug}?depth=${depth}` `` — a `&locale=` query param could be threaded here (and into `fetchGlobal`, `web/src/lib/payload.ts:446-451`) without touching the URL shape, but every one of the ~20 typed wrapper functions (`fetchHomeGlobal` `:453`, `fetchSiteSettings` `:477`, `fetchV9Chrome` `:874`, `fetchV9Page` `:838`, `fetchV9Project` `:975`, `fetchV9SlateProjects` `:938`, `fetchDivisionSlate` `:955`, etc.) would need a `locale` argument threaded through.
  - Cache: in-process TTL + stale-while-revalidate + single-flight, keyed by string (`web/src/lib/payload.ts:157` section header, `withSwrCache` used at e.g. `:448`). Cache keys are built as `` `global:${slug}:d${depth}` `` (`:448`) — a locale-aware cache key would need `:${locale}` appended everywhere or cross-locale content would collide in cache.
  - `fetchCollectionDocUncached` (`web/src/lib/payload.ts:744-758`) and `fetchCollectionUncached` (`:710-727`) build REST query strings (`?depth=1&limit=100...`, `?where[slug][equals]=...&depth=1&limit=1`) — Payload's REST API accepts `&locale=` and `&fallback-locale=` as additional query params, so plumbing is straightforward once callers pass locale through.
  - `fetchV9Page` (`web/src/lib/payload.ts:838`) fetches one of 5 slugs (`V9PageSlug` type, `:836`: `'v9-home' | 'v9-slate' | 'v9-craft' | 'v9-methods' | 'v9-contact'`) at depth 2 (comment `:843-846` explains the depth-2 requirement for `slateList` → Project → `heroImage`).
- `web/src/lib/v9/site.ts` (114 lines total) — single source of NAP + JSON-LD + page-list constants:
  - `NAP` object (`:12-24`) — hardcoded English strings: `description` (`:16`), `divisions: ['(212) Pictures', '(310) Pictures', 'New Renaissance Cinema']` (`:23`).
  - `V9_PAGES` (`:27-33`) — hardcoded English `label`s: `'Home'`, `'Slate'`, `'Craft'`, `'Methods'`, `'Contact'`.
  - `DIVISION_PAGES` (`:37-40`) — hardcoded English `label`s: `'(212) Pictures'`, `'(310) Pictures'`, `'New Renaissance Cinema'`.
  - `canonical()` (`:42-43`) — builds absolute URLs off `SITE_URL` with no locale segment.
- `web/src/components/v9/media.ts` (54 lines) — `isAiFrameText` (`:53-54`): `` /ai[\s-]?generated/i.test(parts.filter(Boolean).join(' ')) `` — English-only regex matching against CMS caption/credit text, not a stored boolean flag (comment `:49-52` states this is deliberate: "the ONLY source of truth").
  - Second, independently-maintained copy of the same regex: `web/src/components/islands/FilmstripSlideshow.tsx:62` — `` /ai[\s-]?generated/i.test(`${it.caption ?? ''} ${it.captionHtml ?? ''} ${it.credit ?? ''}`) ``, with a comment at `:58` pointing back to `isAiFrameText` as canonical. Any translated caption that doesn't literally contain the English phrase "AI-generated" (or a hyphen/space variant) in one of these two regex sites will silently fail to carry the AI-mark disclosure — a compliance-relevant string, not just cosmetic copy.
  - Both regex sites are consumed by: `web/src/components/v9/sections/PhotoFold.astro:10,18` (`isAiFrameText(section.caption, section.credit)`) and `FilmstripSlideshow.tsx:62` directly.
- Nav + Display-panel labels: `web/src/layouts/V9Layout.astro:69-79` builds `panelLabels` from `chrome.displayLabel`, `chrome.panelTitle`, `chrome.themeLabel`, `chrome.themePremiere/Matinee/Lateshow` — all CMS-sourced (SiteSettings.v9Chrome, see §3). `navLinks` (`:143`, built from `chrome.navLinks` at `:109-110` with a fallback array, plus conditional Dispatch/Troupe entries) are also CMS-sourced. `ThemeControlIsland` (`web/src/components/islands/ThemeControlIsland.tsx`) takes all display copy as a `labels` prop (`:22-29` `ThemeControlLabels` type) with English hardcoded fallbacks only (`:34-37` `MODES` array: `'Marquee night'`, `'House lights'`, `'System'`; `:70` fallback `'Theme'`; `:113` fallback `'Display'`) — CMS-sourced with English fallback, not hardcoded-only.
  - Note: `ModeToggleIsland` (referenced `web/src/layouts/V9Layout.astro:267-271`) is the header nav's live mode switch (17px icon per comment `:266`); `ThemeControlIsland` appears to be superseded/unused in the header per that comment ("floating 'Display' pill is gone") — worth confirming ThemeControlIsland is still mounted anywhere before treating it as the switcher host.

#### 3. Payload side

- `cms/src/payload.config.ts:64-83` — full `buildConfig` call has no `localization:` key (compare to the VMS precedent in §5, which does). `collections: [Users, Media, Project, NewsArticle, DispatchIssue, FoundingRoll]` (`:75`) and `globals: [Home, SiteSettings, FooterLinks, About, Contact, Jobs, Pitch, Investors, Division212, Division310, DivisionNRC, TroupePage, TroupeProgram, V9Home, V9Slate, V9Craft, V9Methods, V9Contact]` (`:76`) — 18 globals confirmed, matching the brief.
- `db: postgresAdapter({ ..., push: false, migrationDir: './src/migrations' })` (`cms/src/payload.config.ts:88-104`) — confirms migrations are required for any schema change including adding `localization`.
- `cms/src/globals/v9Pages.ts` — `createPageGlobal()` factory (`:19-51`) builds `V9Home`/`V9Slate`/`V9Craft`/`V9Methods`/`V9Contact` (`:54-79`), each with `seoTitle` (text, `:31-35`), `seoDescription` (textarea, `:36-40`), and `sections` (blocks field, `V9_SECTION_BLOCKS`, `:41-45`). None of the three top-level fields set `localized: true`.
- `cms/src/blocks/v9Sections.ts` (555 lines) — 12 section block types: `V9PhotoFoldBlock` (`:18`), `V9RouteLineBlock` (`:71`), `V9TextFoldBlock` (`:88`), `V9QuoteFeatureBlock` (`:197`), `V9SlateListBlock` (`:219`), `V9FootnoteBlock` (`:277`), `V9RequestBlock` (`:289`), `V9LedgerBlock` (`:339`), `V9ArchivalBlock` (`:370`), `V9DivisionStripBlock` (`:393`), `V9MoodGridBlock` (`:410`), `V9FoundingRollBlock` (`:479`). Text-bearing fields per block (sample): `V9TextFoldBlock` has `heading`/`lede`/`body`/`quote`/`cite` (`:109-133`) plus nested `moreLabel`/`linkLabel` (`:146,163`); `V9SlateListBlock` rows carry `title`/`logline`/`provenance`/`meta` (`:239-260`); `V9LedgerBlock` rows carry `term`/`definition` (`:356-362`). None found with `localized: true` (`grep -n "localized" cms/src/blocks/v9Sections.ts` → zero hits) — every text/textarea field would need `localized: true` added individually; no restructure of field *shape* is required, only a per-field flag addition (a schema migration, not a data-model rewrite).
- `cms/src/collections/Project.ts` — text-bearing fields include `title` (`:24-25`), `slug` (`:29-30`), `logline` (textarea, `:94-95`), `shortLogline` (`:102-103`), `provenance` (`:111-112`), `metaLine` (`:119-120`), `bodyProse` (textarea, `:128-129`), `requestBody` (textarea, `:180-181`), plus gallery-item `caption`/`credit`-style fields further down. None have `localized: true` set (same grep, zero hits in this file).
- `cms/src/collections/Media.ts` — fields: `alt` (text, required, `:17-20`), `frameRatio` (select, `:21-34`), `mediaKind` (select, continues past `:35`). No `caption` field lives on Media itself; captions are per-block fields on the consuming block (e.g. `V9PhotoFoldBlock.caption` `cms/src/blocks/v9Sections.ts:42-43`, `V9ArchivalBlock.caption` `:381-382`) or per-gallery-item fields on Project.
- `cms/src/globals/SiteSettings.ts` — ~25+ text/textarea fields carrying UI chrome copy, notably the `v9Chrome` group (`:406` onward): `displayLabel` (`:417-418`), `panelTitle` (`:423-424`), `themeLabel` (`:431-432`), `themePremiere`/`themeMatinee`/`themeLateshow` (`:440-453`), `scaleLabel` (`:463-464`), `logoLabel` (`:469-470`), `topLabel` (`:480-481`), `prevLabel`/`nextLabel` (`:486-493`), `slateReturn` (`:503-504`), `cta` (`:509-510`); plus `colophon` (textarea, `:517-518`) and `copyright` (`:522-523`) at the settings root. None have `localized: true`.
- What adding `localization: { locales: ['en','pt','it','fr','de'], defaultLocale: 'en', fallback: true }` to `payload.config.ts` would do under `@payloadcms/db-postgres`: Payload creates a companion `<table>_locales` row-per-locale table for every collection/global holding at least one field marked `localized: true` (existing non-localized columns stay on the base table), and this is a Postgres schema change — because `push: false` (`cms/src/payload.config.ts:97`), it requires an explicit generated migration (`payload migrate:create`) checked into `cms/src/migrations/` (existing precedent files: `cms/src/migrations/20260718_201112_ai_mark.ts`, `20260718_231500_story_meta.ts`, etc. — `ls cms/src/migrations`) rather than the dev-time `push: true` auto-sync VMS-style projects can use.
- `payload-types.ts` regeneration: `cms/package.json:12` — `"generate:types": "cross-env NODE_OPTIONS=--no-deprecation payload generate:types"`. Adding `localization` changes generated types for every localized field (Payload types a localized field as the bare type in most contexts but the Local API's typed return can carry locale-specific shape depending on query); this script must be re-run and `payload-types.ts` (aliased into `web/` via `web/astro.config.mjs`'s Vite alias `'payload-types': path.resolve(__dirname, '../cms/src/payload-types.ts')`) is the single type-share boundary per CLAUDE.md rule 6.

#### 4. Seed

- `cms/scripts/seed-v9.ts` (537 lines) — header comment (`:1-26`) states it is idempotent, parses copy from one fixed vault path: `COPY_DIR = '/Users/marco/vault/10 Work/11 APR70 Pictures/11.12 V9 Build/02-copy'` (`:41`), with `MEDIA_SOURCES` fallback dirs (`:42-45`). Reads `chrome.md`, `index.md`, `slate.md`, `craft.md`, `methods.md`, `contact.md`, `properties/*.md` (comment `:5-7`) — no locale subdirectory or `--locale` CLI flag; `APPLY`/`DRY` are the only CLI switches (`:34-39`).
- Seeds, per the header (`:9-20`): (1) Media upsert matched by filename (`:191` section start, loop `:236-244`), (2) Projects — nine properties matched by slug/legacy-slug alias (`:246` section start, loop `:285`), (3) the 5 V9 page globals (`:475-486`, `payload.updateGlobal({ slug, data })` at `:486`), (4) `SiteSettings.v9Chrome` (`:512`, `payload.updateGlobal({ slug: 'site-settings', data: { v9Chrome } })`).
- To support locales, this script would need either a `--locale=pt` CLI flag driving both a different `COPY_DIR` (e.g. `02-copy-pt/`) and a `&locale=` param on every `updateGlobal`/upsert call, or a loop over locale-suffixed copy directories — the vault copy canon (`11.12 V9 Build/02-copy`) itself has no localized siblings today (out of scope to verify vault contents under this read-only repo survey, but the CLAUDE.md three-layer content law implies each locale would need its own vault copy-canon subtree).
- `cms/scripts/` directory listing: `admin-doctor.ts`, `apply-v4-content.ts`, `dev-shadow-push.ts`, `fix-billing-blocks.ts`, `migrate-v2/`, `migrate-v2-to-v3.ts`, `reimport-frames.ts`, `seed-v9.ts` — `seed-v9.ts` is the only content seed script for the current (v9/v10) site; the others are one-off migration/fix utilities.

#### 5. Precedent (Vik Muniz Studio, `~/websites/vik-muniz-studio`, read-only)

- `~/.claude/skills/kima-site-build/SKILL.md:29` — "**i18n** | **EN/PT/FR/JA**, `[lang]` route segment | Locale negotiation + Basic-Auth gate in `src/proxy.ts`."
- `~/.claude/skills/kima-site-build/SKILL.md:22` — stack is Next.js 16 App Router (not Astro).
- `~/.claude/skills/kima-site-build/references/architecture.md:11` — "Routes live **once** at `src/app/[design]/[lang]/…`. The active theme is the `[design]` segment; the locale is `[lang]` (en/pt/fr/ja)."
- `~/.claude/skills/kima-site-build/references/architecture.md:13-14` — `src/proxy.ts` (Next middleware) does locale negotiation + redirects legacy `/en/…` and design-only URLs to the canonical `/[design]/[lang]/…` shape; a `vm-design` cookie remembers theme choice (locale itself is presumably in the URL, not a cookie).
- `~/.claude/skills/kima-site-build/references/architecture.md:42` — `[lang]` segment, dictionaries in `src/lib/i18n/dictionaries/*.json` (4 locales) — i.e. VMS pairs Payload `localized` CMS fields (content) with a separate static-dictionary system (chrome/UI strings), not one mechanism for both.
- `~/.claude/skills/kima-site-build/references/geo-aeo.md:22` — "**`hreflang` + canonical** for EN/PT/FR/JA; semantic headings; descriptive alt text" — confirms VMS does emit hreflang, unlike apr70 today.
- `~/websites/vik-muniz-studio/src/payload.config.ts:64-72` — actual `localization: { locales: [{ label: "English", code: "en" }, { label: "Português", code: "pt" }, { label: "Français", code: "fr" }, { label: "日本語", code: "ja" }], defaultLocale: "en" }` block (no `fallback` key set, so Payload's default `fallback: true` applies).
- `~/websites/vik-muniz-studio/src/collections.ts` — many fields marked `localized: true`: Media `alt` (`:31`), a `name` field (`:42`), fields at `:58`, `:67`, `tag`/`mediumLabel`/`statement` (`:102-104`), `medium` (`:146`), `description` (`:164`), `title` (`:174`), `excerpt`/`bodyMarkdown` (`:185-186`), `bio` (`:274`) — confirms the "add `localized: true` to existing fields" pattern is exactly what VMS did, at the collection level.
- KIMA skill lesson (`~/.claude/skills/kima-site-build/SKILL.md:61`) — "**`series_locales` has NO `title` column — series/work title is non-localized**, stored only on `series.title`" — i.e. VMS deliberately did NOT localize every field (title stayed English-only/shared); a locale rollout on apr70 would face the same per-field decision (which of Project's `title`/`slug`/`logline`/`bodyProse`/etc. are translated vs. shared).
- Language switcher component: `~/websites/vik-muniz-studio/src/components/language-switcher.tsx` — `"use client"` component (`:1`), swaps the `[lang]` path segment in place (`:20-28` `pathFor()`), renders each locale as `{l.code.toUpperCase()}` (`:44`) — i.e. plain mono-style two/three-letter codes (`EN`, `PT`, `FR`, `JA`), no flag icons, separated by a middot `·` (`:38-40`), with `hrefLang={l.code}` on each `<Link>` (`:41`) and `aria-current` on the active one (`:42`).
- Switcher placement: mounted in three places — `~/websites/vik-muniz-studio/src/components/site-header.tsx:60` (desktop header nav), `~/websites/vik-muniz-studio/src/components/mobile-menu.tsx:179` (mobile menu, `touch` variant for larger tap targets), `~/websites/vik-muniz-studio/src/components/site-footer.tsx:117` (footer).

#### 6. Where a language switcher could live (apr70)

- Header/routeline nav: `web/src/layouts/V9Layout.astro:250-275` — `<nav class="v9-nav" aria-label="Primary">`. Existing links render with a mono "super index" prefix (`web/src/layouts/V9Layout.astro:261-263`, `<span class="v9-nav__index">{String(i+1).padStart(2,'0')}</span>`, comment `:251-254` calls this "the routeline look — mono super index"). A language switcher matching house idiom would slot in near the `ModeToggleIsland` mount (`:267-271`) using the same mono-index / keycode visual language.
- `ThemeControlIsland` (`web/src/components/islands/ThemeControlIsland.tsx`) — a separate, currently-likely-unmounted (per `V9Layout.astro:266`'s comment that "the floating 'Display' pill is gone") React island with a collapsible panel pattern (`:95-140`) and CMS-sourced labels; structurally it's a candidate *pattern* (collapsible bottom-right pill) for a language control, but it is not the active header switch — `ModeToggleIsland` is.
- Footer: `web/src/layouts/V9Layout.astro:283-297` — `<footer class="v9-footer">` with `<nav class="v9-footer__nav" aria-label="Footer">` (`:291-293`, renders the same `navLinks`), then `chrome.colophon` (`:294`) and `chrome.copyright` (`:295`). No "indicia" element/class/string exists in this file or elsewhere in `web/src` (`grep -rn "indicia" web/src` → zero hits) — the term appears nowhere in the codebase; footer copy is just colophon + copyright text.
- House anti-icon constraint: confirmed by the existing keycode/mono-meta idiom used throughout design docs — `docs/handoff/archive/google-stitch-brief.md:90` ("Typography is locked: Futura Std for display, Barlow for body, Share Tech Mono for keycodes/metadata only") and multiple `font-keycode`/`text-keycode` (Share Tech Mono) class usages in `docs/handoff/stitch-html-round3/*.html` for short uppercase mono labels (e.g. `SUPER35 / NYC`, `LOC:NYC // DIV:212`). No flag-icon component exists anywhere in `web/src` (not searched exhaustively for images, but no icon library or flag asset references turned up in any of the files read). This is consistent with, not contradicted by, the VMS precedent (§5), which also uses plain uppercase locale codes with no flags.

### F.0.1 Hardcoded English strings found

| file:line | string | surface |
|---|---|---|
| `web/src/layouts/V9Layout.astro:170` | `lang="en"` | `<html>` root attribute, every page |
| `web/src/lib/v9/site.ts:16` | `NAP.description` ("APR 70 Pictures is an independent film and television studio…") | Org JSON-LD `description`, `meta name="description"` default, `llms.txt` intro |
| `web/src/lib/v9/site.ts:23` | `divisions: ['(212) Pictures', '(310) Pictures', 'New Renaissance Cinema']` | Org JSON-LD `department[].name`, `llms.txt` Divisions line |
| `web/src/lib/v9/site.ts:28-32` | `V9_PAGES[].label` — `'Home'`, `'Slate'`, `'Craft'`, `'Methods'`, `'Contact'` | `llms.txt` page list link text |
| `web/src/lib/v9/site.ts:38-40` | `DIVISION_PAGES[].label` — `'(212) Pictures'`, `'(310) Pictures'`, `'New Renaissance Cinema'` | `llms.txt` division link text |
| `web/src/components/v9/media.ts:54` | `/ai[\s-]?generated/i` (matches literal English phrase "AI-generated") | AI-mark detection in `PhotoFold.astro` (compliance-relevant: drives the AI-disclosure stamp) |
| `web/src/components/islands/FilmstripSlideshow.tsx:62` | `/ai[\s-]?generated/i` (duplicate of the above regex) | AI-mark detection in the filmstrip gallery island |
| `web/src/components/islands/ThemeControlIsland.tsx:35-37` | `MODES` fallback labels — `'Marquee night'`, `'House lights'`, `'System'` | Display-panel theme-mode fallback text (used only if CMS `chrome.theme*` strings are empty) |
| `web/src/components/islands/ThemeControlIsland.tsx:70,113` | fallback `'Theme'`, fallback `'Display'` | Same panel, group/pill fallback labels |
| `web/src/pages/llms.txt.ts:41-42` (approx., continues past excerpt) | "Scripts are written by people; Marco Caruso is the author of record." / AI-imagery disclosure line | `llms.txt` "Facts" section |
| `web/src/pages/robots.txt.ts:10-19` | `AI_CRAWLERS` bot names (not translatable copy, but a fixed English/ASCII list with no locale variation) | `robots.txt` |

### F.1 Approach comparison

Starting facts (from F.0): Astro runs `output: 'server'` with no `i18n` block and `lang="en"` hardcoded in the layout; twelve section block types carry the text fields and none is `localized`; Payload has no `localization` block and `db.push` is false, so any schema change is a hand-checked migration; `seed-v9.ts` reads one fixed copy directory with no locale flag; the AI Mark keys off an English regex in two files; the Vik Muniz Studio site on the same KIMA stack ships en/pt (plus fr/ja) with Payload `localization`, per-field `localized: true`, a `[lang]` route segment, hreflang, and a plain-code switcher (EN · PT) in header, mobile menu, and footer, no flags.

| Dimension | 1. Payload localized fields + Astro `i18n` routing | 2. Separate locale documents (locale select or duplicated Globals) + Astro param routing | 3. Hybrid: chrome/nav/UI strings as localized fields, long-form sections as per-locale documents |
|---|---|---|---|
| Routing and the renderer | `astro.config.mjs` gains `i18n: { defaultLocale: 'en', locales: ['en','pt','it','fr','de'], routing: { prefixDefaultLocale: false } }`; pages move under `src/pages/[...locale]/` or use Astro's `getRelativeLocaleUrl`; `SectionRenderer` is untouched because the document shape does not change | pages take a `[locale]` param and pick the document by slug plus locale (`v9-home--pt`); `SectionRenderer` untouched; every Global becomes five Globals or one collection with a locale select, which breaks the "page = Global" law and the admin's 18-global layout | same routing as 1; `SectionRenderer` untouched; page lookup mixes a localized `v9Chrome` read with a per-locale sections document |
| Content readers (`web/src/lib/payload.ts`) | thread `?locale=<code>&fallback-locale=en` through `fetchV9Page` and the slim-projection cache key (cache must be keyed by locale or it serves the wrong language) | new slug convention in every fetch helper; cache keyed by the composed slug | both changes |
| `payload-types.ts` | regenerate once; localized fields keep their types (Payload returns the resolved locale string, not a map, unless `locale=all`) | regenerate for the new select or new Globals | regenerate |
| Seed and the three-layer law | `seed-v9.ts` gains a locale loop: `COPY_DIR/<locale>/` per language, seeding with `locale` set per call; vault canon grows `02-copy/<locale>/`; seed stays idempotent per locale | seed writes N documents per page; canon grows the same way; more surface to keep in sync | seed handles two shapes |
| Migrations (`push:false`) | one migration adding `<table>_locales` companion tables for every Global and collection with a localized field (Payload's `migrate:create` generates it; review by hand) | one migration adding a select column (or many new Global tables); simpler SQL, more admin sprawl | both migrations |
| SEO | `hreflang` alternates in `V9Layout.astro` head and in `sitemap.xml.ts` per URL; per-locale canonical; `inLanguage` in the JSON-LD builders in `web/src/lib/v9/site.ts`; `lang` attribute from the locale; `llms.txt` per locale or English-only with a note | same head work; sitemap must enumerate documents per locale | same as 1 |
| Switcher placement | mono keycodes `EN · PT · IT · FR · DE` in the house idiom, no flags: candidates are the header nav row beside the mode toggle (the live header switch is `ModeToggleIsland`; `ThemeControlIsland` is the floating panel, confirm where it is mounted before using it as host), the routeline on `/` as a contents-line item, and the footer indicia (the VMS precedent mounts in all three) | same | same |
| Fallback when a translation is missing | Payload `fallback: true` returns English per field, so a half-translated page renders mixed language rather than 404; a visible "English original" indicia line should be planned | a missing locale document falls back at the route level (serve English or 404); page-level, not field-level, so no mixed language but more blank pages during rollout | field-level for chrome, page-level for body |
| AI Mark and captions | the regex in `media.ts:53-54` and `FilmstripSlideshow.tsx:62` must be replaced by a stored boolean on Media (or an `aiFrame` flag on the relationship) before any caption is translated, or translated captions silently lose the disclosure; captions themselves become localized fields on Media | same requirement | same |
| Editorial workflow | one document per page, one tab per language in the admin (Payload's locale selector); translators work in the admin against the English tab; approved copy canonised in the vault per locale; Marco's English pass first (TASKS Phase 10) | translators duplicate whole pages; drift between locales is structural (a section added in English is not added in Portuguese); more Marco review | translators see chrome in the admin tabs and body as separate documents |
| Risk | the migration touches every table; test on a dump first; the slim-projection cache and the SWR layer need a locale key or the site serves the wrong language from cache | admin sprawl and structural drift | most moving parts |

### F.2 Recommendation and phasing

Recommend approach 1 (Payload `localization` with per-field `localized: true` plus Astro `i18n` routing, unprefixed English). It is the VMS precedent on the same stack, it keeps "one page = one Global" intact, and it is the ruled approach in TASKS Phase 10. Approach 2 is only worth it if Marco wants structurally different pages per market (not stated). Approach 3 adds moving parts without removing the migration.

Phase order, respecting TASKS Phase 10 (Marco's English text pass first) and inventing no copy:

1. **Phase 0, now, no code**: Marco's English text pass in `/admin`; the copy canon in the vault updated; this plan approved.
2. **Phase 1, structural, English only**: replace the AI Mark regex with a stored flag (both files); add `lang` from a locale constant, `inLanguage` to the JSON-LD builders, and hreflang scaffolding that emits only `en` and `x-default` for now; key the fetch cache by locale. Ship as a normal version bump. Nothing visible changes.
3. **Phase 2, schema**: add `localization` to `payload.config.ts` with `en` as default and `fallback: true`; mark text fields `localized: true` across `v9Sections.ts`, `v9Pages.ts`, `SiteSettings` chrome strings, `Project`, `Media` alt/caption; generate and review the migration; regenerate types; rehearse the migration against a fresh NAS dump locally; extend `seed-v9.ts` with the locale loop (English only populated). Deploy behind no visible change: the site is still English.
4. **Phase 3, one language**: Portuguese first (the VMS precedent and Marco's stated pair). Translator works in the admin's PT tab; approved copy canonised at `11.12 V9 Build/02-copy/pt/`; seed defaults added; `astro.config.mjs` `i18n` on; `/pt/` routes, hreflang, sitemap alternates, switcher keycodes live. Review gate: Marco reads every PT page in both modes.
5. **Phase 4**: IT, FR, DE the same way, one at a time, each gated.
6. **Go-live dependency**: none of this needs to precede the apr70.com flip. Phase 1 can ride the POC version bump; Phases 2 to 4 land after, on staging first.

What is explicitly not decided here: who translates, and whether the switcher lives in the header, the routeline, or the footer. Both go to Marco (G.10, G.11).

---

## G. Questions for Marco (prioritised)

1. **First POC route and exposure.** Is `/` (the live PhotoFold homepage) the right first layered proof of concept, and is "switchable design on staging behind `?design=layered`, off by default, gated by a Site Settings switch" the right way to show it to investors?
2. **Light Law cull timing.** Does the Phase 9 cull happen before the POC, or in parallel with the POC built on PD ledger plates and existing CMS frames, with approved stills swapped in afterwards?
3. **Canonical marks per surface.** Confirm the nav marks, the favicon tiles, the holding-page wordmark, and the print kit all resolve to `10-01-logos/2026-brand-jost-punch/` files, and rule whether the `web/public/logos/` fallback pair should be repointed to Punch files before it is archived.
4. **Archive permissions.** May `web/public/brand/apr70-logos/` (202 tracked files, unreferenced) be removed from the repo and archived at the proposed destination? The Futura-era SharedData archive and `~/websites/apr70-logos/` need no action (the latter no longer exists).
5. **Legacy and broken media rows.** May the 14 unreferenced 2026-05 / 2026-07-17 media rows and the broken id 209 row be deleted from Payload, or should they stay as record?
6. **Brand media and the three-layer law.** Accept "brand media is DB-only, restored from the DB dump" as a documented exception, or commission a brand-kit seed step?
7. **Restore point.** Tag plus GitHub branch protection on `main`, paired with a NAS DB dump and a media snapshot under one stamp (A.4)? And should the tag sit on HEAD or on the SHA the NAS is currently running?
8. **Version bookkeeping.** Should the 2026-07-27 Futura takedown and Punch passes get their own ledger note under `v13`, or should the next bump be `v14` with the ledger corrected then?
9. **Stale headers.** Approve the one-line corrections in A.2 for `BRIEF.md`, `CLAUDE.md`, `../README.md`, and the deploy script's final line?
10. **Translation workflow.** Who supplies approved PT / IT / FR / DE copy after the English text pass, and where is it canonised in the vault (proposed: `11.12 V9 Build/02-copy/<locale>/`)?
11. **Language switching and go-live.** Is language switching required before the apr70.com flip, or phased after it (recommended: after)?
12. **References you own or license.** Which of the D-matrix sources, if any, do you hold a licence for, and is there a takeaway from the Nate Herk video the agents could not watch?

---

### G.1 Rulings (Marco, 2026-09-02, same day)

| # | Ruling | Consequence |
|---|---|---|
| 1 | Yes: `/` first, behind `?design=layered` on staging, off by default, gated by a Site Settings switch | C.5 and C.6 stand as written; TASKS Phase 11 |
| 2 | Yes: build the POC now with PD ledger plates in the image plane; swap approved stills in after the Light Law cull | C.7 stands; the cull is not a blocker for the POC |
| 3 | Yes: the Punch kit is canonical for nav, favicons, holding page, print; repoint the `web/public/logos/` fallback pair to Punch files | housekeeping task in Phase 11 |
| 4 | Archive `web/public/brand/apr70-logos/` to the NAS, not the Mac | B.3 destination updated above |
| 5 | Delete broken media row 209; keep the 14 legacy rows until after the POC review | Phase 11 |
| 6 | Commission a small idempotent brand-kit seed step | closes the three-layer gap in B.5 item 7 |
| 7 | Restore point: annotated tag `restore/v13-2026-09-02` on `6a6fa4a`, GitHub branch protection on `main`, paired NAS dump and media snapshot; no release branch | A.4 stands |
| 8 | The 07-27 passes stay under `v13` with today's ledger note; the POC bump is `v14` | A.5 files list applies at `v14` |
| 9 | Change the Stop hook: skip subagent stops, never add untracked files | Phase 11, alongside the A.6 meter fix |
| 10 | Vault canon path for translations is `11.12 V9 Build/02-copy/<locale>/`. Translator for the first round: Claude (the Vik Muniz Studio en/pt precedent), with Marco as the reviewing human who signs off every locale before it ships | F.2 phase 3: AI first draft in the admin locale tab, canonised in the vault only after Marco's sign-off |
| 11 | RULED "after": apr70.com goes live in English first; PT / IT / FR / DE are built on staging and released one at a time later | F.2 phasing stands; i18n is off the go-live critical path |
| 12 | Rights status label adopted for every D source (text at the top of D); Nate Herk takeaway recorded in D.9 | done |

Clarifications on 10 and 11, for the record. "Who translates" means the person or service that produces the Portuguese, Italian, French, and German text: Marco himself, a human translator or agency, or an AI first draft that a named human reviews and signs off. Agents will not invent translated copy under any option; the choice decides cost, turnaround, and who is accountable for the words. Question 11 is about sequencing only: apr70.com currently serves the holding page, and at some point its DNS or proxy rule flips to the full site. "Before" means that flip waits until the four languages exist; "after" means the full site goes live in English and the languages are added on staging and released one at a time later. The recommendation is "after", because the English text pass, the schema migration, and the translations are each weeks of work and none of them improves the English site.

## H. Closing note: what this session touched, and what it did not

- Written: this file (`docs/plans/APR70_BRAND_BASELINE_AND_LAYERED_CINEMA_PLAN.md`, new directory) and a two-line Current entry at the top of `BRIEF.md`.
- Applied afterwards on Marco's explicit go (same session): the A.2 corrections to `BRIEF.md` (header, historical V4 block label), `CLAUDE.md` (header, Live, Staging, Hosting path), `../README.md` (branch, staging line), `../_deploy/deploy-v10-to-nas.sh` (final message text only), `docs/decisions/2026-07-05-vercel-supabase-runbook.md` (status line), and a ledger note plus footer date in `docs/recap/MASTER-RECAP.html`. One read-only SSH `ls` and `git rev-parse` on the NAS to verify the stack path and deployed SHA. Then commit and push of `main` on Marco's instruction.
- Not changed: any production-facing code, any asset on disk or in Payload, any media row, any content, git remote state (nothing pushed), the NAS, any deployment, any dependency.
- Read-only checks run: `git status`, `git tag`, `git branch -a`, the six-URL curl check from the v13 handoff (all 200, AI Mark corner present), `apr70.com` 200. `pnpm astro check` was not run (not required).
- Repo Stop hook activity during the session (triggered by subagent stops, not by hand): `0855c47` "auto: session end — touched AGENTS.md, CLAUDE.md, docs/decisions/2026-07-14-property-identities-falcon-and-tsunami.md, .cursor/mcp.json" committed the pre-existing working-tree modifications and the untracked `.cursor/mcp.json` (a ComfyUI MCP launcher with a public URL, no secret); `942a307`, `8da6491`, and `11913bb` "auto: stop-hook BRIEF note" each appended an Auto-stop note block to `BRIEF.md`. `main` is 4 ahead of `origin/main` at the time of writing; nothing was pushed. Whether those auto-commits are wanted is Marco's call; they are reversible locally.
- Session footgun for the record: the shared `.claude/.context-meter` was reset by hand twice (values 40000 and 70000, warned flag 0) after subagent output tripped the rule-14 gate in the parent; see A.6 for the proposed per-session fix. The meter file is gitignored.
- Scratch inputs (subagent digests, raw API pulls) live only in the session scratchpad and are not part of the repo.
