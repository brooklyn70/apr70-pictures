# Retirement Handoff — Stitch Integration Session
**Written by:** Claude Sonnet 4.6  
**Date:** 2026-05-18 ~9pm EDT  
**Status:** Stitch project created, 3 variants generated, output saved. Awaiting Marco's pick.  
**Branch:** main (clean)

---

## What happened this session

1. Added Stitch MCP server to Claude Code (HTTP transport, Google API key)
2. Created Stitch project **"APR 70 Pictures — Division Showcase"** (ID: `3884326936106951139`)
3. Uploaded DESIGN.md front matter → created design system asset `c12e1d9837594aa9be2761ce1ecf907c`
4. Generated 3 variants via `generate_variants` (Gemini 3.1 Pro, REIMAGINE range):
   - **V1 The Vertical Strip** — three full-height columns with sprocket rails, vertical text
   - **V2 The Vignelli Grid** — pure typography grid, 3-column, accent bars, stats tables, zero images
   - **V3 The Cinema Trade** — editorial magazine layout, top-rule accents, portrait images, filmstrip divider
5. Saved HTML/screenshots to `docs/handoff/stitch-output-divisions-2026-05-18.md`

**Critical gap:** The Stitch variants were generated from DESIGN.md tokens as a blank canvas — NOT from the actual V0.3 design. If Marco wants Stitch to iterate on V0.3 specifically, see "How to send V0.3 to Stitch" below.

---

## Current V0.3 state (the design you're working on)

**File:** `web/src/components/blocks/DivisionBlock.astro` (variant `v0.3`, ~lines 195–252)  
**Dev preview:** `http://localhost:4323/dev/division-variants` (Astro dev server, port 4323)  
**Dev server start:** `pnpm dev` from `web/`

### Layout description

Three stacked horizontal rows. Each row:
- **Left column (v03-header-logo):** sequence number `01` absolutely positioned at `left: 258px` outside the logo box. Division logo at `height: clamp(200px, 17vw, 260px)`, `margin-left: 38px`, `object-fit: contain`.
- **Right column (v03-header-text):** two tagline lines (`font-size: clamp(2rem, 4vw, 4rem)`, `line-height: 0.95`), opacity 0.7 at rest → 1 on hover. Below: "Enter →" CTA, opacity 0 at rest → 1 on hover.
- **Projects list** below the header: mono font items, `border-top` per item (except first).
- **Registration marks** in each row corner (12×12px boxes, 8px inset, border-corner style).
- **Color stroke:** 6px left-edge vertical bar, `height: 0 → 100%` on hover, `0.9s` animation using `--ease-film`.
- **Debug grid** is a canvas overlay on the third "V0.3 DEBUG" render on the dev page — safe to keep.

### Mock data structure (division-variants.astro)

```ts
{
  name: '(212) Pictures',
  colorToken: '212-amber',
  taglineLines: ['New York.', 'Television.'],
  projects: [
    { title: 'A NEED GROWS IN BROOKLYN', badge: '10 EPS' },
    { title: 'THE MAYORS', badge: 'DOC · 11 EPS' },
    { title: 'THE MALTESE FALCON', badge: 'STAGE' },
  ],
}
// + (310) Pictures (310-imax, 'Los Angeles.', 'Global.')
// + New Renaissance Cinema (nrc-grey, 'Features.', 'Tour.')
```

### V0.3 alignment status (VERIFIED May 18)

- Logo top-edge and "New York." text top-edge: **perfectly aligned**
- Header gap: hardcoded `44px` at `≥640px` (was `var(--s-8)` = 64px, caused drift)
- Sequence number: `left: 258px` absolute (outside logo bounds, not overlapping)
- First project row: no `border-top`
- All confirmed via JS measurement + red debug grid overlay

---

## How to send V0.3 to Stitch (the RIGHT way next time)

The Stitch MCP does not have an image upload tool. To get Stitch to iterate on V0.3 specifically:

### Option A — Paste V0.3 HTML into generate_screen_from_text

1. Start dev server: `pnpm dev` from `web/`
2. Open `http://localhost:4323/dev/division-variants` in browser
3. DevTools → select the first V0.3 `<section>` element → right-click → "Edit as HTML" → copy
4. Call `mcp__stitch__generate_screen_from_text` with prompt:

```
Here is the current V0.3 Division Showcase HTML for apr70.com. 
Redesign this section to have more editorial weight — keep all 
the brand constraints (no rounded corners, no shadows, no gradients 
as surfaces, 8px grid, Futura/Barlow/Share Tech Mono, 
dark + light mode). The director finds V0.3 lacks "editorial weight."
Generate a fresh layout concept that solves this.

Current HTML:
[PASTE SECTION HTML HERE]
```

Use the existing project (`3884326936106951139`) and design system (`assets/c12e1d9837594aa9be2761ce1ecf907c`).

### Option B — Upload a screenshot

1. Take a screenshot of V0.3 at 1440px width
2. Encode as base64
3. Use `mcp__stitch__upload_design_md` is NOT for images — instead call `generate_screen_from_text` with the image described in text and paste the actual CSS
4. Then call `generate_variants` on the result

### Option C — Use the 3 variants already in the project

