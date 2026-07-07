-- Supabase RLS hardening for the apr70 Payload database.
-- Fixes the `rls_disabled_in_public` security advisor finding after the
-- NAS -> Supabase migration (see docs/decisions/2026-07-01-vms-lessons-and-cloud-migration.md).
--
-- WHY: pg_dump/pg_restore lands every Payload table in the `public` schema.
-- Supabase auto-exposes `public` through the Data API (PostgREST) to the `anon`
-- and `authenticated` roles using the publishable/anon key (designed to be public).
-- Payload enforces access control in the app layer, NOT via Postgres RLS, so with
-- RLS off the Data API is a wide-open side door to every row -- including
-- public.users (email, password `hash`, `salt`, reset tokens).
--
-- Payload itself connects over a direct Postgres connection as the table owner,
-- and table owners BYPASS RLS, so enabling RLS with no policy (default-deny) blocks
-- the anon Data API while leaving the CMS fully functional.
--
-- Run in: Supabase Studio -> SQL Editor (or psql against the session pooler :5432).
-- Idempotent: safe to re-run.

-- 1) Enable RLS (default-deny) on every base table in the public schema.
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', r.tablename);
  END LOOP;
END $$;

-- 2) Verify: expected result is zero rows (every public table now has RLS on).
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false
ORDER BY tablename;

-- NOTE (belt-and-suspenders): apr70 does not use the Supabase Data API at all --
-- the Astro frontend reads Payload's own REST API (PUBLIC_PAYLOAD_URL), not PostgREST.
-- Prefer to ALSO disable the Data API entirely in the dashboard:
--   Project Settings -> Data API -> disable, or remove `public` from "Exposed schemas".
-- That closes the side door regardless of per-table RLS.
