# Sound Toys

Interactive audio experiments and visualizations. All client-side, no backend, no dependencies.

**Live:** [sound-toy-deploy.pages.dev](https://sound-toy-deploy.pages.dev)

## Toys

| Toy | Description |
|-----|-------------|
| **Resonance** | Interactive sound wave playground. Manipulate waveforms, frequencies, and harmonics in real time. |
| **Acoustic Field Simulation** | 2D pressure wave and vector field visualization with Gaussian pulses |
| **Sound Spectrum Explorer** | Browse how sounds are categorized across different spectra |
| **Sound Wave Types** | Compare the frequency ranges other species use to make and hear sound, from elephants to bats. Synthesized in-browser; sounds outside human hearing are pitched into it. |
| **Beat Frequencies** | Two pure tones with adjustable frequencies. Tune them close to hear (and see) the beating envelope at f&#8322;&minus;f&#8321;. |
| **Theremin** | Pointer-driven sine wave. Left/right for pitch (log-mapped), up/down for volume. Optional scale snapping. |
| **Karplus&ndash;Strong Strings** | Pluck a virtual string. Noise burst into a feedback delay loop &mdash; the simplest physical-modeling synth, audibly recognisable as a plucked string. |
| **Vowel Formants** | Drag through the IPA vowel chart and hear a sawtooth become recognisable vowels as two bandpass formants track tongue position. |
| **Doppler** | Drag a moving sound source around a listener; wavefronts bunch up in front and stretch behind, and the perceived pitch follows the maths. |
| **Resonant Dashboard** | An imagined student dashboard built as a sound toy: subject wheel, orbiting pods, photo drop, coin gauge &mdash; every element reacts to hover, click, drop, and time. |

## Run locally

```bash
git clone https://github.com/seris10/sound-toys.git
open sound-toys/index.html
```

No build step, no dependencies. Just static HTML files.

## Known issues

**Resonance**:
- Audio may not play on mobile browsers due to autoplay restrictions. Tap the screen after loading to enable sound. Possibly.
- There's a Parakeet mode loosely based on the frequencies and warble of parakeet chatter. Very loosely. I intend to improve on it, but as of now it's reception is somewhere betweeen concerned and confused, so take this as a disclaimer - this is not a toy for parakeets (yet).
  
