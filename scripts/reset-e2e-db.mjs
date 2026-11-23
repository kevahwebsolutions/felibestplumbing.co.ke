// Playwright starts from a clean throw-away database so reruns are deterministic.
import fs from 'node:fs';
for (const f of ['data/e2e.db', 'data/e2e.db-wal', 'data/e2e.db-shm']) fs.rmSync(f, { force: true });
fs.rmSync('data/e2e-uploads', { recursive: true, force: true });
