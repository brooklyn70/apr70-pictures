import type { GlobalConfig } from 'payload'

import { HeroBlock } from '../blocks/HeroBlock'
import { RichTextBlock } from '../blocks/RichTextBlock'
import { TwoColBlock } from '../blocks/TwoColBlock'
import { CTABlock } from '../blocks/CTABlock'
import { QuotesBlock } from '../blocks/QuotesBlock'
import { StatsBlock } from '../blocks/StatsBlock'
import { DividerBlock } from '../blocks/DividerBlock'
import { PlaybillBlock } from '../blocks/PlaybillBlock'

/**
 * Troupe Presents page global (/troupe).
 * Block set is a curated subset of the library plus the Playbill block;
 * grid/filmstrip/divisionShowcase were left off to keep the schema (and its
 * migration) lean — add via a follow-up migration if editors need them.
 */
export const TroupePage: GlobalConfig = {
  slug: 'troupe',
  label: 'Troupe Presents',
  access: { read: () => true },
  admin: {
    description:
      'The APR 70 Troupe Presents page (/troupe). Seed copy is DRAFT v01 — review every block before launch.',
  },
  fields: [
    {
      name: 'layout',
      type: 'blocks',
      blocks: [HeroBlock, PlaybillBlock, RichTextBlock, TwoColBlock, CTABlock, QuotesBlock, StatsBlock, DividerBlock],
      labels: { singular: 'Block', plural: 'Layout blocks' },
    },
  ],
}
