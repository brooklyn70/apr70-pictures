# Handoff — Stitch Round 2: Logo Integration + 3 New Variants
**Written by:** Claude Sonnet 4.6
**Date:** 2026-05-19 (session started May 18 ~9pm EDT)
**Status:** Round 2 screens generated and saved. Awaiting logo integration + 3 new variants.
**Branch:** main (clean)

---

## What happened this session

Round 1 Stitch variants (V1 Vertical Strip, V2 Vignelli Grid, V3 Cinema Trade) were rejected by Marco — they were generated from DESIGN.md tokens only with no reference to actual component code.

This session (Round 2): sent the real V0.1 and V0.3 component HTML/CSS to Stitch as reference. Generated:
- 1 V0.1 base iteration (3-column editorial grid)
- 3 V0.1 REIMAGINE variants (The Ledger, Technical Contact, The Blueprint)
- 1 V0.3 base iteration (ledger rows with projects)
- 3 bonus screens from variant cascade

HTML for all 8 screens saved to `docs/handoff/stitch-html-round2/`.

---

## Marco's feedback (verbatim direction for next session)

1. **Fonts — STRICT.** Only use fonts from the APR 70 style guide: Futura Std, Barlow, Share Tech Mono. Stitch defaults to Montserrat and Barlow Condensed — explicitly override in every single prompt. State: "Use ONLY Futura Std, Barlow, and Share Tech Mono. No Montserrat. No other fonts."

2. **No nav or footer.** Stitch tends to add navigation bars and footers. Every prompt must say "NO nav bar. NO footer. Section only."

3. **Company name is APR 70 Pictures.** The parent company is APR 70 Pictures. The three divisions are: (212) Pictures, (310) Pictures, New Renaissance Cinema (NRC). Stitch kept writing "New Renaissance" as if it were the company name — it's a division name. The company name in any heading or eyebrow text should be "APR 70 PICTURES".

4. **Logo integration is the priority.** Marco likes the directions generated so far but wants to see all existing variants with actual division logos implemented, plus 3 new variants designed with logos in mind from the start.

---

## The 8 Round 2 screens (Stitch project 3884326936106951139)

All HTML files are in `docs/handoff/stitch-html-round2/`.

| File | Screen ID | Title | Base |
|------|-----------|-------|------|
| `v01-base-editorial-grid.html` | `3f3d2103abec40098d2311ff45af4520` | Division Showcase V0.1: Editorial Grid | V0.1 |
| `v01-variant-ledger.html` | `a5bc8f90944741d1a381ae4e4e0a7976` | Master Slate V4: The Ledger | V0.1 |
| `v01-variant-technical-contact.html` | `cb8580d38606481ba776607b4ba1be04` | Master Slate V4: Technical Contact | V0.1 |
| `v01-variant-blueprint.html` | `2290170ec1c444889d12a734cafea119` | Master Slate V4: The Blueprint | V0.1 |
| `v03-base-ledger-rows.html` | `9f562e5f1eee42cfbfc6575e017399d7` | Division Showcase V0.3: Ledger Rows | V0.3 |
| `v03-ruled-column.html` | `6203d58e7e8b4b7c9077055a32b265e0` | Division Showcase V3: Ruled Column | V0.3 |
| `bonus-filmstrip-frames.html` | `a0c6d7cd36bc44398171483b1a81f6e8` | Division Showcase V1: Filmstrip Frames | bonus |
| `bonus-editorial-grid.html` | `a005e49a45e74901937b3c35f95554fb` | Division Showcase V2: Editorial Grid | bonus |

**V0.3 REIMAGINE variants were NOT generated** — that Stitch call was interrupted by Marco. Do not retry; just execute the new task described below.

---

## The division logos

These are the canonical hero SVG logos to use in Stitch prompts.

### (212) Pictures — `web/public/brand/apr70-logos/212-pictures/212_hero.svg`

**Visual description:** viewBox 360×280. Large "(212)" in Futura Std 900 weight. Parentheses and "2"s in #824B07 amber, the "1" in #E85D04 sicilian orange. Below: "PICTURES" in Futura Std 700, letter-spacing 16, in #824B07. The digits are ~170–190px font-size, filling most of the 360×280 canvas.

