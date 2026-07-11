import type { Media } from 'payload-types'
import { resolveMediaUrl } from '../../lib/payload'

/**
 * Null-safe frame resolver — the v9 image law: some media is PENDING until
 * the image campaign lands, so EVERY image render null-checks through here
 * and skips gracefully. Also carries the media doc's focal point for the
 * crop-to-box law (object-fit: cover + object-position focal).
 */
export type Frame = {
  src: string
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
    alt: typeof media.alt === 'string' ? media.alt : '',
    focalX: typeof media.focalX === 'number' ? media.focalX : 50,
    focalY: typeof media.focalY === 'number' ? media.focalY : 50,
  }
}

export const focalPosition = (f: Frame): string => `${f.focalX}% ${f.focalY}%`
