# V4 Rebuild Spec — design language, themes, motion, imagery, verification
**Orchestrator-authored, 2026-07-06. Every build agent reads this first, then its own brief.**
Marco's rulings are law. Where this spec and repo CLAUDE.md conflict, this spec wins for design; CLAUDE.md wins for infrastructure.

## 0. Verdict + rulings (Marco, 2026-07-06)
- Direction A ("Screening Room") = the house design and default theme. Direction C ("Photoplay") = theme 2. Five themes approved as below. B ("Trade Paper") included.
- **"Less cream"**: Photoplay's paper cools toward ivory/off-white (less yellow saturation); Trade Paper parchment cools likewise. Cream never appears outside those two themes.
- Front page NEVER says DISPATCH as its nameplate. Nameplate = **APR 70 PICTURES.** (orange full stop). DISPATCH is a numbered-issue band + nav destination.
- Masthead sub-line ruling: APR 70 is an **entertainment company** — film, television (streaming), theater, radio (podcasting), books. Chrome sub-line: "An entertainment company. Film · Television · Theater · Radio · Books — set as: AN ENTERTAINMENT COMPANY · FILM · TELEVISION · THEATER · RADIO · BOOKS" + "Long Island City, New York." (Draft 3's About body text stays verbatim until Marco edits copy; this ruling governs CHROME, nameplate area, and meta descriptions.)
- Typography movement approved (see §3). "MOST CUTTING EDGE TYPOGRAPHIC SITE ON THE PLANET" is the ambition; gimmicks for gimmicks' sake are rejected.
- Every theme ships **both light AND dark** modes with a visible toggle (independent of theme choice).
- Control panel: theme picker, light/dark toggle, font-size control, logo picker, **logo size slider**.
- Imagery: **PD everything** — verified public-domain photography first (see §5). ComfyUI is NOT retired: it fills gaps, but every ComfyUI image must carry a visible credit "Image: ComfyUI (interim)" so Marco knows to swap it. NEVER AI for people/characters.
- v2 site's signature interactions (trailing-dot cursor, typography fly-ins) get studied from /Users/marco/websites/APR_70 and ported where they serve the doctrine.

## 1. Locked brand system (do not re-derive)
Source of truth: `design-source/news-magazine/colors_and_type.css` + repo `web/src/styles/tokens.css`.
- Colors: black #000 / white #fff · amber #824B07 (212) · teal #077082 (310) · orange #E85D04 (accent) · blue #0077B6 · offwhite #c8c8c8 (NRC) · steenbeck #d8cdb8 · parchment #ede8de · ink #1c1208.
- Faces: Futura Std (300/400/500/700/900 + Condensed 700/900, local OTFs in web/public/fonts) · Barlow (body) · Share Tech Mono (keycodes). Photoplay adds a serif text face for its reading pages (Georgia stack acceptable; do not add new webfont deps without orchestrator sign-off).
- Tracking system: eyebrow 0.4em · strip 0.55em · wider 0.2em. Leading-crush 0.85 for giant display.
- Motifs: sprocket holes, filmstrip rails, crosshair cursor, orange leader tab.
- Spelling canon: L.A. Dolce Vita · Sea Gate · Da Hook · U Bruculinu. Issues numbered, NEVER dated. No emoji. No em dashes in running copy ("..." style per writers-room law). The $40M ask appears NOWHERE.

## 2. The five themes — five DESIGNS, not five palettes
Each theme = its own typography deployment + layout personality + texture + nav treatment + motion signature, in both light and dark. Reference mockups: `design-source/directions/*.html`.

### T1 · Screening Room (default)
Dark poster modernism (Direction A). Futura Heavy at poster scale, crushed leading; orange leader tab; sprocket chrome; black house (light mode = "work lights on": near-white #f2f2f0 with black type, orange holds). Nav: numbered links, mono numerals, underline draw, orange active. Texture: none — pure ink on black. Motion signature: scroll-read type, film-gate wipes, dissolves (see §3).

### T2 · Photoplay
Picture-magazine (Direction C), paper cooled to ivory (#f4efe4 band, LESS cream than the mockup). Futura Condensed ExtraBold cover lines; serif text pages; halftone plates; issue seals, Roman numerals, pointed cover lines. Dark mode = "the annex at night": deep sepia-black #171006, ivory type, cover-orange holds. Nav: departments spine tabs, filled-ink active. Texture: paper grain + halftone dots. Motion: plates develop like prints (contrast/opacity), cover lines stamp in with tiny rotation settle.

### T3 · Trade Paper
Broadsheet document (Direction B), parchment cooled toward #eae6dd. Futura Condensed headlines at print scale; Barlow justified columns; drop caps; double rules; dotted leaders; ears + folio nav with ink-stamp hover. Dark mode = "night desk": #12100c paper, bone ink. Texture: light paper noise. Motion: restrained — rules draw themselves, columns settle, NOTHING flies; the anti-spectacle theme.

### T4 · Cutting Room
NEW. Black-and-white only (no chromatic accent except a single #E85D04 frame-marker allowed at 1 place per page). Share Tech Mono leads; Futura appears only as specimen blocks. Layout = cut list / EDL: timecode gutters, frame counters, hairline grids. Light mode = paper-white lab sheet; dark = matte black bench. Nav: timecode entries (00:01 FRONT DOOR). Motion signature: HARD CUTS — frame-step reveals with steps() easing, no smoothing, no dissolves. The anti-smooth theme.

### T5 · Picture Palace
NEW. Night-marquee deco: black-blue night (#050810) with brand blue #0077B6 + white; light mode = daytime palace: cool plaster white, navy type. Futura Condensed stacked in VERTICAL letter towers (marquee columns); footlight glow (radial gradients from below); brass hairlines. Nav: marquee cells that light on hover. Motion: letters illuminate in sequence (staggered brightness, tiny flicker on arrival ≤ 2 per page), glow blooms on scroll arrival. NO auto-motion, NO tickers.

**Hard bans all themes:** no tickers/marquee auto-scroll of any kind (motion is user-scroll-driven or one-time settles), no transition: all, no layout-property animation (transform/opacity/clip-path/filter only), no purple, no glassmorphism cards, no invented copy.

## 3. Motion doctrine — "motion serves reading"
Reference implementation: `design-source/directions/direction-a-screening-room.html` (GSAP + ScrollTrigger + SplitText).
1. Nothing auto-scrolls or loops forever. Motion is (a) one-time composition on load, (b) scroll-driven scrub, or (c) micro-interaction response.
2. The scroll is the read: long identity/manifesto passages develop word-by-word tied to scroll (fromTo opacity 0.1→1, scrub).
3. Display lines enter like film: gate wipes (clip-path inset), settle staggers; they LEAVE via dissolve (opacity+blur scrub) — except Cutting Room, which hard-cuts with steps().
4. Per-theme motion signatures per §2. Same GSAP stack: gsap core + ScrollTrigger + SplitText (already in repo deps — verify version supports SplitText; else npm add gsap@^3.13).
5. `prefers-reduced-motion: reduce` collapses EVERYTHING to static instantly — gsap.matchMedia gate, no exceptions. Also expose the static state as the SSR default (no content hidden without JS).
6. v2 ports: trailing-dot cursor + typography fly-ins from /Users/marco/websites/APR_70 — port per the v2 interaction study (design-source/v2-interaction-study.md). Cursor trail: site-wide layer, pointer-events none, hidden on touch + reduced-motion.
6b. **Logo splash intro — RULED IN by Marco 2026-07-06.** Port v2's entrance splash (logo dissolve-in 0.8s → sprocket-hole color climb, 5 holes 0.08s apart → blur(12px) exit 0.8s) with the guards v2 lacked: front door only, once per session (sessionStorage flag), skipped entirely on reduced-motion, injected by JS only (SSR markup never blocks content; no-JS visitors never see it), total runtime ≤ 2.2s, dismissible by any input.
7. Interactive states: every nav link/button/control has default · hover · focus-visible · active states, crafted per theme. Focus ring never animated.

## 4. Architecture + control panel
- App: web/ (Astro 6 SSR, React islands, GSAP). Content via Payload + `src/content/v4.ts` fallback (BlockRenderer law stands — no hardcoded page layouts outside the theme layer).
- Themes apply via `data-design` on <html> (existing). Light/dark via `data-theme` — NOW INDEPENDENT: `designThemeMode()` provides the DEFAULT mode per theme; a visible toggle overrides and persists (`apr70:mode`). Every `[data-design]` block must style both `[data-theme="light"]` and `[data-theme="dark"]`.
- Theme CSS: one file per theme `src/styles/themes/<slug>.css` (real design deployment, NOT variable rebinds only). Shared tokens stay in tokens.css. Scope EVERYTHING under `[data-design="<slug>"]`. No cross-theme leakage.
- Per-theme motion: `src/lib/motion/<slug>.ts` modules with a shared `initThemeMotion(design)` dispatcher, invoked from a single island; kills + re-inits on theme switch.
- Control panel island (rebuild of ThemeControlIsland): sections = Theme (5 chips w/ personality microcopy) · Mode (light/dark toggle) · Type size (S/M/L/XL, existing `--font-scale`) · Logo (picker, existing options) · **Logo size (slider, 24–72px nav height, persists `apr70:logo-size`, drives `--logo-h` var consumed by chrome)**. Draggable, collapsible, keyboard accessible, styled per active theme.
- Logos at REAL scale everywhere: nav mark ≥ 34px height default; division heroes ≥ 96px in division blocks; the six-mark colophon band on the front door.
- DISPATCH page (/news): full magazine layout (components exist in src/components/dispatch/) with corrected numbered-not-dated indicia; must render rich content WITHOUT a seeded DB row (static fallback issue) so staging never shows an empty shell.

## 5. Imagery law
- PD manifest: verified items + rights text live in vault ledgers (`03-public-site/pd-image-ledger-troupe.md`, `pd-image-ledger-site.md`). Web previews already at `design-source/pd-previews/`. Masters → staging (gitignored) → processed web tiers → `web/public/pd/<slug>/` + `web/public/pd/credits.json` (item, source URL, rights text, download date, file). Per-theme treatments allowed (grayscale, duotone in division colors, halftone for Photoplay) — treatments are CSS/filter or pre-processed derivatives; never misrepresent the source.
- Credit lines: PD images get a quiet caption ("Library of Congress, Harris & Ewing, 1938" style). ComfyUI gap-fillers get a VISIBLE credit "Image: ComfyUI (interim)" — Marco swaps these later. No AI people/characters, ever.
- Image slots with no asset yet: branded placeholders (web/public/brand/placeholders/), never stock, never invented.

## 6. Verification battery (every build agent, before reporting done)
1. `npx tsc --noEmit` clean (filter src/).
2. `pnpm -C web build` clean (webpack fallback `npx next build --webpack` does NOT apply — this is Astro; default build).
3. Playwright matrix: key routes (/, /212, /310, /nrc, /work, /news, /troupe, /about, /contact) × 5 themes × light/dark × desktop 1440/mobile 390 — screenshots to `docs/v4-rebuild/shots/<wave>/`, console-error scan zero errors, no horizontal scroll at 390.
4. Evidence before claims (verification-before-completion): no "done" without command output + screenshot paths in the report.
5. Orchestrator reviews screenshots VISUALLY before anything reaches Marco; code-review pass on the wave's diff; /verify-style end-to-end drive of changed flows.
6. A passing matrix is NEVER a design verdict — Marco approves by looking at pictures. (Law from the 2026-07-06 rejection.)

## 6b. Rulings round 2 — Marco, 2026-07-06 evening (supersede conflicting text above)
- Themes: KEEP screening-room (default) + cutting-room. KILL photoplay, trade-paper, picture-palace (picker shows only live themes; css files may remain dormant). **Cutting Room switches to Futura as the LEAD face** — Share Tech Mono demotes to timecode gutters/keycodes only.
- Three NEW creative theme candidates go through the mockup gate; **one MUST be "the x.ai direction"** (study https://x.ai DNA, deploy through the locked brand system).
- Hero nameplate: caps are CLIPPED at the top of each line on all themes (SplitText mask + crushed leading) — fix so nothing clips at rest.
- Control panel: light/dark toggle MOVES to the menu bar (VMS pattern), out of the panel. Panel gains: FONT picker, DIVISION-ACCENT picker, and the FULL logo library (~20+ marks from web/public/brand/apr70-logos/** + public/logos — not 6).
- Footer: "The Marks of the House" colophon block is REMOVED entirely.
- Division color law (DESIGN.md canon): division pages carry their OWN color on the filmstrip leader chip + accents — 310 gets a blue chip (310-sicilian-blue #0077B6 or nrc-navy #001F3F), 212 amber/sicilian-orange, NRC gray/navy. **Cleopatra must appear on /310's slate.**
- Scrollbar: replace the default browser scrollbar sitewide — thin stroke, division color on division pages, gray in dark mode.
- Display panel must persist on EVERY page including /news (currently disappears there — bug).
- Property imagery: PD-first for ALL properties; ComfyUI allowed only with the visible interim credit. ON AIR sign = candidate 4 (1 reads cropped, 3 excluded).
- Copy: Marco does his own text pass in `site-text-as-built-2026-07-06.md` — agents do NOT rewrite copy; known flags (spoiler leaks on /work/falcon + sea-gate + brooklyn, "The Other Doors" invention, DISPATCH "four features" count bug) await his ruling unless he says otherwise.

## 6c. Rulings round 3 (judgment gallery v2, R.01–R.08) — Marco, 2026-07-07 (supersede conflicting text above)
- **R.01 — Direction gate: GO WITH F ONLY.** `design-source/directions/direction-f-mission-control.html` (the mandated x.ai direction) is the sole pick to build out as a full theme. G and H (on-air, writers-wall) stay mockups, not built. G4's earlier `direction-d-aperture` / `direction-e-drafting-room` / `direction-f-projection` were never in the gallery and are dead — do not resurrect.
  - Marco's flag, unresolved: **Cutting Room (now Futura-led) reads as near-identical to Screening Room.** Investigated 2026-07-07: the two dark modes ARE coded distinctly (Cutting Room: pure B&W --accent bound to ink, one orange grease-pencil cue spent on the top-rail playhead only; timecode-gutter SMPTE counters on slate rows; registration crosshairs on the cover frame; hard-cut steps() motion vs Screening Room's smooth motion + orange leader/nav/cursor throughout) — but at a glance, on the front door, they read alike because (a) both now lead with Futura per this round's ruling, (b) the bg/fg ramps are close (near-black bg, near-white fg in both dark modes), and (c) the layout/grid/imagery is literally shared, so the only thing that visually separates them at normal viewing distance is orange-vs-ink accent, which is easy to miss when little accent-colored chrome is in frame. The EDL-specific treatments (crosshairs, SMPTE counters) are real and shipped but read as fine print, not as a different "look." **Left for Opus/next wave**: consider giving Cutting Room's structural identity (timecode gutters, crosshairs, hard-cut motion) more visual weight so the two keepers differentiate at a glance, not just on close inspection.
  - **Gray full stop**: Marco likes Cutting Room's muted-gray nameplate dot and wants it available in Screening Room too. Shipped 2026-07-07: new accent-picker option **"Bench Ink (Gray Stop)"** (`AccentChoice = 'ink'`, manifest.ts), bound to `var(--fg-4)` (theme/mode-relative, not a fixed hex) so it adapts correctly across themes. Selectable from the Display panel's Accent row on any theme. Verified in-browser: `--accent` resolves to the correct muted gray, nameplate dot renders gray, picker chip shows pressed/selected state correctly.
- **R.02 — Em dashes purged.** All rendered-copy em dashes replaced per Marco's rule: use `--`, `...`, `|`, or a bullet, chosen by context. See commit for the full list of touched files.
- **R.03 — Cutting Room's gray nameplate full stop: CONFIRMED, keep as-is.** (Folds into R.01's picker addition above — now also offered in Screening Room.)
- **R.04 — Display pill's orange theme-swatch dot under Cutting Room: CONFIRMED acceptable**, no change (orchestrator's ruling stands).
- **R.05 — Two PD image human-clicks: BLOCKED, awaiting Marco.** He needs a working link to the site ledger + the actual images before ruling — see handoff doc for the direct paths (NARA 555751 Manhattan/Brooklyn Bridge caption conflict; LOC Fulton St El 1914, rate-limited on automated reads).
- **R.06 — Shadowmaster imagery: ComfyUI-with-visible-credit lane CONFIRMED.** Marco asked whether PD archives have an equivalent to "kid controlling a radio-controlled car/toy" as an alternative concept — see handoff doc for research findings.
- **R.07 — Two-session conflict: RULED.** This session (the one that authored this file) keeps the wheel. The other session's outstanding debts (font/accent pre-paint patch, CMS troupe backstage seed, localhost:4321 CMS logo URL) were absorbed/landed by this session on 2026-07-07 — see commit `884dec9` and the handoff doc.
- **R.08 — Commit and push to Git + NAS: DONE 2026-07-07.** See commit log.

## 7. File ownership per wave (conflict avoidance)
- Wave A (chrome+panel): Layout.astro, Footer.astro, ThemeControl island, tokens.css, designs manifest/logos, motion dispatcher skeleton.
- Wave B (front door): index.astro + front-door blocks + content/v4.ts + motion/screening-room.
- Wave C (themes T2–T5): ONLY src/styles/themes/<slug>.css + src/lib/motion/<slug>.ts + theme-specific part components under src/components/themes/<slug>/.
- Wave D (DISPATCH): news/ pages + dispatch components + dispatch.css.
- Wave E (imagery): public/pd/, credits.json, ledger updates, placeholder swaps.
- Nobody edits another wave's files; shared-file needs route through the orchestrator.
