#!/usr/bin/env bash
# PostToolUse hook — accumulates tool output bytes as a proxy for context usage.
#
# 2026-09-02 (Marco's ruling, plan A.6): the meter is keyed by session_id, so a
# subagent or a second session in the same repo no longer charges the parent.
# State: .claude/.context-meter-<session_id> (gitignored). Falls back to the old
# shared file when the hook input carries no session_id.

set -uo pipefail

INPUT=$(cat 2>/dev/null || echo "")
BYTES=$(printf '%s' "$INPUT" | wc -c | tr -d ' ')
SID=$(printf '%s' "$INPUT" | python3 -c 'import sys,json
try: print(json.load(sys.stdin).get("session_id") or "")
except Exception: print("")' 2>/dev/null || echo "")

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
