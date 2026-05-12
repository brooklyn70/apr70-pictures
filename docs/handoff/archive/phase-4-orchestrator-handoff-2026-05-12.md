# Handoff: Phase 4 — Seed Script & Content Migration

**Target:** NAS Autonomous Orchestrator (`brooklyn70/apr70-orchestrator`)  
**Source repo:** `brooklyn70/apr70-pictures`  
**Status:** Phases 1–3 foundations LOCKED.

## Context

The v3 architecture (Payload 3 + Astro SSR) is fully bootstrapped. All block schemas, the Lexical Color Injector, and Global Chrome (SiteSettings / FooterLinks / Footer) are implemented and verified. The system is ready for content ingestion.

## Orchestrator mission: Phase 4

Execute the data migration from the legacy v2 system to the new Payload CMS instance.

### 1. Seed script `[nas-headless]`

| | |
|--|--|
| **Source** | v2 legacy content (Keystatic / JSON / Markdown) |
| **Destination** | Payload 3 PostgreSQL database |
| **Requirements** | Idempotent (safe to run multiple times without duplication). Maintain versioning references. Map v2 fields to the new v3 block schemas (`cms/src/blocks/*.ts`). |

### 2. Media migration `[nas-headless]`

| | |
|--|--|
| **Action** | rsync v2 NAS volume assets to v3 NAS volume assets |
| **Linking** | Create Media collection entries in Payload for each file and link them to the correct blocks in seeded content |
| **Reference** | `cms/src/collections/Media.ts` |

## Confirmed pre-flight values (NAS, verified 2026-05-12)

| Item | Value |
|------|-------|
| v2 content root (NAS) | `/volume1/apps/apr70-pictures/v2-export/content` |
| v2 media root (NAS) | `/volume1/apps/apr70/public/` (537 MB, read-only) |
| v3 media volume (Docker) | `apr70_apr70_media` → `/app/public/media` inside CMS container |
| v3 DATABASE_URI | `postgresql://apr70:***@postgres:5432/apr70_payload` (in CMS container env) |
| v3 CMS port | `3000` (container `apr70-app-1`) |
| NAS SSH alias | `apr70-nas` |
| NAS repo path | `/volume1/apps/apr70-pictures/` |

**Note:** Current `apr70-app-1` container is v2 schema. v3 stack must be built fresh (Hop 1) before seed runs (Hop 2).

## Runbook — dry runs, rollback, no loops

**Operating policy (Marco + agent, not unattended `--loop`):** one step at a time, each step produces a **review artifact** (log file, `--dry-run` listing, or short report) before the next mutating command runs. Orchestrator may use `--once` only when Marco explicitly wants that hop.

### Source of truth (split by layer)

| Layer | Source of truth | Rollback |
|------|-----------------|----------|
| **Code** (seed script, mappers, flags) | Git `main` on `apr70-pictures` | Revert commit / branch |
| **Postgres (v3 Payload)** | DB server + backups you take | Restore from `pg_dump` (see below) |
| **Binary media on NAS** | v2 volume is the canonical archive until cutover | Keep v2 read-only; v3 copy is disposable until you declare cutover |

Git never replaces a DB backup: it only versions **how** you migrate, not **the data** you migrated.

### Before anything mutates (pre-flight checklist)

Write down (in a scratch file or ticket) **concrete paths and URLs** — no placeholders:

1. **v2 read root:** repo or export path for Keystatic / JSON / Markdown (read-only).
2. **v2 media root:** absolute NAS path to v2 uploads (read-only source for rsync).
3. **v3 media root:** absolute NAS path for v3 Payload media (destination for copy).
4. **Target Postgres:** connection string for **staging** v3 first (never practice on prod until staging is signed off).
5. **CMS base URL** for the same stack (for optional API verification after seed).

### Rollback story — Postgres

Before **first** write to a target database:

```bash
# Example: full custom-format dump of the v3 DB you are about to touch (staging).
pg_dump --format=custom --file="payload-v3-staging-$(date -u +%Y%m%dT%H%M%SZ).dump" "$DATABASE_URL"
```

Rollback = **drop/recreate schema or database** (only if safe for that environment) **or** restore:

```bash
pg_restore --clean --if-exists --dbname="$DATABASE_URL" payload-v3-staging-....dump
```

(Exact flags depend on whether you restore into an empty DB vs overwrite; test restore once on a throwaway DB.)

### Dry runs — seed script

The seed entrypoint should support a **`--dry-run`** (or `DRY_RUN=1`) mode that:

- Reads all v2 sources.
- Runs mappers (v2 page or project → v3 `layout` blocks + Lexical).
- **Does not** open a write transaction (or rolls back immediately).
- Writes a **report artifact**: counts per content type, list of IDs, first-page JSON sample, and any mapping warnings (missing media, unknown block types).

Marco reviews that artifact; only then run the same command **without** `--dry-run` against **staging**.

### Dry runs — filesystem (media)

Never start with destructive sync.

1. `rsync --dry-run --itemize-changes ...` from v2 media root → v3 media root (or a **staging subdirectory** under v3 first).
2. Review size/count summary; confirm destination path twice.
3. Real copy: prefer **`rsync -a` without `--delete`** until you explicitly want v3 to mirror deletions from v2.

Rollback for media = **delete the v3 copy tree** (or restore from a tarball if you chose to archive v3 before overwrite). v2 stays untouched.

### Dry runs — Media collection + block links

Same pattern as seed: a mode that **prints** the Payload `create` / `update` payloads (or counts only) without committing, then a live mode after review.

### Confirmed step status (2026-05-12)

| Step | Action | Status |
|-----|--------|--------|
| 0 | Pre-flight paths confirmed | DONE |
| 1 | `pg_dump` v3 DB before first write | PENDING (Hop 2 pre-req) |
| 2 | Seed `--dry-run` | DONE — 83/83 blocks, 0 warnings, Marco accepted |
| 3 | Seed live (`--apply`) | PENDING (Hop 2) |
| 4 | `rsync --dry-run` media | PENDING |
| 5 | `rsync -a` copy (no `--delete`) | PENDING |
| 6 | Media linking dry-run | PENDING |
| 7 | Media linking live | PENDING |
| 8 | Marco sign-off | PENDING |

Full NAS dispatch instructions: `docs/handoff/nas-deploy-2026-05-12.md`.

### What is not required to “get rolling”

- **Orchestrator `--loop`:** not part of this plan.
- **Deleting v2 data:** never required for v3 migration; treat v2 as read-only.

### Engineering prerequisite (repo work)

Implement in `cms/` (or a `scripts/` package) a **single documented CLI** (e.g. `pnpm exec tsx scripts/migrate-v2-to-v3.ts`) that implements `--dry-run`, idempotent upserts, and version tagging (`seededVersion` / logs). Until that exists, steps 2–3 are blocked.

## Next instruction (dispatch prompt)

See `docs/handoff/nas-deploy-2026-05-12.md` for the exact orchestrator dispatch commands for Hop 1 and Hop 2.
