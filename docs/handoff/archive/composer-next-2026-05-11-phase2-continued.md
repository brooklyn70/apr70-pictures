# Handoff — next Cursor Composer agent (apr70-pictures, Phase 2 cont.)

**Date:** 2026-05-11  
**Repo:** `brooklyn70/apr70-pictures`  
**Pull `main`.** Main payload/compose work is in commit `ab8fec9`.

## Done this session

1. **`cms/` — Payload 3.84.1** (blank template, Postgres): run from repo root with **npx** so CLI flags are honored (see below). Includes `@payloadcms/db-postgres`, Lexical, Next 16, `src/payload-types.ts`.
2. **`next.config.ts`**: `output: 'standalone'` for production Docker image (`cms/Dockerfile`).
3. **Root `docker-compose.yml`**: `postgres` (healthcheck), `cms` (build context `cms/`), `web` (`web/Dockerfile` -> Astro static + nginx), edge **`nginx`** on **8080:80** with `nginx/default.conf` (proxies `/admin`, `/api`, `/_next` to Payload; `/` to Astro static).
4. **Removed** template `cms/docker-compose.yml` (Mongo); **`cms/.env.example`** set for Postgres.
5. **`TASKS.md`**: Phase 2 lines for **Payload scaffold** and **docker-compose** marked **`[x]`**.

## Non-interactive Payload scaffold (important)

`pnpm create payload-app@latest cms -- ...` **did not forward `-t` / `--db`** in this environment; the wizard hung on template select. **This works:**

```bash
cd /path/to/apr70-pictures
rm -rf cms && mkdir cms
npx --yes create-payload-app@latest cms \
  -t blank \
  --db postgres \
  --db-connection-string "postgres://postgres:postgres@127.0.0.1:5432/apr70_cms" \
  --use-pnpm \
  --no-agent \
  --no-git
```

## Verified locally

- `cd cms && pnpm run build` succeeds (requires valid `DATABASE_URL` / `PAYLOAD_SECRET` in `cms/.env` for anything that touches DB at runtime; build completed with existing `.env`).

## Next tasks (priority order)

From **`TASKS.md`** Phase 2 (still open):

1. **`[p2] [nas-headless]`** DSM reverse-proxy for `staging-v3.apr70.com` + Basic Auth on `/admin` — needs NAS / Marco; not done here. Suggest: DSM rules to reach host `nginx:80` (or published port), generate `htpasswd`, inject `auth_basic` in a **location** block only for `/admin` (or use DSM access control if preferred).
2. **`[p2] [cursor+claude]`** **HeroBlock end-to-end** — Payload global/block schema, admin, Astro `BlockRenderer` + test page. Read `docs/architecture/blocks.md`, `schema.md`, `integration.md`; wire typegen path `web/tsconfig` -> `../cms/src/payload-types.ts` as specified.
3. **`[p2] [cursor+claude]`** Port **D-7 Lexical** inline blocks from v2 `RichText.tsx` to Astro.

## Stack notes

- **Payload admin** is on the same Next origin as the API; edge nginx sends `/admin` and `/api` to **cms:3000**.
- **`PAYLOAD_SECRET`**: set in shell or root `.env` when running `docker compose` (compose references `${PAYLOAD_SECRET:-dev-change-me}`).
- **Media volume**: `cms_media:/app/media` — confirm Payload upload dir stays aligned with app `cwd` in the container (`/app`).

## Reading order

`BRIEF.md` -> `TASKS.md` -> `CLAUDE.md` -> `docs/architecture/*`.
