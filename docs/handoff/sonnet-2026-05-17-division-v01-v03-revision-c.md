# Handoff: Division V0.1 + V0.3 Revision Pass C — 2026-05-17 ~7:30pm EDT

**Written by:** Claude Sonnet 4.6
**Status:** Fixes applied — awaiting Marco's final variant selection.
**Branch:** main — all commits pushed to origin/main.

---

## What was done this session

### V0.1 fixes
- **Stroke speed**: `1.5s` → `0.9s` — faster draw feels snappier on hover
- **Ghost fade-in on hover**: `.v01-ghost` at rest `opacity: 0.04`, on hover `opacity: 0.14` with `0.5s ease` transition — the watermark code letter bleeds in when you roll over the card

### V0.3 fixes
- **Logo display — `object-fit: cover` → `contain`**: The previous approach scaled the 360×230 footer SVG to fill a 280–440px tall container, which zoomed in 3× and showed only a cropped fragment of the 3-box mark (looked like the hero logo). Switched to `object-fit: contain; object-position: left center` — the full logo is now always visible, never clipped.
- **Logo height reduced**: `clamp(280px, 35vw, 440px)` → `clamp(140px, 20vw, 260px)` — the prior height was forcing the cover zoom that caused cropping. New range shows the full logo at a substantial but not overwhelming size.
- **Removed `getLogoOffsetY()` and inline style**: The per-logo Y-offset hacks (`9%` / `17%`) were compensation for `cover` mode. They're gone. No inline `object-position` on `<img>` elements.
- **Hover during scroll fixed**: CSS `:hover` does not update while the browser is scrolling — this caused the hover state to disappear or be delayed when scrolling up through the rows. Fix: replaced all `.v03-row:hover` selectors in CSS with `.v03-row.is-hovered`, and added a JS handler that:
  - Tracks `pointermove` for current mouse position
  - On `window.scroll` fires a `requestAnimationFrame` that iterates all `.v03-row` elements, checks `getBoundingClientRect()` against the stored mouse position, and toggles `is-hovered`
  - Also uses `mouseenter`/`mouseleave` for normal (non-scroll) interactions
- **Deduplicated `.v03-logo` CSS block**: There were two `.v03-logo` rule blocks. Merged into one (dimensions + transition together).

---

## Current git state

Committed and pushed: `5b7bb03` on main. Clean working tree.

---

## Still pending — Marco must decide

### Primary decision: pick V0.1 or V0.3
Dev page: `http://localhost:4323/dev/division-variants`

**V0.1** — card layout. Left col: sequence number + format meta. Right col: name + taglines + desc + CTA. Printer frame. Stroke draws top→bottom on hover at 0.9s. Ghost watermark fades in on hover.

**V0.3** — ledger rows. Full-width row per division. Logo (contain, 140–260px tall) in the title zone — the 3-box mark for 212/310, NRC initials for NRC. Sequence number left, CTA right (fades in on hover). Hover works correctly during scroll now.

### Once Marco selects a variant:
1. Selected variant moves into production `DivisionBlock` (replaces v0-baseline as the CMS default)
2. Rejected variant markup + CSS deleted
3. `division-variants.astro` dev page can be archived
4. Block connected to real Payload data (mock divisions in `division-variants.astro`)
5. `pnpm preflight` (cms/) + `pnpm build` (web/) + visual QA before NAS deploy

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
| `web/src/components/blocks/DivisionBlock.astro` | V0.1 stroke speed + ghost hover; V0.3 logo contain/sizing, scroll-aware hover JS, CSS :hover → .is-hovered |
