/**
 * The gate: which locales are actually public.
 *
 * A locale existing in cms/src/locales.ts means it EXISTS (Payload has a tab
 * for it, translators can work in it). It does NOT mean it is routable. The
 * single public switch is Site Settings -> `enabledLocales`; anything not in
 * that list 404s, is absent from the switcher, absent from hreflang, and
 * absent from the sitemap.
 *
 * English is always enabled and always first — the site cannot exist without
 * its default locale, and a missing/empty field (the state before the CMS
 * migration lands) therefore reads as ['en'], i.e. exactly today's site.
 */
import {
  DEFAULT_LOCALE,
  SITE_LOCALE_CODES,
  isSiteLocale,
  type SiteLocale,
} from 'site-locales'

/**
 * DEV-ONLY ESCAPE HATCH. `I18N_FORCE_ENABLED=en,pt` pretends Site Settings has
 * those locales enabled, so the prefixed routes can be exercised locally before
 * the CMS field exists. It MUST NEVER be set in production — Site Settings is
 * the real gate, and this override would let a half-translated locale out.
 * Deliberately not a PUBLIC_* variable: it is read server-side only and is
 * never baked into the client bundle.
 */
const FORCE_ENV = 'I18N_FORCE_ENABLED'

function readForced(): SiteLocale[] | null {
  const raw = typeof process !== 'undefined' ? process.env?.[FORCE_ENV] : undefined
  if (!raw) return null
  const codes = raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(isSiteLocale)
  return codes.length > 0 ? codes : null
}

/** Order any locale set the way cms/src/locales.ts lists them, English first. */
function canonicalOrder(codes: Iterable<SiteLocale>): SiteLocale[] {
  const set = new Set<SiteLocale>(codes)
  set.add(DEFAULT_LOCALE)
  return SITE_LOCALE_CODES.filter((code) => set.has(code))
}

/**
 * Resolve the enabled set from a Site Settings value. Accepts whatever Payload
 * hands back for a hasMany select (an array of strings, a single string, or
 * null/undefined before the field exists) and always returns a valid,
 * de-duplicated, canonically-ordered list containing at least English.
 */
export function resolveEnabledLocales(raw: unknown): SiteLocale[] {
  const forced = readForced()
  if (forced) return canonicalOrder(forced)

  const values = Array.isArray(raw) ? raw : raw == null ? [] : [raw]
  const codes = values.filter((v): v is SiteLocale => typeof v === 'string' && isSiteLocale(v))
  return canonicalOrder(codes)
}

/** True when `locale` may be served. */
export const isLocaleEnabled = (locale: SiteLocale, enabled: SiteLocale[]): boolean =>
  enabled.includes(locale)
