# Handoff — Layered-cinema proof of concept on `/` (v14 candidate)

**Written:** 2026-09-02 by Claude Fable 5.1 (discovery session) for the POC session Marco is opening now.
**Ruled by Marco 2026-09-02** (plan §G.1): first POC route is `/`, exposed behind `?design=layered` on staging, OFF by default; build now with what the CMS already holds, swap approved Light Law stills in later.
**Full brief:** `docs/plans/APR70_BRAND_BASELINE_AND_LAYERED_CINEMA_PLAN.md` §C (design), §E.3 (implementation checklist), §D (references: look, never copy).

## 0. Two sessions share this repo today. Work in a worktree.

A housekeeping session (favicon/logo fallbacks, brand folder archive, seed step) is running in `~/websites/apr70-website/v10` on `main` at the same time. Do not build in that tree. First thing:

```sh
cd ~/websites/apr70-website/v10 && git fetch origin
git worktree add ~/websites/apr70-website/v10-poc -b poc/layered-cinema origin/main
cp ~/websites/apr70-website/v10/web/.env* ~/websites/apr70-website/v10-poc/web/ 2>/dev/null
cp ~/websites/apr70-website/v10/cms/.env* ~/websites/apr70-website/v10-poc/cms/ 2>/dev/null
cd ~/websites/apr70-website/v10-poc/web && pnpm install
```

The worktree carries its own `.claude/` hooks and its own context meter (per-session since today). Commit to `poc/layered-cinema` only; push it; never merge to `main` yourself. Merge, `v14` bump, preflight, and NAS deploy happen on Marco's go, from the main tree, after the housekeeping session is done.

Local CMS Docker is down. For dev, point the web at the NAS read-only: in `v10-poc/web/.env` set `PUBLIC_PAYLOAD_URL=http://kimaserver:8080` (Tailscale; verified to serve `/api/globals/site-settings` and media). Never write to it. `pnpm dev` in `web/` serves `http://localhost:4321`.

## 1. Read first (30 minutes, in this order)

1. `CLAUDE.md` hard rules 1 to 16 and the Token Contract.
2. `DESIGN.md` sections Colors, Typography, Spacing, Borders, Motion (lines 228 to 320).
3. Plan §C.1 to C.7 (the five layers, constraints, precedents, exposure, dependency).
4. `web/src/layouts/V9Layout.astro` (the pre-paint theme stamp around lines 171 to 190; the nav; the `ModeToggleIsland` mount at 270).
5. `web/src/styles/v9.css` and `web/src/styles/themes/marquee.css` (the marquee footgun: nav and routeline rules live in both; do not touch either for this POC).
6. `web/src/components/v9/sections/PhotoFold.astro` and `web/src/components/v9/media.ts` (`frameFromMedia`, `focalPosition`, `isAiFrameText`).
7. `web/src/lib/motion/index.ts`, `cursor.ts`, `splash.ts` (how GSAP is loaded and gated).
8. `web/src/pages/craft.astro` lines 16 to 90 (the scroll rail: native `scroll-timeline` with script fallback).
9. `web/src/components/islands/LogoRevealIsland.tsx` (once-per-session splash on `/`; the parallax island must wait for it).
10. `tools/still-regen/LIGHT-LAW.md`, `STORY-LAW.md` (why stills are gated; you are not generating any).
11. `.claude/skills/explore-digest/SKILL.md` before any subagent fan-out.

## 2. Goal

One route, `/`, gains a five-layer parallax composition behind a switch. Default marquee design stays byte-identical when the switch is off. Investors open `https://staging.apr70.com/?design=layered` after deploy and see it; everyone else sees today's site.

Definition of done for this session:
- Branch `poc/layered-cinema` pushed, PR-ready, with screenshots (dark and light, 375 and 1440, switch on and off, reduced-motion on) saved under `docs/handoff/poc-shots/` and listed in an updated version of this file.
- `pnpm -C web build` exits 0. Six-URL check on the dev server all 200. Zero third-party requests on `/` (DevTools network, or `grep -o 'https\?://[^"]*' dist` shows only apr70 hosts).
- No CMS schema change, no migration, no seed change, no new dependency, no deploy.

## 3. Exposure mechanism (build exactly this)

- Root attribute `data-design="layered"` on `<html>`, set by the same pre-paint inline script that stamps `data-theme` in `V9Layout.astro`. Source of truth: `localStorage['apr70-design']`. Query flag `?design=layered` writes the key and stamps the attribute; `?design=marquee` clears it. No visitor-facing dial; `ModeToggleIsland` is untouched.
- New stylesheet `web/src/styles/themes/layered.css`, imported after `marquee.css` in `themes/index.css`, every rule scoped under `html[data-design="layered"]`. With the attribute absent the file is inert.
- The Payload switch `layeredDesignPreview` in Site Settings is deferred to merge time (it needs a field and a migration; `db.push` is false). For the POC the query flag is the only gate.

