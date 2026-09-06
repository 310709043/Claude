/**
 * Writes a guide track for whoever records the narration: a short tone at each
 * cue's in-point over silence, the full length of the film.
 *
 * Played in headphones against the picture, it lets a voice artist hit every
 * mark without watching a timecode. Generated as a plain WAV — no encoder, no
 * network, nothing to install.
 *
 *   node scripts/make-guide-track.mjs
 */
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import path from 'node:path';

const FPS = 30;
const RATE = 48000;
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const cues = [
  ...readFileSync(path.join(ROOT, 'src/captions.ts'), 'utf8').matchAll(
    /\{from:\s*(\d+),\s*to:\s*(\d+),\s*scene:\s*'([^']+)',\s*text:\s*'([^']*)'\}/g,
  ),
].map(([, from, to]) => ({from: +from, to: +to}));

const totalFrames = 2570;
const samples = Math.ceil((totalFrames / FPS) * RATE);
const pcm = new Int16Array(samples);

/** 40ms sine with a short fade so it clicks cleanly without popping. */
const beep = (atFrame, freq) => {
  const start = Math.round((atFrame / FPS) * RATE);
  const len = Math.round(0.04 * RATE);
  for (let i = 0; i < len && start + i < samples; i++) {
    const env = Math.min(1, i / 240, (len - i) / 240);
    pcm[start + i] = Math.round(
      Math.sin((2 * Math.PI * freq * i) / RATE) * 9000 * env,
    );
  }
};

// A higher tone on the first cue of each scene, so the reader hears the section change.
let prevTo = -Infinity;
for (const c of cues) {
  beep(c.from, c.from - prevTo > 60 ? 1320 : 880);
  prevTo = c.to;
}

const header = Buffer.alloc(44);
const dataBytes = pcm.length * 2;
header.write('RIFF', 0);
header.writeUInt32LE(36 + dataBytes, 4);
header.write('WAVEfmt ', 8);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22);
header.writeUInt32LE(RATE, 24);
header.writeUInt32LE(RATE * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write('data', 36);
header.writeUInt32LE(dataBytes, 40);

mkdirSync(path.join(ROOT, 'subtitles'), {recursive: true});
const out = path.join(ROOT, 'subtitles', 'recording-guide.wav');
writeFileSync(out, Buffer.concat([header, Buffer.from(pcm.buffer)]));
console.log(`${cues.length} cue markers → ${path.relative(ROOT, out)} (${(samples / RATE).toFixed(1)}s)`);
