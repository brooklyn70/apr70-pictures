import sharp from 'sharp'
import type { CollectionBeforeOperationHook } from 'payload'

/**
 * The house ratios. Heroes are shot in scope; everything else lands on the ratio the
 * streaming platforms actually deliver in (2.00:1 — The Crown, Ozark, Severance).
 * 16:9 is the television ratio and is deliberately not one of them.
 */
export const FRAME_RATIOS = { hero: 2.39, standard: 2.0 } as const
export type FrameRatio = keyof typeof FRAME_RATIOS | 'native'

const RASTER = /^image\/(jpeg|png|webp|tiff)$/

/**
 * An archival document — a map, an atlas plate, an engraving, a period photograph — is a
 * record, not a film frame. Cropping one mutilates it. They are named <place>-<year>-<source>:
 * red-hook-1869-dripps, gravesend-1880-bromley, rome-1748-nolli, sea-gate-1900-norton-point.
 *
 * The year must be a delimited token AND pre-1936. Without both tests this misfires: "1970" in
 * 05-dahook-01-piers-1970-k2a is the *subject* of a generated still, and in
 * caruso1970_Photo-realistic... it is a Midjourney username.
 */
export const looksArchival = (name: string): boolean => {
  const m = name.match(/(?:^|[-_])(1[6-9]\d{2})(?:[-_.]|$)/)
  return m ? Number(m[1]) <= 1935 : false
}

/**
 * Crops every incoming upload to a house ratio before Payload writes it, so the generated
 * sizes inherit the ratio for free (the imageSizes are width-only, which preserves aspect).
 *
 * This is what stops the bug coming back: an image can no longer enter the library at an
 * arbitrary shape, get dropped into a fixed-ratio box, and be letterboxed or silently
 * recomposed by object-fit at paint time.
 *
 * It is a pure crop at native resolution — sharp never resamples or upscales here — so the
 * only thing lost is the picture outside the frame.
 */
export const cropToFrame: CollectionBeforeOperationHook = async ({ args, req }) => {
  const file = req?.file
  if (!file?.data?.length) return args // no new bytes on this operation (a metadata-only edit)
  if (!RASTER.test(file.mimetype || '')) return args // svg, video, audio

  // `args` is a union across every collection operation; only the write ones carry `data`.
  const incoming = (((args as { data?: unknown })?.data ?? req?.data ?? {}) as {
    frameRatio?: FrameRatio
  })
  const choice: FrameRatio = incoming.frameRatio ?? 'standard'
  if (choice === 'native') return args

  const target = FRAME_RATIOS[choice]
  if (!target) return args

  const image = sharp(file.data)
  const { width: w, height: h } = await image.metadata()
  if (!w || !h) return args

  const r = w / h

  // Guards that hold even when the editor forgets to set frameRatio.
  if (looksArchival(file.name)) return args
  if (r < 0.95) return args // a 9:16 forced wide loses about 70% of the picture
  if (r > 3.0) return args // a strip, a panorama or a contact sheet, not a frame

  // Pure crop at native resolution: shrink one axis to hit the ratio, never both, never up.
  const [outW, outH] = r > target ? [Math.round(h * target), h] : [w, Math.round(w / target)]
  if (outW === w && outH === h) return args // already on ratio

  const cropped = await sharp(file.data)
    .resize(outW, outH, { fit: 'cover', position: sharp.strategy.attention })
    .toBuffer()

  file.data = cropped
  file.size = cropped.length

  req.payload.logger.info(
    `cropToFrame: ${file.name} ${w}x${h} (${r.toFixed(3)}) -> ${outW}x${outH} (${target}) [${choice}]`,
  )

  return args
}
