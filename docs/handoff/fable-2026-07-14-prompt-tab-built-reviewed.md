# Handoff — Prompt tab built, reviewed, fixed. Server restart pending.

**From:** Fable 5, 2026-07-14 ~4:10pm EDT. Rule-14 context gate forced this handoff.
**Prior handoff (the job's full brief, still authoritative for steps not done):**
`/Users/marco/vault/00 Meta/handoffs/apr70-handoff-still-regen-prompt-tab-FOR-FABLE.md`

## What shipped this session

1. **Prompt tab in Crop Studio** (`tools/crop-studio/`) — Marco's spec, verbatim:
   FRAMES/PROMPTS tabs; ten properties listed (no folder picker); per property a shot
   sheet over `tools/still-regen/specs/<prop>.json` — editable slug/prompt/notes, ref
   thumbnails (from stills inline, or any file via native picker), per-shot Generate,
   per-property Generate-with-stop, 2-variant default, live credit estimate, `#plog`.
   Server routes: `/api/props`, `/api/spec`, `/api/spec-save`, `/api/pick-file`,
   `/api/shot-generate` (one variant per call; **ledger before download**; `_regen/`).
   **Visually verified in Chrome** (tabs, sheet, ref add/remove round-trip left the
   spec bit-identical, add-shot, cost math, no console errors).
2. **Code review done** (4 finder agents, 21 candidates → 8 findings, all fixed):
   - Stale-prompt race: client now flushes autosave AND sends the shot in the request.
   - v-number collision: output name reserved on disk before the model runs.
   - **regen.py OUT_SUBDIR is now `_regen`** (was `4k-21x9`) so CLI and tab share one
     folder — dedup, crop, and counts agree. `4k-21x9/` = quarantined throwaways.
   - variantsOf anchored regex (barn vs barn-view); path-traversal guard in
     `stillsDirOf`; missing ref now throws instead of silently dropping; KIE-offline
     disables Prompts-tab buttons; `/api/regen` + `/api/shot-generate` share
     `makeWideMaster()`; `11-07-maltese-falcon` hard-excluded from the slate;
     regen.py skips prompt-less shots; spec without `stills` array doesn't brick.
   - Known-unfixed (deliberate): renaming a slug orphans its old variants on disk.
3. **Desktop shortcut**: `~/Desktop/Crop Studio.app` (osacompile) → runs
   `tools/crop-studio/launch.sh` (boots server if port 5177 quiet, else opens URL). Tested.
4. **Ref thumbnails enlarged** (Marco's ask): 180×110 + filename caption under each,
   picker grid 170px min. `index.html` is hot-read — live on refresh.

## IMMEDIATELY on session start

- **Restart the Crop Studio server** — the review fixes in `server.mjs` are NOT live:
  `lsof -ti tcp:5177 | xargs kill -9; cd tools/crop-studio && node server.mjs`
  Then verify: `node --check server.mjs`; `python3 -m py_compile ../still-regen/regen.py`;
  `POST /api/spec {"prop":"../x"}` must return an error; `/api/props` must list 10.
  Then a quick browser pass (tab switch, angib sheet, bigger ref thumbs).
- **Extend batch: FINISHED** (queue emptied ~4:12pm, all bars in
  `/Users/marco/comfy-mac/output/outputs/strip/`). Composite immediately:
  `cd tools/frame-extend && /Users/marco/comfy-mac/.venv/bin/python strips.py composite outputs`
  → **show Marco all nine `outputs/extended-*.png`.** He asked. Then that path closes.

## Then, in order (per the vault handoff)

3. **Author the ten shot lists** — one `specs/<prop>.json` each. **Call `explore-digest`
   BEFORE any subagent fan-out over the 79 FDX drafts** (that fan-out is what trips this
   gate). Sources: live CMS canon (docker psql, see vault handoff §3), FDX drafts in
   `11.01 Active Properties/*/14-final-draft/`, existing stills. `close-read-gate` for
   any .fdx-derived shots. Prompt standard: write the frame FRESH (the ledger's
   `01-angib-02-club` image entry is the model; the angib spec's "Recompose this exact
   scene" prompts are the BAD example and must be rewritten too). Research real places,
   time of day, light source. Refs carry cast/wardrobe only.
4. **Generate 2+ variants per shot — only after Marco reviews the sheet. He presses the buttons.**
5. **Video hero block** on the property page (seedance-2, poster = still, muted,
   `prefers-reduced-motion` → image, LCP stays the image). Not designed yet.

## Gotchas rediscovered this session

- The context-gate meter survives some session ends (`on-stop.sh` resets it, but a
  killed/interrupted session leaves it armed). If a fresh session is instantly blocked:
  the meter file is `.claude/.context-meter` — a PostToolUse hook rewrites it after
  every tool call, so Write races lose; ending the turn usually resets it.
- Browser screenshots inflate the byte meter far beyond their real context cost —
  batch visual verification tightly.
- KIE quirks, ComfyUI `--cpu-vae`, zsh word-splitting: all in the vault handoff. Unchanged.
