---
version: canon-2026-07-27
name: APR 70 Pictures
description: >
  Visual identity for APR 70 LLC, a New York film and television production
  company founded by Marc Andrew Caruso in 2026. Three divisions share one
  visual DNA: true-gauge film-perforation geometry, Italian Modernist
  typography (Jost + Barlow; the prior commercial geometric retired for licensing 2026-07-27),
  and the discipline of Vignelli and Munari. This is the
  portable canonical spec for v3 (Astro + Payload). Token keys map 1:1 to
  the Lexical Color Injector plugin (data-color="212-amber" etc.).
  Precise, purposeful, built to last.

colors:
  # Primary world — pure black is the default canvas
  primary: "#000000"
  black: "#000000"
  white: "#FFFFFF"

  # Division accent tokens — keys match the Lexical Color Injector plugin
  # Stored in markup as data-color="{key}". CSS var: --color-{key}.
  "212-amber": "#824B07"            # (212) Pictures primary
  "212-sicilian-orange": "#E85D04"  # (212) accent / CTA
  "310-imax": "#077082"             # (310) Pictures primary
  "310-sicilian-blue": "#0077B6"    # (310) blue accent
  "nrc-grey": "#C8C8C8"             # NRC primary
  "nrc-navy": "#001F3F"             # NRC deep navy

  # Light mode — clean off-white surface (opt-in via [data-theme="light"])
  light-bg: "#FAFAF8"
  light-fg: "#1A1A1A"

  # Foreground ramp on black (dark mode)
  fg-1: "#FFFFFF"
  fg-2: "#CCCCCC"
  fg-3: "#8C8C8C"
  fg-4: "#595959"
  fg-5: "#333333"
  fg-6: "#1A1A1A"

  # Background ramp (dark mode)
  bg-0: "#000000"
  bg-1: "#0A0A0A"
  bg-2: "#111111"
  bg-3: "#1A1A1A"

  muted: "#888888"

typography:
  # Display — Jost Bold (SIL OFL), all-caps, tight tracking, crushed leading
  hero:
    fontFamily: Jost
    fontSize: 8rem
    fontWeight: 700
    lineHeight: 0.85
    letterSpacing: -0.02em

  h1:
    fontFamily: Jost
    fontSize: 4rem
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: -0.02em

  h2:
    fontFamily: Jost
    fontSize: 3rem
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.02em

  h3:
    fontFamily: Jost
    fontSize: 2rem
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: -0.02em

  h4:
    fontFamily: Barlow
    fontSize: 1.25rem
    fontWeight: 600
    letterSpacing: 0.1em

  body-lg:
    fontFamily: Barlow
    fontSize: 1.125rem
    fontWeight: 300
    lineHeight: 1.8

  body-md:
    fontFamily: Barlow
    fontSize: 1rem
    fontWeight: 300
    lineHeight: 1.7

  body-sm:
    fontFamily: Barlow
    fontSize: 0.875rem
    fontWeight: 300
    lineHeight: 1.7

  eyebrow:
    fontFamily: Barlow
    fontSize: 0.625rem
    fontWeight: 500
    letterSpacing: 0.4em
    lineHeight: 1.0

  keycode:
    fontFamily: Share Tech Mono
    fontSize: 0.5625rem
    fontWeight: 400
    letterSpacing: 0.55em
    lineHeight: 1.0

  label-caps:
    fontFamily: Barlow
    fontSize: 0.75rem
    fontWeight: 500
    letterSpacing: 0.2em
    lineHeight: 1.2

  meta-mono:
    fontFamily: Share Tech Mono
    fontSize: 0.75rem
    fontWeight: 400
    letterSpacing: 0.3em

spacing:
  s-1: 4px
  s-2: 8px
  s-3: 12px
  s-4: 16px
  s-5: 24px
  s-6: 32px
  s-7: 48px
  s-8: 64px
  s-9: 96px
  s-10: 128px
  s-11: 192px

rounded:
  none: 0px
  hole: 2px        # The ONLY permitted curvature — sprocket holes
  xs: 2px
  sm: 4px

