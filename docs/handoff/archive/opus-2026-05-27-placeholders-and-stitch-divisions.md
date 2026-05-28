# Handoff — Placeholders + Slate-Stack Seed + Division Stitch Screens

**Date:** 2026-05-27 ~8:55pm EDT
**Session:** Claude Opus 4.7 (user session — Marco)
**Branch:** main
**Context gate hit:** Yes (NRC Stitch generations blocked). Commit + push + restart.

---

## What was done this session

### 1. NAS logo migration deployed (Task #1 ✅)
- Pulled 73 files of pending work to NAS (`e8179b5..f600944`).
- Rebuilt cms container (target: runner). Restarted clean.
- Ran `pnpm migrate:v2:apply` via the `migrate` compose profile (target: seeder).
- Verified: `GET /api/globals/212?depth=2` returns populated `headerLogo`, `footerLogo`, `faviconOverride` objects with correct mediaKind/divisionTag.
- All 4 containers healthy on kimaserver:8080.

### 2. Placeholder image system shipped (Task #2 ✅)
- 16 branded SVG placeholders at `web/public/brand/placeholders/` — 4 aspects (16x9, 4x3, 1x1, 9x16) × 4 division tints (default, 212, 310, nrc).
- Design: slate background, brand-tinted perforation strips top + bottom, mono "APR70 · {division} · {ratio}" label.
- Helper module: `web/src/lib/placeholder.ts` (`placeholderUrl({ aspect, division })`).
- Resolver fallback: `resolveMediaSrcOrPlaceholder(media, opts)` added to `web/src/lib/payload.ts`. Real Media wins; missing Media auto-falls-back to placeholder.
- Wired into `web/src/components/blocks/HeroBlock.astro` and `web/src/components/blocks/GridBlock.astro`.
- Regenerator script: `web/scripts/gen-placeholders.mjs` (run with `node scripts/gen-placeholders.mjs` from `web/`).
- Preview page: `/dev/placeholders` (dev server only).
- No new TypeScript errors (verified via `astro check` — 26 pre-existing errors, 0 new).
- README in `web/public/brand/placeholders/README.md` documents swap-in workflow.

### 3. v0-slate-stack wired into division default seed (Task #3, part A ✅)
- `cms/scripts/migrate-v2/division-default-layouts.ts` — added `slateStackShowcase()` helper that returns a `divisionShowcase` block with `variant: 'v0-slate-stack'` and all three divisions populated with brand colors + Marco-approved copy.
- Inserted as second block in each division layout (after hero, before twoCol). So `/212`, `/310`, `/nrc` will render the approved slate-stack family-of-companies section on next fresh seed of an empty layout.
- NOTE: Existing seeded division layouts on NAS won't auto-pick this up (apply skips when blocks exist). Marco can either re-seed with cleared layouts or add the block manually via admin.

### 4. Three division-homepage Stitch screens — 4 of 6 generated (Task #3, part B — PARTIAL)

| Division | Variant | Project ID | Screen ID | Status |
|----------|---------|------------|-----------|--------|
| 212 | Title Card (Prompt A) | 10388160894163022728 | (see persisted output) | ✅ done |
| 212 | Editorial (Prompt B) | 10388160894163022728 | `c2ae75a9b50c41d1920b1d8290fed567` | ✅ done |
| 310 | IMAX Scale (Prompt A) | 13932882577618101661 | (see persisted output) | ✅ done |
| 310 | Architectural (Prompt B) | 13932882577618101661 | `e025fa1a687d4890b6342c045b17576e` | ✅ done |
| NRC | Art Film (Prompt A) | 6601419679785046440 | — | ❌ blocked by context gate |
| NRC | Curator's Space (Prompt B) | 6601419679785046440 | — | ❌ blocked by context gate |

Stitch-generated design systems landed as side effects:
- 212: `assets/f201b0d526d84e539781ff36c46d4c49` — "Cinematic Brutalism"
- 310: `assets/f43113f4791343f684f35a722ec7eb59` — "Technical Specification"

Parent design system still: `c12e1d9837594aa9be2761ce1ecf907c` (was reused for all generations).

Persisted full responses live in `~/.claude/projects/-Users-marco-websites-apr70-pictures/48ae639f-c184-4043-93c2-d4a1dd8db509/tool-results/` if needed.

---

## What next session must do

### Priority 1: Commit + push this session's changes
The stop hook normally handles commits, but the context gate may interfere. If the stop hook didn't run cleanly:

```sh
cd /Users/marco/websites/apr70-pictures
git add web/public/brand/placeholders/ \
        web/src/lib/placeholder.ts \
        web/src/lib/payload.ts \
        web/src/components/blocks/HeroBlock.astro \
        web/src/components/blocks/GridBlock.astro \
        web/src/pages/dev/placeholders.astro \
        web/scripts/gen-placeholders.mjs \
        cms/scripts/migrate-v2/division-default-layouts.ts \
        BRIEF.md \
        docs/handoff/
git mv docs/handoff/sonnet-2026-05-19-slate-stack-div-homepages.md docs/handoff/archive/
git commit -m "feat: placeholder image system + v0-slate-stack seed + 4 division Stitch screens"
git push
```

