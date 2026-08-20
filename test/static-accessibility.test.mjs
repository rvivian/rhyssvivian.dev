import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, root), "utf8");
}

test("layout has document language, dark default, skip navigation, and main landmark", async () => {
  const layout = await readProjectFile("src/layouts/BaseLayout.astro");

  assert.match(layout, /<html lang="en" data-theme="dark">/);
  assert.match(layout, /href="#main-content"/);
  assert.match(layout, /<main id="main-content" tabindex="-1">/);
  assert.match(layout, /<meta name="theme-color" content="#0c1517" \/>/);
});

test("primary navigation exposes current page state and accessible theme toggle state", async () => {
  const header = await readProjectFile("src/components/FieldHeader.astro");

  assert.match(header, /aria-label="Primary navigation"/);
  assert.match(header, /aria-current=\{isActive\(item\.href\) \? "page" : undefined\}/);
  assert.match(header, /data-theme-toggle/);
  assert.match(header, /aria-label="Switch to light mode"/);
  assert.match(header, /aria-pressed="false"/);
});

test("global styles include visible focus states and reduced motion handling", async () => {
  const styles = await readProjectFile("src/styles/field-journal.css");

  assert.match(styles, /:focus-visible/);
  assert.match(styles, /outline: 2px solid var\(--color-accent\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
});

test("name spelling is correct without mutating the domain spelling", async () => {
  const profile = await readProjectFile("src/data/profile.ts");

  assert.match(profile, /name: "Rhyss Vivian"/);
  assert.match(profile, /domain: "rhyssvivian\.dev"/);
  assert.doesNotMatch(profile, /Rhys Vivian/);
  assert.doesNotMatch(profile, /Rhysssvivian/);
});
