# Google Stitch — APR 70 Pictures brief

Use this as the source-of-truth when filling out Stitch's "Start with your design" form. Paste the indicated content into each field. Logos + fonts you supply by drag-and-drop.

---

## Field 1 — Paste existing DESIGN.md

**Action:** open `/Users/marco/websites/apr70-pictures/DESIGN.md`, select all, paste into Stitch's textarea.

> The file is already in the open-source DESIGN.md standard format: YAML front matter with `colors`/`typography`/`spacing`/`rounded`/`components` tokens, then prose sections for voice, motion, layout, accessibility. Stitch will read it natively.

If Stitch trims at character limit, prefer pasting the **front matter only** (lines 1–181) and putting the rest as an upload via Field 2.

---

## Field 2 — Drag and drop files (three drop zones)

### Drop zone A: "Upload a DESIGN.md file"

Drag `DESIGN.md` from `/Users/marco/websites/apr70-pictures/DESIGN.md`. (Same file as Field 1 — use this if the textarea trims.)

### Drop zone B: "Upload code, images, fonts and logos"

Build a zip/folder with:

1. **Fonts** (Marco supplies):
   - `Futura Std Bold` (`.woff2` or `.otf`)
   - `Futura Std Medium`
   - `Futura Std Heavy` (if available — used for "SLATE" / mega-scale)
   - `Barlow-Light.woff2` (weight 300 — body voice)
   - `Barlow-Medium.woff2` (weight 500 — UI labels)
   - `Barlow-SemiBold.woff2` (weight 600 — H4)
   - `ShareTechMono-Regular.woff2` (slate / filmstrip mono)

2. **Logos** (Marco supplies — already vendored at `web/public/brand/apr70-logos/`):
   - Master holding-company lockup (APR 70 Pictures)
   - (212) Pictures division lockup
   - (310) Pictures division lockup
   - New Renaissance Cinema (NRC) division lockup
   - Sprocket / perforation icon
   - Each in dark-mode and light-mode variants if available

3. **Code excerpts** I prepared for you below in this doc — paste these as `.txt` or `.css` files into the upload bundle:
   - `tokens.css` (the current CSS variable system)
   - `BlockRenderer.astro` (the block-switch architecture)
   - `DivisionBlock-current.astro` (what Stitch is being asked to rethink)

4. **Reference imagery** (optional but strongly recommended) — pull 4–6 stills from `/Users/marco/websites/apr70-website-reference-repository/` that exemplify the brand mood (Vignelli, Munari, Saul Bass, vintage cinema magazines).

### Drop zone C: "Upload a .fig file"

Skip — no Figma source yet. Stitch will work from the DESIGN.md + code + logos.

---

## Field 3 — Public GitHub repository

```
https://github.com/brooklyn70/apr70-pictures
```

(Repo is public; Stitch can read the block library, the design tokens, the existing division-variant attempts in `web/src/components/dev/`, and the reference handoff docs.)

---

## Field 4 — Add website

```
https://apr70.com
```

> Note: production not yet shipped. If Stitch fails on this, leave the field blank or substitute the v2 site at `https://www.apr70.com` if it's still up. The repo + DESIGN.md is the authoritative source either way.

---

## Field 5 — Additional instructions

Paste this verbatim:

```
GOAL — design 3 fresh variants of the Division Showcase section for apr70.com.

Context. APR 70 Pictures has THREE divisions: (212) Pictures, (310) Pictures, and New Renaissance Cinema (NRC). The Division Showcase is the homepage section that introduces all three. Five variants have been built already in /web/src/components/dev/DivisionVariantsV*.astro — none satisfy the director (Marco). The current best-effort is V0.3 (stacked rows with header alignment debugged) but it lacks the editorial weight the brand demands. I need fresh ideas, not iterations on V0.3.

Constraints (non-negotiable, from DESIGN.md):
- No rounded corners (0px radius everywhere except the 2px sprocket perforation hole).
- No drop shadows. No backdrop-filter blur. Flat printed-slate system; elevation comes from contrast + whitespace.
- No gradients as surfaces. Gradients only as directional reveals.
- Typography is locked: Futura Std for display, Barlow for body, Share Tech Mono for keycodes/metadata only.
- Color tokens are locked: 212-amber, 212-sicilian-orange, 310-imax, 310-sicilian-blue, nrc-grey, nrc-navy on a pure black canvas. Light mode is a first-class mode — every variant must work in both [data-theme="light"] and dark from day one.
- No emoji anywhere. No "transition: all" — animate only opacity + transform.
- 8px spacing grid (4/8/12/16/24/32/48/64/96/128/192). No off-grid values.
- Section must render on mobile from 375px through desktop 1440px with clamp().

What I want from each variant:
- A distinctive layout idea (not a tweak on stacked rows).
- A clear way to expose each division's name, sequence number (01/02/03), color identity, tagline, and a "see projects" link or CTA.
- A motion sketch — describe how the section reveals on scroll (GSAP-based, signature curve cubic-bezier(0.16, 1, 0.3, 1)). No bounces, no springs.
- Both dark and light treatments.

Reference vocabulary to draw from: Massimo Vignelli (transit maps, grids), Bruno Munari (children's books, square economy), Saul Bass (title sequences), 35mm filmstrip artifact (sprocket perforations are part of our visual DNA), 1930s-40s cinema trade magazines.

What the variants should NOT be:
- Card grids with shadowed tiles.
- Hero-slider/carousel patterns.
- Anything that uses "modern SaaS" tropes (gradient hero, glassmorphism, oversized rounded buttons).
- Anything with stock-iconography or generic illustrations.

Bonus if a variant uses the sprocket/filmstrip motif structurally (not just decoratively) — e.g., the three divisions are presented as three frames of a strip, with perforation rails running through them.

Output: send back HTML/CSS for each variant scoped to a single section element, plus a one-paragraph rationale per variant.
```

