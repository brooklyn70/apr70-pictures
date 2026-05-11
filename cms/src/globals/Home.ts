import type { GlobalConfig } from 'payload'

import { HeroBlock } from '../blocks/HeroBlock'

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
      blocks: [HeroBlock],
      labels: {
        singular: 'Block',
        plural: 'Layout blocks',
      },
    },
  ],
}
