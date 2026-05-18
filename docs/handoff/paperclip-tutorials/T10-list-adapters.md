# T10 — Enumerate available adapters in this Paperclip build

**Goal:** confirm whether `hermes-local` (or whatever the local-Ollama adapter is named) ships with this build. If not, fall through to T10b.

**Prereqs:** T00 complete.

## The problem

There's no `paperclipai adapter list` subcommand in this CLI build. Adapters are baked into the server bundle and surfaced via the agent-edit UI dropdown. We need to confirm the exact `adapter` key string PATCH expects.

## Approach A — read from an existing agent

Every existing agent has an `adapter` field. Listing all of them shows every adapter currently in use:

```bash
npx paperclipai agent list --json | jq '[.[] | .adapter] | unique'
# Expected after Phase 1: ["claude-code", "cursor-cloud", "gemini-cli"]
```

This proves those three keys are valid. It does NOT prove `hermes-local` exists yet — no agent uses it.

## Approach B — grep the server bundle

```bash
ssh caruso70@100.67.28.106 '
  BUN=/home/caruso70/.npm/_npx/43414d9b790239bb/node_modules/paperclipai/dist/index.js
  grep -oE "\"(hermes[a-z-]*|ollama[a-z-]*|claude-code|cursor-cloud|gemini-cli)\"" "$BUN" | sort -u
'
```

Expected: if Hermes is built in, you'll see `"hermes-local"` (or similar) appear at least once.

## Approach C — probe the adapter dropdown via the UI's API (if any)

The web UI's agent-edit page populates the dropdown from somewhere. Likely `GET /api/adapters` or `GET /api/companies/<id>/adapters` (not in the extracted route list — try anyway, returns 404 if absent):

```bash
BEARER=$(jq -r '.profiles.default.session.token' ~/.paperclip/context.json)
COMPANY_ID=$(npx paperclipai context show --json | jq -r '.profile.companyId')

curl -sS -H "Authorization: Bearer $BEARER" \
  "http://100.67.28.106:3100/api/adapters" 2>&1 | head -20

curl -sS -H "Authorization: Bearer $BEARER" \
  "http://100.67.28.106:3100/api/companies/${COMPANY_ID}/adapters" 2>&1 | head -20
```

If both 404, the dropdown is hardcoded in the front-end bundle. Read it directly:

```bash
ssh caruso70@100.67.28.106 '
  grep -roE "(hermes|ollama|claude-code|cursor-cloud|gemini-cli)[A-Za-z0-9_-]*" \
    /home/caruso70/.npm/_npx/43414d9b790239bb/node_modules/@paperclipai/ 2>/dev/null \
    | grep -oE "[a-z-]+" | sort -u
'
```

## T10b — Fallback if Hermes isn't shipped

If grep returns no hermes-style string, use the **Claude Code adapter wrapped over `ollama run`**. The Claude Code adapter just shells out to a `command` you provide:

```json
{
  "adapter": "claude-code",
  "model": "ollama-llama3.1",
  "command": "/home/caruso70/bin/ollama-wrapper.sh",
  "env": {
    "OLLAMA_MODEL": "llama3.1:8b",
    "OLLAMA_BASE_URL": "http://localhost:11434"
  }
}
```

With `~/bin/ollama-wrapper.sh` containing:

```bash
#!/usr/bin/env bash
set -e
exec ollama run "${OLLAMA_MODEL:-llama3.1:8b}" "$@"
```

Make it executable: `chmod +x ~/bin/ollama-wrapper.sh`.

This works because the Claude Code adapter just expects a stdio child process — `ollama run` provides that.

## Alternate fallback — install adapter from npm

If the community ships a Hermes adapter as `@paperclipai/adapter-hermes` (or similar), install it as a plugin:

```bash
ssh caruso70@100.67.28.106 'npx paperclipai plugin install @paperclipai/adapter-hermes'
```

(Substitute the actual package name from `npm search paperclip-adapter`.)

## Decision tree

1. Grep bundle for `hermes` → if found, use `adapter: hermes-local` (or whatever the exact key is).
2. Else, look for a community adapter on npm — install and use its declared key.
3. Else, use T10b's `claude-code` + `ollama-wrapper.sh` fallback.

Lock the decision here once verified, then T03/T04 references it.
