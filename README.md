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

## Status

Pre-phase-1. Skeleton scaffolded; architecture decisions pending in the next focused session.
