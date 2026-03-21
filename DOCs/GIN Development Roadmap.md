# GIN Development Roadmap

This document is the execution roadmap for building GIN from concept to MVP submission.

It is intentionally practical:

- what we are building first
- what comes next
- what can wait
- what I need from you to avoid blocking implementation

Submission target from the official hackathon timeline:

- **March 31, 2026**

## 1. Build Goal

Build a working MVP of **GIN - Galactic Intelligence Network** as an EVE Frontier intelligence dApp that:

- ingests player and ecosystem signals
- validates and scores intelligence
- produces grounded AI recommendations
- rewards contributors with GIN Credits or reputation
- supports access through contribution or purchased credits
- includes Walrus where it adds proof and artifact value

## 2. Delivery Principles

- ship the intelligence loop first
- keep the trust layer first-class
- use Node.js and TypeScript across the stack
- use Supabase for live application data
- use Walrus for verifiable intelligence artifacts
- build external dApp first, then deepen game integration

## 3. Phase Roadmap

## Phase 0: Foundation Lock

Target: **March 21, 2026**

Objective:

- lock product direction and core architecture before writing app code

Deliverables:

- confirmed stack: `Next.js + Node.js + Supabase + Walrus`
- confirmed MVP shape
- confirmed access economy
- confirmed reward logic direction
- confirmed EVE Frontier dApp Kit usage
- confirmed first Move package direction

Status:

- completed

## Phase 1: Project Bootstrap

Target: **March 21-22, 2026**

Objective:

- create the initial codebase and working development environment

Build:

- frontend app scaffold
- backend service scaffold
- shared TypeScript types/contracts
- env structure
- package/workspace layout
- EVE Frontier dApp Kit frontend integration point
- first Move smart-contract package scaffold

Done when:

- repo has runnable frontend and backend apps
- local development commands work
- environment variables are documented
- first on-chain package builds successfully

## Phase 2: Data and Identity Layer

Target: **March 22-23, 2026**

Objective:

- establish the core persistence and identity model

Build:

- Supabase project integration
- database schema
- user/profile model
- contributor profile model
- wallet-linking flow placeholder or implementation path
- credits and reputation tables
- EVE Vault and dApp Kit identity integration refinement

Done when:

- app can read and write to the database
- a player identity record can be created or linked
- credit and reputation entities exist in schema

## Phase 3: Intelligence Ingestion

Target: **March 23-24, 2026**

Objective:

- get data into GIN in a structured way

Build:

- report submission API
- manual intelligence reporting UI
- world-event ingestion adapter interface
- knowledge ingestion pipeline placeholder
- source metadata tracking

Done when:

- reports can be submitted and stored
- every report has source and freshness metadata
- ingestion contracts are stable

## Phase 4: Trust and Verification

Target: **March 24-25, 2026**

Objective:

- prevent raw noisy input from becoming false intelligence

Build:

- deduplication logic
- confidence scoring
- verification states
- contributor weighting
- confirmation/dispute workflow
- stale data decay rules

Done when:

- every report receives a trust profile
- verified intelligence is separated from raw input
- contradictory or weak data is downgraded

## Phase 5: Intelligence Engine

Target: **March 25-26, 2026**

Objective:

- turn verified signals into useful gameplay intelligence

Build:

- sector summaries
- route safety scoring
- threat scoring
- opportunity scoring
- pack/faction intelligence summary model

Done when:

- GIN can compute intelligence views from stored signals
- sector and route outputs are readable and useful

## Phase 6: AI Advisor

Target: **March 26-27, 2026**

Objective:

- generate grounded tactical advice from intelligence and knowledge

Build:

- advisor orchestration service
- prompt structure
- retrieval pipeline
- response format with confidence and reasons
- evaluation logging

Done when:

- a user can ask for guidance and receive grounded advice
- recommendations reference structured intelligence, not hallucinated state

## Phase 7: Credits and Access Economy

Target: **March 27-28, 2026**

Objective:

- enforce the GIN access model

Build:

- GIN Credits grant logic
- action grading by importance and usefulness
- contributor access rules
- buyer credit access rules
- balance and usage tracking

Done when:

- useful contribution can earn credits
- credits can gate intelligence access
- the dual model works: contributor or buyer

## Phase 8: Walrus Integration

Target: **March 28, 2026**

Objective:

- add blockchain-native proof value without slowing core delivery

Build:

- artifact publisher service
- verified intelligence snapshot format
- evidence bundle format
- Walrus upload flow for selected artifacts

Recommended first Walrus artifacts:

- sector threat snapshot
- route safety bulletin
- verified intelligence digest

Done when:

- GIN can publish at least one verifiable intelligence artifact to Walrus

## Phase 9: UX and Demo Layer

Target: **March 28-30, 2026**

Objective:

- make the product understandable and demo-ready

Build:

- dashboard shell
- personal intelligence view
- shared intelligence view
- contributor profile
- credits and access UI
- evidence display for confidence and verification

Done when:

- the product tells a clear story
- a judge can understand why GIN matters within minutes

## Phase 10: Integration, Testing, and Submission

Target: **March 30-31, 2026**

Objective:

- stabilize the MVP and package it for submission

Build:

- sandbox or live integration checks
- end-to-end testing of the intelligence loop
- demo script
- screenshots or video capture plan
- final submission notes

Done when:

- GIN can be demonstrated end-to-end
- unstable extras are cut
- the submission is coherent and defensible

## 4. Recommended Build Order

If time gets tight, the build order should be:

1. scaffold apps
2. set up Supabase schema
3. build reports ingestion
4. build trust and verification
5. build intelligence summaries
6. build AI advisor
7. add credits and access rules
8. add Walrus publishing
9. polish UI

## 5. What Can Wait

These are valuable but not MVP blockers:

- complex tokenomics
- full in-world assembly integration
- advanced pack governance
- full automation over all game systems
- custom model training
- deep on-chain settlement logic

## 6. What I Need From You

To begin implementation without unnecessary delay, I will need:

### Needed Soon

- approval on the stack: `Next.js + Node.js + Supabase + Walrus`
- your preference for monorepo structure if you have one
- whether you want `Fastify` or `NestJS`
- whether you want `PostgreSQL via Supabase` as the default now

### Needed Before Live Integrations

- Supabase project credentials or approval to set one up
- OpenAI API key or preferred LLM provider
- any EVE Frontier sandbox access details you already have
- any wallet/test identity you want to use for integration testing

### Needed Before Submission Polish

- branding direction for GIN
- preferred demo story
- whether you want a neutral intelligence service tone or a more in-world faction tone

## 7. Immediate Next Build Tasks

The next concrete implementation tasks should be:

1. connect API reads and writes to Supabase
2. replace demo API responses with database-backed ones
3. wire the first report submission flow end to end
4. add verification and confidence scoring
5. connect the dApp Kit wallet flow to real profile creation and access logic

## 8. Current Recommendation

We should start with:

- Supabase-backed API integration
- the report -> verification -> intelligence loop
- dApp Kit wallet-linked identity and access
- smart-contract expansion for artifact publishing and credits

That gives us the fastest path to a working GIN core.
