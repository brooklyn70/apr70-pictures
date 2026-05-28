# Placeholder images

Render-time fallback assets for blocks that haven't been given a Media reference yet. Picked automatically by `resolveMediaSrcOrPlaceholder()` in `web/src/lib/payload.ts` (helper in `web/src/lib/placeholder.ts`).

## Filename pattern

```
placeholder-{aspect}-{division}.svg
```

- `aspect` — `16x9`, `4x3`, `1x1`, `9x16`
- `division` — `default`, `212`, `310`, `nrc`

## How blocks use these

Blocks pass an `aspect` and (when applicable) a `division` hint to `resolveMediaSrcOrPlaceholder(media, { aspect, division })`. If the Media ref is empty, the helper returns the matching placeholder URL. Real images are picked unchanged.

## Swap-in workflow

To replace a placeholder with a real image:

1. Upload the asset in Payload admin (`/admin/collections/media`).
2. Reference it on the block that was rendering the placeholder.
3. The placeholder disappears automatically on next request.

To replace the placeholder *art* itself, edit these SVGs in place — no code change needed.

## Design intent

Slate background, filmstrip perforation strip top + bottom, mono `APR70 · {division} · {aspect}` label. The art reads as intentional structure rather than a broken image so Marco's iteration pages always look composed.
