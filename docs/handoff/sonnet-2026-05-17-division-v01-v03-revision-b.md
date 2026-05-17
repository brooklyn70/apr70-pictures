# Handoff: Division V0.1 + V0.3 Revision Pass B — 2026-05-17 ~1:30pm EDT

**Written by:** Claude Sonnet 4.6
**Status:** Work in progress — Marco has not yet made his final variant selection.
**Branch:** main — all commits pushed to origin/main.

---

## What was done this session

### Stroke revisions (both V0.1 and V0.3)
- Width: 3px → **6px**
- Anchor: `top:0; left:0` → **`top:8px; left:8px`** — stroke now lives inside the printer-frame (reg-marks inset)
- Travel: `height: 100%` → **`calc(100% - 16px)`** — stroke stays between top and bottom reg-marks, never exits
- Added `padding: var(--s-9) var(--s-5)` / `var(--s-8) var(--s-5)` to V0.1 card and V0.3 row — **24px left+right padding lane** so text never touches the stroke or the right edge

### V0.0 baseline removed
- Removed from `variantMeta` in `division-variants.astro` — page now shows only V0.1 and V0.3

### V0.3 logo system built
- `getDivisionLogo()` maps division name → SVG path:
  - 212 → `212_footer.svg` (360×230, 3-box amber mark)
  - 310 → `310_footer.svg` (360×230, 3-box teal/blue mark)
  - NRC → `nrc_v1.svg` (580×460, stacked initials)
- `getLogoOffsetY()` returns per-logo CSS `object-position` Y offset that crops the SVG's own internal top padding flush:
  - 212/310: `9%` (SVG content starts at y=20/230 ≈ 8.7%)
  - NRC: `17%` (SVG content starts at y=80/460 ≈ 17.4%)
- Logo replaces `h3.v03-name` text entirely — redundancy gone
- `index` span now shows only sequence number (`01`, `02`, `03`) — no code text, no tiny logo
- Logo CSS: `flex:1; height: clamp(280px, 35vw, 440px); object-fit: cover; object-position: left {per-logo offset}`
- `padding-bottom` removed from `.v03-row-top` (was creating bottom black gap)
- Row-top has no explicit height — logo drives it

### Current commits this session (newest first)
```
c771b40  fix: V0.3 logo 8x bigger, SVG padding cropped via object-position per logo
56f0075  fix: V0.3 logo fills title zone by height
f6ed756  fix: V0.3 logo fills title zone — replaces name text
4b7cb10  feat: V0.3 division logos in index slot; symmetric padding both variants
c551b2d  fix: V0.1+V0.3 stroke inside printer frame, 6px wide, text padding lane; remove V0.0
```

---

## What's NOT done — Marco must decide

### Primary decision: pick V0.1 or V0.3
Marco has not yet selected a variant to advance. The page at `/dev/division-variants` shows both for comparison.

**V0.1** — card layout. Grid: left column (seq number + meta), right column (name + taglines + desc + CTA). Printer frame. Stroke on left inside frame. Ghost watermark code in background.

**V0.3** — ledger rows. Full-width row per division. Logo (280–440px tall) in the title zone replaces the text name. Sequence number left, CTA right. Hover: stroke draws, surface lifts, CTA fades in, projects highlight.

### Once Marco selects a variant:
1. The selected variant moves into the **production Payload `DivisionBlock`** (replaces the `v0-baseline` as the default CMS-driven layout)
2. The rejected variant's markup + CSS is deleted from `DivisionBlock.astro`
3. The dev page `division-variants.astro` can be removed or archived
4. The block must be connected to real Payload data (the mock divisions in `division-variants.astro` are for preview only)
5. Run `pnpm preflight` + `pnpm build` + visual QA before NAS deploy

### V0.3 logo: possible remaining issue
Marco's last instruction mentioned eliminating black space at top and bottom. The `object-position` fix addresses the SVG's internal padding mathematically:
- 212/310: `9%` offset → clips ~20px SVG top whitespace ✓
- NRC: `17%` offset → clips ~80px SVG top whitespace ✓
- Bottom black: `padding-bottom` removed ✓

If Marco still sees residual black on review, the next agent should try adjusting `getLogoOffsetY()` values slightly (try `10%` / `18%` for more aggressive top crop) or try `object-position: left top` + negative `margin-top` approach.

### V5 filmstrip — still deferred
V5 filmstrip work is DEFERRED until V0 is signed off. No filmstrip code was touched this session.

---

## Dev environment

```sh
# Dev server is (or was) running at:
http://localhost:4323/dev/division-variants

# If not running, start with:
cd /Users/marco/websites/apr70-pictures/web && pnpm dev
```

Both `pnpm preflight` (cms/) and `pnpm build` (web/) pass cleanly as of last commit.

---

## Verification checklist for next agent

- [ ] Run `pnpm preflight` from `cms/` — confirm exits 0
- [ ] Run `pnpm build` from `web/` — confirm clean
- [ ] Dev server at `/dev/division-variants` shows V0.1 + V0.3 only
- [ ] V0.1: hover → 6px stroke draws inside printer frame, text has left+right breathing room
- [ ] V0.3: logo is large (280–440px), no top/bottom black gaps, sequence number left, CTA right
- [ ] NRC division logo in V0.3 uses `nrc_v1.svg` at `17%` offset
- [ ] Marco's variant selection drives next step

---

## Key files touched this session

| File | What changed |
|------|-------------|
| `web/src/components/blocks/DivisionBlock.astro` | Stroke geometry, padding, logo system, V0.3 row-top CSS |
| `web/src/pages/dev/division-variants.astro` | V0.0 removed, subtitle updated |
