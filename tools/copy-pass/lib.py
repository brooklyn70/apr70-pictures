#!/usr/bin/env python3
"""Shared plumbing for the APR 70 site copy writers-room pass (2026-09-07).

Seat plumbing (openrouter/xai/SEATS/CRITIC_SEATS) is COPIED from
~/vault/_CLAUDE/scripts/room_churn.py — deliberately not imported (that module has
side effects). Anthropic seats are WRITE-ONLY here too: Claude writes, Claude never scores.
"""
import json, os, pathlib, time, urllib.request, urllib.error

OUT = pathlib.Path(__file__).resolve().parents[2] / "docs/copy-pass/2026-09-07"
LEDGER = OUT / "spend.json"
ABORT_AT = 4.50

OR_URL = "https://openrouter.ai/api/v1/chat/completions"
XAI_URL = "https://api.x.ai/v1/chat/completions"
ANT_URL = "https://api.anthropic.com/v1/messages"
ANT_VERSION = "2023-06-01"

KEY_FILE = pathlib.Path.home() / ".config/ladv/openrouter.key"
XAI_KEY_FILE = pathlib.Path.home() / ".config/ladv/xai.key"

SEATS = {
    "kimi": ("openrouter", "moonshotai/kimi-k3"),
    "sol": ("openrouter", "openai/gpt-5.6-sol"),
    "grok": ("xai", "grok-4.6"),
    "free": ("openrouter", "openrouter/free"),
    # write-only
    "opus": ("anthropic", "claude-opus-5"),
    "sonnet": ("anthropic", "claude-sonnet-5"),
}
WRITE_ONLY_PROVIDERS = {"anthropic"}
CRITIC_SEATS = {"welles": "kimi", "sturges": "sol", "riskin": "grok", "capra": "free"}

model_of = lambda s: SEATS[s][1]
provider_of = lambda s: SEATS[s][0]

# ---- ledger -------------------------------------------------------------

def ledger_load():
    if LEDGER.exists():
        return json.loads(LEDGER.read_text())
    return {"entries": [], "total_usd": 0.0}

def ledger_add(stage, seat, model, usd, note="", **extra):
    d = ledger_load()
    e = {"ts": time.strftime("%Y-%m-%dT%H:%M:%S"), "stage": stage, "seat": seat,
         "model": model, "usd": round(usd, 6), "note": note}
    e.update(extra)
    d["entries"].append(e)
    d["total_usd"] = round(sum(x["usd"] for x in d["entries"]), 6)
    LEDGER.parent.mkdir(parents=True, exist_ok=True)
    LEDGER.write_text(json.dumps(d, indent=2) + "\n")
    return d["total_usd"]

def ledger_guard(projected_add=0.0):
    t = ledger_load()["total_usd"]
    if t + projected_add > ABORT_AT:
        raise SystemExit(f"ABORT: ledger {t:.4f} + projected {projected_add:.4f} exceeds ${ABORT_AT}")
    return t

# ---- Anthropic (WRITE ONLY) ---------------------------------------------

ANT_PRICES = {  # per million tokens
    "claude-opus-5": {"in": 5.0, "out": 25.0, "cw": 6.25, "cr": 0.50},
    "claude-sonnet-5": {"in": 3.0, "out": 15.0, "cw": 3.75, "cr": 0.30},
}

def ant_cost(model, u):
    p = ANT_PRICES[model]
    inp = u.get("input_tokens", 0)
    out = u.get("output_tokens", 0)
    cw = u.get("cache_creation_input_tokens", 0)
    cr = u.get("cache_read_input_tokens", 0)
    return (inp * p["in"] + out * p["out"] + cw * p["cw"] + cr * p["cr"]) / 1_000_000

def ant_key():
    k = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if not k:
        f = pathlib.Path.home() / ".config/ladv/anthropic.key"
        if f.exists():
            k = f.read_text().strip()
    if not k:
        raise SystemExit("no ANTHROPIC_API_KEY in env and no ~/.config/ladv/anthropic.key")
    return k

