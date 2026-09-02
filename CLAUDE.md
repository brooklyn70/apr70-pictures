# CLAUDE.md — apr70-pictures (v3 architecture; the site version lives in `cms/src/siteVersion.ts`)

**Authoritative working document for all agents working in this repo.**
**Last updated:** 2026-08-21 (place-poster skill + BL PD decision)
**Repo:** `brooklyn70/apr70-pictures`
**Live:** https://apr70.com (one-screen holding page from `v10/holding/` until the go-live flip)
**Staging:** https://staging.apr70.com (full v10 stack, NAS Docker project `apr70v3`; proxy flipped 2026-07-13). Vercel/Supabase are NOT the production path.
**Hosting:** Synology NAS (DSM Reverse Proxy → Docker project `apr70v3` at `/volume1/apps/apr70-pictures`, verified 2026-09-02)

---

## Reading order for any new session

1. `BRIEF.md` — current state, last updated by previous agent's stop hook.
2. `TASKS.md` — priority backlog. Pick the top task tagged for your tool.
3. This file — project conventions.
4. `docs/architecture/` — schema + block library + integration specs.
5. `docs/architecture/v3-master-plan.md` — the director-approved architecture plan.
6. `docs/decisions/2026-07-01-vms-lessons-and-cloud-migration.md` — **Vik Muniz build lessons (Supabase pooler/caching/R2/GEO laws) + the approved Supabase/Vercel/store migration plan.** Read before any DB, deploy, or data-layer work.
7. `docs/decisions/2026-07-13-ten-properties-mayors-private.md` — **Slate count is ten.** Nine public; The Mayors stays in CMS with `publicSlate=false` until counsel clears. Read before any slate/count/Mayors copy or project visibility work — includes the restore recipe.
8. `docs/decisions/2026-07-14-property-identities-falcon-and-tsunami.md` — **Two names the file tree gets wrong.** `11-07-maltese-falcon` is not a property: it is Da Hook's public-domain source material (Hammett). And the film formerly called **TSUNAMI is now SEA GATE** — canonical, ruled by Marco; if you find the old name anywhere, it is wrong, change it. Read before walking SharedData folders, the vault's Active Properties, or the `projects` table.
9. `docs/decisions/2026-08-21-place-poster-skill-and-bl-pd.md` — **Place posters vs site chrome.** Engine is prettymaps (OSM). Skill: `.claude/skills/place-poster/`. Wrapper: `tools/place-poster/`. i18n (PT/IT/FR/DE) is parked, not built.

---

## How v3 works

**Payload is the single source of truth for ALL content.** There is no Keystatic, no content/ directory, no file-based fallbacks. Content enters the system via:
1. An idempotent seed script (`seed.ts`) that runs on first boot via Payload's `onInit`.
2. The Payload Admin UI (`/admin`) for all subsequent edits.

Layout is editor-authored via block stacking. Each page Global has a `layout: Block[]` field. The frontend is one `<BlockRenderer>` switch. Agents write **block components** and **island components**, never per-page React templates.

---

## Hard rules

1. **No hardcoded page layouts.** Every page uses `<BlockRenderer blocks={page.layout} />`.
2. **No new colors outside the locked palette.** See Token Contract below.
3. **No `transition: all`.** Animate only `opacity`, `transform`, and explicitly-named properties.
4. **No emoji** on the rendered site or in commits. Internal docs are fine.
5. **Non-interactive blocks = Astro components (zero JS).** Interactive blocks = React islands via `client:idle` or `client:visible`.
6. **Type-share via `payload-types.ts`.** Every block imports types from generated Payload types.
7. **GSAP only.** No Framer Motion. No other animation libraries.
8. **Both modes.** Every block MUST render correctly in dark mode AND light mode from day one.
9. **Mobile-first.** All CSS designed for 375px–1440px with `clamp()`. No desktop-first code.
10. **Media relationships.** Blocks use Payload Media relationships, never loose path strings.
11. **Stop hooks handle commits.** Update BRIEF.md before stopping.
12. **GUI tasks need Marco.** Tasks tagged `requires-gui` need visual review.
13. **Preflight before NAS deploy.** Run `pnpm preflight` from `cms/` and confirm it exits 0 before any `docker compose up --build` on the NAS. This catches missing components, TypeScript errors, and broken imports that the dry-run cannot see.
14. **Context handoff (ENFORCED BY HOOK).** A `PreToolUse` hook (`.claude/hooks/context-gate.sh`) tracks accumulated tool output via `.claude/.context-meter`. At ~250KB accumulated output (~55-60% context), the hook warns the agent and then hard-blocks all tools except Write/Edit/Read/git. The agent MUST: write a handoff doc to `docs/handoff/[model]-[date]-[summary].md`, update `BRIEF.md`, commit+push, and tell the user to start a fresh session. The Stop hook resets the meter for the next session.
15. **One handoff in `docs/handoff/`.** Only the current session's handoff doc lives at the top level. On session start, move any existing handoff docs to `docs/handoff/archive/` before writing a new one. The user should always find exactly one file (the latest) without digging.
16. **SQL against the local DB pipes through `docker exec -i`.** A heredoc into `docker exec apr70-pictures-postgres-1 psql ...` WITHOUT `-i` exits 0 having executed nothing — verify the rows changed, never trust the silent exit (bitten 2026-07-13). Content edits must also land in all three layers — live DB, `seed-v9.ts` defaults, and the copy canon in the vault (`11.12 V9 Build/02-copy`) — or the next re-seed re-arms the old content (same mechanism as the v11 billing bug). Before any DB deploy, diff `site_settings` local vs NAS first: Marco edits staging Payload directly and the deploy dump clobbers it (logo height 34 vs 64, caught 2026-07-13).

