# BRIEF — apr70-pictures (v3)

**Updated:** 2026-05-12 (Phase 4 seed CLI complete — ready for NAS deploy)
**Repo tip:** 8f3b498
**Phase:** Phase 4 — NAS deploy + live seed

---

## What's done

- v2 (`brooklyn70/apr70-clone`) feature-frozen; `V2_FROZEN.md` committed.
- Two repos created: `apr70-pictures` (this), `apr70-orchestrator`.
- v3 monorepo skeleton: `web/`, `cms/`, `docker-compose.yml`, README, BRIEF, TASKS, CLAUDE.
- Astro scaffold with React integration + TypeScript.
- Payload 3.84.1 scaffold with Postgres, Lexical editor, D-7 inline blocks.
- Docker compose stack (postgres + cms + web + nginx).
- **Master Architecture Plan** approved after 4 drafts reviewed by Perplexity + Grok + Marco.
- **11 Payload block schemas** created (Hero, RichText, TwoCol, Grid, CTA, Quotes, Filmstrip, Division, Stats, Divider + D7 Lexical inline blocks).
- **11 Astro renderers** created with matching BlockRenderer switch.
- **tokens.css** updated with locked 6-color palette, light mode ramp, mega-scale typography, Lexical Color Injector selectors.
- **Phases 1–3 LOCKED:** Lexical Color Injector + mega scale, `SiteSettings` / `FooterLinks` globals, `Footer.astro` + `Layout.astro`, live preview config, MagneticNavIsland.
- **Phase 4 seed CLI COMPLETE (`cms/scripts/migrate-v2-to-v3.ts`):**
  - `--dry-run` verified on Mac: 23 files, 14 pages, 9 projects, **83/83 blocks mapped, 0 warnings**.
  - Synthesizers for all schemas: homepage, about, contact, jobs, pitch, quotes, slate, partners, footer-more, news (5 articles), 9 projects.
  - `--apply` implemented: Payload Local API upserts `home` global layout + `SiteSettings.seededVersion`. Idempotent.
  - v2 content export on NAS: `/volume1/apps/apr70-pictures/v2-export/content/`.
  - v2 media on NAS: `/volume1/apps/apr70/public/` (537 MB).
  - v3 media volume: Docker `apr70_apr70_media` → `/app/public/media` inside CMS container.
  - NAS DATABASE_URI: `postgresql://apr70:***@postgres:5432/apr70_payload`.
  - **NAS situation:** current `apr70-app-1` container is v2 schema. v3 stack (`apr70-pictures/docker-compose.yml`) must be built fresh before seed runs.
  - Full NAS deploy + seed dispatch: `docs/handoff/nas-deploy-2026-05-12.md`.

## What's next

**Immediate (orchestrator, two `--once` hops — see `docs/handoff/nas-deploy-2026-05-12.md`):**
1. Hop 1 `[nas-headless]`: `docker compose up --build` in `/volume1/apps/apr70-pictures/` — brings v3 stack up with fresh Postgres.
2. Hop 2 `[nas-headless]`: `pg_dump` backup, then `pnpm migrate:v2:apply` — live seed into v3 Postgres.

**After seed verified:** Media migration — rsync `/volume1/apps/apr70/public/` → v3 media volume, create Media collection rows, link into blocks.

**Parallel (cursor+claude):** `web/src/lib/payload.ts` typed client — error handling, caching, stale-while-revalidate.

**Still open:** Hero/Filmstrip islands (Phase 5+). DSM staging slot (Phase 7).

## Blocked / waiting

- v3 Docker stack not yet running on NAS (needs Hop 1).
- DSM reverse-proxy slot for staging-v3 (Phase 7).

## Open questions for Marco

- Confirm NAS SSH alias: docs use `apr70-nas` — verify this matches your `~/.ssh/config`.

## Spend log (last 7 days)

Empty — orchestrator USAGE.jsonl not yet writing to this repo.

## Auto-stop note (2026-05-10 01:42 UTC)

- Branch: main
- Tip: b7fcd06

## Auto-stop note (2026-05-11 13:01 UTC)

- Branch: main
- Tip: c64f3fa

## Auto-stop note (2026-05-11 13:05 UTC)

- Branch: main
- Tip: 35f3f27


## Orchestrator note (2026-05-11 13:16 UTC)

Ran task `[p1] [claude] Page schema — `layout: Block[]` on each Global. Output `docs/architecture/schema.md`.` via claude_code subprocess. Returncode=0; ~24+1 tokens (est $0.0001). USAGE.jsonl appended.

## Auto-stop note (2026-05-11 13:17 UTC)

- Branch: main
- Tip: 8d4e3da

## Auto-stop note (2026-05-11 14:15 UTC)

- Branch: main
- Tip: b3bacff


## Orchestrator note (2026-05-11 14:17 UTC)

Ran task `[p1] [cursor+claude] Token contract — port `APR 70 Pictures Design System/colors_and_type.css` from v2; confirm or revise color/type/spacing tokens.` via claude_code subprocess. Returncode=0; ~37+191 tokens (est $0.003). USAGE.jsonl appended.

