# Place-poster skill + British Library PD plates

**Date:** 2026-08-21 · **Status:** adopted as an agent skill; no frames generated this pass.
**Surface:** staging / apr70.com artwork only (print, DISPATCH plates, Troupe, place stills). Not site chrome.

## Verdict

**Yes, add it — as an image-generation skill, not a website-design skill.**

The recently added GSAP skills (`gsap-core` and siblings) govern motion on the
Astro site. This prompt does something else: it turns one photograph into a
3:4 exhibition poster (faithful photo on top, architectural collage /
silkscreen / blueprint on ivory paper below). That is closer to Crop Studio
and `tools/still-regen/` than to `tokens.css`.

House rules that still apply:

- Locked palette and Futura/Barlow/Share Tech Mono stay on **chrome**. Serif
  type and photo-extracted greens live **inside the poster artwork**.
- SPEC §5: PD first; never AI people/characters. This recipe is landscapes
  and architecture only.
- AI Mark on staging: the lower half is machine-made even when the upper half
  is a public-domain plate.
- Marco culls before anything enters CMS (same gate as Light Law stills).
- 3:4 posters do **not** replace 21:9 cinema masters.

## The lost git link

The prompt is a recipe, not a site. Closest public skills (none is a drop-in):

| Repo | Why it matches | Why it is not enough |
|---|---|---|
| [yangcodingmaster/photo-distill](https://github.com/yangcodingmaster/photo-distill) | Photo → ivory-paper exhibition poster; one accent color; print grain | HTML/CSS/SVG, no image model; no 50:50 photo/reconstruction split |
| [liuzihe849-png/ai-editorial-print-studio](https://github.com/liuzihe849-png/ai-editorial-print-studio) | Photo → print illustration via an image model | Risograph/archive, not blueprint collage; allows portraits |
| [joeseesun/qiaomu-mondo-poster-design](https://github.com/joeseesun/qiaomu-mondo-poster-design) | Silkscreen poster language | Mondo movie-poster energy; too much type |
| [cxcxy/dy-travel-ticket-poster](https://github.com/cxcxy/dy-travel-ticket-poster) | 3:4 from a photo | Ticket-stub genre |

House copy of the 50:50 prompt: `.claude/skills/place-poster/SKILL.md`.

## British Library plates — yes, with a ledger

https://huggingface.co/datasets/biglam/british-library-book-images is the
Mechanical Curator million: ~1.08M images cut from books c. 1510–c. 1900,
Flickr Commons "no known copyright restrictions" / CC0. Search:
https://huggingface.co/spaces/davanstrien/bl-images-search

**We can use them** as source photos for this recipe (and as archival plates
on the site) if each file is verified into the existing PD pipeline:
`credits.json` + vault ledger + quiet caption. That is the same law as the
LOC / NYPL / NARA rows already in `web/public/pd/credits.json`.

Filters before ingest:

1. Prefer configs `plates` and `medium`. Skip most `covers` and `embellishments`.
2. Drop `date == "Unknown"` until a catalogue year is confirmed.
3. Drop dates after 1900 (the dataset flags those as catalogue errors, up to 1946).
4. Editorial skip for racist or colonial caricature.
5. No bulk ingest. Curate 6–12 plates that match a property's *place*.

Existing ledger rows that are already good source photos (place, not faces):
Abbott El / skyline / Seventh Ave; Brooklyn piers 1974; Sea Gate aerial + gate;
Taormina / Rocca 1906; Venice gondolas 1953; City Hall photochroms; Coney 1896.
Skip the radio-studio portraits.

A BL plate in the **upper** half remains PD. The **lower** half is an AI
reconstruction, so the finished poster is a mixed work: PD credit + AI Mark.

## i18n (next pass, not this one)

Marco: Portuguese, Italian, French, and German on apr70.com / staging, in the
spirit of Vik Muniz Studio. VMS public site is primarily **en / pt**
(`vikmuniz.net/en`, `vikmuniz.net/pt`). Payload currently has `locale: null`
and no localization config. That is a CMS + Astro routing change, parked on
TASKS.md Phase 10. Do not invent copy in those languages until Marco's text
pass exists to translate from.
