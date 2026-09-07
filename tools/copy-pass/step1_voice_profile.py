#!/usr/bin/env python3
import pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import lib

S = pathlib.Path("/private/tmp/claude-501/-Users-marco-websites-apr70-website/2251e5c8-4793-420f-af9f-38fc6b2b3078/scratchpad")
corpusA = (S / "voice-corpus-marco.md").read_text(encoding="utf-8")
corpusB = (lib.OUT / "corpus-b-filtered.md").read_text(encoding="utf-8")
creed = pathlib.Path("/Users/marco/vault/10 Work/11 APR70 Pictures/11.03 Company Ops/2026-05-20-vision-mission-excerpt.md").read_text(encoding="utf-8")

SYSTEM = """You are the house editor of APR 70 Pictures, building a working voice profile of the founder, Marco Caruso, so that a rewrite of the studio's public website copy can be done in his own voice.

You are reading three things: (A) 35 of his own sent emails, English and Italian, roughly 12,000 words, with first-read notes; (B) a filtered set of his dictated prompts to software agents (rhythm and diction only, never register); (C) the company creed he wrote.

Write ONE PAGE of Markdown. No preamble, no sign-off, no meta commentary. Sections, in this order and with these exact headings:

## How he sounds
Rhythm, sentence length, how he opens, how he closes. Be concrete and quantitative where you can.

## What he does
Decides in menus (A/B/C, "tell me A or B"). Cites the source and the page number. Bilingual reflex. Endearments and nicknames. Flat closes on a decision. Bolds the thing that must be ruled. Whatever else the corpus actually shows.

## What he never does
## Vocabulary he actually uses
Two lists: words and phrasings that are demonstrably his, and words that would never come out of his mouth.

## Punctuation habits, and the law overrides
His real habits, then the two house laws that override them on public copy: LAW1 no "like a"/"like an" similes; LAW2 no em dashes (a pause is an ellipsis or a full stop). Say plainly that his own emails use the em dash as a pivot and that the law overrides that on public copy.

## Calibration: Marco's voice on the public site
One paragraph. The founder talking straight to a reader. Adult, warm, no pitch-deck gloss, no lowercase texting, no swearing, every claim concrete. Say what carries over from the emails and what does not.

## Evidence
Exactly ten quoted lines from the corpora, each with a one-line note on what it proves. Quote verbatim.

## The voice test
Exactly twelve numbered lines. Each a checkable pass/fail question the rewritten site copy must answer YES to."""

user = f"""=== CORPUS A — Marco's own sent email (primary) ===
{corpusA}

=== CORPUS B — filtered dictated prompts (secondary, rhythm and diction only) ===
{corpusB}

=== THE COMPANY CREED (his own writing) ===
{creed}

=== END OF CORPUS ===

Now write the voice profile. Begin your reply with the line "## How he sounds" and output nothing but the profile document itself. Do not continue, quote at length, or summarise the corpus."""

lib.ledger_guard(0.60)
txt, u, usd = lib.anthropic_call("opus", [(SYSTEM, True)], user, max_tokens=6000,
                                 effort="medium", stage="1-voice-profile", note="voice profile")
(lib.OUT / "voice-profile-marco.md").write_text(txt.strip() + "\n", encoding="utf-8")
print(f"tokens in={u.get('input_tokens')} out={u.get('output_tokens')} cost=${usd:.4f}")
print(f"ledger total=${lib.ledger_load()['total_usd']:.4f}")
