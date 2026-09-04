-- Claims API schema (brief §7). One row per claim started on the site.
-- The intake question flow (Ollie's spec) fills the incident and contact
-- columns; the stub only writes reg, source and timestamps.

create extension if not exists pgcrypto;

create table if not exists submissions (
  id            uuid primary key default gen_random_uuid(),
  ref           text not null unique,                 -- MCD-XXXXXX, shown to the customer
  status        text not null default 'started'       -- started | submitted | handed_off | rejected | spam
                check (status in ('started','submitted','handed_off','rejected','spam')),

  -- step 1: reg + contact
  reg           text not null,                        -- compact, uppercase, e.g. AB12CDE
  vehicle       jsonb,                                -- make/model/colour from the DVLA lookup, when enabled
  full_name     text,
  phone         text,
  email         text,
  postcode      text,

  -- step 2: what happened
  incident_at   timestamptz,
  location      text,
  description   text,
  other_driver  jsonb,                                -- { name, reg, insurer, phone }
  fault         text check (fault in ('them','me','unsure')),
  injuries      boolean,
  photos        jsonb,                                -- [{ url, name, size }]

  -- consent and attribution
  consent       jsonb,                                -- { privacy: true, marketing: false, at }
  source        text,                                 -- web | claim-now | landing:goskippy …
  path          text,
  utm           jsonb,
  ip_hash       text,
  user_agent    text,

  -- hand-off
  crm_id        text,
  handed_off_at timestamptz,
  emailed_at    timestamptz,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists submissions_created_at_idx on submissions (created_at desc);
create index if not exists submissions_status_idx on submissions (status);

create table if not exists submission_events (
  id            bigserial primary key,
  submission_id uuid not null references submissions (id) on delete cascade,
  event         text not null,                        -- started | step | submitted | email_sent | crm_ok | crm_failed
  detail        jsonb,
  created_at    timestamptz not null default now()
);

create index if not exists submission_events_submission_idx on submission_events (submission_id, created_at);