### Priority 2: Finish the NRC Stitch generations (in a fresh session)

Use the parent design system `assets/c12e1d9837594aa9be2761ce1ecf907c` and these prompts:

**NRC Prompt A (Art Film):**
> "NRC CINEMA — New Renaissance Cinema standalone homepage. Navy #001F3F background, silver-grey #C8C8C8 text. NRC lettermarks (N-R-C) large display with diagonal sash band. Tagline: ART THAT REFUSES COMPROMISE. Projects: VOLTA / ARTHOUSE / 2026 IN PRODUCTION, THE CURATOR'S EYE SHORT 2025 COMPLETED. Prestige art-house aesthetic, museum catalogue meets film festival programme. Silver rules on navy. BACK TO APR 70 PICTURES link. No nav/footer."

**NRC Prompt B (Curator's Space):**
> "NRC CINEMA homepage variant — deconstructed gallery aesthetic. NRC letters massive at different scales overlapping. VOLTA and THE CURATOR'S EYE as featured projects. Silver #C8C8C8 on pure black. EST. MMXXVI. Intimate, intellectual, art-film atmosphere. BACK TO APR 70 PICTURES link. No nav/footer. Zero border-radius."

Call `mcp__stitch__generate_screen_from_text` with `projectId: "6601419679785046440"`, `designSystem: "assets/c12e1d9837594aa9be2761ce1ecf907c"`, `deviceType: "DESKTOP"`. Run sequentially (not in parallel) to avoid the context gate.

### Priority 3: Marco picks the canonical division-homepage screens
Once all 6 screens exist, Marco reviews via Stitch UI and chooses a canonical variant per division (or asks for more iterations). Then we extract the chosen designs as static HTML (via `stitch-design:extract-static-html`) and either:
- Save as `docs/handoff/stitch-html-round4/r4-{div}-homepage.html` for further design feedback, or
- Convert to Astro components for the actual `/212`, `/310`, `/nrc` pages.

### Priority 4: Task #4 — Implement News.html from Anthropic design file
URL: `https://api.anthropic.com/v1/design/h/HWgp9WOoBly2CcrSfof9MA?open_file=News.html`

1. Fetch the design file (`WebFetch` tool) and read its README to understand structure + variables.
2. Extract the News.html design system (typography, color usage, layout rhythm).
3. Implement in `web/src/pages/news/index.astro` and `web/src/pages/news/[slug].astro`.
4. Cross-reference cinema-magazine palette in `/Users/marco/websites/apr70-website-reference-repository/news-page-reference/` and the round-3 `r3-new-production-log.html`.

### Priority 5: Backlog (deferred)
- Hero slider island (Phase 5)
- MasonryBlock island (Phase 7)
- Director review of v5 filmstrip, lock canonical division variant, delete unused code
- `/privacy` + `/terms` pages
- Lighthouse + WCAG audits
- DSM staging proxy slot + DNS plan

---

## Files changed this session

| File | Change |
|------|--------|
| `web/public/brand/placeholders/*.svg` | New — 16 generated placeholders |
| `web/public/brand/placeholders/README.md` | New — system docs |
| `web/scripts/gen-placeholders.mjs` | New — SVG generator |
| `web/src/lib/placeholder.ts` | New — `placeholderUrl()` helper |
| `web/src/lib/payload.ts` | Added `resolveMediaSrcOrPlaceholder()` |
| `web/src/components/blocks/HeroBlock.astro` | Uses placeholder fallback for hero media |
| `web/src/components/blocks/GridBlock.astro` | Uses placeholder fallback for card media |
| `web/src/pages/dev/placeholders.astro` | New — dev preview of all 16 placeholders |
| `cms/scripts/migrate-v2/division-default-layouts.ts` | Added slate-stack showcase block to all 3 divisions |
| `BRIEF.md` | Updated current-state header |
| `docs/handoff/opus-2026-05-27-placeholders-and-stitch-divisions.md` | This file |

---

## Stitch project inventory

| Project | ID | Purpose | Screens |
|---------|----|---------|---------|
| APR 70 Pictures — Division Showcase | `3884326936106951139` | Parent showcase block | done (prior session) |
| 212 Pictures — Standalone Homepage | `10388160894163022728` | Division site mockups | 2 of 2 generated ✅ |
| 310 Pictures — Standalone Homepage | `13932882577618101661` | Division site mockups | 2 of 2 generated ✅ |
| NRC Cinema — Standalone Homepage | `6601419679785046440` | Division site mockups | 0 of 2 — context gate hit |

Parent design system: `assets/c12e1d9837594aa9be2761ce1ecf907c`.

---

## NAS state at end of session

- All 4 containers healthy on kimaserver:8080
- brand_fields migration applied; division globals return populated logo refs
- Last commit on NAS: `f600944` (matches origin/main at session start; new local commits not yet pushed)
