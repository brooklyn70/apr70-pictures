#!/usr/bin/env python3
"""Round 2, step 3: residue and law check on the CHANGED fields only.

(a) Two deterministic consistency repairs first, logged, no model:
    - pitchDeck.note is one repeated string across ten property pages. Note S11 was applied on
      four of them and missed on six. All ten are normalised to the applied v2 string.
    - Home sections.2.lede came back with BEFORE's "They have been waiting", which Riskin named
      as one of v1's wins ("It cut the sob"). The regression is reverted.
(b) claude-sonnet-5 reads BEFORE / v1 / v2 for every field v2 changed, against the same
    humanizer checklist, voice test and laws used in round 1.
(c) claude-opus-5 repairs MECHANICAL defects only: a law break, a length overrun, or a
    number / link / arrow / markdown marker the BEFORE carried and v2 dropped (that last one is
    computed in code, never judged by a model). A change one of the four chairs asked for is
    SANCTIONED and is never reverted. Everything else is recorded for Marco.
"""
import ast, json, pathlib, re, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import lib, v2_notes

lib.use_round2()
OUT, OUT2 = lib.OUT, lib.OUT2

_t = ast.parse((pathlib.Path(__file__).parent / "step4_residue.py").read_text())
_c = {n.targets[0].id: ast.literal_eval(n.value) for n in _t.body
      if isinstance(n, ast.Assign) and getattr(n.targets[0], "id", None) in ("CHECKLIST",)}
CHECKLIST = _c["CHECKLIST"]

# A round-2 note is an INSTRUCTION, not a defect. The model may not revert one. Only the four
# defects below are repairable by the model, plus token drift, which is computed in code.
MECHANICAL = {"law1", "law2", "law3", "length"}
TOKEN = re.compile(r"\d{3,4}|https?://\S+|\[[^\]]+\]\([^)]+\)|\u2192|==[^=]+==|\*\*[^*]+\*\*|@\S+\.\w+")

inv = json.loads((OUT / "inventory.json").read_text())
v1 = json.loads((OUT / "after.json").read_text())
v2 = json.loads((OUT2 / "after-v2.json").read_text())
voice = (OUT / "voice-profile-marco.md").read_text()
vtest = voice.split("## The voice test", 1)[1].strip()

befores, pages = {}, {}
for d in inv["docs"]:
    pages[d["key"]] = (d["page"], d["route"])
    for f in d["fields"]:
        if f["kind"] == "text":
            befores[(d["key"], f["path"])] = f["before"]
        else:
            for i, t in enumerate(f["before_texts"]):
                befores[(d["key"], f"{f['path']}#{i}")] = t

# ---------------------------------------------------------------- (a) consistency repairs
CONSISTENCY = []
PD = "The visual deck is shared privately. Investor conversations happen in person. Write to the offices."
for k in v2_notes.PROJECTS:
    if v2[k].get("pitchDeck.note") != PD:
        CONSISTENCY.append({"doc": k, "path": "pitchDeck.note", "issue": "sameness",
                            "why": "S11 applied on four property pages and missed on six. "
                                   "This field is one repeated string; all ten now match.",
                            "from": v2[k]["pitchDeck.note"], "to": PD})
        v2[k]["pitchDeck.note"] = PD

LEDE = ("They want stories told with craft: written by hand, finished on the page, "
        "and worth handing to the next generation.")
if v2["v9-home:v9-home"]["sections.2.lede"] != LEDE:
    CONSISTENCY.append({"doc": "v9-home:v9-home", "path": "sections.2.lede", "issue": "drift",
                        "why": "v2 restored BEFORE's \"They have been waiting\". Riskin named the v1 "
                               "cut of that phrase as a win: \"It cut the sob. Waiting is a feeling "
                               "you did not earn.\" S1's cut is kept, the regression is not.",
                        "from": v2["v9-home:v9-home"]["sections.2.lede"], "to": LEDE})
    v2["v9-home:v9-home"]["sections.2.lede"] = LEDE

