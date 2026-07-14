import type { Block } from 'payload'

/**
 * V9 section blocks — one block per `::section <kind>` in the v9 copy canon
 * (vault: 11.12 V9 Build/02-copy). The five "Site v9 · <Page>" globals share
 * this exact set via V9_SECTION_BLOCKS, so every v9 page is an editor-ordered
 * stack of these sections.
 *
 * Conventions carried over from the copy grammar:
 *  - "caption" and "credit" are the two halves of the copy's
 *    "text | credit-suffix" caption lines.
 *  - ==text== inside any string means the frontend renders a highlight.
 *  - body fields are plain-markdown textareas (paragraphs split on blank
 *    lines; **bold**, *italics*, [links](/x) allowed). No Lexical here on
 *    purpose: these are short, hand-set passages.
 */

export const V9PhotoFoldBlock: Block = {
  slug: 'photoFold',
  labels: { singular: 'Photo fold', plural: 'Photo folds' },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'The full-bleed photograph. Alt text lives on the media doc. Use the crop/focal point tools on the media doc to control how it sits in the box.',
      },
    },
    {
      name: 'kicker',
      type: 'text',
      admin: { description: 'Small line above the headline (e.g. "A film & television studio · Long Island City, NY"). Home hero only.' },
    },
    {
      name: 'heading',
      type: 'text',
      admin: { description: 'The H1 laid over the photo. Leave empty for photo-only folds.' },
    },
    {
      name: 'caption',
      type: 'text',
      admin: { description: 'Caption under the photo, before the credit. ==text== renders highlighted.' },
    },
    {
      name: 'credit',
      type: 'text',
      admin: { description: 'Credit suffix after the caption (e.g. "AI-generated development frame").' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'vh100',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Full-viewport-height fold (the home hero).', width: '50%' },
        },
        {
          name: 'eager',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Load eagerly (first image on the page).', width: '50%' },
        },
      ],
    },
  ],
}

export const V9RouteLineBlock: Block = {
  slug: 'routeLine',
  labels: { singular: 'Route line', plural: 'Route lines' },
  fields: [
    {
      name: 'links',
      type: 'array',
      labels: { singular: 'Route', plural: 'Routes' },
      admin: { description: 'The inline route strip (Slate / Craft / Methods / Contact).' },
      fields: [
        { name: 'href', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}

export const V9TextFoldBlock: Block = {
  slug: 'textFold',
  labels: { singular: 'Text fold', plural: 'Text folds' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'scene',
          type: 'text',
          admin: { description: 'Scene number shown in the margin (e.g. "1").', width: '33%' },
        },
        {
          name: 'sceneSlug',
          type: 'text',
          label: 'Scene slug',
          admin: { description: 'The slugline over the section (e.g. "INT. THE IDEA - NIGHT").', width: '67%' },
        },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      admin: { description: 'Section heading.' },
    },
    {
      name: 'lede',
      type: 'textarea',
      admin: { description: 'Larger opening paragraph, set apart from the body.' },
    },
    {
      name: 'body',
      type: 'textarea',
      admin: {
        description:
          'Body copy. Blank line starts a new paragraph. **bold**, ==highlight== and [links](/slate) allowed.',
      },
    },
    {
      name: 'quote',
      type: 'textarea',
      admin: { description: 'Optional pull quote inside the fold.' },
    },
    {
      name: 'cite',
      type: 'text',
      admin: { description: 'Attribution for the pull quote.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'moreHref',
          type: 'text',
          label: 'More link URL',
          admin: { description: 'Optional "read more" route (e.g. /craft).', width: '50%' },
        },
        {
          name: 'moreLabel',
          type: 'text',
          label: 'More link label',
          admin: { description: 'e.g. "Principles of the craft →".', width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'linkHref',
          type: 'text',
          label: 'Inline link URL',
          admin: { description: 'Optional inline link (contact page mailto).', width: '50%' },
        },
        {
          name: 'linkLabel',
          type: 'text',
          label: 'Inline link label',
          admin: { description: 'e.g. "caruso@apr70.com".', width: '50%' },
        },
      ],
    },
    {
      name: 'ariaLabel',
      type: 'text',
      label: 'ARIA label',
      admin: { description: 'Optional accessible name for the section landmark.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'tight',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Tight spacing variant (short folds that lead into a list).', width: '50%' },
        },
        {
          name: 'asH1',
          type: 'checkbox',
          label: 'Heading is the page H1',
          defaultValue: false,
          admin: { description: 'Render the heading as the page H1 (interior pages).', width: '50%' },
        },
      ],
    },
  ],
}

