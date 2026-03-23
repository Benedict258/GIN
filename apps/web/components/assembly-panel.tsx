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
  const { isConnected, handleConnect, walletAddress } = useConnection();
  const { assembly, loading } = useSmartObject();
  const suiNetwork = process.env.NEXT_PUBLIC_SUI_NETWORK ?? "testnet";
  const proofLinks = [
    {
      label: "Artifact publish",
      digest: "7vbtxP43cakqQc53GiSmbkJqEPhPUzPHVcG5SRqsWuVi"
    },
    {
      label: "Contributor credits",
      digest: "8FHAowCHvbjcrBFK7ByEv9P2zb6FETzRsN74fdT4AxtC"
    }
  ];

  const buildExplorerUrl = (digest: string) =>
    `https://explorer.sui.io/transaction/${digest}?network=${suiNetwork}`;

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
          <strong>{isConnected ? walletAddress ?? "Connected" : "Not connected"}</strong>
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
      <section className="status-card">
        <p>Recent on-chain proofs</p>
        <ul className="info-list">
          {proofLinks.map((proof) => (
            <li key={proof.digest}>
              <span>{proof.label}</span>
              <a href={buildExplorerUrl(proof.digest)} target="_blank" rel="noreferrer">
                Verify on Sui Explorer
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
