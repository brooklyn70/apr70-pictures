#!/usr/bin/env python3
"""Step 14: the BALLOT document.

Marco's complaint about the v2 document: he has to hunt for the line a critic is
discussing. This build inverts that. Every field that moved, or that a chair wrote
about, gets its own small table: the live text, v1, v2, and every note from BOTH
rounds that concerns THAT field, each with a real Word checkbox, and an empty
MY REWRITE row at the bottom.

Reads only. Writes one .docx to SharedData and one to the scratchpad.
No CMS, no DB, no site, no git.
"""
import json, pathlib, re, shutil, sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
import lib, v2_notes

from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.section import WD_ORIENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

lib.use_round2()
OUT, OUT2 = lib.OUT, lib.OUT2

inv = json.loads((OUT / "inventory.json").read_text())
V1 = json.loads((OUT / "after.json").read_text())
V2 = json.loads((OUT2 / "after-v2.json").read_text())
R1_LEDGER = json.loads((OUT / "spend.json").read_text())
R2_LEDGER = lib.ledger_load()

DEST = pathlib.Path("/Volumes/SharedData/10-03-website-assets/copy-pass-2026-09-07/"
                    "APR70-site-copy-BALLOT-2026-09-07.docx")
SCRATCH = pathlib.Path("/private/tmp/claude-501/-Users-marco-websites-apr70-website/"
                       "2251e5c8-4793-420f-af9f-38fc6b2b3078/scratchpad/"
                       "APR70-site-copy-BALLOT-2026-09-07.docx")

CHAIR_NAME = {"welles": "Orson Welles", "sturges": "Preston Sturges",
              "riskin": "Robert Riskin", "capra": "Frank Capra"}
CHAIR_ORDER = ["welles", "sturges", "riskin", "capra"]
CHAIR_LENS = {"welles": "structure, escalation, scale, the unforgettable image",
              "sturges": "comic architecture, sequence mechanics, dialogue velocity",
              "riskin": "the moral ledger, the working-class voice",
              "capra": "the audience verdict, the full-house read"}

GREY = RGBColor(0x66, 0x66, 0x66)
RED = RGBColor(0x8B, 0x00, 0x00)
BLUE = RGBColor(0x1F, 0x3D, 0x7A)
SHADE_CAPTION = "EDEDED"

# ---------------------------------------------------------------- rows / labels

def rows_of(doc):
    out = []
    for f in doc["fields"]:
        if f["kind"] == "text":
            out.append((f["path"], f["before"]))
        else:
            for i, t in enumerate(f["before_texts"]):
                out.append((f"{f['path']}#{i}", t))
    return out


FIELD_KIND = {
    "heading": "heading", "leftHeading": "heading", "panelTitle": "heading",
    "body": "body", "bodyProse": "body", "rightBody": "body", "requestBody": "body (request)",
    "lede": "lede", "logline": "logline", "shortLogline": "logline",
    "synopsis": "synopsis", "blurb": "blurb", "subtitle": "subtitle",
    "kicker": "kicker", "caption": "caption", "heroCaption": "caption",
    "credit": "credit", "heroCredit": "credit", "heroLine": "hero line",
    "quote": "pull quote", "cite": "quote attribution", "note": "note",
    "metaLine": "meta line", "sceneSlug": "scene slug", "term": "term",
    "definition": "definition", "provenance": "provenance", "tagline": "tagline",
    "colophon": "colophon", "copyright": "copyright", "subtext": "subtext",
    "successNote": "confirmation note", "cta": "call to action",
    "seoTitle": "SEO title", "seoDescription": "SEO description",
    "text": "text",
}


def field_kind(path):
    leaf = path.split("#")[0].split(".")[-1]
    if leaf in FIELD_KIND:
        return FIELD_KIND[leaf]
    if leaf.lower().endswith("label"):
        return "label"
    return re.sub(r"(?<!^)(?=[A-Z])", " ", leaf).lower()


def pretty_path(path):
    if "#" in path:
        base, idx = path.split("#")
        return f"{base}  (paragraph {int(idx) + 1})"
    return path


# ---------------------------------------------------------------- text matching

def norm(s):
    s = (s.replace("’", "'").replace("‘", "'")
          .replace("“", '"').replace("”", '"')
          .replace("—", "--").replace("–", "-"))
    return re.sub(r"\s+", " ", s).strip().lower()


DOC_BY_KEY = {d["key"]: d for d in inv["docs"]}
ROWS = {d["key"]: rows_of(d) for d in inv["docs"]}
BEFORE = {k: dict(r) for k, r in ROWS.items()}


def texts_of(key, path):
    return (BEFORE[key][path], V1[key][path], V2[key][path])


def find_field(probe, restrict_doc=None):
    """Exact substring match of `probe` against BEFORE / v1 / v2 of every field."""
    n = norm(probe)
    hits = []
    for d in inv["docs"]:
        k = d["key"]
        if restrict_doc and k != restrict_doc:
            continue
        for path, _ in ROWS[k]:
            if any(n in norm(t) for t in texts_of(k, path)):
                hits.append((k, path))
    return hits


# ---------------------------------------------------------------- round-2 notes
# Curated from docs/copy-pass/2026-09-07/v2/critics/*.md. Each row is
# (id, chair, [(doc_key, path), ...], probe-or-None, note text, proposed wording).
# `probe` is verified by exact substring match against BEFORE/v1/v2 of the target.

PROJECTS = v2_notes.PROJECTS
NINE = [p for p in PROJECTS if p != "projects:mayors"]

