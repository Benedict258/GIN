import type { Report } from "@gin/shared";

const COMPONENT_LABELS = {
  base: "Base Signal",
  consensus: "Consensus",
  recency: "Recency",
  reputation: "Reputation",
  diversity: "Diversity"
} as const;

type ComponentKey = keyof typeof COMPONENT_LABELS;

export function RecentReportsPanel({ reports }: { reports: Report[] }) {
  const topReports = reports.slice(0, 3);

  return (
    <article className="panel">
      <p className="panel-label">Trust Monitor · Utopia compatible</p>
      <h2>Verification Signals</h2>
      <p className="lede-tight">
        This layout mirrors the compact view we will surface when the mod is running in the Utopia test
        shard, so assembly HUD real estate stays predictable.
      </p>

      {topReports.length === 0 ? (
        <p className="status">Submit reports to populate the trust stream.</p>
      ) : (
        <ul className="sector-list">
          {topReports.map((report) => (
            <li key={report.id}>
              <div>
                <strong>{report.location}</strong>
                <span>
                  {report.signalType} · {report.verificationState}
                </span>
              </div>
              <div className="scores">
                <span>Confidence {report.confidenceScore}</span>
                <span>Sources {report.sourceCount}</span>
                <span>Unique {report.uniqueSources}</span>
                <span>Factions {report.uniqueFactions}</span>
              </div>
              <p className="status">
                Latest update {new Date(report.createdAt).toLocaleString()} · Hash {report.dedupeHash.slice(0, 10)}…
              </p>
              <div className="info-list">
                {Object.keys(COMPONENT_LABELS).map((key) => (
                  <div key={key}>
                    <span>{COMPONENT_LABELS[key as ComponentKey]}</span>
                    <strong>{report.confidenceComponents[key as ComponentKey]}%</strong>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
