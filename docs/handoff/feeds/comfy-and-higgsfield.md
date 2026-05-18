# Feeds research — ComfyUI invocation + Higgsfield evaluation

**Status:** ComfyUI is already running on the Apex (port 8188, CUDA). Higgsfield is **research-only this round** — CEO Silvi may own it later once shovel-ready.

---

## Part 1 — ComfyUI from n8n (already-installed)

### Endpoint surface

ComfyUI's API is undocumented but stable across versions:

| Method | Path | Purpose |
|---|---|---|
| GET | `/system_stats` | Health + GPU info |
| GET | `/object_info` | List every node type the server has loaded |
| POST | `/prompt` | Queue a workflow. Body: `{"prompt": <workflow JSON>, "client_id": "<uuid>"}` |
| GET | `/history/<promptId>` | Outputs of a completed run |
| GET | `/view?filename=<f>&type=output&subfolder=<s>` | Download a generated file |
| WS | `/ws?clientId=<uuid>` | Live progress events (`executing`, `progress`, `executed`, `execution_cached`) |

### n8n workflow pattern

```
[Trigger: Paperclip issue label=needs-still]
   ↓
[Function: build prompt JSON from issue]
   ↓
[HTTP Request: POST http://localhost:8188/prompt]
   ↓ (capture promptId)
[Wait: poll http://localhost:8188/history/<promptId> every 2s until non-empty]
   ↓
[Function: extract output image filenames]
   ↓
[For each output:]
   ├─ [HTTP Request: GET /view?filename=<f>&type=output → binary]
   ├─ [Write to ~/ObsidianVault/operations/feeds/comfy/<issueId>/<filename>]
   └─ [Paperclip issue comment with image attachment URL]
```

### Workflow JSON authoring

Use the ComfyUI UI **once** to design a template workflow with placeholder text in CLIP encoder nodes. Click `Save (API Format)` to export. The exported JSON is the body of `POST /prompt`. In the n8n Function node, find the CLIP encoder node ID and overwrite its `inputs.text` field with the issue's content.

Suggested templates to author and save under `~/comfy-workflows/`:
- `still-portrait-flux.json` — single-image portrait
- `still-product-shot.json` — clean product on neutral background
- `still-cinematic.json` — moody, 21:9, ratio-fitted

### Installed nodes (from earlier inventory)

`kie-api`, `ToSVG`, `Advanced-ControlNet`, `TensorRT`, `was-suite`, `Manager`. All present. TensorRT speeds up SDXL/FLUX inference; was-suite has Save Image With Metadata which is helpful for traceability.

### Verification

- `apex-preflight` `ComfyUI stats` line passes.
- A test issue labeled `needs-still` produces a PNG in `~/ObsidianVault/operations/feeds/comfy/<issueId>/` and a Paperclip comment links to it within 30s.

---

## Part 2 — Higgsfield evaluation

### What Higgsfield is (verified 2026-05 via web research)

A **hosted AI video/image generation service** that exposes:

- **`higgsfield` CLI** ([higgsfield.ai/cli](https://higgsfield.ai/cli), GitHub: [higgsfield-ai/cli](https://github.com/higgsfield-ai/cli)) — runs from terminal, drives 30+ underlying models (Nano Banana Pro, FLUX.2, Soul V2, Veo 3.1, Kling v3.0, Seedance 2.0). Designed for Claude Code, Cursor, Codex, Hermes Agent, and other AI-agent workflows.
- **MCP server** ([higgsfield.ai/mcp](https://higgsfield.ai/mcp)) — same capability via MCP for clients that prefer it.
- **Web UI + Cinema Studio** — virtual camera body / lens / focal-length controls before generation.
- **Soul training** — train a face-faithful character model from a few photos for consistent identity across outputs.

### Why it matters for APR 70

Two clear wins:
1. **Animated stills → short clips** (≤15s) for the website hero blocks and social cross-posts. ComfyUI does stills well but is local-GPU-limited for video (8GB VRAM ≠ Veo/Kling tier).
2. **Consistent identity across outputs** via Soul characters — APR 70's brand needs visual continuity that diffusion-from-scratch can't easily provide.

### Constraints

- **Hosted service, paid.** Per-credit pricing; budget impact unknown until Marco pulls a quote from [higgsfield.ai](https://higgsfield.ai/).
- **Outbound dependency** — adds an external API surface; preflight should include a Higgsfield ping if/when adopted.
- **API key required** — `HIGGSFIELD_API_KEY` in `~/.env`, then preflight check + plugin secret entry.

### Integration shape (when adopted)

Two equivalent paths:

**A. CLI from a Paperclip skill**

```bash
# ~/paperclip-data/scaffold/skills/higgsfield-clip/clip.sh
#!/usr/bin/env bash
PROMPT="$1"
ASPECT="${2:-9:16}"
DURATION="${3:-8}"
higgsfield video generate \
  --prompt "$PROMPT" \
  --aspect "$ASPECT" \
  --duration "$DURATION" \
  --output ~/ObsidianVault/operations/feeds/higgsfield/$(date +%s).mp4
```

Wire as a `kind: skill` plugin with one `command: generate-clip`. The CEO or AI Media Producer calls it.

**B. MCP server attached to AI Media Producer**

Add the Higgsfield MCP URL/token to the AI Media Producer agent's MCP server list. The agent calls Higgsfield tools natively via MCP — no shell wrapping, no env juggling.

Prefer **path B** once we've validated Paperclip supports per-agent MCP server registration (verify in the agent-edit fields exposed by `GET /api/agents/<id>` — look for `mcpServers` array). If not yet, path A is the fallback and trivially upgrades later.

### Decision: defer install, pre-wire the rails

- **No install this phase.** Marco hasn't priced it; CEO can't sign up for paid services.
- **Pre-wire**: add `HIGGSFIELD_API_KEY` to preflight as an optional check (already in `preflight.sh`); add an empty `~/paperclip-data/scaffold/skills/higgsfield-clip/` folder with a `SKILL.md` stub marked `status: deferred` so the slot exists.
- **Trigger to adopt:** when AI Media Producer hits the ceiling of what ComfyUI can produce locally (i.e., needs clips longer than what local-VRAM AnimateDiff/SVD can do), Marco prices Higgsfield and the CEO files an APR-NN install issue.

### Open questions for Marco

1. Is the budget comfortable adding a hosted video gen service at, say, $50–100/mo?
2. Does Soul training (consistent character) matter enough to be a deal-maker?
3. Any hard-line preference for keeping everything local (in which case dig deeper into local AnimateDiff/CogVideoX/HunyuanVideo on RTX 4000)?

---

## Sources

- [Higgsfield CLI](https://higgsfield.ai/cli)
- [Higgsfield CLI on GitHub](https://github.com/higgsfield-ai/cli)
- [Higgsfield MCP](https://higgsfield.ai/mcp)
- [Higgsfield AI Video Generator (Sora, Kling, Veo)](https://higgsfield.ai/ai-video)
- [How to Use the Higgsfield CLI with Claude Code — MindStudio](https://www.mindstudio.ai/blog/higgsfield-cli-claude-code-content-automation)
