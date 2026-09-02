# AGENTS.md

Project conventions and reading order live in `CLAUDE.md`, `BRIEF.md`, `STATUS.md`, and `TASKS.md`. Read those first. This file only adds environment/runtime notes for automated agents.

## Cursor Cloud specific instructions

This is a two-service monorepo. No Docker is used in the cloud VM; services run natively.

| Service | Dir | Dev command | Port | Notes |
|---|---|---|---|---|
| Payload CMS (Next.js) | `cms/` | `pnpm dev` | 3000 | Admin at `/admin`, REST at `/api`. Needs Postgres + `.env`. |
| Astro frontend | `web/` | `pnpm dev` | 4321 | Fetches CMS via `PUBLIC_PAYLOAD_URL`. |

Root scripts also exist: `pnpm dev:cms`, `pnpm dev:web`, `pnpm preflight` (see root `package.json`).

### pnpm version (important)
The repo pins `engines.pnpm: ^9 || ^10`, but the VM's default pnpm may be newer and fail with `ERR_PNPM_UNSUPPORTED_ENGINE`. The install script activates pnpm 10 via corepack; if you open a fresh shell and hit the engine error, run `corepack prepare pnpm@10.33.0 --activate` first.

### PostgreSQL (required by CMS)
Postgres 16 is installed in the VM snapshot but is NOT auto-started. Start it each session before running the CMS:

```
sudo pg_ctlcluster 16 main start
```

The `apr70_cms` database and a `postgres`/`postgres` login already exist in the snapshot. `cms/.env` (gitignored) points `DATABASE_URL` at `postgres://postgres:postgres@127.0.0.1:5432/apr70_cms`.

### DB schema + migrations
`payload.config.ts` sets `db.push: false`, so schema comes only from migrations. On a fresh database run `pnpm -C cms migrate` to build the schema. There is no bundled content seed for local dev; the DB starts empty. Create the first admin via the browser at `/admin`, or:

```
curl -s -X POST http://localhost:3000/api/users/first-register \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@apr70.local","password":"Apr70Dev!2026","confirm-password":"Apr70Dev!2026"}'
```

### Quality gates
- Canonical gate is `pnpm -C cms preflight` (runs `next build`; must exit 0 before any NAS deploy — see `CLAUDE.md`). Do not run it while the CMS `pnpm dev` server is running; they contend on `.next`.
- `web` build: `pnpm -C web build`.
- Use `preflight` as the type/quality check (cms lint is currently broken independently of the environment).

### After a Cloud Agent PR merges
From a Mac with Tailscale to apr70-nas: `./scripts/mirror-to-nas.sh`

### Optional env
`web/` has a dev-gated AI studio needing `ANTHROPIC_API_KEY` and `PUBLIC_ENABLE_STUDIO=true`; not required to run the site.

## Mailbird MCP (local email access)

You have a local MCP server named `mailbird` (Mailbird Next on this Mac).
- Endpoint is loopback-only; Mailbird must be open with Wingman MCP enabled.
- Write actions are OFF — read/search/list/attachments only.
- Prefer mailbird tools for inbox triage across accounts in Mailbird.
- For invoices/quotes: search_conversations with from:/subject: (e.g. subject:invoice, from:bhphoto), then get_message / list_attachments / get_attachment_content.
- Never print or log the bearer token. Token lives in 1Password: op://API/Mailbird token Mac/token.
