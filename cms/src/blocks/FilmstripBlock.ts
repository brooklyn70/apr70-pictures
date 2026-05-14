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
      name: 'format',
      type: 'select',
      defaultValue: 'super35',
      options: [
        { label: 'Academy (1.37:1) - 310 Pictures', value: 'academy' },
        { label: 'Super 35 (2.39:1) - 212 Pictures', value: 'super35' },
        { label: '2:1 Widescreen (2.00:1) - NRC', value: 'widescreen200' },
        { label: 'IMAX (1.43:1)', value: 'imax' },
        { label: 'V2 Header Rails', value: 'v2-header' },
        { label: 'V2 Footer Rails', value: 'v2-footer' },
      ],
      admin: {
        description: 'Aspect ratio and perforation style.',
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
