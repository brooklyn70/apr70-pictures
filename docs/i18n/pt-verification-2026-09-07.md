# Portuguese locale — end-to-end verification, 2026-09-07

Worktree `~/websites/apr70-website/v10-i18n`, branch `i18n/groundwork`. Verification only —
no source files under `cms/` or `web/` were edited.

**Stack under test**

- CMS: `DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5433/apr70_cms PORT=3001
  PAYLOAD_SECRET=<dev-only, generated locally, not persisted to any .env file> pnpm -C cms dev`.
  Rehearsal Postgres (container `apr70-i18n-postgres`) already had the PT locale populated —
  confirmed via `GET /api/globals/site-settings?locale=pt` returning a Portuguese `tagline`.
  `PAYLOAD_SECRET` was not present in `cms/.env*` (no `.env` file exists in `cms/`, only
  `.env.example`/`test.env`) so a throwaway dev-only value was passed on the command line;
  nothing was written to disk.
- Web: `I18N_FORCE_ENABLED=en,pt PUBLIC_PAYLOAD_URL=http://localhost:3001 pnpm -C web dev --port
  4322` — the documented dev-only override from `docs/i18n/README.md`.
- Both stopped at the end of this run.

---

## 1. Routing / status / lang — PASS

```
/                    200  lang="en"
/slate               200  lang="en"
/work/sea-gate       200  lang="en"

/pt/                 200  lang="pt"
/pt/slate            200  lang="pt"
/pt/craft            200  lang="pt"
/pt/methods          200  lang="pt"
/pt/contact          200  lang="pt"
/pt/work/sea-gate    200  lang="pt"
/pt/work/u-bruculinu 200  lang="pt"

/it/slate            404  (it exists in cms/src/locales.ts but is not force-enabled)
```

## 2. Portuguese content strings — PASS (after correcting page targets)

The task's three sample strings live on specific pages per `docs/i18n/review/pt-2026-09-07.md`,
not the pages first guessed:

```
"Os clássicos nunca saem de moda"  -> Home (/pt/)      : found, count=2
"Solicitar materiais"               -> Home + Slate     : found on /pt/ (1) and /pt/slate (1)
"Uma cidade particular no fim do
 Brooklyn"                          -> /pt/work/sea-gate: found, count=2
```

`/pt/work/u-bruculinu` does not contain the Sea Gate line (expected — different property).
`/pt/contact` has no "Solicitar materiais" CTA — verified this is **not** a translation gap:
the nav CTA is suppressed on the contact page itself in **both** `/contact` (EN) and `/pt/contact`
(PT), i.e. pre-existing behavior, not a leak.

## 3. Switcher, aria-current, internal links — PASS

`/pt/slate` switcher markup (both header and footer mounts):

```html
<span class="v9-lang v9-lang--header" role="group" aria-label="Idioma">
  <a class="v9-lang__code" href="/slate" hreflang="en" lang="en">EN</a>
  <a class="v9-lang__code" href="/pt/slate" hreflang="pt" lang="pt" aria-current="true">PT</a>
</span>
```

`chrome.languageLabel` renders as "Idioma" (translated), not the English fallback "Language".

Every internal nav href on `/pt/slate` is `/pt/`-prefixed. `grep -oE 'href="/[^"]*"' | sort -u`
minus the `/pt/...` rows leaves only: media assets (`/api/media/file/...`), font files, `/llms.txt`
(deliberately English-only), and `/slate` (the EN entry inside the switcher itself — correct).

## 4. No leaks — PASS

- English `/` home: zero hits for "Os clássicos", "Solicitar materiais", "Uma cidade particular",
  "Três divisões"; zero Portuguese-diacritic characters anywhere in the visible text.
- Untranslated-English scan of `/pt/`, `/pt/slate`, `/pt/craft`, `/pt/methods`, `/pt/contact`,
  `/pt/work/sea-gate`, `/pt/work/u-bruculinu`: stripped each page to visible text, split into
  sentences, flagged any sentence over 8 words with 3+ English stopwords and no Portuguese
  diacritics/markers. **Zero suspects on every page.** No leftover English paragraphs found.

## 5. Screenshots

9 PNGs in `docs/i18n/shots/pt-2026-09-07/`: `/pt/` and `/pt/work/sea-gate` at 375×812 and
1440×900, dark and light, plus one 1440 `en-home-desktop-1440x900.png` for comparison.
Captured with Playwright Chromium, `reducedMotion: 'reduce'` to bypass the GSAP scroll-linked
intro reveal (a fixed-timeout capture without this is unreliable — see note below).

