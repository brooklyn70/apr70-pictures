import type { Block } from 'payload'

/**
 * Filmstrip Marquee Block — cinematic horizontal image track with perforation bands.
 * Can auto-populate from Projects or accept arbitrary media uploads.
 */
export const FilmstripBlock: Block = {
  slug: 'filmstrip',
  labels: {
    singular: 'Filmstrip Marquee',
    plural: 'Filmstrip Marquee blocks',
  },
  fields: [
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'custom-media',
      options: [
        { label: 'Custom media list', value: 'custom-media' },
        { label: 'Auto-populate from Projects', value: 'from-projects' },
      ],
      admin: {
        description: 'Choose whether to manually curate tiles or pull from the Projects collection.',
      },
    },
    {
      name: 'projectFilter',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'All divisions', value: 'all' },
        { label: '(212) Pictures', value: '212' },
        { label: '(310) Pictures', value: '310' },
        { label: 'New Renaissance Cinema', value: 'nrc' },
      ],
      admin: {
        description: 'Filter projects by division (only when source = "from Projects").',
        condition: (_, siblingData) => siblingData?.source === 'from-projects',
      },
    },
    {
      name: 'tiles',
      type: 'array',
      labels: { singular: 'Tile', plural: 'Tiles' },
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'custom-media',
      },
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          admin: {
            description: 'Short label shown below the tile.',
          },
        },
        {
          name: 'division',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'None', value: 'none' },
            { label: '(212) Pictures', value: '212' },
            { label: '(310) Pictures', value: '310' },
            { label: 'New Renaissance Cinema', value: 'nrc' },
          ],
        },
      ],
    },
    {
      name: 'showPerforations',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show perforation bands (top & bottom)',
    },
  ],
}
