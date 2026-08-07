import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

/**
 * Meta Model API provider for pi.
 *
 * api.meta.ai · Muse Spark (agentic coding / reasoning)
 * Docs: https://ai.developer.meta.com/docs/overview
 * Quickstart: https://dev.meta.ai/docs/overview/?team_id=1546437390301451&project_id=1576060060667031
 *
 * Auth: MODEL_API_KEY (or META_API_KEY), or /login meta.
 * Override endpoint with META_BASE_URL if you run a proxy.
 */

const BASE_URL = process.env.META_BASE_URL || "https://api.meta.ai/v1";

const THINKING_MAP = {
  off: null as unknown as string,
  minimal: "minimal",
  low: "low",
  medium: "medium",
  high: "high",
  xhigh: "xhigh",
  max: "xhigh",
} as const;

export default function (pi: ExtensionAPI) {
  pi.registerProvider("meta", {
    name: "Meta",
    baseUrl: BASE_URL,
    api: "openai-completions",
    // $VAR is expanded by pi at request time (not at extension load time)
    apiKey: "$MODEL_API_KEY",
    models: [
      {
        id: "muse-spark-1.1",
        name: "Muse Spark 1.1",
        reasoning: true,
        thinkingLevelMap: { ...THINKING_MAP },
        input: ["text", "image"],
        cost: { input: 1.25, output: 4.25, cacheRead: 0.15, cacheWrite: 0.15 },
        contextWindow: 1_048_576,
        maxTokens: 131_072,
      },
      {
        id: "muse-spark-1.2",
        name: "Muse Spark 1.2",
        reasoning: true,
        thinkingLevelMap: { ...THINKING_MAP },
        input: ["text", "image"],
        cost: { input: 1.25, output: 4.25, cacheRead: 0.15, cacheWrite: 0.15 },
        contextWindow: 1_048_576,
        maxTokens: 131_072,
      },
      {
        id: "muse-spark-1.2-contributor",
        name: "Muse Spark 1.2 Contributor",
        reasoning: true,
        thinkingLevelMap: { ...THINKING_MAP },
        input: ["text", "image"],
        cost: { input: 0.1, output: 0.2, cacheRead: 0.002, cacheWrite: 0.002 },
        contextWindow: 1_048_576,
        maxTokens: 131_072,
      },
    ],
  });

  // Also accept META_API_KEY as a fallback when MODEL_API_KEY is unset.
  // registerProvider's apiKey only supports one $VAR; handle the fallback
  // by injecting the header right before the request is sent.
  pi.on("before_provider_headers", (event, ctx) => {
    // Only for meta requests
    const model = (ctx as unknown as { model?: { provider?: string } }).model;
    if (model?.provider !== "meta") return;
    const hasAuth = event.headers["authorization"] || event.headers["Authorization"];
    if (hasAuth) return;
    const fallback = process.env.META_API_KEY;
    if (fallback) event.headers["Authorization"] = `Bearer ${fallback}`;
  });
}
