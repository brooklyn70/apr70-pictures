import type { CollectionConfig } from 'payload'
import { cropToFrame } from './hooks/cropToFrame'

// The originals are 3-11MB PNGs. These tiers are what the site ships via srcset.
const WEBP = { format: 'webp', options: { quality: 82 } } as const

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    // Crops incoming uploads to a house ratio before Payload writes the bytes.
    beforeOperation: [cropToFrame],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'frameRatio',
      type: 'select',
      label: 'Frame',
      defaultValue: 'standard',
      admin: {
        description:
          'Cropped on upload. Scope for full-bleed heroes; 2.00:1 (the streaming ratio) for everything else. Native leaves the picture alone — use it for archival maps, engravings and period photographs, which are records rather than film frames.',
        position: 'sidebar',
      },
      options: [
        { label: 'Standard — 2.00:1', value: 'standard' },
        { label: 'Hero — 2.39:1 scope', value: 'hero' },
        { label: 'Native — do not crop', value: 'native' },
      ],
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
    // Width-only, deliberately. The beforeOperation hook has already put the original on a
    // house ratio, so preserving aspect here means every tier inherits it. Adding heights
    // would instead force one ratio on both the 2.39 heroes and the 2.00 standards.
    //
    // formatOptions is set PER SIZE, never at the upload level: at the upload level it
    // re-encodes the ORIGINAL too, which quietly turned a 1926 archival scan into lossy webp.
    // The originals keep their format; only the tiers the site actually serves become webp.
    imageSizes: [
      { name: 'thumb', width: 480, formatOptions: WEBP },
      { name: 'card', width: 1024, formatOptions: WEBP },
      { name: 'hero', width: 1920, formatOptions: WEBP },
    ],
  },
}
