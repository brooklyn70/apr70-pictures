# Brand Integration (Payload + Astro) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire brand logos, favicons, and identity assets from CMS into the site chrome, division pages, and HeroBlock overlays so editors control branding from Payload Admin.

**Architecture:** Extend Payload schemas (Media, SiteSettings, division globals, HeroBlock) with upload fields for logos/favicons. Generate migration + types. Wire Astro Layout, division pages, nav, and HeroBlock renderer to read those fields with hardcoded fallbacks. Extend seed script to upsert curated SVGs from `web/public/brand/apr70-logos/` into Media collection and set defaults on globals.

**Tech Stack:** Payload v3 (Postgres), Astro SSR, React (islands), TypeScript, vanilla CSS via tokens.css.

**Spec:** `docs/architecture/brand-assets-integration.md`

**Hard rules (from CLAUDE.md):**
- No `transition: all` — animate only `opacity`, `transform`, explicitly-named properties
- No emoji on rendered site or in commits
- Media relationships via Payload uploads, never loose path strings in layout JSON
- GSAP only for animation
- Mobile-first with `clamp()` for 375px-1440px
- Both dark and light mode from day one
- Run `pnpm preflight` from `cms/` before any NAS deploy

---

## File Map

### Payload CMS (schema changes)

| File | Action | Responsibility |
|------|--------|----------------|
| `cms/src/collections/Media.ts` | Modify | Add `mediaKind` and `divisionTag` optional select fields |
| `cms/src/globals/SiteSettings.ts` | Modify | Add `favicon`, `navLogoLight`, `navLogoDark` upload fields |
| `cms/src/globals/Division212.ts` | Modify | Add `headerLogo`, `footerLogo`, `faviconOverride` upload fields before `layout` |
| `cms/src/globals/Division310.ts` | Modify | Same three upload fields |
| `cms/src/globals/DivisionNRC.ts` | Modify | Same three upload fields |
| `cms/src/blocks/HeroBlock.ts` | Modify | Add `lockupLogo`, `watermarkLogo` uploads + watermark config fields |
| `cms/src/fields/divisionBrandFields.ts` | Create | Shared field array for the three division globals (DRY) |

### Migration + Types

| File | Action | Responsibility |
|------|--------|----------------|
| `cms/src/migrations/YYYYMMDD_HHMMSS_brand_fields.ts` | Auto-generated | Payload migration for schema additions |
| `cms/src/payload-types.ts` | Auto-generated | Regenerated TypeScript types |

### Astro Frontend (wiring)

| File | Action | Responsibility |
|------|--------|----------------|
| `web/src/lib/payload.ts` | Modify | Extend `SiteSettingsData` type with favicon/logo fields; add `DivisionGlobalData` type with brand fields |
| `web/src/layouts/Layout.astro` | Modify | Read favicon from SiteSettings; pass nav logo to MagneticNavIsland |
| `web/src/components/islands/MagneticNavIsland.tsx` | Modify | Accept optional `logoSrc`/`logoAlt` props; render logo when present |
| `web/src/components/islands/magnetic-nav.css` | Modify | Style for nav logo |
| `web/src/pages/212.astro` | Modify | Fetch division brand fields; pass faviconOverride to Layout |
| `web/src/pages/310.astro` | Modify | Same pattern |
| `web/src/pages/nrc.astro` | Modify | Same pattern |
| `web/src/components/blocks/HeroBlock.astro` | Modify | Render lockup/watermark overlays when populated |

### Seed Script

| File | Action | Responsibility |
|------|--------|----------------|
| `cms/scripts/migrate-v2/apply-brand.ts` | Create | Upload curated SVGs to Media; set defaults on SiteSettings + division globals |
| `cms/scripts/migrate-v2/apply.ts` | Modify | Import and call brand seeder at end of `runApply()` |

---

## Task 1: Media Collection — Add `mediaKind` and `divisionTag` fields

**Files:**
- Modify: `cms/src/collections/Media.ts`

- [ ] **Step 1: Add the two optional select fields to Media.ts**

Replace the entire file content:

```typescript
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'mediaKind',
      type: 'select',
      label: 'Media Kind',
      admin: {
        description: 'Optional tag for filtering in upload pickers (e.g. logo library).',
        position: 'sidebar',
      },
      options: [
        { label: 'Logo', value: 'logo' },
        { label: 'Favicon', value: 'favicon' },
        { label: 'Wordmark', value: 'wordmark' },
        { label: 'Watermark', value: 'watermark' },
        { label: 'Photo', value: 'photo' },
      ],
    },
    {
      name: 'divisionTag',
      type: 'select',
      label: 'Division',
      admin: {
        description: 'Optional division association for cross-filtering.',
        position: 'sidebar',
      },
      options: [
        { label: '212 Pictures', value: '212' },
        { label: '310 Pictures', value: '310' },
        { label: 'New Renaissance Cinema', value: 'nrc' },
        { label: 'Corporate', value: 'corporate' },
      ],
    },
  ],
  upload: true,
}
```

- [ ] **Step 2: Verify CMS builds cleanly**

Run: `cd cms && pnpm preflight`
Expected: Build succeeds with exit 0. The two new optional fields don't break existing data.

- [ ] **Step 3: Commit**

```bash
git add cms/src/collections/Media.ts
git commit -m "feat(cms): add mediaKind and divisionTag fields to Media collection"
```

---

## Task 2: Shared Division Brand Fields

