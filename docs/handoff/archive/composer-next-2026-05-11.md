# Handoff — next Cursor Composer agent (apr70 / v3)

**Date:** 2026-05-11  
**Repos:** site `brooklyn70/apr70-pictures`; brain `brooklyn70/apr70-orchestrator`

## Goal for you

Orchestrator on NAS picks **TASKS.md line 24** next:

`pnpm create astro@latest` in `web/` — TypeScript, integrations `(react, tailwind, sitemap)`. Tag **`[cursor+claude]`** (IDE-friendly scaffolding; purely NAS-headless runs may need extra care).

## Already true (don’t rework)

1. **`TASKS.md` line 20** (1Password / `op`) is **[x]**; pushed `main`; NAS `/volume1/apps/apr70-pictures` pulled.
2. **NAS orchestrator** `.env` has `GITHUB_TOKEN=op://API/kwowm2ljg7cxqystmw4esluddu/token` (+ existing `OP_SERVICE_ACCOUNT_TOKEN`, Telegram, Anthropic refs). **`op run` inside container works** (`--dry-run` OK).
3. **Git hygiene:** PAT not in `remote.origin`; deploy keys story per orchestrator README. Ephemeral HTTPS push lives in **`orchestrator/main.py`** (not rewriting `origin`).
4. **apr70-pictures:** `.cursor/hooks` blocks token-in-remote patterns + terse prompt nudge (`chore(cursor): …`).

## Commands that match Marco’s DSM setup

SSH target: **`caruso@KIMAserver`**. Prefer **login bash** — plain `ssh` shells often lack **`git`** / **`docker`** on `$PATH`:

```bash
ssh caruso@KIMAserver 'bash -lc "cd /volume1/apps/apr70-pictures && git pull --ff-only"'
```

**Orchestrator one shot** (loads secrets via container `env_file` + `op run`):

```bash
ssh caruso@KIMAserver 'bash -lc "sudo /usr/local/bin/docker exec apr70-orchestrator op run -- python -m orchestrator.main --once"'
```

**Dry-run** (pick task only): same with `--dry-run`.

Compose / rebuild orchestrator repo path: **`/volume1/apps/apr70-orchestrator`**.

## Project rules (must read)

Workspace **`CLAUDE.md`** (apr70-pictures): block-based pages only, token contract, **no PAT in commits**, **`payload-types.ts`** for types.

## Sanity before big edits

Confirm NAS checkout matches Git **`main`** (`git rev-parse HEAD` vs GitHub).

## Open / watch

- Scaffold is **interactive** in places; Composer may prefer running **`pnpm create …` locally or in agent shell** vs full NAS-only loop.
- **NAS:** post-orchestrator `chown caruso` on mounted repos if **`root`-owned `.git/objects`** recur (README + **`scripts/chown-mounted-repos-on-nas.sh`** in orchestrator).
