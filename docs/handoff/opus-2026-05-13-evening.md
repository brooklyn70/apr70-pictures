# Handoff — Opus 4.7 — 2026-05-13 evening

**Agent:** Claude Opus 4.7 (separate session, not the active Sonnet)
**Branch:** main
**Repo tip at start:** `e928828` (auto stop-hook BRIEF note)
**Coordination note:** Sonnet is actively working on the Phase 4 seeder blocker. This handoff was scoped to avoid any collision with seeder/collection work.

---

## What I added

### 1. `DESIGN.md` at repo root — portable canonical design spec

**Why:** The brand was scattered across `web/src/styles/tokens.css`, the v2 `APR 70 Pictures Design System/` reference folder, and prose in CLAUDE.md. Any external agent (Claude Design, Gemini, Cursor, image generators, future logo work) had no single file to consume. `DESIGN.md` is Google's `@google/design.md` format — YAML front matter (machine-readable design tokens) + markdown prose (human-readable rationale).

**Contents:**
- 22 colors, all matching v3's token keys exactly (`212-amber`, `212-sicilian-orange`, `310-imax`, `310-sicilian-blue`, `nrc-grey`, `nrc-navy`, light-mode pair, fg/bg ramps)
- 12 typography scales (Futura display + Barlow body + Share Tech Mono)
- 11 spacing tokens (8px grid)
- 4 rounding levels (mostly 0; sprocket exception at 2px)
- 5 components (button-ghost, button-solid, card, sprocket, filmstrip-rail)
- Prose sections: voice & content, colors, typography, spacing & layout, borders/corners/shadows, motion, iconography, v3 block library standards, divisions (212/310/NRC editorial focus), **logo brief for each division**, file index, maintenance

**Linted with:** `npx -y @google/design.md lint DESIGN.md` → 0 errors, 16 warnings (all "color defined but not referenced by a component" — those colors bind via prose, which is the intentional pattern for division accents and light-mode tokens).

**Color tokens map 1:1** to the Lexical Color Injector plugin's `data-color="{key}"` markup attribute and the `--color-{key}` CSS variables in `web/src/styles/tokens.css`. No drift between this doc and runtime.

---

## What I deferred (do not pick up until seeder is unblocked)

### Payload AI admin hooks — three hooks for the CMS

These should land **after Phase 4 (seeder) is green** and **after Sonnet finishes any work on `cms/src/collections/*.ts` and `payload.config.ts`**. They are inert until content exists in the admin, so there's no urgency.

The three hooks:

1. **`generateAltText`** — `afterChange` on `Media` collection. Calls Claude Haiku vision on new image uploads, writes the result to `alt` if empty. Cost: ~$0.001 per image.
2. **`generateNewsDraft`** — `afterChange` on `NewsArticle` collection. Triggered by a new `sourceUrl` field (to be added — paste a press URL, get a drafted title/deck/category). Calls Claude Sonnet.
3. **`suggestProjectTags`** — `beforeChange` on `Project` collection. Reads `title` + `logline`, returns suggested category tags via Claude Haiku.

**Implementation plan** for whoever picks it up:

1. `pnpm add @anthropic-ai/sdk` in `cms/`
2. Create `cms/src/hooks/ai/` directory with three `.ts` files (see the v2 reference at `/Users/marco/websites/APR_70/src/payload/hooks/ai/` — but adapt to v3's Payload v3 API, not v3 Next.js embedded; also adapt collection field names to match v3's `cms/src/collections/NewsArticle.ts` and `cms/src/collections/Project.ts`)
3. Wire hooks into each collection's `hooks: { afterChange / beforeChange }` block
4. Add `sourceUrl` text field to `NewsArticle.ts` (sidebar position)
5. Generate migration: `pnpm payload:migrate:create`
6. Add `ANTHROPIC_API_KEY` slot to v3's NAS env template
7. Add `ANTHROPIC_API_KEY=sk-ant-...` to `/volume1/apps/apr70-pictures/.env` on NAS
8. All hooks must `return doc` (or `return data` for beforeChange) on missing `ANTHROPIC_API_KEY` — silent no-op, never throw

**Reference code at:** `/Users/marco/websites/APR_70/src/payload/hooks/ai/` (v2 implementation — adapt, don't copy verbatim; v2 collection structures differ).

---

## Files touched

- **Added:** `DESIGN.md` (root)
- **Added:** `docs/handoff/opus-2026-05-13-evening.md` (this file)
- **Untouched:** `BRIEF.md`, `TASKS.md`, `CLAUDE.md`, all of `cms/`, all of `web/`, all migrations, all collections.

No risk of merge conflict with Sonnet's active work. Stop-hook will commit `DESIGN.md` and this handoff on Sonnet's next stop.

---

## Suggested follow-ups for `TASKS.md`

When Sonnet (or future agent) updates TASKS.md, consider adding:

- **Add CLAUDE.md reading-order pointer to `DESIGN.md`** — one line in CLAUDE.md "Reading order" section
- **Phase 6 (or later): Payload AI hooks** — three sub-tasks as outlined above
- **Phase 6 (or later): Division logo creative** — DESIGN.md has the full brief; needs designer execution. Could be Claude Design, Midjourney, or human designer. Deliverables checklist is in `DESIGN.md` § "Logo deliverables checklist."

---

## Maintenance command

Lint the design file before any tag/release:

```bash
cd /Users/marco/websites/apr70-pictures
npx -y @google/design.md lint DESIGN.md
```

Zero errors required.
