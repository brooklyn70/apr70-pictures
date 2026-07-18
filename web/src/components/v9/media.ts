import type { Media } from 'payload-types'
import { resolveMediaUrl, resolveMediaSrcset } from '../../lib/payload'

/**
 * Null-safe frame resolver — the v9 image law: some media is PENDING until
 * the image campaign lands, so EVERY image render null-checks through here
 * and skips gracefully. Also carries the media doc's focal point for the
 * crop-to-box law (object-fit: cover + object-position focal).
 *
 * `srcset` carries Payload's generated tiers; `src` stays the original as the fallback for
 * browsers that ignore srcset. `width`/`height` are the intrinsic dimensions, which reserve
 * the box and stop the layout jumping while the picture loads.
 */
export type Frame = {
  src: string
  srcset?: string
  width?: number
  height?: number
  alt: string
  focalX: number
  focalY: number
}

export function frameFromMedia(input: unknown): Frame | null {
  if (!input || typeof input !== 'object') return null
  const media = input as Media
  const src = resolveMediaUrl(media)
  if (!src) return null
  return {
    src,
    srcset: resolveMediaSrcset(media),
    width: typeof media.width === 'number' ? media.width : undefined,
    height: typeof media.height === 'number' ? media.height : undefined,
    alt: typeof media.alt === 'string' ? media.alt : '',
    focalX: typeof media.focalX === 'number' ? media.focalX : 50,
    focalY: typeof media.focalY === 'number' ? media.focalY : 50,
  }
}

/**
 * What the browser should assume the frame occupies, so it can pick a tier before layout.
 * Full-bleed frames are the viewport; grid cards are a column of it.
 */
export const SIZES_FULLBLEED = '100vw'
export const SIZES_GRID = '(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw'

export const focalPosition = (f: Frame): string => `${f.focalX}% ${f.focalY}%`

/** AI mark (v13): a frame counts as AI-generated when its caption/credit line
 *  carries the disclosure phrase — the same line the Methods ledger promises.
 *  This is deliberately the ONLY source of truth (no separate flag to drift):
 *  archival photographs never carry the phrase, so they can never be stamped. */
export const isAiFrameText = (...parts: Array<string | null | undefined>): boolean =>
  /ai[\s-]?generated/i.test(parts.filter(Boolean).join(' '))
