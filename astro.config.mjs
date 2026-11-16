// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import { themeInitScript } from './src/scripts/theme-init.js';

// Astro does not hash is:inline scripts, so the first-paint theme script is hashed here.
// Web Crypto rather than node:crypto because the project carries no @types/node.
const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(themeInitScript));
/** @type {`sha256-${string}`} */
const themeInitHash = `sha256-${btoa(String.fromCharCode(...new Uint8Array(digest)))}`;

// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      // Injected by Cloudflare Pages builds. Rendered as <meta name="build-commit"> so the
      // production smoke check (and anyone) can tell which commit is live. Absent locally.
      CF_PAGES_COMMIT_SHA: envField.string({ context: 'server', access: 'public', optional: true }),
    },
  },
  security: {
    // Astro emits this as a per-page <meta> CSP with hashes for its scripts and styles.
    // Directives a <meta> CSP ignores (frame-ancestors) are sent from public/_headers.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self'",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests",
      ],
      scriptDirective: {
        hashes: [themeInitHash],
      },
    },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});