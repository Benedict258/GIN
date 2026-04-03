import type { CreateReportInput } from "@gin/shared";
import { REFINEMENT_OUTPUT_SCHEMA, REFINEMENT_SYSTEM_PROMPT, TRANSLATION_SYSTEM_PROMPT } from "./llm-prompts.js";
import { isLlmConfigured, runGroqChat } from "./llm-client.js";

type RefinementMetadata = {
  rawSummary: string;
  rawLocation: string;
  refinedSummary: string;
  refinedLocation: string;
  translator: "stub" | "groq";
  mode: "pre-llm" | "llm";
  prompts: {
    translation: string;
    refinement: string;
    schema: string;
  };
};

function normalizeField(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export async function refineReportInput(payload: CreateReportInput): Promise<CreateReportInput> {
  if (isLlmConfigured()) {
    const refined = await refineWithLLM(payload);
    if (refined) {
      return refined;
    }
  }

  const refinedSummary = normalizeField(payload.summary);
  const refinedLocation = normalizeField(payload.location);
  const metadata = {
    ...(payload.metadata ?? {}),
    refinement: {
      rawSummary: payload.summary,
      rawLocation: payload.location,
      refinedSummary,
      refinedLocation,
      translator: "stub",
      mode: "pre-llm",
      prompts: {
        translation: TRANSLATION_SYSTEM_PROMPT,
        refinement: REFINEMENT_SYSTEM_PROMPT,
        schema: REFINEMENT_OUTPUT_SCHEMA
      }
    } satisfies RefinementMetadata
  };

  return {
    ...payload,
    summary: refinedSummary,
    location: refinedLocation,
    metadata
  };
}

async function refineWithLLM(payload: CreateReportInput): Promise<CreateReportInput | null> {
  const userPayload = JSON.stringify(
    {
      location: payload.location,
      summary: payload.summary,
      signalType: payload.signalType,
      source: payload.source,
      intensity: payload.intensity,
      importanceScore: payload.importanceScore,
      factionTag: payload.factionTag
    },
    null,
    2
  );

  const response = await runGroqChat({
    system: `${TRANSLATION_SYSTEM_PROMPT}\n\n${REFINEMENT_SYSTEM_PROMPT}\n\nReturn only JSON using this schema:\n${REFINEMENT_OUTPUT_SCHEMA}`,
    user: userPayload,
    temperature: 0.1,
    maxTokens: 400
  });

  if (!response) {
    return null;
  }

  const parsed = safeJsonParse(response);
  if (!parsed) {
    return null;
  }

  const refinedSummary = typeof parsed.summary === "string" ? normalizeField(parsed.summary) : normalizeField(payload.summary);
  const refinedLocation = typeof parsed.location === "string" ? normalizeField(parsed.location) : normalizeField(payload.location);

  const metadata = {
    ...(payload.metadata ?? {}),
    refinement: {
      rawSummary: payload.summary,
      rawLocation: payload.location,
      refinedSummary,
      refinedLocation,
      translator: "groq",
      mode: "llm",
      prompts: {
        translation: TRANSLATION_SYSTEM_PROMPT,
        refinement: REFINEMENT_SYSTEM_PROMPT,
        schema: REFINEMENT_OUTPUT_SCHEMA
      }
    } satisfies RefinementMetadata
  };

  return {
    ...payload,
    summary: refinedSummary,
    location: refinedLocation,
    metadata
  };
}

function safeJsonParse(value: string): Record<string, unknown> | null {
  const trimmed = value.trim();
  const jsonStart = trimmed.indexOf("{");
  const jsonEnd = trimmed.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    return null;
  }

  try {
    return JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}
