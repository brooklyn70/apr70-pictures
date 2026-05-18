# Paperclip API/CLI tutorials — APR 70 Operations

**Target instance:** `http://100.67.28.106:3100` (Apex, bound to Tailscale interface only)
**Reachable via:** Tailscale on Marco's Mac. NOT reachable from localhost on the Apex (server binds with `--bind tailnet`, not `localhost`).
**Public hostname:** `https://paperclip.renaissancecinema.com` (cloudflared tunnel; same instance, same auth).

These tutorials assume you SSH to the Apex (`ssh caruso70@100.67.28.106`) and run the CLI there, OR run the CLI from Marco's Mac with `--api-base http://100.67.28.106:3100`.

## Read order

1. `T00-auth-and-context.md` — one-time browser approval, then context profile so you don't repeat `--api-base` every call.
2. `T01-list-agents.md` → `T12-comment-and-wake.md` — task-by-task.

## Surface map (verified 2026-05-18)

CLI commands (`npx paperclipai <cmd>`):

| Group | Subcommands |
|---|---|
| `auth` | bootstrap-ceo, login, logout, whoami |
| `context` | show, list, use, set |
| `company` | list, get, export, import, delete |
| `agent` | list, get, local-cli |
| `issue` | list, get, create, update, comment, checkout, release, feedback:list, feedback:export |
| `approval` | list, get, create, approve, reject, request-revision, resubmit, comment |
| `plugin` | init, list, install, uninstall, enable, disable, inspect, examples |
| `secrets` | list, declarations, create, link, doctor, providers, migrate-inline-env |
| `dashboard` | get |
| `activity` | list |
| `heartbeat` | run |
| `routines` | disable-all |

API routes (extracted from `paperclipai/dist/index.js`):

```
GET    /api/health
GET    /api/cli-auth/me
POST   /api/cli-auth/challenges
POST   /api/cli-auth/revoke-current
GET    /api/companies
GET    /api/companies/<id>
GET    /api/companies/<id>/agents
GET    /api/companies/<id>/issues
GET    /api/companies/<id>/approvals
GET    /api/companies/<id>/activity
GET    /api/companies/<id>/dashboard
GET    /api/companies/<id>/secrets
GET    /api/companies/<id>/secret-providers
GET    /api/companies/<id>/heartbeat-runs
POST   /api/companies/<id>/imports/preview
POST   /api/companies/<id>/imports/apply
POST   /api/companies/<id>/export
POST   /api/companies/import
POST   /api/companies/import/preview
GET    /api/agents/<id>
PATCH  /api/agents/<id>
POST   /api/agents/<id>/wakeup
POST   /api/agents/<id>/keys
GET    /api/issues/<idOrIdentifier>
PATCH  /api/issues/<id>
POST   /api/issues/<id>/comments
POST   /api/issues/<id>/checkout
POST   /api/issues/<id>/release
GET    /api/approvals/<id>
POST   /api/approvals/<id>/approve
POST   /api/approvals/<id>/reject
POST   /api/approvals/<id>/request-revision
POST   /api/approvals/<id>/resubmit
POST   /api/approvals/<id>/comments
GET    /api/plugins
POST   /api/plugins/install
GET    /api/plugins/examples
GET    /api/plugins/<key>
DELETE /api/plugins/<key>
POST   /api/plugins/<key>/enable
POST   /api/plugins/<key>/disable
GET    /api/heartbeat-runs/<id>/events
GET    /api/heartbeat-runs/<id>/log
GET    /api/feedback-traces/<id>/bundle
POST   /api/secrets/<id>/rotate
```

## Authentication model

Two tiers:

1. **Board user** — interactive `auth login`, browser-approved, persisted to `~/.paperclip/context.json`. Used by Marco-on-Mac (or this agent SSH-ing into the Apex as `caruso70`).
2. **Agent API key** — bearer token minted with `paperclipai agent local-cli <agentRef>` or via `POST /api/agents/<id>/keys`. Used by agents calling the API. Passed as `--api-key <token>` or `Authorization: Bearer <token>`.

This build is **deployment-mode "authenticated", exposure "private"** — every endpoint except `/api/health` requires one of the two auth tiers.

## Important: skills are plugins in this build

There is no separate `skill` CLI noun or `/api/skills` route. The 5 installed "skills" (`apr70-brand-voice`, `ollama-summarize`, `obsidian-vault-read`, `obsidian-vault-write`, `n8n-trigger`) are installed via `paperclipai plugin install --local <path>` and listed via `paperclipai plugin list`. The scaffold dir `~/paperclip-data/scaffold/skills/<name>/SKILL.md` is the source layout the plugin loader scans.

T07–T09 use the `plugin` CLI accordingly.

## Conventions in these tutorials

- Code blocks marked `# run on Apex` assume you're SSH'd in as `caruso70`.
- Code blocks marked `# run on Mac` assume Tailscale is up and the CLI talks to `http://100.67.28.106:3100`.
- Wherever a command needs a company ID, agent ID, or issue ID, the placeholder is `<companyId>` / `<agentId>` / `<issueId>`. Resolve via T01 and T11 first.
- All examples use `--json` so output is parseable; pipe to `jq` for human reading.
