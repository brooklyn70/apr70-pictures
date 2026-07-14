# Crop Studio

A standalone ratio instrument. Open any folder of pictures, frame every one of them at a locked
aspect ratio, write the results back. Nothing in it is specific to apr70 — point it at any folder.

```sh
cd tools/crop-studio
pnpm install          # once (sharp) — on Windows use `pnpm install` too; sharp ships prebuilds
node server.mjs       # opens http://localhost:5177
```

Then paste a path, deep-link, or (macOS only) **Choose folder…**:
`http://localhost:5177/?dir=/Volumes/SharedData/11-05-la-dolce-vita/02-stills`

**Windows:** the native folder picker is macOS-only (`osascript`). Paste the folder path
or deep-link `?dir=…`. If the stills live on the NAS, mount SharedData first and use that
path (e.g. `Z:\11-01-angib\02-stills` or whatever drive letter your mount uses).

**n8n extend queue:** Crop Studio writes `extend-queue.json` + canvas/mask pairs. There is
not yet an n8n workflow that paints them. The REST key for the APEXX box
(`http://100.67.28.106:5678`, label `cursor mac os` in n8n) is wired locally as
`tools/crop-studio/.n8n.env` (gitignored). Pull it with:

```sh
ssh caruso70@100.67.28.106 \
  "docker exec n8n-local-db psql -U n8nuser -d n8n -tAc \"SELECT \\\"apiKey\\\" FROM user_api_keys WHERE label='cursor mac os'\""
```

## The idea

Every frame arrives with the rectangle **already placed** by a saliency pass, so you are
*correcting* the machine, not composing from scratch. Most it gets right. Fix the ones it doesn't,
and move on.

## The ratio is per picture, not per pass

A folder holds heroes and standards together — sometimes the same shot as both a jpeg and a
png. The toolbar ratio is only the **default** a folder opens with; every picture carries its
own target. `1` sets it to hero (2.39), `2` to standard (2.00), or pick anything from the
per-picture dropdown. **Set all →** sweeps the whole roll when you do want one ratio.

Everything lands in one output folder, and `frames.json` records what each file became —
`frameRatio` there maps 1:1 onto Payload's `Media.frameRatio`, so nothing downstream has to guess.

## Three verdicts

| | | |
|---|---|---|
| **Crop** | `C` | Drag the rectangle. Locked to the chosen ratio. A pure extract at native resolution — nothing is resampled, nothing upscaled. |
| **Extend** | `E` | For pictures too tight to crop without gutting them. Instead of cutting the picture down, paint it *wider*. Writes a padded canvas + an outpaint mask; feed both to KIE, ComfyUI, or Photoshop's generative fill. **Nothing is lost.** |
| **Native** | `N` | Never touch it. Archival maps, engravings, period photographs are records, not film frames — a crop mutilates them. Auto-flagged when the filename carries a pre-1936 date, but you can set it on anything. |

`S` skips. `R` re-seeds the rectangle from saliency. `G` cycles the grid (phi / thirds / off).
`←` `→` move through the roll. Decisions persist to `.crop-studio.json` in the folder, so you can
walk away mid-pass and come back.

## Output

Written to a subfolder of wherever the pictures came from — `_frames` by default, or name it
yourself. Filenames are preserved exactly.

- **crops** — the cropped picture, same name, same format
- **extends** — `<name>-extend-canvas.png` + `<name>-extend-mask.png` (white = paint here,
  black = keep), plus an `extend-queue.json` listing every job with its pad amounts
- **natives** — copied through untouched
- **`frames.json`** — what every file became, with its `frameRatio` for Payload

From there you pick the image up in Payload yourself. Media uploads are cropped to the house ratio
on arrival by the `cropToFrame` hook anyway, and a picture already on ratio passes through it
unchanged — so a file out of Crop Studio lands in the CMS exactly as you framed it.

## The ratios

2.39 scope · **2.00 the streaming ratio** · 2.20 Todd-AO 70mm · 1.85 theatrical flat · 16:9 · 3:2 ·
1:1 · 9:16. The house pair is **2.39 for full-bleed heroes, 2.00 for everything else**.

## Warnings, not rules

The right rail will tell you when a crop guts the picture (under 55% kept), when the result falls
below the 1920 hero tier and would be upscaled downstream, when a filename looks archival, and when
a picture is a portrait or a strip. Every one of them is a note. You overrule all of them.
