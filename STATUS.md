# STATUS — apr70-pictures (v3)

**The standing "where we're at" document.** Skim this first after time away.
**Last reviewed:** 2026-06-25 (Marco returning after ~4 weeks on the Writer's Room)
**Last actual work:** 2026-05-29 (DISPATCH news magazine shipped to NAS)

---

## One-paragraph state of the world

apr70 v3 is **live and healthy on the NAS** (`kimaserver:8080`, 4 Docker containers).
Every primary route renders real content from Payload. The site is **block-based**:
editors stack blocks in `/admin`, the frontend is one `<BlockRenderer>` switch. The big
recent win was **DISPATCH** — the vintage-cinema-magazine treatment of `/news` — which
went end-to-end (CMS schema → 14 Astro components → React reader island → seeded issue)
and deployed 2026-05-29. The project has been **paused ~4 weeks** while we built the
Writer's Room. Nothing is broken; we left off with two open creative decisions (your
canonical picks) and a backlog of polish/launch tasks.

---

## Stack (as actually built — note: NOT the KIMA Next.js stack)

| Layer | apr70 v3 (this repo) |
|---|---|
| Frontend | **Astro** (HTML-first, React islands for interactive blocks), TypeScript, vanilla CSS via `tokens.css` |
| CMS | **Payload v3** (standalone Node service), Postgres |
| Animation | **GSAP + ScrollTrigger** only |
| Hosting | **Docker on Synology NAS**, nginx reverse proxy |
| Deploy | `git push` → NAS `git pull` → `docker compose up --build` |

> ⚠️ **Important context for the new AI/theme work:** the `kima-site-build` skill we wrote
> this afternoon documents a *different* stack — Next.js 16 + Vercel + Supabase + Cloudflare
> R2 + `src/designs/` theme layer + Ask-the-Archive AI. apr70 predates that skill and runs on
> Astro/NAS. Bringing "themes + AI" here is a **port of the concepts**, not a drop-in. See the
> "Incorporating themes + AI" section at the bottom — that decision is still open.

---

## What's live (all rendering real content on NAS)

| Route | Status |
|-------|--------|
| `/` home | LIVE — 4 blocks |
| `/about` `/contact` `/investors` | LIVE — 4 blocks each |
| `/jobs` | LIVE — 5 blocks |
| `/pitch` | LIVE — 6 blocks |
| `/work` + `/work/[slug]` | LIVE — 9 projects |
| `/news` (DISPATCH magazine) | LIVE — Vol.01 No.01, full magazine + reader island |
| `/news/[slug]` | LIVE — legacy article pages (kept; reader is canonical surface) |
| `/212` `/310` `/nrc` divisions | LIVE — starter layouts (hero + twoCol + richText + cta) |
| `/privacy` `/terms` | **MISSING** — still to build |

**CMS inventory:** Home + 7 page globals + 3 division globals + SiteSettings + FooterLinks,
9 Projects, 4 News articles, 1 DISPATCH issue, 69 Media rows (59 v2 images + 10 brand SVGs).

---

## Phase progress

- **Phases 1–4 (foundation, tokens, chrome, seed/content):** ✅ complete
- **Phase 5 (projects/news/divisions):** ✅ mostly — open: HeroBlock slider island, Hero visual QA
- **Phase 6 (Division Showcase):** ✅ 5 variants + filmstrip-build v5 built — open: **your director review to lock the canonical variant**
- **Phase 7 (polish + launch):** ⏳ not started — masonry island, news editorial pass, full Lighthouse + WCAG audits, staging subdomain, DNS cutover to v3

---

## Open decisions waiting on you (these block forward motion)

1. **Division Showcase — lock the canonical variant.** v5 (animated filmstrip → logo-build)
   supersedes v4; needs your motion/cadence sign-off. Preview at `/dev/division-variants`.
