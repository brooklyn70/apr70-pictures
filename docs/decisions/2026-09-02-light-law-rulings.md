# Decision — Light Law per-spec rulings answered (2026-09-02)

**Date:** 2026-09-02 · **Status:** ruled by Marco in session; binding on the next stills pass.
**Source of the questions:** `tools/still-regen/specs-light-law/*.json` `note` fields (written 2026-07-18) and the v13 handoff's rulings queue.
**Where the rulings now live:** appended to each spec's `note` as `RULINGS 2026-09-02 (Marco)`, so `regen.py` authors read them beside the prompts. This file is the paper trail.

| # | Property | Question | Ruling | Consequence for frames |
|---|---|---|---|---|
| 1 | Angib | Francine and Millie have no references; the prompts invented their faces | **Faces stand** | no regen for casting |
| 2 | Alpha YY | Is `Argentinian.jpg` Big Trouble? What of `housie-mousie.jpg`? | **Stands.** `housie-mousie.jpg` is the face of the antagonist "Marco", the neighborhood boss, "the face of evil" | his face may now be held in frame; the from-behind framing is no longer required |
| 3 | Cleopatra | Home dimension Brooklyn (canon page) or LA (old synopsis)? | **From Brooklyn, lives in LA. All LA-based** | the Brooklyn home frames in the Light Law set regenerate in LA; read the updated vault canon first (digest below) |
| 4 | Da Hook | Black and white (Gate-1 interim) or colour (the generated set)? | **Colour** | muted Eastman colour is canon; no B&W regen |
| 5 | U Bruculinu | Spelling: `u-brucculinu` (slug) vs "U Bruculinu" (vault) | **Bruculinu, single c** (Marco: "I guess"; confirmed by vault CANON.md, 2026-07-22) | rename queued in TASKS (slug, SharedData folder `11-12-u-brucculinu`, flat prefix `brucculinu-`, spec file). Canon also renames the cast: Sal Accardi, Agata Falcone, Don Gaetano Barone, Padre Antonino Barone; town Modica; Sal 28, born 1944. The Light Law spec used placeholder names and the wrong town, so its U Bruculinu frames regenerate after the cull |
| 6 | Movement | Period 2012 vs "contemporary"; the seven faces from `01-seven-students-fog.png` unruled | **2012. Keep the faces**, "doesn't matter for now" | MetroCard swipe stays; no block on generation |
| 7 | The Mayors | Casting; the sitting mayor | **The sitting mayor is the current mayor of New York. No casting yet** (no host cast) | faceless-silhouette convention and `publicSlate=false` pending counsel unchanged |
| + | La Dolce Vita | Marcello's look | **He has one**, created in Gemini and Grok: the vault-locked master (frontal, white tank, wavy dark hair with grey at the temples, mid-forties; prompt: "44-year-old Italian-Argentinian man, young Mastroianni blended with Pacino/De Niro intensity") | face ref `SharedData/00-01-vault-media/_vault-archive/2026-09-01-vault-media/09-visuals/310-dolce-vita/09z-moodboard/09z1-masters/marcello-di-bari-master-01.jpg` (+ `-02`). The pinstripe-and-cigarette portrait in the flat folder (`ldv-43-...marcello-2-v01.png`; webp twin in `_trash`) is an earlier, younger render of a different face: superseded, and `reference-manifest.md:42` still mislabels it "current cast ref" |
| + | Shadowmaster | Nova has no ruled face | **A young Elizabeth Taylor or Ava Gardner type** | described as a type in prompts; no real-person photo as ref, no likeness by name |

## Canon updates to read before regenerating (Cleopatra, U Bruculinu)

Marco: "you'll have to read the updates on both". Subagent digest of the vault folders (read-only, 2026-09-02), headline first:

- **Cleopatra:** the canon already matches the ruling: "born and raised in Brooklyn but now living in Los Angeles" (locked 2026-07-22, `00 Project - Cleopatra.md:22`). The Light Law spec followed an older page. The series-overview "all-LA reigns reset" draft still carries "Needs Marco" flags from 2026-06-14.
- **U Bruculinu:** CANON.md is filled (2026-07-21/22/24), title confirmed **U Bruculinu** (single c, so ruling 5 is now canon, not provisional). Names are ruled: **Sal Accardi**, **Agata Falcone**, **Don Gaetano Barone**, **Padre Antonino Barone**; the spec's placeholder names (Comparetto, Lo Verde, Calò Ferrara, Ignazio) do not exist in canon. Town locked as **Modica** (not Càlamonte in the Madonie). Sal is **28, born 1944** (supersedes 26/1946). No face reference ruled for Sal or Agata. A v19 combined ruling exists dated 2026-08-21.
- **Marcello:** found. A full Grok portrait prompt (`310-dolce-vita/09-visuals/grok-imagine-website-prompts-2026-06-12.md:88`) and Gemini-locked master references (`marcello-di-bari-master-01/02.jpg`, frontal, side, full-body) exist from June 2026; the Gemini lock note says to use the master as `@image1` for all Marcello stills. The pinstripe portrait in the flat folder (`ldv-43-...marcello-2-v01.png`) is that look.

