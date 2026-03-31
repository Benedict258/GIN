import type { RouteSummary } from "@gin/shared";

const STATE_BADGE: Record<RouteSummary["routeState"], string> = {
  hostile: "status-error",
  volatile: "status-warning",
  safe: "status-success"
};

type RouteSafetyPanelProps = {
  routes: RouteSummary[];
  recomputeAction?: () => Promise<void>;
};

export function RouteSafetyPanel({ routes, recomputeAction }: RouteSafetyPanelProps) {
  return (
    <article className="panel">
      <p className="panel-label">Corridor Safety - EVE Frontier</p>
      <h2>Route Intelligence</h2>
      <p className="lede-tight">
        This mirrors the corridor widget we plan to surface on the assembly HUD so commanders inside Utopia can decide
        when to reroute fleets in real time.
      </p>
      {recomputeAction ? (
        <form className="inline-form" action={recomputeAction}>
          <button className="action-button ghost" type="submit">
            Refresh corridor intel
          </button>
        </form>
      ) : null}
      {routes.length === 0 ? (
        <p className="status">Run a recompute after fresh reports to populate corridor intel.</p>
      ) : (
        <ul className="sector-list">
          {routes.map((route) => (
            <li key={`${route.origin}-${route.destination}`}>
              <div>
                <strong>
                  {route.origin} {"<->"} {route.destination}
                </strong>
                <span className={STATE_BADGE[route.routeState] ?? ""}>{route.routeState}</span>
              </div>
              <div className="scores">
                <span>Threat {route.threatScore}</span>
                <span>Safety {route.safetyScore}</span>
                <span>Confidence {route.confidenceScore}</span>
              </div>
              {route.advisory.length ? <p className="status">{route.advisory[0]}</p> : null}
              {route.topSignals.length ? <p className="status">Signals: {route.topSignals.join(", ")}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
