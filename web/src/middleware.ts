/**
 * Locale routing (i18n Phase 1 + the Phase 3 routing half, 2026-09-07).
 *
 * Astro runs `output: 'server'`, so every route is server-rendered on request
 * and this middleware sees all of them. The URL shape is:
 *
 *   /slate        -> locale 'en', no rewrite            (unchanged, byte-for-byte)
 *   /pt/slate     -> locale 'pt', rewritten to /slate   (when pt is ENABLED)
 *   /pt/slate     -> 404                                (when pt is not enabled)
 *   /xx/slate     -> 404                                (not a site locale at all)
 *   /en/slate     -> 404                                (English is unprefixed; one URL per page)
 *
 * The rewrite is what keeps pages living ONCE under src/pages/ — there is no
 * [locale] segment and no duplicated page file. Pages read the locale from
 * `Astro.locals.locale` and pass it to the fetch helpers.
 *
 * Astro's own `i18n` config block is deliberately NOT set — see docs/i18n/README.md.
 *
 * Cost note: the Site Settings read that gates a locale only happens when the
 * first path segment IS a site locale. An English request never touches it here,
 * so the live English path does exactly the work it did before.
 */
import { defineMiddleware } from 'astro:middleware'
import { DEFAULT_LOCALE, isSiteLocale } from 'site-locales'

import { fetchSiteSettings } from './lib/payload'
import { resolveEnabledLocales } from './lib/i18n/enabled'

/**
 * Never locale-route these: Astro internals, the API surface, the CMS admin,
 * and Payload media. Text routes (robots.txt, sitemap.xml, llms.txt) and any
 * asset are caught by the extension test below instead.
 */
const RESERVED = /^\/(?:api|_astro|_image|_actions|_server-islands|admin|media)(?:\/|$)/
const HAS_EXTENSION = /\.[a-zA-Z0-9]+$/

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url

  if (RESERVED.test(pathname) || HAS_EXTENSION.test(pathname)) {
    context.locals.locale = DEFAULT_LOCALE
    context.locals.unprefixedPath = pathname
    return next()
  }

  const segments = pathname.split('/')
  const first = segments[1]

  // No locale prefix: today's site, untouched.
  if (!isSiteLocale(first)) {
    context.locals.locale = DEFAULT_LOCALE
    context.locals.unprefixedPath = pathname
    return next()
  }

  // `/en/...` is not a canonical URL — English is unprefixed. Falling through
  // with no rewrite means no route matches, which is the site's 404.
  if (first === DEFAULT_LOCALE) return next()

  // The gate. A locale that Site Settings has not enabled does not exist in
  // public: no rewrite, no matching route, the site's existing 404.
  const { settings } = await fetchSiteSettings()
  const enabled = resolveEnabledLocales(settings?.enabledLocales)
  if (!enabled.includes(first)) return next()

  const rest = `/${segments.slice(2).join('/')}`.replace(/\/{2,}/g, '/')
  const unprefixed = rest === '/' ? '/' : rest.replace(/\/$/, '')

  context.locals.locale = first
  context.locals.unprefixedPath = unprefixed

  const target = new URL(context.url)
  target.pathname = unprefixed
  return next(target)
})
