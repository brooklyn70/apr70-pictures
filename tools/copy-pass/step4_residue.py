#!/usr/bin/env python3
"""Pass 4a: Sonnet 5 reads BEFORE/AFTER per document against the humanizer checklist and the
voice test, and returns flagged AFTER lines. No looping: one read, then one mechanical repair."""
import json, pathlib, re, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import lib

inv = json.loads((lib.OUT / "inventory.json").read_text())
after = json.loads((lib.OUT / "after.json").read_text())
voice = (lib.OUT / "voice-profile-marco.md").read_text()
vtest = voice.split("## The voice test", 1)[1].strip()

CHECKLIST = """# AI-RESIDUE CHECKLIST (from the house humanizer skill, Wikipedia "Signs of AI writing")

Flag any AFTER line that shows:
- AI vocabulary: delve, tapestry, vibrant, testament, underscore, showcase, pivotal, crucial, key (adj), landscape (abstract), intricate, interplay, foster, garner, enhance, align with, enduring, valuable, additionally, emphasizing
- Promotional puffery and inflated symbolism; adjectives doing a fact's job
- Vague attribution: experts say, observers note, industry reports, some critics
- Copula avoidance: serves as, stands as, represents, boasts, features, offers (where "is"/"has" is meant)
- Negative parallelism: "not only... but also", "it's not just X, it's Y", and tailing negations ("no guessing", "no wasted motion")
- Rule of three forced for completeness; stacked adjectives
- Elegant variation (synonym cycling for the same thing)
- False ranges ("from X to Y" where X and Y are not on one scale)
- Passive voice or subjectless fragments hiding the actor
- Hedges: perhaps, arguably, somewhat, relatively, it could be argued, tends to
- Sameness: several fields on one page opening or closing the same way
"""

SYSTEM = f"""You are the house line-checker for APR 70 Pictures. You do not rewrite. You read a rewritten draft of the studio's public website copy against three tests and return a list of flags.

{CHECKLIST}

# THE HOUSE LAWS (a break here is a hard flag)
LAW 1 — no "like a" / "like an" simile anywhere in the AFTER text.
LAW 2 — no em dash (U+2014) anywhere in the AFTER text.
LAW 3 — Mamet-direct: say what a thing is.

# THE VOICE TEST the AFTER copy must pass
{vtest}

# ALSO FLAG
- MEANING DRIFT: any fact, number, name, date, place, title, link, arrow, markdown mark or highlight marker present in BEFORE and missing, changed or invented in AFTER.
- LENGTH OVERRUN: any AFTER value more than 25% longer than its BEFORE, or any heading / label / button / caption / credit / scene slug / kicker / nav item that grew at all.

# OUTPUT
Return ONLY a JSON array. Each element:
{{"path": "<field path exactly as given>", "issue": "<residue|hedge|stacked|sameness|law1|law2|drift|length>", "quote": "<the offending words from AFTER>", "why": "<one sentence>", "fix": "<the corrected full AFTER string for that field>"}}
"fix" must be the complete replacement string for that field, obeying every rule above and staying within the BEFORE length band. Keep every fact.
Return [] if the document is clean. Rows whose AFTER equals BEFORE are KEEP rows: judge them only for law breaks, nothing else. No commentary, no fence."""

flags_path = lib.OUT / "residue-flags.json"
allflags = json.loads(flags_path.read_text()) if flags_path.exists() else {}

for doc in inv["docs"]:
    key = doc["key"]
    if key in allflags:
        print(f"skip {key}"); continue
    res = after[key]
    rows = []
    for f in doc["fields"]:
        if f["kind"] == "text":
            rows.append({"path": f["path"], "before": f["before"], "after": res[f["path"]]})
        else:
            for i, t in enumerate(f["before_texts"]):
                p = f"{f['path']}#{i}"
                rows.append({"path": p, "before": t, "after": res[p]})
    body = json.dumps(rows, ensure_ascii=False, indent=1)
    lib.ledger_guard(0.20)
    txt, u, usd = lib.anthropic_call(
        "sonnet", [(SYSTEM, True)],
        f"PAGE: {doc['page']} ({doc['route']})\nDOCUMENT: {key}\n\n{body}\n\nReturn the JSON array now.",
        max_tokens=12000, effort="medium", stage="4-residue", note=key)
    raw = re.sub(r"^```(?:json)?\s*", "", txt.strip())
    raw = re.sub(r"\s*```$", "", raw).strip()
    try:
        flags = json.loads(raw)
    except Exception as e:
        print(f"WARN {key}: unparsable flag list ({e}); recorded as empty")
        flags = []
    allflags[key] = flags
    flags_path.write_text(json.dumps(allflags, ensure_ascii=False, indent=2) + "\n")
    print(f"{key:38s} flags={len(flags):3d} ${usd:.4f} | ledger ${lib.ledger_load()['total_usd']:.4f}")
print("done. ledger $%.4f" % lib.ledger_load()["total_usd"])