**Files:**
- Create: `cms/src/fields/divisionBrandFields.ts`

- [ ] **Step 1: Create the shared field array**

```typescript
import type { Field } from 'payload'

export const divisionBrandFields: Field[] = [
  {
    type: 'collapsible',
    label: 'Division Branding',
    admin: {
      description: 'Logo and favicon overrides for this division. Picked from Media uploads.',
      initCollapsed: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'headerLogo',
            type: 'upload',
            relationTo: 'media',
            label: 'Header Logo',
            admin: {
              description: 'Lockup or wordmark shown in the header on this division\'s pages.',
              width: '50%',
            },
            filterOptions: {
              mediaKind: { in: ['logo', 'wordmark'] },
            },
          },
          {
            name: 'footerLogo',
            type: 'upload',
            relationTo: 'media',
            label: 'Footer Logo',
            admin: {
              description: 'Mark or wordmark shown in the footer on this division\'s pages.',
              width: '50%',
            },
            filterOptions: {
              mediaKind: { in: ['logo', 'wordmark'] },
            },
          },
        ],
      },
      {
        name: 'faviconOverride',
        type: 'upload',
        relationTo: 'media',
        label: 'Favicon Override',
        admin: {
          description: 'Division-specific favicon. Falls back to site-wide favicon if unset.',
        },
        filterOptions: {
          mediaKind: { in: ['favicon'] },
        },
      },
    ],
  },
]
```

- [ ] **Step 2: Commit**

```bash
git add cms/src/fields/divisionBrandFields.ts
git commit -m "feat(cms): create shared divisionBrandFields for division globals"
```

---

## Task 3: SiteSettings — Add Favicon and Nav Logo Fields

**Files:**
- Modify: `cms/src/globals/SiteSettings.ts`

- [ ] **Step 1: Add brand identity fields after the tagline field (line 59)**

Insert a new collapsible section between the `tagline` field and the `showFilmstripRails` checkbox. The new section goes after line 59 (closing brace of the tagline field):

```typescript
    // ── Brand Identity (logos & favicon) ─────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Brand Identity',
      admin: {
        description: 'Site-wide favicon and navigation logos. Upload SVG or PNG to Media first.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'favicon',
          type: 'upload',
          relationTo: 'media',
          label: 'Favicon',
          admin: {
            description: 'SVG or PNG favicon. Falls back to /favicon.svg if unset.',
          },
          filterOptions: {
            mediaKind: { in: ['favicon'] },
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'navLogoLight',
              type: 'upload',
              relationTo: 'media',
              label: 'Nav Logo (Light theme)',
              admin: {
                description: 'Logotype or mark for the header on light backgrounds.',
                width: '50%',
              },
              filterOptions: {
                mediaKind: { in: ['logo', 'wordmark'] },
              },
            },
            {
              name: 'navLogoDark',
              type: 'upload',
              relationTo: 'media',
              label: 'Nav Logo (Dark theme)',
              admin: {
                description: 'Logotype or mark for the header on dark backgrounds.',
                width: '50%',
              },
              filterOptions: {
                mediaKind: { in: ['logo', 'wordmark'] },
              },
            },
          ],
        },
      ],
    },
```

- [ ] **Step 2: Verify CMS builds cleanly**

Run: `cd cms && pnpm preflight`
Expected: Exit 0.

- [ ] **Step 3: Commit**

```bash
git add cms/src/globals/SiteSettings.ts
git commit -m "feat(cms): add favicon and nav logo fields to SiteSettings"
```

---

## Task 4: Division Globals — Add Brand Fields

**Files:**
- Modify: `cms/src/globals/Division212.ts`
- Modify: `cms/src/globals/Division310.ts`
- Modify: `cms/src/globals/DivisionNRC.ts`

- [ ] **Step 1: Update Division212.ts**

Add the import and insert `divisionBrandFields` before the layout field:

```typescript
import type { GlobalConfig } from 'payload'

import { HeroBlock } from '../blocks/HeroBlock'
import { RichTextBlock } from '../blocks/RichTextBlock'
import { TwoColBlock } from '../blocks/TwoColBlock'
import { GridBlock } from '../blocks/GridBlock'
import { CTABlock } from '../blocks/CTABlock'
import { QuotesBlock } from '../blocks/QuotesBlock'
import { FilmstripBlock } from '../blocks/FilmstripBlock'
import { DivisionBlock } from '../blocks/DivisionBlock'
import { StatsBlock } from '../blocks/StatsBlock'
import { DividerBlock } from '../blocks/DividerBlock'
import { divisionBrandFields } from '../fields/divisionBrandFields'

export const Division212: GlobalConfig = {
  slug: '212',
  label: '212 Division',
  access: { read: () => true },
  fields: [
    ...divisionBrandFields,
    {
      name: 'layout',
      type: 'blocks',
      blocks: [HeroBlock, RichTextBlock, TwoColBlock, GridBlock, CTABlock, QuotesBlock, FilmstripBlock, DivisionBlock, StatsBlock, DividerBlock],
      labels: { singular: 'Block', plural: 'Layout blocks' },
    },
  ],
}
```

- [ ] **Step 2: Update Division310.ts**

Same pattern — add the import and spread `divisionBrandFields` before layout:

