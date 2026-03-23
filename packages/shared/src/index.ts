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

export const walrusArtifactContentSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  recommendedAction: z.string().optional(),
  evidence: z.array(z.string()).default([]),
  relatedLocations: z.array(z.string()).default([]),
  metadata: z.record(z.string(), z.unknown()).default({})
});

export const profileSchema = z.object({
  id: z.string().min(1),
  walletAddress: z.string().min(1),
  handle: z.string().nullish(),
  displayName: z.string().nullish(),
  accessTier: z.string().min(1),
  createdAt: z.string().datetime()
});

export const contributorProfileSchema = z.object({
  profileId: z.string().min(1),
  creditsBalance: z.number().int(),
  reputationScore: z.number().int(),
  contributionCount: z.number().int(),
  lastContributionAt: z.string().datetime().nullable()
});

export const profileContextSchema = z.object({
  profile: profileSchema,
  contributor: contributorProfileSchema
});

export const profileConnectInputSchema = z.object({
  walletAddress: z.string().min(1)
});

export const profileConnectResponseSchema = profileContextSchema;

export const publishArtifactInputSchema = z
  .object({
    artifactType: z.string().min(1),
    confidenceScore: z.number().min(0).max(100).default(70),
    recommendationId: z.string().uuid().optional(),
    content: walrusArtifactContentSchema.optional()
  })
  .refine((value) => Boolean(value.recommendationId || value.content), {
    message: "Provide either recommendationId or content"
  });

export const publishArtifactResponseSchema = z.object({
  artifactType: z.string().min(1),
  confidenceScore: z.number().min(0).max(100),
  blobId: z.string().min(1),
  transactionDigest: z.string().min(1),
  proof: z.string().optional()
});

export const awardCreditsRequestSchema = z.object({
  profileId: z.string().uuid(),
  credits: z.number().int().positive(),
  reportId: z.string().uuid().optional()
});

export const awardCreditsResponseSchema = z.object({
  profileId: z.string().uuid(),
  credits: z.number().int(),
  transactionDigest: z.string().min(1),
  reportDigestHex: z.string().min(1)
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
export type WalrusArtifactContent = z.infer<typeof walrusArtifactContentSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type ContributorProfile = z.infer<typeof contributorProfileSchema>;
export type ProfileContext = z.infer<typeof profileContextSchema>;
export type ProfileConnectInput = z.infer<typeof profileConnectInputSchema>;
export type PublishArtifactInput = z.infer<typeof publishArtifactInputSchema>;
export type PublishArtifactResponse = z.infer<typeof publishArtifactResponseSchema>;
export type AwardCreditsRequest = z.infer<typeof awardCreditsRequestSchema>;
export type AwardCreditsResponse = z.infer<typeof awardCreditsResponseSchema>;