R2_NOTES = [
# ------------------------------------------------------------------ WELLES
("W2-a", "welles", [("projects:mayors", "layout.0.body")], "What happened to the city they built?",
 'The Mayors, layout.0.body, v2: "What happened to the city they built?" inserted after "remade '
 'America\'s greatest city." The sentence it replaced, "from the American Dream to socialist '
 'experiment," was a thesis with a spine. The replacement is a shrug wearing a question mark. This '
 'is a private-slate field, so it escapes public scrutiny, but it is also the one document that '
 'argues for the company\'s most expensive property, and it now opens by softening its own argument.',
 'Restore the directional clause and let the question close the paragraph instead of interrupting '
 'it. "This eleven-episode series shows how their decisions took America\'s greatest city from the '
 'American Dream to socialist experiment. What happened to the city they built?" The question lands '
 'harder after the claim, not instead of it.'),

("W2-b", "welles", [("projects:mayors", "layout.0.body")], "sidewalks",
 'The Mayors, same field: "and where sidewalks become the place people sleep" replaced "our '
 'sidewalks, well they turn into bedrooms for our guests." I understand why; the original was a '
 'wink at a cruelty. But the v2 line is journalism-speak, and this paragraph is the founder\'s own '
 'voice at its most personal.',
 'Play: "and where our sidewalks turn into bedrooms." Four words. The image does the work; "the '
 'place people sleep" explains it, and explaining is the sin this whole pass was fought against.'),

("W2-c", "welles", [("projects:alpha-yy", "logline")], "pay for the work themselves",
 'Alpha YY logline, v2: "until a final betrayal leaves them to pay for the work themselves." Better '
 'than "confront the cost of their chaotic existence," which was a seminar title. But "pay for the '
 'work themselves" is abstract twice over. The synopsis already carries the concrete version: "the '
 'reckless life has finally caught up with them."',
 'Play: "...until a final betrayal leaves the reckless life to collect." One clause, and the debt '
 'metaphor the whole page runs on does the closing.'),

("W2-d", "welles", [("v9-home:v9-home", "sections.2.body")], "A face held long enough to matter",
 'Home sections.2.body, v2: cutting "Drama over information. Subtext over statement." from the home '
 'page was a mistake nobody flagged. Those two sentences are the creed in six words, and the Craft '
 'page still carries them, but the home page is where the stranger lands first. The v2 paragraph now '
 'reads "Here the story does the heavy lifting. A face held long enough to matter." and the middle '
 'is missing.',
 'Play: restore "Subtext over statement." alone, between the two survivors. One sentence, nine '
 'syllables, no length problem.'),

("W2-e", "welles", [("v9-methods:v9-methods", "sections.2.rows.5.definition")], "One story, told to everyone",
 'THE GESTURE. The bravura swing of this site is the disclosure ledger on Methods: "One story, told '
 'to everyone." That is the Citizen Kane "Rosebud" move in miniature, the whole enterprise staked on '
 'one sentence a reader can check. Round 2 protected it. Good. The Founding Roll, "Take a number," '
 'is the second gesture, and it survived untouched. The scale of the thing is intact.',
 ""),

# ------------------------------------------------------------------ STURGES
("S2-a", "sturges", [("v9-home:v9-home", "sections.6.body")], "the machine works below the line",
 'Home, section 6. CUT FOR SPEED. "The scripts are written by people; the machine works below the '
 'line, on frames like the ones on this site, and it is disclosed wherever it works." Too much '
 'machinery in one sentence.',
 'Play: "People write the scripts. Machines render the labeled development frames." The new button '
 'is good: "Ten properties. One writer responsible for every page." Keep it.'),

("S2-b", "sturges", [("v9-craft:v9-craft", "sections.1.body")], "These principles guide every project we develop",
 'Craft, section 1. Cut this paragraph: "These principles guide every project we develop, from '
 'limited series to features and beyond, as we build a studio for stories told in the real '
 'neighborhoods of Brooklyn, Los Angeles, and beyond." The page has already stated the principles, '
 'the projects, and the neighborhoods. BUTTONS, Craft section 1: still needs an exit.',
 'End the section here: "That discipline built the pictures people still watch, still quote, and '
 'still hand to their children." There is your feeling. Stop before the brochure returns.'),

("S2-c", "sturges", [(p, "requestBody") for p in NINE], "The reply comes from the writer",
 'Property request fields. Nine repetitions have spent the value of "The reply comes from the '
 'writer." It is still an excellent line. It belongs to Contact, where it names the experience. The '
 'best line on the site does not become nine times better when printed nine times. (S12 remains: the '
 'property pages repeat Contact\'s signature line until signature becomes boilerplate.)',
 'On each property page, play the specific transaction: "The feature is drafted. Script and synopsis '
 'are shared privately, on request. Write with your name, your role, and the title you want to read."'),

("S2-d", "sturges", [("projects:a-need-grows-in-brooklyn", "synopsis")], "dominoes were falling",
 'A Need Grows in Brooklyn, synopsis. Cut "The dominoes were falling from the opening frame." The '
 'gun has fired. Nothing after that can improve the gun. The Welles revision fixed the action and '
 'left the obituary attached. BUTTONS: the scene now has a button, but one sentence too many follows '
 'it.',
 'End on: "the instant a gun slides off a dashboard and fires."'),

("S2-e", "sturges", [("projects:la-dolce-vita", "synopsis")], "played for keeps",
 'L.A. Dolce Vita, synopsis. Cut "played for keeps." It remains rented noir furniture. BUTTONS: '
 'still stops on a slogan. S20 remains, "Played for keeps" survived. S17 remains because the source '
 'offers no further character behavior; that is not a copy failure now, it is a '
 'development-material shortage. THE BENCH: still a journalist, a vanished fiancee, a hidden '
 'daughter, and a dynasty. Excellent plot positions. Not yet a family at breakfast.',
 'End on: "Neo-noir on 35mm, with an operatic score." Or find a family image supported by the source.'),

("S2-f", "sturges", [("projects:mayors", "layout.0.body")], "The blessing and curse of our Metropolis is time",
 'The Mayors, layout body. Cut "The blessing and curse of our Metropolis is time." The next sentence '
 'is plainer and better: "Twenty years, approximately. That\'s how long it takes the city to put on '
 'a new face."',
 'Cut the first sentence. Open on the twenty years.'),

("S2-g", "sturges", [("projects:mayors", "layout.0.body")], "For native New Yorkers",
 'The Mayors, layout body. Also cut "For native New Yorkers, we watch as \'progress\' marches us '
 'towards oblivion." The grammar limps, and "native New Yorkers" shuts the door on half the city.',
 'The following attribution already does the honest work: "In the family\'s telling, the city of the '
 'fifties was prosperous, safer, and cleaner..."'),

("S2-h", "sturges", [("v9-methods:v9-methods", "sections.2.rows.6.definition")], "must be human work",
 'Methods, "Why it matters". The present line still promises a standard rather than stating a fact: '
 '"the writing, must be human work, plainly and provably." S27 remains: the proposed logged-process '
 'language is already supported by the Methods page itself.',
 'Play the fact already printed elsewhere on the same page: "The writing is human work. The process '
 'is logged per script."'),

("S2-i", "sturges", [("projects:the-movement", "layout.0.body"), ("projects:the-movement", "synopsis")],
 "hard-boiled reporter",
 'THE BENCH. The Movement still has job descriptions instead of people: "a hard-boiled reporter and '
 'an honest District Attorney". "Hard-boiled" and "honest" are labels pasted to empty chairs. S15 '
 'remains: the reporter and the D.A. are still casting categories.',
 'Cut the borrowed adjectives until the source can provide behavior: "a reporter and a District '
 'Attorney".'),

("S2-j", "sturges", [("projects:shadowmaster", "layout.0.body")], "Hotshot Bluffer",
 'THE BENCH. Shadowmaster has improved, but the workbook still shows: "the Hotshot Bluffer", "the '
 'Calculating Tactician", "the Underdog Hacker". S16 is only half answered: Shadowmaster lost some '
 'adjectives but kept the workbook names.',
 'The source already contains behavior. Use it: "Three gamers anchor the roster: one wins through '
 'aggressive bluffs, one through command and calculation, and one through ingenuity."'),

("S2-k", "sturges", [("projects:shadowmaster", "layout.0.body")], "multi-scenario finale",
 'BUTTONS. Shadowmaster, layout body, still stops by restating the format: "building toward a '
 'multi-scenario finale where the line between gamer and avatar blurs." S22 remains: Shadowmaster '
 'still ends by restating its premise.',
 'End instead on the human reversal already supported by the premise: "In a crisis, the avatar may '
 'obey, defy, or cut a side deal."'),

("S2-l", "sturges", [("projects:alpha-yy", "synopsis")], "Volatile enforcers",
 'THE BENCH. Alpha YY has Mike and Dario, but the synopsis does not distinguish them. "Volatile '
 'enforcers" describes the pair from across the street.',
 'One specific difference between them is still required from the source.'),

("S2-m", "sturges", [("projects:u-bruculinu", "synopsis")], "Not a remake",
 'THE BENCH. U Bruculinu has U Capo and A Sorella, which are nearly labels by design. The village '
 'needs one citizen who is neither power nor kinship. BUTTONS: fixed, keep "Not a remake." Legal, '
 'blunt, funny.',
 ""),

("S2-n", "sturges", [("projects:sea-gate", "layout.0.body")], "Mary in the Coney Island neon",
 'THE BENCH. Sea Gate has the best bench. Mary keeps the tally. Pete Falcone owns the clam stand. '
 'Ball, Vanning, Niles, and Williams occupy different corners of the same corrupt town. The '
 'supporting cast creates pressure before anybody explains the plot. Leave it alone. S24 was '
 'answered by restraint. Congratulations to everyone who kept his hands in his pockets.',
 ""),

("S2-o", "sturges", [("projects:da-hook", "layout.0.body")], "Red Hook",
 'THE BENCH. Da Hook is close. The scented fixer, the patient collector, the dying captain, and the '
 'silent gunman arrive with distinct silhouettes. The calendar is broken, but the population is not.',
 ""),

("S2-p", "sturges", [("projects:cleopatra", "synopsis")], "which family she wakes up without",
 'BUTTONS. Cleopatra, synopsis. Fixed. Keep: "which life she keeps, and which family she wakes up '
 'without." The picture finally breaks your heart instead of threatening the shape of existence. '
 'THE BENCH: the brother, the ex-con, and the kinder ex remain functions. S18 remains because the '
 'source offers no further character behavior.',
 ""),

("S2-q", "sturges", [("v9-home:v9-home", "sections.7.body")], "one reader at a time",
 'BUTTONS. Home, section 7. Fixed. Keep: "The pages go out one reader at a time." It reduces a '
 'worldwide strategy to one human action.',
 ""),

("S2-r", "sturges", [("v9-slate:v9-slate", "sections.5.body")], "Ask to read them",
 'BUTTONS. Slate, section 5. Improved. Keep: "Ask to read them." The legal language remains long, '
 'but now it leads somewhere.',
 ""),

("S2-s", "sturges", [("v9-craft:v9-craft", "sections.4.body")], "The classics never go out of style",
 'BUTTONS. Craft, section 4. Fixed. Ending on "The classics never go out of style." is stronger than '
 'asking storytellers to admire their own bravery.',
 ""),

("S2-t", "sturges", [("v9-methods:v9-methods", "sections.4.body")], "Machines render the development frames",
 'BUTTONS. Methods, section 4. Fixed. Keep: "Machines render the development frames. People write '
 'the story." Clean division. No craft worker is dismissed as busywork.',
 ""),

("S2-u", "sturges", [("v9-contact:v9-contact", "sections.2.body")], "One note. One role. One link",
 'BUTTONS. Contact, section 2. Fixed. Keep: "One note. One role. One link." That is a button and an '
 'instruction at once.',
 ""),

("S2-v", "sturges", [("projects:the-movement", "layout.0.body")], "the UGC wins",
 'BUTTONS. The Movement, layout body. Fixed. Keep: "Either way, the UGC wins." That is the season.',
 ""),

("S2-w", "sturges", [("projects:mayors", "layout.0.body")], "This is the autopsy report",
 'BUTTONS. The Mayors: "This is the autopsy report." A strong button. It can stay only if the body '
 'conducts an autopsy rather than delivering the verdict before opening the patient. S37 remains a '
 'tonal decision: The Mayors says "forensic, not hysterical," then uses "broken city," "marches us '
 'towards oblivion," and "who killed New York City?" The polemic may be the picture. The neutrality '
 'cannot be the alibi.',
 ""),

# ------------------------------------------------------------------ RISKIN
("R2-1", "riskin", [("v9-home:v9-home", "sections.7.body")], "Our wager for 2026 and 2027",
 'THE DETAILED FIXES, 1. Home, sections.7.body. (a) "Our wager for 2026 and 2027: meet people where '
 'they already are. The pages go out one reader at a time." (b) R3 asked you to stop at the sentence '
 'you had already earned. You stopped claiming the years and then bet on them instead. A wager is '
 'still a hand on a year that is not yours.',
 '(c) Cut the wager sentence. Leave "The slate develops in public view on this site. The audience '
 'finds it through search, through AI answers, and on X. The pages go out one reader at a time." The '
 'cost is the claim. You do not get to own the calendar. You get one reader.'),

("R2-2", "riskin", [("projects:cleopatra", "layout.1.rightBody#0")], "salvation or destruction",
 'THE DETAILED FIXES, 2. Cleopatra, layout.1.rightBody#0. (a) "and that she may be the key to '
 'salvation or destruction." (b) The synopsis now makes a mother pay. The overview still makes the '
 'universe pay. The slot people hit first is the one that flinches.',
 '(c) End that paragraph on the cost already on this page in synopsis. Not salvation. Not '
 'destruction. "She will have to choose which life she keeps, and which family she wakes up '
 'without." Same woman. Same sleep. A child somewhere does not see her in the morning. That is the '
 'bill. Play it in the window the overview occupies.'),

("R2-3", "riskin", [("projects:alpha-yy", "synopsis")], "the reckless life has finally caught up",
 'THE DETAILED FIXES, 3. Alpha YY, synopsis, last sentence. (a) "until a sudden, lethal betrayal '
 'suggests the reckless life has finally caught up with them." (b) The logline in v2 already paid '
 'this account in concrete terms. The synopsis still confronts an existence. Nobody can shoot an '
 'existence.',
 '(c) Close on the line you already wrote for the logline: the betrayal leaves them to pay for the '
 'work themselves. Keep Mike, Dario, the ferry, the kites. The cost is the last job turning on the '
 'men who did it. Do not tell me what their life meant. Show me who is left standing.'),

("R2-4", "riskin", [("projects:a-need-grows-in-brooklyn", "synopsis")], "a gun slides off a dashboard",
 'THE DETAILED FIXES, 4. A Need Grows in Brooklyn, synopsis, last image. (a) "A redemption is staged '
 'right up to the instant a gun slides off a dashboard and fires." (b) The logline already spends '
 'his life. The long layout still kills Marc instantly. The short synopsis looks away. That is not '
 'restraint. That is a flinch after the work.',
 '(c) If the death stays on this page, the boy stays in the last frame. Play the dashboard, the '
 'slide, the shot, and Marc not getting up. NYU, Sunny, the promise to God, then the summer ending '
 'on the seat beside him. Adult matter, constrained execution: no linger on the wound, no speech, '
 'the body still.'),

("R2-5", "riskin", [("projects:mayors", "layout.0.body")], "autopsy report",
 'THE DETAILED FIXES, 5. The Mayors, layout.0.body, open of graf 2 and the close. (a) "For native '
 'New Yorkers, we watch as \'progress\' marches us towards oblivion." And: "Who killed New York '
 'City? This is the autopsy report." (b) You promised no narrator telling anyone what to think. Then '
 'the copy thinks, twice. An autopsy is a verdict. A report is a pile of names and consequences. You '
 'cannot sell both.',
 '(c) Graf 2 keeps the twenty years, the brick, the sidewalks, the Dodgers, Luna Park, the family\'s '
 'first-hand accounts. Lose "oblivion." Lose the march. End the last paragraph on the method you '
 'already named and the shoot you already have: Episode 11 films the first hundred days as they '
 'unfold. Cause and effect. Names and consequences. Who benefited. Who paid. Stop.'),

("R2-6", "riskin", [("projects:cleopatra", "layout.1.rightBody#1")], "not the only consciousness",
 'THE DETAILED FIXES, 6. Cleopatra, layout.1.rightBody#1, if the slot can spare one more cut. (a) '
 '"She is not the only consciousness aware of the war being waged across dimensions." (b) Same '
 'unpaid account as fix 2. A war across dimensions is a poster. A mother choosing a family is a '
 'picture.',
 '(c) Keep the patterns, the other consciousness, the jumps being orchestrated. Land on the same '
 'private loss the synopsis now holds. One life kept. One family woken up without. Do not let the '
 'overview spend a universe after the inner page learned not to.'),

("R2-7", "riskin", [("projects:a-need-grows-in-brooklyn", "logline")], "his life",
 'THE LEDGER. Marc (A Need Grows in Brooklyn). Want: NYU, Sunny, the club that will not let him in. '
 'Cost: innocence, first love, his life. Paid in the logline before anyone sits down. Unpaid as '
 'drama. A win for candor is a loss for the window. R4 was declined because taking the boy\'s death '
 'out of that logline drops a fact, and because this is the ruling, not a line edit. Fine. Then rule.',
 ""),

("R2-8", "riskin", [("projects:shadowmaster", "layout.0.body")], "coerced",
 'THE LEDGER. The coerced avatar (Shadowmaster). Want: to live through the night. Cost: a body under '
 'someone else\'s plan. Moved forward. Still nameless, still sharing the frame with three '
 'playstyles. Flag only. A name would be a new claim.',
 ""),

("R2-9", "riskin", [("projects:u-bruculinu", "synopsis")], "the sister",
 'THE LEDGER. U Bruculinu. Want: quiet. Cost: the village will not grant it. Paid as a premise. A '
 'Sorella still wants what the village wants. Flat. Declined as a new claim; the arc remains '
 'decoration.',
 ""),

("R2-10", "riskin", [("v9-craft:v9-craft", "sections.1.body")], "studio",
 'THE HEART. A theme is still not a character. "The craft of constraint" is still not a person. You '
 'stopped saying "moral complexity." Good. You still have not put a face on Craft. The house was '
 'right that importing one would be a new claim.',
 'Then let Craft stay a workshop and stop asking it to carry the humanity. The colophon already '
 'does it.'),

# ------------------------------------------------------------------ CAPRA
("C2-1", "capra", [("v9-home:v9-home", "sections.2.body")], "Here the story does the heavy lifting",
 'THE DETAILED FIXES, 1. Home / sections.2.body. "Here the story does the heavy lifting." Why it '
 'fails: the line explains the picture instead of letting the picture play. The next sentence "A '
 'face held long enough to matter" is the image. The explanation steps on it.',
 'Fix: cut "Here the story does the heavy lifting." Open the paragraph on "A face held long enough '
 'to matter." Let the image stand alone.'),

("C2-2", "capra", [("v9-craft:v9-craft", "sections.4.body")], "Drama over information",
 'THE DETAILED FIXES, 2. Craft / sections.4.body. "Drama over information. Subtext over statement." '
 'Why it fails: two slogans masquerading as principles. The very next sentence "The camera earns its '
 'movement; the cut earns its place" demonstrates the principle in behavior. The slogans are corn. '
 'THE AUDIENCE VERDICT: they check their watches at "Drama over information. Subtext over statement".',
 'Fix: delete the two slogan sentences. Start the paragraph at "The camera earns its movement; the '
 'cut earns its place. We would rather hold a face for four seconds than cut three times to prove we '
 'were there. The classics never go out of style."'),

("C2-3", "capra", [("v9-home:v9-home", "sections.0.caption"), ("v9-craft:v9-craft", "sections.0.caption"),
                   ("v9-slate:v9-slate", "sections.0.caption"), ("v9-contact:v9-contact", "sections.3.caption")],
 "==",
 'THE DETAILED FIXES, 3. Global captions. "==L.A. Dolce Vita==" (and "==A Need Grows in '
 'Brooklyn=="). Why it fails: the markup brackets are visible scaffolding. The audience sees the '
 'boom mic. The "==Title==" markup bleeding into public captions is a boom mic in the shot.',
 'Fix: render the title clean: "L.A. Dolce Vita" and "A Need Grows in Brooklyn". No brackets. No '
 'equals signs. The slate pages already carry the proper title in the heading.'),

("C2-4", "capra", [("projects:a-need-grows-in-brooklyn", "layout.0.body")], "structural negative space",
 'THE DETAILED FIXES, 4. A Need Grows in Brooklyn / layout.0.body. "the El train as structural '
 'negative space." Why it fails: writer shorthand on the screen. The audience does not read the '
 'shooting script.',
 'Fix: "The El train cuts the frame" or "The El train looms over every shot." Concrete. Visual. '
 'Spoken.'),

("C2-5", "capra", [("v9-methods:v9-methods", "sections.4.body")], "boundaries are where our best work comes from",
 'THE DETAILED FIXES, 5. Methods / sections.4.body. "A disclosure rule is a boundary, and boundaries '
 'are where our best work comes from." Why it fails: the principle announced instead of lived. The '
 'next sentence "Machines render the development frames. People write the story" lives it.',
 'Fix: "A disclosure rule is a boundary. We do our best work at the boundary. Machines render the '
 'development frames. People write the story."'),

("C2-6", "capra", [("projects:mayors", "layout.0.body")], "Ric Burns",
 'THE DETAILED FIXES, 6. The Mayors / layout.0.body. "a Ric Burns homage." Why it fails: a name drop '
 'substitutes for the method. The method is already described: "cinema verite with archival material '
 'and contemporary interviews, each era rendered in its own visual grammar."',
 'Fix: cut "a Ric Burns homage." Let the description stand. The audience knows the register when '
 'they see it.'),

("C2-7", "capra", [("projects:cleopatra", "layout.1.rightBody#0")], "war across dimensions",
 'EARNED OR ASSERTED, asserted. "Unseen war across dimensions / salvation or destruction" '
 '(Cleopatra layout): vague stakes for a concrete character.',
 ""),
]

