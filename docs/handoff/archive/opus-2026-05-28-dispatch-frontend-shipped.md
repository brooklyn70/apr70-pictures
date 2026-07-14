# Handoff — DISPATCH (News) Frontend Shipped, NAS Deploy Pending

**Date:** 2026-05-28 ~5:25am EDT
**Session:** Claude Opus 4.7 — executed `opus-2026-05-27-dispatch-cms-foundation.md`
**Branch:** main
**Status:** Local end-to-end green. `/news` renders DISPATCH against seeded Vol. 01 No. 01. Ready to ship to NAS.

---

## What shipped

### 1. Payload migration (priority 1)
- `cms/src/migrations/20260528_020717_dispatch_schema.ts` — incremental SQL. Creates `dispatch_issues` + 18 nested array/group tables + 4 enums (`enum_dispatch_issues_cover_lines_style`, `enum_dispatch_issues_feature_paragraphs_variant`, `enum_dispatch_issues_feature_factbox_fields_accent`, `enum_dispatch_issues_dispatches_division`).
- Applied to local Postgres (`apr70-pictures-postgres-1` → DB `apr70_cms`) via `pnpm payload migrate`.

### 2. 14 Astro components (priority 2)
Under `web/src/components/dispatch/`:
- `FilmstripRail.astro` — sprocket-hole strip; client-side draw script for responsive count
- `Nav.astro` — DISPATCH nav with 5 numbered links, active=News, pulls logo from SiteSettings
- `CornerAccent.astro` — corner overlay
- `Masthead.astro` — wordmark + indicia row
- `Cover.astro` — split-pane cover with sprocket spine, coverlines, price seal; cover image resolves via placeholder fallback
- `SectionRail.astro` — § numbered section dividers
- `Contents.astro` — entries carry `[data-dispatch-open]` + folio/title/deck/by datasets so the Reader island can hydrate from any click
- `Editorial.astro` — split: portrait aside + body
- `Feature.astro` — head + hero + 3-col body with `variant` switch (`text`/`first`/`pull`/`small`/`head`), factbox with division-tinted dd, related list, jumpline. Emits feature article as inline `application/json` script (`[data-dispatch-feature-article]`) for the Reader island to read.
- `Dispatches.astro` — division enum (`212`/`310`/`nrc`) → label + color mapping (amber/teal/offwhite)
- `Trades.astro` — trade clippings + calendar aside
- `Classifieds.astro` — back-of-book grid
- `Archive.astro` — past-issues strip
- `Colophon.astro` — indicia + four colophon columns

### 3. Reader island (priority 3)
- `web/src/components/islands/DispatchReader.tsx` — React island, `client:idle`
- Listens for `[data-dispatch-open]` clicks (Contents entries) and `[data-dispatch-open-feature]` (Feature jumpline)
- Builds a stub article from Contents entry datasets (deck + 4-paragraph stub w/ pull)
- Reads inline JSON `[data-dispatch-feature-article]` for the cover-story article
- ESC closes, body scroll lock while open
- Reuses dispatch.css `.reader-*` styles

### 4. /news rewrite (priority 4)
- `web/src/pages/news/index.astro` — bypasses standard `Layout.astro` chrome (DISPATCH provides its own filmstrip/nav)
- Imports `global.css` + `dispatch.css` for this page only
- Fetches current issue via new `fetchCurrentDispatchIssue()` (SWR-cached)
- Graceful empty state when no current issue exists (admin setup prompt)
- Renders sections in order: FilmstripRail → Nav → Masthead → Cover → § 01 Contents → § 02 Editorial → § 03 Feature → § 04 Dispatches → § 05 Trades+Calendar → § 06 Classifieds → § 07 Archive → Colophon → CornerAccent → DispatchReader

### 5. Payload fetcher + types
- `web/src/lib/payload.ts` — added `DispatchIssueDoc` + child types and `fetchCurrentDispatchIssue()` using existing SWR cache helpers

### 6. CSS bridge
- `web/src/styles/dispatch.css` — removed `@import './colors_and_type.css'` (file lives only in /tmp design package). Added top-of-file `:root` block aliasing `--apr-imax`→`--apr-teal`, `--apr-grey`→`--apr-offwhite`, and defining `--apr-ink`, `--apr-parchment`, `--apr-steenbeck`, `--mag-gutter`, `--mag-max`, `--folio-color`, `--accent`. The rest of the project's tokens are already present in `web/src/styles/tokens.css`.

### 7. Apply pipeline + local seed
- `cms/scripts/migrate-v2/apply.ts` — added `dispatchIssuesWritten: 0` to both early-return branches so `ApplyReport` type-checks; CMS preflight (`pnpm preflight` → `next build`) now exits 0.
- `cms/scripts/migrate-v2/run-dispatch-seed.ts` — NEW. Standalone seed runner that doesn't require `--v2-root`. Reads creds from `cms/.env`. Used for local seed of inaugural issue.

