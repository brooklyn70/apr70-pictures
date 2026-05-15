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
    {
      name: 'lockupLogo',
      type: 'upload',
      relationTo: 'media',
      label: 'Lockup Logo',
      admin: {
        description: 'Optional division lockup overlaid on the hero (split/fullscreen/slider).',
      },
      filterOptions: {
        mediaKind: { in: ['logo', 'wordmark'] },
      },
    },
    {
      name: 'watermarkLogo',
      type: 'upload',
      relationTo: 'media',
      label: 'Watermark Logo',
      admin: {
        description: 'Optional watermark overlay on the hero media.',
      },
      filterOptions: {
        mediaKind: { in: ['watermark', 'logo'] },
      },
    },
    {
      name: 'watermarkOpacity',
      type: 'number',
      label: 'Watermark Opacity',
      defaultValue: 0.15,
      min: 0,
      max: 1,
      admin: {
        description: 'Opacity of the watermark overlay (0 = invisible, 1 = fully opaque).',
        step: 0.05,
        condition: (_, siblingData) => Boolean(siblingData?.watermarkLogo),
      },
    },
    {
      name: 'watermarkPosition',
      type: 'select',
      label: 'Watermark Position',
      defaultValue: 'bottom-right',
      options: [
        { label: 'Bottom Right', value: 'bottom-right' },
        { label: 'Bottom Left', value: 'bottom-left' },
        { label: 'Center', value: 'center' },
        { label: 'Top Right', value: 'top-right' },
      ],
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.watermarkLogo),
      },
    },
    {
      name: 'watermarkShowOnMobile',
      type: 'checkbox',
      label: 'Show Watermark on Mobile',
      defaultValue: false,
      admin: {
        description: 'Watermarks can be distracting on small screens. Off by default.',
        condition: (_, siblingData) => Boolean(siblingData?.watermarkLogo),
      },
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
    {
      name: 'sliderItems',
      type: 'array',
      labels: {
        singular: 'Curated Slide',
        plural: 'Curated Slides',
      },
      admin: {
        description: 'Explicitly curated slides (image + optional text).',
        condition: (_, siblingData) => siblingData?.variant === 'slider-curated',
      },
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'subtext',
          type: 'text',
        },
      ],
    },
  ],
}
