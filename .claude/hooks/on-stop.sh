#!/usr/bin/env bash
# Claude Code Stop hook for apr70-pictures.
#
# Fires every time the main agent finishes a turn (not only at "session end"),
# so it must be quiet and safe to run many times. Rewritten 2026-09-02 on Marco's
# ruling after a day of noise commits ("auto: stop-hook BRIEF note" x6) and an
# untracked .cursor/mcp.json swept into history:
#   1. Commit ONLY tracked, modified files (git add -u). Never untracked files.
#   2. No BRIEF.md auto-note. BRIEF.md is written by the agent, by hand (rule 11).
#   3. Push only when the branch is ahead of its upstream.
#   4. Remove this session's context meter (keyed by session_id; see context-meter.sh).
#   5. Skip entirely when the hook input says stop_hook_active (re-entry guard).
#
# Note: Marco's user-level ~/.claude/settings.json has disableAllHooks: true.
# This project re-enables them at the project level via .claude/settings.json.
# Designed to fail gracefully: warnings, exit 0.

set -uo pipefail

INPUT=$(cat 2>/dev/null || echo "{}")
read -r ACTIVE SID < <(printf '%s' "$INPUT" | python3 -c '
import sys, json
try:
    d = json.load(sys.stdin)
except Exception:
    d = {}
print("1" if d.get("stop_hook_active") else "0", d.get("session_id") or "")
' 2>/dev/null || echo "0 ")

if [ "${ACTIVE:-0}" = "1" ]; then
  exit 0
fi

cd "$(dirname "$0")/../.." || exit 0

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "[on-stop] not a git repo; skipping"
  exit 0
fi

BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null || echo "")
if [ -z "$BRANCH" ]; then
  echo "[on-stop] detached HEAD; skipping"
  exit 0
fi

# A rebase or merge in progress belongs to a human or an agent mid-operation.
GIT_DIR=$(git rev-parse --git-dir)
if [ -d "$GIT_DIR/rebase-merge" ] || [ -d "$GIT_DIR/rebase-apply" ] || [ -f "$GIT_DIR/MERGE_HEAD" ]; then
  echo "[on-stop] rebase/merge in progress; skipping"
  exit 0
fi

# 1) Commit tracked changes only.
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  TOUCHED=$(git status --porcelain --untracked-files=no | awk '{print $2}' | head -5 | paste -sd', ' -)
  COUNT=$(git status --porcelain --untracked-files=no | wc -l | tr -d ' ')
  MORE=""
  [ "$COUNT" -gt 5 ] && MORE=" (+$((COUNT - 5)) more)"
  MSG="auto: stop-hook commit — ${TOUCHED}${MORE}"
  git add -u
  if git commit -q -m "$MSG" >/dev/null 2>&1; then
    echo "[on-stop] committed: $MSG"
  else
    echo "[on-stop] commit failed; leaving the tree as is"
  fi
fi
UNTRACKED=$(git status --porcelain | grep -c '^??' || true)
[ "$UNTRACKED" -gt 0 ] && echo "[on-stop] $UNTRACKED untracked path(s) left alone (never auto-added)"

# 2) Push only when ahead.
if git rev-parse --abbrev-ref --symbolic-full-name "@{u}" >/dev/null 2>&1; then
  AHEAD=$(git rev-list --count "@{u}..HEAD" 2>/dev/null || echo 0)
  if [ "${AHEAD:-0}" -gt 0 ]; then
    if git push -q origin "$BRANCH" 2>/dev/null; then
      echo "[on-stop] pushed $BRANCH ($AHEAD commit(s))"
    else
      echo "[on-stop] push failed (behind remote?); commits retained locally"
    fi
  fi
fi

# 3) Drop this session's context meter.
if [ -n "${SID:-}" ]; then
  rm -f ".claude/.context-meter-${SID}"
else
  rm -f .claude/.context-meter
fi

exit 0
