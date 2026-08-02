#!/usr/bin/env bash
# Mirror GitHub main → NAS GitRepos after a merge (Cloud Agent PRs land on GitHub only).
# Run from any cwd; resolves the repo from this script's location. Needs Tailscale → apr70-nas.
set -euo pipefail
cd "$(cd "$(dirname "$0")/.." && pwd)"

remote_nas="${NAS_REMOTE:-nas}"
branch="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$branch" != "main" ]]; then
  echo "Refuse: checkout main first (on $branch) in $(pwd)." >&2
  exit 1
fi

git fetch origin
git pull --ff-only origin main
git fetch "$remote_nas"
git push "$remote_nas" main
echo "OK: $(pwd) origin/main → ${remote_nas}/main ($(git rev-parse --short HEAD))"
