# GIN

Galactic Intelligence Network for EVE Frontier.

## Workspace

This repo is being built as a simple monorepo:

- `apps/web` - Next.js frontend
- `apps/api` - Fastify API
- `packages/shared` - shared types and schemas
- `contracts/gin-core` - Move smart-contract package for GIN on Sui / EVE Frontier
- `supabase` - database schema and migrations
- `DOCs` - product, architecture, and roadmap docs

## Current Build Status

Implemented so far:

- product and roadmap documentation
- monorepo workspace layout
- initial Fastify API scaffold
- initial Next.js app shell with EVE Frontier dApp Kit integration
- shared Zod-based intelligence models
- first Move smart-contract package for GIN state, artifact publishing, and credit receipts
- first Supabase migration for reports, verification, sectors, recommendations, and credits
- Supabase-backed API routes for reports, sector summaries, and recommendations
- wallet connection endpoint that creates/links Supabase profiles and contributor records
- frontend QueryClient + dApp kit providers with wallet-aware report submissions
- Supabase seed migration to populate demo profiles, contributors, sectors, and recommendations
- Phase 4 trust pipeline with dedupe hashing, consensus/recency scoring, and verification states applied to every report
- Utopia-ready trust monitor panel that exposes confidence components and source diversity directly in the web UI
- Phase 5.1 sector intelligence engine that recomputes threat/opportunity/confidence per location from trusted report clusters
- Phase 5.2 route safety engine with Supabase-backed corridor summaries and a HUD-ready route panel
- Phase 5.3 pack/faction intelligence aggregation with HUD-ready panel and report form tagging support
- Phase 5.4 structured advisor snapshots with optional Walrus + Sui publication flow
- Automation-ready cron endpoint that recomputes sectors/routes/factions and captures a structured snapshot in one call
- Default-disabled Walrus pathway so snapshots store locally unless explicitly re-enabled via env flag

## Environment

Copy `.env.example` into your local environment and fill in the real values when ready.

## Verification

Verified successfully:

- `npm run typecheck`
- `npm run build`
- `npm run build:contracts`

## Supabase Data Seeding

Load the schema plus demo data locally by running the Supabase CLI reset flow from the repo root:

1. Install the Supabase CLI (`npx supabase@latest --help` for one-off usage, or `scoop install supabase` on Windows for a persistent binary) and make sure Docker Desktop is running.
2. Authenticate once with `npx supabase@latest login` if you have not already.
3. Run `npx supabase@latest db reset --local`.

The reset command applies `supabase/migrations/0001_initial_schema.sql` followed by `supabase/migrations/0002_seed_demo_data.sql`, so the web app and API immediately surface meaningful sector summaries, recommendations, and a seeded contributor profile/credits balance.

## Walrus + Move Contract Hooks

> **Note:** Walrus is disabled by default. Set `WALRUS_ENABLED=true` in the API environment to re-enable pinning + on-chain artifact publication. When disabled, structured snapshots are stored locally and any publish requests will return `503`.

The API exposes helper endpoints that bridge Supabase intelligence data, Walrus artifact storage, and the Sui Move contract:

- `POST /api/contracts/publish-artifact` uploads a recommendation snapshot to Walrus (using `WALRUS_PUBLISHER_URL`) and executes `publish_artifact` in `contracts/gin-core`. Provide either a `recommendationId` (preferred) or a custom `content` object plus `artifactType`/`confidenceScore`.
- `POST /api/contracts/award-credits` calls the on-chain `award_credits` entry point for a Supabase `profileId`, ensuring the Move ledger mirrors contributor balances tracked in Supabase.

Configure the following environment variables before hitting the endpoints:

- `WALRUS_ENABLED=true`, plus `WALRUS_PUBLISHER_URL` (and optionally `WALRUS_AGGREGATOR_URL`) for artifact storage
- `GIN_MOVE_PACKAGE_ID`, `GIN_MOVE_STATE_ID`, `GIN_MOVE_ADMIN_CAP_ID` for the deployed Move objects
- `GIN_SUI_PRIVATE_KEY` (base64, JSON `["ed25519", "<base64>"]`, or hex format) for the signer that owns the admin cap
- `SUI_NETWORK` (`mainnet`, `testnet`, or `devnet`) plus `SUI_RPC_URL` if you need a custom fullnode (defaults to `https://fullnode.<network>.sui.io`)

Both endpoints return the on-chain transaction digest so the Walrus artifact / credit receipts can be verified in block explorers.

## Trust & Verification Layer

Phase 4 shipped a deterministic trust profile for every report submitted through GIN:

- Incoming reports are hashed via location + signal metadata to dedupe repeated claims.
- The API recomputes consensus, recency, diversity, and reporter reputation scores for the entire cluster on every submission.
- Confidence components are persisted in Supabase so the UI and advisor layers can explain _why_ a report is verified, emerging, contested, or stale.
- The `reports` table now exposes `dedupe_hash`, `source_count`, unique source/faction counts, and the component breakdown so downstream services (sector summaries, AI advisor, Walrus artifacts) can trust structured metrics instead of raw data.
- The web dashboard includes a Utopia-compatible trust monitor that renders consensus, recency, reputation, and diversity components alongside source counts so testers can see _why_ a report advanced to verified/emerging in the mod layout.

