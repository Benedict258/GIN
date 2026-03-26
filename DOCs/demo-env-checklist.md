# Demo Environment Checklist

Track these variables before switching between sandbox and production tenants. Run through the list before every demo reset.

## Wallet & Frontier Context

- `NEXT_PUBLIC_EVE_FRONTIER_TENANT`: frontier tenant slug (e.g., `utopia` for sandbox).
- `NEXT_PUBLIC_EVE_FRONTIER_ITEM_ID`: assembly/item identifier to hydrate smart-object context.
- `NEXT_PUBLIC_SUI_NETWORK`: `testnet`, `devnet`, or `mainnet` for explorer links.
- `GIN_DISABLE_ONCHAIN`: set to `true` to skip Move calls during the demo if Sui is flaky.
- `GIN_DISABLE_WALRUS`: set to `true` to bypass Walrus uploads while keeping the dashboard live.

## API / Supabase

- `GIN_API_URL` / `NEXT_PUBLIC_GIN_API_URL`: point both to the same Fastify base URL to avoid mixed environments.
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`: ensure they reference the _demo_ project when rehearsing.
- `GIN_DEPLOY_VERSION`: optional string that surfaces in `/status` for sanity checks.

### Quick Sanity Script

```bash
# run from repo root before demo
cat <<'ENV'
NEXT_PUBLIC_EVE_FRONTIER_TENANT=$NEXT_PUBLIC_EVE_FRONTIER_TENANT
NEXT_PUBLIC_EVE_FRONTIER_ITEM_ID=$NEXT_PUBLIC_EVE_FRONTIER_ITEM_ID
NEXT_PUBLIC_SUI_NETWORK=$NEXT_PUBLIC_SUI_NETWORK
GIN_API_URL=$GIN_API_URL
NEXT_PUBLIC_GIN_API_URL=$NEXT_PUBLIC_GIN_API_URL
SUPABASE_URL=$SUPABASE_URL
ENV
```

Use the output to double-check the container and the local dev server are aligned.
