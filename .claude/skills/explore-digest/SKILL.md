---
name: explore-digest
description: >
  Use BEFORE dispatching any parallel Explore/Task subagents for codebase or document
  recon. Prevents the context-budget blowout that trips the rule-14 context gate mid-task
  and forces a premature handoff. Triggers: "explore the codebase", "search across",
  "map the repo", "find everywhere", "look into how X works", any fan-out of 2+ agents.
---

# explore-digest — cheap recon that doesn't blow the context gate

**The mistake this fixes (from your own logs):** "3 explore agents in parallel consumed
majority of token budget" → the rule-14 gate fired *during recon, before real work started*
→ forced a handoff with nothing shipped. Parallel Explore is useful, but raw file dumps
flood the context window. This makes recon return *answers*, not *haystacks*.

## Rules

1. **Cap parallelism at 2.** Never fan out more than 2 Explore/Task agents at once.
   Sequence the rest. More agents ≠ faster here — they race the context gate.

2. **Each agent returns a DIGEST, never raw content.** Every dispatched agent must end with
   exactly this shape and nothing else:
   - **Answer:** 1–3 sentences directly answering the dispatch question.
   - **Files:** up to 8 `path:line` references that matter (no file bodies).
   - **Next:** one line — what to open/do next, if anything.

3. **Forbid dumps.** The agent must NOT paste file contents, full directory listings, or
   long code blocks back. If it needs to show code, it quotes ≤5 lines with a `path:line`.

4. **Parent merges digests; parent does NOT re-read everything.** Act on the digest. Only
   open a specific `path:line` if you're about to edit it.

## How to dispatch (template)

> Explore <scope> to answer: "<precise question>". Return ONLY:
> Answer (1–3 sentences), Files (≤8 path:line), Next (1 line).
> Do NOT paste file contents or directory listings. Quote ≤5 lines max if essential.

## Why it pays

Recon stays well under the ~250KB gate, so execution happens in the SAME session instead
of a cold restart. Directly attacks the #1 cost in the insights report: cold-restart
handoffs (63% of sessions). One less handoff per task = real time + token savings.
