# T01 — List all agents in the company

**Goal:** prove auth + context work; capture every agent's `id`, `name`, `adapter`, and `model` to a local file so later tutorials can reference them.

**Prereqs:** T00 complete.

## Command

```bash
npx paperclipai agent list --json | jq '.'
```

Or via raw HTTP (substitute `$BEARER` with the token stored at `~/.paperclip/context.json` under `profiles.default.session.token` — same value the CLI uses):

```bash
COMPANY_ID=$(npx paperclipai context show --json | jq -r '.profile.companyId')
BEARER=$(jq -r '.profiles.default.session.token' ~/.paperclip/context.json)

curl -sS -H "Authorization: Bearer $BEARER" \
  "http://100.67.28.106:3100/api/companies/${COMPANY_ID}/agents" | jq '.[] | {id,name,role,adapter,model}'
```

## Expected output shape

```json
[
  {
    "id": "<uuid>",
    "name": "CEO Silvi",
    "role": "ceo",
    "adapter": "claude-code",
    "model": "claude-sonnet-4-6",
    "shortname": "ceo-silvi"
  },
  {
    "id": "<uuid>",
    "name": "Pipeline Researcher",
    "role": "research",
    "adapter": "gemini-cli",
    "model": "gemini-1.5-flash"
  }
  ...
]
```

Expected agent set (8 total per the Phase 1 handoff):

1. CEO Silvi — Claude Code Sonnet 4.6
2. Content Director — Claude Code Sonnet 4.6
3. X Strategist — Claude Code Sonnet 4.6
4. Outreach Lead — Claude Code Sonnet 4.6
5. Archivist — Claude Code Haiku 4.5 (to be swapped to Hermes — see T04)
6. Opportunities Scout — Claude Code Haiku 4.5 (to be swapped to Hermes — see T04)
7. AI Media Producer — Cursor Cloud
8. Pipeline Researcher — Gemini CLI (BROKEN; to be retired — see T03/T05)

## Save IDs for later tutorials

```bash
npx paperclipai agent list --json > /tmp/agents.json
jq -r '.[] | "\(.name)\t\(.id)\t\(.adapter)\t\(.model)"' /tmp/agents.json | column -t -s $'\t'
```

## Verification

- Exit code 0 and non-empty JSON array.
- `Pipeline Researcher` appears with `adapter: gemini-cli` (will be the target of T03).
- `Archivist` and `Opportunities Scout` appear with `adapter: claude-code` and `model` containing `haiku` (targets of T04).
