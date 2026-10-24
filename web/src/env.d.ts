/// <reference types="astro/client" />

import type { SiteLocale } from 'site-locales'

declare global {
  namespace App {
    interface Locals {
      /**
       * The locale this request is being served in. Set by src/middleware.ts:
       * a known, ENABLED locale prefix (`/pt/slate`) sets it to that locale and
       * rewrites the request to the unprefixed path; everything else is 'en'.
       */
      locale: SiteLocale
      /**
       * The request path WITHOUT the locale prefix (`/slate` for both `/slate`
       * and `/pt/slate`). The switcher, canonical and hreflang all build their
       * URLs from this so one page renders every locale's alternates.
       */
      unprefixedPath: string
    }
  }
}

export {}
