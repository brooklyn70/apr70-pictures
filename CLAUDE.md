# CLAUDE.md — apr70-pictures (v3)

**Authoritative working document for all agents working in this repo.**
**Last updated:** 2026-05-13 (context handoff rule added)
**Repo:** `brooklyn70/apr70-pictures`
**Live (when shipped):** https://apr70.com
**Staging:** https://staging-v3.apr70.com (pending DSM slot)
**Hosting:** Synology NAS (DSM Reverse Proxy → Docker stack at `/volume1/apps/apr70-v3`)

---

## Reading order for any new session

1. `BRIEF.md` — current state, last updated by previous agent's stop hook.
2. `TASKS.md` — priority backlog. Pick the top task tagged for your tool.
3. This file — project conventions.
4. `docs/architecture/` — schema + block library + integration specs.
5. `docs/architecture/v3-master-plan.md` — the director-approved architecture plan.

---

## How v3 works

**Payload is the single source of truth for ALL content.** There is no Keystatic, no content/ directory, no file-based fallbacks. Content enters the system via:
1. An idempotent seed script (`seed.ts`) that runs on first boot via Payload's `onInit`.
2. The Payload Admin UI (`/admin`) for all subsequent edits.

Layout is editor-authored via block stacking. Each page Global has a `layout: Block[]` field. The frontend is one `<BlockRenderer>` switch. Agents write **block components** and **island components**, never per-page React templates.

---

## Hard rules

1. **No hardcoded page layouts.** Every page uses `<BlockRenderer blocks={page.layout} />`.
2. **No new colors outside the locked palette.** See Token Contract below.
3. **No `transition: all`.** Animate only `opacity`, `transform`, and explicitly-named properties.
4. **No emoji** on the rendered site or in commits. Internal docs are fine.
5. **Non-interactive blocks = Astro components (zero JS).** Interactive blocks = React islands via `client:idle` or `client:visible`.
6. **Type-share via `payload-types.ts`.** Every block imports types from generated Payload types.
7. **GSAP only.** No Framer Motion. No other animation libraries.
8. **Both modes.** Every block MUST render correctly in dark mode AND light mode from day one.
9. **Mobile-first.** All CSS designed for 375px–1440px with `clamp()`. No desktop-first code.
10. **Media relationships.** Blocks use Payload Media relationships, never loose path strings.
11. **Stop hooks handle commits.** Update BRIEF.md before stopping.
12. **GUI tasks need Marco.** Tasks tagged `requires-gui` need visual review.
13. **Preflight before NAS deploy.** Run `pnpm preflight` from `cms/` and confirm it exits 0 before any `docker compose up --build` on the NAS. This catches missing components, TypeScript errors, and broken imports that the dry-run cannot see.
14. **Context handoff (ENFORCED BY HOOK).** A `PreToolUse` hook (`.claude/hooks/context-gate.sh`) tracks accumulated tool output via `.claude/.context-meter`. At ~250KB accumulated output (~55-60% context), the hook warns the agent and then hard-blocks all tools except Write/Edit/Read/git. The agent MUST: write a handoff doc to `docs/handoff/[model]-[date]-[summary].md`, update `BRIEF.md`, commit+push, and tell the user to start a fresh session. The Stop hook resets the meter for the next session.
15. **One handoff in `docs/handoff/`.** Only the current session's handoff doc lives at the top level. On session start, move any existing handoff docs to `docs/handoff/archive/` before writing a new one. The user should always find exactly one file (the latest) without digging.

---

## Token contract (LOCKED)

### Brand Colors

| Token Key | Name | Hex |
|-----------|------|-----|
| `212-amber` | 212 Amber | `#824B07` |
| `212-sicilian-orange` | 212 Sicilian Orange | `#E85D04` |
| `310-imax` | 310 IMAX | `#077082` |
| `nrc-grey` | NRC Grey | `#c8c8c8` |
| `310-sicilian-blue` | 310 Sicilian Blue | `#0077B6` |
| `nrc-navy` | NRC Navy | `#001F3F` |

### Light Mode
- Background: `#FAFAF8`
- Text: `#1A1A1A`

### CSS Variables
All brand colors stored as `--color-{token-key}` in `web/src/styles/tokens.css`.
Lexical Color Injector stores `data-color="{token-key}"` in markup.
`[data-theme="light"]` selector block flips `--fg-*` and `--bg-*` ramps.

Typography: Futura Std (display), Barlow (body), Share Tech Mono (filmstrip/meta).

---

## Stack

- **Frontend:** Astro (HTML-first; React islands for interactive blocks). TypeScript. Vanilla CSS via tokens.css.
- **Backend:** Payload v3 (Postgres). Standalone Node service. Lexical editor with D-7 inline blocks + Color Injector plugin.
- **Animation:** GSAP + ScrollTrigger. No other motion libraries.
- **Hosting:** Docker on Synology NAS. nginx reverse proxy. Postgres in container. Media on NAS volume.
- **Deploy:** push → NAS git fetch + reset → docker compose build + up.

---

## Block library (11 blocks)

1. **HeroBlock** — heading, subtext, media. Variants: default, split, fullscreen, slider-auto, slider-curated.
2. **RichTextBlock** — Lexical body with D-7 inline blocks + mega-scale toggle.
3. **TwoColBlock** — left heading, right body. Ratios: 1-3, 1-1, 1-2.
4. **GridBlock** — array of cards with media + title + description.
5. **CTABlock** — heading + buttons (solid, ghost, link variants).
6. **QuotesBlock** — quote + attribution. Stacked or carousel.
7. **FilmstripBlock** — horizontal image track with perforation bands. CSS scroll-snap.
8. **DivisionBlock** — division showcase with 5 visual variants. Color-token-locked.
9. **StatsBlock** — large numeric data points in 2-4 column grid.
10. **DividerBlock** — structure divider with optional mono-spaced label.
11. Plus interactive **islands**: HeroSliderIsland, MasonryIsland, MagneticNavIsland.

---

## Orchestrator integration

This repo is consumed by the orchestrator at `brooklyn70/apr70-orchestrator`. The orchestrator picks tasks from `TASKS.md`, dispatches them, captures USAGE, and updates `BRIEF.md`.

---

## File line cap

This file should stay under 200 lines. Older context lives in `docs/architecture/`.
