import Database from 'better-sqlite3';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import * as schema from './schema';

export type DB = BetterSQLite3Database<typeof schema>;

const g = globalThis as unknown as { __felibestDb?: { db: DB; raw: Database.Database } };

export function databasePath(): string {
  return path.resolve(/*turbopackIgnore: true*/ process.env.DATABASE_PATH ?? './data/felibest.db');
}

function open() {
  const file = databasePath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const raw = new Database(file);
  raw.pragma('journal_mode = WAL');
  raw.pragma('foreign_keys = ON');
  raw.pragma('busy_timeout = 5000');
  raw.pragma('synchronous = NORMAL');
  return { raw, db: drizzle(raw, { schema }) };
}

export function getDb(): DB {
  if (!g.__felibestDb) g.__felibestDb = open();
  return g.__felibestDb.db;
}

export function getRaw(): Database.Database {
  if (!g.__felibestDb) g.__felibestDb = open();
  return g.__felibestDb.raw;
}

export { schema };
