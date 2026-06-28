import assert from "node:assert/strict";
import test from "node:test";
import {
  applyTheme,
  getInitialTheme,
  getNextTheme,
  normalizeTheme,
  THEME_STORAGE_KEY,
} from "../src/scripts/theme-toggle.js";

test("normalizes only supported theme names", () => {
  assert.equal(normalizeTheme("dark"), "dark");
  assert.equal(normalizeTheme("light"), "light");
  assert.equal(normalizeTheme("system"), null);
  assert.equal(normalizeTheme(null), null);
});

test("defaults to dark mode when no valid preference exists", () => {
  const emptyStorage = { getItem: () => null };
  const invalidStorage = { getItem: () => "system" };
  const throwingStorage = { getItem: () => { throw new Error("blocked"); } };

  assert.equal(getInitialTheme(emptyStorage), "dark");
  assert.equal(getInitialTheme(invalidStorage), "dark");
  assert.equal(getInitialTheme(throwingStorage), "dark");
});

test("uses a stored light preference when present", () => {
  const storage = {
    getItem: (key) => (key === THEME_STORAGE_KEY ? "light" : null),
  };

  assert.equal(getInitialTheme(storage), "light");
});

test("toggles between dark and light", () => {
  assert.equal(getNextTheme("dark"), "light");
  assert.equal(getNextTheme("light"), "dark");
  assert.equal(getNextTheme("unknown"), "light");
});

test("applies theme state and accessible toggle labels", () => {
  const label = { textContent: "" };
  const buttonAttributes = new Map();
  const button = {
    querySelector: () => label,
    setAttribute: (name, value) => buttonAttributes.set(name, value),
  };
  const root = { dataset: {} };

  applyTheme(root, button, "light");

  assert.equal(root.dataset.theme, "light");
  assert.equal(buttonAttributes.get("aria-pressed"), "true");
  assert.equal(buttonAttributes.get("aria-label"), "Switch to dark mode");
  assert.equal(label.textContent, "Dark");
});
