# Handoff — Paperclip on Apex (Phase 1 mostly shipped; step 8 deferred, 9–10 pending)

**Author:** Claude Opus 4.7. Same as the Phase 0 handoff — this repo is the cwd because the context-gate hook lives here, but the work is Paperclip-on-Apex.

**Reason for handoff:** Context-gate hook fired mid–step 8. Steps 0–7 are landed on the Apex and verified. Step 8 (Telegram extension) needs a CEO and resolved auth model — see the deferral note below. Steps 9–10 (CEO claim + smoke tests) are mostly Marco's interactive work plus a short verification pass.

---

## What's done on the Apex (verified live)

### Step 0 — OpenClaw nuked
- Removed: `openclaw_default` network, `ghcr.io/phioranex/openclaw-docker:latest` (17 GB), `openclaw:local` (4.7 GB), exited `ollama` + `intelligent_galileo` containers, `~/comfyui/custom_nodes/comfyui-openclaw/`, `OPENCLAW_TOKEN` line in `~/.env`.
- Reclaimed ~22 GB.
- ComfyUI restarted and returned HTTP 200.
- APR_70_Master_Document archived to `~/paperclip-data/scaffold/data/legacy/`.

### Step 1 — Inventory landed
- `~/paperclip-data/scaffold/INTEGRATIONS.md` written on the Apex.
- Mirrored to Mac at `/Users/marco/.claude/plans/apex-inventory-2026-05-17.md`.

### Step 2 — Node 22 via nvm
- nvm v0.40.1 installed.
- Node v22.22.3 set as default (the original plan said 20, but `acpx` requires ≥22.12.0).
- System Node v18.19.1 still present for any non-nvm shell consumer.
- `claude --version` still 2.1.141 — works under both Node versions because the binary at `/usr/local/bin/claude` is not Node-version-bound.

### Step 3 — Paperclip installed and running
- `npx paperclipai onboard -y --bind tailnet -d ~/paperclip-data/instance` succeeded.
- 85 migrations applied to embedded Postgres at `~/paperclip-data/instance/instances/default/db` (port 54329).
- systemd user unit `paperclip.service` installed at `~/.config/systemd/user/paperclip.service`, enabled, running. Restart on failure with 10s backoff. Logs to `~/paperclip-data/paperclip.log`.
- **Bootstrap CEO invite URL (expires 2026-05-20T15:32:17.144Z):**
  `http://100.67.28.106:3100/invite/pcp_bootstrap_2acda9f018aa3e89242d05ae21b35692ec3a78886a64e6c8`
  Also saved at `/Users/marco/.claude/plans/paperclip-bootstrap.md` on the Mac.
- Tailnet health: `curl http://100.67.28.106:3100/api/health` → 200.

