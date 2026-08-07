# pi-meta-provider

[Meta Model API](https://dev.meta.ai/docs/overview) provider extension for [pi](https://pi.dev). Adds Meta's **Muse Spark** models — Meta's family for agentic and coding workflows — to pi through the OpenAI-compatible Chat Completions endpoint.

## Models

| Model | Tier | Context | Price (in/out/cached, per 1M tokens) |
| --- | --- | --- | --- |
| `muse-spark-1.1` | Standard | 1,048,576 | $1.25 / $4.25 / $0.15 |
| `muse-spark-1.2` | Standard | 1,048,576 | $1.25 / $4.25 / $0.15 |
| `muse-spark-1.2-contributor` | Contributor | 1,048,576 | $0.10 / $0.20 / $0.002 |

All Muse Spark models support up to 131,072 output tokens and always reason — `reasoning_effort` maps to pi's thinking levels (`minimal` → `xhigh`; "off" omits the parameter since `"none"` is rejected by the API).

## Install

Set your API key (create one in the [Model API dashboard](https://dev.meta.ai/)):

```bash
export MODEL_API_KEY="LLM|..."
```

### As an extension (auto-discovered)

```bash
mkdir -p ~/.pi/agent/extensions
git clone https://github.com/franktheglock/pi-meta-provider ~/.pi/agent/extensions/pi-meta-provider
```

### As a pi package

```bash
pi install git:github.com/franktheglock/pi-meta-provider
```

## Usage

```bash
pi --model meta/muse-spark-1.2
```

Select it any time with `/model`, and dial reasoning with the thinking-level controls (e.g. `/thinking high`).

## How it works

The extension registers the `meta` provider via `pi.registerProvider()`:

- **API**: `openai-completions` — pi streams over `POST /v1/chat/completions` (SSE), the protocol Meta documents as drop-in compatible with OpenAI clients and agent CLIs.
- **Auth**: `Authorization: Bearer` from `MODEL_API_KEY`.
- **Reasoning**: `reasoning_effort` sent at the top level, mapped from pi's thinking levels via `thinkingLevelMap`.
- **Compatibility flags**: `supportsDeveloperRole` (Meta's `developer` instruction role), `maxTokensField: "max_completion_tokens"`, `supportsLongCacheRetention` (sends `prompt_cache_retention: "24h"` when long retention is enabled), and `supportsReasoningEffort`.
- **Costs**: per-tier pricing with `prompt_tokens_details.cached_tokens` reported as cache reads.

## Resources

- [Meta Model API overview](https://dev.meta.ai/docs/overview)
- [Chat Completions protocol](https://dev.meta.ai/docs/protocols/chat-completions)
- [Pricing and rate limits](https://dev.meta.ai/docs/pricing-rate-limits)
- [pi custom providers](https://github.com/earendil-works/pi-mono/blob/main/packages/docs/custom-provider.md)
