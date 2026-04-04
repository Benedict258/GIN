import { fetchNotifications, fetchRecentReports, fetchRecommendations, fetchSectorIntel } from "../../lib/api";
import { AssistantPanel } from "../../components/assistant-panel";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const [sectors, recommendations, recentReports, notificationPayload] = await Promise.all([
    fetchSectorIntel().catch(() => []),
    fetchRecommendations().catch(() => []),
    fetchRecentReports().catch(() => []),
    fetchNotifications().catch(() => ({ notifications: [], worldSignals: [] }))
  ]);

  const liveRecommendation = recommendations[0] ?? {
    title: "Secure L-Point 456 Corridor",
    summary: "Multiple scout reports confirm increased activity near L-Point 456 in L6M-Y-M4.",
    confidenceScore: 78,
    recommendedAction: "Maintain escort detail through L6M-Y-M4 and reroute heavy cargo to the MNO-Y-05 spur.",
    evidence: ["Resource cluster staged at L-Point 456", "Portal activity flagged near MNO-Y-05"]
  };

  const sectorList =
    sectors.length > 0
      ? sectors
      : [
          {
            location: "L6M-Y-M4",
            threatScore: 62,
            opportunityScore: 61,
            confidenceScore: 74,
            verificationState: "emerging",
            topSignals: ["jump_activity", "resource_cluster"],
            updatedAt: new Date().toISOString()
          },
          {
            location: "6RG-Y-T4",
            threatScore: 84,
            opportunityScore: 38,
            confidenceScore: 81,
            verificationState: "verified",
            topSignals: ["enemy_sighting", "trade_signal"],
            updatedAt: new Date().toISOString()
          },
          {
            location: "MNO-Y-05",
            threatScore: 45,
            opportunityScore: 72,
            confidenceScore: 70,
            verificationState: "emerging",
            topSignals: ["resource_cluster", "safe_route"],
            updatedAt: new Date().toISOString()
          }
        ];

  return (
    <div className="content-grid">
      <section className="panel panel-wide">
        <p className="panel-label">Live Recommendation</p>
        <h2>{liveRecommendation.title}</h2>
        <p className="lede-tight">{liveRecommendation.summary}</p>
        <p className="metric">
          Confidence <strong>{liveRecommendation.confidenceScore}</strong>
        </p>
        <p>{liveRecommendation.recommendedAction}</p>
        <p className="status">Evidence: {liveRecommendation.evidence.join(", ")}</p>
      </section>

      <section className="panel">
        <p className="panel-label">Network Readiness</p>
        <h2>Operational Summary</h2>
        <ul className="summary-list">
          <li>
            <span>Verified Signals</span>
            <strong>{sectorList.filter((sector) => sector.verificationState === "verified").length}</strong>
          </li>
          <li>
            <span>Active Reports</span>
            <strong>{recentReports.length}</strong>
          </li>
          <li>
            <span>Alert Queue</span>
            <strong>{notificationPayload.notifications.length}</strong>
          </li>
        </ul>
      </section>

      <section className="panel">
        <p className="panel-label">Recent Alerts</p>
        <h2>Operational Broadcasts</h2>
        {notificationPayload.notifications.length ? (
          <ul className="notification-list">
            {notificationPayload.notifications.slice(0, 4).map((note) => (
              <li key={note.id}>
                <div className="notification-header">
                  <div>
                    <strong>{note.title}</strong>
                    {note.sector ? <span className="status-small">{note.sector}</span> : null}
                  </div>
                  <span className={`badge-${note.severity}`}>{note.severity}</span>
                </div>
                <p className="status">{note.message}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="status">No alerts published yet. Submit intel to activate the network.</p>
        )}
      </section>

      <section className="panel panel-wide">
        <p className="panel-label">Sector Signals</p>
        {sectorList.length ? (
          <ul className="sector-list">
            {sectorList.slice(0, 6).map((sector) => (
              <li key={sector.location}>
                <div>
                  <strong>{sector.location}</strong>
                  <span>{sector.verificationState}</span>
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
          <p className="status">No verified sector intelligence yet.</p>
        )}
      </section>

      <AssistantPanel />
    </div>
  );
}
