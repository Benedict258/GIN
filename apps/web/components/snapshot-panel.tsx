import type { StructuredIntelSnapshot } from "@gin/shared";
import { PanelGate } from "./panel-gate";

type SnapshotPanelProps = {
  snapshot: StructuredIntelSnapshot | null;
  onCreateSnapshot: (formData: FormData) => Promise<void>;
};

export function SnapshotPanel({ snapshot, onCreateSnapshot }: SnapshotPanelProps) {
  return (
    <article className="panel panel-wide">
      <PanelGate
        panelKey="snapshots"
        fallback={
          <div>
            <p className="panel-label">Advisor Snapshot</p>
            <h2>Latest Structured Intel</h2>
            <p className="status">Advisor tier unlocks structured intelligence exports.</p>
          </div>
        }
      >
        <p className="panel-label">Advisor Snapshot</p>
        <h2>Latest Structured Intel</h2>
        {snapshot ? (
          <div className="status-card">
            <p className="status">
              Snapshot ID <strong>{snapshot.id.slice(0, 8)}...</strong>
            </p>
            <p className="status">
              Sectors <strong>{snapshot.sectors.length}</strong> - Routes <strong>{snapshot.routes.length}</strong> -
              Factions <strong>{snapshot.factions.length}</strong>
            </p>
            <p className="status">Captured {new Date(snapshot.createdAt).toLocaleString()}</p>
            {snapshot.walrusBlobId ? (
              <p className="status">
                Walrus blob <span>{snapshot.walrusBlobId}</span>
              </p>
            ) : (
              <p className="status">Stored locally (Walrus publishing disabled).</p>
            )}
          </div>
        ) : (
          <p className="status">No structured snapshot yet. Use the generator below after recomputing intel.</p>
        )}
        <form className="snapshot-form" action={onCreateSnapshot}>
          <label className="field-group">
            <span>Confidence score</span>
            <input name="confidenceScore" type="number" min={0} max={100} defaultValue={75} />
          </label>
          <button className="action-button" type="submit">
            Generate advisor snapshot
          </button>
        </form>
      </PanelGate>
    </article>
  );
}
