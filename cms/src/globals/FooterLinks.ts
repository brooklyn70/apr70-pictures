import type { GlobalConfig } from 'payload'

/**
 * FooterLinks — singleton global for the site footer navigation.
 *
 * Rendered as a 4-column grid in Footer.astro:
 *   Col 1: Primary nav links (main pages)
 *   Col 2: Division links  (212 / 310 / NRC)
 *   Col 3: More links      (press, jobs, pitch)
 *   Col 4: Legal / social  (filled by the static template; no CMS field needed)
 *
 * Link shape: { label, href, openInNewTab? }
 */
export const FooterLinks: GlobalConfig = {
  slug: 'footer-links',
  label: 'Footer Links',
  access: {
    read: () => true,
  },
  admin: {
    // v10 admin trim (Marco 2026-07-12): fed the retired v4 surface; hidden, not deleted — data kept for archive/possible v11 reuse.
    hidden: true,
    description: 'Navigation links displayed in the 4-column site footer grid.',
  },
  fields: [
    // ── Column 1: Primary nav ────────────────────────────────────────────────
    {
      name: 'primaryNav',
      type: 'array',
      label: 'Primary Nav',
      maxRows: 8,
      admin: {
        description: 'Column 1 — main site pages (Work, About, Investors, Contact, …).',
        components: {
          RowLabel: {
            path: '@/components/RowLabel#RowLabel',
            clientProps: { field: 'label', fallback: 'Link' },
          },
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Label',
              required: true,
              admin: { width: '40%' },
            },
            {
              name: 'href',
              type: 'text',
              label: 'Path / URL',
              required: true,
              admin: {
                description: 'e.g. /work or https://…',
                width: '60%',
              },
            },
          ],
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          label: 'Open in new tab',
          defaultValue: false,
        },
      ],
    },

    // ── Column 2: Division links ─────────────────────────────────────────────
    {
      name: 'divisionNav',
      type: 'array',
      label: 'Division Nav',
      maxRows: 6,
      admin: {
        description: 'Column 2 — links to division pages ((212), (310), NRC).',
        components: {
          RowLabel: {
            path: '@/components/RowLabel#RowLabel',
            clientProps: { field: 'label', fallback: 'Link' },
          },
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Label',
              required: true,
              admin: { width: '40%' },
            },
            {
              name: 'href',
              type: 'text',
              label: 'Path / URL',
              required: true,
              admin: { width: '60%' },
            },
          ],
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          label: 'Open in new tab',
          defaultValue: false,
        },
      ],
    },

    // ── Column 3: More links ─────────────────────────────────────────────────
    {
      name: 'moreNav',
      type: 'array',
      label: 'More Links',
      maxRows: 8,
      admin: {
        description: 'Column 3 — secondary links (Press, Careers, Pitch, News, …).',
        components: {
          RowLabel: {
            path: '@/components/RowLabel#RowLabel',
            clientProps: { field: 'label', fallback: 'Link' },
          },
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Label',
              required: true,
              admin: { width: '40%' },
            },
            {
              name: 'href',
              type: 'text',
              label: 'Path / URL',
              required: true,
              admin: { width: '60%' },
            },
          ],
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          label: 'Open in new tab',
          defaultValue: false,
        },
      ],
    },
  ],
}