---

## Token contract (LOCKED)

### Brand Colors

| Token Key | Name | Hex |
|-----------|------|-----|
| `212-amber` | 212 Amber | `#824B07` |
| `212-sicilian-orange` | 212 Sicilian Orange | `#E85D04` |
| `310-imax` | 310 IMAX | `#077082` |
| `nrc-grey` | NRC Grey | `#c8c8c8` |
| `310-sicilian-blue` | 310 Sicilian Blue | `#0077B6` |
| `nrc-navy` | NRC Navy | `#001F3F` |

### Light Mode
- Background: `#FAFAF8`
- Text: `#1A1A1A`

### CSS Variables
All brand colors stored as `--color-{token-key}` in `web/src/styles/tokens.css`.
Lexical Color Injector stores `data-color="{token-key}"` in markup.
`[data-theme="light"]` selector block flips `--fg-*` and `--bg-*` ramps.

Typography: Futura Std (display), Barlow (body), Share Tech Mono (filmstrip/meta).

---

## Stack

- **Frontend:** Astro (HTML-first; React islands for interactive blocks). TypeScript. Vanilla CSS via tokens.css.
- **Backend:** Payload v3 (Postgres). Standalone Node service. Lexical editor with D-7 inline blocks + Color Injector plugin.
- **Animation:** GSAP + ScrollTrigger. No other motion libraries.
- **Hosting:** Docker on Synology NAS. nginx reverse proxy. Postgres in container. Media on NAS volume.
- **Deploy:** push `main` → NAS git fetch + checkout `main` → docker compose build + up. Script: `~/websites/apr70-website/_deploy/deploy-v10-to-nas.sh` (`BRANCH` defaults to `main`).

---

## Block library (11 blocks)

1. **HeroBlock** — heading, subtext, media. Variants: default, split, fullscreen, slider-auto, slider-curated.
2. **RichTextBlock** — Lexical body with D-7 inline blocks + mega-scale toggle.
3. **TwoColBlock** — left heading, right body. Ratios: 1-3, 1-1, 1-2.
4. **GridBlock** — array of cards with media + title + description.
5. **CTABlock** — heading + buttons (solid, ghost, link variants).
6. **QuotesBlock** — quote + attribution. Stacked or carousel.
7. **FilmstripBlock** — horizontal image track with perforation bands. CSS scroll-snap.
8. **DivisionBlock** — division showcase with 5 visual variants. Color-token-locked.
9. **StatsBlock** — large numeric data points in 2-4 column grid.
10. **DividerBlock** — structure divider with optional mono-spaced label.
11. Plus interactive **islands**: HeroSliderIsland, MasonryIsland, MagneticNavIsland.

---

## Automation

Tasks are managed manually via `TASKS.md`. No external orchestrator. Scheduled checks run via the Claude Code scheduled-tasks MCP from Marco's Mac.

**NAS health check** — daily at 9:03am. To create: open Claude Code and ask "Create a daily 9am NAS health check that SSHs to apr70-nas, runs `docker compose ps` on the apr70v3 stack, and curls the CMS API and web frontend." Task stored at `~/.claude/scheduled-tasks/apr70-nas-health/`.

**Post-deploy verification** — run on demand after NAS deploys. Ask Claude Code: "Verify the apr70 NAS deploy: check containers healthy, CMS API responds, /212 /310 /nrc pages return content, media URLs resolve."

---

## Branching (LOCKED)

- **One long-lived branch:** `main`. Do not create `vN` long-lived branches.
- **Version bumps** change `SITE_VERSION` in `cms/src/siteVersion.ts` only — not a new git branch.
- **Feature work** uses short-lived branches merged back to `main`.
- Archaeology: tags `archive/v9-branch`, `archive/v10-branch`, `archive/pre-main-ff-v11`. Old monolith repo `brooklyn70/apr70-website` is archived on GitHub.

## File line cap

This file should stay under 200 lines. Older context lives in `docs/architecture/`.

## Working style
Follow my global prompting rules in `~/.claude/CLAUDE.md` (outcome-first; act when you have enough; prove-it before calling something done; human go on anything irreversible; no standing "explain your reasoning" line). Invoke **"assess and stop"** or **"act when you have enough"** to set the dial.

## Mailbird MCP (local email access)

You have a local MCP server named `mailbird` (Mailbird Next on this Mac).
- Endpoint is loopback-only; Mailbird must be open with Wingman MCP enabled.
- Write actions are OFF — read/search/list/attachments only.
- Prefer mailbird tools for inbox triage across accounts in Mailbird.
- For invoices/quotes: search_conversations with from:/subject: (e.g. subject:invoice, from:bhphoto), then get_message / list_attachments / get_attachment_content.
- Never print or log the bearer token. Token lives in 1Password: op://API/Mailbird token Mac/token.
