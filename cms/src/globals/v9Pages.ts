import type { GlobalConfig } from 'payload'

import { V9_SECTION_BLOCKS } from '../blocks/v9Sections'
import { SITE_VERSION } from '../siteVersion'

/**
 * The five page globals — one per public route of the site
 * (/, /slate, /craft, /methods, /contact). Each is an editor-ordered stack
 * of the shared section blocks plus its own SEO strings, seeded from the
 * vault copy canon (11.12 V9 Build/02-copy) by cms/scripts/seed-v9.ts.
 * Per-property pages (/work/<slug>) come from the Projects collection.
 *
 * The slugs still read `v9-*` because they are Postgres table names. What
 * Marco sees in the admin is driven by SITE_VERSION — see ../siteVersion.ts.
 */
const createPageGlobal = (opts: {
  slug: string
  name: string
  route: string
}): GlobalConfig => ({
  slug: opts.slug,
  label: `Site ${SITE_VERSION} · ${opts.name}`,
  access: {
    read: () => true,
  },
  admin: {
    group: `Site ${SITE_VERSION}`,
    description: `Sections and SEO strings for ${opts.route} on the ${SITE_VERSION} site. Reorder, edit, or add sections freely; the page renders this stack top to bottom.`,
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

export const V9Home = createPageGlobal({
  slug: 'v9-home',
  name: 'Home',
  route: '/',
})

export const V9Slate = createPageGlobal({
  slug: 'v9-slate',
  name: 'Slate',
  route: '/slate',
})

export const V9Craft = createPageGlobal({
  slug: 'v9-craft',
  name: 'Craft',
  route: '/craft',
})

export const V9Methods = createPageGlobal({
  slug: 'v9-methods',
  name: 'Methods',
  route: '/methods',
})

export const V9Contact = createPageGlobal({
  slug: 'v9-contact',
  name: 'Contact',
  route: '/contact',
})
