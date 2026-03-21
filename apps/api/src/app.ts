import Fastify from "fastify";
import cors from "@fastify/cors";
import {
  createReportSchema,
  createReportInputSchema,
  healthResponseSchema,
  recommendationSchema,
  sectorSummarySchema
} from "@gin/shared";

const demoSectors = [
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

const demoRecommendation = recommendationSchema.parse({
  title: "Avoid Sector Alpha",
  summary: "Hostile activity is elevated and multiple sources agree on the trend.",
  confidenceScore: 84,
  recommendedAction: "Reroute through Sector Beta and avoid contested lanes.",
  evidence: ["3 hostile sightings in 20 minutes", "Recent jump activity spike"],
  relatedLocations: ["sector-alpha", "sector-beta"]
});

export function buildApp() {
  const app = Fastify({
    logger: true
  });

  app.register(cors, {
    origin: true
  });

  app.get("/health", async () =>
    healthResponseSchema.parse({
      status: "ok",
      service: "gin-api",
      timestamp: new Date().toISOString()
    })
  );

  app.get("/api/intel/sectors", async () => ({
    sectors: demoSectors
  }));

  app.get("/api/intel/recommendations", async () => ({
    recommendations: [demoRecommendation]
  }));

  app.post("/api/reports", async (request, reply) => {
    const payload = createReportInputSchema.parse(request.body);

    const report = createReportSchema.parse({
      id: `report_${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      confidenceScore: 10,
      verificationState: "unverified",
      ...payload
    });

    reply.code(201);
    return { report };
  });

  return app;
}
