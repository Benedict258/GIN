# GIN Development Plan

## 1. Product Direction

GIN is not just a full-stack dashboard.

GIN is an intelligence mod/platform for **EVE Frontier**:

- It gathers live and contributed signals from the game ecosystem
- It validates and structures those signals into usable intelligence
- It uses an AI advisor layer to return actionable guidance to players
- It rewards players who contribute useful data
- It is designed to exist in the EVE Frontier ecosystem, not outside it as a disconnected tool

The long-term vision is:

**player and world interactions -> verified intelligence -> AI guidance -> better player decisions -> more ecosystem data -> stronger GIN**

For MVP, "constantly trained" should mean:

- continuously updated data
- continuously updated knowledge base
- retrieval over fresh game knowledge
- prompt and policy refinement
- periodic evaluation and tuning

It should **not** mean training a new foundation model from scratch during the hackathon.

## 2. Source-Backed Constraints

Based on the official hackathon and builder documentation:

- The hackathon runs from **March 11, 2026** to **March 31, 2026**
- Entries can be either:
  - in-world mods running on Smart Assemblies
  - external applications connected to the same live universe
- Categories reward:
  - utility
  - technical implementation
  - creative ideas
  - live Frontier integration
- EVE Frontier supports:
  - external dApps
  - EVE Vault identity and wallet connection
  - reads through World API, GraphQL, gRPC, events, and indexers
  - writes through Sui transactions and capability-based world interactions

This means the strongest realistic direction is:

**external dApp first, real EVE Frontier integration from day one, deeper in-world mod presence only if time allows**

That path maximizes:

- delivery speed
- utility
- technical clarity
- demo quality
- chance of live integration points

## 3. Recommended Product Shape

### MVP Shape

Build GIN first as:

- an external intelligence dApp
- a personal AI copilot for EVE Frontier players
- a shared intelligence network for contributors, packs, and factions

### In-Game Positioning

Narratively and later functionally, GIN can be framed as:

- a galactic intelligence service
- a strategic advisory network
- a faction-aligned or neutral intelligence layer
- eventually a discoverable in-world location, structure, or service point

### Recommendation for Surface Area

For the hackathon:

1. External dApp first
2. EVE Vault / wallet identity connection
3. Read live or sandbox ecosystem data
4. Demonstrate intelligence generation
5. If time permits, add a clearer in-game access story or assembly-linked extension

Reason:

- official hackathon material explicitly supports external apps
- the live integration category favors real interaction with Frontier systems
- trying to build full Smart Assembly gameplay first is riskier than delivering a useful intelligence system with real chain/world reads

## 4. Core Product Thesis

GIN should behave like a constantly improving intelligence companion for the player.

It should answer questions such as:

- Where is it safe to travel?
- Where are hostiles concentrating?
- Where are resource opportunities emerging?
- Which route is safer right now?
- Which sectors are becoming strategically important?
- What should I do next based on my situation, history, and goals?

The key difference between GIN and a normal dashboard is:

- GIN should not just display data
- GIN should interpret the ecosystem for the player

## 5. Intelligence Model

### What GIN Learns From

GIN should eventually learn from all of the following:

- player-submitted reports
- on-chain world state
- world events
- killmail-style signals
- movement or location-relevant signals where available
- resource activity
- structure and assembly activity where available
- faction or pack-shared reports
- curated game knowledge and documentation
- historical patterns gathered by GIN over time

### What "Learning" Means in MVP

For hackathon scope, implement learning as:

- ingestion of fresh ecosystem data
- validation and scoring of signals
- storage of structured intelligence
- retrieval over a living knowledge base
- LLM reasoning over verified context
- periodic refresh of prompts, heuristics, and reference data

### What to Avoid in MVP

- training a new base model
- expensive fine-tuning pipelines
- vague claims of autonomous AI without reliable grounding

## 6. AI Strategy

The most realistic architecture is:

**RAG + scoring/analytics + system prompts + LLM output layer**

### Layer A: Structured Intelligence Layer

Deterministic services should compute:

- threat level
- opportunity level
- route safety
- confidence
- contributor reputation
- report freshness
- agreement across sources

### Layer B: Knowledge Layer