export const V9QuoteFeatureBlock: Block = {
  slug: 'quoteFeature',
  labels: { singular: 'Quote feature', plural: 'Quote features' },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      admin: { description: 'The featured quotation, set large.' },
    },
    {
      name: 'cite',
      type: 'text',
      admin: { description: 'Who said it (e.g. "Alfred Hitchcock").' },
    },
    {
      name: 'note',
      type: 'text',
      admin: { description: 'Source note (e.g. "Hitchcock/Truffaut, 1962 interviews").' },
    },
  ],
}

export const V9SlateListBlock: Block = {
  slug: 'slateList',
  labels: { singular: 'Slate list', plural: 'Slate lists' },
  fields: [
    {
      name: 'rows',
      type: 'array',
      labels: { singular: 'Slate row', plural: 'Slate rows' },
      admin: {
        description:
          'One row per property. Link a Project and the row can pull from it; the fields below are the exact display copy and win when set.',
      },
      fields: [
        {
          name: 'project',
          type: 'relationship',
          relationTo: 'projects',
          admin: { description: 'The Project this row points at (preferred; keeps the row in sync with /work/<slug>).' },
        },
        {
          name: 'title',
          type: 'text',
          admin: { description: 'Display title for the row (overrides the project title when set).' },
        },
        {
          name: 'href',
          type: 'text',
          admin: { description: 'Row link (e.g. /work/sea-gate).' },
        },
        {
          name: 'logline',
          type: 'textarea',
          admin: { description: 'Logline shown on this list (home uses the short one, /slate the full one).' },
        },
        {
          name: 'provenance',
          type: 'text',
          admin: { description: 'Source line for public-domain adaptations (e.g. "After Dashiell Hammett’s *Red Harvest* (1929)…").' },
        },
        {
          name: 'meta',
          type: 'text',
          admin: {
            description:
              'IGNORED on the public site. Billing comes only from Project.metaLine. Leave empty; do not edit. (Legacy seed field kept so re-seed clears stay compatible.)',
          },
        },
        {
          name: 'dev',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Development styling flag from the copy (dev: true rows).' },
        },
      ],
    },
  ],
}

export const V9FootnoteBlock: Block = {
  slug: 'footnote',
  labels: { singular: 'Footnote', plural: 'Footnotes' },
  fields: [
    {
      name: 'body',
      type: 'textarea',
      admin: { description: 'Small-type footnote paragraph. Markdown links allowed.' },
    },
  ],
}

export const V9RequestBlock: Block = {
  slug: 'request',
  labels: { singular: 'Request materials', plural: 'Request sections' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'scene',
          type: 'text',
          admin: { description: 'Scene number in the margin.', width: '33%' },
        },
        {
          name: 'sceneSlug',
          type: 'text',
          label: 'Scene slug',
          admin: { description: 'e.g. "INT. THE READING - NIGHT".', width: '67%' },
        },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      admin: { description: 'e.g. "Read the pages."' },
    },
    {
      name: 'body',
      type: 'textarea',
      admin: { description: 'The request paragraph.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'linkHref',
          type: 'text',
          label: 'CTA URL',
          admin: { description: 'Where the request button goes (e.g. /contact).', width: '50%' },
        },
        {
          name: 'linkLabel',
          type: 'text',
          label: 'CTA label',
          admin: { description: 'e.g. "Request materials".', width: '50%' },
        },
      ],
    },
  ],
}

export const V9LedgerBlock: Block = {
  slug: 'ledger',
  labels: { singular: 'Ledger', plural: 'Ledgers' },
  fields: [
    {
      name: 'ariaLabel',
      type: 'text',
      label: 'ARIA label',
      admin: { description: 'Accessible name for the definition list (e.g. "The disclosure ledger").' },
    },
    {
      name: 'rows',
      type: 'array',
      labels: { singular: 'Entry', plural: 'Entries' },
      admin: { description: 'Term / definition pairs (the disclosure ledger on /methods).' },
      fields: [
        {
          name: 'term',
          type: 'text',
          admin: { description: 'The dt (e.g. "Scripts").' },
        },
        {
          name: 'definition',
          type: 'textarea',
          admin: { description: 'The dd. **bold** allowed.' },
        },
      ],
    },
  ],
}

