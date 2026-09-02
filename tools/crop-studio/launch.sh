#!/usr/bin/env bash
# Crop Studio launcher — the Desktop shortcut runs this.
# Boots the server if it is not already up; the server opens the browser itself
# on listen, so we only `open` when it was already running.
#
# 2026-09-02: a Finder-launched shell has a bare PATH (no /usr/local/bin, no
# Homebrew, no nvm), so `nohup node` died with "node: No such file or directory"
# (/tmp/crop-studio.log). Resolve node explicitly before booting.
cd "$(dirname "$0")" || exit 1

export PATH="/usr/local/bin:/opt/homebrew/bin:$HOME/.local/bin:$PATH"
NODE="$(command -v node 2>/dev/null)"
if [ -z "$NODE" ]; then
  # nvm installs live outside PATH until the shell profile runs; take the newest.
  NODE="$(ls -d "$HOME"/.nvm/versions/node/*/bin/node 2>/dev/null | sort -V | tail -1)"
fi
if [ -z "$NODE" ] || [ ! -x "$NODE" ]; then
  echo "Crop Studio: node not found (PATH=$PATH)" >/tmp/crop-studio.log
  osascript -e 'display alert "Crop Studio" message "node was not found. Install Node or fix the PATH in tools/crop-studio/launch.sh — see /tmp/crop-studio.log"' 2>/dev/null
  exit 1
fi

if lsof -ti tcp:5177 >/dev/null 2>&1; then
  open "http://localhost:5177"
else
  nohup "$NODE" server.mjs >/tmp/crop-studio.log 2>&1 &
fi
