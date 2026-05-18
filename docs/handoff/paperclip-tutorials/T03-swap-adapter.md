# T03 — Swap Pipeline Researcher's adapter (Gemini → Hermes/local)

**Goal:** retire Gemini on the Pipeline Researcher by PATCHing its adapter to Hermes Agent (local) pointed at Ollama. If Hermes isn't in this Paperclip build's adapter registry, fall back to the Claude Code adapter wrapped over `ollama run` (documented in T10b).

**Prereqs:** T01, T02 complete. `/tmp/pipeline-researcher.before.json` exists. Adapter availability checked via T10.

## 1. Build the PATCH body

```bash
PIPELINE_ID=$(jq -r '.id' /tmp/pipeline-researcher.before.json)

# Hermes path (preferred)
cat > /tmp/pipeline-researcher.patch.json <<'JSON'
{
  "adapter": "hermes-local",
  "model": "llama3.1:8b",
  "command": null,
  "env": {
    "OLLAMA_BASE_URL": "http://localhost:11434"
  }
}
JSON
```

> **Adapter key naming** — the bundle uses different conventions in different layers. T10 enumerates the exact `adapter` values this build accepts. Common candidates: `hermes-local`, `hermes`, `hermes-agent`, `ollama`. Use T10's output as authoritative.

## 2. PATCH via raw HTTP (no dedicated `agent update` CLI subcommand in this build)

```bash
BEARER=$(jq -r '.profiles.default.session.token' ~/.paperclip/context.json)

curl -sS -X PATCH \
  -H "Authorization: Bearer $BEARER" \
  -H "Content-Type: application/json" \
  -d @/tmp/pipeline-researcher.patch.json \
  "http://100.67.28.106:3100/api/agents/${PIPELINE_ID}" | jq '.'
```

> `paperclipai agent` only exposes `list / get / local-cli`; PATCH is HTTP-direct.

## 3. Re-GET to confirm

```bash
npx paperclipai agent get "$PIPELINE_ID" --json > /tmp/pipeline-researcher.after.json
diff <(jq -S . /tmp/pipeline-researcher.before.json) \
     <(jq -S . /tmp/pipeline-researcher.after.json)
```

## Verification

- `.adapter == "hermes-local"` (or whatever T10 reports as the canonical key).
- `.model == "llama3.1:8b"`.
- `.command == null` — the old `/tmp/gemini-debug.sh` wrapper is gone.
- `.env.GEMINI_API_KEY` removed (or set to empty); see T05 to be thorough.

## Rollback

```bash
curl -sS -X PATCH \
  -H "Authorization: Bearer $BEARER" \
  -H "Content-Type: application/json" \
  -d @/tmp/pipeline-researcher.before.json \
  "http://100.67.28.106:3100/api/agents/${PIPELINE_ID}"
```
