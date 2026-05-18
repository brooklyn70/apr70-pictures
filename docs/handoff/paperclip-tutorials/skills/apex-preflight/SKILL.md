---
name: apex-preflight
displayName: Apex Preflight
version: 0.1.0
kind: skill
description: Verify every external service and API key the company depends on before dispatching work. Returns exit 0 on green; non-zero with the failed line names the broken street.
commands:
  - id: run
    label: Run preflight
    cmd: bash
    args: ["preflight.sh"]
    timeoutSeconds: 30
env:
  optional:
    - TELEGRAM_BOT_TOKEN
    - DISCORD_BOT_TOKEN
    - YOUTUBE_DATA_API_KEY
    - ANTHROPIC_API_KEY
    - OPENROUTER_API_KEY
    - PERPLEXITY_API_KEY
---

# Apex Preflight

A one-shot health check the CEO runs before dispatching agent work each heartbeat. Every line is read-only — no external state is mutated. The exit code is the verdict; a non-zero exit names the broken wire on stderr.

## When the CEO should call this

- Start of each heartbeat cycle, before deciding what work to dispatch.
- After any infrastructure-related issue is filed (e.g. "Ollama not responding").
- Before approving a sub-agent's plan that touches external services.

## What it checks (17 wires)

1. Ollama API reachable at `localhost:11434`
2. Ollama serves `llama3.1:8b`, `qwen2.5:7b-instruct`, `deepseek-coder:6.7b`
3. ComfyUI reachable at `localhost:8188`
4. n8n container running
5. Paperclip API reachable on the Tailscale IP
6. cloudflared tunnel active
7. Telegram bot reachable (if `TELEGRAM_BOT_TOKEN` set)
8. Discord bot reachable (if `DISCORD_BOT_TOKEN` set)
9. YouTube Data API key validates (if `YOUTUBE_DATA_API_KEY` set)
10. Anthropic API reachable + key valid (if `ANTHROPIC_API_KEY` set)
11. OpenRouter API key valid (if `OPENROUTER_API_KEY` set)
12. Perplexity API key valid (if `PERPLEXITY_API_KEY` set)
13. NVIDIA GPU visible to the host
14. `loginctl` linger enabled for `caruso70` (Paperclip survives reboot)
15. Disk free under `~` > 10 GiB

## Output

```
Ollama API                       OK
Ollama llama3.1:8b               OK
Ollama qwen2.5                   OK
Ollama deepseek                  OK
ComfyUI stats                    OK
n8n container                    OK
Paperclip health                 OK
cloudflared tunnel               OK
Telegram bot reachable           OK
Discord bot reachable            OK
YouTube Data API                 OK
Anthropic API                    OK
OpenRouter                       OK
Perplexity                       OK
GPU visible                      OK
Linger enabled                   OK
Disk free > 10G                  OK
```

Failures print `FAIL` and the script exits with the count of failures. The CEO's heartbeat reads exit code: nonzero → log to issue `APR-INFRA: preflight ledger`, refuse dispatch, ask Board to investigate.

## Logging

Each run appends a single line to `~/ObsidianVault/operations/feeds/_status/preflight.log`:

```
2026-05-18T20:00:00Z exit=0 ok=17 fail=0
```

Last 30 days are visible in the published Quartz site.
