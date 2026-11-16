# ADR-0002: Content Security Policy via Astro's `<meta>` CSP plus Cloudflare `_headers`

## Status

Accepted

## Date

2026-11-15

## Context

On 2026-11-15 production (`rhyssvivian.dev`) sent `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`, but no Content Security Policy, no HSTS, no anti-framing header, and no `Permissions-Policy`.

The site is static with no backend, forms, or authentication. All fonts, CSS, JS, and images are served from its own origin. The realistic threats are script injection that defaces the site and other sites framing it (clickjacking).

Constraints:

- Static output means no per-request nonces; inline code has to be allowed by hash.
- Astro 7's `security.csp` hashes the scripts and styles it processes, but not `is:inline` scripts. The layout has one: a first-paint script that applies a stored light theme before the page renders.
- Inline `style` attributes cannot be hashed by Astro and would require `'unsafe-inline'`. The homepage contour rings used 11 of them.
- A `<meta>` CSP ignores `frame-ancestors`, so framing protection must be a real HTTP header.

## Decision

Split the policy between two mechanisms:

1. **`security.csp` in `astro.config.mjs`** emits a per-page `<meta http-equiv="content-security-policy">`: `default-src`, `img-src`, `font-src`, `connect-src`, `base-uri`, `form-action` set to `'self'`; `object-src 'none'`; `upgrade-insecure-requests`; script and style hashes generated at build time. No `'unsafe-inline'` or `'unsafe-eval'`.
2. **The first-paint theme script lives in `src/scripts/theme-init.js`.** `BaseLayout.astro` renders that string with `<script is:inline set:html={themeInitScript} />`, and `astro.config.mjs` hashes the same string into `security.csp.scriptDirective.hashes`, so editing the script cannot leave a stale hash.
3. **Contour ring offsets are CSS `nth-of-type` rules**, not `style` attributes.
4. **`public/_headers`** (applied by Cloudflare Pages) carries what a `<meta>` CSP cannot: `Content-Security-Policy: frame-ancestors 'none'`, `X-Frame-Options: DENY`, `Strict-Transport-Security: max-age=63072000; includeSubDomains`, `Permissions-Policy`, and `Cross-Origin-Opener-Policy: same-origin`. It also restates the two headers Cloudflare already sent.

`test/security-headers.test.mjs` enforces each of these.

## Alternatives Considered

### Entire CSP in `_headers` with hand-maintained hashes

- Pros: one place; a real header instead of `<meta>`.
- Cons: Astro's script hashes change whenever bundled code changes, so hand-copied hashes go stale and block scripts in production.
- Rejected.

### `'unsafe-inline'` for scripts and styles

- Pros: nothing to hash; inline styles keep working.
- Cons: removes most of the XSS protection a CSP exists to give.
- Rejected.

### Remove the first-paint script and let the bundled toggle apply the theme

- Pros: no `is:inline` script to hash.
- Cons: bundled module scripts run after first paint, so light-mode visitors would see a dark flash on every page load.
- Rejected.

### No CSP (headers only)

- Pros: simplest.
- Cons: leaves script injection unmitigated on a site whose credibility is the asset.
- Rejected.

## Consequences

- New inline `style` attributes, or new `is:inline` scripts without a matching hash, are blocked in production. `npm test` catches style attributes in `HomeIdentity.astro` only; other components rely on review and a browser check.
- Loading anything from another origin (fonts, analytics, embeds, images) requires a directive change in `astro.config.mjs`. Analytics are out of scope for v1 per the spec.
- Astro's CSP does not run in `astro dev`. Check CSP behavior with `npm run build` and `npm run preview`.
- Shiki syntax highlighting is incompatible with this CSP (it emits inline styles); Prism is the supported option if code highlighting is added.
- `_headers` is Cloudflare-specific. On another host the `<meta>` CSP still applies, but framing protection, HSTS, `Permissions-Policy`, and COOP would need that host's own header configuration.
- `includeSubDomains` applies HSTS to every `*.rhyssvivian.dev` host. `.dev` is already HSTS-preloaded at the TLD level, so this changes nothing in practice.
- Cloudflare's default `Access-Control-Allow-Origin: *` is left as is: the content is public and no credentials are involved.
