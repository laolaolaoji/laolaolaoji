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

test("homepage exposes identity and metadata without client JavaScript", async () => {
  const html = await readFile(
    new URL("../dist/index.html", import.meta.url),
    "utf8",
  );

  assert.match(html, /<html[^>]+lang="en"/i);
  assert.match(html, /Hello, I(?:&apos;|&#39;|’)m LTX\./i);
  assert.match(html, /Full-stack developer/i);
  assert.match(html, /property="og:title"/i);
  assert.doesNotMatch(html, /<script[^>]+type="module"/i);
});
