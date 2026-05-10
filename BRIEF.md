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
