# TASKS — apr70-pictures (v3)

Priority-ordered backlog. Marco edits this in the morning; agents work it during the day.

## Format

Each line is: checkbox, phase tag (`[p1]` … `[p7]`), tool hint in backticks, then the task text.

Tool hints: `claude` = needs Claude Pro / high-context. `cursor+claude` = mainstream IDE work. `gemini` = visual / creative. `cline` = mechanical. `requires-gui` = needs Marco's eyes (visual QA). `nas-headless` = orchestrator can run autonomously.

---

## Phase 1 — Tokens & Typography (Foundation)

- [x] [p1] [claude] Block library spec — initial 6 blocks.
- [x] [p1] [claude] Page schema — `layout: Block[]` on each Global.
- [x] [p1] [claude] Astro + Payload integration spec.
- [x] [p1] [cursor+claude] Token contract — port v2 colors/type/spacing.
- [x] [p1] [nas-headless] Orchestrator Notifications — Telegram alerts.
- [x] [p1] [nas-headless] 1Password CLI Integration.
- [x] [p1] [gemini] Master architecture plan — 4 drafts reviewed by Perplexity + Grok + Marco. LOCKED.
- [x] [p1] [gemini] Expanded block library — 11 blocks (Hero, RichText, TwoCol, Grid, CTA, Quotes, Filmstrip, Division, Stats, Divider). Schemas + Astro renderers created.
- [x] [p1] [gemini] `tokens.css` — update color names to final palette (212 Amber, 212 Sicilian Orange, 310 IMAX, NRC Grey, 310 Sicilian Blue, NRC Navy). Remove Steenbeck Warm. Add light mode ramp (`[data-theme="light"]`).
- [x] [p1] [gemini] Update ALL block schemas — color select fields must use final token names.
- [ ] [p1] [requires-gui] Light mode visual QA — verify all blocks render correctly in both modes.

## Phase 2 — Lexical Color Injector

- [ ] [p2] [cursor+claude] Lexical Color Injector plugin — custom inline toolbar dropdown, token storage, admin preview, save validation, Brand Palette Reference sidebar panel.
- [ ] [p2] [cursor+claude] Mega Scale toggle — custom Lexical node/format for `data-display="mega"`.

## Phase 3 — SiteSettings & Global Chrome

- [ ] [p3] [cursor+claude] `SiteSettings` Payload global — brandLabel, legalEntity, footerLinks, showFilmstripRails, lastDeployed (read-only), seededVersion (read-only).
- [ ] [p3] [cursor+claude] `FooterLinks` Payload global — nav items + more links.
- [ ] [p3] [gemini] Magnetic Navigation island — React + GSAP. `transform`+`opacity` only. `prefers-reduced-motion` + `pointer: coarse` disabled.
- [ ] [p3] [gemini] Footer component — static Astro, 4-col grid, pulls from FooterLinks global.
- [ ] [p3] [cursor+claude] Payload preview URLs — live Astro previews from admin panel.

## Phase 4 — Seed Script & Content

- [ ] [p4] [nas-headless] Seed script — port v2 content into Payload DB. Idempotent. Versioned.
- [ ] [p4] [nas-headless] Media migration — rsync v2 NAS volume → v3 NAS volume. Re-link in DB.
- [ ] [p4] [cursor+claude] `web/src/lib/payload.ts` typed client — error handling, caching, stale-while-revalidate.

## Phase 5 — Hero Engine & Filmstrip

- [ ] [p5] [gemini] HeroBlock slider island — React + GSAP crossfade. Auto-featured + curated modes.
- [ ] [p5] [gemini] FilmstripBlock renderer — CSS scroll-snap, perforation bands, keyboard nav, ARIA.
- [ ] [p5] [requires-gui] Hero + Filmstrip visual QA.

## Phase 6 — Division Showcase

- [ ] [p6] [gemini] Division Showcase v0 — v2-faithful baseline (stacked rows, ghost numerals).
- [ ] [p6] [gemini] Division Showcase v1 — Interactive Accordion variant.
- [ ] [p6] [gemini] Division Showcase v2 — Horizontal Card Stack variant.
- [ ] [p6] [gemini] Division Showcase v3 — Split-Screen Reveal variant.
- [ ] [p6] [gemini] Division Showcase v4 — Timeline Spine variant.
- [ ] [p6] [gemini] `/dev/division-variants` preview route (dev-only, env-gated).
- [ ] [p6] [requires-gui] Director review → lock canonical variant, delete unused code.

## Phase 7 — Continuous Slate & Polish

- [ ] [p7] [gemini] MasonryBlock island — React, IntersectionObserver, cursor pagination, skeleton loaders, "Load More" fallback.
- [ ] [p7] [requires-gui] Compose all pages from blocks (home, about, work, investors, contact, jobs, pitch, news).
- [ ] [p7] [requires-gui] Lighthouse audit — LCP < 2.5s, CLS < 0.1.
- [ ] [p7] [requires-gui] WCAG AA audit — 4.5:1 contrast, keyboard nav, reduced motion.
- [ ] [p7] [nas-headless] DSM reverse-proxy slot for staging-v3.apr70.com.
- [ ] [p7] [nas-headless] DNS plan: apr70.com → v3.

---

## Done

(Completed tasks moved here with date.)