(OUT2 / "after-v2.json").write_text(json.dumps(v2, ensure_ascii=False, indent=2) + "\n")
(OUT2 / "consistency-repairs.json").write_text(json.dumps(CONSISTENCY, ensure_ascii=False, indent=2) + "\n")
print(f"deterministic consistency repairs: {len(CONSISTENCY)}")

# ---------------------------------------------------------------- (b) Sonnet read, changed only
changed = [(k, p) for k in v2 for p in v2[k] if v2[k][p] != v1[k][p]]
print(f"changed fields in v2: {len(changed)}")

SYSTEM = f"""You are the house line-checker for APR 70 Pictures. You do not rewrite. You read the
SECOND draft of the studio's public website copy and return a list of flags.

You see three versions of each field: BEFORE (live on the site), v1 (the first draft) and v2
(the second draft, written against four critics' notes). You judge v2 ONLY. v1 is context.

{CHECKLIST}

# THE HOUSE LAWS (a break here is a hard flag)
LAW 1 - no "like a" / "like an" simile anywhere in v2.
LAW 2 - no em dash (U+2014) anywhere in v2.
LAW 3 - Mamet-direct: say what a thing is.

# THE VOICE TEST v2 must pass
{vtest}

# WHAT ROUND 2 WAS TOLD TO DO (read this before you flag anything)
Each row carries the critics' notes that were APPLIED to that field. A line that a chair asked
for, or a line the house ruling told the writer to play, is SANCTIONED. It is not drift and it is
not a new claim, even though it appears in neither BEFORE nor v1. That is the whole point of a
second draft. DO NOT FLAG A CHANGE THE NOTE ASKED FOR. Do not propose reverting to v1 or BEFORE.

# ALSO FLAG
- MEANING DRIFT: a number, date, name, title, place, link, arrow or markdown marker that BEFORE
  carried and v2 does not, WHERE NO NOTE ASKED FOR ITS REMOVAL.
- NEW CLAIM: a fact asserted in v2 that is in neither BEFORE, nor v1, nor the notes on that field.
  A rephrasing is not a new claim. A new number, a new name, a new event, a new cause is.
- LENGTH: v2 more than 25% longer than BEFORE, or a heading / label / button / caption / credit /
  scene slug / kicker / nav item that grew at all, or v2 shorter than 70% of BEFORE.
- DANGLING REFERENCE: a pronoun in v2 whose antecedent a cut removed.

# OUTPUT
Return ONLY a JSON array. Each element:
{{"doc": "<doc key>", "path": "<field path>", "issue": "<residue|hedge|stacked|sameness|law1|law2|law3|drift|newclaim|length|dangling>", "quote": "<the offending words from v2>", "why": "<one sentence>", "fix": "<the corrected full v2 string for that field>"}}
"fix" is the complete replacement string, obeying every rule above. Keep every fact.
Return [] if the draft is clean. No commentary, no fence, no preamble, no reasoning: the JSON
array is the entire response. Be terse. Flag only what is genuinely wrong; a clean second draft
returning a short list is the expected result."""

flags_path = OUT2 / "residue-flags-v2.json"
if flags_path.exists():
    flags = json.loads(flags_path.read_text())
    print("skip sonnet read (flags already on disk)")
else:
    def applied_notes(k, p):
        return [f"[{n[0]}] {n[1]} ({n[6]}): {n[5]} || house ruling: {n[7]}"
                for n in v2_notes.notes_for(k) if n[3] == p and n[6] in ("APPLY", "PARTLY")]

    rows = [{"doc": k, "page": pages[k][0], "path": p, "BEFORE": befores[(k, p)],
             "v1": v1[k][p], "v2": v2[k][p],
             "notes_applied": applied_notes(k, p) or ["(house consistency repair, no chair note)"]}
            for k, p in changed]
    lib.ledger_guard(0.30)
    txt, u, usd = lib.anthropic_call(
        "sonnet", [(SYSTEM, True)],
        "APR 70 PICTURES - SECOND DRAFT - every field round 2 changed.\n\n"
        + json.dumps(rows, ensure_ascii=False, indent=1)
        + "\n\nReturn the JSON array now.",
        max_tokens=8000, effort="low", stage="9-residue-v2", note=f"{len(rows)} changed fields")
    raw = re.sub(r"^```(?:json)?\s*", "", txt.strip())
    raw = re.sub(r"\s*```$", "", raw).strip()
    try:
        flags = json.loads(raw)
    except Exception as e:
        (OUT2 / "_fail-residue.txt").write_text(txt)
        raise SystemExit(f"unparsable flag list ({e}); raw saved")
    flags_path.write_text(json.dumps(flags, ensure_ascii=False, indent=2) + "\n")
    print(f"flags={len(flags)} ${usd:.4f} | round2 ledger ${lib.ledger_load()['total_usd']:.4f}")

