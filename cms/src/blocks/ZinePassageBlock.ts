import type { Block } from 'payload'

/**
 * ZinePassageBlock — general text-forward zine section: kicker, heading,
 * lede, plain-text body (blank line = new paragraph), optional link row.
 * Used for the front-door teaser stack and division landing copy.
 */
export const ZinePassageBlock: Block = {
  slug: 'zinePassage',
  labels: {
    singular: 'Zine Passage',
    plural: 'Zine Passage blocks',
  },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      admin: { description: 'Small-caps eyebrow above the heading.' },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'lede',
      type: 'textarea',
      admin: { description: 'One-line mandate / standfirst.' },
    },
    {
      name: 'body',
      type: 'textarea',
      admin: { description: 'Plain text. Blank line starts a new paragraph.' },
    },
    {
      name: 'links',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
  ],
}
