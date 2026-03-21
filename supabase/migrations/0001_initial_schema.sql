create extension if not exists "pgcrypto";

create type signal_type as enum (
  'enemy_sighting',
  'resource_cluster',
  'safe_route',
  'jump_activity',
  'trade_signal',
  'manual_report'
);

create type signal_source as enum (
  'player',
  'system',
  'world_event',
  'knowledge_base'
);

create type verification_state as enum (
  'unverified',
  'emerging',
  'verified',
  'contested',
  'stale'
);

create type credit_event_type as enum (
  'report_submitted',
  'report_confirmed',
  'report_disputed',
  'world_data_contributed',
  'intel_purchased',
  'manual_adjustment'
);

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  wallet_address text unique,
  handle text unique,
  display_name text,
  access_tier text not null default 'guest',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contributor_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  reputation_score integer not null default 0,
  credits_balance integer not null default 0,
  contribution_count integer not null default 0,
  last_contribution_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  location text not null,
  signal_type signal_type not null,
  source signal_source not null,
  summary text not null,
  intensity integer not null check (intensity between 1 and 100),
  importance_score integer not null check (importance_score between 1 and 100),
  confidence_score integer not null default 0 check (confidence_score between 0 and 100),
  verification_state verification_state not null default 'unverified',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reports_location_idx on public.reports(location);
create index reports_reporter_idx on public.reports(reporter_id);
create index reports_signal_type_idx on public.reports(signal_type);
create index reports_verification_state_idx on public.reports(verification_state);

create table public.report_votes (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  voter_id uuid not null references public.profiles(id) on delete cascade,
  vote_type text not null check (vote_type in ('confirm', 'dispute')),
  weight integer not null default 1 check (weight >= 1),
  created_at timestamptz not null default now(),
  unique (report_id, voter_id)
);

create index report_votes_report_idx on public.report_votes(report_id);

create table public.sector_summaries (
  location text primary key,
  threat_score integer not null default 0 check (threat_score between 0 and 100),
  opportunity_score integer not null default 0 check (opportunity_score between 0 and 100),
  confidence_score integer not null default 0 check (confidence_score between 0 and 100),
  verification_state verification_state not null default 'unverified',
  top_signals jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.recommendations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  summary text not null,
  recommended_action text not null,
  confidence_score integer not null check (confidence_score between 0 and 100),
  evidence jsonb not null default '[]'::jsonb,
  related_locations jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index recommendations_profile_idx on public.recommendations(profile_id);

create table public.credit_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  event_type credit_event_type not null,
  delta integer not null,
  importance_score integer not null default 1 check (importance_score between 1 and 100),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index credit_events_profile_idx on public.credit_events(profile_id);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute procedure public.touch_updated_at();

create trigger contributor_profiles_touch_updated_at
before update on public.contributor_profiles
for each row execute procedure public.touch_updated_at();

create trigger reports_touch_updated_at
before update on public.reports
for each row execute procedure public.touch_updated_at();
