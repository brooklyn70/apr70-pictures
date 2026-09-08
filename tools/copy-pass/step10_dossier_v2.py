#!/usr/bin/env python3
"""Round 2, step 4a: one dossier per chair. Same shape as round 1's, with a v2 line added and
that chair's own round-1 notes quoted under the fields they concerned.

Each chair sees only his own notes. He is not shown the other three, and he is not shown the
house reasons for declining anything: he is shown what he asked for and what came back.
"""
import ast, json, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import lib, v2_notes

lib.use_round2()
OUT, OUT2 = lib.OUT, lib.OUT2

_t = ast.parse((pathlib.Path(__file__).parent / "step5a_dossier.py").read_text())
_c = {n.targets[0].id: ast.literal_eval(n.value) for n in _t.body
      if isinstance(n, ast.Assign) and getattr(n.targets[0], "id", None) in ("CREED", "LAWS")}
CREED, LAWS = _c["CREED"], _c["LAWS"]

inv = json.loads((OUT / "inventory.json").read_text())
v1 = json.loads((OUT / "after.json").read_text())
v2 = json.loads((OUT2 / "after-v2.json").read_text())
voice = (OUT / "voice-profile-marco.md").read_text()


def section(md, h):
    if h not in md:
        return ""
    return md.split(h, 1)[1].split("\n## ", 1)[0].strip()


CHANGED = [(k, p) for k in v2 for p in v2[k] if v2[k][p] != v1[k][p]]

HEAD = """APR 70 PICTURES - PUBLIC WEBSITE COPY - ROUND 2
Writers-room compound writing pass, 2026-09-07. Draft only. Nothing applied to the site.

WHAT YOU ARE READING

This is the second draft. You read the first one and filed notes. Marco read your notes and the
other three chairs' notes, ruled them good, and ordered one more pass. The copy below now shows
three states per field:

  BEFORE - what is live on staging.apr70.com today.
  v1     - the first draft, the one you scored.
  v2     - the second draft, written against the room's notes.

Where v1 returned the BEFORE unchanged the row reads KEEP. Where v2 kept v1 the row reads
"v2: KEEP (v1 stands)". Only the fields round 2 actually moved carry a full v2 line, and there
are {n_changed} of them out of {n_rows}.

Your own round-1 notes are quoted under the fields they concerned, marked YOUR NOTE, with the
house decision on each: APPLIED, APPLIED IN PART, or DECLINED. Where a note was declined or
applied only in part, the reason is given. Two limits bound every decision: the pass keeps every
fact that is on the page today and adds none, and every field is a fixed UI slot that cannot grow.

THE FOUNDER'S VOICE, IN BRIEF
"""

DEC = {"APPLY": "APPLIED", "PARTLY": "APPLIED IN PART", "DECLINE": "DECLINED",
       "RULING": "CARRIED TO MARCO AS A RULING, not a line edit"}

for chair in ("welles", "sturges", "riskin", "capra"):
    mine = {}
    loose = []
    for nid, ch, doc, path, quote, ask, dec, why in v2_notes.NOTES:
        if ch != chair:
            continue
        line = (f"    YOUR NOTE [{nid}] - {DEC[dec]}\n"
                f"      you quoted: {quote}\n"
                f"      you asked : {ask}\n"
                f"      the house : {why}")
        if doc in ("(all ten properties)", "(nine properties)"):
            for k in v2_notes.PROJECTS:
                mine.setdefault((k, path), []).append(line)
        elif doc.startswith("(") or path.startswith("("):
            loose.append(f"[{nid}] on {doc} {path} - {DEC[dec]}\n"
                         f"  you quoted: {quote}\n  you asked : {ask}\n  the house : {why}")
        else:
            mine.setdefault((doc, path), []).append(line)

    parts = [HEAD.format(n_changed=len(CHANGED), n_rows=inv["field_count"]),
             section(voice, "## Calibration: Marco's voice on the public site"), "",
             "How he sounds: " + section(voice, "## How he sounds")[:1200], "",
             LAWS, "", CREED, ""]
    if loose:
        parts += ["YOUR ROUND-1 NOTES THAT WERE NOT ABOUT ONE FIELD", "-" * 78, ""] + loose + [""]
    parts.append("=" * 78)

    keep = rew = held = 0
    for doc in inv["docs"]:
        key = doc["key"]
        tag = "  [PRIVATE SLATE - not public]" if doc.get("private") else ""
        parts += ["", f"PAGE: {doc['page']}   {doc['route']}{tag}", "-" * 78]
        rows = []
        for f in doc["fields"]:
            if f["kind"] == "text":
                rows.append((f["path"], f["before"]))
            else:
                for i, t in enumerate(f["before_texts"]):
                    rows.append((f"{f['path']}#{i}", t))
        for path, b in rows:
            a1, a2 = v1[key][path], v2[key][path]
            parts += ["", f"FIELD: {path}", f"BEFORE: {b}"]
            if a1 == b:
                parts.append("v1:     KEEP"); keep += 1
            else:
                parts.append(f"v1:     {a1}"); rew += 1
            if a2 == a1:
                parts.append("v2:     KEEP (v1 stands)"); held += 1
            else:
                parts.append(f"v2:     {a2}")
            for line in mine.get((key, path), []):
                parts.append(line)

    parts += ["", "=" * 78, "",
              f"Rows: {keep + rew} total. {keep} were KEEP in v1, {rew} were rewritten in v1.",
              f"Round 2 moved {len(CHANGED)} fields and left {held} standing on v1."]
    txt = "\n".join(parts) + "\n"
    dest = OUT2 / f"critic-dossier-v2-{chair}.txt"
    dest.write_text(txt, encoding="utf-8")
    print(f"{chair:9s} bytes={len(txt):7d}  own notes on {len(mine)} fields, {len(loose)} loose")
