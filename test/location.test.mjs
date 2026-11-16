import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { formatLocation, site } from "../src/data/profile.ts";

test("site location is Anchorage's latitude, 61° N", () => {
  assert.equal(site.location.latitude, 61);
});

test("default location label renders the site latitude", () => {
  assert.equal(formatLocation(), "ALASKA · 61° N");
});

test("location label reports southern latitudes as positive degrees S", () => {
  assert.equal(formatLocation({ label: "Hobart", latitude: -42.9 }), "HOBART · 43° S");
});

// A hardcoded copy on the homepage is how 59° N survived after the profile was the intended source.
test("homepage waypoint derives latitude from site data instead of hardcoding it", async () => {
  const home = await readFile(new URL("../src/components/HomeIdentity.astro", import.meta.url), "utf8");

  assert.match(home, /site\.location\.latitude/);
  assert.doesNotMatch(home, /\d+\.\d{3} N</);
});