# ---------------------------------------------------------------- (c) Opus mechanical repair
REPAIR_SYSTEM = """You are the house repair pass for APR 70 Pictures' website copy draft, round 2.

You are given fields with the BEFORE (live) text, the v2 (second draft) text, and a flag naming a
MECHANICAL defect in v2. Fix ONLY the named defect with the smallest possible edit. Do not
restyle, do not improve, do not shorten anything not flagged for length.

THE LAWS
LAW 1 - the strings "like a" and "like an" must not appear.
LAW 2 - the em dash (U+2014) must never appear. A pause is an ellipsis or a full stop.
LAW 3 - say what a thing is.

DEFECT TYPES
law1 / law2 / law3 - remove the law break with the smallest possible edit.
drift - restore the number, date, link, arrow or markdown marker v2 dropped. Change nothing else.
length - bring v2 back inside the BEFORE's length band. Headings, labels, buttons, captions,
         credits, scene slugs, kickers and nav items must be no longer than the BEFORE.

The v2 wording was written against four critics' notes and is deliberate. Never revert v2 toward
v1 or BEFORE. Fix the named defect inside the v2 sentence and leave everything else alone.

Return ONLY a JSON object mapping each given field path (in the form "<doc key>||<path>") to its
repaired full string. Same keys, no others. No fence, no commentary."""

repairs_path = OUT2 / "repairs-v2.json"
if repairs_path.exists():
    repairs = json.loads(repairs_path.read_text())
    print("skip repair (already on disk)")
else:
    # Deterministic token drift: a number, link, arrow or marker BEFORE carried and v2 dropped.
    # A field the room ruled on is EXEMPT from automatic repair: when a chair asked for a line to
    # be cut, the numbers inside that line go with it, and restoring them would revert the note.
    # Those are recorded for Marco instead. Only unnoted fields are auto-repaired.
    noted = {(n[2], n[3]) for k in v2 for n in v2_notes.notes_for(k)
             if n[6] in ("APPLY", "PARTLY")}
    token_drift, token_recorded = [], []
    for k, p in changed:
        lost = [t for t in set(TOKEN.findall(befores[(k, p)])) if t not in v2[k][p]]
        if not lost:
            continue
        row = {"doc": k, "path": p, "issue": "drift",
               "quote": ", ".join(sorted(lost)),
               "why": f"BEFORE carries {sorted(lost)}; v2 does not.", "fix": ""}
        if (k, p) in noted:
            row["why"] += (" Recorded, not repaired: this field was rewritten under an applied "
                           "chair note, and the dropped token sits inside the line the room asked "
                           "to cut. Restoring it would revert the note.")
            token_recorded.append(row)
        else:
            token_drift.append(row)
    for t in token_recorded:
        if not any(f.get("doc") == t["doc"] and f.get("path") == t["path"] for f in flags):
            flags.append(t)
    for t in token_drift:
        if not any(f.get("doc") == t["doc"] and f.get("path") == t["path"]
                   and f.get("issue") == "drift" for f in flags):
            flags.append(t)
    flags_path.write_text(json.dumps(flags, ensure_ascii=False, indent=2) + "\n")

    mech, seen = [], set()
    for f in flags:
        kk = (f.get("doc"), f.get("path"))
        if f.get("issue") not in MECHANICAL and not (
                f.get("issue") == "drift" and any(
                    t["doc"] == kk[0] and t["path"] == kk[1] for t in token_drift)):
            continue
        if kk in seen or kk not in befores:
            continue
        seen.add(kk)
        mech.append({"path": f"{kk[0]}||{kk[1]}", "before": befores[kk], "v2": v2[kk[0]][kk[1]],
                     "defect": f.get("issue"), "why": f.get("why", "")})
    repairs = {}
    if mech:
        lib.ledger_guard(0.20)
        txt, u, usd = lib.anthropic_call(
            "opus", [(REPAIR_SYSTEM, True)],
            json.dumps(mech, ensure_ascii=False, indent=1) + "\n\nReturn the JSON object now.",
            max_tokens=8000, effort="medium", stage="9b-repair-v2", note=f"{len(mech)} fields")
        raw = re.sub(r"^```(?:json)?\s*", "", txt.strip())
        raw = re.sub(r"\s*```$", "", raw).strip()
        got = json.loads(raw)
        for kp, val in got.items():
            if "||" not in kp or not isinstance(val, str):
                continue
            k, p = kp.split("||", 1)
            if (k, p) in seen:
                v2[k][p] = val
                repairs[kp] = val
        (OUT2 / "after-v2.json").write_text(json.dumps(v2, ensure_ascii=False, indent=2) + "\n")
        print(f"repaired={len(repairs)} ${usd:.4f} | round2 ledger ${lib.ledger_load()['total_usd']:.4f}")
    else:
        print("no mechanical flags: nothing to repair")
    repairs_path.write_text(json.dumps(repairs, ensure_ascii=False, indent=2) + "\n")