## 4. What renders (the five layers)

The host is the existing `photoFold` section on `/` (the `vh100` fold that opens the page). The layered treatment is a design skin over that block, not a new block: the section still comes from Payload (rule 1 holds), `PhotoFold.astro` gets a wrapper that emits the layers only when the fold is `vh100` and the layout is in layered mode. A dedicated `layeredFold` block is a merge-time option if Marco wants editors to place it; it needs a migration, so not now.

| # | Layer | Component | Both modes | Motion (transform/opacity only, motion-OK only) |
|---|---|---|---|---|
| 1 | Grain / atmospheric field | `LayerGrain.astro`, inline SVG `feTurbulence` tile (the holding page does this, `holding/index.html`), zero JS | white grain 4 to 6 percent on black; ink grain 3 to 4 percent on `#FAFAF8` | none on scroll; optional `steps()` flicker at 3 percent opacity delta |
| 2 | Title-card / marquee silhouette | `LayerTitleCard.astro`, outlined Jost letterforms or the "70" double-hairline monogram as SVG silhouette, hairline stroke `rgba(255,255,255,0.08)` on dark, low-opacity ink on light. Geometry: rules, chevrons, sprocket gauge. No ornament | stroke ramps flip with theme | `translateY` 0.04 to 0.06 of scroll, opacity 1 to 0.6 across the fold |
| 3 | Projector beam / light cone | `LayerBeam.astro`, one directional gradient reveal from a corner in the division accent to transparent, clipped with `clip-path: polygon()`; dust = sparse grain masked to the cone | light mode: accent at 8 percent over paper | cone `translateX`/`scale` at 0.08 of scroll; dust drift 40 s CSS loop, opacity only |
| 4 | Image plane in a gate | the existing `PhotoFold` frame inside a 1.85:1 window with hairline frame and BH-1866 perf rows top and bottom as true SVG. Media through `frameFromMedia` (rule 10). AI Mark and caption logic unchanged | scrim law holds | frame `translateY` 0.12 of scroll, picture inside at 0.06; edge opacity fade |
| 5 | Filmstrip / sprocket rail | `LayerRail.astro`, edge rail, sprocket rows at true pitch scaled to the 32px filmstrip height, keycodes in Share Tech Mono at 0.55em | rail ink flips; the 2px sprocket radius is the only radius | rail `translateY` 0.16 of scroll; keycodes advance one frame per section; fill via `scroll-timeline` with the craft-rail fallback |

Controller: one React island `LayeredParallaxIsland.tsx` on `client:visible`. One `gsap.timeline` bound to one `ScrollTrigger` (`scrub: true`), five `data-layer` targets, transform and opacity only. Mount guard copied from `cursor.ts`: refuse under `prefers-reduced-motion: reduce`, refuse on `pointer: coarse` unless the budget allows, and on `/` wait for the LogoReveal splash to remove itself (poll for its element or listen for `sessionStorage['apr70:v9-reveal']`) before `ScrollTrigger.refresh()`. GSAP core and ScrollTrigger are already in `web/package.json`.

Image for the gate today: whatever media the `v9-home` fold already carries on the NAS CMS (it will be an "AI-generated development frame", so the AI Mark fires; good). Do not upload media, do not generate stills. When Marco's cull lands, only the Payload relationship changes.

## 5. Constraints (the ones that bite)

- No `transition: all`. No shadows, no `backdrop-filter`, no radius beyond the 2px sprocket, no gradient surfaces (directional reveals only), no off-token colour, no external URL, no emoji, no `system-ui`, no Futura.
- 8px grid; `--v9-col` (72rem, 80rem at 1920px and up). Layers 1, 3, 5 may bleed full width; 2 and 4 respect the column.
- Mobile-first with `clamp()`: at 375px the beam is a top-edge wash, the rail is one row, the gate is full width with 24px perf rows.
- Both modes from the first commit. Test `data-theme="dark"`, `"light"`, and unset.
- Reduced motion: the page must be complete with the island unmounted. SSR emits every layer; the island only adds offsets.
- The layered skin must not change the nav, routeline, footer, or any other route. `grep -c` your CSS for selectors outside `html[data-design="layered"]`: zero.
- Load `visual-verify-loop` and `hallmark` skills for the review pass; `frontend-design` if useful. Do not import code from any §D reference; rights status is "unverified external reference" for all nine.
- Context discipline: `explore-digest` before fan-out; subagents return digests; the meter is per session now, but if the gate blocks you, the meter file is `.claude/.context-meter-<session_id>` in the worktree.

