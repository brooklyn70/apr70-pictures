import type { Block } from 'payload'

export const TwoColBlock: Block = {
  slug: 'twoCol',
  labels: {
    singular: 'Two Column',
    plural: 'Two Column blocks',
  },
  fields: [
    {
      name: 'leftHeading',
      type: 'textarea',
      required: true,
    },
    {
      name: 'rightBody',
      type: 'richText',
      required: true,
    },
    {
      name: 'ratio',
      type: 'select',
      defaultValue: '1-3',
      options: [
        { label: '1-3', value: '1-3' },
        { label: '1-1', value: '1-1' },
        { label: '1-2', value: '1-2' },
      ],
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'top',
      options: [
        { label: 'Top', value: 'top' },
        { label: 'Center', value: 'center' },
      ],
    },
  ],
}
