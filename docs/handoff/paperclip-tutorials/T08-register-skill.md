# T08 — Register a new skill (install a local plugin)

**Goal:** add the `apex-preflight` skill to the company by pointing `paperclipai plugin install` at the scaffold folder.

**Prereqs:** T00 complete. The skill folder exists at `~/paperclip-data/scaffold/skills/apex-preflight/` with a valid `SKILL.md` (see `docs/handoff/paperclip-tutorials/skills/apex-preflight/` in this repo for the source).

## 1. Stage the folder on the Apex

If the folder lives in this repo on Marco's Mac, rsync it to the Apex:

```bash
rsync -av docs/handoff/paperclip-tutorials/skills/apex-preflight/ \
  caruso70@100.67.28.106:/home/caruso70/paperclip-data/scaffold/skills/apex-preflight/
```

Verify on the Apex:

```bash
ssh caruso70@100.67.28.106 'ls -la ~/paperclip-data/scaffold/skills/apex-preflight/'
# Expected: SKILL.md, preflight.sh (executable)
```

## 2. Install as a local plugin

```bash
ssh caruso70@100.67.28.106 \
  'npx paperclipai plugin install --local /home/caruso70/paperclip-data/scaffold/skills/apex-preflight'
```

Expected output:

```
Installed plugin: apex-preflight (status=ready)
```

## 3. Verify

```bash
npx paperclipai plugin list --json | jq '.[] | select(.pluginKey=="apex-preflight")'
```

Then inspect:

```bash
npx paperclipai plugin inspect apex-preflight --json | jq '{pluginKey,status,sourcePath,version,commands}'
```

`sourcePath` should be `/home/caruso70/paperclip-data/scaffold/skills/apex-preflight`.

## Raw HTTP path (uncommon — CLI handles tarballing)

```bash
BEARER=$(jq -r '.profiles.default.session.token' ~/.paperclip/context.json)
curl -sS -X POST -H "Authorization: Bearer $BEARER" -H "Content-Type: application/json" \
  -d '{"source":"local","path":"/home/caruso70/paperclip-data/scaffold/skills/apex-preflight"}' \
  "http://100.67.28.106:3100/api/plugins/install" | jq '.'
```

> Body shape is best-effort from bundle inspection; if the API rejects it, fall back to `paperclipai plugin install` and let the CLI build the payload.

## Updating an already-installed skill

Edit files in place (`~/paperclip-data/scaffold/skills/apex-preflight/`), then:

```bash
ssh caruso70@100.67.28.106 'npx paperclipai plugin install --local /home/caruso70/paperclip-data/scaffold/skills/apex-preflight'
```

The installer treats reinstall as upgrade-in-place.

## Verification

- `plugin list` shows `apex-preflight` with `status: ready`.
- `plugin inspect apex-preflight` shows the file paths and any declared commands.
- Calling the skill's commands from an agent context succeeds (verified later in T09 + T06 heartbeat).
