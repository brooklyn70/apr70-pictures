# Block Library Specification (v3)

**Last updated:** 2026-05-11 (master plan locked)

This document defines the 11-block library for the APR 70 Pictures v3 architecture. All blocks enforce design discipline at the schema level. Editors construct layouts by composing these blocks.

**Rules (from CLAUDE.md):**
- All blocks use Media relationships, not path strings.
- All blocks render correctly in BOTH dark and light mode.
- All blocks are mobile-first responsive (375px–1440px).
- Non-interactive blocks = Astro components (zero JS). Interactive = React islands.
- Colors locked to the 6-token palette: 212 Amber, 212 Sicilian Orange, 310 IMAX, NRC Grey, 310 Sicilian Blue, NRC Navy.

---

## 1. HeroBlock (`hero`)

Primary opening block. Classic Cinema crossfades. No morphing, no WebGL.

**Schema:** heading (textarea), subtext (text), media (upload), variant (default/split/fullscreen/slider-auto/slider-curated), division (pictures-212/pictures-310/nrc/corporate), fadeDuration (number), autoplayDelay (number), showIndicator (checkbox).

**Island:** `HeroSliderIsland` (React + GSAP) for slider variants.

## 2. RichTextBlock (`richText`)

Lexical body with D-7 inline blocks + mega-scale toggle.

**Schema:** content (richText), megaScale (checkbox → outputs `data-display="mega"`).

## 3. TwoColBlock (`twoCol`)

Left heading, right body. Ratios: 1-3, 1-1, 1-2. Alignment: top, center.

## 4. GridBlock (`grid`)

Array of cards with media + title + description. CSS auto-fill minmax grid.

## 5. CTABlock (`cta`)

Heading + buttons (solid/ghost/link variants). Max 3 buttons.

## 6. QuotesBlock (`quotes`)

Quote + attribution array. Stacked or carousel (CSS scroll-snap).

## 7. FilmstripBlock (`filmstrip`)

Horizontal image track with perforation bands. Source: custom media OR auto from Projects. CSS scroll-snap. Keyboard arrow nav. ARIA carousel. Pause on hover.

## 8. DivisionBlock (`divisionShowcase`)

5 visual variants with color-token-locked division rows.
- v0: v2-faithful baseline (stacked rows, ghost numerals)
- v1: Interactive Accordion
- v2: Horizontal Card Stack
- v3: Split-Screen Reveal
- v4: Timeline Spine

Preview at `/dev/division-variants` (dev-only). Director picks one → unused code removed.

## 9. StatsBlock (`stats`)

Large numeric data points in 2-4 column grid. Optional per-stat brand color.

## 10. DividerBlock (`divider`)

Structure divider with optional mono-spaced centered label. Spacing: compact/normal/wide.

## 11. D-7 Lexical Inline Blocks

Embedded within RichTextBlock content:
- `structureDivider`: horizontal rule with optional label
- `button`: primary/secondary CTA
- `accentText`: left-border accent block with brand color select
