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
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
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
