# Handoff — Claude Code (NAS Deploy, Phase 4)

**Date:** 2026-05-12
**From:** Amazon Q (IDE session)
**Repos:** `brooklyn70/apr70-pictures`, `brooklyn70/apr70-orchestrator`
**Branch:** `main` on both — `git pull --ff-only origin main` before any work.

---

## Context summary

You are picking up a NAS deploy session mid-stream. Phases 1–3 are locked.
Phase 4 seed CLI is complete and dry-run accepted. The job now is to get the
v3 Docker stack running on the NAS and run the live seed.

Read `BRIEF.md` for full state. Short version below.

---

## Current NAS state (verified 2026-05-12 ~19:00 UTC)

| Container | Status |
|-----------|--------|
| `apr70v3-postgres-1` | Running |
| `apr70v3-cms-1` | Running |
| `apr70v3-web-1` | Running |
| `apr70v3-nginx-1` | FAILED — not started |
| `apr70-orchestrator` | Running (sleep infinity) |

The v3 stack is 3/4 up from a previous Hop 1 attempt. nginx failed due to
a volume path bug (now fixed in TASKS.md). The orchestrator is rebuilt and
has Docker CLI + Compose v2.27.0 + Docker socket mounted.

---

## Two bugs fixed in this handoff (already committed, not yet pushed)

**Bug 1 — `orchestrator/main.py`:** `mark_task_done()` was called
unconditionally, marking tasks `[x]` even on exit code 1. Fixed: now only
marks done if `result.returncode == 0`.

**Bug 2 — TASKS.md Hop 1:** `docker compose` was called without
`--project-directory`, so relative volume paths resolved against `/work`
inside the container instead of `/volume1/apps/apr70-pictures` on the host.
Fixed: Hop 1 SHELL command now uses
`--project-directory /volume1/apps/apr70-pictures`.

Both fixes are on disk but NOT yet committed or pushed. Your first job is
to commit and push them.

---

## Exact steps

### Step 1 — Commit and push both repos

```bash
# apr70-orchestrator
cd /Users/marco/websites/apr70-orchestrator
git add orchestrator/main.py
git commit -m "fix(orchestrator): only mark task done on exit code 0"
git push origin main

# apr70-pictures
cd /Users/marco/websites/apr70-pictures
git add TASKS.md BRIEF.md
git commit -m "fix(tasks): --project-directory for compose; reset Hop 1; update BRIEF"
git push origin main
```

If push is rejected (orchestrator raced us again), rebase:
```bash
git pull --rebase origin main
# resolve TASKS.md conflict: always keep OUR version (the [ ] unchecked one)
git push origin main
```

### Step 2 — Pull both repos on NAS and rebuild orchestrator

```bash
ssh apr70-nas
/usr/local/bin/git -C /volume1/apps/apr70-orchestrator pull --ff-only origin main
cd /volume1/apps/apr70-orchestrator && /usr/local/bin/docker compose up -d --build
/usr/local/bin/docker exec apr70-orchestrator git config --global --add safe.directory /work
/usr/local/bin/docker exec apr70-orchestrator git -C /work pull --ff-only origin main
```

### Step 3 — Fire Hop 1

```bash
/usr/local/bin/docker exec apr70-orchestrator op run -- python -m orchestrator.main --once
```

Expected: exit 0, all 4 containers up including nginx, Telegram notification sent.
Verify: `/usr/local/bin/docker ps | grep apr70v3`

If nginx still fails, check the exact error:
```bash
/usr/local/bin/docker compose -p apr70v3 logs nginx --tail 20
```

### Step 4 — Fire Hop 2 (only after Hop 1 exit 0)

```bash
/usr/local/bin/docker exec apr70-orchestrator op run -- python -m orchestrator.main --once
```

Expected: pg_dump file created, seed runs, output includes
`Home layout blocks written: 4`, `Seed complete.`

### Step 5 — Verify seed

```bash
# Check row counts in v3 DB
/usr/local/bin/docker exec apr70v3-postgres-1 psql -U postgres -d apr70_cms \
  -c "SELECT relname, n_live_tup FROM pg_stat_user_tables ORDER BY n_live_tup DESC LIMIT 10;"
```

Then open `http://NAS_IP:8080/admin` → Globals → Home → confirm layout blocks present.

---

## Key paths (all verified)

| Item | Value |
|------|-------|
| NAS SSH alias | `apr70-nas` |
| v3 repo on NAS | `/volume1/apps/apr70-pictures` (= `/work` in orchestrator) |
| v2 content export | `/volume1/apps/apr70-pictures/v2-export/content` |
| v2 media source | `/volume1/apps/apr70/public/` (537 MB, read-only) |
| Docker binary in orchestrator | `/usr/bin/docker` |
| Compose version | v2.27.0 |
| Docker socket | `/var/run/docker.sock` (mounted in orchestrator) |
| v3 DB name | `apr70_cms` |
| v3 DB user | `postgres` / `postgres` |
| v3 nginx port | `8080` |

---

## What NOT to do

- Do not use `sudo` inside the orchestrator container (runs as root).
- Do not use `/usr/local/bin/docker` inside the container (it's at `/usr/bin/docker`).
- Do not mark Hop 1 `[x]` manually — let the orchestrator do it on exit 0.
- Do not run Hop 2 until Hop 1 exits 0 and all 4 containers are up.
- Do not run `--loop` for migration tasks.

---

## After Hop 2 succeeds — next tasks

1. `[p4] [nas-headless]` Media migration — rsync `/volume1/apps/apr70/public/`
   to v3 media volume, create Media collection rows, link into seeded blocks.
2. `[p4] [cursor+claude]` `web/src/lib/payload.ts` typed client.
3. Phase 5: Hero/Filmstrip islands (gemini-tagged).

Full backlog in `TASKS.md`.
