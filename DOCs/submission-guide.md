# GIN Demo & Submission Guide

Use this checklist when recording or presenting the final demo.

## 1. Environment Prep

1. Run `pnpm install` at repo root; then `pnpm --filter @gin/web install` to pull Playwright.
2. Export the correct env vars (see `DOCs/demo-env-checklist.md`). For the demo tenant:
   ```bash
   export NEXT_PUBLIC_EVE_FRONTIER_TENANT=utopia
   export NEXT_PUBLIC_EVE_FRONTIER_ITEM_ID=assembly-ikora
   export NEXT_PUBLIC_SUI_NETWORK=testnet
   export GIN_DISABLE_ONCHAIN=true   # flip off if Sui is stable
   ```
3. Start services:
   ```bash
   pnpm --filter @gin/api dev
   pnpm --filter @gin/web dev
   ```
4. Seed Supabase with the demo dataset (run your `supabase reset` helper script once).

## 2. Demo Flow (Ikora Corridor)

1. **Connect** using the in-client EVE Frontier dApp Kit button. Show the hero badge updating with tenant + wallet.
2. **Submit Report** via “Contribute Intelligence” with location `Ikora Corridor`. Watch the Credits panel ledger tick up.
3. **Route Intel**: open Corridor panel (now unlocked) and describe the threat swing.
4. **Advisor Snapshot**: mint a snapshot and open the Walrus proof link.
5. **Pack Access**: highlight the assembly-specific chips and how credits gate Pack intel.
6. **Demo Storyline**: scroll to the Demo Narrative panel and summarize the three beats.

## 3. Recording Tips

- Capture in 1440p windowed mode from inside the Frontier Chromium shell so the dApp Kit wallet is visible.
- Keep narration under 90 seconds; stress “civilization intelligence service” and dual access model.
- If Sui/Walrus are disabled, call out that credits still accrue off-chain and can sync later.

## 4. Submission Artifacts

- **Video:** upload MP4 plus transcript notes.
- **Deck:** include hero screenshot, credits panel, and Walrus explorer link.
- **Repo README:** link to this guide and the demo story.

## 5. Smoke Tests

- Run `pnpm --filter @gin/web test:e2e` to hit the connect → report → ledger happy path.
- Hit `/status` on the API to confirm feature flags before presenting.
