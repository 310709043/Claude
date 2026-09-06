/**
 * Lays a narration track onto the rendered film and muxes the result.
 *
 * Two input shapes, because the two realistic ways to get the audio produce
 * different things:
 *
 *   clips  — a directory of 22 per-cue files (01.wav … 22.wav, or .mp3/.m4a).
 *            This is what a TTS run per cue gives you. Each clip is placed at
 *            its cue's exact start frame from src/captions.ts, so the voice
 *            lands with the picture no matter how long each take ran.
 *
 *   track  — one continuous file already timed to the full 85.7s. This is what
 *            a voice artist recording to the guide track gives you. It is laid
 *            down as-is from 00:00.
 *
 * Either way the voice is loudness-normalised to -16 LUFS (the usual target for
 * web video) and the video stream is copied, never re-encoded.
 *
 *   node scripts/mux-voiceover.mjs clips  out/vo-clips/   out/film.mp4 out/film-vo.mp4
 *   node scripts/mux-voiceover.mjs track  out/narration.wav out/film.mp4 out/film-vo.mp4
 */
import {execFileSync} from 'node:child_process';
import {readFileSync, readdirSync, existsSync} from 'node:fs';
import path from 'node:path';

const FPS = 30;
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BIN = path.join(ROOT, 'node_modules/@remotion/compositor-linux-x64-gnu');
const FFMPEG = path.join(BIN, 'ffmpeg');
const FFPROBE = path.join(BIN, 'ffprobe');

const [mode, input, video, output] = process.argv.slice(2);
if (!['clips', 'track'].includes(mode) || !input || !video || !output) {
  console.error(readFileSync(new URL(import.meta.url)).toString().split('*/')[0]);
  process.exit(1);
}
for (const f of [input, video]) {
  if (!existsSync(f)) throw new Error(`not found: ${f}`);
}

const cues = [
  ...readFileSync(path.join(ROOT, 'src/captions.ts'), 'utf8').matchAll(
    /\{from:\s*(\d+),\s*to:\s*(\d+),\s*scene:\s*'([^']+)',\s*text:\s*'([^']*)'\}/g,
  ),
].map(([, from, to, , text]) => ({from: +from, to: +to, text}));

// Pad the voice out to exactly the film's length. `apad` on its own is an
// infinite stream, and -shortest does not reliably terminate one from behind a
// filter graph — it hangs. An explicit duration ends both cleanly.
const videoDur = Number(
  execFileSync(FFPROBE, [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=duration',
    '-of', 'default=nw=1:nk=1', video,
  ]).toString().trim(),
);
if (!Number.isFinite(videoDur)) throw new Error(`could not read duration of ${video}`);

const args = ['-y', '-i', video];
let filter;

if (mode === 'track') {
  args.push('-i', input);
  filter =
    `[1:a]loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000,apad=whole_dur=${videoDur}[vo]`;
} else {
  const files = readdirSync(input)
    .filter((f) => /\.(wav|mp3|m4a|aac|flac|ogg)$/i.test(f))
    .sort();
  if (files.length !== cues.length) {
    console.warn(
      `warning: ${files.length} clips for ${cues.length} cues — pairing in sorted order`,
    );
  }
  const parts = [];
  files.forEach((f, i) => {
    args.push('-i', path.join(input, f));
    const ms = Math.round((cues[i]?.from ?? 0) * (1000 / FPS));
    // adelay wants a value per channel; `all=1` covers mono and stereo alike.
    parts.push(`[${i + 1}:a]adelay=${ms}:all=1[d${i}]`);
  });
  filter =
    parts.join(';') +
    ';' +
    files.map((_, i) => `[d${i}]`).join('') +
    `amix=inputs=${files.length}:dropout_transition=0:normalize=0,` +
    `loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000,apad=whole_dur=${videoDur}[vo]`;
  console.log(`placing ${files.length} clips at their cue starts`);
}

args.push(
  '-filter_complex', filter,
  '-map', '0:v', '-map', '[vo]',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
  '-t', String(videoDur),
  '-movflags', '+faststart',
  output,
);

execFileSync(FFMPEG, args, {stdio: ['ignore', 'inherit', 'inherit']});
console.log(`\nwrote ${output}`);
