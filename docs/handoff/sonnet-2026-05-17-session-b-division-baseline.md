# Handoff: V0-Baseline Revision Pass — 2026-05-17 07:20 EDT

**Written by:** Opus 4.7 (cleanup + Marco's feedback for next Sonnet agent).
**Phase done:** Session B — first v0-baseline cut shipped as commit `f42a061`. **Marco has rejected it** in current form and wants the revisions below before any visual sign-off.
**Phase next:** Re-cut **V0** as a numbered series (V0.1, V0.2, V0.3, V0.4). No filmstrip work yet.

---

## Read this first — Marco's feedback (verbatim intent)

The current v0-baseline at `localhost:4322/dev/division-variants` is NOT approved. Address all eight items below in the next pass. **Do not touch the filmstrip variant (V5) in this pass.** Lock V0 first.

### 1. NRC color is wrong
NRC primary is **off-white**, secondary is **NRC Navy** (`#001F3F`). Current code likely has it inverted or treating Navy as primary. Fix in the division color mapping inside `DivisionBlock.astro` (and confirm against `web/src/styles/tokens.css` + the `colors_divisions.html` reference).

### 2. Left stroke / colored division-color line — hover only, never static
The colored vertical line that echoes division primary is fine to keep, but it must:
- Be **invisible by default**.
- Reveal on **hover of the title card** as a slow stroke draw from **top → bottom**.
- Duration: **1.5s**.
- Use `transform: scaleY()` from `transform-origin: top` (or SVG `stroke-dasharray` if SVG), animating `transform` only — never `transition: all` (CLAUDE.md rule #3).
- If we can't make the reveal feel right, **eliminate the line entirely**. Static colored bar = unacceptable.

### 3. "212" repeated three times in a tiny area is a dealbreaker
Current layout shows "212" as the big code, AND in "(212) PICTURES", AND probably again as eyebrow/meta. **Marco will literally vomit.** Pick one prominent display and let the others fall away (or render as type-locked tags, monogram ligature, etc.). Be creative. Reference the standalone HTML: `/Users/marco/websites/apr70-website-reference-repository/APR70-Pictures-Standalone.html`.

### 4–5. Editorial content — provide the slots, Marco will edit in Payload
The block should expose enough slots that Marco can paste this content (or trim it) via the Payload admin. Leave the fields in place even when empty — don't hardcode. Target content shape:

```
APR 70 — EST. 2026
The classics never go out of style.

[Manifesto paragraph: ~3–4 sentences about specialized divisions, subtext, atmosphere, ingenious writing.]

01 / DIVISION — (212) PICTURES · NEW YORK TV LABEL
  Tagline lines (stacked):
    New York.
    Television.
  Description: Character-driven drama, crime, documentary rooted in the American Northeast.
                Named for the original Manhattan area code.
  Project list (title + meta badge, repeatable):
    A NEED GROWS IN BROOKLYN — 10 EPS
    THE MAYORS — DOC · 11 EPS
    THE MALTESE FALCON — STAGE
    ALPHA YY — TV
    THE MOVEMENT — TV
  CTA: Enter division →

02 / DIVISION — (310) PICTURES · LA / GLOBAL TV LABEL
  Tagline: Los Angeles. / Global.
  Description: Elevated genre — political thrillers, sci-fi, hybrid formats.
  Project list:
    L.A. DOLCE VITA — $30–50M
    L'ODISSEA DI CLEOPATRA — $40–80M
    SHADOWMASTER — HYBRID
  CTA: Enter division →

03 / DIVISION — NEW RENAISSANCE CINEMA · FEATURE FILM
  Tagline: Features. / Auteur.
  Description: Auteur-driven feature films. Classic-modern sensibility.
  Project list:
    U BRUCCULINU — FEATURE
    ALPHA YY — FEATURE
  CTA: Enter division →
```

Slot strategy: the Payload `DivisionBlock` schema should accept (a) header manifesto block, (b) repeatable division rows where each row has `number`, `code`, `name`, `subtitle`, taglineLines[], description, projects[] (title + badge), CTA. Don't break the existing block contract — extend it.

### 6. Bring back Gemini's crosshair / registration / printer marks
Gemini's previous pass had **corner crosshairs / registration marks** on the cards — bring those back as decorative trim at card corners. Style them like film registration marks or printer crop marks (thin lines, mono color, small `+` or `L` shapes at corners). Use `var(--rule)` color. They're decorative; keep them subtle.

### 7. No filmstrip this pass
Do **NOT** touch `DivisionFilmstripV5.astro` or any filmstrip code. Lock V0 first. Filmstrip = next phase only after V0 is signed off.

### 8. Version the variants — V0.1 through V0.4
Start numbering. Current shipped state (commit `f42a061`) = **V0.0** for reference. Next pass should produce:
- **V0.1** — current layout with the fixes above applied (NRC color, stroke-on-hover, no "212"×3, crosshairs).
- **V0.2**, **V0.3**, **V0.4** — three additional V0 variants exploring different editorial layouts (different grid splits, different display-code treatments, different mark positions). Same content slots, different art direction.

All four variants visible at `localhost:4322/dev/division-variants` for Marco to pick from. After approval, the chosen variant moves into the Payload block as the production variant; the same versioning scheme (`Vx.y`) carries over to V1, V2, V3, V4 (and V5 filmstrip later).

---

## Constraints (re-read, do not skip)

`CLAUDE.md` rules 1–15. Especially relevant here:
- Rule 1: no hardcoded page layouts. Block-stack only.
- Rule 2: no new colors outside locked palette (`tokens.css`).
- Rule 3: **no `transition: all`.** Animate `opacity` / `transform` / explicitly named props.
- Rule 7: GSAP only for any JS-driven animation. CSS transitions are fine for the hover stroke if implemented as `transform: scaleY()`.
- Rule 8: dark AND light mode from day one. Off-white NRC needs to read well in both.
- Rule 14: context gate hard-blocks at ~250KB tool output — write handoff + commit + retire before hitting it.
- Rule 15: keep exactly **one** handoff at top of `docs/handoff/` (this file). Move any prior to `docs/handoff/archive/` on session start.

---

## Reference materials

- Standalone HTML: `/Users/marco/websites/apr70-website-reference-repository/APR70-Pictures-Standalone.html`
- Design system previews: `/Users/marco/websites/apr70-website-reference-repository/design-system-reference/preview/` — see especially `colors_divisions.html`, `type_display.html`, `type_meta.html`, `spacing_scale.html`.
- Brand monogram / sprocket: `brand_logo_sprocket_variants.html`, `brand_monogram_favicon.html`.

---

## What just shipped (V0.0 — REJECTED)

Commit **f42a061** — `feat: v0-baseline Division CSS redesign — Sight & Sound editorial`
One file changed: `web/src/components/blocks/DivisionBlock.astro` (+54 / -33).

Moves that landed in V0.0:
- Codes scaled to `clamp(4rem, 10vw, 8rem)` with leading-crush.
- Ghost watermark numeral behind grid (`22vw`, opacity 0.04, z-index stacking).
- Hover: `translateY(-2px)` lift + full opacity on code.
- Hardcoded `rgba(255,255,255,0.15)` borders → `var(--rule)`.
- Meta type → `var(--type-micro)` + `var(--track-eyebrow)`.
- Transitions → `var(--ease-out)` / `var(--dur-base)`.
- Row padding `--s-10` → `--s-9`.

Keep what works (token migration, ghost watermark, transition tokens). Revisit the rest per the feedback above.

---

## Verification checklist for next agent

- [ ] NRC reads off-white primary / Navy secondary in both light + dark modes.
- [ ] Hover stroke draws top→bottom over 1.5s using `transform`, not `transition: all`.
- [ ] No "212" / "310" / "NRC" repeated more than once in a single card's visible area.
- [ ] Corner registration marks present, subtle, `var(--rule)` color.
- [ ] Content slots in Payload schema match the editorial content shape above.
- [ ] V0.0 layout still loadable at `/dev/division-variants` for comparison.
- [ ] V0.1, V0.2, V0.3, V0.4 all rendering side-by-side on `/dev/division-variants`.
- [ ] **No** edits to filmstrip code.
- [ ] `pnpm preflight` from `cms/` exits 0 before any NAS push talk.

---

## Why a previous Sonnet agent was retired

Started 2026-05-16 21:21 EDT (PID 28536). Completed V0.0 work and committed `f42a061` at 22:17 EDT. After that the session hung in a stop-hook loop (db9e144 → 0229e1f → 62f8a6a → a027f97 auto-commits). Opus 4.7 wrote this handoff and killed the process. No code was lost; the rejection above is Marco's response to the V0.0 visual, not to the agent itself.

---

## Pointer recap

1. Read `BRIEF.md`.
2. Read this file end-to-end.
3. Open `web/src/components/blocks/DivisionBlock.astro` and `web/src/pages/dev/division-variants.astro`.
4. Open the standalone HTML reference.
5. `pnpm dev` in `web/` → preview at `http://localhost:4322/dev/division-variants`.
6. Ship V0.1 + V0.2 + V0.3 + V0.4 in one commit; do not touch V5.
