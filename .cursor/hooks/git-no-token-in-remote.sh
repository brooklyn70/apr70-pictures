#!/usr/bin/env bash
# Cursor beforeShellExecution: refuse commands that bake GitHub tokens into git remote config.
set -euo pipefail
payload=$(cat)
python3 -c '
import json, re, sys
try:
    d = json.loads(sys.stdin.read())
except json.JSONDecodeError:
    print("{\"permission\": \"allow\"}")
    sys.exit(0)
cmd = d.get("command") or ""

# git remote / git config … with embedded PAT-style auth
if re.search(
    r"git\s+(?:remote[^\n]*(?:set-url[^\n]*)?|config[^\n]*remote\.origin\.url[^\n]*)(?:x-access-token|github_pat_[A-Za-z0-9\-_]{20,}|ghp_[A-Za-z0-9]{20,})",
    cmd,
    re.I | re.M,
):
    sys.stdout.write(
        json.dumps(
            {
                "permission": "deny",
                "user_message": "Do not paste GitHub tokens into git remote. Use SSH deploy keys on NAS + GITHUB_TOKEN=op:// in apr70-orchestrator/.env for Docker pushes.",
                "agent_message": "Never mutate remote.origin with PAT. Host uses SSH deploy keys; orchestrator uses GITHUB_TOKEN from op inject.",
            }
        )
    )
    sys.exit(0)

print("{\"permission\": \"allow\"}")
sys.exit(0)
' <<<"$payload"
