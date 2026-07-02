---
name: payload-admin-fix
description: >
  Diagnose and fix Payload CMS admin login for apr70-pictures. Use when admin login
  fails in the browser but the API works, when locked out, when "create admin"/"reset
  admin" is needed, or when unsure which database the CMS is pointed at. Triggers:
  "can't log in to admin", "payload login", "reset admin", "create admin user",
  "admin password", "which db is this".
---

# Payload admin fix (apr70-pictures)

The recurring failure here is **browser login fails while the API seems fine** — almost
always one of: (a) `PAYLOAD_SECRET` missing/mismatched, (b) `NEXT_PUBLIC_SERVER_URL`
doesn't match the host you actually open, (c) zero users in the DB, or (d) the running
server points at a *different* `DATABASE_URI` than your shell. This skill resolves all four
without guessing.

## Steps

1. **Diagnose first (no writes).** From `cms/`:
   ```bash
   pnpm tsx scripts/admin-doctor.ts
   ```
   It prints the DB it's pointed at (masked), the admin URL, whether `PAYLOAD_SECRET` is
   set, and how many users exist. Read this before doing anything else.

2. **If `PAYLOAD_SECRET` is missing** → add it to `cms/.env` (must match the value the
   running server uses) and retry. This alone fixes most "API works, browser doesn't" cases.

3. **If zero users** → create the first admin (password via env, never on the CLI):
   ```bash
   ADMIN_PASSWORD='...' pnpm tsx scripts/admin-doctor.ts --create you@kima.com
   ```

4. **If locked out of an existing account** → reset it:
   ```bash
   ADMIN_PASSWORD='...' pnpm tsx scripts/admin-doctor.ts --reset you@kima.com
   ```

5. **If login still fails after users exist** → confirm `NEXT_PUBLIC_SERVER_URL` matches
   the exact host you open in the browser, clear cookies for that host, and verify the
   server process uses the **same** `DATABASE_URI` + `PAYLOAD_SECRET` the doctor reported.

## Guardrails (match Marco's rules)

- **Local-first.** The doctor refuses `--create`/`--reset` against a non-local
  `DATABASE_URI` unless `ALLOW_REMOTE_ADMIN=1` is explicitly set — so the NAS/prod DB is
  never mutated by accident. This is the "no NAS push until I approve" rule applied to the DB.
- **No secrets in logs.** Passwords come from `ADMIN_PASSWORD` env, never CLI args; DB URIs
  are masked in output.
- **Diagnose → report → ask.** Default run is read-only. Mutations require an explicit flag.
