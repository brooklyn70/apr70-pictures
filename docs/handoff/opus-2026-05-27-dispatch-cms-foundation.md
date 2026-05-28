# Handoff — DISPATCH (News) CMS Foundation Shipped, Frontend Port Pending

**Date:** 2026-05-27 ~10:00pm EDT
**Session:** Claude Opus 4.7 (continuation — Marco delivered the design)
**Branch:** main
**Context gate:** HARD-BLOCK at 312KB. Stop, commit, fresh session.

---

## What Marco delivered

Marco dropped `News Page.zip` (20MB) on the desktop. It contains the full **DISPATCH** design — a quarterly print-magazine layout for `/news`, not the simple list the route currently shows.

Unzipped to `/tmp/news-page-design/`. Key files reviewed in full this session:
- `News.html` — React 18 (UMD + Babel) host page
- `Chrome.jsx` — FilmstripRail (with sprocket-hole strip), Nav (numbered links, active = News), CornerAccent
- `CoverSection.jsx` — Masthead + Cover (split-pane: left = headline stack + spine of sprockets, right = image + coverlines + price seal)
- `Sections.jsx` — Contents / Editorial / Feature / Dispatches / Trades+Calendar / Classifieds / Archive / Colophon
- `Reader.jsx` — Full-screen article modal triggered from Contents entries + Feature jumpline
- `data.jsx` — Full editorial content for Vol. 01 No. 01 Spring 2026 (the inaugural issue, with the real "The Mayors" cover story)
- `colors_and_type.css` — Token system that matches existing project tokens.css (brand hexes already locked)
- `dispatch.css` — 1218 lines / 215 selectors, the full magazine layout
- `tweaks-panel.jsx` — In-page design-time control (cinema/parchment theme, accent, columns) — **will NOT ship**
- `image-slot.js` — Custom-element drop targets for images
- 8 Futura Std OTF files — **already in `web/public/fonts/`, no copy needed**
- 4 SVG brand assets — **equivalents already in `web/public/brand/apr70-logos/apr70-apr70pictures/`**

Marco answered the two scope questions:
1. **Routing:** DISPATCH replaces `/news` entirely (and the existing `/news/[slug]` decision is open).
2. **CMS wiring:** Full Payload integration *now* — build schema + seed + render.

---

## What shipped this session

### 1. Design assets in repo
- `web/src/styles/dispatch.css` — full 1218-line layout copied verbatim
- `web/public/brand/dispatch-favicon.svg` — DISPATCH favicon
- `web/public/dispatch-image-slot.js` — image-slot custom-element (TBD on whether we need it; placeholder system may supersede)

### 2. Payload schema for DISPATCH
`cms/src/collections/DispatchIssue.ts` — one collection, one document per quarterly issue. Schema mirrors the JSX `DISPATCH_DATA` shape verbatim so each section's Astro component can read by name. Includes:
- Indicia group (volume/number/season/reel/isoDate/printRun/offices/tagline)
- Cover group (kicker/deck/byline/coverImage + lines[] with style enum + coverlines[])
- Contents array of groups (label/meta/entries[])
- Editorial group (eyebrow/title/lead/paragraphs[]/signatureName/signatureMeta/quote/portrait)
- Feature group (eyebrow/titleParts[]/deck/meta[]/heroImage/imageCaption/paragraphs[] with variant enum/factbox/related[]/jumpFrom/jumpTo)
- Dispatches array (division enum 212/310/nrc + date/title/body/status/link/ghost)
- Trades / Calendar / Classifieds / Archive arrays
- Colophon group (legal/type/baseline)
- Sidebar fields: `slug`, `current` checkbox (only one issue marked current renders at /news), `releaseDate`

Wired into `cms/src/payload.config.ts` (added to `collections: [...]`).

### 3. DISPATCH inaugural-issue seed
`cms/scripts/migrate-v2/seed-dispatch.ts` — exports `seedDispatchInaugural(token)`. Ports the entire `data.jsx` content for Vol. 01 No. 01 Spring 2026 into a TS object and upserts to `dispatch-issues` by slug `vol-01-no-01-spring-2026`. Idempotent (find-by-slug → PATCH if exists, POST otherwise).

Wired into `apply.ts` as step 14a (between brand seed and SiteSettings stamp). Adds `dispatchIssuesWritten` to ApplyReport + console summary.

---

## What's NOT done (priority order for next session)

### Priority 1 — Generate + apply Payload migration ⚠️
The new `dispatch-issues` collection has **no Postgres tables yet**. Migration must be generated and applied before the seed will work.

```sh
cd cms
pnpm payload generate:migration --name dispatch_schema
# Review the SQL — should be CREATE TABLE for dispatch_issues + nested array tables.
# Verify it's incremental (not a snapshot replacing other tables).
pnpm migrate:v2:apply  # OR pnpm payload migrate
```

Then trigger the seed (apply pipeline picks it up automatically once tables exist).

### Priority 2 — Port frontend Astro components
The DISPATCH page is not yet renderable. Port each JSX component to Astro:
- `web/src/components/dispatch/FilmstripRail.astro` (sprocket-hole strip needs a script — keep minimal client JS inline)
- `web/src/components/dispatch/Nav.astro`
- `web/src/components/dispatch/Masthead.astro`
- `web/src/components/dispatch/Cover.astro`
- `web/src/components/dispatch/SectionRail.astro`
- `web/src/components/dispatch/Contents.astro` (entries open the Reader island)
- `web/src/components/dispatch/Editorial.astro`
- `web/src/components/dispatch/Feature.astro`
- `web/src/components/dispatch/Dispatches.astro`
- `web/src/components/dispatch/Trades.astro`
- `web/src/components/dispatch/Classifieds.astro`
- `web/src/components/dispatch/Archive.astro`
- `web/src/components/dispatch/Colophon.astro`
- `web/src/components/dispatch/CornerAccent.astro`