## Auto-stop note (2026-05-11 14:17 UTC)

- Branch: main
- Tip: d12edbd


## Orchestrator note (2026-05-11 14:17 UTC)

Ran task `[p1] [cursor+claude] Token contract — port `APR 70 Pictures Design System/colors_and_type.css` from v2; confirm or revise color/type/spacing tokens.` via claude_code subprocess. Returncode=0; ~37+224 tokens (est $0.0035). USAGE.jsonl appended.

## Auto-stop note (2026-05-11 14:18 UTC)

- Branch: main
- Tip: 16f8964

## Auto-stop note (2026-05-11 14:40 UTC)

- Branch: main
- Tip: 8da255a

## Auto-stop note (2026-05-11 14:49 UTC)

- Branch: main
- Tip: 62ddaa6

## Auto-stop note (2026-05-11 15:05 UTC)

- Branch: main
- Tip: 379eed5

## Orchestrator note (2026-05-11 15:05 UTC)

Ran task `[p1] [nas-headless] Orchestrator Notifications — integrate Telegram API or SMTP so the orchestrator pushes an alert to Marco whenever `BRIEF.md` is updated or a task finishes.` via claude_code subprocess. Returncode=0; ~43+459 tokens (est $0.007). USAGE.jsonl appended.

## Auto-stop note (2026-05-11 15:42 UTC)

- Branch: main
- Tip: 13411fb

## Auto-stop note (2026-05-11 15:55 UTC)

- Branch: main
- Tip: 5699eaa

## Auto-stop note (2026-05-11 15:58 UTC)

- Branch: main
- Tip: ff5584c

## Auto-stop note (2026-05-11 16:00 UTC)

- Branch: main
- Tip: 60df310

## Auto-stop note (2026-05-11 16:01 UTC)

- Branch: main
- Tip: eb849a9

## Auto-stop note (2026-05-11 16:07 UTC)

- Branch: main
- Tip: bd4f23d

## Auto-stop note (2026-05-11 16:28 UTC)

- Branch: main
- Tip: f5909cc

## Auto-stop note (2026-05-11 17:13 UTC)

- Branch: main
- Tip: e5a1c68

## Auto-stop note (2026-05-11 17:19 UTC)

- Branch: main
- Tip: 9b887bc

## Auto-stop note (2026-05-11 17:22 UTC)

- Branch: main
- Tip: 35fecb6

## Auto-stop note (2026-05-11 17:29 UTC)

- Branch: main
- Tip: f6e8fe8

## Auto-stop note (2026-05-11 17:30 UTC)

- Branch: main
- Tip: 64ffad8

## Auto-stop note (2026-05-11 17:32 UTC)

- Branch: main
- Tip: 9da728c

## Auto-stop note (2026-05-11 17:34 UTC)

- Branch: main
- Tip: 5e7b6ce

## Auto-stop note (2026-05-11 17:34 UTC)

- Branch: main
- Tip: 0af3922

## Auto-stop note (2026-05-11 17:34 UTC)

- Branch: main
- Tip: 401b8e9

## Auto-stop note (2026-05-11 17:35 UTC)

- Branch: main
- Tip: 3278242

## Auto-stop note (2026-05-11 17:36 UTC)

- Branch: main
- Tip: fc7b1e2

## Auto-stop note (2026-05-11 17:36 UTC)

- Branch: main
- Tip: 3590458

## Auto-stop note (2026-05-11 17:41 UTC)

- Branch: main
- Tip: 11678d6

## Auto-stop note (2026-05-11 17:47 UTC)

- Branch: main
- Tip: 085c681

## Auto-stop note (2026-05-11 17:48 UTC)

- Branch: main
- Tip: 5a3f8ef

## Auto-stop note (2026-05-11 17:49 UTC)

- Branch: main
- Tip: 957a8db

## Auto-stop note (2026-05-11 17:57 UTC)

- Branch: main
- Tip: 91b7d06

## Auto-stop note (2026-05-11 17:59 UTC)

- Branch: main
- Tip: f93a30f

## Auto-stop note (2026-05-11 18:01 UTC)

- Branch: main
- Tip: f563645

## Auto-stop note (2026-05-11 18:06 UTC)

- Branch: main
- Tip: e5e9c8d

## Auto-stop note (2026-05-11 18:12 UTC)

- Branch: main
- Tip: eb99c81


- Branch: main
- Tip: 490e2b8

## Session note (2026-05-11) — Astro scaffold

- `web/`: `pnpm create astro@latest` (basics template), TypeScript strict (`astro/tsconfigs/strict`), `@astrojs/react`, Tailwind CSS v4 via `@tailwindcss/vite`, `@astrojs/sitemap`. `site` set to `https://apr70.com` for sitemap URLs. `TASKS.md` Phase 2 Astro line marked done.

## Auto-stop note (2026-05-11 18:16 UTC)

- Branch: main
- Tip: 8adfb20

