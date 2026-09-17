#!/usr/bin/env python3
"""Round 2, step 6: verify the v2 deliverable before reporting."""
import json, pathlib, re, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import lib, v2_notes
from docx import Document

lib.use_round2()
OUT, OUT2 = lib.OUT, lib.OUT2

OK = True
def chk(label, cond, detail=""):
    global OK
    print(("PASS  " if cond else "FAIL  ") + label + (f"  {detail}" if detail else ""))
    if not cond:
        OK = False

inv = json.loads((OUT / "inventory.json").read_text())
v1 = json.loads((OUT / "after.json").read_text())
v2 = json.loads((OUT2 / "after-v2.json").read_text())
r1 = json.loads((OUT / "spend.json").read_text())
r2 = lib.ledger_load()

DEST = pathlib.Path("/Volumes/SharedData/10-03-website-assets/copy-pass-2026-09-07/"
                    "APR70-site-copy-writers-room-2026-09-07-v2.docx")
SCRATCH = pathlib.Path("/private/tmp/claude-501/-Users-marco-websites-apr70-website/"
                       "2251e5c8-4793-420f-af9f-38fc6b2b3078/scratchpad/"
                       "APR70-site-copy-writers-room-2026-09-07-v2.docx")
VAULT = pathlib.Path("/Users/marco/vault/10 Work/11 APR70 Pictures/11.03 Company Ops/"
                     "00 Website - Copy Pass 2026-09-07 v2.md")

snap = json.loads((pathlib.Path(__file__).resolve().parents[2]
                   / "docs/i18n/drafts/en.snapshot.json").read_text())

TOKEN = re.compile(r"\d{3,4}|https?://\S+|\[[^\]]+\]\([^)]+\)|→|==[^=]+==|\*\*[^*]+\*\*|@\S+\.\w+")
noted = {(n[2], n[3]) for k in v2 for n in v2_notes.notes_for(k) if n[6] in ("APPLY", "PARTLY")}

em, sim, longs, drift, drift_noted, short = [], [], [], [], [], []
rows = 0
for d in inv["docs"]:
    res = v2[d["key"]]
    for f in d["fields"]:
        items = ([(f["path"], f["before"])] if f["kind"] == "text"
                 else [(f"{f['path']}#{i}", t) for i, t in enumerate(f["before_texts"])])
        for p, b in items:
            rows += 1
            a = res[p]
            if "—" in a:
                em.append((d["key"], p))
            if re.search(r"\blike an?\b", a):
                sim.append((d["key"], p, a))
            if a != b:
                if len(a) > len(b) * 1.25 + 2:
                    longs.append((d["key"], p, len(b), len(a)))
                if len(a) < len(b) * 0.75:
                    short.append((d["key"], p, len(b), len(a)))
                for tok in set(TOKEN.findall(b)):
                    if tok not in a:
                        (drift_noted if (d["key"], p) in noted else drift).append((d["key"], p, tok))

chk("no em dash (U+2014) in any v2 string", not em, str(em[:5]))
chk('no "like a"/"like an" in any v2 string', not sim, str(sim[:3]))
chk("no v2 string more than 25% longer than its BEFORE", not longs, str(longs[:5]))
chk("no unsanctioned number / link / arrow / marker dropped", not drift, str(drift[:8]))
print(f"      note: {len(drift_noted)} token removals sit inside lines a chair asked to cut "
      f"(sanctioned, recorded): {drift_noted[:4]}")
print(f"      note: {len(short)} fields deliberately fall below 75% of the live text on a "
      f"chair's cut: {short}")

inscope = {(k, p) for k, v in snap.items() if not k.startswith("media:") for p in v}
covered = [(d["key"], f["path"]) for d in inv["docs"] for f in d["fields"]]
chk("every in-scope field present exactly once",
    len(covered) == len(set(covered)) == len(inscope),
    f"inventory={len(covered)} unique={len(set(covered))} snapshot={len(inscope)}")
