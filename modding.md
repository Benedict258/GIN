# GIN Smart Assembly Modding Checklist

Use this checklist whenever we need to prove GIN is wired into a live EVE Frontier assembly (real or mocked). Each phase builds on the previous one—run them in order so the final demo loads inside the Utopia client and on our external dashboard.

---

## Phase A — Gain Utopia Access
- [ ] Install the EVE Frontier launcher and append `--frontier-test-servers=Utopia` to the shortcut target (or run `open 'EVE Frontier.app/' --args --frontier-test-servers=Utopia` on macOS).
- [ ] Launch the client, pick **Utopia** in the bottom-right dropdown, click **Register**, and complete the form (no verification code is sent; provisioning happens later).
- [ ] Wait for CCP to grant “Founder Access” and confirm you can log in to the Utopia sandbox.
- [ ] Inside the game, locate any anchorable structure we can test against (e.g., Frontier BIOLAB Station, Network Node).

## Phase B — Prepare On-Chain Identity & Power
- [ ] Create (or recover) the Smart Character tied to our Eve Vault wallet; record its Character object ID via GraphQL (`PlayerProfile` → `character_id`).
- [ ] Anchor a Network Node at a Lagrange point; deposit fuel so it generates energy.
- [ ] Anchor at least one programmable Smart Assembly (Storage Unit, Gate, Turret) and bring it online (reserving network energy).

## Phase C — Acquire Assembly Identifiers
- [ ] From the in-game base dApp (press **F** on the assembly) or GraphQL, capture the 64-char Sui object ID for the target assembly.
- [ ] Record the in-game `itemId` (numeric) and the tenant slug (`utopia`, `stillness`, etc.).
- [ ] Set `.env` (or launch URL) with `NEXT_PUBLIC_EVE_FRONTIER_TENANT=<tenant>` and `NEXT_PUBLIC_EVE_FRONTIER_ITEM_ID=<0x...>`.
- [ ] Add the values to our secure vault so other teammates can reuse them.

## Phase D — Wire the Web dApp
- [ ] Confirm `@evefrontier/dapp-kit`, `@tanstack/react-query`, and `@mysten/dapp-kit-react` are installed in `apps/web`.
- [ ] Wrap the app with our patched `EveFrontierProvider` so QueryClient, DAppKitProvider, VaultProvider, SmartObjectProvider, and NotificationProvider are active.
- [ ] Load the dashboard with `?tenant=<tenant>&itemId=<itemId>` and verify `useSmartObject()` resolves the live assembly (no locked fallback, no console errors).
- [ ] Use Eve Vault to connect; ensure the wallet address matches the Smart Character for owner-only actions.

## Phase E — Publish / Extend Contracts
- [ ] Choose the assembly type we are modding (Gate, Storage Unit, Turret) and review its extension pattern in the docs.
- [ ] Scaffold custom Move logic (builder-scaffold or `efctl init`).
- [ ] Implement the hook (e.g., toll gate logic, inventory gating, targeting rules).
- [ ] Run cargo tests locally, then publish to testnet / Utopia using the recorded package IDs.
- [ ] Store the `packageId`, `upgradeCap`, and latest `published-at` in repo notes.

## Phase F — Connect Gameplay Data
- [ ] Supabase: create tables for `telemetry_events`, `guidance_actions`, `threat_signals`, `resource_snapshots`, `assembly_sessions`.
- [ ] Fastify API: add ingestion endpoints (or workers) that capture Utopia telemetry → Supabase.
- [ ] Implement deterministic guardrails (rules engine) for fuel, threat proximity, route risk, etc.
- [ ] Add optional AI tier (lightweight model or external GPT) for narrative tips.

## Phase G — Mock Data Path (for demos before live telemetry)
- [ ] Seed Supabase tables with fixture JSON representing movement, threats, trades, and resource deltas.
- [ ] Provide a CLI script (`npm run mock:telemetry`) that replays fixtures into the API at real-time intervals.
- [ ] Ensure the frontend can switch between `LIVE` and `MOCK` sources via env flag.
- [ ] Validate the dashboard panels react instantly (React Query + WebSocket channel).

## Phase H — In-Game Demo Flow
- [ ] Launch Utopia, fly to the test assembly, press **F** to open its base dApp, and set the custom URL to our deployed dashboard.
- [ ] Connect Eve Vault, confirm Smart Object data matches what we see in the web app.
- [ ] Trigger at least one interaction (edit name, custom Move hook call, or mock telemetry event) and show the response both in-game and on the external dashboard.
- [ ] Capture screenshots / video plus transaction digests for the Phase 10 submission package.

## Phase I — Verification & Docs
- [ ] Record every relevant transaction digest, package ID, and object ID in `DOCs/` (and link to testnet explorer).
- [ ] Update `phase.txt` and `README.md` with current instructions (`npm` commands only).
- [ ] Add this checklist to the submission deck and highlight which boxes were completed for the demo.

_By following this list we can stand up a credible MVP: real assembly identifier, working dApp provider, contract extension, mock or live telemetry flowing through Supabase, and a demonstrable in-game UI._
