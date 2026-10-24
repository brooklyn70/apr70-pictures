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
/** Cover crops on phones need width for the CROP, not the viewport: a 2.39:1 still filling a
 *  100vh fold at 375x812 shows a slice 812*2.39 = 1940 CSS px wide; a 4:5 fold shows 300vw. */
export const SIZES_COVER_VH100 = '(max-width: 719px) calc(100vh * 2.4), 100vw'
export const SIZES_COVER_TALL = '(max-width: 719px) 300vw, 100vw'
export const SIZES_GRID = '(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw'

export const focalPosition = (f: Frame): string => `${f.focalX}% ${f.focalY}%`

/** AI mark (v13, revised for i18n 2026-09-07).
 *
 *  It USED to be the caption text alone: `/ai[\s-]?generated/i` over the
 *  caption + credit. That regex matches an English phrase, so the day a caption
 *  is translated ("gerado por IA", "generato dall'IA") the disclosure stamp
 *  silently disappears — a compliance failure, not a cosmetic one.
 *
 *  The stored flag on the Media document (`aiFrame`, Media collection) is now
 *  authoritative. The text test is KEPT as a second chance so that every frame
 *  stamped today is still stamped tomorrow, whether or not the flag has been
 *  ticked in the admin yet. Archival photographs carry neither, so they can
 *  still never be stamped. */
export const isAiFrameText = (...parts: Array<string | null | undefined>): boolean =>
  /ai[\s-]?generated/i.test(parts.filter(Boolean).join(' '))

/** Narrow local read of the stored flag. Media gains `aiFrame?: boolean | null`
 *  when the CMS regenerates payload-types; reading it through this shape keeps
 *  `astro check` green before AND after that regeneration. */
type AiFlagged = { aiFrame?: boolean | null }

/** True when the Media document itself is marked machine-generated. */
export const mediaAiFrame = (input: unknown): boolean =>
  !!input && typeof input === 'object' && (input as AiFlagged).aiFrame === true

/** The one AI-mark predicate: stored flag first, disclosure text second.
 *  Every caller passes the media object through, so a translated caption can
 *  never drop the stamp. */
export const isAiFrame = (
  media: unknown,
  ...parts: Array<string | null | undefined>
): boolean => mediaAiFrame(media) || isAiFrameText(...parts)
