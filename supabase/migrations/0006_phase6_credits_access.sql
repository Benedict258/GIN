begin;

create table if not exists public.access_tiers (
  tier_id text primary key,
  display_name text not null,
  min_credits integer not null default 0 check (min_credits >= 0),
  description text,
  privileges jsonb not null default '{}'::jsonb,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

insert into public.access_tiers (tier_id, display_name, min_credits, description, privileges, is_default)
values
  ('guest', 'Guest Observer', 0, 'Read-only access to public intel panels.', jsonb_build_object('panels', array['reports','sectors']), true),
  ('scout', 'Scout', 50, 'Unlocked corridor intel and faction summaries.', jsonb_build_object('panels', array['reports','sectors','routes','factions']), false),
  ('advisor', 'Advisor', 150, 'Full access including snapshots and automation hooks.', jsonb_build_object('panels', array['reports','sectors','routes','factions','snapshots']), false)
on conflict (tier_id) do nothing;

create table if not exists public.profile_access_grants (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  tier_id text not null references public.access_tiers(tier_id) on delete cascade,
  granted_by text,
  granted_at timestamptz not null default now(),
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists profile_access_grants_profile_idx on public.profile_access_grants(profile_id);
create index if not exists profile_access_grants_tier_idx on public.profile_access_grants(tier_id);

create table if not exists public.contribution_actions (
  action_key text primary key,
  display_name text not null,
  description text,
  base_reward integer not null,
  importance_weight integer not null default 50 check (importance_weight between 1 and 100),
  usefulness_weight integer not null default 50 check (usefulness_weight between 1 and 100),
  metadata jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.contribution_actions (action_key, display_name, description, base_reward, importance_weight, usefulness_weight)
values
  ('report_submitted', 'Report Submitted', 'Contributor filed a new intelligence report.', 5, 60, 50),
  ('report_confirmed', 'Report Confirmed', 'Contributor confirmed an existing report.', 3, 55, 65),
  ('report_disputed', 'Report Disputed', 'Contributor disputed inaccurate intel.', 4, 50, 70),
  ('world_data_contributed', 'World Data Contributed', 'External ecosystem data ingestion.', 8, 70, 80),
  ('manual_adjustment', 'Manual Adjustment', 'Manual credit change by an operator.', 0, 50, 50)
on conflict (action_key) do nothing;

alter table public.credit_events
  add column if not exists action_key text references public.contribution_actions(action_key),
  add column if not exists usefulness_score integer not null default 50 check (usefulness_score between 1 and 100),
  add column if not exists verification_outcome text,
  add column if not exists balance_after integer,
  add column if not exists access_tier_snapshot text;

alter table public.contributor_profiles
  add column if not exists lifetime_credits integer not null default 0,
  add column if not exists tier_progress integer not null default 0;

update public.contributor_profiles
set lifetime_credits = credits_balance
where lifetime_credits = 0;

alter table public.profiles
  alter column access_tier set default 'guest';

update public.profiles
set access_tier = 'guest'
where access_tier is null;

update public.profiles
set access_tier = case
  when access_tier = 'contributor' then 'scout'
  else 'guest'
end
where access_tier not in ('guest','scout','advisor');

alter table public.profiles
  add constraint profiles_access_tier_fkey foreign key (access_tier) references public.access_tiers(tier_id);

commit;
