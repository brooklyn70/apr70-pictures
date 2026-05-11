# Handoff — next Cursor Composer agent (apr70-pictures)

**Date:** 2026-05-12  
**Repo:** `brooklyn70/apr70-pictures`  
**Branch:** pull `main` before starting.

## Tool routing (read this first)

| Next task (per `TASKS.md` order) | Tool hint on the line | Meaning |
|----------------------------------|------------------------|---------|
| **TwoColBlock** (first open Phase 3 line) | **`[gemini]`** | Visual/design-led block work and v2 parity — **prefer Gemini (or Marco-assigned visual agent)**, not Composer as primary. |
| **HeroIsland** (first open **`[cursor+claude]`** in Phase 3) | **`[cursor+claude]`** | **Composer + Claude in Cursor** — this is your lane if Marco skips the Gemini rows for now. |
| **DSM / staging proxy** (last open Phase 2 line) | **`[nas-headless]`** | NAS / orchestrator / Marco on hardware — **not** a Cursor coding session. |

**Marco’s eyes (`requires-gui`):** **Not required yet** for the next Phase 2–3 skeleton work. **`requires-gui`** items start in earnest at **Phase 4** (compose real pages from blocks) and Phase 5 audits. Phase 3 **`[gemini]`** rows imply visual QA against v2; queue for Marco when you need sign-off on layout, not for every PR.

## What the previous session finished

- **D-7 Lexical parity with v2:** `structureDivider`, `button`, `accentText` as Lexical **blocks** (same field shapes as `brooklyn70/apr70-clone` `src/payload/lexical/d7-blocks.mjs` + `RichText.tsx`). CMS: `cms/src/blocks/D7LexicalBlocks.ts`, `cms/src/editor/aprLexicalEditor.ts`, `editor: aprLexicalEditor` in `cms/src/payload.config.ts`.
- **Rich text layout block:** `cms/src/blocks/RichTextBlock.ts`; **Home** global `layout` includes Hero + Rich text. Astro: `web/src/lib/lexicalToHtml.ts`, `RichTextBlock.astro`, `BlockRenderer` branch for `richText`. Test still at **`/test-hero`** (layout blocks).
- **Deployment note:** `docs/deployment/staging-v3-dsm-proxy.md` (DSM reverse proxy + Basic Auth on `/admin`).
- **`TASKS.md`:** Phase 2 D-7 line checked; NAS Phase 2 line still open with pointer to that doc.

## Documents to read (in order)

1. **`BRIEF.md`** — session / orchestrator context (do not hand-edit unless your workflow says so).
2. **`TASKS.md`** — **source of truth** for the next checkbox and **tool hint** (`gemini` vs `cursor+claude` vs `nas-headless`).
3. **`CLAUDE.md`** — BlockRenderer pattern, tokens (`web/src/styles/tokens.css`), type sharing, no `transition: all`, no emoji on site.
4. **`docs/architecture/blocks.md`** — block specs (TwoCol is next in the library).
5. **`docs/architecture/schema.md`** — Globals + `layout: Block[]`.
6. **`docs/architecture/integration.md`** — Payload ↔ Astro, env, media URLs.
7. **`docs/deployment/staging-v3-dsm-proxy.md`** — if you touch NAS / staging routing.
8. **`docs/handoff/composer-next-2026-05-11-phase2-continued.md`** — Payload scaffold / `npx create-payload-app` flags (historical).
9. **`docs/handoff/composer-next-2026-05-12.md`** — this handoff (session transition).

## Doc / repo verification (run before coding)

Confirm the tree matches what you expect and that handoff docs weren’t missed:

```bash
cd /path/to/apr70-pictures
git fetch origin main && git pull origin main

# Required reference files exist
for f in TASKS.md CLAUDE.md BRIEF.md \
  docs/architecture/blocks.md docs/architecture/schema.md docs/architecture/integration.md \
  docs/deployment/staging-v3-dsm-proxy.md docs/handoff/composer-next-2026-05-12.md \
  cms/src/editor/aprLexicalEditor.ts cms/src/blocks/D7LexicalBlocks.ts \
  web/src/lib/lexicalToHtml.ts web/src/components/blocks/RichTextBlock.astro
do
  test -f "$f" || echo "MISSING: $f"
done

# Next open tasks (sanity)
grep -n '^- \[ \]' TASKS.md | head -20
```

**After schema or task-list changes:** regenerate CMS types — `cd cms && pnpm run generate:types`. If you add user-facing behavior, ensure **`TASKS.md`** and any **`docs/architecture/*`** touched by that feature stay aligned (architecture docs are stale if blocks.md still says RichTextBlock is Phase-3-only but Home already ships a `richText` block — reconcile in a dedicated edit if Marco wants spec = code).

## Next task to implement (priority)

1. **By strict `TASKS.md` order:** **`[p3] [gemini]` TwoColBlock** — Payload schema + Astro renderer + visual QA vs v2. **Assign to Gemini (or Marco’s visual workflow), not Composer as default.**
2. **If Marco routes this Composer session instead:** **`[p3] [cursor+claude]` HeroIsland** — React + GSAP, `client:idle`, port v2 hero behavior (see CLAUDE.md islands rule).
3. **Parallel infra (non-Cursor):** **`[p2] [nas-headless]`** DSM slot for `staging-v3.apr70.com` + Basic Auth `/admin` — follow `docs/deployment/staging-v3-dsm-proxy.md`; do not block Cursor on it.

## Build checks

```bash
cd cms && pnpm run build      # expects cms/.env for anything DB-touching at runtime
cd web && pnpm run build      # PUBLIC_PAYLOAD_URL must be correct for globals fetch during static build when testing CMS-backed pages
```

## Notes

- v2 reference repo: **`brooklyn70/apr70-clone`** (public); D-7 source of truth paths cited above.
- Do not commit secrets; `.env` stays local.
