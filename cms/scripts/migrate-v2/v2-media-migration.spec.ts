import { describe, expect, it } from 'vitest'

import { rewriteV2MediaRefs } from './rewrite-v2-media-refs.js'
import { v2PublicPathToRelativeFsPath } from './v2-media-id-map.js'

describe('v2PublicPathToRelativeFsPath', () => {
  it('strips leading slashes and decodes URI segments', () => {
    expect(v2PublicPathToRelativeFsPath('/classic-cinema/Apocolypse%20Now.webp')).toBe(
      'classic-cinema/Apocolypse Now.webp',
    )
  })
})

describe('rewriteV2MediaRefs', () => {
  it('rewrites numeric media fields using the v2→v3 map', () => {
    const map = new Map<number, number>([
      [72, 1001],
      [70, 1002],
    ])
    const layout = [
      {
        blockType: 'hero',
        media: 72,
        nested: { imageMedia: 70 },
      },
    ]
    const out = rewriteV2MediaRefs(layout, map) as typeof layout
    expect(out[0].media).toBe(1001)
    expect(out[0].nested.imageMedia).toBe(1002)
  })

  it('nulls unknown v2 ids for media-shaped keys', () => {
    const map = new Map<number, number>([[72, 1001]])
    const out = rewriteV2MediaRefs({ blockType: 'filmstrip', slides: [{ media: 999 }] }, map) as {
      slides: Array<{ media: number | null }>
    }
    expect(out.slides[0].media).toBeNull()
  })
})
