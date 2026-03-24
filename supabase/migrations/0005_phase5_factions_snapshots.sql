alter table public.reports
  add column if not exists faction_tag text;

create index if not exists reports_faction_idx on public.reports(faction_tag);

create table if not exists public.faction_intel_summaries (
  faction text primary key,
  report_count integer not null default 0,
  verified_count integer not null default 0,
  avg_confidence integer not null default 0,
  dominant_signal signal_type,
  top_locations jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.structured_intel_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_type text not null default 'standard',
  payload jsonb not null,
  walrus_blob_id text,
  route_count integer not null default 0,
  sector_count integer not null default 0,
  faction_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists structured_intel_snapshots_created_idx on public.structured_intel_snapshots(created_at desc);
