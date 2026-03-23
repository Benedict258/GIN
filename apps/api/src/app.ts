import Fastify from "fastify";
import cors from "@fastify/cors";
import {
  awardCreditsRequestSchema,
  awardCreditsResponseSchema,
  contributorProfileSchema,
  createReportSchema,
  createReportInputSchema,
  healthResponseSchema,
  profileConnectInputSchema,
  profileConnectResponseSchema,
  profileSchema,
  publishArtifactInputSchema,
  publishArtifactResponseSchema,
  recommendationSchema,
  sectorSummarySchema,
  walrusArtifactContentSchema
} from "@gin/shared";
import type { CreateReportInput, PublishArtifactInput, Report, WalrusArtifactContent } from "@gin/shared";
import type { FastifyBaseLogger } from "fastify";
import { supabase } from "./lib/supabase.js";
import type {
  RecommendationRow,
  ReportRow,
  SectorSummaryRow,
  Json,
  ProfileRow,
  ContributorProfileRow
} from "./lib/database.types.js";
import { awardCreditsOnChain, deriveReportDigest, isSuiConfigured, publishArtifactOnChain } from "./lib/contracts.js";
import { pinWalrusArtifact } from "./lib/walrus.js";

const DEFAULT_SECTOR_LIMIT = 20;
const DEFAULT_RECOMMENDATION_LIMIT = 10;

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

  app.get("/api/intel/sectors", async (request, reply) => {
    try {
      const sectors = await fetchSectorSummaries();
      return { sectors };
    } catch (error) {
      request.log.error({ err: error }, "Failed to fetch sector intel");
      reply.code(500);
      return { error: "Failed to fetch sector intelligence" };
    }
  });

  app.get("/api/intel/recommendations", async (request, reply) => {
    try {
      const recommendations = await fetchRecommendations();
      return { recommendations };
    } catch (error) {
      request.log.error({ err: error }, "Failed to fetch recommendations");
      reply.code(500);
      return { error: "Failed to fetch recommendations" };
    }
  });

  app.post("/api/reports", async (request, reply) => {
    const payload = createReportInputSchema.parse(request.body);

    try {
      const report = await saveReport(payload);
      await issueContributorCredits(report, payload, request.log);
      reply.code(201);
      return { report };
    } catch (error) {
      request.log.error({ err: error }, "Failed to save report");
      reply.code(500);
      return { error: "Failed to store report" };
    }
  });

  app.post("/api/profiles/connect", async (request, reply) => {
    const payload = profileConnectInputSchema.parse(request.body);

    try {
      const context = await connectProfile(payload.walletAddress);
      return profileConnectResponseSchema.parse(context);
    } catch (error) {
      request.log.error({ err: error }, "Failed to connect profile");
      reply.code(500);
      return { error: "Failed to connect profile" };
    }
  });

  app.post("/api/contracts/publish-artifact", async (request, reply) => {
    const payload = publishArtifactInputSchema.parse(request.body);

    if (!isSuiConfigured()) {
      reply.code(503);
      return { error: "Sui integration is not configured" };
    }

    try {
      const content = await resolveArtifactContent(payload);
      const walrusResult = await pinWalrusArtifact({
        artifactType: payload.artifactType,
        content,
        confidenceScore: payload.confidenceScore
      });

      const transaction = await publishArtifactOnChain({
        artifactType: payload.artifactType,
        walrusBlobId: walrusResult.blobId,
        confidenceScore: payload.confidenceScore
      });

      return publishArtifactResponseSchema.parse({
        artifactType: payload.artifactType,
        confidenceScore: payload.confidenceScore,
        blobId: walrusResult.blobId,
        proof: walrusResult.proof,
        transactionDigest: transaction.digest
      });
    } catch (error) {
      request.log.error({ err: error }, "Failed to publish Walrus artifact");
      reply.code(500);
      return { error: "Failed to publish artifact" };
    }
  });

  app.post("/api/contracts/award-credits", async (request, reply) => {
    const payload = awardCreditsRequestSchema.parse(request.body);

    if (!isSuiConfigured()) {
      reply.code(503);
      return { error: "Sui integration is not configured" };
    }

    try {
      const profileRow = await fetchProfileById(payload.profileId);

      if (!profileRow.wallet_address) {
        reply.code(400);
        return { error: "Profile does not have a linked wallet" };
      }

      const reportRow = payload.reportId ? await fetchReportRowById(payload.reportId) : null;
      const digest = deriveReportDigest(
        reportRow?.id ?? payload.profileId,
        reportRow?.summary ?? `manual-credit-${Date.now()}`
      );

      const transaction = await awardCreditsOnChain({
        contributorAddress: profileRow.wallet_address,
        credits: payload.credits,
        reportDigestBytes: digest.bytes
      });

      return awardCreditsResponseSchema.parse({
        profileId: payload.profileId,
        credits: payload.credits,
        reportDigestHex: digest.hex,
        transactionDigest: transaction.digest
      });
    } catch (error) {
      request.log.error({ err: error }, "Failed to award on-chain credits");
      reply.code(500);
      return { error: "Failed to award credits" };
    }
  });

  return app;
}