components:
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.fg-4}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.none}"
    padding: "{spacing.s-3}"

  button-solid:
    backgroundColor: "{colors.white}"
    textColor: "{colors.black}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.none}"
    padding: "{spacing.s-3}"

  card:
    backgroundColor: transparent
    textColor: "{colors.fg-2}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: "{spacing.s-6}"

  sprocket:
    backgroundColor: transparent
    rounded: "{rounded.hole}"
    size: 13px

  filmstrip-rail:
    backgroundColor: "{colors.bg-1}"
    textColor: "{colors.fg-3}"
    typography: "{typography.keycode}"
    rounded: "{rounded.none}"
    height: 32px
---

# APR 70 Pictures — Design System (v3)

> Precise, purposeful, and built to last.

This document is the canonical design specification for APR 70 LLC, v3. It governs the website, decks, stationery, division logos, and any future surface the company touches. Tokens in the front matter are normative — color keys map 1:1 to the Lexical Color Injector plugin and the CSS variables in `web/src/styles/tokens.css`. The prose below explains *why* those values exist and how to apply them in contexts the tokens alone cannot describe.

This file is portable. Any agent — Claude, Gemini, Cursor, a logo generator, a video editor — should be able to read this file alone and produce output consistent with APR 70's visual identity, with no project-specific onboarding.

## v3 stack at a glance

- **Frontend:** Astro (HTML-first, vanilla CSS via `tokens.css`). React islands for interactive blocks via `client:idle` or `client:visible`.
- **Backend:** Payload v3 (Postgres). Standalone Node service. Lexical editor with D-7 inline blocks + Color Injector plugin.
- **Architecture:** Block-based, editor-authored layouts. Every page is `<BlockRenderer blocks={page.layout} />`. There are no per-page React templates. The block library is 11 reusable components (Hero, RichText, TwoCol, Grid, CTA, Quotes, Filmstrip, Division, Stats, Divider, plus interactive islands).
- **Light/dark dual mode:** Every block must render correctly in both modes from day one. The `[data-theme="light"]` selector block flips the `--fg-*` and `--bg-*` ramps.

## Overview

APR 70 is Italian Modernist discipline applied to a film company. The reference set is Massimo Vignelli's transit maps, Bruno Munari's children's books, Saul Bass's title sequences, and the physical artifact of 35mm film itself. The world is black. The grid is 8px. The corners are square. The cursor is a crosshair, not a pointer — this is a viewfinder.

The company is structured as three specialized divisions under one holding entity. Each division has its own focus, its own assigned color, and (post-v3 launch) its own logo. The shared DNA is non-negotiable: Jost headings, Barlow body, sprocket-perforated rails, the same set of motion curves. The variation is the accent color, the named "city" identity, and the editorial inflection of the work each division produces.

The name "APR 70" is not an acronym. It is a mark referencing April 1970, a date rooted in the founder's Sicilian heritage. The numeric form was chosen for international clarity; the cadence was chosen for cinematic weight.

## Voice & Content

The system extends past visuals — voice is part of the identity and applies to every surface that bears the mark.

**Tone.** Declarative. Trade-press-literate. Zero marketing slop. The company writes like a union crew slate — each line earns its place. It uses its own name in the third person. "We" appears rarely, and when it does, it is plural-of-one: Marc is the sole member.