```typescript
import type { GlobalConfig } from 'payload'

import { HeroBlock } from '../blocks/HeroBlock'
import { RichTextBlock } from '../blocks/RichTextBlock'
import { TwoColBlock } from '../blocks/TwoColBlock'
import { GridBlock } from '../blocks/GridBlock'
import { CTABlock } from '../blocks/CTABlock'
import { QuotesBlock } from '../blocks/QuotesBlock'
import { FilmstripBlock } from '../blocks/FilmstripBlock'
import { DivisionBlock } from '../blocks/DivisionBlock'
import { StatsBlock } from '../blocks/StatsBlock'
import { DividerBlock } from '../blocks/DividerBlock'
import { divisionBrandFields } from '../fields/divisionBrandFields'

export const Division310: GlobalConfig = {
  slug: '310',
  label: '310 Division',
  access: { read: () => true },
  fields: [
    ...divisionBrandFields,
    {
      name: 'layout',
      type: 'blocks',
      blocks: [HeroBlock, RichTextBlock, TwoColBlock, GridBlock, CTABlock, QuotesBlock, FilmstripBlock, DivisionBlock, StatsBlock, DividerBlock],
      labels: { singular: 'Block', plural: 'Layout blocks' },
    },
  ],
}
```

- [ ] **Step 3: Update DivisionNRC.ts**

Same pattern:

```typescript
import type { GlobalConfig } from 'payload'

import { HeroBlock } from '../blocks/HeroBlock'
import { RichTextBlock } from '../blocks/RichTextBlock'
import { TwoColBlock } from '../blocks/TwoColBlock'
import { GridBlock } from '../blocks/GridBlock'
import { CTABlock } from '../blocks/CTABlock'
import { QuotesBlock } from '../blocks/QuotesBlock'
import { FilmstripBlock } from '../blocks/FilmstripBlock'
import { DivisionBlock } from '../blocks/DivisionBlock'
import { StatsBlock } from '../blocks/StatsBlock'
import { DividerBlock } from '../blocks/DividerBlock'
import { divisionBrandFields } from '../fields/divisionBrandFields'

export const DivisionNRC: GlobalConfig = {
  slug: 'nrc',
  label: 'NRC Division',
  access: { read: () => true },
  fields: [
    ...divisionBrandFields,
    {
      name: 'layout',
      type: 'blocks',
      blocks: [HeroBlock, RichTextBlock, TwoColBlock, GridBlock, CTABlock, QuotesBlock, FilmstripBlock, DivisionBlock, StatsBlock, DividerBlock],
      labels: { singular: 'Block', plural: 'Layout blocks' },
    },
  ],
}
```

- [ ] **Step 4: Verify CMS builds cleanly**

Run: `cd cms && pnpm preflight`
Expected: Exit 0.

- [ ] **Step 5: Commit**

```bash
git add cms/src/globals/Division212.ts cms/src/globals/Division310.ts cms/src/globals/DivisionNRC.ts
git commit -m "feat(cms): add brand fields (headerLogo, footerLogo, faviconOverride) to division globals"
```

---

## Task 5: HeroBlock — Add Lockup and Watermark Fields

**Files:**
- Modify: `cms/src/blocks/HeroBlock.ts`

- [ ] **Step 1: Add lockup and watermark fields after the `division` field (line 62)**

Insert these fields between the `division` select (ends at line 62) and the `fadeDuration` field (line 64):

```typescript
    {
      name: 'lockupLogo',
      type: 'upload',
      relationTo: 'media',
      label: 'Lockup Logo',
      admin: {
        description: 'Optional division lockup overlaid on the hero (split/fullscreen/slider).',
      },
      filterOptions: {
        mediaKind: { in: ['logo', 'wordmark'] },
      },
    },
    {
      name: 'watermarkLogo',
      type: 'upload',
      relationTo: 'media',
      label: 'Watermark Logo',
      admin: {
        description: 'Optional watermark overlay on the hero media.',
      },
      filterOptions: {
        mediaKind: { in: ['watermark', 'logo'] },
      },
    },
    {
      name: 'watermarkOpacity',
      type: 'number',
      label: 'Watermark Opacity',
      defaultValue: 0.15,
      min: 0,
      max: 1,
      admin: {
        description: 'Opacity of the watermark overlay (0 = invisible, 1 = fully opaque).',
        step: 0.05,
        condition: (_, siblingData) => Boolean(siblingData?.watermarkLogo),
      },
    },
    {
      name: 'watermarkPosition',
      type: 'select',
      label: 'Watermark Position',
      defaultValue: 'bottom-right',
      options: [
        { label: 'Bottom Right', value: 'bottom-right' },
        { label: 'Bottom Left', value: 'bottom-left' },
        { label: 'Center', value: 'center' },
        { label: 'Top Right', value: 'top-right' },
      ],
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.watermarkLogo),
      },
    },
    {
      name: 'watermarkShowOnMobile',
      type: 'checkbox',
      label: 'Show Watermark on Mobile',
      defaultValue: false,
      admin: {
        description: 'Watermarks can be distracting on small screens. Off by default.',
        condition: (_, siblingData) => Boolean(siblingData?.watermarkLogo),
      },
    },
```

- [ ] **Step 2: Verify CMS builds cleanly**

Run: `cd cms && pnpm preflight`
Expected: Exit 0.

- [ ] **Step 3: Commit**

```bash
git add cms/src/blocks/HeroBlock.ts
git commit -m "feat(cms): add lockupLogo and watermark fields to HeroBlock"
```

---

## Task 6: Generate Payload Migration and Types