Maintain a knowledge corpus containing:

- EVE Frontier mechanics
- GIN operating rules
- ecosystem observations
- historical intelligence snapshots
- curated strategic guidance

This corpus can be refreshed as the game ecosystem evolves.

### Layer C: LLM Advisor Layer

The LLM should not invent state.

It should:

- receive verified structured context
- receive retrieved knowledge context
- reason within strict system instructions
- produce readable, tactical advice for the player

### Layer D: Evaluation Layer

Track:

- whether advice matched actual outcomes
- whether reports were later confirmed
- which contributors provide high-value data
- which prompts and retrieval settings improve output quality

## 7. Trust, Verification, and Anti-Abuse

This is a core system, not a stretch feature.

GIN will fail if it trusts raw input blindly.

### Verification Principles

- repeated reports increase confidence
- source diversity increases confidence
- recency matters
- contradictory signals reduce confidence
- trusted contributors carry more weight
- stale data decays automatically

### Initial Trust Model

Each piece of intelligence should have:

- `confidenceScore`
- `sourceCount`
- `sourceDiversity`
- `freshnessScore`
- `reputationWeight`
- `verificationState`

Example verification states:

- `unverified`
- `emerging`
- `verified`
- `contested`
- `stale`

### Anti-Abuse Requirements

- detect repeated spam from single sources
- down-rank low-quality reporters
- separate raw claims from verified intelligence
- never let the LLM treat low-confidence data as fact

## 8. Contribution and Reward System

The product needs a contribution economy because the intelligence becomes stronger when players participate.

### Contribution Model

Players opt in to share useful interactions or intelligence with GIN.

Potential contribution types:

- manual reports
- telemetry or ecosystem-linked gameplay signals
- faction intelligence submissions
- confirmations or disputes of existing intelligence

### Reward Model for MVP

Start simple:

- GIN Credits
- contributor reputation
- access tier unlocks
- premium intelligence access for high-value contributors

Do not block MVP on a full token economy.

### Future Reward Expansion

Later, GIN Credits may connect to:

- in-game utility
- premium network access
- pack/faction subscriptions
- on-chain accounting or reward claims

## 9. Access and Identity Model

Recommended access model:

- connect through EVE Vault / wallet identity
- map the wallet to player and contributor identity
- permission access to GIN services based on role or credits

Possible access tiers:

- guest
- contributor
- premium operator
- pack/faction operator

For MVP, access should work like this:

- contributors earn access by contributing useful data
- non-contributors can buy credits to access GIN
- access quality can later be expanded through tiering, reputation, and pack entitlements

## 10. Technical Direction

### Recommended Stack

- Frontend: `Next.js` + React + TypeScript
- Backend: `Node.js` + TypeScript
- API layer: `Fastify` or `NestJS`
- Data layer: `Supabase Postgres` as preferred, otherwise `PostgreSQL` or `SQLite`
- ORM: `Prisma`
- Background jobs: lightweight Node workers / cron jobs
- EVE integration: EVE Frontier dApp kit, EVE Vault, World API, GraphQL, gRPC, events
- AI layer: LLM API + retrieval pipeline + prompt/version management

### Backend Recommendation

Use `Node.js`, not FastAPI.

Reason:

- tighter stack consistency with Next.js and TypeScript
- easier shared types across frontend and backend
- better fit with the EVE Frontier dApp ecosystem and TypeScript tooling
- faster iteration for wallet, Sui, and external dApp integration

### Supabase Recommendation

Supabase is a strong MVP choice for GIN.

Recommended Supabase use:

- Postgres for transactional intelligence data
- Auth only where it helps non-wallet product surfaces
- Storage for application assets and non-Walrus file storage
- Realtime for live dashboard updates where useful
- pgvector for retrieval and knowledge embeddings

Important constraint:

- Supabase Edge Functions are not the same thing as a normal Node.js backend
- GIN should still keep a Node.js backend or Next.js server layer for core application logic
- Supabase should be treated as the data platform, not as a reason to abandon the Node architecture

### Walrus Positioning

Walrus should not be the primary transactional database for MVP.

Use Walrus later for things like:

- signed intelligence artifacts
- snapshots
- evidence bundles
- large immutable knowledge assets

