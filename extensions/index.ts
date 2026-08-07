import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

/**
 * Meta Model API provider for pi.
 *
 * Serves Muse Spark, Meta's model family for agentic and coding workflows,
 * through an OpenAI-compatible Chat Completions endpoint.
 *
 * Docs: https://dev.meta.ai/docs/overview
 */

const BASE_URL = "https://api.meta.ai/v1";

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
  pi.registerProvider("meta", {
    name: "Meta",
    baseUrl: BASE_URL,
    apiKey: "$MODEL_API_KEY",
    api: "openai-completions",
    models: [
      {
        id: "muse-spark-1.1",
        name: "Muse Spark 1.1",
        reasoning: true,
        thinkingLevelMap,
        input: ["text", "image"],
        cost: { input: 1.25, output: 4.25, cacheRead: 0.15, cacheWrite: 0.15 },
        contextWindow: 1048576,
        maxTokens: 131072,
        compat,
      },
      {
        id: "muse-spark-1.2",
        name: "Muse Spark 1.2",
        reasoning: true,
        thinkingLevelMap,
        input: ["text", "image"],
        cost: { input: 1.25, output: 4.25, cacheRead: 0.15, cacheWrite: 0.15 },
        contextWindow: 1048576,
        maxTokens: 131072,
        compat,
      },
      {
        id: "muse-spark-1.2-contributor",
        name: "Muse Spark 1.2 Contributor",
        reasoning: true,
        thinkingLevelMap,
        input: ["text", "image"],
        cost: { input: 0.1, output: 0.2, cacheRead: 0.002, cacheWrite: 0.002 },
        contextWindow: 1048576,
        maxTokens: 131072,
        compat,
      },
    ],
  });
}
