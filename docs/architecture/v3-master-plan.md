# APR 70 Pictures — v3 Master Architecture Plan
**Status**: Director-Approved · Implementation-Ready  
**Date**: 2026-05-11  
**Reviewed by**: Perplexity, Grok, Marco (4 drafts)

---

## 0. Source of Truth: Payload From Day One

Payload CMS is the **single source of truth** for ALL content. This is standard professional Payload workflow.

- An **idempotent, versioned seed script** (`seed.ts`) runs via Payload's `onInit` hook on first boot
- Seeds homepage copy, division data, project entries, nav items, quotes — everything from v2
- After seed, ALL edits happen through the Payload Admin UI (`/admin`)
- Frontend queries Payload exclusively via `web/src/lib/payload.ts` (typed client)
- **ZERO Keystatic. ZERO content/ directory. ZERO file-based fallbacks. ZERO hardcoded content.**
- The seed script tracks what's been seeded via a `seededVersion` field in `SiteSettings` and is safe to re-run

---

## 1. Stack & Boundaries

| Layer | Tech | Job |
|-------|------|-----|
| **Backend/CMS** | Next.js + Payload 3.0 | Source of truth, API routes, media uploads, admin UI |
| **Frontend** | Astro (SSR) | All public HTML rendering, SEO, mobile-first responsive |
| **Islands** | React (`client:load` / `client:idle`) | Hero slider, masonry scroll, magnetic nav — interaction-heavy only |
| **Animation** | GSAP + ScrollTrigger | All motion. No Framer Motion. Carried from v2 governance |

### The Single-Renderer Rule
Each block has exactly **ONE** render path: an Astro `.astro` component. React islands exist only inside that component when user interaction is required. Never two parallel implementations.

### Data Flow
`web/src/lib/payload.ts` → Payload REST API (`/api/*`). Types generated via `pnpm generate:types`. Includes error handling and stale-while-revalidate caching. One typed client, one consumer. No ad-hoc `fetch()` calls.

### Boundary
Next.js hosts Payload + serves `/api/*` and `/admin`. Astro renders ALL public pages.

---

## 2. Global Chrome (NOT Blocks)

These are global Astro layout components, **not** in the Payload block selector.

| Component | Implementation | Notes |
|-----------|---------------|-------|
| **Magnetic Navigation** | React Island + GSAP | `transform` + `opacity` only. Disabled on `pointer: coarse` + `prefers-reduced-motion`. Sliding orange pill via GSAP `quickTo`. |
| **Filmstrip Rails** | Static CSS | Decoration only in v3. Route-aware variants deferred to post-launch. `SiteSettings.showFilmstripRails` boolean for easy toggling. |
| **Footer** | Static Astro | 4-column grid. Links from `FooterLinks` Payload global. |
| **Version Watermark** | Code-owned | Lives in `src/lib/version.ts`. **NOT a CMS field.** Tied to release discipline + deploy pipeline. |

### SiteSettings Global (Payload)
- `brandLabel` (text) — editable
- `legalEntity` (text) — editable
- `footerLinks` (array) — editable
- `showFilmstripRails` (boolean) — editable
- `lastDeployed` (date, read-only) — synced via deploy hook / GitHub Action
- `seededVersion` (text, read-only) — tracks seed script version

---

## 3. Approved Color Palette (LOCKED)

| Token Key | Name | Hex |
|-----------|------|-----|
| `212-amber` | **212 Amber** | `#824B07` |
| `212-sicilian-orange` | **212 Sicilian Orange** | `#E85D04` |
| `310-imax` | **310 IMAX** | `#077082` |
| `nrc-grey` | **NRC Grey** | `#c8c8c8` |
| `310-sicilian-blue` | **310 Sicilian Blue** | `#0077B6` |
| `nrc-navy` | **NRC Navy** | `#001F3F` |

### Light Mode Tokens
| Token | Hex |
|-------|-----|
| Light Mode Background | `#FAFAF8` |
| Light Mode Text | `#1A1A1A` |

### CSS Custom Properties
```css
:root {
  --color-212-amber:           #824B07;
  --color-212-sicilian-orange: #E85D04;
  --color-310-imax:            #077082;
  --color-nrc-grey:            #c8c8c8;
  --color-310-sicilian-blue:   #0077B6;
  --color-nrc-navy:            #001F3F;
}
```

All blocks with color selectors use these token keys. The Lexical Color Injector stores `data-color="310-imax"` in markup. No freeform hex. No generic color picker.

---

## 4. Light Mode (First-Class, Phase 1)

- Toggled via `data-theme="light"` on the `<html>` element
- Controlled from `SiteSettings` (global toggle) + optional user preference
- **ALL blocks render correctly in both modes from day one**
- Uses `--fg-*` and `--bg-*` token ramp that flips cleanly under `[data-theme="light"]`
- Brand colors stay the same in both modes — adjusted-contrast variants added if any fail WCAG AA (4.5:1 minimum)
- No v2-style `!important` overrides — clean selector block only
- **Mobile-first**: all CSS designed for 375px–1440px with `clamp()`

