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
      required: true,
    },
    {
      name: 'subtext',
      type: 'textarea',
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
