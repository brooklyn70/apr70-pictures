# BRIEF — apr70-pictures (v3)

**Updated:** 2026-05-09 (initial bootstrap)
**Repo tip:** to be set on first push
**Phase:** Pre-phase-1 (skeleton)

---

## What's done

- v2 (`brooklyn70/apr70-clone`) feature-frozen; `V2_FROZEN.md` committed.
- Two new repos created: `apr70-pictures` (this), `apr70-orchestrator`.
- v3 monorepo skeleton: `web/`, `cms/`, `docker-compose.yml`, README, BRIEF, TASKS, CLAUDE.

## What's next

**Phase 1 — Architecture (Claude Pro, focused session):**
1. Block library spec — 6 starter blocks (Hero, TwoCol, Grid, CTA, Quotes, RichText) with token-locked variants.
2. Page schema — each Global has `layout: Block[]`. Frontend has one `<BlockRenderer>` switch.
3. Astro + Payload integration plan — auth boundary, type sharing, admin-to-frontend publish flow, image pipeline.
4. Document outputs in `docs/architecture/blocks.md` and `docs/architecture/schema.md`.

**Phase 1 — Orchestrator (parallel track on NAS):**
1. Python skeleton on NAS at `/volume1/apps/apr70-orchestrator/`.
2. v1 = brutally small: pick task from `TASKS.md`, run Claude Code subprocess, append USAGE.jsonl entry, update this BRIEF, stop.
3. One provider adapter (Anthropic), one runner (Claude Code), one log entry. Prove the loop.

## Blocked / waiting

- Nothing.

## Open questions for Marco

- None right now. Architecture session next.

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
