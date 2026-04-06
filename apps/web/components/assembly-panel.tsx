"use client";

import { useConnection, useSmartObject } from "@evefrontier/dapp-kit/hooks";
import { useState, useTransition } from "react";
import { useDAppKit } from "@mysten/dapp-kit-react";
import { Transaction } from "@mysten/sui/transactions";
import { useSearchParams } from "next/navigation";

function resolveTenant(tenant: string | null) {
  return tenant ?? process.env.NEXT_PUBLIC_EVE_FRONTIER_TENANT ?? "utopia";
}

function firstNonEmpty(...values: Array<string | null | undefined>) {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  return "";
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
  const dAppKit = useDAppKit();
  const [metadataName, setMetadataName] = useState("GIN STORAGE");
  const [metadataDescription, setMetadataDescription] = useState("");
  const [metadataUrl, setMetadataUrl] = useState("");
  const [metadataStatus, setMetadataStatus] = useState<"idle" | "success" | "error">("idle");
  const [metadataMessage, setMetadataMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [onlineStatus, setOnlineStatus] = useState<"idle" | "success" | "error">("idle");
  const [onlineMessage, setOnlineMessage] = useState("");
  const [extensionStatus, setExtensionStatus] = useState<"idle" | "success" | "error">("idle");
  const [extensionMessage, setExtensionMessage] = useState("");
  const suiNetwork = process.env.NEXT_PUBLIC_SUI_NETWORK ?? "testnet";
  const storageUnitPackageId =
    process.env.NEXT_PUBLIC_SSU_PACKAGE_ID ?? "0xd12a70c74c1e759445d6f209b01d43d860e97fcf2ef72ccbbd00afd828043f75";
  const storageUnitObjectId =
    process.env.NEXT_PUBLIC_EVE_FRONTIER_ITEM_ID ??
    "0x1a817e321488ad8dc9287d2116f9e3172954f08e4863f6fbf84d869145b57bf7";
  const storageUnitSharedVersion =
    process.env.NEXT_PUBLIC_SSU_SHARED_VERSION ?? "812145617";
  const ownerCapId =
    process.env.NEXT_PUBLIC_SSU_OWNER_CAP_ID ?? "0x51c516e386590706377c0501c47630f132a8e924a2412536780509e1f02572ac";
  const characterSharedObjectId =
    process.env.NEXT_PUBLIC_SSU_CHARACTER_SHARED_ID ?? "0xd2f0c90cb501a6a67e32c1732d1074d891c3a952455111864301deaf3d698f85";
  const characterInitialVersion =
    process.env.NEXT_PUBLIC_SSU_CHARACTER_SHARED_VERSION ?? "810067465";
  const networkNodeId = firstNonEmpty(
    process.env.NEXT_PUBLIC_GIN_NETWORK_NODE_ID,
    process.env.GIN_NETWORK_NODE_ID
  );
  const energyConfigId = firstNonEmpty(
    process.env.NEXT_PUBLIC_EVE_FRONTIER_ENERGY_CONFIG_ID,
    process.env.EVE_FRONTIER_ENERGY_CONFIG_ID
  );
  const extensionAuthType = process.env.NEXT_PUBLIC_SSU_EXTENSION_AUTH_TYPE ?? "";
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

  async function handleMetadataUpdate() {
    setMetadataStatus("idle");
    setMetadataMessage("");

    if (!isConnected) {
      setMetadataStatus("error");
      setMetadataMessage("Connect EVE Vault before updating the storage metadata.");
      return;
    }

    startTransition(async () => {
      try {
        const tx = new Transaction();
        const sharedCharacter = tx.sharedObjectRef({
          objectId: characterSharedObjectId,
          initialSharedVersion: Number(characterInitialVersion),
          mutable: true
        });
        const ownerCap = tx.object(ownerCapId);

        const borrowedCap = tx.moveCall({
          target: `${storageUnitPackageId}::character::borrow_owner_cap`,
          typeArguments: [`${storageUnitPackageId}::storage_unit::StorageUnit`],
          arguments: [sharedCharacter, ownerCap]
        });

        const storageUnitShared = tx.sharedObjectRef({
          objectId: storageUnitObjectId,
          initialSharedVersion: Number(characterInitialVersion),
          mutable: true
        });

        tx.moveCall({
          target: `${storageUnitPackageId}::storage_unit::update_metadata_name`,
          arguments: [storageUnitShared, borrowedCap, tx.pure.string(metadataName.trim())]
        });

        tx.moveCall({
          target: `${storageUnitPackageId}::storage_unit::update_metadata_description`,
          arguments: [storageUnitShared, borrowedCap, tx.pure.string(metadataDescription.trim())]
        });

        tx.moveCall({
          target: `${storageUnitPackageId}::storage_unit::update_metadata_url`,
          arguments: [storageUnitShared, borrowedCap, tx.pure.string(metadataUrl.trim())]
        });

        tx.moveCall({
          target: `${storageUnitPackageId}::character::return_owner_cap`,
          typeArguments: [`${storageUnitPackageId}::storage_unit::StorageUnit`],
          arguments: [sharedCharacter, borrowedCap, ownerCap]
        });

        await dAppKit.signAndExecuteTransaction({ transaction: tx });
        setMetadataStatus("success");
        setMetadataMessage("Storage metadata updated on-chain.");
      } catch (error) {
        setMetadataStatus("error");
        setMetadataMessage(error instanceof Error ? error.message : "Failed to update metadata");
      }
    });
  }

  async function handleBringOnline() {
    setOnlineStatus("idle");
    setOnlineMessage("");

    if (!isConnected) {
      setOnlineStatus("error");
      setOnlineMessage("Connect EVE Vault before bringing the storage unit online.");
      return;
    }

    if (!networkNodeId) {
      setOnlineStatus("error");
      setOnlineMessage("GIN network node ID is not configured.");
      return;
    }

    if (!energyConfigId) {
      setOnlineStatus("error");
      setOnlineMessage("EVE Frontier energy config ID is not configured.");
      return;
    }

    startTransition(async () => {
      try {
        const tx = new Transaction();
        const sharedCharacter = tx.sharedObjectRef({
          objectId: characterSharedObjectId,
          initialSharedVersion: Number(characterInitialVersion),
          mutable: true
        });
        const ownerCap = tx.object(ownerCapId);

        const borrowedCap = tx.moveCall({
          target: `${storageUnitPackageId}::character::borrow_owner_cap`,
          typeArguments: [`${storageUnitPackageId}::assembly::Assembly`],
          arguments: [sharedCharacter, ownerCap]
        });

        const storageUnitShared = tx.sharedObjectRef({
          objectId: storageUnitObjectId,
          initialSharedVersion: Number(storageUnitSharedVersion),
          mutable: true
        });

        tx.moveCall({
          target: `${storageUnitPackageId}::assembly::online`,
          arguments: [
            storageUnitShared,
            tx.object(networkNodeId),
            tx.object(energyConfigId),
            borrowedCap
          ]
        });

        tx.moveCall({
          target: `${storageUnitPackageId}::character::return_owner_cap`,
          typeArguments: [`${storageUnitPackageId}::assembly::Assembly`],
          arguments: [sharedCharacter, borrowedCap, ownerCap]
        });

        await dAppKit.signAndExecuteTransaction({ transaction: tx });
        setOnlineStatus("success");
        setOnlineMessage("Storage unit is now online.");
      } catch (error) {
        setOnlineStatus("error");
        setOnlineMessage(error instanceof Error ? error.message : "Failed to bring storage unit online");
      }
    });
  }

  async function handleAuthorizeExtension() {
    setExtensionStatus("idle");
    setExtensionMessage("");

    if (!extensionAuthType) {
      setExtensionStatus("error");
      setExtensionMessage("Extension auth type not configured.");
      return;
    }

    if (!isConnected) {
      setExtensionStatus("error");
      setExtensionMessage("Connect EVE Vault before authorizing the extension.");
      return;
    }

    startTransition(async () => {
      try {
        const tx = new Transaction();
        const sharedCharacter = tx.sharedObjectRef({
          objectId: characterSharedObjectId,
          initialSharedVersion: Number(characterInitialVersion),
          mutable: true
        });
        const ownerCap = tx.object(ownerCapId);

        const borrowedCap = tx.moveCall({
          target: `${storageUnitPackageId}::character::borrow_owner_cap`,
          typeArguments: [`${storageUnitPackageId}::storage_unit::StorageUnit`],
          arguments: [sharedCharacter, ownerCap]
        });

        const storageUnitShared = tx.sharedObjectRef({
          objectId: storageUnitObjectId,
          initialSharedVersion: Number(storageUnitSharedVersion),
          mutable: true
        });

        tx.moveCall({
          target: `${storageUnitPackageId}::storage_unit::authorize_extension`,
          typeArguments: [extensionAuthType],
          arguments: [storageUnitShared, borrowedCap]
        });

        tx.moveCall({
          target: `${storageUnitPackageId}::character::return_owner_cap`,
          typeArguments: [`${storageUnitPackageId}::storage_unit::StorageUnit`],
          arguments: [sharedCharacter, borrowedCap, ownerCap]
        });

        await dAppKit.signAndExecuteTransaction({ transaction: tx });
        setExtensionStatus("success");
        setExtensionMessage("Storage unit extension authorized.");
      } catch (error) {
        setExtensionStatus("error");
        setExtensionMessage(error instanceof Error ? error.message : "Failed to authorize extension");
      }
    });
  }

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
        <p>Assembly Power</p>
        <p className="status">Bring the SSU online using the network node and energy config.</p>
        <button className="action-button" type="button" onClick={handleBringOnline} disabled={isPending}>
          {isPending ? "Bringing online..." : "Bring SSU Online"}
        </button>
        {onlineStatus !== "idle" ? (
          <p className={`status ${onlineStatus === "error" ? "status-error" : "status-success"}`}>{onlineMessage}</p>
        ) : null}
      </section>
      <section className="status-card">
        <p>Extension Authorization</p>
        <p className="status">Authorize a storage unit extension once you have the Auth witness type.</p>
        <button className="action-button" type="button" onClick={handleAuthorizeExtension} disabled={isPending}>
          {isPending ? "Authorizing..." : "Authorize Extension"}
        </button>
        {extensionStatus !== "idle" ? (
          <p className={`status ${extensionStatus === "error" ? "status-error" : "status-success"}`}>{extensionMessage}</p>
        ) : null}
      </section>
      <section className="status-card">
        <p>SSU Metadata Controls</p>
        <div className="form-grid">
          <label className="field-group">
            <span>Name</span>
            <input value={metadataName} onChange={(event) => setMetadataName(event.target.value)} />
          </label>
          <label className="field-group">
            <span>Description</span>
            <input value={metadataDescription} onChange={(event) => setMetadataDescription(event.target.value)} />
          </label>
          <label className="field-group field-full">
            <span>URL</span>
            <input value={metadataUrl} onChange={(event) => setMetadataUrl(event.target.value)} />
          </label>
          <button className="action-button" type="button" onClick={handleMetadataUpdate} disabled={isPending}>
            {isPending ? "Updating..." : "Update SSU Metadata"}
          </button>
        </div>
        {metadataStatus !== "idle" ? (
          <p className={`status ${metadataStatus === "error" ? "status-error" : "status-success"}`}>{metadataMessage}</p>
        ) : null}
      </section>
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
