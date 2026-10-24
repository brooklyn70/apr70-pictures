# AI-residue and voice check — APR 70 site copy pass, 2026-09-07

**DRAFT ONLY. Nothing applied to the site.**

Reader: `claude-sonnet-5`, one call per document, reading BEFORE and AFTER together against the
house humanizer checklist, the twelve-line voice test from the voice profile, and the three laws.
Repair: `claude-opus-5`, one call per flagged document, **mechanical defects only**
(`law1`, `law2`, `drift`, `length`). Taste flags (`residue`, `hedge`, `stacked`, `sameness`) were
recorded and left for Marco. The check ran **once**. It was not looped.

**6 lines flagged. 2 repaired.**

| Document | Flags | Repaired |
|---|---|---|
| Home (`v9-home:v9-home`) | 1 | 1 |
| Slate (`v9-slate:v9-slate`) | 0 | 0 |
| Craft (`v9-craft:v9-craft`) | 1 | 0 |
| Methods (`v9-methods:v9-methods`) | 2 | 1 |
| Contact (`v9-contact:v9-contact`) | 0 | 0 |
| Site chrome (`site-settings:site-settings`) | 0 | 0 |
| A Need Grows in Brooklyn (`projects:a-need-grows-in-brooklyn`) | 0 | 0 |
| L.A. Dolce Vita (`projects:la-dolce-vita`) | 1 | 0 |
| Sea Gate (`projects:sea-gate`) | 0 | 0 |
| Alpha YY (`projects:alpha-yy`) | 0 | 0 |
| Da Hook (`projects:da-hook`) | 0 | 0 |
| The Movement (`projects:the-movement`) | 0 | 0 |
| Cleopatra (`projects:cleopatra`) | 1 | 0 |
| Shadowmaster (`projects:shadowmaster`) | 0 | 0 |
| U Bruculinu (`projects:u-bruculinu`) | 0 | 0 |
| The Mayors (`projects:mayors`) | 0 | 0 |


## Home  `/`

**`sections.6.body`** · `drift` · MECHANICAL · **APPLIED**
- quote: 'until legal counsel review completes'
- why: Changing "while" to "until" alters the original meaning that the title stays private during the review, implying instead it becomes public once review ends.
- suggested fix: 'APR 70 is one writer-producer and a working slate of **ten properties**: three features drafted, a ten-episode season on the page, and more in development. Nine titles are public on the [slate](/slate), each with its own page; one travels only inside private materials while legal counsel review completes. The scripts are written by people. The machine works below the line, on frames like the ones on this site, and it is disclosed wherever it works.'
- FINAL AFTER: 'APR 70 is one writer-producer and a working slate of **ten properties**: three features drafted, a ten-episode season on the page, more in development. Nine titles are public on the [slate](/slate), each with its own page. One travels only inside private materials while legal counsel review completes. The scripts are written by people. The machine works below the line, on frames like the ones on this site, and it is disclosed wherever it works.'


## Craft  `/craft`

**`sections.1.body`** · `stacked` · TASTE · recorded, not applied
- quote: 'narratives of moral complexity, human resilience, and lasting impact'
- why: Rule-of-three stacked abstract nouns function as puffery rather than a concrete claim.
- suggested fix: 'Their insight is simple and unfashionable. Powerful storytelling comes from deliberate choices inside clear boundaries. Old Hollywood worked under hard rules about what could be shown, and it answered with subtext, atmosphere, and ingenious writing. That discipline built the pictures people still watch, still quote, and still hand to their children.\n\nThese principles guide every project we develop, from limited series to features, as we build a studio for stories of moral complexity and human resilience: heroism with open eyes, ambiguity with a conscience, in the real neighborhoods of Brooklyn, Los Angeles, and beyond.'


## Methods  `/methods`

**`sections.2.rows.6.definition`** · `law3` · MECHANICAL · **APPLIED**
- quote: 'must stand as human work'
- why: "Stand as" is copula avoidance; Mamet-direct requires "is" where "is" is meant.
- suggested fix: 'Because trust is the only asset a small studio owns outright. And because the work we sell, the writing, must be human work, plainly and provably.'
- FINAL AFTER: 'Because trust is the only asset a small studio owns outright. And because the work we sell, the writing, must be human work, plainly and provably.'

**`sections.4.body`** · `residue` · TASTE · recorded, not applied
- quote: 'our best work comes from'
- why: Self-praising adjective about APR 70's own work; the fact should carry it without the studio grading itself.
- suggested fix: 'The craft of constraint continues past the writing desk. A disclosure rule is a boundary, and boundaries sharpen the work. The machine gets the busywork below the line. The people keep the story.'


## L.A. Dolce Vita  `/work/la-dolce-vita`

**`synopsis`** · `stacked` · TASTE · recorded, not applied
- quote: 'a single web of power, legacy, and redemption'
- why: Forced rule-of-three abstraction stacked as vague symbolism rather than concrete plot fact.
- suggested fix: "A journalist arrives in Los Angeles at the worst possible moment, chasing corruption and celebrity rot. He finds his long-lost love at the center of his own investigation, and their secret daughter caught between him and a dynasty that wants her for its throne. One live-stream scandal detonates fifteen years of buried history: a vanished fiancee, a hidden heir, and a crime family's succession plot. Neo-noir on 35mm, scored for opera, played for keeps."


## Cleopatra  `/work/cleopatra`

**`synopsis`** · `residue` · TASTE · recorded, not applied
- quote: 'remake not just her life but the shape of existence'
- why: This is a negative-parallelism construction ("not just X but Y") flagged as AI residue.
- suggested fix: "Cleo Modica is a thirty-five-year-old overworked social worker and single mother. Sicilian-American, raised in Brooklyn, marooned in L.A. Then a glitch in reality sends her consciousness sliding into her parallel self somewhere new each time she sleeps, memories intact, language and family rewritten. She wakes in Sicily as her brother's girlfriend, in Poland as a woman a reclusive ex-con recognizes, in Tokyo as the wife of a kinder version of her ex, mastering the jump as she goes. Beneath the family drama runs a conspiracy threatening to collapse the walls between realities, and an impossible choice that will remake her life and the shape of existence."

