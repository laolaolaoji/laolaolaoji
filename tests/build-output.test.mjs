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

test("homepage preserves social and registration links", async () => {
  const html = await readFile(
    new URL("../dist/index.html", import.meta.url),
    "utf8",
  );

  assert.match(html, /href="https:\/\/github\.com\/laolaolaoji"/);
  assert.match(
    html,
    /href="https:\/\/www\.reddit\.com\/user\/fasting_sleep"/,
  );
  assert.match(html, /<footer[\s\S]*鄂ICP备17028589号-4[\s\S]*<\/footer>/i);
  assert.match(html, /href="https:\/\/beian\.miit\.gov\.cn\/"/);
  assert.equal((html.match(/<h1[ >]/gi) ?? []).length, 1);
});

test("mobile typography stays within the narrow viewport", async () => {
  const css = await readFile(
    new URL("../src/styles/global.css", import.meta.url),
    "utf8",
  );

  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.hero__masthead\s*{[\s\S]*flex-wrap:\s*wrap/);
  assert.match(css, /font-size:\s*clamp\(3\.7rem,\s*18vw,\s*5\.5rem\)/);
  assert.match(css, /\.composition\s*{[^}]*min-width:\s*0/);
  assert.match(css, /\.composition__copy\s*{\s*min-width:\s*0/);
});

test("build script creates Astro output before packaging", async () => {
  const script = await readFile(
    new URL("../build.sh", import.meta.url),
    "utf8",
  );

  assert.match(script, /npm run build/);
  assert.match(script, /cd dist/);
  assert.doesNotMatch(script, /"index\.html"/);
  assert.doesNotMatch(script, /"css\/"/);
});

test("critical CSS has no render-blocking remote font dependency", async () => {
  const css = await readFile(
    new URL("../src/styles/global.css", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(css, /@import\s+url\(/);
  assert.doesNotMatch(css, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
});
