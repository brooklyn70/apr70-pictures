# AI-residue and voice check, round 2 — APR 70 site copy pass, 2026-09-07

**DRAFT ONLY. Nothing applied to the site.**

Scope: the **30 fields round 2 changed**. Fields v2 carried forward from v1 unchanged
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

1 applied before the read.

- **`v9-home:v9-home` · `sections.2.lede`** · `drift` · v2 restored BEFORE's "They have been waiting". Riskin named the v1 cut of that phrase as a win: "It cut the sob. Waiting is a feeling you did not earn." S1's cut is kept, the regression is not.
  - from: 'They have been waiting for stories told with craft: written by hand, finished on the page, and worth handing to the next generation.'
  - to:   'They want stories told with craft: written by hand, finished on the page, and worth handing to the next generation.'

## Model read

**1 lines flagged. 0 mechanical, 1 matters of taste. 0 repaired.**

**`v9-home:v9-home` · `sections.7.body`** · `drift` · TASTE · recorded, not applied
- quote: '2026, 2027'
- why: BEFORE carries ['2026', '2027']; v2 does not.
- suggested fix: ''

