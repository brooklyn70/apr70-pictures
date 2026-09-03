#!/usr/bin/env bash
# PostToolUse hook — accumulates tool output bytes as a proxy for context usage.
#
# 2026-09-02 (Marco's ruling, plan A.6): the meter is keyed by session_id, so a
# subagent or a second session in the same repo no longer charges the parent.
# State: .claude/.context-meter-<session_id> (gitignored). Falls back to the old
# shared file when the hook input carries no session_id.

set -uo pipefail

INPUT=$(cat 2>/dev/null || echo "")
# Count only text that lands in context. Image payloads (PDF pages, PNG reads)
# arrive as base64 blobs that would bill ~1MB for a 7-page PDF (bitten
# 2026-09-02) while costing the model a few K tokens. Any one call is also
# capped at 64KB: Claude Code truncates single tool results well below that.
read -r SID BYTES < <(printf '%s' "$INPUT" | python3 -c '
import sys, json
raw = sys.stdin.read()
try:
    d = json.loads(raw)
except Exception:
    print("-", min(len(raw), 65536)); sys.exit()
CAP = 65536
def walk(v):
    if isinstance(v, str):
        # base64 image data: long, no whitespace
        if len(v) > 2048 and " " not in v and "\n" not in v:
            return 0
        return len(v)
    if isinstance(v, dict):
        if v.get("type") == "image" or "base64" in str(v.get("source", {}).get("type", "")):
            return 0
        return sum(walk(x) for k, x in v.items() if k not in ("session_id", "cwd", "transcript_path"))
    if isinstance(v, list):
        return sum(walk(x) for x in v)
    return 0
print(d.get("session_id") or "-", min(walk(d), CAP))
' 2>/dev/null || echo "- 0")
[ "$SID" = "-" ] && SID=""

HOOK_DIR="$(dirname "$0")"
if [ -n "$SID" ]; then
  METER_FILE="$HOOK_DIR/../.context-meter-$SID"
else
  METER_FILE="$HOOK_DIR/../.context-meter"
fi

# Reset if the meter is stale (>4 hours old = an abandoned session)
if [ -f "$METER_FILE" ]; then
  if [ "$(uname)" = "Darwin" ]; then
    FILE_AGE=$(( $(date +%s) - $(stat -f %m "$METER_FILE") ))
  else
    FILE_AGE=$(( $(date +%s) - $(stat -c %Y "$METER_FILE") ))
  fi
  if [ "$FILE_AGE" -gt 14400 ]; then
    printf "0\n0\n" > "$METER_FILE"
  fi
fi

if [ -f "$METER_FILE" ]; then
  TOTAL=$(sed -n '1p' "$METER_FILE" 2>/dev/null || echo "0")
  WARNED=$(sed -n '2p' "$METER_FILE" 2>/dev/null || echo "0")
else
  TOTAL=0
  WARNED=0
fi

TOTAL=$((${TOTAL:-0} + ${BYTES:-0}))
printf "%s\n%s\n" "$TOTAL" "${WARNED:-0}" > "$METER_FILE"

# Sweep meters older than a day so the folder does not fill with dead sessions.
find "$HOOK_DIR/.." -maxdepth 1 -name '.context-meter-*' -mtime +1 -delete 2>/dev/null || true

exit 0
