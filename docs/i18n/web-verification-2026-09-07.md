# i18n — web-side verification, 2026-09-07

Branch `i18n/groundwork`, worktree `~/websites/apr70-website/v10-i18n`.

**Stack under test**

- CMS: `pnpm -C cms dev` on **:3002** against the rehearsal Postgres
  `postgresql://postgres:postgres@127.0.0.1:5433/apr70_cms` (a fresh copy of the live
  database, with the CMS agent's `20260907_195421_i18n_localization` migration applied).
  `GET /api/globals/site-settings` -> `enabledLocales = ['en']`.
- Web: `PUBLIC_PAYLOAD_URL=http://localhost:3002 pnpm -C web dev` on **:4322** (gate shut) and a
  second instance on **:4323** with `I18N_FORCE_ENABLED=en,pt` (gate open).
- Real slug used throughout: `sea-gate`.

Both dev servers and the CMS were stopped after this run.

---

## 1. Static checks

| Command | Result |
|---|---|
| `pnpm -C web build` | **exit 0** — server built, `sitemap-index.xml` written |
| `pnpm -C web astro check` | **8 errors, 0 warnings, 3 hints** |

`astro check` does **not** exit 0 — and it did not before this work either. The pre-i18n tree
(commit `aff7329`, extracted to a scratch dir and checked with the same toolchain) produces the
**identical 8 errors**, byte for byte after stripping line numbers:

```
src/components/v9/sections/SlateList.astro  ts(2339) Property 'imgSrcset' does not exist on type 'Row'
src/layouts/V9Layout.astro                  ts(2345) resolveMediaUrl(settings?.navLogoDark)   [x2]
src/lib/lexicalToHtml.ts                    ts(7016) no types for 'escape-html'
src/lib/lexicalToHtml.ts                    ts(7031) implicit any 'node'                      [x3]
src/lib/payload.ts                          ts(2352) Record<string, unknown> as Home
```

`diff` of the two error sets: **identical**. This work introduces zero new type errors; the eight
are pre-existing debt and out of scope here.

---

## 2. Gate shut — `enabledLocales = ['en']` from Site Settings, no override (:4322)

```
  /                    200  lang="en"  hreflang: en=1 pt=0 x-default=1 | switcher links=0
  /slate               200  lang="en"  hreflang: en=1 pt=0 x-default=1 | switcher links=0
  /craft               200  lang="en"  hreflang: en=1 pt=0 x-default=1 | switcher links=0
  /methods             200  lang="en"  hreflang: en=1 pt=0 x-default=1 | switcher links=0
  /contact             200  lang="en"  hreflang: en=1 pt=0 x-default=1 | switcher links=0
  /work/sea-gate       200  lang="en"  hreflang: en=1 pt=0 x-default=1 | switcher links=0

  404 gate:
  /pt/slate              404      (pt is a site locale but not enabled)
  /pt                    404
  /it/work/sea-gate      404
  /xx/slate              404      (not a site locale at all)
  /en/slate              404      (English is unprefixed; one URL per page)

  text routes:
  /robots.txt            200
  /sitemap.xml           200
  /llms.txt              200
  llms.txt "Languages" line: absent (correct — English-only site)
```

Head of `/slate`, in full:

```html
<link rel="canonical" href="https://apr70.com/slate">
<link rel="alternate" hreflang="en" href="https://apr70.com/slate">
<link rel="alternate" hreflang="x-default" href="https://apr70.com/slate">
<link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable site summary">
<meta property="og:locale" content="en_US">
```

The only `v9-lang` strings in the response are the CSS rules (inlined by the dev server);
`grep -c '<a class="v9-lang__code"'` is **0** on every page. No wrapper, no empty element.

---

## 3. Gate open — dev-only `I18N_FORCE_ENABLED=en,pt` (:4323)

```
English URLs
  /                    200  lang="en"  hreflang: en=1 pt=1 x-default=1 | switcher=2 current=en
  /slate               200  lang="en"  hreflang: en=1 pt=1 x-default=1 | switcher=2 current=en
  /craft               200  lang="en"  hreflang: en=1 pt=1 x-default=1 | switcher=2 current=en
  /methods             200  lang="en"  hreflang: en=1 pt=1 x-default=1 | switcher=2 current=en
  /contact             200  lang="en"  hreflang: en=1 pt=1 x-default=1 | switcher=2 current=en
  /work/sea-gate       200  lang="en"  hreflang: en=1 pt=1 x-default=1 | switcher=2 current=en

/pt/* URLs
  /pt                  200  lang="pt"  hreflang: en=1 pt=1 x-default=1 | switcher=2 current=pt
  /pt/slate            200  lang="pt"  hreflang: en=1 pt=1 x-default=1 | switcher=2 current=pt
  /pt/craft            200  lang="pt"  hreflang: en=1 pt=1 x-default=1 | switcher=2 current=pt
  /pt/methods          200  lang="pt"  hreflang: en=1 pt=1 x-default=1 | switcher=2 current=pt
  /pt/contact          200  lang="pt"  hreflang: en=1 pt=1 x-default=1 | switcher=2 current=pt
  /pt/work/sea-gate    200  lang="pt"  hreflang: en=1 pt=1 x-default=1 | switcher=2 current=pt

  /it/slate            404      (it exists in cms/src/locales.ts but is NOT enabled)
```

Head of `/pt/slate`:

```html
<html lang="pt" ...>
<link rel="canonical" href="https://apr70.com/pt/slate">
<link rel="alternate" hreflang="en" href="https://apr70.com/slate">
<link rel="alternate" hreflang="pt" href="https://apr70.com/pt/slate">
<link rel="alternate" hreflang="x-default" href="https://apr70.com/slate">
<meta property="og:locale" content="pt_PT">
```

Switcher markup on `/pt/slate` (both mounts — header nav and footer nav row):

```html
<span class="v9-lang v9-lang--header" role="group" aria-label="Language">
  <a class="v9-lang__code" href="/slate"    hreflang="en" lang="en">EN</a>
  <a class="v9-lang__code" href="/pt/slate" hreflang="pt" lang="pt" aria-current="true">PT</a>
</span>
<span class="v9-lang v9-lang--footer" role="group" aria-label="Language"> ... </span>
```

`"inLanguage":"pt"` appears in the CreativeWork and WebSite JSON-LD on `/pt/work/sea-gate`.

### Every internal link on `/pt/slate` is prefixed

`grep -oE 'href="/[^"]*"' | sort -u`, with the `/pt/...` entries removed, leaves **only**:

```
href="/api/media/file/favicon-70_black.svg"      (asset)
href="/api/media/file/favicon-70_black_512.png"  (asset)
href="/api/media/file/favicon-70_orange.svg"     (asset)
href="/fonts/Fraunces-italic-300-700.woff2"      (asset)
href="/fonts/Jost-variable.woff2"                (asset)
href="/llms.txt"                                 (deliberately English-only)
href="/slate"                                    (the EN entry in the switcher — correct)
```

All 22 navigational links (`/pt`, `/pt/slate`, `/pt/craft`, `/pt/methods`, `/pt/contact`,
`/pt/212`, `/pt/310`, `/pt/nrc`, and the nine `/pt/work/<slug>` rows) carry the prefix.

### Sitemap and llms.txt with pt enabled

```
sitemap.xml: 34 <loc> entries (17 English + 17 /pt), each with
  <xhtml:link rel="alternate" hreflang="en"|"pt"|"x-default">
llms.txt: - Languages: English at https://apr70.com/; Português at https://apr70.com/pt
```

---

## 4. English HTML is unchanged except for the listed SEO additions

Strongest check: `pnpm build` on the pre-i18n baseline (`aff7329`) and on this branch, both served
by `node dist/server/entry.mjs` against the same CMS (:4401 baseline, :4402 new), then a
character-level diff of the rendered HTML.

`/`, `/slate`, `/craft`, `/methods`, `/contact`, `/212`, `/work/sea-gate` — the complete set of
differences across all seven pages:

1. `<link rel="alternate" hreflang="en" ...>` and `<link rel="alternate" hreflang="x-default" ...>`
2. `<meta property="og:locale" content="en_US">`
3. `"inLanguage":"en"` inside the WebSite and CreativeWork JSON-LD
4. Asset content hashes (`...8LKdUXp.css` -> `...ySp0gZ2.css`) — v9.css gained the switcher rules
5. On `/work/sea-gate` only: the FilmstripSlideshow island's serialized props gained
   `"aiFrame":[0,true]` / `[0,false]` per gallery item

Nothing else. No line-count change, no switcher markup, no reordering, no changed copy.

### The AI mark did not move

`data-ai-frame` attribute counts, baseline vs this branch, same CMS data:

| page | baseline | new |
|---|---|---|
| `/` | 3 | 3 |
| `/slate` | 1 | 1 |
| `/craft` | 1 | 1 |
| `/methods` | 1 | 1 |
| `/contact` | 1 | 1 |
| `/212` | 0 | 0 |
| `/work/sea-gate` | 4 | 4 |

Identical. Making the stored `Media.aiFrame` flag authoritative gained and lost nothing on the
current data — the flag and the caption text agree today — while removing the dependence on an
English regex before any caption is translated.

---

## 5. Both modes / CSS

The only CSS added is the `.v9-lang` block in `web/src/styles/v9.css`. It uses `--font-mono`,
`--v9-micro`, `--fg-3`, `--fg-4`, `--accent`, `--dur-quick`, `--ease-out` and nothing else — every
one an existing token, so Marquee Night and House Lights are both covered by the existing ramps.
No new colour, no `transition: all` (only `color` is named), sizes via `clamp()`, and a 375px tap
target rule matching the one already used for the header links and footer routes.
