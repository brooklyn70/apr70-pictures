# Handoff — Claude Code (NAS Deploy, Phase 4, morning session)

**Date:** 2026-05-13
**From:** Amazon Q (IDE agent)
**Picks up from:** `docs/handoff/claudecode-2026-05-12-night.md`
**Repo:** `brooklyn70/apr70-pictures` — branch `main`
**Latest commit:** `8125829`

---

## Honest Summary

The seeder has been attempted multiple times across multiple sessions. It has never
completed successfully. The root causes have been partially fixed but a new blocker
appears each time. We do not have high confidence the next run will succeed without
first doing proper research on Payload v3 + drizzle-kit behavior in Docker.

---

## What Has Been Fixed (all committed, pushed, on NAS)

| Commit | Fix |
|--------|-----|
| `2fdb8b1` | `docker-compose.yml`: `NODE_ENV: production` → `development` on cms-seeder |
| `5c7630b` | `payload.config.ts`: `push: true` → `push: process.env.PAYLOAD_DB_PUSH !== 'false'`; `docker-compose.yml`: adds `PAYLOAD_DB_PUSH: 'false'` to cms-seeder |
| `8125829` | `cms/Dockerfile`: removed hardcoded `ENV NODE_ENV=production` from seeder stage |

---

## The Core Problem: drizzle-kit `push` hangs in Docker

Payload v3 uses `@payloadcms/db-postgres` which internally calls drizzle-kit's
`push` command to sync the schema. This command is **interactive by design** — it
prompts the user to confirm schema changes. In a non-TTY Docker container it hangs
forever.

### Timeline of failures

1. **Run 1** — hung at `getPayload({ config })` for 45+ min. Root cause: `NODE_ENV=production` in compose → drizzle-kit in production mode waits for TTY confirmation on empty schema. Fixed with `2fdb8b1`.

2. **Run 2** (container `f416da0af55d`) — partially succeeded. 31 tables created, 7 rows written (home_blocks_hero, home_blocks_two_col, home_blocks_division_showcase, home_blocks_division_showcase_divisions, site_settings, payload_migrations). Then hung again at `Pulling schema from database...` for 51+ min. Root cause: schema already existed, drizzle-kit prompts again even in development mode when it detects existing tables. Fixed with `5c7630b` + `8125829`.

3. **Run 3** — never completed. Cancelled before execution after discovering the Dockerfile also had `ENV NODE_ENV=production` hardcoded, overriding compose env vars.

### Current DB state (as of last check)

```
home_blocks_division_showcase_divisions  3 rows
home_blocks_two_col                      2 rows
home_blocks_hero                         1 row
home                                     1 row
home_blocks_division_showcase            1 row
site_settings                            1 row
payload_migrations                       1 row
31 tables total
```

The schema is fully created. The seed data is partially written.

---

## What apply.ts Actually Does

Reading `cms/scripts/migrate-v2/apply.ts`:

1. Discovers all JSON files under `--v2-root`
2. Finds the file whose id resolves to `homepage` or `home`
3. Maps its v2 layout blocks to v3 Payload shapes
4. Calls `getPayload({ config })` — **this is where drizzle push runs**
5. Calls `payload.updateGlobal({ slug: 'home', data: { layout: [...] } })` — idempotent
6. Calls `payload.updateGlobal({ slug: 'site-settings', ... })` — idempotent
7. Closes DB pool and exits

Step 4 is the hang point. `getPayload` initializes Payload which triggers drizzle push.
With `PAYLOAD_DB_PUSH=false` and `NODE_ENV=development` both set, this *should* skip
the push. But we have not confirmed this actually works with Payload v3.

---

## What Needs Research (Perplexity Brief Below)

The fundamental question is: **how do you run Payload v3 Local API in a Docker
container without drizzle-kit hanging?**

Known options that need verification:
1. `push: false` in `postgresAdapter` — does `getPayload` still work if schema already exists?
2. `migrate: true` instead of `push: true` — uses drizzle migrations (non-interactive) instead of push
3. Setting `DRIZZLE_PUSH_ACCEPT_ALL=true` or similar env var — does drizzle-kit support this?
4. Running `payload migrate` as a separate step before the seed script

---

## Key Paths

| Item | Value |
|------|-------|
| NAS SSH alias | `apr70-nas` |
| v3 repo on NAS | `/volume1/apps/apr70-pictures` |
| Docker binary (NAS host) | `/usr/local/bin/docker` |
| Compose project | `apr70v3` |
| Seeder image | `apr70v3-cms-seeder` |
| Admin UI | `http://NAS_IP:8080/admin` |
| v2 content export (on NAS) | `/volume1/apps/apr70-pictures/v2-export/content` |
| payload.config.ts | `cms/src/payload.config.ts` |
| Seed script entrypoint | `cms/scripts/migrate-v2-to-v3.ts` |
| apply.ts | `cms/scripts/migrate-v2/apply.ts` |
| Dockerfile | `cms/Dockerfile` (seeder is the last stage) |

---

## Perplexity Research Brief

See `docs/handoff/perplexity-research-brief-2026-05-13.md`
