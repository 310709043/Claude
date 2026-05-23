// Generates a deep-night ambient bed as a mono 44.1k WAV — no external deps.
// Layers: low drone (A1/E2/A2) + soft Am pad (A3/C4/E4) + filtered "air" noise
// swells + occasional soft shimmer bells. Levels kept low; Remotion fades in/out.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const DURATION = 145; // seconds (slightly longer than the video)
const N = SR * DURATION;

const out = new Float32Array(N);
const TAU = Math.PI * 2;

// deterministic pseudo-random
let seed = 1337;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

const drone = [55, 82.41, 110]; // A1, E2, A2
const pad = [220, 261.63, 329.63]; // A minor: A3 C4 E4

// one-pole low-pass state for air noise
let lp = 0;
const fc = 380;
const rc = 1 / (TAU * fc);
const dt = 1 / SR;
const a = dt / (rc + dt);

// schedule shimmer bells every ~14s with jitter
const bells = [];
for (let t = 8; t < DURATION - 6; t += 12 + rnd() * 8) {
  bells.push({ t, f: [880, 1174.7, 1318.5][Math.floor(rnd() * 3)] });
}

for (let i = 0; i < N; i++) {
  const t = i / SR;
  let s = 0;

  // slow global swell (very slow LFO)
  const swell = 0.6 + 0.4 * Math.sin(TAU * 0.018 * t);

  // low drone with gentle per-partial tremolo + tiny detune
  for (let k = 0; k < drone.length; k++) {
    const f = drone[k] * (1 + 0.0008 * Math.sin(TAU * (0.07 + k * 0.013) * t));
    const trem = 0.8 + 0.2 * Math.sin(TAU * (0.05 + k * 0.02) * t);
    s += Math.sin(TAU * f * t) * 0.12 * trem;
  }

  // soft pad chord, quieter, breathing
  const padEnv = 0.5 + 0.5 * Math.sin(TAU * 0.035 * t - 1.2);
  for (let k = 0; k < pad.length; k++) {
    const f = pad[k] * (1 + 0.001 * Math.sin(TAU * (0.09 + k * 0.017) * t));
    s += Math.sin(TAU * f * t) * 0.05 * padEnv;
  }

  // filtered air noise
  const white = rnd() * 2 - 1;
  lp += a * (white - lp);
  s += lp * 0.10 * swell;

  // shimmer bells (exp decay)
  for (const b of bells) {
    const dT = t - b.t;
    if (dT >= 0 && dT < 4) {
      const env = Math.exp(-dT * 1.6) * (1 - Math.exp(-dT * 40));
      s += Math.sin(TAU * b.f * t) * 0.06 * env;
      s += Math.sin(TAU * b.f * 2 * t) * 0.02 * env;
    }
  }

  out[i] = s * 0.55;
}

// soft limiter / normalize to peak 0.85
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(out[i]));
const g = peak > 0 ? 0.85 / peak : 1;

// 16-bit PCM WAV
const bytesPerSample = 2;
const dataSize = N * bytesPerSample;
const buf = Buffer.alloc(44 + dataSize);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + dataSize, 4);
buf.write("WAVE", 8);
buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20); // PCM
buf.writeUInt16LE(1, 22); // mono
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * bytesPerSample, 28);
buf.writeUInt16LE(bytesPerSample, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(dataSize, 40);
for (let i = 0; i < N; i++) {
  let v = Math.max(-1, Math.min(1, out[i] * g));
  buf.writeInt16LE((v * 32767) | 0, 44 + i * 2);
}

const __dir = dirname(fileURLToPath(import.meta.url));
const target = `${__dir}/../public/ambient.wav`;
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, buf);
console.log(`Wrote ${target} (${(buf.length / 1e6).toFixed(1)} MB, ${DURATION}s)`);
