do $$
begin
  if not exists (select 1 from pg_type where typname = 'notification_severity') then
    create type notification_severity as enum ('info', 'warning', 'danger');
  end if;

  if not exists (select 1 from pg_type where typname = 'knowledge_difficulty') then
    create type knowledge_difficulty as enum ('standard', 'advanced', 'critical');
  end if;
end $$;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  severity notification_severity not null default 'info',
  sector text,
  action_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists notifications_created_at_idx on public.notifications(created_at desc);

create table if not exists public.knowledge_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  steps text[] not null default '{}',
  tags text[] not null default '{}',
  related_locations text[] not null default '{}',
  difficulty knowledge_difficulty not null default 'standard',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists knowledge_articles_updated_at_idx on public.knowledge_articles(updated_at desc);

insert into public.notifications (title, message, severity, sector)
values
  (
    'GIN Advisory: Jegou Gate',
    'Interdiction pings suggest pirate scouts are waiting along the Jegou acceleration gate. Bring a scout or detour via Utopia Prime.',
    'warning',
    'Jegou Relay'
  ),
  (
    'Logistics Window: Utopia Prime',
    'Frontier freighter convoy cleared a safe path for the next 30 minutes. Submit hauling intents if you need the escort.',
    'info',
    'Utopia Prime'
  ),
  (
    'Distress Echo Near Saisio',
    'Multiple distress calls hint at a hostile pack camping the Saisio ore pass. Delay travel unless you can field combat support.',
    'danger',
    'Saisio Ore Pass'
  )
on conflict do nothing;

insert into public.knowledge_articles (slug, title, summary, steps, tags, related_locations, difficulty)
values
  (
    'deploy-network-node',
    'Deploy a Network Node',
    'Anchor a Smart Storage Unit, plug in the uplink kit, and sync it with GIN to relay local telemetry.',
    array[
      'Fit the Smart Storage Unit and uplink kit to a hauler or combat ship with spare cargo.',
      'Travel to the intended anchor grid and clear hostiles or deploy decoys.',
      'Drop the unit, align it to the nearest Stargate, and power the uplink.',
      'Run the GIN dApp to register the node and stream diagnostics for two minutes.'
    ],
    array['infrastructure', 'network'],
    array['Jegou Relay', 'Utopia Prime'],
    'standard'
  ),
  (
    'stabilize-safe-route',
    'Stabilize a Safe Route',
    'Combine fresh scout intel with contributor reports to downgrade route threat levels for your pack.',
    array[
      'Ping available scouts and assign them the jump pair you want to stabilize.',
      'Submit quick-look reports through the dApp as each scout clears their jump.',
      'Trigger the automation cycle or wait for the next scheduled sweep to recompute safety.',
      'Share the updated corridor rating with your pack and mark it in the navigation overlay.'
    ],
    array['scouting', 'logistics'],
    array['Saisio Ore Pass', 'Jegou Relay'],
    'advanced'
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
