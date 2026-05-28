#!/usr/bin/env node
// Headless smoke test for the sound-toys collection.
//
// Loads each HTML file in Chromium, fails on any console error or
// uncaught page error. Run from the repo root:
//
//     node tests/smoke.mjs
//
// Requires Playwright. If you don't have it installed:
//     npx playwright install chromium
//     npm i -g playwright
//
// or run it directly with npx:
//     npx --yes -p playwright node tests/smoke.mjs

import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const pages = [
  'index.html',
  'sound-toy-1.html',
  'acoustics-v7.html',
  'categories-of-sound.html',
  'types-of-soundwaves-scrubber.html',
  'beat-frequencies.html',
  'theremin.html',
  'karplus-strong.html',
  'formants.html',
  'doppler.html',
  'dashboard.html',
];

// The React-based toys load React + Babel from a CDN. In some sandboxed
// environments those requests fail with cert / network errors that aren't
// regressions in our code. Filter them out so the test stays meaningful.
const isExternalLoadError = (msg) =>
  /Failed to load resource|net::ERR_|ERR_CERT_/.test(msg);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });

let failed = 0;

for (const file of pages) {
  const page = await ctx.newPage();
  const issues = [];
  page.on('pageerror', (e) => issues.push('pageerror: ' + e.message));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    if (isExternalLoadError(m.text())) return;
    issues.push('console.error: ' + m.text());
  });

  const url = pathToFileURL(resolve(root, file)).href;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(400);
  } catch (e) {
    issues.push('navigation: ' + e.message);
  }

  if (issues.length) {
    failed += 1;
    console.log(`FAIL  ${file}`);
    for (const i of issues) console.log('      ' + i);
  } else {
    console.log(`PASS  ${file}`);
  }
  await page.close();
}

await browser.close();

if (failed > 0) {
  console.log(`\n${failed} of ${pages.length} pages had issues.`);
  process.exit(1);
}
console.log(`\nAll ${pages.length} pages OK.`);
