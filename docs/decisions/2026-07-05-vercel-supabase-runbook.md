# Vercel + Supabase + R2 cutover runbook (v3)

**Date:** 2026-07-05 · **Status:** code ready on `v4-infra`; awaiting provisioning (Marco's hands for billing/DNS).
**Plan of record:** `docs/decisions/2026-07-01-vms-lessons-and-cloud-migration.md` (the 8 VMS laws apply to every step below).
**Prime directive:** the NAS stack stays running and untouched through all of this — it is the rollback path and becomes staging after cutover.

## What shipped on `v4-infra` (all env-gated; NAS/local behavior unchanged)

| Concern | Where | Gate |
|---|---|---|
| Vercel adapter for web (Astro 6) | `web/astro.config.mjs`, `@astrojs/vercel@11.0.2` | `DEPLOY_TARGET=vercel` (default stays `@astrojs/node` standalone) |
| Tiny pg pool + pooler law | `cms/src/payload.config.ts` | defaults max 4 / min 0 / idle 10s / connect 5s; `DB_POOL_*` env overrides |
| R2 media via S3 adapter | `cms/src/payload.config.ts`, `@payloadcms/storage-s3@3.84.1` | `S3_BUCKET` set → R2; unset → local `media/` dir (NAS unchanged) |
| Egress discipline (slim projections + TTL/SWR + single-flight) | `web/src/lib/payload.ts` | always on in prod builds (`PUBLIC_PAYLOAD_CACHE_*` tune/kill switches) |
| Vercel-friendly Next output | `cms/next.config.ts` | `output: 'standalone'` only when NOT on Vercel (`VERCEL` env) |

Verified in this branch: `astro check` 26 errors (same 26 as baseline, 0 net-new); default node build passes; `DEPLOY_TARGET=vercel` build produces `.vercel/output`; `cms pnpm preflight` (next build) passes **with an unreachable DATABASE_URL** — the cms build does not need a live DB.

## THE LAW — Supabase pooler discipline (do not negotiate)

- Runtime **and** builds use the **transaction pooler `:6543`** in `DATABASE_URL`.
- The **session pooler `:5432`** is used **once**, by `scripts/migrate-db-to-supabase.sh`, for pg_dump/pg_restore. Then never again.
- Why: the session pooler caps at ~15 clients. Build workers each open a pool, exhaust the cap, and the data layer **silently serves fallback content that looks like missing data**. You will not get an error; you will get an empty-looking site that passes a lazy review. This is VMS lesson #1 and #4 combined.

## Recommended topology: TWO Vercel projects from this repo

| | `apr70-cms` | `apr70-web` |
|---|---|---|
| Root Directory | `cms/` | `web/` |
| Framework | Next.js (Payload 3 is Next-native — deploys as-is) | Astro |
| Serves | `/admin`, `/api/*` (REST + media streaming) | the public site |

Why two projects, not web-only-on-Vercel with cms elsewhere:
- **cms is already a Next 16 app** (`@payloadcms/next`); Vercel is its first-class target. Keeping cms on the NAS while web is on Vercel means every SSR render crosses the public internet to a residential NAS — latency, uptime, and TLS/ingress headaches, and the NAS stops being a clean rollback copy.
- Two projects keep independent deploy cadence (admin schema changes vs site releases), independent env scopes (DB creds never enter the web project — web only ever sees `PUBLIC_PAYLOAD_URL`), and independent rollback.
- Cost: two Hobby/Pro projects in one team; no extra infra.
- Rejected alternative: single project with rewrites — fights both frameworks' routing, one deploy breaks both surfaces, no env isolation.

Caveats found while wiring (Astro 6 + Vercel adapter):
- `@astrojs/vercel@11` is the Astro 6-compatible major; default export = serverless functions. No ISR configured (SSR + in-process cache instead).
- The adapter import in `astro.config.mjs` is lazy (`await import`) behind `DEPLOY_TARGET` so NAS/Docker builds never evaluate it.
- `web/astro.config.mjs` has a Vite alias to `../cms/src/payload-types.ts` — the `apr70-web` project must keep **"Include source files outside of the Root Directory"** enabled (Vercel default: enabled; verify in Settings → Build & Deployment).
- Astro `server.host/port` options are ignored on Vercel (harmless).
- Web's in-process SWR cache is per-function-instance on Vercel: cold starts begin empty and concurrent instances hold separate copies. Good enough as an egress damper at this traffic; promote to a shared cache only if usage data says so.

## Ordered steps

### 0. Secrets (Marco, once) — VMS law #5
Build `.env.workflow` from 1Password (`build-workflow-env.sh` pattern). Agents source the file; **no agent runs `op` mid-task**. Needed entries: `SUPABASE_DB_URL` (session pooler, migration only), `DATABASE_URL` (txn pooler `:6543`), `PAYLOAD_SECRET` (reuse the NAS one so existing user password hashes keep working — it is the crypto secret, not per-env), `S3_*` for R2, `VERCEL_TOKEN` if deploying non-interactively.

### 1. Supabase project (Marco, via MCP/dashboard)
KIMA org. **Free tier is fine** — the egress caching that made VMS need Pro ships in this same branch. Record: project ref, both pooler URIs, DB password.

### 2. Database migration (agent, with Marco's go)
```bash
# dry-run FIRST: dumps from NAS + prints source table counts, restores nothing
bash scripts/migrate-db-to-supabase.sh

# then, after eyeballing counts:
bash scripts/migrate-db-to-supabase.sh --apply
```
Uses `SUPABASE_DB_URL` = **session pooler `:5432`** — the one sanctioned use. The script diffs source vs target table counts; `n_live_tup` is an estimate, spot-check any mismatch with `COUNT(*)`. Expect ~69 media rows, plus projects/news/dispatch-issues/globals.

### 3. R2 bucket + media files (Marco creates bucket; agent copies with go-ahead)
1. Cloudflare → R2 → create bucket `apr70-media` (location: automatic). Create an R2 API token scoped to that bucket (Object Read & Write). No public access needed — Payload streams objects through `/api/media/file/*`, and existing DB `url` values keep working unchanged.
2. Copy the NAS media dir to the bucket **root** (object keys must equal the filenames Payload stored, including size variants):
```bash
# pull media off the NAS (cms_media volume is mounted at /app/media in the cms container)
ssh caruso@100.69.2.30 "cd /volume1/apps/apr70-v3 && docker compose cp cms:/app/media ./media-export"
rsync -av caruso@100.69.2.30:/volume1/apps/apr70-v3/media-export/ ./media-export/

# rclone remote "r2" (S3 provider Cloudflare, account endpoint, R2 token creds), then:
rclone copy ./media-export r2:apr70-media --checksum --progress
rclone check ./media-export r2:apr70-media   # must report 0 differences
```
3. Do NOT set `S3_*` on the NAS stack — it keeps using local disk as the backup copy.

### 4. Vercel projects + env (Marco creates projects; orchestrator sets env/deploys)
Create `apr70-cms` and `apr70-web` in the apr70 Vercel team, Root Directories `cms/` and `web/`, connected to this repo (or deploy via CLI below).

Env vars — mark everything except the `PUBLIC_*`/`DEPLOY_TARGET` ones **Sensitive**:

`apr70-cms` (Production + Preview):
```bash
cd cms && vercel link   # → apr70-cms
vercel env add DATABASE_URL production --sensitive     # txn pooler :6543 — THE LAW
vercel env add PAYLOAD_SECRET production --sensitive
vercel env add S3_BUCKET production                    # apr70-media
vercel env add S3_ENDPOINT production                  # https://<ACCOUNT_ID>.r2.cloudflarestorage.com
vercel env add S3_REGION production                    # auto
vercel env add S3_ACCESS_KEY_ID production --sensitive
vercel env add S3_SECRET_ACCESS_KEY production --sensitive
# repeat for preview (same values are fine pre-launch)
```

`apr70-web` (Production + Preview):
```bash
cd web && vercel link   # → apr70-web
vercel env add DEPLOY_TARGET production                # vercel
vercel env add PUBLIC_PAYLOAD_URL production           # https://<apr70-cms domain>
```

### 5. Preview deploys + browser verification (agent) — VMS law #4
```bash
cd cms && vercel deploy          # preview; cms first — web needs its URL
cd web && vercel deploy          # preview, PUBLIC_PAYLOAD_URL → cms preview/prod URL
```
A build against the real `DATABASE_URL` that "succeeds" proves nothing — **drive a real browser** through the preview and check every item:
- [ ] `/` renders real CMS content (no "Setup pending", no placeholder tiles where real media should be)
- [ ] `/work` lists the real slate (an empty "No projects found" here = pooler/env failure, NOT missing data — stop and check `DATABASE_URL` port)
- [ ] `/work/<slug>` full layout blocks render; images load from cms `/api/media/file/*` (now R2-backed) with no 404s
- [ ] `/news` DISPATCH issue renders; `/news/<slug>` article renders
- [ ] `/about`, `/contact`, `/jobs`, `/pitch`, `/investors`, `/212`, `/310`, `/nrc`
- [ ] `/admin` login works; upload a throwaway image → verify object appears in R2 bucket → delete it
- [ ] Browser console: no errors on the pages above
- [ ] Light AND dark mode; mobile viewport (390px) on `/`, `/work`, `/news`
- [ ] `sitemap-index.xml`, `robots.txt` reachable
- [ ] Supabase dashboard → Database → connections stays in single digits while browsing (pool discipline working); Org → Usage → egress not climbing abnormally after a few reloads (caching working)

Then production:
```bash
cd cms && vercel deploy --prod
cd web && vercel deploy --prod
```
Re-run the checklist against the prod URLs (`*.vercel.app` domains, pre-DNS).

### 6. DNS cutover — LAST, Marco's hands only
1. `cms.apr70.com` → `apr70-cms` project (CNAME per Vercel instructions).
2. Update `PUBLIC_PAYLOAD_URL=https://cms.apr70.com` in `apr70-web`, redeploy web, re-verify.
3. `apr70.com` + `www` → `apr70-web` project.
4. Keep NAS nginx/stack running untouched (staging/backup); optionally park it on a `staging.` subdomain later.

### Rollback
- **Before DNS (steps 1–5):** nothing to roll back — apr70.com never left the NAS. Delete/ignore the Vercel previews.
- **After DNS:** point apr70.com DNS back at the NAS — the full v3 stack (Postgres + media on disk) is still there and current as of the migration dump. Caveat: any admin edits made after cutover live only in Supabase; before rolling back, `pg_dump` Supabase (session pooler, one-shot) and restore into the NAS postgres, and pull any new R2 objects back into `cms_media`, or accept losing that window.
- Supabase/R2/Vercel can all be torn down without touching the NAS copy.

### Post-cutover (same deploy train, per plan doc)
GEO/AEO pass (llms.txt, JSON-LD, robots allowlist — VMS law #6) and the LADV/Mayors division-label reconciliation (vault is canon: LADV=310, Mayors=212).

---

## As deployed — 2026-07-05 (live)

What actually happened, where it diverged from the plan above:

- **Projects**: `apr70-cms` + `apr70-web` under team `brooklyn70s-projects` (team_4j270fbiuTLwUa7w6r01bk1u). Stable domains: `apr70-cms-brooklyn70-brooklyn70s-projects.vercel.app` (short name was taken) and `apr70-web.vercel.app`.
- **Supabase**: project `apr70` (ref rrxeqsryndjoivcsnkqq, us-east-1, +$10/mo on the Pro org — approved by Marco). NAS dump restored via session pooler with ZERO errors, exact parity (9→10 projects after apply:v4, 4 news, 69 media, 228 tables). Migrations applied via `DATABASE_URL=... pnpm payload migrate` — note `20260625_division_theme` had never been applied on the NAS.
- **cms on Vercel**: remote build works, but ONLY after excluding `scripts/` + `test.ts` from tsconfig (CLI scripts import from `../web/`, which is outside the upload root → type-check fails on Vercel only).
- **web on Vercel**: remote builds CANNOT work (vite alias to `../cms/src/payload-types.ts` is outside the upload root). Use the prebuilt flow, and do NOT rely on `vercel build` picking up DEPLOY_TARGET — set env explicitly:
  `rm -rf .vercel/output && DEPLOY_TARGET=vercel PUBLIC_PAYLOAD_URL=<cms-domain> npx astro build && vercel deploy --prebuilt --prod`
  (A node-adapter build silently produces client/server under static/ → deployment is Ready but 404s everywhere. `functions/_render.func` present = correct adapter.)
- **gsap crashes Vercel functions** (`SyntaxError: Cannot use import statement outside a module`): fixed with `vite.ssr.noExternal: ['gsap']` in astro.config.mjs.
- **Deployment protection**: Standard Protection shields even *production* `*.vercel.app` URLs (only custom domains are public). Disabled Vercel Authentication on both projects via API PATCH `{"ssoProtection":null}` using the CLI token — required for web→cms server-side fetches AND public staging review. Re-enable per-project after DNS cutover if desired.
- **Troupe global**: apply:v4 does NOT seed it (only migrate-v2 step 9b does). Seeded on Supabase by `pg_dump --data-only -t 'troupe*'` from the verified local DB piped into the Supabase session pooler.
- **`vercel promote` needs `--yes`** non-interactively.
- **Still open**: DNS cutover (Marco, last); NAS remains live at apr70.com and untouched.

- **R2 DONE (2026-07-05, same session):** bucket `apr70-media` (ENAM) created via Cloudflare MCP; VMS account-wide R2 object token reused (op item API/32fj…, fields username/type/filename); 435 objects / 734.7 MiB uploaded + rclone-checked; S3_* env on apr70-cms (prod+preview, keys Sensitive); cms redeployed (importmap regenerated in build); web emits absolute media URLs via PUBLIC_MEDIA_BASE. /212 hero+footer SVGs verified 200 from R2.