## Auto-stop note (2026-05-11 18:24 UTC)

- Branch: main
- Tip: b8de046

## Auto-stop note (2026-05-11 18:24 UTC)

- Branch: main
- Tip: 7c9c671

## Session note (2026-05-11) — Payload + compose

- `cms/`: Payload **3.84.1** blank app via `npx create-payload-app@latest` (non-interactive: `-t blank --db postgres --db-connection-string ... --use-pnpm --no-agent --no-git`). `@payloadcms/db-postgres`, Lexical editor, generated `payload-types.ts`. Template `docker-compose.yml` (Mongo) removed; use **repo root** stack.
- `next.config.ts`: `output: 'standalone'` for CMS Dockerfile.
- Root **`docker-compose.yml`**: `postgres`, `cms` (build `./cms`), `web` (Astro static via `web/Dockerfile`), `nginx` (`nginx/default.conf` routes `/admin`, `/api`, `/_next` to cms, `/` to web). Port **8080:80**.
- `TASKS.md`: Phase 2 lines for Payload scaffold and compose marked done. DSM reverse-proxy + Basic Auth line still open.

## Auto-stop note (2026-05-11 18:56 UTC)

- Branch: main
- Tip: 4873e08

## Auto-stop note (2026-05-11 19:01 UTC)

- Branch: main
- Tip: 74eab9e

## Auto-stop note (2026-05-11 19:03 UTC)

- Branch: main
- Tip: f7a424c

## Auto-stop note (2026-05-11 19:03 UTC)

- Branch: main
- Tip: f7a424c

## Auto-stop note (2026-05-11 19:05 UTC)

- Branch: main
- Tip: 4028bc8

## Auto-stop note (2026-05-11 19:08 UTC)

- Branch: main
- Tip: 8191c36

## Auto-stop note (2026-05-11 19:18 UTC)

- Branch: main
- Tip: eb4c652

## Auto-stop note (2026-05-11 19:23 UTC)

- Branch: main
- Tip: 534a620

## Auto-stop note (2026-05-11 19:38 UTC)

- Branch: main
- Tip: 178cb46

## Auto-stop note (2026-05-11 19:40 UTC)

- Branch: main
- Tip: fb1d234

## Session note (2026-05-11) — TwoColBlock Implementation

- Created `TwoColBlock` Payload schema in `cms/src/blocks/TwoColBlock.ts`.
- Registered `TwoColBlock` in `cms/src/globals/Home.ts`.
- Regenerated payload types via `pnpm run generate:types`.
- Created Astro renderer in `web/src/components/blocks/TwoColBlock.astro` utilizing the 8px grid spacing and standard v3 design tokens.
- Registered the block in `<BlockRenderer>`.
- `TASKS.md` Phase 3 `TwoColBlock` task marked done. Visual QA deferred to Marco.

## Auto-stop note (2026-05-12 09:52 UTC)

- Branch: main
- Tip: 6df7022

## Auto-stop note (2026-05-12 09:55 UTC)

- Branch: main
- Tip: 4e1149e


## Orchestrator note (2026-05-12 10:00 UTC)

Ran task `[p3] [gemini] Magnetic Navigation island — React + GSAP. `transform`+`opacity` only. `prefers-reduced-motion` + `pointer: coarse` disabled.` via claude_code subprocess. Returncode=0; ~34+37 tokens (est $0.0007). USAGE.jsonl appended.

## Auto-stop note (2026-05-12 10:11 UTC)

- Branch: main
- Tip: 0764e61

## Auto-stop note (2026-05-12 10:12 UTC)

- Branch: main
- Tip: c52130c

## Auto-stop note (2026-05-12 10:16 UTC)

- Branch: main
- Tip: 3ef32cd

## Auto-stop note (2026-05-12 10:18 UTC)

- Branch: main
- Tip: df52d96

## Auto-stop note (2026-05-12 10:22 UTC)

- Branch: main
- Tip: 1bbcda8

## Auto-stop note (2026-05-12 12:50 UTC)

- Branch: main
- Tip: 3caac7e

## Auto-stop note (2026-05-12 13:00 UTC)

- Branch: main
- Tip: 5f752c5

## Auto-stop note (2026-05-12 13:09 UTC)

- Branch: main
- Tip: 03d7313

## Auto-stop note (2026-05-12 17:06 UTC)

- Branch: main
- Tip: ba53a31


## Orchestrator note (2026-05-12 17:06 UTC)

Ran task `[p4] [nas-headless] NAS Hop 1 — `docker compose up --build` in `/volume1/apps/apr70-pictures/` to bring v3 stack up with fresh Postgres. Verify CMS health at port 3000 before Hop 2.` via claude_code subprocess. Returncode=0; ~45+207 tokens (est $0.0032). USAGE.jsonl appended.


## Orchestrator note (2026-05-12 18:11 UTC)

Ran task `[p4] [nas-shell] NAS Hop 1 — Build and start v3 stack. SHELL: cd /volume1/apps/a` via shell runner. Returncode=1; USAGE.jsonl appended.
