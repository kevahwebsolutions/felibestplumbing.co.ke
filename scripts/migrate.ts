import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import path from 'node:path';
import { getDb, databasePath } from '../src/db';

migrate(getDb(), { migrationsFolder: path.resolve('drizzle') });
console.log('Migrations applied to', databasePath());
