# Handoff: Opus 4.6 Review Session — 2026-05-16 ~6:15pm EDT

## What This Session Did
Comprehensive review of project state after Gemini's retirement. Read all key files, analyzed DivisionBlock/FilmstripBlock code, read the Claude Code deployment PDF, and created a full forward plan.

## Plan File Location
`/Users/marco/.claude/plans/docs-handoff-gemini-2026-05-16-1713-md-giggly-torvalds.md`

## Key Findings

### Two Blockers
1. **Logo rendering bug**: Local Postgres never had `brand_fields` migration applied. Fix: `payload migrate:fresh` from `cms/`, then re-seed. Then verify `depth=2` in payload.ts global fetchers.
2. **Division Showcase CSS**: Gemini's mechanics work (GSAP, SVG, scroll logic) but visual execution is flat/generic. Needs complete CSS redesign for v0-baseline and v5-animated-filmstrip to reach "Sight & Sound" / "A24" premium level.

### FilmstripBlock Is Technically Excellent
- Kodak KeyKode, SMPTE leader, perforation math, film stock codes — all correct
- CSS format discipline via variables (Super35, Academy, Widescreen200, IMAX)
- Keep mechanics, elevate visual framing

### DivisionBlock Issues
- v0: Flat typographic hierarchy, weak hover states (6px translate), thin borders
- v5: Hardcoded white colors break light mode, SVG container not responsive, editorial header cramped
- Both: Need stronger type hierarchy, better whitespace, color as accent not decoration

### Orchestrator Recommendation
Replace broken Python orchestrator with Claude native deployment:
- `/schedule` (Claude Routines) for recurring tasks (NAS health checks, deploy verification)
- `/loop` for interactive design sessions
- Hooks for event-driven automation (already partially wired: context-gate, stop-hook)

### Standalone HTML Reference
Could NOT find `apr70-pictures-standalone.html` in the project or reference repository. Need Marco to provide the file path or URL.

## Questions for Marco (Unanswered — Gate Hit Before Asking)
1. Where is the Claw Design standalone HTML? (reference repo? different path? live URL?)
2. Which Division variants to redesign? (both v0+v5? just one? all six?)
3. Priority: logo bug + Division design first? Or automation setup first?
4. Cursor coordination: what is Cursor being used for?

## Execution Order (When Next Session Starts)
1. Ask Marco the 4 questions above
2. Fix logo rendering (migrate:fresh → seed → verify)
3. Find standalone HTML reference
4. Redesign Division Showcase CSS
5. Set up Claude Routines for recurring tasks

## Files That Matter
- `web/src/components/blocks/DivisionBlock.astro` (695 lines, 4 variants)
- `web/src/components/blocks/FilmstripBlock.astro` (806 lines)
- `web/src/components/blocks/DivisionFilmstripV5.astro` (358 lines)
- `web/src/pages/dev/division-variants.astro` (dev preview)
- `web/src/lib/payload.ts` (CMS client — check depth param)
- `cms/src/payload.config.ts` (migration config)
- `DESIGN.md` (Italian Modernist design spec)

## Context Gate Note
This session hit the 250KB context gate after heavy agent exploration (3 explore agents + 1 PDF read consumed most of the budget). Next session should be more surgical — ask questions first, then execute targeted fixes.
