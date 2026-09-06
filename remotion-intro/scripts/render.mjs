/**
 * Render through the Node API instead of the CLI.
 *
 * The CLI draws a progress bar whose width is computed from
 * (rendered − total) frames; when frame-level retries push the rendered
 * count past the total it calls String.repeat with a negative length and
 * the process dies during stitching, after every frame was already made.
 * renderMedia() takes a plain onProgress callback, so there is nothing to
 * crash.
 *
 *   node scripts/render.mjs [out.mp4] [concurrency]
 */
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const out = process.argv[2] ?? 'out/taipbx-callcenter-intro.mp4';
const compId = process.argv[4] ?? 'TaipbxIntro';
const concurrency = Number(process.argv[3] ?? 3);

const serveUrl = await bundle({
  entryPoint: path.resolve('src/index.ts'),
  onProgress: (p) => p % 25 === 0 && console.log(`bundle ${p}%`),
});

const composition = await selectComposition({serveUrl, id: compId});
console.log(`render ${composition.durationInFrames} frames @ ${composition.fps}fps → ${out}`);

let last = -1;
await renderMedia({
  composition,
  serveUrl,
  codec: 'h264',
  crf: 17,
  imageFormat: 'jpeg',
  jpegQuality: 95,
  concurrency,
  timeoutInMilliseconds: 60_000,
  chromiumOptions: {gl: 'angle'},
  outputLocation: out,
  onProgress: ({renderedFrames, encodedFrames, stitchStage}) => {
    const pct = Math.floor((renderedFrames / composition.durationInFrames) * 100);
    if (pct !== last && pct % 5 === 0) {
      last = pct;
      console.log(`rendered ${renderedFrames}/${composition.durationInFrames} (${pct}%) encoded ${encodedFrames} ${stitchStage}`);
    }
  },
});
console.log('done');
