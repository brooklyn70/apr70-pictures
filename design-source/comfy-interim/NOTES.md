# ON AIR sign — interim ComfyUI candidates

**Generated:** 2026-07-06
**Status: INTERIM.** These are AI-generated placeholders. Any placement MUST carry the
visible credit **"Image: ComfyUI (interim)"** so Marco knows to replace them with licensed
or original photography. They sit alongside genuine 1930s Library of Congress material and
are not final assets.

## Model / workflow

- **Backend:** ComfyUI 0.21.0 on Apex (100.67.28.106:8188, container `comfyui`, Quadro RTX 4000),
  reached via SSH tunnel `root@100.67.28.106 -L 8188:localhost:8188` (comfy CLI 1.11.1 local routing).
- **Model:** **Flux.2 Klein** (`flux-2-klein-base-9b-fp8.safetensors` UNet,
  `qwen_3_8b_fp8mixed.safetensors` text encoder loaded as `flux2`,
  `full_encoder_small_decoder.safetensors` VAE).
- **Graph:** UNETLoader → CLIPLoader(flux2) → CLIPTextEncode → FluxGuidance (+ ConditioningZeroOut
  negative) → ModelSamplingFlux → EmptyFlux2LatentImage → KSampler (euler/simple, cfg 1.0) → VAEDecode.
  Built as fragment `flux2_t2i` + foreach blueprints (comfy compose); sources in the session
  scratchpad project (`fragments/flux2_t2i.json`, `blueprints/onair_flux2.yaml` + retry blueprints).
- **SDXL was tried first and rejected:** Juggernaut-XL v9 garbled the sign text in 3 of 4
  candidates ("NO AIR", "A1R", "AAR"). Flux.2 Klein renders "ON AIR" reliably.

## Candidates

| File | Shot | Seed | Steps / guidance | Size | Text QC |
|---|---|---|---|---|---|
| onair-sign-candidate-1.png | Lit sign over studio door, slight angle, muted warm | 202601 | 24 / 3.5 | 1216x832 | PASS — clean "ON AIR" |
| onair-sign-candidate-2.png | Close-up of sign box, straight on, cast-metal housing | 505901 | 28 / 4.5 | 1024x1024 | PASS — clean "ON AIR" (3rd retry) |
| onair-sign-candidate-3.png | Sign glowing in dark control-room corner | 404802 | 24 / 4.0 | 832x1216 | **FLAWED — reads "ON AIRI"** (spurious trailing glyph). Best of 4 attempts; retry budget exhausted. Replace first. |
| onair-sign-candidate-4.png | B&W high contrast, straight on | 202604 | 24 / 3.5 | 1024x1024 | PASS — clean "ON AIR" |

## Prompts (positive; Flux uses no negative — ConditioningZeroOut at cfg 1.0)

**Candidate 1:** "A 1930s photograph of an illuminated 'ON AIR' sign box mounted on the wall above a radio studio door. The sign is a rectangular cast-metal box with a frosted glass face, glowing warmly from within, the words ON AIR in bold period sans-serif letters. The heavy wooden studio door below is dark and slightly out of focus. Shot at a slight angle from below. Dim hallway, single warm practical light, deep shadows. Archival documentary photograph, fine film grain, muted warm tones, believable period optics. The glass is intact and clean. The only text anywhere in the image is 'ON AIR' - no other lettering, labels, or signage. No people."

**Candidate 2 (final, retry 3):** "Close-up photograph of a 1930s radio studio 'ON AIR' illuminated sign box, photographed straight-on. Heavy cast-metal housing, dark enamel paint with worn edges, slotted screws at the corners, a frosted glass panel glowing warm from within. On the glass, exactly two short words: 'ON AIR', painted in clean bold block capital letters, evenly spaced, nothing else on the glass. Dark studio wall behind. Single raking light reveals metal texture and decades of fine wear. Archival product photograph, subtle film grain, muted warm tones. The glass is intact. No other lettering, labels, dials, or signage anywhere. No people."

**Candidate 3 (delivered, retry 2):** "Moody low-key photograph in a 1930s radio control room at night, camera looking up from below at an illuminated 'ON AIR' sign box mounted high on the wall. The sign fills the upper third of the frame, large and perfectly in focus: heavy cast metal housing, frosted glass face glowing warm amber, the words ON AIR in bold period block capital letters, crisp and clearly readable. Beneath it, the dim out-of-focus silhouettes of vintage broadcast equipment racks fall away into deep shadow. The sign is the only light source. Warm tungsten tones only, fine film grain, archival photograph. The only text anywhere in the image is 'ON AIR' - no other lettering, labels, or signage visible. No people."

**Candidate 4:** "Black and white 1930s photograph, high contrast. An illuminated 'ON AIR' sign box on a dark studio wall, photographed straight-on. Cast metal housing with rivets, frosted glass panel blazing white against near-black surroundings, the words ON AIR in bold period letters. Stark hard-edged shadows, dramatic chiaroscuro, visible silver-gelatin film grain, monochrome archival press photograph. The glass is intact. The only text anywhere in the image is 'ON AIR' - no other lettering, labels, or signage. No people."

## Retry log

- Candidate 2: seed 202602 ("I" hooked toward "A1R") → r1 seed 303701 (clean text, plasticky
  housing) → r2 seed 404801 (garbled "IN 3") → **r3 seed 505901 PASS (delivered)**.
- Candidate 3: seed 202603 (illegible blobs) → r1 seed 303702 (garbled "AIF") → r2 seed 404802
  (**"ON AIRI" — delivered, flagged**) → r3 seed 505902 (garbled "ONU"). The dark-corner
  concept fights Flux text rendering at small sign scale; a replacement (or a re-run with the
  sign larger in frame) is recommended.

## Standing rule

Objects only — never people or characters. Interim assets carry the visible credit
"Image: ComfyUI (interim)" at placement. Marco replaces these before anything ships as final.
