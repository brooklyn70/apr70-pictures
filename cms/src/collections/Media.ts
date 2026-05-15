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
  upload: true,
}
