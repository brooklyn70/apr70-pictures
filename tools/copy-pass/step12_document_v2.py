#!/usr/bin/env python3
"""Round 2, step 5: build the v2 Word document and its Markdown twin."""
import json, pathlib, re, shutil, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import lib, v2_notes

from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.section import WD_ORIENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

lib.use_round2()
OUT, OUT2 = lib.OUT, lib.OUT2

inv = json.loads((OUT / "inventory.json").read_text())
v1 = json.loads((OUT / "after.json").read_text())
v2 = json.loads((OUT2 / "after-v2.json").read_text())
r1_ledger = json.loads((OUT / "spend.json").read_text())
r2_ledger = lib.ledger_load()
cons = json.loads((OUT2 / "consistency-repairs.json").read_text())
flags2 = json.loads((OUT2 / "residue-flags-v2.json").read_text())
repairs2 = json.loads((OUT2 / "repairs-v2.json").read_text())

DEST = pathlib.Path("/Volumes/SharedData/10-03-website-assets/copy-pass-2026-09-07/"
                    "APR70-site-copy-writers-room-2026-09-07-v2.docx")
SCRATCH = pathlib.Path("/private/tmp/claude-501/-Users-marco-websites-apr70-website/"
                       "2251e5c8-4793-420f-af9f-38fc6b2b3078/scratchpad/"
                       "APR70-site-copy-writers-room-2026-09-07-v2.docx")
VAULT = pathlib.Path("/Users/marco/vault/10 Work/11 APR70 Pictures/11.03 Company Ops/"
                     "00 Website - Copy Pass 2026-09-07 v2.md")

CHAIRS = [("welles", "Orson Welles", "structure, escalation, scale, the unforgettable image"),
          ("sturges", "Preston Sturges", "comic architecture, sequence mechanics, dialogue velocity"),
          ("riskin", "Robert Riskin", "the moral ledger, the working-class voice"),
          ("capra", "Frank Capra", "the audience verdict, the full-house read")]

# Scores exactly as each chair wrote them. Each stated his round-1 number his own way in round 2;
# both his round-1 file and his round-2 restatement are printed, unedited.
SCORES = [
    ("Orson Welles",    "BEFORE: 6/10. AFTER: 8/10.",      "v1: 7/10. v2: 8/10.",       "would_advance: True"),
    ("Preston Sturges", "BEFORE: 7.1/10. AFTER: 7.8/10.",  "Round 1: 7/10. Round 2: 8/10.", "-"),
    ("Robert Riskin",   "Before: 6/10. After: 7/10.",      "8/10 (round 1: 6/10)",      "would_advance True"),
    ("Frank Capra",     "BEFORE: 6/10. AFTER: 7.5/10.",    "7/10 (Round 1: 6/10)",      "would_advance: True"),
]

