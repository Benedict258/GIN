export interface WalrusArtifactPayload {
  artifactType: string;
  content: Record<string, unknown>;
  confidenceScore: number;
}

export interface WalrusPinResult {
  blobId: string;
  provider: string;
  url: string;
  metadata: {
    stored: boolean;
    network: string;
    artifactType: string;
    confidenceScore: number;
  };
  proof?: string;
}

const WALRUS_ENABLED = String(process.env.WALRUS_ENABLED ?? "false").toLowerCase() === "true";

export function isWalrusConfigured() {
  return WALRUS_ENABLED;
}

export async function pinWalrusArtifact(payload: WalrusArtifactPayload): Promise<WalrusPinResult> {
  if (!WALRUS_ENABLED) {
    throw new Error("Walrus integration is disabled");
  }

  const artifactId = `walrus_${Date.now()}`;

  return {
    blobId: artifactId,
    provider: "simulated-walrus",
    url: `https://mock-walrus.local/${artifactId}`,
    metadata: {
      stored: true,
      network: "simulated-walrus",
      artifactType: payload.artifactType,
      confidenceScore: payload.confidenceScore
    },
    proof: undefined
  };
}
