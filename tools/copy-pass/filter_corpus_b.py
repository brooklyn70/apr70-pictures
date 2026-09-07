#!/usr/bin/env python3
"""Filter voice-corpus-prompts.md down to sentences that are plainly Marco's own:
lowercase / dictated / terse. Drops pasted agent text, code, paths, markdown scaffolding."""
import re, sys, pathlib

SRC = pathlib.Path(sys.argv[1])
OUT = pathlib.Path(sys.argv[2])
text = SRC.read_text(encoding="utf-8")

kept = []
for para in re.split(r"\n\s*\n", text):
    p = para.strip()
    if not p or p.startswith("#"):
        continue
    # drop obvious agent/pasted/technical scaffolding
    if re.search(r"```|^\s*[-*]\s|^\d+\.\s|/Users/|https?://|`|\.ts\b|\.py\b|\.json\b|payload\.config|pnpm |npm |git |SSH|repo:", p, re.I | re.M):
        continue
    if len(p) > 900:
        continue
    lines = [l.strip() for l in p.split("\n") if l.strip()]
    if not lines:
        continue
    # dictated tell: starts lowercase, or heavy ellipsis / run-on comma style
    first = lines[0]
    lower_start = first[:1].islower()
    dictated = ("..." in p) or (".." in p) or lower_start
    if not dictated:
        continue
    # reject if it reads like a spec (many colons + capitalised headings)
    if p.count(":") > 4:
        continue
    kept.append(p)

body = "\n\n---\n\n".join(kept)
# cap
if len(body) > 42000:
    body = body[:42000].rsplit("\n\n---\n\n", 1)[0]
OUT.write_text(
    "# Corpus B (filtered) — sentences plainly Marco's own\n\n"
    "Filtered from voice-corpus-prompts.md: paragraphs that start lowercase or carry his dictated "
    "ellipsis/run-on habit, with pasted agent text, code, paths and markdown scaffolding removed. "
    "These are dictated instructions to agents, not public prose: read them for RHYTHM and DICTION, "
    "not for register.\n\n---\n\n" + body + "\n",
    encoding="utf-8",
)
print(f"kept paragraphs: {len(kept)}  bytes: {OUT.stat().st_size}")
