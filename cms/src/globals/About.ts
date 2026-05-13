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

export const About: GlobalConfig = {
  slug: 'about',
  label: 'About',
  access: { read: () => true },
  fields: [
    {
      name: 'layout',
      type: 'blocks',
      blocks: [HeroBlock, RichTextBlock, TwoColBlock, GridBlock, CTABlock, QuotesBlock, FilmstripBlock, DivisionBlock, StatsBlock, DividerBlock],
      labels: { singular: 'Block', plural: 'Layout blocks' },
    },
  ],
}
