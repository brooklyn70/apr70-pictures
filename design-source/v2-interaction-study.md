# APR 70 v2 — Signature Interaction Port Spec

Source: `/Users/marco/websites/APR_70` (frozen, read-only). Root `index.html` is an
unrelated KIMA placeholder page (CSS-only `fadeUp`) — the real v2 app lives in
`src/`. All interactions below are sourced from `src/components/` and
`src/app/**`. Target: Astro + GSAP, GSAP-only motion, no tickers, reduced-motion
collapses to static, cursor layer hidden on touch.

## Inventory

| # | Interaction | Mechanism | Source | Trigger |
|---|---|---|---|---|
| 1 | Trailing-dot cursor | GSAP tween to pointer coords | `CustomCursor.tsx` | `mousemove` |
| 2 | Block reveal (fade+rise) | GSAP `fromTo` + ScrollTrigger | `Reveal.tsx` | scroll into view, once |
| 3 | Line-level masked text fly-in | split-type + GSAP `yPercent` | `about/pitch/jobs` Client.tsx | scroll into view, once |
| 4 | Logo splash intro | GSAP timeline, SVG attr swap + blur | `LogoReveal.tsx` | homepage mount |
| 5 | Nav entrance stagger | CSS keyframe on mount | `globals.css` `.nav-item-enter` | Nav mount |
| 6 | Nav/footer hover underline | CSS `::after` scaleX | `globals.css` | `:hover`/`:focus-visible` |
| 7 | Project hero wipe | View Transitions API clip-path | `globals.css` + `ProjectSwipe.tsx` | project-to-project nav |
| 8 | Slate card hover lift | CSS transform, `hover:hover` gated | `globals.css` `.slate-card*` | `:hover` |

---

## 1. Trailing-dot cursor

```js
const onMove = (e) => {
  if (!visible) setVisible(true);
  gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.75, ease: "power3.out" });
};
```
7px circle, `background: rgba(255,255,255,.9)`, `mix-blend-mode: difference`,
`z-index: 9999`, translate(-50%,-50%), opacity fades in over 0.2s CSS transition
on first move. Body-wide CSS fallback is `cursor: crosshair`.
**Trigger:** raw `mousemove`, no rAF batching — a fresh GSAP tween is fired per event.
**Degrade:** component bails entirely (never renders visible) when
`(pointer: coarse)` or `(prefers-reduced-motion: reduce)` matches — crosshair
CSS cursor is the sole fallback in both cases. Correctly touch-safe already.
**Port verbatim vs improve:** improve. Replace the per-event `gsap.to` with
`gsap.quickTo(dot, "x", {duration:.75, ease:"power3.out"})` /
`quickTo(dot,"y",...)` — same feel, avoids spawning a tween per mousemove.
Keep the touch/reduced-motion bail verbatim; also unmount (not just hide) the
listener on coarse pointers so it costs nothing on mobile.

## 2. Block reveal (Reveal.tsx)

```js
gsap.fromTo(el, fromVars, {
  opacity: 1, y: 0, x: 0, duration: 0.75, delay: delaySec, ease: "power3.out",
  scrollTrigger: { trigger: el, start: `top ${Math.round((1-threshold)*100)}%`, once: true },
});
```
Travel distance 28px (48px for `.reveal-heading`), duration 0.75s, ease
`power3.out`, default threshold 0.12 → trigger start ≈ `top 88%`, fires once.
Directions: `up` (y), `left` (x), `fade` (opacity only).
**Trigger:** ScrollTrigger, element enters viewport, one-shot.
**Degrade:** explicit — `prefers-reduced-motion` short-circuits to
`gsap.set(el, {opacity:1,y:0,x:0})`, i.e. a real static collapse, not a skip.
**Port verbatim vs improve:** port verbatim. This already matches the target
contract exactly (GSAP-only, ScrollTrigger once, reduced-motion → static set).
Optional cleanup: replace the manual per-instance `delay` prop with a parent
`gsap.timeline({stagger})` when multiple `Reveal`s fire together, for tighter
stagger control.

