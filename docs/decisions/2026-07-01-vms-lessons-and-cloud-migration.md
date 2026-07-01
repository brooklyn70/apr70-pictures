# VMS lessons → apr70 + cloud migration plan (Supabase / Vercel / store)

**Date:** 2026-07-01 · **Status:** plan approved-in-principle by Marco ("move apr70 db to Supabase, site on Vercel, open an apr70 store link"); provisioning steps need his hands (billing/DNS).
**Source of lessons:** `~/websites/vik-muniz-studio/CLAUDE.md` + `~/.claude/skills/kima-site-build/` (the living workflow skill — reuse it for this migration).

## 1. Hard-earned lessons from the Vik Muniz build (adopt as law here)

1. **Supabase pooler discipline.** Builds/imports go through the **transaction pooler `:6543`**, never the session pooler `:5432`. The session pooler caps at ~15 clients; Next/Astro build workers each open a pg pool, exhaust it, and the data layer silently serves fallback content that *looks* like missing data. Set tiny pools in payload config (`max:4, min:0, idleTimeout:10s, connTimeout:5s`).
2. **Cache slim projections, or egress explodes.** VMS burned **55 GB egress in a month with 0 users** (1,101% of Free tier) purely from uncached full-catalogue reads: builds, dev servers, import scripts, AI crawlers. Fix that stopped it: wrap the catalogue read in `unstable_cache` (1 h, tagged) caching the **mapped slim array**, never raw Payload docs (2 MB `unstable_cache` ceiling silently no-ops). Astro equivalent for v3: cache the projected content at the data-access layer; never re-dump the whole DB per render. Diagnose egress via **Org → Usage breakdown** before assuming a cause.
3. **Media on R2, never in Postgres/Supabase Storage.** VMS media lives on Cloudflare R2 via the S3 adapter — Storage egress stayed at 0 through the blowout. apr70 media (69 rows now, will grow with mood boards/stills/video) goes to R2 on migration.
4. **A DB-less (or pooler-starved) build bakes fallbacks silently.** Verification law: **build with the real DATABASE_URI, serve it, drive a real browser** through changed pages (links, images, console, light/dark, mobile) before claiming done. Code review ≠ rendering.
5. **Secrets via 1Password → `.env.workflow`** built once by a human (`build-workflow-env.sh` pattern); agents source the file, never call `op` mid-task.
6. **GEO/AEO from day one** (the launch depends on being AI-discoverable): `llms.txt` + `/llms-full.txt`, server-rendered real content (AI crawlers don't run JS), JSON-LD (`Organization`, `CreativeWorkSeries`/`Movie` per property, `FAQPage`), robots.txt explicitly allowing GPTBot/OAI-SearchBot/PerplexityBot/ClaudeBot/Google-Extended, sitemap with every route. For the projects launch: one server-rendered page per property with synopsis + JSON-LD is what makes the X campaign land in AI answers.
7. **No tickers/marquees, ever** (Marco hard rule, applies to any theme). Grep `marquee|ticker|translateX` keyframes before shipping a theme.
8. **Second-opinion loop:** grok CLI reviews non-trivial scripts before trusting output (`grok --prompt-file <f> --disable-web-search --no-subagents --tools "" --output-format plain`); reconcile findings against real data. Browser/DB verification still mandatory.

## 2. Migration plan — NAS → Supabase + Vercel

**Target = v3 (this repo), not legacy v2** (`~/websites/APR_70` stays serving apr70.com from the NAS until v3 cutover; migrating v2 would be throwaway work).

Current: Astro 6 web + Payload 3 cms, Postgres `apr70_cms` on NAS Docker, staged to `/volume1/apps/apr70-v3`.

Steps (in order; ⚙ = agent can do, 👤 = Marco):
1. 👤 Create Supabase project (KIMA org). **Free tier is fine IF lesson #2 ships in the same PR** — caching + pooler discipline from day one; VMS needed Pro only to absorb the uncached blowout.
2. ⚙ `pg_dump` `apr70_cms` from NAS → restore to Supabase (session pooler `:5432` for the one-shot restore; runtime + builds on `:6543`).
3. ⚙ Wire `DATABASE_URI` (txn pooler) + tiny pool config in `cms/`; R2 bucket + S3 adapter for media; migrate `cms/media/` files to R2.
4. ⚙ Vercel: two projects from this monorepo (`cms/` Next.js, `web/` Astro SSR) or single with rewrites — decide at deploy; preview-deploy first, browser-verify per lesson #4.
5. 👤 DNS: point apr70.com at Vercel when v3 content is signed off; NAS becomes staging/backup.
6. ⚙ GEO/AEO pass (lesson #6) rides the same deploy.

## 3. APR70 store ("why not!")

Cheapest credible v1, reusing VMS research (`~/websites/vik-muniz-studio/docs/make-a-muniz-pod-research.md`):
- **Printful** print-on-demand (posters/tees/hats per property — 212 monochrome NY imagery, LADV key art from the mood boards). True mockup-generation API, no inventory.
- v1 = a **Store block + nav link** on the site (per hard rule #1, it's a block, not a page template) linking to a Printful-backed storefront (Printful × Shopify Starter, or Printful's own quick store) — zero build cost, real link for the launch tweets.
- v2 (post-launch, if traction) = native `/store` with cart + Stripe, product mockups generated from property art.
- 👤 needs: Printful account (APR70-owned), which properties get merch first.

## 4. Open decisions for Marco

- Supabase org + card (Free w/ caching, per above) · Vercel team for apr70 · DNS cutover timing · store platform (Printful-link v1 recommended) · reconcile division labels: site data says LADV=212/Mayors=310, vault canon says LADV=**310**/Mayors=**212** — vault is canon, fix the seed data.