# ---------------------------------------------------------------- the 8 rulings
# question, [(chair, round, quoted words)], [option strings]

RULINGS = [
("R-1", "Is the site allowed to say “we” at all, or does one writer say “I”?",
 ["W7"],
 [("welles", 1, 'The copy says "Every role here is currently filled by the writer" and then speaks as '
                '"we" on every page. Decide whether the site is allowed to say "we" at all, and make '
                'the pronoun load-bearing everywhere or nowhere.'),
  ("welles", 2, 'Round 2 sharpened the singular facts, which means the plural voice now contradicts '
                'them on the same screen. Either the site is one man saying "I," which is the '
                'bravest and most honest version and the one I would shoot, or "we" is a declared '
                'fiction the company stands behind as a house style, stated once and never '
                'apologized for. What it cannot do is keep both. Rule it before round 3, or round 3 '
                'will be forty fields of wallpaper over a split beam.')],
 ['The site speaks as "I". One writer, first person, everywhere.',
  '"We" stays, declared once as house style and never apologised for again.',
  'Leave the pronoun as it is now and revisit after round 3.',
  'Other, see my note.']),

("R-2", "Is A Need Grows in Brooklyn a feature or a ten-episode series?",
 ["S30"],
 [("sturges", 1, 'The page calls it a feature, then describes "Episodes 1-4," "Episodes 5-8," '
                 '"Episodes 9-10," and "the season." Decide whether it is a feature or a '
                 'ten-episode series, then make every field obey.'),
  ("sturges", 2, 'S30 remains completely unresolved: A Need Grows in Brooklyn is both a feature and '
                 'a ten-episode season.')],
 ['It is a feature. Every field obeys the feature and the episode language goes.',
  'It is a ten-episode series. Every field obeys the season.',
  'Feature first, series to follow, stated once on the page in one line.',
  'Other, see my note.']),

("R-3", "Which calendar does Da Hook own: fall 1970 or spring 1973?",
 ["S31"],
 [("sturges", 1, 'One section says fall 1970. Another says spring 1973. One invokes the Knicks\' '
                 'first championship, another their second. This picture currently owns two '
                 'calendars. Pick one.'),
  ("sturges", 2, 'S31 remains completely unresolved: Da Hook occurs in fall 1970 and spring 1973, '
                 'with two different Knicks championships.'),
  ("sturges", 2, 'Marco\'s ruling: no page goes live until each property has one canonical fact '
                 'sheet, because a feature cannot also be a ten-episode season, 1970 cannot also be '
                 '1973, and feature-first cannot also be series-first.')],
 ['Fall 1970. The Knicks\' first championship. Every field obeys 1970.',
  'Spring 1973. The Knicks\' second championship. Every field obeys 1973.',
  'The picture spans 1970 to 1973 and the page says so once, plainly.',
  'Other, see my note.']),

("R-4", "Is Shadowmaster feature-first or series-first?",
 ["S32"],
 [("sturges", 1, 'The meta line says "Feature first, series spawn to (310)"; the body says '
                 '"Shadowmaster is a fully scripted series." Pick the lead format.'),
  ("sturges", 2, 'S32 remains completely unresolved: Shadowmaster is feature-first and also '
                 'introduced as a fully scripted series.')],
 ['Feature first, series spawn to (310). The body follows the meta line.',
  'A fully scripted series. The meta line follows the body.',
  'Other, see my note.']),

("R-5", "Is The Mayors an autopsy or a polemic?",
 ["S37"],
 [("sturges", 1, '"This is the autopsy report." Strong button only if the series earns neutrality. '
                 'Either keep the autopsy and make the body forensic, or keep the polemic.'),
  ("sturges", 2, 'S37 remains a tonal decision. The Mayors says "forensic, not hysterical," then '
                 'uses "broken city," "marches us towards oblivion," and "who killed New York '
                 'City?" The polemic may be the picture. The neutrality cannot be the alibi.'),
  ("riskin", 2, 'An autopsy is a verdict. A report is a pile of names and consequences. You cannot '
                'sell both. Muckraking does not close the case in the kicker.'),
  ("welles", 2, 'It is the one document that argues for the company\'s most expensive property, and '
                'it now opens by softening its own argument.')],
 ['Autopsy. Keep the button and make the body forensic: names, consequences, who benefited, who paid.',
  'Polemic. Keep the argument and drop the claim of neutrality.',
  'Other, see my note.']),

("R-6", "Does the site sell the work, or defend the company on every page?",
 ["S38"],
 [("sturges", 1, 'The site cannot both sell the work and defend the company in every paragraph. '
                 'Sell the work. Put the disclosure in Methods, the legal status on Slate, the '
                 'access rules on Contact, and let every property page tell one story.'),
  ("sturges", 2, 'S38 is partly answered. The site sells the work more often now, but every '
                 'property still stops to explain access procedure, authorship, privacy, and the '
                 'office door.')],
 ['Sell the work. Disclosure lives on Methods, legal status on Slate, access rules on Contact, and '
  'each property page tells one story.',
  'Every page keeps its own disclosure and access language. The repetition is the policy.',
  'Other, see my note.']),

("R-7", "What is a public logline for: the whole bill, or place and want?",
 ["R13"],
 [("riskin", 1, 'You are running two kinds of public logline: place-and-want (Sea Gate) and the '
                'whole bill (A Need Grows in Brooklyn). Decide what a public logline is for. One '
                'policy for the whole slate.'),
  ("riskin", 2, 'If the window is a fact sheet, every public logline may collect its dead, its '
                'scandal, its betrayal, its heir. Say so. Live with the cost: nobody walks in to '
                'find out what happens. They already know. If the window is an invitation, the '
                'public logline is place and want. The gun stays in the pages you send on request. '
                'Sea Gate already knows how. The rest of the slate copies Sea Gate\'s job, not its '
                'plot. You cannot have both and call it a slate.')],
 ['The window is a fact sheet. Every public logline may collect its dead.',
  'The window is an invitation. Place and want only; the gun stays in the pages sent on request.',
  'Other, see my note.']),

("R-8", "Must every claim on the site be verifiable on the page itself?",
 ["C5"],
 [("capra", 1, 'Beliefs are presented as the studio\'s own claims about itself. Every claim on the '
               'site must be verifiable on the page itself. If it cannot be verified, cut it. Put '
               'beliefs where they belong: as quotes from the touchstones.'),
  ("capra", 2, 'Cut the lectures. Trust the images. Scrub the markup from the captions. The audience '
               'is already leaning forward, don\'t step in front of the screen to tell them what '
               'they\'re feeling.')],
 ['Every claim must be verifiable on the page. What cannot be verified is cut.',
  'Beliefs move into quotation, attributed to the touchstones.',
  'The creed stays in the company\'s own voice. Nothing moves.',
  'Other, see my note.']),
]

