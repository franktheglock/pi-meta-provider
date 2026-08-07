import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

/**
 * Meta Model API provider for pi.
 *
 * api.meta.ai · Muse Spark (agentic coding / reasoning)
 * Base URL: https://api.meta.ai/v1
 * API: OpenAI-compatible Chat Completions
 * Docs: https://ai.developer.meta.com/docs/overview
 *
 * Auth:
 *   1. MODEL_API_KEY env var (dashboard → API keys → Create key) — also read by Meta's OpenCode/Muse Code setup
 *   2. /login meta  (persists to ~/.pi/agent/auth.json)
 *   3. META_API_KEY env var (alternate)
 *
 * Override base URL with META_BASE_URL if you run a proxy.
 */

const BASE_URL = process.env.META_BASE_URL || "https://api.meta.ai/v1";
const API_KEY = process.env.MODEL_API_KEY || process.env.META_API_KEY || "";

export default function (pi: ExtensionAPI) {
  pi.registerProvider("meta", {
    name: "Meta",
    baseUrl: BASE_URL,
    api: "openai-completions",
    apiKey: API_KEY || undefined,

    // OAuth-style /login flow: prompt for the Model API key and keep it
    // in ~/.pi/agent/auth.json (100-year expiry — rotate with /login meta again).
    oauth: {
      name: "Meta (api.meta.ai — MODEL_API_KEY)",

      async login(callbacks) {
        const key = await callbacks.onPrompt({
          message:
            "Enter your Meta Model API key (dev.meta.ai → dashboard → API keys → Create key). Stored as MODEL_API_KEY:",
        });
        const k = key.trim();
        if (!k) throw new Error("No API key entered");
        return {
          refresh: k,
          access: k,
          expires: Date.now() + 100 * 365 * 24 * 60 * 60 * 1000,
        };
      },

      async refreshToken(credentials) {
        return credentials;
      },

      getApiKey(credentials) {
        return credentials.access;
      },
    },

    models: [
      {
        id: "muse-spark-1.1",
        name: "Muse Spark 1.1",
        reasoning: true,
        thinkingLevelMap: {
          off: null,
          minimal: "minimal",
          low: "low",
          medium: "medium",
          high: "high",
          xhigh: "xhigh",
          max: "xhigh",
        },
        input: ["text", "image"],
        cost: { input: 1.25, output: 4.25, cacheRead: 0.15, cacheWrite: 0.15 },
        contextWindow: 1_048_576,
        maxTokens: 131_072,
      },
      {
        id: "muse-spark-1.2",
        name: "Muse Spark 1.2",
        reasoning: true,
        thinkingLevelMap: {
          off: null,
          minimal: "minimal",
          low: "low",
          medium: "medium",
          high: "high",
          xhigh: "xhigh",
          max: "xhigh",
        },
        input: ["text", "image"],
        cost: { input: 1.25, output: 4.25, cacheRead: 0.15, cacheWrite: 0.15 },
        contextWindow: 1_048_576,
        maxTokens: 131_072,
      },
      {
        id: "muse-spark-1.2-contributor",
        name: "Muse Spark 1.2 Contributor",
        reasoning: true,
        thinkingLevelMap: {
          off: null,
          minimal: "minimal",
          low: "low",
          medium: "medium",
          high: "high",
          xhigh: "xhigh",
          max: "xhigh",
        },
        input: ["text", "image"],
        cost: { input: 0.1, output: 0.2, cacheRead: 0.002, cacheWrite: 0.002 },
        contextWindow: 1_048_576,
        maxTokens: 131_072,
      },
    ],
  });
}
