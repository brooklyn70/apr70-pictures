# Handoff — Slate Stack Integration + Division Homepage Stitch Projects
**Date:** 2026-05-19 ~5:15pm EDT
**Session:** Sonnet 4.6 (user session — Marco)
**Branch:** main
**Context gate hit:** Yes (~300KB). Hard-blocked. Commit + push manually (see below).

---

## What was done this session

### 1. "BACK TO CLAUDE" identified
The screen Marco named "BACK TO CLAUDE" in Stitch = **The Slate Stack** design.
Two versions saved to `docs/handoff/stitch-html-round3/`:
- `r3-back-to-claude-slate-stack-hover.html` — "The Slate Stack: Row Hover State"
- `r3-back-to-claude-slate-stack-v2.html` — "The Slate Stack: Left Aligned Logos v2"

Design: 3 full-width rows (one per division). Logo large on left. Tagline + project ledger on right.
Dark bg (#0A0A0A), left stroke on hover, cursor-follow radial glow. Zero violations.

### 2. DivisionBlock.astro — new `v0-slate-stack` variant added
File: `web/src/components/blocks/DivisionBlock.astro`

Added:
- Variant block (Astro template) — three rows: logo-col + content-col
- CSS — `.vss-*` namespace, no `transition: all`, no border-radius, CSS `@keyframes vss-fade-in` for stagger reveal
- JS — cursor-follow `radial-gradient` background on mousemove/mouseleave

Variant uses existing `getDivisionLogo()`, `tokenToVar()`, `getDivisionId()` helpers.
Layout: logo left (max-width 420px, clamp height 160–260px), tagline right (clamp 2.5rem–5rem, Futura Std, uppercase), project list below tagline (Share Tech Mono 10px badges with division color border).

### 3. division-variants.astro updated
File: `web/src/pages/dev/division-variants.astro`

Added `v0-slate-stack` as **first** entry in `variantMeta` array.
Preview at `http://localhost:4322/dev/division-variants`.

### 4. Three new Stitch projects created for division standalone homepages

| Division | Project Title | Project ID |
|----------|--------------|------------|
| 212 | 212 Pictures — Standalone Homepage | `10388160894163022728` |
| 310 | 310 Pictures — Standalone Homepage | `13932882577618101661` |
| NRC | NRC Cinema — Standalone Homepage | `6601419679785046440` |

**Design system from parent project** (to reuse in generation):
- Project ID: `3884326936106951139` (APR 70 Pictures — Division Showcase)
- Design system ID: `assets/c12e1d9837594aa9be2761ce1ecf907c`

**NOT YET DONE:** Screen generation hit the context gate. Next session must complete this.

---

## What next session must do

### Priority 1: Commit this session's changes
```sh
cd /Users/marco/websites/apr70-pictures
# Archive stale handoff docs
mkdir -p docs/handoff/archive
git mv docs/handoff/sonnet-2026-05-19-stitch-round2.md docs/handoff/archive/
git mv docs/handoff/stitch-output-divisions-2026-05-18.md docs/handoff/archive/
# Stage all changes
git add web/src/components/blocks/DivisionBlock.astro
git add web/src/pages/dev/division-variants.astro
git add docs/handoff/
git commit -m "feat: add v0-slate-stack DivisionBlock variant (Back to Claude)"
git push
```

### Priority 2: TypeScript check + visual QA
```sh
cd /Users/marco/websites/apr70-pictures
pnpm --filter web typecheck
pnpm --filter web dev
# Browse to http://localhost:4322/dev/division-variants
# Verify v0-slate-stack is first, renders correctly, hover effects work
```

### Priority 3: Generate division homepage screens in Stitch (4 per division)

For each project, upload DESIGN.md first:
```sh
base64 -i DESIGN.md | tr -d '\n' > /tmp/design-b64.txt
# Then use the MCP tool: mcp__stitch__upload_design_md with projectId + base64 content
# Then: mcp__stitch__create_design_system_from_design_md
```

Then generate 4 screens per project using `mcp__stitch__generate_screen_from_text`.

**212 Pictures prompts (use designSystem `c12e1d9837594aa9be2761ce1ecf907c` or upload fresh):**

Prompt A (Title Card):
> "212 PICTURES standalone homepage. Dark background #0A0A0A. Large (212) logo SVG left-anchored, amber #824B07 and orange #E85D04. Tagline right: STORIES FROM THE URBAN MARGIN in Futura Std bold, clamp(4rem, 8vw, 9rem). Film production ledger below tagline: THE SICILIAN CORRIDOR / FEATURE / 2026 with IN PRODUCTION badge in #E85D04, CROWN HEIGHTS / SHORT / 2025 COMPLETED badge, AFTER THE BRIDGE / FEATURE DEV in #824B07. Bottom-right: BACK TO APR 70 text link. No nav, no footer. Share Tech Mono for all meta data. Zero border-radius. Full-width three-row layout."

Prompt B (Editorial):
> "212 PICTURES standalone homepage editorial variant. Ghost watermark 212 (~20rem, 4% opacity). Centered hero treatment: (212) logo at large scale, STORIES FROM THE URBAN MARGIN tagline. Film-frame registration marks at corners (12px bracket marks). Three project entries as film slate rows. Amber/orange accent. BACK TO APR 70 PICTURES link. Urban cinema aesthetic. No nav/footer."

**310 Pictures prompts:**

Prompt A (IMAX Scale):
> "310 PICTURES standalone homepage. Dark teal-black #001A1F background. 310 block logo (three square blocks 310 in Futura Std) large left. Tagline: CINEMA AT MAXIMUM APERTURE in Futura bold, teal accent #077082. Projects: PACIFIC FAULT FEATURE 2026 IN PRODUCTION, THE LONG RETURN DOC 2025 COMPLETED, MERIDIAN IN DEVELOPMENT. Technical spec aesthetic — Share Tech Mono data readout. BACK TO APR 70 PICTURES link. No nav/footer. Zero border-radius."

Prompt B (Architectural):
> "310 PICTURES standalone homepage architectural variant. Ultra-minimal. Deep teal-navy (#001A1F). 310 logo as dominant structural anchor. Precision engineering typography. Film aperture/lens motif. Blue gradient #077082 → #0077B6. Three projects as technical specifications. BACK TO APR 70 PICTURES text link. No nav/footer."

**NRC Cinema prompts:**

Prompt A (Art Film):
> "NRC CINEMA — New Renaissance Cinema standalone homepage. Navy #001F3F background, silver-grey #C8C8C8 text. NRC lettermarks (N-R-C) large display with diagonal sash band. Tagline: ART THAT REFUSES COMPROMISE. Projects: VOLTA / ARTHOUSE / 2026 IN PRODUCTION, THE CURATOR'S EYE SHORT 2025 COMPLETED. Prestige art-house aesthetic, museum catalogue meets film festival programme. Silver rules on navy. BACK TO APR 70 PICTURES link. No nav/footer."

Prompt B (Curator's Space):
> "NRC CINEMA homepage variant — deconstructed gallery aesthetic. NRC letters massive at different scales overlapping. VOLTA and THE CURATOR'S EYE as featured projects. Silver #C8C8C8 on pure black. EST. MMXXVI. Intimate, intellectual, art-film atmosphere. BACK TO APR 70 PICTURES link. No nav/footer. Zero border-radius."

### Priority 4: Wire v0-slate-stack into division page seed
After visual QA approves the variant, update seed.ts to use `v0-slate-stack` as the default division variant on `/212`, `/310`, `/nrc` pages.

---

## Files changed this session

| File | Change |
|------|--------|
| `web/src/components/blocks/DivisionBlock.astro` | Added `v0-slate-stack` variant template + CSS + JS |
| `web/src/pages/dev/division-variants.astro` | Added `v0-slate-stack` to variantMeta |
| `docs/handoff/stitch-html-round3/r3-back-to-claude-slate-stack-hover.html` | New — canonical Stitch HTML |
| `docs/handoff/stitch-html-round3/r3-back-to-claude-slate-stack-v2.html` | New — canonical Stitch HTML v2 |
| `docs/handoff/sonnet-2026-05-19-slate-stack-div-homepages.md` | This file |

---

## Stitch project inventory (all projects)

| Project | ID | Purpose |
|---------|----|---------|
| APR 70 Pictures — Division Showcase | `3884326936106951139` | Parent showcase block (done) |
| 212 Pictures — Standalone Homepage | `10388160894163022728` | Division site mockups (TODO) |
| 310 Pictures — Standalone Homepage | `13932882577618101661` | Division site mockups (TODO) |
| NRC Cinema — Standalone Homepage | `6601419679785046440` | Division site mockups (TODO) |

Design system (APR 70 parent): `assets/c12e1d9837594aa9be2761ce1ecf907c`