# ---------------------------------------------------------------- note assembly

NOTES_BY_FIELD = {}   # (doc_key, path) -> [note dict]
ORPHANS = []          # notes that name no single field
MAPPED = 0
CHECKED_PROBES = []   # (note id, ok)

DEC_LABEL = {"APPLY": "APPLY", "PARTLY": "APPLY IN PART", "DECLINE": "DECLINE",
             "RULING": "CARRIED TO MARCO AS A RULING"}


def attach(key, path, note):
    NOTES_BY_FIELD.setdefault((key, path), []).append(note)


# --- round 1, from the ledger module (single source of truth for chair/field/decision)
for nid, chair, doc, path, quote, ask, dec, why in v2_notes.NOTES:
    targets = []
    if doc == "(all ten properties)":
        targets = [(p, path) for p in PROJECTS]
    elif doc == "(nine properties)":
        targets = [(p, path) for p in NINE]
    elif path.startswith("(hold: "):
        targets = [(doc, path[len("(hold: "):-1])]
    elif doc.startswith("(") or path.startswith("("):
        targets = []
    else:
        targets = [(doc, path)]
    targets = [(k, p) for k, p in targets if k in BEFORE and p in BEFORE[k]]
    if not targets:
        if dec != "RULING":   # the eight RULING rows have their own section up front
            ORPHANS.append({"id": nid, "chair": chair, "round": 1, "doc": doc, "path": path,
                            "quote": quote, "ask": ask, "dec": dec, "why": why})
        continue
    MAPPED += 1
    for k, p in targets:
        attach(k, p, {"id": nid, "chair": chair, "round": 1, "quote": quote, "ask": ask,
                      "dec": dec, "why": why})

