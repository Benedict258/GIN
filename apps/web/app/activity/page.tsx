import { fetchNotifications, fetchRecentReports } from "../../lib/api";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const [reports, notificationPayload] = await Promise.all([
    fetchRecentReports().catch(() => []),
    fetchNotifications().catch(() => ({ notifications: [], worldSignals: [] }))
  ]);

  const timeline = [
    ...reports.slice(0, 5).map((report) => ({
      id: report.id,
      title: `${report.signalType.replace(/_/g, " ")} - ${report.location}`,
      detail: report.summary,
      status: report.verificationState,
      timestamp: report.createdAt
    })),
    ...notificationPayload.notifications.slice(0, 4).map((note) => ({
      id: note.id,
      title: note.title,
      detail: note.message,
      status: note.severity,
      timestamp: note.createdAt
    }))
  ].slice(0, 8);

  return (
    <div className="content-grid">
      <section className="panel panel-wide">
        <p className="panel-label">Contributor Activity</p>
        <h2>Operational Timeline</h2>
        <p className="lede-tight">
          Track recent submissions, verification progress, and network alerts in a single operational log.
        </p>
      </section>

      <section className="panel panel-wide">
        <ul className="story-timeline">
          {timeline.length ? (
            timeline.map((entry) => (
              <li key={entry.id}>
                <strong>{entry.title}</strong>
                <p>{entry.detail}</p>
                <p className="status-small">
                  {entry.status} - {new Date(entry.timestamp).toLocaleString()}
                </p>
              </li>
            ))
          ) : (
            <p className="status">No recent activity yet. Submit intel to begin the operational log.</p>
          )}
        </ul>
      </section>
    </div>
  );
}
