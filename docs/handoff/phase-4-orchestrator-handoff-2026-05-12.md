# Handoff: Phase 4 — Seed Script & Content Migration

**Target:** NAS Autonomous Orchestrator (`brooklyn70/apr70-orchestrator`)  
**Source repo:** `brooklyn70/apr70-pictures`  
**Status:** Phases 1–3 foundations LOCKED.

## Context

The v3 architecture (Payload 3 + Astro SSR) is fully bootstrapped. All block schemas, the Lexical Color Injector, and Global Chrome (SiteSettings / FooterLinks / Footer) are implemented and verified. The system is ready for content ingestion.

## Orchestrator mission: Phase 4

Execute the data migration from the legacy v2 system to the new Payload CMS instance.

### 1. Seed script `[nas-headless]`

| | |
|--|--|
| **Source** | v2 legacy content (Keystatic / JSON / Markdown) |
| **Destination** | Payload 3 PostgreSQL database |
| **Requirements** | Idempotent (safe to run multiple times without duplication). Maintain versioning references. Map v2 fields to the new v3 block schemas (`cms/src/blocks/*.ts`). |

### 2. Media migration `[nas-headless]`

| | |
|--|--|
| **Action** | rsync v2 NAS volume assets to v3 NAS volume assets |
| **Linking** | Create Media collection entries in Payload for each file and link them to the correct blocks in seeded content |
| **Reference** | `cms/src/collections/Media.ts` |

## Technical state

- **Database:** PostgreSQL (`postgresAdapter`)
- **CMS URL:** Defaults to `http://localhost:3000` (check env for NAS-specific port mapping)
- **Blocks:** All 11 v3 blocks are defined and exported under `cms/src/blocks/`

## Next instruction (dispatch prompt)

Initialize the Phase 4 seed script. Map the v2 Project and Page schemas to the v3 Payload block architecture, ensuring Lexical content is preserved and correctly attributed to the new Color Injector tokens.
