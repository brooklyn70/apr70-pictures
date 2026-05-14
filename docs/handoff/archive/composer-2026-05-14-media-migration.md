# Handoff — 2026-05-14 (v2 media rsync verification + Payload media migration CLI)

**From:** Cursor Composer (apr70-pictures session)  
**To:** Next agent  
**Branch:** `main`  
**Implementation commit:** `4c2d951` — v2 media import + `--apply-media` CLI, shared `payload-rest.ts`, TASKS/BRIEF updates.  
**Follow-up:** `2acc7b4` — stop-hook BRIEF tweak (if present on your clone).

---

## What shipped

### NAS (verified over SSH as `caruso@KIMAserver`)

- Log: `/volume1/apps/apr70-pictures/.media-rsync.log`
  - Rsync completed with `sent 561,837,662 bytes`, `speedup is 1.00`, no error lines in grep.
  - Log opens with `starting docker-rsync`; there is no matching `docker rsync end` line in the file (script variant or missing trailing echo).
- Docker on DSM non-login PATH: use **`/usr/local/bin/docker`**.
- Volume `apr70v3_cms_media` mounted in Alpine: top-level includes `artifacts`, `classic-cinema`, `slate`, `images`, `news`, `media`, etc.

### Repo (Phase 4 Payload media migration)

One-shot, idempotent **after** rsync and **after** `migrate:v2:apply` has created `projects` / `news` rows:

| Path | Purpose |
|------|---------|
| `cms/scripts/migrate-v2/apply-media-restore.ts` | Orchestrates scan, import, PATCH layouts. |
| `cms/scripts/migrate-v2/import-v2-media.ts` | REST multipart upload; stable `filename` + `alt` prefix `[v2-media-id:N]` for reuse. |
| `cms/scripts/migrate-v2/v2-media-id-map.ts` | v2 JSON → id/path pairs (projects + news). |
| `cms/scripts/migrate-v2/rewrite-v2-media-refs.ts` | Same key rules as `stripV2MediaRefs`, maps to v3 ids. |
| `cms/scripts/migrate-v2/payload-rest.ts` | `CMS_URL`, `payloadJwtLogin()` — `apply.ts` refactored to use it. |
| `cms/scripts/migrate-v2/cli.ts` | `--apply-media` (exclusive with `--apply`). |
| `cms/package.json` | `pnpm migrate:v2:apply-media` |
| `cms/scripts/migrate-v2/v2-media-migration.spec.ts` | Vitest unit tests (path decode + rewrite). |

**Scope limits:** Restores **projects** and **news** block `media` (and other `*media*` numeric keys). Does not rewrite Lexical-only path strings (e.g. homepage `/classic-cinema/...`). Globals in the current v2 export had no numeric media in page JSON.

---

## NAS operator checklist (if not run yet)

1. `git pull` on NAS repo; rebuild stack if CMS image changed (`pnpm preflight` from `cms/` before deploy per CLAUDE.md).
2. Ensure rsync volume matches `docker-compose` `cms_media:/app/media`.
3. From seeder container (profile `seed`, same env as apply):

```sh
docker compose -p apr70v3 --profile seed run --rm cms-seeder \
  pnpm exec tsx scripts/migrate-v2-to-v3.ts --apply-media --v2-root /v2-export/content
```

4. Confirm in `/admin`: **Media** collection populated; open a **Project** and **News** article and check hero/filmstrip media fields.

---

## Next agentic task (TASKS.md order)

**Top open Phase 4 item:** `[p4] [cursor+claude] web/src/lib/payload.ts` — typed client: error handling, caching, stale-while-revalidate.

Then Phase 5 Gemini lines: HeroBlock slider island, FilmstripBlock renderer, GUI QA.

---

## Commands reference

```sh
cd cms && pnpm exec vitest run scripts/migrate-v2/v2-media-migration.spec.ts
cd cms && pnpm exec tsc --noEmit
cd cms && pnpm preflight   # before NAS docker rebuild
```

---

## Risks / follow-ups

- First real run of `POST /api/media` on NAS may surface Payload mime/size limits; errors are collected in the CLI report.
- If `where[alt][equals]` or `where[filename][equals]` REST queries behave differently on a given Payload version, idempotency may need adjustment (unlikely on 3.84.x).