**SVG code (embed this directly in Stitch prompts):**
```svg
<svg viewBox="0 0 360 280" xmlns="http://www.w3.org/2000/svg"><g font-family="'Futura Std', Futura, 'Arial Black', sans-serif" font-weight="900"><text x="20" y="195" font-size="190" fill="#824B07">(</text><text x="85" y="195" font-size="170" letter-spacing="-8" fill="#824B07">2</text><text x="165" y="195" font-size="170" letter-spacing="-8" fill="#E85D04">1</text><text x="225" y="195" font-size="170" letter-spacing="-8" fill="#824B07">2</text><text x="290" y="195" font-size="190" fill="#824B07">)</text></g><text x="180" y="255" font-family="'Futura Std', Futura, Arial, sans-serif" font-weight="700" font-size="22" letter-spacing="16" text-anchor="middle" fill="#824B07">PICTURES</text></svg>
```

---

### (310) Pictures — `web/public/brand/apr70-logos/310-pictures/310_hero.svg`

**Visual description:** viewBox 360×230. Three equal 100×100px color blocks in a row: left = #077082 IMAX teal, center = #0077B6 Sicilian blue, right = #077082 IMAX teal. White Futura Std 900 digits "3", "1", "0" centered in each block (74px). Below the blocks: thin 25%-opacity white rule, then "PICTURES" in Futura Std 700, letter-spacing 18, in #077082.

**SVG code:**
```svg
<svg viewBox="0 0 360 230" xmlns="http://www.w3.org/2000/svg"><rect x="25" y="20" width="100" height="100" fill="#077082"/><rect x="130" y="20" width="100" height="100" fill="#0077B6"/><rect x="235" y="20" width="100" height="100" fill="#077082"/><g font-family="'Futura Std', Futura, 'Arial Black', sans-serif" font-weight="900" font-size="74" text-anchor="middle" fill="#FFFFFF" letter-spacing="-2"><text x="75" y="95">3</text><text x="180" y="95">1</text><text x="285" y="95">0</text></g><line x1="50" y1="158" x2="310" y2="158" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1"/><text x="180" y="190" font-family="'Futura Std', Futura, Arial, sans-serif" font-weight="700" font-size="20" letter-spacing="18" text-anchor="middle" fill="#077082">PICTURES</text></svg>
```

---

### New Renaissance Cinema — `web/public/brand/apr70-logos/new-renaissance-cinema/nrc_v1.svg`

**Visual description:** viewBox 580×460. At top: "NEW RENAISSANCE" in small Futura Std 700, letter-spacing 12, in #C8C8C8. Center: massive "NRC" — "N" and "C" in #C8C8C8, "R" in #001F3F navy, each ~260px font-size. At bottom: "CINEMA" in Futura Std 700, letter-spacing 54, in #C8C8C8. Cutting diagonally across the lower half of the letters: a navy (#001F3F) band with "EST · MMXXVI · NEW YORK" in Share Tech Mono.

**SVG code:**
```svg
<svg viewBox="0 0 580 460" xmlns="http://www.w3.org/2000/svg"><text x="287" y="100" font-family="'Futura Std', Futura, Arial, sans-serif" font-weight="700" font-size="24" letter-spacing="12" text-anchor="middle" fill="#C8C8C8">NEW RENAISSANCE</text><g font-family="'Futura Std', Futura, 'Arial Black', sans-serif" font-weight="900"><text x="50" y="310" font-size="260" letter-spacing="-10" fill="#C8C8C8">N</text><text x="215" y="310" font-size="260" letter-spacing="-10" fill="#001F3F">R</text><text x="360" y="310" font-size="260" letter-spacing="-10" fill="#C8C8C8">C</text></g><text x="287" y="405" font-family="'Futura Std', Futura, Arial, sans-serif" font-weight="700" font-size="30" letter-spacing="54" text-anchor="middle" fill="#C8C8C8">CINEMA</text><g transform="translate(163.5 216.5) rotate(54.6)"><rect x="-107.5" y="-11" width="215" height="22" fill="#001F3F"/><text x="0" y="0.5" text-anchor="middle" dominant-baseline="middle" font-family="'Share Tech Mono', 'Courier New', monospace" font-size="11.5" letter-spacing="2" fill="#FFFFFF">EST · MMXXVI · NEW YORK</text></g></svg>
```

---

## Next agent's tasks (in order)

### Task 1 — Add logos to the 4 best existing screens

Pick the 4 screens Marco is most likely to favor (all of the V0.1 and V0.3 bases, plus the two strongest variants) and call `generate_screen_from_text` on each with a prompt like:

