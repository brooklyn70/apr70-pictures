# Stitch Output — Division Showcase Variants
**Generated:** 2026-05-18 by Claude Sonnet 4.6  
**Stitch Project:** APR 70 Pictures — Division Showcase  
**Project ID:** `3884326936106951139`  
**Design System Asset:** `c12e1d9837594aa9be2761ce1ecf907c`  

---

## What Stitch was given

- **Design system:** DESIGN.md front matter (colors, typography, spacing, components) uploaded via MCP
- **Prompt basis:** Full Field 5 prompt from `docs/handoff/google-stitch-brief.md` (the Division Showcase constraints + vocabulary)
- **Model:** Gemini 3.1 Pro

The `generate_variants` call used the DESIGN.md screen as the source canvas — not the actual V0.3 HTML. This means the variants are *from-scratch interpretations* of the brand tokens, not redesigns of V0.3. See the retirement handoff for how to do a V0.3-based generation next time.

---

## Variant 1 — The Vertical Strip

**Screen ID:** `0415f6b9b7c5453aaa742ab629ff6cc2`  
**Dimensions:** 2560 × 2048

**Rationale:** Three equal full-height columns, each division as a vertical strip filling the viewport. Sprocket-hole rails run left/right of each column via CSS `radial-gradient`. Division name is set in vertical writing mode (`writing-mode: vertical-rl; rotate(180deg)`), sequence number (01/02/03) in the division's primary accent color top-left. Background imagery (grayscale at rest → color on hover). Bottom of each strip has a tagline + outlined CTA button. Reveal animation: `revealUp` with `cubic-bezier(0.16, 1, 0.3, 1)`, staggered 100/200/300ms.

**Violations to fix before wiring in:**
- Uses `backdrop-filter: blur` on the tagline footer area (not permitted)
- `transition-all` appears in nav (use specific properties)
- Placeholder images from Google aida-public CDN — replace with real Payload Media

**Screenshot:** `https://lh3.googleusercontent.com/aida/ADBb0ujxUmgDd-pTEtx6TSVYsddhrCWQEsNpPEBZneCbnVwybco-KAuYHrktXyywXEwZ2F3ghVXUUunpQ8nKYZKIvfhkFX6NtXmPQruLsVK-tcgjKA4Gsm3TFYOyxyXSdZaeKXk0I2UixKwfDISsIwneGmHYjTRyPnpOK5LcmFgAP2Lyitu-XedR8LJipWY9EgFAFYi6o-dDeeAQHau3UCQtr37WnJTarQma5vIOtWHv48O4230tY5p_WK4DKws`

<details>
<summary>Full HTML (V1 Vertical Strip)</summary>

Download from Stitch project or see `/tmp/stitch-v1-vertical.html` (session temp — re-download if needed via screen ID above).

Key CSS pattern:
```css
/* Sprocket holes via CSS radial-gradient */
.sprocket-rail-vertical {
  background-image: radial-gradient(circle at center, #131313 2px, transparent 2px);
  background-size: 100% 24px;
  background-position: center top;
  width: 12px;
  height: 100%;
}

/* Vertical text */
.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
}

/* Reveal animation — uses brand ease */
@keyframes revealUp {
  from { opacity: 0; transform: translateY(100px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-reveal {
  animation: revealUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}
```
</details>

---

## Variant 2 — The Vignelli Grid

**Screen ID:** `b91789fc443641529a2e2c7f21c70bb6`  
**Dimensions:** 2560 × 2290

**Rationale:** Pure typographic grid in Vignelli transit-map discipline. Three equal columns separated by 2px border rules. Each zone: mono eyebrow (`01 // INDEPENDENT`), large h2 division name, 4px accent bar (`h-s-1 w-s-8`), body description, stats table in mono. Zero images. Color identity delivered only via the accent bar and eyebrow. The `slide-in-up` animation uses the brand ease. This is the most editorially disciplined of the three — zero decoration, maximum grid.