**Prohibitions.**
- No emoji. Anywhere. Ever. This is an absolute rule (CLAUDE.md hard rule #4).
- No exclamation points.
- No em-dash for dramatic effect — periods do that work.
- No "empowering storytellers," "transforming the industry," or any of the world-salad vocabulary of contemporary marketing copy.
- No testimonials walls. No logos-of-partners grids. No press-quote carousels.

**Signature phrases.**
- "Precise, purposeful, and built to last."
- "Auteur. Driven. Development."
- "Three divisions. One vision."
- "The classics never go out of style."

**Casing.** All-caps for labels, eyebrows, navigation, metadata, keycodes, CTAs. Sentence or Title case for headlines and body. Metadata is monospaced mono caps — reads as production slate, not typographic texture.

## Colors

The palette is anchored by pure black and pure white. Everything else is a deliberate accent.

**Primary world.** Black `#000000` is the default canvas. White `#FFFFFF` is the default ink in dark mode. There is no "off-black" or "near-white" used as a primary surface — those are functional darks for filmstrip glows and reverse states only.

**Division accents.** Each division has a primary color and (where used) a secondary accent. Token keys match the Lexical Color Injector — the Payload editor stores them as `data-color="{key}"` in markup.

- **(212) Pictures**
  - `212-amber` (`#824B07`) — primary. The color of a brick-front Brooklyn brownstone in late afternoon, of rust on a fire escape, of a Northeastern winter sun on limestone. Not orange, not brown — the color sits exactly between, and the saturation is intentionally muted.
  - `212-sicilian-orange` (`#E85D04`) — accent / CTA. Sicilian heat. Reserved for action elements and the active navigation numeral.

- **(310) Pictures**
  - `310-imax` (`#077082`) — primary. The color of Pacific water on an overcast morning, of an unlit Hollywood marquee, of inked carbon paper. Cool, deliberate, slightly Bay-of-Naples.
  - `310-sicilian-blue` (`#0077B6`) — secondary accent. Used on cool-variant sprocket lockups.

- **New Renaissance Cinema (NRC)**
  - `nrc-grey` (`#C8C8C8`) — primary. The color of unbleached cotton, of cinema-screen white before the projector strikes, of a marble bust photographed under flat north light.
  - `nrc-navy` (`#001F3F`) — secondary accent. Deep, near-black blue. The dark inkwell counterweight to the offwhite primary.

**Light mode.** A clean off-white surface — `#FAFAF8` background, `#1A1A1A` text. Activated via the `[data-theme="light"]` selector. Light mode is a first-class mode in v3 — every block must work in both from day one. It is not a stylistic afterthought, it is a switch.

**Gradients.** No gradients as surfaces. Gradients are permitted only as directional reveals — a teal fade to transparent on a rule, a corner-accent bleed at the bottom-right of a page. Never as a button fill, never as a card background.

## Typography

Two voices: Jost Bold for display, Barlow 300 for body. Mono is Share Tech Mono — only for filmstrip keycodes and slate metadata.

**Jost** (SIL OFL, self-hosted variable — the house geometric since the 2026-07-27 retype; the prior commercial face is retired and quarantined) is the display voice across all three divisions. Bold (700) for primary headings, Medium (500) for tertiary, Heavy (900) reserved for the rare massive page-anchor display ("SLATE", "CRAFT OF CONSTRAINT"). There is no condensed cut; condensed slots tighten tracking instead.

**Barlow** is the body voice. Default weight is 300 — light. This is intentional and counterintuitive: combined with generous line-height (1.7–1.8) and the all-caps Jost headings above, the lightness produces editorial calm, not weakness. UI labels rise to 500 or 600. Never use Barlow Bold for body text.

**Tracking is a primary expressive tool.** Eyebrow micro-label at `0.4em` is the widest. All-caps display headlines tighten to `-0.02em`. Body is exactly `0` tracked. Mono keycodes at `0.55em` — they read as artifact, not text.

**Crushed leading on display.** Headings run at `0.85–1.0` line-height. Generous on body at `1.7–1.8`. The contrast — tight on display, loose on body — is part of the rhythm.

## Spacing & Layout

8px grid. The scale is `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 / 192`. No off-grid spacing. If you find yourself wanting `15px` or `30px`, you are wrong — return to the scale.

Section padding is generous. Minimum vertical rhythm is 96px on desktop, 48px on mobile. Don't crowd.

Content max-width is 1200px, centered. Horizontal padding is a fluid clamp: `clamp(1.5rem, 5vw, 4rem)`. Mobile-first: all CSS designed for 375px–1440px with `clamp()`. No desktop-first code (CLAUDE.md hard rule #9).

## Borders, Corners, Shadows

**No drop shadows.** Anywhere. Ever. This is a flat, printed, slate-on-black system. Elevation is communicated through contrast and whitespace, not blur.

**No backdrop-filter blur.** Ever. If text needs legibility over imagery, dim the image with a black overlay at 40–70%, do not blur.

**No rounded corners.** Default radius is 0. The single exception is the film perforation, which is never a decorative rectangle: perfs are drawn at true SMPTE gauge — BH-1866 (2.794×1.854 mm, flat edges, curved sides; the camera-negative hole and the wordmark's punch) or KS-1870 (2.794×1.981 mm, 0.25 mm corner radius; print stock, used in strip/band devices) — at true pitch (4.740/4.750 mm). Dimension source: the Perf & Pitch research library (design-source/retype-2026-07/research/).

**Hairline borders.** 1px in low-opacity white `rgba(255,255,255,0.08)` on dark surfaces, low-opacity ink on light. Rule strength steps up to `rgba(255,255,255,0.20)` on hover.

## Motion

**Easing.** The signature curve is `cubic-bezier(0.16, 1, 0.3, 1)` — "film advance." Reveals and entrances ride this curve. State changes use the standard ease `cubic-bezier(0.4, 0, 0.2, 1)`.

**Durations.** `0.25s` quick (state changes), `0.35s` base, `0.55s` slow, `0.7s` reel-style reveals, `1s` epic (hero logo reveal).

**Signature reveal.** `fadeUp` — opacity `0→1` plus `translateY(12px→0)` over 0.8–1.0s on the film-advance curve.

**No `transition: all`** (CLAUDE.md hard rule #3). Only `transform`, `opacity`, and explicitly-named properties animate.

**GSAP only** for scripted animation (CLAUDE.md hard rule #7). No Framer Motion, no other libraries.

**No bounces. No springs. No overshoot.** The camera moves precisely or not at all.

```yaml
easing-out: cubic-bezier(0.16, 1, 0.3, 1)
easing-in:  cubic-bezier(0.4, 0, 0.2, 1)
duration-quick: 0.25s
duration-base:  0.35s
duration-slow:  0.55s
duration-reel:  0.7s
duration-epic:  1s
```

**Layout constants:**

```yaml
maxContent: 1200px
paddingX: clamp(1.5rem, 5vw, 4rem)
filmstripHeight: 32px
navHeight: 62px
```

## Iconography

APR 70 is an anti-icon system.

Wherever a conventional UI would use a pictogram, this system uses either (a) a numeric prefix (`01`, `02`), (b) a monospaced keycode label, or (c) the sprocket rail itself. Icons are not used to decorate — only to identify production artifacts.

**No icon font.** No Lucide. No Heroicons. No Font Awesome. No emoji. No unicode dingbats.

If an icon must exist (external-link, play, close), it is rendered as inline SVG on a 24×24 grid, 1.25–1.5px stroke, `currentColor`, no fill, `stroke-linecap: square`. Flag it in review.

## v3 Block Library — visual standards

The 11 blocks share these rules. When adding a new block, anchor it to these.

1. **HeroBlock** — heading (h1 token), subtext (body-lg), media (full-bleed at ≤60% black overlay). Variants: default, split, fullscreen, slider-auto, slider-curated.
2. **RichTextBlock** — Lexical body with D-7 inline blocks + mega-scale toggle. Color injector handles inline accent runs via `data-color="{key}"`.
3. **TwoColBlock** — left heading (h2), right body (body-md). Ratios: 1-3, 1-1, 1-2.
4. **GridBlock** — array of cards with media + title + description. Hairline borders, no shadows, no rounding.
5. **CTABlock** — heading + buttons (solid, ghost, link variants). Solid inverts on hover.
6. **QuotesBlock** — quote (body-lg italic optional) + attribution (eyebrow). Stacked or carousel.
7. **FilmstripBlock** — horizontal image track with perforation bands. CSS scroll-snap.
8. **DivisionBlock** — division showcase with 5 visual variants. Color-token-locked per division.
9. **StatsBlock** — large numeric data points (hero or h1 size) in 2-4 column grid.
10. **DividerBlock** — structure divider with optional mono-spaced label (keycode token).
11. **Interactive islands**: HeroSliderIsland, MasonryIsland, MagneticNavIsland.

## Divisions

APR 70 operates three specialized divisions. Each shares the parent visual DNA but expresses a distinct editorial focus and accent color. The divisions are not sub-brands — they are *labels* in the music-label sense. Same parent, distinct catalogue.

### (212) Pictures — New York Television

**Colors:** `212-amber` primary, `212-sicilian-orange` accent.
**Editorial focus:** Television rooted in the Northeast — drama, crime, documentary. Brooklyn, the Bronx, the boroughs as character. New York as a working city, not a postcard.
**Tonal references:** *The Wire*, *Mad Men*, *The Sopranos*, *I Know This Much Is True*. Storaro and Gordon Willis cinematography. Italian-American inflection earned, not performed.

### (310) Pictures — LA / Global Television

**Colors:** `310-imax` primary, `310-sicilian-blue` accent.
**Editorial focus:** Elevated genre television — political thrillers, sci-fi, neo-noir. Higher-budget, internationally legible, often co-production scale. The "Los Angeles" reference is operational, not aesthetic — (310) projects can be set anywhere, but they carry the production weight of a studio-tier series.
**Tonal references:** *Slow Horses*, *Andor*, *Severance*, late-period Soderbergh. Cool palette. Architecture and infrastructure as visual texture.

### New Renaissance Cinema (NRC) — Auteur Features

**Colors:** `nrc-grey` primary, `nrc-navy` accent.
**Editorial focus:** Feature film. Auteur-driven, classic-modern, moral clarity. The smallest slate by volume, the largest by ambition per project. NRC films travel festivals before theaters.
**Tonal references:** Paolo Sorrentino, late-period Scorsese, James Gray, Lucrecia Martel. Patience as a directorial virtue. Cinema as inheritance.

## Logo System

### Parent brand — CANON (ruled 2026-07-27)

The canonical mark is **"The Punch"**: APR 70 in outlined Jost Bold with a single
true-scale BH-1866 perforation as the full stop, punch in the division accent
(orange at the apex). Companion marks: the APR 70 / PICTURES lockup, the "70"
monogram in the double hairline box (Jost 500), and the Jost-tile favicon system
(70 · 212 · 310 · NRC; apex black, 212 amber, 310 imax, NRC navy). All letterforms
are outlined vector paths — no live text, no font references, ever.

Production kit (canonical source): `SharedData/10-01-logos/2026-brand-jost-punch/`
— 40 wordmarks + 8 monograms + 32 favicon tiles (×5 PNG sizes + .ico) in every
brand color, stationery (letterhead classic / 70 mm / 35 mm band · cards d4 /
seventy / strip — on band pieces the wordmark rides INSIDE the frame area between
the perf rows), regenerable via `design-source/retype-2026-07/tools/gen_brand.py`.
The full kit is loaded in Payload media (kind/division-tagged, thumbnailed).

The 35+ Jost-era SVG variants are ARCHIVED (research only, never ship):
`SharedData/10-01-logos/_ARCHIVED-futura-era-brand-2026-07-27-DO-NOT-USE/`.

### Division logos (to be designed)

The three divisions currently *do not* have their own logos. They are referenced in code via the `--div-{n}-color` and `--div-{n}-label` CSS custom properties in `tokens.css`. The brief below establishes creative direction for division logos that:

1. Share the parent APR 70 visual DNA (true-gauge perf geometry, Jost, hard edges)
2. Express each division's distinct editorial focus
3. Read as siblings — same family, distinct identities — not as separate companies

### Logo brief — universal direction

**Shared constraints across all three divisions:**
- **Geometry:** Must reference the perforation — drawn at true gauge (BH-1866 or KS-1870, true pitch) when literal, or as rectangular negative space at regular intervals when abstract. Never a decorative dot.
- **Typography:** Jost Bold or Heavy, outlined to paths in deliverables. Tight tracking on the wordmark (`-0.02em`). No script. No serif. No "creative" hand-drawn letterforms.
- **Composition:** Built on the 8px grid. Hard-edged. The only permitted curvature is a 2px corner radius on sprocket-style perforations.
- **Reproducibility:** Must work at 24px favicon size, at 1200px hero scale, and as a single-color etching on letterhead. Test at all three before finalizing.
- **Dual mode:** Each logo must read correctly on both `#000000` (dark) and `#FAFAF8` (light) surfaces. Provide both treatments.
- **Color discipline:** Each logo has a primary version (black on white, or white on black) and an accent version using only that division's assigned token color. No multi-color logos.
- **What to avoid:** Bevels, gradients, drop shadows, photographic backgrounds, hand-drawn elements, retro "70s" pastiche, generic film-strip clip-art, any neon/glow effect.

### (212) Pictures — Logo direction

**Mark concept.** Parenthetical area-code lockup: `( 212 ) PICTURES`. The parentheses are oversized, set in Jost Heavy, with the numerals slightly inset. Beneath or beside, the word "PICTURES" sits at half the cap-height of the numerals, tracked at `0.2em`. The composition reads as a label on a film canister — utilitarian, archival, industrial.

**Sprocket integration.** A row of three to five sprocket perforations sits either above or below the wordmark, in `212-amber`. The perforations are the connective tissue to the parent APR 70 mark.

**Color treatments.**
- Primary: Black wordmark on white, `212-amber` sprockets.
- Inverse: White wordmark on black, `212-amber` sprockets.
- Monochrome: Black or white throughout (no sprocket color) for etching, embroidery, single-color print.

**Reference feel.** A serial number stamped onto a 16mm canister. The American Cinematheque marquee. The card catalog at a Brooklyn library. *Not* "Brooklyn hipster" — earlier, more institutional.

### (310) Pictures — Logo direction

**Mark concept.** Same parenthetical area-code lockup: `( 310 ) PICTURES`. Structurally identical to (212) — that is the point. The two divisions are siblings, and their logos should look like they came from the same prop department.

**Sprocket integration.** Three to five sprocket perforations in `310-imax`. Otherwise identical placement to (212).

**Color treatments.**
- Primary: Black wordmark on white, `310-imax` sprockets.
- Inverse: White wordmark on black, `310-imax` sprockets.
- Monochrome: Black or white throughout.

**Reference feel.** A specification sheet for a precision instrument. The cool blue ink of an Italian engineering drawing. *Not* "LA glossy" — colder, more European, more architectural.

### New Renaissance Cinema (NRC) — Logo direction

**Mark concept.** NRC is the only division without a numeric/parenthetical anchor — it carries the proper name. Two options to develop in parallel:

**Option A (recommended for primary):** The full wordmark `NEW RENAISSANCE CINEMA` set in Jost Heavy, all-caps, tight-tracked, on three stacked lines (one word per line) or a single justified line. A single sprocket row sits beneath, in `nrc-grey`, providing the family link.

**Option B (recommended for monogram / favicon):** The monogram `NRC` in Jost Heavy with each letter inset into its own sprocket-frame rectangle — three sprocket-edged squares that read as a triptych. Compact, square, works at 24px.

**Color treatments.**
- Primary: White wordmark on black, `nrc-grey` sprockets.
- Inverse: Black wordmark on off-white (`light-bg`), `nrc-navy` sprockets — the navy accent does its work on the light surface where grey-on-white would vanish.
- Monochrome: Black or white throughout.

**Reference feel.** A title card from a Pasolini film. The colophon of a Mondadori book. The chiseled inscription on a marble building dedication plaque. *Not* "renaissance pastiche" — we are not putting laurel wreaths anywhere. The "renaissance" is rebirth and clarity, not ornament.

### Logo deliverables checklist

For each of the three divisions, produce:

- `[division]_logo_full_black.svg` — full lockup, black on transparent
- `[division]_logo_full_white.svg` — full lockup, white on transparent
- `[division]_logo_full_black_[color]_sprockets.svg` — black wordmark + accent sprockets
- `[division]_logo_full_white_[color]_sprockets.svg` — white wordmark + accent sprockets
- `[division]_logo_primary_black.svg` — mark only, no wordmark
- `[division]_logo_primary_white.svg` — mark only, no wordmark
- `[division]_monogram_black.svg` — square compact mark
- `[division]_monogram_white.svg` — square compact mark
- `[division]_favicon.svg` — 24×24 optimized

Save to `web/public/logos/divisions/[212|310|nrc]/` (Astro frontend serves from `web/public/`).

## File Index

- `DESIGN.md` — this file. Portable, agent-readable canonical spec.
- `web/src/styles/tokens.css` — design tokens as CSS custom properties. Source of truth for runtime.
- `web/src/styles/global.css` — base resets, semantic element styles.
- `cms/src/editor/` — Lexical Color Injector + D-7 block configuration. Token keys here must match `colors:` in this file's front matter.
- `CLAUDE.md` — repo working document. Source of truth for code rules and stack conventions.
- `BRIEF.md` — live state of the build (updated by stop-hooks).
- `TASKS.md` — priority backlog.

## Maintenance

Lint this file before any version bump:

```bash
npx -y @google/design.md lint DESIGN.md
```

Zero errors required. Warnings about "color X not referenced by any component" are expected — those colors bind via prose (division identity, light-mode pairing) rather than component sub-tokens.

Diff between versions when the brand evolves:

```bash
npx -y @google/design.md diff DESIGN.md DESIGN-prev.md
```

---

*APR 70 LLC · 1063 Jackson Avenue PH G · Long Island City, NY 11101 · EIN 41-4120354 · NY DOS ID 7827718*
