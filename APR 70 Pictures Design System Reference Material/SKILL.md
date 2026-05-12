---
name: apr70-design
description: Use this skill to generate well-branded interfaces and assets for APR 70 Pictures, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

- `colors_and_type.css` — all design tokens (colors, fonts, spacing, motion). Import this in any HTML file you create.
- `fonts/` — Futura Std OTF family. Barlow is loaded via Google Fonts in the CSS import.
- `assets/` — logo suite (35+ variants: full lockup, primary mark, monogram, favicon), each in black/white × sprocket colorways.
- `ui_kits/website/` — pixel-faithful recreation of apr70.com (Next.js production site @ v086). Start here for any marketing/website surface.
- `preview/` — design-system spec cards for the Design System tab.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out of `assets/` and `fonts/` and `@import` `colors_and_type.css` into your HTML files. The default world is **black background, white foreground, Futura display + Barlow body, hard edges, no shadows, no emoji ever**.

If working on production code, read the rules in `README.md` and become an expert in designing with this brand. Absolute rules that never bend:
- No emoji. Anywhere.
- No `transition-all` — only `transform` and `opacity` are animated.
- No drop shadows, no backdrop-blur, no rounded corners except the 2px sprocket perforation.
- Cursor is `crosshair` site-wide.
- Numbered nav (`01 DIVISIONS / 02 SLATE / 03 PARTNERS / 04 CONTACT`).
- Voice is declarative, trade-press-literate, third-person for the company. Period-heavy. No exclamation points. No marketing filler.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
