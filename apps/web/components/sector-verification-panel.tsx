import type { SectorSummary } from "@gin/shared";

const STATE_PRIORITY: Record<SectorSummary["verificationState"], number> = {
  verified: 0,
  emerging: 1,
  contested: 2,
  unverified: 3,
  stale: 4
};

const STATE_COPY: Record<SectorSummary["verificationState"], string> = {
  verified: "Cleared by multiple trusted sources.",
  emerging: "Signals rising. Watch for confirmation.",
  contested: "Conflicting intel detected.",
  unverified: "Awaiting validation inside the assembly.",
  stale: "Intel aging out of the Utopia window."
};

export function SectorVerificationPanel({ sectors }: { sectors: SectorSummary[] }) {
  if (!sectors.length) {
    return (
      <article className="panel">
        <p className="panel-label">Utopia Assembly HUD</p>
        <h2>Sector Verification Feed</h2>
        <p className="status">Submit reports to populate the HUD stream.</p>
      </article>
    );
  }

  const prioritized = [...sectors]
    .sort((a, b) => (STATE_PRIORITY[a.verificationState] ?? 99) - (STATE_PRIORITY[b.verificationState] ?? 99))
    .slice(0, 4);

  return (
    <article className="panel">
      <p className="panel-label">Utopia Assembly HUD</p>
      <h2>Sector Verification Feed</h2>
      <p className="lede-tight">
        Mirrors the compact overlay rendered in-game so operators immediately see when a corridor flips to
        verified while testing on the Utopia shard.
      </p>
      <ul className="sector-list">
        {prioritized.map((sector) => (
          <li key={sector.location}>
            <div>
              <strong>{sector.location}</strong>
              <span>{sector.verificationState}</span>
            </div>
            <div className="scores">
              <span>Confidence {sector.confidenceScore}</span>
              <span>Threat {sector.threatScore}</span>
              <span>Opportunity {sector.opportunityScore}</span>
            </div>
            <p className="status">
              {STATE_COPY[sector.verificationState]}
              {" · Updated "}
              {formatTimestamp(sector.updatedAt)}
            </p>
            {sector.topSignals.length ? (
              <p className="status">Signals: {sector.topSignals.join(", ")}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </article>
  );
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "recently";
  }

  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  });
}
