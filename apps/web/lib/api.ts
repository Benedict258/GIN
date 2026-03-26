import {
  AwardCreditsRequest,
  AwardCreditsResponse,
  CreateReportInput,
  PublishArtifactInput,
  PublishArtifactResponse,
  awardCreditsRequestSchema,
  awardCreditsResponseSchema,
  createReportSchema,
  factionIntelSchema,
  profileConnectInputSchema,
  profileConnectResponseSchema,
  publishArtifactInputSchema,
  publishArtifactResponseSchema,
  recommendationSchema,
  routeSummarySchema,
  sectorSummarySchema,
  structuredIntelSnapshotSchema,
  accessStatusResponseSchema,
  creditsLedgerResponseSchema
} from "@gin/shared";

type SectorResponse = { sectors?: unknown };
type RecommendationResponse = { recommendations?: unknown };
type ReportsResponse = { reports?: unknown };
type ReportResponse = { report?: unknown };
type RoutesResponse = { routes?: unknown };
type FactionResponse = { factions?: unknown };
type SnapshotResponse = { snapshot?: unknown };
type ProfileConnectResponse = unknown;
type AccessStatusPayload = unknown;
type CreditsLedgerPayload = unknown;

const serverApiBaseUrl = process.env.GIN_API_URL ?? process.env.NEXT_PUBLIC_GIN_API_URL ?? "http://localhost:4000";

export function getServerApiBaseUrl() {
  return serverApiBaseUrl;
}

export function getBrowserApiBaseUrl() {
  if (typeof window === "undefined") {
    return serverApiBaseUrl;
  }

  return process.env.NEXT_PUBLIC_GIN_API_URL ?? serverApiBaseUrl;
}

export async function fetchSectorIntel() {
  const response = await fetch(`${getServerApiBaseUrl()}/api/intel/sectors`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to load sectors: ${response.status}`);
  }

  const json = (await response.json()) as SectorResponse;
  return sectorSummarySchema.array().parse(json.sectors ?? []);
}

export async function fetchRecommendations() {
  const response = await fetch(`${getServerApiBaseUrl()}/api/intel/recommendations`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to load recommendations: ${response.status}`);
  }

  const json = (await response.json()) as RecommendationResponse;
  return recommendationSchema.array().parse(json.recommendations ?? []);
}

export async function fetchRecentReports() {
  const response = await fetch(`${getServerApiBaseUrl()}/api/intel/reports`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to load reports: ${response.status}`);
  }

  const json = (await response.json()) as ReportsResponse;
  return createReportSchema.array().parse(json.reports ?? []);
}

export async function fetchRouteIntel() {
  const response = await fetch(`${getServerApiBaseUrl()}/api/intel/routes`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to load routes: ${response.status}`);
  }

  const json = (await response.json()) as RoutesResponse;
  return routeSummarySchema.array().parse(json.routes ?? []);
}

export async function fetchFactionIntel() {
  const response = await fetch(`${getServerApiBaseUrl()}/api/intel/factions`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to load faction intel: ${response.status}`);
  }

  const json = (await response.json()) as FactionResponse;
  return factionIntelSchema.array().parse(json.factions ?? []);
}

export async function fetchLatestSnapshot() {
  const response = await fetch(`${getServerApiBaseUrl()}/api/intel/snapshots/latest`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to load snapshot: ${response.status}`);
  }

  const json = (await response.json()) as SnapshotResponse;
  return json.snapshot ? structuredIntelSnapshotSchema.parse(json.snapshot) : null;
}

export async function recomputeRouteIntel() {
  const response = await fetch(`${getServerApiBaseUrl()}/api/intel/routes/recompute`, {
    method: "POST",
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Failed to recompute routes: ${response.status}`);
  }

  const json = (await response.json()) as RoutesResponse;
  return routeSummarySchema.array().parse(json.routes ?? []);
}

export async function recomputeFactionIntel() {
  const response = await fetch(`${getServerApiBaseUrl()}/api/intel/factions/recompute`, {
    method: "POST",
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Failed to recompute faction intel: ${response.status}`);
  }

  const json = (await response.json()) as FactionResponse;
  return factionIntelSchema.array().parse(json.factions ?? []);
}

