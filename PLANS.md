# Sound Toys — Roadmap

Plans for fixing and improving the existing toys, plus a backlog of new toys
to add. Grouped roughly by "ship soon" → "ship later," with notes on scope and
risk so they can be picked off independently.

The project's design constraint is "zero build, zero deps, one HTML file per
toy" (per README). All proposals respect that. React-based toys keep using
React + Babel via CDN like the existing ones.

---

## Part 1 — Fix & polish what's already there

### 1.1 Fix `types-of-soundwaves-scrubber.html` (currently broken)

**Symptom:** README calls this out: *"Neither of which you can hear, because I
broke this one."*

**Actual root cause:** The file is not HTML — it is React/JSX source code saved
with an `.html` extension. The first line is
`import React, { useState, useEffect, useRef, useMemo } from 'react';` and it
imports icons from `lucide-react`. Browsers cannot execute ESM imports of npm
packages without a bundler, so the page loads to a blank screen / parse error.
The "compiled" version of essentially the same component is
`categories-of-sound.html`.

**Options (pick one):**

- **A. Delete it** and update `index.html` + `README.md` to drop the "Wave
  Types" nav entry. Lowest effort. Loses the README's promise of comparing
  elephants → bats.
- **B. Convert to self-contained HTML** in the same style as the other React
  toys (React + Babel CDN, inlined SVGs replacing `lucide-react` imports).
  Restores the toy as-is. Medium effort.
- **C. Rebuild it as the audible version it was meant to be** (recommended).
  Take option B but also add Web Audio: synthesize each creature's signature
  sound (elephant infrasonic rumble at ~15 Hz, sparrow chirp ~4 kHz, bat
  echolocation click ~50 kHz heterodyned down to audible range). The README
  joke implies this was the original intent.

**Suggested scope for C:**
- Replace each `lucide-react` import with an inline SVG (the file already has
  custom SVGs for elephant/bat/dolphin/liver/thyroid — extend the same
  pattern).
- Add a "Play" button per creature card that triggers a short, frequency-
  accurate sample synthesized live (oscillator + envelope + noise component).
- For ultrasonic ranges, frequency-shift to the audible band and label it
  clearly ("Pitched down 32× so you can hear it").

### 1.2 Resonance (`sound-toy-1.html`) — quality of life

The featured toy, ~2,100 lines, mostly polished. Targeted fixes:

- **Mobile audio gate.** Add an explicit "Tap to start" overlay that creates
  the `AudioContext` on first user gesture, then removes itself. Today the
  README admits this is unreliable.
- **Keyboard shortcuts.** Map `Z S X D C V G B H N J M` to a chromatic
  octave (classic soft-synth layout) so a desktop user can play without
  dragging the canvas.
- **Recording / export.** Hook the existing analyser node into a
  `MediaRecorder` and offer a "Record" button that downloads a `.webm` or
  `.wav`. Low risk, high "wow."
- **Web MIDI input.** Optional — feature-detect `navigator.requestMIDIAccess`
  and route note-on/off through the existing oscillator chain so a USB
  controller works.
- **Parakeet mode rework.** README admits the current FM+AM model gets a
  "concerned and confused" reception. Try a small set of recorded-from-life
  parakeet motifs replayed via Karplus-Strong-like noise+filter chains, or
  short snippets of granular noise modulated by a frequency contour that
  matches measured spectrograms. Even gating it behind an explicit "this is
  not for parakeets" disclaimer with a link to a paper would help.
- **Perf.** The per-frame color-history blending across 4 rings does a lot of
  trig per draw. Cache `Math.sin/cos` lookups or downsample the history. Use
  `performance.now()` deltas to skip frames when the tab is hidden.
- **Accessibility.** Add ARIA labels to slider controls, focus outlines, and
  a `prefers-reduced-motion` branch that stops the petal rotation.

### 1.3 Acoustic Field Simulation (`acoustics-v7.html`)

Solid teaching simulation, but currently silent and read-only.

- **Make the probe point draggable.** It is hard-coded to source + 220 px to
  the right; turning it into a draggable handle lets users sample pressure
  anywhere.
- **Make the source draggable; allow multiple sources.** Click to add a new
  emitter, drag to move. Two sources gives a free interference / two-slit
  demo.
