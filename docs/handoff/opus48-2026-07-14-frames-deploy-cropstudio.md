# Handoff — frames pass, deploy fix, Crop Studio

**Session:** 2026-07-14 · Opus 4.8 · branch `v11`
**State:** staging is LIVE and correct. Everything is committed and pushed.

---

## 1. Staging is up and serving the new frames

The deploy **hung mid-way and I repaired it by hand.** Read this before trusting the log.

`ssh` inherited an unclosed stdin from the background shell, so it never sent EOF: the DB
restore finished but the session hung open. The script stopped after step 4 with **cms and web
exited**, a database full of new content, and a media store still holding the old files —
staging was down and internally inconsistent.

Repaired by running the remaining steps manually with stdin closed. Verified afterwards:

- containers: cms healthy, web up, nginx up
- `media/61` → `01-ferry-dusk.png`, 2751x1151 (**2.39**), tiers `1920x803 / 1024x428 / 480x201` webp
- NAS DB: **hero 13 · native 9 · standard 69**, 91 rows
- NAS media store: 200 files
- `/`, `/slate`, `/craft` all render with `srcset` (6 / 10 / 2 tags)

## 2. The deploy script is fixed — this is the important one

**Marco asked: "every time I change anything in Payload will we have this problem?"** He was
right to be angry. Payload IS the interface; the deploy script was wrong.

Every deploy used to `pg_dump` the Mac and `pg_restore --clean` onto the NAS, plus `rm -rf` the
media store. That silently reverted anything edited in staging admin. Today it would have thrown
away a favicon he'd chosen an hour earlier (he ruled: let local win, they were experiments).

`_deploy/deploy-v10-to-nas.sh` now:

- **`--run`** ships code + schema only. Runs `payload migrate` on the NAS. **Content is never
  touched.** No `pg_restore --clean`, no `rm -rf`.
- **`--run --with-content`** is the old clobbering behaviour, opt-in, for a deliberate content
  migration. It **diffs `site_settings` and media counts first** and makes you type `CLOBBER`.
  Rule 16 is now enforced by the script rather than remembered.
- `SSHN` uses **`-n`** (the hang fix). `SSHPIPE` exists for the two calls that genuinely stream
  stdin — never add `-n` to those.

Both modes verified with `--plan`. Syntax checked.

## 3. Crop Studio — `tools/crop-studio/`

`pnpm install && node server.mjs` → :5177. Open any folder. Standalone; nothing apr70-specific.

Marco used it on `11-01-angib/02-stills` and it works: 4 crops all at exactly 2.000, 9 extend
canvases at 2.000 with correct masks (paint 25% / 10% / 8%), `extend-queue.json` written.

**Changed this session (UNTESTED — see below): the ratio is now PER PICTURE.** It was global to
the pass, so Marco had to run the folder twice and pick one output or the other. Now the toolbar
ratio is only a default; `1` = hero 2.39, `2` = standard 2.00, per-picture dropdown, **Set all →**
to sweep. Output goes to one `_frames/` folder with a `frames.json` whose `frameRatio` maps 1:1
onto Payload's `Media.frameRatio`.

## NEXT SESSION — start here

1. **Smoke-test the per-picture ratio change.** The context gate tripped before I could run it.
   `node server.mjs`, open `/Volumes/SharedData/11-01-angib/02-stills`, confirm the roll loads,
   `1`/`2` flip a picture's ratio and re-seed its rect, and Process folder writes `frames.json`
   with mixed `hero`/`standard` entries. **The code is committed but has not been executed once.**
2. **Wire the KIE extend queue.** n8n is up at `http://100.67.28.106:5678`
   (tailscale `caruso70-apexx-4-7403`) but the REST API needs `X-N8N-API-KEY`, which I do not
   have. SSH as `caruso` is rejected — it's Ubuntu with a different login. 1Password holds
   `Kie.ai API-key`, `Ubuntu APEXX BOXX`, `APEXX OpenClaw / Ollama box secrets`. **I read titles
   only, no secrets.** Marco must hand over the key or authorise pulling it.
3. **9 extends are pending paint** in `11-01-angib/02-stills/_ratio-2/`. Nothing has outpainted
   them yet — they are canvases + masks, not finished pictures.
4. **Mobile scope is still open.** 2.39 at 375px is a 157px band. `v9.css` puts the phone on a
   gentler 2:1 with a note. Marco has not ruled. Do not build a mobile-variant pipeline on spec.
5. **32 orphan media rows** point at files that don't exist (v8/v9 leftovers). Not rendered, but
   the library is dirty.

## Traps — do not re-step on these

- **`formatOptions` at the upload level re-encodes the ORIGINAL.** Set it per `imageSize`.
- **`payload.update({ id, filePath })` cannot preserve a filename.** `docWithFilenameExists` does
  not exclude the row being updated, so a doc collides with itself; `incrementName`'s
  `/(.*)-(\d+)$/` then read `egyptian-premiere-1926` as base+counter and returned **1927**,
  silently redating an archival photograph. Null the filename first.
- **A year in a filename is not a date.** `piers-1970-k2a` is a generated still whose *subject* is
  1970; `caruso1970_...` is a Midjourney username. Archival test = delimited token AND pre-1936.
- **`ssh` without `-n` hangs** when the caller's stdin never closes. It cost a broken staging today.
- **Archival material is not a film frame.** Maps, engravings, period photographs stay native.
