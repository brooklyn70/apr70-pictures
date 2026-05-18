# T00 — Auth bootstrap and CLI context

**Goal:** get the CLI authenticated as Marco (board user) once, store a context profile so subsequent calls don't need `--api-base`, and verify with `whoami`.

**Prereqs:** Tailscale up on Marco's Mac so `100.67.28.106:3100` resolves. Paperclip service running (`systemctl --user is-active paperclip` returns `active`).

## 1. Set a context profile (one-time)

```bash
# run on Apex OR Mac — whichever you'll use as the CLI workstation
npx paperclipai context set \
  --profile default \
  --api-base http://100.67.28.106:3100 \
  --use
```

Verify:

```bash
npx paperclipai context show
# Expected:
# {
#   "contextPath": "/home/<user>/.paperclip/context.json",
#   "currentProfile": "default",
#   "profile": { "apiBase": "http://100.67.28.106:3100" }
# }
```

## 2. Trigger the board-user login

```bash
npx paperclipai auth login --instance-admin
```

Expected output:

```
Board authentication required
Open this URL in your browser to approve CLI access:
http://100.67.28.106:3100/cli-auth/<uuid>?token=pcp_cli_auth_<random>
```

**Action:** open that URL in a browser on Marco's Mac (Brave/Safari/Chrome). The page is at the Tailscale IP, so the browser must be on the Tailnet too. Marco clicks **Approve**. The CLI process polls and returns success.

> Headless on the Apex: the CLI prints "Opened the approval page in your browser" but on a headless box that silently fails — copy the URL by hand. The poll keeps running for ~5 min so there's time to copy/paste.

## 3. Verify auth

```bash
npx paperclipai auth whoami --json
# Expected JSON includes: { "user": { "id": "...", "email": "...", "role": "instance_admin" } }
```

## 4. Get the company ID (used by every other call)

```bash
npx paperclipai company list --json | jq '.[] | {id,name,shortname}'
# Expected: one record for APR 70 Operations.
# Save: export COMPANY_ID=<id>
```

Set it as the default for the profile so you can omit `-C` thereafter:

```bash
npx paperclipai context set --profile default --company-id "$COMPANY_ID"
```

## 5. (Optional) Mint an agent API key for unattended scripts

When you need an agent identity (e.g. for a preflight skill that calls the API on a heartbeat), mint a key:

```bash
npx paperclipai agent local-cli <agentRef>
# Outputs shell exports:
#   export PAPERCLIPAI_API_KEY=pcp_agent_...
#   export PAPERCLIPAI_API_BASE=http://100.67.28.106:3100
# Source it: eval "$(npx paperclipai agent local-cli ceo-silvi --eval 2>/dev/null || true)"
```

Verify the key:

```bash
curl -sS -H "Authorization: Bearer $PAPERCLIPAI_API_KEY" \
  http://100.67.28.106:3100/api/cli-auth/me | jq
```

## Troubleshooting

- **`API error 401: Board authentication required`** — you skipped step 2 or your session expired. Re-run `auth login`.
- **`connect to 127.0.0.1 port 3100 failed`** — you're on the Apex calling `localhost`. The server binds `--bind tailnet`; use `http://100.67.28.106:3100` (Tailscale interface) or `https://paperclip.renaissancecinema.com` (public tunnel) instead.
- **`API error 403: Board access required`** — your token is valid but lacks board scope. Re-login with `--instance-admin`.