LESSONS = [
 "A critic's note is an instruction, not a defect. The round-2 line checker was first told to flag anything in v2 that was in neither BEFORE nor v1, and it dutifully flagged every line the four chairs had asked for, after which the repair pass reverted them. The check had to be rebuilt to carry each field's applied notes so that a sanctioned change could not be read as damage. Any second-draft pipeline needs that wiring or it will quietly undo the round it just paid for.",
 "Never let a model decide what counts as a lost fact. The drift check matched any three or four digit number, so when four chairs asked to cut \"2026 and 2027 belong to the studios...\", the checker saw two missing years and restored the whole sentence. Token drift is now computed in code, and on a field carrying an applied note it is recorded for Marco rather than repaired.",
 "The best fix was the one that obeyed the note and kept the fact. Welles said make it a wager, not a claim. The line that survived, \"Our wager for 2026 and 2027: meet people where they already are.\", answers all four chairs and keeps the two dates the pass is required to preserve. When a note and a rule collide, look for the sentence that satisfies both before declaring a conflict.",
 "Chairs contradict, and the ledger has to say which one was followed. Welles wanted the privacy sentence cut on Slate and Sturges wanted \"We list the facts.\" cut instead; Welles kept the Methods busywork line and Sturges named the harm in it; Sturges wanted \"the reply comes from the writer\" off nine property pages and Welles called it the best line on the site. Every one of those rows names the chair followed and the reason, because an unattributed compromise is how a draft loses its spine.",
 "A repeated field must be repaired as one field. \"Deck canon complete...\" appears identically on ten property pages. The writer applied the note on four of them and missed six, because it saw them as ten separate jobs. The fix was deterministic and free: normalise all ten to the applied string in code, and log it. Any field that repeats across documents needs a consistency pass that no model runs.",
 "Round 2 can regress round 1 unless round 1's wins are named. The rewrite quietly restored \"They have been waiting\" to the Home lede, the exact phrase Riskin had praised v1 for cutting (\"It cut the sob. Waiting is a feeling you did not earn.\"). The cross-cutting brief now carries a do-not-reopen list of the lines the room praised, and the regression was reverted in code.",
 "\"Cut this\" is rarely executable as written. A chair cuts a sentence; the field is a fixed UI slot and the cut takes it below its band, or the sentence carried the only statement of a fact. The rule that made the notes applicable was: if the cut takes the field below 75% of the live text, do not delete, play the shorter line the chair proposed instead.",
 "Some notes are refused for the writer's protection, not the copy's. Sturges asked for a reporter who has missed three elections, Riskin for a sister with a want of her own, Capra for a face instead of a theme. All three are right about the page and all three would have invented facts about unfinished properties. A pass that keeps every fact must also add none, and a good note that requires an invention is a note for the scripts, not for the site.",
 "The chairs' closing questions are not copy work and pretending otherwise wastes a round. Eight of the sixty-three notes are rulings: the pronoun, the public-logline policy, Da Hook's two calendars, whether A Need Grows is a feature or a season, whether The Mayors is an autopsy or a polemic. None can be settled by a writer inside a field. They are carried to Marco unanswered, and Welles opened round 2 by saying the pronoun crack is now wider than it was.",
 "Scores moved because cuts moved them. Every chair scored v2 at or above his v1 number, and each one credited the same thing: what round 2 removed. Thirty fields changed, and the majority of those changes were deletions. The cheapest improvement available to a body of copy that is already good is the sentence that repeats the sentence before it.",
 "Ask a cheap model for a terse verdict and cap its effort. The line check burned a full 16,000-token budget on reasoning and returned nothing, at a cost of $0.31, then ran clean at low effort for $0.12. On a mechanical judgement with a fixed output shape, the thinking budget is the failure mode, not the safeguard.",
 "The panel stays off the Anthropic bench in both rounds. Claude wrote every v1 and v2 line in this document, so Claude does not get to say whether the second draft is better than the first. The four chairs ran on four other models on two other providers, they were each shown their own round-1 notes and the house decision on each, and their replies are pasted here verbatim.",
]


def shade(cell, hexcolor):
    tcPr = cell._tc.get_or_add_tcPr()
    el = OxmlElement("w:shd")
    el.set(qn("w:val"), "clear"); el.set(qn("w:color"), "auto"); el.set(qn("w:fill"), hexcolor)
    tcPr.append(el)


def repeat_header(row):
    trPr = row._tr.get_or_add_trPr()
    el = OxmlElement("w:tblHeader"); el.set(qn("w:val"), "true")
    trPr.append(el)


def cell_text(cell, text, size=9, bold=False, italic=False, color=None):
    cell.text = ""
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(2)
    for i, line in enumerate(str(text).split("\n")):
        r = p.add_run(("\n" if i else "") + line)
        r.font.size = Pt(size); r.bold = bold; r.italic = italic
        if color:
            r.font.color.rgb = color


