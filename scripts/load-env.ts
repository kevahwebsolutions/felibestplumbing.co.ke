import fs from 'node:fs';

/** Minimal .env loader for CLI scripts (Next.js loads these files itself for dev and build). */
for (const file of ['.env.local', '.env']) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const value = m[2]!.replace(/^['"]|['"]$/g, '');
    if (process.env[m[1]!] === undefined) process.env[m[1]!] = value;
  }
}
