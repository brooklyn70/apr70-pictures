# Staging v3 — DSM reverse proxy and admin protection

Checklist for **`staging-v3.apr70.com`** (Synology DSM) and **`/admin`** access control. Targets the stack described in `CLAUDE.md`: edge nginx on the NAS Docker host routing `/` to Astro and `/admin`, `/api`, `/_next` to Payload.

## 1. DNS and certificate

1. Create an **A** or **CNAME** record for `staging-v3.apr70.com` pointing at the NAS public IP or DDNS hostname.
2. In **Control Panel → Security → Certificate**, issue or import a TLS cert that covers `staging-v3.apr70.com` (Synology Let’s Encrypt or ACM-style import).

## 2. Reverse proxy rule (DSM)

Use **Control Panel → Login Portal → Advanced → Reverse Proxy** (exact labels vary by DSM major version).

| Setting | Suggested value |
|---------|-----------------|
| Source | HTTPS, hostname `staging-v3.apr70.com`, port `443` |
| Destination | HTTP, **nginx container host** (Docker bridge IP or `localhost` if DSM and Docker share the host), port **`8080`** — match `docker-compose.yml` published edge port |
| WebSocket | Enable (Payload admin / Next may use WS in dev-like paths) |

Apply the certificate from step 1 to this hostname in **Login Portal** or the reverse proxy dialog.

**Health check:** open `https://staging-v3.apr70.com/` — expect Astro. Open `https://staging-v3.apr70.com/admin` — expect Payload admin after auth is applied.

## 3. Basic Auth only on `/admin`

Prefer **nginx** `auth_basic` inside the **location** that serves `/admin` so the public site and `/api` reads stay unauthenticated for the static build (unless you later add an API key).

Example pattern (adapt to the repo’s `nginx/default.conf` or an include file on the NAS):

```nginx
# Pseudocode — merge with existing location blocks; do not duplicate listen/ssl here
location /admin {
    auth_basic           "Payload Admin";
    auth_basic_user_file /etc/nginx/.htpasswd-apr70-admin;
    proxy_pass           http://cms_upstream;
    # proxy_set_header Host / X-Forwarded-* / Upgrade same as your existing /admin block
}

location /api {
    # Usually no auth_basic if public read uses open access; add IP allowlist or separate auth if required
    proxy_pass http://cms_upstream;
}
```

Generate credentials on the NAS (or CI secret store):

```bash
openssl passwd -apr1 PasswordHere   # or htpasswd -Bc .htpasswd-apr70-admin editor1
```

Mount the file into the nginx container (`volumes:` in compose) and redeploy.

**DSM alternative:** some DSM builds offer “Access control” per reverse-proxy rule; use that to restrict `/admin` by password or client subnet if you prefer not to edit nginx.

## 4. Operational notes

- Rotate Basic Auth credentials when team membership changes; keep them out of git.
- Coordinate with Marco for **orchestrator / 1Password** secrets: `PAYLOAD_SECRET`, DB URL, and preview keys stay in the CMS container env, not in static `web`.
- After changing proxy rules, clear browser cache or test in a private window; HSTS on the hostname can mask misconfigured HTTP redirects.

## References

- Root `docker-compose.yml` and `nginx/default.conf` in this repo.
- `docs/architecture/integration.md` — topology and auth boundaries.
