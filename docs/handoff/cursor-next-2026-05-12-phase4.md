# Handoff — next Cursor agent (apr70-pictures, Phase 4)

**Date:** 2026-05-12  
**Repo:** `brooklyn70/apr70-pictures`  
**Branch:** `main` — **`git pull origin main` before any work** (recent commits: Phase 4 runbook + Magnetic Nav fix).

## Why this handoff exists

Prior session context is long. This file is the **compact briefing** for whoever picks up **Phase 4 — Seed Script & Content Migration** next.

## Current product state (verified)

- **Phases 1–3** are effectively **locked** in code: 11 Payload blocks + Astro `BlockRenderer`, Lexical Color Injector + mega scale (`aprLexicalEditor.ts`, `lexicalToHtml.ts`), `SiteSettings` + `FooterLinks` globals, `Footer.astro`, Payload live preview, top chrome with **`MagneticNavIsland`** (`web/src/components/islands/MagneticNavIsland.tsx`, `Layout.astro`). GSAP via `gsap` + `@gsap/react`; **`pnpm-lock.yaml`** is canonical (npm `package-lock.json` under `web/` was removed).
- **Orchestrator caveat:** a NAS run once marked Magnetic Nav `[x]` **without** shipping the island; a follow-up commit implemented it. Treat **`[x]`** as “check the tree,” not gospel.
- **v2** lives in `brooklyn70/apr70-clone` (feature-frozen per `BRIEF.md`); migration **reads** v2, does not require deleting v2.

## What Marco wants for Phase 4 (policy)

- **Step-by-step** with **review artifacts** between mutating steps (dry-run logs, `rsync --itemize-changes`, sample JSON). Marco reviews each artifact before the next step.
- **No orchestrator `--loop`** for migration. **`--once`** only when Marco explicitly asks the NAS to run a bounded hop.
- **Staging first** for Postgres + media copy; production only after explicit sign-off.
- **Git** = source of truth for **migrator code**; **`pg_dump`** = rollback lever for **Postgres**; **v2 NAS volume** stays read-only until cutover is a separate decision.

Full playbook (dry-run, `pg_dump` / `pg_restore`, rsync policy, step table):  
**`docs/handoff/phase-4-orchestrator-handoff-2026-05-12.md`** — read the **Runbook** section.

## Next engineering task (`TASKS.md`)

First open **`[p4] [nas-headless]`** line (currently ~42): **Seed script** — idempotent v2 → Payload 3 Postgres; versioning; map v2 Project/Page → `cms/src/blocks/*`; preserve Lexical + Color Injector tokens. **Requirement:** CLI supports **`--dry-run`** (no durable writes; emits a report). See `TASKS.md` for exact wording.

Second **`[p4] [nas-headless]`**: media rsync + Media collection linking (`cms/src/collections/Media.ts`) — same runbook; **`rsync --dry-run`** before real copy; avoid `--delete` until intentionally mirroring.

Third **`[p4] [cursor+claude]`**: `web/src/lib/payload.ts` hardening (can parallelize after seed shape is clearer).

## Reading order for the next agent

1. **`TASKS.md`** — next checkbox + tool hint.
2. **`docs/handoff/phase-4-orchestrator-handoff-2026-05-12.md`** — mission + **Runbook**.
3. **`CLAUDE.md`** — non-negotiables (BlockRenderer, tokens, no `transition: all`, GSAP-only motion, etc.).
4. **`BRIEF.md`** — high-level phase note (orchestrator may append; do not fight auto notes unless you own the edit).
5. **`docs/architecture/`** — `schema.md`, blocks spec, integration, `v3-master-plan.md` as needed.
6. **v2 reference** — clone or read `apr70-clone` for Keystatic/JSON/Markdown shapes and field names to map.

## NAS / orchestrator (when relevant)

- SSH host pattern from repo docs: **`caruso@KIMAserver`**, repo path **`/volume1/apps/apr70-pictures`**.
- If **`git pull` as `caruso` fails** (permission denied), **`sudo git -C /volume1/apps/apr70-pictures pull --ff-only`** (or reset to `origin/main` if local edits block pull — warn Marco if discarding NAS-only changes).
- Orchestrator one-shot (secrets via `op run` inside container):  
  `sudo /usr/local/bin/docker exec apr70-orchestrator op run -- python -m orchestrator.main --once`  
  **Do not** use this for unbounded migration loops.

## Pre-flight Marco must supply (before first `pg_dump` / dry-run is meaningful)

Concrete values (ticket or doc): v2 content root, v2 media NAS path, v3 media NAS path, **staging** `DATABASE_URL`, staging CMS base URL. Without these, stay on **design + `--dry-run` contract** in code only.

## Suggested first PR scope for the next agent

1. Add **`scripts/` or `cms/`** entrypoint (documented in README or `docs/architecture/` one-liner): `migrate-v2-to-v3` with **`--dry-run`** + live path, idempotent upsert strategy sketched, version field written on success.
2. **Artifact:** example dry-run output checked into `docs/` only if Marco wants a golden sample — default is **gitignored log path** documented in runbook.

## Stop condition

When **`--dry-run`** produces a report Marco accepts, then run **live staging seed** once, paste summary + admin smoke URLs, pause for Marco before media `rsync` or Media linking.
