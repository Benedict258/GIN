import type { ConfidenceComponents } from "@gin/shared";
import { supabase } from "./supabase.js";
import type { ReportRow, SectorSummaryRow } from "./database.types.js";
import { ensureConfidenceComponents } from "./trust-components.js";

const LOOKBACK_HOURS = 36;
const SECTOR_STALE_HOURS = 24;
const MS_PER_HOUR = 3_600_000;

const SIGNAL_WEIGHTS: Record<ReportRow["signal_type"], { threat: number; opportunity: number }> = {
  enemy_sighting: { threat: 1, opportunity: 0.05 },
  resource_cluster: { threat: 0.1, opportunity: 1 },
  safe_route: { threat: 0.1, opportunity: 0.8 },
  jump_activity: { threat: 0.7, opportunity: 0.2 },
  trade_signal: { threat: 0, opportunity: 0.9 },
  manual_report: { threat: 0.4, opportunity: 0.4 }
};

type EnrichedReport = {
  row: ReportRow;
  components: ConfidenceComponents;
};

type SectorSummaryMutation = {
  location: string;
  threat_score: number;
  opportunity_score: number;
  confidence_score: number;
  verification_state: SectorSummaryRow["verification_state"];
  top_signals: string[];
  updated_at: string;
};

export async function recomputeSectorSummaries() {
  const sinceIso = new Date(Date.now() - LOOKBACK_HOURS * MS_PER_HOUR).toISOString();
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .gte("created_at", sinceIso);

  if (error) {
    throw new Error(error.message);
  }

  const grouped = new Map<string, ReportRow[]>();
  for (const row of (data ?? []) as ReportRow[]) {
    const bucket = grouped.get(row.location);
    if (bucket) {
      bucket.push(row);
    } else {
      grouped.set(row.location, [row]);
    }
  }

  if (!grouped.size) {
    return [] as SectorSummaryRow[];
  }

  const now = new Date();
  const payload: SectorSummaryMutation[] = Array.from(grouped.entries()).map(([location, rows]) =>
    buildSectorSummary(location, rows, now)
  );

  const { data: upserted, error: upsertError } = await supabase
    .from("sector_summaries")
    .upsert(payload, { onConflict: "location" })
    .select("*");

  if (upsertError) {
    throw new Error(upsertError.message);
  }

  return (upserted ?? []) as SectorSummaryRow[];
}

function buildSectorSummary(location: string, rows: ReportRow[], now: Date): SectorSummaryMutation {
  const enriched = rows.map((row) => ({
    row,
    components: ensureConfidenceComponents(row.confidence_components)
  }));

  const threatScore = computeWeightedScore(enriched, "threat");
  const opportunityScore = computeWeightedScore(enriched, "opportunity");
  const recencyScore = clampScore(average(enriched.map((item) => computeRecencyScore(item.row, now))));
  const avgConfidence = average(enriched.map((item) => item.row.confidence_score));
  const consensusComponent = average(enriched.map((item) => item.components.consensus));
  const reputationComponent = average(enriched.map((item) => item.components.reputation));
  const uniqueReporters = new Set(enriched.map((item) => item.row.reporter_id)).size;
  const diversityScore = clampScore(Math.min(100, uniqueReporters * 12));

  const confidenceScore = clampScore(
    avgConfidence * 0.5 + consensusComponent * 0.2 + reputationComponent * 0.1 + recencyScore * 0.15 + diversityScore * 0.05
  );

  const verificationState = deriveSectorVerificationState({
    confidenceScore,
    reportCount: enriched.length,
    uniqueReporters,
    recencyScore
  });

  const topSignals = determineTopSignals(enriched);

  return {
    location,
    threat_score: threatScore,
    opportunity_score: opportunityScore,
    confidence_score: confidenceScore,
    verification_state: verificationState,
    top_signals: topSignals,
    updated_at: new Date().toISOString()
  };
}

function computeWeightedScore(reports: EnrichedReport[], field: "threat" | "opportunity") {
  let totalWeight = 0;
  let sum = 0;

  for (const item of reports) {
    const weight = computeReportWeight(item);
    totalWeight += weight;
    const signalWeight = SIGNAL_WEIGHTS[item.row.signal_type][field];
    sum += weight * signalWeight;
  }

  if (!totalWeight) {
    return 0;
  }

  return clampScore((sum / totalWeight) * 100);
}

function determineTopSignals(reports: EnrichedReport[]) {
  const totals = new Map<ReportRow["signal_type"], number>();

  for (const item of reports) {
    const weight = computeReportWeight(item);
    totals.set(item.row.signal_type, (totals.get(item.row.signal_type) ?? 0) + weight);
  }

  return Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([signal]) => signal);
}

function computeReportWeight(item: EnrichedReport) {
  const { row, components } = item;
  const base = row.confidence_score * 0.5;
  const importance = row.importance_score * 0.2;
  const intensity = row.intensity * 0.2;
  const consensus = components.consensus * 0.1;
  const diversityBonus = Math.min(15, (row.unique_sources ?? 1) * 2 + (row.unique_factions ?? 0) * 3);
  return Math.max(5, base + importance + intensity + consensus + diversityBonus);
}

function computeRecencyScore(row: ReportRow, now: Date) {
  const createdAt = new Date(row.created_at);
  const diffHours = (now.getTime() - createdAt.getTime()) / MS_PER_HOUR;

  if (!Number.isFinite(diffHours) || diffHours <= 0) {
    return 100;
  }

  if (diffHours >= SECTOR_STALE_HOURS) {
    return 0;
  }

  return clampScore(100 - (diffHours / SECTOR_STALE_HOURS) * 100);
}

function deriveSectorVerificationState(params: {
  confidenceScore: number;
  reportCount: number;
  uniqueReporters: number;
  recencyScore: number;
}): SectorSummaryRow["verification_state"] {
  if (params.recencyScore < 20) {
    return "stale";
  }

  if (params.confidenceScore >= 80 && params.reportCount >= 3 && params.uniqueReporters >= 2) {
    return "verified";
  }

  if (params.confidenceScore >= 60 && params.reportCount >= 2) {
    return "emerging";
  }

  if (params.reportCount >= 2 && params.confidenceScore < 40) {
    return "contested";
  }

  return "unverified";
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
