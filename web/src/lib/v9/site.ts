/**
 * v9 GEO/AEO — shared NAP (name / address / presence) constants and JSON-LD
 * builders. ONE module owns the entity facts; llms.txt, robots, sitemap,
 * JSON-LD, and the layout all read from here so machines get one story.
 */

import type { Project } from 'payload-types'
import { DEFAULT_LOCALE, htmlLangFor, type SiteLocale } from 'site-locales'
import { dict } from '../i18n/dictionary'
import { localePath } from '../i18n/paths'
import { plainText } from './inline'

export const SITE_URL = 'https://apr70.com'

/** Facts that are the same in every language: name, email, place, people. */
const NAP_INVARIANT = {
  name: 'APR 70 Pictures',
  legalName: 'APR 70 Pictures',
  email: 'caruso@apr70.com',
  locality: 'Long Island City',
  region: 'NY',
  country: 'US',
  founder: 'Marco Caruso',
  foundingYear: '2026',
} as const

export type Nap = typeof NAP_INVARIANT & {
  description: string
  divisions: readonly string[]
}

/** NAP for one locale. The words come from the dictionary (English fully
 *  populated, other locales falling back to English field by field). */
export const napFor = (locale: SiteLocale = DEFAULT_LOCALE): Nap => {
  const d = dict(locale)
  return { ...NAP_INVARIANT, description: d.siteDescription, divisions: d.divisions }
}

/** The English NAP — unchanged values, still the default everywhere. */
export const NAP: Nap = napFor(DEFAULT_LOCALE)

export type PageEntry = { path: string; label: string }

/** The five v9 pages, canonical order. */
export const pagesFor = (locale: SiteLocale = DEFAULT_LOCALE): PageEntry[] => {
  const labels = dict(locale).pages
  return [
    { path: '/', label: labels['/'] },
    { path: '/slate', label: labels['/slate'] },
    { path: '/craft', label: labels['/craft'] },
    { path: '/methods', label: labels['/methods'] },
    { path: '/contact', label: labels['/contact'] },
  ]
}

/** The three division pages (v10) — on the machine surface (llms/sitemap),
 *  not in the five-page primary nav; the strip and footer link them. */
export const divisionPagesFor = (locale: SiteLocale = DEFAULT_LOCALE): PageEntry[] => {
  const labels = dict(locale).divisionPages
  return [
    { path: '/212', label: labels['/212'] },
    { path: '/310', label: labels['/310'] },
    { path: '/nrc', label: labels['/nrc'] },
  ]
}

export const V9_PAGES: PageEntry[] = pagesFor(DEFAULT_LOCALE)
export const DIVISION_PAGES: PageEntry[] = divisionPagesFor(DEFAULT_LOCALE)

export const canonical = (path: string): string =>
  `${SITE_URL}${path === '/' ? '/' : path.replace(/\/$/, '')}`

// ── JSON-LD builders ─────────────────────────────────────────────────────────

export function organizationJsonLd(locale: SiteLocale = DEFAULT_LOCALE): Record<string, unknown> {
  const NAP = napFor(locale)
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

export function webSiteJsonLd(locale: SiteLocale = DEFAULT_LOCALE): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: NAP.name,
    inLanguage: htmlLangFor(locale),
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

export function propertyJsonLd(
  project: Project,
  locale: SiteLocale = DEFAULT_LOCALE,
): Record<string, unknown> {
  const url = canonical(localePath(locale, `/work/${project.slug}`))
  return {
    '@context': 'https://schema.org',
    '@type': creativeWorkType(project.metaLine),
    '@id': `${url}#work`,
    name: project.title,
    url,
    inLanguage: htmlLangFor(locale),
    description: plainText(project.logline) || undefined,
    creator: { '@id': `${SITE_URL}/#organization` },
    productionCompany: { '@id': `${SITE_URL}/#organization` },
    creativeWorkStatus: 'InDevelopment',
  }
}

export function breadcrumbJsonLd(
  project: Project,
  locale: SiteLocale = DEFAULT_LOCALE,
): Record<string, unknown> {
  const at = (path: string) => canonical(localePath(locale, path))
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'APR 70 Pictures', item: at('/') },
      { '@type': 'ListItem', position: 2, name: 'The Slate', item: at('/slate') },
      { '@type': 'ListItem', position: 3, name: project.title, item: at(`/work/${project.slug}`) },
    ],
  }
}