```
Take this existing Division Showcase screen and add the actual APR 70 division logos.
Replace any placeholder text/name where the division logo should appear with the actual SVG logo.
Keep the entire layout, spacing, and color system exactly as-is.
Only change: add these division logos to their correct positions.

NO nav bar. NO footer. Section only.
Fonts ONLY: Futura Std, Barlow, Share Tech Mono. No Montserrat. No other fonts.
Company name = "APR 70 PICTURES" (parent co). Division names: (212) Pictures, (310) Pictures, New Renaissance Cinema.

Logos to use (embed inline as SVG):
— (212) Pictures: [paste 212 SVG code]
— (310) Pictures: [paste 310 SVG code]
— New Renaissance Cinema (NRC): [paste nrc_v1 SVG code]

Current screen HTML:
[paste HTML from the relevant stitch-html-round2 file]
```

Use project `3884326936106951139`, design system `assets/c12e1d9837594aa9be2761ce1ecf907c`.

**Recommended screens to update (pick 4 max — Stitch has MCP timeout risk):**
1. `v01-base-editorial-grid.html` — strongest V0.1 base
2. `v01-variant-ledger.html` — The Ledger (Marco's best V0.1 candidate)
3. `v03-base-ledger-rows.html` — the V0.3 base
4. `v03-ruled-column.html` — Ruled Column variant

### Task 2 — Generate 3 brand new variants with logos integrated from the start

Call `generate_screen_from_text` three times (can be parallel if context allows) with fresh prompts that include the logos from the outset. Suggested directions:

**Variant A — "The Production Log":** Based on V0.1 3-column grid concept. Each column has the division logo at top, large sequence number as structural rule below, projects list as rows of a ledger. Ghost watermark. No sequence numbers as left-column metadata — instead they're massive background typography.

**Variant B — "The Slate Stack":** Based on V0.3 ledger rows. Logo anchors the left of each row. Right side: taglines at maximum scale (clamp 3–5rem). Below logo: projects formatted like a film slate — slate number, title, format, badge in mono. Color stroke reveals on hover.

**Variant C — Open brief:** Give Stitch freedom to propose a third layout direction that uses the logos as dominant structural elements, with the sequence numbers and projects list playing supporting roles. Specify that the logos should be as large as practical (min 200px height) and color-matched per division.

For all three prompts include:
- Fonts: Futura Std, Barlow, Share Tech Mono. NO Montserrat. NO other fonts.
- NO nav. NO footer.
- Company = "APR 70 PICTURES"
- All 3 logo SVGs (from above) inline
- HARD CONSTRAINTS: no rounded corners, no shadows, no gradients as surfaces, no transition:all, no backdrop-filter, 8px grid, dark bg #0A0A0A
- Desktop 1440px wide

### Task 3 — Download, check violations, save output

For every new screen generated:
1. Call `get_screen` to get the HTML download URL
2. `curl -sL <url>` to download
3. `grep` check for `transition.*all`, `backdrop-filter`, `rounded-[^none]` violations
4. Save to `docs/handoff/stitch-html-round3/` with descriptive filenames

### Task 4 — Save output doc + commit

Write `docs/handoff/stitch-output-divisions-2026-05-19-round3.md` with:
- Screen ID + title table
- Description of what each variant does
- Violation notes
- Screenshot URLs

Update `BRIEF.md`. Commit `docs: Stitch round 3 — logo integration + 3 new variants`.

---

## Stitch session notes

- `generate_screen_from_text` routinely times out (~2min MCP limit) but **continues on server** — do NOT retry. Poll `list_screens` every 30s. New screens may not appear for 60–90s after timeout.
- `list_screens` has a caching delay — newly created screens may not show for 2–3 polls.
- If you get `generate_variants` result > token limit, it saves to a file at the truncated path shown — use `jq` to extract screen IDs and HTML URLs.
- HTML download URLs from Stitch are at `contribution.usercontent.google.com` — use `curl -sL`, not WebFetch.
- Design system: `assets/c12e1d9837594aa9be2761ce1ecf907c`
- Project ID: `3884326936106951139`

---

## After Marco approves a final variant

1. Wire it into `DivisionBlock.astro` as variant `v6`
2. Convert Tailwind classes to vanilla CSS using design tokens
3. Replace inline SVG logos with `{div.media}` Payload relationship
4. Fix any remaining violations
5. Add to `variantMeta` in `division-variants.astro`
6. `pnpm check` from `web/` — fix TypeScript errors
7. Visual QA at `http://localhost:4323/dev/division-variants`
8. Set as default in Payload seed, clean up old variants, `pnpm preflight`, NAS deploy