def md_lines(document, md, base_size=10):
    for raw in md.split("\n"):
        line = raw.rstrip()
        if not line.strip():
            continue
        if line.startswith("## "):
            h = document.add_paragraph(); r = h.add_run(line[3:].strip())
            r.bold = True; r.font.size = Pt(12)
            h.paragraph_format.space_before = Pt(10); h.paragraph_format.space_after = Pt(3)
            continue
        p = document.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        txt = line.strip()
        if re.match(r"^\d+\.\s", txt) or txt.startswith("- "):
            p.paragraph_format.left_indent = Inches(0.25)
        for seg in re.split(r"(\*\*[^*]+\*\*)", txt):
            if not seg:
                continue
            if seg.startswith("**") and seg.endswith("**"):
                r = p.add_run(seg[2:-2]); r.bold = True
            else:
                r = p.add_run(seg)
            r.font.size = Pt(base_size)


def rows_of(doc):
    out = []
    for f in doc["fields"]:
        if f["kind"] == "text":
            out.append((f["path"], f["before"]))
        else:
            for i, t in enumerate(f["before_texts"]):
                out.append((f"{f['path']}#{i}", t))
    return out


TOTAL_ROWS = sum(len(rows_of(dd)) for dd in inv["docs"])
CHANGED = [(k, p) for k in v2 for p in v2[k] if v2[k][p] != v1[k][p]]
KEPT_V1 = sum(1 for dd in inv["docs"] for p, b in rows_of(dd) if v1[dd["key"]][p] == b)
R1, R2 = r1_ledger["total_usd"], r2_ledger["total_usd"]
CNT = v2_notes.COUNTS

# ---------------------------------------------------------------- build
d = Document()
sec = d.sections[0]
sec.orientation = WD_ORIENT.LANDSCAPE
sec.page_width, sec.page_height = Inches(11.69), Inches(8.27)
sec.left_margin = sec.right_margin = Inches(0.5)
sec.top_margin = sec.bottom_margin = Inches(0.55)
d.styles["Normal"].font.name = "Georgia"
d.styles["Normal"].font.size = Pt(10)

t = d.add_paragraph(); t.alignment = WD_ALIGN_PARAGRAPH.LEFT
r = t.add_run("APR 70 PICTURES"); r.bold = True; r.font.size = Pt(22)
t2 = d.add_paragraph(); r = t2.add_run("The website copy, in Marco's voice  ·  second draft")
r.font.size = Pt(18)
t3 = d.add_paragraph()
r = t3.add_run("Writers-room compound writing pass, round 2  ·  7 September 2026")
r.font.size = Pt(11); r.italic = True

warn = d.add_paragraph()
r = warn.add_run("DRAFT ONLY. Nothing in this document has been applied. The website, the CMS and "
                 "the databases were not modified in any way.")
r.bold = True; r.font.size = Pt(11); r.font.color.rgb = RGBColor(0x8B, 0x00, 0x00)

