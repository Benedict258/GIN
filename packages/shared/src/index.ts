import { z } from "zod";

export const verificationStateSchema = z.enum([
  "unverified",
  "emerging",
  "verified",
  "contested",
  "stale"
]);

export const signalTypeSchema = z.enum([
  "enemy_sighting",
  "resource_cluster",
  "safe_route",
  "jump_activity",
  "trade_signal",
  "manual_report"
]);

export const createReportInputSchema = z.object({
  reporterId: z.string().min(1),
  location: z.string().min(1),
  signalType: signalTypeSchema,
  summary: z.string().min(1).max(280),
  source: z.enum(["player", "system", "world_event", "knowledge_base"]),
  intensity: z.number().min(1).max(100),
  importanceScore: z.number().min(1).max(100),
  metadata: z.record(z.string(), z.unknown()).default({})
});

export const createReportSchema = createReportInputSchema.extend({
  id: z.string(),
  createdAt: z.string().datetime(),
  confidenceScore: z.number().min(0).max(100),
  verificationState: verificationStateSchema
});

export const sectorSummarySchema = z.object({
  location: z.string(),
  threatScore: z.number().min(0).max(100),
  opportunityScore: z.number().min(0).max(100),
  confidenceScore: z.number().min(0).max(100),
  verificationState: verificationStateSchema,
  topSignals: z.array(signalTypeSchema),
  updatedAt: z.string().datetime()
});

export const recommendationSchema = z.object({
  title: z.string(),
  summary: z.string(),
  confidenceScore: z.number().min(0).max(100),
  recommendedAction: z.string(),
  evidence: z.array(z.string()),
  relatedLocations: z.array(z.string())
});

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.string(),
  timestamp: z.string().datetime()
});

export type CreateReportInput = z.infer<typeof createReportInputSchema>;
export type Report = z.infer<typeof createReportSchema>;
export type SectorSummary = z.infer<typeof sectorSummarySchema>;
export type Recommendation = z.infer<typeof recommendationSchema>;