## 6. Visual findings

**Real bug — mobile header nav overflow when PT is active.** At 375px width, the sticky header
row (`LISTA · OFÍCIO · MÉTODOS · CONTATO · EN · PT`) is wider in Portuguese than English and does
not wrap; it clips at the viewport's right edge, cutting the switcher's "PT" link down to just
"P" (the T is entirely off-screen). Reproduced on both `/pt/` and `/pt/work/sea-gate`, in both
dark and light mode — 4 of the 8 PT screenshots show it directly. The **footer** nav mount does
not have this problem — it wraps to two lines at the same width and shows the full switcher
("EN · PT") cleanly. Desktop (1440px) header has no overflow in either locale. Not something this
verification pass should fix (scope is verification, not source edits) — worth a follow-up: either
let the header nav wrap like the footer does, or shorten/abbreviate at narrow widths.

**Environment gap, not an i18n bug — broken hero media in this rehearsal checkout.** The local
`cms/media/` directory has no actual image files (only DB metadata came over in the rehearsal
dump), so every hero image/logo request 500s: `File <name> for collection media is missing on the
disk`. This renders hero regions as solid black placeholders in every screenshot, EN and PT alike
— confirmed identical behavior on the English home page too, so it's not locale-specific. It
prevented judging whether longer Portuguese captions overflow the hero photo-fold; that check
could not be completed here and should be redone once real media is present (e.g. against staging
media, or with local files restored).

**No PT-specific overflow found elsewhere.** Portuguese body copy, headings (e.g. "Uma cidade
particular, uma única estrada de entrada."), the property prev/next ring, and the footer legal
block all wrap and fit cleanly at both viewport widths, both modes. No untranslated chrome spotted
outside the CTA-suppression case already noted as expected in §2.

**Screenshot-tooling note (not a site bug).** The site has a GSAP scroll-linked intro that, when
captured via Playwright's `fullPage` screenshot (which resizes rather than scrolls the viewport),
can leave chrome invisible if captured too early, or fade back out if given a long fixed wait with
motion still enabled (observed with a 1800ms wait, no `reducedMotion`). Emulating
`prefers-reduced-motion: reduce` (which the site explicitly supports — `web/src/styles/v9.css`
lines 100, 603, 972, 1081 — and `LogoRevealIsland.tsx`) plus a short 500ms settle produced stable,
repeatable captures. Noted here in case a future verification pass reuses this script.

---

## Screenshot list

```
docs/i18n/shots/pt-2026-09-07/pt-home-mobile-375x812-dark.png
docs/i18n/shots/pt-2026-09-07/pt-home-mobile-375x812-light.png
docs/i18n/shots/pt-2026-09-07/pt-home-desktop-1440x900-dark.png
docs/i18n/shots/pt-2026-09-07/pt-home-desktop-1440x900-light.png
docs/i18n/shots/pt-2026-09-07/pt-work-sea-gate-mobile-375x812-dark.png
docs/i18n/shots/pt-2026-09-07/pt-work-sea-gate-mobile-375x812-light.png
docs/i18n/shots/pt-2026-09-07/pt-work-sea-gate-desktop-1440x900-dark.png
docs/i18n/shots/pt-2026-09-07/pt-work-sea-gate-desktop-1440x900-light.png
docs/i18n/shots/pt-2026-09-07/en-home-desktop-1440x900.png
```

## Follow-up: mobile header overflow FIXED (same day)

`web/src/styles/v9.css`, mobile block (`max-width: 719px`): `.v9-nav` now wraps
(`flex-wrap: wrap; row-gap: 0.35rem; overflow-x: visible`) and the header
switcher takes `margin-left: auto`, so the routes keep the first line and the
language keycodes + mode toggle drop to a right-aligned second line. With one
locale enabled the switcher does not render, nothing wraps, and today's English
layout is unchanged.

Evidence (Playwright, 375x812, `I18N_FORCE_ENABLED=en,pt`): `.v9-nav`
scrollWidth 335 = clientWidth 335 (no overflow) on `/pt/`, `/`, and
`/pt/work/sea-gate`; the switcher's right edge sits at 291px. Screenshots:
`shots/pt-2026-09-07/header-pt-375-{light,dark}-AFTER-FIX.png`.
