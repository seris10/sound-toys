# Smoke test

A single Playwright script that loads each toy in headless Chromium and
fails on any console error or page error.

The project has no build step and no `package.json`. The test stays out
of the way the same way: it's just one script, run via `npx`.

## Run

```bash
# One time:
npx --yes playwright install chromium

# Each time you want to check:
node tests/smoke.mjs
```

If `playwright` isn't installed locally, install it once globally with
`npm i -g playwright`, or invoke via `npx --yes -p playwright node
tests/smoke.mjs`.

## What it catches

- HTML pages that fail to parse (the original "broken Wave Types" bug)
- Uncaught exceptions during initial render
- `console.error` calls, except for CDN load failures that come from
  the host environment rather than our code (those are filtered out)

What it does **not** catch: audio output correctness, visual
regressions, mobile-specific bugs.
