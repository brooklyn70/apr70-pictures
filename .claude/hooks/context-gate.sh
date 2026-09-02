#!/usr/bin/env bash
# PreToolUse hook — enforces context handoff at threshold (CLAUDE.md rule 14).
# First breach: warns agent and allows the tool call.
# Subsequent breaches: hard-blocks all tools except Write/Edit/Read/Bash(git*).
#
# 2026-09-02: the meter is per session (see context-meter.sh), so subagent and
# sibling-session output no longer trips the parent's gate.

set -uo pipefail

THRESHOLD=250000  # ~250KB tool output ≈ 55-60% context window

INPUT=$(cat 2>/dev/null || echo "{}")
read -r SID TOOL_NAME < <(printf '%s' "$INPUT" | python3 -c '
import sys, json
try:
    d = json.load(sys.stdin)
except Exception:
    d = {}
print(d.get("session_id") or "-", d.get("tool_name") or "-")
' 2>/dev/null || echo "- -")

HOOK_DIR="$(dirname "$0")"
if [ -n "$SID" ] && [ "$SID" != "-" ]; then
  METER_FILE="$HOOK_DIR/../.context-meter-$SID"
else
  METER_FILE="$HOOK_DIR/../.context-meter"
fi

# No meter file = fresh session, allow
if [ ! -f "$METER_FILE" ]; then
  exit 0
fi

TOTAL=$(sed -n '1p' "$METER_FILE" 2>/dev/null || echo "0")
WARNED=$(sed -n '2p' "$METER_FILE" 2>/dev/null || echo "0")

if [ "${TOTAL:-0}" -le "$THRESHOLD" ]; then
  exit 0
fi

if [ "${WARNED:-0}" = "0" ]; then
  printf "%s\n1\n" "$TOTAL" > "$METER_FILE"
  cat <<'WARN'
CONTEXT THRESHOLD REACHED (rule #14 enforced). Do the following NOW:
1. Write handoff doc to docs/handoff/[model]-[date]-[summary].md
2. Update BRIEF.md with what was accomplished this session
3. git add + commit + push
4. Tell the user: "Context threshold reached. Handoff committed. Start a fresh session."
Then STOP. No more feature work. Only Write/Edit/Read and git commands are allowed after this.
WARN
  exit 0
fi

case "$TOOL_NAME" in
  Write|Edit|Read)
    exit 0
    ;;
  Bash)
    COMMAND=$(printf '%s' "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('command',''))" 2>/dev/null || echo "")
    case "$COMMAND" in
      git*)
        exit 0
        ;;
    esac
    ;;
esac

echo "BLOCKED: Context limit exceeded. Only Write/Edit/Read and git commands are allowed. Complete your handoff and stop."
exit 2
