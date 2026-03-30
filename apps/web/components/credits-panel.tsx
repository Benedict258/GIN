"use client";

import { useMemo } from "react";
import { useConnection, useSmartObject } from "@evefrontier/dapp-kit";
import { useProfile } from "../hooks/useProfile";

const EVENT_LABELS: Record<string, string> = {
  report_submitted: "Report Submitted",
  report_confirmed: "Report Confirmed",
  report_disputed: "Report Disputed",
  world_data_contributed: "World Data",
  intel_purchased: "Intel Purchased",
  manual_adjustment: "Manual Adjustment"
};

export function CreditsPanel() {
  const { status, accessStatus, ledger, refresh } = useProfile();
  const { isConnected, handleConnect, walletAddress } = useConnection();
  const { assembly } = useSmartObject();

  const tierName = accessStatus?.tier.displayName ?? "Guest Observer";
  const nextTier = accessStatus?.nextTier ?? null;
  const lifetimeCredits = accessStatus?.contributor?.lifetimeCredits ?? 0;
  const tierProgress = accessStatus?.contributor?.tierProgress ?? 0;
  const unlockedPanels = useMemo(() => accessStatus?.tier.privileges?.["panels"], [accessStatus]);
  const ledgerItems = ledger ?? [];

  const nextTierCopy = nextTier
    ? `${Math.max(0, nextTier.minCredits - lifetimeCredits)} credits to reach ${nextTier.displayName}`
    : "Advisor tier unlocked";

  return (
    <article className="panel">
      <p className="panel-label" data-testid="panel-credits-label">
        Contributor Credits
      </p>
      <h2>Reward Ledger</h2>
      <p className="lede-tight">
        Earn credits by submitting verified reports, confirming intel, or importing ecosystem signals. Credits unlock
        new intelligence tiers inside the Frontier client.
      </p>
      <p className="status-small">
        Wallet {walletAddress ? shorten(walletAddress) : "not connected"} · Assembly {assembly?.name ?? "n/a"}
      </p>
      {status === "error" ? (
        <div className="locked-panel-card">
          <p>We couldn't sync your contributor data.</p>
          <p className="status-small">Reconnect your wallet in the EVE Frontier client, then try again.</p>
          <button className="action-button ghost" type="button" onClick={refresh}>
            Retry Sync
          </button>
        </div>
      ) : status !== "connected" ? (
        <div className="locked-panel-card">
          <p>Connect your EVE Vault wallet inside the Frontier client to sync contributor data.</p>
          <p className="status-small">GIN uses the official dApp Kit so the same wallet works on the game client and web.</p>
          {!isConnected ? (
            <button className="action-button" type="button" onClick={handleConnect}>
              Connect with EVE Vault
            </button>
          ) : null}
        </div>
      ) : (
        <>
          <div className="info-list">
            <div>
              <span>Tier</span>
              <strong>{tierName}</strong>
            </div>
            <div>
              <span>Lifetime Credits</span>
              <strong>{lifetimeCredits}</strong>
            </div>
            <div>
              <span>Unlocked Panels</span>
              <strong>{formatPanels(unlockedPanels)}</strong>
            </div>
          </div>

          <div className="tier-meter" aria-label="Tier progress">
            <span style={{ width: `${tierProgress}%` }} />
          </div>
          <p className="status-small">{nextTierCopy}</p>

          <div className="ledger-card">
            <div className="ledger-row">
              <p className="panel-label">Latest Events</p>
              <button className="action-button ghost" type="button" onClick={refresh}>
                Refresh
              </button>
            </div>
            {ledgerItems.length === 0 ? (
              <p className="status">Complete your first report to see credit events.</p>
            ) : (
              <ul className="ledger-list">
                {ledgerItems.map((event) => (
                  <li key={event.id}>
                    <div className="ledger-row">
                      <div>
                        <strong>{EVENT_LABELS[event.eventType] ?? event.eventType}</strong>
                        <p className="status-small">{formatTimestamp(event.createdAt)}</p>
                      </div>
                      <span className={event.delta >= 0 ? "badge-positive" : "badge-negative"}>
                        {event.delta >= 0 ? "+" : ""}
                        {event.delta}
                      </span>
                    </div>
                    {event.metadata && Object.keys(event.metadata).length ? (
                      <p className="status-small">{summarizeMetadata(event.metadata)}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </article>
  );
}

function formatPanels(value: unknown) {
  if (!Array.isArray(value)) {
    return "Limited";
  }

  return value.join(", ");
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function summarizeMetadata(metadata: Record<string, unknown>) {
  const location = typeof metadata.location === "string" ? metadata.location : undefined;
  const signal = typeof metadata.signal_type === "string" ? metadata.signal_type : undefined;

  if (!location && !signal) {
    return "Logged by GIN";
  }

  if (location && signal) {
    return `${signal} @ ${location}`;
  }

  return location ?? signal ?? "Logged by GIN";
}

function shorten(value: string) {
  if (value.length <= 8) {
    return value;
  }

  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}
