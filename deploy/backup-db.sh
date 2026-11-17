#!/usr/bin/env bash
# SQLite online backup with 14-day retention.
# Cron example (daily 02:30):  30 2 * * * /var/www/felibest/deploy/backup-db.sh >> /var/log/felibest-backup.log 2>&1
set -euo pipefail

DB_PATH="${DATABASE_PATH:-/var/www/felibest/data/felibest.db}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/felibest}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"

mkdir -p "$BACKUP_DIR"
STAMP="$(date +%Y%m%d-%H%M%S)"
TARGET="$BACKUP_DIR/felibest-$STAMP.db"

# .backup is safe while the app is running (uses the SQLite online backup API).
sqlite3 "$DB_PATH" ".backup '$TARGET'"
sqlite3 "$TARGET" "PRAGMA integrity_check;" | grep -qx ok
gzip -9 "$TARGET"

find "$BACKUP_DIR" -name 'felibest-*.db.gz' -type f -mtime +"$RETENTION_DAYS" -delete
echo "$(date -Is) backup ok: $TARGET.gz"
