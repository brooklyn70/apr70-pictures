#!/usr/bin/env python3
"""Round 2, step 4b: the same four chairs, the same seats, the same packs, on the second draft.

RULE (Marco, 2026-08-20): Claude writes, Claude never scores. No Anthropic model here.
Replies are saved VERBATIM. Nothing is summarised, softened, ranked or paraphrased.
Each chair reads the dossier built for him, which quotes his own round-1 notes under the fields
they concerned. Capra's free seat retries up to 3 times and gets 14000 tokens: round 1 truncated
his read at 6000.
"""
import json, pathlib, sys, time
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import lib

lib.use_round2()
PACKS = pathlib.Path.home() / ".claude/skills/auteur-critics/critics"
CRIT = lib.OUT2 / "critics"
CRIT.mkdir(parents=True, exist_ok=True)

ASK = """This is round 2.

Your round-1 notes were applied where marked. Read the second draft and give your read as yourself:

1. Score v2 out of 10, against your own round-1 score. State both numbers.
2. Say which of your notes were answered and which were not.
3. Quote any line that still fails and say what to play instead.
4. End with the one ruling Marco must make.
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
    dossier = (lib.OUT2 / f"critic-dossier-v2-{chair}.txt").read_text()
    tries = 3 if seat == "free" else 2
    err = None
    for a in range(tries):
        try:
            lib.ledger_guard(0.25)
            t0 = time.time()
            text, usage, usd = lib.call_seat(seat, pack, dossier + "\n\n" + ASK,
                                             max_tokens=(14000 if seat == "free" else 6000),
                                             temperature=0.7)
            elapsed = time.time() - t0
            est = " (ESTIMATE at $3/M in, $15/M out; xAI returns no cost)" if seat == "grok" else ""
            lib.ledger_add("11-critics-v2", seat, lib.model_of(seat), usd, f"{chair}{est}",
                           prompt_tokens=usage.get("prompt_tokens") or usage.get("input_tokens"),
                           completion_tokens=usage.get("completion_tokens") or usage.get("output_tokens"))
            ptok = usage.get("prompt_tokens") or usage.get("input_tokens") or 0
            ctok = usage.get("completion_tokens") or usage.get("output_tokens") or 0
            head = (f"<!-- ROUND 2 | chair: {chair} | seat: {seat} | model: {lib.model_of(seat)} | "
                    f"provider: {lib.provider_of(seat)} | tokens in/out: {ptok}/{ctok} | "
                    f"max_tokens: {14000 if seat == 'free' else 6000} | "
                    f"cost: ${usd:.4f}{est} | {time.strftime('%Y-%m-%dT%H:%M:%S')} | {elapsed:.0f}s -->\n\n")
            dest.write_text(head + text.strip() + "\n", encoding="utf-8")
            print(f"{chair:9s} seat={seat:6s} in/out={ptok}/{ctok} ${usd:.4f} "
                  f"| round2 ledger ${lib.ledger_load()['total_usd']:.4f}")
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
        dest.write_text(f"<!-- ROUND 2 | chair: {chair} | seat: {seat} | model: {lib.model_of(seat)} -->\n\n"
                        f"**SEAT UNAVAILABLE.** {tries} attempts failed. Last error: `{err}`\n",
                        encoding="utf-8")
        print(f"{chair}: SEAT UNAVAILABLE recorded")
print("done. round-2 ledger $%.4f" % lib.ledger_load()["total_usd"])