For hot application state, use a normal application database first.

Walrus can still be part of MVP if used correctly.

Good MVP Walrus use cases:

- publish verified intelligence snapshots
- store large knowledge artifacts
- store evidence packages for major intelligence claims
- store versioned datasets used by retrieval or evaluation

Recommended combined architecture:

- Supabase for app state, credits, reports, identities, reputation, embeddings, and realtime updates
- Walrus for verifiable published intelligence artifacts and larger immutable evidence assets

Avoid using Walrus as the main store for:

- small frequently updated app state
- fast-changing credit balances
- routine session and access records
- tight request-response transactional workflows

## 11. Product Architecture

### Layer 1: Identity and Access

- EVE Vault connection
- player identity resolution
- contributor account state
- role/access gating
- optional Supabase-side user/account mapping for app services

### Layer 2: Data Ingestion

Sources:

- player reports
- live or sandbox world data
- world events
- curated external game knowledge
- pack/faction intelligence inputs

### Layer 3: Verification and Trust

- report normalization
- source validation
- deduplication
- consensus detection
- reputation scoring
- confidence scoring

### Layer 4: Intelligence Store

Stores:

- raw reports
- verified intelligence entities
- sector summaries
- player and pack intelligence profiles
- knowledge base chunks
- evaluation logs
- credit balances and reward history
- embedding records for retrieval

### Layer 5: Intelligence Engine

Computes:

- threat
- opportunity
- route recommendations
- sector trend changes
- pack/faction summaries
- personalized advisories

### Layer 6: AI Advisor

Combines:

- structured intelligence
- retrieved knowledge
- user context
- system prompts

Outputs:

- alerts
- recommended actions
- summaries
- route or sector suggestions

### Layer 7: Reward and Access Economy

- GIN Credits
- contributor reputation
- access entitlements
- future on-chain claim hooks

### Layer 8: Interface

- external web dApp
- mobile-friendly views
- future in-game entry point
- future structure or assembly-linked experience

## 12. MVP Feature Set

### Must Build

- EVE Frontier-aligned external dApp shell
- Node.js backend
- Supabase project integration
- EVE Vault style identity/wallet connection path
- intelligence report ingestion
- world/ecosystem ingestion adapter
- trust and confidence scoring
- sector and route intelligence views
- AI advisor output with reasons
- contributor reputation and basic GIN Credits logic
- demo scenario using live-compatible or sandbox-compatible data flows

### Should Build

- pack/faction shared intelligence workspace
- player profile and advisory history
- route safety assistant
- retrieval-backed game knowledge assistant

### Stretch Build

- live Stillness deployment component
- in-game discoverability hook
- Walrus-backed intelligence artifact publishing
- on-chain reward accounting
- assembly-linked GIN access point

## 13. MVP Use Cases

### Personal Copilot

The player asks:

- Where should I go?
- What should I avoid?
- What is my best next action?

GIN responds with:

- direct recommendation
- evidence
- confidence level

### Shared Intelligence Network

Contributors submit data.

GIN:

- validates it
- merges it
- turns it into network intelligence

The MVP should be balanced:

- personal intelligence for the individual player
- shared intelligence value from the contributor network

### Pack/Faction Operations

Groups see:

- shared threat zones
- opportunity zones
- activity changes
- internal trusted intelligence

## 14. API Direction

### Identity

- `POST /auth/connect`
- `GET /me`
- `GET /me/access`
- `POST /auth/wallet-link`

### Ingestion

- `POST /reports`
- `GET /reports`
- `POST /ingest/world-events`
- `POST /ingest/knowledge`

### Intelligence

- `GET /intel/sectors`
- `GET /intel/sectors/:location`
- `GET /intel/routes`
- `GET /intel/alerts`
- `GET /intel/recommendations`

### Trust and Reputation

- `GET /trust/reports/:id`
- `GET /contributors/:id/reputation`
- `POST /reports/:id/confirm`
- `POST /reports/:id/dispute`

### Rewards

- `GET /credits/balance`
- `GET /credits/history`
- `POST /credits/grant`

### Packs

- `POST /packs`
- `GET /packs`
- `GET /packs/:id/intelligence`

