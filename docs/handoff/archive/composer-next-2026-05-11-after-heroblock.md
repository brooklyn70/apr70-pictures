# Handoff — next Cursor Composer agent (apr70-pictures)

**Date:** 2026-05-11  
**Repo:** `brooklyn70/apr70-pictures`  
**Branch:** pull `main` before starting.

## What the previous agent finished

- **HeroBlock pipeline:** Payload block + **Home** global (`layout` blocks) → regenerated `cms/src/payload-types.ts` → Astro `BlockRenderer` + `HeroBlock.astro` → **`/test-hero`** page in `web/`.
- **Type sharing:** `web/tsconfig.json` paths + `web/astro.config.mjs` Vite alias → `payload-types` points at `../cms/src/payload-types.ts`.
- **`web/.env.example`** — documents **`PUBLIC_PAYLOAD_URL`** (Astro uses this at build time to call the CMS API).
- **`web/Dockerfile`** — optional build-arg **`PUBLIC_PAYLOAD_URL`** for static builds that must fetch globals.
- **`TASKS.md`** — HeroBlock line marked done.

**Concrete paths:** `cms/src/blocks/HeroBlock.ts`, `cms/src/globals/Home.ts`, `web/src/lib/payload.ts`, `web/src/components/blocks/*`, `web/src/pages/test-hero.astro`.

## Documents to read (in order)

1. `BRIEF.md` — session context (orchestrator may update; do not hand-edit unless your workflow says so).
2. `TASKS.md` — source of truth for the next checkbox.
3. `CLAUDE.md` — repo rules (BlockRenderer pattern, tokens, no `transition: all`, type sharing).
4. `docs/architecture/blocks.md` — block specs (RichText / D-7 called out there).
5. `docs/architecture/schema.md` — Globals + `layout: Block[]`.
6. `docs/architecture/integration.md` — Payload ↔ Astro, env, media URLs.
7. `docs/handoff/composer-next-2026-05-11-phase2-continued.md` — non-interactive Payload scaffold (`npx create-payload-app` flags) and stack notes.

## Next task to implement (Phase 2)

**Primary (coding):** **`[p2] [cursor+claude]`** — Port **D-7 Lexical** inline blocks (`structureDivider`, `button`, `accentText`) from **v2** `RichText.tsx` into the **v3** stack (Payload Lexical config + Astro rendering path). The v2 file lives in **`brooklyn70/apr70-clone`** (not guaranteed to be in this repo); pull or reference that file explicitly. Align behavior with `docs/architecture/blocks.md` (RichTextBlock section).

**Parallel / non-code:** **`[p2] [nas-headless]`** — DSM reverse-proxy for `staging-v3.apr70.com` and Basic Auth on **`/admin`** (Marco / NAS); document nginx or DSM steps; do not block Lexical work on this.

## Plain-language: how to run the site and see the hero test page

These are three separate processes: **database**, **CMS (Payload)**, **public site (Astro)**.

**Option A — full stack with Docker (simplest if you use the repo compose file)**

1. From the **repository root**, run: `docker compose up --build` (needs `PAYLOAD_SECRET` in environment or root `.env`; see root `docker-compose.yml`).
2. That starts Postgres, the CMS, the built static `web` container, and **nginx** on **port 8080**.
3. Payload admin is available through nginx at **`http://localhost:8080/admin`** (not port 3000), because nginx routes `/admin` and `/api` to the CMS.

**Option B — CMS only on your machine**

1. Start Postgres (local install or Docker) and set **`DATABASE_URL`** + **`PAYLOAD_SECRET`** in `cms/.env` (see `cms/.env.example`).
2. In `cms/`: `pnpm install` then `pnpm dev`. CMS usually listens on **`http://localhost:3000`** and admin at **`/admin`**.

**Add content in admin**

1. Log into Payload admin.
2. Open **Globals → Home**.
3. Under **Layout blocks**, add a **Hero** block, fill fields, save.

**Run the Astro site and point it at the CMS**

1. In `web/`, copy `.env.example` to `.env`.
2. Set **`PUBLIC_PAYLOAD_URL`** to the **base URL your browser would use to reach the CMS API**, **with no trailing slash**:
   - Docker + nginx on your machine: typically **`http://localhost:8080`**
   - CMS dev server directly: **`http://localhost:3000`**
3. In `web/`: `pnpm install` then `pnpm dev`.
4. Open **`http://localhost:4321/test-hero`** (Astro default port; confirm in terminal if different).

If the page shows a message about **`PUBLIC_PAYLOAD_URL`**, the env file is missing or the variable is wrong. If it shows a fetch error, the CMS is not running or the URL does not reach `/api/globals/home`.

**First time after schema changes:** start the CMS at least once against Postgres so Payload can create tables for new globals/blocks.

## Notes for the next agent

- Regenerate CMS types after schema edits: `cd cms && pnpm run generate:types`.
- Do not commit secrets; `.env` files stay local.
- `BRIEF.md` is normally updated by orchestrator stop hooks; follow `CLAUDE.md` if unsure.
