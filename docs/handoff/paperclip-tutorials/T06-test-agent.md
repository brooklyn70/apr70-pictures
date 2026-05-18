# T06 — Run one agent heartbeat and stream live logs

**Goal:** after swapping an agent's adapter, fire a single heartbeat cycle and watch the log stream. If the new adapter/model wiring works, you'll see the agent come alive, read its instructions, and post a status (or do nothing if there are no open issues — which is also a pass).

**Prereqs:** T03 or T04 complete.

## Command

```bash
PIPELINE_ID=$(jq -r '.[] | select(.name=="Pipeline Researcher") | .id' /tmp/agents.json)
npx paperclipai heartbeat run --agent-id "$PIPELINE_ID"
```

Run `npx paperclipai heartbeat run --help` to see the exact flags this build supports — common ones include `--agent-id`, `--once`, and `--follow`.

## Expected output

The CLI prints the heartbeat run ID and streams events:

```
heartbeat-run id=<runId> agent=Pipeline Researcher adapter=hermes-local model=llama3.1:8b
[event] adapter.boot ok
[event] instructions.load bytes=2840
[event] issues.list count=0
[event] heartbeat.complete status=idle reason="no_assigned_issues"
```

If the adapter fails, you'll see a `[event] adapter.error` line with a stderr snippet — usually means Ollama isn't reachable or the model isn't pulled.

## Stream events for a long-running heartbeat (curl)

If you already have a heartbeat run ID and want to watch events directly:

```bash
BEARER=$(jq -r '.profiles.default.session.token' ~/.paperclip/context.json)
RUN_ID=<runId from above>

# Events (Server-Sent Events or polling)
curl -sS -H "Authorization: Bearer $BEARER" \
  "http://100.67.28.106:3100/api/heartbeat-runs/${RUN_ID}/events?afterSeq=0&limit=100" | jq '.'

# Raw log (16KB-paginated)
curl -sS -H "Authorization: Bearer $BEARER" \
  "http://100.67.28.106:3100/api/heartbeat-runs/${RUN_ID}/log?offset=0&limitBytes=16384"
```

## Verification

- `adapter.boot ok` event appears.
- No `adapter.error` events.
- `heartbeat.complete` event appears at the end.
- Ollama process briefly spikes CPU/GPU during the run (`nvidia-smi` shows the resident model loaded).

## Troubleshooting

- **`adapter not found: hermes-local`** — your adapter key is wrong. Re-run T10 to enumerate.
- **`connection refused: 11434`** — Ollama isn't running. `ssh caruso70@100.67.28.106 systemctl status ollama`.
- **`model not found: llama3.1:8b`** — pull it: `ssh caruso70@100.67.28.106 ollama pull llama3.1:8b`.
