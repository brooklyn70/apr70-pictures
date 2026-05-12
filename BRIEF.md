# BRIEF — apr70-pictures (v3)

**Updated:** 2026-05-12 (Phase 4 handoff to orchestrator)
**Repo tip:** to be set on next push
**Phase:** Phase 4 — Seed Script & Content Migration (orchestrator-ready)

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
- **tokens.css** updated with locked 6-color palette (212 Amber, 212 Sicilian Orange, 310 IMAX, NRC Grey, 310 Sicilian Blue, NRC Navy), light mode ramp (`[data-theme="light"]`), `[data-display="mega"]` mega-scale typography, `[data-color]` Lexical Color Injector selectors.
- All documentation updated: CLAUDE.md, TASKS.md, docs/architecture/v3-master-plan.md.
- Database schema pushed. TypeScript compiles clean (zero errors).
- **Phases 1–3 LOCKED:** Lexical Color Injector + mega scale, `SiteSettings` / `FooterLinks` globals, `Footer.astro` + `Layout.astro`, live preview config, **MagneticNavIsland** (GSAP pill on fine pointer; static nav on coarse pointer / reduced motion). System ready for v2-to-v3 content ingestion.
- **Phase 4 (partial):** v2 → v3 seed CLI in `cms/` — `pnpm migrate:v2:dry -- --v2-root <path>` (or `pnpm exec tsx scripts/migrate-v2-to-v3.ts --dry-run --v2-root …`). Reads JSON only; no Postgres writes; `--report <file>` for full JSON artifact. Sample tree: `cms/fixtures/v2-sample/`. `--apply` reserved (not implemented).

## What's next

**Phase 4 (orchestrator / `nas-headless`):** Idempotent seed from v2 (Keystatic/JSON/Markdown) into Payload Postgres with versioning; map v2 Project/Page to v3 `layout: Block[]`; preserve Lexical and Color Injector tokens. Media: rsync v2 NAS assets to v3, create Media collection rows, link into blocks. Full dispatch spec: `docs/handoff/phase-4-orchestrator-handoff-2026-05-12.md`.

**Still open elsewhere:** Hero/Filmstrip islands (Phase 5+). DSM staging slot (Phase 7).

## Blocked / waiting

- DSM reverse-proxy slot for staging-v3 (Phase 7).

## Open questions for Marco

## Spend log (last 7 days)

Empty — orchestrator USAGE.jsonl not yet writing.

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
