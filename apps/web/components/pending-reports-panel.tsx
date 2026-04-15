"use client";

import { useEffect, useMemo, useState } from "react";
import { getPendingQueuedReports, type PendingQueuedReport } from "../lib/demo-local";

type PendingReportItem = {
  id: string;
  location: string;
  summary: string;
  signalType: string;
  confidenceScore: number;
  verificationState: string;
};

export function PendingReportsPanel({ initialReports }: { initialReports: PendingReportItem[] }) {
  const [localQueuedReports, setLocalQueuedReports] = useState<PendingQueuedReport[]>([]);

  useEffect(() => {
    setLocalQueuedReports(getPendingQueuedReports());
  }, []);

  const pendingReports = useMemo(() => {
    const all = [...localQueuedReports, ...initialReports];
    const deduped = new Map<string, PendingReportItem>();

    for (const report of all) {
      if (!deduped.has(report.id)) {
        deduped.set(report.id, report);
      }
    }

    return Array.from(deduped.values()).slice(0, 10);
  }, [initialReports, localQueuedReports]);

  return (
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
  );
}
