#!/usr/bin/env python3
"""One Opus 5 call per document. Rewrites the in-scope English site copy into Marco's voice."""
import json, pathlib, re, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import lib

inv = json.loads((lib.OUT / "inventory.json").read_text())
voice = (lib.OUT / "voice-profile-marco.md").read_text()

LAWS = """# THE HOUSE LAWS THAT BIND EVERY LINE YOU WRITE

LAW 1 — No similes. The strings "like a" and "like an" must not appear in any AFTER text. Say what the thing IS.
LAW 2 — NO EM DASHES. The character U+2014 must never appear in any AFTER text. A pause is an ellipsis or a full stop. (Marco's own emails use the em dash as their main pivot. This law overrides that on public copy.) En dashes inside date ranges that already exist in the BEFORE text stay exactly as they are.
LAW 3 — Mamet-direct. Say what a thing is. No hedges, no throat-clearing, no adjectives doing a fact's job.
"""

RULES = """# YOUR JOB

You are rewriting the reader-visible English copy of apr70.com into the founder's own voice, using the voice profile above. This is a DRAFT for his review. Nothing is being published.

You receive a JSON object: keys are field paths, values are the current live text (BEFORE). Return a JSON object with EXACTLY THE SAME KEYS and no others, each value a string.

HARD RULES

1. KEEP EVERY FACT. Names, titles, dates, places, keycodes, arrows (→), middots (·), highlight markers (==Title==), markdown emphasis (**bold**, *italic*), markdown links ([label](/path)), email addresses, URLs, placeholders, en dashes in date ranges: all survive verbatim. If the BEFORE says 1986, the AFTER says 1986.
2. ADD NOTHING. No new claim, no new number, no new promise, no new comparison. You may only re-say what is there.
3. DO NOT TRANSLATE. English in, English out.
4. LENGTH. Stay within plus or minus 25% of the BEFORE character count. These are fixed UI slots. Headings, labels, buttons, scene slugs, kickers, captions, credits and nav items must stay AS SHORT AS THE ORIGINAL or shorter. A one-word label stays one word.
5. KEEP RATHER THAN CHURN. If a field already reads as Marco's voice, return the EXACT original string, character for character. Do not paraphrase for the sake of activity. Most short labels, credits, quotes, citations and proper-noun captions should come back unchanged. Expect to keep a large share of the fields.
6. NEVER TOUCH A QUOTATION. Any field that is a quotation from a named person (pageQuote.quote, sections.N.quote), its citation (cite) or its source note (note) comes back EXACTLY as given. You do not rewrite Welles, Hitchcock, Lumet, Chekhov, King, Morrison, Kurosawa, Glass or Stewart.
7. heroLine fields were balloted by Marco on 2026-09-04. Return them EXACTLY unchanged, unless the line contains an em dash or a "like a"/"like an" simile, in which case fix only that.
8. Any field path ending in "#0", "#1", ... is one paragraph of a rich-text block. Rewrite each one on its own. Do not merge or split them, and never return an empty string.
9. Output ONLY the JSON object. No fence, no commentary, no explanation.

WHAT THE REWRITE IS FOR

The current copy is good but it is house-literary: it drifts toward the essayistic, stacks abstractions, and in places sounds written rather than said. Marco's voice is a man who has already checked, telling you the thing. Verdict first. Concrete nouns. A short sentence that ends the paragraph. No pitch-deck gloss. Warm, adult, and unhurried, never cute, never lowercase, never salesy.
"""

SYSTEM = [("# MARCO CARUSO — VOICE PROFILE\n\n" + voice + "\n\n" + LAWS + "\n" + RULES, True)]

out_path = lib.OUT / "after.json"
after = json.loads(out_path.read_text()) if out_path.exists() else {}

only = sys.argv[1:] or None
for doc in inv["docs"]:
    key = doc["key"]
    if only and key not in only:
        continue
    if key in after:
        print(f"skip {key} (done)"); continue
    payload = {}
    for f in doc["fields"]:
        if f["kind"] == "text":
            payload[f["path"]] = f["before"]
        else:
            for i, t in enumerate(f["before_texts"]):
                payload[f"{f['path']}#{i}"] = t
    body = json.dumps(payload, ensure_ascii=False, indent=1)
    maxtok = min(32000, max(6000, int(len(body) / 2.2)))
    lib.ledger_guard(0.30)
    txt, u, usd = lib.anthropic_call(
        "opus", SYSTEM,
        f"PAGE: {doc['page']}  ({doc['route']})\nDOCUMENT: {key}\n\n{body}\n\n"
        f"Return the JSON object now, same keys, values only.",
        max_tokens=maxtok, effort="medium", stage="3-rewrite", note=key)
    raw = txt.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw).strip()
    try:
        res = json.loads(raw)
    except Exception as e:
        (lib.OUT / f"_fail-{key.replace(':','_')}.txt").write_text(txt)
        raise SystemExit(f"{key}: bad JSON ({e}); raw saved")
    missing = set(payload) - set(res)
    extra = set(res) - set(payload)
    if missing or extra:
        raise SystemExit(f"{key}: key-shape guard failed. missing={sorted(missing)[:5]} extra={sorted(extra)[:5]}")
    after[key] = res
    out_path.write_text(json.dumps(after, ensure_ascii=False, indent=2) + "\n")
    kept = sum(1 for k in payload if res[k] == payload[k])
    print(f"{key:38s} fields={len(payload):3d} keep={kept:3d} in={u.get('input_tokens')} "
          f"cr={u.get('cache_read_input_tokens')} out={u.get('output_tokens')} ${usd:.4f} "
          f"| ledger ${lib.ledger_load()['total_usd']:.4f}")
print("done. ledger total $%.4f" % lib.ledger_load()["total_usd"])
