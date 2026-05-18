# T02 — Get one agent's full config

**Goal:** see every field PATCH accepts. The shape returned by GET is the same shape PATCH expects (subset).

**Prereqs:** T01 complete, agent IDs captured in `/tmp/agents.json`.

## Command

```bash
PIPELINE_ID=$(jq -r '.[] | select(.name=="Pipeline Researcher") | .id' /tmp/agents.json)
npx paperclipai agent get "$PIPELINE_ID" --json | jq '.'
```

Or via raw HTTP:

```bash
BEARER=$(jq -r '.profiles.default.session.token' ~/.paperclip/context.json)
curl -sS -H "Authorization: Bearer $BEARER" \
  "http://100.67.28.106:3100/api/agents/${PIPELINE_ID}" | jq '.'
```

## Expected output shape (full agent JSON)

```json
{
  "id": "<uuid>",
  "companyId": "<uuid>",
  "name": "Pipeline Researcher",
  "shortname": "pipeline-researcher",
  "role": "research",
  "adapter": "gemini-cli",
  "model": "gemini-1.5-flash",
  "command": "/tmp/gemini-debug.sh",
  "env": {
    "GEMINI_API_KEY": "AIza...",
    "GEMINI_CLI_TRUST_WORKSPACE": "true"
  },
  "instructions": "...full INSTRUCTIONS.md body...",
  "skills": ["apr70-brand-voice", "ollama-summarize", ...],
  "heartbeat": {
    "enabled": true,
    "cadenceHours": 168
  },
  "createdAt": "...",
  "updatedAt": "..."
}
```

> Exact field names may differ (e.g. `adapterKey` vs `adapter`, `skillKeys` vs `skills`). **Always GET first to learn the canonical shape**, then PATCH with the same key names.

## Save the JSON for the PATCH round-trip in T03/T04/T05

```bash
npx paperclipai agent get "$PIPELINE_ID" --json > /tmp/pipeline-researcher.before.json
```

## Verification

- The JSON contains a non-empty `adapter` field.
- `env` is an object (may be empty `{}`).
- `command` may be `null` or a path string — note its current value.
- `skills` (or `skillKeys`) is an array of strings.

This round-trip pattern (GET → mutate locally → PATCH) is how T03/T04/T05 work.