export async function createStructuredSnapshot(payload: { publishArtifact?: boolean; confidenceScore: number }) {
  const response = await fetch(`${getServerApiBaseUrl()}/api/intel/snapshots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Failed to create snapshot: ${response.status}`);
  }

  const json = (await response.json()) as SnapshotResponse;
  if (!json.snapshot) {
    throw new Error("Snapshot payload missing from response");
  }

  return structuredIntelSnapshotSchema.parse(json.snapshot);
}

export async function submitReport(payload: CreateReportInput, auditWallet?: string) {
  const response = await fetch(`${getBrowserApiBaseUrl()}/api/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...walletHeader(auditWallet)
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const message = await extractError(response);
    throw new Error(message);
  }

  const json = (await response.json()) as ReportResponse;
  return createReportSchema.parse(json.report);
}

export async function connectProfile(walletAddress: string, auditWallet?: string) {
  const payload = profileConnectInputSchema.parse({ walletAddress });

  const response = await fetch(`${getBrowserApiBaseUrl()}/api/profiles/connect`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...walletHeader(auditWallet ?? walletAddress)
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const message = await extractError(response);
    throw new Error(message);
  }

  const json = (await response.json()) as ProfileConnectResponse;
  return profileConnectResponseSchema.parse(json);
}

export async function publishArtifact(payload: PublishArtifactInput, auditWallet?: string) {
  const body = publishArtifactInputSchema.parse(payload);

  const response = await fetch(`${getBrowserApiBaseUrl()}/api/contracts/publish-artifact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...walletHeader(auditWallet)
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const message = await extractError(response);
    throw new Error(message);
  }

  const json = await response.json();
  return publishArtifactResponseSchema.parse(json) as PublishArtifactResponse;
}

export async function awardCredits(payload: AwardCreditsRequest, auditWallet?: string) {
  const body = awardCreditsRequestSchema.parse(payload);

  const response = await fetch(`${getBrowserApiBaseUrl()}/api/contracts/award-credits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...walletHeader(auditWallet)
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const message = await extractError(response);
    throw new Error(message);
  }

  const json = await response.json();
  return awardCreditsResponseSchema.parse(json) as AwardCreditsResponse;
}

export async function fetchAccessStatus(profileId: string, auditWallet?: string) {
  const url = new URL(`${getBrowserApiBaseUrl()}/api/access/status`);
  url.searchParams.set("profileId", profileId);

  const response = await fetch(url.toString(), {
    cache: "no-store",
    headers: walletHeader(auditWallet)
  });

  if (!response.ok) {
    const message = await extractError(response);
    throw new Error(message);
  }

  const json = (await response.json()) as AccessStatusPayload;
  return accessStatusResponseSchema.parse(json);
}

export async function fetchCreditsLedger(profileId: string, limit = 25, auditWallet?: string, cursor?: string) {
  const url = new URL(`${getBrowserApiBaseUrl()}/api/credits/ledger`);
  url.searchParams.set("profileId", profileId);
  url.searchParams.set("limit", String(limit));
  if (cursor) {
    url.searchParams.set("cursor", cursor);
  }

  const response = await fetch(url.toString(), {
    cache: "no-store",
    headers: walletHeader(auditWallet)
  });

  if (!response.ok) {
    const message = await extractError(response);
    throw new Error(message);
  }

  const json = (await response.json()) as CreditsLedgerPayload;
  const parsed = creditsLedgerResponseSchema.parse(json);
  return parsed.events;
}

async function extractError(response: Response) {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error ?? `Request failed (${response.status})`;
  } catch (error) {
    return `Request failed (${response.status})`;
  }
}

function walletHeader(walletAddress?: string) {
  return walletAddress ? { "X-Wallet-Address": walletAddress } : {};
}
