import type { GlobalConfig } from 'payload'

import { V9_SECTION_BLOCKS } from '../blocks/v9Sections'

/**
 * The five v9 page globals — one per public route of the v9 site
 * (/, /slate, /craft, /methods, /contact). Each is an editor-ordered stack
 * of the shared v9 section blocks plus its own SEO strings, seeded from the
 * vault copy canon (11.12 V9 Build/02-copy) by cms/scripts/seed-v9.ts.
 * Per-property pages (/work/<slug>) come from the Projects collection.
 */
const createV9PageGlobal = (opts: {
  slug: string
  label: string
  route: string
}): GlobalConfig => ({
  slug: opts.slug,
  label: opts.label,
  access: {
    read: () => true,
  },
  admin: {
    group: 'Site v9',
    description: `Sections and SEO strings for ${opts.route} on the v9 site. Reorder, edit, or add sections freely; the page renders this stack top to bottom.`,
  },
  fields: [
    {
      name: 'seoTitle',
      type: 'text',
      label: 'SEO title',
      admin: { description: 'The <title> of the page.' },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      label: 'SEO description',
      admin: { description: 'The meta description of the page.' },
    },
    {
      name: 'sections',
      type: 'blocks',
      blocks: V9_SECTION_BLOCKS,
      labels: { singular: 'Section', plural: 'Sections' },
    },
  ],
})

export const V9Home = createV9PageGlobal({
  slug: 'v9-home',
  label: 'Site v9 · Home',
  route: '/',
})

export const V9Slate = createV9PageGlobal({
  slug: 'v9-slate',
  label: 'Site v9 · Slate',
  route: '/slate',
})

export const V9Craft = createV9PageGlobal({
  slug: 'v9-craft',
  label: 'Site v9 · Craft',
  route: '/craft',
})

export const V9Methods = createV9PageGlobal({
  slug: 'v9-methods',
  label: 'Site v9 · Methods',
  route: '/methods',
})

export const V9Contact = createV9PageGlobal({
  slug: 'v9-contact',
  label: 'Site v9 · Contact',
  route: '/contact',
})
