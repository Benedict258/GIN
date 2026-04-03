"use client";

import { useConnection } from "@evefrontier/dapp-kit/hooks";
import { useProfile } from "../hooks/useProfile";

interface LockedPanelProps {
  title: string;
  description: string;
  testId?: string;
}

export function LockedPanel({ title, description, testId }: LockedPanelProps) {
  const { status, accessStatus } = useProfile();
  const { isConnected, handleConnect } = useConnection();

  const currentTier = accessStatus?.tier.displayName ?? (status === "connected" ? "Guest" : "Public");
  const nextTierName = accessStatus?.nextTier?.displayName;
  const lifetimeCredits = accessStatus?.contributor?.lifetimeCredits ?? 0;
  const nextTierCredits = accessStatus?.nextTier?.minCredits ?? null;
  const creditsNeeded =
    typeof nextTierCredits === "number" ? Math.max(0, nextTierCredits - lifetimeCredits) : undefined;

  const requirement =
    status !== "connected"
      ? "Connect your contributor wallet through EVE Frontier to sync progress."
      : nextTierName && creditsNeeded !== undefined
        ? `${creditsNeeded} credits unlock ${nextTierName}.`
        : "Earn additional credits to advance your tier.";

  return (
    <article className="panel" data-testid={testId}>
      <p className="panel-label">{title}</p>
      <div className="locked-panel-card">
        <p>{description}</p>
        <p className="status-small">Current tier: {currentTier}</p>
        <p className="status-small">{requirement}</p>
        {!isConnected ? (
          <button className="action-button" type="button" onClick={handleConnect}>
            Connect with EVE Vault
          </button>
        ) : null}
      </div>
    </article>
  );
}
