# T05 — Fully retire Gemini from the company

**Goal:** ensure no agent's JSON contains the substring `gemini` (case-insensitive) — adapter, command, env, model. Then optionally remove the `GEMINI_API_KEY` from `~/.env`.

**Prereqs:** T03 has moved Pipeline Researcher off Gemini.

## 1. Audit — find any lingering Gemini refs

```bash
BEARER=$(jq -r '.profiles.default.session.token' ~/.paperclip/context.json)
COMPANY_ID=$(npx paperclipai context show --json | jq -r '.profile.companyId')

curl -sS -H "Authorization: Bearer $BEARER" \
  "http://100.67.28.106:3100/api/companies/${COMPANY_ID}/agents" \
  | jq '[.[] | select(tostring | test("gemini"; "i")) | {name,id,adapter,model,command,env}]'
```

Expected after T03: `[]` (empty array).

If non-empty, repeat the PATCH pattern from T03 for each remaining agent until the audit returns `[]`.

## 2. Drop the env var from the agent record (belt-and-suspenders)

If `.env.GEMINI_API_KEY` is still present on Pipeline Researcher after T03 (PATCH replaces `env` if you sent a new `env` object — but if you used an `env merge` shape, the key may persist):

```bash
PIPELINE_ID=$(jq -r '.[] | select(.name=="Pipeline Researcher") | .id' /tmp/agents.json)

# Explicit overwrite with only the OLLAMA var
curl -sS -X PATCH \
  -H "Authorization: Bearer $BEARER" \
  -H "Content-Type: application/json" \
  -d '{"env":{"OLLAMA_BASE_URL":"http://localhost:11434"}}' \
  "http://100.67.28.106:3100/api/agents/${PIPELINE_ID}" | jq '.env'
```

> If PATCH does a deep-merge instead of replace, you'll need to send `{"env":{"GEMINI_API_KEY":null,"GEMINI_CLI_TRUST_WORKSPACE":null,"OLLAMA_BASE_URL":"http://localhost:11434"}}`. Check the behavior on the first call and adjust.

## 3. Remove the wrapper file on disk

```bash
ssh caruso70@100.67.28.106 'ls -la /tmp/gemini-debug.sh 2>/dev/null && rm -v /tmp/gemini-debug.sh'
```

## 4. (Optional) Strip `GEMINI_API_KEY` from `~/.env` and `paperclip.service`

This is Board sudo work — `~/.env` is owned by `caruso70` (user-mode) but `paperclip.service` references it via `EnvironmentFile=`. Edit:

```bash
ssh caruso70@100.67.28.106 'grep -v "^GEMINI" ~/.env > ~/.env.new && mv ~/.env.new ~/.env'
ssh caruso70@100.67.28.106 'systemctl --user restart paperclip'
```

Then re-verify T01: agent list still returns 8 agents, none with `gemini` substring.

## Verification

```bash
# Final audit — exit code 0 means clean
curl -sS -H "Authorization: Bearer $BEARER" \
  "http://100.67.28.106:3100/api/companies/${COMPANY_ID}/agents" \
  | jq -e '[.[] | select(tostring | test("gemini"; "i"))] | length == 0'
```

Output `true` → no Gemini anywhere.
