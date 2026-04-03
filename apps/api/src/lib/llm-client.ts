type GroqChatInput = {
  system: string;
  user: string;
  temperature?: number;
  maxTokens?: number;
};

const GROQ_API_URL = process.env.GIN_GROQ_API_URL ?? "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GIN_GROQ_API_KEY;
const DEFAULT_MODEL = process.env.GIN_LLM_MODEL ?? "qwen-2.5-7b-instruct";

export function isLlmConfigured() {
  return Boolean(GROQ_API_KEY);
}

export async function runGroqChat(input: GroqChatInput): Promise<string | null> {
  if (!GROQ_API_KEY) {
    return null;
  }

  const body = {
    model: DEFAULT_MODEL,
    temperature: input.temperature ?? 0.2,
    max_tokens: input.maxTokens ?? 512,
    messages: [
      { role: "system", content: input.system },
      { role: "user", content: input.user }
    ]
  };

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content?.trim() ?? null;
}

