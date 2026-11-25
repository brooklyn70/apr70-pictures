# Decision: The Mayors is public. All ten properties are on the public slate

**Date:** 2026-11-22
**Status:** Active (the law). Supersedes `2026-07-13-ten-properties-mayors-private.md`.
**Ruling (Marco, 2026-11-22):** "take the mayors off private. let it shine. if anyone is interested in producing it we'll face the legal hurdles together. no need to keep it in the dark. it's a good project. make that the law."

## What it means

- All ten properties are public. The slate count is ten, and every page that states it counts it from the public slate (`publicSlate=true`), never from a literal.
- `projects` row `mayors`: `publicSlate=true`, with a `slateOrder` among the ten. `/work/mayors` returns 200.
- Retire every "nine public", "one private", "travels only inside private materials" and "legal counsel review" line, in all three layers (live DB, seed and copy canon, code). See CLAUDE.md hard rule 16.
- No mayor portrait anywhere on the site (standing rule; the gallery waits on the metadata check and Marco's ruling).

## Where the switch lives

- Code already follows `publicSlate`: `fetchV9SlateProjects` and `fetchDivisionSlate` filter on it, and `/work/[slug]` redirects only when it is off. `/llms.txt`, `/llms-full.txt` and the sitemap read the same fetcher.
- Not automatic: the `/slate` and Home lists are CMS rows (`v9-slate` and `v9-home`, block `slateList`, field `rows`). The Mayors needs its own row there.
- Re-seed risk: `cms/scripts/seed-v9.ts` sets `publicSlate=false` on every project without a canon `properties/*.md` file. Until the canon has a Mayors file, a re-seed hides The Mayors again.

## History

- 2026-07-13: The Mayors held private while counsel review completed (superseded file above, kept for its restore recipe).
- 2026-11-22: Marco lifts it (this file).
