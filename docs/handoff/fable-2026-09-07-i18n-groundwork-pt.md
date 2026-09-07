# Handoff — i18n groundwork + Portuguese first draft (Fable 5.1, 2026-09-07)

**Branch:** `i18n/groundwork` (worktree `~/websites/apr70-website/v10-i18n`, based on `main` at the v14 merge `aff7329`).
**State:** all code committed on the branch; NOTHING deployed; NAS, staging and apr70.com untouched. English site behaviour is byte-identical except hreflang/og:locale/inLanguage additions.
**Rehearsal DB:** local Docker container `apr70-i18n-postgres` on `127.0.0.1:5433` (user/pass `postgres`), a fresh copy of the NAS database taken 2026-09-07 15:47 with the i18n migration applied and Portuguese content in the `pt` locale. Pre-migration dump: scratchpad `before-i18n-migration.pgc` (session-scoped; retake from the NAS if gone).

## What shipped on the branch (in commit order)
1. `cms/src/locales.ts` — shared locale constant (en default, pt/it/fr/de). Web imports it via the `site-locales` alias.
2. CMS: Payload `localization` (fallback: true); 195 fields `localized: true` (inventory in `docs/i18n/localized-fields.md`); `Media.aiFrame` stored AI Mark flag + `backfill-ai-mark.ts` (39/206 flagged); `SiteSettings.enabledLocales` (the public gate, default `['en']`); migration `20260907_195421_i18n_localization.ts` with a HAND-WRITTEN data move (Payload's generated migration would have dropped 631 English columns) — rehearsed up/down/up with zero mismatches across 1019 values (`docs/i18n/migration-rehearsal-2026-09-07.md`); `seed-v9.ts --locale=<code>`.
3. Web: `middleware.ts` locale rewrite (`/pt/slate` → `/slate` with `locals.locale`), `i18n.routing: 'manual'`; non-enabled locales 404; locale-keyed fetch cache and `&locale=&fallback-locale=en` on the REST calls; `<html lang>`, hreflang + x-default, per-locale canonical, `og:locale`, `inLanguage`, sitemap alternates; `LanguageSwitcher.astro` (mono keycodes, header + footer, renders nothing with one locale); stored AI Mark consumed with the regex as English fallback; small non-CMS dictionary with a draft `pt` block.
4. Portuguese: `cms/scripts/translate-locale.ts` (`translate:extract|draft|apply --locale=pt`), replayable draft `docs/i18n/drafts/pt.json` (618 fields, claude-opus-5), sign-off doc `docs/i18n/review/pt-2026-09-07.md`. English proven untouched.
5. Verification: `docs/i18n/web-verification-2026-09-07.md`, `docs/i18n/pt-verification-2026-09-07.md` + screenshots; mobile header wrap fix for longer locale labels.

## Marco's calls (open)
- `pt` vs `pt-BR` for the URL/og:locale (content was drafted in pt-BR usage). Cheap now, expensive after indexing.
- Switcher placement: header end + footer row (as built) or elsewhere.
- Read and sign off `docs/i18n/review/pt-2026-09-07.md`; corrections go in the admin PT tab or in `drafts/pt.json` + `translate:apply --force`.
- The `/work/[slug]` hero fold never emitted `data-ai-frame`; left as is (pre-existing), needs a ruling.

## Deploy order when ruled (do not run without Marco's go)
1. Merge `i18n/groundwork` → `main` (PR). `pnpm -C cms preflight` exit 0 (done on the branch).
2. Diff `site_settings` local vs NAS first (rule 16). NAS backup dump is automatic in `_deploy/deploy-v10-to-nas.sh`.
3. Deploy with `MACREPO=~/websites/apr70-website/v10-i18n BRANCH=i18n/groundwork` or from `main` after merge. The migrate service runs migrations BEFORE the new cms starts (existing pattern).
4. On staging: run `translate:apply --locale=pt` from `drafts/pt.json` (or copy the `_locales` rows), then tick `pt` in Site Settings → Languages → Enabled locales. Only then is `/pt/` public.
5. Vault canon `11.12 V9 Build/02-copy/pt/` is written only after sign-off.

## Also produced this session (separate deliverable, not site code)
Writers-room "compound writing" pass over the live English copy into Marco's voice, with the critic panel: `tools/copy-pass/`, `docs/copy-pass/2026-09-07/`, the Word document on SharedData `10-03-website-assets/copy-pass-2026-09-07/`, vault twin `11.03 Company Ops/00 Website - Copy Pass 2026-09-07.md`. DRAFT ONLY, nothing applied.
