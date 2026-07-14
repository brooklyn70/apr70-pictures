#!/usr/bin/env python3
"""Strip-based horizontal outpaint helper for Crop Studio extend jobs.

Flux is trained around 1MP. Generating a full 5.75MP frame just to paint two
side bars is slow and pushes the model far outside its native regime. Instead we
hand Flux only the bar plus a strip of adjacent context, then composite the
painted bars back onto the untouched original.

  prep     read _ratio-2/extend-queue.json -> write context strips into assets/
  composite  take generated strips from outputs/ -> write full-res extended frames
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageFilter

QUEUE = "/Volumes/SharedData/11-01-angib/02-stills/_ratio-2/extend-queue.json"
STILLS = "/Volumes/SharedData/11-01-angib/02-stills"
ROOT = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(ROOT, "assets")
CTX = 512          # context columns fed alongside the bar
BLEND = 16         # cross-fade width at the join, in px
GRAIN_SIGMA = 0.6  # blur applied to synthetic grain, to match film grain size


def _grain_sigma(img):
    """Robust per-channel stddev of an image's high-frequency residual.

    Uses median-absolute-deviation so hard edges (which are structure, not
    grain) don't inflate the estimate.
    """
    a = np.asarray(img.convert("RGB"), dtype=np.float32)
    lo = np.asarray(img.convert("RGB").filter(
        ImageFilter.GaussianBlur(1.0)), dtype=np.float32)
    hi = a - lo
    mad = np.median(np.abs(hi - np.median(hi, axis=(0, 1))), axis=(0, 1))
    return mad * 1.4826  # MAD -> sigma for a normal distribution


def match_grain(bar, reference, rng):
    """Add grain to `bar` so its high-frequency energy matches `reference`.

    Flux output is cleaner than 35mm film. We measure the deficit per channel
    and add back only the shortfall, blurred to approximate grain size.
    """
    want = _grain_sigma(reference)
    have = _grain_sigma(bar)
    deficit = np.sqrt(np.clip(want ** 2 - have ** 2, 0, None))
    if float(deficit.max()) < 0.5:
        return bar, want, have, deficit

    h, w = bar.size[1], bar.size[0]
    noise = rng.standard_normal((h, w, 3)).astype(np.float32)
    noise = np.asarray(
        Image.fromarray(np.clip(noise * 40 + 128, 0, 255).astype(np.uint8))
        .filter(ImageFilter.GaussianBlur(GRAIN_SIGMA)),
        dtype=np.float32,
    )
    noise = (noise - noise.mean(axis=(0, 1))) / (noise.std(axis=(0, 1)) + 1e-6)

    out = np.asarray(bar, dtype=np.float32) + noise * deficit
    return (Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)),
            want, have, deficit)


def stem(name):
    return os.path.splitext(name)[0]


def load_jobs():
    with open(QUEUE) as fh:
        return json.load(fh)["jobs"]


def prep():
    os.makedirs(ASSETS, exist_ok=True)
    plan = []
    for job in load_jobs():
        src = Image.open(os.path.join(STILLS, job["name"])).convert("RGB")
        w, h = src.size
        for side in ("left", "right"):
            pad = job["padLeft"] if side == "left" else job["padRight"]
            if not pad:
                continue
            # Flux needs the padded strip width on a multiple of 16, so grow the
            # context until pad + ctx lands on one.
            ctx = min(((pad + CTX + 15) // 16) * 16 - pad, w)
            box = (0, 0, ctx, h) if side == "left" else (w - ctx, 0, w, h)
            strip = src.crop(box)
            out = f"strip-{stem(job['name'])}-{side}.png"
            strip.save(os.path.join(ASSETS, out))
            plan.append(
                {
                    "id": f"{stem(job['name'])}-{side}",
                    "asset": out,
                    "side": side,
                    "pad": pad,
                    "ctx": ctx,
                    "source": job["name"],
                    # ImagePadForOutpaint pads only the outward side
                    "pad_left": pad if side == "left" else 0,
                    "pad_right": pad if side == "right" else 0,
                }
            )
    with open(os.path.join(ROOT, "plan.json"), "w") as fh:
        json.dump(plan, fh, indent=1)
    for p in plan:
        print(f"{p['id']:<45} {p['side']:<5} pad {p['pad']:>3} ctx {p['ctx']}")
    print(f"\n{len(plan)} strips -> assets/, plan.json written")


def composite(outdir):
    with open(os.path.join(ROOT, "plan.json")) as fh:
        plan = {p["id"]: p for p in json.load(fh)}
    jobs = {j["name"]: j for j in load_jobs()}
    done = []
    for name, job in jobs.items():
        gen = {}
        for side in ("left", "right"):
            key = f"{stem(name)}-{side}"
            if key not in plan:
                continue
            hit = [f for f in os.listdir(outdir) if f.startswith(key + "_")]
            if not hit:
                continue
            gen[side] = os.path.join(outdir, sorted(hit)[0])
        if len(gen) < 2:
            print(f"skip {name}: have {sorted(gen)} (need left+right)")
            continue

        src = Image.open(os.path.join(STILLS, name)).convert("RGB")
        w, h = src.size
        pl, pr = job["padLeft"], job["padRight"]
        canvas = Image.new("RGB", (w + pl + pr, h))
        canvas.paste(src, (pl, 0))

        rng = np.random.default_rng(70212310)
        for side, path in gen.items():
            p = plan[f"{stem(name)}-{side}"]
            strip = Image.open(path).convert("RGB")
            pad = p["pad"]
            # generated strip is (pad + ctx) wide; the bar is on the outward edge
            bar = strip.crop((0, 0, pad + BLEND, h)) if side == "left" \
                else strip.crop((strip.width - pad - BLEND, 0, strip.width, h))

            # Match the film grain of the original before blending, so the ramp
            # carries the grain across the join rather than stepping at it.
            ref = src.crop((0, 0, min(pad + BLEND, w), h)) if side == "left" \
                else src.crop((max(0, w - pad - BLEND), 0, w, h))
            bar, want, have, deficit = match_grain(bar, ref, rng)
            print(f"    {side:<5} grain ref {want.mean():.2f} "
                  f"gen {have.mean():.2f} -> added {deficit.mean():.2f}")
            # Alpha ramp. The fade must live entirely over columns where the
            # original actually exists -- ramping over bare canvas multiplies the
            # generated pixels toward black and lays a dark band on the join.
            #   left  bar spans canvas [0, pad+BLEND); original starts at pad.
            #   right bar spans canvas [w+pl-BLEND, ...); original ends at BLEND.
            mask = Image.new("L", bar.size, 0)
            px = mask.load()
            for x in range(bar.size[0]):
                if side == "left":
                    a = 255 if x < pad else max(0, int(255 * (pad + BLEND - x) / BLEND))
                else:
                    a = min(255, int(255 * x / BLEND)) if x < BLEND else 255
                for y in range(h):
                    px[x, y] = a
            canvas.paste(bar, (0, 0) if side == "left" else (w + pl - BLEND, 0), mask)

        out = os.path.join(ROOT, "outputs", f"extended-{stem(name)}.png")
        canvas.save(out)
        tgt = job["target"]
        ok = f"{canvas.width}x{canvas.height}" == tgt
        print(f"{'OK ' if ok else 'BAD'} {out}  {canvas.width}x{canvas.height} (target {tgt})")
        done.append(out)
    print(f"\n{len(done)} frames composited")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "prep"
    if cmd == "prep":
        prep()
    else:
        composite(sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, "outputs"))
