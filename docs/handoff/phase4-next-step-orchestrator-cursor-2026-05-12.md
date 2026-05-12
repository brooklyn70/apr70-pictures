# Phase 4 — Next step, Marco review gate, handoff prompts

**Date:** 2026-05-12  
**Repo:** `brooklyn70/apr70-pictures`

## Marco’s Mac — what was actually checked (May 12)

| Question | Answer |
|----------|--------|
| Where is v2 on this machine? | **`/Users/marco/websites/APR_70`** (underscore; not `apr70-clone` on disk here). Same product family as `brooklyn70/apr70-clone` on GitHub. |
| Why does `git pull` always say “Already up to date”? | I ran `git fetch origin` in **`/Users/marco/websites/apr70-pictures`**. Your **`main`** and **`origin/main`** both point at the **same commit** (`27dbe2f`). So GitHub and your laptop already match; nothing new arrived to pull. That is separate from whether the **NAS** pulled that commit (Cursor cannot SSH into your Synology). |
| Can Cursor “make the orchestrator run”? | **No.** I have no button into your NAS container. I can only give you text to paste into whatever dispatches the orchestrator, and fix code in this repo. |
| Did dry-run against your real v2 folder do anything useful? | **Not yet.** That repo has **no `content/` directory** in the checkout. Editorial content lives in **Payload / Keystatic cloud**, not thousands of JSON files under git. The migrator now **only** scans `…/content/**/*.json` (and skips build noise). Pointing at `APR_70` produces **zero files** and one clear warning — that is the honest signal, not manual busywork for you. |

**Bottom line:** The next *product* step is **either** produce a **`content/` export** (pages/projects JSON the runbook assumed) **or** extend the seed tool to read **v2’s database or API**. Until one of those exists on the path you pass to `--v2-root`, having the orchestrator run the same command on the NAS only repeats “0 files” unless the NAS has a different export path you use in production.

---

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

1. **Unblock the data path (Cursor or you):** Decide where real v2 layout lives — **`content/pages` + `content/projects` JSON export**, or **read v2 Postgres / Payload REST** from staging. Your `APR_70` checkout alone is not enough today.
2. **Then** run dry-run with `--v2-root` pointing at that export directory (Mac or NAS).
3. **You:** Glance at counts + warnings once the scan is non-zero.
4. **Cursor:** Implement `--apply` + `seededVersion` after the dry-run shape is trusted.

Orchestrator alone cannot finish “port into Postgres” until `--apply` (or an equivalent NAS script) exists and staging `DATABASE_URL` + v2 root are real values—not placeholders.

---

## Handoff A — Cursor (next coding pass)

Copy everything inside the fence to a new Cursor task.

```text
You are in brooklyn70/apr70-pictures on main (git pull first).

Phase 4 seed: dry-run CLI already exists under cms/scripts/ (see BRIEF.md “Phase 4 (partial)”).

Goals:
1. Read docs/handoff/phase-4-orchestrator-handoff-2026-05-12.md Runbook (dry-run, pg_dump, no --loop).
2. v2 source today: flat `content/**/*.json` may not exist in git (e.g. APR_70 uses Payload/Keystatic cloud). Add export pipeline OR read v2 DB/API, then align discover/map with real shapes.
3. Implement live seed path: Payload getPayload, idempotent updateGlobal for `home` layout (and any other globals in scope), set SiteSettings `seededVersion` after success. Gate behind explicit --apply; never default to writes.
4. Vitest coverage for any non-trivial mapper edge cases.

Constraints: no transition:all; token contract unchanged; no emoji in commits/site.
```

---

## Handoff B — NAS orchestrator (bounded, `--once` only)

**Prerequisite:** `--v2-root` must be a directory that contains **`content/`** with JSON under `content/pages` or `content/projects` (export). If that path does not exist on the NAS, the job should **exit 0** and report “0 files — need export or DB reader” instead of pretending migration ran.

Use only when the NAS has **`apr70-pictures`** checked out at a commit that contains the seed CLI, **and** the export path exists. Do **not** use `--loop` for migration. Prefer **`--once`** per Marco.

Copy everything inside the fence into the orchestrator dispatch body.

```text
TASK: Phase 4 seed — dry-run artifact only (no DB writes)

Repo: brooklyn70/apr70-pictures (branch main, git pull --ff-only).
Docs: docs/handoff/phase-4-orchestrator-handoff-2026-05-12.md

In container or host with Node/pnpm and repo mounted at /work (or your standard path):

  cd /work/cms
  pnpm install --frozen-lockfile
  pnpm migrate:v2:dry -- --v2-root "<ABSOLUTE_PATH_WITH_content_SUBDIR>" --report /tmp/apr70-seed-dry-run.json

Replace the path with a directory that contains content/pages or content/projects JSON (v2 export). If no such export exists on the NAS yet, paste the full stdout (expect one warning, 0 files) and stop — do not loop.

Deliverables:
- Exit code 0 from the command.
- Attach or paste: full stdout + file size of /tmp/apr70-seed-dry-run.json (or cat if small).
- Do NOT run live Payload seed, pg_restore, or rsync unless Marco explicitly requests the next runbook step.

MODEL: (per orchestrator policy)
```

---

## Note on the older orchestrator message (Magnetic Nav)

That run referenced `web/package-lock.json` and p3; your current tree may differ. Before trusting any “DONE” line, **`git pull` and `git status`** on the machine you care about and compare paths to TASKS.md.
