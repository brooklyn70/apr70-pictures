#!/usr/bin/env python3
"""Round 2, step 1: write v2/notes-ledger.md from v2_notes.NOTES."""
import json, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import lib, v2_notes

lib.use_round2()
OUT2 = lib.OUT2
OUT2.mkdir(parents=True, exist_ok=True)

CHAIRS = {"welles": "Welles", "sturges": "Sturges", "riskin": "Riskin", "capra": "Capra"}
c = v2_notes.COUNTS

L = [f"""# Notes ledger — round 2, APR 70 site copy pass, 2026-09-07

**DRAFT ONLY. Nothing applied to the site.**

Every actionable note the four chairs filed on the first draft, one row each. Marco read all four
notes, said they are all good and that each chair speaks to different things, and ruled: re-draft
once more on their feedback. So the default here is **APPLY**.

A note is declined only when it breaks a house law, costs a fact that is on the page today, breaks
a field's fixed length slot, or when two chairs contradict each other. Where chairs contradict, the
row names the chair followed and why. **RULING** rows are not copy edits: they are the questions
the chairs put to Marco directly, and they are carried to him unanswered.

| Decision | Count |
|---|---|
| APPLY | {c['APPLY']} |
| APPLY IN PART | {c['PARTLY']} |
| DECLINE | {c['DECLINE']} |
| Carried to Marco as a ruling | {c['RULING']} |
| **Total actionable notes** | **{sum(c.values())}** |

Four chairs flagged one line in common: **"2026 and 2027 belong to the studios that meet people
where they already are, carrying work worth their attention."** (Home, `sections.7.body`). Welles
called it a coronation he could not defend and said to make it a wager if a forward line is needed.
Sturges said it predicts the market without evidence. Riskin said a year does not belong to you.
Capra asked who says, and who decides. It is rows W1, S6, R3 and C4 below. v2 keeps the two years,
because they are facts on the page, and turns the claim into the wager Welles asked for:
**"Our wager for 2026 and 2027: meet people where they already are. The pages go out one reader at
a time."**

Welles's objection to the Craft lede ("working wisdom" is a hedge the founder would never speak
aloud, and v1 made it worse than the live text) is row W3. Applied.

## The ledger

| # | Chair | Document | Field | The line, or the field | What the chair asked for | Decision | Reason |
|---|---|---|---|---|---|---|---|"""]

for nid, chair, doc, path, quote, ask, dec, why in v2_notes.NOTES:
    label = {"APPLY": "APPLY", "PARTLY": "APPLY IN PART",
             "DECLINE": "DECLINE", "RULING": "RULING (to Marco)"}[dec]
    row = [nid, CHAIRS[chair], f"`{doc}`", f"`{path}`", quote, ask, f"**{label}**", why]
    L.append("| " + " | ".join(x.replace("|", "\\|").replace("\n", " ") for x in row) + " |")

L.append("""
## The rulings the chairs put to Marco

These are not line edits. Each chair closed round 1 with one question, and three of them are the
same question asked from three chairs.
""")
for nid, chair, doc, path, quote, ask, dec, why in v2_notes.NOTES:
    if dec != "RULING":
        continue
    L.append(f"**{nid} · {CHAIRS[chair]} · `{doc}` `{path}`**\n")
    L.append(f"- He quoted: {quote}")
    L.append(f"- He asked: {ask}")
    L.append(f"- Why it is not a copy edit: {why}\n")

L.append("""## What the room said across every page

The cross-cutting lessons extracted from the four notes. These were the system prompt for the
round-2 rewrite, alongside the voice profile and the three laws.

```
""" + v2_notes.CROSS_CUTTING + "```\n")

(OUT2 / "notes-ledger.md").write_text("\n".join(L) + "\n", encoding="utf-8")
print(f"wrote v2/notes-ledger.md  ({sum(c.values())} notes: "
      f"{c['APPLY']} apply, {c['PARTLY']} partly, {c['DECLINE']} decline, {c['RULING']} rulings)")