def anthropic_call(seat, system_blocks, user_text, max_tokens, effort="medium", stage="", note=""):
    """system_blocks: list of (text, cacheable). Returns (text, usage, usd)."""
    model = model_of(seat)
    sys_content = []
    for t, cacheable in system_blocks:
        if not t:
            continue
        b = {"type": "text", "text": t}
        if cacheable:
            b["cache_control"] = {"type": "ephemeral"}
        sys_content.append(b)
    payload = {
        "model": model, "max_tokens": max_tokens, "system": sys_content,
        "messages": [{"role": "user", "content": user_text}],
        "output_config": {"effort": effort},
    }
    req = urllib.request.Request(ANT_URL, data=json.dumps(payload).encode(), headers={
        "x-api-key": ant_key(), "anthropic-version": ANT_VERSION, "content-type": "application/json"})
    last = None
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=1800) as r:
                data = json.loads(r.read())
            break
        except urllib.error.HTTPError as e:
            body = e.read()[:400].decode("utf-8", "replace")
            last = f"HTTP {e.code}: {body}"
            if e.code in (429, 500, 502, 503, 529) and attempt < 3:
                time.sleep(8 * (attempt + 1)); continue
            raise SystemExit(f"anthropic {last}")
        except urllib.error.URLError as e:
            last = str(e.reason)
            if attempt < 3:
                time.sleep(8 * (attempt + 1)); continue
            raise SystemExit(f"anthropic network: {last}")
    u = data.get("usage", {})
    usd = ant_cost(model, u)
    txt = "".join(b.get("text", "") for b in data.get("content", []) if b.get("type") == "text")
    ledger_add(stage, seat, model, usd, note,
               input_tokens=u.get("input_tokens", 0), output_tokens=u.get("output_tokens", 0),
               cache_write=u.get("cache_creation_input_tokens", 0),
               cache_read=u.get("cache_read_input_tokens", 0), stop_reason=data.get("stop_reason"))
    return txt, u, usd

# ---- OpenRouter / xAI (critic seats) ------------------------------------

def _guard_critic(seat):
    if provider_of(seat) in WRITE_ONLY_PROVIDERS:
        raise RuntimeError(f"seat {seat} is WRITE-ONLY; Claude does not score (Marco, 2026-08-20)")

def openrouter(seat, system, user, max_tokens=6000, temperature=0.7):
    _guard_critic(seat)
    key = KEY_FILE.read_text().strip()
    payload = {"model": model_of(seat),
               "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
               "max_tokens": max_tokens, "temperature": temperature,
               "provider": {"allow_fallbacks": True},
               "usage": {"include": True}}
    if seat in ("kimi",):
        payload["reasoning"] = {"effort": "low"}
    req = urllib.request.Request(OR_URL, data=json.dumps(payload).encode(), headers={
        "Authorization": f"Bearer {key}", "Content-Type": "application/json",
        "HTTP-Referer": "https://apr70.com", "X-Title": "APR70 writers room"})
    with urllib.request.urlopen(req, timeout=1200) as r:
        data = json.loads(r.read())
    choice = data["choices"][0]
    content = (choice["message"].get("content") or "").strip()
    if not content:
        raise RuntimeError(f"{seat} returned empty content (finish_reason={choice.get('finish_reason')})")
    usage = data.get("usage", {}) or {}
    return content, usage, float(usage.get("cost", 0.0) or 0.0)

def xai(seat, system, user, max_tokens=6000, temperature=0.7):
    _guard_critic(seat)
    key = XAI_KEY_FILE.read_text().strip()
    payload = {"model": model_of(seat),
               "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
               "max_tokens": max_tokens, "temperature": temperature}
    req = urllib.request.Request(XAI_URL, data=json.dumps(payload).encode(), headers={
        "Authorization": f"Bearer {key}", "Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=1200) as r:
        body = json.loads(r.read().decode())
    u = body.get("usage", {}) or {}
    # xAI cost not returned; ESTIMATE at $3/M in, $15/M out
    usd = (u.get("prompt_tokens", 0) * 3.0 + u.get("completion_tokens", 0) * 15.0) / 1_000_000
    return body["choices"][0]["message"]["content"], u, usd

def call_seat(seat, system, user, max_tokens=6000, temperature=0.7):
    return (xai if provider_of(seat) == "xai" else openrouter)(seat, system, user, max_tokens, temperature)
