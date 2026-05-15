// @ts-check
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'astro/config';

import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://apr70.com',
  output: 'server',
  adapter: node({ mode: 'standalone' }),

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
  },
});