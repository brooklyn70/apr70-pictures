import type { Block } from 'payload'

/**
 * Division Showcase Block — 5 exploratory visual variants.
 * Variant 0 is the v2-faithful baseline; variants 1-4 are recombinations of existing primitives.
 */
export const DivisionBlock: Block = {
  slug: 'divisionShowcase',
  labels: {
    singular: 'Division Showcase',
    plural: 'Division Showcase blocks',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'v0-baseline',
      options: [
        { label: 'v0 — Baseline (stacked rows, ghost numerals)', value: 'v0-baseline' },
        { label: 'v3 — Baseline + Darkmode Filmstrip', value: 'v3-baseline-filmstrip' },
        { label: 'v4 — Animated Auto-Scrolling Filmstrip', value: 'v4-animated-filmstrip' },
      ],
      admin: {
        description: 'Select the visual layout variant. Preview all at /dev/division-variants.',
      },
    },
    {
      name: 'heading',
      type: 'textarea',
      admin: {
        description: 'Optional section heading above the division rows. Line breaks are intentional.',
      },
    },
    {
      name: 'subtext',
      type: 'textarea',
      admin: {
        description: 'Optional subtext below the heading.',
      },
    },
    {
      name: 'divisions',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 5,
      labels: { singular: 'Division', plural: 'Divisions' },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Division name (e.g. "(212) Pictures").',
          },
        },
        {
          name: 'colorToken',
          type: 'select',
          required: true,
          defaultValue: '212-amber',
          options: [
            { label: '212 Amber', value: '212-amber' },
            { label: '212 Sicilian Orange', value: '212-sicilian-orange' },
            { label: '310 IMAX', value: '310-imax' },
            { label: 'NRC Grey', value: 'nrc-grey' },
            { label: '310 Sicilian Blue', value: '310-sicilian-blue' },
            { label: 'NRC Navy', value: 'nrc-navy' },
          ],
        },
        {
          name: 'subtitle',
          type: 'text',
          admin: {
            description: 'Optional subtitle (e.g. "Brooklyn, New York").',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Division description body. Line breaks are intentional.',
          },
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional image for variants that use media (v2-cards, v3-split).',
          },
        },
      ],
    },
  ],
}