# --- round 2, curated from the four v2 critic files
for nid, chair, targets, probe, note, ask in R2_NOTES:
    good = []
    for k, p in targets:
        if k not in BEFORE or p not in BEFORE[k]:
            continue
        if probe and not any(norm(probe) in norm(t) for t in texts_of(k, p)):
            CHECKED_PROBES.append((nid, k, p, False))
            continue
        CHECKED_PROBES.append((nid, k, p, True))
        good.append((k, p))
    if not good:
        ORPHANS.append({"id": nid, "chair": chair, "round": 2, "doc": "(unmapped)",
                        "path": "(unmapped)", "quote": note, "ask": ask, "dec": None, "why": ""})
        continue
    MAPPED += 1
    for k, p in good:
        attach(k, p, {"id": nid, "chair": chair, "round": 2, "quote": note, "ask": ask,
                      "dec": None, "why": ""})

# Round-2 material that names no single field, kept rather than dropped.
ORPHANS.append({"id": "S2-x", "chair": "sturges", "round": 2, "doc": "(whole site)",
                "path": "(summary)", "dec": None, "why": "",
                "quote": "SPECIFIC NOTES, answered. S1, S2, S3, S6, S7, S8, S9, S13, S14, S21, S28 "
                         "and S33 were answered cleanly. S4, S5, S10, S11, S23, S25, S26, S29, S34, "
                         "S35 and S36 were answered enough to improve the picture. “Deck "
                         "canon” is gone. “Busywork below the line” is gone. The "
                         "Contact count lands. The Movement now ends on the consortium’s "
                         "victory. The Mayors loses the wink about sidewalk bedrooms and the cheap "
                         "political aside about Ric Burns. Home no longer ends its company section "
                         "on disclosure procedure.", "ask": ""})