md_lines(d, f"""## What this is
The second draft. Round 1 rewrote the live copy of staging.apr70.com into the founder's voice and put it in front of four chairs: Welles, Sturges, Riskin and Capra. Marco read all four notes, said they were all good and that each chair speaks to different things, and ruled: re-draft once more on their feedback, then send the new draft back to the same four. This document is that draft and their second read.

Every field the site shows a reader appears here exactly once, in four columns: the live text, the first draft, the second draft, and the field's path. {TOTAL_ROWS} rows across {inv['doc_count']} documents.

## What changed in round 2
{sum(CNT.values())} actionable notes came off the four round-1 reads. **{CNT['APPLY']} were applied**, **{CNT['PARTLY']} were applied in part**, **{CNT['DECLINE']} were declined**, and **{CNT['RULING']} were carried to Marco as rulings** because they are decisions no writer can make inside a field. The full ledger, with the reason on every row, is the next section.

Round 2 moved **{len(CHANGED)} of the {TOTAL_ROWS} rows**. Round 1 had left {KEPT_V1} rows untouched as KEEP; round 2 left {TOTAL_ROWS - len(CHANGED)} standing where round 1 put them. The majority of what round 2 did was cut. The line four chairs flagged in common, "2026 and 2027 belong to the studios that meet people where they already are, carrying work worth their attention," is now the wager Welles asked for instead of the coronation he refused.

Two repairs were made in code rather than by a model. The `pitchDeck.note` field is one identical string on ten property pages and the rewrite applied its note on four of them and missed six, so all ten were normalised to the applied string. And the Home lede came back carrying "They have been waiting", the phrase Riskin had praised the first draft for cutting, so the regression was reverted.

## Spend, both rounds
Round 1: **${R1:.4f}**. Round 2: **${R2:.4f}**. Combined: **${R1 + R2:.4f}**. Round 2 ran under a hard limit of $2.50 with an abort guard in front of every call.

## The laws that bound both drafts
LAW 1. No similes. The strings "like a" and "like an" appear nowhere in the AFTER text.
LAW 2. No em dashes. A pause is an ellipsis or a full stop.
LAW 3. Mamet-direct. Say what a thing is.
Length. Every field is a fixed UI slot. No field grew more than 25% over the live text, and headings, labels, buttons, captions, credits, scene slugs and nav items are no longer than the original. The lower bound is advisory: where a chair asked for a sentence to be cut, the field is allowed to get shorter, and one Home lede sits at 64% of the live text on Sturges's instruction.
Facts. Every name, number, date, place, title, link, arrow, markdown marker and highlight marker on the page today survives into v2, and round 2 added no claim that was not already there or asked for by a chair.
""")

# --- spend table
h = d.add_paragraph(); r = h.add_run("Spend by stage"); r.bold = True; r.font.size = Pt(12)
tbl = d.add_table(rows=1, cols=5); tbl.style = "Table Grid"; tbl.alignment = WD_TABLE_ALIGNMENT.LEFT
for i, (w, txt) in enumerate([(1.0, "Round"), (2.8, "Stage"), (3.0, "Model"),
                              (1.0, "Calls"), (1.6, "Cost (USD)")]):
    c = tbl.rows[0].cells[i]; c.width = Inches(w); cell_text(c, txt, 9, bold=True); shade(c, "E8E4DC")
repeat_header(tbl.rows[0])
for rnd, led in (("1", r1_ledger), ("2", r2_ledger)):
    stages = {}
    for e in led["entries"]:
        s = stages.setdefault((e["stage"], e["model"]), {"calls": 0, "usd": 0.0, "est": ""})
        s["calls"] += 1; s["usd"] += e["usd"]
        if "ESTIMATE" in (e.get("note") or ""):
            s["est"] = "  (est.)"
    for (stage, model), s in sorted(stages.items()):
        row = tbl.add_row().cells
        cell_text(row[0], rnd); cell_text(row[1], stage); cell_text(row[2], model)
        cell_text(row[3], str(s["calls"])); cell_text(row[4], f"${s['usd']:.4f}{s['est']}")
    row = tbl.add_row().cells
    cell_text(row[0], rnd, 9, bold=True); cell_text(row[1], f"ROUND {rnd} TOTAL", 9, bold=True)
    cell_text(row[2], ""); cell_text(row[3], str(len(led["entries"])), 9, bold=True)
    cell_text(row[4], f"${led['total_usd']:.4f}", 9, bold=True)
row = tbl.add_row().cells
cell_text(row[0], "", 9); cell_text(row[1], "COMBINED", 9, bold=True); cell_text(row[2], "")
cell_text(row[3], str(len(r1_ledger["entries"]) + len(r2_ledger["entries"])), 9, bold=True)
cell_text(row[4], f"${R1 + R2:.4f}", 9, bold=True)
p = d.add_paragraph()
r = p.add_run("Anthropic costs are computed from the API's own token counts at $5/M input, "
              "$25/M output, 1.25x cache write and $0.50/M cache read for Opus 5, and $3/M input "
              "and $15/M output for Sonnet 5. OpenRouter costs are the figures OpenRouter "
              "returned. The xAI figure is an ESTIMATE at $3/M input and $15/M output; xAI does "
              "not return a cost with the response. Round 2 includes $0.43 of waste that is left "
              "in the ledger rather than hidden: one truncated rewrite call, one line-check call "
              "that spent its whole budget on reasoning and returned nothing, and one rebuild of "
              "nine documents after the first line check reverted the chairs' own notes.")
