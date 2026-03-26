import type { FactionIntel } from "@gin/shared";
import { PanelGate } from "./panel-gate";

type FactionIntelPanelProps = {
  factions: FactionIntel[];
  recomputeAction?: () => Promise<void>;
};

export function FactionIntelPanel({ factions, recomputeAction }: FactionIntelPanelProps) {
  return (
    <article className="panel">
      <PanelGate
        requiredPanel="factions"
        panelName="Pack Intelligence"
        fallbackDescription="Scout tier unlocks pack/faction intel."
      >
        <p className="panel-label">Pack Situation Board</p>
        <h2>Faction Intelligence</h2>
        <p className="lede-tight">
          Mirrors the shared pack view that will live inside the Utopia assembly HUD, so allied teams know
          whose intel is verified before coordinating a move.
        </p>
        {recomputeAction ? (
          <form className="inline-form" action={recomputeAction}>
            <button className="action-button ghost" type="submit">
              Refresh pack intel
            </button>
          </form>
        ) : null}
        {factions.length === 0 ? (
          <p className="status">Tag a faction on new reports to populate this feed.</p>
        ) : (
          <ul className="sector-list">
            {factions.map((faction) => (
              <li key={faction.faction}>
                <div>
                  <strong>{faction.faction}</strong>
                  <span>
                    Verified {faction.verifiedCount}/{faction.reportCount}
                  </span>
                </div>
                <div className="scores">
                  <span>Avg Confidence {faction.avgConfidence}</span>
                  <span>Dominant {faction.dominantSignal ?? "n/a"}</span>
                </div>
                {faction.topLocations.length ? (
                  <p className="status">Top locations: {faction.topLocations.join(", ")}</p>
                ) : null}
                <p className="status">Updated {new Date(faction.updatedAt).toLocaleTimeString()}</p>
              </li>
            ))}
          </ul>
        )}
      </PanelGate>
    </article>
  );
}
