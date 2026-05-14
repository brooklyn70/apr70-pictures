# Brand assets integration (Payload + Astro)

**Status:** Phase 0 complete — logos vendored under `web/public/brand/apr70-logos/` (mirror of `apr70-logos`).  
**Next:** Wire **SiteSettings**, **division globals**, **HeroBlock**, and chrome so editors pick assets from **Media** while the repo remains the canonical file store for deploys.

---

## Goals

1. **Division pages (`/212`, `/310`, `/nrc`)** — optional header lockup, footer mark, and favicon override per division global, aligned with files in `apr70-logos/<division>/`.
2. **Site-wide** — corporate favicon + nav logotype (light/dark) from `apr70-apr70pictures/` variants.
3. **Blocks** — Hero (and later slider): optional **lockup** and **watermark** uploads; DivisionBlock / filmstrip chrome can reference division marks.
4. **Admin UX** — When choosing an image, editors see a **curated logo library**, not every production still.

---

## Inventory (vendored paths)

| Division | Public path (examples) |
|----------|-------------------------|
| 212 Pictures | `/brand/apr70-logos/212-pictures/` — `212_hero.svg`, `212_footer.svg`, `212_favicon.svg`, letterhead, cards |
| 310 Pictures | `/brand/apr70-logos/310-pictures/` — `310_hero.svg`, `310_footer.svg`, `310_favicon.svg`, … |
| New Renaissance Cinema | `/brand/apr70-logos/new-renaissance-cinema/` — `nrc_v1.svg` … `nrc_footer.svg`, `nrc_favicon.svg` |
| Corporate / APR 70 Pictures | `/brand/apr70-logos/apr70-apr70pictures/` — `favicons/*`, `letterhead/*`, `business_cards/*` |

Print collateral includes **`.docx`**; those files are vendored for ops continuity. The **live site** should only **link** web formats (SVG, PNG, ICO) from Payload Media or from this tree for hardcoded fallbacks.

---

## Architecture principles (v3)

1. **Single source of truth in the CMS for authored pages:** `upload` fields **`relationTo: 'media'`** on globals and blocks (`CLAUDE.md`). Avoid storing `/brand/...` strings in Payload layout JSON except as **seed defaults** or **migration bridge** until Media rows exist.
2. **Git + NAS:** Files under `web/public/brand/` are part of the Docker **web** image; no separate NAS sync for logos beyond `git pull` + rebuild.
3. **Seeding strategy (recommended):**
   - **Phase A:** Extend seed script to **create or upsert Media** from selected files under `web/public/brand/apr70-logos/` (stable filenames → idempotent lookup by `filename` or `alt` prefix).
   - **Phase B:** Set **SiteSettings** and **division globals** default relations to those Media IDs on first boot; editors replace via Admin.
4. **Admin “logo library”:** Add optional **`mediaKind`** (or `usage`) select on **Media** — values like `logo`, `favicon`, `wordmark`, `division-212`, etc. Use **`filterOptions`** on logo-related uploads so the picker defaults to `mediaKind` in `logo` / division subset.

---

## Schema targets (implementation checklist)

### `SiteSettings` global

- `favicon` — upload → `media` (SVG or PNG; used in `Layout.astro` `<link rel="icon">`).
- `navLogoLight` / `navLogoDark` — optional uploads for magnetic nav / header (or single `navLogo` if one asset works in both themes).
- Optional: `appleTouchIcon`, `ogDefaultImage` (later).

### Division globals (`212`, `310`, `nrc`)

- `headerLogo` — upload (e.g. `*_hero.svg` equivalents).
- `footerLogo` — upload (e.g. `*_footer.svg`).
- `faviconOverride` — optional upload for division-specific routes (inject in layout when `Astro.url` matches `/212`, etc.).

### `HeroBlock` (shared block)

- `lockupLogo` — optional upload, shown per variant rules (split / fullscreen / slider overlay).
- `watermarkLogo` — optional upload + toggles: `watermarkOpacity`, `watermarkPosition`, `watermarkShowOnMobile` (slider + static media).
- `filterOptions` on these fields: restrict to `mediaKind` in `logo` / `watermark`.

### `Media` collection

- `mediaKind` — `select`, optional, for library filtering (not required for every file).
- `divisionTag` — optional `select` (`212` | `310` | `nrc` | `corporate` | `none`) for cross-filtering.

Each change needs a **Payload migration** + **`payload generate:types`** + **`web/src/lib/payload.ts`** type extensions for new global fields.

---

## Astro rendering

| Surface | Behavior |
|---------|----------|
| `Layout.astro` | Read `favicon` from `fetchSiteSettings()`; fallback to existing `/favicon.svg` if unset. |
| `MagneticNavIsland` / header | Prefer `navLogoLight` / `navLogoDark` from settings; fallback text `brandLabel`. |
| Division layout pages | Pass division global logos into layout props or a small context; division routes set `link rel="icon"` when `faviconOverride` present. |
| `HeroBlock.astro` / slider island | If `lockupLogo` / `watermarkLogo` populated, overlay via CSS (`position`, `opacity`; **no `transition: all`**). |

---

## Rollout order (suggested)

1. **Migrations + types** — `Media` optional fields; `SiteSettings` uploads; division globals uploads.
2. **Seed** — Import curated subset from `public/brand/apr70-logos/` into Media; wire defaults on globals.
3. **Layout + nav** — Favicon + optional nav logos.
4. **Division routes** — `/212`, `/310`, `/nrc` use division global logos in template chrome (above `BlockRenderer`).
5. **HeroBlock + slider island** — Lockup + watermark fields and renderers.
6. **`[requires-gui]`** — Marco pass on light/dark and division overrides.

---

## Related files

- Vendored tree: `web/public/brand/apr70-logos/`
- Site chrome: `web/src/layouts/Layout.astro`, `web/src/components/islands/MagneticNavIsland*`
- Globals: `cms/src/globals/SiteSettings.ts`, `cms/src/globals/Division212.ts`, `Division310.ts`, `DivisionNRC.ts`
- Blocks: `cms/src/blocks/HeroBlock.ts`, `web/src/components/blocks/HeroBlock.astro`
- Fetch layer: `web/src/lib/payload.ts`

---

## Out of scope (for now)

- Burning watermarks into raster assets server-side (Sharp) — prefer CSS overlay unless a legal deliverable requires baked pixels.
- Replacing all `brandLabel` text with SVG-only nav without accessibility fallbacks (keep text or `aria-label`).
