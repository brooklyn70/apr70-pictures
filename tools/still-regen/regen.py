#!/usr/bin/env python3
"""Regenerate property stills natively at a wide master ratio.

The stills were AI-generated, so there is no negative to preserve -- outpainting
them to a wider frame is repair work on material that can simply be re-made. A
native 21:9 generation *composes* for the wide frame instead of guessing at its
margins, and at 4K it yields a 6336x2688 master that every delivery ratio crops
out of with no generation at all:

    2.39  ->  6336x2651   (trim 37px height)
    2.00  ->  5376x2688   (trim width)
    16:9  ->  4778x2688   (trim width)

Nothing is ever deleted or overwritten. New masters land in a NEW folder beside
the originals, and every prompt is appended to a ledger in the vault -- the
original stills' prompts were lost precisely because an agent called the API
directly and never wrote them down.

    regen.py plan   <property>              # what would be generated
    regen.py run    <property> [--variants N]
    regen.py crop   <property> --ratio 2.39 # crop masters to a delivery ratio
"""
import argparse
import json
import os
import subprocess
import sys
import time
import urllib.request

SHARED = "/Volumes/SharedData"
LEDGER_DIR = os.path.expanduser("~/vault/11 Active/apr70-still-prompts")
LEDGER = os.path.join(LEDGER_DIR, "prompts.jsonl")
ROOT = os.path.dirname(os.path.abspath(__file__))
SPECS = os.path.join(ROOT, "specs")

OUT_SUBDIR = "_regen"         # default; same folder Crop Studio's Prompt tab writes to, so the
                              # exists-skip dedup and `crop` see BOTH tools' masters.
                              # (4k-21x9/ holds the 2026-07-14 over-anchored throwaways.)
                              # Campaigns override with --out (e.g. _light-law).
ASPECT = "21:9"
RESOLUTION = "4K"

# Model registry (v13, Light Law pass). Each entry: credits per 4K image and how
# the createTask payload wants its reference images. gpt-image-2 splits t2i/i2i
# into two model ids; pick by whether the shot carries refs.
#   nano-banana-pro          24 cr  refs via "image_input"
#   gpt-image-2              16 cr  refs via "input_urls" (image-to-image id)
MODELS = {
    "nano-banana-pro": {"credits": 24},
    "gpt-image-2": {"credits": 16},
}
DEFAULT_MODEL = "nano-banana-pro"

UPLOAD_URL = "https://kieai.redpandaai.co/api/file-stream-upload"
CREATE_URL = "https://api.kie.ai/api/v1/jobs/createTask"
STATUS_URL = "https://api.kie.ai/api/v1/jobs/recordInfo?taskId="
CREDIT_URL = "https://api.kie.ai/api/v1/chat/credit"


def key():
    out = subprocess.run(
        ["op", "item", "get", "Kie.ai API-key", "--vault", "API",
         "--fields", "token", "--reveal"],
        capture_output=True, text=True, check=True)
    return out.stdout.strip()


def api(url, token, payload=None, method=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method or ("POST" if data else "GET"))
    req.add_header("Authorization", f"Bearer {token}")
    if data:
        req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req, timeout=90) as r:
        return json.loads(r.read())


def credits(token):
    return api(CREDIT_URL, token)["data"]


def upload(path, token):
    """Upload a reference image and return its public URL.

    Shells out to curl: KIE's upload endpoint 403s on a hand-rolled multipart
    body, and it lives on a different host to the rest of the API
    (kieai.redpandaai.co, not api.kie.ai -- the docs' own server block is wrong).
    """
    name = os.path.basename(path).replace(" ", "_")
    out = subprocess.run(
        ["curl", "-sS", "-X", "POST", UPLOAD_URL,
         "-H", f"Authorization: Bearer {token}",
         "-F", f"file=@{path}",
         "-F", "uploadPath=apr70/ref",
         "-F", f"fileName={name}"],
        capture_output=True, text=True, check=True)
    res = json.loads(out.stdout)
    if not res.get("success"):
        raise RuntimeError(f"upload {name}: {res.get('msg')}")
    return res["data"]["downloadUrl"]


def fetch(url, dest):
    """Download a result image. The CDN 403s urllib's default user-agent."""
    subprocess.run(["curl", "-sS", "-fL", "-o", dest, url], check=True)


def generate(token, prompt, refs, model=DEFAULT_MODEL):
    if model == "gpt-image-2":
        mid = "gpt-image-2-image-to-image" if refs else "gpt-image-2-text-to-image"
        inp = {"prompt": prompt, "aspect_ratio": ASPECT, "resolution": RESOLUTION}
        if refs:
            inp["input_urls"] = refs
    else:
        mid = model
        inp = {"prompt": prompt, "image_input": refs,
               "aspect_ratio": ASPECT, "resolution": RESOLUTION}
    payload = {"model": mid, "input": inp}
    res = api(CREATE_URL, token, payload)
    if res.get("code") != 200:
        raise RuntimeError(f"createTask: {res.get('msg')}")
    tid = res["data"]["taskId"]

    for _ in range(120):
        d = api(STATUS_URL + tid, token)["data"]
        if d.get("state") == "success":
            urls = json.loads(d["resultJson"]).get("resultUrls") or []
            return tid, urls[0]
        if d.get("state") == "fail":
            raise RuntimeError(f"task {tid} failed: {d.get('failMsg')}")
        time.sleep(6)
    raise RuntimeError(f"task {tid} timed out")