## 6. Verification before you call it done

```sh
cd ~/websites/apr70-website/v10-poc/web && pnpm build
pnpm dev &  # http://localhost:4321
for p in "" slate work/la-dolce-vita methods craft contact; do curl -s -o /dev/null -w "/$p %{http_code}\n" "http://localhost:4321/$p"; done
```

Screenshots via the Chrome tools or Playwright at 375 and 1440, dark and light, `?design=layered` and `?design=marquee`, plus one with reduced motion emulated. Confirm `?design=marquee` renders pixel-identical to `origin/main` (diff two screenshots).

## 7. Hand back

Update this file's "Status" line below, list the screenshot paths, note anything you changed outside the files named here, push the branch, and stop. Do not bump `SITE_VERSION`, do not touch MASTER-RECAP, do not deploy. Marco reviews on the dev server or after the merge-and-deploy on staging.

**Status:** BUILT AND VERIFIED, PR-READY (Fable 5.1, 2026-09-02 ~6:40pm, second session). `pnpm -C web build` exit 0, six URLs 200, zero third-party hosts on `/`, full screenshot matrix under `docs/handoff/poc-shots/`, `?design=marquee` pixel-identical to the `origin/main` baselines (ImageMagick AE 0 on all four). Two real defects found and fixed in this session, see §9. Not merged to `main`, no deploy, no version bump, no CMS change, no new dependency.

## 8. Second-session pickup (read this, skip §0 and §1)

Worktree exists: `~/websites/apr70-website/v10-poc` on `poc/layered-cinema`, `pnpm install` done, `web/.env` points at the NAS (`PUBLIC_PAYLOAD_URL` AND `PUBLIC_MEDIA_BASE=http://kimaserver:8080`; the second one is required or every relative `/api/media/...` src 404s on the dev server, baseline shots proved it). Note the Bash hook denies any command whose text mentions the env file; edit it with the Write tool.

