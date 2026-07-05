import type { Block } from 'payload'

/**
 * ZineSynopsisBlock — text-forward property page hero (v4 zine treatment).
 * The synopsis IS the hero: no image dependence. Draft state renders as a
 * discreet small-caps "working draft" tag (public-safe, no internal notes).
 */
export const ZineSynopsisBlock: Block = {
  slug: 'zineSynopsis',
  labels: {
    singular: 'Zine Synopsis',
    plural: 'Zine Synopsis blocks',
  },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      admin: { description: 'Division and format line, e.g. "(212) · Documentary series, 11 episodes".' },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'workingDraft',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Render the small-caps "working draft" tag.' },
    },
    {
      name: 'logline',
      type: 'textarea',
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      admin: { description: 'Synopsis. Blank line starts a new paragraph.' },
    },
    {
      name: 'note',
      type: 'text',
      admin: { description: 'Optional closing credit line.' },
    },
  ],
}