**Violations to fix:**
- `transition-all` in nav links
- Column borders use `surface-bright` (#393939) — check against V0.3's `--rule` token
- Stats table has placeholder numbers (ACTIVE SLATE 04, EST. 2015) — replace with real data

**Screenshot:** `https://lh3.googleusercontent.com/aida/ADBb0uihvNGpC9OaWtvgoDDYModX3ScBrwKPRDXTJey2anVmoEUzzpgy_SAijpqEZeZVUMtU1NQYuIvPTzwcjrI9r42xyeNoeroySNplGu1_RUqSMz-umlXLczLs1DbgHzm9ZjatmoNrnVVIUcvtTn98Xu0NXytCLaXGah3mSf0QPPFhS8veobQnby0JkuLuVJ2Foyk_ngKrXeXtp-6MllpnFgsTBIDNTaZbDz0hTOTrPMJJQsKipdWBfZNCv38`

<details>
<summary>Key CSS pattern (V2 Vignelli Grid)</summary>

```css
.slide-in-up {
  animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(40px);
}
@keyframes slideInUp { to { opacity: 1; transform: translateY(0); } }

/* Accent bar */
.h-s-1.w-s-8 { height: 4px; width: 64px; } /* 4px × 64px — on-brand */
```

Structure per division zone:
```html
<section class="flex-1 border-r-2 border-surface-bright p-s-8 flex flex-col justify-between group">
  <div class="font-meta-mono text-[#E85D04]">01 // INDEPENDENT</div>
  <h2 class="font-h2 text-h2">212<br/>PICTURES</h2>
  <div class="h-s-1 w-s-8 bg-[#E85D04]"></div>
  <p class="font-body-md text-fg-muted">...</p>
  <!-- Stats table in mono -->
</section>
```
</details>

---

## Variant 3 — The Cinema Trade

**Screen ID:** `2c95fca39d4b4ff8affcf478234eb245`  
**Dimensions:** 2560 × 3896 (tallest — portrait editorial)

**Rationale:** 1930s–40s cinema trade magazine editorial. Three-column article grid. Each article: 4px top rule in division accent color, `LOC:NYC // DIV:212` in Share Tech Mono keycode style, large h2 name, portrait-ratio image (grayscale → color on hover), body description, "See Projects →" CTA. A filmstrip rail divider with sprocket holes (`width: 13px; height: 13px; border-radius: 2px`) runs across the full width below the columns. The `track-in` animation on the hero headline uses letter-spacing as the reveal axis.

**Violations to fix:**
- `transition-all duration-700` on images — replace with `transition: filter 0.7s ease, opacity 0.7s ease`
- Placeholder images need Payload Media relationships
- `arrow_forward` Material Icon in CTA — replace with CSS arrow `→` or SVG

**Screenshot:** `https://lh3.googleusercontent.com/aida/ADBb0uj10ZwekrSVR4M0sftZDXqKbCnwRcFZ_UukaNaHm30owsn11cP0QOGDft57e4DnlTen_YmLE0AR381Gr6m9HavNBL_DNmHzbNW3nOd_HkgjuqIJSVCWdA2PZ8vwxqpbXNywW5OtqanZWApnBcu1h6qL-pU5gzuLYCN11Pj_A8bgk6C0V1CV27Kn0lSpPtah1CfwutuZIxnqvaFh2HWFds_NlCzXC5WJGSiHgUXY4m66bHC5T-CbfdRM89g`

<details>
<summary>Key CSS pattern (V3 Cinema Trade)</summary>

```css
/* Sprocket hole component */
.sprocket-hole {
  width: 13px; height: 13px;
  background-color: #131313;
  border: 1px solid #4c4546;
  border-radius: 2px; /* permitted — this is the sprocket hole */
  display: inline-block;
}

/* Track-in animation — letter-spacing reveal */
.track-in {
  animation: trackIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes trackIn {
  0%   { letter-spacing: -0.05em; opacity: 0; }
  100% { letter-spacing: -0.02em; opacity: 1; }
}

/* Staggered article reveal */
.fade-up-seq:nth-child(1) { animation-delay: 0.1s; }
.fade-up-seq:nth-child(2) { animation-delay: 0.3s; }
.fade-up-seq:nth-child(3) { animation-delay: 0.5s; }
```

Top-rule pattern per article:
```html
<article class="fade-up-seq group">
  <div class="border-t-4 border-212-amber pt-s-4 mb-s-6">
    <p class="font-keycode text-212-amber">LOC:NYC // DIV:212</p>
    <h2 class="font-h2 uppercase">212 Pictures</h2>
  </div>
  <!-- portrait image, description, CTA -->
</article>
```
</details>

---

## Next steps

1. Marco reviews screenshots above and picks a direction.
2. Hand chosen HTML to Opus with instruction: "wire this into `DivisionBlock.astro` as `variant: 'v6'`, fix the listed violations, replace all placeholder images with `division.media` Payload relationships, add to dev preview route."
3. Dev preview at `http://localhost:4323/dev/division-variants` — add new variant to `variantMeta` array.
4. If none satisfy — see retirement handoff for how to send the ACTUAL V0.3 HTML to Stitch for a more targeted iteration.
