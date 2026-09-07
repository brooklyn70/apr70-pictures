import type { Block } from 'payload'

export const CTABlock: Block = {
  slug: 'cta',
  labels: {
    singular: 'Call to Action',
    plural: 'CTA blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      localized: true,
      required: true,
    },
    {
      name: 'subtext',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'buttons',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 3,
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'variant',
          type: 'select',
          required: true,
          defaultValue: 'solid',
          options: [
            { label: 'Solid', value: 'solid' },
            { label: 'Ghost', value: 'ghost' },
            { label: 'Link (Underline)', value: 'link' },
          ],
        },
      ],
    },
  ],
}