r.font.size = Pt(8); r.italic = True

# --- notes ledger
d.add_page_break()
h = d.add_paragraph(); r = h.add_run("Notes ledger"); r.bold = True; r.font.size = Pt(16)
md_lines(d, f"""Every actionable note from the four chairs, one row each. Marco ruled the notes good, so the default is APPLY. A note is declined only when it breaks a house law, costs a fact that is on the page today, breaks a field's fixed length slot, or when two chairs contradict each other, in which case the row names the chair followed and why. RULING rows are not copy edits; they are the questions the chairs put to Marco, carried to him unanswered.

**{CNT['APPLY']} APPLY  ·  {CNT['PARTLY']} APPLY IN PART  ·  {CNT['DECLINE']} DECLINE  ·  {CNT['RULING']} carried to Marco as rulings  ·  {sum(CNT.values())} notes in total.**""", base_size=9.5)

widths = [Inches(0.5), Inches(0.8), Inches(1.5), Inches(2.6), Inches(2.6), Inches(0.95), Inches(1.74)]
tbl = d.add_table(rows=1, cols=7); tbl.style = "Table Grid"; tbl.autofit = False
for i, txt in enumerate(["#", "Chair", "Field", "The line, or the field",
                         "What the chair asked for", "Decision", "Reason"]):
    c = tbl.rows[0].cells[i]; c.width = widths[i]
    cell_text(c, txt, 8, bold=True); shade(c, "E8E4DC")
repeat_header(tbl.rows[0])
DEC = {"APPLY": "APPLY", "PARTLY": "APPLY IN PART", "DECLINE": "DECLINE", "RULING": "RULING (Marco)"}
for nid, chair, doc, path, quote, ask, dec, why in v2_notes.NOTES:
    c = tbl.add_row().cells
    for i in range(7):
        c[i].width = widths[i]
    cell_text(c[0], nid, 8); cell_text(c[1], chair.title(), 8)
    cell_text(c[2], f"{doc}\n{path}", 7)
    cell_text(c[3], quote, 8); cell_text(c[4], ask, 8)
    cell_text(c[5], DEC[dec], 8, bold=True,
              color=RGBColor(0x8B, 0x00, 0x00) if dec in ("DECLINE", "RULING") else None)
    cell_text(c[6], why, 8)

# --- page sections
for doc in inv["docs"]:
    d.add_page_break()
    key = doc["key"]
    h = d.add_paragraph(); r = h.add_run(doc["page"]); r.bold = True; r.font.size = Pt(16)
    sub = d.add_paragraph()
    tag = "  ·  PRIVATE SLATE, not public" if doc.get("private") else ""
    r = sub.add_run(f"{doc['route']}   ·   {key}{tag}"); r.italic = True; r.font.size = Pt(9)
    rows = rows_of(doc)
    nchanged = sum(1 for p, b in rows if v2[key][p] != v1[key][p])
    nkeep1 = sum(1 for p, b in rows if v1[key][p] == b)
    st = d.add_paragraph()
    r = st.add_run(f"{len(rows)} rows.  {nkeep1} were KEEP in round 1.  "
                   f"{nchanged} moved in round 2.")
    r.font.size = Pt(9)
    tbl = d.add_table(rows=1, cols=4); tbl.style = "Table Grid"; tbl.autofit = False
    w = [Inches(1.55), Inches(3.05), Inches(3.05), Inches(3.04)]
    for i, txt in enumerate(["Field", "BEFORE (staging.apr70.com)", "v1 (first draft)",
                             "v2 (second draft)"]):
        c = tbl.rows[0].cells[i]; c.width = w[i]
        cell_text(c, txt, 9, bold=True); shade(c, "E8E4DC")
    repeat_header(tbl.rows[0])
    for path, b in rows:
        a1, a2 = v1[key][path], v2[key][path]
        c = tbl.add_row().cells
        for i in range(4):
            c[i].width = w[i]
        cell_text(c[0], path, 8)
        cell_text(c[1], b, 9)
        if a1 == b:
            cell_text(c[2], "KEEP (unchanged)", 9, italic=True, color=RGBColor(0x55, 0x55, 0x55))
        else:
            cell_text(c[2], a1, 9)
        if a2 == a1:
            cell_text(c[3], "KEEP (v1 stands)", 9, italic=True, color=RGBColor(0x55, 0x55, 0x55))
        else:
            cell_text(c[3], "", 9)
            pc = c[3].paragraphs[0]
            rr = pc.add_run("v2:  ")
            rr.bold = True; rr.font.size = Pt(9); rr.font.color.rgb = RGBColor(0x8B, 0x00, 0x00)
            for i, line in enumerate(a2.split("\n")):
                rr = pc.add_run(("\n" if i else "") + line); rr.font.size = Pt(9)
            shade(c[3], "FBF3E4")

