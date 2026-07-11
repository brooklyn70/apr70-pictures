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
import { ZinePassageBlock } from '../blocks/ZinePassageBlock'
import { divisionBrandFields } from '../fields/divisionBrandFields'
import { themeField } from '../fields/themeField'

export const Division212: GlobalConfig = {
  slug: '212',
  label: '212 Division',
  // The numeric slug generates an invalid TS identifier ("interface 212")
  // and crashes `payload generate:types`; naming the interface fixes it.
  typescript: { interface: 'Division212Global' },
  access: { read: () => true },
  fields: [
    themeField,
    ...divisionBrandFields,
    {
      name: 'layout',
      type: 'blocks',
      blocks: [HeroBlock, RichTextBlock, TwoColBlock, GridBlock, CTABlock, QuotesBlock, FilmstripBlock, DivisionBlock, StatsBlock, DividerBlock, ZinePassageBlock],
      labels: { singular: 'Block', plural: 'Layout blocks' },
    },
  ],
}
