/**
 * Standalone runner for the DISPATCH inaugural-issue seed.
 *
 * Usage:
 *   cd cms && CMS_URL=http://localhost:3000 \
 *     PAYLOAD_SEED_EMAIL=... PAYLOAD_SEED_PASSWORD=... \
 *     pnpm exec tsx scripts/migrate-v2/run-dispatch-seed.ts
 *
 * Useful for local development where the full v2 → v3 apply pipeline is
 * overkill — this just seeds the DISPATCH issue against a running CMS.
 */

import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { payloadJwtLogin } from './payload-rest.js'
import { seedDispatchInaugural } from './seed-dispatch.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
loadEnv({ path: path.resolve(__dirname, '../../.env') })

const main = async () => {
  const token = await payloadJwtLogin()
  const report = await seedDispatchInaugural(token)
  console.log(`Dispatch seed: ${report.issuesWritten} issue(s) written`)
  if (report.errors.length) {
    console.error('Errors:')
    for (const err of report.errors) console.error('  - ' + err)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
