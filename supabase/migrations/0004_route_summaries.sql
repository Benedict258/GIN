create table if not exists public.route_summaries (
  origin_location text not null,
  destination_location text not null,
  threat_score integer not null default 0 check (threat_score between 0 and 100),
  safety_score integer not null default 0 check (safety_score between 0 and 100),
  confidence_score integer not null default 0 check (confidence_score between 0 and 100),
  verification_state verification_state not null default 'unverified',
  route_state text not null default 'safe',
  advisory jsonb not null default '[]'::jsonb,
  top_signals jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (origin_location, destination_location)
);

create index if not exists route_summaries_state_idx on public.route_summaries(route_state);
