import type { CollectionConfig } from 'payload'

/**
 * DispatchIssue — one document per quarterly issue of DISPATCH.
 *
 * The renderer at /news picks the issue marked `current: true`.
 * Past issues populate the Archive strip.
 *
 * Shape mirrors the JSX `DISPATCH_DATA` contract from the Marco
 * design package (Vol. 01 No. 01, Spring 2026) verbatim so the
 * Astro components can read each section by name.
 */
export const DispatchIssue: CollectionConfig = {
  slug: 'dispatch-issues',
  labels: { singular: 'Dispatch Issue', plural: 'Dispatch Issues' },
  access: { read: () => true },
  admin: {
    useAsTitle: 'displayTitle',
    defaultColumns: ['displayTitle', 'season', 'current', 'releaseDate'],
    description:
      'One full DISPATCH magazine issue. The issue with `current: true` renders at /news.',
  },
  fields: [
    // ───── Sidebar / indicia ─────
    {
      name: 'displayTitle',
      type: 'text',
      required: true,
      admin: {
        description:
          'Admin label, e.g. "Vol. 01 No. 01 — Spring 2026". Not shown on the rendered page.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'current',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Mark exactly one issue current. Renders at /news.',
      },
    },
    {
      name: 'releaseDate',
      type: 'date',
      admin: { position: 'sidebar' },
    },

    // ───── Indicia (top-line issue meta) ─────
    {
      name: 'indicia',
      type: 'group',
      label: 'Indicia',
      fields: [
        { name: 'volume', type: 'text', required: true, defaultValue: 'VOL. 01' },
        { name: 'number', type: 'text', required: true, defaultValue: 'NO. 01' },
        { name: 'season', type: 'text', required: true, defaultValue: 'SPRING 2026' },
        { name: 'reel', type: 'text', defaultValue: 'REEL 086' },
        { name: 'isoDate', type: 'text', defaultValue: 'APR · MAY · JUN 2026' },
        { name: 'printRun', type: 'text', defaultValue: 'PRESSRUN 1,200' },
        { name: 'offices', type: 'text', defaultValue: 'LIC NY 11101' },
        { name: 'tagline', type: 'text', defaultValue: 'PRECISE. PURPOSEFUL. BUILT TO LAST.' },
      ],
    },

    // ───── Cover ─────
    {
      name: 'cover',
      type: 'group',
      label: 'Cover',
      fields: [
        { name: 'kicker', type: 'text' },
        { name: 'deck', type: 'textarea' },
        { name: 'byline', type: 'text' },
        { name: 'coverImage', type: 'upload', relationTo: 'media' },
        {
          name: 'lines',
          type: 'array',
          labels: { singular: 'Headline word', plural: 'Headline words' },
          admin: { description: 'Big cover headline split into stylable words.' },
          fields: [
            { name: 'text', type: 'text', required: true },
            {
              name: 'style',
              type: 'select',
              defaultValue: 'normal',
              options: [
                { label: 'Normal', value: 'normal' },
                { label: 'Accent (colored)', value: 'accent' },
                { label: 'Outline (stroked)', value: 'outline' },
              ],
            },
          ],
        },
        {
          name: 'coverlines',
          type: 'array',
          labels: { singular: 'Coverline', plural: 'Coverlines' },
          fields: [
            { name: 'num', type: 'text' },
            { name: 'head', type: 'text' },
            { name: 'deck', type: 'text' },
          ],
        },
      ],
    },

    // ───── Contents ─────
    {
      name: 'contents',
      type: 'array',
      labels: { singular: 'Contents group', plural: 'Contents groups' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'meta', type: 'text' },
        {
          name: 'entries',
          type: 'array',
          fields: [
            { name: 'folio', type: 'text', required: true },
            { name: 'title', type: 'text', required: true },
            { name: 'deck', type: 'textarea' },
            { name: 'by', type: 'text' },
          ],
        },
      ],
    },

    // ───── From the Editor ─────
    {
      name: 'editorial',
      type: 'group',
      label: 'From the Editor',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'lead', type: 'textarea' },
        {
          name: 'paragraphs',
          type: 'array',
          fields: [{ name: 'text', type: 'textarea', required: true }],
        },
        { name: 'signatureName', type: 'text' },
        { name: 'signatureMeta', type: 'text' },
        { name: 'quote', type: 'textarea' },
        { name: 'portrait', type: 'upload', relationTo: 'media' },
      ],
    },

    // ───── Feature (cover story) ─────
    {
      name: 'feature',
      type: 'group',
      label: 'Cover Story',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'deck', type: 'textarea' },
        { name: 'jumpFrom', type: 'text' },
        { name: 'jumpTo', type: 'text' },
        { name: 'heroImage', type: 'upload', relationTo: 'media' },
        {
          name: 'titleParts',
          type: 'array',
          labels: { singular: 'Title word', plural: 'Title words' },
          fields: [
            { name: 'text', type: 'text', required: true },
            { name: 'italic', type: 'checkbox', defaultValue: false },
          ],
        },
        {
          name: 'meta',
          type: 'array',
          labels: { singular: 'Meta row', plural: 'Meta rows' },
          fields: [
            { name: 'key', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
          ],
        },
        {
          name: 'imageCaption',
          type: 'group',
          fields: [
            { name: 'caption', type: 'text' },
            { name: 'credit', type: 'text' },
          ],
        },
        {
          name: 'paragraphs',
          type: 'array',
          labels: { singular: 'Paragraph', plural: 'Paragraphs' },
          fields: [
            {
              name: 'variant',
              type: 'select',
              required: true,
              defaultValue: 'text',
              options: [
                { label: 'Text', value: 'text' },
                { label: 'First paragraph (drop cap)', value: 'first' },
                { label: 'Pull-quote', value: 'pull' },
                { label: 'Small / break label', value: 'small' },
                { label: 'Subhead', value: 'head' },
              ],
            },
            { name: 'text', type: 'textarea', required: true },
            { name: 'attr', type: 'text', admin: { description: 'For pull-quotes only.' } },
          ],
        },
        {
          name: 'factbox',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', defaultValue: 'AT A GLANCE' },
            {
              name: 'fields',
              type: 'array',
              fields: [
                { name: 'key', type: 'text', required: true },
                { name: 'value', type: 'text', required: true },
                {
                  name: 'accent',
                  type: 'select',
                  defaultValue: 'none',
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'Amber (212)', value: 'amber' },
                    { label: 'Teal (310)', value: 'teal' },
                    { label: 'Orange', value: 'orange' },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'related',
          type: 'array',
          labels: { singular: 'Related item', plural: 'Related items' },
          fields: [
            { name: 'idx', type: 'text' },
            { name: 'name', type: 'text', required: true },
            { name: 'meta', type: 'text' },
          ],
        },
      ],
    },

    // ───── Slate Dispatches ─────
    {
      name: 'dispatches',
      type: 'array',
      labels: { singular: 'Dispatch', plural: 'Dispatches' },
      fields: [
        {
          name: 'division',
          type: 'select',
          required: true,
          defaultValue: '212',
          options: [
            { label: '(212) Pictures — Amber', value: '212' },
            { label: '(310) Pictures — Teal', value: '310' },
            { label: 'New Renaissance Cinema — Offwhite', value: 'nrc' },
          ],
        },
        { name: 'date', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
        { name: 'status', type: 'text' },
        { name: 'link', type: 'text' },
        { name: 'ghost', type: 'text', admin: { description: 'Ghost numerals shown behind card.' } },
      ],
    },

    // ───── Trades ─────
    {
      name: 'trades',
      type: 'array',
      labels: { singular: 'Trade clipping', plural: 'Trades' },
      fields: [
        { name: 'pub', type: 'text', required: true },
        { name: 'city', type: 'text' },
        { name: 'headline', type: 'text', required: true },
        { name: 'deck', type: 'textarea' },
        { name: 'attr', type: 'text' },
      ],
    },

    // ───── Calendar ─────
    {
      name: 'calendar',
      type: 'array',
      labels: { singular: 'Calendar entry', plural: 'Calendar' },
      fields: [
        { name: 'date', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'sub', type: 'text' },
        { name: 'tag', type: 'text' },
      ],
    },

    // ───── Classifieds ─────
    {
      name: 'classifieds',
      type: 'array',
      labels: { singular: 'Classified', plural: 'Classifieds' },
      fields: [
        { name: 'cat', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
        { name: 'meta', type: 'text' },
      ],
    },

    // ───── Archive ─────
    {
      name: 'archive',
      type: 'array',
      labels: { singular: 'Archive card', plural: 'Archive' },
      fields: [
        { name: 'vol', type: 'text' },
        { name: 'no', type: 'text' },
        { name: 'season', type: 'text' },
        { name: 'mast', type: 'text', label: 'Masthead label' },
        { name: 'line', type: 'text' },
        { name: 'state', type: 'text' },
        { name: 'isCurrent', type: 'checkbox', defaultValue: false },
      ],
    },

    // ───── Colophon ─────
    {
      name: 'colophon',
      type: 'group',
      fields: [
        { name: 'legal', type: 'textarea' },
        { name: 'type', type: 'textarea' },
        { name: 'baseline', type: 'text' },
      ],
    },
  ],
}
