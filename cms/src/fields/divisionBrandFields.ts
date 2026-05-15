import type { Field } from 'payload'

export const divisionBrandFields: Field[] = [
  {
    type: 'collapsible',
    label: 'Division Branding',
    admin: {
      description: 'Logo and favicon overrides for this division. Picked from Media uploads.',
      initCollapsed: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'headerLogo',
            type: 'upload',
            relationTo: 'media',
            label: 'Header Logo',
            admin: {
              description: 'Lockup or wordmark shown in the header on this division\'s pages.',
              width: '50%',
            },
            filterOptions: {
              mediaKind: { in: ['logo', 'wordmark'] },
            },
          },
          {
            name: 'footerLogo',
            type: 'upload',
            relationTo: 'media',
            label: 'Footer Logo',
            admin: {
              description: 'Mark or wordmark shown in the footer on this division\'s pages.',
              width: '50%',
            },
            filterOptions: {
              mediaKind: { in: ['logo', 'wordmark'] },
            },
          },
        ],
      },
      {
        name: 'faviconOverride',
        type: 'upload',
        relationTo: 'media',
        label: 'Favicon Override',
        admin: {
          description: 'Division-specific favicon. Falls back to site-wide favicon if unset.',
        },
        filterOptions: {
          mediaKind: { in: ['favicon'] },
        },
      },
    ],
  },
]
