import type { Block } from 'payload'

export const QuotesBlock: Block = {
  slug: 'quotes',
  labels: {
    singular: 'Quotes',
    plural: 'Quotes blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'layout',
      type: 'select',
      required: true,
      defaultValue: 'stacked',
      options: [
        { label: 'Stacked', value: 'stacked' },
        { label: 'Carousel', value: 'carousel' },
      ],
    },
    {
      name: 'quotes',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          localized: true,
          required: true,
        },
        {
          name: 'attribution',
          type: 'text',
          localized: true,
        },
      ],
    },
  ],
}