export const V9ArchivalBlock: Block = {
  slug: 'archival',
  labels: { singular: 'Archival image', plural: 'Archival images' },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'A verified public-domain archival photograph or map.' },
    },
    {
      name: 'caption',
      type: 'text',
      admin: { description: 'Caption before the credit.' },
    },
    {
      name: 'credit',
      type: 'text',
      admin: { description: 'Provenance suffix (date, PD basis, source) — required by the disclosure law.' },
    },
  ],
}

export const V9DivisionStripBlock: Block = {
  slug: 'divisionStrip',
  labels: { singular: 'Division strip', plural: 'Division strips' },
  fields: [
    {
      name: 'divisions',
      type: 'array',
      labels: { singular: 'Division', plural: 'Divisions' },
      admin: { description: 'The three-division strip on /slate.' },
      fields: [
        { name: 'name', type: 'text', admin: { description: 'e.g. "(212) Pictures".' } },
        { name: 'blurb', type: 'text', admin: { description: 'One-line division description.' } },
      ],
    },
  ],
}

export const V9MoodGridBlock: Block = {
  slug: 'moodGrid',
  labels: { singular: 'Mood grid', plural: 'Mood grids' },
  fields: [
    {
      name: 'ariaLabel',
      type: 'text',
      label: 'ARIA label',
      admin: { description: 'Accessible name (e.g. "Development frames · Sea Gate").' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'scene',
          type: 'text',
          admin: { description: 'Scene number in the margin.', width: '33%' },
        },
        {
          name: 'sceneSlug',
          type: 'text',
          label: 'Scene slug',
          admin: { description: 'e.g. "EXT. TWO CITIES - TEN DAYS".', width: '67%' },
        },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      admin: { description: 'e.g. "The world of the picture."' },
    },
    {
      name: 'slideshow',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Also run the grid as a slideshow.' },
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Frame', plural: 'Frames' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Alt text lives on the media doc.' },
        },
        {
          name: 'caption',
          type: 'text',
          admin: { description: 'Caption before the credit.' },
        },
        {
          name: 'credit',
          type: 'text',
          admin: { description: 'Credit suffix (e.g. "AI-generated development frame").' },
        },
        {
          name: 'wide',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Span the full grid width (maps, panoramas).' },
        },
      ],
    },
  ],
}

export const V9FoundingRollBlock: Block = {
  slug: 'foundingRoll',
  labels: { singular: 'Founding Roll', plural: 'Founding Roll sections' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'scene',
          type: 'text',
          admin: { description: 'Scene number in the margin.', width: '33%' },
        },
        {
          name: 'sceneSlug',
          type: 'text',
          label: 'Scene slug',
          admin: { description: 'e.g. "INT. THE ROLL - NIGHT".', width: '67%' },
        },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      admin: { description: 'e.g. "The Founding Roll."' },
    },
    {
      name: 'body',
      type: 'textarea',
      admin: {
        description:
          'The enrollment paragraph. Plain markdown (**bold**, ==highlight==). No em dashes (copy law).',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'submitLabel',
          type: 'text',
          admin: { description: 'The enroll button label (e.g. "Take a number").', width: '50%' },
        },
        {
          name: 'showCount',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Print the current roll count above the form (the v5 design law).',
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'successNote',
      type: 'text',
      admin: {
        description: 'Shown after a successful enrollment, before the assigned number.',
      },
    },
  ],
}

/** The shared section set for every "Site v9 · <Page>" global. */
export const V9_SECTION_BLOCKS: Block[] = [
  V9PhotoFoldBlock,
  V9RouteLineBlock,
  V9TextFoldBlock,
  V9QuoteFeatureBlock,
  V9SlateListBlock,
  V9FootnoteBlock,
  V9RequestBlock,
  V9LedgerBlock,
  V9ArchivalBlock,
  V9DivisionStripBlock,
  V9MoodGridBlock,
  V9FoundingRollBlock,
]