### Priority 3 — Reader modal as React island
`web/src/components/islands/DispatchReader.tsx` — loaded via `client:idle`. Triggered by Contents entry clicks + Feature `OPEN FULL STORY →` link. Reader CSS is already in `dispatch.css`.

### Priority 4 — Replace `/news`
Rewrite `web/src/pages/news/index.astro`:
- Fetch the current issue: `GET /api/dispatch-issues?where[current][equals]=true&depth=2&limit=1`
- Bypass the standard `<Layout>` chrome (DISPATCH provides its own Nav/Filmstrip/Masthead)
- Render in section order: FilmstripRail → Nav → Masthead → Cover → § 01 Contents → § 02 Editorial → § 03 Feature → § 04 Dispatches → § 05 Trades+Calendar → § 06 Classifieds → § 07 Archive → Colophon → CornerAccent
- Import the dispatch.css globally for this page only
- Mount DispatchReader island

Decision still open: does `/news/[slug]` go away (Reader modal handles all article opens) or stick around for permalink/SEO? Recommend deleting `[slug].astro` since the Reader is the canonical reading surface and individual articles aren't yet separately authored.

### Priority 5 — QA + commit
- `cd cms && pnpm preflight` — must exit 0
- `cd web && pnpm astro check` — must not introduce new errors beyond the 26 pre-existing
- Manual: `/news` renders DISPATCH end-to-end in cinema theme (parchment can come later; the tweaks panel doesn't ship)

---

## Files changed this session

| File | State | Type |
|------|-------|------|
| `cms/src/collections/DispatchIssue.ts` | NEW | Payload collection schema |
| `cms/src/payload.config.ts` | EDITED | Imports + registers DispatchIssue |
| `cms/scripts/migrate-v2/seed-dispatch.ts` | NEW | Seeds Vol.01 No.01 from design data.jsx |
| `cms/scripts/migrate-v2/apply.ts` | EDITED | Step 14a wired + report shape + console output |
| `web/src/styles/dispatch.css` | NEW | 1218 lines, copied verbatim from design |
| `web/public/brand/dispatch-favicon.svg` | NEW | Favicon for DISPATCH route |
| `web/public/dispatch-image-slot.js` | NEW | Custom-element for image drop targets (may not ship) |
| `BRIEF.md` | EDITED | Updated current-state header |
| `docs/handoff/opus-2026-05-27-dispatch-cms-foundation.md` | NEW | This file |
| `docs/handoff/archive/opus-2026-05-27-nrc-stitch-complete.md` | MOVED | Previous session's handoff archived |

---

## Architecture decisions baked in

1. **Single collection, not many.** All DISPATCH sections live nested on one `dispatch-issues` document. Simpler admin UX (one issue = one screen), and the data shape is genuinely structured-per-issue. Archive lives as an array of past-issue cards (lightweight) rather than relationships to other issue docs — when an issue is "archived," its data lives in the array of the current issue's `archive` field.
2. **Division enum on Dispatches.** Uses `212` / `310` / `nrc` slugs instead of a freeform color string. Frontend maps to brand color tokens (`var(--apr-amber)` / `var(--apr-teal)` / `var(--apr-offwhite)`).
3. **Paragraph variant enum on Feature.** Replaces the loose `{first, text, pull, small, head, attr}` JSX shape with `variant: 'text' | 'first' | 'pull' | 'small' | 'head'` + a single `text` field + optional `attr` (pull-only). Renderer switches on variant.
4. **Tweaks panel does not ship.** That's a design-time control, not a user feature. Theme toggle (cinema/parchment) can be revisited later as a site-wide setting; for v1 the magazine is cinema-only.
5. **Image slots in v1 use the existing placeholder system.** Marco's placeholder SVG infrastructure (`web/src/lib/placeholder.ts` + `resolveMediaSrcOrPlaceholder`) already shipped last session. The DISPATCH renderer should use it for Cover/Editorial portrait/Feature hero/Reader hero so the page renders cleanly with no media uploaded. The `image-slot.js` custom-element is copied but is not the canonical fallback — the placeholder system is.

---

## NAS deploy reminder

Once the migration + frontend ports land, NAS deploy:
```sh
ssh apr70-nas "cd /volume1/apps/apr70-pictures && git pull origin main && /usr/local/bin/docker compose -p apr70v3 up -d --build cms web"
docker exec apr70v3-cms-1 pnpm payload migrate   # creates dispatch_issues tables
# Trigger apply pipeline so the seed runs (writes Vol. 01 No. 01)
```

---

## Stitch division screens (from earlier in this session)

All 6 division-homepage screens still complete in Stitch:
- 212: Title Card + Editorial → project `10388160894163022728`
- 310: IMAX Scale + Architectural → project `13932882577618101661`
- NRC: Art Film (`5199fa8fd2cc4e94953959f0a2ca326d`) + Deconstructed Gallery (`f4cc6d552afe4417add9b019e72e09bd`) → project `6601419679785046440`

Marco still owes a canonical pick per division before those land in Astro.