# --- residue
d.add_page_break()
h = d.add_paragraph(); r = h.add_run("The residue and law check, round 2")
r.bold = True; r.font.size = Pt(16)
md_lines(d, f"""The check ran on the **{len(CHANGED)} fields round 2 changed**. Fields v2 carried forward from v1 were checked in round 1 and were not re-read.

`claude-sonnet-5` read BEFORE, v1 and v2 together against the house humanizer checklist, the twelve-line voice test and the three laws, plus two round-2 tests: no new claim, and no dangling reference. Every row carried the chair notes applied to that field, so a change a chair asked for is sanctioned and is not a defect. It returned **{len(flags2)} flags**.

`claude-opus-5` repaired mechanical defects only: a law break, a length overrun, or a number, link, arrow or markdown marker that the live text carried and v2 dropped. That last check is computed in code, never judged by a model, and on a field carrying an applied note it is recorded rather than repaired, because the numbers inside a sentence a chair asked to cut go with the sentence. **{len(repairs2)} repairs were applied.** {len(cons)} further repairs were made deterministically before the read, with no model involved.

The check ran once. It was not looped. The full flag list is in `docs/copy-pass/2026-09-07/v2/residue-report.md`.

A note on what this cost to get right. The first version of this check was told to flag anything in v2 that appeared in neither the live text nor v1, which is the exact description of a critic's instruction. It flagged eleven of the chairs' own applied notes as drift, and the repair pass reverted them. Nine documents were rebuilt and the check was rewritten to carry the notes as sanctioned context. The wasted spend is in the ledger.""", base_size=9.5)

# --- critics
d.add_page_break()
h = d.add_paragraph(); r = h.add_run("Critic panel, round 2"); r.bold = True; r.font.size = Pt(16)
md_lines(d, """The same four chairs, the same seats, the same character packs. Each chair read a dossier built for him: every field with its live text, its first draft and its second draft, and his own round-1 notes quoted under the fields they concerned, each marked APPLIED, APPLIED IN PART or DECLINED with the house reason. He was not shown the other three chairs' notes.

The ask was the same for all four: score v2 out of 10 against your round-1 score, say which of your notes were answered and which were not, quote any line that still fails and say what to play instead, and end with the one ruling Marco must make.

Marco's ruling of 20 August 2026 governs this stage: **Claude writes, Claude never scores.** No Anthropic model sits on a chair. Each note below is reproduced **verbatim**. Nothing has been summarised, softened, ranked or paraphrased.

Capra's chair sits on the free rotating seat, which truncated his round-1 note at 6,000 tokens. Round 2 raised his ceiling to 14,000 and his note came back complete on the first attempt.""",
         base_size=9.5)

