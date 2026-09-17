#!/usr/bin/env python3
"""Flatten the in-scope English snapshot into an ordered site-order inventory."""
import json, pathlib, sys, difflib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import lib

ROOT = pathlib.Path(__file__).resolve().parents[2]

# --- Lexical helpers, mirroring cms/scripts/translate-locale.ts ---------------

def lexical_texts(node, out=None):
    if out is None:
        out = []
    if not isinstance(node, (dict, list)):
        return out
    if isinstance(node, list):
        for n in node:
            lexical_texts(n, out)
        return out
    if node.get("type") == "text" and isinstance(node.get("text"), str) and node["text"].strip():
        out.append(node["text"])
    if isinstance(node.get("children"), list):
        lexical_texts(node["children"], out)
    if node.get("root"):
        lexical_texts(node["root"], out)
    return out


def lexical_reinsert(node, texts, idx=None):
    """Deep copy, replacing text-node strings in document order."""
    if idx is None:
        idx = [0]
    if isinstance(node, list):
        return [lexical_reinsert(n, texts, idx) for n in node]
    if not isinstance(node, dict):
        return node
    clone = dict(node)
    if clone.get("type") == "text" and isinstance(clone.get("text"), str) and clone["text"].strip():
        clone["text"] = texts[idx[0]]
        idx[0] += 1
    if isinstance(clone.get("children"), list):
        clone["children"] = lexical_reinsert(clone["children"], texts, idx)
    if clone.get("root"):
        clone["root"] = lexical_reinsert(clone["root"], texts, idx)
    return clone


def field_entry(path, value):
    if isinstance(value, str):
        return {"path": path, "kind": "text", "before": value}
    texts = lexical_texts(value)
    return {"path": path, "kind": "richtext", "before": "\n\n".join(texts),
            "before_texts": texts, "tree": value}

snap = json.loads((ROOT / "docs/i18n/drafts/en.snapshot.json").read_text())

PAGES = [
    ("v9-home:v9-home", "Home", "/"),
    ("v9-slate:v9-slate", "Slate", "/slate"),
    ("v9-craft:v9-craft", "Craft", "/craft"),
    ("v9-methods:v9-methods", "Methods", "/methods"),
    ("v9-contact:v9-contact", "Contact", "/contact"),
    ("site-settings:site-settings", "Site chrome", "(every page)"),
]

TITLES = {
    "a-need-grows-in-brooklyn": "A Need Grows in Brooklyn",
    "la-dolce-vita": "L.A. Dolce Vita",
    "sea-gate": "Sea Gate",
    "alpha-yy": "Alpha YY",
    "da-hook": "Da Hook",
    "the-movement": "The Movement",
    "cleopatra": "Cleopatra",
    "shadowmaster": "Shadowmaster",
    "u-bruculinu": "U Bruculinu",
    "mayors": "The Mayors",
}

# slate order, derived from v9-slate sections.2.rows.N.logline matched to project loglines
slate = snap["v9-slate:v9-slate"]
_r = [(int(k.split(".")[3]), v) for k, v in slate.items()
      if k.startswith("sections.2.rows.") and k.endswith(".logline")]
rows = [v for _, v in sorted(_r)]
projs = {k.split(":", 1)[1]: v for k, v in snap.items() if k.startswith("projects:")}
order, used = [], set()
for r in rows:
    best, bs = None, 0.0
    for slug, pv in projs.items():
        if slug in used:
            continue
        for f in ("logline", "shortLogline", "layout.0.logline"):
            t = pv.get(f)
            if not t:
                continue
            s = difflib.SequenceMatcher(None, r[:140].lower(), t[:140].lower()).ratio()
            if s > bs:
                bs, best = s, slug
    assert bs > 0.85, (bs, best, r[:60])
    order.append(best); used.add(best)
order += [s for s in projs if s not in used]  # mayors, private slate, last

inv = {"generated": "2026-09-07", "source": "docs/i18n/drafts/en.snapshot.json",
       "excluded": "media:* (image alt text; not reader-visible copy)",
       "slate_order": order, "docs": []}
total = 0
for key, label, route in PAGES:
    fields = [field_entry(p, v) for p, v in snap[key].items()]
    total += len(fields)
    inv["docs"].append({"key": key, "page": label, "route": route, "kind": "page",
                        "private": False, "fields": fields})
for slug in order:
    key = f"projects:{slug}"
    fields = [field_entry(p, v) for p, v in snap[key].items()]
    total += len(fields)
    inv["docs"].append({"key": key, "page": TITLES.get(slug, slug), "route": f"/work/{slug}",
                        "kind": "property", "private": slug == "mayors", "fields": fields})

inv["field_count"] = total
inv["doc_count"] = len(inv["docs"])
inv["word_count"] = sum(len(f["before"].split()) for d in inv["docs"] for f in d["fields"])
(lib.OUT / "inventory.json").write_text(json.dumps(inv, indent=2) + "\n")
print(f"docs={inv['doc_count']} fields={total} words={inv['word_count']}")
print("order:", order)