Full digest:

#### Canon updates since 2026-07-18: Cleopatra, U Bruculinu, Marcello look

#### CLEOPATRA (310)

| Item | What canon says now | path:line | Changed since 07-18? |
|---|---|---|---|
| Home dimension | "born and raised in Brooklyn but now living in Los Angeles" — matches Marco's 2026-09-02 ruling exactly | `310-cleopatra/00 Project - Cleopatra.md:22` | YES — file updated 2026-07-22, after LIGHT-LAW (07-18) |
| Home dimension (EP101 logline) | "A divorced Sicilian-Brooklyn social worker in LA" | `310-cleopatra/10-episodes/ep101-the-awakening.md:13` | YES — created/updated 2026-07-22 |
| One-face rule / Cleo's look | "Appearance stays mostly consistent across dimensions; her life circumstances vary wildly." No filename/image reference (`07-cleopatra-01-cleo-k2a.png`) appears anywhere in vault markdown — images live only on SharedData now | `310-cleopatra/06-characters/character-310-cleopatra-cleo-modica.md:22` | NO — file dated 2026-07-08, untouched since |
| Kids, Kuna, Kai, Gittes, teacher(Ezra) | All character files (cleo-modica, ezra-thorne, kai-andersen, kuna, gittes, joe-martini, clayton-brill, amelia-vance) unchanged | `310-cleopatra/06-characters/*.md` (all dated 2026-07-08) | NO — none touched since 07-18 |
| Grandmother / "Tokyo Joe" | Not found as named entities anywhere in current canon. Ezra Thorne is "a Zen master and theoretical physicist in Tokyo" (old world-tour version) — not "Tokyo Joe." No grandmother character exists. | `310-cleopatra/06-characters/character-310-cleopatra-ezra-thorne.md:22` | N/A — not present in canon |
| Episodes / places | Only EP101 "The Awakening" has real content; EP102–110 remain stubs, titles "canon title; LA-reset TBD." No new/renamed episode titles locked yet. | `310-cleopatra/10-episodes/10-episodes.md:14-23` | Index updated 2026-07-22, but content unresolved |
| "Reigns reset" / all-LA flag | NOT resolved. `00f-series-overview.md` is still `status: draft`, dated 2026-06-14 (untouched since), and is riddled with "⚑ Needs Marco" flags — including the core bet itself ("If Marco wants to keep the literal globe-tour instead, this overview must be rebuilt"). Only the top-level project logline/EP101 logline (above) have actually been locked into the main project file since 07-18; the full series-overview document with per-episode/per-dimension detail is still an open proposal. | `310-cleopatra/00-series-overview/00f-series-overview.md:9,13,28,42,50,60,75,109-114` | NO change since 06-14 (predates LIGHT-LAW); still open |
| Visuals location | Vault is words-only now; gallery stills/PDFs moved off-vault to SharedData 2026-09-01 | `310-cleopatra/09-visuals/00 visuals — on NAS.md:13,15-17` | YES — created 2026-09-01, but no character-look text, just a path redirect |

#### U BRUCULINU (NRC)

