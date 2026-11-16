import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import config from "../astro.config.mjs";

const root = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, root), "utf8");
}

// Cloudflare Pages `_headers` format: a URL pattern line, then indented "Name: value" lines.
async function readSiteWideHeaders() {
  const file = await readProjectFile("public/_headers");
  const lines = file.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === "/*");
  assert.notEqual(start, -1, "public/_headers must define a site-wide /* rule");

  const headers = new Map();
  for (const line of lines.slice(start + 1)) {
    if (!/^\s+\S/.test(line)) break;
    const separator = line.indexOf(":");
    headers.set(line.slice(0, separator).trim().toLowerCase(), line.slice(separator + 1).trim());
  }
  return headers;
}

const cspDirectives = () => config.security?.csp?.directives ?? [];

test("Astro CSP is enabled so inline scripts and styles get build-time hashes", () => {
  assert.equal(typeof config.security?.csp, "object");
});

test("CSP restricts every resource type to the site's own origin", () => {
  const directives = cspDirectives();

  assert.ok(directives.includes("default-src 'self'"));
  assert.ok(directives.includes("object-src 'none'"));
  assert.ok(directives.includes("base-uri 'self'"));
  assert.ok(directives.includes("form-action 'self'"));
});

test("CSP never falls back to unsafe-inline or unsafe-eval", () => {
  const csp = config.security?.csp;
  const serialized = JSON.stringify(csp);

  assert.doesNotMatch(serialized, /unsafe-inline|unsafe-eval/);
});

test("site-wide headers force HTTPS for two years", async () => {
  const headers = await readSiteWideHeaders();

  assert.match(headers.get("strict-transport-security") ?? "", /^max-age=63072000; includeSubDomains$/);
});

// frame-ancestors is ignored inside a <meta> CSP, so clickjacking protection must be a real header.
test("site-wide headers block framing by other sites", async () => {
  const headers = await readSiteWideHeaders();

  assert.equal(headers.get("content-security-policy"), "frame-ancestors 'none'");
  assert.equal(headers.get("x-frame-options"), "DENY");
});

test("site-wide headers disable powerful browser features and isolate the browsing context", async () => {
  const headers = await readSiteWideHeaders();

  assert.match(headers.get("permissions-policy") ?? "", /camera=\(\)/);
  assert.match(headers.get("permissions-policy") ?? "", /geolocation=\(\)/);
  assert.match(headers.get("permissions-policy") ?? "", /microphone=\(\)/);
  assert.equal(headers.get("cross-origin-opener-policy"), "same-origin");
  assert.equal(headers.get("x-content-type-options"), "nosniff");
  assert.equal(headers.get("referrer-policy"), "strict-origin-when-cross-origin");
});

// Astro does not hash is:inline scripts, so the first-paint theme script needs an explicit hash
// computed from the same source the layout renders, or the CSP blocks it.
test("CSP allows the first-paint theme script by hashing its exact source", async () => {
  const { createHash } = await import("node:crypto");
  const { themeInitScript } = await import("../src/scripts/theme-init.js");
  const expected = `sha256-${createHash("sha256").update(themeInitScript).digest("base64")}`;

  assert.ok(config.security?.csp?.scriptDirective?.hashes?.includes(expected));
});

test("layout renders the theme script from the hashed source, not a hand-copied duplicate", async () => {
  const layout = await readProjectFile("src/layouts/BaseLayout.astro");

  assert.match(layout, /<script is:inline set:html=\{themeInitScript\} \/>/);
  assert.doesNotMatch(layout, /localStorage\.getItem/);
});

// Inline style attributes cannot be hashed by Astro, so one would force style-src-attr 'unsafe-inline'.
test("components render no inline style attributes", async () => {
  const home = await readProjectFile("src/components/HomeIdentity.astro");

  assert.doesNotMatch(home, /\sstyle=/);
});