def log(entry):
    """Append-only prompt ledger. This is the whole point -- never lose these."""
    os.makedirs(LEDGER_DIR, exist_ok=True)
    with open(LEDGER, "a") as fh:
        fh.write(json.dumps(entry) + "\n")


def load_spec(prop, specdir="specs"):
    with open(os.path.join(ROOT, specdir, f"{prop}.json")) as fh:
        return json.load(fh)


def outdir(prop, sub=OUT_SUBDIR):
    return os.path.join(SHARED, prop, "02-stills", sub)


def planned(spec):
    """Only shots that have a prompt. The Prompt tab persists placeholders with
    prompt:'' while Marco drafts a list; sending an empty prompt to the model
    would spend 24 credits on a blank guess."""
    return [s for s in spec["stills"] if s.get("prompt", "").strip()]


def cmd_plan(args):
    spec = load_spec(args.property, args.specdir)
    shots = planned(spec)
    n = len(shots) * args.variants
    per = MODELS[args.model]["credits"]
    print(f"property : {args.property}")
    print(f"model    : {args.model} @ {ASPECT} {RESOLUTION}")
    print(f"specdir  : {args.specdir}")
    print(f"output   : {outdir(args.property, args.out)}/   (new -- nothing overwritten)")
    print(f"ledger   : {LEDGER}")
    print(f"stills   : {len(shots)} x {args.variants} variant(s) = {n} images"
          + (f"   ({len(spec['stills']) - len(shots)} without prompts, skipped)" if len(shots) < len(spec["stills"]) else ""))
    print(f"cost     : {n * per} credits")
    print()
    for s in shots:
        refs = ", ".join(s.get("refs", [])) or "(no ref)"
        print(f"  {s['slug']:<34} refs: {refs}")


def cmd_run(args):
    spec = load_spec(args.property, args.specdir)
    shots = planned(spec)
    per = MODELS[args.model]["credits"]
    token = key()
    have = credits(token)
    need = len(shots) * args.variants * per
    print(f"credits: {have:.0f} available, ~{need} needed")
    if need > have:
        sys.exit(f"ABORT: short {need - have:.0f} credits. Top up before running.")

    dest = outdir(args.property, args.out)
    os.makedirs(dest, exist_ok=True)
    ref_cache = {}

    for s in shots:
        refs = []
        for r in s.get("refs", []):
            src = os.path.join(SHARED, args.property, "02-stills", r)
            if not os.path.exists(src):
                print(f"  ! missing ref {r}, skipping ref")
                continue
            if src not in ref_cache:
                ref_cache[src] = upload(src, token)
            refs.append(ref_cache[src])

        for v in range(1, args.variants + 1):
            out = os.path.join(dest, f"{s['slug']}-v{v}.png")
            if os.path.exists(out):
                print(f"  = {os.path.basename(out)} exists, skipping")
                continue
            try:
                tid, url = generate(token, s["prompt"], refs, args.model)
            except RuntimeError as e:
                print(f"  x {s['slug']} v{v}: {e}")
                continue

            # Log BEFORE downloading. The credit is already spent and the prompt
            # already produced an image the moment generate() returns -- if the
            # download then fails, losing the prompt is the exact failure this
            # ledger exists to prevent.
            log({
                "ts": time.strftime("%Y-%m-%dT%H:%M:%S"),
                "property": args.property, "slug": s["slug"], "variant": v,
                "model": args.model, "aspect_ratio": ASPECT, "resolution": RESOLUTION,
                "prompt": s["prompt"], "refs": s.get("refs", []),
                "task_id": tid, "source_url": url, "output": out,
                "credits": per,
            })

            try:
                fetch(url, out)
                print(f"  + {os.path.basename(out)}")
            except Exception as e:
                print(f"  ! {s['slug']} v{v} generated but download failed ({e})")
                print(f"    prompt + url are in the ledger: {url}")

    print(f"\ncredits remaining: {credits(token):.0f}")
    print(f"prompts logged to: {LEDGER}")


def cmd_crop(args):
    from PIL import Image
    src = outdir(args.property, args.out)
    dest = os.path.join(SHARED, args.property, "02-stills",
                        f"crop-{args.ratio}".replace(".", "_"))
    os.makedirs(dest, exist_ok=True)
    for f in sorted(os.listdir(src)):
        if not f.lower().endswith(".png"):
            continue
        im = Image.open(os.path.join(src, f))
        w, h = im.size
        if args.ratio >= w / h:                 # wider target -> trim height
            ch = int(w / args.ratio)
            box = (0, (h - ch) // 2, w, (h - ch) // 2 + ch)
        else:                                   # taller target -> trim width
            cw = int(h * args.ratio)
            box = ((w - cw) // 2, 0, (w - cw) // 2 + cw, h)
        out = os.path.join(dest, f)
        im.crop(box).save(out)
        print(f"  {f}  {w}x{h} -> {box[2]-box[0]}x{box[3]-box[1]}")
    print(f"\ncropped to {dest}")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    for name in ("plan", "run"):
        s = sub.add_parser(name)
        s.add_argument("property")
        s.add_argument("--variants", type=int, default=1)
        s.add_argument("--model", choices=sorted(MODELS), default=DEFAULT_MODEL)
        s.add_argument("--specdir", default="specs")
        s.add_argument("--out", default=OUT_SUBDIR)
    c = sub.add_parser("crop")
    c.add_argument("property")
    c.add_argument("--ratio", type=float, required=True)
    c.add_argument("--out", default=OUT_SUBDIR)
    a = p.parse_args()
    {"plan": cmd_plan, "run": cmd_run, "crop": cmd_crop}[a.cmd](a)
