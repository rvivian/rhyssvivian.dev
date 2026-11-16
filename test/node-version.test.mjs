import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, root), "utf8");
}

const parse = (version) => version.replace(/^[^\d]*/, "").split(".").map(Number);

const atLeast = (version, minimum) => {
  const [a, b] = [parse(version), parse(minimum)];
  for (let i = 0; i < 3; i += 1) {
    if ((a[i] ?? 0) !== (b[i] ?? 0)) return (a[i] ?? 0) > (b[i] ?? 0);
  }
  return true;
};

const astroMinimumNode = async () => {
  const astro = JSON.parse(await readProjectFile("node_modules/astro/package.json"));
  const match = astro.engines.node.match(/^>=\s*(\d+\.\d+\.\d+)$/);
  assert.ok(match, `unexpected astro engines.node format: ${astro.engines.node}`);
  return match[1];
};

// Cloudflare Pages reads .node-version; without it the build image's default Node is used,
// which fell below Astro's minimum and broke production deploys.
test(".node-version pins a full Node version for deploy builds", async () => {
  const pinned = (await readProjectFile(".node-version")).trim();

  assert.match(pinned, /^\d+\.\d+\.\d+$/);
});

test(".node-version satisfies the installed Astro's minimum Node version", async () => {
  const pinned = (await readProjectFile(".node-version")).trim();
  const minimum = await astroMinimumNode();

  assert.ok(atLeast(pinned, minimum), `.node-version ${pinned} is below astro's >=${minimum}`);
});

test("package.json engines.node is no looser than Astro's own requirement", async () => {
  const pkg = JSON.parse(await readProjectFile("package.json"));
  const declared = pkg.engines.node.match(/^>=\s*(\d+\.\d+\.\d+)$/)?.[1];
  const minimum = await astroMinimumNode();

  assert.ok(declared, `unexpected engines.node format: ${pkg.engines.node}`);
  assert.ok(atLeast(declared, minimum), `engines.node >=${declared} is below astro's >=${minimum}`);
});
