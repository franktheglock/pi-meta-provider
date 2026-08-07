import { createProvider, openAICompletionsApi } from "@earendil-works/pi-ai";
import { envApiKeyAuth } from "@earendil-works/pi-ai/dist/auth/helpers.js";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

/**
 * Meta Model API provider for pi.
 *
 * api.meta.ai · Muse Spark (agentic coding / reasoning)
 * Docs: https://dev.meta.ai/docs/overview
 *
 * Auth resolution (in order):
 *   1. Stored credential from `/login meta`  (~/.pi/agent/auth.json)
 *   2. MODEL_API_KEY env var  (Meta's documented var, also used by Muse Code/OpenCode)
 *   3. META_API_KEY env var   (alternate)
 *
 * Override the endpoint with META_BASE_URL if you run a proxy:
 *   export META_BASE_URL="https://your-proxy.example.com/v1"
 */

const BASE_URL = process.env.META_BASE_URL || "https://api.meta.ai/v1";

/**
 * Muse Spark always reasons, so there is no "off" level ("none" is rejected
 * with HTTP 400). Mapping "off" to `null` omits `reasoning_effort` entirely,
 * letting the model use its default reasoning depth. "max" maps to "xhigh",
 * the deepest level Meta exposes.
 */
const thinkingLevelMap = {
  off: null,
  minimal: "minimal",
  low: "low",
  medium: "medium",
  high: "high",
  xhigh: "xhigh",
  max: "xhigh",
} as const;

/**
 * Compatibility settings for the OpenAI-compatible Chat Completions surface:
 * - Top-level `reasoning_effort` on /v1/chat/completions.
 * - Meta treats `developer` as its highest-precedence instruction role.
 * - `max_tokens` is deprecated; `max_completion_tokens` is preferred.
 * - Meta accepts the `prompt_cache_retention: "24h"` hint when the user opts
 *   into long cache retention (PI_CACHE_RETENTION=long).
 */
const compat = {
  supportsReasoningEffort: true,
  supportsDeveloperRole: true,
  maxTokensField: "max_completion_tokens",
  supportsLongCacheRetention: true,
} as const;

export default function (pi: ExtensionAPI) {
  pi.registerProvider(
    createProvider({
      id: "meta",
      name: "Meta",
      baseUrl: BASE_URL,
      auth: {
        apiKey: envApiKeyAuth("Meta Model API key", ["MODEL_API_KEY", "META_API_KEY"]),
      },
      models: [
        {
          id: "muse-spark-1.1",
          name: "Muse Spark 1.1",
          reasoning: true,
          thinkingLevelMap,
          input: ["text", "image"],
          cost: { input: 1.25, output: 4.25, cacheRead: 0.15, cacheWrite: 0.15 },
          contextWindow: 1_048_576,
          maxTokens: 131_072,
          compat,
        },
        {
          id: "muse-spark-1.2",
          name: "Muse Spark 1.2",
          reasoning: true,
          thinkingLevelMap,
          input: ["text", "image"],
          cost: { input: 1.25, output: 4.25, cacheRead: 0.15, cacheWrite: 0.15 },
          contextWindow: 1_048_576,
          maxTokens: 131_072,
          compat,
        },
        {
          id: "muse-spark-1.2-contributor",
          name: "Muse Spark 1.2 Contributor",
          reasoning: true,
          thinkingLevelMap,
          input: ["text", "image"],
          cost: { input: 0.1, output: 0.2, cacheRead: 0.002, cacheWrite: 0.002 },
          contextWindow: 1_048_576,
          maxTokens: 131_072,
          compat,
        },
      ],
      api: openAICompletionsApi(),
    }),
  );
}
