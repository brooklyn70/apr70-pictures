#!/usr/bin/env bash
# apex-preflight — verify every wire before agents do work.
# Exit 0 = all clear. Nonzero = count of failed checks.

set -u

FAIL=0
LOG_DIR="${HOME}/ObsidianVault/operations/feeds/_status"
mkdir -p "$LOG_DIR" 2>/dev/null || true
LOG_FILE="${LOG_DIR}/preflight.log"

check() {
  local label="$1"
  local cmd="$2"
  printf "%-32s " "$label"
  if eval "$cmd" >/dev/null 2>&1; then
    echo OK
  else
    echo FAIL
    FAIL=$((FAIL+1))
  fi
}

# Source env so API keys are available (skip silently if missing)
[ -f "$HOME/.env" ] && set -a && . "$HOME/.env" && set +a

check "Ollama API"                'curl -fsS --max-time 5 http://localhost:11434/api/tags'
check "Ollama llama3.1:8b"        'curl -fsS --max-time 5 http://localhost:11434/api/tags | grep -q llama3.1:8b'
check "Ollama qwen2.5"            'curl -fsS --max-time 5 http://localhost:11434/api/tags | grep -q qwen2.5'
check "Ollama deepseek"           'curl -fsS --max-time 5 http://localhost:11434/api/tags | grep -q deepseek-coder'
check "ComfyUI stats"             'curl -fsS --max-time 5 http://localhost:8188/system_stats'
check "n8n container"             'docker ps --format "{{.Names}}" | grep -q n8n'
check "Paperclip health"          'curl -fsS --max-time 5 http://100.67.28.106:3100/api/health | grep -q "\"status\":\"ok\""'
check "cloudflared tunnel"        'systemctl is-active cloudflared'

if [ -n "${TELEGRAM_BOT_TOKEN:-}" ]; then
  check "Telegram bot reachable"  'curl -fsS --max-time 5 "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe" | grep -q "\"ok\":true"'
else
  printf "%-32s %s\n" "Telegram bot reachable" "SKIP (no token)"
fi

if [ -n "${DISCORD_BOT_TOKEN:-}" ]; then
  check "Discord bot reachable"   'curl -fsS --max-time 5 -H "Authorization: Bot ${DISCORD_BOT_TOKEN}" https://discord.com/api/v10/users/@me | grep -q "\"id\""'
else
  printf "%-32s %s\n" "Discord bot reachable" "SKIP (no token)"
fi

if [ -n "${YOUTUBE_DATA_API_KEY:-}" ]; then
  check "YouTube Data API"        'curl -fsS --max-time 5 "https://www.googleapis.com/youtube/v3/videos?part=id&id=dQw4w9WgXcQ&key=${YOUTUBE_DATA_API_KEY}" | grep -q "\"items\""'
else
  printf "%-32s %s\n" "YouTube Data API" "SKIP (no key)"
fi

if [ -n "${ANTHROPIC_API_KEY:-}" ]; then
  check "Anthropic API"           'curl -fsS --max-time 8 -H "x-api-key: ${ANTHROPIC_API_KEY}" -H "anthropic-version: 2023-06-01" https://api.anthropic.com/v1/models | grep -q "\"data\""'
else
  printf "%-32s %s\n" "Anthropic API" "SKIP (no key)"
fi

if [ -n "${OPENROUTER_API_KEY:-}" ]; then
  check "OpenRouter"              'curl -fsS --max-time 5 -H "Authorization: Bearer ${OPENROUTER_API_KEY}" https://openrouter.ai/api/v1/models | head -c 50 | grep -q data'
else
  printf "%-32s %s\n" "OpenRouter" "SKIP (no key)"
fi

if [ -n "${PERPLEXITY_API_KEY:-}" ]; then
  check "Perplexity"              'curl -fsS --max-time 10 -H "Authorization: Bearer ${PERPLEXITY_API_KEY}" -H "Content-Type: application/json" -X POST https://api.perplexity.ai/chat/completions -d "{\"model\":\"sonar\",\"messages\":[{\"role\":\"user\",\"content\":\"hi\"}],\"max_tokens\":1}" | head -c 50 | grep -qiE "(id|choices)"'
else
  printf "%-32s %s\n" "Perplexity" "SKIP (no key)"
fi

check "GPU visible"               'nvidia-smi --query-gpu=name --format=csv,noheader'
check "Linger enabled"            'loginctl show-user caruso70 -p Linger 2>/dev/null | grep -q yes'
check "Disk free > 10G"           'df -BG "$HOME" | awk "NR==2 {gsub(/G/, \"\"); exit (\$4<10)}"'

TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
OK_COUNT=$((17 - FAIL))
echo "${TS} exit=${FAIL} ok=${OK_COUNT} fail=${FAIL}" >> "$LOG_FILE"

if [ $FAIL -eq 0 ]; then
  echo
  echo "PREFLIGHT OK — 17/17 wires green."
else
  echo
  echo "PREFLIGHT FAIL — ${FAIL} wire(s) red. CEO should not dispatch work until fixed."
fi

exit $FAIL
