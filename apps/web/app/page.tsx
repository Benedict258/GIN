import { Suspense } from "react";
import { DAppKitSlot } from "../components/dapp-kit-slot";
import { recommendationSchema, sectorSummarySchema } from "@gin/shared";

const previewSectors = [
  sectorSummarySchema.parse({
    location: "sector-alpha",
    threatScore: 72,
    opportunityScore: 31,
    confidenceScore: 84,
    verificationState: "verified",
    topSignals: ["enemy_sighting", "jump_activity"],
    updatedAt: new Date().toISOString()
  }),
  sectorSummarySchema.parse({
    location: "sector-beta",
    threatScore: 22,
    opportunityScore: 81,
    confidenceScore: 67,
    verificationState: "emerging",
    topSignals: ["resource_cluster", "safe_route"],
    updatedAt: new Date().toISOString()
  })
];

const previewRecommendation = recommendationSchema.parse({
  title: "Reroute Through Sector Beta",
  summary: "Threat is low, opportunity is rising, and current confidence is acceptable.",
  confidenceScore: 67,
  recommendedAction: "Use Beta as the safer corridor while Alpha stabilizes.",
  evidence: ["Low hostile density", "Recent resource signal cluster"],
  relatedLocations: ["sector-alpha", "sector-beta"]
});

export default function HomePage() {
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
          <h2>{previewRecommendation.title}</h2>
          <p>{previewRecommendation.summary}</p>
          <p className="metric">
            Confidence <strong>{previewRecommendation.confidenceScore}</strong>
          </p>
          <p>{previewRecommendation.recommendedAction}</p>
        </article>

        <article className="panel panel-wide">
          <p className="panel-label">Sector Signals</p>
          <ul className="sector-list">
            {previewSectors.map((sector) => (
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
        </article>
      </section>
    </main>
  );
}
