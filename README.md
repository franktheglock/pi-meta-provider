# pi-meta-provider

**Meta (Muse Spark) provider for [pi](https://pi.dev)** — `api.meta.ai` via the OpenAI-compatible Chat Completions API.

Ships Muse Spark reasoning models: 1M-token context, streaming, tool calls, image input, and `reasoning_effort` (minimal → xhigh). Private reasoning stays private; reasoning tokens bill at the output rate and count toward the 131K output cap.

## Models

| Model | Context | Max output | Tier | Pricing (per 1M) |
|-------|---------|------------|------|------------------|
| `muse-spark-1.1` | 1,048,576 | 131,072 | Standard | $1.25 in · $0.15 cached · $4.25 out |
| `muse-spark-1.2` | 1,048,576 | 131,072 | Standard | $1.25 in · $0.15 cached · $4.25 out |
| `muse-spark-1.2-contributor` | 1,048,576 | 131,072 | Contributor | $0.10 in · $0.002 cached · $0.20 out |

No long-context premium. Web search grounding ($2.50 / 1K queries), files API, and prompt caching are available server-side; reasoning replay across turns on Chat Completions is intentionally empty (use the Responses API directly if you need encrypted reasoning continuity).

## Install

```bash
pi install git:github.com/franktheglock/pi-meta-provider
```

Or try without installing (current run only):

```bash
pi -e git:github.com/franktheglock/pi-meta-provider
```

Select a model with `/model` (look for `meta/muse-spark-…`) or `--model meta/muse-spark-1.2`.

## Auth

Get an API key at **[dev.meta.ai → dashboard → API keys → Create key](https://dev.meta.ai)** (stored as `MODEL_API_KEY` in Meta's own docs). Same key works for [Muse Code](https://ai.developer.meta.com/docs/muse-code), OpenCode, and the API.

**Option A — `/login` (recommended):**

In pi, run:

```
/login meta
```

Paste the key when prompted. Stored in `~/.pi/agent/auth.json`.

**Option B — environment variable:**

```bash
# primary (Meta's documented var)
export MODEL_API_KEY="sk-..."
# alternate
export META_API_KEY="sk-..."
```

Optional proxy override:

```bash
export META_BASE_URL="https://your-proxy.example.com/v1"
```

Verify auth:

```bash
MODEL_API_KEY="..." pi --list-models | grep meta
# or in pi: /model -> filter "meta"
```

## Link

I built this while exploring the project above: `https://dev.meta.ai/docs/overview/?team_id=1546437390301451&project_id=1576060060667031`

*Not affiliated with Meta. Muse Spark via Meta Model API.*
