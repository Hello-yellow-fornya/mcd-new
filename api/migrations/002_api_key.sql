-- Which bearer key a submission arrived with (its label, never the secret),
-- so the 1.0 and 2.0 front ends can be told apart independently of `source`.
alter table submissions add column if not exists api_key text;
create index if not exists submissions_api_key_idx on submissions (api_key);
