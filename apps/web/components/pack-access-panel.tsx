"use client";

import { useMemo } from "react";
import { useSmartObject } from "@evefrontier/dapp-kit";
import { useProfile } from "../hooks/useProfile";
import { extractPanelPrivileges } from "../lib/access";

const PANEL_LIBRARY = [
  { key: "reports", label: "Report Feed" },
  { key: "sectors", label: "Sector Intel" },
  { key: "routes", label: "Corridor Intel" },
  { key: "factions", label: "Pack Intelligence" },
  { key: "snapshots", label: "Advisor Snapshots" }
];

export function PackAccessPanel() {
  const { status, accessStatus } = useProfile();
  const { assembly } = useSmartObject();
  const unlockedPanels = useMemo(() => new Set(extractPanelPrivileges(accessStatus?.tier.privileges)), [accessStatus]);
  const nextTier = accessStatus?.nextTier ?? null;
  const lifetimeCredits = accessStatus?.contributor?.lifetimeCredits ?? 0;
  const creditsUntilNext = nextTier ? Math.max(0, nextTier.minCredits - lifetimeCredits) : 0;
  const tierName = accessStatus?.tier.displayName ?? (status === "connected" ? "Guest Observer" : "Public");
  const assemblyName = assembly?.name ?? "No assembly selected";
  const assemblyOwner = typeof assembly?.owner === "string" ? assembly.owner : undefined;

  return (
    <article className="panel">
      <p className="panel-label">Shared Pack View</p>
      <h2>Access Status</h2>
      <p className="status">
        {status === "connected"
          ? `Current tier: ${tierName}`
          : "Connect your EVE Vault wallet to sync contributor status."}
      </p>
      <p className="status-small">Assembly context: {assemblyName}</p>
      {assemblyOwner ? <p className="status-small">Assembly owner: {assemblyOwner}</p> : null}
      <p className="status">
        {nextTier
          ? `${creditsUntilNext} credits until ${nextTier.displayName}`
          : "Advisor tier unlocked. You can see the full corpus."}
      </p>
      <ul className="access-grid">
        {PANEL_LIBRARY.map((panel) => {
          const unlocked = unlockedPanels.has(panel.key);
          return (
            <li key={panel.key} className={`access-chip ${unlocked ? "unlocked" : "locked"}`}>
              <span>{panel.label}</span>
              <small>{unlocked ? "Unlocked" : "Locked"}</small>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
