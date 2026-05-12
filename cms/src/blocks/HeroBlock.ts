import type { Block } from 'payload'

/**
 * Hero Engine Block — Classic Cinema variant.
 * Clean crossfades only. No morphing, no WebGL.
 * Can auto-pull featured Projects or use a manually curated list.
 */
export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero',
    plural: 'Hero blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Hero headline text. Line breaks are intentional.',
      },
    },
    {
      name: 'subtext',
      type: 'text',
      admin: {
        description: 'Smaller subtext below the heading.',
      },
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Static hero image (used for "default" and "split" variants).',
      },
    },
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'default',
      options: [
        { label: 'Default (static image)', value: 'default' },
        { label: 'Split (image + text)', value: 'split' },
        { label: 'Fullscreen (static)', value: 'fullscreen' },
        { label: 'Slider (auto-featured projects)', value: 'slider-auto' },
        { label: 'Slider (curated list)', value: 'slider-curated' },
      ],
    },
    {
      name: 'division',
      type: 'select',
      required: true,
      defaultValue: 'corporate',
      options: [
        { label: '(212) Pictures', value: 'pictures-212' },
        { label: '(310) Pictures', value: 'pictures-310' },
        { label: 'New Renaissance Cinema', value: 'nrc' },
        { label: 'Corporate', value: 'corporate' },
      ],
    },
    /* --- Slider-specific fields --- */
    {
      name: 'fadeDuration',
      type: 'number',
      defaultValue: 700,
      admin: {
        description: 'Crossfade duration in milliseconds (slider variants only).',
        condition: (_, siblingData) =>
          siblingData?.variant === 'slider-auto' || siblingData?.variant === 'slider-curated',
      },
    },
    {
      name: 'autoplayDelay',
      type: 'number',
      defaultValue: 5000,
      admin: {
        description: 'Time between slides in milliseconds (slider variants only).',
        condition: (_, siblingData) =>
          siblingData?.variant === 'slider-auto' || siblingData?.variant === 'slider-curated',
      },
    },
    {
      name: 'showIndicator',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show the "01 / 04" slide indicator (slider variants only).',
        condition: (_, siblingData) =>
          siblingData?.variant === 'slider-auto' || siblingData?.variant === 'slider-curated',
      },
    },
  ],
}
