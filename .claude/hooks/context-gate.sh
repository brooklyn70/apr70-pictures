#!/usr/bin/env bash
# PreToolUse hook — enforces context handoff at threshold.
# First breach: warns agent and allows the tool call.
# Subsequent breaches: hard-blocks all tools except Write/Edit/Read/Bash(git*).

set -uo pipefail

METER_FILE="$(dirname "$0")/../.context-meter"
THRESHOLD=250000  # ~250KB tool output ≈ 55-60% context window

# Read stdin immediately (hook input JSON with tool_name, tool_input)
INPUT=$(cat 2>/dev/null || echo "{}")

# No meter file = fresh session, allow
if [ ! -f "$METER_FILE" ]; then
  exit 0
fi

TOTAL=$(sed -n '1p' "$METER_FILE" 2>/dev/null || echo "0")
WARNED=$(sed -n '2p' "$METER_FILE" 2>/dev/null || echo "0")

# Under threshold — allow silently
if [ "$TOTAL" -le "$THRESHOLD" ]; then
  exit 0
fi

# Over threshold, first time — warn and set flag (allow this tool call)
if [ "$WARNED" = "0" ]; then
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

# Over threshold, already warned — check if this is a handoff-allowed tool
TOOL_NAME=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_name',''))" 2>/dev/null || echo "")

case "$TOOL_NAME" in
  Write|Edit|Read)
    exit 0
    ;;
  Bash)
    COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('command',''))" 2>/dev/null || echo "")
    case "$COMMAND" in
      git*)
        exit 0
        ;;
    esac
    ;;
esac

# Hard block — tool is not in the handoff allowlist
echo "BLOCKED: Context limit exceeded. Only Write/Edit/Read and git commands are allowed. Complete your handoff and stop."
exit 2
