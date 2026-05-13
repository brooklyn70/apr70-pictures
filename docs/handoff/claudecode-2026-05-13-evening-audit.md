# Claude Code Handoff — 2026-05-13 Evening (Audit Session)

**From:** Claude Opus 4.6
**To:** Next agent
**Repo tip at handoff:** see latest commit on main

---

## What this session did

Housekeeping and orchestrator testing. No feature work.

### Completed

1. **Full project audit** — verified all files from previous handoff exist on disk, payload.config.ts registrations correct, fetch functions in payload.ts confirmed (lines 190-212).

2. **TASKS.md reconciled** — marked division pages done (line 57), marked test-hero deletion done (lines 50+59), added note that division pages are net-new (no v2 source content).

3. **BRIEF.md trimmed** — cut from 175 lines to ~75. Removed session narrative, auto-stop notes, cumulative done list.

4. **schema.md updated** — division pages changed from MISSING to LIVE with correct global slugs.

5. **Vercel plugin disabled** for this project in `.claude/settings.json`.

6. **111 MCP tools disconnected** by Marco — Vercel, Cloudflare, Supabase, HuggingFace, Figma, Google Calendar, Gmail, Reputation, Mermaid, Google Drive all removed.

7. **test-hero.astro deleted** — dev artifact removed.

8. **Orchestrator tested** — dry-run works, `--once` dispatched media migration task. Task failed silently (exit 0, no actual work done). Reverted false positive.

---

## Orchestrator findings

### How it works
- Python daemon at `/volume1/apps/apr70-orchestrator` on NAS
- Reads first `[ ]` line from TASKS.md, runs it via `claude --print` subprocess
- Marks `[x]` if exit code 0, sends Telegram notification
- Auth: `OP_SERVICE_ACCOUNT_TOKEN` (1Password cloud — works from any network)

### How to run
```sh
# On NAS:
sudo /usr/local/bin/docker exec apr70-orchestrator op run -- python -m orchestrator.main --dry-run
sudo /usr/local/bin/docker exec apr70-orchestrator op run -- python -m orchestrator.main --once
```

### Telegram gotcha
`TELEGRAM_BOT_TOKEN` is set to `op://API/Telegram Bot Token/token`. Without `op run --` wrapper, it's a literal string and Telegram silently fails. Always use `op run --`.

### False positive problem
The orchestrator trusts exit code 0 blindly. When dispatched for media migration, the Claude Code subprocess explored the codebase, created .bak files and a 24K-line migration JSON snapshot, then exited 0 without rsyncing any files or creating Media rows. The orchestrator marked the task done.

**Fix applied:** Reverted `[x]` back to `[ ]`, deleted junk files (.bak + .json), pushed everywhere.

**Root cause:** Media migration requires Docker volume access and rsync, which the Claude Code subprocess inside the orchestrator container can't do. This task needs either:
- Rewrite as `[nas-shell]` with explicit commands
- Manual session where an agent SSHes into the NAS and verifies each step
- Split into subtasks: (a) rsync shell command, (b) create Media rows via Payload API

### Git push gotcha
Orchestrator pushes via ephemeral HTTPS URL with 1Password-resolved `GITHUB_TOKEN`. If the NAS repo is behind origin (e.g. someone pushed from Mac), the orchestrator's push fails. Fix: pull on NAS before running orchestrator, or add `git pull --rebase` to the orchestrator's commit flow.

---

## Key files changed this session

```
TASKS.md                                — 3 checkbox corrections + net-new note
BRIEF.md                                — trimmed to ~75 lines
docs/architecture/schema.md             — division pages MISSING -> LIVE
.claude/settings.json                   — Vercel plugin disabled
web/src/pages/test-hero.astro           — DELETED
```

---

## What's next (priority order)

### 1. Footer links seeding (claude)
Source: `v2-export/content/pages/footer-more.json` (3 links: NEWS, SUBMIT A PITCH, JOBS).
Target: FooterLinks global — has `primaryNav`, `divisionNav`, `moreNav` arrays (NOT a layout blocks field).
Read `cms/src/globals/FooterLinks.ts` first. Call `updateGlobal('footer-links', {...}, token)` in apply.ts.

### 2. Division page content (requires-gui / claude)
Net-new pages. No v2 source. Need at minimum a hero block + division-themed content per page. Logo work in progress in separate session (`.refs/logo-drafts/212/`).

### 3. Media migration (needs rework)
Currently tagged `[nas-headless]` but orchestrator can't handle it. Options:
- Rewrite as `[nas-shell]` with explicit rsync + curl commands
- Run as a manual SSH session
- Split into shell subtask (rsync) + API subtask (create Media rows)
537 MB of v2 media at `/volume1/apps/apr70/public/`.

### 4. payload.ts typed client (cursor+claude)
Error handling, SWR caching for `web/src/lib/payload.ts`.

### 5. HeroSliderIsland + FilmstripBlock (gemini)
Phase 5 creative tasks.

### 6. Division Showcase 5 variants (gemini — Phase 6)
Not started. Depends on division pages having content.

---

## Lessons learned (cumulative)

1. **Migration bloat** — auto-generated Payload migrations dump full schema if JSON snapshot chain is broken. Replace with targeted delta.
2. **TASKS.md drift** — agents update BRIEF.md but forget TASKS.md checkboxes. Stop hook doesn't cover this.
3. **Division pages are net-new** — v2 had no /212, /310, /nrc routes.
4. **Orchestrator trusts exit 0** — subprocess can exit clean without doing the work. Needs verification step.
5. **MCP bloat** — 180 deferred tools eat context. Trim per-project. Vercel plugin disabled via settings.json.
6. **Telegram needs op run** — 1Password references stay literal without the wrapper.
7. **NAS repo can fall behind** — pull before orchestrator runs to avoid push conflicts.
