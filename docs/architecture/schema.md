# Page schema — Globals with `layout: Block[]` (v3)

Editor-authored pages are modeled as **Payload Globals** (one row per logical page or section site-wide). Each Global holds a **layout** field: an ordered array of block objects. Valid blocks are defined in `blocks.md` and discriminated by `blockType` (or Payload `blockType` / `type` field — exact key to match Payload blocks extension naming in `cms/`).

## Layout field

- **Field name:** `layout`
- **Type:** array of block objects (Payload `blocks` field type or array of polymorphic relations).
- **Order:** array order is render order top-to-bottom.
- **Validation:** each block must match one of the six starter block schemas; unknown block types are rejected at save time in Payload.

## Globals (initial set)

| Global slug (example) | Purpose |
|----------------------|---------|
| `home` | Marketing home |
| `about` | Company / principles |
| Additional slugs | Added as Globals in Payload; Astro routes map `/{slug}` or dedicated route table derived from Global meta. |

Exact Global inventory is product/data-driven; the **shape** is always `layout: Block[]` plus shared SEO/meta fields TBD in `cms/` scaffold.

## Astro mapping

- Fetch Global by slug (or fixed id).
- Pass `layout` into `<BlockRenderer blocks={global.layout} />`.
- No per-page Astro components for section structure — only the BlockRenderer switch per CLAUDE.md rule 1.

## Relationship to integration spec

Media URLs, auth, and fetch strategy for Globals are defined in `integration.md`.
