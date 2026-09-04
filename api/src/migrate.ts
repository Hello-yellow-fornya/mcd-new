import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './db.ts';

/** Applies migrations/*.sql in order, once each. */
const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');
if (!pool) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}
const client = await pool.connect();
try {
  await client.query('create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())');
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()) {
    const done = await client.query('select 1 from schema_migrations where name = $1', [file]);
    if (done.rowCount) continue;
    await client.query('begin');
    await client.query(readFileSync(join(dir, file), 'utf8'));
    await client.query('insert into schema_migrations (name) values ($1)', [file]);
    await client.query('commit');
    console.log('applied', file);
  }
} finally {
  client.release();
  await pool.end();
}
