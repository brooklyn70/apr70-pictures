/**
 * Phase 4 — v2 → v3 seed entrypoint.
 *
 * @example
 * pnpm exec tsx scripts/migrate-v2-to-v3.ts --dry-run --v2-root /path/to/apr70-clone/content
 *
 * @example
 * pnpm migrate:v2:dry -- --v2-root ./fixtures/v2-sample
 */

import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { runCli } from './migrate-v2/cli.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
loadEnv({ path: path.resolve(__dirname, '../.env') })

runCli(process.argv.slice(2)).catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
