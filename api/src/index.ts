import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { createHash } from 'node:crypto';
import { pool } from './db.ts';

/**
 * Claims API (brief §2, §7). This is the service and its schema; the intake
 * question flow waits for Ollie's spec. Today it exposes:
 *
 *   GET  /health               liveness, plus whether the database is reachable
 *   POST /v1/claims/start      records that a claim was started from the reg box
 *
 * Auth: Bearer CLAIMS_API_KEY from the site. Staging and production are
 * separate Railway services with separate databases and email targets (§2a).
 */
const app = new Hono();

const apiKey = process.env.CLAIMS_API_KEY ?? '';
const REG = /^[A-Z0-9]{2,7}$/;

app.get('/health', async (c) => {
  let database: 'ok' | 'unavailable' | 'not configured' = 'not configured';
  if (pool) {
    try {
      await pool.query('select 1');
      database = 'ok';
    } catch {
      database = 'unavailable';
    }
  }
  return c.json({ ok: true, service: 'mcd-claims-api', env: process.env.RAILWAY_ENVIRONMENT_NAME ?? 'local', database });
});

app.use('/v1/*', async (c, next) => {
  if (!apiKey) return c.json({ ok: false, error: 'CLAIMS_API_KEY is not set on the service' }, 503);
  if (c.req.header('authorization') !== `Bearer ${apiKey}`) return c.json({ ok: false, error: 'unauthorised' }, 401);
  await next();
});

function ref() {
  return `MCD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

app.post('/v1/claims/start', async (c) => {
  const body = (await c.req.json().catch(() => null)) as { reg?: string; source?: string; path?: string; utm?: unknown } | null;
  const reg = String(body?.reg ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!REG.test(reg) || !/\d/.test(reg) || !/[A-Z]/.test(reg)) return c.json({ ok: false, error: 'invalid reg' }, 422);
  const r = ref();
  if (pool) {
    const ip = c.req.header('x-forwarded-for')?.split(',')[0].trim() ?? '';
    const ipHash = ip ? createHash('sha256').update(ip).digest('hex').slice(0, 32) : null;
    const { rows } = await pool.query(
      'insert into submissions (ref, reg, source, path, utm, ip_hash, user_agent) values ($1,$2,$3,$4,$5,$6,$7) returning id',
      [r, reg, body?.source ?? 'web', body?.path ?? null, body?.utm ? JSON.stringify(body.utm) : null, ipHash, c.req.header('user-agent') ?? null],
    );
    await pool.query('insert into submission_events (submission_id, event) values ($1, $2)', [rows[0].id, 'started']);
  }
  return c.json({ ok: true, ref: r }, 202);
});

// Intake steps, email and CRM hand-off arrive with the question-flow spec.
app.all('/v1/claims/:ref/*', (c) => c.json({ ok: false, error: 'not implemented: waiting on the intake spec' }, 501));

const port = Number(process.env.PORT ?? 8080);
serve({ fetch: app.fetch, port }, () => console.log(`mcd-claims-api listening on ${port}`));
