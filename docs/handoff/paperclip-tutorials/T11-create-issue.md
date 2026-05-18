# T11 — Create an issue from the CLI

**Goal:** file an issue assigned to CEO Silvi from the command line. This is how the Board hands work to the CEO without browser clicks.

**Prereqs:** T00, T01.

## Command

```bash
CEO_ID=$(jq -r '.[] | select(.name=="CEO Silvi") | .id' /tmp/agents.json)

npx paperclipai issue create \
  --title "Strategic reshape: free-models migration + skills expansion" \
  --description "$(cat <<'BODY'
Parent reshape issue for Phase 0 from /Users/marco/.claude/plans/well-the-ceo-won-t-sleepy-turing.md.

CEO scope:
1. Swap Pipeline Researcher adapter → Hermes (local), model llama3.1:8b. (See T03.)
2. Swap Archivist → Hermes (local), model qwen2.5:7b-instruct. (See T04.)
3. Swap Opportunities Scout → Hermes (local), model llama3.1:8b. (See T04.)
4. Verify each via heartbeat (T06).
5. Git-clone obra/superpowers, register the brainstorming/planning/systematic-debugging SKILL.md files via plugin install (T08).
6. Attach the new skills to the right agents per the matrix in T09.
7. Post a status comment on this parent issue when each substep is done.

Constraints:
- Gemini must be fully removed; T05 audit returns true.
- Apex preflight (T08 apex-preflight skill) must pass before each heartbeat dispatch.
- Stay within the agreed monthly cap.
BODY
)" \
  --status "todo" \
  --priority "high" \
  --assignee-agent-id "$CEO_ID" \
  --json | jq '{id, identifier, title, status, assigneeAgentId}'
```

## Expected output

```json
{
  "id": "<uuid>",
  "identifier": "APR-9",
  "title": "Strategic reshape: free-models migration + skills expansion",
  "status": "todo",
  "assigneeAgentId": "<CEO Silvi uuid>"
}
```

Save the identifier:

```bash
RESHAPE_ISSUE=APR-9
```

## Raw HTTP

```bash
BEARER=$(jq -r '.profiles.default.session.token' ~/.paperclip/context.json)
COMPANY_ID=$(npx paperclipai context show --json | jq -r '.profile.companyId')

curl -sS -X POST \
  -H "Authorization: Bearer $BEARER" \
  -H "Content-Type: application/json" \
  -d @/tmp/reshape-issue.json \
  "http://100.67.28.106:3100/api/companies/${COMPANY_ID}/issues" | jq '.'
```

Where `/tmp/reshape-issue.json` is `{"title":"...","description":"...","status":"todo","priority":"high","assigneeAgentId":"<id>"}`.

## File sub-issues

For each numbered item above, file a sub-issue with `--parent-id <reshape-issue uuid>`:

```bash
PARENT_ID=$(npx paperclipai issue get "$RESHAPE_ISSUE" --json | jq -r '.id')

npx paperclipai issue create \
  --title "Swap Pipeline Researcher → Hermes local" \
  --description "Apply T03 from docs/handoff/paperclip-tutorials/. Verify Gemini is gone via T05 audit." \
  --status "todo" \
  --priority "high" \
  --assignee-agent-id "$CEO_ID" \
  --parent-id "$PARENT_ID" \
  --json
```

Repeat for sub-issues 2–6.

## Verification

```bash
npx paperclipai issue list --json | jq '.[] | select(.title | contains("Strategic reshape")) | {identifier,status,assigneeAgentId}'
npx paperclipai issue get "$RESHAPE_ISSUE" --json | jq '.children // .subIssues | length'
# Expected: 6 (the substep sub-issues)
```
