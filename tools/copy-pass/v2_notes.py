#!/usr/bin/env python3
"""Round 2 notes ledger. Every actionable note from the four round-1 chairs, one row each.

Decisions: APPLY / PARTLY / DECLINE. Marco ruled the round-1 notes good, so the default is
APPLY. A note is declined only when it breaks a house law, costs a fact, breaks a field's
length slot, or when two chairs contradict each other (in which case the row names the chair
followed and why). Rows with decision RULING are not copy edits: they are the questions the
chairs put to Marco, carried into the document unanswered.

This module is the single source of truth for step8 (rewrite), the ledger markdown, and the
round-2 dossier.
"""
import json, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import lib

PROJECTS = ["projects:a-need-grows-in-brooklyn", "projects:la-dolce-vita", "projects:sea-gate",
            "projects:alpha-yy", "projects:da-hook", "projects:the-movement", "projects:cleopatra",
            "projects:shadowmaster", "projects:u-bruculinu", "projects:mayors"]

# (id, chair, doc, path, quoted line / field, what the chair asked for, decision, reason / instruction)
NOTES = [
# ---------------------------------------------------------------- WELLES
("W1", "welles", "v9-home:v9-home", "sections.7.body",
 '"2026 and 2027 belong to the studios that meet people where they already are, carrying work worth their attention."',
 'Cut the prophecy. End on the fact: "The pages go out one reader at a time." If a forward line is required, make it a wager, not a claim.',
 "APPLY",
 "Three chairs flagged this line (Welles, Sturges, Riskin, Capra: four). Cut the claim on the two calendar years and end the paragraph on the reader."),

("W2", "welles", "v9-slate:v9-slate", "sections.1.body",
 '"A slate is a promise; a script is a fact. We list the facts. The pages themselves are shared privately."',
 'Keep the epigram, cut "The pages themselves are shared privately." Privacy is stated twice more on the same page.',
 "PARTLY",
 "Welles cuts the privacy sentence, Sturges cuts \"We list the facts.\" Followed Sturges: his version keeps the epigram AND one statement of privacy, which the page needs at least once. Three sentences become two."),

("W3", "welles", "v9-craft:v9-craft", "sections.1.lede",
 '"We take our working wisdom from the storytellers who defined their art through discipline, vision, and creative restraint."',
 '"Working wisdom" is a hedge; BEFORE\'s "enduring wisdom" at least committed. Play: "We learned it from the storytellers who proved it: discipline, vision, restraint."',
 "APPLY",
 "The lede of the page that carries the creed arrives apologizing. Cut the hedge, keep the counted triad."),

("W4", "welles", "projects:a-need-grows-in-brooklyn", "synopsis",
 '"a gun slides off a dashboard and ends him"',
 '"Ends him" is tabloid on a page playing documentary realism. Play: "...a gun slides off a dashboard and fires." Let the object do the killing.',
 "APPLY",
 "Sturges independently flagged the same sentence for \"full\"/\"fully\" wearing the same tie. Both fixes land on one line."),

("W5", "welles", "projects:cleopatra", "synopsis",
 '"an impossible choice that will remake not just her life but the shape of existence."',
 'Trailer copy. End on a choice with a face: stakes you can photograph.',
 "APPLY",
 "Welles, Sturges and Riskin all flagged this exact clause. Make the stake domestic using only facts the field already carries (single mother, the parallel lives). No new character may be invented."),

("W6", "welles", "v9-methods:v9-methods", "sections.4.heading",
 '"Constraint again, just newer tools."',
 'The hedging "just" survived by being short, not by being right. Play: "Constraint again. Newer tools."',
 "APPLY",
 "A heading may only get shorter. This one does."),

("W7", "welles", "(site-wide)", "(pronoun)",
 'The copy says "Every role here is currently filled by the writer" and then speaks as "we" on every page.',
 'Decide whether the site is allowed to say "we" at all, and make the pronoun load-bearing everywhere or nowhere.',
 "RULING",
 "This is Welles's closing ruling, not a line edit. Changing every plural on the site is outside a per-field pass and outside the length slots. Carried to Marco unanswered."),

# ---------------------------------------------------------------- STURGES
("S1", "sturges", "v9-home:v9-home", "sections.2.lede",
 '"APR 70 Pictures exists to serve that audience."',
 'Cut it. The heading and the preceding sentence already said it. Ending on "worth handing to the next generation" has more feeling and less incorporation paperwork.',
 "APPLY",
 "Ends the lede on the reader instead of on the company."),

("S2", "sturges", "v9-home:v9-home", "sections.2.body",
 '"Filmmakers mastered visual storytelling and narrative economy."',
 'Cut it. "Subtext, atmosphere, and ingenious writing" already proves the point; this sentence translates the sentence before it for a jury nobody summoned.',
 "APPLY",
 "Restatement, not a fact. Cutting it costs nothing the paragraph does not already say."),

("S3", "sturges", "v9-home:v9-home", "sections.2.body",
 '"We bring that discipline back to street level, in film, television, stage, and radio, whole."',
 '"Whole" arrives after the train has left. Play: "...back to street level across film, television, stage, and radio."',
 "APPLY",
 "Cut the trailing qualifier, keep all four divisions."),

("S4", "sturges", "v9-home:v9-home", "sections.6.body",
 '"Nine titles are public on the slate, each with its own page. One travels only inside private materials while legal counsel review completes."',
 'The private-property explanation appears repeatedly. Keep it on the Slate page. Here: "Nine titles are public. One remains private."',
 "PARTLY",
 "Compressed, but the [slate](/slate) link and the legal-counsel-review fact stay: the link is navigation and the review is the reason. Sturges's exact replacement would drop both."),

("S5", "sturges", "v9-home:v9-home", "sections.6.body",
 'The section ends on disclosure procedure.',
 'That is an affidavit, not an exit. Finish on the human author: "Ten properties. One writer responsible for every page."',
 "PARTLY",
 "Applied as a button using only facts already in the field (ten properties, one writer-producer, the machine disclosed). The disclosure sentence stays; it moves off the last line."),

("S6", "sturges", "v9-home:v9-home", "sections.7.body",
 '"APR 70 is built for that world."',
 'Cut it. The paragraph is standing on the website.',
 "APPLY",
 "Self-evident claim. Cut with W1 in the same field."),

("S7", "sturges", "v9-slate:v9-slate", "sections.1.body",
 '"We list the facts."',
 'Cut it. The aphorism has already done the work: "A slate is a promise; a script is a fact. The scripts are shared privately."',
 "APPLY",
 "Followed over Welles's competing cut in the same field. See W2."),

("S8", "sturges", "v9-slate:v9-slate", "sections.5.body",
 '"under the usual courtesies"',
 'Courtesies are either named or they are incense. "Shared privately, on request" is enough.',
 "APPLY",
 "Unnamed courtesy is an unverifiable claim."),

("S9", "sturges", "v9-slate:v9-slate", "sections.5.body",
 '"Everything on this page is presented for private reading rather than public evaluation."',
 'It is on a public website. The sentence has been caught at the scene. Play: "This page states development status only. Scripts and supporting materials remain private."',
 "APPLY",
 "Removes a claim the page itself disproves, keeps the substance."),

("S10", "sturges", "v9-slate:v9-slate", "sections.5.body",
 'The status disclaimer simply expires.',
 'Turn status into action: "\'Drafted\' means the pages exist. Ask to read them."',
 "PARTLY",
 "Applied as the closing line, but \"it is a status, not a delivery representation\" stays. That clause is the disclaimer's legal point and cannot be traded for a button."),

("S11", "sturges", "(all ten properties)", "pitchDeck.note",
 '"Deck canon complete. The visual deck is shared privately. Investor conversations happen in person. Write to the offices."',
 '"Deck canon" is writers-room plumbing showing through the wallpaper. Replace the whole note: "The visual deck is available privately. Request it from the writer."',
 "PARTLY",
 "The internal term goes on all ten pages. The two access facts (in person, write to the offices) stay: they tell a reader what to actually do, and Sturges's replacement drops them."),

("S12", "sturges", "(nine properties)", "requestBody",
 '"Say who you are and in what capacity you are asking. The reply comes from the writer."',
 'Useful once in the global contact module. On property pages: "Script and synopsis are shared privately, on request."',
 "DECLINE",
 "Chairs contradict. Welles calls \"The reply comes from the writer\" the best line on the whole site and Riskin calls it earned; Sturges wants it off nine pages. Followed Welles and Riskin. Sturges's version would also cut each field roughly in half, past its slot."),

("S13", "sturges", "projects:mayors", "layout.0.body",
 '"Everything changes. Nothing remains the same. A blessing and a curse indeed."',
 'Three bells for one visitor. Keep "Twenty years is enough for New York to put on another face."',
 "APPLY",
 "Same idea rung three times in three sentences."),

("S14", "sturges", "projects:shadowmaster", "layout.0.body",
 '"That is where the show carries its weight."',
 'The sentence before it already carries the weight. Announcing the weight makes us inspect the scale.',
 "APPLY",
 "Cut the announcement, keep the flashbacks and the debts."),

("S15", "sturges", "projects:the-movement", "layout.0.body",
 '"a hard-boiled reporter and an honest D.A."',
 'Casting categories, not people. Give one a precise appetite: "A reporter who has missed three elections and refuses to miss the fourth."',
 "DECLINE",
 "The replacement invents a fact about a character (three missed elections). The pass may not add a claim that is not in the source copy."),

("S16", "sturges", "projects:shadowmaster", "layout.0.body",
 '"the Hotshot Bluffer," "the Calculating Tactician," "the Underdog Hacker"',
 'They have escaped from a development workbook. One behavior apiece would save them.',
 "PARTLY",
 "The proposed behaviors are new claims and cannot be written. Applied as far as the source allows: cut the stacked label-adjectives, keep the three roles and the human cost the field already names. See R8."),

("S17", "sturges", "projects:la-dolce-vita", "synopsis",
 'Nobody in the conspiracy gets one distinguishing human detail.',
 'Give the daughter one line of action: "The hidden daughter recognizes her father before he recognizes her."',
 "DECLINE",
 "Invents a scene the source does not contain. New claim."),

("S18", "sturges", "projects:cleopatra", "synopsis",
 '"Her brother," "a reclusive ex-con," "a kinder version of her ex" are functions.',
 'One concrete contradiction would populate the worlds: "In Tokyo, the ex remembers the apology he never made in Los Angeles."',
 "DECLINE",
 "Invents an apology that is not in the source. The intent is served instead by W5, which makes the ending stake concrete out of facts already present."),

("S19", "sturges", "projects:a-need-grows-in-brooklyn", "synopsis",
 '"The dominoes were falling from the opening frame" is a familiar obituary.',
 'Return to the fatal object: "The gun has been on the dashboard all summer."',
 "DECLINE",
 "\"All summer\" is a new fact. Welles's fix to the same sentence (the gun fires, full stop) is applied instead and answers the same objection."),

("S20", "sturges", "projects:la-dolce-vita", "synopsis",
 '"Played for keeps" is rented noir furniture.',
 'End on the family recognition inside the public scandal: "The whole world sees the scandal. Three people recognize the family."',
 "DECLINE",
 "\"Three people\" is a count the source does not support. New claim."),

("S21", "sturges", "projects:la-dolce-vita", "synopsis",
 '"Neo-noir on 35mm, scored for opera, played for keeps."',
 '"Scored for opera" means the score was composed for an opera. Play: "Neo-noir on 35mm, with an operatic score."',
 "APPLY",
 "A plain error introduced in round 1. BEFORE read \"scored like an opera\" and LAW 1 forced the change; this is the correct way to obey LAW 1."),

("S22", "sturges", "projects:shadowmaster", "synopsis",
 '"the line between player and avatar disappears" is the premise restated.',
 'Give us the instant obedience reverses: "In the final match, the avatar gives the order."',
 "DECLINE",
 "Invents the beat. New claim."),

("S23", "sturges", "projects:the-movement", "layout.0.body",
 'The paragraph already has a button: "Either way, the UGC wins." Stop there.',
 'Stop on the button. "The seven end the season..." explains the chill after we have felt it.',
 "PARTLY",
 "The button moves to the end of the paragraph, and the seven's state at season's end moves ahead of it. Deleting that clause outright would drop a fact about where the season lands."),

("S24", "sturges", "projects:sea-gate", "(hold: layout.0.body)",
 '"Mary in the Coney Island neon, Jim\'s hat too big..." is a real button.',
 'Do not improve it to death.',
 "APPLY",
 "Applied as a hold. Sea Gate's layout body is not opened in round 2. Riskin: \"Sea Gate paid. Do not touch it.\""),

("S25", "sturges", "v9-home:v9-home", "sections.6.body",
 '"APR 70 is one writer-producer and a working slate of ten properties..."',
 'A company cannot grammatically be both a man and a slate. Play: "APR 70 is a one-writer company with ten properties on its working slate."',
 "PARTLY",
 "Applied, with the **ten properties** bold marker kept where it sits. The marker is a fact of the field."),

("S26", "sturges", "v9-methods:v9-methods", "sections.4.body",
 '"The machine gets the busywork below the line. The people keep the story."',
 'Generated development frames are not merely busywork, and "below the line" describes crafts practiced by people. Play: "Machines render the development frames. People write and direct the work."',
 "PARTLY",
 "Welles kept this line and aimed only at the heading above it; Sturges names a real harm in it. Followed Sturges on the wording and Welles on the rhythm: two hard stops, no \"busywork,\" and no new claim about directing."),

("S27", "sturges", "v9-methods:v9-methods", "sections.2.rows.6.definition",
 '"the work we sell, the writing, must be human work, plainly and provably."',
 'Play: "The writing is human work, with a logged process behind it."',
 "DECLINE",
 "Chairs contradict. Riskin names this exact v1 line as one of the pass's wins (\"the old line, 'must stand as,' was a pose\"). Followed Riskin. Sturges's replacement also adds a claim the site does not make: there is no published log."),

("S28", "sturges", "site-settings:site-settings", "v9Chrome.colophon",
 '"People write the scripts."',
 'Cleaner grammar, weaker authorship. It could describe any studio on earth. Marco has a name. Play: "Marco Caruso writes the scripts."',
 "APPLY",
 "Not a new fact: the Methods page already states \"Caruso is the author of record; the drafting passes are his.\""),

("S29", "sturges", "v9-contact:v9-contact", "sections.2.body",
 'The section ends by repeating "the reply comes from the writer."',
 'Close on the size of the acceptable package: "One note. One role. One link."',
 "PARTLY",
 "The count lands as the button; the promise about who replies stays in the paragraph, because Contact is the one page that owns it (see S12)."),

("S30", "sturges", "projects:a-need-grows-in-brooklyn", "(continuity)",
 'The page calls it a feature, then describes "Episodes 1-4," "Episodes 5-8," "Episodes 9-10," and "the season."',
 'Decide whether it is a feature or a ten-episode series, then make every field obey.',
 "RULING",
 "Not a voice problem. Fixing it means changing a fact about the property, which is Marco's to rule."),

("S31", "sturges", "projects:da-hook", "(continuity)",
 'One section says fall 1970. Another says spring 1973. One invokes the Knicks\' first championship, another their second.',
 'This picture currently owns two calendars. Pick one.',
 "RULING",
 "Riskin flagged the same split. Both dates are facts; the pass keeps every fact and cannot choose between them."),

("S32", "sturges", "projects:shadowmaster", "(continuity)",
 'The meta line says "Feature first, series spawn to (310)"; the body says "Shadowmaster is a fully scripted series."',
 'Pick the lead format.',
 "RULING",
 "A format fact, not a line. Marco's to rule."),

("S33", "sturges", "projects:mayors", "layout.0.body",
 '"the American dream was still alive if you sweat and bled for it"',
 'Tenses have changed administrations mid-sentence. Play: "if you sweated and bled for it."',
 "APPLY",
 "Plain grammar fix."),

("S34", "sturges", "projects:mayors", "layout.0.body",
 '"our sidewalks, well they turn into bedrooms for our guests"',
 'A joke standing where grief and policy should stand still. Play it without the wink: "Sidewalks become shelter when housing and public systems fail."',
 "PARTLY",
 "The wink goes. Sturges's replacement names a cause (housing and public systems failing) the source never states, so the line is played straight without adding the diagnosis."),

("S35", "sturges", "projects:mayors", "layout.0.body",
 '"the prosperous, safer city of the fifties"',
 '"Safer" for whom, measured by what? Hold the page to its own forensic standard.',
 "PARTLY",
 "Applied by attribution, not deletion: the paragraph already runs on the family's first-hand accounts, so the fifties are stated as their memory rather than as the record."),

("S36", "sturges", "projects:mayors", "layout.0.body",
 '"a Ric Burns homage, but not so liberal"',
 'This gets a laugh in the room and costs authority on the page. Play: "Each era has its own archival and visual grammar."',
 "PARTLY",
 "Chairs contradict: Welles praised the line's swagger, Sturges and Riskin want it gone. Followed the two: \"but not so liberal\" is cut, the Ric Burns homage stays because it is a real statement of method."),

("S37", "sturges", "projects:mayors", "layout.0.body",
 '"This is the autopsy report."',
 'Strong button only if the series earns neutrality. Either keep the autopsy and make the body forensic, or keep the polemic.',
 "RULING",
 "The line stays. Which way the series goes is Marco's ruling, and the other Mayors edits in this round move the body toward forensic."),

("S38", "sturges", "(whole site)", "(ruling)",
 'The site cannot both sell the work and defend the company in every paragraph.',
 'Sell the work. Put the disclosure in Methods, the legal status on Slate, the access rules on Contact, and let every property page tell one story.',
 "RULING",
 "Sturges's closing ruling. The de-duplication notes applied this round (S4, S7, S11, C1) move in that direction without deciding it."),

# ---------------------------------------------------------------- RISKIN
("R1", "riskin", "v9-craft:v9-craft", "sections.4.body",
 '"The classics never go out of style. They just need storytellers brave enough to tell them."',
 'Bravery is a medal you pin on your own chest. Cut the second sentence. If you must say what it costs, say the cost.',
 "APPLY",
 "Welles marked the first sentence KEEP and Capra calls the pair a belief; only the second sentence is touched. Both chairs are served."),

("R2", "riskin", "v9-craft:v9-craft", "sections.1.body",
 '"a studio for narratives of moral complexity, human resilience, and lasting impact: heroism with open eyes, ambiguity with a conscience"',
 'A theme is not a character. I cannot miss heroism with open eyes. Let the principle be a person.',
 "PARTLY",
 "Capra filed the same objection. The abstraction stack goes and the sentence lands on the neighborhoods the field already names. Importing a face from a property page would be a new claim on this page."),

("R3", "riskin", "v9-home:v9-home", "sections.7.body",
 '"2026 and 2027 belong to the studios that meet people where they already are..."',
 'A year does not belong to you. Keep the sentences you already earned and stop at "one reader at a time."',
 "APPLY",
 "Same field and same fix as W1."),

("R4", "riskin", "projects:a-need-grows-in-brooklyn", "logline",
 '"losing his innocence, his first love, and ultimately his life to the casual violence of his neighborhood."',
 'You collected the bill in the window before anyone walked in. Put the want in the window and hide the gun.',
 "DECLINE",
 "Removing the boy's death drops a fact from the logline, and Riskin himself files the public-logline policy as the one ruling Marco must make. Carried to the ruling list instead."),

("R5", "riskin", "projects:alpha-yy", "logline",
 '"until a final betrayal forces them to confront the cost of their chaotic existence."',
 'Nobody confronts an existence. Name who betrays whom, or keep the short line you already have.',
 "PARTLY",
 "Naming the betrayer is a fact the copy does not carry. The abstraction is replaced with the concrete terms already in the line: the betrayal, the debts, the work."),

("R6", "riskin", "projects:the-movement", "layout.0.body",
 '"the invisible society that has steered the world\'s economy for centuries."',
 'Centuries is a word with no bill attached. Cut the centuries. Let City Hall be the board.',
 "PARTLY",
 "The reach goes. The UGC, its function and the election stay: they are the plot. Riskin's other asks here (a professor, a father's name on a list) are new claims and are not written."),

("R7", "riskin", "projects:cleopatra", "synopsis",
 '"an impossible choice that will remake not just her life but the shape of existence."',
 'The universe is paying, Cleo is not. Make her lose something a mother can lose.',
 "APPLY",
 "Third chair on the same clause. See W5."),

("R8", "riskin", "projects:shadowmaster", "layout.0.body",
 '"the Hotshot Bluffer... the Calculating Tactician... the Underdog Hacker"; the coerced avatar buried in "some in it for money, some coerced."',
 'Menu items. The decent center of this picture is the coerced avatar. Put the person in the window and leave the playstyles in the room.',
 "PARTLY",
 "The label-stack is cut and the coerced avatar comes forward out of the list. Giving a gamer a name and a debt would be a new claim."),

("R9", "riskin", "projects:u-bruculinu", "synopsis",
 '"Original expression inspired by the premise of The Quiet Man. Not a remake."',
 'That is a lawyer clearing his throat. Cut "Not a remake."',
 "DECLINE",
 "That sentence is the property's rights position on a public page. Cutting it costs a fact the company relies on."),

("R10", "riskin", "projects:u-bruculinu", "synopsis",
 'The sister is "the kinship tie." The strongman has no name except the one the village uses on him.',
 'Give the sister one thing she wants from him that is not the village\'s want.',
 "DECLINE",
 "New claim. Nothing in the source says what the sister wants."),

("R11", "riskin", "projects:mayors", "layout.0.body",
 '"took America\'s greatest city from the American Dream to socialist experiment"; Giuliani "punched back."',
 'You promised no narrator telling us what to think, then the first paragraph thinks for us. Cut "socialist experiment." A report does not need a team jersey.',
 "PARTLY",
 "Capra filed the same objection. The verdict adjective goes from the opening paragraph. \"Democratic Socialist mayor\" in the last paragraph stays: that is Mamdani's own party label and a fact."),

("R12", "riskin", "(Home, Craft, Methods)", "(runtime)",
 'Home, Craft, and Methods say the Hays sentence three times. Once is a conviction. Three times is a brochure.',
 'You have already spent the feeling. Stop reaching for it.',
 "PARTLY",
 "Home keeps the creed in full because it is the front page. Craft and Home no longer restate each other's second half (S2, C1). Deleting the creed from Craft would cost the page its subject."),

("R13", "riskin", "(whole slate)", "(ruling)",
 'You are running two kinds of public logline: place-and-want (Sea Gate) and the whole bill (A Need Grows in Brooklyn).',
 'Decide what a public logline is for. One policy for the whole slate.',
 "RULING",
 "Riskin's closing ruling. It governs R4 and cannot be settled inside a copy pass."),

# ---------------------------------------------------------------- CAPRA
("C1", "capra", "v9-home:v9-home", "sections.2.body",
 '"Here the story does the heavy lifting. Drama over information. Subtext over statement. A face held long enough to matter."',
 'The script lecturing the audience about what drama is. Replace with a specific image, or cut it and let the loglines do the work.',
 "PARTLY",
 "\"A face held long enough to matter\" is the image and Welles marked it KEEP, so it stays. The two rule-statements go: they are repeated verbatim on Craft, which Riskin also flagged as runtime."),

("C2", "capra", "v9-craft:v9-craft", "sections.1.body",
 '"narratives of moral complexity, human resilience, and lasting impact"',
 'Three abstract nouns doing the job of a single concrete claim. Replace with something specific: a person, a place, a choice.',
 "PARTLY",
 "Second chair on the same clause. See R2."),

("C3", "capra", "projects:mayors", "layout.0.body",
 '"...from the American Dream to socialist experiment."',
 'A political verdict, not a story. Fix: "What happened to the city they built?" Let the audience draw the conclusion.',
 "PARTLY",
 "The verdict goes. The question form is used where it does not cost the episode count or the seventy-five years. See R11."),

("C4", "capra", "v9-home:v9-home", "sections.7.body",
 '"2026 and 2027 belong to the studios that meet people where they already are, carrying work worth their attention."',
 '"Belong to" who says? "Worth their attention" who decides? Cut the claim. Let the slate speak.',
 "APPLY",
 "Fourth chair on the same line. See W1."),

("C5", "capra", "(whole site)", "(ruling)",
 'Beliefs are presented as the studio\'s own claims about itself.',
 'Every claim on the site must be verifiable on the page itself. If it cannot be verified, cut it. Put beliefs where they belong: as quotes from the touchstones.',
 "RULING",
 "Capra's closing ruling. R1 and W1 apply it to two lines; moving the creed into quotation marks would rewrite the site's architecture."),
]

