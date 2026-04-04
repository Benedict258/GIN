"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import { useSmartObject } from "@evefrontier/dapp-kit/hooks";
import type { AccessStatusResponse, CreateReportInput, ContributorProfile, CreditEvent } from "@gin/shared";
import { submitReport } from "../lib/api";
import { useProfile } from "../hooks/useProfile";
import type { ProfileStatus as ProfileStatusType } from "../context/profile-context";

const defaultPayload: CreateReportInput = {
  reporterId: "",
  location: "6RG-Y-T4",
  signalType: "enemy_sighting",
  summary: "",
  source: "player",
  intensity: 60,
  importanceScore: 50,
  metadata: {}
};

export function ReportForm() {
  const [payload, setPayload] = useState<CreateReportInput>(defaultPayload);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const profileState = useProfile();
  const { assembly, assemblyOwner, tenant } = useSmartObject();
  const accessStatus = profileState.accessStatus;
  const ledgerEvents = profileState.ledger ?? [];
  const reporterId = profileState.profileContext?.profile.id ?? payload.reporterId;
  const profileMode = profileState.profileContext?.profile.handle === "utopia-scout" ? "Local" : "Live";
  const canSubmit = Boolean(profileState.profileContext?.profile.id);
  const isLocalFallback = profileState.profileContext?.profile.id.startsWith("profile-") ?? false;

  useEffect(() => {
    if (profileState.profileContext?.profile.id) {
      setPayload((prev) => ({ ...prev, reporterId: profileState.profileContext?.profile.id ?? prev.reporterId }));
    }
  }, [profileState.profileContext?.profile.id]);

  function update<K extends keyof CreateReportInput>(key: K, value: CreateReportInput[K]) {
    setPayload((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setPayload((prev) => ({ ...defaultPayload, reporterId: prev.reporterId, factionTag: prev.factionTag }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("idle");
    setMessage("");

    if (!canSubmit) {
      setStatus("error");
      setMessage("Connect your EVE Vault wallet before submitting a report.");
      return;
    }

    if (isLocalFallback) {
      setStatus("success");
      setMessage("Report queued for verification.");
      resetForm();
      return;
    }

    startTransition(async () => {
      try {
        const enrichedPayload: CreateReportInput = {
          ...payload,
          metadata: {
            ...(payload.metadata ?? {}),
            assemblyContext: assembly
              ? {
                  name: assembly.name ?? null,
                  objectId: (assembly as { id?: string; objectId?: string }).id ?? (assembly as { objectId?: string }).objectId ?? null,
                  type: (assembly as { type?: string; assemblyType?: string }).type ?? (assembly as { assemblyType?: string }).assemblyType ?? null,
                  tenant: tenant ?? null
                }
              : null,
            playerContext: assemblyOwner
              ? {
                  name: (assemblyOwner as { name?: string }).name ?? null,
                  role: (assemblyOwner as { role?: string }).role ?? null,
                  faction: (assemblyOwner as { faction?: string }).faction ?? null,
                  pack: (assemblyOwner as { pack?: string }).pack ?? null,
                  tags: (assemblyOwner as { tags?: string[] }).tags ?? null
                }
              : null
          }
        };

        await submitReport(enrichedPayload, profileState.walletAddress);
        setStatus("success");
        setMessage("Report submitted to GIN core intelligence.");
        resetForm();
        void profileState.refresh();
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Failed to send report");
      }
    });
  }

  return ( 
    <article className="panel panel-wide">
      <p className="panel-label">Contribute Intelligence</p>
      <h2>Send a field report</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="field-group">
          <span>Reporter ID</span>
          <input
            type="text"
            value={reporterId}
            onChange={(event) => update("reporterId", event.target.value)}
            required
            readOnly={Boolean(profileState.profileContext?.profile.id)}
          />
        </label>

        <label className="field-group">
          <span>Location</span>
          <input
            type="text"
            value={payload.location}
            onChange={(event) => update("location", event.target.value)}
            required
          />
        </label>

        <label className="field-group">
          <span>Signal Type</span>
          <select
            value={payload.signalType}
            onChange={(event) => update("signalType", event.target.value as CreateReportInput["signalType"])}
          >
            <option value="enemy_sighting">Enemy sighting</option>
            <option value="resource_cluster">Resource cluster</option>
            <option value="safe_route">Safe route</option>
            <option value="jump_activity">Jump activity</option>
            <option value="trade_signal">Trade signal</option>
            <option value="manual_report">Manual report</option>
          </select>
        </label>

        <label className="field-group">
          <span>Source</span>
          <select
            value={payload.source}
            onChange={(event) => update("source", event.target.value as CreateReportInput["source"])}
          >
            <option value="player">Player</option>
            <option value="system">System</option>
            <option value="world_event">World event</option>
            <option value="knowledge_base">Knowledge base</option>
          </select>
        </label>

        <label className="field-group">
          <span>Faction / Pack (optional)</span>
          <input
            type="text"
            value={payload.factionTag ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              update("factionTag", value.length ? value : undefined);
            }}
            placeholder="utopia-pack-01"
          />
        </label>

        <label className="field-group field-full">
          <span>Summary</span>
          <textarea
            value={payload.summary}
            onChange={(event) => update("summary", event.target.value)}
            rows={3}
            required
          />
        </label>

        <label className="field-group">
          <span>Intensity ({payload.intensity})</span>
          <input
            type="range"
            min={1}
            max={100}
            value={payload.intensity}
            onChange={(event) => update("intensity", Number(event.target.value))}
          />
        </label>

        <label className="field-group">
          <span>Importance ({payload.importanceScore})</span>
          <input
            type="range"
            min={1}
            max={100}
            value={payload.importanceScore}
            onChange={(event) => update("importanceScore", Number(event.target.value))}
          />
        </label>

        <button className="action-button submit-action" type="submit" disabled={!canSubmit || isPending}>
          {isPending ? "Submitting..." : canSubmit ? "Submit report" : "Connect wallet to submit"}
        </button>
      </form>

        <ProfileStatus
          status={profileState.status}
          walletAddress={profileState.walletAddress}
          credits={profileState.profileContext?.contributor.creditsBalance}
          tierName={accessStatus?.tier.displayName}
          profileMode={profileMode}
        />

        {profileState.profileContext ? (
          <ContributorSummary
            contributor={profileState.profileContext.contributor}
            accessStatus={accessStatus}
          />
        ) : null}

        <CreditsLedger events={ledgerEvents} isConnected={profileState.status === "connected"} />

        {status !== "idle" ? (
          <p className={`status ${status === "error" ? "status-error" : "status-success"}`}>{message}</p>
        ) : null}
    </article>
  );
}

function ProfileStatus({
  status,
  walletAddress,
  credits,
  tierName,
  profileMode
}: {
  status: ProfileStatusType;
  walletAddress?: string;
  credits?: number;
  tierName?: string;
  profileMode: "Local" | "Live";
}) {
    if (status === "idle") {
      return <p className="status">Connect your wallet to earn contributor credit automatically.</p>;
    }

    if (status === "connecting") {
      return <p className="status">Linking wallet {walletAddress ?? ""}...</p>;
    }

    if (status === "error") {
      return <p className="status status-error">Wallet link failed. Retry connection.</p>;
    }

    return (
      <p className="status status-success">
        Linked wallet {walletAddress ?? "(unknown)"} ({profileMode}). Tier {tierName ?? "Guest"}. Credits:{" "}
        <strong>{credits ?? 0}</strong>
      </p>
    );
  }

function ContributorSummary({
    contributor,
    accessStatus
  }: {
    contributor: ContributorProfile;
    accessStatus?: AccessStatusResponse;
  }) {
    const tierName = accessStatus?.tier.displayName ?? "Guest Observer";
    const nextTier = accessStatus?.nextTier;
    const lifetimeCredits = contributor.lifetimeCredits;
    const progress = contributor.tierProgress ?? 0;
    const creditsToNext = nextTier ? Math.max(0, nextTier.minCredits - lifetimeCredits) : 0;

    return (
      <div className="status-card contributor-card">
        <p className="panel-label">Contributor Stats</p>
        <p className="metric">
          Current tier <strong>{tierName}</strong>
        </p>
        <p className="status">
          Balance <strong>{contributor.creditsBalance}</strong> - Lifetime {lifetimeCredits}
        </p>
        <div className="tier-meter" aria-label="Tier progress">
          <span style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
        </div>
        <p className="status">
          {nextTier
            ? `${creditsToNext} credits until ${nextTier.displayName}`
            : "Advisor tier unlocked. Keep shipping intel."}
        </p>
        <p className="status">
          Reports submitted <strong>{contributor.contributionCount}</strong>
        </p>
        {contributor.lastContributionAt ? (
          <p className="status">Last update {new Date(contributor.lastContributionAt).toLocaleString()}</p>
        ) : null}
      </div>
    );
  }

function CreditsLedger({
    events,
    isConnected
  }: {
    events: CreditEvent[];
    isConnected: boolean;
  }) {
    if (!events.length) {
      return (
        <div className="status-card ledger-card">
          <p className="panel-label">Credit Ledger</p>
          <p className="status">
            {isConnected
              ? "Submit reports to populate your ledger events."
              : "Connect to GIN to see contribution history."}
          </p>
        </div>
      );
    }

    return (
      <div className="status-card ledger-card">
        <p className="panel-label">Credit Ledger</p>
        <ul className="ledger-list">
          {events.slice(0, 8).map((event) => (
            <li key={event.id}>
              <div className="ledger-row">
                <strong>{formatEventLabel(event.eventType)}</strong>
                <span className={event.delta >= 0 ? "badge-positive" : "badge-negative"}>
                  {event.delta >= 0 ? `+${event.delta}` : event.delta}
                </span>
              </div>
              <p className="status-small">{new Date(event.createdAt).toLocaleString()}</p>
              <p className="status-small">
                Importance {event.importanceScore} - Usefulness {event.usefulnessScore}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

function formatEventLabel(eventType: CreditEvent["eventType"]) {
    switch (eventType) {
      case "report_confirmed":
        return "Report confirmed";
      case "report_disputed":
        return "Report disputed";
      case "world_data_contributed":
        return "World data";
      case "intel_purchased":
        return "Intel purchase";
      case "manual_adjustment":
        return "Manual adjustment";
      default:
        return "Report submitted";
    }
  }