### Step 4 — Scaffold populated
Under `~/paperclip-data/scaffold/` on Apex:
- `README.md`, `COMPANY.md`, `SETUP.md`, `INTEGRATIONS.md`
- 8 agents × `{INSTRUCTIONS.md, CONFIG.md}`
- 18 skills (the plan's 15 plus `telegram-notify`, `obsidian-vault-read`, `obsidian-vault-write`)
- `data/{PROJECTS,BRAND,DIVISIONS,OPPORTUNITIES,PIPELINE-NOTES}.md` + `data/legacy/APR_70_Master_Document.md`
- Concrete endpoint values baked into each skill (Ollama port + models, ComfyUI prompt endpoint, n8n webhook pattern, Telegram bot/chat IDs from `~/.env`, vault paths).

### Step 5 — op CLI + linger (sudo)
- `op` 2.34.0 installed via the 1Password apt repo.
- `loginctl enable-linger caruso70` set — user systemd manager now survives reboot/logout.
- **Marco still needs to run `op account add` interactively to sign in once.** Agents can use a session token from there.

### Step 6 — Cloudflare tunnel (sudo)
- Edited `/etc/cloudflared/config.yml` to add ingress: `paperclip.renaissancecinema.com → http://100.67.28.106:3100`. (Used tailnet IP because Paperclip is bound only to that interface, not loopback.)
- `cloudflared tunnel route dns 30272fab-9989-4be7-a79f-6bfe6a7f7a29 paperclip.renaissancecinema.com` registered the CNAME.
- `systemctl restart cloudflared` (the service doesn't support `reload`).
- Added `paperclip.renaissancecinema.com` to Paperclip's allowed-hostnames via `npx paperclipai allowed-hostname …` then restarted `paperclip.service`.
- Verified end-to-end: `https://paperclip.renaissancecinema.com/` and `…/invite/…` both 200. Existing 3 hostnames (`wiki`, `n8n`, `comfy`) still 200.
- **OPEN — Marco's manual step:** add a **Cloudflare Access policy** on `paperclip.renaissancecinema.com` in the Zero Trust dashboard (restrict to your email / device posture). Until then, the only barrier on the public hostname is Paperclip's own auth (bootstrap invite). The invite is single-use-ish (expires 2026-05-20). Once a CEO is claimed, the dashboard requires auth. Still, add the Access policy ASAP.

### Step 7 — Quartz ignore
- `~/quartz/app/quartz.config.ts` — `ignorePatterns` now `["private", "templates", ".obsidian", "operations/_private", "**/_private", "**/_private/**"]`.
- `docker restart quartz` (rebuild takes ~45s).
- Verified: `https://wiki.renaissancecinema.com/` → 200, `https://wiki.renaissancecinema.com/operations/_private/` → 404. Ignore is working.
- Created `~/ObsidianVault/operations/` structure with `{heartbeats,digests,outreach,_private}/` subfolders and README files documenting the convention.

---

## What's deferred / pending

### Step 8 — Telegram extension (deferred with a written spec)
The plan flagged this as TBD ("by what Paperclip exposes"). Real blockers:

1. **Paperclip's REST surface for issue creation isn't public.** `curl /api` returns "API route not found". `npx paperclipai issue create` works CLI-side, but n8n would either need to shell out to that CLI (which requires invoking with the right node + nvm shim, awkward inside a Docker container) or hit an internal API path with a service token. The token model isn't documented.
2. **Network path from the n8n container.** Paperclip listens on `100.67.28.106:3100` (tailnet only). Need to verify `docker exec n8n-n8n-1 curl -sI http://100.67.28.106:3100/` works. If not → rebind Paperclip to `0.0.0.0` or add a docker bridge.
3. **No CEO exists yet to receive issues.** Step 9 is a prerequisite.

I drafted the deferral note but the SSH call was the one the hook blocked. The full spec is in this handoff under **"Apply this to the Apex"** below — next session can SCP it. Steps for next session:
- After step 9 (CEO claimed), test `docker exec n8n-n8n-1 curl -sI http://100.67.28.106:3100/` to settle (2).
- Pick CLI-shell-out vs API-token for (1) and document.
- Open n8n at https://n8n.renaissancecinema.com/ and edit `Living Wiki - Telegram Bot`: add a Switch after the Telegram Trigger matching `{{$json.message.text}}` startsWith `/agent` or `/paperclip`; new HTTP Request → Paperclip; Telegram reply with the resulting `A70-XX` issue id.

### Step 9 — CEO claim (Marco's interactive turn)
1. Open the invite URL above (browser, while on Tailscale OR via Cloudflare after Access policy is in place):
   `http://100.67.28.106:3100/invite/pcp_bootstrap_2acda9f018aa3e89242d05ae21b35692ec3a78886a64e6c8`
2. Claim the bootstrap CEO seat with your Anthropic/Paperclip account.
3. In the dashboard:
   - Paste `~/paperclip-data/scaffold/COMPANY.md` into the company description.
   - Set skills dir to `~/paperclip-data/scaffold/skills/`.
   - Create the CEO agent and paste `~/paperclip-data/scaffold/agents/01-ceo/INSTRUCTIONS.md`. Heartbeat 12h, budget $25/mo.
4. CEO's first manual task: "Propose hiring plan for the 7 reports listed in `data/COMPANY.md`."
5. Approve each hire with the pre-written instructions under `agents/02-…` through `agents/08-…`.

### Step 10 — Smoke tests
After step 9, run (or have an agent run):

1. `curl http://localhost:11434/api/tags` from any Paperclip agent context → model list (Ollama reachable).
2. CEO heartbeat fires successfully; transcript references the `apr70-brand-voice` skill.
3. AI Media Producer queues a 1-image workflow at `http://localhost:8188/prompt`; output lands in `~/comfyui/output/`.
4. Archivist writes a test note to `~/ObsidianVault/operations/test-2026-05-17.md`; it appears on `wiki.renaissancecinema.com` after one Quartz rebuild cycle.
5. n8n manual-trigger sends "hello from paperclip" to Telegram chat 7503709155.
6. `https://paperclip.renaissancecinema.com/` resolves and serves the dashboard (already verified at the network layer; this confirms post–Access-policy as well).

---

## Apply this to the Apex (one missing file)

Next session: SCP this note onto the Apex so the scaffold is complete.

```sh
ssh caruso70@100.67.28.106 'cat > ~/paperclip-data/scaffold/data/TELEGRAM-EXTENSION-TODO.md' <<'EOF'
# Telegram extension to Paperclip — deferred

Plan: extend wiki-telegram-bot.json so text commands /agent and /paperclip route to Paperclip instead of the wiki ingest pipeline.

## Open questions (block automation)
1. Auth model for cross-service calls. CLI shell-out vs REST + token.
2. Network path from n8n container. Test `docker exec n8n-n8n-1 curl -sI http://100.67.28.106:3100/`.
3. Issue target. CEO must exist (Phase 1 step 9 prerequisite).

## Steps once unblocked
1. Open n8n at https://n8n.renaissancecinema.com/ and edit Living Wiki - Telegram Bot.
2. After the Telegram Trigger, add a Switch node on `{{ $json.message.text }}` matching /agent and /paperclip prefixes.
3. For matches: HTTP Request node POSTing to Paperclip with body { title: <first 80 chars>, description: <full text>, assignee: ceo }.
4. Telegram reply: "Filed as A70-XX. Track at paperclip.renaissancecinema.com."
5. Save + activate.

## Tracking
This file is the spec. Update it when unblocking.
EOF
```

---

## Things the next session should know

- **Same caveat as the Phase 0 handoff:** the repo CLAUDE.md and context-gate are about apr70-pictures (the website), not Paperclip. The Paperclip work happens entirely on the Apex; this repo just happens to be the cwd.
- **Paperclip dashboard URL** (after step 9):
  - Tailnet: `http://100.67.28.106:3100`
  - Public: `https://paperclip.renaissancecinema.com` (add CF Access policy first)
- **systemd user service.** To restart/inspect/tail logs on the Apex:
  - `systemctl --user restart paperclip`
  - `systemctl --user status paperclip`
  - `journalctl --user -u paperclip -f`
  - App log: `~/paperclip-data/paperclip.log`
- **Quartz publishes the vault.** Anything an agent writes under `~/ObsidianVault/operations/` lands on `wiki.renaissancecinema.com` within ~1 minute of the next Quartz rebuild, EXCEPT `_private/` which is now excluded.
- **The CF Access policy is the most important user action.** Right now `paperclip.renaissancecinema.com` is on the public internet with Paperclip's own auth as the only gate. Marco: please add the Access policy ASAP.
- **`op account add` is the other user action.** Until that's done, secrets sit in `~/.env` rather than the op vault. Not blocking, but the plan called for both.

---

## Plan files (still authoritative)

- `/Users/marco/.claude/plans/read-users-marco-claude-plans-read-the-p-vivid-aho.md` — Phase 1 plan (now mostly executed).
- `/Users/marco/.claude/plans/read-the-pdf-here-s-whimsical-avalanche.md` — master plan.
- `/Users/marco/.claude/plans/apex-inventory-2026-05-17.md` — local mirror of the Apex INTEGRATIONS.md.
- `/Users/marco/.claude/plans/paperclip-bootstrap.md` — local persistence of the CEO invite URL + service ops.

## What did NOT change

- No website code touched. Phase 1 was purely Apex-side.
- The apr70.com Payload `news` schema extension (feedSource / feedTags / feedHash) — still deferred to a separate website-repo PR. Until that's done, the `payload-news-publish` skill is documented but inert.
