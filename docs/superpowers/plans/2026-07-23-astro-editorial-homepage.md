# Astro Editorial Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the legacy single HTML page with a responsive Astro-generated editorial developer card while preserving GitHub, Reddit, dual deployment compatibility, and the exact ICP registration footer.

**Architecture:** Astro builds a zero-framework static page from focused layout and presentation components. Typed site data is the single source of truth for identity and external links; a Node test reads the production output and protects critical links, semantics, and no-JavaScript content. GitHub Pages and the existing nginx upload script both consume `dist/`.

**Tech Stack:** Astro, TypeScript, semantic HTML, modern CSS, Node.js built-in test runner, GitHub Actions

---

## File Map

- Create `package.json`: scripts, Astro dependency, and project metadata.
- Create `astro.config.mjs`: static-output configuration.
- Create `tsconfig.json`: Astro strict TypeScript preset.
- Create `.gitignore`: ignore dependencies, generated output, and visual-companion artifacts.
- Create `public/L.svg`, `public/favicon.ico`, `public/robots.txt`, `public/ads.txt`: static files copied from the existing root files.
- Create `src/data/site.ts`: typed identity, social, and registration content.
- Create `src/layouts/BaseLayout.astro`: document shell and metadata.
- Create `src/components/Hero.astro`: masthead and identity content.
- Create `src/components/SocialLinks.astro`: semantic external-link list.
- Create `src/components/OrbitArtwork.astro`: decorative CSS artwork.
- Create `src/components/SiteFooter.astro`: ICP registration footer.
- Create `src/styles/global.css`: tokens, editorial composition, motion, focus, and responsive behavior.
- Replace `src/pages/index.astro`: compose the single homepage.
- Create `tests/build-output.test.mjs`: production-output contract tests.
- Create `.github/workflows/deploy.yml`: build and deploy `dist/` to GitHub Pages.
- Modify `build.sh`: build first and package the contents of `dist/`, preserving current remote-host commands.
- Modify `README.md`: local development, build, test, and deployment instructions.
- Remove legacy `index.html` and `css/`: prevent the old page from competing with Astro output.

### Task 1: Scaffold the Astro static project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `tests/build-output.test.mjs`

- [ ] **Step 1: Write the failing project contract test**

Create `tests/build-output.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Astro production build emits the homepage", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(html, /<!doctype html>/i);
  assert.match(html, /<title>[^<]+<\/title>/i);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/build-output.test.mjs`

Expected: FAIL with `ENOENT` for `dist/index.html`.

- [ ] **Step 3: Add the Astro project configuration**

Create `package.json`:

```json
{
  "name": "laolaolaoji-homepage",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "npm run build && node --test tests/*.test.mjs"
  },
  "devDependencies": {
    "astro": "^5.0.0"
  }
}
```

Create `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://laolaolaoji.github.io",
  output: "static",
  build: { format: "directory" },
});
```

Create `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

Create `.gitignore`:

```gitignore
node_modules/
dist/
.astro/
.superpowers/
laolaolaoji.zip
```

- [ ] **Step 4: Install the locked dependency set**

Run: `npm install`

Expected: `package-lock.json` is created and npm reports no install error.

- [ ] **Step 5: Verify Astro is available**

Run: `npx astro --version`

Expected: an Astro version is printed with exit code 0.

- [ ] **Step 6: Commit the scaffold**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore tests/build-output.test.mjs
git commit -m "build: scaffold Astro static site"
```

### Task 2: Move static assets into Astro public output

**Files:**
- Create: `public/L.svg`
- Create: `public/favicon.ico`
- Create: `public/robots.txt`
- Create: `public/ads.txt`
- Delete: `L.svg`
- Delete: `favicon.ico`
- Delete: `robots.txt`
- Delete: `ads.txt`

- [ ] **Step 1: Move the existing public files without changing their contents**

Run:

```bash
mkdir -p public
git mv L.svg favicon.ico robots.txt ads.txt public/
```

Expected: `git status --short` reports four renames into `public/`.

- [ ] **Step 2: Verify the public-file contract**

Run:

```bash
test -s public/L.svg
test -s public/favicon.ico
test -f public/robots.txt
test -f public/ads.txt
```

Expected: all commands exit 0.

- [ ] **Step 3: Commit the asset move**

