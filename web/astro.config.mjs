// @ts-check
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'astro/config';

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