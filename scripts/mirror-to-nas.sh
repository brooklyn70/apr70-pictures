#!/usr/bin/env bash
# Mirror GitHub main → NAS GitRepos after a merge (Cloud Agent PRs land on GitHub only).
# Run from a Mac that can SSH to apr70-nas (Tailscale). Does not touch media shares.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

remote_nas="${NAS_REMOTE:-nas}"
branch="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$branch" != "main" ]]; then
  echo "Refuse: checkout main first (on $branch)." >&2
  exit 1
fi

git fetch origin
git pull --ff-only origin main
git fetch "$remote_nas"
git push "$remote_nas" main
echo "OK: origin/main → ${remote_nas}/main ($(git rev-parse --short HEAD))"