async function fetchSectorSummaries() {
  const { data, error } = await supabase
    .from("sector_summaries")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(DEFAULT_SECTOR_LIMIT);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapSectorRow);
}

async function fetchRecommendations() {
  const { data, error } = await supabase
    .from("recommendations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(DEFAULT_RECOMMENDATION_LIMIT);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapRecommendationRow);
}

async function saveReport(payload: CreateReportInput) {
  const { data, error } = await supabase
    .from("reports")
    .insert({
      reporter_id: payload.reporterId,
      location: payload.location,
      signal_type: payload.signalType,
      source: payload.source,
      summary: payload.summary,
      intensity: payload.intensity,
      importance_score: payload.importanceScore,
      metadata: payload.metadata ?? {}
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unknown Supabase error");
  }

  return mapReportRow(data);
}

function mapReportRow(row: ReportRow) {
  return createReportSchema.parse({
    id: row.id,
    reporterId: row.reporter_id,
    location: row.location,
    signalType: row.signal_type,
    summary: row.summary,
    source: row.source,
    intensity: row.intensity,
    importanceScore: row.importance_score,
    metadata: (row.metadata as Record<string, unknown> | null) ?? {},
    createdAt: row.created_at,
    confidenceScore: row.confidence_score,
    verificationState: row.verification_state
  });
}

function mapSectorRow(row: SectorSummaryRow) {
  return sectorSummarySchema.parse({
    location: row.location,
    threatScore: row.threat_score,
    opportunityScore: row.opportunity_score,
    confidenceScore: row.confidence_score,
    verificationState: row.verification_state,
    topSignals: ensureStringArray(row.top_signals),
    updatedAt: row.updated_at
  });
}

function mapRecommendationRow(row: RecommendationRow) {
  return recommendationSchema.parse({
    title: row.title,
    summary: row.summary,
    recommendedAction: row.recommended_action,
    confidenceScore: row.confidence_score,
    evidence: ensureStringArray(row.evidence),
    relatedLocations: ensureStringArray(row.related_locations)
  });
}

async function resolveArtifactContent(payload: PublishArtifactInput): Promise<WalrusArtifactContent> {
  if (payload.recommendationId) {
    const recommendation = await fetchRecommendationRow(payload.recommendationId);

    return walrusArtifactContentSchema.parse({
      title: recommendation.title,
      summary: recommendation.summary,
      recommendedAction: recommendation.recommended_action,
      evidence: ensureStringArray(recommendation.evidence),
      relatedLocations: ensureStringArray(recommendation.related_locations),
      metadata: {
        profileId: recommendation.profile_id
      }
    });
  }

  // refine on the schema guarantees that content exists if no recommendationId is set
  return walrusArtifactContentSchema.parse(payload.content);
}

async function fetchRecommendationRow(id: string) {
  const { data, error } = await supabase
    .from("recommendations")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Recommendation not found");
  }

  return data as RecommendationRow;
}

function ensureStringArray(value: Json | null): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

async function issueContributorCredits(report: Report, payload: CreateReportInput, logger: FastifyBaseLogger) {
  const credits = calculateCreditReward(payload);
  const contributorRow = await ensureContributorProfile(report.reporterId);
  const nowIso = new Date().toISOString();

  const { data: updatedContributor, error: updateError } = await supabase
    .from("contributor_profiles")
    .update({
      credits_balance: contributorRow.credits_balance + credits,
      contribution_count: contributorRow.contribution_count + 1,
      last_contribution_at: nowIso
    })
    .eq("profile_id", report.reporterId)
    .select("*")
    .single();

  if (updateError || !updatedContributor) {
    throw new Error(updateError?.message ?? "Unable to update contributor stats");
  }

  await recordCreditEvent(report, credits, payload);
  await maybeAwardCreditsOnChain(report, credits, logger);

  return updatedContributor as ContributorProfileRow;
}

function calculateCreditReward(payload: CreateReportInput) {
  const weighted = payload.importanceScore * 0.6 + payload.intensity * 0.4;
  return Math.max(5, Math.round(weighted / 5));
}

async function recordCreditEvent(report: Report, credits: number, payload: CreateReportInput) {
  const metadata = {
    report_id: report.id,
    signal_type: payload.signalType,
    location: payload.location,
    source: payload.source
  } satisfies Record<string, string>;

  const { error } = await supabase.from("credit_events").insert({
    profile_id: report.reporterId,
    event_type: "report_submitted",
    delta: credits,
    importance_score: payload.importanceScore,
    metadata
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function maybeAwardCreditsOnChain(report: Report, credits: number, logger: FastifyBaseLogger) {
  if (!isSuiConfigured()) {
    return;
  }

  try {
    const profileRow = await fetchProfileById(report.reporterId);

    if (!profileRow.wallet_address) {
      throw new Error("Reporter profile is missing a wallet address");
    }

    const digest = deriveReportDigest(report.id, report.summary);

    const transaction = await awardCreditsOnChain({
      contributorAddress: profileRow.wallet_address,
      credits,
      reportDigestBytes: digest.bytes
    });

    logger.info({ digest: transaction.digest }, "Awarded credits on-chain");
  } catch (error) {
    logger.warn({ err: error }, "On-chain credit issuance failed");
  }
}

async function fetchProfileById(profileId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Profile not found");
  }

  return data as ProfileRow;
}

async function fetchReportRowById(reportId: string) {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", reportId)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Report not found");
  }

  return data as ReportRow;
}

async function connectProfile(walletAddress: string) {
  const normalized = walletAddress.toLowerCase();
  const profileRow = await findOrCreateProfile(normalized);
  const contributorRow = await ensureContributorProfile(profileRow.id);

  return {
    profile: mapProfileRow(profileRow),
    contributor: mapContributorRow(contributorRow)
  };
}

async function findOrCreateProfile(walletAddress: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("wallet_address", walletAddress)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (data) {
    return data as ProfileRow;
  }

  const handle = generateHandle(walletAddress);

  const { data: inserted, error: insertError } = await supabase
    .from("profiles")
    .insert({
      wallet_address: walletAddress,
      handle,
      display_name: handle
    })
    .select("*")
    .single();

  if (insertError || !inserted) {
    throw new Error(insertError?.message ?? "Unable to create profile");
  }

  return inserted as ProfileRow;
}

async function ensureContributorProfile(profileId: string) {
  const { data, error } = await supabase
    .from("contributor_profiles")
    .select("*")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (data) {
    return data as ContributorProfileRow;
  }

  const { data: inserted, error: insertError } = await supabase
    .from("contributor_profiles")
    .insert({ profile_id: profileId })
    .select("*")
    .single();

  if (insertError || !inserted) {
    throw new Error(insertError?.message ?? "Unable to create contributor profile");
  }

  return inserted as ContributorProfileRow;
}

function mapProfileRow(row: ProfileRow) {
  if (!row.wallet_address) {
    throw new Error("Profile is missing wallet address");
  }

  return profileSchema.parse({
    id: row.id,
    walletAddress: row.wallet_address,
    handle: row.handle,
    displayName: row.display_name,
    accessTier: row.access_tier,
    createdAt: row.created_at
  });
}

function mapContributorRow(row: ContributorProfileRow) {
  return contributorProfileSchema.parse({
    profileId: row.profile_id,
    creditsBalance: row.credits_balance,
    reputationScore: row.reputation_score,
    contributionCount: row.contribution_count,
    lastContributionAt: row.last_contribution_at
  });
}

function generateHandle(walletAddress: string) {
  const suffix = walletAddress.slice(-4);
  return `gin_${suffix}`;
}
