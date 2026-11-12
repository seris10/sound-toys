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
  'studio.html',
  'biology.html',
  'patch.html',
];

// A script or stylesheet that fails to load (React, Babel or Tailwind from a
// CDN) fails the page: the toy is broken for visitors too. On a machine with
// no network, SMOKE_ALLOW_OFFLINE=1 restores the old behaviour of ignoring
// those failures. SMOKE_CHANNEL=chrome uses the installed Chrome instead of
// Playwright's bundled Chromium.
const allowOffline = process.env.SMOKE_ALLOW_OFFLINE === '1';
const isExternalLoadError = (msg) =>
  /Failed to load resource|net::ERR_|ERR_CERT_/.test(msg);

const viewports = [
  { name: 'desktop', viewport: { width: 1280, height: 800 } },
  { name: 'phone', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
];

const browser = await chromium.launch({
  channel: process.env.SMOKE_CHANNEL || undefined,
  args: ['--mute-audio'],
});

let failed = 0;
let runs = 0;

for (const vp of viewports) {
  const { name, ...options } = vp;
  const ctx = await browser.newContext(options);
  for (const file of pages) {
    runs += 1;
    const page = await ctx.newPage();
    const issues = [];
    page.on('pageerror', (e) => issues.push('pageerror: ' + e.message));
    page.on('console', (m) => {
      if (m.type() !== 'error') return;
      if (allowOffline && isExternalLoadError(m.text())) return;
      issues.push('console.error: ' + m.text());
    });
    page.on('requestfailed', (r) => {
      if (allowOffline || !['script', 'stylesheet'].includes(r.resourceType())) return;
      issues.push(`load failed: ${r.url()} (${r.failure()?.errorText})`);
    });
    page.on('response', (r) => {
      const type = r.request().resourceType();
      if (allowOffline || !['script', 'stylesheet'].includes(type) || r.status() < 400) return;
      issues.push(`load failed: ${r.url()} (HTTP ${r.status()})`);
    });

    const url = pathToFileURL(resolve(root, file)).href;
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(400);
      if (name === 'phone') {
        // clientWidth, not innerWidth: mobile emulation widens innerWidth to
        // fit overflowing content, which hides the overflow it should catch.
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (overflow > 1) issues.push(`horizontal overflow: ${overflow}px at 390px wide`);
      }
    } catch (e) {
      issues.push('navigation: ' + e.message);
    }

    if (issues.length) {
      failed += 1;
      console.log(`FAIL  ${name.padEnd(7)} ${file}`);
      for (const i of issues) console.log('      ' + i);
    } else {
      console.log(`PASS  ${name.padEnd(7)} ${file}`);
    }
    await page.close();
  }
  await ctx.close();
}

await browser.close();

if (failed > 0) {
  console.log(`\n${failed} of ${runs} page loads had issues.`);
  process.exit(1);
}
console.log(`\nAll ${runs} page loads OK (${pages.length} pages x ${viewports.length} widths).`);
