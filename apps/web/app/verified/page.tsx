import { fetchRecentReports, fetchSectorIntel } from "../../lib/api";

export const dynamic = "force-dynamic";

export default async function VerifiedPage() {
  const [sectors, reports] = await Promise.all([
    fetchSectorIntel().catch(() => []),
    fetchRecentReports().catch(() => [])
  ]);

  const verifiedSectors =
    sectors.length > 0
      ? sectors.filter((sector) => sector.verificationState === "verified")
      : [
          {
            location: "Jegou Relay",
            threatScore: 82,
            opportunityScore: 39,
            confidenceScore: 79,
            verificationState: "verified",
            topSignals: ["enemy_sighting", "trade_signal"],
            updatedAt: new Date().toISOString()
          }
        ];
  const pendingReports =
    reports.length > 0
      ? reports.filter((report) => report.verificationState !== "verified").slice(0, 6)
      : [
          {
            id: "pending-lp-5464",
            location: "L-Point 5464",
            summary: "Resource cluster detected near relay staging grid. Builder foam available at gate site.",
            signalType: "resource_cluster",
            confidenceScore: 66,
            verificationState: "emerging"
          },
          {
            id: "pending-portal-utopia",
            location: "Utopia Prime",
            summary: "Portal to secondary solar node active; traffic spike noted by multiple scouts.",
            signalType: "jump_activity",
            confidenceScore: 61,
            verificationState: "emerging"
          },
          {
            id: "pending-hostile-ikora",
            location: "Ikora Corridor",
            summary: "High threat level flagged after repeated hostile pings on convoy path.",
            signalType: "enemy_sighting",
            confidenceScore: 72,
            verificationState: "contested"
          }
        ];

  return (
    <div className="content-grid">
      <section className="panel panel-wide">
        <p className="panel-label">Verification Pipeline</p>
        <h2>Trusted Intel Board</h2>
        <p className="lede-tight">
          GIN only elevates verified intelligence. Pending submissions remain under review until multiple sources
          confirm them.
        </p>
      </section>

      <section className="panel">
        <p className="panel-label">Under Review</p>
        <h2>Pending Signals</h2>
        {pendingReports.length ? (
          <ul className="assistant-thread">
            {pendingReports.map((report) => (
              <li key={report.id}>
                <strong>{report.location}</strong>
                <p className="status">{report.summary}</p>
                <p className="status-small">
                  {report.signalType.replace(/_/g, " ")} - Confidence {report.confidenceScore}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="status">No pending reports right now.</p>
        )}
      </section>

      <section className="panel panel-wide">
        <p className="panel-label">Verified Intel</p>
        <h2>Operationally Cleared</h2>
        {verifiedSectors.length ? (
          <ul className="sector-list">
            {verifiedSectors.map((sector) => (
              <li key={sector.location}>
                <div>
                  <strong>{sector.location}</strong>
                  <span>verified</span>
                </div>
                <div className="scores">
                  <span>Threat {sector.threatScore}</span>
                  <span>Opportunity {sector.opportunityScore}</span>
                  <span>Confidence {sector.confidenceScore}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="status">No verified sectors yet. Submit intel to trigger validation.</p>
        )}
      </section>
    </div>
  );
}
