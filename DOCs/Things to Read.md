# GIN Copilot Resource Guide

This file is a **comprehensive resource guide for the AI copilot** building GIN — Galactic Intelligence Network. It contains all necessary background, tools, and references the copilot needs to understand and use.

---

# 1. Project Overview

**Project Name:** GIN — Galactic Intelligence Network  
**Core Idea:** A hybrid system combining:

- 🌐 Global intelligence network
- 🤖 Personal AI advisor

**Problem:** Players in EVE Frontier lack centralized intelligence to make decisions and coordinate effectively.

**Solution:** GIN collects, processes, and outputs actionable insights to players and factions in real time.

**Key Goals:**

- Enable data-driven survival & strategy
- Introduce emergent gameplay through intelligence and AI
- Scalable from solo players to entire factions
- Blockchain-enabled for secure data and persistence

---

# 2. Hackathon Details

**Event:** 026 EVE Frontier Hackathon  
**Theme:** A Toolkit for Civilization  
**Prize Pool:** $80,000 USD + in-game items and experiences  
**Timeline:**

- Hackathon Start: March 11, 2026
- Submissions Close: March 31, 2026
- Community Voting: April 1–15, 2026
- Judging: April 15–22, 2026
- Winners Announcement: April 24, 2026

**Categories:**

- Utility
- Technical Implementation
- Creative
- Weirdest Idea
- Live Frontier Integration

**Important Links:**

- EVE Frontier Launcher: https://evefrontier.com/en/download
- Sandbox Server: Utopia

**Important Notes for Copilot:**

- Build a mod/external tool that works with EVE Frontier.
- Focus on MVP first: data collection, processing, AI recommendations, dashboard.
- Optional: Pack/faction shared intelligence layer.
- Keep system simple, scalable, and demo-ready.

---

# 3. SUI MOVE

**What It Is:**

- Blockchain programming language for smart contracts on the Sui blockchain.
- Used to deploy decentralized and secure systems.

**Importance for GIN:**

- GIN will be blockchain-enabled.
- Data from the intelligence network can be stored on-chain for persistence and security.
- Some future modules (e.g., packs/faction intelligence sharing) may use Move for secure transactions.

**Resources Copilot Should Study:**

- Sui Docs: https://docs.sui.io/
- Move Language Guide: https://docs.sui.io/build/move/introduction
- Move tutorials/examples for smart contracts

**Key Notes:**

- Focus on using Move for storage of intelligence data.
- Understand blockchain read/write patterns.
- Use Move only where persistence, trust, or on-chain logic is required.

---

# 4. WALRUS

**What It Is:**

- WALRUS is a tool or framework connected to EVE Frontier modding.
- Used for data extraction, workflow orchestration, or mod integration.

**Importance for GIN:**

- Helps pull live or simulated game data.
- Can automate ingestion and processing pipelines.
- Useful for Pack/Faction intelligence systems.

**Resources Copilot Should Study:**

- WALRUS official documentation (if available via EVE Frontier or Sui Hackathon resources)
- Examples of integration with external dashboards
- Event triggers and automation workflows

**Key Notes:**

- Copilot should be able to ingest and process data from WALRUS into GIN.
- Must maintain security and scalability.

---

# 5. EVE Frontier Docs

**Official Docs:** https://docs.evefrontier.com/

**Important Areas for Copilot:**

1. **Game Mechanics & Modding**
   - How to create mods
   - How mods interact with live servers
   - Game events and data structures
2. **Persistent Universe & Player Systems**
   - Player reports, faction structures, resource nodes
   - Emergent gameplay mechanics
3. **Sandbox Server Access**
   - Utopia server usage
   - Testing mods safely

**Key Notes:**

- Copilot must understand the universe and player interactions.
- Should design GIN to support emergent behavior and player agency.
- Simulate live data if full integration isn’t feasible for hackathon MVP.

---

# 6. Additional Guidelines for Copilot

- **Tech Stack:**
  - Backend: Python (FastAPI) or Node.js (Express)
  - Frontend: React / Next.js
  - Database: JSON / SQLite / Supabase for MVP
  - Blockchain: Sui Move for persistence
- **Development Tool:** VS Code is primary IDE
- **AI Logic:** Rule-based for MVP, scalable for future ML
- **Demo Requirements:**
  - Show data input → processing → AI recommendation → player action
  - Optional: Pack/faction shared intelligence
- **Constraints:**
  - MVP must be working and demo-ready
  - No over-engineering
  - Focus on clear utility, creativity, and weird/unique features

---

# 7. Summary for Copilot

**GIN = External dashboard + AI advisor + optional faction system + blockchain persistence**  
**Goal:** Enable players to make informed decisions and survive/coordinate in EVE Frontier’s persistent universe.  
**Approach:**

- Use WALRUS & game APIs for data
- Process intelligence in the backend
- Deliver actionable recommendations via AI
- Store critical info securely using Sui Move
- Build MVP demo in VS Code with clear, working flows
