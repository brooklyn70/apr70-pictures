import type { GlobalConfig } from 'payload'

import { HeroBlock } from '../blocks/HeroBlock'
import { RichTextBlock } from '../blocks/RichTextBlock'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'layout',
      type: 'blocks',
      blocks: [HeroBlock, RichTextBlock],
      labels: {
        singular: 'Block',
        plural: 'Layout blocks',
      },
    },
  ],
}
