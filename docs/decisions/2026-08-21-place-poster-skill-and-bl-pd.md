# Place-poster skill — now driven by prettymaps

**Date:** 2026-08-21 · **Status:** engine identified and wired; no frames culled into CMS.
**Engine:** [marceloprates/prettymaps](https://github.com/marceloprates/prettymaps) (AGPL-3.0).
**Surface:** staging / apr70.com artwork (print, DISPATCH, Troupe, place stills). Not site chrome.

## Verdict

The lost git was **prettymaps**: OSM streets/water/buildings drawn as exhibition
maps. House skill: `.claude/skills/place-poster/SKILL.md`. Wrapper:
`tools/place-poster/render.py` + `presets/apr70.json`.

Do **not** vendor prettymaps into this repo (AGPL). `pip install prettymaps`
and keep the OSM + prettymaps credit on every figure.

Chrome stays Jost / Newsreader / Courier Prime. Poster paper may use a
delicate serif. SPEC §5: no people. Marco culls before CMS. 3:4 posters do
not replace 21:9 cinema masters.

British Library Mechanical Curator plates remain valid for an optional photo
half (`plates`/`medium`, ledger, no bulk ingest). A pure prettymaps PNG is
not AI; AI Mark only if an image model touches the frame.

## i18n (still next pass)

Portuguese, Italian, French, German. VMS is en/pt. Payload has `locale: null`.
Parked on TASKS.md Phase 10.