# The cross-cutting lessons the chairs gave, extracted for the round-2 writer's system prompt.
CROSS_CUTTING = """# WHAT THE ROOM SAID ACROSS EVERY PAGE (round 1, four chairs)

1. NO CLAIM THE PAGE CANNOT VERIFY. No prophecy, no ownership of a calendar year, no bravery
   awarded to yourself, no deciding what is "worth their attention." If a forward-looking line is
   needed it is a wager, not a coronation. (Welles, Sturges, Riskin, Capra, all four.)
2. SAY IT ONCE. The site announces three times that the pages are private, that the machine is
   disclosed, that the reply comes from the writer, and that Old Hollywood worked under the Hays
   rules. Once is a conviction. Three times is a brochure. When a sentence repeats what the
   sentence before it just said, the second one goes.
3. A THEME IS NOT A CHARACTER. "Moral complexity," "human resilience," "lasting impact," "the
   shape of existence," "the cost of their chaotic existence": abstractions cannot be
   photographed and nobody misses them. Replace an abstraction with the concrete thing ALREADY
   NAMED in that same field. You may not invent a new concrete detail to do it.
4. THE BUTTON IS USUALLY ALREADY IN THE PARAGRAPH. The strongest last line is generally a
   sentence sitting in the middle of the field. Move it to the end. Do not write a new one.
5. REGISTER. No tabloid verb ("ends him"), no trailer copy, no wink at a vulnerable person's
   expense, no team jersey inside a paragraph that promises neutrality. Documentary realism on
   the page means documentary register in the sentence.
6. THE HEDGES THAT SURVIVED ROUND 1 ARE STILL HEDGES. "just," "working wisdom," "whole,"
   "full"/"fully" in the same breath, "under the usual courtesies." Cut the qualifier, keep the claim.
7. INTERNAL PLUMBING STAYS OFF THE PUBLIC PAGE. "Deck canon" is a writers-room term.
8. WHAT THE ROOM PRAISED IS NOT REOPENED. The Sea Gate layout body, the Founding Roll, "The
   reply comes from the writer," "A slate is a promise; a script is a fact," "Trust is the only
   asset a small studio owns outright," "A face held long enough to matter," "The classics never
   go out of style," "Static pages, hand-set type, nothing watching you," "Either way, the UGC
   wins," "Brooklyn, before it was a brand." Return these strings unchanged.
9. A CUT MAY NOT COST A FACT OR A SLOT. If removing a sentence would take the field below 75% of
   its BEFORE character count, do not simply delete it: replace it with the shorter line the note
   asks for. Every name, number, date, place, link, marker and arrow survives either way.
"""


