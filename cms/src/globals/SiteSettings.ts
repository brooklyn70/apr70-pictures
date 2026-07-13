import type { GlobalConfig } from 'payload'

import { SITE_VERSION } from '../siteVersion'

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

    // ── Brand Kit (v10, F1) ───────────────────────────────────────────────────
    // Marco's brand control room. Logo presentation and the canonical theme
    // colors are edited HERE, not in CSS. The public site reads this global
    // server-side on every render (short SWR cache), so edits appear after a
    // page refresh — no code deploy. Colors are curated named tokens, not
    // free-form: each option maps to contrast-safe OKLCH pairs (dark + light
    // mode variants) defined once in marquee.css.
    {
      name: 'brandKit',
      type: 'group',
      label: 'Brand Kit (v10)',
      admin: {
        description:
          'Logo size and the canonical theme colors (accent, link rollover, selection highlight, default mode). Public site reflects changes on refresh.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'logoHeight',
              type: 'number',
              label: 'Logo height (px)',
              min: 24,
              max: 72,
              defaultValue: 34,
              admin: {
                description:
                  'Height of the nav brand mark in pixels (24–72). Admin-set; there is no visitor control.',
                width: '50%',
              },
            },
            {
              name: 'modeDefault',
              type: 'select',
              label: 'Default mode',
              defaultValue: 'system',
              options: [
                { label: 'System (follow visitor OS)', value: 'system' },
                { label: 'Marquee Night (dark)', value: 'dark' },
                { label: 'House Lights (light)', value: 'light' },
              ],
              admin: {
                description:
                  'Mode used when a visitor has not chosen one. Visitor choice in the Display panel still wins.',
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'accent',
          type: 'select',
          label: 'Brand accent',
          defaultValue: 'flame',
          options: [
            { label: 'Flame — 212 Sicilian Orange (house default)', value: 'flame' },
            { label: '212 Amber', value: 'amber' },
            { label: '310 IMAX Teal', value: 'imax' },
            { label: '310 Sicilian Blue', value: 'sicilian-blue' },
            { label: 'NRC Grey (quiet)', value: 'nrc-grey' },
          ],
          admin: {
            description:
              'The lead accent: editorial CTA underline, active nav, focus ring, flame details. Each option carries dark-mode and light-mode OKLCH variants that pass contrast.',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'linkHover',
              type: 'select',
              label: 'Link rollover',
              defaultValue: 'accent',
              options: [
                { label: 'Follow the brand accent', value: 'accent' },
                { label: 'Flame', value: 'flame' },
                { label: '212 Amber', value: 'amber' },
                { label: '310 IMAX Teal', value: 'imax' },
                { label: '310 Sicilian Blue', value: 'sicilian-blue' },
                { label: 'Ink (quiet darken/brighten)', value: 'ink' },
              ],
              admin: {
                description: 'Color links and nav items turn on hover/rollover.',
                width: '50%',
              },
            },
            {
              name: 'highlight',
              type: 'select',
              label: 'Selection highlight',
              defaultValue: 'flame',
              options: [
                { label: 'Flame on ink', value: 'flame' },
                { label: '212 Amber on paper', value: 'amber' },
                { label: '310 Sicilian Blue on paper', value: 'sicilian-blue' },
                { label: 'Ink on paper (quiet)', value: 'ink' },
              ],
              admin: {
                description:
                  'Text-selection (::selection) pair. Each option is a tested background/foreground pair.',
                width: '50%',
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
      label: `${SITE_VERSION} Chrome (header · Display panel · footer)`,
      admin: {
        description: `Every string in the ${SITE_VERSION} site chrome: the Display panel labels, footer colophon, copyright, and nav links. Seeded from the vault chrome.md canon.`,
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

    // ── DISPATCH switch (v10, Marco 2026-07-13) ───────────────────────────────
    // The news page, parked and reversible. The site is SSR, so this checkbox
    // is a real switch, not a build flag: tick it, refresh the site, the page
    // is live. Untick it and it's gone — the issues are kept either way.
    {
      name: 'dispatch',
      type: 'group',
      label: 'DISPATCH (the news page)',
      admin: {
        description:
          'DISPATCH is the studio news page — the old /news, rebuilt in the current house style. It ships OFF: /dispatch returns 404 and no nav link appears. Tick Publish and refresh the site and the page is live immediately, with no deploy. Write issues under Dispatch Issues; the one marked "current" is the one that renders.',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Publish the DISPATCH page',
          defaultValue: false,
          admin: {
            description:
              'On: /dispatch is live and joins the nav. Off: the page 404s and the link disappears. Taking it down never deletes an issue.',
          },
        },
        {
          name: 'navLabel',
          type: 'text',
          label: 'Nav label',
          defaultValue: 'Dispatch',
          admin: {
            description: 'The word used in the site navigation while the page is live.',
          },
        },
      ],
    },

    // ── TROUPE (the radio play) ───────────────────────────────────────────────
    {
      name: 'troupe',
      type: 'group',
      label: 'TROUPE (the radio play)',
      admin: {
        description:
          'THE APR 70 TROUPE PRESENTS — the radio programme, at /troupe. It ships OFF. Unlike DISPATCH, this switch is not enough on its own: the page also needs an audio file on Troupe Programme. Both, or the route 404s. That is deliberate — a radio page with no radio on it is a promise, and promises are what the investor panel marked this company down for. Tick this, upload the recording, and the page publishes itself with no deploy.',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Publish the TROUPE page',
          defaultValue: false,
          admin: {
            description:
              'On AND an audio file present: /troupe is live and joins the nav. Either one missing: the page 404s and the link disappears. Taking it down never deletes the programme.',
          },
        },
        {
          name: 'navLabel',
          type: 'text',
          label: 'Nav label',
          defaultValue: 'Troupe',
          admin: {
            description: 'The word used in the site navigation while the page is live.',
          },
        },
      ],
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