| Item | What canon says now | path:line | Changed since 07-18? |
|---|---|---|---|
| Title spelling | **"U Bruculinu"** (single c) — consistent across CANON.md title, `00 Project` title, `01 MOC` title, and the folder name `nrc-ubrucculinu`. No double-c "Brucculinu" variant found in canon (double-c only appears once, as the given folder path in the task prompt). Matches Marco's "bruculinu I guess." | `nrc-ubrucculinu/CANON.md:9`; `nrc-ubrucculinu/00 Project - U Bruculinu.md:16` | Files updated 2026-07-21/22, after LIGHT-LAW |
| CANON.md stub vs filled | **Filled**, not a stub — locks logline, surnames, character grid, mark/backstory, "want." (2823 bytes, ~52 lines) | `nrc-ubrucculinu/CANON.md:1-52` | YES — `date updated: 2026-07-22`, mtime 2026-07-22 |
| Character names | Ruled with real names, NOT the placeholders in the task prompt. Lead = **Salvatore "Sal" Accardi**; love interest = **Agata Falcone** (surname corrected from earlier "Flacone" typo); power/antagonist = **Don Gaetano Barone**; mentor/priest = **Padre Antonino Barone** (Barone's cousin). "Sal Comparetto / Agata Lo Verde / Don Calò Ferrara / Padre Ignazio" do not appear anywhere in this project's canon. | `nrc-ubrucculinu/CANON.md:19-24`; `06-characters/character-nrc-ubrucculinu-bruculinu.md:10,15`; `06-characters/character-nrc-ubrucculinu-agata.md:8,14`; `06-characters/character-nrc-ubrucculinu-capo.md:10` | YES — character files dated 2026-07-24, CANON.md 2026-07-22 |
| Town | **Modica** (Sicily), locked — "Place: Modica (Sicily) · Brooklyn cold open only." Càlamonte/Madonie and Val di Noto-as-alternative only appear in early rejected research/concept files (`concept-development-2026-06-14.md`, `idea-set-rambo-vietnam-sicily-2026-07-21.md`), never in CANON.md or the Project file. Modica itself sits in the Val di Noto/Ragusa area, not Madonie. | `nrc-ubrucculinu/CANON.md:12`; `00 Project - U Bruculinu.md:26` | YES — ruled as of 07-21/22 |
| Lead's face / love interest's face | **No image or portrait reference ruled** in either character file — no filename, no "@image1," no Gemini/Grok mention. Only text description (age, backstory, voice) is locked. | `06-characters/character-nrc-ubrucculinu-bruculinu.md` (whole file, no image refs); `06-characters/character-nrc-ubrucculinu-agata.md` (whole file, no image refs) | Files dated 2026-07-24, but face/look specifically still open |
| Lead's age | **NOT "26, born 1946."** Now: **born 1944 in Modica, 28 in 1972.** File explicitly flags the old note superseded: "28 in 1972 (v13 page; the v03 note '~26' is superseded)." | `06-characters/character-nrc-ubrucculinu-bruculinu.md:18` | YES — dated 2026-07-24 |
| Most recent open ballot | `ubrucculinu-v19-combined-ruling-2026-08-21.md` — status "OPEN, awaiting Marco," gates v20 rewrite (scene-level dramaturgy fixes, not naming/geography) | `nrc-ubrucculinu/05-development-decisions/ubrucculinu-v19-combined-ruling-2026-08-21.md:1-111` | YES — most recent file in the project, still unruled |

#### DOLCE VITA (310) — Marcello's look

Found. Full Gemini/Grok portrait prompt and locked master-image references exist:

- **Grok prompt (source text):** full 35mm portrait prompt — "A 44-year-old Italian-Argentinian man... wavy dark hair with subtle grey at the temples... like a young Marcello Mastroianni blended with the intensity of Al Pacino and Robert De Niro..." — `310-dolce-vita/09-visuals/grok-imagine-website-prompts-2026-06-12.md:88`
- Canonical reference files listed: `marcello-di-bari-master-01/02.jpg`, `marcello-di-bari-frontal-chestup-master-01.jpg`, `marcello-di-bari-side-waistup-master-01.jpg`, `marcello-di-bari-fullbody-frontal-master-01.jpg` — `310-dolce-vita/09-visuals/grok-imagine-website-prompts-2026-06-12.md:91-99`
- **Gemini lock status:** "MARCELLO DI BARI — DONE (locked, Gemini)... Master generated via Gemini Web using Grok Marcello reference... Use this file as @image1 for all Marcello stills." File: `09z-moodboard/09z1-masters/marcello-di-bari-master-01.png` — `310-dolce-vita/09-visuals/gemini-imagine-website-prompts-2026-06-13.md:169-173`

Both files predate LIGHT-LAW (dated 2026-06-12/13) — not "changed since 07-18," but this is the ruled/locked Marcello reference and it is exactly what still-regen should be pointing at.


## What happens next

1. Marco's cull in Crop Studio continues on the frames as they are; the rulings above do not require re-culling, only the Cleopatra home frames and any U Bruculinu frames that the canon update contradicts are regenerated.
2. The regen for those frames runs under the Light Law with the rulings in the spec notes, natural light, prompts from the page.
3. Picks move to Payload after the cull (TASKS Phase 9 gate, Phase 11 pick flag).