ORPHANS.append({"id": "C2-x", "chair": "capra", "round": 2, "doc": "(whole site)",
                "path": "(summary)", "dec": None, "why": "",
                "quote": "THE AUDIENCE VERDICT. The house laughs at “One note. One role. One "
                         "link.” They lean in at “Borough Park, summer 1986” and "
                         "“Sea Gate, one road in” and “Staten Island to Little "
                         "Italy, collecting.” The scene they tell somebody about tomorrow: "
                         "“A face held long enough to matter.” Or the gun sliding off the "
                         "dashboard in Borough Park. Or the dry life vest on the nail in Sea Gate. "
                         "The specific image. The behavior that costs.", "ask": ""})

NOTE_ROUND_ORDER = {1: 0, 2: 1}
for kp in NOTES_BY_FIELD:
    NOTES_BY_FIELD[kp].sort(key=lambda n: (NOTE_ROUND_ORDER[n["round"]],
                                           CHAIR_ORDER.index(n["chair"]), n["id"]))

# ---------------------------------------------------------------- docx helpers

_cbid = [90000]


def checkbox_run(paragraph):
    """A real Word content control: w:sdt > w:sdtPr > w14:checkbox."""
    _cbid[0] += 1
    sdt = OxmlElement("w:sdt")
    pr = OxmlElement("w:sdtPr")
    _id = OxmlElement("w:id"); _id.set(qn("w:val"), str(_cbid[0])); pr.append(_id)
    cb = OxmlElement("w14:checkbox")
    checked = OxmlElement("w14:checked"); checked.set(qn("w14:val"), "0"); cb.append(checked)
    cs = OxmlElement("w14:checkedState")
    cs.set(qn("w14:val"), "2612"); cs.set(qn("w14:font"), "MS Gothic"); cb.append(cs)
    us = OxmlElement("w14:uncheckedState")
    us.set(qn("w14:val"), "2610"); us.set(qn("w14:font"), "MS Gothic"); cb.append(us)
    pr.append(cb)
    sdt.append(pr)
    content = OxmlElement("w:sdtContent")
    r = OxmlElement("w:r")
    rpr = OxmlElement("w:rPr")
    fonts = OxmlElement("w:rFonts")
    for a in ("w:ascii", "w:eastAsia", "w:hAnsi", "w:cs"):
        fonts.set(qn(a), "MS Gothic")
    rpr.append(fonts)
    sz = OxmlElement("w:sz"); sz.set(qn("w:val"), "24"); rpr.append(sz)
    r.append(rpr)
    t = OxmlElement("w:t"); t.text = "☐"
    r.append(t)
    content.append(r)
    sdt.append(content)
    paragraph._p.append(sdt)
    return sdt


def put_checkbox(cell):
    cell.text = ""
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(0)
    checkbox_run(p)


def shade(cell, hexcolor):
    tcPr = cell._tc.get_or_add_tcPr()
    el = OxmlElement("w:shd")
    el.set(qn("w:val"), "clear"); el.set(qn("w:color"), "auto"); el.set(qn("w:fill"), hexcolor)
    tcPr.append(el)


def thin_borders(table):
    tblPr = table._tbl.tblPr
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        el = OxmlElement(f"w:{edge}")
        el.set(qn("w:val"), "single"); el.set(qn("w:sz"), "4")
        el.set(qn("w:space"), "0"); el.set(qn("w:color"), "BFBFBF")
        borders.append(el)
    tblPr.append(borders)


def set_grid(table, widths):
    """Fixed column widths: the tblGrid is what Word and LibreOffice actually honour."""
    tbl = table._tbl
    grid = tbl.find(qn("w:tblGrid"))
    cols = grid.findall(qn("w:gridCol"))
    for gc, w in zip(cols, widths):
        gc.set(qn("w:w"), str(int(w * 1440)))
    for row in table.rows:
        for cell, w in zip(row.cells, widths):
            cell.width = Inches(w)


def min_height(row, inches):
    trPr = row._tr.get_or_add_trPr()
    h = OxmlElement("w:trHeight")
    h.set(qn("w:val"), str(int(inches * 1440)))
    h.set(qn("w:hRule"), "atLeast")
    trPr.append(h)


def no_split(row):
    trPr = row._tr.get_or_add_trPr()
    el = OxmlElement("w:cantSplit")
    trPr.append(el)


def para(cell, text, size=9.5, bold=False, italic=False, color=None, mono=False,
         first=False, space_after=2):
    p = cell.paragraphs[0] if first else cell.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.space_before = Pt(0)
    for i, line in enumerate(str(text).split("\n")):
        r = p.add_run(("\n" if i else "") + line)
        r.font.size = Pt(size); r.bold = bold; r.italic = italic
        if color is not None:
            r.font.color.rgb = color
        if mono:
            r.font.name = "Consolas"
    return p


def cell_reset(cell):
    cell.text = ""
    return cell


def body_para(document, text, size=9.5, bold=False, italic=False, color=None,
              space_after=5, indent=0.0):
    p = document.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    if indent:
        p.paragraph_format.left_indent = Inches(indent)
    for i, line in enumerate(str(text).split("\n")):
        r = p.add_run(("\n" if i else "") + line)
        r.font.size = Pt(size); r.bold = bold; r.italic = italic
        if color is not None:
            r.font.color.rgb = color
    return p


def heading(document, text, size=16, space_before=0):
    p = document.add_paragraph()
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(6)
    r = p.add_run(text); r.bold = True; r.font.size = Pt(size)
    return p


# ---------------------------------------------------------------- counts

TOTAL_ROWS = sum(len(ROWS[d["key"]]) for d in inv["docs"])
CHANGED_V1 = [(d["key"], p) for d in inv["docs"] for p, b in ROWS[d["key"]] if V1[d["key"]][p] != b]
CHANGED_V2 = [(d["key"], p) for d in inv["docs"] for p, b in ROWS[d["key"]]
              if V2[d["key"]][p] != V1[d["key"]][p]]
CHANGED = set(CHANGED_V1) | set(CHANGED_V2)
NOTED = set(NOTES_BY_FIELD.keys())
BALLOT_FIELDS = CHANGED | NOTED
NOTED_ONLY = NOTED - CHANGED
R1, R2 = R1_LEDGER["total_usd"], R2_LEDGER["total_usd"]

# ---------------------------------------------------------------- build

d = Document()
sec = d.sections[0]
sec.orientation = WD_ORIENT.LANDSCAPE
sec.page_width, sec.page_height = Inches(11.0), Inches(8.5)
sec.left_margin = sec.right_margin = Inches(0.6)
sec.top_margin = sec.bottom_margin = Inches(0.6)
d.styles["Normal"].font.name = "Calibri"
d.styles["Normal"].font.size = Pt(9.5)

USABLE = 9.8

# ---- title page
p = d.add_paragraph()
r = p.add_run("APR 70 site copy: ballot"); r.bold = True; r.font.size = Pt(26)
p = d.add_paragraph()
r = p.add_run("Writers-room copy pass, rounds 1 and 2  ·  7 September 2026  ·  "
              "one ballot per field")
r.font.size = Pt(12); r.italic = True
body_para(d, "DRAFT ONLY. Nothing in this document has been applied. The website, the CMS and the "
             "databases were not modified in any way. This is a voting sheet.",
          size=10.5, bold=True, color=RED, space_after=10)

