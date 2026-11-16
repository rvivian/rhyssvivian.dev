# ADR-0003: Host on Cloudflare Pages

## Status

Accepted

## Date

2026-11-15

## Context

The original spec left hosting open: it kept the site "portable between GitHub Pages and Cloudflare Pages" and listed "Final hosting choice" under Ask first. In practice the site was already deployed on Cloudflare Pages, with production deploys on merges to `main` and preview deploys on pull requests, and the README said so.

By 2026-11-15 the project depended on Cloudflare-specific behavior:

- `public/_headers` sends framing protection, HSTS, `Permissions-Policy`, and COOP ([ADR-0002](0002-content-security-policy.md)). GitHub Pages does not support custom response headers.
- Pull-request preview deployments are the check that a change builds on the real host before it reaches production. Preview and Production are configured separately, so a preview only proves what the two environments share.
- The build's Node version is selected by Cloudflare reading `.node-version` ([ADR-0001](0001-node-version-source-of-truth.md)).

The site owner confirmed Cloudflare Pages as the host on 2026-11-15.

## Decision

Cloudflare Pages is the production host. The site stays a static Astro build (`npm run build` → `dist/`) with no Cloudflare adapter, Functions, or Workers.

## Alternatives Considered

### Stay portable between GitHub Pages and Cloudflare Pages

- Pros: no lock-in.
- Cons: forces the security headers to be dropped or duplicated per host; portability was already untrue once `_headers` landed.
- Rejected.

### GitHub Pages

- Pros: lives next to the repository; no third-party account.
- Cons: no custom response headers, so no HSTS policy control, `frame-ancestors`, or `Permissions-Policy`; preview deployments need extra Actions work.
- Rejected.

## Consequences

- Cloudflare-specific static configuration files in `public/` (`_headers`, and `_redirects` if added) are acceptable.
- The "no hosting-specific adapter" rule still holds: output stays static, so moving hosts later means re-creating `_headers` in the new host's format and nothing else in the build.
- Settings that live in the Cloudflare dashboard (build command, output directory, environment variables, custom domains, DNS) are outside version control. The README's Deployment Notes record the ones the build depends on.
- `www.rhyssvivian.dev` 301-redirects to `https://rhyssvivian.dev`, keeping the path and query string, over both HTTP and HTTPS (fixed 2026-11-15 after it returned HTTP 522). This is configured in the Cloudflare dashboard, outside the repository: a proxied `A www 192.0.2.1` placeholder record plus a Redirect Rule matching `(http.host eq "www.rhyssvivian.dev")` with the dynamic target `concat("https://rhyssvivian.dev", http.request.uri.path)`. Use the hostname expression rather than a wildcard URL pattern; wildcard capture groups sent visitors to `https://s/` during setup.
