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

The API now exposes helper endpoints that bridge Supabase intelligence data, Walrus artifact storage, and the Sui Move contract:

- `POST /api/contracts/publish-artifact` uploads a recommendation snapshot to Walrus (using `WALRUS_PUBLISHER_URL`) and executes `publish_artifact` in `contracts/gin-core`. Provide either a `recommendationId` (preferred) or a custom `content` object plus `artifactType`/`confidenceScore`.
- `POST /api/contracts/award-credits` calls the on-chain `award_credits` entry point for a Supabase `profileId`, ensuring the Move ledger mirrors contributor balances tracked in Supabase.

Configure the following environment variables before hitting the endpoints:

- `WALRUS_PUBLISHER_URL` (and optionally `WALRUS_AGGREGATOR_URL`) for artifact storage
- `GIN_MOVE_PACKAGE_ID`, `GIN_MOVE_STATE_ID`, `GIN_MOVE_ADMIN_CAP_ID` for the deployed Move objects
- `GIN_SUI_PRIVATE_KEY` (base64, JSON `["ed25519", "<base64>"]`, or hex format) for the signer that owns the admin cap
- `SUI_NETWORK` (`mainnet`, `testnet`, or `devnet`) plus `SUI_RPC_URL` if you need a custom fullnode (defaults to `https://fullnode.<network>.sui.io`)

Both endpoints return the on-chain transaction digest so the Walrus artifact / credit receipts can be verified in block explorers.
