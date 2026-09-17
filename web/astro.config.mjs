// @ts-check
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'astro/config';
// The locale list is owned by the CMS and shared, never duplicated here.
import { SITE_LOCALE_CODES, DEFAULT_LOCALE } from '../cms/src/locales.ts';

import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Deploy-target adapter selection ──────────────────────────────────────────
// DEPLOY_TARGET=vercel  → @astrojs/vercel serverless adapter (Vercel project).
// unset / anything else → @astrojs/node standalone (NAS Docker + local dev,
// unchanged default). The Vercel adapter is imported lazily so local/NAS
// builds never even evaluate it. Vercel's own builds set DEPLOY_TARGET=vercel
// via project env (see docs/decisions/2026-07-05-vercel-supabase-runbook.md).
const deployTarget = process.env.DEPLOY_TARGET ?? 'node';

const adapter =
  deployTarget === 'vercel'
    ? (await import('@astrojs/vercel')).default({
        // No ISR/edge config: SSR functions only. In-process SWR cache in
        // src/lib/payload.ts handles egress discipline per instance.
      })
    : node({ mode: 'standalone' });

// https://astro.build/config
export default defineConfig({
  site: 'https://apr70.com',
  output: 'server',
  adapter,

  // ── i18n (2026-09-07) ────────────────────────────────────────────────────
  // `routing: 'manual'` is the mode Astro documents for middleware-driven
  // locale routing: it DISABLES Astro's own i18n middleware and generates no
  // locale-prefixed routes, so pages keep living once under src/pages/ and
  // src/middleware.ts owns the whole story (prefix -> locals.locale + rewrite
  // to the unprefixed path). Declaring `locales` here only tells Astro which
  // codes exist; it is NOT the public gate — that is Site Settings ->
  // enabledLocales, read at request time (see src/lib/i18n/enabled.ts).
  //
  // Read the locale from `Astro.locals.locale`, never `Astro.currentLocale`:
  // the request has already been rewritten to the unprefixed path by the time
  // a page renders, so anything deriving a locale from the URL is unreliable.
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: SITE_LOCALE_CODES,
    routing: 'manual',
  },

  // ── v10 catalog: retired legacy-chrome routes ────────────────────────────
  // output: 'server' means these are real redirects at request time (301),
  // not meta-refresh stubs. /investors and /pitch are NOT here — they stay
  // live routes serving a real 410 in v9 chrome (room-only doctrine), see
  // src/pages/investors.astro + src/pages/pitch.astro.
  redirects: {
    '/about': '/methods',
    '/jobs': '/contact',
    /* '/troupe' is NO LONGER a redirect (Marco 2026-07-13). It is a real route
       again — src/pages/troupe.astro — gated behind Site Settings → TROUPE plus
       an uploaded recording. A redirect here would win over the page and the
       switch could never take effect. While the gate is shut the page serves its
       own 404, which is the intended behaviour, not this 301. */
    '/work': '/slate',
    '/news': '/',
    '/news/[...slug]': '/',
  },

  // Listen on all interfaces so remote previews (IDE tunnels, Anti-Gravity, etc.)
  // can reach the dev server. Default port 4321; if busy Astro tries the next.
  server: {
    host: true,
    port: 4321,
  },

  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        'payload-types': path.resolve(__dirname, '../cms/src/payload-types.ts'),
        // i18n (2026-09-07): the locale list is owned by the CMS
        // (cms/src/locales.ts) and shared with web/ through this alias, mirroring
        // `payload-types`. web/ NEVER duplicates the locale list. The matching
        // tsconfig path alias keeps `astro check` happy.
        'site-locales': path.resolve(__dirname, '../cms/src/locales.ts'),
      },
    },
    // Bundle gsap into the SSR build: its package ships ESM under a CJS-looking
    // entry, and Vercel's serverless runtime require()s it → SyntaxError. Vite
    // transforms it when noExternal; harmless for the node/NAS target.
    ssr: {
      noExternal: ['gsap'],
    },
    // Dev-only: mirror the prod nginx rules that send Payload media to the CMS
    // origin (resolveMediaUrl returns relative /api/media/... and /media/...
    // paths so the browser resolves them via the reverse proxy). Without this,
    // every Media file 404s under `astro dev` and pages silently lose images.
    // Vite ignores `server.proxy` outside the dev server, so prod is untouched.
    server: {
      proxy: {
        '/api/media': process.env.PUBLIC_PAYLOAD_URL ?? 'http://localhost:3000',
        '/media': process.env.PUBLIC_PAYLOAD_URL ?? 'http://localhost:3000',
      },
    },
  },
});