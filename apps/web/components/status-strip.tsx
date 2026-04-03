"use client";

import { useConnection, useSmartObject } from "@evefrontier/dapp-kit/hooks";
import { useProfile } from "../hooks/useProfile";

export function StatusStrip() {
  const { isConnected, walletAddress, handleConnect } = useConnection();
  const { tenant } = useSmartObject();
  const { status, accessStatus } = useProfile();

  const tenantLabel = tenant?.trim() || process.env.NEXT_PUBLIC_EVE_FRONTIER_TENANT || "utopia";
  const tierLabel = accessStatus?.tier.displayName ?? "Public";

  return (
    <div className="status-strip">
      <div className="status-item">
        <span>Network</span>
        <strong>{tenantLabel}</strong>
      </div>
      <div className="status-item">
        <span>Tier</span>
        <strong>{status === "connected" ? tierLabel : "Disconnected"}</strong>
      </div>
      <div className="status-item">
        <span>Wallet</span>
        <strong>{isConnected ? shorten(walletAddress ?? "") : "Not connected"}</strong>
      </div>
      {!isConnected ? (
        <button className="action-button ghost" type="button" onClick={handleConnect}>
          Connect Wallet
        </button>
      ) : null}
    </div>
  );
}

function shorten(address: string) {
  if (!address || address.length <= 10) {
    return address || "Not connected";
  }

  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
