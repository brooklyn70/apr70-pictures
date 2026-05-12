# NAS Deploy — Phase 4 Live Seed

**Date:** 2026-05-12  
**Author:** Amazon Q  
**Status:** Ready to dispatch  
**Prerequisite:** `--dry-run` accepted by Marco (83/83 blocks, 0 warnings, 2026-05-12).

---

## Confirmed paths

| Item | Value |
|------|-------|
| NAS repo | `/volume1/apps/apr70-pictures/` |
| v2 content root | `/volume1/apps/apr70-pictures/v2-export/content` |
| v2 media source | `/volume1/apps/apr70/public/` (537 MB, read-only) |
| v3 media volume | Docker `apr70_apr70_media` → `/app/public/media` in CMS container |
| v3 DATABASE_URI | `postgresql://apr70:***@postgres:5432/apr70_payload` (in CMS container env) |
| NAS SSH alias | `apr70-nas` |

---

## Hop 1 — Build and start the v3 stack

**Tool tag:** `[nas-headless]`  
**What it does:** Builds the v3 Docker stack from `apr70-pictures/docker-compose.yml` and starts it. This creates a fresh v3 Postgres schema (Payload runs `push: true` on first boot). The existing `apr70-app-1` (v2) container will be replaced.

**Dispatch prompt for orchestrator:**

```text
TASK: Phase 4 Hop 1 — Build and start v3 Docker stack on NAS

SSH into apr70-nas and run:

  cd /volume1/apps/apr70-pictures

  # Pull latest code first
  sudo git pull --ff-only origin main

  # Stop the old v2 stack if running (apr70-app-1, apr70-postgres-1)
  sudo /usr/local/bin/docker compose -f /volume1/apps/apr70/docker-compose.yml down 2>/dev/null || true

  # Build and start v3 stack
  sudo /usr/local/bin/docker compose up -d --build

  # Wait for CMS to be healthy (Payload runs schema push on boot)
  sleep 30
  sudo /usr/local/bin/docker compose ps
  sudo /usr/local/bin/docker compose logs cms --tail 30

Deliverables:
- `docker compose ps` output showing postgres + cms + web + nginx all Up.
- `docker compose logs cms --tail 30` showing no fatal errors and Payload started.
- Do NOT proceed to Hop 2 until CMS logs show "Payload started" or equivalent.

Do NOT run the seed yet. Stop after confirming stack health.
```

---

## Hop 2 — pg_dump backup + live seed

**Tool tag:** `[nas-headless]`  
**What it does:** Takes a safety dump of the fresh v3 DB, then runs `--apply` to upsert the Home global layout and stamp SiteSettings. Idempotent — safe to re-run.

**Dispatch prompt for orchestrator:**

```text
TASK: Phase 4 Hop 2 — pg_dump backup + live seed (--apply)

Prerequisites: Hop 1 complete, v3 stack healthy, CMS logs show Payload started.

SSH into apr70-nas and run:

  # 1. Take pg_dump backup of fresh v3 DB (before any seed writes)
  sudo /usr/local/bin/docker exec apr70-pictures-postgres-1 \
    pg_dump --format=custom \
    --file="/tmp/apr70-v3-pre-seed-$(date -u +%Y%m%dT%H%M%SZ).dump" \
    --dbname="postgresql://apr70:$(sudo /usr/local/bin/docker exec apr70-pictures-postgres-1 printenv POSTGRES_PASSWORD)@localhost:5432/apr70_payload" \
    2>&1 || echo "pg_dump failed — check container name and credentials"

  # 2. Pull latest code into the repo (seed CLI must be current)
  cd /volume1/apps/apr70-pictures
  sudo git pull --ff-only origin main

  # 3. Run live seed inside the CMS container
  sudo /usr/local/bin/docker exec apr70-pictures-cms-1 \
    sh -c "cd /app && pnpm migrate:v2:apply -- --v2-root /volume1/apps/apr70-pictures/v2-export/content"

Deliverables:
- pg_dump file path + size (ls -lh /tmp/apr70-v3-pre-seed-*.dump).
- Full stdout from the seed command.
- Expected output: "Home layout blocks written: 4", "Seed complete."
- Do NOT run rsync or media migration yet — that is a separate task.

If seed exits non-zero, paste the full error and stop.
```

---

## Rollback

If Hop 2 produces unexpected errors after writing to Postgres:

```bash
# On NAS, restore from the dump taken in Hop 2 step 1
sudo /usr/local/bin/docker exec apr70-pictures-postgres-1 \
  pg_restore --clean --if-exists \
  --dbname="postgresql://apr70:***@localhost:5432/apr70_payload" \
  /tmp/apr70-v3-pre-seed-<TIMESTAMP>.dump
```

---

## After Hop 2 — what to verify

1. SSH into NAS, exec into CMS container, open `http://NAS_IP:8080/admin`.
2. Go to Globals → Home — confirm layout blocks are present.
3. Go to Globals → Site Settings — confirm `seededVersion = 0.1.0`.
4. Report back to Marco with a screenshot or row count.

Next task after Marco sign-off: **Media migration** (`[p4] [nas-headless]` in TASKS.md).