chk("after-v2.json covers all 16 documents", len(v2) == 16, str(len(v2)))
chk("after-v2.json key shape matches v1 exactly",
    set(v2) == set(v1) and all(set(v2[k]) == set(v1[k]) for k in v1))
chk("every v2 value is a non-empty string",
    all(isinstance(x, str) and x.strip() for k in v2 for x in v2[k].values()))
chk("media:* excluded", not any(k.startswith("media:") for k in v2))

changed = [(k, p) for k in v2 for p in v2[k] if v2[k][p] != v1[k][p]]
print(f"      v2 changed {len(changed)} of {rows} rows")

chk("round-2 ledger under the $2.50 hard limit", r2["total_usd"] < 2.50, f"${r2['total_usd']:.4f}")
chk("round-1 ledger untouched by round 2", abs(r1["total_usd"] - 2.06922) < 1e-6,
    f"${r1['total_usd']:.5f}")
chk("no Anthropic model on a round-2 critic seat",
    not any(e["stage"].startswith("11-") and "claude" in e["model"] for e in r2["entries"]))

seats = {}
for chair in ("welles", "sturges", "riskin", "capra"):
    f = OUT2 / "critics" / f"{chair}.md"
    seats[chair] = ("MISSING" if not f.exists() else
                    "SEAT UNAVAILABLE" if "SEAT UNAVAILABLE" in f.read_text() else
                    f"ok ({f.stat().st_size} B)")
chk("all four round-2 critic files present and filled",
    all(v.startswith("ok") for v in seats.values()), str(seats))

for f in ("notes-ledger.md", "after-v2.json", "residue-report.md", "spend.json"):
    chk(f"v2/{f} exists", (OUT2 / f).exists())

for path in (DEST, SCRATCH):
    chk(f"docx exists: {path.name}", path.exists(),
        f"{path.stat().st_size // 1024} KB" if path.exists() else "")
if DEST.exists():
    doc = Document(str(DEST))
    body = [t for t in doc.tables if len(t.columns) == 4]
    trows = sum(len(t.rows) - 1 for t in body)
    chk("docx has one 4-column table per document (16), plus the scores table",
        len(body) == 17, f"4col tables={len(body)} all={len(doc.tables)}")
    chk("docx body tables carry every inventory row", trows - 4 == rows,
        f"docx={trows - 4} inventory={rows}")
    chk("docx has the 7-column notes ledger table",
        any(len(t.columns) == 7 and len(t.rows) - 1 == len(v2_notes.NOTES) for t in doc.tables),
        f"{len(v2_notes.NOTES)} notes")
    txt = "\n".join(p.text for p in doc.paragraphs)
    chk("docx carries the DRAFT ONLY warning", "DRAFT ONLY" in txt)
    chk("docx says round 2", "round 2" in txt.lower())
    chk("docx carries both round totals and the combined figure",
        f"${r1['total_usd']:.4f}" in txt and f"${r2['total_usd']:.4f}" in txt
        and f"${r1['total_usd'] + r2['total_usd']:.4f}" in txt)
    chk("docx is landscape", doc.sections[0].page_width > doc.sections[0].page_height)

chk(f"markdown twin exists: {VAULT.name}", VAULT.exists(),
    f"{VAULT.stat().st_size // 1024} KB" if VAULT.exists() else "")
if VAULT.exists():
    v = VAULT.read_text()
    chk("markdown twin has the vault frontmatter", v.startswith("---\ntype: note\nentity: APR70"))
    chk("markdown twin is status draft", "\nstatus: draft\n" in v)
    chk("markdown twin states DRAFT ONLY", "DRAFT ONLY" in v)

print()
print(f"rows checked: {rows}   round 1: ${r1['total_usd']:.4f}   round 2: ${r2['total_usd']:.4f}   "
      f"combined: ${r1['total_usd'] + r2['total_usd']:.4f}")
print("ALL CHECKS PASS" if OK else "SOME CHECKS FAILED")
sys.exit(0 if OK else 1)
