/**
 * URL shape for locales (ruled 2026-09-02, plan §F.2):
 *
 *   English  — unprefixed:  /slate            /work/le-donne-vestite
 *   Others   — prefixed:    /pt/slate         /it/work/le-donne-vestite
 *
 * Pages live ONCE under src/pages/. src/middleware.ts strips the prefix and
 * rewrites; this module is the other half — every internal link the site
 * renders goes through localePath() so a prefixed page links to prefixed pages.
 *
 * For the default locale localePath() is the identity function, so the English
 * site emits byte-identical hrefs to the ones it emitted before i18n landed.
 */
import { DEFAULT_LOCALE, isSiteLocale, type SiteLocale } from 'site-locales'

/** Anything with a scheme (`mailto:`, `https:`, `tel:`) or protocol-relative. */
const ABSOLUTE = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i

/**
 * Prefix an internal path for `locale`. Query string and hash are preserved.
 * External links, `mailto:`, fragment-only and relative hrefs are returned
 * untouched — callers can pipe every href through this without filtering.
 */
export function localePath(locale: SiteLocale, path: string | null | undefined): string {
  const href = path ?? ''
  if (!href) return locale === DEFAULT_LOCALE ? '/' : `/${locale}`
  if (ABSOLUTE.test(href) || href.startsWith('#') || href.startsWith('?')) return href
  if (!href.startsWith('/')) return href

  const cut = href.search(/[?#]/)
  const pathname = cut === -1 ? href : href.slice(0, cut)
  const suffix = cut === -1 ? '' : href.slice(cut)

  if (locale === DEFAULT_LOCALE) return href

  const clean = `/${pathname}`.replace(/\/{2,}/g, '/').replace(/\/$/, '')
  return `/${locale}${clean}${suffix}`
}

/**
 * Drop a leading locale segment if one is present. The middleware already
 * rewrites to the unprefixed path, so this is belt-and-braces for anything
 * that reads a raw URL (and for `/en/...`, which is never a canonical URL).
 */
export function stripLocale(pathname: string): string {
  const segments = pathname.split('/')
  if (segments.length > 1 && isSiteLocale(segments[1])) {
    const rest = `/${segments.slice(2).join('/')}`.replace(/\/{2,}/g, '/')
    return rest === '/' ? '/' : rest.replace(/\/$/, '')
  }
  return pathname
}

/**
 * `og:locale` wants `language_TERRITORY`, not a bare language tag. The
 * territories below: APR 70 is a US studio, so English is en_US; Portuguese is
 * Brazilian (ruled 2026-09-07), paired with the `pt-BR` htmlLang in
 * cms/src/locales.ts. The URL prefix stays the bare `/pt/`.
 */
const OG_TERRITORY: Record<SiteLocale, string> = {
  en: 'en_US',
  pt: 'pt_BR', // Marco 2026-09-07: Brazilian Portuguese; URL prefix stays /pt/
  it: 'it_IT',
  fr: 'fr_FR',
  de: 'de_DE',
}

export const ogLocale = (locale: SiteLocale): string => OG_TERRITORY[locale] ?? locale
