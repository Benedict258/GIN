import { createHash } from "node:crypto";
import type { CreateReportInput } from "@gin/shared";
import { supabase } from "./supabase.js";
import type { ContributorProfileRow, Json, ReportRow } from "./database.types.js";

const HOURS_UNTIL_STALE = 18;
const MS_PER_HOUR = 3_600_000;

type ConfidenceComponents = {
  base: number;
  consensus: number;
  recency: number;
  reputation: number;
  diversity: number;
};

const EMPTY_COMPONENTS: ConfidenceComponents = {
  base: 0,
  consensus: 0,
  recency: 0,
  reputation: 0,
  diversity: 0
};

type VerificationState = ReportRow["verification_state"];
type ReputationMap = Record<string, number>;

type TrustComputation = {
  sourceCount: number;
  uniqueSources: number;
  uniqueFactions: number;
  recencyScore: number;
  consensusScore: number;
  reputationScore: number;
  confidenceScore: number;
  verificationState: VerificationState;
  confidenceComponents: ConfidenceComponents;
};

export function deriveDedupeHashFromPayload(payload: CreateReportInput) {
  return buildDedupeHash(payload.location, payload.signalType, payload.summary, payload.metadata);
}

export function deriveDedupeHashFromRow(row: ReportRow) {
  return buildDedupeHash(row.location, row.signal_type, row.summary, asRecord(row.metadata));
}

export async function recomputeClusterTrust(dedupeHash: string, targetReportId: string) {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("dedupe_hash", dedupeHash);

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as ReportRow[];

  if (!rows.length) {
    return null;
  }

  const stats = await buildTrustStats(rows);
  const { data: updatedRows, error: updateError } = await supabase
    .from("reports")
    .update({
      source_count: stats.sourceCount,
      unique_sources: stats.uniqueSources,
      unique_factions: stats.uniqueFactions,
      recency_score: stats.recencyScore,
      consensus_score: stats.consensusScore,
      reputation_score: stats.reputationScore,
      confidence_score: stats.confidenceScore,
      verification_state: stats.verificationState,
      confidence_components: stats.confidenceComponents,
      updated_at: new Date().toISOString()
    })
    .eq("dedupe_hash", dedupeHash)
    .select("*");

  if (updateError) {
    throw new Error(updateError.message);
  }

  const updated = (updatedRows ?? []) as ReportRow[];

  return updated.find((row) => row.id === targetReportId) ?? updated[0] ?? null;
}

async function buildTrustStats(rows: ReportRow[]): Promise<TrustComputation> {
  const reputationMap = await fetchReputationMap(rows);
  const now = new Date();

  const sourceCount = rows.length;
  const uniqueSources = new Set(rows.map((row) => row.source)).size;
  const uniqueFactions = new Set(rows.map(extractFaction).filter(Boolean)).size;

  const avgImportance = average(rows.map((row) => row.importance_score));
  const avgIntensity = average(rows.map((row) => row.intensity));
  const baseComponent = clampScore(avgImportance * 0.65 + avgIntensity * 0.35);

  const recencyScore = clampScore(average(rows.map((row) => computeRecencyScore(row, now))));
  const reputationScore = clampScore(average(rows.map((row) => reputationMap[row.reporter_id] ?? 50)));
  const consensusScore = clampScore(25 + sourceCount * 10 + Math.max(0, uniqueSources - 1) * 5 + uniqueFactions * 5);
  const diversityComponent = clampScore(uniqueSources * 12 + uniqueFactions * 8);

  const confidenceScore = clampScore(
    baseComponent * 0.35 +
      consensusScore * 0.25 +
      recencyScore * 0.15 +
      reputationScore * 0.15 +
      diversityComponent * 0.1
  );

  const verificationState = deriveVerificationState({
    confidenceScore,
    sourceCount,
    recencyScore,
    consensusScore
  });

  return {
    sourceCount,
    uniqueSources,
    uniqueFactions,
    recencyScore,
    consensusScore,
    reputationScore,
    confidenceScore,
    verificationState,
    confidenceComponents: {
      base: baseComponent,
      consensus: consensusScore,
      recency: recencyScore,
      reputation: reputationScore,
      diversity: diversityComponent
    }
  };
}

async function fetchReputationMap(rows: ReportRow[]): Promise<ReputationMap> {
  const ids = [...new Set(rows.map((row) => row.reporter_id))];

  if (!ids.length) {
    return {};
  }

  const { data, error } = await supabase
    .from("contributor_profiles")
    .select("profile_id, reputation_score")
    .in("profile_id", ids);

  if (error) {
    throw new Error(error.message);
  }

  const map: ReputationMap = {};
  for (const row of (data ?? []) as Pick<ContributorProfileRow, "profile_id" | "reputation_score">[]) {
    map[row.profile_id] = clampScore(row.reputation_score);
  }

  return map;
}

function deriveVerificationState(params: {
  confidenceScore: number;
  sourceCount: number;
  recencyScore: number;
  consensusScore: number;
}): VerificationState {
  if (params.recencyScore <= 15) {
    return "stale";
  }

  if (params.confidenceScore >= 85 && params.sourceCount >= 3 && params.consensusScore >= 60) {
    return "verified";
  }

  if (params.confidenceScore >= 60 && params.sourceCount >= 2) {
    return "emerging";
  }

  if (params.sourceCount >= 2 && params.confidenceScore < 40) {
    return "contested";
  }

  return "unverified";
}

function computeRecencyScore(row: ReportRow, now: Date) {
  const createdAt = new Date(row.created_at);
  const diffHours = (now.getTime() - createdAt.getTime()) / MS_PER_HOUR;

  if (!Number.isFinite(diffHours)) {
    return 100;
  }

  if (diffHours <= 0) {
    return 100;
  }

  if (diffHours >= HOURS_UNTIL_STALE) {
    return 0;
  }

  return clampScore(100 - (diffHours / HOURS_UNTIL_STALE) * 100);
}

function buildDedupeHash(
  location: string,
  signalType: string,
  summary: string,
  metadata?: Record<string, unknown>
) {
  const normalizedMetadata = metadata ? serializeMetadata(metadata) : "";

  return createHash("sha256")
    .update(
      `${location.trim().toLowerCase()}|${signalType}|${summary.trim().toLowerCase()}|${normalizedMetadata}`
    )
    .digest("hex");
}

function serializeMetadata(metadata: Record<string, unknown>): string {
  return Object.keys(metadata)
    .sort()
    .map((key) => `${key}:${stringifyValue(metadata[key])}`)
    .join("|");
}

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value).toLowerCase();
  }

  if (Array.isArray(value)) {
    return value.map((item) => stringifyValue(item)).join(",");
  }

  if (typeof value === "object") {
    return serializeMetadata(value as Record<string, unknown>);
  }

  return "";
}

function extractFaction(row: ReportRow) {
  const metadata = asRecord(row.metadata);
  const candidate = (metadata?.faction ?? metadata?.pack ?? metadata?.tenant) as unknown;

  if (typeof candidate === "string" && candidate.trim().length) {
    return candidate.trim().toLowerCase();
  }

  return undefined;
}

function average(values: number[]) {
  if (!values.length) {
    return 0;
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

function clampScore(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function asRecord(value: Json | null): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  return value as Record<string, unknown>;
}
