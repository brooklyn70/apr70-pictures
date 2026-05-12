# Phase 4 — Next step, Marco review gate, handoff prompts

**Date:** 2026-05-12  
**Repo:** `brooklyn70/apr70-pictures`

## What you have now (no trust required in prose; verify in git)

- A **non-destructive** seed preview CLI: it only reads JSON files under a path you choose. It does **not** talk to Postgres or Payload for writes.
- **Location (run from `cms/`):**  
  `pnpm migrate:v2:dry -- --v2-root <ABSOLUTE_PATH_TO_V2_CONTENT>`  
  Optional full JSON artifact: add `--report /tmp/apr70-seed-dry-run.json` (path is yours).

There is a tiny **fixture** tree for CI and smoke checks: `cms/fixtures/v2-sample/`. That is not your real site; it only proves the wiring.

**Not done yet:** `--apply` (live upsert into Payload + `seededVersion`) is intentionally absent until someone reviews a dry-run against **real** v2 content and the runbook pre-flight is filled in.

---

## When are you required to look at dry-run results?

| Situation | Your review? |
|-----------|----------------|
| Fixture or automated CI dry-run | Optional; sanity only. |
| **First dry-run using the real v2 content root** (clone or export you trust) | **Yes, before anything writes to staging Postgres.** You are checking counts, warnings, unknown block types, and the sample mapped JSON. |
| After any change to mappers or v2 export format | Yes again on the next dry-run artifact. |
| Orchestrator or anyone runs `pg_dump`, live seed, or `rsync` without `--dry-run` | Per runbook: only **after** you accepted the prior step’s artifact. |

Plain rule: **If the next step mutates staging (DB or files), the dry-run report for that same content source should already be in a state you are willing to sign off on.**

---

## Next step (single ordered path)

1. **You (or Cursor on your machine):** `git pull` on `apr70-pictures`, `cd cms`, install deps if needed, run dry-run with **`--v2-root`** set to the directory that actually holds v2 pages/projects JSON (often from `apr70-clone`; exact folder names depend on that repo’s layout).
2. **You:** Open the console output or `--report` JSON. Note warnings (unknown blocks, missing arrays, parse errors).
3. **Then either:**  
   - **Cursor:** Implement `--apply` + idempotent globals update + `seededVersion`, **or**  
   - **Pause** until you are happy with the mapper output, then dispatch Cursor/orchestrator with the prompts below.

Orchestrator alone cannot finish “port into Postgres” until `--apply` (or an equivalent NAS script) exists and staging `DATABASE_URL` + v2 root are real values—not placeholders.

---

## Handoff A — Cursor (next coding pass)

Copy everything inside the fence to a new Cursor task.

```text
You are in brooklyn70/apr70-pictures on main (git pull first).

Phase 4 seed: dry-run CLI already exists under cms/scripts/ (see BRIEF.md “Phase 4 (partial)”).

Goals:
1. Read docs/handoff/phase-4-orchestrator-handoff-2026-05-12.md Runbook (dry-run, pg_dump, no --loop).
2. Run dry-run locally against a real apr70-clone content path (Marco supplies --v2-root). Align discover/map logic with actual v2 JSON shapes (Keystatic export / layout field names / blockType slugs).
3. Implement live seed path: Payload getPayload, idempotent updateGlobal for `home` layout (and any other globals in scope), set SiteSettings `seededVersion` after success. Gate behind explicit --apply; never default to writes.
4. Vitest coverage for any non-trivial mapper edge cases.

Constraints: no transition:all; token contract unchanged; no emoji in commits/site.
```

---

## Handoff B — NAS orchestrator (bounded, `--once` only)

Use only when the NAS has **`apr70-pictures`** checked out at a commit that contains the seed CLI, **and** a **read-only** v2 JSON tree is available at a known absolute path. Do **not** use `--loop` for migration. Prefer **`--once`** per Marco.

Copy everything inside the fence into the orchestrator dispatch body.

```text
TASK: Phase 4 seed — dry-run artifact only (no DB writes)

Repo: brooklyn70/apr70-pictures (branch main, git pull --ff-only).
Docs: docs/handoff/phase-4-orchestrator-handoff-2026-05-12.md

In container or host with Node/pnpm and repo mounted at /work (or your standard path):

  cd /work/cms
  pnpm install --frozen-lockfile
  pnpm migrate:v2:dry -- --v2-root "<ABSOLUTE_V2_JSON_ROOT>" --report /tmp/apr70-seed-dry-run.json

Replace <ABSOLUTE_V2_JSON_ROOT> with the real v2 content directory Marco approved (read-only).

Deliverables:
- Exit code 0 from the command.
- Attach or paste: tail of stdout + file size of /tmp/apr70-seed-dry-run.json (or cat if small).
- Do NOT run live Payload seed, pg_restore, or rsync unless Marco explicitly requests the next runbook step.

MODEL: (per orchestrator policy)
```

---

## Note on the older orchestrator message (Magnetic Nav)

That run referenced `web/package-lock.json` and p3; your current tree may differ. Before trusting any “DONE” line, **`git pull` and `git status`** on the machine you care about and compare paths to TASKS.md.