heading(d, "How to vote", 13)
body_para(d,
 "Every field the site shows a reader that either changed in round 1, changed in round 2, or drew a "
 "note from one of the four chairs gets its own table below. Tick ONE box per field.\n"
 "•  BEFORE (staging) keeps the live text exactly as it is today.\n"
 "•  v1 takes the first draft. v2 takes the second draft.\n"
 "•  A critic note row is a vote too. Ticking a chair's note means: apply this note to "
 "whichever version I ticked. Where the chair proposed replacement wording, that wording is printed "
 "in the note row and ticking it means play his line.\n"
 "•  MY REWRITE is the last row of every table. Type your own version there and it beats "
 "everything above it.\n"
 "•  Fields that did not change and drew no note are listed in one compact table at the end of "
 "each page's section, with a single box in case you want to rewrite one anyway. Nothing is hidden.\n"
 "The boxes are real Word checkboxes. Click one and it fills in.")

heading(d, "The rulings come first", 13, space_before=6)
body_para(d,
 "Eight of the sixty-three round-one notes were not copy edits. They are questions no writer can "
 "settle inside a field, and all four chairs put at least one of them to you directly. They are the "
 "first section of this document because several of the field votes below depend on how they land. "
 "Each ruling is a small table: the question, the chairs' own words, an option per box, and an "
 "empty row for your ruling.")

heading(d, "The laws that bound both drafts", 13, space_before=6)
body_para(d, "LAW 1. No similes. The strings \"like a\" and \"like an\" appear nowhere in the "
             "AFTER text.\nLAW 2. No em dashes. A pause is an ellipsis or a full stop.\n"
             "LAW 3. Mamet-direct. Say what a thing is.\n"
             "Length. Every field is a fixed UI slot. No field grew more than 25% over the live "
             "text, and headings, labels, buttons, captions, credits, scene slugs and nav items are "
             "no longer than the original.\n"
             "Facts. Every name, number, date, place, title, link, arrow, markdown marker and "
             "highlight marker on the page today survives into v2, and round 2 added no claim that "
             "was not already there or asked for by a chair.")

heading(d, "What both rounds cost", 13, space_before=6)
body_para(d, f"Round 1: ${R1:.4f} across {len(R1_LEDGER['entries'])} calls. "
             f"Round 2: ${R2:.4f} across {len(R2_LEDGER['entries'])} calls. "
             f"Combined: ${R1 + R2:.4f}. Round 2 ran under a hard limit of $2.50 with an abort "
             f"guard in front of every call. Claude wrote every line in both drafts and Claude sat "
             f"on no chair: the four critics ran on four other models on two other providers.")

heading(d, "What is in this document", 13, space_before=6)
body_para(d, f"{len(RULINGS)} rulings  ·  {len(ORPHANS)} notes that name no single field  "
             f"·  {len(BALLOT_FIELDS)} field ballots across {inv['doc_count']} documents  "
             f"·  {TOTAL_ROWS - len(BALLOT_FIELDS)} unchanged, un-noted fields listed compactly "
             f"·  the four chairs' notes from both rounds, verbatim, at the back.")

toc = ["1.  The eight rulings", "2.  Notes not tied to one field"]
for i, doc0 in enumerate(inv["docs"], start=3):
    k = doc0["key"]
    nb = sum(1 for p_, _ in ROWS[k] if (k, p_) in BALLOT_FIELDS)
    tag = "  ·  PRIVATE SLATE, not public" if doc0.get("private") else ""
    toc.append(f"{i}.  {doc0['page']}   ({doc0['route']})   —  {nb} ballots of "
               f"{len(ROWS[k])} fields{tag}")
toc.append(f"{len(inv['docs']) + 3}.  Critic panel appendix: both rounds, all four chairs, verbatim")
for line in toc:
    body_para(d, line, size=10, space_after=2, indent=0.2)

# ---- rulings
d.add_page_break()
heading(d, "The eight rulings", 18)
body_para(d, "These are the questions the chairs carried to you. Tick one option per ruling, or "
             "write your own in the last row.", italic=True, space_after=10)

for rid, question, srcids, quotes, options in RULINGS:
    src = ", ".join(srcids)
    t = d.add_table(rows=0, cols=3)
    t.autofit = False
    thin_borders(t)
    WI = [0.4, 1.5, USABLE - 1.9]
    W = [Inches(x) for x in WI]

    row = t.add_row(); no_split(row)
    c = row.cells
    c[0].merge(c[2])
    cell_reset(row.cells[0])
    para(row.cells[0], f"{rid}   {question}", size=11, bold=True, first=True)
    para(row.cells[0], f"raised as note {src} in round 1", size=8, italic=True, color=GREY)
    shade(row.cells[0], SHADE_CAPTION)

    for chair, rnd, words in quotes:
        row = t.add_row(); c = row.cells
        for i in range(3):
            c[i].width = W[i]
        cell_reset(c[0])
        para(c[1], f"{CHAIR_NAME[chair]}\nround {rnd}", size=9, bold=True, first=True, color=BLUE)
        para(c[2], f"“{words}”", size=9, italic=True, first=True)

    for opt in options:
        row = t.add_row(); c = row.cells
        for i in range(3):
            c[i].width = W[i]
        put_checkbox(c[0])
        para(c[1], "OPTION", size=8, bold=True, color=GREY, first=True)
        para(c[2], opt, size=9.5, first=True)

    row = t.add_row(); c = row.cells
    for i in range(3):
        c[i].width = W[i]
    put_checkbox(c[0])
    para(c[1], "MY RULING", size=9, bold=True, first=True)
    cell_reset(c[2])
    min_height(row, 0.9)
    set_grid(t, WI)

    d.add_paragraph().paragraph_format.space_after = Pt(8)

# ---- orphan notes
d.add_page_break()
heading(d, "Notes not tied to one field", 18)
body_para(d, "Every remaining note from either round that names more than one field, or none. They "
             "are here rather than dropped. Each gets a box in case you want it carried into round 3. "
             "The eight notes the chairs filed as rulings are not repeated here; they are the "
             "section above.",
          italic=True, space_after=8)

t = d.add_table(rows=1, cols=4)
t.autofit = False
thin_borders(t)
WI = [0.4, 1.4, 1.5, USABLE - 3.3]
W = [Inches(x) for x in WI]
hdr = t.rows[0].cells
for i, txt in enumerate(["carry", "Chair · round", "Where it lands", "The note"]):
    hdr[i].width = W[i]
    cell_reset(hdr[i])
    para(hdr[i], txt, size=8.5, bold=True, first=True)
    shade(hdr[i], SHADE_CAPTION)
for n in ORPHANS:
    row = t.add_row(); c = row.cells
    for i in range(4):
        c[i].width = W[i]
    put_checkbox(c[0])
    para(c[1], f"{CHAIR_NAME[n['chair']]}\nround {n['round']}  ·  {n['id']}", size=8.5,
         bold=True, first=True, color=BLUE)
    para(c[2], f"{n['doc']}\n{n['path']}", size=8, mono=True, first=True)
    para(c[3], n["quote"], size=9, first=True)
    if n.get("ask"):
        para(c[3], n["ask"], size=9)
    if n.get("dec"):
        para(c[3], f"Round-1 ledger: {DEC_LABEL[n['dec']]}. {n['why']}", size=8, color=GREY)
set_grid(t, WI)

# ---------------------------------------------------------------- field ballots


