# frame-extend

Paints the side-bars that Crop Studio leaves behind.

Crop Studio decides each picture's target aspect ratio. When a picture has to
grow rather than crop, it emits a canvas + mask pair and records the exact pad
geometry in `_ratio-2/extend-queue.json` -- but nothing paints them. This does.

Local ComfyUI + **FLUX.1 Fill dev** (Q8_0 GGUF). No API, no cost, no upload.
The original pixels are never regenerated: only the bars are painted, and the
untouched original is composited back on top.

## Why strips, not whole frames

The obvious approach -- hand Flux the full 3392x1696 canvas + mask -- works but
is wrong twice over. It runs at ~230 s/step on an M1 Max, and it asks Flux to
generate a 5.75MP image when it was trained around 1MP, which is where it starts
duplicating structures.

Instead we crop a strip of context adjacent to each bar and pad only that:

    [ bar 432px ][ context 512px ]   ->  944x1696, 1.6MP, ~31 s/step

That is ~7x faster *and* keeps each generation inside Flux's native regime. The
painted bar is then composited back onto the full-resolution original.

## Run it

    python3 strips.py prep                      # extend-queue.json -> assets/ + plan.json
    comfy assets push
    comfy workflow compose blueprints/batch.yaml
    comfy run --workflow blueprints/batch.compiled.json
    python3 strips.py composite outputs         # bars -> full-res extended frames

Outputs land in `outputs/extended-<name>.png`, verified against each job's
target dimensions. Nothing is written back to `/Volumes/SharedData`.

## Setup

ComfyUI must be running **with `--cpu-vae`**:

    cd ~/comfy-mac && .venv/bin/python main.py --cpu-vae

Apple's Metal backend cannot encode a tensor this large ("MPSGraph does not
support tensor dims larger than INT_MAX") and dies inside
`InpaintModelConditioning`. Running the VAE on the CPU sidesteps it.

Requires `custom_nodes/ComfyUI-GGUF` and
`models/unet/flux1-fill-dev-Q8_0.gguf` (from `YarvixPA/FLUX.1-Fill-dev-GGUF`,
ungated -- the official `black-forest-labs/FLUX.1-Fill-dev` needs a licence
click and an HF token).

## Things that will bite you

- **Strip width must be a multiple of 16.** `prep` grows the context until
  `pad + ctx` lands on one. The `pad=119` frame needs a 521px context, not 512.
- **The alpha ramp must fade only across columns where the original exists.**
  Ramping over bare canvas multiplies the generated pixels toward black and
  lays a dark band exactly on the join (measured 27 grey levels before the fix,
  ~0.7 after -- i.e. below the image's own column-to-column noise).
- **Flux output is cleaner than 35mm film.** Generated bars came back at grain
  sigma 2.97 against the original's 4.45. `match_grain` measures the deficit
  with a MAD estimator (so edges don't inflate it) and adds back only the
  shortfall, before the blend, so the ramp carries grain across the join.
- `FluxGuidance=30` and `DifferentialDiffusion` are load-bearing; both come
  from the upstream `flux_fill_outpaint_example` template, which
  `fragments/flux_outpaint.json` was decomposed from.

## Not KIE

KIE cannot do this job. Only `ideogram/v3-edit` accepts a mask at all, and it
returns a server-side 500 on every input format tried. Everything else
(`nano-banana-2`, `seedream/4.5-edit`) is preset-aspect-ratio only -- it cannot
emit an exact 3392x1696 or a 2.39 frame -- and regenerates the whole image
rather than preserving the original. Note also that Ideogram's mask polarity is
**inverted** from Crop Studio's: black means edit, white means keep.
