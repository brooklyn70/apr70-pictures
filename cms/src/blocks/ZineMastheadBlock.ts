import type { Block } from 'payload'

/**
 * ZineMastheadBlock — the DISPATCH identity masthead used as the site's
 * front door (v4 zine re-arrangement). Text-forward, zero media.
 * Issues are numbered, never dated: `issueLabel` is the only clock.
 */
export const ZineMastheadBlock: Block = {
  slug: 'zineMasthead',
  labels: {
    singular: 'Zine Masthead',
    plural: 'Zine Masthead blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'DISPATCH',
      admin: { description: 'Nameplate wordmark.' },
    },
    {
      name: 'officesLine',
      type: 'text',
      admin: { description: 'Line under the nameplate (offices / city).' },
    },
    {
      name: 'issueLabel',
      type: 'text',
      admin: { description: 'Numbered, never dated — e.g. "No. 1".' },
    },
    {
      name: 'dek',
      type: 'textarea',
      admin: { description: 'Standing identity strip beneath the nameplate.' },
    },
  ],
}
