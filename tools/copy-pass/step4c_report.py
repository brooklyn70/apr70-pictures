#!/usr/bin/env python3
"""Write residue-report.md: what was flagged and what was actually changed."""
import json, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import lib

inv = json.loads((lib.OUT / "inventory.json").read_text())
flags = json.loads((lib.OUT / "residue-flags.json").read_text())
repairs = json.loads((lib.OUT / "repairs.json").read_text()) if (lib.OUT / "repairs.json").exists() else {}
after = json.loads((lib.OUT / "after.json").read_text())
MECH = {"law1", "law2", "law3", "drift", "length"}

names = {d["key"]: (d["page"], d["route"]) for d in inv["docs"]}
tot = sum(len(v) for v in flags.values())
rep = sum(len(v) for v in repairs.values())
L = [f"""# AI-residue and voice check — APR 70 site copy pass, 2026-09-07

**DRAFT ONLY. Nothing applied to the site.**

Reader: `claude-sonnet-5`, one call per document, reading BEFORE and AFTER together against the
house humanizer checklist, the twelve-line voice test from the voice profile, and the three laws.
Repair: `claude-opus-5`, one call per flagged document, **mechanical defects only**
(`law1`, `law2`, `drift`, `length`). Taste flags (`residue`, `hedge`, `stacked`, `sameness`) were
recorded and left for Marco. The check ran **once**. It was not looped.

**{tot} lines flagged. {rep} repaired.**

| Document | Flags | Repaired |
|---|---|---|"""]
for d in inv["docs"]:
    k = d["key"]
    L.append(f"| {d['page']} (`{k}`) | {len(flags.get(k, []))} | {len(repairs.get(k, {}))} |")
L.append("")
for d in inv["docs"]:
    k = d["key"]
    fl = flags.get(k, [])
    if not fl:
        continue
    L.append(f"\n## {d['page']}  `{d['route']}`\n")
    for f in fl:
        applied = f["path"] in repairs.get(k, {})
        kind = "MECHANICAL" if f.get("issue") in MECH else "TASTE"
        L.append(f"**`{f['path']}`** · `{f.get('issue')}` · {kind} · "
                 f"{'**APPLIED**' if applied else 'recorded, not applied'}")
        L.append(f"- quote: {f.get('quote','')!r}")
        L.append(f"- why: {f.get('why','')}")
        L.append(f"- suggested fix: {f.get('fix','')!r}")
        if applied:
            L.append(f"- FINAL AFTER: {after[k][f['path']]!r}")
        L.append("")
(lib.OUT / "residue-report.md").write_text("\n".join(L) + "\n", encoding="utf-8")
print("wrote residue-report.md")
