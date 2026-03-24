import { supabase } from "./supabase.js";
import type { RouteSummaryRow, SectorSummaryRow } from "./database.types.js";

const ROUTE_NETWORK = [
  { origin: "sector-alpha", destination: "sector-beta", label: "Alpha ↔ Beta" },
  { origin: "sector-beta", destination: "sector-gamma", label: "Beta ↔ Gamma" },
  { origin: "sector-gamma", destination: "sector-delta", label: "Gamma ↔ Delta" }
];

const STATE_PRIORITY: Record<SectorSummaryRow["verification_state"], number> = {
  verified: 0,
  emerging: 1,
  contested: 2,
  unverified: 3,
  stale: 4
};

export async function recomputeRouteSummaries() {
  const { data: sectorRows, error } = await supabase.from("sector_summaries").select("*");

  if (error) {
    throw new Error(error.message);
  }

  if (!sectorRows || !sectorRows.length) {
    return [] as RouteSummaryRow[];
  }

  const sectorMap = new Map<string, SectorSummaryRow>();
  for (const row of sectorRows as SectorSummaryRow[]) {
    sectorMap.set(row.location, row);
  }

  const payload = ROUTE_NETWORK.filter((route) => sectorMap.has(route.origin) && sectorMap.has(route.destination)).map(
    (route) => buildRouteSummary(route.origin, route.destination, sectorMap)
  );

  if (!payload.length) {
    return [] as RouteSummaryRow[];
  }

  const { data: upserted, error: upsertError } = await supabase
    .from("route_summaries")
    .upsert(payload, { onConflict: "origin_location,destination_location" })
    .select("*");

  if (upsertError) {
    throw new Error(upsertError.message);
  }

  return (upserted ?? []) as RouteSummaryRow[];
}

function buildRouteSummary(
  origin: string,
  destination: string,
  sectorMap: Map<string, SectorSummaryRow>
): RouteSummaryRow {
  const originRow = sectorMap.get(origin)!;
  const destinationRow = sectorMap.get(destination)!;

  const threatScore = average([originRow.threat_score, destinationRow.threat_score]);
  const opportunityScore = average([originRow.opportunity_score, destinationRow.opportunity_score]);
  const baseSafety = clampScore(100 - threatScore * 0.7 + opportunityScore * 0.4);
  const verificationState = mergeVerificationStates(originRow.verification_state, destinationRow.verification_state);
  const confidenceScore = clampScore(average([originRow.confidence_score, destinationRow.confidence_score]));
  const routeState = deriveRouteState(threatScore, confidenceScore, verificationState);
  const advisory = buildAdvisory(originRow, destinationRow, routeState);
  const topSignals = mergeSignals(originRow.top_signals, destinationRow.top_signals);

  return {
    origin_location: origin,
    destination_location: destination,
    threat_score: threatScore,
    safety_score: baseSafety,
    confidence_score: confidenceScore,
    verification_state: verificationState,
    route_state: routeState,
    advisory,
    top_signals: topSignals,
    updated_at: new Date().toISOString()
  };
}

function mergeVerificationStates(a: SectorSummaryRow["verification_state"], b: SectorSummaryRow["verification_state"]) {
  return STATE_PRIORITY[a] <= STATE_PRIORITY[b] ? a : b;
}

function deriveRouteState(
  threatScore: number,
  confidenceScore: number,
  verification: SectorSummaryRow["verification_state"]
) {
  if (threatScore >= 70 && confidenceScore >= 50) {
    return "hostile";
  }

  if (threatScore >= 45 || verification === "contested") {
    return "volatile";
  }

  return "safe";
}

function buildAdvisory(
  origin: SectorSummaryRow,
  destination: SectorSummaryRow,
  routeState: string
): string[] {
  const notes: string[] = [];

  if (routeState === "hostile") {
    notes.push(`Heavy threat signatures between ${origin.location} and ${destination.location}.`);
  } else if (routeState === "volatile") {
    notes.push(`Caution: corridor ${origin.location} ↔ ${destination.location} is shifting.`);
  } else {
    notes.push(`Route ${origin.location} ↔ ${destination.location} remains stable.`);
  }

  const topOriginSignal = firstSignal(origin.top_signals);
  const topDestinationSignal = firstSignal(destination.top_signals);

  if (topOriginSignal) {
    notes.push(`Origin signal: ${topOriginSignal}`);
  }

  if (topDestinationSignal) {
    notes.push(`Destination signal: ${topDestinationSignal}`);
  }

  return notes;
}

function mergeSignals(a: unknown, b: unknown) {
  const arrayA = toStringArray(a);
  const arrayB = toStringArray(b);
  return Array.from(new Set([...arrayA, ...arrayB])).slice(0, 4);
}

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function firstSignal(value: unknown) {
  const array = toStringArray(value);
  return array[0];
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
