import {
  CreateReportInput,
  AwardCreditsRequest,
  AwardCreditsResponse,
  PublishArtifactInput,
  PublishArtifactResponse,
  awardCreditsRequestSchema,
  awardCreditsResponseSchema,
  createReportSchema,
  profileConnectInputSchema,
  profileConnectResponseSchema,
  publishArtifactInputSchema,
  publishArtifactResponseSchema,
  recommendationSchema,
  sectorSummarySchema
} from "@gin/shared";

type SectorResponse = { sectors?: unknown };
type RecommendationResponse = { recommendations?: unknown };
type ReportResponse = { report?: unknown };
type ProfileConnectResponse = unknown;

const serverApiBaseUrl =
  process.env.GIN_API_URL ?? process.env.NEXT_PUBLIC_GIN_API_URL ?? "http://localhost:4000";

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
  const response = await fetch(`${getServerApiBaseUrl()}/api/intel/sectors`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Failed to load sectors: ${response.status}`);
  }

  const json = (await response.json()) as SectorResponse;
  const sectors = sectorSummarySchema.array().parse(json.sectors ?? []);
  return sectors;
}

export async function fetchRecommendations() {
  const response = await fetch(`${getServerApiBaseUrl()}/api/intel/recommendations`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Failed to load recommendations: ${response.status}`);
  }

  const json = (await response.json()) as RecommendationResponse;
  const recommendations = recommendationSchema.array().parse(json.recommendations ?? []);
  return recommendations;
}

export async function submitReport(payload: CreateReportInput) {
  const response = await fetch(`${getBrowserApiBaseUrl()}/api/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
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

export async function connectProfile(walletAddress: string) {
  const payload = profileConnectInputSchema.parse({ walletAddress });

  const response = await fetch(`${getBrowserApiBaseUrl()}/api/profiles/connect`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
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

export async function publishArtifact(payload: PublishArtifactInput) {
  const body = publishArtifactInputSchema.parse(payload);

  const response = await fetch(`${getBrowserApiBaseUrl()}/api/contracts/publish-artifact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
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

export async function awardCredits(payload: AwardCreditsRequest) {
  const body = awardCreditsRequestSchema.parse(payload);

  const response = await fetch(`${getBrowserApiBaseUrl()}/api/contracts/award-credits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
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

async function extractError(response: Response) {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error ?? `Request failed (${response.status})`;
  } catch (error) {
    return `Request failed (${response.status})`;
  }
}
