#!/usr/bin/env python3
"""
build-review.py — generate a translator sign-off review doc for one locale.

Reads docs/i18n/drafts/en.snapshot.json (the English source-of-truth snapshot)
and docs/i18n/drafts/<locale>.json (the draft translation, produced by
`pnpm -C cms translate:draft -- --locale=<code>`), and writes
docs/i18n/review/<locale>-<date>.md in the format hand-authored for the
Portuguese draft on 2026-09-07 (docs/i18n/review/pt-2026-09-07.md): a header
with model/date/hash/totals and correction instructions, a Contents list,
then one section per page in site order (Home, Slate, Craft, Methods,
Contact, Site chrome, then Projects in slate order), each localized field
shown as an EN line and a target-language line with the field path in mono,
and a compact table of media alts at the end.

Lexical rich-text fields (the few `richText`-typed fields, e.g.
`layout.1.rightBody` on some Projects) are stored in the snapshot/draft as a
Lexical JSON tree, not a plain string. This script renders them to plain text
(block nodes joined by blank lines, inline nodes concatenated, `linebreak`
nodes become `\n`) rather than the "(rich text — see admin)" placeholder used
by hand for the PT doc — the review doc should show the actual words.

Usage (stdlib only, python3):
    python3 tools/i18n-review/build-review.py --locale=it
    python3 tools/i18n-review/build-review.py --locale=it --out /tmp/it-review.md
"""

from __future__ import annotations

import argparse
import datetime
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
DRAFTS_DIR = REPO_ROOT / "docs" / "i18n" / "drafts"
REVIEW_DIR = REPO_ROOT / "docs" / "i18n" / "review"
SNAPSHOT_PATH = DRAFTS_DIR / "en.snapshot.json"

# code -> (keycode shown in the doc, language name used in the header prose)
# Keep in lockstep with cms/src/locales.ts (keycode) and the LANGUAGES map in
# cms/scripts/translate-locale.ts (name).
LOCALE_META = {
    "pt": {"keycode": "PT", "name": "Brazilian Portuguese", "slug": "pt"},
    "it": {"keycode": "IT", "name": "Italian", "slug": "it"},
    "fr": {"keycode": "FR", "name": "French", "slug": "fr"},
    "de": {"keycode": "DE", "name": "German", "slug": "de"},
}

PAGE_ORDER = [
    ("v9-home:v9-home", "Home", "/"),
    ("v9-slate:v9-slate", "Slate", "/slate"),
    ("v9-craft:v9-craft", "Craft", "/craft"),
    ("v9-methods:v9-methods", "Methods", "/methods"),
    ("v9-contact:v9-contact", "Contact", "/contact"),
]
CHROME_KEY = ("site-settings:site-settings", "Site chrome (Site Settings)", None)

PROJECT_ORDER = [
    ("a-need-grows-in-brooklyn", "A Need Grows in Brooklyn"),
    ("la-dolce-vita", "L.A. Dolce Vita"),
    ("sea-gate", "Sea Gate"),
    ("alpha-yy", "Alpha YY"),
    ("da-hook", "Da Hook"),
    ("the-movement", "The Movement"),
    ("cleopatra", "Cleopatra"),
    ("shadowmaster", "Shadowmaster"),
    ("u-bruculinu", "U Bruculinu"),
    ("mayors", "The Mayors (publicSlate=false — not yet on the public /slate)"),
]


# ── Lexical -> plain text ───────────────────────────────────────────────

def lexical_to_text(tree) -> str:
    """Render a Lexical JSON tree to plain text: block nodes -> paragraphs
    joined by a blank line, inline text/linebreak nodes concatenated."""
    root = tree.get("root", tree) if isinstance(tree, dict) else tree

    def render_inline(node) -> str:
        if not isinstance(node, dict):
            return ""
        t = node.get("type")
        if t == "text":
            return node.get("text", "") or ""
        if t == "linebreak":
            return "\n"
        return "".join(render_inline(c) for c in node.get("children", []) or [])

    blocks = []
    for node in (root.get("children", []) if isinstance(root, dict) else []) or []:
        text = render_inline(node)
        blocks.append(text)
    return "\n\n".join(b for b in blocks if b != "").strip()


def is_lexical(value) -> bool:
    return isinstance(value, dict)


# ── Markdown rendering (mirrors the hand-authored PT doc) ──────────────

def esc(s) -> str:
    if s is None:
        return "*(empty)*"
    return str(s).replace("\n", "  \n> ")


def render_value(value):
    if is_lexical(value):
        text = lexical_to_text(value)
        return text if text != "" else None
    return value


def field_block(path, en_val, target_val, keycode) -> str:
    en_str = render_value(en_val)
    tgt_str = render_value(target_val)
    return (
        f"**`{path}`**\n\n"
        f"> EN: {esc(en_str)}\n"
        f">\n"
        f"> {keycode}: {esc(tgt_str)}\n"
    )


