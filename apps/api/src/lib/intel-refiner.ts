import type { CreateReportInput } from "@gin/shared";
import { REFINEMENT_OUTPUT_SCHEMA, REFINEMENT_SYSTEM_PROMPT, TRANSLATION_SYSTEM_PROMPT } from "./llm-prompts.js";

type RefinementMetadata = {
  rawSummary: string;
  rawLocation: string;
  refinedSummary: string;
  refinedLocation: string;
  translator: "stub";
  mode: "pre-llm";
  prompts: {
    translation: string;
    refinement: string;
    schema: string;
  };
};

function normalizeField(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function refineReportInput(payload: CreateReportInput): CreateReportInput {
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

