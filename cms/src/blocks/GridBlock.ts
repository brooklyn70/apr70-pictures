import type { Block } from 'payload'

export const GridBlock: Block = {
  slug: 'grid',
  labels: {
    singular: 'Grid',
    plural: 'Grid blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'title',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'description',
          type: 'richText',
          localized: true,
        },
      ],
    },
  ],
}
