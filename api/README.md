# Claims API

The Railway service for motorclaimsdepartment.co.uk: submissions, later the DVLA reg-lookup proxy and the CRM hand-off. The intake question flow is Ollie's; this repo holds the service, the schema and the one endpoint the site's reg box calls.

## Provision on Railway

1. New project → Deploy from GitHub → this repo, **Root Directory `api`**.
2. Add a Postgres plugin. Railway injects `DATABASE_URL`.
3. Variables: `CLAIMS_API_KEY` (a long random string, the same value goes into the Vercel project as `CLAIMS_API_KEY`), `CLAIMS_INBOX`.
4. Create a second environment, `staging`, with its own Postgres and its own `CLAIMS_INBOX`, and point the Vercel preview environment's `CLAIMS_API_URL` at it. Production points at production. Test submissions never reach the real inbox (brief §2a).
5. Deploys run `npm run migrate` then start; `/health` reports database status.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Liveness and database status |
| POST | `/v1/claims/start` | `{ reg, source, path, utm? }` → `202 { ok, ref }`. Writes a `started` row. Bearer `CLAIMS_API_KEY`. |
| any | `/v1/claims/:ref/*` | 501 until the intake spec lands |

## Local

```bash
cd api && npm install && npm run dev      # http://localhost:8080/health
```
