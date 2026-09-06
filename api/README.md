# Claims API

The Railway service for motorclaimsdepartment.co.uk: submissions, later the DVLA reg-lookup proxy and the CRM hand-off. The intake question flow is Ollie's; this repo holds the service, the schema and the one endpoint the site's reg box calls.

## Provision on Railway

1. New project → Deploy from GitHub → this repo, **Root Directory `api`**.
2. Add a Postgres plugin. Railway injects `DATABASE_URL`.
3. Variables: `CLAIMS_API_KEYS`, one bearer key per front end as comma-separated `label:secret` pairs (`mcd1:…` goes into the `mcd-new-2` Vercel project as `CLAIMS_API_KEY`, `mcd2:…` into `mcd-new-2-0`); `CLAIMS_INBOX`. A bare `CLAIMS_API_KEY` still works, labelled `default`. Never share one key across sites: the label is recorded on every submission next to `source`.
4. Create a second environment, `staging`, with its own Postgres and its own `CLAIMS_INBOX`, and point the Vercel preview environment's `CLAIMS_API_URL` at it. Production points at production. Test submissions never reach the real inbox (brief §2a).
5. Deploys run `npm run migrate` then start; `/health` reports database status.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Liveness and database status |
| POST | `/v1/claims/start` | `{ reg, source, path, utm? }` → `202 { ok, ref }`. Writes a `started` row with `source` and the label of the bearer key used (`api_key`). Bearer: any key in `CLAIMS_API_KEYS` or `CLAIMS_API_KEY`. |
| any | `/v1/claims/:ref/*` | 501 until the intake spec lands |

## Local

```bash
cd api && npm install && npm run dev      # http://localhost:8080/health
```