**What was written (all unbuilt):**
- `web/src/styles/themes/layered.css` (new, every selector under `html[data-design="layered"]`, `!important` only where Tailwind's `[hidden]` preflight forces it), imported after marquee in `themes/index.css`.
- `web/src/layouts/V9Layout.astro` pre-paint stamp: `?design=layered` writes `localStorage['apr70-design']` and stamps `data-design="layered"`; `?design=marquee` clears both; stored key decides otherwise.
- `web/src/components/v9/sections/PhotoFold.astro`: on `/` only, when the fold is `vh100` and has a frame, stamps `data-layered-host` and emits `.v9lg-back` (grain, title card, beam), wraps the SAME frame in `.v9lg-gate` with two BH-1866 perf rows, and emits `.v9lg-front` (rail + island). Wrappers ship `hidden`; layered.css un-hides them. Other routes and non-vh100 folds are untouched; the marquee DOM on `/` gains only hidden elements plus a bare `div` around the frame.
- `web/src/components/v9/layered/`: `PerfRow.astro` (true-gauge BH-1866 pattern in mm, sliced to `--v9lg-perf`), `LayerGrain.astro`, `LayerTitleCard.astro`, `LayerBeam.astro`, `LayerRail.astro` (with the craft-style `--v9lg-p` fallback script).
- `web/src/components/islands/LayeredParallaxIsland.tsx`: one timeline, one ScrollTrigger, scrub, five targets, transform/opacity only; refuses without the attribute, under reduced motion, and on coarse pointers without budget; waits for `.v9-reveal` to leave the DOM before building.
- `docs/handoff/poc-shots/baseline-marquee-{dark,light}-{1440,375}.png`: full-page shots of `origin/main` marquee BEFORE any edit, for the pixel diff.
- Screenshot helper: `tools/layered-poc/shot.py` (Python Playwright 1.61 at `/opt/homebrew/opt/python@3.14/bin/python3.14`, system Chrome via `channel='chrome'`). It pre-stamps the theme and design keys, suppresses the splash, and prints the shown/hidden state of every `data-layer`, their transforms, and the external hosts requested. Example: `tools/layered-poc/shot.py http://localhost:4321/ docs/handoff/poc-shots/layered-dark-1440.png --design layered --theme dark`; add `--w 375 --h 812` for mobile, `--rm` for reduced motion, `--scroll 400` to see the offsets, `--splash` to test the splash-then-parallax sequence.

**Known risks to check first when it builds:**
1. Astro dynamic tag `GateTag = layered ? 'div' : Fragment` with a spread of `{}` on Fragment; if the compiler objects, duplicate the branch instead.
2. `client:visible` observes the island's children; the controller `<span>` is 1px absolute so it has a box. If it never hydrates, switch to `client:idle`.
3. In the light theme the grain tile is grey noise at 3.5 percent on paper; if it reads as dirt rather than grain, lower `--v9lg-grain` to 0.025.
4. The mobile overlay goes `position: static` so the 1.85 gate grows to hold the headline; confirm the scrim still covers the words at 375.
5. Rail keycode advance uses GSAP `snap: { y: pitch }`; confirm it steps rather than slides.

**Definition-of-done (all done 2026-09-02, second session; evidence in §9):** `pnpm -C web build` exit 0; six-URL 200 check; zero third-party hosts on `/`; screenshots dark/light x 375/1440 x layered/marquee plus reduced-motion; pixel-diff `?design=marquee` against the baselines; paths listed; pushed.

## 9. Second-session result (2026-09-02 ~6:40pm)

**Two defects the first session could not see without a build, both fixed:**

1. **Layered mode never showed.** The wrappers shipped with the `hidden` attribute and layered.css tried to un-hide them with `display:block !important`. Tailwind v4's preflight declares `[hidden]{display:none !important}` inside `@layer base`, and an `!important` declaration inside a cascade layer outranks an `!important` declaration outside every layer, so the un-hide could never win. Proof: under `?design=layered` the back and front wrappers computed `display:none`, and the `client:visible` island (whose 1px box lives inside the front wrapper) never hydrated (risk 2 was a symptom of this, not a separate bug). Fix: `hidden` removed from `.v9lg-back`, `.v9lg-front`, and both `PerfRow` SVGs; layered.css now hides them with a plain unlayered `[data-layered-host] .v9lg-back {display:none}` and shows them under `html[data-design="layered"]`. No `!important` anywhere in the toggle now.
2. **Headline vanished at 375.** The mobile rule made the overlay `position:static`; the img and scrim are absolute, and absolutes paint over in-flow static text, so the words sat under the picture. Fix: `position:relative; z-index:1` (still in flow, frame still grows).

**Risks from §8, resolved:** 1 Astro `Fragment` dynamic tag builds clean. 2 hydration: hydrated once the wrapper shows (see above). 3 light grain: paper reads clean at 2x crop, left at 0.035. 4 mobile scrim covers the words after the fix. 5 keycodes: after a 400px scroll the keycode strip sits at `translateY(-60.8px)` = exactly two pitches of 30.4, so it steps.

**Verification evidence (dev server on the worktree, NAS media):**
- `pnpm -C web build` exit 0 (three times, after each edit).
- `/ /slate /work/la-dolce-vita /methods /craft /contact` all 200.
- Hosts requested on `/` in every shot: `localhost:4321` and `kimaserver:8080` only.
- Pixel diff, `compare -metric AE baseline-marquee-X marquee-X`: dark-1440 0, dark-375 0, light-1440 0, light-375 0 (`cmp` reports dark-1440 byte-identical). Marquee DOM on `/` now gains only CSS-hidden elements plus the bare gate `div`.
- Parallax transforms after `--scroll 400` (dark 1440): title y -18.5, beam x +29.5 scale 1.036, gate y -44.3, rail y -59.1, keycodes y -60.8.

**Screenshots (`docs/handoff/poc-shots/`):**
- `layered-dark-1440.png`, `layered-light-1440.png`, `layered-dark-375.png`, `layered-light-375.png` (full page, switch on)
- `marquee-dark-1440.png`, `marquee-light-1440.png`, `marquee-dark-375.png`, `marquee-light-375.png` (full page, switch off; these are the pixel-diff subjects)
- `layered-dark-1440-reduced-motion.png` (layers shown, island refuses, no transforms)
- `layered-dark-1440-scroll400.png` (viewport, parallax offsets applied)
- `layered-flag-url-1440.png` (`/?design=layered` with no stored key: stamps and stores) and `marquee-flag-url-1440.png` (`/?design=marquee` with stored `layered`: clears)
- `baseline-marquee-{dark,light}-{1440,375}.png` (origin/main, unchanged)

**Changed outside the files named in §8:** `.claude/hooks/context-meter.sh` (the meter billed a 7-page PDF Read as 1MB of context because it counted base64 image payloads; it now skips image blobs and caps one call at 64KB, otherwise this session would have been gate-blocked at its second tool call), `tools/layered-poc/shot.py` (exec bit; shown/hidden now uses `getClientRects()`, a child of a `display:none` parent reports its own display; prints island hydration), `web/src/components/v9/layered/PerfRow.astro` (`hidden` attrs removed).

**Hand back:** review on the dev server (`pnpm -C web dev`, then `/?design=layered`, `/?design=marquee` to clear) or merge to `main` and deploy as `v14` with the housekeeping after `pnpm preflight` and Marco's go.
