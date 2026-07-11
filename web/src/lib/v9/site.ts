/**
 * v9 GEO/AEO — shared NAP (name / address / presence) constants and JSON-LD
 * builders. ONE module owns the entity facts; llms.txt, robots, sitemap,
 * JSON-LD, and the layout all read from here so machines get one story.
 */

import type { Project } from 'payload-types'
import { plainText } from './inline'

export const SITE_URL = 'https://apr70.com'

export const NAP = {
  name: 'APR 70 Pictures',
  legalName: 'APR 70 Pictures',
  description:
    'APR 70 Pictures is an independent film and television studio in Long Island City, New York. Human-written scripts, classic storytelling, modern production methods, with machine-generated imagery disclosed wherever it appears.',
  email: 'caruso@apr70.com',
  locality: 'Long Island City',
  region: 'NY',
  country: 'US',
  founder: 'Marco Caruso',
  foundingYear: '2026',
  divisions: ['(212) Pictures', '(310) Pictures', 'New Renaissance Cinema'],
} as const

/** The five v9 pages, canonical order. */
export const V9_PAGES = [
  { path: '/', label: 'Home' },
  { path: '/slate', label: 'Slate' },
  { path: '/craft', label: 'Craft' },
  { path: '/methods', label: 'Methods' },
  { path: '/contact', label: 'Contact' },
] as const

export const canonical = (path: string): string =>
  `${SITE_URL}${path === '/' ? '/' : path.replace(/\/$/, '')}`

// ── JSON-LD builders ─────────────────────────────────────────────────────────

export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: NAP.name,
    legalName: NAP.legalName,
    description: NAP.description,
    url: SITE_URL,
    email: NAP.email,
    foundingDate: NAP.foundingYear,
    founder: { '@type': 'Person', name: NAP.founder },
    address: {
      '@type': 'PostalAddress',
      addressLocality: NAP.locality,
      addressRegion: NAP.region,
      addressCountry: NAP.country,
    },
    department: NAP.divisions.map((name) => ({ '@type': 'Organization', name })),
  }
}

export function webSiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: NAP.name,
    publisher: { '@id': `${SITE_URL}/#organization` },
  }
}

/** Movie when the metaLine opens "Feature", TVSeries when it opens "Series". */
export function creativeWorkType(metaLine: string | null | undefined): 'Movie' | 'TVSeries' | 'CreativeWork' {
  const m = (metaLine ?? '').trim().toLowerCase()
  if (m.startsWith('feature')) return 'Movie'
  if (m.startsWith('series')) return 'TVSeries'
  return 'CreativeWork'
}

export function propertyJsonLd(project: Project): Record<string, unknown> {
  const url = canonical(`/work/${project.slug}`)
  return {
    '@context': 'https://schema.org',
    '@type': creativeWorkType(project.metaLine),
    '@id': `${url}#work`,
    name: project.title,
    url,
    description: plainText(project.logline) || undefined,
    creator: { '@id': `${SITE_URL}/#organization` },
    productionCompany: { '@id': `${SITE_URL}/#organization` },
    creativeWorkStatus: 'InDevelopment',
  }
}

export function breadcrumbJsonLd(project: Project): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'APR 70 Pictures', item: canonical('/') },
      { '@type': 'ListItem', position: 2, name: 'The Slate', item: canonical('/slate') },
      { '@type': 'ListItem', position: 3, name: project.title, item: canonical(`/work/${project.slug}`) },
    ],
  }
}
