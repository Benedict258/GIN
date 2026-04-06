type WorldApiJump = {
  origin?: { name?: string };
  destination?: { name?: string };
  time?: string;
};

const WORLD_API_URL = process.env.EVE_FRONTIER_WORLD_API_URL;
const WORLD_API_TOKEN = process.env.EVE_FRONTIER_WORLD_API_TOKEN;

export async function fetchLiveWorldSignals(options?: { sector?: string; limit?: number }) {
  if (!WORLD_API_URL) {
    return [];
  }

  try {
    const url = new URL("/v2/characters/me/jumps", WORLD_API_URL);
    const headers: Record<string, string> = {
      Accept: "application/json"
    };
    if (WORLD_API_TOKEN) {
      headers.Authorization = `Bearer ${WORLD_API_TOKEN}`;
    }
    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as { data?: WorldApiJump[] };
    const jumps = payload.data ?? [];

    const signals = jumps.map((jump, index) => {
      const origin = jump.origin?.name ?? "Unknown origin";
      const destination = jump.destination?.name ?? "Unknown destination";
      return {
        id: `live-jump-${index}-${jump.time ?? Date.now()}`,
        sector: options?.sector ?? origin,
        signalType: "jump_activity",
        summary: `Jump detected from ${origin} to ${destination}.`,
        confidenceScore: 62,
        metadata: {
          source: "world-api",
          origin,
          destination
        },
        observedAt: jump.time ?? new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
    });

    if (options?.sector) {
      return signals.filter((signal) => signal.sector.toLowerCase() === options.sector!.toLowerCase());
    }

    return signals.slice(0, options?.limit ?? 6);
  } catch {
    return [];
  }
}