def field_table(document, doc0, path):
    key = doc0["key"]
    before, a1, a2 = texts_of(key, path)
    notes = NOTES_BY_FIELD.get((key, path), [])

    t = document.add_table(rows=0, cols=3)
    t.autofit = False
    thin_borders(t)
    WI = [0.4, 1.45, USABLE - 1.85]
    W = [Inches(x) for x in WI]

    # caption row
    row = t.add_row(); no_split(row)
    row.cells[0].merge(row.cells[2])
    cap = row.cells[0]
    cell_reset(cap)
    p = cap.paragraphs[0]
    p.paragraph_format.space_after = Pt(1)
    r = p.add_run(f"{doc0['page']}   ·   "); r.bold = True; r.font.size = Pt(9.5)
    r = p.add_run(pretty_path(path)); r.font.name = "Consolas"; r.font.size = Pt(9)
    r = p.add_run(f"   ·   {field_kind(path)}"); r.font.size = Pt(9); r.italic = True
    if notes:
        chairs = sorted({CHAIR_NAME[n["chair"]].split()[-1] for n in notes})
        r = p.add_run(f"   ·   {len(notes)} note{'s' if len(notes) > 1 else ''} "
                      f"({', '.join(chairs)})")
        r.font.size = Pt(9); r.bold = True; r.font.color.rgb = RED
    shade(cap, SHADE_CAPTION)

    def option(label, text, italic=False, color=None, sublabel=None):
        row = t.add_row()
        c = row.cells
        for i in range(3):
            c[i].width = W[i]
        put_checkbox(c[0])
        para(c[1], label, size=9, bold=True, first=True)
        if sublabel:
            para(c[1], sublabel, size=7.5, color=GREY)
        para(c[2], text, size=9.5, italic=italic, color=color, first=True)
        return row

    option("BEFORE", before, sublabel="the live text on staging")
    if a1 == before:
        option("v1", "same as BEFORE  (round 1 ruled KEEP)", italic=True, color=GREY,
               sublabel="first draft")
    else:
        option("v1", a1, sublabel="first draft")
    if a2 == a1:
        option("v2", "same as v1  (round 2 left it standing)", italic=True, color=GREY,
               sublabel="second draft")
    else:
        option("v2", a2, sublabel="second draft")

    for n in notes:
        row = t.add_row()
        c = row.cells
        for i in range(3):
            c[i].width = W[i]
        put_checkbox(c[0])
        para(c[1], CHAIR_NAME[n["chair"]], size=9, bold=True, first=True, color=BLUE)
        para(c[1], f"round {n['round']}  ·  {n['id']}", size=7.5, color=GREY)
        para(c[2], n["quote"], size=9, first=True)
        if n.get("ask"):
            para(c[2], n["ask"], size=9, bold=True)
        if n.get("dec"):
            para(c[2], f"Round-1 ledger: {DEC_LABEL[n['dec']]}. {n['why']}", size=8, color=GREY)
        else:
            para(c[2], "Round 2, new note. Not yet actioned.", size=8, color=GREY)

    row = t.add_row(); no_split(row)
    c = row.cells
    for i in range(3):
        c[i].width = W[i]
    put_checkbox(c[0])
    para(c[1], "MY REWRITE", size=9, bold=True, first=True)
    cell_reset(c[2])
    min_height(row, 1.2)
    set_grid(t, WI)

    document.add_paragraph().paragraph_format.space_after = Pt(6)


TABLE_COUNT = 0
COMPACT_ROWS = 0

for doc0 in inv["docs"]:
    key = doc0["key"]
    d.add_page_break()
    heading(d, doc0["page"], 18)
    tag = "   ·   PRIVATE SLATE, not public" if doc0.get("private") else ""
    body_para(d, f"{doc0['route']}   ·   {key}{tag}", size=9, italic=True, space_after=3)
    ballots = [p for p, _ in ROWS[key] if (key, p) in BALLOT_FIELDS]
    quiet = [p for p, _ in ROWS[key] if (key, p) not in BALLOT_FIELDS]
    nnotes = sum(len(NOTES_BY_FIELD.get((key, p), [])) for p in ballots)
    body_para(d, f"{len(ROWS[key])} fields.  {len(ballots)} on the ballot "
                 f"({nnotes} critic note{'s' if nnotes != 1 else ''} attached).  "
                 f"{len(quiet)} unchanged and un-noted, listed at the end of this section.",
              size=9, space_after=8)

    for path in ballots:
        field_table(d, doc0, path)
        TABLE_COUNT += 1

    if quiet:
        heading(d, "Unchanged in both drafts, no critic note", 12, space_before=6)
        t = d.add_table(rows=1, cols=3)
        t.autofit = False
        thin_borders(t)
        WI = [0.55, 1.75, USABLE - 2.3]
        W = [Inches(x) for x in WI]
        hdr = t.rows[0].cells
        for i, txt in enumerate(["rewrite myself", "Field", "The live text (kept as is by both drafts)"]):
            hdr[i].width = W[i]
            cell_reset(hdr[i])
            para(hdr[i], txt, size=8, bold=True, first=True)
            shade(hdr[i], SHADE_CAPTION)
        for path in quiet:
            row = t.add_row(); c = row.cells
            for i in range(3):
                c[i].width = W[i]
            put_checkbox(c[0])
            para(c[1], pretty_path(path), size=8, mono=True, first=True)
            para(c[1], field_kind(path), size=7.5, italic=True, color=GREY)
            para(c[2], BEFORE[key][path], size=9, first=True)
            COMPACT_ROWS += 1
        set_grid(t, WI)

# ---------------------------------------------------------------- critic appendix

d.add_page_break()
heading(d, "Critic panel appendix", 18)
body_para(d,
 "Both rounds, all four chairs, verbatim and unedited. The excerpts attached to the field tables "
 "above are drawn from these notes; nothing here has been summarised, softened, ranked or "
 "paraphrased. Marco's ruling of 20 August 2026 governs the panel: Claude writes, Claude never "
 "scores. No Anthropic model sat on a chair in either round.", italic=True, space_after=8)

for rnd, folder in ((1, OUT / "critics"), (2, OUT2 / "critics")):
    for chair in CHAIR_ORDER:
        f = folder / f"{chair}.md"
        d.add_page_break()
        heading(d, f"{CHAIR_NAME[chair]}  ·  round {rnd}", 14)
        if not f.exists():
            body_para(d, "Seat unavailable. No note was returned.", italic=True)
            continue
        body = f.read_text()
        m = re.match(r"<!--(.*?)-->\s*", body, re.S)
        meta = ""
        if m:
            meta = m.group(1).strip()
            body = body[m.end():]
        body_para(d, f"{CHAIR_LENS[chair]}   ·   {meta}", size=8, italic=True, space_after=6)
        for line in body.split("\n"):
            if not line.strip():
                continue
            body_para(d, line.rstrip(), size=9.5, space_after=3)

DEST.parent.mkdir(parents=True, exist_ok=True)
d.save(str(DEST))
SCRATCH.parent.mkdir(parents=True, exist_ok=True)
shutil.copy2(DEST, SCRATCH)

# ---------------------------------------------------------------- report

bad_probes = [x for x in CHECKED_PROBES if not x[3]]
print(f"field ballots (tables)      : {TABLE_COUNT}")
print(f"  v1-changed                : {len(CHANGED_V1)}")
print(f"  v2-changed                : {len(CHANGED_V2)}")
print(f"  changed (union)           : {len(CHANGED)}")
print(f"  noted but unchanged       : {len(NOTED_ONLY)}")
print(f"compact rows (no change/note): {COMPACT_ROWS}")
print(f"total fields                : {TOTAL_ROWS}  (ballots + compact = "
      f"{TABLE_COUNT + COMPACT_ROWS})")
print(f"round-1 notes               : {len(v2_notes.NOTES)}")
print(f"round-2 notes               : {len(R2_NOTES)}")
print(f"note placements on fields   : {sum(len(v) for v in NOTES_BY_FIELD.values())}")
print(f"orphan notes                : {len(ORPHANS)} -> {[o['id'] for o in ORPHANS]}")
print(f"probe mismatches            : {len(bad_probes)} {bad_probes}")
print(f"rulings                     : {len(RULINGS)}")
print(f"checkboxes written          : {_cbid[0] - 90000}")
print(f"docx -> {DEST}")
print(f"docx -> {SCRATCH}")
