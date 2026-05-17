# Handoff -- Opus 4.6 -- 2026-05-16 (Context Hook Wired, Local DB Needs Migration)

**From:** Claude Opus 4.6
**To:** Next agent
**Branch:** `main` (uncommitted — commit this handoff)
**Read first:** `BRIEF.md`, `TASKS.md`, `CLAUDE.md`

---

## What this session did

### 1. Hard-stop context hook (CLAUDE.md rule #14 enforcement)

Created a two-part hook system that enforces context handoff at threshold:

**Files created:**
- `.claude/hooks/context-gate.sh` — `PreToolUse` hook. Reads `.claude/.context-meter`. At 250KB accumulated tool output (~55-60% context), warns agent on first breach then hard-blocks non-handoff tools on subsequent calls. Allowlist: Write/Edit/Read/Bash(git*).
- `.claude/hooks/context-meter.sh` — `PostToolUse` hook. Counts bytes from each tool output and accumulates to `.claude/.context-meter` state file.
- `.claude/settings.json` — Updated with `PreToolUse` and `PostToolUse` hook entries.
- `.claude/hooks/on-stop.sh` — Added meter reset (`rm -f .claude/.context-meter`) so each session starts fresh.
- `.gitignore` — Added `.claude/.context-meter` (session-local state, not committed).
- `CLAUDE.md` — Rule #14 rewritten to reference the hook enforcement mechanism.

**How it works:**
1. PostToolUse accumulates tool output byte count in `.claude/.context-meter`
2. PreToolUse checks meter against 250KB threshold
3. First breach: outputs warning instructions, allows the tool call, sets "warned" flag
4. Subsequent breaches: hard-blocks (exit 2) unless tool is Write/Edit/Read or git command
5. Agent must write handoff, update BRIEF, commit, tell user, stop
6. Stop hook resets meter for next session

### 2. Logo rendering bug — root cause narrowed further

**Finding:** Local CMS returns 500 on ALL global endpoints because the local postgres database has never had the brand_fields migration applied. The migration `20260515_201608_brand_fields.ts` exists but was never run locally (all 5 migrations show "Not ran" in `payload migrate:status`).

**Complication:** The local DB was set up via Payload's `push` mode (dev migration batch -1), not formal migrations. The 4 earlier migrations (May 13) would try to CREATE tables that already exist, causing conflicts. The brand_fields migration alone is 74K+ tokens (massive — it includes full schema rebuild, not just brand columns).

**Solution for next agent:**
- Option A (recommended): Use `payload migrate:fresh` which drops and recreates everything from migrations. Then re-run the seed script to populate data. Clean slate.
- Option B: Mark the first 4 migrations as "already ran" by inserting rows into `payload_migrations` table, then run only the brand_fields migration: `npx payload migrate`
- Option C: Temporarily set `push: true` in payload.config.ts, restart CMS, let Payload auto-push schema, then revert the config change.

After schema is current, the CMS API will work and you can debug the actual logo rendering pipeline.

### 3. Gemini/Antigravity conflict check

**Result: No conflicts.** Gemini (Antigravity/Cursor) is running its own Chrome debug profile on port 9222 but has NOT modified the git tree, has no branches, no stashes, and isn't touching the dev servers. Both dev servers (CMS :3000, Astro :4321) are up and safe to use.

---

## Dev server state

| Service | Port | Status |
|---------|------|--------|
| Payload CMS (Next.js) | 3000 | Running but 500s on globals (schema mismatch) |
| Astro web | 4321 | Running |
| Docker Postgres | 5432 | Running, DB `apr70_cms` has 7 media items |
| Gemini Chrome | 9222 | Running (separate profile, no conflicts) |

---

## What's next

### Priority 1: Fix local DB schema, then debug logo rendering

1. Apply schema migration locally (see Options A/B/C above)
2. Run brand seed locally: `pnpm seed --apply-brand` (from cms/)
3. Verify CMS API returns populated media objects: `curl 'http://localhost:3000/api/globals/212?depth=1'`
4. If media objects are just IDs (not populated), fix depth parameter in web fetch code
5. Trace: `web/src/pages/212.astro` → `Layout.astro` → `Footer.astro` / `MagneticNavIsland.tsx`
6. Verify logos render on `http://localhost:4321/212`

### Priority 2: Push to NAS once fix is verified locally

The NAS already has the correct schema and seeded data. The fix will be in the web/ code (depth parameter or URL resolution). Once it works locally, push to main and rebuild on NAS.

---

## Files changed (uncommitted)

- `.claude/hooks/context-gate.sh` (new)
- `.claude/hooks/context-meter.sh` (new)
- `.claude/hooks/on-stop.sh` (modified — added meter reset)
- `.claude/settings.json` (modified — added PreToolUse/PostToolUse hooks)
- `.gitignore` (modified — added .claude/.context-meter)
- `CLAUDE.md` (modified — rule #14 rewritten)
- `docs/handoff/opus-2026-05-16-context-hook-and-local-db.md` (this file)
