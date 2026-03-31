create table if not exists public.profile_preferences (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  last_known_sector text,
  alert_opt_in boolean not null default true,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.world_signals (
  id uuid primary key default gen_random_uuid(),
  sector text not null,
  signal_type signal_type not null default 'manual_report',
  summary text not null,
  confidence_score integer not null default 50 check (confidence_score between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  observed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists profile_preferences_sector_idx on public.profile_preferences(last_known_sector);
create index if not exists world_signals_sector_idx on public.world_signals(sector);
create index if not exists world_signals_observed_idx on public.world_signals(observed_at desc);

insert into public.world_signals (sector, signal_type, summary, confidence_score, metadata)
values
  (
    'Jegou Relay',
    'enemy_sighting',
    'Scout drones flagged an uptick in pirate cynos along the Jegou gate approach.',
    72,
    '{"source":"telemetry"}'
  ),
  (
    'Saisio Ore Pass',
    'resource_cluster',
    'Surveyors detected compressed ore deposits but escorts reported intermittent ambushes.',
    64,
    '{"recommendation":"travel_with_screen"}'
  )
on conflict do nothing;
