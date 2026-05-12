import { BlocksFeature, TextStateFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { d7LexicalBlocks } from '../blocks/D7LexicalBlocks'

/**
 * APR 70 brand color palette for the Lexical Color Injector.
 *
 * These map 1:1 to the canonical token slugs in tokens.css.
 * The CSS values reference CSS custom properties so they resolve correctly
 * in both dark and light mode without any duplicated color logic here.
 *
 * Serialized form in Payload DB: `{ color: "212-amber" }` on the text node.
 * Astro renderer converts this to: `<span data-color="212-amber">` which is
 * then styled by the `[data-color="212-amber"]` selectors already in tokens.css.
 */
const APR_BRAND_COLORS = {
  '212-amber': {
    label: '212 Amber',
    css: { color: 'var(--color-212-amber)' },
  },
  '212-sicilian-orange': {
    label: '212 Sicilian Orange',
    css: { color: 'var(--color-212-sicilian-orange)' },
  },
  '310-imax': {
    label: '310 IMAX',
    css: { color: 'var(--color-310-imax)' },
  },
  'nrc-grey': {
    label: 'NRC Grey',
    css: { color: 'var(--color-nrc-grey)' },
  },
  '310-sicilian-blue': {
    label: '310 Sicilian Blue',
    css: { color: 'var(--color-310-sicilian-blue)' },
  },
  'nrc-navy': {
    label: 'NRC Navy',
    css: { color: 'var(--color-nrc-navy)' },
  },
} as const

/**
 * Mega Scale display toggle for the Lexical inline toolbar.
 *
 * A single `mega` value maps to the `[data-display="mega"]` CSS selector
 * in tokens.css (clamp(3.5rem, 15vw, 18rem), Futura Std Bold, leading-crush).
 *
 * This is an inline-level toggle: editors select a text run and click
 * "Mega" in the toolbar — the text escalates to cinema/editorial display scale
 * without affecting the semantic heading level of its paragraph.
 *
 * The block-level `megaScale` checkbox in RichTextBlock applies the same class
 * to the entire wrapper div. Both coexist independently.
 *
 * Serialized form in DB: `{ display: "mega" }` on the text node.
 * Astro renderer converts this to: `<span data-display="mega">`.
 */
const APR_DISPLAY_STATES = {
  mega: {
    label: 'Mega Scale',
    css: {
      'font-family': 'var(--font-display)',
      'font-weight': '700',
      'font-size': 'var(--type-hero)',
      'line-height': 'var(--leading-crush)',
      'letter-spacing': 'var(--track-tight)',
      'text-transform': 'uppercase',
    },
  },
} as const

/**
 * Global Lexical config: default editor features + v2 D-7 custom blocks
 * + APR 70 brand color injector + Mega Scale inline toggle.
 *
 * Both features use TextStateFeature — each registered with its own
 * state key (`color`, `display`) in a single plugin call so they share
 * one toolbar group and one serialization pass.
 */
export const aprLexicalEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    BlocksFeature({
      blocks: d7LexicalBlocks,
    }),
    TextStateFeature({
      state: {
        color: APR_BRAND_COLORS,
        display: APR_DISPLAY_STATES,
      },
    }),
  ],
})
