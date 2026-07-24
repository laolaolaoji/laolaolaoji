import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Astro production build emits the homepage", async () => {
  const html = await readFile(
    new URL("../dist/index.html", import.meta.url),
    "utf8",
  );

  assert.match(html, /<!doctype html>/i);
  assert.match(html, /<title>[^<]+<\/title>/i);
});
