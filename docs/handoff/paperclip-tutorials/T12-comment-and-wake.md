# T12 — Comment on an issue and wake the assigned agent

**Goal:** post a board comment on the reshape issue from T11 and explicitly wake CEO Silvi so its next heartbeat picks up the work immediately (instead of waiting for the natural 12h cadence).

**Prereqs:** T11 (issue exists), T01 (agent ID known).

## 1. Comment on the issue

```bash
ISSUE_ID=$(npx paperclipai issue get APR-9 --json | jq -r '.id')

npx paperclipai issue comment "$ISSUE_ID" \
  --body "Board: please start with substep 1 (Pipeline Researcher swap). T03 in docs/handoff/paperclip-tutorials/ has the exact PATCH body. Report back as a sub-comment when done." \
  --json | jq '{id, body, authorRole, createdAt}'
```

Raw HTTP:

```bash
BEARER=$(jq -r '.profiles.default.session.token' ~/.paperclip/context.json)
curl -sS -X POST \
  -H "Authorization: Bearer $BEARER" \
  -H "Content-Type: application/json" \
  -d '{"body":"Board: please start with substep 1..."}' \
  "http://100.67.28.106:3100/api/issues/${ISSUE_ID}/comments" | jq '.'
```

## 2. Wake the agent (skip waiting for the cadence)

No CLI subcommand for wakeup, but the route is `POST /api/agents/<id>/wakeup`:

```bash
CEO_ID=$(jq -r '.[] | select(.name=="CEO Silvi") | .id' /tmp/agents.json)

curl -sS -X POST \
  -H "Authorization: Bearer $BEARER" \
  -H "Content-Type: application/json" \
  -d '{"reason":"reshape issue filed; immediate execution requested"}' \
  "http://100.67.28.106:3100/api/agents/${CEO_ID}/wakeup" | jq '.'
```

Expected response: a `heartbeat-run` ID. The run starts immediately; stream it per T06:

```bash
RUN_ID=$(curl -sS -X POST -H "Authorization: Bearer $BEARER" -H "Content-Type: application/json" \
  -d '{"reason":"reshape kickoff"}' \
  "http://100.67.28.106:3100/api/agents/${CEO_ID}/wakeup" | jq -r '.runId // .id')

watch -n 5 "curl -sS -H 'Authorization: Bearer $BEARER' \
  'http://100.67.28.106:3100/api/heartbeat-runs/${RUN_ID}/events?afterSeq=0&limit=100' | jq '.[] | {seq,type,at}' | tail -20"
```

## 3. Verify CEO acted

After ~5 minutes:

```bash
# Did CEO comment on the issue?
npx paperclipai issue get APR-9 --json | jq '.comments[] | select(.authorRole=="agent") | {at: .createdAt, body: .body[0:120]}'

# Did CEO create sub-issues?
npx paperclipai issue list --json | jq '.[] | select(.parentId==env.PARENT_UUID) | {identifier,title,status,assigneeAgentId}'

# Did CEO modify any agents?
npx paperclipai agent list --json | jq '.[] | select(.name=="Pipeline Researcher") | {name,adapter,model,updatedAt}'
```

## Verification

- New comment from CEO Silvi on APR-9 within one heartbeat cycle of the wakeup.
- Pipeline Researcher's `updatedAt` is newer than the wakeup time.
- `agent list` shows `adapter: hermes-local` (or fallback per T10) on the swapped agents.
- `apex-preflight` skill ran as part of CEO's pre-dispatch check (visible in heartbeat events).

## When NOT to use wakeup

- Don't wakeup the CEO multiple times per hour. Each wakeup costs tokens. The CEO's natural cadence (12h) is intentionally slow.
- Routine status checks go through `dashboard get` and `activity list`, not new wakeups.
