# APR 70 PICTURES — DESIGN SYSTEM

> Precise, purposeful, and built to last.

This is the working design system for **APR 70 LLC** — a New York film and television production company founded in 2026 by Marc Andrew Caruso. It governs how the company presents itself across its website, decks, stationery, and any future surface.

---

## 1. COMPANY CONTEXT

APR 70 is a holding company for Caruso's production activity, organized under three specialized divisions. The name is not an acronym — it is a mark. "APR 70" references April 1970, a date of deep personal significance rooted in Sicilian heritage. The numeric form was chosen for international clarity; the cadence was chosen for cinematic weight.

### 1.1 The Divisions

| Division | Focus | Identity color |
|---|---|---|
| **( 212 ) Pictures** | New York television label — drama, crime, documentary rooted in the Northeast | Amber-Rust `#824B07` |
| **( 310 ) Pictures** | Los Angeles / global television — elevated genre, political thrillers, sci-fi | Teal-Blue `#077082` |
| **New Renaissance Cinema (NRC)** | Feature film division — auteur-driven, classic-modern, moral clarity | Offwhite `#c8c8c8` |

All three borrow from the same visual DNA: film-sprocket geometry, Italian Modernist typography (Futura + Barlow), black/white/amber/teal palette, Vignelli/Munari discipline.

### 1.2 Active Projects (for reference when writing copy)

- **A Need Grows in Brooklyn** — 10-episode coming-of-age crime drama (212 / NRC)
- **The Mayors** — 11-episode documentary, 75 years of NYC leadership (212)
- **The Maltese Falcon** — theater/musical adaptation, Italian-American cast, 1940s Brooklyn (212)
- **Alpha YY** — Mike Diaz, also as feature (212 / NRC)
- **L.A. Dolce Vita** — 10-ep political thriller / neo-noir, $30–50M (310)
- **L'Odissea di Cleopatra** — 10-ep sci-fi psychological thriller, $40–80M (310)
- **Shadowmaster** — series/reality hybrid (310)
- **U Brucculinu** — feature (NRC)
- **The Movement** — series (212)

---

## 2. SOURCES

This system was distilled from the following sources. Reader may or may not have access — paths recorded for traceability.

