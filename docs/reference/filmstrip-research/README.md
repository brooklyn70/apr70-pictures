# Filmstrip research (design reference)

Static reference material for **FilmstripBlock**, site chrome, and any film-forward UI. Not served by the Astro app unless you later copy assets into `web/public` or Payload Media.

## Provenance

Copied into this repo from Marco’s archive on **2026-05-14**:

`APR_70/_archived/documents/Sprocket_Perforation/strips/filmstrip_research`

## Contents (at a glance)

- **Format diagrams:** Academy, Super 35, IMAX (plus detail crops), 2:1 aspect — PNG and WebP.
- **Guides:** Kodak motion-picture catalog PDF, Kodak essential reference for filmmakers PDF.
- **Misc:** `FILM ATLAS.url`, a few UI exploration screenshots.

## How to use this in v3

1. **Gemini / design pass:** Open the PNG/WebP stills and skim the PDFs for perforation geometry, safe-area habits, and aspect cues before locking CSS.
2. **FilmstripBlock (`TASKS.md` Phase 5):** Scroll-snap track, perforation bands, keyboard + ARIA — align visual rhythm with reference, stay inside the token contract (`CLAUDE.md`).
3. **Reuse ideas (Payload blocks only, no hardcoded page layouts):**
   - **Project pages:** Editors can place a FilmstripBlock in the project `layout` stack (or adjacent to hero content) once the renderer exists.
   - **Header / footer:** `SiteSettings.showFilmstripRails` already drives chrome; optional refinement of rail geometry using this research.
   - **Between sections:** Same block in the global `layout` array acts as a division between content; no separate “divider template” required unless you add a DividerBlock variant later.
   - **Gallery / slideshow:** Prefer extending the block library (e.g. Hero slider modes, Filmstrip interaction) over one-off page templates; motion stays **GSAP-only** per project rules.

## Size

Roughly **12 MB** total (PNGs + PDFs). Safe to version in git for this repo; revisit Git LFS only if the folder grows substantially.
