#!/usr/bin/env python3
"""Render an APR 70 place poster with prettymaps (OSM).

prettymaps is AGPL-3.0. This script calls it as a dependency. Do not vendor
the library. Every figure must credit prettymaps and OpenStreetMap.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

try:
    import prettymaps
except ImportError:
    prettymaps = None

DEFAULT_PRESET = Path(__file__).resolve().parent / "presets" / "apr70.json"
OUT_DIR = Path(__file__).resolve().parent / "out"


def slugify(place: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", place.lower()).strip("-")
    return slug or "place"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--place", required=True, help='OSM query, e.g. "Red Hook, Brooklyn, New York"')
    parser.add_argument("--no", default="01", help="Inventory number without prefix (default 01)")
    parser.add_argument("--preset", default=str(DEFAULT_PRESET), help="House preset JSON")
    parser.add_argument("--radius", type=int, default=None, help="Override radius in meters")
    args = parser.parse_args()

    if prettymaps is None:
        print("Install the engine first: pip install prettymaps", file=sys.stderr)
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    number = args.no if str(args.no).upper().startswith("NO") else f"No. {args.no}"
    slug = slugify(args.place)
    out = OUT_DIR / f"{slug}-{number.replace(' ', '').replace('.', '').lower()}.png"

    plot_kwargs = {
        "preset": args.preset,
        "figsize": (9, 12),
        "save_as": str(out),
        "credit": {
            "text": "prettymaps · OpenStreetMap contributors",
        },
    }
    if args.radius is not None:
        plot_kwargs["radius"] = args.radius

    prettymaps.plot(args.place, **plot_kwargs)
    print(f"Wrote {out}")
    print(f"{number}  {args.place}")
    print("Credit: prettymaps (AGPL-3.0) · OpenStreetMap contributors")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