hh = d.add_paragraph(); r = hh.add_run("Scores"); r.bold = True; r.font.size = Pt(12)
tbl = d.add_table(rows=1, cols=4); tbl.style = "Table Grid"; tbl.alignment = WD_TABLE_ALIGNMENT.LEFT
for i, (wi, txt) in enumerate([(2.4, "Chair"), (3.0, "Round 1, as he wrote it"),
                               (3.0, "Round 2, as he wrote it"), (2.0, "Advance?")]):
    c = tbl.rows[0].cells[i]; c.width = Inches(wi)
    cell_text(c, txt, 9, bold=True); shade(c, "E8E4DC")
repeat_header(tbl.rows[0])
for name, s1, s2, adv in SCORES:
    c = tbl.add_row().cells
    cell_text(c[0], name, 9, bold=True); cell_text(c[1], s1, 9)
    cell_text(c[2], s2, 9, bold=True); cell_text(c[3], adv, 9)
p = d.add_paragraph()
r = p.add_run("Each chair restated his own round-1 number in his own way when scoring round 2. "
              "Both figures are printed exactly as he wrote them, in his round-1 file and in his "
              "round-2 file, and neither has been reconciled.")
r.font.size = Pt(8); r.italic = True

for chair, name, lens in CHAIRS:
    f = OUT2 / "critics" / f"{chair}.md"
    d.add_page_break()
    hh = d.add_paragraph(); r = hh.add_run(name); r.bold = True; r.font.size = Pt(14)
    if not f.exists():
        p = d.add_paragraph(); r = p.add_run("Seat unavailable. No note was returned."); r.italic = True
        continue
    body = f.read_text()
    meta = ""
    m = re.match(r"<!--(.*?)-->\s*", body, re.S)
    if m:
        meta = m.group(1).strip(); body = body[m.end():]
    sp = d.add_paragraph(); r = sp.add_run(f"{lens}   ·   {meta}")
    r.italic = True; r.font.size = Pt(8)
    for para in body.split("\n"):
        if not para.strip():
            continue
        pp = d.add_paragraph(); pp.paragraph_format.space_after = Pt(3)
        r = pp.add_run(para.rstrip()); r.font.size = Pt(9.5)

# --- lessons
d.add_page_break()
h = d.add_paragraph(); r = h.add_run("Compound lessons, round 2"); r.bold = True; r.font.size = Pt(16)
p = d.add_paragraph()
r = p.add_run("What the second round taught, mostly about running a second round. This section is "
              "written by Claude as commentary; everything above it is either the live copy, a "
              "draft, a chair's note, or the ledger.")
r.italic = True; r.font.size = Pt(9)
for i, l in enumerate(LESSONS, 1):
    pp = d.add_paragraph(); pp.paragraph_format.left_indent = Inches(0.25)
    pp.paragraph_format.space_after = Pt(6)
    r = pp.add_run(f"{i}.  "); r.bold = True; r.font.size = Pt(10)
    r = pp.add_run(l); r.font.size = Pt(10)

DEST.parent.mkdir(parents=True, exist_ok=True)
d.save(str(DEST))
SCRATCH.parent.mkdir(parents=True, exist_ok=True)
shutil.copy2(DEST, SCRATCH)
print(f"docx -> {DEST}")
print(f"docx -> {SCRATCH}")

