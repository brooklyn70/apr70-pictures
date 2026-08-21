---
name: place-poster
description: >
  Transform a single landscape or architecture photograph into one 3:4
  exhibition "place poster": faithful photo on the top half, architectural
  collage + silkscreen + blueprint reconstruction on warm ivory paper below.
  Use when making print/editorial posters from PD plates, property location
  stills, or British Library Mechanical Curator scans. Never for people,
  characters, or website chrome. Triggers: "place poster", "split poster",
  "exhibition poster", "architectural collage poster", "silkscreen blueprint
  poster", "3:4 poster from photo".
---

# Place poster (apr70)

This is an **image-generation recipe**, not a website-layout skill. Site chrome
stays Jost (display), Newsreader (body), and Courier Prime (meta) on the
locked token palette. These posters are artwork: print editions, DISPATCH
plates, Troupe playbills, or property "sense of place" stills. They do not
replace 21:9 cinema masters.

Marco reviews every frame before it enters CMS. Do not ship unreviewed
generations to staging.

## When to use / when not

**Use** for: terrain, buildings, plants, paths, steps, water, sky, maps, book
plates. Source must be a photo or PD scan the studio has rights to use.

**Do not use** for: people or characters (SPEC §5: never AI people), film stills
that are story beats (those follow Story Law + Light Law in
`tools/still-regen/`), site UI, logos, collages of multiple photos, or any
frame that would need a face.

If the source has identifiable people, stop. Pick a different plate.

## Source law (PD first)

1. Prefer a row already in `web/public/pd/credits.json`.
2. Next: British Library Mechanical Curator plates via
   https://huggingface.co/datasets/biglam/british-library-book-images
   (Flickr Commons "no known copyright restrictions" / CC0). See the decision
   doc for filters.
3. Last: a location still the studio owns (property photography, not cast).

Every source and every derivative gets a ledger row: item, source URL, rights
text, download date, file. Quiet caption on the site
(`"British Library, [book title], [year]"`). The generated poster also needs
the AI Mark (Site Settings) because the lower half is machine-made even when
the upper half is a PD plate.

## Canvas

- One poster per photo. Never a collage of multiple photos.
- Strict **3:4 vertical**. Equal **50:50** split: photo above, paper reconstruction below.
- Output: PNG, no alpha. Target 2400×3200 or larger. Do not upscale mush.

## Image prompt (send this, then fill the slots)

Fill `[TITLE]` (2–3 English words for the place), `[NO]` (`No. 01` style),
`[YEAR]` (source publication/capture year, never invented).

```
Transform this uploaded photo into a single, standalone high-end art poster.
Do not create a collage of multiple photos.

3:4 vertical. Strictly divided into equal 50:50 halves, top and bottom.

UPPER HALF: faithfully use the original photo. Do not alter the subject,
terrain, architecture, texture, light, color, or positional relationships.
Add only delicate architecture-magazine / photo-exhibition color grading
and very subtle film grain. The sky or surrounding environment may be
extended naturally if the crop requires it. Do not distort, move, or
change the main subject.

LOWER HALF: warm ivory paper. Reconstruct the same landscape as
architectural collage + silkscreen + blueprint. Not simple geometric
illustration. Extract terrain, buildings, plants, paths, and steps from
the photo using translucent color fields, overlapping rectangles, thin
drafting lines, and partially retained photographic textures. At the
bottom edge, a lingering aftereffect: faint vertical fragments or thin
lines fading downward.

PALETTE: deep greens, blue-greens, olives, sages, and charcoals extracted
from the photo. Retain exactly one characteristic color as an accent in a
single spot. If that accent already exists in the APR 70 token set
(212-amber, 212-sicilian-orange, 310-imax, 310-sicilian-blue, nrc-navy),
prefer the token match; otherwise keep the photo's own accent.

TYPE (lower half only): upper-left, "[TITLE]" in a delicate serif with
wide letter-spacing. Below it, "[NO]". Upper-right, "[YEAR]" in small type.
No other text. No logos. No APR 70 wordmark.

Tone: international architecture firm / contemporary exhibition / high-end
travel magazine. Sense of place, serene.

Avoid: mountain logos, bland flat illustration, generic landscapes,
child-oriented styles, 3D, cyber, cheap templates, extra text, extra logos.
```

