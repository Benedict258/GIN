PROJECT SUMMARY (FOR YOUR COPILOT)

Project Name:

GIN - Galactic Intelligence Network

Core Idea:

GIN is an EVE Frontier intelligence mod/platform that:

- gathers ecosystem and player-contributed signals
- validates and structures those signals
- turns them into tactical intelligence
- provides an AI-style advisor to players and groups
- rewards contributors whose data improves the network

Problem:

Players in EVE Frontier lack a strong shared intelligence layer that helps them survive, coordinate, route safely, and react to live ecosystem changes.

Solution:

GIN acts as:

- a galactic intelligence network
- a personal AI copilot
- a shared intelligence layer for contributors, packs, and factions

Core Value:

Turn raw ecosystem data -> verified intelligence -> player advantage

2. SYSTEM ARCHITECTURE (WHAT YOU ARE BUILDING)

Layer 1: Identity and Access

- EVE Vault or wallet-linked player identity
- contributor access
- future GIN Credits gating

Layer 2: Data Ingestion

Sources:

- player reports
- game or world signals
- curated game knowledge
- pack or faction shared intelligence

Layer 3: Trust and Verification

Processes:

- normalize reports
- deduplicate
- score confidence
- verify repeated signals
- weight sources by reputation

Layer 4: Intelligence Engine

Processes:

- aggregate by sector and route
- compute risk, safety, opportunity, and freshness
- detect useful patterns

Layer 5: AI Advisor

Use:

- structured intelligence
- retrieved knowledge
- system prompts
- an LLM output layer

Examples:

- "Avoid Sector A. Hostile reports are rising and confidence is high."
- "Mine Sector B. Resource density is strong and threat level is currently low."
- "Take Route C. It is safer than Route D based on recent verified signals."

Layer 6: Reward Layer

- contributor reputation
- GIN Credits
- action grading by importance and usefulness
- future premium access or ecosystem-linked rewards

Layer 7: Interface

- external web dApp first
- mobile-friendly intelligence views
- future in-game access point or assembly-linked presence

3. DEVELOPMENT PLAN (TASKABLE)

PHASE 1: Product Lock

- lock the product as an EVE Frontier intelligence dApp
- use Node.js, not FastAPI
- define identity, ingestion, trust, intelligence, advisor, and reward models

PHASE 2: Platform Setup

- backend: Node.js + TypeScript
- frontend: Next.js + React + TypeScript
- database: Supabase Postgres preferred, otherwise PostgreSQL or SQLite
- wallet and ecosystem integration path

PHASE 3: Ingestion and Verification

- build report ingestion APIs
- add live or sandbox ecosystem adapters
- add confidence and trust logic

PHASE 4: Intelligence Engine

- aggregate data by sector and route
- compute risk, safety, opportunity, and freshness
- expose intelligence endpoints

PHASE 5: AI Advisor

- add retrieval-backed knowledge
- connect structured intelligence to LLM prompts
- generate player-facing recommendations with reasons

PHASE 6: Contributor Economy

- add contributor reputation
- add GIN Credits
- grade contribution actions by importance
- gate better access or features through contribution value

PHASE 7: Demo and Integration

- polish UI
- demonstrate real or sandbox-connected data
- show a strong before or after gameplay value story

4. COPILOT INSTRUCTIONS (IMPORTANT)

Give your AI builder this:

SYSTEM PROMPT (FOR AI COPILOT)

You are building GIN (Galactic Intelligence Network), an intelligence mod/platform for EVE Frontier.

This is not a generic CRUD dashboard.

GIN must:

1. Connect to the EVE Frontier ecosystem as an external dApp first
2. Use Node.js and TypeScript for backend services
3. Ingest player and ecosystem data
4. Validate and score incoming data before using it as intelligence
5. Maintain a living knowledge base for retrieval
6. Use a grounded LLM advisor layer to produce tactical guidance
7. Reward valuable contributors through reputation and GIN Credits
8. Support a dual access model:
   - contributors earn access through useful data
   - non-contributors can buy credits for access

Recommended stack:

- Backend: Node.js + TypeScript
- Frontend: Next.js + React
- Database: Supabase Postgres preferred, otherwise PostgreSQL or SQLite
- ORM: Prisma
- AI: RAG + prompts + LLM API

Use Supabase for:

- Postgres
- optional auth and account mapping
- storage
- realtime updates
- vector search where helpful

Use Walrus for:

- verified intelligence artifacts
- evidence bundles
- larger immutable knowledge assets

Must-have features:

1. Identity and access connection
2. Intelligence report ingestion
3. Trust and verification layer
4. Sector, route, or threat intelligence summaries
5. AI recommendations with reasons and confidence
6. Contributor reputation or GIN Credits
7. Contribution grading by importance and usefulness

Constraints:

- keep the MVP grounded and demoable
- do not build a custom foundation model
- do not rely on Walrus as the main transactional database
- treat live Frontier integration as important if stable enough
