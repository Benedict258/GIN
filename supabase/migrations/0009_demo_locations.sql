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

create index if not exists world_signals_sector_idx on public.world_signals(sector);
create index if not exists world_signals_observed_idx on public.world_signals(observed_at desc);

insert into public.world_signals (sector, signal_type, summary, confidence_score, metadata)
values
  (
    '6RG-Y-T4',
    'enemy_sighting',
    'High threat level flagged near Moon P4. Multiple hostile pings along the outer patrol arc.',
    78,
    '{"source":"telemetry","tag":"high-threat"}'
  ),
  (
    'L6M-Y-M4',
    'resource_cluster',
    'Resource cluster detected at L-Point 456. Builder foam available at the relay cache.',
    66,
    '{"source":"scout","note":"builder-foam"}'
  ),
  (
    'MNO-Y-05',
    'jump_activity',
    'Portal to a secondary solar route active; intermittent traffic spike observed.',
    71,
    '{"source":"signals","note":"portal-active"}'
  )
on conflict do nothing;

insert into public.knowledge_articles (slug, title, summary, steps, tags, related_locations, difficulty)
values
  (
    'setup-network-node',
    'Set Up a Network Node',
    'Go to any L-Point location and use the resources listed in the Network Node requirements to build your node.',
    array[
      'Locate an L-Point in the target region (e.g., 6RG-Y-T4, L6M-Y-M4, or MNO-Y-05).',
      'Confirm you have the resources listed in the Network Node requirements.',
      'Deploy the Network Node at the L-Point and verify it anchors successfully.',
      'Keep the node online and report local intel to activate GIN services.'
    ],
    array['network', 'node', 'infrastructure'],
    array['6RG-Y-T4', 'L6M-Y-M4', 'MNO-Y-05', 'L-Point 456', 'Moon P4'],
    'standard'
  )
on conflict (slug) do update
set
  title = excluded.title,
  summary = excluded.summary,
  steps = excluded.steps,
  tags = excluded.tags,
  related_locations = excluded.related_locations,
  difficulty = excluded.difficulty,
  updated_at = now();
