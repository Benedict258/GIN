import { fetchNotifications, fetchRecentReports, fetchRecommendations, fetchSectorIntel } from "../../lib/api";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const [sectors, recommendations, recentReports, notificationPayload] = await Promise.all([
    fetchSectorIntel().catch(() => []),
    fetchRecommendations().catch(() => []),
    fetchRecentReports().catch(() => []),
    fetchNotifications().catch(() => ({ notifications: [], worldSignals: [] }))
  ]);

  const liveRecommendation = recommendations[0] ?? {
    title: "Hold Ikora Corridor",
    summary: "Verified scout traffic is thinning. Risk is moderate but stabilizing.",
    confidenceScore: 71,
    recommendedAction: "Maintain escort through Ikora, reroute heavy cargo to Nara Belt.",
    evidence: ["2 hostile sightings in 30m", "3 confirmed trade lanes online"]
  };

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
            <strong>{sectors.filter((sector) => sector.verificationState === "verified").length}</strong>
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
        {sectors.length ? (
          <ul className="sector-list">
            {sectors.slice(0, 6).map((sector) => (
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
    </div>
  );
}
