---
name: place-poster
description: >
  Draw a high-end place poster for APR 70 websites and marketing from a real
  location, using prettymaps (OpenStreetMap streets, water, buildings, parks)
  with the house ivory/olive/charcoal palette. Optionally pair with a PD photo
  in a 3:4 exhibition split. Use for print, DISPATCH plates, Troupe, property
  "sense of place" art. Never for people, characters, or site chrome.
  Triggers: "place poster", "prettymaps", "map poster", "exhibition poster",
  "artistic photo poster", "sense of place poster".
---

# Place poster (apr70)

Engine: **[prettymaps](https://github.com/marceloprates/prettymaps)** by Marcelo
Prates. OSM in, exhibition map out. That is the git for this skill.

This is **artwork**, not website chrome. Chrome stays Jost (display),
Newsreader (body), Courier Prime (meta) on the locked token palette. Posters
may use a delicate serif on the paper half. They do not replace 21:9 cinema
masters.

Marco culls before anything enters CMS.

## License (do not skip)

prettymaps is **AGPL-3.0**. Do **not** copy or vendor its source into this
repo. Install it as a tool (`pip install prettymaps`). Every figure must keep
the printed credit to prettymaps and OpenStreetMap (OSM license requires
it). Do not use this for NFTs. Generated PNGs are studio artwork; the library
stays upstream.

## When to use / when not

**Use** for: a named place (Red Hook, Sea Gate, Taormina, Venice, LIC).
Streets, water, buildings, parks, terrain.

**Do not use** for: people or characters (SPEC §5), Light Law story stills,
site UI, logos, or any frame that needs a face.

## How to render

From the repo root, with network (OSM fetch). prettymaps wants Python 3.11
(PyPI 1.4.2 pins `numpy<1.25`; stock 3.12 pip can fail — use 3.11 if so):

```
pip install prettymaps
python tools/place-poster/render.py --place "Red Hook, Brooklyn, New York" --no 01
```

Writes a 3:4 PNG under `tools/place-poster/out/` and prints the credit line.
`--preset tools/place-poster/presets/apr70.json` is the default house skin
(ivory paper, olive/sage greens, charcoal streets, one token accent).

Place names are geography, not property titles: "Red Hook" not "Da Hook";
"Sea Gate" is the place; "Taormina" not "U Brucculinu".

### First places

| Query | Property |
|---|---|
| `Red Hook, Brooklyn, New York` | Da Hook |
| `Sea Gate, Brooklyn, New York` | Sea Gate |
| `Long Island City, Queens, New York` | studio / 212 |
| `Taormina, Sicily, Italy` | Sicily properties |
| `Venice, Italy` | L.A. Dolce Vita |

## Optional 50:50 photo plate

If Marco wants a photo above the map: 3:4 canvas, equal halves. Upper half =
a **verified PD** plate from `web/public/pd/credits.json` (or a British
Library Mechanical Curator plate, `plates`/`medium` only). Lower half = the
prettymaps render of the same place. Quiet PD caption + OSM/prettymaps
credit. AI Mark only if an image model touches the frame; a pure prettymaps
PNG is not AI.

Skip radio-studio portraits (`mic-*`, `onair-*`, `gottlieb-*`).

## British Library plates (photo half only)

https://huggingface.co/datasets/biglam/british-library-book-images
Search: https://huggingface.co/spaces/davanstrien/bl-images-search

Filter: `plates`/`medium`; drop unknown dates and dates after 1900; no bulk
ingest; no racist/colonial caricature. Ledger every file into `credits.json`.

## Review gate

Output is pending until Marco culls. Do not swap into the live filmstrip.
