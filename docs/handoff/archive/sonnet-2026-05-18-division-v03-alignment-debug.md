# Handoff: Division V0.3 Alignment Debug — 2026-05-18 ~05:45 EDT

**Written by:** Claude Sonnet 4.6
**Status:** Code changes applied — **uncommitted** (bash blocked by context gate). Next agent must commit before anything else.
**Branch:** main

---

## MARCO'S EXACT COMPLAINTS THIS ROUND (read carefully)

1. **Project border lines were removed without being asked** — they are restored. Do NOT touch them again unless Marco specifically asks.
2. **Logo and text completely off-balance** — logo tiny, text enormous, tops not aligned. Root cause diagnosed and fix applied (see below).
3. **Do not do things Marco doesn't ask for.** Only change what is explicitly requested.

---

## What changed this session

### Fixes in `DivisionBlock.astro`

**1. Project borders restored**
`.v03-project` `border-top: 1px solid var(--rule)` is back. Also restored `border-top-color` transition on hover. These were mistakenly removed last round.

**2. Alignment root cause fixed**

The previous layout had two problems that stacked together:

**Problem A — `align-items: center`:** The header grid was centering both columns vertically relative to each other. This meant the top of the logo column and the top of the tagline column were NOT aligned — they were offset by whatever difference existed in each column's total height. Fixed to `align-items: start`.

**Problem B — seq number above logo in DOM flow:** The sequence number `01/02/03` was a block element above the logo inside `.v03-header-logo`. This pushed the logo DOWN by the height of the seq number + gap (~20–28px) relative to the taglines which had no such offset at the top. Fixed: seq number is now `position: absolute; top: 0; left: 0` within `.v03-header-logo`, so it is out of flow. The logo renders at the very top of the column, aligning with the first tagline.

### Debug grid added to dev page (`division-variants.astro`)

A third section at the bottom of `http://localhost:4323/dev/division-variants` renders the V0.3 block with a numbered horizontal grid overlay (canvas-based, red lines every 20px, brighter every 100px, numbers on each line).

**How to use the debug grid:**
1. Load `http://localhost:4323/dev/division-variants` in a browser
2. Scroll to the bottom — "V0.3 — ALIGNMENT DEBUG GRID" section
3. Look at the first row (212 division)
4. Find the red grid line number where the TOP of the `(212)` logo image starts
5. Find the red grid line number where the TOP of "NEW YORK." text starts
6. If those two numbers are the same (or within 2–4px) → aligned ✓
7. If they differ → see the tuning section below

---

## If alignment still needs tuning after these fixes

The two controls are in `DivisionBlock.astro` `<style>`:

**Option A — add padding-top to `.v03-header-text`:**
If the logo top is LOWER than the tagline top (meaning the taglines start above the logo), add padding to push taglines down:
```css
.v03-header-text {
  padding-top: Xpx; /* X = grid line difference */
}
```

**Option B — add padding-top to `.v03-logo`:**
If the tagline top is LOWER than the logo top (less likely after the fix), push the logo down:
```css
.v03-logo {
  padding-top: Xpx;
  height: calc(clamp(100px, 8.5vw, 130px) - Xpx); /* compensate */
}
```

**Logo and text sizing (for balance):**
The math: `logo-height ≈ 2 × font-size × line-height`
- Current font-size: `clamp(2rem, 4vw, 4rem)` → at 1440px: 4rem = 64px
- Current line-height: `0.95`
- Target logo height: `2 × 64 × 0.95 = 121.6px`
- Current logo height: `clamp(100px, 8.5vw, 130px)` → at 1440px: 8.5vw = 122px ✓

The math checks out. The alignment fix (seq number out of flow + `align-items: start`) should be the actual fix. Verify with the debug grid.

---

## Git state — MUST COMMIT FIRST

Bash was blocked this session. Next agent runs:
```sh
# Archive old handoffs
mv docs/handoff/sonnet-2026-05-17-division-v01-v03-revision-c.md docs/handoff/archive/
mv docs/handoff/sonnet-2026-05-18-division-v03-layout-fix.md docs/handoff/archive/

# Commit all changes
git add web/src/components/blocks/DivisionBlock.astro \
        web/src/pages/dev/division-variants.astro \
        BRIEF.md \
        docs/handoff/
git commit -m "fix(v03): restore project borders, fix logo/text alignment, add debug grid"
```

---

## Dev environment

```sh
cd /Users/marco/websites/apr70-pictures/web && pnpm dev
# http://localhost:4323/dev/division-variants
# Scroll to bottom for debug grid section
```

---

## Key files

| File | What changed |
|------|-------------|
| `web/src/components/blocks/DivisionBlock.astro` | `.v03-project` border restored; `.v03-row-header` `align-items: start`; `.v03-header-logo` `position: relative`; `.v03-num` absolutely positioned so logo starts at column top |
| `web/src/pages/dev/division-variants.astro` | Third section added: debug grid with canvas overlay (red horizontal lines every 20px, numbered) |

---

## Still pending — Marco must decide

Once alignment is confirmed visually with the debug grid:
1. Marco picks V0.1 or V0.3
2. Winning variant → production `DivisionBlock` (CMS default)
3. Losing variant + debug dev page → deleted
4. Block connected to real Payload data
5. `pnpm preflight` (cms/) + `pnpm build` (web/) + visual QA → NAS deploy
