#!/usr/bin/env bash
# Migrate apr70 v3 Payload DB (NAS Postgres `apr70_cms`) → Supabase.
# See docs/decisions/2026-07-01-vms-lessons-and-cloud-migration.md before running.
#
# Prereqs (human, once):
#   1. Create the Supabase project (KIMA org) and put its SESSION-pooler URI (:5432)
#      in .env.workflow as SUPABASE_DB_URL (runtime/builds later use :6543 — lesson #1).
#   2. NAS SSH reachable (caruso@100.69.2.30), docker stack at /volume1/apps/apr70-v3.
#
# Usage:
#   bash scripts/migrate-db-to-supabase.sh            # dry-run: dump + counts only
#   bash scripts/migrate-db-to-supabase.sh --apply    # dump, restore, verify counts
set -euo pipefail

NAS="caruso@100.69.2.30"
STACK="/volume1/apps/apr70-v3"
DB="apr70_cms"
OUT="$(dirname "$0")/out"; mkdir -p "$OUT"
DUMP="$OUT/${DB}-$(date +%Y%m%d-%H%M%S).dump"

[ -f .env.workflow ] && { set -a; source .env.workflow; set +a; }
: "${SUPABASE_DB_URL:?Set SUPABASE_DB_URL (session pooler :5432) in .env.workflow first}"

echo "== dumping $DB from NAS =="
ssh "$NAS" "cd $STACK && docker compose exec -T postgres pg_dump -U postgres -Fc $DB" > "$DUMP"
ls -lh "$DUMP"

echo "== source table counts =="
ssh "$NAS" "cd $STACK && docker compose exec -T postgres psql -U postgres -d $DB -Atc \
  \"SELECT relname||': '||n_live_tup FROM pg_stat_user_tables ORDER BY relname\"" | tee "$OUT/source-counts.txt"

if [[ "${1:-}" != "--apply" ]]; then
  echo; echo "DRY-RUN done. Dump saved. Re-run with --apply to restore into Supabase."
  exit 0
fi

echo "== restoring into Supabase (session pooler) =="
pg_restore --no-owner --no-privileges --clean --if-exists -d "$SUPABASE_DB_URL" "$DUMP"

echo "== target table counts (verify against source) =="
psql "$SUPABASE_DB_URL" -Atc \
  "SELECT relname||': '||n_live_tup FROM pg_stat_user_tables ORDER BY relname" | tee "$OUT/target-counts.txt"

echo "== diff (empty = clean) =="
diff "$OUT/source-counts.txt" "$OUT/target-counts.txt" && echo "COUNTS MATCH" || \
  echo "NOTE: n_live_tup is an estimate — spot-check mismatched tables with COUNT(*) before trusting a diff."

echo "Next: point DATABASE_URI at the TRANSACTION pooler (:6543), tiny pools (max:4), media → R2, then Vercel preview + browser verify."
