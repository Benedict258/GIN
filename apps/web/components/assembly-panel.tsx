"use client";

import { useConnection, useSmartObject } from "@evefrontier/dapp-kit";
import { useSearchParams } from "next/navigation";

function resolveTenant(tenant: string | null) {
  return tenant ?? process.env.NEXT_PUBLIC_EVE_FRONTIER_TENANT ?? "utopia";
}

function resolveItemId(itemId: string | null) {
  return itemId ?? process.env.NEXT_PUBLIC_EVE_FRONTIER_ITEM_ID ?? null;
}

export function AssemblyPanel() {
  const searchParams = useSearchParams();
  const tenant = resolveTenant(searchParams.get("tenant"));
  const itemId = resolveItemId(searchParams.get("itemId"));
  const { isConnected, handleConnect } = useConnection();
  const { assembly, loading } = useSmartObject();

  return (
    <article className="panel">
      <p className="panel-label">EVE Frontier dApp Kit</p>
      <h2>Assembly Context</h2>
      <p className="lede-tight">
        GIN is now wired to EVE Frontier dApp Kit so wallet connection and
        assembly-aware UI can be expanded from the real ecosystem hooks instead
        of a generic web-only shell.
      </p>

      <div className="info-list">
        <div>
          <span>Tenant</span>
          <strong>{tenant}</strong>
        </div>
        <div>
          <span>Item ID</span>
          <strong>{itemId ?? "Provide ?itemId=... to load an assembly"}</strong>
        </div>
        <div>
          <span>Wallet</span>
          <strong>{isConnected ? "Connected" : "Not connected"}</strong>
        </div>
      </div>

      {!isConnected ? (
        <button className="action-button" onClick={handleConnect} type="button">
          Connect with EVE Vault
        </button>
      ) : null}

      {loading ? <p className="status">Loading assembly data...</p> : null}
      {!loading && assembly ? (
        <div className="status-card">
          <p>Assembly loaded from dApp Kit context.</p>
          <strong>{assembly.name ?? "Unnamed assembly"}</strong>
        </div>
      ) : null}
      {!loading && !assembly && itemId ? (
        <p className="status">
          No assembly payload is available yet for the current item context.
        </p>
      ) : null}
    </article>
  );
}
