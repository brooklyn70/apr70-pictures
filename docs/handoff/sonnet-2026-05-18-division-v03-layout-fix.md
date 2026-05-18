# Handoff: Division V0.3 Layout Fix — 2026-05-18 ~05:30 EDT

**Written by:** Claude Sonnet 4.6
**Status:** Code changes applied — **uncommitted** (bash blocked by context gate this session). Needs `git add -A && git commit` before NAS deploy.
**Branch:** main

---

## What changed this session

### V0.3 — split header + balance fixes

**Logo sources updated** (`getDivisionLogo()`):
- 212: `212_footer.svg` → `212_hero.svg`
- 310: `310_footer.svg` → `310_hero.svg`
- NRC: stays `nrc_v1.svg` (no hero variant exists)

**Row markup restructured** — top block now a 50/50 grid:
- Left column: sequence number (`01`, `02`, `03`) + logo image
- Right column: tagline lines + hover-reveal CTA
- Bottom: project list (no longer inside `v03-row-body`)
- Removed old `.v03-row-top` / `.v03-row-body` structure entirely

**Border lines removed:**
- Removed `border-bottom` on `.v03-row-header` (was cutting between logo/taglines and projects)
- Removed `border-top` on `.v03-project` (was putting a line above every project item)

**Tagline sizing:**
- Font: `clamp(2rem, 4vw, 4rem)` — down from the previous `5rem` max
- Added `white-space: nowrap` — "New York." and "Los Angeles." stay on one line
- `line-height: 0.95` — tight stacking

**Logo sizing:**
- Height: `clamp(100px, 8.5vw, 130px)` — calibrated so 2 tagline lines ≈ logo height
- `max-width: 420px` (up from 360px)
- `object-fit: contain; object-position: left center`

**NRC taglines** in dev mock: `['Features.', 'Auteur.']` → `['Features.', 'Tour.']`

**Project rows** — font bumped:
- Row: `clamp(0.75rem, 1.1vw, 0.875rem)` (was `var(--type-micro)`)
- Title: `clamp(0.8125rem, 1.2vw, 0.9375rem)` with `flex: 1`
- Badge: `clamp(0.75rem, 1vw, 0.8125rem)` in `var(--div-color)`

---

## Still pending — Marco must decide

### Primary decision: pick V0.1 or V0.3
Dev page: `http://localhost:4323/dev/division-variants`

**V0.1** — card layout. Left col: sequence number + format meta. Right col: name + taglines + desc + CTA. Printer frame. Stroke draws top→bottom on hover at 0.9s. Ghost watermark fades in on hover.

**V0.3** — ledger rows (current session's work). Top half split: hero logo left, taglines right (single-line, large display type, balanced with logo). Bottom: project list. Hover: stroke draws, logo nudges right, taglines intensify, CTA fades in.

### If further V0.3 tweaks needed:
The main size values to adjust are all in the `<style>` block of `DivisionBlock.astro`:
- Tagline font: `.v03-tagline { font-size: clamp(2rem, 4vw, 4rem) }` — tune the `4vw` midpoint
- Logo height: `.v03-logo { height: clamp(100px, 8.5vw, 130px) }` — tune the `8.5vw` midpoint
- These two scale together: `logo-height ≈ 2 × font-size × 0.95`

### Once Marco selects a variant:
1. Selected variant moves into production `DivisionBlock` (replaces v0-baseline as the CMS default)
2. Rejected variant markup + CSS deleted
3. `division-variants.astro` dev page can be archived
4. Block connected to real Payload data (mock divisions in `division-variants.astro`)
5. `pnpm preflight` (cms/) + `pnpm build` (web/) + visual QA before NAS deploy

---

## Git state

**Uncommitted changes** — bash was blocked by context gate. Next agent must commit:
```sh
git add web/src/components/blocks/DivisionBlock.astro \
        web/src/pages/dev/division-variants.astro \
        BRIEF.md \
        docs/handoff/sonnet-2026-05-18-division-v03-layout-fix.md
git commit -m "feat(v03): split header layout, hero SVGs, remove interior borders, balance logo/text"
```

Also manually archive the previous handoff:
```sh
mv docs/handoff/sonnet-2026-05-17-division-v01-v03-revision-c.md docs/handoff/archive/
```

---

## Dev environment

```sh
cd /Users/marco/websites/apr70-pictures/web && pnpm dev
# http://localhost:4323/dev/division-variants
```

---

## Key files

| File | What changed |
|------|-------------|
| `web/src/components/blocks/DivisionBlock.astro` | Logo sources (hero SVGs), V0.3 markup restructured, V0.3 CSS rewritten (split header, removed borders, rebalanced sizes) |
| `web/src/pages/dev/division-variants.astro` | NRC taglineLines updated to `['Features.', 'Tour.']` |
