/**
 * admin-doctor.ts — diagnose & fix Payload admin login for apr70-pictures.
 *
 * Solves the recurring "admin login works on API but not in browser / locked out / which DB
 * am I even pointed at?" scramble. Local-first and safe: it REPORTS by default and only
 * mutates when you pass an explicit action.
 *
 * (apr70 uses postgresAdapter + DATABASE_URL; the `users` collection is auth:true.)
 *
 *   pnpm tsx scripts/admin-doctor.ts                 # diagnose only (no writes)
 *   pnpm tsx scripts/admin-doctor.ts --create EMAIL  # create first admin (prompts for pass via env)
 *   pnpm tsx scripts/admin-doctor.ts --reset EMAIL   # reset password for an existing admin
 *
 * Password for --create/--reset is read from ADMIN_PASSWORD env (never typed on the CLI,
 * never logged). Refuses to run --create/--reset against a non-local DATABASE_URI unless
 * ALLOW_REMOTE_ADMIN=1 is set — so you can't accidentally mutate the NAS/prod DB.
 */
import payload from 'payload'
import config from '../src/payload.config'

const arg = (flag: string) => {
  const i = process.argv.indexOf(flag)
  return i >= 0 ? process.argv[i + 1] : undefined
}

const dbUri = process.env.DATABASE_URL || process.env.DATABASE_URI || '(unset)'
const isLocal = /localhost|127\.0\.0\.1|@db:|@localhost/.test(dbUri)
const server = process.env.NEXT_PUBLIC_SERVER_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL || '(unset)'

function maskDb(u: string) {
  return u.replace(/:\/\/([^:]+):[^@]+@/, '://$1:****@')
}

async function main() {
  // 1) Always show what we're pointed at — the #1 source of confusion.
  console.log('── Payload admin doctor ───────────────────────────────')
  console.log('  DATABASE_URL :', maskDb(dbUri), isLocal ? '(LOCAL)' : '(REMOTE ⚠)')
  console.log('  SERVER_URL   :', server)
  console.log('  PAYLOAD_SECRET set:', process.env.PAYLOAD_SECRET ? 'yes' : 'NO ⚠ (admin login will fail without it)')
  console.log('  admin URL    :', server.replace(/\/$/, '') + '/admin')

  if (!process.env.PAYLOAD_SECRET) {
    console.error('\n✗ PAYLOAD_SECRET is missing. Browser login fails silently without it even when the API seems fine.')
    console.error('  Add PAYLOAD_SECRET to cms/.env (must match the value the running server uses), then retry.')
    process.exit(1)
  }

  await payload.init({ config })

  // 2) How many admins exist?
  const users = await payload.find({ collection: 'users', limit: 100, depth: 0 })
  console.log(`\n  users in DB  : ${users.totalDocs}`)
  for (const u of users.docs as any[]) console.log(`    - ${u.email}`)

  const create = arg('--create')
  const reset = arg('--reset')

  if (!create && !reset) {
    if (users.totalDocs === 0) {
      console.log('\n→ No users. Run:  ADMIN_PASSWORD=... pnpm tsx scripts/admin-doctor.ts --create you@kima.com')
    } else {
      console.log('\n✓ Users exist. If browser login still fails: confirm SERVER_URL matches the URL you open,')
      console.log('  clear cookies for that host, and verify the server process uses THIS same DATABASE_URI + PAYLOAD_SECRET.')
    }
    process.exit(0)
  }

  // 3) Mutating actions — guard against hitting the wrong DB.
  if (!isLocal && process.env.ALLOW_REMOTE_ADMIN !== '1') {
    console.error('\n✗ Refusing to modify a REMOTE database. This DATABASE_URI is not local.')
    console.error('  If you really mean to touch the NAS/prod DB, re-run with ALLOW_REMOTE_ADMIN=1.')
    process.exit(1)
  }
  const password = process.env.ADMIN_PASSWORD
  if (!password) {
    console.error('\n✗ Set ADMIN_PASSWORD env (not a CLI arg) so it is never logged. Example:')
    console.error('  ADMIN_PASSWORD=secret pnpm tsx scripts/admin-doctor.ts --create you@kima.com')
    process.exit(1)
  }

  if (create) {
    await payload.create({ collection: 'users', data: { email: create, password } as any })
    console.log(`\n✓ Created admin ${create}. Log in at ${server.replace(/\/$/, '')}/admin`)
  } else if (reset) {
    const found = await payload.find({ collection: 'users', where: { email: { equals: reset } }, limit: 1 })
    if (!found.docs.length) { console.error(`✗ No user ${reset}. Use --create instead.`); process.exit(1) }
    await payload.update({ collection: 'users', id: (found.docs[0] as any).id, data: { password } as any })
    console.log(`\n✓ Reset password for ${reset}.`)
  }
  process.exit(0)
}

main().catch((e) => { console.error('admin-doctor failed:', e); process.exit(1) })