### Light Mode Ramp
```css
[data-theme="light"] {
  --bg-0: #FAFAF8;
  --bg-1: #F2F0EC;
  --bg-2: #E8E6E2;
  --bg-3: #DCDAD6;
  --fg-1: #1A1A1A;
  --fg-2: rgba(26,26,26,0.80);
  --fg-3: rgba(26,26,26,0.55);
  --fg-4: rgba(26,26,26,0.40);
  --fg-5: rgba(26,26,26,0.25);
  --fg-6: rgba(26,26,26,0.12);
  --rule: rgba(26,26,26,0.10);
  --rule-strong: rgba(26,26,26,0.25);
}
```

---

## 5. Typography

Semantic tags separated from display scale via `data-display="mega"`.

| Scale | CSS | Use |
|-------|-----|-----|
| **Mega** | `clamp(3.5rem, 12vw, 200px)` | Explicit toggle only ("STORIES ACROSS GENERATIONS") |
| **H1** | `clamp(2.5rem, 6vw, 5.5rem)` | Standard page headings |
| **H2** | `clamp(1.75rem, 4.5vw, 4rem)` | Section headings |
| **H3** | `clamp(1.25rem, 3vw, 2.5rem)` | Sub-sections |

- `data-display="mega"` attribute from Lexical toggle
- `.mega-scale` utility class for non-Lexical static Astro components
- `text-wrap: balance` + `overflow-wrap: break-word` at mega scale
- Fonts: Futura Std (display), Barlow (body), Share Tech Mono (filmstrip/meta)

---

## 6. Lexical Color Injector

Custom inline Lexical plugin for Payload 3.x admin UI.

- Stores semantic token keys: `<span data-color="310-imax">`
- Maps to CSS variables on frontend: `[data-color="310-imax"] { color: var(--color-310-imax); }`
- **Locked to 6 canonical tokens** from §3. No freeform input.
- Validation hook on save (client + server side) rejects non-approved tokens
- Admin sidebar shows read-only **Brand Palette Reference** panel
- Visual preview in admin reflects final frontend rendering

---

## 7. Block Catalog

| Block | Slug | Source | Island? | Animation |
|-------|------|--------|---------|-----------|
| **Hero Engine** | `hero` | Projects collection | Yes | GSAP crossfade |
| **Filmstrip Marquee** | `filmstrip` | Media relationships / Projects | No | CSS scroll-snap |
| **Division Showcase** | `divisionShowcase` | Inline fields + color select | Variant-dep. | GSAP (v1-v4) |
| **Continuous Slate** | `masonry` | Projects (paginated) | Yes | None (CSS grid) |
| **Structure Divider** | `divider` | Inline label | No | None |
| **Stats Grid** | `stats` | Inline array | No | None |
| **Rich Text** | `richText` | Lexical + mega toggle | No | None |
| **CTA** | `cta` | Inline fields | No | None |
| **Quotes** | `quotes` | Inline array | No | CSS scroll-snap |
| **Two Column** | `twoCol` | Lexical left/right | No | None |
| **Grid** | `grid` | Inline array | No | None |

### Key Rules
- All blocks use **Media relationships** (not path strings)
- All blocks render in **both dark and light mode**
- All blocks are **mobile-first responsive**

### Hero Engine
- Auto-featured or curated Projects. Timing controls (`fadeDuration`, `autoplayDelay`)
- `heroVideoPoster` fallback for slow connections
- Classic crossfades only. No morphing, no WebGL.

### Filmstrip Marquee
- Media relationships. CSS `scroll-snap`. Keyboard arrow nav. ARIA carousel. Pause on hover.

### Division Showcase (5 variants)
- v0 = v2-faithful baseline (stacked rows, ghost numerals)
- v1-v4 = recombinations of existing primitives
- Preview at `/dev/division-variants` (dev-only, env-gated)
- Director picks one → unused code removed before production

### Continuous Slate (Masonry)
- First 8-12 items server-rendered by Astro (SEO + OG + structured data)
- `IntersectionObserver` triggers cursor-based pagination
- CSS columns/grid layout. "Load More" button as progressive enhancement fallback
- Skeleton loaders. Deterministic sort: `featured → year desc → title`

---

## 8. Build Priority

| Phase | Scope | Tool |
|-------|-------|------|
| **1** | `tokens.css` — full palette (§3) + dark/light mode ramps (§4) + `data-color` selectors + typography scale + `.mega-scale` utility | `gemini` |
| **2** | Lexical Color Injector plugin for Payload admin | `cursor+claude` |
| **3** | `SiteSettings` global + Global Chrome (Magnetic Nav, Footer) + Payload preview URLs | `cursor+claude` |
| **4** | Seed script — port v2 content into Payload DB (idempotent, versioned) | `nas-headless` |
| **5** | Hero Engine + Filmstrip Marquee blocks | `gemini` |
| **6** | Division Showcase (5 variants) + director review → lock one, delete rest | `gemini` / `requires-gui` |
| **7** | Continuous Slate + remaining block polish + WCAG AA audit | `cursor+claude` / `requires-gui` |

---

## 9. Performance & Accessibility Targets

- **LCP** < 2.5s on 4G mobile
- **CLS** < 0.1
- **Keyboard navigation**: all interactive elements fully operable
- **Reduced motion**: `prefers-reduced-motion` disables all GSAP timelines, magnetic nav, auto-scroll
- **WCAG AA**: 4.5:1 contrast ratio minimum for all text on both dark and light mode backgrounds
- **Bundle**: React islands lazy-loaded. No React on pages without interactive blocks.
