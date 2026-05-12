import type { Block } from 'payload'

/**
 * Rich Text Block with Mega Scale toggle.
 * The "megaScale" checkbox outputs data-display="mega" on the wrapper,
 * which triggers the massive clamp(3.5rem, 12vw, 200px) typography
 * without affecting semantic heading levels.
 */
export const RichTextBlock: Block = {
  slug: 'richText',
  labels: {
    singular: 'Rich text',
    plural: 'Rich text blocks',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      required: true,
    },
    {
      name: 'megaScale',
      type: 'checkbox',
      defaultValue: false,
      label: 'Mega Scale',
      admin: {
        description:
          'When enabled, all headings in this block use the massive display scale (e.g. "STORIES ACROSS GENERATIONS"). This separates visual size from semantic heading level.',
      },
    },
  ],
}
