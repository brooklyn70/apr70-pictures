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

    // -- Brand Identity (logos & favicon) -----------------------------------------
    {
      type: 'collapsible',
      label: 'Brand Identity',
      admin: {
        description: 'Site-wide favicon and navigation logos. Upload SVG or PNG to Media first.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'favicon',
          type: 'upload',
          relationTo: 'media',
          label: 'Favicon',
          admin: {
            description: 'SVG or PNG favicon. Falls back to /favicon.svg if unset.',
          },
          filterOptions: {
            mediaKind: { in: ['favicon'] },
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'navLogoLight',
              type: 'upload',
              relationTo: 'media',
              label: 'Nav Logo (Light theme)',
              admin: {
                description: 'Logotype or mark for the header on light backgrounds.',
                width: '50%',
              },
              filterOptions: {
                mediaKind: { in: ['logo', 'wordmark'] },
              },
            },
            {
              name: 'navLogoDark',
              type: 'upload',
              relationTo: 'media',
              label: 'Nav Logo (Dark theme)',
              admin: {
                description: 'Logotype or mark for the header on dark backgrounds.',
                width: '50%',
              },
              filterOptions: {
                mediaKind: { in: ['logo', 'wordmark'] },
              },
            },
          ],
        },
      ],
    },

    // ── v9 chrome strings (seeded from 02-copy/chrome.md) ────────────────────
    {
      name: 'v9Chrome',
      type: 'group',
      label: 'v9 Chrome (header · Display panel · footer)',
      admin: {
        description:
          'Every string in the v9 site chrome: the Display panel labels, footer colophon, copyright, and nav links. Seeded from the vault chrome.md canon.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'displayLabel',
              type: 'text',
              label: 'Display button label',
              admin: { description: 'The header button that opens the Display panel.', width: '50%' },
            },
            {
              name: 'panelTitle',
              type: 'text',
              label: 'Panel title',
              admin: { description: 'Title at the top of the Display panel.', width: '50%' },
            },
          ],
        },
        {
          name: 'themeLabel',
          type: 'text',
          label: 'Theme control label',
          admin: { description: 'Label over the three theme choices.' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'themePremiere',
              type: 'text',
              label: 'Theme 1 name',
              admin: { description: 'Display name of the premiere (dark) theme.', width: '33%' },
            },
            {
              name: 'themeMatinee',
              type: 'text',
              label: 'Theme 2 name',
              admin: { description: 'Display name of the matinee (light) theme.', width: '33%' },
            },
            {
              name: 'themeLateshow',
              type: 'text',
              label: 'Theme 3 name',
              admin: { description: 'Display name of the late-show theme.', width: '33%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'scaleLabel',
              type: 'text',
              label: 'Type size label',
              admin: { description: 'Label for the type-size control.', width: '50%' },
            },
            {
              name: 'logoLabel',
              type: 'text',
              label: 'Logo size label',
              admin: { description: 'Label for the logo-size control.', width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'topLabel',
              type: 'text',
              label: 'Back-to-top label',
              admin: { description: 'The back-to-top control.', width: '33%' },
            },
            {
              name: 'prevLabel',
              type: 'text',
              label: 'Previous property label',
              admin: { description: 'Prev arrow on /work/<slug> pages.', width: '33%' },
            },
            {
              name: 'nextLabel',
              type: 'text',
              label: 'Next property label',
              admin: { description: 'Next arrow on /work/<slug> pages.', width: '33%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'slateReturn',
              type: 'text',
              label: 'Slate return label',
              admin: { description: 'The "back to the whole slate" link on property pages.', width: '50%' },
            },
            {
              name: 'cta',
              type: 'text',
              label: 'Header CTA',
              admin: { description: 'The header call to action (e.g. "Request materials →").', width: '50%' },
            },
          ],
        },
        {
          name: 'colophon',
          type: 'textarea',
          admin: { description: 'The footer colophon paragraph (studio, disclosure, typography, privacy).' },
        },
        {
          name: 'copyright',
          type: 'text',
          admin: { description: 'The footer copyright line (e.g. "© 2026 APR 70 Pictures.").' },
        },
        {
          name: 'navLinks',
          type: 'array',
          label: 'Nav links',
          labels: { singular: 'Nav link', plural: 'Nav links' },
          admin: { description: 'The site navigation, in order (Home / Slate / Craft / Methods / Contact).' },
          fields: [
            { name: 'href', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
          ],
        },
      ],
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
