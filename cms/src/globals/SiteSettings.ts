import type { GlobalConfig } from 'payload'

/**
 * SiteSettings — singleton global for site-wide identity and feature flags.
 *
 * Fields:
 *  brandLabel        — display name shown in nav / footer (e.g. "APR 70 Pictures")
 *  legalEntity       — full legal name for copyright line
 *  tagline           — short sub-headline used in meta descriptions
 *  showFilmstripRails — toggle the top/bottom sprocket-rail chrome on every page
 *  lastDeployed      — auto-set by the seed/CI pipeline; editors see it read-only
 *  seededVersion     — semver of the last seed run; read-only
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  admin: {
    description: 'Global identity, feature flags, and build metadata for APR 70 Pictures.',
  },
  fields: [
    // ── Identity ──────────────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'brandLabel',
          type: 'text',
          label: 'Brand Label',
          defaultValue: 'APR 70 Pictures',
          required: true,
          admin: {
            description: 'Short display name shown in the navigation and footer logotype.',
            width: '50%',
          },
        },
        {
          name: 'legalEntity',
          type: 'text',
          label: 'Legal Entity',
          defaultValue: 'APR 70 Pictures LLC',
          required: true,
          admin: {
            description: 'Full legal name used in the copyright notice.',
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline',
      admin: {
        description: 'Short sub-headline used in meta descriptions and the footer.',
      },
    },

    // ── Feature Flags ─────────────────────────────────────────────────────────
    {
      name: 'showFilmstripRails',
      type: 'checkbox',
      label: 'Show Filmstrip Rails',
      defaultValue: true,
      admin: {
        description:
          'Toggle the top and bottom sprocket-perforation rail chrome on every page.',
      },
    },

    // ── Build Metadata (read-only) ────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Build Metadata (read-only)',
      admin: {
        description: 'Set automatically by the seed/CI pipeline. Do not edit manually.',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'lastDeployed',
              type: 'date',
              label: 'Last Deployed',
              admin: {
                readOnly: true,
                description: 'Timestamp of the last CI deploy.',
                date: {
                  displayFormat: 'd MMM yyyy, HH:mm',
                },
                width: '50%',
              },
            },
            {
              name: 'seededVersion',
              type: 'text',
              label: 'Seeded Version',
              admin: {
                readOnly: true,
                description: 'Semver of the last seed script run (e.g. "1.0.0").',
                width: '50%',
              },
            },
          ],
        },
      ],
    },
  ],
}
