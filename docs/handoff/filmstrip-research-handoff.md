# Filmstrip Block Research Handoff

## Context
We are engineering a highly realistic, physically accurate `FilmstripBlock` for the APR 70 Pictures web application (Astro/React). The goal is to recreate actual processed motion picture film strips (positives/negatives) using **CSS only** (CSS variables, repeating gradients, and flexbox math), avoiding heavy SVG or Canvas dependencies. 

The film strips act as horizontal scrolling carousels. Instead of static UI backgrounds, the *entire strip* (frames, perforations, edge codes, and blank leaders) moves synchronously as one physical piece of film.

## Our Current CSS Mathematical Model
To ensure physical accuracy, we derive the width of a single film frame explicitly from the perforations (sprocket holes). 

**The Math Formula in our CSS:**
```css
--perf-pitch: calc(var(--hole-w) + var(--hole-gap));
--segment-w: calc(var(--perf-pitch) * var(--perfs));
--frame-w: calc(var(--segment-w) - var(--frame-gap));
```
- `perfs`: The exact number of perforations per frame (e.g., 4 or 15).
- `hole-w` / `hole-h`: Dimensions of the sprocket hole.
- `hole-gap`: The physical distance between the end of one hole and the start of the next.
- `frame-gap`: The physical thickness of the black frame line dividing two pictures.

This guarantees that a 15-perf IMAX frame will *always* have exactly 15 perforations above and below it, regardless of screen size.

## Formats Implemented Thus Far
We have mocked up four specific formats. Our current dimensions and colors are approximations, which is where we need Perplexity's deep domain knowledge to correct us.

### 1. IMAX (15-Perf 70mm)
- **Current Specs:** `1.43:1` Aspect Ratio, `15` perforations per frame.
- **Current Edge Code:** Cyan text. `EASTMAN 5243 039 02401 191 110` with a barcode `||| | ||| |||`.
- **Current Emulsion/Base:** Translucent dark base with cyan edge gradients.

### 2. Super 35 (4-Perf 35mm)
- **Current Specs:** `2.39:1` Aspect Ratio, `4` perforations per frame.
- **Current Edge Code:** Yellow text. `KODAK 500T 5219` with orange and white timing stripes.
- **Current Emulsion/Base:** Translucent dark base with amber/yellow edge gradients.

### 3. Academy Ratio (4-Perf 35mm)
- **Current Specs:** `1.37:1` Aspect Ratio, `4` perforations per frame.
- **Current Edge Code:** Grey text. `SAFETY FILM`.
- **Current Soundtrack:** (Temporarily removed due to looking unrealistic).

### 4. NRC 2:1 Widescreen (4-Perf 35mm)
- **Current Specs:** `2.00:1` Aspect Ratio, `4` perforations per frame.
- **Current Edge Code:** Maroon text. `ANSCO COLOR 848`.

## Missing Deep Research Needed from Perplexity
To achieve 100% photorealistic parity with actual film stocks, please ask Perplexity for the following explicit physical details:

1. **Edge Code Typography & Symbols:**
   - What are the exact ASCII or Unicode equivalents of the symbols used in Kodak KEYKODE systems (the squares, pluses, dots, and dots-inside-O's that denote manufacture years and stock)?
   - How many frames exactly does an edge code span before it repeats on 35mm and 70mm?

2. **Optical & Magnetic Soundtracks:**
   - For Academy and 35mm prints, what does a physically accurate optical soundtrack look like geometrically? (Is it two bilateral waves? How thick is the band relative to the sprocket holes?)
   - If we want to simulate magnetic tracks (like on 70mm prints), what color and physical width are the magnetic stripes?

3. **Leader Conventions:**
   - We currently have an 8-frame head leader countdown (`8, 7, 6, 5, 4, 3, 2, 1`). What is the true frame spacing for a Society of Motion Picture and Television Engineers (SMPTE) or Academy countdown leader? (How many blank frames between numbers?)
   - Does the tail leader actually say "PICTURE START"? (Typically, "PICTURE START" is at the head, not the tail. What does the standard tail leader text say?)

4. **Edge Colors:**
   - Did Eastman / Kodak / Ansco physically dye the extreme edges of the film strip? What are the historically accurate edge print colors for `Kodak 500T 5219` vs `Eastman 5243`?
