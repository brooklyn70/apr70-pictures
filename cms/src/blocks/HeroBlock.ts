import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero',
    plural: 'Hero blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subtext',
      type: 'text',
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Split', value: 'split' },
        { label: 'Fullscreen', value: 'fullscreen' },
      ],
    },
    {
      name: 'division',
      type: 'select',
      required: true,
      defaultValue: 'corporate',
      options: [
        { label: 'Pictures (212)', value: 'pictures-212' },
        { label: 'Pictures (310)', value: 'pictures-310' },
        { label: 'Corporate', value: 'corporate' },
      ],
    },
  ],
}
