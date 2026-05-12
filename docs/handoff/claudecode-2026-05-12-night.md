# Handoff — Claude Code (NAS Deploy, Phase 4, night session)

**Date:** 2026-05-12 (night, ~21:30 UTC)
**From:** Claude Code (Opus 4.7)
**Picks up from:** `docs/handoff/claudecode-2026-05-12-evening.md`
**Repos:** `brooklyn70/apr70-pictures`, `brooklyn70/apr70-orchestrator`
**Branch:** `main` on both — pushed.

---

## TL;DR

Hop 1 passes cleanly. Hop 2 (pg_dump + seed) has failed every orchestrator run, with
different exit codes each attempt (127, 2, 1). The DB has **0 rows** — the seed script
has never successfully executed. The exact failure point inside the Hop 2 SHELL chain is
unknown because the orchestrator truncates shell output in BRIEF.md.

---

## Current state (verified moments ago)

| Item | State |
|------|-------|
| `apr70v3-cms-1` | Up ~1hr |
| `apr70v3-nginx-1` | Up ~49min, `0.0.0.0:8080->80/tcp` |
| `apr70v3-postgres-1` | Up ~37min, healthy, `5432/tcp` (no host binding) |
| `apr70v3-web-1` | Up ~1hr |
| DB row count | **0 rows** — seed never ran |
| Hop 2 TASKS.md | `[ ]` — still open |
| Hop 1 TASKS.md | `[x]` — done |

---

## Hop 2 SHELL command (current, in TASKS.md line 44)

```bash
/usr/bin/docker exec apr70v3-postgres-1 \
  pg_dump --format=custom \
  --file=/tmp/apr70-v3-pre-seed-$(date -u +%Y%m%dT%H%M%SZ).dump \
  postgresql://postgres:postgres@localhost:5432/apr70_cms 2>&1 \
&& /usr/bin/docker exec apr70v3-postgres-1 \
  sh -c "ls -lh /tmp/apr70-v3-pre-seed-*.dump" \
&& /usr/bin/docker compose \
  -f /volume1/apps/apr70-pictures/docker-compose.yml \
  -p apr70v3 --profile seed build cms-seeder 2>&1 \
&& /usr/bin/docker compose \
  -f /volume1/apps/apr70-pictures/docker-compose.yml \
  -p apr70v3 --profile seed run --rm --no-deps cms-seeder \
  pnpm exec tsx scripts/migrate-v2-to-v3.ts --apply --v2-root /v2-export/content 2>&1
```

This is a single `&&`-chained shell command. The orchestrator runs it inside the
`apr70-orchestrator` container. If any step returns non-zero, the chain stops and
the task is left open.

---

## History of Hop 2 exit codes (from BRIEF.md)

| Time (UTC) | Exit code | Notes |
|------------|-----------|-------|
| 19:26 | 127 | Command not found — `/usr/local/bin/docker` was wrong path |
| 20:14 | 2 | Unknown — first run with `/usr/bin/docker` |
| 20:15 | 127 | Unknown — second run |
| 20:23 | 1 | Latest run, after our `pnpm exec tsx` fix was pulled |

Exit code 127 = command not found inside the container.
Exit code 1 = generic failure — could be pg_dump, docker compose build, or the migration script.
Exit code 2 = misuse of shell command / bad arguments.

