-- Seed demo profile and contributor record
with seed_profile as (
  insert into public.profiles (wallet_address, handle, display_name, access_tier)
  values ('0xginseed0001', 'gin_seed', 'GIN Seed Operator', 'contributor')
  on conflict (wallet_address) do update set
    handle = excluded.handle,
    display_name = excluded.display_name,
    access_tier = excluded.access_tier
  returning id
),
seed_contributor as (
  insert into public.contributor_profiles (
    profile_id,
    reputation_score,
    credits_balance,
    contribution_count,
    last_contribution_at
  )
  select id, 65, 180, 4, now() from seed_profile
  on conflict (profile_id) do update set
    reputation_score = excluded.reputation_score,
    credits_balance = excluded.credits_balance,
    contribution_count = excluded.contribution_count,
    last_contribution_at = excluded.last_contribution_at
  returning profile_id
)
insert into public.recommendations (
  profile_id,
  title,
  summary,
  recommended_action,
  confidence_score,
  evidence,
  related_locations
)
select
  profile_id,
  'Route Through Sector Beta',
  'Threat is low while opportunity signals are rising across the lane.',
  'Use Beta as primary corridor until Alpha stabilizes.',
  72,
  '["Low hostile density", "Fresh resource pings"]'::jsonb,
  '["sector-beta"]'::jsonb
from seed_contributor
on conflict do nothing;

-- Seed sector intelligence snapshots
insert into public.sector_summaries (
  location,
  threat_score,
  opportunity_score,
  confidence_score,
  verification_state,
  top_signals,
  updated_at
)
values
  (
    'sector-alpha',
    78,
    32,
    88,
    'verified',
    '["enemy_sighting", "jump_activity"]'::jsonb,
    now()
  ),
  (
    'sector-beta',
    28,
    76,
    69,
    'emerging',
    '["resource_cluster", "safe_route"]'::jsonb,
    now()
  )
on conflict (location) do update set
  threat_score = excluded.threat_score,
  opportunity_score = excluded.opportunity_score,
  confidence_score = excluded.confidence_score,
  verification_state = excluded.verification_state,
  top_signals = excluded.top_signals,
  updated_at = excluded.updated_at;
