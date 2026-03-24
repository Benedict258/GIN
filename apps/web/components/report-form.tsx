"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import type { CreateReportInput, ContributorProfile } from "@gin/shared";
import { submitReport } from "../lib/api";
import { useProfile } from "../hooks/useProfile";
import type { ProfileStatus as ProfileStatusType } from "../context/profile-context";

const defaultPayload: CreateReportInput = {
  reporterId: "demo-profile",
  location: "sector-alpha",
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
  const reporterId = profileState.profileContext?.profile.id ?? payload.reporterId;

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

    startTransition(async () => {
      try {
        await submitReport(payload);
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

        <button className="action-button" type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit report"}
        </button>
      </form>

        <ProfileStatus
          status={profileState.status}
          walletAddress={profileState.walletAddress}
          credits={profileState.profileContext?.contributor.creditsBalance}
        />

        {profileState.profileContext ? (
          <ContributorSummary contributor={profileState.profileContext.contributor} />
        ) : null}

        {status !== "idle" ? (
          <p className={`status ${status === "error" ? "status-error" : "status-success"}`}>{message}</p>
        ) : null}
    </article>
  );
}

  function ProfileStatus({
    status,
    walletAddress,
    credits
  }: {
    status: ProfileStatusType;
    walletAddress?: string;
    credits?: number;
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
        Linked wallet {walletAddress ?? "(unknown)"}. Credits: <strong>{credits ?? 0}</strong>
      </p>
    );
  }

  function ContributorSummary({ contributor }: { contributor: ContributorProfile }) {
    return (
      <div className="status-card contributor-card">
        <p className="panel-label">Contributor Stats</p>
        <p className="metric">
          Credits <strong>{contributor.creditsBalance}</strong>
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