## 15. Roadmap

Hackathon deadline from official materials:

- **Submissions close March 31, 2026**

### Phase 1: Product Lock

Target: **March 21-22, 2026**

- lock Node.js architecture
- lock MVP scope
- define identity, ingestion, trust, intelligence, and advisor data models
- choose exact AI integration approach

### Phase 2: Platform Skeleton

Target: **March 22-23, 2026**

- scaffold frontend and backend
- add shared TypeScript contracts
- add database schema
- add basic wallet/auth shell
- configure Supabase project and local/dev workflow

### Phase 3: Ingestion and Trust

Target: **March 23-25, 2026**

- implement report ingestion
- implement world data adapters
- implement confidence and verification layer
- implement initial contributor scoring

### Phase 4: Intelligence Engine

Target: **March 25-27, 2026**

- compute sector summaries
- compute route and threat intelligence
- build recommendation inputs
- validate results with seeded and live-compatible scenarios

### Phase 5: AI Advisor

Target: **March 27-28, 2026**

- add retrieval pipeline
- add system prompts and guardrails
- connect structured intelligence to LLM responses
- store evaluations and feedback

### Phase 6: Rewards and Shared Access

Target: **March 28-29, 2026**

- add GIN Credits logic
- add contributor and access tiers
- add pack/faction shared view
- weight reward actions by importance and usefulness

### Phase 7: Demo and Integration

Target: **March 29-31, 2026**

- tighten UI
- sharpen demo story
- verify sandbox or live integration points
- cut unstable extras
- prepare submission materials

## 16. Definition of Done

GIN MVP is done when:

1. A player can connect identity
2. GIN can ingest reports and at least one ecosystem-linked data source
3. GIN scores confidence and trust rather than treating all data equally
4. The intelligence engine produces useful sector, threat, or route output
5. The AI advisor gives grounded recommendations with reasons
6. Contributors can earn basic GIN Credits or reputation
7. The demo clearly shows why GIN improves survival, coordination, or strategic play

## 17. Strategic Recommendations

### Recommendation 1

Treat GIN as a **civilization intelligence service**, not a reporting app.

### Recommendation 2

Treat "training" in MVP as **continuous knowledge and signal refresh**, not full model training.

### Recommendation 3

Make the trust layer first-class. Without trust, the intelligence product collapses.

### Recommendation 4

Target both **Utility** and **Technical Implementation** strongly, and aim for **Live Frontier Integration** if integration is stable enough.

### Recommendation 5

If time gets tight, keep:

- identity
- ingestion
- trust
- intelligence
- advisor

and cut:

- tokenomics complexity
- deep assembly logic
- ambitious on-chain reward settlement

## 18. Current Open Questions

- Which live game signals are realistically accessible in the first version?
- What is the first in-game narrative or physical presence of GIN?

## 19. Final Working Position

GIN should be built as a **Node.js-powered EVE Frontier intelligence dApp** that:

- connects to the EVE Frontier ecosystem
- gathers live and contributed data
- validates and structures it
- uses RAG plus an LLM advisor to produce tactical intelligence
- rewards useful contributors
- evolves into a deeper in-world intelligence infrastructure over time

That is a stronger product than a normal dashboard, and it fits both the hackathon theme and the actual Frontier builder model.

## 20. Locked Product Decisions

The following decisions are now locked for MVP planning:

### Intelligence Shape

GIN should be balanced between:

- personal intelligence for each player
- shared intelligence generated by contributor data

### Reward Logic

GIN Credits should be granted for multiple contribution actions, with a grading layer that weights them by importance.

Initial rewardable actions can include:

- submitting reports
- confirming reports
- disputing incorrect reports
- providing ecosystem-linked gameplay data
- contributing high-value repeated signals
- helping validate strategic intelligence

The reward engine should score:

- importance
- usefulness
- verification outcome
- uniqueness
- impact on intelligence quality

### Access Economy

GIN access should work on a dual model:

- contributors gain access by providing useful data and earning credits
- non-contributors may buy credits to access intelligence

This means GIN is not free intelligence for everyone.

Access should be governed by:

- credits
- contributor status
- reputation
- future premium or pack-level access rules
