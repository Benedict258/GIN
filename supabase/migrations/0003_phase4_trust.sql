-- Phase 4: trust + verification scaffolding
alter table public.reports
  add column if not exists dedupe_hash text,
  add column if not exists source_count integer not null default 1,
  add column if not exists unique_sources integer not null default 1,
  add column if not exists unique_factions integer not null default 0,
  add column if not exists consensus_score integer not null default 0,
  add column if not exists recency_score integer not null default 0,
  add column if not exists reputation_score integer not null default 0,
  add column if not exists confidence_components jsonb not null default jsonb_build_object(
    'base', 0,
    'consensus', 0,
    'recency', 0,
    'reputation', 0,
    'diversity', 0
  );

update public.reports
set dedupe_hash = md5(lower(location) || '|' || signal_type || '|' || lower(summary))
where dedupe_hash is null;

update public.reports
set confidence_components = jsonb_build_object('base', confidence_score, 'consensus', consensus_score, 'recency', recency_score, 'reputation', reputation_score, 'diversity', 0)
where (confidence_components is null) or (confidence_components = '{}'::jsonb);

alter table public.reports
  alter column dedupe_hash set not null;

create index if not exists reports_dedupe_hash_idx on public.reports(dedupe_hash);