The existing Stitch project already has 3 screens. Marco may just pick one. Skip Steps above entirely if he likes V2 (Vignelli Grid) or V3 (Cinema Trade).

---

## Stitch MCP research — what you should know

From research on @stitchbygoogle and documentation (sources in observation 775–797):

### Prompt strategy

- **Lead with business objectives**, not UI specs: "This section must communicate that APR 70 has three distinct creative divisions, each with different geographic and tonal identity. Editorial weight is the goal." beats "make three columns."
- **Reference vocabulary explicitly:** Vignelli transit maps, Saul Bass title sequences, 35mm filmstrip. Stitch reads these and applies them.
- **REIMAGINE** creativeRange = radical departures. **EXPLORE** = balanced. **REFINE** = subtle tweaks. Use REIMAGINE when you want genuinely new layout ideas.
- Prompts >300 words timeout on Gemini 3.1 Pro — split long context between the design system (DESIGN.md) and a focused variant prompt.

### Tool call notes

- `generate_screen_from_text` and `generate_variants` both timeout (~2 min MCP limit) but **continue running on Stitch's servers** — check `list_screens` 30–60s after timeout, the screens usually appear.
- **Don't retry on timeout** — just poll `list_screens` until the new screens appear.
- `upload_design_md` → `create_design_system_from_design_md` is the correct 2-step flow for loading DESIGN.md.
- The design system ID returned is NOT prefixed — use `assets/<id>` when passing to `generate_screen_from_text`.
- HTML downloads at `contribution.usercontent.google.com/download?c=...` URLs — use `curl -sL` to download, not WebFetch (which may be blocked).

### Authentication

- The Stitch MCP in this project uses **HTTP transport + API key** (configured via `claude mcp add`).
- If you get "OAuth2 required" errors: the API key config may have expired. Re-run `claude mcp add stitch https://stitch.googleapis.com/mcp --transport http --header "X-Goog-Api-Key: <key>"`.
- Key is in Claude Code's local project scope (`~/.claude.json`).

### Stitch 2.0 features (March 2026) worth using

- **Voice Canvas** — speak prompts directly. Not accessible via MCP, web UI only.
- **Manual editing** — click text in Stitch UI to rewrite it. Use after generation for quick fixes.
- **Instant Prototypes** — right-click a screen → generate connected screens. Useful for creating the full division page after landing on a showcase variant.
- **Design system extraction** — Stitch can extract a design system FROM generated screens. If you generate a variant Marco loves, run extract to update the design system before generating more.

---

## Stitch project state (as of this session)

| Item | Value |
|------|-------|
| Project name | APR 70 Pictures — Division Showcase |
| Project ID | `3884326936106951139` |
| Design system | `assets/c12e1d9837594aa9be2761ce1ecf907c` |
| V1 Vertical Strip screen | `0415f6b9b7c5453aaa742ab629ff6cc2` |
| V2 Vignelli Grid screen | `b91789fc443641529a2e2c7f21c70bb6` |
| V3 Cinema Trade screen | `2c95fca39d4b4ff8affcf478234eb245` |
| DESIGN.md screen | `10725818228750127878` |

HTML for all 3 variants is documented in `docs/handoff/stitch-output-divisions-2026-05-18.md`.

---

## What the next agent must do

**Step 1 — Check if Marco has picked a variant**

Ask or check BRIEF.md / TASKS.md for any note like "use V2" or "Stitch V3 wins."

**Step 2A — If Marco picked one:**

Wire it into `DivisionBlock.astro` as `variant: 'v6'`:
1. Extract the `<section>` HTML from the chosen Stitch output file
2. Convert Tailwind classes to vanilla CSS using design tokens (`var(--color-212-amber)` etc.)
3. Replace Google AI placeholder images with `{division.media}` Payload relationship
4. Remove nav/footer from the Stitch output — just the section
5. Fix violations listed in the output file (no `transition: all`, no `backdrop-filter: blur`)
6. Add `{ key: 'v6', label: 'V6 — Stitch [name]' }` to `variantMeta` in `division-variants.astro`
7. Run `pnpm check` from `web/` — fix any TypeScript errors
8. Visual QA at `http://localhost:4323/dev/division-variants`

**Step 2B — If Marco hasn't picked or wants more iteration:**

Send V0.3 HTML to Stitch using Option A above. Generate 3 more variants. Save output to `docs/handoff/stitch-output-divisions-<date>-round2.md`.

**Step 3 — After Marco approves the final variant:**

1. Set it as default `variant` in Payload seed data
2. Delete unused V0.1, V0.3, V0.x CSS from `DivisionBlock.astro`
3. Remove debug grid from `division-variants.astro`
4. Wire to real Payload data (Media relationships, division fields)
5. `pnpm preflight` (from `cms/`) — must exit 0
6. `pnpm build` (from `web/`)
7. NAS deploy

---

## BRIEF.md update note

Update `BRIEF.md` with: "Stitch project set up. 3 division showcase variants generated (V1 Vertical Strip, V2 Vignelli Grid, V3 Cinema Trade). Awaiting Marco's direction. Output in docs/handoff/stitch-output-divisions-2026-05-18.md."
