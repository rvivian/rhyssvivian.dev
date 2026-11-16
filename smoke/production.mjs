// Production smoke check: asserts what visitors and the security baseline depend on,
// against the live site. Kept out of test/ so `npm test` never makes network calls.
// Runbook: docs/runbooks/production-smoke-check.md
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

const PRODUCTION = "https://rhyssvivian.dev";
const BASE = (process.env.SMOKE_BASE_URL ?? PRODUCTION).replace(/\/$/, "");
const IS_PRODUCTION = BASE === PRODUCTION;
const EXPECTED_COMMIT = process.env.SMOKE_EXPECTED_COMMIT ?? "";
const DEPLOY_WAIT_MS = Number(process.env.SMOKE_DEPLOY_WAIT_MS ?? 10 * 60_000);
const POLL_MS = 20_000;

async function get(url) {
  return fetch(url, {
    redirect: "manual",
    headers: { "user-agent": "rhyssvivian.dev-smoke-check" },
    signal: AbortSignal.timeout(20_000),
  });
}

async function liveCommit() {
  const html = await (await get(`${BASE}/`)).text();
  return html.match(/<meta name="build-commit" content="([0-9a-f]{40})">/)?.[1] ?? null;
}

// Cloudflare Pages skips a queued build when a newer one for the same branch is queued,
// so a newer commit being live also means the expected commit's changes shipped.
function isAncestor(ancestor, descendant) {
  try {
    execFileSync("git", ["fetch", "--quiet", "origin", descendant], { stdio: "ignore" });
  } catch {
    throw new Error(`live commit ${descendant} is not on origin; production may be deploying from an unexpected source`);
  }
  try {
    execFileSync("git", ["merge-base", "--is-ancestor", ancestor, descendant], { stdio: "ignore" });
    return true;
  } catch (error) {
    if (error.status === 1) return false;
    throw error;
  }
}

// Runs first so the remaining checks see the new deployment, not the previous one.
test("production is serving the expected commit", { timeout: DEPLOY_WAIT_MS + 60_000 }, async () => {
  const deadline = Date.now() + (EXPECTED_COMMIT ? DEPLOY_WAIT_MS : 0);
  let live = await liveCommit();

  while (EXPECTED_COMMIT && live !== EXPECTED_COMMIT && Date.now() < deadline) {
    if (live && isAncestor(EXPECTED_COMMIT, live)) return;
    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
    live = await liveCommit();
  }

  assert.ok(live, 'no <meta name="build-commit"> on the homepage; the live build predates commit tagging or was not built by Cloudflare Pages');
  if (EXPECTED_COMMIT && live !== EXPECTED_COMMIT) {
    assert.ok(
      isAncestor(EXPECTED_COMMIT, live),
      `production serves ${live}, still missing ${EXPECTED_COMMIT} after ${DEPLOY_WAIT_MS / 60_000} min; the deploy likely failed`,
    );
  }
});

for (const path of ["/", "/thinking/", "/projects/", "/about/", "/contact/"]) {
  test(`${path} returns 200 HTML`, async () => {
    const response = await get(`${BASE}${path}`);

    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html/);
  });
}

test("RSS feed returns 200 XML with at least one item", async () => {
  const response = await get(`${BASE}/rss.xml`);

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /xml/);
  assert.match(await response.text(), /<item>/);
});

test("security headers from public/_headers are applied", async () => {
  const { headers } = await get(`${BASE}/`);

  assert.equal(headers.get("strict-transport-security"), "max-age=63072000; includeSubDomains");
  assert.equal(headers.get("content-security-policy"), "frame-ancestors 'none'");
  assert.equal(headers.get("x-frame-options"), "DENY");
  assert.equal(headers.get("x-content-type-options"), "nosniff");
  assert.equal(headers.get("cross-origin-opener-policy"), "same-origin");
  assert.match(headers.get("permissions-policy") ?? "", /camera=\(\)/);
});

test("page CSP restricts sources to 'self' and never allows unsafe-inline or unsafe-eval", async () => {
  const html = await (await get(`${BASE}/`)).text();
  const policy = html.match(/<meta http-equiv="content-security-policy" content="([^"]*)"/)?.[1];

  assert.ok(policy, "no <meta> CSP on the homepage");
  assert.match(policy, /default-src 'self'/);
  assert.doesNotMatch(policy, /unsafe-inline|unsafe-eval/);
});

const redirects = [
  ["http://rhyssvivian.dev/about/", "https://rhyssvivian.dev/about/"],
  ["https://www.rhyssvivian.dev/thinking/?ref=smoke", "https://rhyssvivian.dev/thinking/?ref=smoke"],
  ["http://www.rhyssvivian.dev/projects/", "https://rhyssvivian.dev/projects/"],
];

for (const [from, to] of redirects) {
  // Hostname redirects live in Cloudflare (zone rules, Pages), so they only exist on production.
  test(`${from} redirects to ${to}`, { skip: !IS_PRODUCTION && "redirects are production-only" }, async () => {
    const response = await get(from);

    assert.ok([301, 308].includes(response.status), `expected a permanent redirect, got ${response.status}`);
    assert.equal(response.headers.get("location"), to);
  });
}
