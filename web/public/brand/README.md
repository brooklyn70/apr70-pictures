# Brand assets (vendored `apr70-logos`)

This tree mirrors Marco’s **`apr70-logos`** repo at import time so the same files ship with **git**, **NAS Docker builds**, and **Astro static hosting**.

- **Path:** `/brand/apr70-logos/...` (e.g. `/brand/apr70-logos/212-pictures/212_hero.svg`)
- **Divisions:** `212-pictures/`, `310-pictures/`, `new-renaissance-cinema/`, corporate **`apr70-apr70pictures/`** (favicons, letterhead, business_cards).

**Payload rule:** Runtime blocks and layouts should prefer **`upload` → `media`** (see `docs/architecture/brand-assets-integration.md`). Use this folder for **defaults**, **seed imports**, and **editor reference** (which file to upload), not as loose path strings in block JSON long-term.

To refresh from source:

```sh
rsync -a --delete --exclude '.DS_Store' --exclude '**/.DS_Store' \
  /path/to/apr70-logos/ ./web/public/brand/apr70-logos/
```