## Title, number, year

- Title is the place, not the property marketing name. "Red Hook" not
  "Da Hook". "Sea Gate" is allowed (that is the place). "Taormina Gate"
  not "U Brucculinu".
- Numbers are studio inventory (`No. 01`…), not issue dates. Issues on the
  site are numbered-never-dated; posters may carry the *source* year only.
- Year = the photograph or book's year from the ledger. If the dataset date
  is `"Unknown"` or after 1900 for a BL plate, do not print a year until
  verified.

## Model + pipeline

Use the same fleet as still-regen: **nano-banana-pro** (native high-res).
Do not use this recipe on gpt-image-2 (resolution cap + safety refusals on
reference images). Ledger the prompt before download, same as Crop Studio's
Prompts tab.

This recipe is **not** Light Law cinema. Do not write these into
`tools/still-regen/specs/` as story shots.

## Good first sources (already in `credits.json`)

Place / architecture plates, not portraits:

| Slug | Why |
|---|---|
| `nyc-el-72nd-1936` | Abbott El; 212 / Brooklyn texture |
| `nyc-skyline-1936` | Abbott waterfront |
| `brooklyn-shipping-piers-1974` | Da Hook / Red Hook-adjacent (see flags) |
| `seagate-aerial-1920` / `seagate-gate-2008` | Sea Gate |
| `sicily-village-taormina-fountain-1906` / `sicily-village-rocca-1906` | Sicily properties |
| `venice-gondolas-1953` | L.A. Dolce Vita place, not faces |
| `cityhall-nyc-1900` / `cityhall-nyc-1904` | civic architecture |
| `coney-razzle-1896` | Coney / Sea Gate neighborhood |

Skip radio-studio portraits (`mic-*`, `onair-*`, `gottlieb-*`, `script-owi-*`).

## British Library plates

Dataset: `biglam/british-library-book-images` (~1.08M images, four configs:
`covers`, `embellishments`, `medium`, `plates`). Search Space:
https://huggingface.co/spaces/davanstrien/bl-images-search

**Take:** `plates` and `medium` landscapes, architecture, maps, botanicals.
**Skip:** `covers` and most `embellishments` (letters, printers' ornaments).
**Filter:** drop `date == "Unknown"` until verified; drop dates after 1900
(dataset documents catalogue errors up to 1946). Editorial skip for racist
or colonial caricature plates.

Credit line pattern:
`British Library, [book title from fname], [year]. Mechanical Curator / Flickr Commons.`

Do not bulk-ingest the million. Curate 6–12 plates that match a property's
place, then run this recipe one photo at a time.

## Related skills (not this one)

The lost "photo → art" git link is probably one of these. None is a drop-in
for apr70; this skill is the house adaptation of the 50:50 prompt.

- https://github.com/yangcodingmaster/photo-distill — photo distilled to
  ivory-paper poster in HTML/CSS/SVG (no image model). Closest *craft*.
- https://github.com/liuzihe849-png/ai-editorial-print-studio — photo →
  risograph/archive print via an image model. Closest *pipeline*.
- https://github.com/joeseesun/qiaomu-mondo-poster-design — Mondo silkscreen
  movie posters (too loud, too much type for this house).
- https://github.com/cxcxy/dy-travel-ticket-poster — 3:4 ticket stub from
  a photo (wrong genre).

## Review gate

Output is pending until Marco culls. Same rule as Light Law stills: only
picks move to CMS media. Do not swap these into the live filmstrip.
