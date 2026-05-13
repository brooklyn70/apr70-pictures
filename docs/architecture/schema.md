# Page schema — Globals with `layout: Block[]` (v3)

Editor-authored pages are modeled as **Payload Globals** (one row per logical page or section site-wide). Each Global holds a **layout** field: an ordered array of block objects. Valid blocks are defined in `blocks.md` and discriminated by `blockType` (or Payload `blockType` / `type` field — exact key to match Payload blocks extension naming in `cms/`).

## Layout field

- **Field name:** `layout`
- **Type:** array of block objects (Payload `blocks` field type or array of polymorphic relations).
- **Order:** array order is render order top-to-bottom.
- **Validation:** each block must match one of the eleven block schemas; unknown block types are rejected at save time in Payload.

## Global inventory

| Global slug | Label | Status (as of 2026-05-13) | Notes |
|-------------|-------|--------------------------|-------|
| `home` | Home | EXISTS — seeded (4 blocks) | hero, twoCol x2, divisionShowcase |
| `site-settings` | Site Settings | EXISTS — seeded (seededVersion=0.1.0) | brandLabel, legalEntity, tagline, etc. |
| `footer-links` | Footer Links | EXISTS in schema — NOT seeded | primaryNav, divisionNav, moreNav arrays |
| `about` | About | EXISTS — seeded via apply.ts v0.2.0 | from v2-export/content/pages/about.json |
| `contact` | Contact | EXISTS — seeded via apply.ts v0.2.0 | from v2-export/content/pages/contact.json |
| `jobs` | Jobs / Careers | EXISTS — seeded via apply.ts v0.2.0 | from v2-export/content/pages/jobs.json |
| `pitch` | Pitch | EXISTS — seeded via apply.ts v0.2.0 | from v2-export/content/pages/pitch.json |
| `investors` | Investors | EXISTS — seeded via apply.ts v0.2.0 | from v2-export/content/pages/partners.json |

## Collection inventory

| Collection slug | Status (as of 2026-05-13) | Notes |
|-----------------|--------------------------|-------|
| `users` | EXISTS — 1 user created | Admin user created 2026-05-13 |
| `media` | EXISTS — empty | No media migration yet |
| `projects` | EXISTS — 9 documents seeded | `cms/src/collections/Project.ts`. Fields: title, slug, division, subtitle, status, year, heroImage, layout |
| `news` | EXISTS — 4 documents seeded | `cms/src/collections/NewsArticle.ts`. Slug is `news` not `news-articles` (postgres 63-char limit) |

## Astro route → Global slug mapping

| Route | Global slug | Status |
|-------|------------|--------|
| `/` | `home` | LIVE |
| `/about` | `about` | BUILT — needs NAS deploy |
| `/contact` | `contact` | BUILT — needs NAS deploy |
| `/jobs` | `jobs` | BUILT — needs NAS deploy |
| `/pitch` | `pitch` | BUILT — needs NAS deploy |
| `/investors` | `investors` | BUILT — needs NAS deploy |
| `/work` | (projects collection) | LIVE — 9 project cards |
| `/work/[slug]` | (projects collection) | LIVE — 9 projects |
| `/news` | (news collection) | LIVE — 4 articles |
| `/news/[slug]` | (news collection) | LIVE — 4 articles |
| `/212`, `/310`, `/nrc` | (division globals) | MISSING — Phase 5 next |
| `/privacy`, `/terms` | (static or globals) | MISSING |

## Astro mapping pattern

- Fetch Global by slug via `fetchGlobal()` in `web/src/lib/payload.ts`.
- Pass `layout` into `<BlockRenderer blocks={global.layout} />`.
- No per-page Astro components for section structure — only the BlockRenderer switch per CLAUDE.md rule 1.

## Relationship to integration spec

Media URLs, auth, and fetch strategy for Globals are defined in `integration.md`.