## 3. Line-level masked text fly-in ("typography fly-ins")

```js
const split = new SplitType(el, { types: "lines" });
split.lines.forEach((line) => {
  const mask = document.createElement("span");
  mask.style.cssText = "display:block;overflow:hidden;";
  line.parentNode.insertBefore(mask, line);
  mask.appendChild(line);
});
gsap.fromTo(split.lines, { yPercent: 110 }, {
  yPercent: 0, stagger: 0.04, duration: 0.7,
  ease: "cubic-bezier(0.16, 1, 0.3, 1)",
  scrollTrigger: { trigger: el, start: "top 88%", once: true },
});
```
Used on `[data-split-reveal]` elements in About/Pitch/Jobs pages. Each text
block is split into lines, each line wrapped in an `overflow:hidden` mask, then
lines animate up from `yPercent:110` (fully below mask) to `0`, staggered 0.04s
apart, 0.7s duration, expo-ish ease, ScrollTrigger fires once at `top 88%`.
**Trigger:** scroll into view, per split target, once.
**Degrade:** effect bails before the dynamic `split-type` import when
`prefers-reduced-motion` matches — text stays a normal unsplit paragraph, a
clean collapse. **Flaw to flag:** there's no CSS pre-hide on
`[data-split-reveal]`, so on first paint the plain (unsplit) text is fully
visible, then a frame later JS wraps it into masked lines and resets them to
`yPercent:110` — a visible flash/jump on slower devices or delayed dynamic
imports.
**Port verbatim vs improve:** improve. (a) Drop the extra `split-type`
dependency — GSAP-only constraint — and do the line split with GSAP's own
SplitText, or a minimal line-wrap helper. (b) Pre-hide via CSS
(`[data-split-reveal] { visibility: hidden }` flipped by JS right before the
mask/animate step) to remove the flash. Keep stagger 0.04 / duration 0.7 /
ease and the `top 88%` / once ScrollTrigger contract verbatim — that part reads well.

## 4. Logo splash intro (LogoReveal.tsx)

