# Feeds research — YouTube channel ingest

**Status:** `YOUTUBE_DATA_API_KEY` in hand (`/Users/marco/Desktop/APR70 Feeds Bot/keys-to-load.txt`). Both RSS-only and Data API paths viable; **recommendation: RSS for triggers, Data API for enrichment**.

## Path comparison

| Path | Pros | Cons | Use? |
|---|---|---|---|
| RSS `https://www.youtube.com/feeds/videos.xml?channel_id=<UC...>` | No auth, no quota, lightweight, one per channel | Last 15 videos only, no captions or stats, ~no real-time (poll every 5–15m) | YES — primary trigger |
| YouTube Data API v3 (`videos.list`, `playlistItems.list`, `captions.download`) | Captions, view counts, comments, real-time after `pubsubhubbub` push | Quota: 10,000 units/day default. Each `videos.list` ~1 unit; `captions.download` is paid only if creator allows | YES — for enrichment after RSS triggers |
| Playwright/headless YouTube | Captions even when API blocked, full metadata | Brittle, ToS-borderline, slow | NO — last resort only |

## Required: channel watchlist

Marco supplies a list of channel handles or IDs. Resolve handles to channel IDs once:

```bash
# Given a handle like @marquesbrownlee
curl -sS "https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=@marquesbrownlee&key=${YOUTUBE_DATA_API_KEY}" \
  | jq -r '.items[0].id'
# UCBJycsmduvYEL83R_U4JriQ
```

Store the resolved list at `~/ObsidianVault/operations/feeds/youtube/_watchlist.yaml`:

```yaml
channels:
  - id: UCBJycsmduvYEL83R_U4JriQ
    handle: marquesbrownlee
    note: tech reviews
  - id: UC4PooiX37Pld1T8J5SYT-SQ
    handle: googleads
    note: paid-ad case studies
```

## Ingest architecture: n8n RSS Trigger → enrich → vault + Paperclip

```
[Schedule: every 10 min]
   ↓
[For each channel in watchlist]
   ↓
[HTTP Request: GET https://www.youtube.com/feeds/videos.xml?channel_id=<id>]
   ↓
[XML→JSON parse, dedupe against state.json]
   ↓
[For each NEW video:]
   ├─ [HTTP Request: YT Data API v3 videos.list?part=snippet,contentDetails,statistics&id=<videoId>&key=$KEY]
   │   (enriches with description, duration, view/like counts)
   ├─ [Function: format markdown stub]
   ├─ [Write to ~/ObsidianVault/operations/feeds/youtube/<channelHandle>/<videoId>-<slug>.md]
   └─ [HTTP Request: Paperclip create issue assigned to Archivist]
```

Captions (separate workflow, run on-demand from CEO Silvi):

```bash
# List caption tracks
curl -sS "https://www.googleapis.com/youtube/v3/captions?videoId=<id>&part=snippet&key=${YOUTUBE_DATA_API_KEY}" | jq

# Public auto-captions are NOT downloadable via the API without OAuth — workaround is to use yt-dlp:
yt-dlp --write-auto-sub --skip-download --sub-format vtt --sub-lang en \
  "https://www.youtube.com/watch?v=<id>" -o "~/ObsidianVault/operations/feeds/youtube/captions/<channel>/<id>.%(ext)s"
```

`yt-dlp` is the practical caption source; it's free, no auth, and respects the same auto-caption restrictions the public web player applies. Install with `pip install --user yt-dlp` (no sudo needed) or `pipx install yt-dlp`.

## Quota math

- 100 channels × every 10 min = 14,400 RSS polls/day (no quota cost).
- Enrichment Data API: 100 channels × ~5 new videos/day each = 500 `videos.list` calls = 500 units. Comfortably under 10k/day default quota.
- Caption downloads via `yt-dlp` = no quota.

If Marco grows the watchlist past ~1000 channels, request a quota raise from Google Cloud Console (free, takes 1–2 days).

## Vault file template

```markdown
---
source: youtube
channel: marquesbrownlee
channelId: UCBJycsmduvYEL83R_U4JriQ
videoId: dQw4w9WgXcQ
published: 2026-05-18T14:23:00Z
duration: PT12M34S
views: 1234567
url: https://youtube.com/watch?v=dQw4w9WgXcQ
ingested: 2026-05-18T14:25:00Z
---

# Marques Brownlee — "Title here"

<auto-caption transcript if downloaded, else description>
```

## Verification

- `YouTube Data API` line of `apex-preflight` passes after `YOUTUBE_DATA_API_KEY` is in `~/.env`.
- Adding one test channel to the watchlist results in at least one markdown file appearing under `~/ObsidianVault/operations/feeds/youtube/` within one poll cycle.
- Paperclip issue gets filed with label `feed:youtube` and `channel:<handle>`.

## What needs writing in execution session

1. n8n workflow JSON (template-driven; depends on n8n version).
2. `_watchlist.yaml` with Marco's actual channels.
3. State-tracking strategy: per-channel `last_seen_videoId` stored in n8n's static data or a small SQLite at `~/ObsidianVault/operations/feeds/_state/youtube.sqlite`.