def build_review(locale: str, snapshot: dict, draft: dict, out_path: Path) -> str:
    meta = draft.get("_meta", {})
    info = LOCALE_META[locale]
    keycode = info["keycode"]
    lang_name = info["name"]
    article = "an" if keycode[0] in "AEIOU" else "a"

    out: list[str] = []
    out.append(f"# APR 70 Pictures — {lang_name} ({locale}) translation draft, for sign-off")
    out.append("")
    out.append(
        f"**Draft by** `{meta.get('model', '?')}` **on** {meta.get('date', '?')} · "
        f"**source snapshot** `docs/i18n/drafts/en.snapshot.json` "
        f"(hash `{meta.get('sourceSnapshotHash', '?')}`) · "
        f"**draft file** `docs/i18n/drafts/{locale}.json`"
    )
    out.append("")
    out.append(
        "This is a first-draft machine translation. **Nothing here is public.** The "
        f"`{locale}` locale exists in the Payload admin (every field below has {article} {keycode} tab "
        "now) but the public site only serves a locale once it is ticked in **Site Settings → "
        "Languages → Enabled locales** — that checkbox is a separate, deliberate step, and it "
        "is not part of this draft."
    )
    out.append("")
    out.append(
        "**To correct a line:** either edit it directly in the admin (open the document, "
        f"switch the locale tab to {keycode}, edit the field, save — this is the fastest path "
        "for a handful of fixes), or edit the string in "
        f"`docs/i18n/drafts/{locale}.json` at the same field path shown below and re-run "
        f"`pnpm -C cms translate:apply -- --locale={locale} --apply --force` (the `--force` "
        "flag is required to overwrite a field that already carries a value — the normal "
        "idempotent run skips anything already translated)."
    )
    out.append("")
    out.append(
        f"**Totals:** {meta.get('docCount', '?')} documents · {meta.get('fieldCount', '?')} "
        f"fields translated · {meta.get('requests', '?')} model requests · "
        f"{meta.get('inputTokens', '?')} input tokens / {meta.get('outputTokens', '?')} output tokens."
    )
    out.append("")
    out.append("---")
    out.append("")
    out.append("## Contents")
    out.append("")
    for _, label, route in PAGE_ORDER:
        out.append(f"- [{label}](#{label.lower()})" + (f" (`{route}`)" if route else ""))
    out.append(f"- [{CHROME_KEY[1]}](#site-chrome-site-settings)")
    out.append(
        "- Projects: "
        + ", ".join(f"[{title.split(' (')[0]}](#{slug})" for slug, title in PROJECT_ORDER)
    )
    out.append("- [Media alts](#media-alts)")
    out.append("")
    out.append("---")
    out.append("")

    def emit_doc(key, heading, route_note=None):
        fields = snapshot.get(key, {})
        tgt_fields = draft.get(key, {})
        out.append(f"## {heading}")
        if route_note:
            out.append("")
            out.append(f"*Route: `{route_note}`*")
        out.append("")
        out.append(f"{len(fields)} localized fields.")
        out.append("")
        for path in fields:
            out.append(field_block(path, fields[path], tgt_fields.get(path), keycode))
            out.append("")
        out.append("---")
        out.append("")

    for key, label, route in PAGE_ORDER:
        emit_doc(key, label, route)

    emit_doc(CHROME_KEY[0], CHROME_KEY[1])

    for slug, title in PROJECT_ORDER:
        key = f"projects:{slug}"
        out.append(f'<a id="{slug}"></a>')
        heading = f"{title} · `/work/{slug}`" if "publicSlate" not in title else title
        emit_doc(key, heading)

    out.append("## Media alts")
    out.append("")
    media_keys = sorted(
        (k for k in draft if k.startswith("media:") and k != "_meta"),
        key=lambda k: int(k.split(":")[1]),
    )
    out.append(f"{len(media_keys)} media documents with a translated `alt`.")
    out.append("")
    out.append(f"| id | EN alt | {keycode} alt |")
    out.append("|---|---|---|")
    for k in media_keys:
        mid = k.split(":")[1]
        en_alt = str(snapshot.get(k, {}).get("alt", "")).replace("|", "\\|")
        tgt_alt = str(draft.get(k, {}).get("alt", "")).replace("|", "\\|")
        out.append(f"| {mid} | {en_alt} | {tgt_alt} |")
    out.append("")

    text = "\n".join(out) + "\n"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(text)
    return text


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--locale", required=True, choices=sorted(LOCALE_META.keys()))
    ap.add_argument(
        "--out",
        default=None,
        help="Output path (default: docs/i18n/review/<locale>-<date>.md, date from the draft's _meta.date)",
    )
    ap.add_argument(
        "--draft",
        default=None,
        help="Path to the draft JSON (default: docs/i18n/drafts/<locale>.json)",
    )
    args = ap.parse_args()

    if not SNAPSHOT_PATH.exists():
        print(f"build-review: missing {SNAPSHOT_PATH}", file=sys.stderr)
        return 1
    draft_path = Path(args.draft) if args.draft else DRAFTS_DIR / f"{args.locale}.json"
    if not draft_path.exists():
        print(f"build-review: missing {draft_path}", file=sys.stderr)
        return 1

    snapshot = json.loads(SNAPSHOT_PATH.read_text())
    draft = json.loads(draft_path.read_text())
    date = draft.get("_meta", {}).get("date") or datetime.date.today().isoformat()

    out_path = Path(args.out) if args.out else REVIEW_DIR / f"{args.locale}-{date}.md"
    text = build_review(args.locale, snapshot, draft, out_path)
    print(f"wrote {out_path} ({len(text.splitlines())} lines)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
