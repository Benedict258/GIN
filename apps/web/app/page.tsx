import { Suspense } from "react";
import { DAppKitSlot } from "../components/dapp-kit-slot";
import { ReportForm } from "../components/report-form";
import { fetchRecommendations, fetchSectorIntel } from "../lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [sectors, recommendations] = await Promise.all([
    fetchSectorIntel().catch((error) => {
      console.error("Failed to load sectors", error);
      return [];
    }),
    fetchRecommendations().catch((error) => {
      console.error("Failed to load recommendations", error);
      return [];
    })
  ]);

  const liveRecommendation = recommendations[0];

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