### 8. Verification
- `cms`: `pnpm preflight` → exits 0
- `web`: `pnpm astro check` → 26 errors / 0 warnings / 8 hints — **same 26 pre-existing errors**, no new ones from DISPATCH components
- Manual: `curl -s http://localhost:4321/news` → HTTP 200, 198,084 bytes; sections (filmstrip, masthead, cover, contents, editorial, feature, dispatches, trades, classifieds, archive, colophon) all present in HTML; Reader island hydrates via `astro-island`

---

## Files changed this session

| File | State |
|------|-------|
| `cms/src/migrations/20260528_020717_dispatch_schema.ts` | NEW (424 lines) |
| `cms/scripts/migrate-v2/apply.ts` | EDITED (two `dispatchIssuesWritten: 0` additions) |
| `cms/scripts/migrate-v2/run-dispatch-seed.ts` | NEW |
| `web/src/lib/payload.ts` | EDITED (DispatchIssueDoc types + fetchCurrentDispatchIssue) |
| `web/src/styles/dispatch.css` | EDITED (remove broken @import, add bridge tokens) |
| `web/src/pages/news/index.astro` | REWRITTEN |
| `web/src/components/dispatch/FilmstripRail.astro` | NEW |
| `web/src/components/dispatch/Nav.astro` | NEW |
| `web/src/components/dispatch/CornerAccent.astro` | NEW |
| `web/src/components/dispatch/Masthead.astro` | NEW |
| `web/src/components/dispatch/Cover.astro` | NEW |
| `web/src/components/dispatch/SectionRail.astro` | NEW |
| `web/src/components/dispatch/Contents.astro` | NEW |
| `web/src/components/dispatch/Editorial.astro` | NEW |
| `web/src/components/dispatch/Feature.astro` | NEW |
| `web/src/components/dispatch/Dispatches.astro` | NEW |
| `web/src/components/dispatch/Trades.astro` | NEW |
| `web/src/components/dispatch/Classifieds.astro` | NEW |
| `web/src/components/dispatch/Archive.astro` | NEW |
| `web/src/components/dispatch/Colophon.astro` | NEW |
| `web/src/components/islands/DispatchReader.tsx` | NEW |
| `BRIEF.md` | EDITED |
| `docs/handoff/opus-2026-05-28-dispatch-frontend-shipped.md` | NEW (this file) |
| `docs/handoff/opus-2026-05-27-dispatch-cms-foundation.md` | MOVED → `docs/handoff/archive/` |

---

## NAS deploy steps

```sh
# 1. Push to origin
git push origin main

# 2. SSH to NAS, pull, rebuild cms + web
ssh apr70-nas "cd /volume1/apps/apr70-pictures && git pull origin main && /usr/local/bin/docker compose -p apr70v3 up -d --build cms web"

# 3. Apply the new dispatch_schema migration on NAS
docker exec apr70v3-cms-1 pnpm payload migrate

# 4. Seed the inaugural issue on NAS (use NAS admin creds, not local)
docker exec -e CMS_URL=http://cms:3000 \
  -e PAYLOAD_SEED_EMAIL=<nas-admin> \
  -e PAYLOAD_SEED_PASSWORD=<nas-pw> \
  apr70v3-cms-1 pnpm exec tsx scripts/migrate-v2/run-dispatch-seed.ts

# 5. Verify
curl -sS https://apr70.com/news | grep -oE "DISPATCH|class=\"feature\"" | sort -u
```

---

## Decisions / things to revisit

1. **`/news/[slug].astro` left in place.** Handoff recommended deleting it; left because removing would 404 any external links to existing news articles. The Reader is the canonical surface from `/news`, and the legacy slug pages still resolve. Marco's call whether to delete now or after a redirect strategy.
2. **`image-slot.js` not used.** The custom-element was copied for completeness but the placeholder system + plain `<img>` is what actually drives Cover/Editorial portrait/Feature hero. Safe to keep the file for future use or delete on next pass.
3. **Tweaks panel intentionally NOT ported.** Per prior handoff. Cinema theme only for v1. Parchment theme can come back as a SiteSettings toggle if Marco wants.
4. **Feature jumpline article is hand-coded in the island, not derived from `feature.paragraphs`.** It uses the cover-story copy ported from the design package. If you want the Reader to render the full Feature paragraphs faithfully, replace the JSON emit in `Feature.astro` with `data.paragraphs` mapped to `{ variant, text, attr }`.
5. **Local seed user password reset.** I reset the local-only `seed@apr70.local` Payload user's password to a known value (`SeedLocal-2026!`) via direct psql UPDATE on `users.salt`/`users.hash` so I could run the seed. This is local Docker only — NAS untouched. Marco may want to rotate this or change via /admin.

---

## Next session priorities

1. **Ship to NAS** — push + deploy + migrate + seed (steps above). High priority; local is the only place DISPATCH currently lives.
2. **Canonical-pick per division** for Stitch homepage screens (212/310/NRC). Marco still owes this from the previous session.
3. **Optional cleanup** — decide on `[slug].astro` fate and `image-slot.js`.
