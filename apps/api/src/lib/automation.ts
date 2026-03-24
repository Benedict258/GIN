import type { StructuredIntelSnapshot } from "@gin/shared";
import { recomputeSectorSummaries } from "./sector-intel.js";
import { recomputeRouteSummaries } from "./route-intel.js";
import { recomputeFactionIntel } from "./faction-intel.js";
import { createStructuredSnapshot } from "./structured-intel.js";

export type IntelAutomationOptions = {
  confidenceScore: number;
  publishArtifact?: boolean;
  snapshot?: boolean;
};

export type IntelAutomationResult = {
  sectorsRecomputed: number;
  routesRecomputed: number;
  factionsRecomputed: number;
  snapshot?: StructuredIntelSnapshot;
};

export async function runIntelAutomationCycle(options: IntelAutomationOptions): Promise<IntelAutomationResult> {
  const [sectors, routes, factions] = await Promise.all([
    recomputeSectorSummaries(),
    recomputeRouteSummaries(),
    recomputeFactionIntel()
  ]);

  let snapshot: StructuredIntelSnapshot | undefined;

  if (options.snapshot !== false) {
    snapshot = await createStructuredSnapshot({
      publishArtifact: options.publishArtifact,
      confidenceScore: options.confidenceScore,
      skipRecompute: true
    });
  }

  return {
    sectorsRecomputed: sectors.length,
    routesRecomputed: routes.length,
    factionsRecomputed: factions.length,
    snapshot
  };
}
