# Astro + Payload integration specification (v3)

This document defines how the Astro frontend (`web/`) and the standalone Payload CMS (`cms/`) connect on the Synology stack: authentication boundaries, shared TypeScript types, media delivery, and caching.

It assumes the **page schema** in `docs/architecture/schema.md` (Globals with `layout: Block[]`) and the **block library** in `docs/architecture/blocks.md`.

---

## 1. Goals

| Goal | Approach |
|------|------------|
| Editors own layout via blocks | Payload stores `layout` as structured blocks; Astro renders through a single `BlockRenderer`. |
| No duplicate prop types | Generate `payload-types` in `cms/` and consume from `web/` (path alias). |
| Clear auth boundary | Admin users authenticate to Payload only; the public site does not reuse that session. |
| Fast public pages | Prefer static generation and edge-friendly caching; revalidate when content changes. |
| Predictable images | One source of truth in Payload uploads; Astro uses stable URLs and optional `<Image />` optimization. |

---

## 2. Runtime topology (target)

```
[Browser] --HTTPS--> [nginx / DSM reverse proxy]
                         |
          +--------------+--------------+
          |              |              |
    / (public)     /api/cms/*     /admin/*
          |              |              |
      Astro (web)    Payload API    Payload admin UI
          |              |
          +------+-------+
                 |
            PostgreSQL
                 |
          Uploads volume (NAS path)
```

- **Payload** runs as a Node process (Docker service), holding Postgres, admin UI, REST/GraphQL, and local or S3-compatible media storage.
- **Astro** runs as a separate Node build/runtime or static file server behind the same host or a sibling subdomain (e.g. `staging-v3.apr70.com` vs `staging-v3-cms.apr70.com`). Exact hostnames are deployment-specific; the contract is **same-origin or CORS-controlled API base URL** for fetches.

---

## 3. Authentication

### 3.1 Payload Admin (`/admin`)

- Use Payload’s **built-in admin authentication** (email/password or future SSO plugin).
- Sessions are **cookie-based**, scoped to the Payload origin (not the public Astro origin).
- **Secrets** (`PAYLOAD_SECRET`, database URLs) live only in the CMS container env (or `op run` on the NAS).

### 3.2 Public Astro site

- **No Payload login** for normal visitors.
- Fetch published content via **server-side** requests in Astro (static build or SSR) using a **read-only** strategy:
  - Prefer a **published** filter or draft=false in queries.
  - Use a **server-only** `PAYLOAD_API_KEY` or dedicated “preview” secret only inside Astro server code, never bundled to client.

### 3.3 Preview / draft (optional Phase 2+)

- **Draft preview** can use a signed URL or `?preview=` token validated in Astro SSR middleware.
- Payload **Live Preview** iframe posts message to admin; Astro preview route validates token and loads draft via authenticated CMS request (server-side only).

### 3.4 Authorization matrix (summary)

| Actor | Payload Admin | Astro public | Astro preview route |
|-------|---------------|--------------|----------------------|
| Editor | Full | N/A | Via signed token |
| Anonymous | No access | Read published | No |

---

## 4. Type sharing

### 4.1 Generation

1. Payload config and collections/globals live in `cms/`.
2. Run Payload type generation (e.g. `payload generate:types` or project script) to emit **`payload-types.ts`** (exact path TBD in scaffold task; convention: `cms/src/payload-types.ts`).

### 4.2 Consumption in Astro

- **`web/`** adds a TypeScript path alias to the generated file, e.g. `"payload-types": ["../cms/src/payload-types.ts"]` (adjust after monorepo layout is fixed).
- Block renderers import discriminated union types for `layout` blocks, matching `blocks.md` names.
- **Rule:** no hand-rolled duplicate interfaces for CMS shapes; extend only for UI-only props (e.g. `className`).

### 4.3 CI / NAS builds

- Typegen runs in **CMS image build** or a dedicated CI step before `astro build`.
- Failing typegen fails the build (blocks drift from schema).

---

## 5. Data and publishing flow

### 5.1 Build-time (static)

1. `astro build` executes data loaders (fetch Globals/pages from Payload REST or GraphQL).
2. Responses are serialized into routes; **no admin cookies** involved—only server env API key / public endpoints.
3. Output is static HTML (+ islands) deployed to NAS volume or CDN.

### 5.2 On-demand revalidation (recommended)

- Payload **afterChange** hooks (or a small plugin) call an Astro **revalidate webhook** URL with a shared secret.
- Astro endpoint (SSR route or edge function) invalidates tag or path cache for the affected Global slug.
- If v1 uses **full static** only: redeploy or nightly rebuild until webhooks exist.

### 5.3 Consistency

- **Single slug source:** Payload Global `slug` drives Astro route param; no second routing table in Astro.

---

## 6. Image pipeline

### 6.1 Storage

- Payload **Upload** collection stores binary on NAS volume (bind mount) or compatible object storage.
- Response payloads return a **URL** (relative `/media/...` or absolute). One canonical pattern should be chosen and documented in the scaffold PR.

### 6.2 Astro consumption

- Map Payload `url`, `sizes`, `width`, `height`, `alt` into Astro `<Image />` when using `@astrojs/image` / Sharp; otherwise use plain `<img>` with width/height for CLS.
- **Lexical embedded uploads** resolve to the same URL builder as block media fields.

### 6.3 CDN / caching

- nginx can set **long `Cache-Control`** for hashed media filenames.
- HTML documents shorter cache + revalidation webhook as above.

---

## 7. Caching strategy (layers)

| Layer | What | Invalidation |
|-------|------|--------------|
| Browser | `Cache-Control` on HTML/assets | Versioned assets; short TTL on HTML if SSR |
| Reverse proxy | Optional gzip cache | Same as HTML policy |
| Astro build | Static files | New deploy or revalidate hook |
| Payload | Query result not cached by default | N/A for v1 |

**Draft vs published:** Public fetches must filter **published** only unless in preview mode.

---

## 8. Security checklist (integration-specific)

- Never expose `PAYLOAD_SECRET` or write API keys to client bundles.
- Restrict Payload admin by **network** (VPN / Basic Auth at nginx in staging per TASKS).
- Validate webhook and preview tokens with constant-time compare.
- Use HTTPS end-to-end on public and admin routes.

---

## 9. Open decisions (to close in Phase 2 scaffold)

1. Exact **monorepo** layout (`pnpm` workspaces vs separate deployables).
2. **GraphQL vs REST** for Astro data layer (REST is simpler for Globals; GraphQL may reduce over-fetch).
3. **Subdomain vs path** for Payload (`/api` reverse-proxy vs `cms.` host).
4. **Image CDN** off-NAS in production or same-origin only.

---

## 10. Implementation order (today onward)

1. **Scaffold** `web/` and `cms/` (see Phase 2 in `TASKS.md`) with Postgres in compose.
2. Wire **typegen** script and Astro **path alias** to `payload-types`.
3. Implement **one Global** + `layout` field and a minimal `BlockRenderer` reading generated types.
4. Add **revalidate webhook** stub (no-op logging first, then wire to rebuild or tag invalidation).
5. Harden **env** separation (`PAYLOAD_PUBLIC_SERVER_URL` for Astro vs internal Docker network URL for server-side fetch).

This spec is the contract for the Phase 2 tasks; adjust filenames only if the scaffold chooses different paths.
