import {
  factionIntelSchema,
  routeSummarySchema,
  sectorSummarySchema,
  structuredIntelSnapshotSchema,
  walrusArtifactContentSchema
} from "@gin/shared";
import { supabase } from "./supabase.js";
import { recomputeSectorSummaries } from "./sector-intel.js";
import { recomputeRouteSummaries } from "./route-intel.js";
import { recomputeFactionIntel } from "./faction-intel.js";
import { isWalrusConfigured, pinWalrusArtifact } from "./walrus.js";
import { publishArtifactOnChain, isSuiConfigured } from "./contracts.js";
import type { StructuredIntelSnapshotRow } from "./database.types.js";

export type StructuredSnapshotOptions = {
  publishArtifact?: boolean;
  confidenceScore: number;
  skipRecompute?: boolean;
};

export async function createStructuredSnapshot(options: StructuredSnapshotOptions) {
  if (!options.skipRecompute) {
    await recomputeSectorSummaries();
    await recomputeRouteSummaries();
    await recomputeFactionIntel();
  }

  const [sectors, routes, factions] = await Promise.all([
    fetchSectors(),
    fetchRoutes(),
    fetchFactions()
  ]);

  const payload = {
    sectors,
    routes,
    factions,
    generatedAt: new Date().toISOString()
  } satisfies Record<string, unknown>;

  let walrusBlobId: string | undefined;

  if (options.publishArtifact && isWalrusConfigured()) {
    walrusBlobId = await publishSnapshotArtifact({ payload, confidenceScore: options.confidenceScore });
  }

  const { data, error } = await supabase
    .from("structured_intel_snapshots")
    .insert({
      snapshot_type: "standard",
      payload,
      walrus_blob_id: walrusBlobId ?? null,
      route_count: routes.length,
      sector_count: sectors.length,
      faction_count: factions.length
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to create snapshot");
  }

  return structuredIntelSnapshotSchema.parse({
    id: (data as StructuredIntelSnapshotRow).id,
    snapshotType: (data as StructuredIntelSnapshotRow).snapshot_type,
    sectors,
    routes,
    factions,
    walrusBlobId: (data as StructuredIntelSnapshotRow).walrus_blob_id ?? undefined,
    createdAt: (data as StructuredIntelSnapshotRow).created_at
  });
}

async function fetchSectors() {
  const { data, error } = await supabase.from("sector_summaries").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) =>
    sectorSummarySchema.parse({
      location: row.location,
      threatScore: row.threat_score,
      opportunityScore: row.opportunity_score,
      confidenceScore: row.confidence_score,
      verificationState: row.verification_state,
      topSignals: parseArray(row.top_signals),
      updatedAt: row.updated_at
    })
  );
}

async function fetchRoutes() {
  const { data, error } = await supabase.from("route_summaries").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) =>
    routeSummarySchema.parse({
      origin: row.origin_location,
      destination: row.destination_location,
      threatScore: row.threat_score,
      safetyScore: row.safety_score,
      confidenceScore: row.confidence_score,
      verificationState: row.verification_state,
      routeState: normalizeRouteState(row.route_state),
      advisory: parseArray(row.advisory),
      topSignals: parseArray(row.top_signals),
      updatedAt: row.updated_at
    })
  );
}

async function fetchFactions() {
  const { data, error } = await supabase.from("faction_intel_summaries").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) =>
    factionIntelSchema.parse({
      faction: row.faction,
      reportCount: row.report_count,
      verifiedCount: row.verified_count,
      avgConfidence: row.avg_confidence,
      dominantSignal: row.dominant_signal,
      topLocations: parseArray(row.top_locations),
      updatedAt: row.updated_at
    })
  );
}

async function publishSnapshotArtifact(params: { payload: Record<string, unknown>; confidenceScore: number }) {
  if (!isWalrusConfigured()) {
    return undefined;
  }

  if (!isSuiConfigured()) {
    return undefined;
  }

  const walrusResult = await pinWalrusArtifact({
    artifactType: "structured_snapshot",
    confidenceScore: params.confidenceScore,
    content: walrusArtifactContentSchema.parse({
      title: `GIN Snapshot ${new Date().toISOString()}`,
      summary: `Sectors: ${params.payload.sectors instanceof Array ? params.payload.sectors.length : 0}, Routes: ${
        params.payload.routes instanceof Array ? params.payload.routes.length : 0
      }, Factions: ${params.payload.factions instanceof Array ? params.payload.factions.length : 0}.`,
      evidence: ["Snapshot includes verified sector, route, and faction intel"],
      relatedLocations: extractLocations(params.payload),
      metadata: params.payload
    })
  });

  await publishArtifactOnChain({
    artifactType: "structured_snapshot",
    walrusBlobId: walrusResult.blobId,
    confidenceScore: params.confidenceScore
  });

  return walrusResult.blobId;
}

function extractLocations(payload: Record<string, unknown>) {
  const sectors = Array.isArray(payload.sectors) ? payload.sectors : [];
  return sectors
    .slice(0, 3)
    .map((sector: unknown) => (typeof sector === "object" && sector && "location" in sector ? (sector as Record<string, unknown>).location : undefined))
    .filter((value): value is string => typeof value === "string");
}

function parseArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function normalizeRouteState(value: string | null | undefined) {
  if (value === "hostile" || value === "volatile" || value === "safe") {
    return value;
  }

  return "safe";
}
