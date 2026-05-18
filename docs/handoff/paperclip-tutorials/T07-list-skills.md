# T07 — List installed "skills" (plugins in this build)

**Goal:** confirm the 5 company plugins are healthy and discoverable. In this Paperclip build, what the docs call "skills" are installed via the `plugin` CLI.

**Prereqs:** T00 complete.

## Command

```bash
npx paperclipai plugin list --json | jq '.[] | {pluginKey,name,status,version,kind}'
```

## Expected output

```json
{"pluginKey":"apr70-brand-voice","name":"APR 70 Brand Voice","status":"ready","kind":"skill"}
{"pluginKey":"ollama-summarize","name":"Ollama Summarize","status":"ready","kind":"skill"}
{"pluginKey":"obsidian-vault-read","name":"Obsidian Vault Read","status":"ready","kind":"skill"}
{"pluginKey":"obsidian-vault-write","name":"Obsidian Vault Write","status":"ready","kind":"skill"}
{"pluginKey":"n8n-trigger","name":"n8n Trigger","status":"ready","kind":"skill"}
```

Field names may vary — run with raw `--json` first and adjust. Statuses you may see: `ready`, `installed`, `disabled`, `error`, `upgrade_pending`.

## Inspect one plugin in detail

```bash
npx paperclipai plugin inspect apr70-brand-voice --json | jq '.'
```

This returns the plugin's manifest (commands, env requirements, source path, version), the runtime status, and which agents currently reference it.

## List bundled examples (templates for new plugins/skills)

```bash
npx paperclipai plugin examples --json | jq '.'
```

The output is a catalog of example plugins shipped with this Paperclip version — useful starting points for new skill scaffolds.

## Raw HTTP equivalent

```bash
BEARER=$(jq -r '.profiles.default.session.token' ~/.paperclip/context.json)
curl -sS -H "Authorization: Bearer $BEARER" \
  "http://100.67.28.106:3100/api/plugins" | jq '.'
```

## Verification

- All 5 expected plugins appear with `status: ready`.
- No plugin shows `status: error` or `status: upgrade_pending`.
