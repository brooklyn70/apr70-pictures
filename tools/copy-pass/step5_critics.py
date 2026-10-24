#!/usr/bin/env python3
"""Pass 5: the house critic panel. Welles -> Sturges -> Riskin -> Capra, in sequence.
RULE (Marco, 2026-08-20): Claude writes, Claude never scores. No Anthropic model here.
Replies are saved VERBATIM. Nothing is summarised, softened, ranked or paraphrased."""
import json, pathlib, sys, time
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import lib

PACKS = pathlib.Path.home() / ".claude/skills/auteur-critics/critics"
CRIT = lib.OUT / "critics"
CRIT.mkdir(parents=True, exist_ok=True)

dossier = (lib.OUT / "critic-dossier.txt").read_text()

ASK = """You are reading the public website copy of a film studio, before and after a house rewrite into the founder's voice.

Give your read as yourself:
1. Score BEFORE out of 10 and AFTER out of 10.
2. Name what the rewrite got right.
3. Name the lines that still fail. Quote them, say why, and say what to play instead.
4. End with the one ruling Marco has to make.
"""

ORDER = ["welles", "sturges", "riskin", "capra"]
only = sys.argv[1:] or ORDER

for chair in ORDER:
    if chair not in only:
        continue
    dest = CRIT / f"{chair}.md"
    if dest.exists() and dest.stat().st_size > 400:
        print(f"skip {chair} (done)"); continue
    seat = lib.CRITIC_SEATS[chair]
    pack = (PACKS / f"{chair}.md").read_text()
    tries = 3 if seat == "free" else 2
    err = None
    for a in range(tries):
        try:
            lib.ledger_guard(0.25)
            t0 = time.time()
            text, usage, usd = lib.call_seat(seat, pack, dossier + "\n\n" + ASK,
                                             max_tokens=(14000 if seat == "free" else 6000), temperature=0.7)
            elapsed = time.time() - t0
            est = " (ESTIMATE at $3/M in, $15/M out; xAI returns no cost)" if seat == "grok" else ""
            lib.ledger_add("5-critics", seat, lib.model_of(seat), usd, f"{chair}{est}",
                           prompt_tokens=usage.get("prompt_tokens") or usage.get("input_tokens"),
                           completion_tokens=usage.get("completion_tokens") or usage.get("output_tokens"))
            ptok = usage.get("prompt_tokens") or usage.get("input_tokens") or 0
            ctok = usage.get("completion_tokens") or usage.get("output_tokens") or 0
            head = (f"<!-- chair: {chair} | seat: {seat} | model: {lib.model_of(seat)} | "
                    f"provider: {lib.provider_of(seat)} | tokens in/out: {ptok}/{ctok} | "
                    f"cost: ${usd:.4f}{est} | {time.strftime('%Y-%m-%dT%H:%M:%S')} | {elapsed:.0f}s -->\n\n")
            dest.write_text(head + text.strip() + "\n", encoding="utf-8")
            print(f"{chair:9s} seat={seat:6s} in/out={ptok}/{ctok} ${usd:.4f} "
                  f"| ledger ${lib.ledger_load()['total_usd']:.4f}")
            err = None
            break
        except SystemExit:
            raise
        except Exception as e:
            err = e
            print(f"{chair} attempt {a+1}/{tries} failed: {e}")
            if a < tries - 1:
                time.sleep(20 * (a + 1))
    if err is not None:
        dest.write_text(f"<!-- chair: {chair} | seat: {seat} | model: {lib.model_of(seat)} -->\n\n"
                        f"**SEAT UNAVAILABLE.** {tries} attempts failed. Last error: `{err}`\n",
                        encoding="utf-8")
        print(f"{chair}: SEAT UNAVAILABLE recorded")
print("done. ledger $%.4f" % lib.ledger_load()["total_usd"])