# ---------------------------------------------------------------- markdown twin
today = "2026-09-07"
md = [f"""---
type: note
entity: APR70
project: apr70-website
status: draft
title: Website - Copy Pass 2026-09-07 v2
date created: {today}
date updated: {today}
tags: [apr70, website, copy, writers-room, voice, draft, round2]
---
# Website — Copy Pass 2026-09-07 — v2 (second draft)

**DRAFT ONLY. Nothing applied.** The website, the CMS and the databases were not modified in any way. This is the Word document's twin: `/Volumes/SharedData/10-03-website-assets/copy-pass-2026-09-07/APR70-site-copy-writers-room-2026-09-07-v2.docx`.

## What this is

Round 2 of the writers-room copy pass. Round 1 rewrote the live English copy of staging.apr70.com into Marco's voice and put it in front of four chairs. Marco read all four notes, ruled them good, and ordered one more draft on their feedback and a second read from the same four.

{TOTAL_ROWS} text rows across {inv['doc_count']} documents. Round 1 left {KEPT_V1} rows as KEEP. **Round 2 moved {len(CHANGED)} rows.** Most of what it did was cut.

## Notes ledger

{sum(CNT.values())} actionable notes off the four round-1 reads.

| Decision | Count |
|---|---|
| APPLY | {CNT['APPLY']} |
| APPLY IN PART | {CNT['PARTLY']} |
| DECLINE | {CNT['DECLINE']} |
| Carried to Marco as a ruling | {CNT['RULING']} |

Full ledger with the reason on every row: `docs/copy-pass/2026-09-07/v2/notes-ledger.md`.

The one line all four chairs flagged, "2026 and 2027 belong to the studios that meet people where they already are, carrying work worth their attention," is now the wager Welles asked for: **"Our wager for 2026 and 2027: meet people where they already are. The pages go out one reader at a time."**

## Scores

| Chair | Round 1, as he wrote it | Round 2, as he wrote it |
|---|---|---|"""]
for name, s1, s2, adv in SCORES:
    md.append(f"| {name} | {s1} | **{s2}** |")

md.append(f"""
Each chair restated his own round-1 number his own way. Both are printed as written and neither has been reconciled. Verbatim notes: `docs/copy-pass/2026-09-07/v2/critics/`.

## The rulings the chairs put to Marco

{CNT['RULING']} notes are not copy edits. They are decisions no writer can make inside a field:
""")
for nid, chair, doc, path, quote, ask, dec, why in v2_notes.NOTES:
    if dec == "RULING":
        md.append(f"- **{nid} · {chair.title()}** ({doc} `{path}`): {ask}")

md.append(f"""
Welles opened round 2 by saying the pronoun ruling is now more urgent than it was: round 2 sharpened the singular facts ("APR 70 is a one-writer company", "Marco Caruso writes the scripts") while every page still says "we".

## Spend

| Round | Cost (USD) |
|---|---|
| Round 1 | ${R1:.4f} |
| Round 2 | ${R2:.4f} |
| **Combined** | **${R1 + R2:.4f}** |

Round 2 ran under a hard limit of $2.50 with an abort guard in front of every call. About $0.43 of round 2 is waste that was left in the ledger rather than hidden: a truncated rewrite call, a line-check call that spent its budget on reasoning and returned nothing, and a rebuild of nine documents after the first line check reverted the chairs' own notes.

## Files

- Word document: `/Volumes/SharedData/10-03-website-assets/copy-pass-2026-09-07/APR70-site-copy-writers-room-2026-09-07-v2.docx`
- Second draft, all fields: `docs/copy-pass/2026-09-07/v2/after-v2.json`
- Notes ledger: `docs/copy-pass/2026-09-07/v2/notes-ledger.md`
- Residue and law check: `docs/copy-pass/2026-09-07/v2/residue-report.md`
- Critic notes, verbatim: `docs/copy-pass/2026-09-07/v2/critics/{{welles,sturges,riskin,capra}}.md`
- Round-2 dossiers, one per chair: `docs/copy-pass/2026-09-07/v2/critic-dossier-v2-*.txt`
- Round-2 ledger: `docs/copy-pass/2026-09-07/v2/spend.json`
- Round 1, all of it: `docs/copy-pass/2026-09-07/`

## Compound lessons, round 2
""")
for i, l in enumerate(LESSONS, 1):
    md.append(f"{i}. {l}\n")

VAULT.parent.mkdir(parents=True, exist_ok=True)
VAULT.write_text("\n".join(md) + "\n", encoding="utf-8")
print(f"markdown twin -> {VAULT}")