2. **Stitch division homepages — canonical pick per division.** 6 screens generated for
   212 / 310 / NRC; all awaiting your "this one." Approved base design so far: **v0-slate-stack**
   (logo left, tagline + ledger right, cursor-follow glow).
3. **`/news/[slug]` fate** — keep legacy article pages or redirect into the DISPATCH reader.

---

## Next concrete steps (when you resume the original backlog)

1. **HeroBlock slider island** — React + GSAP crossfade (auto-featured + curated modes). `[p5]`
2. **Hero visual QA** — `requires-gui`. `[p5]`
3. **Build `/privacy` + `/terms`** — the only missing routes.
4. **Phase 7 polish** — MasonryBlock island, `/news` editorial typography pass, Lighthouse
   (LCP < 2.5s, CLS < 0.1), WCAG AA audit.
5. **Launch infra** — DSM reverse-proxy slot for `staging-v3.apr70.com`, then DNS plan apr70.com → v3.

---

## How to deploy (NAS)

```sh
git push origin main
ssh apr70-nas "cd /volume1/apps/apr70-pictures && git pull origin main && \
  /usr/local/bin/docker compose -p apr70v3 up -d --build cms web"
docker exec apr70v3-cms-1 pnpm payload migrate   # if a migration is pending
```
Run `pnpm preflight` from `cms/` (must exit 0) before any NAS build.

---

## Known data issues

- 2 projects have null status (v2 `bible`/`pitch`) — set manually in `/admin`.
- News article media fields null (images weren't in the v2 export).
- 12 v2 HTML files (slide-decks/treatments) correctly rejected by media migration.

---

## Incorporating "themes + AI" (the new ask — June 2026) — FOUNDATION BUILT ✅

**Decisions (locked with Marco 2026-06-25):** port onto the existing **Astro/NAS** stack ·
**per-division themes** (212/310/NRC each get a skin) · **AI = authoring assistant + theme-design
assistant** (for Marco; no visitor-facing chat). Full design: `docs/architecture/themes-and-ai.md`.

**Shipped this session (local, type-checks clean — 0 net-new errors over the 26 baseline):**

- **Per-division theme layer** — registry (`web/src/designs/manifest.ts`) + 5 skins
  (`web/src/styles/designs.css`: signature / noir / amber-heat / imax-deep / daylight),
  scoped under `[data-design]`. Division pages pick a skin from Payload `theme` → per-division
  default (212→amber-heat, 310→imax-deep, NRC→noir). `Layout.astro` stamps `data-design`.
- **Theme picker** — `/dev/theme-studio` (dev-gated): flip every division through every skin live.
- **CMS field** — `theme` select on the three division globals + ready migration
  `20260625_division_theme.ts`. Frontend works on defaults even before the migration is applied.
- **AI build assistant** — `/dev/ai-studio` (dev-gated) + `POST /api/ai/assist`. Anthropic SDK,
  `claude-opus-4-8`, two modes: **Author copy** and **Design a theme**, grounded in the locked palette.

**Not yet active (deliberate, gated — see `docs/architecture/themes-and-ai.md` checklist):**
- `pnpm install` in `web/` to pull `@anthropic-ai/sdk` (added to package.json).
- `pnpm payload migrate` to add the `theme` column (local push auto-applies; NAS is explicit).
- Set `ANTHROPIC_API_KEY` on the web service; `PUBLIC_ENABLE_STUDIO=true` to expose studios off `astro dev`.

**Try locally:** `cd web && pnpm dev` → `/dev/theme-studio` and `/dev/ai-studio`.

---

## Reference

- Conventions + hard rules: `CLAUDE.md`
- Backlog: `TASKS.md`
- Architecture: `docs/architecture/` (`v3-master-plan.md` is the locked plan)
- Latest detailed handoff: `docs/handoff/opus-2026-05-28-dispatch-frontend-shipped.md`
- Design/research reference repo: `/Users/marco/websites/apr70-website-reference-repository/`
- New build methodology skill: `~/.claude/skills/kima-site-build/` (Next.js stack — read before porting)
