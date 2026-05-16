#!/usr/bin/env bash
# PostToolUse hook — accumulates tool output bytes as a proxy for context usage.
# State stored in .claude/.context-meter (gitignored, session-local).

set -uo pipefail

METER_FILE="$(dirname "$0")/../.context-meter"

# Count bytes from stdin (tool output piped in)
BYTES=$(wc -c < /dev/stdin | tr -d ' ')

# Reset if meter file is stale (>4 hours old = different session)
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

# Read current state: line 1 = total bytes, line 2 = warned flag
if [ -f "$METER_FILE" ]; then
  TOTAL=$(sed -n '1p' "$METER_FILE" 2>/dev/null || echo "0")
  WARNED=$(sed -n '2p' "$METER_FILE" 2>/dev/null || echo "0")
else
  TOTAL=0
  WARNED=0
fi

# Accumulate
TOTAL=$((TOTAL + BYTES))
printf "%s\n%s\n" "$TOTAL" "$WARNED" > "$METER_FILE"

exit 0
