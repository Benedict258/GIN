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

export const notificationSeveritySchema = z.enum(["info", "warning", "danger"]);

export const createNotificationInputSchema = z.object({
  title: z.string().min(1).max(140),
  message: z.string().min(1).max(480),
  severity: notificationSeveritySchema.default("info"),
  sector: z.string().min(1).max(140).optional(),
  actionUrl: z.string().url().optional(),
  metadata: z.record(z.string(), z.unknown()).default({})
});

export const notificationSchema = createNotificationInputSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime()
});

export const worldSignalSchema = z.object({
  id: z.string().uuid(),
  sector: z.string().min(1),
  signalType: signalTypeSchema,
  summary: z.string().min(1),
  confidenceScore: z.number().min(0).max(100),
  metadata: z.record(z.string(), z.unknown()).default({}),
  observedAt: z.string().datetime(),
  createdAt: z.string().datetime()
});

export const createReportInputSchema = z.object({
  reporterId: z.string().min(1),
  location: z.string().min(1),
  signalType: signalTypeSchema,
  summary: z.string().min(1).max(280),
  source: z.enum(["player", "system", "world_event", "knowledge_base"]),
  intensity: z.number().min(1).max(100),
  importanceScore: z.number().min(1).max(100),
  metadata: z.record(z.string(), z.unknown()).default({}),
  factionTag: z.string().min(1).max(64).optional()
});

export const confidenceComponentsSchema = z.object({
  base: z.number().min(0).max(100),
  consensus: z.number().min(0).max(100),
  recency: z.number().min(0).max(100),
  reputation: z.number().min(0).max(100),
  diversity: z.number().min(0).max(100)
});

export const createReportSchema = createReportInputSchema.extend({
  id: z.string(),
  createdAt: z.string().datetime(),
  confidenceScore: z.number().min(0).max(100),
  verificationState: verificationStateSchema,
  dedupeHash: z.string().min(1),
  sourceCount: z.number().int().min(1),
  uniqueSources: z.number().int().min(0),
  uniqueFactions: z.number().int().min(0),
  confidenceComponents: confidenceComponentsSchema
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

export const routeStateSchema = z.enum(["safe", "volatile", "hostile"]);

export const routeSummarySchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  threatScore: z.number().min(0).max(100),
  safetyScore: z.number().min(0).max(100),
  confidenceScore: z.number().min(0).max(100),
  verificationState: verificationStateSchema,
  routeState: routeStateSchema,
  advisory: z.array(z.string()).default([]),
  topSignals: z.array(signalTypeSchema).default([]),
  updatedAt: z.string().datetime()
});

export const factionIntelSchema = z.object({
  faction: z.string().min(1),
  reportCount: z.number().int().nonnegative(),
  verifiedCount: z.number().int().nonnegative(),
  avgConfidence: z.number().min(0).max(100),
  dominantSignal: signalTypeSchema.nullable(),
  topLocations: z.array(z.string()),
  updatedAt: z.string().datetime()
});

export const knowledgeDifficultySchema = z.enum(["standard", "advanced", "critical"]);

export const createKnowledgeArticleSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  steps: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  relatedLocations: z.array(z.string()).default([]),
  difficulty: knowledgeDifficultySchema.default("standard")
});

export const knowledgeArticleSchema = createKnowledgeArticleSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const profilePreferenceSchema = z.object({
  profileId: z.string().uuid(),
  lastKnownSector: z.string().min(1).optional(),
  alertOptIn: z.boolean(),
  lastSeenAt: z.string().datetime()
});

export const updateProfilePreferenceInputSchema = z.object({
  profileId: z.string().uuid(),
  lastKnownSector: z.string().min(1).optional(),
  alertOptIn: z.boolean().optional()
});

export const assistantQueryInputSchema = z.object({
  profileId: z.string().uuid().optional(),
  prompt: z.string().min(1).max(600),
  sector: z.string().min(1).optional()
});

export const assistantReplySchema = z.object({
  reply: z.string().min(1),
  relatedArticles: knowledgeArticleSchema.array(),
  suggestedActions: z.array(z.string()).default([])
});

export const structuredIntelSnapshotSchema = z.object({
  id: z.string().uuid(),
  snapshotType: z.string().min(1),
  sectors: sectorSummarySchema.array(),
  routes: routeSummarySchema.array(),
  factions: factionIntelSchema.array(),
  walrusBlobId: z.string().optional(),
  createdAt: z.string().datetime()
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
  lifetimeCredits: z.number().int(),
  tierProgress: z.number().int(),
  reputationScore: z.number().int(),
  contributionCount: z.number().int(),
  lastContributionAt: z.string().datetime().nullable()
});

export const profileContextSchema = z.object({
  profile: profileSchema,
  contributor: contributorProfileSchema
});

export const accessTierSchema = z.object({
  tierId: z.string().min(1),
  displayName: z.string().min(1),
  minCredits: z.number().int().nonnegative(),
  description: z.string().nullish(),
  privileges: z.record(z.string(), z.unknown()).default({}),
  isDefault: z.boolean()
});

