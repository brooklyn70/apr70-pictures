import type { GlobalConfig } from 'payload'

import { HeroBlock } from '../blocks/HeroBlock'
import { RichTextBlock } from '../blocks/RichTextBlock'
import { TwoColBlock } from '../blocks/TwoColBlock'
import { GridBlock } from '../blocks/GridBlock'
import { CTABlock } from '../blocks/CTABlock'
import { QuotesBlock } from '../blocks/QuotesBlock'
import { FilmstripBlock } from '../blocks/FilmstripBlock'
import { DivisionBlock } from '../blocks/DivisionBlock'
import { StatsBlock } from '../blocks/StatsBlock'
import { DividerBlock } from '../blocks/DividerBlock'
import { ZineMastheadBlock } from '../blocks/ZineMastheadBlock'
import { ZinePassageBlock } from '../blocks/ZinePassageBlock'

export const Home: GlobalConfig = {
  slug: 'home',
  // v10 admin trim (Marco 2026-07-12): fed the retired v4 surface; hidden, not deleted — data kept for archive/possible v11 reuse.
  admin: { hidden: true },
  label: 'Home',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        HeroBlock,
        RichTextBlock,
        TwoColBlock,
        GridBlock,
        CTABlock,
        QuotesBlock,
        FilmstripBlock,
        DivisionBlock,
        StatsBlock,
        DividerBlock,
        ZineMastheadBlock,
        ZinePassageBlock,
      ],
      labels: {
        singular: 'Block',
        plural: 'Layout blocks',
      },
    },
  ],
}
