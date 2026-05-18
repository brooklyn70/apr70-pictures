# T09 — Attach a skill to a specific agent

**Goal:** make `apex-preflight` available to CEO Silvi so its heartbeat can invoke it. Attaching is a PATCH on the agent's `skills` (or `skillKeys`) array.

**Prereqs:** T07 (skill installed), T01 (agent IDs known), T02 (you know whether the field is named `skills` or `skillKeys`).

## 1. Inspect the current `skills` array

```bash
CEO_ID=$(jq -r '.[] | select(.name=="CEO Silvi") | .id' /tmp/agents.json)
npx paperclipai agent get "$CEO_ID" --json | jq '{name, skills, skillKeys}'
```

Use whichever field is non-null. Below, replace `skills` with `skillKeys` if that's the canonical name.

## 2. Build the new array (add `apex-preflight`)

```bash
CURRENT=$(npx paperclipai agent get "$CEO_ID" --json | jq -c '.skills // .skillKeys // []')
NEW=$(echo "$CURRENT" | jq -c '. + ["apex-preflight"] | unique')
echo "Current: $CURRENT"
echo "New:     $NEW"
```

## 3. PATCH

```bash
BEARER=$(jq -r '.profiles.default.session.token' ~/.paperclip/context.json)
curl -sS -X PATCH \
  -H "Authorization: Bearer $BEARER" \
  -H "Content-Type: application/json" \
  -d "{\"skills\": $NEW}" \
  "http://100.67.28.106:3100/api/agents/${CEO_ID}" | jq '{name, skills, skillKeys}'
```

## 4. Verify

```bash
npx paperclipai agent get "$CEO_ID" --json | jq '.skills // .skillKeys'
# Expected: contains "apex-preflight"
```

Cross-check from the plugin side:

```bash
npx paperclipai plugin inspect apex-preflight --json | jq '.usedBy // .agents'
# Expected: contains CEO Silvi's id or shortname
```

## Recommended attach map (after Phase 0.5 complete)

| Skill | Attached agents |
|---|---|
| `apr70-brand-voice` | CEO Silvi, Content Director, X Strategist, Outreach Lead |
| `ollama-summarize` | Archivist, Opportunities Scout, Pipeline Researcher |
| `obsidian-vault-read` | All 8 |
| `obsidian-vault-write` | CEO Silvi, Archivist, Pipeline Researcher |
| `n8n-trigger` | CEO Silvi, Outreach Lead |
| `apex-preflight` | CEO Silvi (only) |
| `superpowers-brainstorming` | CEO Silvi, Pipeline Researcher |
| `superpowers-planning` | CEO Silvi |
| `superpowers-systematic-debugging` | CEO Silvi, AI Media Producer |

Apply the same `add-and-PATCH` pattern for each row.

## Detach a skill

```bash
NEW=$(echo "$CURRENT" | jq -c 'map(select(. != "apex-preflight"))')
curl -sS -X PATCH -H "Authorization: Bearer $BEARER" -H "Content-Type: application/json" \
  -d "{\"skills\": $NEW}" \
  "http://100.67.28.106:3100/api/agents/${CEO_ID}"
```