export const profileAccessGrantSchema = z.object({
  id: z.string().uuid(),
  profileId: z.string().uuid(),
  tierId: z.string().min(1),
  grantedBy: z.string().nullish(),
  grantedAt: z.string().datetime(),
  expiresAt: z.string().datetime().nullable(),
  metadata: z.record(z.string(), z.unknown()).default({})
});

export const contributionActionSchema = z.object({
  actionKey: z.string().min(1),
  displayName: z.string().min(1),
  description: z.string().nullish(),
  baseReward: z.number().int(),
  importanceWeight: z.number().int().min(1).max(100),
  usefulnessWeight: z.number().int().min(1).max(100),
  metadata: z.record(z.string(), z.unknown()).default({}),
  isActive: z.boolean()
});

export const creditEventTypeSchema = z.enum([
  "report_submitted",
  "report_confirmed",
  "report_disputed",
  "world_data_contributed",
  "intel_purchased",
  "manual_adjustment"
]);

export const creditEventSchema = z.object({
  id: z.string().uuid(),
  profileId: z.string().uuid(),
  eventType: creditEventTypeSchema,
  actionKey: z.string().nullish(),
  delta: z.number().int(),
  importanceScore: z.number().int().min(1).max(100),
  usefulnessScore: z.number().int().min(1).max(100),
  verificationOutcome: z.string().nullish(),
  balanceAfter: z.number().int().nullable(),
  accessTierSnapshot: z.string().nullish(),
  metadata: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.string().datetime()
});

export const awardContributionCreditsSchema = z.object({
  profileId: z.string().uuid(),
  actionKey: creditEventTypeSchema,
  importanceScore: z.number().int().min(1).max(100).default(50),
  usefulnessScore: z.number().int().min(1).max(100).default(50),
  verificationOutcome: z.string().nullish(),
  metadata: z.record(z.string(), z.unknown()).default({}),
  creditsOverride: z.number().int().optional(),
  countsTowardsContribution: z.boolean().default(true)
});

export const awardContributionCreditsResponseSchema = z.object({
  profile: profileSchema,
  contributor: contributorProfileSchema,
  event: creditEventSchema
});

export const creditsLedgerResponseSchema = z.object({
  events: z.array(creditEventSchema)
});

export const accessStatusResponseSchema = z.object({
  profile: profileSchema,
  contributor: contributorProfileSchema,
  tier: accessTierSchema,
  nextTier: accessTierSchema.nullish()
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

export const recordSsuSubmissionRequestSchema = z.object({
  reportId: z.string().uuid(),
  storageUnitId: z.string().min(1)
});

export const recordSsuSubmissionResponseSchema = z.object({
  reportId: z.string().uuid(),
  storageUnitId: z.string().min(1),
  reportDigestHex: z.string().min(1),
  transactionDigest: z.string().min(1)
});

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.string(),
  timestamp: z.string().datetime()
});

export type CreateReportInput = z.infer<typeof createReportInputSchema>;
export type Report = z.infer<typeof createReportSchema>;
export type SectorSummary = z.infer<typeof sectorSummarySchema>;
export type RouteSummary = z.infer<typeof routeSummarySchema>;
export type FactionIntel = z.infer<typeof factionIntelSchema>;
export type StructuredIntelSnapshot = z.infer<typeof structuredIntelSnapshotSchema>;
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
export type ConfidenceComponents = z.infer<typeof confidenceComponentsSchema>;
export type HealthResponse = z.infer<typeof healthResponseSchema>;
export type AccessTier = z.infer<typeof accessTierSchema>;
export type ProfileAccessGrant = z.infer<typeof profileAccessGrantSchema>;
export type ContributionAction = z.infer<typeof contributionActionSchema>;
export type CreditEvent = z.infer<typeof creditEventSchema>;
export type AwardContributionCreditsInput = z.infer<typeof awardContributionCreditsSchema>;
export type AwardContributionCreditsResponse = z.infer<typeof awardContributionCreditsResponseSchema>;
export type CreditsLedgerResponse = z.infer<typeof creditsLedgerResponseSchema>;
export type AccessStatusResponse = z.infer<typeof accessStatusResponseSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type WorldSignal = z.infer<typeof worldSignalSchema>;
export type CreateNotificationInput = z.infer<typeof createNotificationInputSchema>;
export type KnowledgeArticle = z.infer<typeof knowledgeArticleSchema>;
export type CreateKnowledgeArticleInput = z.infer<typeof createKnowledgeArticleSchema>;
export type ProfilePreference = z.infer<typeof profilePreferenceSchema>;
export type UpdateProfilePreferenceInput = z.infer<typeof updateProfilePreferenceInputSchema>;
export type AssistantReply = z.infer<typeof assistantReplySchema>;
export type AssistantQueryInput = z.infer<typeof assistantQueryInputSchema>;
