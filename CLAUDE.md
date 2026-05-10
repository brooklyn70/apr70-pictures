# CLAUDE.md — apr70-pictures (v3)

**Authoritative working document for all agents working in this repo.**
**Last updated:** 2026-05-09 (initial)
**Repo:** `brooklyn70/apr70-pictures`
**Live (when shipped):** https://apr70.com
**Staging:** https://staging-v3.apr70.com (pending DSM slot)
**Hosting:** Synology NAS (DSM Reverse Proxy → Docker stack at `/volume1/apps/apr70-v3`)

---

## Reading order for any new session

1. `BRIEF.md` — current state, last updated by previous agent's stop hook.
2. `TASKS.md` — priority backlog. Pick the top task tagged for your tool.
3. This file — project conventions.
4. `docs/architecture/` — schema + block library + integration specs (once Phase 1 ships).

---

## How v3 differs from v2

v2 (`brooklyn70/apr70-clone`) was a Next.js + Payload site where layout was hardcoded in React templates and Payload supplied named fields. Editors could only reorder content within Lexical body fields. The design discipline lived in code (rules 11–12 of v2's CLAUDE.md, `apr70-design-audit` skill).

v3 inverts that: **layout is editor-authored, design discipline lives in the schema.** Each page Global has a `layout: Block[]` field. Editors drag blocks from a fixed library; block schemas constrain colors to locked tokens, spacing to the 8px grid, typography to the named families. Editors can produce any valid composition; they cannot produce invalid output.

This means **agents do not write per-page React components**. They write **block components** and **island components**. Page rendering is one `<BlockRenderer>` switch.

---

## Hard rules

1. **No hardcoded page layouts.** Every page uses `<BlockRenderer blocks={page.layout} />`. If you find yourself reaching for "I'll just write this section directly in the page.astro," stop — it should be a block.
2. **No new design tokens outside the locked set.** All colors come from `web/src/styles/tokens.css`. All spacing uses the 8px grid. All typography uses the named families. New tokens are a deliberate change, with a commit and a note in BRIEF.md, not an ad-hoc addition.
3. **No `transition: all`.** Animate only `opacity`, `transform`, and explicitly-named CSS properties. Carry-over from v2; still correct.
4. **No emoji** anywhere on the rendered site or in commits. Internal docs (BRIEF.md, this file) are fine.
5. **Pure layout/typography blocks render as Astro components.** They ship zero JS. Interactive blocks (Hero animations, Filmstrip, Lightbox, FixedUI) are React **islands** mounted via `client:idle` or `client:visible`. Don't make a non-interactive block a React island.
6. **Type-share via `payload-types.ts`.** Every block's render component imports its props type from the generated Payload types. No hand-rolled duplicate types.
7. **Stop hooks handle commits and pushes.** Do not manually `git push` at the end of a session — the hook does it. Do update BRIEF.md before stopping.
8. **GUI tasks need Marco.** Tasks tagged `requires-gui` in TASKS.md need visual review. Don't merge them autonomously; queue them for Marco's morning review.

---

## Token contract (initial — refine in Phase 1)

Inherits from v2's locked tokens. To be ported into `web/src/styles/tokens.css` in Phase 2.

| Token | Hex | Use |
|---|---|---|
| `--amber` | `#824B07` | (212) Pictures division |
| `--teal` | `#077082` | (310) Pictures division |
| `--orange` | `#E85D04` | Investor / accent |
| `--offwhite` | `#c8c8c8` | NRC / secondary text |
| `--apr-near-black` | `#1e1e1e` | UI button borders |
| `--apr-mid-dark` | `#3a3a3a` | UI meta text |

Typography: Futura Bold (display), Barlow 300/400/500/700 (body), Courier New (mono / meta). Share Tech Mono reserved for filmstrip-style fragments only.

---

## Stack

- **Frontend:** Astro (HTML-first; React islands for interactive blocks). TypeScript. Tailwind CSS v4 (or vanilla CSS modules — decide in Phase 1).
- **Backend:** Payload v3 (Postgres). Standalone Node service. Lexical editor with D-7 inline blocks ported from v2.
- **Hosting:** Docker on Synology NAS. nginx reverse proxy. Postgres in container. Media on NAS volume.
- **Deploy:** push → NAS git fetch + reset → docker compose build + up. Same Rule 9c flow as v2.

---

## Block library (initial 6, finalized in Phase 1)

1. **HeroBlock** — heading, subtext, optional media (image or video). Variants per division.
2. **TwoColBlock** — left label/heading, right body. Used for company/principles/jobs sections.
3. **GridBlock** — array of typed items rendered as CSS grid. Auto-fill minmax pattern.
4. **CTABlock** — heading + buttons. Buttons are token-locked variants (primary, secondary, ghost).
5. **QuotesBlock** — quote + attribution. Carousel or stacked.
6. **RichTextBlock** — Lexical body with D-7 inline blocks (`structureDivider`, `button`, `accentText`).

Plus interactive **island wrappers**: HeroIsland, FilmstripIsland, LightboxIsland, FixedUiIsland.

---

## Orchestrator integration

This repo is one of two consumed by the orchestrator at https://github.com/brooklyn70/apr70-orchestrator. The orchestrator picks tasks from `TASKS.md`, dispatches them to the right tool/provider, captures USAGE, and updates `BRIEF.md`. Don't manually update `BRIEF.md` outside of stop hooks; the orchestrator owns it during automated runs.

---

## File line cap

This file should stay under 200 lines. Older context lives in `docs/architecture/` and `docs/decisions/`.
