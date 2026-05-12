import type { Block } from 'payload'

/**
 * Stats Grid Block — large numeric data points with labels.
 * Used on Investors page and anywhere key metrics need emphasis.
 */
export const StatsBlock: Block = {
  slug: 'stats',
  labels: {
    singular: 'Stats Grid',
    plural: 'Stats Grid blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      admin: {
        description: 'Optional section heading. Line breaks are intentional.',
      },
    },
    {
      name: 'columns',
      type: 'select',
      required: true,
      defaultValue: '4',
      options: [
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
        { label: '4 columns', value: '4' },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 8,
      labels: { singular: 'Stat', plural: 'Stats' },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            description: 'The large number or short text (e.g. "24", "$2.5M", "3x").',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Descriptive label below the value (e.g. "Projects in Development").',
          },
        },
        {
          name: 'colorToken',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'Default (white)', value: 'none' },
            { label: '212 Amber', value: '212-amber' },
            { label: '212 Sicilian Orange', value: '212-sicilian-orange' },
            { label: '310 IMAX', value: '310-imax' },
            { label: 'NRC Grey', value: 'nrc-grey' },
            { label: '310 Sicilian Blue', value: '310-sicilian-blue' },
            { label: 'NRC Navy', value: 'nrc-navy' },
          ],
        },
      ],
    },
  ],
}
