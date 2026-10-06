# AGENTS.md

## Lane rule (Marco, 2026-10-05)
- **START (on the Mac, or from Windows via Remote-SSH):** read the vault STATE.md first: `/Users/marco/vault/10 Work/11 APR70 Pictures/11.03 Company Ops/website/STATE.md`. If this repo has commits newer than its Head SHA (for example, from a cloud agent), read them and their PR notes. Merge them into the vault STATE.md first.
- **START (cloud agent, no vault):** read `STATE.md` in this repo root. It is a short read-only copy of the vault STATE.md.
- **END (Mac):** rewrite the vault STATE.md. Read it again first, and merge anything that changed since START. Then refresh the repo copy with `python3 ~/work/bin/sync-state.py apr70/apr70-website`, and include `STATE.md` in your next commit.
- **END (cloud agent):** do not edit `STATE.md`. Put your end state (done / next / blockers) in the PR description.
- **Never create a new handoff file.** The STATE.md rewrite is the handoff.
- Code stays in this repo. Words (notes, the vault STATE.md) stay in the vault lane folder.
- Root the lane at `~/websites/apr70-website/v14` only; never at the `apr70-website/` umbrella (961 MB of archival media is not ignored there; no `git add -A`).
- No deploy, CMS write or live copy change without Marco's go; every ship updates the version note and bumps `cms/src/siteVersion.ts` together.
- Public chatbot stays draft until Marco has reviewed an Agent Report Card run.

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

## Site chatbot + Agent Report Card (ruled 2026-09-19)

Marco ruled: this site **must** have a public site chatbot, and it must be QA'd with an Agent Report Card style scenario suite before production trust.

- **Pack / playbook:** `vault/00 Meta/00.04 System/agent-report-card-viewer/` (Nate Herk companion: scenarios → run → diagnose → retest → client-readable report).
- **Program:** `vault/00 Meta/00.04 System/cursor-projects-ops/programs/site-chatbots-report-card-2026-09-19.md`
- **Free decision sidecar:** classifier.dev / MCP `classifier-dev` (hosted Jev). Paid TypeSafe not default until Marco unlocks spend. See `classifier-dev-free-jev.md`.
- **Never without asking:** bot sends email, takes payment, changes live policy, deletes data, or ships to production without a report-card run Marco has reviewed.

## Lane context pack

**Hard rule (2026-09-22):** Before coding this lane, open the vault lane context pack and read Canon; search Full index before inventing workflows.

`/Users/marco/vault/00 Meta/00.04 System/context-packs/APR70-Website.md`

Doctrine: `/Users/marco/vault/00 Meta/00.04 System/context-packs/README.md`

