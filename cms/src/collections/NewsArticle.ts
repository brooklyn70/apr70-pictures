import type { CollectionConfig } from 'payload'

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

export const NewsArticle: CollectionConfig = {
  slug: 'news',
  access: { read: () => true },
  admin: {
    // Hidden in the v10 admin trim (2026-07-12), un-hidden 2026-07-13 on Marco's
    // ruling: the news surface must be his to bring back, not a dev's. Nothing
    // here was ever deleted — these are the pre-DISPATCH articles.
    group: 'Dispatch',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'date', 'featured'],
    description:
      'The original news articles, from before the page became DISPATCH. Kept and editable; no public route renders them today. The live news page is DISPATCH — see Dispatch Issues, and the switch in Site Settings.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'date',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'deck',
      type: 'text',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [HeroBlock, RichTextBlock, TwoColBlock, GridBlock, CTABlock, QuotesBlock, FilmstripBlock, DivisionBlock, StatsBlock, DividerBlock],
      labels: { singular: 'Block', plural: 'Layout blocks' },
    },
  ],
}