def notes_for(doc_key):
    """Every note that touches this document, with the (all ten properties) rows expanded."""
    out = []
    for n in NOTES:
        nid, chair, doc, path, quote, ask, dec, why = n
        if doc == doc_key:
            out.append(n)
        elif doc == "(all ten properties)" and doc_key in PROJECTS:
            out.append((nid, chair, doc_key, path, quote, ask, dec, why))
        elif doc == "(nine properties)" and doc_key in PROJECTS and doc_key != "projects:mayors":
            out.append((nid, chair, doc_key, path, quote, ask, dec, why))
    return out


def actionable_for(doc_key):
    """Notes that change copy in this document (APPLY / PARTLY), and the paths they touch."""
    rows = [n for n in notes_for(doc_key) if n[6] in ("APPLY", "PARTLY")]
    paths = []
    for n in rows:
        p = n[3]
        if p.startswith("(") or p in paths:
            continue
        paths.append(p)
    return rows, paths


COUNTS = {d: sum(1 for n in NOTES if n[6] == d) for d in ("APPLY", "PARTLY", "DECLINE", "RULING")}

if __name__ == "__main__":
    print(json.dumps(COUNTS, indent=2))
    for k in ["v9-home:v9-home", "v9-slate:v9-slate", "v9-craft:v9-craft", "v9-methods:v9-methods",
              "v9-contact:v9-contact", "site-settings:site-settings"] + PROJECTS:
        rows, paths = actionable_for(k)
        print(f"{k:38s} actionable={len(rows):2d} paths={paths}")
