# TASKS — apr70-pictures (v3)

Priority-ordered backlog. Marco edits this in the morning; agents work it during the day.

## Format

Each line is: checkbox, phase tag (`[p1]` … `[p5]`), tool hint in backticks, then the task text. Example rows appear under each phase heading below.

Tool hints: `claude` = needs Claude Pro / high-context. `cursor+claude` = mainstream IDE work. `gemini` = visual / creative. `cline` = mechanical. `requires-gui` = needs Marco's eyes (visual QA). `nas-headless` = orchestrator can run autonomously.

---

## Phase 1 — Architecture

- [x] [p1] [claude] Block library spec — 6 starter blocks (Hero, TwoCol, Grid, CTA, Quotes, RichText). Each: schema, allowed variants (token-locked), renderer signature. Output `docs/architecture/blocks.md`.
- [x] [p1] [claude] Page schema — `layout: Block[]` on each Global. Output `docs/architecture/schema.md`.
- [x] [p1] [claude] Astro + Payload integration spec — auth, type sharing, image pipeline, cache strategy. Output `docs/architecture/integration.md`.
- [x] [p1] [cursor+claude] Token contract — port `APR 70 Pictures Design System/colors_and_type.css` from v2; confirm or revise color/type/spacing tokens.
- [ ] [p1] [nas-headless] Orchestrator Notifications — integrate Telegram API or SMTP so the orchestrator pushes an alert to Marco whenever `BRIEF.md` is updated or a task finishes.
- [ ] [p1] [nas-headless] 1Password CLI Integration — install `op` CLI on the NAS, authenticate it, and refactor the Orchestrator to fetch API keys dynamically via `op://` instead of `.env` files.

## Phase 2 — Scaffold

- [ ] [p2] [cursor+claude] `pnpm create astro@latest` in `web/` with TypeScript + integrations (react, tailwind, sitemap).
- [ ] [p2] [cursor+claude] `pnpm create payload-app` in `cms/` configured for standalone Node service + Postgres.
- [ ] [p2] [nas-headless] `docker-compose.yml` with postgres + cms + web + nginx services. Adapt v2's `docker-compose.nas.yml`.
- [ ] [p2] [nas-headless] DSM reverse-proxy slot for `staging-v3.apr70.com`. Basic Auth on `/admin`.
- [ ] [p2] [cursor+claude] HeroBlock end-to-end: Payload schema → admin UI → Astro renderer → visible on test page.
- [ ] [p2] [cursor+claude] Port D-7 Lexical inline blocks (`structureDivider`, `button`, `accentText`) from v2's `RichText.tsx` to Astro.

## Phase 3 — Block library

- [ ] [p3] [gemini] TwoColBlock — schema + renderer + visual QA against v2 reference.
- [ ] [p3] [gemini] GridBlock — schema + renderer + visual QA.
- [ ] [p3] [gemini] CTABlock — schema + renderer + visual QA.
- [ ] [p3] [gemini] QuotesBlock — schema + renderer + visual QA.
- [ ] [p3] [gemini] RichTextBlock — wraps Lexical with D-7 inline blocks.
- [ ] [p3] [cursor+claude] HeroIsland — React + GSAP, mounted via `client:idle`. Port v2 hero behavior.
- [ ] [p3] [cursor+claude] FilmstripIsland — React, port v2 StageFilmstrip behavior.
- [ ] [p3] [cursor+claude] LightboxIsland — port v2 Lightbox.
- [ ] [p3] [cursor+claude] FixedUiIsland — port v2 FixedUI (light-mode toggle, cursor, reel counter).

## Phase 4 — Page composition + content migration

- [ ] [p4] [requires-gui] Compose home page from blocks.
- [ ] [p4] [requires-gui] Compose work / projects pages.
- [ ] [p4] [requires-gui] Compose news pages.
- [ ] [p4] [requires-gui] Compose about, contact, jobs, pitch, investors.
- [ ] [p4] [nas-headless] One-shot importer: v2 Payload Postgres → v3 schema. Throwaway script.
- [ ] [p4] [nas-headless] Migrate Media: rsync v2 NAS volume → v3 NAS volume; re-link in v3 DB.

## Phase 5 — Polish + cutover

- [ ] [p5] [requires-gui] Lighthouse parity audit.
- [ ] [p5] [requires-gui] Accessibility audit (WCAG AA).
- [ ] [p5] [nas-headless] AVIF + blur placeholder verification.
- [ ] [p5] [claude] DNS plan: `apr70.com` → v3.
- [ ] [p5] [nas-headless] v2 retired: archive repo, spin down v2 NAS containers, archive data dump to C2.

---

## Done

(Empty — first task starts in Phase 1.)
