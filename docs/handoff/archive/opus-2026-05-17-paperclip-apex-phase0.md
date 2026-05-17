# Handoff — Paperclip on Apex (Phase 0 complete, Phase 1 awaiting execution)

**Author:** Claude Opus 4.7 (this session ran on apr70-pictures repo because that's where CLAUDE.md and the context-gate hook live, but the work itself is Paperclip-on-Apex, not website work).
**Reason for handoff:** Context-gate hook (CLAUDE.md rule 14) blocked further tools after the Apex inventory consumed the budget. Plan + decisions are complete and ready to execute in a fresh session.

---

## The plan to execute

**File:** `/Users/marco/.claude/plans/read-users-marco-claude-plans-read-the-p-vivid-aho.md`

That plan is now fully concrete. Phase 0 (Apex SSH inventory) is done — findings are embedded in the plan under "Inventory snapshot". Phase 1 has 10 sequenced steps starting with "Nuke OpenClaw remnants" (step 0) through smoke tests (step 10).

The master plan it builds on: `/Users/marco/.claude/plans/read-the-pdf-here-s-whimsical-avalanche.md` (agent specs, skills, target architecture for the APR 70 Operations Paperclip company).

---

## What got done this session

1. **SSH access established.** `caruso70@100.67.28.106` — pubkey installed via password (once), Tailscale SSH auth completed by Marco in browser, key auth now works: `ssh -o BatchMode=yes caruso70@100.67.28.106 'echo ok'` returns `ok`.

2. **Full Apex inventory captured.** Embedded in the plan file. Raw logs at `/tmp/apex-inv-raw.txt` and `/tmp/apex-inv2.txt` on the Mac (these will be cleared on reboot — re-run if needed). Highlights:
   - Ubuntu 24.04.4, Intel i7-5960X, 125 GB RAM, RTX 4000 8 GB VRAM, 698 GB free local disk.
   - **Already running**: ComfyUI (Docker `:8188`, GPU), n8n (Docker + Postgres `:5678`), Ollama (systemd `:11434` with `llama3.1:8b`, `qwen2.5:7b-instruct`, `deepseek-coder:6.7b`), Quartz (Docker `:8080` publishing the ObsidianVault to `wiki.renaissancecinema.com`), cloudflared (3 hostnames live: `wiki/n8n/comfy.renaissancecinema.com`).
   - **Already wired**: Telegram bot in n8n (chat ID `7503709155`, workflow `wiki-telegram-bot.json`), GDrive ingest workflow, OpenRouter+Gemini+Perplexity API keys in `~/.env`.
   - **Claude Code installed and authenticated** at `/usr/local/bin/claude` (v2.1.141). PAI framework at `~/.claude/`.
   - **Node v18.19.1 is too old** for Paperclip (needs ≥20) — Phase 1 step 2 installs Node 20 via nvm.
   - **op CLI not installed** on Apex — Phase 1 step 5 installs it (sudo required).
   - **Orphans to remove (Phase 1 step 0)**: `openclaw_default` Docker network, `ghcr.io/phioranex/openclaw-docker:latest` (17 GB), `openclaw:local` (4.7 GB), `~/comfyui/custom_nodes/comfyui-openclaw/`, `OPENCLAW_TOKEN` line in `~/.env`. Reclaims ~22 GB.

3. **Four architecture decisions resolved** with Marco:
   - op CLI: install on **both Apex and Mac**.
   - Dashboard reach: **Tailscale (`apex.tailnet:3100`) + Cloudflare Access-gated (`paperclip.renaissancecinema.com`)**.
   - ObsidianVault: **canonical agent home**. Agents read existing vault folders, write runtime state to `~/ObsidianVault/operations/`. Quartz ignore added for `operations/_private/`.
   - OpenClaw cleanup: **nuke everything up-front** (step 0 of Phase 1).

4. **Plan updated** with all the above resolutions baked in. Final approval requested via `ExitPlanMode` was the call that tripped the context-gate hook.

---

## What the next session does

1. Read `/Users/marco/.claude/plans/read-users-marco-claude-plans-read-the-p-vivid-aho.md` end-to-end.
2. Confirm with Marco that the plan is still the plan (no scope changes overnight).
3. Execute Phase 1 steps 0 → 10 in order. SSH key auth already works; no password needed for non-sudo steps.
4. Pause for sudo password on steps 5 (op install) and 6 (cloudflared reload).
5. After step 10 smoke tests pass, report back with verification matrix from the master-plan "Verification" section.

---

## Things the next session should know

- **The repo CLAUDE.md and context-gate are about apr70-pictures (the website)**, not Paperclip. The Paperclip work happens entirely on the Apex; this repo just happens to be the cwd. If the context-gate fires again during Phase 1, it's because Bash output accumulated — try splitting big remote inventories into smaller SSH calls.
- **Tailscale SSH is enabled on the Apex.** Once Marco approved this device in the browser, key auth on top of Tailscale SSH works fine. If a future agent gets the "Tailscale SSH requires an additional check" message, ask Marco to authorize, do not loop.
- **Do not edit website code in Phase 1.** Paperclip Phase 1 is purely Apex-side. The website-repo changes (extending `News` collection with `feedSource`/`feedTags`/`feedHash`) are a separate, later PR.
- **Quartz publishes the vault**. Writes under `~/ObsidianVault/` on the Apex appear on `wiki.renaissancecinema.com`. Use `~/ObsidianVault/operations/_private/` for anything that must NOT be published.
- **`cloudflared` already serves 3 hostnames.** Tunnel ID `30272fab-9989-4be7-a79f-6bfe6a7f7a29`. Adding `paperclip.renaissancecinema.com` is one ingress line + `cloudflared tunnel route dns ...` + sudo reload.
- **Marco has a `kimaserver` Linux box on Tailscale (100.69.2.30)** that we haven't investigated. Out of scope for Phase 1, but worth a future session — it might be additional capacity.

---

## What did NOT change

- `/Users/marco/.claude/plans/read-the-pdf-here-s-whimsical-avalanche.md` — master plan untouched. The new plan supersedes some of its assumptions but doesn't replace it.
- No website code touched.
- No Apex state mutated this session except the `~/.ssh/authorized_keys` (pubkey added).
