# Handoff — 2026-05-14 (payload REST client + handoff archive)

**From:** Cursor Composer (apr70-pictures)  
**To:** Next agent  
**Branch:** `main`  
**Read first:** `BRIEF.md`, `TASKS.md`, `CLAUDE.md`

**Brand / logos:** Vendored tree `web/public/brand/apr70-logos/` and rollout plan **`docs/architecture/brand-assets-integration.md`** (Payload Media, SiteSettings, division globals, Hero overlays). Next open TASK line: Payload + Astro brand integration.

---

## Housekeeping

These files were moved to `docs/handoff/archive/` so only one current handoff lives at `docs/handoff/*.md` (besides `archive/`):

- `composer-2026-05-14-media-migration.md` — v2 media rsync log notes, `migrate:v2:apply-media` CLI file map, NAS docker one-liner (summarized below).
- `claudecode-2026-05-13-evening-audit.md` — 2026-05-13 audit / orchestrator notes (historical).

---

## Shipped (web Payload client)

`web/src/lib/payload.ts` — typed REST surface for Astro SSR:

- **`PayloadHttpError`** (exported) — HTTP failures carry `status` and `url` (message is user-facing string).
- **`PayloadFetchResult<T>`** — shared `{ data, error, stale? }` shape.
- **Stale-while-revalidate** — in-process cache (effective with `@astrojs/node` standalone): default fresh **60s**, stale window **300s**; tunable via `PUBLIC_PAYLOAD_CACHE_FRESH_SEC` / `PUBLIC_PAYLOAD_CACHE_STALE_SEC`. **Production:** on unless `PUBLIC_PAYLOAD_CACHE_OFF=1`. **Dev:** off unless `PUBLIC_PAYLOAD_CACHE_IN_DEV=1`.
- **Singleflight** on cold fetches; background revalidate on stale hits without overwriting good data with transient errors.
- **`clearPayloadCache()`** — tests or manual invalidation.

Public fetchers keep existing return shapes (`{ home, error }`, `{ settings, error }`, …) with optional **`stale?: boolean`**.

Env hints: `web/.env.example`.

---

## NAS operator — `migrate:v2:apply-media` (if not run yet)

After `git pull`, rebuild CMS image if repo changed (`pnpm preflight` from `cms/` before NAS deploy per `CLAUDE.md`). From seeder (`--profile seed`), same env as content apply, **`MEDIA_ROOT=/app/media`**:

```sh
docker compose -p apr70v3 --profile seed run --rm cms-seeder \
  pnpm exec tsx scripts/migrate-v2-to-v3.ts --apply-media --v2-root /v2-export/content
```

**`/admin`:** Media collection populated; open a **Project** and **News** doc; confirm hero / filmstrip media fields.

Rsync verification, volume layout, and migration script paths live in **`docs/handoff/archive/composer-2026-05-14-media-migration.md`**. On DSM SSH, if `docker` is missing from PATH, use **`/usr/local/bin/docker`**.

---

## Orchestrator vs IDE for the *next* TASKS line

- **`apr70-orchestrator`** is built to pick **`nas-headless`** / **`nas-shell`** work from `TASKS.md` (NAS automation, shell hops).
- The **first open implementation lines** in phase order are **Phase 5 `[gemini]`** — HeroBlock slider island, FilmstripBlock renderer — then **`[requires-gui]`** visual QA. Those tags mean **multimodal / Marco sign-off**, not the default orchestrator Claude loop, unless Marco **retags** a line to `cursor+claude` or adds an explicit **`nas-shell`** apply-media checkbox for the bot.
- **NAS apply-media** remains an **operator / SSH** step (or a future dedicated `nas-shell` TASK line), not something the orchestrator runs unless you wire it that way.

**Bottom line:** The next *product* work is **Hero / Filmstrip blocks** (Gemini-friendly or Cursor if retagged). The orchestrator does **not** automatically own those lines today.

---

## Suggested order for the next coding agent

1. **`[p5] [gemini]`** HeroBlock slider island — React + GSAP crossfade; auto-featured + curated modes (`client:idle` / `client:visible` per project rules).
2. **`[p5] [gemini]`** FilmstripBlock renderer — scroll-snap, perforation bands, keyboard nav, ARIA.
3. **`[p5] [requires-gui]`** Hero + Filmstrip visual QA after the above ship.

---

## Gemini — Filmstrip research pack (read before FilmstripBlock)

**Location:** `/Users/marco/websites/apr70-website-reference-repository/filmstrip-research/` (see `README.md` in that folder).

Marco’s **filmstrip_research** materials are in-repo: format diagrams (Academy, Super 35, IMAX, 2:1), WebP variants, Kodak PDFs, and a few UI screenshots. Use them to tune perforation pitch, hole proportions, and horizontal rhythm so the block feels authentic without breaking the locked palette or `transition` rules.

**Placement ideas (editor-driven `layout` only):**

- **Project / news bodies:** Stack FilmstripBlock inside the collection `layout` where it reads well (e.g. under hero, between RichText and CTA).
- **Globals (home, divisions, about, …):** Same block in the global `layout` array for a strip between sections.
- **Header / footer chrome:** Cross-check with `SiteSettings.showFilmstripRails` and existing `Layout.astro` / footer rails — research can inform CSS, not new hardcoded page shells.
- **Gallery / slideshow:** If the strip should behave like a gallery, scope interaction inside the block or the existing Hero slider island pattern; avoid a third animation stack beyond GSAP.

Start with the README inventory, then sample the PNG/WebP line art before deep-reading the PDFs (large but high-signal for perforation and safe-area language).

---

## Verification commands

```sh
cd cms && pnpm preflight
cd web && pnpm run build
cd cms && pnpm exec vitest run scripts/migrate-v2/v2-media-migration.spec.ts
```

Use `git log -1` on your clone for the exact tip after `git pull`.
