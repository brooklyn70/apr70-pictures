import type { Block } from 'payload'

/**
 * D-7 Lexical blocks — field shapes match v2 `apr70-clone` `src/payload/lexical/d7-blocks.mjs`
 * (Keystatic `documentComponentBlocks` parity).
 */
export const structureDividerBlock: Block = {
  slug: 'structureDivider',
  labels: {
    singular: 'Structure Divider',
    plural: 'Structure Dividers',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Divider label',
      admin: {
        description: 'Text shown between the two rules. Leave blank for a plain rule.',
      },
    },
  ],
}

export const buttonBlock: Block = {
  slug: 'button',
  labels: { singular: 'Button', plural: 'Buttons' },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Button label',
    },
    {
      name: 'href',
      type: 'text',
      label: 'Link (href)',
      admin: {
        description: 'e.g. /investors or https://...',
      },
    },
    {
      name: 'variant',
      type: 'select',
      label: 'Variant',
      defaultValue: 'primary',
      options: [
        {
          label: 'Primary (white border, fills on hover)',
          value: 'primary',
        },
        {
          label: 'Secondary (dim border, subtle hover)',
          value: 'secondary',
        },
      ],
    },
  ],
}

export const accentTextBlock: Block = {
  slug: 'accentText',
  labels: { singular: 'Accent Text', plural: 'Accent Text' },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      label: 'Accent text content',
      admin: {
        description: 'Styled block with an accent-color left border.',
      },
    },
    {
      name: 'color',
      type: 'select',
      label: 'Accent color',
      defaultValue: '--orange',
      options: [
        { label: 'Orange (accent)', value: '--orange' },
        { label: 'Amber (212)', value: '--amber' },
        { label: 'Teal (310)', value: '--teal' },
        { label: 'Offwhite (NRC)', value: '--offwhite' },
      ],
    },
  ],
}

export const d7LexicalBlocks: Block[] = [structureDividerBlock, buttonBlock, accentTextBlock]
