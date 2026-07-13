/**
 * Playwright global teardown — purge the Founding Roll test entries.
 *
 * THE BUG THIS FIXES (found 2026-07-13): the spec
 * "founding roll › enrollment end-to-end (test entry, cleaned by teardown)"
 * said "cleaned by teardown" and there WAS no teardown. It enrolls a fixed
 * email, the roll API rejects duplicates, so the test passed exactly once and
 * then failed forever until someone deleted the row by hand. The suite was only
 * ever green on a clean database.
 *
 * Now the promise in the test name is true. Anything on the roll at the reserved
 * @apr70.test domain is a test artifact and is removed after every run.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

export default async function globalTeardown(): Promise<void> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.delete({
      collection: 'founding-roll',
      where: { email: { like: '@apr70.test' } },
    } as never)
    const n = (res as { docs?: unknown[] })?.docs?.length ?? 0
    if (n > 0) console.log(`[teardown] removed ${n} Founding Roll test entr${n === 1 ? 'y' : 'ies'}`)
  } catch (err) {
    // Never fail a green run because cleanup could not reach the database.
    console.warn('[teardown] could not purge roll test entries:', (err as Error).message)
  }
}
