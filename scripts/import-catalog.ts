import './load-env';
import path from 'node:path';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { getDb, databasePath } from '../src/db';
import { formatSummary, runCatalogImport } from '../src/lib/catalog-import';

/**
 * Imports the real 16-product catalogue and retires the old sample products. Safe to run on every deploy:
 * idempotent, never overwrites fields the owner edited in the admin, runs in one transaction.
 *
 *   npm run db:import-catalog                  apply
 *   npm run db:import-catalog -- --dry-run     print the plan, write nothing
 *   npm run db:import-catalog -- --prune-unknown   also retire products that are not part of the catalogue
 */
const args = new Set(process.argv.slice(2));
const db = getDb();
migrate(db, { migrationsFolder: path.resolve('drizzle') });
console.log(`Database: ${databasePath()}`);
const summary = runCatalogImport(db, { dryRun: args.has('--dry-run'), pruneUnknown: args.has('--prune-unknown') });
console.log(formatSummary(summary));
