/**
 * Default Payload `layout` blocks for division globals (212, 310, nrc).
 * v2 had no division routes; these are editorial starters for BlockRenderer.
 */

import { createSimpleLexical } from './map-layout.js'

export type DivisionSlug = '212' | '310' | 'nrc'

/**
 * Shared "Family of Companies" showcase rendered as the approved
 * v0-slate-stack variant. Used on every division global and the home
 * layout so all three marks stay one click apart.
 */
function slateStackShowcase(): unknown {
  return {
    blockType: 'divisionShowcase',
    variant: 'v0-slate-stack',
    divisions: [
      {
        name: '(212) Pictures',
        colorToken: '212-sicilian-orange',
        subtitle: 'Brooklyn, New York',
        description:
          'Character-driven theatrical development and production. Long-view physical craft, in-house origination.',
      },
      {
        name: '(310) Pictures',
        colorToken: '310-imax',
        subtitle: 'Los Angeles, California',
        description:
          'Large-format origination and partner-finance packaging. Built for the print path before cameras roll.',
      },
      {
        name: 'NRC',
        colorToken: 'nrc-navy',
        subtitle: 'New Renaissance Cinema',
        description:
          'Specialty exhibition and restoration-minded development. Films that belong in cinemas with intent.',
      },
    ],
  }
}

export function buildDefaultDivisionLayout(slug: DivisionSlug): unknown[] {
  if (slug === '212') {
    return [
      {
        blockType: 'hero',
        variant: 'default',
        heading: '(212) PICTURES',
        subtext: 'Brooklyn-rooted development and production.',
        division: 'pictures-212',
      },
      slateStackShowcase(),
      {
        blockType: 'twoCol',
        leftHeading: 'Mandate',
        rightBody: createSimpleLexical(
          'The 212 slate focuses on character-driven stories with theatrical ambition.\n' +
            'Development originates in-house; we partner selectively with writers and directors who share the long-view discipline of physical production.',
        ),
        ratio: '1-2',
        alignment: 'top',
      },
      {
        blockType: 'richText',
        megaScale: false,
        content: createSimpleLexical(
          'Explore active and catalog titles on the work index. Editorial and press links live in the site footer.',
        ),
      },
      {
        blockType: 'cta',
        heading: 'View the slate',
        buttons: [{ label: 'Work', url: '/work', variant: 'solid' }],
      },
    ]
  }

  if (slug === '310') {
    return [
      {
        blockType: 'hero',
        variant: 'default',
        heading: '(310) PICTURES',
        subtext: 'West-coast pipeline for scale and format origination.',
        division: 'pictures-310',
      },
      slateStackShowcase(),
      {
        blockType: 'twoCol',
        leftHeading: 'Mandate',
        rightBody: createSimpleLexical(
          '310 incubates larger-format work where exhibition craft and partner finance meet.\n' +
            'We build packages with clear audience geometry before cameras roll.',
        ),
        ratio: '1-2',
        alignment: 'top',
      },
      {
        blockType: 'richText',
        megaScale: false,
        content: createSimpleLexical(
          'Project cards on the work page carry division tags; filter mentally for 310 when comparing slate shape to 212.',
        ),
      },
      {
        blockType: 'cta',
        heading: 'View the slate',
        buttons: [{ label: 'Work', url: '/work', variant: 'solid' }],
      },
    ]
  }

  return [
    {
      blockType: 'hero',
      variant: 'default',
      heading: 'NEW RENAISSANCE CINEMA',
      subtext: 'NRC — specialty exhibition and restoration-minded development.',
      division: 'nrc',
    },
    slateStackShowcase(),
    {
      blockType: 'twoCol',
      leftHeading: 'Mandate',
      rightBody: createSimpleLexical(
        'NRC holds the specialty lane: films that belong in cinemas with intent, not algorithms.\n' +
          'We develop with distributors early when the print path is part of the idea.',
      ),
      ratio: '1-2',
      alignment: 'top',
    },
    {
      blockType: 'richText',
      megaScale: false,
      content: createSimpleLexical(
        'Use Contact for acquisition or booking conversations. Work lists NRC-tagged projects alongside sister divisions.',
      ),
    },
    {
      blockType: 'cta',
      heading: 'View the slate',
      buttons: [{ label: 'Work', url: '/work', variant: 'solid' }],
    },
  ]
}