Use `supabase/migrations/0003_phase4_trust.sql` to apply the new schema locally or through the hosted project.

## Sector Intelligence Engine

Phase 5.1 rebuilt sector summaries on top of the trust layer instead of static seed data:

- The API can now recompute sector summaries on demand by calling `POST /api/intel/sectors/recompute`, which ingests the last 36 hours of trusted reports.
- Threat and opportunity scores are derived from weighted signal types (enemy sightings, jump activity, safe routes, resource clusters, etc.) and the confidence components saved per report.
- Verification states for each sector now account for source diversity, recency decay, and consensus, so stale intel naturally decays to `stale` while live, multi-source clusters move to `verified`.
- `GET /api/intel/sectors` automatically triggers a recompute when no cached summaries exist, so the Utopia mod always has data when booting in a clean environment.

## Route Safety Engine

Phase 5.2 extends the deterministic intelligence loop to travel corridors:

- Supabase migration `supabase/migrations/0004_route_summaries.sql` adds a `route_summaries` table keyed by origin/destination.
- `POST /api/intel/routes/recompute` ingests the latest sector intelligence and recomputes corridor threat, safety, and verification state for canonical Utopia routes (Alpha↔Beta, Beta↔Gamma, Gamma↔Delta).
- `GET /api/intel/routes` returns cached summaries and auto-recomputes when empty so the assembly HUD always receives data.
- The Next.js dashboard now renders a Route Safety panel that mirrors the compact overlay intended for the in-game mod, showing threat, safety, confidence, and advisory notes for each corridor.

## Faction Intel & Structured Snapshots

Phase 5.3 and 5.4 complete the Utopia intelligence surface by layering faction insights and advisor-ready payloads on top of the sector/route engines:

- `supabase/migrations/0005_phase5_factions_snapshots.sql` adds `faction_tag` to reports, a `faction_intel_summaries` table, and `structured_intel_snapshots` for persisted advisor payloads.
- `POST /api/intel/factions/recompute` ingests the last 72 hours of tagged reports, computes verification-weighted stats per faction/pack, and caches them for `GET /api/intel/factions`.
- The report form accepts an optional faction/pack tag so contributors can flag ownership before intel aggregation runs.
- `POST /api/intel/snapshots` orchestrates sector, route, and faction recomputes, bundles the latest data into a structured payload, and (optionally) pins the artifact to Walrus + the GIN Move contract.
- The dashboard renders Pack Intel and Advisor Snapshot panels so ops teams (and the Utopia HUD) see the exact data being published downstream.

## Automation Hooks

Use the automation endpoint when you want a single cron/edge function to refresh every intel layer and capture a structured snapshot:

- `POST /api/automation/cycle` accepts the same body as the snapshot endpoint (`publishArtifact?: boolean`, `confidenceScore?: number`) plus an optional `skipSnapshot` flag. It recomputes sectors, routes, and factions, then (unless skipped) generates a snapshot without re-running the heavy recompute work.
- The response reports how many rows were updated per intel surface and returns the snapshot payload (including any Walrus blob ID) so schedulers can log or further process the result.

Point a Supabase cron, GitHub Action, or on-prem scheduler at this endpoint to keep the assembly HUD and advisor artifacts fresh without chaining multiple HTTP calls.

## Validation & On-chain Proofs

GIN exposes transaction digests for every artifact publication and credit reward so judges can verify actions directly on Sui testnet. Walrus storage is simulated for hackathon reliability, but the Move contract writes are fully live.

### Artifact publication example

- Endpoint: `POST /api/contracts/publish-artifact`
- Sample response excerpt:

```json
{
  "artifactType": "intelligence_report",
  "blobId": "walrus_1774270405885",
  "transactionDigest": "7vbtxP43cakqQc53GiSmbkJqEPhPUzPHVcG5SRqsWuVi"
}
```

- Explorer proof: https://explorer.sui.io/transaction/7vbtxP43cakqQc53GiSmbkJqEPhPUzPHVcG5SRqsWuVi?network=testnet

### Contributor credit reward example

- Endpoint: `POST /api/contracts/award-credits`
- Sample response excerpt:

```json
{
  "profileId": "58fea314-ad07-4b1b-936a-63b4b952132e",
  "credits": 10,
  "reportDigestHex": "34eb6fda790b85ee117d222554f795de1e37e2ba4d81407576e7d0df8e2e7d42",
  "transactionDigest": "8FHAowCHvbjcrBFK7ByEv9P2zb6FETzRsN74fdT4AxtC"
}
```

- Explorer proof: https://explorer.sui.io/transaction/8FHAowCHvbjcrBFK7ByEv9P2zb6FETzRsN74fdT4AxtC?network=testnet

> Tip: replace the sample digests above with your own calls during testing and drop them into the explorer link to confirm the on-chain state transitions.
