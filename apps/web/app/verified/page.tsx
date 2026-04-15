import { fetchRecentReports, fetchSectorIntel } from "../../lib/api";
import { PendingReportsPanel } from "../../components/pending-reports-panel";

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
            location: "6RG-Y-T4",
            threatScore: 84,
            opportunityScore: 38,
            confidenceScore: 81,
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
            id: "pending-lp-456",
            location: "L6M-Y-M4",
            summary: "Resource cluster detected at L-Point 456. Builder foam available at the relay cache.",
            signalType: "resource_cluster",
            confidenceScore: 66,
            verificationState: "emerging"
          },
          {
            id: "pending-portal-mno",
            location: "MNO-Y-05",
            summary: "Portal to secondary solar route active; traffic spike noted by multiple scouts.",
            signalType: "jump_activity",
            confidenceScore: 61,
            verificationState: "emerging"
          },
          {
            id: "pending-hostile-ikora",
            location: "6RG-Y-T4",
            summary: "High threat level flagged after repeated hostile pings near Moon P4.",
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

      <PendingReportsPanel initialReports={pendingReports} />

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