```bash
git add public L.svg favicon.ico robots.txt ads.txt
git commit -m "chore: move static assets into Astro public directory"
```

### Task 3: Define the typed content and document shell

**Files:**
- Create: `src/data/site.ts`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/styles/global.css`

- [ ] **Step 1: Expand the failing output test for metadata and identity**

Append inside `tests/build-output.test.mjs`:

```js
test("homepage exposes identity and metadata without client JavaScript", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(html, /<html[^>]+lang="en"/i);
  assert.match(html, /Hello, I(?:&apos;|&#39;|’)m LTX\./i);
  assert.match(html, /Full-stack developer/i);
  assert.match(html, /property="og:title"/i);
  assert.doesNotMatch(html, /<script[^>]+type="module"/i);
});
```

- [ ] **Step 2: Run the test to verify the new contract fails**

Run: `node --test tests/build-output.test.mjs`

Expected: FAIL because `dist/index.html` does not exist yet.

- [ ] **Step 3: Add the typed site data**

Create `src/data/site.ts`:

```ts
export interface SocialLink {
  label: string;
  href: string;
  index: string;
}

export const site = {
  title: "LTX — Full-stack developer & creator",
  description: "LTX is a full-stack developer, Linux lover, web designer, and creator.",
  eyebrow: "LTX / DEV",
  heading: "Hello, I’m LTX.",
  roles: ["Full-stack developer", "Linux lover", "Web designer", "Creator"],
  socials: [
    { index: "01", label: "GitHub", href: "https://github.com/laolaolaoji" },
    { index: "02", label: "Reddit", href: "https://www.reddit.com/user/fasting_sleep" },
  ] satisfies SocialLink[],
  registration: {
    label: "鄂ICP备17028589号-4",
    href: "https://beian.miit.gov.cn/",
  },
} as const;
```

- [ ] **Step 4: Add the base layout and initial tokens**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import "../styles/global.css";

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <link rel="canonical" href={canonicalURL} />
    <link rel="icon" href="/L.svg" type="image/svg+xml" />
    <link rel="alternate icon" href="/favicon.ico" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

Create `src/styles/global.css` with the foundational tokens:

```css
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display:ital@0;1&display=swap");

:root {
  color-scheme: light;
  --paper: #eee8dc;
  --ink: #181713;
  --muted: #67635b;
  --accent: #b73b25;
  --rule: rgb(24 23 19 / 22%);
  font-family: "DM Sans", "Noto Sans", sans-serif;
  background: var(--paper);
  color: var(--ink);
}

* { box-sizing: border-box; }
html { min-width: 320px; background: var(--paper); }
body { min-height: 100vh; margin: 0; }
a { color: inherit; }
```

- [ ] **Step 5: Commit the content foundation**

```bash
git add src/data/site.ts src/layouts/BaseLayout.astro src/styles/global.css tests/build-output.test.mjs
git commit -m "feat: add typed site content and document layout"
```

### Task 4: Build the semantic homepage components

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/SocialLinks.astro`
- Create: `src/components/OrbitArtwork.astro`
- Create: `src/components/SiteFooter.astro`
- Create: `src/pages/index.astro`

- [ ] **Step 1: Expand the failing output test for links and footer semantics**

Append inside `tests/build-output.test.mjs`:

```js
test("homepage preserves social and registration links", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(html, /href="https:\/\/github\.com\/laolaolaoji"/);
  assert.match(html, /href="https:\/\/www\.reddit\.com\/user\/fasting_sleep"/);
  assert.match(html, /<footer[\s\S]*鄂ICP备17028589号-4[\s\S]*<\/footer>/i);
  assert.match(html, /href="https:\/\/beian\.miit\.gov\.cn\/"/);
  assert.equal((html.match(/<h1[ >]/gi) ?? []).length, 1);
});
```

- [ ] **Step 2: Run the test to verify it still fails**

Run: `node --test tests/build-output.test.mjs`

Expected: FAIL with `ENOENT` because the homepage has not been built.

- [ ] **Step 3: Create the hero and social list**

Create `src/components/Hero.astro`:

```astro
---
interface Props {
  eyebrow: string;
  heading: string;
  roles: readonly string[];
}

const { eyebrow, heading, roles } = Astro.props;
---

<header class="hero">
  <div class="hero__masthead reveal reveal--1">
    <span>{eyebrow}</span>
    <span class="hero__status"><i aria-hidden="true"></i> Available online</span>
  </div>
  <h1 id="page-title" class="hero__title reveal reveal--2">{heading}</h1>
  <p class="hero__roles reveal reveal--3">{roles.join(" · ")}</p>
</header>
```

Create `src/components/SocialLinks.astro`:

```astro
---
import type { SocialLink } from "../data/site";

interface Props { links: readonly SocialLink[]; }
const { links } = Astro.props;
---

<nav class="social reveal reveal--4" aria-label="Social profiles">
  <p class="section-label">Elsewhere</p>
  <ul class="social__list">
    {links.map((link) => (
      <li>
        <a href={link.href} target="_blank" rel="noopener noreferrer">
          <span class="social__index">{link.index}</span>
          <span>{link.label}</span>
          <span class="social__arrow" aria-hidden="true">↗</span>
        </a>
      </li>
    ))}
  </ul>
</nav>
```

- [ ] **Step 4: Create the decorative art and protected footer**

Create `src/components/OrbitArtwork.astro`:

```astro
<div class="orbit" aria-hidden="true">
  <div class="orbit__ring orbit__ring--outer"></div>
  <div class="orbit__ring orbit__ring--inner"></div>
  <div class="orbit__axis"></div>
  <span class="orbit__node orbit__node--a"></span>
  <span class="orbit__node orbit__node--b"></span>
  <span class="orbit__caption">SYSTEMS / WEB / FORM</span>
</div>
```

Create `src/components/SiteFooter.astro`:

```astro
---
interface Props { label: string; href: string; }
const { label, href } = Astro.props;
---

<footer class="site-footer reveal reveal--5">
  <span>© {new Date().getFullYear()} LTX</span>
  <a href={href} target="_blank" rel="noopener noreferrer">{label}</a>
</footer>
```

- [ ] **Step 5: Compose the page**

Create `src/pages/index.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Hero from "../components/Hero.astro";
import OrbitArtwork from "../components/OrbitArtwork.astro";
import SiteFooter from "../components/SiteFooter.astro";
import SocialLinks from "../components/SocialLinks.astro";
import { site } from "../data/site";
---

<BaseLayout title={site.title} description={site.description}>
  <main class="page-shell">
    <div class="edition" aria-hidden="true">Portfolio / Edition 01</div>
    <section class="composition" aria-labelledby="page-title">
      <div class="composition__copy">
        <Hero eyebrow={site.eyebrow} heading={site.heading} roles={site.roles} />
        <SocialLinks links={site.socials} />
      </div>
      <OrbitArtwork />
    </section>
    <SiteFooter {...site.registration} />
  </main>
</BaseLayout>
```

- [ ] **Step 6: Build and verify the contract passes**

Run: `npm test`

Expected: Astro build succeeds and all three Node tests PASS.

- [ ] **Step 7: Commit the semantic page**

```bash
git add src/components src/pages/index.astro tests/build-output.test.mjs
git commit -m "feat: compose semantic developer homepage"
```

### Task 5: Implement the editorial composition and accessible motion

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add the complete layout and component styles**

Append to `src/styles/global.css`:

```css
body::before {
  position: fixed;
  inset: 0;
  pointer-events: none;
  content: "";
  opacity: 0.14;
  background-image: linear-gradient(var(--rule) 1px, transparent 1px), linear-gradient(90deg, var(--rule) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(to bottom, black, transparent 72%);
}

.page-shell { position: relative; display: flex; flex-direction: column; min-height: 100svh; padding: clamp(1.25rem, 3vw, 3rem); overflow: hidden; }
.edition { position: absolute; top: 50%; right: 1rem; writing-mode: vertical-rl; transform: translateY(-50%); color: var(--muted); font-size: .68rem; letter-spacing: .18em; text-transform: uppercase; }
.composition { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(18rem, .85fr); align-items: center; flex: 1; gap: clamp(2rem, 6vw, 7rem); width: min(100%, 90rem); margin-inline: auto; }
.hero__masthead { display: flex; justify-content: space-between; gap: 1rem; padding-bottom: .8rem; border-bottom: 1px solid var(--ink); font-size: .72rem; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; }
.hero__status { display: inline-flex; align-items: center; gap: .45rem; color: var(--muted); }
.hero__status i { width: .45rem; aspect-ratio: 1; border-radius: 50%; background: var(--accent); }
.hero__title { max-width: 8ch; margin: clamp(3rem, 8vh, 7rem) 0 1.5rem; font-family: "DM Serif Display", Georgia, serif; font-size: clamp(4.2rem, 10vw, 9.8rem); font-weight: 400; letter-spacing: -.055em; line-height: .8; }
.hero__roles { max-width: 42rem; margin: 0; color: var(--muted); font-size: clamp(.82rem, 1.2vw, 1.05rem); line-height: 1.7; }
.section-label { margin: 0 0 .7rem; color: var(--muted); font-size: .68rem; letter-spacing: .18em; text-transform: uppercase; }
.social { width: min(100%, 33rem); margin-top: clamp(3rem, 7vh, 6rem); }
.social__list { margin: 0; padding: 0; border-top: 1px solid var(--ink); list-style: none; }
.social__list a { display: grid; grid-template-columns: 2.5rem 1fr auto; gap: 1rem; align-items: center; padding: .9rem .2rem; border-bottom: 1px solid var(--rule); text-decoration: none; }
.social__index { color: var(--muted); font-size: .68rem; }
.social__arrow { transition: transform 180ms ease; }
.social__list a:hover .social__arrow, .social__list a:focus-visible .social__arrow { transform: translate(.2rem, -.2rem); }
a:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
.orbit { position: relative; aspect-ratio: 1; width: min(100%, 34rem); justify-self: center; }
.orbit__ring { position: absolute; border: 1px solid var(--ink); border-radius: 50%; }
.orbit__ring--outer { inset: 4%; animation: orbit-turn 28s linear infinite; }
.orbit__ring--inner { inset: 22%; border-color: var(--accent); transform: rotate(28deg) scaleY(.5); }
.orbit__axis { position: absolute; top: 50%; left: 4%; width: 92%; height: 1px; background: var(--ink); transform: rotate(-24deg); }
.orbit__node { position: absolute; width: .9rem; aspect-ratio: 1; border-radius: 50%; background: var(--accent); }
.orbit__node--a { top: 16%; right: 20%; }
.orbit__node--b { bottom: 9%; left: 42%; background: var(--ink); }
.orbit__caption { position: absolute; right: 0; bottom: 22%; font-size: .62rem; letter-spacing: .16em; writing-mode: vertical-rl; }
.site-footer { display: flex; justify-content: space-between; gap: 1.5rem; width: min(100%, 90rem); margin-inline: auto; padding-top: 1rem; border-top: 1px solid var(--ink); color: var(--muted); font-size: .72rem; }
.site-footer a { text-underline-offset: .2em; }
.reveal { animation: reveal 700ms cubic-bezier(.2,.7,.2,1) both; }
.reveal--2 { animation-delay: 90ms; }.reveal--3 { animation-delay: 160ms; }.reveal--4 { animation-delay: 230ms; }.reveal--5 { animation-delay: 300ms; }
@keyframes reveal { from { opacity: 0; transform: translateY(1rem); } }
@keyframes orbit-turn { to { transform: rotate(360deg); } }

@media (max-width: 760px) {
  .page-shell { overflow: clip; }
  .edition { display: none; }
  .composition { grid-template-columns: 1fr; align-content: start; gap: 2rem; }
  .hero__masthead { margin-top: 1rem; }
  .hero__title { margin-top: 3.5rem; font-size: clamp(4rem, 22vw, 7rem); }
  .orbit { position: absolute; z-index: -1; top: 34%; right: -34%; width: 24rem; opacity: .2; }
  .social { margin: 4rem 0 5rem; }
  .site-footer { flex-direction: column; gap: .5rem; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
```

- [ ] **Step 2: Run the full build contract**

Run: `npm test`

Expected: Astro build succeeds and all Node tests PASS.

- [ ] **Step 3: Start a local preview and inspect desktop and mobile**

Run: `npm run dev -- --host 127.0.0.1`

Expected: the homepage renders at the printed local URL; at 1440×900 and 390×844 there is no horizontal scrollbar, the footer does not overlap content, and GitHub/Reddit focus states are visible.

- [ ] **Step 4: Verify reduced motion in browser developer tools**

Emulate `prefers-reduced-motion: reduce`, reload, and confirm content appears without visible entrance or continuous orbit animation.

- [ ] **Step 5: Commit the visual system**

```bash
git add src/styles/global.css
git commit -m "style: add editorial layout and accessible motion"
```

### Task 6: Protect deployment output and remove the legacy page

**Files:**
- Modify: `build.sh`
- Create: `.github/workflows/deploy.yml`
- Delete: `index.html`
- Delete: `css/reset.css`
- Delete: `css/styles.css`
- Delete: `css/themes/*.css`

- [ ] **Step 1: Add a deployment-package test**

Append inside `tests/build-output.test.mjs`:

```js
test("build script creates Astro output before packaging", async () => {
  const script = await readFile(new URL("../build.sh", import.meta.url), "utf8");
  assert.match(script, /npm run build/);
  assert.match(script, /cd dist/);
  assert.doesNotMatch(script, /"index\.html"/);
  assert.doesNotMatch(script, /"css\/"/);
});
```

- [ ] **Step 2: Run the test and verify the deployment contract fails**

Run: `npm test`

Expected: the first three tests PASS and the new build-script test FAILS because the legacy file list is still present.

- [ ] **Step 3: Change only the local build and packaging section of `build.sh`**

Replace the legacy `FILES_TO_ZIP` array and root-directory `zip` call with:

```bash
npm run build || exit 1

OUTPUT_ZIP="laolaolaoji.zip"

if ! command -v zip &>/dev/null; then
    echo "zip 命令未找到，请安装 zip 工具 (如: sudo apt install zip)"
    exit 1
fi

(cd dist && zip -r "../$OUTPUT_ZIP" .) >/dev/null 2>&1
```

Keep the current `hosts_and_ports` and every remote SSH/SCP command exactly as found at execution time. Do not re-add, remove, or otherwise alter nginx reload behavior while making this packaging change.

- [ ] **Step 4: Add the GitHub Pages workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Astro site to Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 5: Remove the legacy page and CSS**

Run:

```bash
git rm index.html
git rm -r css
```

Expected: only the Astro page remains as a homepage source.

- [ ] **Step 6: Run the full contract**

Run: `npm test`

Expected: all four Node tests PASS.

- [ ] **Step 7: Validate the shell script without deploying**

Run: `bash -n build.sh`

Expected: exit code 0 and no output. Do not execute `./build.sh`, because that performs remote deployment.

- [ ] **Step 8: Commit deployment changes**

```bash
git add build.sh .github/workflows/deploy.yml tests/build-output.test.mjs index.html css
git commit -m "build: deploy Astro output to Pages and nginx"
```

### Task 7: Document and perform final verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace the README with project-specific instructions**

Use this content:

````markdown
# LTX Homepage

An Astro-generated static developer homepage with an editorial visual direction.

## Local development

```sh
npm install
npm run dev
```

## Verification

```sh
npm test
```

This builds `dist/` and verifies the homepage metadata, social links, semantic footer, and ICP registration link.

## Deployment

- GitHub Pages deploys `dist/` through `.github/workflows/deploy.yml` after a push to `master`.
- `build.sh` builds and uploads the same `dist/` files to the configured nginx host. Running it performs a real remote deployment.
````

- [ ] **Step 2: Run final automated verification**

Run: `npm test && bash -n build.sh && git diff --check`

Expected: all tests PASS, shell syntax exits 0, and `git diff --check` prints no errors.

- [ ] **Step 3: Check critical strings directly in generated output**

Run:

```bash
rg -n "鄂ICP备17028589号-4|github.com/laolaolaoji|reddit.com/user/fasting_sleep|beian.miit.gov.cn" dist/index.html
```

Expected: all four values are present in `dist/index.html`.

- [ ] **Step 4: Confirm generated JavaScript is absent**

Run: `find dist -type f -name '*.js' -print`

Expected: no output.

- [ ] **Step 5: Commit the documentation**

```bash
git add README.md
git commit -m "docs: document Astro homepage workflows"
```

- [ ] **Step 6: Review the final worktree**

Run: `git status --short`

Expected: no task-related uncommitted files; any pre-existing user changes are reported separately and left untouched.
