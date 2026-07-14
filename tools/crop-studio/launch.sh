#!/usr/bin/env bash
# Crop Studio launcher — the Desktop shortcut runs this.
# Boots the server if it is not already up; the server opens the browser itself
# on listen, so we only `open` when it was already running.
cd "$(dirname "$0")" || exit 1
if lsof -ti tcp:5177 >/dev/null 2>&1; then
  open "http://localhost:5177"
else
  nohup node server.mjs >/tmp/crop-studio.log 2>&1 &
fi
