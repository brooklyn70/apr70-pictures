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
import { ZineSynopsisBlock } from '../blocks/ZineSynopsisBlock'

export const Project: CollectionConfig = {
  slug: 'projects',
  access: { read: () => true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'division', 'status', 'year'],
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
      name: 'division',
      type: 'select',
      options: [
        { label: '212 Pictures', value: '212' },
        { label: '310 Pictures', value: '310' },
        { label: 'New Renaissance Cinema', value: 'nrc' },
        { label: 'Corporate', value: 'corporate' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Development', value: 'development' },
        { label: 'Production', value: 'production' },
        { label: 'Released', value: 'released' },
        { label: 'Optioned', value: 'optioned' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'year',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'storyYear',
      type: 'text',
      label: 'Story year',
      admin: {
        position: 'sidebar',
        description:
          'when the story is set (e.g. "1977"). Renders with Story place as the small mono line under the title on /work/<slug> — leave blank to hide.',
      },
    },
    {
      name: 'storyPlace',
      type: 'text',
      label: 'Story place',
      admin: {
        position: 'sidebar',
        description:
          'where the story is set (e.g. "Brooklyn"). Renders as "1977 · Brooklyn" under the title on /work/<slug> — leave blank to hide.',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },

    // ── v9 property-page fields (seeded from 02-copy/properties/*.md) ─────────
    {
      name: 'logline',
      type: 'textarea',
      admin: {
        description:
          'the full public logline — shown under the title on /work/<slug> and on the /slate list.',
      },
    },
    {
      name: 'shortLogline',
      type: 'text',
      label: 'Short logline',
      admin: {
        description:
          'the one-line logline used on the home mini-slate (e.g. "A private town at the end of Brooklyn.").',
      },
    },
    {
      name: 'provenance',
      type: 'text',
      admin: {
        description:
          'source line for public-domain adaptations (e.g. "After Dashiell Hammett\'s *Red Harvest* (1929); the novel is public domain").',
      },
    },
    {
      name: 'metaLine',
      type: 'text',
      label: 'Meta line',
      admin: {
        description:
          'the property meta line — format · division · status (e.g. "Feature · (212) Pictures · drafted"). Shown with the title on /work/<slug>.',
      },
    },
    {
      name: 'bodyProse',
      type: 'textarea',
      label: 'Body prose',
      admin: {
        description:
          'the property-head paragraph(s) on /work/<slug>, below the logline. Blank line starts a new paragraph; *italics* allowed.',
      },
    },
    {
      name: 'pageQuote',
      type: 'group',
      label: 'Page quote',
      admin: {
        description: 'the featured quotation on /work/<slug> (quote-feature section).',
      },
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          admin: { description: 'The quotation, set large.' },
        },
        {
          name: 'cite',
          type: 'text',
          admin: { description: 'Who said it.' },
        },
        {
          name: 'note',
          type: 'text',
          admin: { description: 'Source note (e.g. "letter, 1889").' },
        },
      ],
    },
    {
      name: 'heroLine',
      type: 'text',
      label: 'Hero line',
      admin: {
        description:
          'One line set over the hero photo-fold on /work/<slug>, light ink on the scrim (e.g. "Brooklyn, before it was a brand."). Short, period-ended. Project pages only; the home folds carry none.',
      },
    },
    {
      name: 'heroCaption',
      type: 'text',
      label: 'Hero caption',
      admin: {
        description:
          'Caption under the hero photo-fold, before the credit. Scene/place line only — do not prefix the property title. ==text== renders highlighted.',
      },
    },
    {
      name: 'heroCredit',
      type: 'text',
      label: 'Hero credit',
      admin: {
        description:
          'Credit suffix after the caption (e.g. "AI-generated development frame"). One AI line only — never ", disclosed", never a property-title prefix on the hero caption.',
      },
    },
    {
      name: 'requestBody',
      type: 'textarea',
      label: 'Request section body',
      admin: {
        description:
          'the paragraph in the "Read the pages." request section at the bottom of /work/<slug>.',
      },
    },
    {
      name: 'slateOrder',
      type: 'number',
      label: 'Slate order',
      admin: {
        position: 'sidebar',
        description: 'position on the public slate (1 = first). Drives /slate and prev/next navigation.',
      },
    },
    {
      name: 'publicSlate',
      type: 'checkbox',
      label: 'Public slate',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'when checked, this property appears on the public slate and gets a /work/<slug> page. The two private properties stay unchecked.',
      },
    },
    {
      name: 'synopsis',
      type: 'textarea',
      admin: {
        description:
          'Property synopsis — renders at the top of /work/<slug>, above the slideshow. Blank line starts a new paragraph. When empty, the page falls back to the Zine Synopsis block, then the compiled-in v4 copy.',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      labels: { singular: 'Plate', plural: 'Gallery plates' },
      admin: {
        description:
          'Property slideshow plates (v2-style filmstrip). A plate whose caption starts with "MOOD BOARD" renders as the wide mood-board collage instead of a slide. Upload wins over the external URL.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'imageUrl',
          type: 'text',
          admin: { description: 'External image URL — used only when no upload is set.' },
        },
        {
          name: 'caption',
          type: 'text',
        },
        {
          name: 'credit',
          type: 'text',
          required: true,
          admin: { description: 'Provenance — required on every plate (artist, generator, archive, PD line).' },
        },
        {
          name: 'wide',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'span the full mood-grid width (maps, panoramas).',
          },
        },
      ],
    },
    {
      name: 'pitchDeck',
      type: 'group',
      admin: {
        description:
          'The pitch-deck slot renders on EVERY property page: "reserved" shows the by-request card; "available" links the file.',
      },
      fields: [
        {
          name: 'status',
          type: 'select',
          defaultValue: 'reserved',
          options: [
            { label: 'Reserved (by request)', value: 'reserved' },
            { label: 'Available (linked file)', value: 'available' },
          ],
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'note',
          type: 'text',
          admin: { description: 'One line under the card, e.g. how to request the deck.' },
        },
      ],
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [HeroBlock, RichTextBlock, TwoColBlock, GridBlock, CTABlock, QuotesBlock, FilmstripBlock, DivisionBlock, StatsBlock, DividerBlock, ZineSynopsisBlock],
      labels: { singular: 'Block', plural: 'Layout blocks' },
    },
  ],
}