| Source | Location | Access |
|---|---|---|
| **Production website repo** | `brooklyn70/apr70-clone` (branch `apr70`) | GitHub |
| **Authoritative working doc** | `CLAUDE.md` in that repo — locked brand tokens, rules, v086 changelog | GitHub |
| **Live staging** | https://clone-kappa-six.vercel.app | public |
| **Production domain** | https://apr70.com | public |
| **Local working folder** | `/Users/marco/Documents/websites/APR_70/` (Marco's machine) | local only |
| **Content source of truth** | `content/pages/*.md`, `content/projects/*.md` in repo | GitHub |
| **KIMA Creative sibling site** | `index.html` in repo (parallel operating entity) | GitHub |
| **Fonts** | Futura Std (OTF family uploaded); Barlow via Google Fonts | local + CDN |
| **Logos / brand marks** | 60+ SVG + PNG variants uploaded; canonical `/public/logos/` in repo | local + repo |

---

## 3. CONTENT FUNDAMENTALS

**Voice.** Declarative. Trade-press-literate. Zero marketing slop. Writes like a union crew slate — each line earns its place. The company uses its own name in the third person. No "we" unless the context demands it. When "we" appears, it is plural-of-one: Marc is the sole member.

**Casing.** All-caps for labels, eyebrows, navigation, metadata, keycodes, CTAs. Sentence or Title case for headlines and body. Never use `RANDOM iNCONSISTENT Casing`. Metadata is monospaced mono caps — reads as production slate, not typographic texture.

**Tone specifics.**
- Precise. No filler adjectives. Never "amazing," "powerful," "innovative."
- Mature. Written for industry readers — investors, distributors, agents, financiers. No consumer hype.
- In your face. Short lines. Period-heavy. "Precise. Purposeful. Built to last." is canonical rhythm.
- Numeric when possible. Budgets stated as ranges. Runtimes stated as episode counts. Dates precise.
- Italian-American inflection earned, not performed. Sicilian heritage is referenced once, specifically — never in ambient copy.

**Emoji.** **Never.** This is an absolute rule inherited from the production repo (`CLAUDE.md` Rule 3: "No emoji anywhere on the site. Ever."). Not in UI. Not in body copy. Not in rare exceptions.

**Person.** Third person for the company and its projects ("APR 70 develops…" / "(212) Pictures is the New York television label"). First-person-singular for founder bio ("I studied cinema at NYU's Tisch School…"). First-person-plural avoided except in tagline band CTAs ("our divisions", "our slate").

**Signature phrases.**
- "Precise, purposeful, and built to last."
- "Auteur. Driven. Development."
- "Three divisions. One vision."
- "The classics never go out of style."
- "Currently accepting select projects for YYYY."

**Metadata style.** Always monospaced, widely tracked, all-caps. Example: `KIMA CREATIVE // PROD + CONSULT // LIC NY 11101`. Doubled slashes as separator. Numbers bare, no units of measurement where context is clear ("11101" not "ZIP 11101").

**Numerals and specificity.** Dates: `April 16, 2026` or `APR 2026`. Version: `v086`. Area codes: `( 212 )` with spaces for editorial treatment, `(212)` tight when inline. Episode counts: `10-episode`. Dollar ranges: `$30M–$50M` with en-dash.

**Legal / institutional.** Always spelled out, present at least once in footer: `APR 70 LLC · 1063 Jackson Avenue PH G · Long Island City, NY 11101 · EIN 41-4120354 · NY DOS ID 7827718`. Treated as metadata, not marketing.

**What we don't write.**
- Testimonials. Reviews. Logos-of-partners walls.
- "Empowering storytellers" / "transforming the industry" / any world-salad.
- Em-dash for drama — we use periods.
- Exclamation points. Ever.

---

## 4. VISUAL FOUNDATIONS

### 4.1 Palette
- **Primary:** Pure black `#000` / pure white `#FFF`. The default world is black.
- **Division accents:** Amber `#824B07` (212), Teal `#077082` (310), Offwhite `#c8c8c8` (NRC).
- **Signal:** Orange `#E85D04` for investor / tagline-band / sprocket-warmth accent.
- **Cool accent:** Navy `#0077B6` used on alternate sprocket variants.
- **Light-mode:** Warm parchment `#ede8de` / dark ink `#1c1208` / Steenbeck `#d8cdb8`. Light mode is an opt-in production-document mode — a toggle, not a default.
- **No gradients as surfaces.** Gradients only as directional reveals (teal fade to transparent on a rule, corner-accent bleed).

### 4.2 Typography
- **Display:** Futura Std Bold — all headings. Condensed Bold/ExtraBold reserved for stencil-like production-slate treatments.
- **Body:** Barlow 300 for long-form, 400 for standard, 500–600 for UI labels.
- **Mono:** Share Tech Mono (filmstrip keycodes, timecode-style metadata). Courier New is an acceptable fallback.
- **Tracking is a primary expressive tool.** Eyebrow labels live at `0.4em–0.55em`. All-caps display runs at `-0.02em` (tight). Body is `0` tracked.
- **Line-height crushed for display** (`0.85–1.0`), generous for body (`1.7–1.8`).

### 4.3 Spacing
- **8px grid.** Token scale `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 / 192`.
- **Generous vertical rhythm.** Section padding minimum `96px` on desktop, `48px` mobile. Don't crowd.
- **Horizontal padding** is a fluid clamp: `clamp(1.5rem, 5vw, 4rem)`.

### 4.4 Backgrounds
- **Solid black, almost always.** This is a film company — black is the cinema. Full-bleed photography comes from the slate (`public/slate/{slug}/`) and is always real project stills, never stock.
- **Imagery color vibe:** cool, slightly desaturated, warm skin-tones preserved. Think Vittorio Storaro, Gordon Willis, not Instagram. B&W acceptable for founder portraits and archival moments.
- **Full-bleed hero imagery** dimmed to ~40–60% with black overlay; text sits on the darkest quadrant.
- **No repeating patterns, no textures, no noise overlays, no film grain** (grain was explicitly removed in v063). The sprocket rail *is* the texture.
- **Hand-drawn illustrations:** none. We are a photographic company.

### 4.5 The filmstrip rail
The signature ambient motif. A fixed horizontal bar at top (and sometimes bottom) of every page: 32px tall, `#050505`, bordered below by a 1px rule, populated with small `13×9px` sprocket holes at ~16px intervals. A 4px-wide teal (or amber — division-cued) accent bleeds from the left edge. Right-aligned monospaced keycode text floats at 7px, `0.42em` tracking, nearly-invisible color `#242424`.

### 4.6 Animation
- **Easing:** The "film advance" curve — `cubic-bezier(0.16, 1, 0.3, 1)` — for entrances and reveals. `cubic-bezier(0.4, 0, 0.2, 1)` for state changes.
- **Durations:** `0.25s` quick, `0.35s` base, `0.55s` slow, `0.7s` for reel-style reveals, `1s` epic (hero logo).
- **Signature reveal:** `fadeUp` — opacity 0→1 plus `translateY(12px→0)` over 0.8–1.0s.
- **Logo reveal:** White base + PICTURES text held visible; sprocket holes cycle through the five brand colors via bottom-to-top `clip-path: inset()` wipes at 0.6s each. Mechanical, film-advancing. No color crossfades.
- **No `transition-all`.** Only `transform` and `opacity` are animated properties. This is a locked rule.
- **No bounces. No springs. No overshoot.** The camera moves precisely or not at all.

### 4.7 Hover & press states
- **Hover:** Lighter text color (`fg-3 → fg-1`) and strengthened border (`rule → rule-strong`). On division rows, name forces `!text-white` to preserve contrast against amber/teal.
- **Press:** No scale transform. Color deepens by one step, or rule thickens to 2px momentarily.
- **Buttons:** Ghost (transparent + hairline border) and Solid (white fill, black text). Solid inverts on hover.
- **Links:** Thin underline in muted tone; underline brightens and text brightens on hover.
- **NRC-specific hover** (offwhite on dark): `color: #1c1208` dark-ink fix so name doesn't vanish against its own light surface.

### 4.8 Borders, shadows, and elevation
- **Borders are hairlines** (1px) in low-opacity white (`rgba(255,255,255,0.08)`) on dark, low-opacity ink on light.
- **No drop shadows.** At all. This is a flat, printed, slate-on-black system. Elevation is communicated through contrast of rules and whitespace, not blur.
- **No "protection gradients"** or capsule blurs behind text. If text needs legibility on imagery, dim the image.
- **No inner shadows, no glow, no glassmorphism.** Full stop.

### 4.9 Corners
- **Everything is hard-edged.** Default radius is 0.
- **Sprocket perforations:** 2px corner radius — the only curvature in the system. This is intentional — it is the one place a rounded corner appears, and it references a physical object (a film frame hole).
- **Buttons, cards, images, inputs: 0 radius.** The production slate is square.

### 4.10 Cards
A "card" is a rectangle, flat fill or transparent, hairline border, no shadow, no rounding. Padding is generous (24–48px). Title is a Futura Bold caps label; body is Barlow 300. A monospaced keycode may appear top-right as a production-slate ID. Ghost numerals (division "212" / "310" / "NRC" at 0.08 opacity) may appear as watermark passengers — they never size the card (CLAUDE.md Rule 5a: "Ghost images are passengers, not drivers").

### 4.11 Transparency & blur
- Transparency used **for text on imagery** via black overlays at 40–70%.
- Blur used **only** in the logo reveal exit (final frame blurs to 0).
- **No backdrop-filter blur.** Ever.

### 4.12 Layout rules
- Fixed elements: filmstrip rail (top), nav (below strip), footer (bottom), corner accent (bottom-right teal bleed).
- Content max-width: `1200px` center-aligned with fluid horizontal padding.
- Mobile: filmstrip compresses to 28px, keycode hides, nav-status hides, footer stacks.
- **Numbered nav:** `01 DIVISIONS / 02 SLATE / 03 PARTNERS / 04 CONTACT`. Numbers are not ornaments — they mark the chapter.

### 4.13 Cursor
- Default cursor is `crosshair`. Again: cinema. A viewfinder, not a pointer. This is the default on `body` across every surface.

---

## 5. ICONOGRAPHY

**Approach.** APR 70 is an anti-icon system. Wherever a conventional UI would use a pictogram, this system uses either (a) a numeric prefix (`01`, `02`), (b) a monospaced keycode label, or (c) the sprocket rail itself. Iconography is not used to decorate — it is used to *identify production artifacts*.

**Inventory.**
- **Sprocket holes** — the only repeating graphic element. Rendered as 13×9px divs with 1.5px #1e1e1e borders and 2px radius. Placed on filmstrip rails.
- **Logo system** — a full suite of 35+ SVGs covering: `full` (wordmark + lockup), `primary` (mark only), `monogram` (compact), `favicon` (square). Each in black/white/amber/blue/navy/orange sprocket variants. Stored at the production site in `/public/logos/` and mirrored here in `assets/`.
- **Ghost numerals** — oversized "212" / "310" / "NRC" at 0.08 opacity inside division rows. Watermark-style, never interactive.
- **No icon font. No Lucide. No Heroicons. No Font Awesome.** The production site uses none. We do not add one. If a future UI demands a pictogram, render it as an inline SVG 1-stroke hairline glyph, 20×20, `currentColor`, no fill. Flag it in review.
- **No emoji. No unicode dingbats.** Already covered in Content Fundamentals — repeated here because designers reach for them by reflex.

**If an icon must exist** (e.g. external-link, play, close), it is a single-weight 1.25–1.5px stroke SVG on a 24×24 grid, no fill, rendered in `currentColor` so it inherits from text. Stroke-linecap `square`, not `round` — this is a hard-edged system.

**Asset locations.**
- `assets/apr70_logo_full_*` — horizontal lockups (wordmark beside mark)
- `assets/apr70_logo_primary_*` — mark only (the 35mm-spec sprocket lockup)
- `assets/apr70_monogram_*` — compact square mark for small/tight contexts
- `assets/apr70_favicon_*` — square-format favicon variants (colored backgrounds, bold/regular text)

**Substitutions.** None needed — all logo variants were supplied. No CDN-substituted icons used; if one is introduced, document it here.

---

## 6. FILE INDEX

```
README.md                  -- this file (context + fundamentals + iconography)
colors_and_type.css        -- all design tokens; import this in any surface
SKILL.md                   -- Agent Skill manifest (cross-compatible with Claude Code)
fonts/                     -- Futura Std family (.otf) — Barlow loads via Google Fonts
assets/                    -- logos, monograms, favicons (SVG + PNG)
preview/                   -- design-system spec cards (render in the Design System tab)
ui_kits/
  website/                 -- apr70.com recreation: index.html + JSX components
```

### 6.1 UI kits

- `ui_kits/website/` — apr70.com marketing site. Homepage hero + division rows + slate grid + contact + filmstrip rail. Based on the production Next.js repo (`brooklyn70/apr70-clone` @ `apr70`, v086).

### 6.2 Preview cards (Design System tab)

Grouped as **Brand**, **Colors**, **Type**, **Spacing**, **Components**. See each card's own filename for contents.

---

*APR 70 LLC · 1063 Jackson Avenue PH G · Long Island City, NY 11101 · EIN 41-4120354 · NY DOS ID 7827718*
