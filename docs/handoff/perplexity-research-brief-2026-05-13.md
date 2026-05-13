# Perplexity Deep Research Brief — Payload v3 + drizzle-kit in Docker

**Project:** Self-hosted Payload CMS v3 on Synology NAS in Docker
**Problem:** Seeder container hangs indefinitely when `getPayload({ config })` is called
**Date:** 2026-05-13

---

## Context

We have a Payload CMS v3 app (Next.js 16, `@payloadcms/db-postgres`, drizzle-kit)
running in Docker on a Synology NAS. The main CMS service runs fine. We have a
separate one-shot "seeder" Docker container that imports v2 content using the
Payload Local API:

```ts
import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

const payload = await getPayload({ config })
await payload.updateGlobal({ slug: 'home', data: { layout: [...] } })
```

`payload.config.ts` uses:
```ts
db: postgresAdapter({
  pool: { connectionString: process.env.DATABASE_URL },
  push: process.env.PAYLOAD_DB_PUSH !== 'false',
})
```

The seeder container has these env vars:
```
NODE_ENV=development
PAYLOAD_DB_PUSH=false
DATABASE_URL=postgres://postgres:postgres@postgres:5432/apr70_cms
```

The DB already has the full schema (31 tables, created by a previous run).

---

## The Problem

When the seeder container runs, it logs:

```
[⠇] Pulling schema from database...
```

...and then hangs forever. This is drizzle-kit's `push` command running interactively,
waiting for TTY confirmation. The container has no TTY.

This happens even with `PAYLOAD_DB_PUSH=false` set — we are not 100% sure Payload v3
actually respects this env var or whether `push: false` in the adapter config truly
prevents drizzle from running at all during `getPayload()` initialization.

---

## Research Questions

**Q1.** With `push: false` in `postgresAdapter`, does Payload v3's `getPayload()`
completely skip drizzle-kit schema sync? Or does it still run some form of schema
check that can hang in a non-TTY environment?

**Q2.** What is the correct way to run Payload v3 Local API in a non-interactive
Docker container (no TTY) when the schema already exists? Is there an official
pattern for this use case?

**Q3.** Does `@payloadcms/db-postgres` support a `migrate` mode (using drizzle
migrations instead of `push`) that is non-interactive and safe to run in Docker?
If so, what is the config and what command runs the migrations?

**Q4.** Is there a drizzle-kit environment variable (e.g. `DRIZZLE_PUSH_ACCEPT_ALL`,
`DRIZZLE_PUSH_YES`, or similar) that auto-accepts all prompts, making `push` safe
in non-TTY Docker containers?

**Q5.** What is the recommended Payload v3 pattern for a one-shot seed/migration
script that uses the Local API? Specifically: should it use `push: false` and rely
on migrations being pre-run, or is there another approach?

---

## Versions

- Payload: v3 (latest as of May 2026, Next.js 16 / `@payloadcms/db-postgres`)
- drizzle-kit: whatever ships with `@payloadcms/db-postgres` (not pinned separately)
- Node: 22.17.0-alpine
- Postgres: 16-alpine

---

## What We've Already Tried

1. `NODE_ENV=production` in compose → drizzle hung on empty schema (fixed, not the issue now)
2. `NODE_ENV=development` in compose → drizzle created schema on first run, hung on second run when schema existed
3. `PAYLOAD_DB_PUSH=false` + `push: process.env.PAYLOAD_DB_PUSH !== 'false'` in config → not yet confirmed to work
4. Removing `ENV NODE_ENV=production` from Dockerfile seeder stage → not yet confirmed to work

---

## What a Good Answer Looks Like

A concrete, tested pattern for running Payload v3 Local API in Docker without TTY,
with the schema already present, that does not hang. Ideally with the exact
`payload.config.ts` snippet and any required env vars or pre-run commands.
