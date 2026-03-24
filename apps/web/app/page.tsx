import { Suspense } from "react";
import { revalidatePath } from "next/cache";
import { DAppKitSlot } from "../components/dapp-kit-slot";
import { ReportForm } from "../components/report-form";
import { RecentReportsPanel } from "../components/recent-reports-panel";
import { SectorVerificationPanel } from "../components/sector-verification-panel";
import { RouteSafetyPanel } from "../components/route-safety-panel";
import { FactionIntelPanel } from "../components/faction-intel-panel";
import { SnapshotPanel } from "../components/snapshot-panel";
import {
  createStructuredSnapshot,
  fetchFactionIntel,
  fetchLatestSnapshot,
  fetchRecentReports,
  fetchRecommendations,
  fetchRouteIntel,
  fetchSectorIntel,
  recomputeFactionIntel,
  recomputeRouteIntel
} from "../lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [sectors, recommendations, recentReports, routes, factions, snapshot] = await Promise.all([
    fetchSectorIntel().catch((error) => {
      console.error("Failed to load sectors", error);
      return [] as Awaited<ReturnType<typeof fetchSectorIntel>>;
    }),
    fetchRecommendations().catch((error) => {
      console.error("Failed to load recommendations", error);
      return [] as Awaited<ReturnType<typeof fetchRecommendations>>;
    }),
    fetchRecentReports().catch((error) => {
      console.error("Failed to load reports", error);
      return [] as Awaited<ReturnType<typeof fetchRecentReports>>;
    }),
    fetchRouteIntel().catch((error) => {
      console.error("Failed to load routes", error);
      return [] as Awaited<ReturnType<typeof fetchRouteIntel>>;
    }),
    fetchFactionIntel().catch((error) => {
      console.error("Failed to load factions", error);
      return [] as Awaited<ReturnType<typeof fetchFactionIntel>>;
    }),
    fetchLatestSnapshot().catch((error) => {
      console.error("Failed to load snapshot", error);
      return null;
    })
  ]);

  const liveRecommendation = recommendations[0];

  async function refreshRoutesAction() {
    "use server";
    await recomputeRouteIntel();
    revalidatePath("/");
  }

  async function refreshFactionsAction() {
    "use server";
    await recomputeFactionIntel();
    revalidatePath("/");
  }

  async function createSnapshotAction(formData: FormData) {
    "use server";
    const rawConfidence = Number(formData.get("confidenceScore") ?? 75);
    const confidenceScore = Number.isFinite(rawConfidence) ? Math.max(0, Math.min(100, rawConfidence)) : 75;

    await createStructuredSnapshot({
      confidenceScore
    });

    revalidatePath("/");
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Galactic Intelligence Network</p>
        <h1>Build the intelligence layer before the galaxy builds over you.</h1>
        <p className="lede">
          GIN turns raw ecosystem signals into verified intelligence, contributor
          rewards, and grounded AI guidance for EVE Frontier players.
        </p>
      </section>

      <section className="grid">
        <Suspense fallback={<article className="panel">Loading dApp kit...</article>}>
          <DAppKitSlot />
        </Suspense>

        <article className="panel">
          <p className="panel-label">Live Recommendation</p>
          {liveRecommendation ? (
            <>
              <h2>{liveRecommendation.title}</h2>
              <p>{liveRecommendation.summary}</p>
              <p className="metric">
                Confidence <strong>{liveRecommendation.confidenceScore}</strong>
              </p>
              <p>{liveRecommendation.recommendedAction}</p>
              <p className="status">
                Evidence: {liveRecommendation.evidence.join(", ") || "Awaiting signals"}
              </p>
            </>
          ) : (
            <p className="status">No live recommendation yet. Submit reports to unlock intelligence.</p>
          )}
        </article>

        <RecentReportsPanel reports={recentReports} />

        <SectorVerificationPanel sectors={sectors} />

        <RouteSafetyPanel routes={routes} recomputeAction={refreshRoutesAction} />

        <FactionIntelPanel factions={factions} recomputeAction={refreshFactionsAction} />

        <SnapshotPanel snapshot={snapshot} onCreateSnapshot={createSnapshotAction} />

        <article className="panel panel-wide">
          <p className="panel-label">Sector Signals</p>
          {sectors.length ? (
            <ul className="sector-list">
              {sectors.map((sector) => (
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
                  {sector.topSignals.length ? (
                    <p className="status">Signals: {sector.topSignals.join(", ")}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="status">No verified sector intelligence yet.</p>
          )}
        </article>

        <ReportForm />
      </section>
    </main>
  );
}
