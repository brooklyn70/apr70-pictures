#!/usr/bin/env python3
"""Round 2, step 2: one Opus 5 call per document that carries at least one APPLY/PARTLY note.

Reuses step3's voice profile, laws and hard rules verbatim, and adds the cross-cutting lessons
the four chairs gave in round 1. The model is asked for v2 of ONLY the fields the notes name;
every other field is carried forward from v1 verbatim by this script. after-v2.json is written
as the full set so downstream code sees one complete draft.
"""
import ast, json, pathlib, re, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import lib, v2_notes


def _const(module, name):
    """Pull a top-level string constant out of a sibling script without executing it."""
    tree = ast.parse((pathlib.Path(__file__).parent / module).read_text())
    for node in tree.body:
        if isinstance(node, ast.Assign) and any(
                getattr(t, "id", None) == name for t in node.targets):
            return ast.literal_eval(node.value)
    raise KeyError(f"{name} not found in {module}")


# round 1's laws and hard rules, reused verbatim
LAWS = _const("step3_rewrite.py", "LAWS")
RULES = _const("step3_rewrite.py", "RULES")

lib.use_round2()
OUT2 = lib.OUT2
OUT2.mkdir(parents=True, exist_ok=True)

inv = json.loads((lib.OUT / "inventory.json").read_text())
v1 = json.loads((lib.OUT / "after.json").read_text())
voice = (lib.OUT / "voice-profile-marco.md").read_text()

ROUND2 = """# THIS IS ROUND 2

A first draft (v1) already exists and four critics have read it: Orson Welles, Preston Sturges,
Robert Riskin and Frank Capra. Marco read their notes and ruled them good. You are re-drafting
against those notes.

You receive, for each field in play: the BEFORE (what is live on the site today), the v1 (the
first draft), and the notes the chairs filed on that field with the house decision on each.

- A note marked APPLY: do what the chair asked.
- A note marked PARTLY: do what the reason line says, which is the chair's intent held inside
  the facts and the length slot. The reason line is the instruction. Follow it exactly.
- Notes marked DECLINE or RULING are shown for context only. DO NOT ACT ON THEM. Do not import
  their suggested lines. They are on the page so you know what was considered and refused.

Return v2 for every field listed. If a field is already right after the notes are weighed,
return its v1 string unchanged, character for character. Do not churn.

Every hard rule from round 1 still binds: keep every fact, add nothing, no em dash, no
"like a"/"like an", the length band, headings and labels no longer than the original,
quotations untouched.
"""

SYSTEM = [("# MARCO CARUSO - VOICE PROFILE\n\n" + voice + "\n\n" + LAWS + "\n" + RULES + "\n\n"
           + v2_notes.CROSS_CUTTING + "\n\n" + ROUND2, True)]

out_path = OUT2 / "after-v2.json"
after2 = json.loads(out_path.read_text()) if out_path.exists() else {}

only = sys.argv[1:] or None
for doc in inv["docs"]:
    key = doc["key"]
    if only and key not in only:
        continue
    if key in after2:
        print(f"skip {key} (done)"); continue

    # every field's BEFORE, so we can carry v1 forward for anything not in play
    befores = {}
    for f in doc["fields"]:
        if f["kind"] == "text":
            befores[f["path"]] = f["before"]
        else:
            for i, t in enumerate(f["before_texts"]):
                befores[f"{f['path']}#{i}"] = t

    rows, paths = v2_notes.actionable_for(key)
    paths = [p for p in paths if p in befores]
    if not paths:
        after2[key] = dict(v1[key])
        out_path.write_text(json.dumps(after2, ensure_ascii=False, indent=2) + "\n")
        print(f"{key:38s} no actionable notes: v1 carried forward unchanged")
        continue

    inplay = [{"path": p, "BEFORE": befores[p], "v1": v1[key][p]} for p in paths]
    notelines = []
    for nid, chair, _d, path, quote, ask, dec, why in v2_notes.notes_for(key):
        tag = dec if dec in ("APPLY", "PARTLY") else f"{dec} - CONTEXT ONLY, DO NOT ACT"
        notelines.append(f"[{nid}] {chair.upper()} on `{path}` - {tag}\n"
                         f"    chair quoted: {quote}\n"
                         f"    chair asked : {ask}\n"
                         f"    house ruling: {why}")

    user = (f"PAGE: {doc['page']}  ({doc['route']})\nDOCUMENT: {key}\n\n"
            f"FIELDS IN PLAY\n{json.dumps(inplay, ensure_ascii=False, indent=1)}\n\n"
            f"THE CHAIRS' NOTES ON THIS DOCUMENT\n\n" + "\n\n".join(notelines) + "\n\n"
            f"Return ONLY a JSON object whose keys are exactly these {len(paths)} paths:\n"
            f"{json.dumps(paths)}\nEach value is the full v2 string for that field. "
            f"No fence, no commentary.")

    lib.ledger_guard(0.20)
    txt, u, usd = lib.anthropic_call("opus", SYSTEM, user,
                                     max_tokens=min(24000, max(8000, len(user))),
                                     effort="medium", stage="8-rewrite-v2", note=key)
    raw = re.sub(r"^```(?:json)?\s*", "", txt.strip())
    raw = re.sub(r"\s*```$", "", raw).strip()
    try:
        res = json.loads(raw)
    except Exception as e:
        (OUT2 / f"_fail-{key.replace(':', '_')}.txt").write_text(txt)
        raise SystemExit(f"{key}: bad JSON ({e}); raw saved")

    missing = set(paths) - set(res)
    extra = set(res) - set(paths)
    if missing or extra:
        raise SystemExit(f"{key}: key-shape guard failed. missing={sorted(missing)} extra={sorted(extra)}")
    if not all(isinstance(vv, str) and vv.strip() for vv in res.values()):
        raise SystemExit(f"{key}: non-string or empty value returned")

    merged = dict(v1[key])
    merged.update(res)
    after2[key] = merged
    out_path.write_text(json.dumps(after2, ensure_ascii=False, indent=2) + "\n")
    changed = sum(1 for p in paths if res[p] != v1[key][p])
    print(f"{key:38s} inplay={len(paths):2d} changed={changed:2d} in={u.get('input_tokens')} "
          f"cr={u.get('cache_read_input_tokens')} out={u.get('output_tokens')} ${usd:.4f} "
          f"| round2 ledger ${lib.ledger_load()['total_usd']:.4f}")

print("done. round-2 ledger $%.4f" % lib.ledger_load()["total_usd"])
