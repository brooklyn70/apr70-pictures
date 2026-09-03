#!/usr/bin/env python3
"""Subset self-hosted webfonts to Latin + Latin Extended coverage.

Runs fontTools.subset over every *.woff2 in web/public/fonts, restricting
glyph coverage to the Google Fonts "latin" + "latin-ext" Unicode ranges while
preserving OpenType layout features and (for variable fonts) all variation
axes (fvar/gvar/avar are kept intact -- fonts are NOT instanced to a single
weight/width/optical-size).

Output is written back over the same filename, flavor woff2.

Usage:
    /path/to/venv/bin/python tools/fonts/subset.py

Re-run any time source fonts are replaced. A backup of the fonts as they
stood before subsetting should be kept separately (see project docs) --
this script does not create one itself.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
FONTS_DIR = REPO_ROOT / "web" / "public" / "fonts"

# Google Fonts "latin" + "latin-ext" Unicode ranges.
UNICODES = (
    "U+0000-00FF,U+0100-024F,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,"
    "U+02DC,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1E00-1E9F,"
    "U+1EF2-1EFF,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,"
    "U+2215,U+FEFF,U+FFFD"
)

LAYOUT_FEATURES = (
    "kern,liga,dlig,onum,pnum,tnum,lnum,ss01,ss02,ss03,ss04,case,cpsp,"
    "smcp,c2sc,frac,sups,subs,ordn"
)

# Glyphs that must survive subsetting -- used only for the post-hoc
# verification pass in verify.py / the caller, not by the subset command
# itself (coverage is already guaranteed by UNICODES above).
REQUIRED_CODEPOINTS = [
    *(ord(c) for c in "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"),
    0x2018, 0x2019, 0x201C, 0x201D,  # typographic quotes
    0x2013, 0x2014,  # en/em dash
    0x00B7,  # middle dot
    0x2026,  # ellipsis
    *(ord(c) for c in "éèàòùç"),
]


def human(n: int) -> str:
    for unit in ("B", "KB", "MB"):
        if n < 1024:
            return f"{n:.0f}{unit}" if unit == "B" else f"{n:.1f}{unit}"
        n /= 1024
    return f"{n:.1f}GB"


def subset_one(path: Path, python: str) -> tuple[int, int]:
    before = path.stat().st_size
    cmd = [
        python,
        "-m",
        "fontTools.subset",
        str(path),
        f"--output-file={path}",
        f"--unicodes={UNICODES}",
        f"--layout-features={LAYOUT_FEATURES}",
        "--flavor=woff2",
        "--notdef-outline",
        "--name-IDs=*",
        "--glyph-names=off",
        "--recalc-average-width",
        "--recalc-bounds",
        # Keep hinting instructions -- do NOT pass --no-hinting.
        # Variable-font tables (fvar/gvar/avar/HVAR) are retained by default
        # as long as we never pass --instancer or drop them explicitly.
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"FAILED subsetting {path.name}:\n{result.stderr}", file=sys.stderr)
        raise SystemExit(1)
    after = path.stat().st_size
    return before, after


def main() -> None:
    python = sys.executable
    fonts = sorted(FONTS_DIR.glob("*.woff2"))
    if not fonts:
        print(f"No .woff2 files found in {FONTS_DIR}", file=sys.stderr)
        raise SystemExit(1)

    rows = []
    total_before = 0
    total_after = 0
    for font in fonts:
        before, after = subset_one(font, python)
        total_before += before
        total_after += after
        rows.append((font.name, before, after))

    name_w = max(len(r[0]) for r in rows)
    print(f"{'file'.ljust(name_w)}  {'before':>10}  {'after':>10}  {'saved':>7}")
    for name, before, after in rows:
        saved_pct = (1 - after / before) * 100 if before else 0
        print(
            f"{name.ljust(name_w)}  {human(before):>10}  {human(after):>10}  {saved_pct:6.1f}%"
        )
    total_saved_pct = (1 - total_after / total_before) * 100 if total_before else 0
    print(
        f"{'TOTAL'.ljust(name_w)}  {human(total_before):>10}  {human(total_after):>10}  {total_saved_pct:6.1f}%"
    )


if __name__ == "__main__":
    main()