```js
tl.to(wrapper, { opacity: 1, duration: 0.8, ease: "power2.out" });   // dissolve in
tl.to({}, { duration: 0.3 });
HOLE_PAIRS.forEach(([a,b], i) => {                                    // sprocket climb
  tl.to({}, { duration: 0.1, onStart: () => { /* set fill color */ } }, "+=0.08");
});
tl.to({}, { duration: 0.2 });
tl.to(wrapper, { filter: "blur(12px)", opacity: 0, duration: 0.8, ease: "power3.in" }); // out
```
Full sequence: dissolve-in 0.8s → pause 0.3s → 5 sprocket-hole pairs recolor
bottom-to-top, each a 0.1s beat spaced `+=0.08s` apart (color set via
`onStart`, not tweened) → pause 0.2s → blur-out 0.8s. An 8000ms safety
`setTimeout` force-fires `onComplete` if the timeline stalls; `onComplete`
itself is debounced 200ms after the timeline finishes.
**Trigger:** unconditional on homepage mount, gates the showreel behind it.
**Degrade:** none found. No `prefers-reduced-motion` or touch check anywhere
in the component — it always plays the full ~2.3s sequence for every visitor.
Also uses `filter: blur(12px)`, which the codebase's own CSS comments
elsewhere explicitly warn against ("no filter:blur — non-compositable, delays
mobile LCP") — an internal inconsistency.
**Port verbatim vs improve:** improve. Add a `prefers-reduced-motion` guard
that skips straight to a short opacity-only cut (call `onComplete` near-
immediately). Replace `filter:blur` with a compositable opacity/scale exit to
match the codebase's own stated perf guidance. Keep the sprocket-climb timing
(0.1s beats, 0.08s spacing, bottom-to-top order) — it's the distinctive part.

## 5. Nav entrance stagger

```css
@keyframes navItemEnter { from { opacity:0; transform: translateX(-10px); } to { opacity:1; transform: translateX(0); } }
.nav-item-enter { animation: navItemEnter 0.55s cubic-bezier(0.16, 1, 0.3, 1) both; }
```
Applied identically to every nav item on mount — all items animate
simultaneously (no per-index delay despite the name "stagger").
**Trigger:** CSS animation fires automatically on paint, not scroll-gated.
**Degrade:** no `prefers-reduced-motion` guard anywhere for this class.
**Port verbatim vs improve:** improve. Wrap in a GSAP `timeline({stagger:.05})`
per nav item for a true stagger, and gate the whole thing behind
`prefers-reduced-motion` (collapse to instant final state). Keep duration
0.55s / ease `cubic-bezier(0.16,1,0.3,1)` and the `translateX(-10px)→0` travel.

## 6. Nav/footer hover underline

```css
.desktop-nav a::after {
  content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 1px;
  background: currentColor; transform: scaleX(0); transform-origin: left;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.desktop-nav a:hover::after, .desktop-nav a:focus-visible::after { transform: scaleX(1); }
```
**Trigger:** `:hover` / `:focus-visible` — naturally inert on touch (no hover
event fires), no explicit guard needed.
**Port verbatim vs improve:** port verbatim, as plain CSS. Cheap, discrete,
already touch-safe; no reason to move it into GSAP.

## 7. Project hero wipe (section transition)

Native View Transitions API, not GSAP: `document.startViewTransition(...)`
with `transitionTypes: ["swipe-forward"|"swipe-back"]`, driving a named
`::view-transition-group(hero-swipe)` clip-path wipe:
```css
--wipe-duration: 1200ms; --wipe-ease: cubic-bezier(0.22, 1, 0.36, 1);
::view-transition-new(hero-swipe) { animation: sw-wipe-left var(--wipe-duration) var(--wipe-ease) both; }
@keyframes sw-wipe-left { from { clip-path: inset(0 0 0 100%); } to { clip-path: inset(0 0 0 0); } }
```
Persistent chrome (nav, filmstrips) is pinned above the wipe via z-index and
excluded from the transition (`animation: none !important`).
**Trigger:** internal project → project navigation in `ProjectSwipe.tsx`.
**Degrade:** `@media (prefers-reduced-motion: reduce)` forces
`animation-duration: 0s` on all `::view-transition-*` — instant cut, no wipe.
**Port verbatim vs improve:** improve — don't port the View Transitions API
itself (Astro is MPA-first; browser support/semantics don't map cleanly).
Reimplement as a GSAP `clip-path` tween on a wrapper element, same 1200ms /
`cubic-bezier(0.22,1,.36,1)` values and same directional
inset-from-right/left logic, collapsing to a hard cut under reduced-motion.

## 8. Slate/project card hover lift

```css
@media (hover: hover) {
  .slate-card-img { transform: scale(1.02); opacity:.82; transition: transform .5s ease, opacity .35s ease; }
  .slate-card:hover .slate-card-img { transform: scale(1.07); opacity: 1; }
  .slate-card:hover .slate-card-title { transform: translateY(-4px) scale(1.04); }
}
@media (prefers-reduced-motion: reduce) {
  .slate-card-img, .slate-card-title { transition: none !important; transform: none !important; }
}
```
Colored left "hover-bar" also grows 0→100% height on hover (not shown above).
**Trigger:** `:hover`, gated behind `@media (hover: hover)` — already excludes
touch/coarse pointers.
**Degrade:** explicit reduced-motion override strips transform/transition.
**Port verbatim vs improve:** port verbatim as CSS — both constraints
(hover-capable-only, reduced-motion) are already handled correctly. Only
consider a GSAP `quickTo`-driven version if this needs to sync with other
GSAP-timed hover state elsewhere; not necessary on its own.
