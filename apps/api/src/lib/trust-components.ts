import { confidenceComponentsSchema } from "@gin/shared";
import type { Json } from "./database.types.js";

export const DEFAULT_CONFIDENCE_COMPONENTS = {
  base: 0,
  consensus: 0,
  recency: 0,
  reputation: 0,
  diversity: 0
} as const;

export function ensureConfidenceComponents(value: Json | null) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return DEFAULT_CONFIDENCE_COMPONENTS;
  }

  const parsed = confidenceComponentsSchema.safeParse(value);

  if (parsed.success) {
    return parsed.data;
  }

  const record = value as Record<string, unknown>;
  return {
    base: normalizeComponent(record.base),
    consensus: normalizeComponent(record.consensus),
    recency: normalizeComponent(record.recency),
    reputation: normalizeComponent(record.reputation),
    diversity: normalizeComponent(record.diversity)
  };
}

function normalizeComponent(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  return 0;
}