---

## Code excerpts to include in Drop zone B

Save each block below as a `.txt` (or `.css` / `.astro` if Stitch prefers extensions) and include in the upload bundle.

### `tokens.css` excerpt

```css
/* Canonical APR 70 design tokens — from web/src/styles/tokens.css */
:root {
  /* Brand */
  --color-212-amber: #824B07;
  --color-212-sicilian-orange: #E85D04;
  --color-310-imax: #077082;
  --color-310-sicilian-blue: #0077B6;
  --color-nrc-grey: #C8C8C8;
  --color-nrc-navy: #001F3F;

  /* Dark mode (default) */
  --bg-0: #000000;
  --bg-1: #0A0A0A;
  --bg-2: #111111;
  --bg-3: #1A1A1A;
  --fg-1: #FFFFFF;
  --fg-2: #CCCCCC;
  --fg-3: #8C8C8C;
  --fg-4: #595959;
  --fg-5: #333333;
  --fg-6: #1A1A1A;

  /* Spacing — 8px grid */
  --s-1: 4px;
  --s-2: 8px;
  --s-3: 12px;
  --s-4: 16px;
  --s-5: 24px;
  --s-6: 32px;
  --s-7: 48px;
  --s-8: 64px;
  --s-9: 96px;
  --s-10: 128px;
  --s-11: 192px;

  /* Type families */
  --font-display: "Futura Std", Futura, "Trebuchet MS", sans-serif;
  --font-body: Barlow, "Helvetica Neue", system-ui, sans-serif;
  --font-mono: "Share Tech Mono", "Courier New", monospace;

  /* Motion */
  --ease-film: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-std:  cubic-bezier(0.4, 0, 0.2, 1);
  --dur-quick: 0.25s;
  --dur-base:  0.35s;
  --dur-slow:  0.55s;
  --dur-reel:  0.7s;
}

[data-theme="light"] {
  --bg-0: #FAFAF8;
  --bg-1: #F5F5F2;
  --bg-2: #EBEBE7;
  --bg-3: #DDDDD8;
  --fg-1: #1A1A1A;
  --fg-2: #333333;
  --fg-3: #595959;
  --fg-4: #8C8C8C;
  --fg-5: #CCCCCC;
  --fg-6: #EBEBE7;
}
```

### Division data shape (what Stitch's variants must render)

```ts
// One DivisionBlock receives an array of three divisions.
type Division = {
  sequence: "01" | "02" | "03";
  shortName: "212" | "310" | "NRC";
  fullName: "(212) Pictures" | "(310) Pictures" | "New Renaissance Cinema";
  tagline: string;       // e.g. "Auteur. Driven. Development."
  primaryColor: "212-amber" | "310-imax" | "nrc-grey";
  accentColor:  "212-sicilian-orange" | "310-sicilian-blue" | "nrc-navy";
  href: "/212" | "/310" | "/nrc";
  logoUrl: string;       // SVG path
};
```

### Block contract (so Stitch knows how the section plugs in)

```astro
---
// File: web/src/components/blocks/DivisionBlock.astro
// The Section is one block in a stacked layout — must be self-contained,
// no global side effects, no shared state with adjacent blocks.
interface Props {
  variant: "v0" | "v1" | "v2" | "v3" | "v4" | "v5" | /* new variants from Stitch */;
  divisions: Division[];
  heading?: string;        // optional section heading
  eyebrow?: string;        // optional small eyebrow above heading
}
const { variant, divisions, heading, eyebrow } = Astro.props;
---

<section class={`division-block division-block--${variant}`}>
  <!-- Stitch's HTML/CSS for the chosen variant goes here -->
</section>

<style>
  /* Stitch's CSS, scoped via .division-block--<variantId> */
</style>
```

---

## Workflow once Stitch returns the variants

1. Stitch outputs HTML + CSS + rationale per variant.
2. Marco picks favorite(s) — usually 1, sometimes 2 to A/B in `/dev/division-variants`.
3. Hand the chosen HTML/CSS to Opus on the website repo. Opus wires it into `DivisionBlock.astro` as `variant: "v6"` / `"v7"` and registers it in the dev preview route.
4. Marco reviews live at `http://localhost:4322/dev/division-variants`.
5. If approved, Opus locks it as the production variant and deletes the unused V0.x rejects.

---

## What you (Marco) send Stitch in this session — checklist

- [ ] `DESIGN.md` pasted into Field 1 (or dropped in Drop zone A)
- [ ] Fonts bundle in Drop zone B
- [ ] Logos bundle in Drop zone B
- [ ] `tokens.css` / `division-data-shape.ts` / `block-contract.astro` excerpts (from this doc) in Drop zone B
- [ ] Reference imagery from `apr70-website-reference-repository/` in Drop zone B (optional, recommended)
- [ ] GitHub repo URL in Field 3
- [ ] `https://apr70.com` in Field 4 (or skip)
- [ ] **Additional instructions** block from this doc pasted verbatim into Field 5

When Stitch finishes, save the output to `docs/handoff/stitch-output-divisions-<date>.md` and hand to Opus.
