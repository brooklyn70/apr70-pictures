/**
 * Site locales — the single source of truth shared by the CMS (Payload
 * `localization`) and the web app (Astro locale routing, hreflang, switcher).
 * web/ imports this through the `site-locales` tsconfig path alias, the same
 * way it imports `payload-types`.
 *
 * Ruled 2026-09-02 (plan §G.1 rows 10-11): English is the default and ships
 * first; PT / IT / FR / DE are released one at a time after Marco signs off
 * each locale. Which locales are public is NOT decided here — it is the
 * `enabledLocales` field on Site Settings, so a locale can exist in the admin
 * (being translated) without being routable on the site.
 */
export const SITE_LOCALES = [
  { code: 'en', label: 'English', htmlLang: 'en', keycode: 'EN' },
  { code: 'pt', label: 'Português', htmlLang: 'pt-BR', keycode: 'PT' }, // Marco 2026-09-07: URL stays /pt/, tags say Brazilian,
  { code: 'it', label: 'Italiano', htmlLang: 'it', keycode: 'IT' },
  { code: 'fr', label: 'Français', htmlLang: 'fr', keycode: 'FR' },
  { code: 'de', label: 'Deutsch', htmlLang: 'de', keycode: 'DE' },
] as const

export type SiteLocale = (typeof SITE_LOCALES)[number]['code']

export const SITE_LOCALE_CODES = SITE_LOCALES.map((l) => l.code) as SiteLocale[]

export const DEFAULT_LOCALE: SiteLocale = 'en'

export function isSiteLocale(value: string | undefined | null): value is SiteLocale {
  return !!value && (SITE_LOCALE_CODES as string[]).includes(value)
}

export function htmlLangFor(code: SiteLocale): string {
  return SITE_LOCALES.find((l) => l.code === code)?.htmlLang ?? code
}
