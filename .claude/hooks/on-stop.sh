#!/usr/bin/env bash
# Claude Code Stop hook for apr70-pictures.
#
# Runs automatically at the end of every Claude Code session in this repo.
# Goal: no human reminders to push or update handoffs. The hook does:
#   1. If there are uncommitted changes, commit them with an auto-generated
#      message that names the touched files.
#   2. Push the current branch to origin.
#   3. Append a session-end note to BRIEF.md (if missing, leave alone).
#
# Note: Marco's user-level ~/.claude/settings.json has disableAllHooks: true.
# This project re-enables them at the project level via .claude/settings.json.
# To turn off auto-commit/push for this repo, set disableAllHooks: true in
# the project settings (and this hook will simply not run).
#
# Designed to fail gracefully — if anything goes wrong, the hook prints a
# warning and exits 0 so the agent doesn't see a failed-hook error in the UI.

set -uo pipefail

cd "$(dirname "$0")/../.." || exit 0

# Bail if we're not in a git repo (e.g. someone moved the script).
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "[on-stop] not a git repo; skipping"
  exit 0
fi

# Bail on detached HEAD — let the human decide.
BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null || echo "")
if [ -z "$BRANCH" ]; then
  echo "[on-stop] detached HEAD; skipping auto-push"
  exit 0
fi

# 1) Auto-commit if there are changes.
if [ -n "$(git status --porcelain)" ]; then
  TOUCHED=$(git status --porcelain | awk '{print $2}' | head -5 | paste -sd', ' -)
  COUNT=$(git status --porcelain | wc -l | tr -d ' ')
  MORE=""
  if [ "$COUNT" -gt 5 ]; then
    MORE=" (+$((COUNT - 5)) more)"
  fi
  MSG="auto: session end — touched ${TOUCHED}${MORE}"
  echo "[on-stop] committing: $MSG"
  git add -A
  if ! git commit -m "$MSG" >/dev/null 2>&1; then
    echo "[on-stop] commit failed; skipping push"
    exit 0
  fi
fi

# 2) Push (only if upstream is configured).
if git rev-parse --abbrev-ref --symbolic-full-name "@{u}" >/dev/null 2>&1; then
  if git push origin "$BRANCH" 2>&1 | tail -3; then
    echo "[on-stop] pushed $BRANCH to origin"
  else
    echo "[on-stop] push failed; commit retained locally"
  fi
else
  echo "[on-stop] no upstream for $BRANCH; skipping push"
fi

# 3) Append a session note to BRIEF.md if it exists.
if [ -f BRIEF.md ]; then
  TS=$(date -u +"%Y-%m-%d %H:%M UTC")
  printf "\n## Auto-stop note (%s)\n\n- Branch: %s\n- Tip: %s\n" \
    "$TS" "$BRANCH" "$(git rev-parse --short HEAD 2>/dev/null || echo unknown)" \
    >> BRIEF.md
  # If anything got appended and BRIEF.md isn't already part of the just-made
  # commit, make a tiny follow-up commit just for the BRIEF line.
  if [ -n "$(git status --porcelain BRIEF.md)" ]; then
    git add BRIEF.md
    git commit -m "auto: stop-hook BRIEF note" >/dev/null 2>&1 || true
    git push origin "$BRANCH" 2>&1 | tail -1 || true
  fi
fi

exit 0
