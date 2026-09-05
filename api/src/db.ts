import pg from 'pg';

/** Postgres pool from DATABASE_URL (Railway sets it). Absent locally, the API runs stateless. */
export const pool = process.env.DATABASE_URL
  ? new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false } })
  : null;
