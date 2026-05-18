# T04 — Swap Archivist + Opportunities Scout to Hermes (local)

**Goal:** move two low-cost-routine agents off Claude Code Haiku (paid) onto Hermes Agent (local) backed by Ollama. Expected monthly savings: ~$10–15.

**Prereqs:** T01 (IDs), T02 (round-trip pattern), T10 (adapter key confirmed).

## Model choice

| Agent | Task profile | Suggested Ollama model |
|---|---|---|
| Archivist | Summarize and tag inbound captures | `qwen2.5:7b-instruct` (better at structured summarization than llama3.1:8b on small contexts) |
| Opportunities Scout | OCR triage + lead enrichment | `llama3.1:8b` (general purpose, faster) |

All three local models fit on an RTX 4000 8GB one-at-a-time. Ollama swaps the resident model on demand. No code-side rotation needed.

## Apply the swap

```bash
BEARER=$(jq -r '.profiles.default.session.token' ~/.paperclip/context.json)
ARCHIVIST_ID=$(jq -r '.[] | select(.name=="Archivist") | .id' /tmp/agents.json)
SCOUT_ID=$(jq -r '.[] | select(.name=="Opportunities Scout") | .id' /tmp/agents.json)

# Save current state for rollback
npx paperclipai agent get "$ARCHIVIST_ID" --json > /tmp/archivist.before.json
npx paperclipai agent get "$SCOUT_ID" --json > /tmp/scout.before.json

# Archivist → qwen2.5
curl -sS -X PATCH \
  -H "Authorization: Bearer $BEARER" \
  -H "Content-Type: application/json" \
  -d '{"adapter":"hermes-local","model":"qwen2.5:7b-instruct","command":null,"env":{"OLLAMA_BASE_URL":"http://localhost:11434"}}' \
  "http://100.67.28.106:3100/api/agents/${ARCHIVIST_ID}" | jq '{name,adapter,model}'

# Opportunities Scout → llama3.1:8b
curl -sS -X PATCH \
  -H "Authorization: Bearer $BEARER" \
  -H "Content-Type: application/json" \
  -d '{"adapter":"hermes-local","model":"llama3.1:8b","command":null,"env":{"OLLAMA_BASE_URL":"http://localhost:11434"}}' \
  "http://100.67.28.106:3100/api/agents/${SCOUT_ID}" | jq '{name,adapter,model}'
```

## Verification

```bash
npx paperclipai agent list --json | jq '.[] | select(.name=="Archivist" or .name=="Opportunities Scout") | {name,adapter,model}'
```

Expected output:

```json
{"name": "Archivist", "adapter": "hermes-local", "model": "qwen2.5:7b-instruct"}
{"name": "Opportunities Scout", "adapter": "hermes-local", "model": "llama3.1:8b"}
```

## Sanity check — confirm Ollama still serves both

```bash
ssh caruso70@100.67.28.106 'curl -sS http://localhost:11434/api/tags | jq ".models[].name"'
# Expected: "llama3.1:8b", "qwen2.5:7b-instruct", "deepseek-coder:6.7b"
```

## Cost note

The 4 keep-on-Sonnet agents (CEO Silvi, Content Director, X Strategist, Outreach Lead) handle judgment- and copy-heavy work; their token spend earns its keep. The AI Media Producer stays on Cursor Cloud (already-paid sub). After this swap, the only paid Anthropic spend comes from those 4 + Pipeline Researcher (which now goes Hermes per T03), leaving 4 paid agents instead of 6.