**Files:**
- Auto-generated: `cms/src/migrations/` (new migration file)
- Auto-generated: `cms/src/payload-types.ts`

- [ ] **Step 1: Generate the migration**

Run: `cd cms && pnpm payload migrate:create brand_fields`
Expected: Creates a new migration file in `cms/src/migrations/`.

- [ ] **Step 2: Generate types**

Run: `cd cms && pnpm generate:types`
Expected: Updates `cms/src/payload-types.ts` with new fields on Media, SiteSettings, division globals, and HeroBlock.

- [ ] **Step 3: Verify CMS still builds**

Run: `cd cms && pnpm preflight`
Expected: Exit 0.

- [ ] **Step 4: Commit**

```bash
git add cms/src/migrations/ cms/src/payload-types.ts
git commit -m "chore(cms): generate migration and types for brand fields"
```

---

## Task 7: Astro — Extend Payload Types and Fetch Layer

**Files:**
- Modify: `web/src/lib/payload.ts`

- [ ] **Step 1: Extend `SiteSettingsData` type (line 31-38)**

Replace the existing `SiteSettingsData` type:

```typescript
export type SiteSettingsData = {
  brandLabel?: string | null
  legalEntity?: string | null
  tagline?: string | null
  showFilmstripRails?: boolean | null
  lastDeployed?: string | null
  seededVersion?: string | null
  favicon?: Media | number | null
  navLogoLight?: Media | number | null
  navLogoDark?: Media | number | null
}
```

- [ ] **Step 2: Add `DivisionGlobalData` type after `SiteSettingsData`**

```typescript
export type DivisionGlobalData = {
  id?: number
  headerLogo?: Media | number | null
  footerLogo?: Media | number | null
  faviconOverride?: Media | number | null
  layout?: unknown[] | null
  updatedAt?: string | null
  createdAt?: string | null
}
```

- [ ] **Step 3: Update the three division fetchers to use `DivisionGlobalData` instead of `PageGlobalData`**

Replace the three division fetcher return types (lines 378-403):

```typescript
export async function fetchDivision212Global(): Promise<{
  division212: DivisionGlobalData | null
  error: string | null
  stale?: boolean
}> {
  const { data, error, stale } = await fetchGlobal<DivisionGlobalData>('212', 2)
  return { division212: data, error, stale }
}

export async function fetchDivision310Global(): Promise<{
  division310: DivisionGlobalData | null
  error: string | null
  stale?: boolean
}> {
  const { data, error, stale } = await fetchGlobal<DivisionGlobalData>('310', 2)
  return { division310: data, error, stale }
}

export async function fetchDivisionNRCGlobal(): Promise<{
  divisionNRC: DivisionGlobalData | null
  error: string | null
  stale?: boolean
}> {
  const { data, error, stale } = await fetchGlobal<DivisionGlobalData>('nrc', 2)
  return { divisionNRC: data, error, stale }
}
```

Note: `depth=2` is needed so Payload populates the Media relation objects (not just IDs).

- [ ] **Step 4: Update `fetchSiteSettings` to use `depth=2`**

Change line 320 from:
```typescript
  const { data, error, stale } = await fetchGlobal<SiteSettingsData>('site-settings')
```
to:
```typescript
  const { data, error, stale } = await fetchGlobal<SiteSettingsData>('site-settings', 2)
```

- [ ] **Step 5: Verify web builds cleanly**

Run: `cd web && pnpm run build`
Expected: Exit 0.

- [ ] **Step 6: Commit**

```bash
git add web/src/lib/payload.ts
git commit -m "feat(web): extend payload types and fetchers for brand fields"
```

---

## Task 8: Layout.astro — Dynamic Favicon and Nav Logo

**Files:**
- Modify: `web/src/layouts/Layout.astro`

- [ ] **Step 1: Add favicon resolution and Layout props for favicon override**

Update the frontmatter to resolve favicon URL and accept an optional faviconOverride prop:

```astro
---
import '../styles/global.css'
import Footer from '../components/Footer.astro'
import MagneticNavIsland from '../components/islands/MagneticNavIsland'
import { fetchSiteSettings, fetchFooterLinks, resolveMediaUrl } from '../lib/payload'
import type { FooterLink } from '../lib/payload'

interface Props {
  title?: string
  description?: string
  faviconOverride?: unknown
}

const [{ settings }, { footerLinks }] = await Promise.all([
  fetchSiteSettings(),
  fetchFooterLinks(),
])

const siteName    = settings?.brandLabel ?? 'APR 70 Pictures'
const { title = siteName, description = settings?.tagline ?? '' } = Astro.props
const pageTitle   = title === siteName ? siteName : `${title} — ${siteName}`
const showRails   = settings?.showFilmstripRails !== false

const primaryFromPayload = (footerLinks?.primaryNav ?? []).filter(
  (l): l is FooterLink => Boolean(l?.href && l?.label),
)
const primaryNav: FooterLink[] =
  primaryFromPayload.length > 0
    ? primaryFromPayload
    : [
        { label: 'Work', href: '/work' },
        { label: 'About', href: '/about' },
        { label: 'Investors', href: '/investors' },
        { label: 'Contact', href: '/contact' },
      ]

const faviconMedia = Astro.props.faviconOverride ?? settings?.favicon
const faviconSrc = resolveMediaUrl(
  typeof faviconMedia === 'object' && faviconMedia ? faviconMedia as any : undefined,
)

const navLogoLightMedia = settings?.navLogoLight
const navLogoDarkMedia = settings?.navLogoDark
const navLogoLightSrc = resolveMediaUrl(
  typeof navLogoLightMedia === 'object' && navLogoLightMedia ? navLogoLightMedia as any : undefined,
)
const navLogoDarkSrc = resolveMediaUrl(
  typeof navLogoDarkMedia === 'object' && navLogoDarkMedia ? navLogoDarkMedia as any : undefined,
)
const navLogoAlt = siteName
---
```

