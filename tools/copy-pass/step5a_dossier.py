#!/usr/bin/env python3
"""Build the clean plain-text critic dossier: profile summary, constraint creed, then
every page with Field | BEFORE | AFTER (KEEP rows shown as KEEP)."""
import json, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import lib

inv = json.loads((lib.OUT / "inventory.json").read_text())
after = json.loads((lib.OUT / "after.json").read_text())
voice = (lib.OUT / "voice-profile-marco.md").read_text()

def section(md, h):
    if h not in md:
        return ""
    body = md.split(h, 1)[1]
    return body.split("\n## ", 1)[0].strip()

CREED = """THE CONSTRAINT CREED (APR 70's own front page, and the mandate that binds this panel)

"The greatest art is born inside clear boundaries. Old Hollywood had rules about what could be
shown (a result of boundaries set by the Hays Code), so they leaned on subtext, atmosphere, and
ingenious writing... We strip away the easy shocks, gratuitous violence, cheap profanity, empty
provocation, and force the story to do the heavy lifting."

The goal is work that resonates across generations: watchable by Marco's children, by their
children, by any child who would otherwise be turned off by a needless R. Adult SUBJECT MATTER is
allowed; what is constrained is the EXECUTION. Touchstones: Rocky (1976) and 8 1/2 (1963).
When you flag a hot moment, the fix is never "cut this," always "play it this way."
"""

LAWS = """THE HOUSE LAWS THAT BOUND THE AFTER TEXT
LAW 1 - no "like a" / "like an" similes.
LAW 2 - no em dashes. A pause is an ellipsis or a full stop. (Marco's own emails use the em dash
        as their main pivot; the law overrides that on public copy.)
LAW 3 - Mamet-direct: say what a thing is.
Length rule: every AFTER field stays within plus or minus 25% of its BEFORE. Headings, labels and
buttons stay as short as the original. These are fixed UI slots, not free prose.
Rule of the pass: fields that already read as the founder's voice were returned unchanged and are
shown below as KEEP. The pass was told not to churn for the sake of activity.
"""

parts = [
    "APR 70 PICTURES - PUBLIC WEBSITE COPY - BEFORE AND AFTER",
    "Writers-room compound writing pass, 2026-09-07. Draft only. Nothing applied to the site.",
    "",
    "WHAT YOU ARE READING",
    "The complete reader-visible English copy of staging.apr70.com: five pages, the site chrome,",
    "and ten property pages (nine public, one private). Image alt text is excluded; it is not",
    "reader-visible copy. BEFORE is what is live today. AFTER is the house rewrite into the voice",
    "of the founder, Marco Caruso, a writer-producer in Long Island City who spent thirty-five",
    "years behind the camera before starting this studio.",
    "",
    "THE FOUNDER'S VOICE, IN BRIEF",
    section(voice, "## Calibration: Marco's voice on the public site"),
    "",
    "How he sounds: " + section(voice, "## How he sounds")[:1200],
    "",
    LAWS,
    "",
    CREED,
    "",
    "=" * 78,
]

kept = rew = 0
for doc in inv["docs"]:
    key = doc["key"]
    res = after[key]
    tag = "  [PRIVATE SLATE - not public]" if doc.get("private") else ""
    parts.append("")
    parts.append(f"PAGE: {doc['page']}   {doc['route']}{tag}")
    parts.append("-" * 78)
    rows = []
    for f in doc["fields"]:
        if f["kind"] == "text":
            rows.append((f["path"], f["before"], res[f["path"]]))
        else:
            for i, t in enumerate(f["before_texts"]):
                p = f"{f['path']}#{i}"
                rows.append((p, t, res[p]))
    for path, b, a in rows:
        parts.append("")
        parts.append(f"FIELD: {path}")
        parts.append(f"BEFORE: {b}")
        if a == b:
            parts.append("AFTER:  KEEP")
            kept += 1
        else:
            parts.append(f"AFTER:  {a}")
            rew += 1

parts += ["", "=" * 78, "",
          f"Rows: {kept + rew} total. {kept} KEEP (returned unchanged), {rew} rewritten."]
txt = "\n".join(parts) + "\n"
(lib.OUT / "critic-dossier.txt").write_text(txt, encoding="utf-8")
print(f"dossier bytes={len(txt)} rows={kept+rew} keep={kept} rewritten={rew}")