- **Reflective walls.** Optional toggle that bounces wavefronts off the canvas
  edges (or off a user-drawn rectangle). Best teaching payoff per line of
  code.
- **Add audio.** Tap the probe-point pressure series into a Web Audio
  `AudioBuffer` (downsampled to 44.1 kHz) so the user can literally hear what
  the probe "hears." Cap gain to prevent infrasound clipping.
- **Expose the magic numbers.** Wavelength (120 px) and amplitude (18) are
  hard-coded. Add two sliders.
- **Mobile layout.** The top-left control panel currently overlaps the
  central source on narrow screens. Move to a collapsible bottom drawer like
  Resonance has.

### 1.4 Sound Spectrum Explorer (`categories-of-sound.html`)

Beautifully visual but, like Wave Types, **purely visual** — there is no
sound. Adding even a small amount of audio would transform it.

- **Play the swept frequency.** Below ~20 Hz and above ~20 kHz, play a
  representative shifted tone with a clear label ("Pitched up 1024× so you
  can hear what infrasound *looks* like"). Cap gain at very high frequencies
  to avoid speaker damage.
- **Snap-to landmarks.** Add ticks for: 20 Hz (audible floor), 440 Hz (A4),
  20 kHz (audible ceiling), 2 MHz (medical ultrasound), etc. Snap when within
  a few pixels.
- **Keyboard support.** Left/Right to scrub, Shift+Arrow for coarse jumps to
  the next category.
- **Onboarding overlay** currently fades after ~1 s — too fast on slow
  devices. Fade only after the first drag (it already tracks `hasInteracted`,
  just gate the fade on that).
- **Dead imports.** `Radio` and `Stethoscope` icon variables are declared and
  never used; drop them.

### 1.5 Cross-cutting site polish

- **Favicon.** None today; add a tiny waveform/speaker SVG favicon to
  `index.html` and reference it from each toy.
- **Open Graph + Twitter card meta tags** on `index.html` so the live site
  previews nicely when shared.
- **Iframe sandbox + first-paint.** `index.html` uses
  `sandbox="allow-scripts allow-same-origin allow-popups"` — keep this but
  add a brief loading state (the React toys can take ~300 ms for Babel to
  parse before anything renders, which currently shows a blank pane).
- **Nav tag consistency.** Index cards tag Categories and Wave Types as
  "React" but Resonance is React too and tagged "Featured." Either drop the
  tech tags or apply them uniformly.
- **Reduced motion.** Respect `prefers-reduced-motion` site-wide; today the
  Resonance petals and the Spectrum sweeping waves both ignore it.
- **Smoke test.** Add a tiny `tests/` folder with a single Playwright /
  Puppeteer script that opens each toy, waits for `window.load`, checks the
  console has no errors, and screenshots. This is the cheapest insurance
  against another "I broke this one" regression.

---

## Part 2 — New toys to add

Each entry is sized roughly by file size (the existing toys are 18–99 KB
single files). Tag legend: **[Audio]** uses Web Audio, **[Vis]** is
visualization-led, **[Game]** has a goal/score.

### 2.1 High-value, low-effort

#### Beat Frequencies & Interference [Audio][Vis] — ~12 KB
Two oscillators side-by-side with frequency sliders. Visualize the sum
waveform and play it. Vary one by 1–10 Hz from the other to hear the
characteristic beating envelope. Great companion to Resonance and the
clearest possible "math you can hear."

#### Theremin (mouse / touch) [Audio] — ~8 KB
Move the cursor across the screen — X = pitch (log-mapped), Y = volume.
Optional scale-snapping (chromatic, major, minor, pentatonic, Bohlen-Pierce).
Tiny scope of work; doubles as a mobile-first toy where Resonance struggles.

#### Polyrhythm Sequencer [Audio][Vis] — ~14 KB
Two (or three) concentric circular step sequencers with independently
adjustable step counts (e.g. 5 vs 7). Watch the beats align and drift; hear
the resulting polyrhythm. Easy to make beautiful.

#### Microphone Spectrogram [Audio][Vis] — ~10 KB
`getUserMedia` → `AnalyserNode.getFloatFrequencyData()` → scrolling
spectrogram. Whistle, sing, snap. Pairs naturally with Wave Types since you
can locate your own voice on the spectrum. Needs a clear mic-permission
prompt and a "Stop" button.

### 2.2 Medium effort, high educational payoff

#### Karplus–Strong Plucked String [Audio][Vis] — ~12 KB
Click on a string → fills a delay line with white noise → low-pass filter in
the feedback loop produces a plucked-string sound. Visualize the delay line
contents. Classic physical-modeling demo; one of the best "wait, *that* makes
a guitar?" moments in audio DSP.

#### Doppler Playground [Audio][Vis] — ~14 KB
Drag a sound source around a 2D field where a listener stands. As the source
moves, the listener's pitch shifts according to relative radial velocity.
Show velocity vectors. Optional "siren" preset that runs back and forth.

#### Formant / Vowel Synthesizer [Audio][Vis] — ~12 KB
Two sliders for F1 and F2 (the two main vowel formants), with the vowel
chart (the IPA "vowel quadrilateral") drawn behind them. Drag the cursor
through the chart, hear /a/ → /e/ → /i/ → /o/ → /u/ morph in real time.
Source is a sawtooth (glottal pulse), shaped by three biquad bandpass
filters.

#### Drum Head — 2D Wave Equation [Audio][Vis] — ~20 KB
Finite-difference simulation of a circular membrane. Click to strike at a
position; the resulting modal mixture is *audibly* different depending on
where you strike (center → fundamental, edge → many overtones). Synthesize
the sound from the simulated displacement at a "pickup" point. Direct
companion to `acoustics-v7.html` (which is the 2D wave equation, just
without the sound).

### 2.3 Bigger projects

#### Granular Sandbox [Audio][Vis] — ~25 KB
Drop in (or record from mic) a short audio clip. Sliders for grain size
(5–500 ms), grain density (grains/sec), playback position, position jitter,
pitch jitter. Visualize each grain as a dot on a position/pitch scatter.
Lots of "happy accident" sound design.

#### Reverb Playground (draw your own IR) [Audio][Vis] — ~20 KB
Draw an impulse response on a canvas (or generate one from sliders: room
size, decay, pre-delay, density). Use `ConvolverNode` to wet a dry source
(built-in drum loop or mic). Visualize the resulting wet signal next to the
dry. Educational: shows that reverb is "just" a long, fancy delay pattern.

#### Echolocation / Sonar Game [Audio][Game] — ~22 KB
A 2D map (hidden by darkness). Click to emit a ping; echoes return at delays
proportional to distance, with attenuation. Goal: locate hidden objects by
ear alone. Companion to Acoustic Field Simulation. Easy variants for kids,
hard variants with multiple overlapping echoes.

#### Tone-Match Puzzle [Audio][Game] — ~18 KB
A target tone is played (random waveform, harmonics, ADSR). Player adjusts
sliders to match it. Score = inverse spectral distance. Builds intuition for
what each synth parameter actually does, in a way that pure Resonance
exploration doesn't force.

### 2.4 Stretch / nice-to-have

- **Chord & interval explorer** — keyboard with interval ratios shown as
  fractions; toggle between equal temperament and just intonation; hear the
  beating disappear.
- **Microtonal scale lab** — 12-TET vs 19-TET vs 31-TET vs harmonic series;
  visualize the Pythagorean comma.
- **Cymatics** — Chladni-plate style standing-wave patterns driven by a
  sine sweep.
- **Bird call identifier (offline)** — load 4–5 sampled spectrograms and
  let users match a played call to a species. Cute, scoped.

---

## Suggested order of operations

1. **Fix Wave Types** (option C above) — unblocks the README's headline
   claim and is the smallest, most visible win.
2. **Add a smoke test** before doing anything else, so future regressions
   are caught.
3. **Cross-cutting polish** (favicon, OG tags, reduced-motion, loading
   state) — touches every page, easier to do as one pass.
4. **Resonance: mobile gate + recording + keyboard shortcuts.**
5. **First two new toys: Beat Frequencies and Theremin** — small, high
   payoff, fill obvious gaps.
6. **Spectrum + Acoustics audio** — both are visual-only today; adding
   sound is the single highest-impact change to each.
7. **One bigger new toy per cycle** from §2.2/§2.3 based on what feels
   freshest.
