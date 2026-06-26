# Themes + AI — apr70 design layer and build assistant

**Added:** 2026-06-25. Ports the `kima-site-build` skill's two headline ideas — a
multi-theme layer and AI build assistance — onto apr70's existing **Astro/Payload/NAS**
stack (NOT a migration to the KIMA Next.js/Vercel stack). Decisions locked with Marco:
**port onto Astro · per-division themes · AI = authoring + theme-design assistant (no
visitor-facing chat).**

---

## 1. Per-division theme layer

Each division (212 / 310 / NRC) renders the same blocks through its own **skin** — a named
set of token overrides scoped under `[data-design="<slug>"]`. Content is untouched; only the
palette, surface ramp, and (optionally) display font rebind. This reuses the exact seam the
project already had for light mode (`[data-theme="light"]`).

### Files

| File | Role |
|---|---|
| `web/src/designs/manifest.ts` | Theme registry — `DESIGNS[]`, `DEFAULT_DESIGN`, `DIVISION_DEFAULT_DESIGN`, `resolveDesign()`, `designThemeMode()`. |
| `web/src/styles/designs.css` | The skins. Every rule scoped under `[data-design="<slug>"]`; rebinds existing tokens only. |
| `web/src/layouts/Layout.astro` | Accepts `design` prop → sets `data-design` + `data-theme` on `<html>`; imports `designs.css`. |
| `web/src/pages/{212,310,nrc}.astro` | Read `division.theme` from Payload → fall back to `DIVISION_DEFAULT_DESIGN`. |
| `web/src/pages/dev/theme-studio.astro` | Dev-only preview: flip every division through every skin live. |
| `cms/src/fields/themeField.ts` | Payload `select` field (option values mirror `DesignSlug`). |
| `cms/src/globals/Division{212,310,NRC}.ts` | Register `themeField` (sidebar). |
| `cms/src/migrations/20260625_division_theme.ts` | Adds `theme` enum column to `212`/`310`/`nrc` tables. |

### Themes shipped

`signature` (house default) · `noir` (mono) · `amber-heat` (212 warm) · `imax-deep` (310 cool)
· `daylight` (light editorial). Division defaults: 212 → amber-heat, 310 → imax-deep, NRC → noir.

### How a division picks its skin

1. Admin sets **Theme** in the division global sidebar (optional).
2. The division page resolves `division.theme` → else the per-division default → else `signature`.
3. Layout stamps `data-design` on `<html>`; `designs.css` repaints.

The frontend works **today with zero CMS dependency** (defaults). The Payload field is an
override that needs its migration applied before it appears in admin.

### Adding a new theme (4 steps)

1. Add a scoped block to `web/src/styles/designs.css`.
2. Add a `DesignManifest` entry + extend `DesignSlug` in `web/src/designs/manifest.ts`.
3. Add the option to `cms/src/fields/themeField.ts` **and** extend the migration enums.
4. (Optional) point a division default at it in `DIVISION_DEFAULT_DESIGN`.

---

## 2. AI build assistant

A dev-gated assistant that helps **Marco build the site** — it is not a public visitor feature.

| File | Role |
|---|---|
| `web/src/lib/ai/assist.ts` | Shared layer. Anthropic SDK (dynamic import), `claude-opus-4-8`. Two modes. Grounded in the locked palette + block library. |
| `web/src/pages/api/ai/assist.ts` | `POST /api/ai/assist` `{ mode, prompt, context? }`. Dev-gated; key stays server-side. |
| `web/src/pages/dev/ai-studio.astro` | UI: **Author copy** (on-brand block copy + block suggestions) and **Design a theme** (generates a `[data-design]` CSS block to paste into `designs.css`). |

Modes:
- **author** — drafts headlines/body in the APR 70 voice and proposes which blocks to use.
- **theme** — returns a single `[data-design="<slug>"]` CSS block, ready to paste + register.

Grounding today is the locked design system (palette, type, block list) injected into the
system prompt. Next step for deeper grounding: feed real catalogue context (project/news
titles via the existing `fetchProjects`/`fetchNewsArticles`) into `context`.

---

## Activation checklist (deliberate, gated by Marco)

These are the only steps that touch a live environment — nothing here runs automatically.

```sh
# 1. Install the Anthropic SDK in web/
cd web && pnpm install            # picks up @anthropic-ai/sdk from package.json

# 2. Apply the division-theme migration (local dev DB auto-applies via push; prod is explicit)
cd ../cms && pnpm payload migrate            # local
# on NAS, as part of the normal deploy:
#   docker exec apr70v3-cms-1 pnpm payload migrate

# 3. Env: set the key on the web service (and PUBLIC_ENABLE_STUDIO=true to expose the
#    dev studios outside `astro dev`, e.g. on a gated staging URL).
ANTHROPIC_API_KEY=sk-ant-...
PUBLIC_ENABLE_STUDIO=true   # optional — dev routes are open under `astro dev` regardless
```

Pre-launch: move the Anthropic key to a **client-owned account** (per the kima-site-build
skill), and keep `PUBLIC_ENABLE_STUDIO` unset on the public production site so `/dev/*` and
the AI endpoint 404 for visitors.

## Try it locally

```sh
cd web && pnpm dev
# → http://localhost:4321/dev/theme-studio   (preview division skins)
# → http://localhost:4321/dev/ai-studio      (author copy / design a theme)
```
