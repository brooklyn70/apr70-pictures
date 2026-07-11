import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'mediaKind',
      type: 'select',
      label: 'Media Kind',
      admin: {
        description: 'Optional tag for filtering in upload pickers (e.g. logo library).',
        position: 'sidebar',
      },
      options: [
        { label: 'Logo', value: 'logo' },
        { label: 'Favicon', value: 'favicon' },
        { label: 'Wordmark', value: 'wordmark' },
        { label: 'Watermark', value: 'watermark' },
        { label: 'Photo', value: 'photo' },
      ],
    },
    {
      name: 'divisionTag',
      type: 'select',
      label: 'Division',
      admin: {
        description: 'Optional division association for cross-filtering.',
        position: 'sidebar',
      },
      options: [
        { label: '212 Pictures', value: '212' },
        { label: '310 Pictures', value: '310' },
        { label: 'New Renaissance Cinema', value: 'nrc' },
        { label: 'Corporate', value: 'corporate' },
      ],
    },
  ],
  upload: {
    // Focal-point + crop tools in admin so Marco can crop images to the
    // boxes they render into on the v9 site. The focal point is stored on
    // the media doc (focalX/focalY) and applied to the generated sizes.
    crop: true,
    focalPoint: true,
    imageSizes: [
      { name: 'thumb', width: 480 },
      { name: 'card', width: 1024 },
      { name: 'hero', width: 1920 },
    ],
  },
}
