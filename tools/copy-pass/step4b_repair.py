#!/usr/bin/env python3
"""Pass 4b: one Opus 5 repair call per flagged document. MECHANICAL FIXES ONLY —
law breaks (law1/law2), length overruns, meaning drift. Taste flags (residue, hedge,
stacked, sameness) are recorded in the report and left for Marco. No looping."""
import json, pathlib, re, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import lib

MECHANICAL = {"law1", "law2", "law3", "drift", "length"}

inv = json.loads((lib.OUT / "inventory.json").read_text())
after = json.loads((lib.OUT / "after.json").read_text())
flags = json.loads((lib.OUT / "residue-flags.json").read_text())
voice = (lib.OUT / "voice-profile-marco.md").read_text()

SYSTEM = """You are the house repair pass for APR 70 Pictures' website copy draft.

You are given a small set of fields: the BEFORE (live) text, the AFTER (rewritten) text, and a flag naming a MECHANICAL defect in the AFTER. Fix ONLY the named defect. Do not restyle, do not improve, do not shorten anything that is not flagged for length.

THE LAWS
LAW 1 — the strings "like a" and "like an" must not appear.
LAW 2 — the em dash (U+2014) must never appear. A pause is an ellipsis or a full stop.
LAW 3 — say what a thing is.

DEFECT TYPES
law1 / law2 / law3 — remove the law break with the smallest possible edit.
drift — restore the fact, number, name, date, place, title, link, arrow or markdown mark that the AFTER lost or changed. The BEFORE is the authority.
length — bring the AFTER back inside plus or minus 25% of the BEFORE character count. Headings, labels, buttons, captions, credits, scene slugs, kickers and nav items must be no longer than the BEFORE.

Return ONLY a JSON object mapping each given field path to its repaired full string. Same keys, no others. No fence, no commentary."""

repairs_path = lib.OUT / "repairs.json"
repairs = json.loads(repairs_path.read_text()) if repairs_path.exists() else {}

for doc in inv["docs"]:
    key = doc["key"]
    if key in repairs:
        print(f"skip {key}"); continue
    mech = [f for f in flags.get(key, []) if f.get("issue") in MECHANICAL]
    if not mech:
        repairs[key] = {}
        repairs_path.write_text(json.dumps(repairs, ensure_ascii=False, indent=2) + "\n")
        continue
    befores = {}
    for f in doc["fields"]:
        if f["kind"] == "text":
            befores[f["path"]] = f["before"]
        else:
            for i, t in enumerate(f["before_texts"]):
                befores[f"{f['path']}#{i}"] = t
    items = []
    seen = set()
    for fl in mech:
        p = fl["path"]
        if p in seen or p not in befores:
            continue
        seen.add(p)
        items.append({"path": p, "before": befores[p], "after": after[key][p],
                      "defect": fl["issue"], "why": fl.get("why", "")})
    if not items:
        repairs[key] = {}
        repairs_path.write_text(json.dumps(repairs, ensure_ascii=False, indent=2) + "\n")
        continue
    lib.ledger_guard(0.15)
    txt, u, usd = lib.anthropic_call(
        "opus", [(SYSTEM, True)],
        f"DOCUMENT: {key}\n\n{json.dumps(items, ensure_ascii=False, indent=1)}\n\nReturn the JSON object now.",
        max_tokens=8000, effort="medium", stage="4b-repair", note=key)
    raw = re.sub(r"^```(?:json)?\s*", "", txt.strip())
    raw = re.sub(r"\s*```$", "", raw).strip()
    res = json.loads(raw)
    res = {k: v for k, v in res.items() if k in seen and isinstance(v, str)}
    for k, v in res.items():
        after[key][k] = v
    repairs[key] = res
    repairs_path.write_text(json.dumps(repairs, ensure_ascii=False, indent=2) + "\n")
    (lib.OUT / "after.json").write_text(json.dumps(after, ensure_ascii=False, indent=2) + "\n")
    print(f"{key:38s} repaired={len(res)} ${usd:.4f} | ledger ${lib.ledger_load()['total_usd']:.4f}")
print("done. ledger $%.4f" % lib.ledger_load()["total_usd"])