**The orchestrator truncates task output. The actual stderr/stdout from each step is NOT
preserved in BRIEF.md or TASKS.md.** To diagnose, you need either:
- `docker logs apr70-orchestrator` (shows orchestrator's own log, not the SHELL output)
- Run the SHELL command manually on the NAS step by step to isolate the failing segment

---

## The four segments to test manually (on the NAS, step by step)

Run each in isolation on `apr70-nas` to find the failure:

**Step A — pg_dump:**
```bash
/usr/bin/docker exec apr70v3-postgres-1 \
  pg_dump --format=custom \
  --file=/tmp/apr70-v3-pre-seed-test.dump \
  postgresql://postgres:postgres@localhost:5432/apr70_cms
echo "exit: $?"
```

**Step B — verify dump file exists:**
```bash
/usr/bin/docker exec apr70v3-postgres-1 sh -c "ls -lh /tmp/apr70-v3-pre-seed-*.dump"
echo "exit: $?"
```

**Step C — build cms-seeder image:**
```bash
/usr/bin/docker compose \
  -f /volume1/apps/apr70-pictures/docker-compose.yml \
  -p apr70v3 --profile seed build cms-seeder
echo "exit: $?"
```

**Step D — run migration:**
```bash
/usr/bin/docker compose \
  -f /volume1/apps/apr70-pictures/docker-compose.yml \
  -p apr70v3 --profile seed run --rm --no-deps cms-seeder \
  pnpm exec tsx scripts/migrate-v2-to-v3.ts --apply --v2-root /v2-export/content
echo "exit: $?"
```

---

## Structural facts about the stack (established earlier)

- **postgres host port conflict:** DSM binds `127.0.0.1:5432`. The v3 postgres container
  no longer exposes a host port (fixed commit `4da3032`). Before this fix, docker silently
  detached postgres from `apr70v3_default` on restart, causing `ENOTFOUND postgres` inside
  the cms container. This is resolved.

- **cms production image cannot seed:** The `cms` runner stage is a Next.js standalone
  build — it has no `scripts/`, no `tsx`, no `pnpm`. A dedicated `cms-seeder` Docker
  target was added (commit `4d3ea12`) that builds from the full builder stage and runs
  under `profiles: [seed]`.

- **v2-export mount:** The seeder service mounts
  `/volume1/apps/apr70-pictures/v2-export:/v2-export:ro`.
  The migration script expects content at `/v2-export/content`.
  The v2 export directory must exist and be populated at that path on the NAS.

- **orchestrator path:** The orchestrator container mirrors the NAS path at
  `/volume1/apps/apr70-pictures` (same path inside and outside container, per
  commit `190948a`). Docker socket is bind-mounted so it can call `docker` on the host.

- **Docker binary inside orchestrator:** `/usr/bin/docker` (not `/usr/local/bin/docker`).

---

## Open uncertainties — the expert needs to answer these

1. **Is v2-export populated?** The seed script needs actual v2 content files at
   `/volume1/apps/apr70-pictures/v2-export/content`. If that directory is empty or
   missing, Step D will fail immediately. Verify: `ls /volume1/apps/apr70-pictures/v2-export/content | head`

2. **Does the cms-seeder build succeed?** The seeder Dockerfile target requires the full
   `builder` stage. If the Next.js build or TypeScript compilation fails inside the seeder
   image, Step C exits non-zero. Check: run Step C manually and read the build output.

3. **Does `pnpm exec tsx` resolve inside the seeder container?** The seeder stage was
   written to include pnpm and node_modules, but if `tsx` is not in the project
   devDependencies or the pnpm store is incomplete in the image, Step D exits 127.

4. **Is the DATABASE_URL correct for seeder → postgres?** The seeder container uses
   the `cms` env, which should have `DATABASE_URL=postgresql://postgres:postgres@postgres:5432/apr70_cms`.
   The hostname must be `postgres` (the Docker service name), not `localhost`.

5. **Does the migration script itself work?** The CLI at `scripts/migrate-v2-to-v3.ts`
   was validated with `--dry-run` (23 files, 83 blocks, 0 warnings) but `--apply` has
   never successfully completed against a live DB.

---

## What the next agent / expert should do

1. SSH into `apr70-nas`.
2. Run Steps A through D manually, one at a time, capturing full stdout+stderr.
3. Find the first step that fails — that's the root cause.
4. Fix it (most likely: missing v2-export content, or a seeder image build issue).
5. Once Step D exits 0, verify the DB:
   ```bash
   /usr/bin/docker exec apr70v3-postgres-1 psql -U postgres -d apr70_cms \
     -c "SELECT relname, n_live_tup FROM pg_stat_user_tables ORDER BY n_live_tup DESC LIMIT 10;"
   ```
6. Open `http://NAS_IP:8080/admin` → Globals → Home to confirm content is live.
7. Mark Hop 2 done in TASKS.md and proceed to Phase 4 media migration.

---

## Key paths

| Item | Value |
|------|-------|
| NAS SSH alias | `apr70-nas` |
| v3 repo on NAS | `/volume1/apps/apr70-pictures` |
| v2 content export | `/volume1/apps/apr70-pictures/v2-export/content` |
| Docker binary (in orchestrator) | `/usr/bin/docker` |
| Seeder image name | `apr70v3-cms-seeder` |
| Compose project name | `apr70v3` |
| Compose network | `apr70v3_default` |
| postgres host inside network | `postgres:5432` |
| Admin UI | `http://NAS_IP:8080/admin` |
