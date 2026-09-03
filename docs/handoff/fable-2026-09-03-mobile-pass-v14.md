# Handoff — 2026-09-03 — mobile pass, Brooklyn fold, v14 shipped (Fable 5.1)

**State:** `main` carries the mobile pass (PR #5), the Brooklyn copy (PR #6), and the v14 bump. `SITE_VERSION` = v14. Deployed to the NAS stack (staging.apr70.com) from the worktree `~/websites/apr70-website/v10-poc` with a scratch copy of the deploy script (local-DB checks skipped for code-only runs; canonical script under `_deploy/` unchanged). Verified on the public host at 375x812 @2x: six routes 200, no text under 13px, nav 45px / toggle 44px, folds 4:5, gallery on the 1024 tier, header hides on scroll.

**What shipped in v14** (numbers in `BRIEF.md` and the MASTER-RECAP v14 row): gallery srcset on work pages; hero original-as-tier + cover-crop `sizes`; 4:5 phone folds; header hide-on-scroll + 44px targets; 13px mono floor; quicker phone splash; font re-subset (12KB); the 2026-09-02 brand housekeeping; the home fold "Brooklyn, before it was a brand." (DB via SQL, copy canon in the SharedData vault archive, seed-v9 fallback to that path).

**Closed:** the layered-cinema POC, three attempts, all killed. Record: `docs/decisions/2026-09-02-layered-cinema-poc-no-go.md`. Previous handoff (the POC's) is in `archive/`.

**Lessons that now live in files:** Tailwind v4 `[hidden]` sits in `@layer base` with `!important` and cannot be un-hidden from site CSS (`docs/architecture/themes-and-ai.md`); the context meter no longer bills image payloads (CLAUDE.md rule 14); NAS Docker builds need `network: host` (docker-compose.yml comment); for design work, show the direction before building it (decision doc).

**Open:** nothing blocking. Candidates: the copy line on the A Need Grows in Brooklyn project page itself (Marco asked whether it is there; it is on the home page only); the canonical deploy script's local-DB preflight for code-only deploys; production-quality fills are not needed (POC dead).
