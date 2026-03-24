import { supabase } from "./supabase.js";
import type { FactionIntelRow, ReportRow } from "./database.types.js";

const LOOKBACK_HOURS = 72;
const MS_PER_HOUR = 3_600_000;

const VERIFIED_STATES: ReportRow["verification_state"][] = ["verified", "emerging"];

export async function recomputeFactionIntel() {
  const sinceIso = new Date(Date.now() - LOOKBACK_HOURS * MS_PER_HOUR).toISOString();
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .gte("created_at", sinceIso)
    .not("faction_tag", "is", null);

  if (error) {
    throw new Error(error.message);
  }

  const grouped = new Map<string, ReportRow[]>();
  for (const row of (data ?? []) as ReportRow[]) {
    const faction = row.faction_tag;
    if (!faction) {
      continue;
    }

    const key = faction.trim().toLowerCase();
    if (!key) {
      continue;
    }

    const bucket = grouped.get(key);
    if (bucket) {
      bucket.push(row);
    } else {
      grouped.set(key, [row]);
    }
  }

  if (!grouped.size) {
    return [] as FactionIntelRow[];
  }

  const payload = Array.from(grouped.entries()).map(([faction, rows]) => buildSummary(faction, rows));

  const { data: upserted, error: upsertError } = await supabase
    .from("faction_intel_summaries")
    .upsert(payload, { onConflict: "faction" })
    .select("*");

  if (upsertError) {
    throw new Error(upsertError.message);
  }

  return (upserted ?? []) as FactionIntelRow[];
}

function buildSummary(faction: string, rows: ReportRow[]): FactionIntelRow {
  const reportCount = rows.length;
  const verifiedCount = rows.filter((row) => VERIFIED_STATES.includes(row.verification_state)).length;
  const avgConfidence = clampScore(average(rows.map((row) => row.confidence_score)));
  const dominantSignal = pickDominantSignal(rows);
  const topLocations = pickTopLocations(rows);

  return {
    faction,
    report_count: reportCount,
    verified_count: verifiedCount,
    avg_confidence: avgConfidence,
    dominant_signal: dominantSignal,
    top_locations: topLocations,
    updated_at: new Date().toISOString()
  };
}

function pickDominantSignal(rows: ReportRow[]) {
  const weights = new Map<ReportRow["signal_type"], number>();

  for (const row of rows) {
    weights.set(row.signal_type, (weights.get(row.signal_type) ?? 0) + row.confidence_score + row.importance_score);
  }

  return Array.from(weights.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

function pickTopLocations(rows: ReportRow[]) {
  const weights = new Map<string, number>();

  for (const row of rows) {
    weights.set(row.location, (weights.get(row.location) ?? 0) + row.confidence_score + row.intensity);
  }

  return Array.from(weights.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([location]) => location);
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