# ---------------------------------------------------------------- report
changed = [(k, p) for k in v2 for p in v2[k] if v2[k][p] != v1[k][p]]
taste = [f for f in flags if f"{f.get('doc')}||{f.get('path')}"
         not in json.loads(repairs_path.read_text())]
hard = [f for f in flags if f not in taste]
L = [f"""# AI-residue and voice check, round 2 — APR 70 site copy pass, 2026-09-07

**DRAFT ONLY. Nothing applied to the site.**

Scope: the **{len(changed)} fields round 2 changed**. Fields v2 carried forward from v1 unchanged
were checked in round 1 and are not re-read here.

Reader: `claude-sonnet-5`, one call, reading BEFORE / v1 / v2 together against the house
humanizer checklist, the twelve-line voice test and the three laws, plus two round-2 tests:
**no new claim** (round 2 could cut and re-say, it could not add) and **no dangling reference**
(a pronoun whose antecedent a cut removed). Every row carried the chair notes applied to that
field, so a change a chair asked for is sanctioned and is not flagged.
Repair: `claude-opus-5`, and only for a law break, a length overrun, or a number / link / arrow /
markdown marker the BEFORE carried and v2 dropped (that last one is computed in code, not judged
by a model). **A note the room asked for is never reverted.** Everything else is recorded for Marco.
The check ran once. It was not looped.

## Deterministic consistency repairs (no model)

{len(CONSISTENCY)} applied before the read.
"""]
for c in CONSISTENCY:
    L.append(f"- **`{c['doc']}` · `{c['path']}`** · `{c['issue']}` · {c['why']}")
    L.append(f"  - from: {c['from']!r}")
    L.append(f"  - to:   {c['to']!r}")
L.append(f"\n## Model read\n\n**{len(flags)} lines flagged. {len(hard)} mechanical, "
         f"{len(taste)} matters of taste. {len(json.loads(repairs_path.read_text()))} repaired.**\n")
for f in flags:
    applied = f"{f.get('doc')}||{f.get('path')}" in json.loads(repairs_path.read_text())
    kind = "MECHANICAL" if f in hard else "TASTE"
    L.append(f"**`{f.get('doc')}` · `{f.get('path')}`** · `{f.get('issue')}` · {kind} · "
             f"{'**APPLIED**' if applied else 'recorded, not applied'}")
    L.append(f"- quote: {f.get('quote', '')!r}")
    L.append(f"- why: {f.get('why', '')}")
    L.append(f"- suggested fix: {f.get('fix', '')!r}")
    if applied:
        L.append(f"- FINAL v2: {v2[f['doc']][f['path']]!r}")
    L.append("")
(OUT2 / "residue-report.md").write_text("\n".join(L) + "\n", encoding="utf-8")
print("wrote v2/residue-report.md")
