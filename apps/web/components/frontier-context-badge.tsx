"use client";

import { useConnection, useSmartObject } from "@evefrontier/dapp-kit";

export function FrontierContextBadge() {
  const { isConnected, walletAddress, handleConnect } = useConnection();
  const { tenant } = useSmartObject();
  const resolvedTenant = tenant?.trim() || process.env.NEXT_PUBLIC_EVE_FRONTIER_TENANT || "utopia";
  const walletLabel = walletAddress ? shorten(walletAddress) : "No wallet linked";

  return (
    <div className="frontier-badge" aria-live="polite">
      <div>
        <span>Connected to Frontier</span>
        <strong>{resolvedTenant}</strong>
      </div>
      <div>
        <span>Wallet</span>
        <strong>{isConnected ? walletLabel : "Not connected"}</strong>
      </div>
      {!isConnected ? (
        <button className="action-button ghost" type="button" onClick={handleConnect}>
          Connect EVE Vault
        </button>
      ) : null}
    </div>
  );
}

function shorten(address: string) {
  if (address.length <= 10) {
    return address;
  }

  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
