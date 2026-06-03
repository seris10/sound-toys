# Sound Toys

Interactive audio experiments and visualizations. All client-side, no backend, no dependencies.

Every toy shares one idea, taken from the flagship **Resonance**: colour maps to
sound. Pitch sets hue (a full rainbow per octave, the way pitch-class synesthesia
describes it), register and loudness raise saturation and brightness, so what you
hear and what you see move together.

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
| **Doppler** | Drag a moving sound source past a listener; wavefronts bunch up in front and stretch behind, each ring tinted warm (approaching, higher) or cool (receding, lower), and the perceived pitch follows the maths. |
| **Resonance Live Console** | A dashboard that is itself a sound toy. A generative engine sings while a real spectrum analyser drives a radial pitch wheel, oscilloscope, scrolling spectrogram, band meters and telemetry &mdash; colour mapped to pitch throughout. Switch to your microphone, or play the pitch-coloured pads. |
| **Studio** | Four-track loop sandbox. Bake drums / bass / pluck / pad patterns or record from your microphone, then layer them with live master FFT + waveform. |

## Run locally

```bash
git clone https://github.com/seris10/sound-toys.git
open sound-toys/index.html
```

No build step, no dependencies. Just static HTML files.

## Known issues

**Mobile audio**: every toy now unlocks audio on your first tap (it resumes the
`AudioContext` and opens a media session so iOS routes Web Audio to the speaker).
If a toy still seems silent on an iPhone, check that the **side ring/silent
switch** isn't set to silent and that the media volume is up.

**Resonance**:
- There's a Parakeet mode loosely based on the frequencies and warble of parakeet chatter. Very loosely. I intend to improve on it, but as of now it's reception is somewhere betweeen concerned and confused, so take this as a disclaimer - this is not a toy for parakeets (yet).
  
