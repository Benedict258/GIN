import { createHash } from "node:crypto";
import { Buffer } from "node:buffer";
import { fromBase64 } from "@mysten/bcs";
import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";

type SuiNetwork = "mainnet" | "testnet" | "devnet";

const DEFAULT_FULLNODE_URLS: Record<SuiNetwork, string> = {
  mainnet: "https://fullnode.mainnet.sui.io",
  testnet: "https://fullnode.testnet.sui.io",
  devnet: "https://fullnode.devnet.sui.io"
};

const packageId = process.env.GIN_MOVE_PACKAGE_ID;
const adminCapId = process.env.GIN_MOVE_ADMIN_CAP_ID;
const ginStateId = process.env.GIN_MOVE_STATE_ID;
const privateKey = process.env.GIN_SUI_PRIVATE_KEY;
const ssuExtensionPackageId = process.env.GIN_SSU_EXTENSION_PACKAGE_ID;
const ssuExtensionStateId = process.env.GIN_SSU_EXTENSION_STATE_ID;
const simulateSui = process.env.GIN_SIMULATE_SUI === "true";
const suiNetwork = (process.env.SUI_NETWORK as SuiNetwork | undefined) ?? "testnet";
const suiRpcUrl = process.env.SUI_RPC_URL ?? DEFAULT_FULLNODE_URLS[suiNetwork];

const suiClient = new SuiJsonRpcClient({ url: suiRpcUrl, network: suiNetwork });
let cachedKeypair: Ed25519Keypair | null = null;

export function isSuiConfigured() {
  return simulateSui || Boolean(packageId && adminCapId && ginStateId && privateKey);
}

export function deriveReportDigest(reportId: string, summary: string) {
  const digestBytes = createHash("sha256")
    .update(reportId)
    .update(summary)
    .digest();

  return {
    bytes: Array.from(digestBytes),
    hex: Buffer.from(digestBytes).toString("hex")
  };
}

export function deriveArtifactDigest(artifactType: string, content: Record<string, unknown>) {
  const payload = JSON.stringify(content);
  const digestBytes = createHash("sha256")
    .update(artifactType)
    .update(payload)
    .digest();

  return {
    bytes: Array.from(digestBytes),
    hex: Buffer.from(digestBytes).toString("hex")
  };
}

interface TransactionResult {
  digest: string;
}

export async function publishArtifactOnChain(params: {
  artifactType: string;
  artifactId: string;
  confidenceScore: number;
}): Promise<TransactionResult> {
  if (simulateSui) {
    return simulateTransaction("artifact");
  }

  ensureSuiConfig();

  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::registry::publish_artifact`,
    arguments: [
      tx.object(adminCapId as string),
      tx.object(ginStateId as string),
      tx.pure.vector("u8", encodeString(params.artifactType)),
      tx.pure.vector("u8", encodeString(params.artifactId)),
      tx.pure.u64(BigInt(params.confidenceScore))
    ]
  });

  const signer = getKeypair();

  const result = await suiClient.signAndExecuteTransaction({
    signer,
    transaction: tx,
    options: {
      showEffects: true
    }
  });

  return { digest: result.digest };
}

export async function awardCreditsOnChain(params: {
  contributorAddress: string;
  credits: number;
  reportDigestBytes: number[];
}): Promise<TransactionResult> {
  if (simulateSui) {
    return simulateTransaction("credits");
  }

  ensureSuiConfig();

  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::registry::award_credits`,
    arguments: [
      tx.object(adminCapId as string),
      tx.object(ginStateId as string),
      tx.pure.address(params.contributorAddress),
      tx.pure.u64(BigInt(params.credits)),
      tx.pure.vector("u8", params.reportDigestBytes)
    ]
  });

  const signer = getKeypair();

  const result = await suiClient.signAndExecuteTransaction({
    signer,
    transaction: tx,
    options: {
      showEffects: true
    }
  });

  return { digest: result.digest };
}

export async function recordSsuSubmissionOnChain(params: {
  storageUnitId: string;
  digestHex: string;
  confidenceScore: number;
}): Promise<TransactionResult> {
  if (simulateSui) {
    return simulateTransaction("ssu-submission");
  }

  if (!ssuExtensionPackageId || !ssuExtensionStateId) {
    throw new Error("SSU extension package or state ID is not configured");
  }

  ensureSuiConfig();

  const tx = new Transaction();
  const digestBytes = hexToBytes(params.digestHex);

  tx.moveCall({
    target: `${ssuExtensionPackageId}::gin_extension::record_submission`,
    arguments: [
      tx.object(ssuExtensionStateId),
      tx.object(params.storageUnitId),
      tx.pure.vector("u8", digestBytes),
      tx.pure.u64(BigInt(params.confidenceScore))
    ]
  });

  const signer = getKeypair();

  const result = await suiClient.signAndExecuteTransaction({
    signer,
    transaction: tx,
    options: {
      showEffects: true
    }
  });

  return { digest: result.digest };
}

function ensureSuiConfig() {
  if (!simulateSui && !isSuiConfigured()) {
    throw new Error("Sui integration is not configured");
  }
}

function getKeypair() {
  if (cachedKeypair) {
    return cachedKeypair;
  }

  if (!privateKey) {
    throw new Error("Missing GIN_SUI_PRIVATE_KEY environment variable");
  }

  const normalized = normalizePrivateKey(privateKey);
  const secret = fromBase64(normalized);
  const seed = secret.length === 64 ? secret.slice(0, 32) : secret;
  cachedKeypair = Ed25519Keypair.fromSecretKey(seed);
  return cachedKeypair;
}

function normalizePrivateKey(value: string) {
  const trimmed = value.trim();

  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as [string, string];
      return parsed[1];
    } catch (error) {
      throw new Error("Failed to parse JSON formatted private key");
    }
  }

  if (trimmed.startsWith("0x")) {
    const hex = trimmed.slice(2);
    return Buffer.from(hex, "hex").toString("base64");
  }

  return trimmed;
}

function encodeString(value: string) {
  return Array.from(new TextEncoder().encode(value));
}

function hexToBytes(hex: string) {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  return Array.from(Buffer.from(clean, "hex"));
}

function simulateTransaction(prefix: string): TransactionResult {
  return {
    digest: `0x${prefix}-${Date.now().toString(16)}`
  };
}
