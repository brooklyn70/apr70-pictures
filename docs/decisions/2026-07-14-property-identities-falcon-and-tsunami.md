# Property identities — the Falcon is Da Hook, Tsunami is Sea Gate

**Date:** 2026-07-14
**Status:** Ruling by Marco. Binding.
**Read before:** any work that walks SharedData property folders, the vault's
`11.01 Active Properties`, or the `projects` table — an agent that trusts the
folder names alone will get both of these wrong.

---

## The slate is still ten

This ruling renames nothing on the slate. It resolves two names that look like
properties in the file tree but are not.

## 1. "The Maltese Falcon" is Da Hook

**Da Hook** is the property. **The Maltese Falcon** is its *source text* —
Dashiell Hammett's novel, now public domain. Da Hook relocates it to Red Hook,
Brooklyn, in the fall of 1970.

The vault already encodes this and should be trusted over the folder name:
`11.01 Active Properties/212-da-hook/01 MOC - The Maltese Falcon.md` names the
project as `[[00 Project - Da Hook]]`, and lists the characters as Hammett's —
Sam Spade, Brigid O'Shaughnessy, Joel Cairo, Kasper Gutman.

**Therefore `/Volumes/SharedData/11-07-maltese-falcon/` is not a property.** It
holds Da Hook's source and reference material — the Huston film, the book cover,
the Brooklyn/DUMBO/elevated-train location plates. It is the reason that folder
has no entry in the `projects` table and no folder under `11.01 Active
Properties`: there is nothing missing, it was never a property.

Treat those assets as belonging to **Da Hook**.

### The pattern behind it

Da Hook is not a one-off. **Two properties are built on public-domain Dashiell
Hammett**, and each carries its source text as a separate MOC:

| Property | Source text (public domain) | MOC in the vault |
|---|---|---|
| Da Hook | *The Maltese Falcon* | `212-da-hook/01 MOC - The Maltese Falcon.md` |
| Sea Gate | *Red Harvest* | `212-sea-gate/01 MOC - Red Harvest.md` |

Every other property's MOC is named for the property itself. These two are the
only ones where the MOC names a *book* rather than the film — which is precisely
why they read like extra properties when you skim the tree, and why an agent
scanning filenames invents an eleventh title.

## 2. The film is SEA GATE. "TSUNAMI" is dead.

**SEA GATE is the canonical title.** Marco's ruling, 2026-07-14. It is the title
of the film, the name of the property, and the slug in the CMS (`sea-gate`).

The property was formerly titled **TSUNAMI**, and an earlier note
(`marco-notes-2026-06-15-direction-reset.md`) drew a deliberate distinction —
film called TSUNAMI, town called Sea Gate, "keep the real place on the page."
**That distinction is overruled.** The film and the town now share the name.

TSUNAMI has been eliminated from the property entirely — 46 files renamed and 54
rewritten, including the three Final Draft title pages and the
`gen_redharvest_*.py` generators (which still wrote `TSUNAMI_*.fdx` and would
have resurrected the name on their next run):

    11.01 Active Properties/212-sea-gate/14-final-draft/SEA_GATE_feature_v01.fdx
                                                        SEA_GATE_feature_v02.fdx
                                                        SEA_GATE_feature_v03.fdx   <- latest

**If you find the word TSUNAMI anywhere, it is wrong. Change it.** Do not treat
an older document as authority against this ruling; Marco makes the titles.

---

## Why this is written down

Both entries are the same shape: **the file tree disagrees with the canon, and
the canon wins.** Nothing in the folder names tells you that `11-07` is source
material rather than a property. Nothing told you the film had been retitled.
An agent that enumerates directories and believes them will report an eleventh
property and a script called TSUNAMI — and both errors look perfectly reasonable.

Read the canon, not the folder names. And when Marco rules, that *is* the canon —
an older file saying otherwise is a stale artifact, not a counter-argument.
