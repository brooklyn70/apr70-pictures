import type { Block } from 'payload'

/**
 * Structure Divider Block — the clean horizontal rule with an optional mono-spaced label.
 * Ported from the v2 StructureDivider component and the D7 Lexical inline block
 * into a first-class page-level block for use in any layout.
 */
export const DividerBlock: Block = {
  slug: 'divider',
  labels: {
    singular: 'Structure Divider',
    plural: 'Structure Divider blocks',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      admin: {
        description:
          'Text shown between the two rules (e.g. "Structure", "// DIVISIONS"). Leave blank for a plain rule.',
      },
    },
    {
      name: 'spacing',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: 'Compact', value: 'compact' },
        { label: 'Normal', value: 'normal' },
        { label: 'Wide', value: 'wide' },
      ],
      admin: {
        description: 'Vertical padding around the divider.',
      },
    },
  ],
}
