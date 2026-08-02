# apr70-pictures

v3 of the APR 70 Pictures studio website. Astro + Payload (headless), block-builder architecture, self-hosted on a Synology NAS.

**Replaces:** [brooklyn70/apr70-clone](https://github.com/brooklyn70/apr70-clone) (v2, feature-frozen May 2026).

## Repo layout

```
apr70-pictures/
  cms/                 # Payload v3 — Postgres-backed headless CMS, admin UI
  web/                 # Astro frontend — HTML-first, React islands for interactions
  docker-compose.yml   # postgres + cms + web + nginx, deployed on NAS
  BRIEF.md             # single source of truth, hook-updated by every agent session
  TASKS.md             # priority-ordered backlog
  CLAUDE.md            # project conventions
```

## For agents picking up this repo

Read `BRIEF.md` first. It is always current. Then `TASKS.md` for the backlog.

Hooks installed in Claude Code + Cursor auto-commit and auto-push on session end. Do not manually push at the end of a session — the hook handles it. Update `BRIEF.md` before stopping; that's the entire handoff.

## Docker (local / NAS)

From the repo root, with Docker:

```bash
export PAYLOAD_SECRET="$(openssl rand -hex 32)"
docker compose up --build
```

Edge nginx listens on **8080** by default (`http://localhost:8080`). Public site is proxied from the `web` service; `/admin`, `/api`, and `/_next` go to Payload (Next.js).

## Git remotes

- **GitHub (hub for Cloud Agents + Vercel):** `origin` → `brooklyn70/apr70-pictures`
- **NAS mirror:** `nas` → `caruso@100.69.2.30:GitRepos/apr70-pictures.git`
- Cloud Agent / GitHub merges do **not** update the NAS. After merging to `main`:

```bash
./scripts/mirror-to-nas.sh
```

Media (`cms/media/`, PD masters) stays on the shares / object storage — this script only mirrors git.

## Status

Phase 2 scaffold in progress: Astro (`web/`) and Payload 3 + Next (`cms/`) are present; stack compose at repo root.