- [ ] **Step 2: Update the `<head>` favicon links**

Replace lines 44-45:

```html
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" href="/favicon.ico" />
```

with:

```html
    {faviconSrc ? (
      <link rel="icon" type="image/svg+xml" href={faviconSrc} />
    ) : (
      <Fragment>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" href="/favicon.ico" />
      </Fragment>
    )}
```

- [ ] **Step 3: Pass logo props to MagneticNavIsland**

Replace line 65:

```astro
          <MagneticNavIsland client:idle items={primaryNav} />
```

with:

```astro
          <MagneticNavIsland
            client:idle
            items={primaryNav}
            logoSrc={navLogoLightSrc}
            logoAlt={navLogoAlt}
          />
```

- [ ] **Step 4: Verify web builds cleanly**

Run: `cd web && pnpm run build`
Expected: Exit 0. (MagneticNavIsland won't use the new props until Task 9, but unknown props are harmless in React.)

- [ ] **Step 5: Commit**

```bash
git add web/src/layouts/Layout.astro
git commit -m "feat(web): wire dynamic favicon and nav logo from SiteSettings"
```

---

## Task 9: MagneticNavIsland — Accept Logo Props

**Files:**
- Modify: `web/src/components/islands/MagneticNavIsland.tsx`
- Modify: `web/src/components/islands/magnetic-nav.css`

- [ ] **Step 1: Update the component props and render logo**

Add `logoSrc` and `logoAlt` to the props of `MagneticNavIsland` and `StaticNav`. At the top of MagneticNavIsland.tsx, update the main component signature and both render paths.

Update the `StaticNav` component (line 44):

```typescript
function StaticNav({ items, logoSrc, logoAlt }: { items: MagneticNavItem[]; logoSrc?: string; logoAlt?: string }) {
  return (
    <nav className="magnetic-nav magnetic-nav--static" aria-label="Primary">
      <ul className="magnetic-nav__list">
        {logoSrc && (
          <li className="magnetic-nav__item magnetic-nav__logo-item">
            <a className="magnetic-nav__link" href="/">
              <img className="magnetic-nav__logo" src={logoSrc} alt={logoAlt ?? 'Home'} />
            </a>
          </li>
        )}
        {items.map((item) => (
          <li key={`${item.href}-${item.label}`} className="magnetic-nav__item">
            <a
              className="magnetic-nav__link"
              href={item.href}
              {...(item.openInNewTab
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

Update the main export signature (line 66):

```typescript
export default function MagneticNavIsland({ items, logoSrc, logoAlt }: { items: MagneticNavItem[]; logoSrc?: string; logoAlt?: string }) {
```

In the `mode === 'simple'` return (line 143-145), pass logo props:

```typescript
  if (mode === 'simple') {
    return <StaticNav items={items} logoSrc={logoSrc} logoAlt={logoAlt} />
  }
```

In the animated return (line 147 onwards), add the logo `<li>` before the items map, inside the `<ul>`:

```typescript
      <ul className="magnetic-nav__list">
        {logoSrc && (
          <li className="magnetic-nav__logo-item">
            <a className="magnetic-nav__link" href="/">
              <img className="magnetic-nav__logo" src={logoSrc} alt={logoAlt ?? 'Home'} />
            </a>
          </li>
        )}
        {items.map((item) => (
```

- [ ] **Step 2: Add logo styles to magnetic-nav.css**

Append to the end of `magnetic-nav.css`:

```css
.magnetic-nav__logo {
  height: 1.5rem;
  width: auto;
  display: block;
}

.magnetic-nav__logo-item {
  margin-inline-end: var(--s-2, 0.5rem);
}
```

- [ ] **Step 3: Verify web builds cleanly**

Run: `cd web && pnpm run build`
Expected: Exit 0.

- [ ] **Step 4: Commit**

```bash
git add web/src/components/islands/MagneticNavIsland.tsx web/src/components/islands/magnetic-nav.css
git commit -m "feat(web): MagneticNavIsland accepts optional logo props"
```

---

## Task 10: Division Pages — Wire Brand Fields

**Files:**
- Modify: `web/src/pages/212.astro`
- Modify: `web/src/pages/310.astro`
- Modify: `web/src/pages/nrc.astro`

- [ ] **Step 1: Update 212.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
import BlockRenderer from '../components/blocks/BlockRenderer.astro';
import { fetchDivision212Global } from '../lib/payload';

const { division212, error } = await fetchDivision212Global();
const blocks = division212?.layout || [];
const faviconOverride = typeof division212?.faviconOverride === 'object' ? division212.faviconOverride : undefined;
---

<Layout title="212 Division" faviconOverride={faviconOverride}>
  <main>
    {error && (
      <div style="padding: 1rem; margin: 2rem auto; max-width: 600px; background: rgba(255,0,0,0.1); border: 1px solid red; border-radius: 4px; font-family: var(--font-body); color: #cc0000;">
        <strong>Fetch Error:</strong> {error}
      </div>
    )}
    {!blocks.length && !error ? (
      <div style="padding: 4rem; text-align: center; font-family: var(--font-body); color: var(--apr-mid-dark);">
        No blocks found. Add some blocks to the 212 Division global in Payload!
      </div>
    ) : (
      <BlockRenderer blocks={blocks} />
    )}
  </main>
</Layout>
```

- [ ] **Step 2: Update 310.astro**

Same pattern with `fetchDivision310Global`:

```astro
---
import Layout from '../layouts/Layout.astro';
import BlockRenderer from '../components/blocks/BlockRenderer.astro';
import { fetchDivision310Global } from '../lib/payload';

const { division310, error } = await fetchDivision310Global();
const blocks = division310?.layout || [];
const faviconOverride = typeof division310?.faviconOverride === 'object' ? division310.faviconOverride : undefined;
---

<Layout title="310 Division" faviconOverride={faviconOverride}>
  <main>
    {error && (
      <div style="padding: 1rem; margin: 2rem auto; max-width: 600px; background: rgba(255,0,0,0.1); border: 1px solid red; border-radius: 4px; font-family: var(--font-body); color: #cc0000;">
        <strong>Fetch Error:</strong> {error}
      </div>
    )}
    {!blocks.length && !error ? (
      <div style="padding: 4rem; text-align: center; font-family: var(--font-body); color: var(--apr-mid-dark);">
        No blocks found. Add some blocks to the 310 Division global in Payload!
      </div>
    ) : (
      <BlockRenderer blocks={blocks} />
    )}
  </main>
</Layout>
```

- [ ] **Step 3: Update nrc.astro**

Same pattern with `fetchDivisionNRCGlobal`:

```astro
---
import Layout from '../layouts/Layout.astro';
import BlockRenderer from '../components/blocks/BlockRenderer.astro';
import { fetchDivisionNRCGlobal } from '../lib/payload';

const { divisionNRC, error } = await fetchDivisionNRCGlobal();
const blocks = divisionNRC?.layout || [];
const faviconOverride = typeof divisionNRC?.faviconOverride === 'object' ? divisionNRC.faviconOverride : undefined;
---

<Layout title="NRC Division" faviconOverride={faviconOverride}>
  <main>
    {error && (
      <div style="padding: 1rem; margin: 2rem auto; max-width: 600px; background: rgba(255,0,0,0.1); border: 1px solid red; border-radius: 4px; font-family: var(--font-body); color: #cc0000;">
        <strong>Fetch Error:</strong> {error}
      </div>
    )}
    {!blocks.length && !error ? (
      <div style="padding: 4rem; text-align: center; font-family: var(--font-body); color: var(--apr-mid-dark);">
        No blocks found. Add some blocks to the NRC Division global in Payload!
      </div>
    ) : (
      <BlockRenderer blocks={blocks} />
    )}
  </main>
</Layout>
```

- [ ] **Step 4: Verify web builds cleanly**

Run: `cd web && pnpm run build`
Expected: Exit 0.

- [ ] **Step 5: Commit**

```bash
git add web/src/pages/212.astro web/src/pages/310.astro web/src/pages/nrc.astro
git commit -m "feat(web): wire division brand fields (faviconOverride) into division pages"
```

---

## Task 11: HeroBlock.astro — Render Lockup and Watermark Overlays

**Files:**
- Modify: `web/src/components/blocks/HeroBlock.astro`

- [ ] **Step 1: Add lockup and watermark resolution to frontmatter**

After the `isVideo` const (line 20), add:

```typescript
const lockupMedia = typeof block.lockupLogo === 'object' && block.lockupLogo ? block.lockupLogo : null
const lockupSrc = resolveMediaUrl(lockupMedia ?? undefined)

const watermarkMedia = typeof block.watermarkLogo === 'object' && block.watermarkLogo ? block.watermarkLogo : null
const watermarkSrc = resolveMediaUrl(watermarkMedia ?? undefined)
const watermarkOpacity = (block as any).watermarkOpacity ?? 0.15
const watermarkPosition = (block as any).watermarkPosition ?? 'bottom-right'
const watermarkShowOnMobile = (block as any).watermarkShowOnMobile ?? false
```

- [ ] **Step 2: Add lockup overlay to the non-slider template**

Inside the `hero__inner` div (after the `hero__copy` div, before the media div — around line 86), add the lockup:

```astro
      {lockupSrc && (
        <div class="hero__lockup">
          <img src={lockupSrc} alt={lockupMedia?.alt ?? ''} class="hero__lockup-img" />
        </div>
      )}
```

- [ ] **Step 3: Add watermark overlay inside `hero__media`**

Inside the `hero__media` div, after the `<img>` or `<video>` tag (around line 100), add:

```astro
            {watermarkSrc && (
              <img
                class:list={[
                  'hero__watermark',
                  `hero__watermark--${watermarkPosition}`,
                  { 'hero__watermark--hide-mobile': !watermarkShowOnMobile },
                ]}
                src={watermarkSrc}
                alt=""
                aria-hidden="true"
                style={`opacity: ${watermarkOpacity};`}
              />
            )}
```

- [ ] **Step 4: Add CSS for lockup and watermark**

Append to the `<style>` block at the end of HeroBlock.astro:

```css
  .hero__lockup {
    margin-bottom: var(--s-4);
  }

  .hero__lockup-img {
    height: clamp(2rem, 4vw, 3.5rem);
    width: auto;
    display: block;
  }

  .hero__media {
    position: relative;
  }

  .hero__watermark {
    position: absolute;
    pointer-events: none;
    max-width: 15%;
    height: auto;
  }

  .hero__watermark--bottom-right {
    bottom: var(--s-3);
    right: var(--s-3);
  }

  .hero__watermark--bottom-left {
    bottom: var(--s-3);
    left: var(--s-3);
  }

  .hero__watermark--center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 30%;
  }

  .hero__watermark--top-right {
    top: var(--s-3);
    right: var(--s-3);
  }

  .hero__watermark--hide-mobile {
    display: none;
  }

  @media (min-width: 768px) {
    .hero__watermark--hide-mobile {
      display: block;
    }
  }
```

- [ ] **Step 5: Verify web builds cleanly**

Run: `cd web && pnpm run build`
Expected: Exit 0.

- [ ] **Step 6: Commit**

```bash
git add web/src/components/blocks/HeroBlock.astro
git commit -m "feat(web): render lockup and watermark overlays on HeroBlock"
```

---

## Task 12: Brand Seed Script — Upload SVGs and Set Defaults

**Files:**
- Create: `cms/scripts/migrate-v2/apply-brand.ts`
- Modify: `cms/scripts/migrate-v2/apply.ts`

- [ ] **Step 1: Create apply-brand.ts**

```typescript
/**
 * Brand asset seeder — uploads curated SVGs from web/public/brand/apr70-logos/
 * to the Media collection and sets default logo/favicon relations on
 * SiteSettings and division globals.
 *
 * Idempotent: looks up Media by filename before creating.
 *
 * Prerequisites: same env as apply.ts (CMS_URL, PAYLOAD_SEED_EMAIL, PAYLOAD_SEED_PASSWORD).
 */

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { CMS_URL } from './payload-rest.js'

type MediaKind = 'logo' | 'favicon' | 'wordmark' | 'watermark' | 'photo'
type DivisionTag = '212' | '310' | 'nrc' | 'corporate'

type BrandAsset = {
  relativePath: string
  alt: string
  mediaKind: MediaKind
  divisionTag: DivisionTag
}

const BRAND_ROOT = path.resolve(__dirname, '../../../web/public/brand/apr70-logos')

const CURATED_ASSETS: BrandAsset[] = [
  // 212 Pictures
  { relativePath: '212-pictures/212_hero.svg', alt: '212 Pictures hero lockup', mediaKind: 'logo', divisionTag: '212' },
  { relativePath: '212-pictures/212_footer.svg', alt: '212 Pictures footer mark', mediaKind: 'logo', divisionTag: '212' },
  { relativePath: '212-pictures/212_favicon.svg', alt: '212 Pictures favicon', mediaKind: 'favicon', divisionTag: '212' },
  // 310 Pictures
  { relativePath: '310-pictures/310_hero.svg', alt: '310 Pictures hero lockup', mediaKind: 'logo', divisionTag: '310' },
  { relativePath: '310-pictures/310_footer.svg', alt: '310 Pictures footer mark', mediaKind: 'logo', divisionTag: '310' },
  { relativePath: '310-pictures/310_favicon.svg', alt: '310 Pictures favicon', mediaKind: 'favicon', divisionTag: '310' },
  // NRC
  { relativePath: 'new-renaissance-cinema/nrc_v1.svg', alt: 'New Renaissance Cinema hero lockup', mediaKind: 'logo', divisionTag: 'nrc' },
  { relativePath: 'new-renaissance-cinema/nrc_footer.svg', alt: 'New Renaissance Cinema footer mark', mediaKind: 'logo', divisionTag: 'nrc' },
  { relativePath: 'new-renaissance-cinema/nrc_favicon.svg', alt: 'New Renaissance Cinema favicon', mediaKind: 'favicon', divisionTag: 'nrc' },
  // Corporate
  { relativePath: 'apr70-apr70pictures/favicons/apr70_favicon_amber_bg_black_text_bold.svg', alt: 'APR 70 Pictures favicon', mediaKind: 'favicon', divisionTag: 'corporate' },
]

async function findMediaByFilename(filename: string, token: string): Promise<number | null> {
  const res = await fetch(
    `${CMS_URL}/api/media?where[filename][equals]=${encodeURIComponent(filename)}&depth=0&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  if (!res.ok) return null
  const data = (await res.json()) as { docs?: Array<{ id: number }> }
  return data.docs?.[0]?.id ?? null
}

async function uploadMedia(
  asset: BrandAsset,
  token: string,
): Promise<number> {
  const absPath = path.join(BRAND_ROOT, asset.relativePath)
  const fileBuffer = await readFile(absPath)
  const filename = path.basename(asset.relativePath)

  const formData = new FormData()
  formData.append('file', new Blob([fileBuffer], { type: 'image/svg+xml' }), filename)
  formData.append('alt', asset.alt)
  formData.append('mediaKind', asset.mediaKind)
  formData.append('divisionTag', asset.divisionTag)

  const res = await fetch(`${CMS_URL}/api/media`, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}` },
    body: formData,
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Upload failed for ${filename}: ${res.status} ${body}`)
  }
  const doc = (await res.json()) as { doc?: { id: number } }
  const id = doc.doc?.id
  if (!id) throw new Error(`Upload returned no ID for ${filename}`)
  return id
}

async function updateGlobal(slug: string, data: Record<string, unknown>, token: string): Promise<void> {
  const res = await fetch(`${CMS_URL}/api/globals/${slug}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`updateGlobal(${slug}) failed: ${res.status} ${body}`)
  }
}

export type BrandSeedReport = {
  mediaUploaded: number
  mediaSkipped: number
  globalsUpdated: string[]
  errors: string[]
}

export async function runBrandSeed(token: string): Promise<BrandSeedReport> {
  const report: BrandSeedReport = {
    mediaUploaded: 0,
    mediaSkipped: 0,
    globalsUpdated: [],
    errors: [],
  }

  const idMap = new Map<string, number>()

  for (const asset of CURATED_ASSETS) {
    const filename = path.basename(asset.relativePath)
    try {
      const existingId = await findMediaByFilename(filename, token)
      if (existingId) {
        idMap.set(asset.relativePath, existingId)
        report.mediaSkipped++
      } else {
        const newId = await uploadMedia(asset, token)
        idMap.set(asset.relativePath, newId)
        report.mediaUploaded++
      }
    } catch (e) {
      report.errors.push(`${filename}: ${String(e)}`)
    }
  }

  const get = (rel: string) => idMap.get(rel) ?? null

  // SiteSettings — corporate favicon
  const corpFavId = get('apr70-apr70pictures/favicons/apr70_favicon_amber_bg_black_text_bold.svg')
  if (corpFavId) {
    try {
      await updateGlobal('site-settings', { favicon: corpFavId }, token)
      report.globalsUpdated.push('site-settings')
    } catch (e) {
      report.errors.push(`site-settings: ${String(e)}`)
    }
  }

  // Division 212
  const d212 = {
    headerLogo: get('212-pictures/212_hero.svg'),
    footerLogo: get('212-pictures/212_footer.svg'),
    faviconOverride: get('212-pictures/212_favicon.svg'),
  }
  if (Object.values(d212).some(Boolean)) {
    try {
      await updateGlobal('212', d212, token)
      report.globalsUpdated.push('212')
    } catch (e) {
      report.errors.push(`212: ${String(e)}`)
    }
  }

  // Division 310
  const d310 = {
    headerLogo: get('310-pictures/310_hero.svg'),
    footerLogo: get('310-pictures/310_footer.svg'),
    faviconOverride: get('310-pictures/310_favicon.svg'),
  }
  if (Object.values(d310).some(Boolean)) {
    try {
      await updateGlobal('310', d310, token)
      report.globalsUpdated.push('310')
    } catch (e) {
      report.errors.push(`310: ${String(e)}`)
    }
  }

  // Division NRC
  const dNrc = {
    headerLogo: get('new-renaissance-cinema/nrc_v1.svg'),
    footerLogo: get('new-renaissance-cinema/nrc_footer.svg'),
    faviconOverride: get('new-renaissance-cinema/nrc_favicon.svg'),
  }
  if (Object.values(dNrc).some(Boolean)) {
    try {
      await updateGlobal('nrc', dNrc, token)
      report.globalsUpdated.push('nrc')
    } catch (e) {
      report.errors.push(`nrc: ${String(e)}`)
    }
  }

  return report
}
```

- [ ] **Step 2: Wire into apply.ts**

At the end of the `runApply()` function (before the final `return report`), add the brand seed call. First add the import at the top of apply.ts:

```typescript
import { runBrandSeed } from './apply-brand.js'
```

Then before the return statement in `runApply()`, add:

```typescript
  // ── Brand asset seeding ────────────────────────────────────────────────────
  try {
    const brandReport = await runBrandSeed(token)
    if (brandReport.errors.length > 0) {
      warnings.push(...brandReport.errors.map(e => `[brand] ${e}`))
    }
    console.log(`Brand seed: ${brandReport.mediaUploaded} uploaded, ${brandReport.mediaSkipped} skipped, ${brandReport.globalsUpdated.length} globals updated`)
  } catch (e) {
    warnings.push(`[brand] Brand seed failed: ${String(e)}`)
  }
```

- [ ] **Step 3: Verify CMS builds cleanly**

Run: `cd cms && pnpm preflight`
Expected: Exit 0.

- [ ] **Step 4: Commit**

```bash
git add cms/scripts/migrate-v2/apply-brand.ts cms/scripts/migrate-v2/apply.ts
git commit -m "feat(cms): brand asset seeder — upload curated SVGs and set defaults on globals"
```

---

## Task 13: Full Build Verification

- [ ] **Step 1: Run CMS preflight**

Run: `cd cms && pnpm preflight`
Expected: Exit 0.

- [ ] **Step 2: Run web build**

Run: `cd web && pnpm run build`
Expected: Exit 0.

- [ ] **Step 3: Update TASKS.md — mark the brand integration line as done**

In `TASKS.md`, change line 60 from:
```
- [ ] [p5] [cursor+claude] Payload + Astro brand integration — ...
```
to:
```
- [x] [p5] [cursor+claude] Payload + Astro brand integration — ...
```

- [ ] **Step 4: Update BRIEF.md — note brand integration shipped**

Add to the "What's next" section that brand integration schema + Astro wiring is complete; brand seed runs on next `pnpm migrate:v2:apply` in the NAS container.

- [ ] **Step 5: Final commit**

```bash
git add TASKS.md BRIEF.md
git commit -m "docs: mark brand integration complete, update BRIEF"
```
