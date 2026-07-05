import type { Block } from 'payload'

/**
 * Playbill Block — presentation card for a Troupe Presents episode.
 * Mercury-lineage program card: number, title, runtime, voice/doubling
 * roster, scene count, status. Zero-JS Astro render on the frontend.
 *
 * Registered on the Troupe page global. Adding it to another global later
 * requires a new migration (per-global block tables).
 */
export const PlaybillBlock: Block = {
  slug: 'playbill',
  labels: {
    singular: 'Playbill',
    plural: 'Playbill blocks',
  },
  fields: [
    {
      name: 'programNumber',
      type: 'text',
      admin: {
        description: 'Program number as displayed (e.g. "No. 1").',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Episode title (e.g. "L.A. DOLCE VITA").',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description: 'Episode subtitle or tagline (e.g. "a radio drama for seven voices and a clock").',
      },
    },
    {
      name: 'runtime',
      type: 'text',
      admin: {
        description: 'Displayed runtime (e.g. "About 15 minutes").',
      },
    },
    {
      name: 'sceneCount',
      type: 'number',
      admin: {
        description: 'Number of scenes in the program.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'in-production',
      options: [
        { label: 'In production', value: 'in-production' },
        { label: 'Coming soon', value: 'coming-soon' },
        { label: 'Released', value: 'released' },
      ],
    },
    {
      name: 'posterImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Optional poster or production still. When empty, the local placeholder artwork below is used.',
      },
    },
    {
      name: 'artwork',
      type: 'select',
      defaultValue: 'on-air',
      options: [
        { label: 'ON AIR lamp', value: 'on-air' },
        { label: 'Microphone', value: 'microphone' },
        { label: 'Bradded script', value: 'script' },
      ],
      admin: {
        description:
          'Placeholder line art (local SVG in web/public/troupe/) shown when no poster image is set.',
      },
    },
    {
      name: 'voices',
      type: 'array',
      labels: { singular: 'Voice', plural: 'Voices' },
      admin: {
        description:
          'The doubling roster. DRAFT seed mirrors the script title page — review before launch.',
      },
      fields: [
        {
          name: 'voice',
          type: 'text',
          required: true,
          admin: { description: 'Voice label (e.g. "Voice One").' },
        },
        {
          name: 'descriptor',
          type: 'text',
          admin: { description: 'Short casting descriptor (e.g. "M, 45-60").' },
        },
        {
          name: 'roles',
          type: 'text',
          required: true,
          admin: { description: 'Roles played, separated by a middle dot.' },
        },
        {
          name: 'note',
          type: 'text',
          admin: { description: 'Optional register note (e.g. "Lead. No doubling.").' },
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Short program note shown under the roster.',
      },
    },
  ],
}
