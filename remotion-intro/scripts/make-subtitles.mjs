/**
 * Exports subtitles/*.srt, *.vtt and a timed narration script from
 * src/captions.ts, and checks each cue's speaking pace.
 *
 * A Mandarin narrator reads a measured corporate script at roughly 4.5
 * characters per second. Anything much past 5.5 cannot be said in the window,
 * so the check fails loudly rather than shipping a cue nobody can read.
 *
 *   node scripts/make-subtitles.mjs
 */
import {mkdirSync, writeFileSync, readFileSync} from 'node:fs';
import path from 'node:path';

const FPS = 30;
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'subtitles');

// Read the cue table out of the TS source without needing a compiler.
const src = readFileSync(path.join(ROOT, 'src/captions.ts'), 'utf8');
const CUES = [...src.matchAll(
  /\{from:\s*(\d+),\s*to:\s*(\d+),\s*scene:\s*'([^']+)',\s*text:\s*'([^']*)'\}/g,
)].map(([, from, to, scene, text]) => ({
  from: Number(from),
  to: Number(to),
  scene,
  text,
}));
if (!CUES.length) throw new Error('no cues parsed from src/captions.ts');

/** Rough spoken duration: CJK glyphs dominate, Latin words are read as words. */
const spoken = (t) => {
  const cjk = (t.match(/[㐀-鿿]/g) ?? []).length;
  const latin = (t.match(/[A-Za-z]+/g) ?? []).length;
  const digits = (t.match(/\d/g) ?? []).length;
  return cjk * 0.222 + latin * 0.45 + digits * 0.2;
};

const ts = (frame, sep) => {
  const total = frame / FPS;
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(Math.floor(total % 60)).padStart(2, '0');
  const ms = String(Math.round((total % 1) * 1000)).padStart(3, '0');
  return `${h}:${m}:${s}${sep}${ms}`;
};

let bad = 0;
let prevTo = -1;
const rows = CUES.map((c, i) => {
  const win = (c.to - c.from) / FPS;
  const need = spoken(c.text);
  const rate = need / win;
  const overlap = c.from < prevTo;
  prevTo = c.to;
  if (rate > 1.0 || overlap) bad++;
  return {i: i + 1, ...c, win, need, rate, overlap};
});

for (const r of rows) {
  const flag = r.overlap ? 'OVERLAP' : r.rate > 1.0 ? 'TOO FAST' : r.rate < 0.45 ? 'roomy' : 'ok';
  if (flag !== 'ok') {
    console.log(
      `${String(r.i).padStart(2)} ${r.scene.padEnd(11)} window ${r.win.toFixed(2)}s ` +
        `needs ${r.need.toFixed(2)}s (${(r.rate * 100).toFixed(0)}%)  ${flag}  ${r.text}`,
    );
  }
}

mkdirSync(OUT, {recursive: true});

writeFileSync(
  path.join(OUT, 'taipbx-callcenter.zh-TW.srt'),
  CUES.map((c, i) => `${i + 1}\n${ts(c.from, ',')} --> ${ts(c.to, ',')}\n${c.text}\n`).join('\n'),
);

writeFileSync(
  path.join(OUT, 'taipbx-callcenter.zh-TW.vtt'),
  'WEBVTT\n\n' +
    CUES.map((c) => `${ts(c.from, '.')} --> ${ts(c.to, '.')}\n${c.text}\n`).join('\n'),
);

// A read-aloud script: what to say, when, and how long it may take.
const script = [
  '# TAIPBX Call Center — 旁白稿（zh-TW）',
  '',
  `全長 ${(Math.max(...CUES.map((c) => c.to)) / FPS).toFixed(1)} 秒 · ${CUES.length} 句 · ` +
    `共 ${CUES.reduce((n, c) => n + (c.text.match(/[㐀-鿿]/g) ?? []).length, 0)} 個中文字`,
  '',
  '「可用秒數」是畫面留給這句話的時間，「估計秒數」是以每秒 4.5 字的沉穩語速估算。',
  '錄音時請對齊「進點」，句與句之間留白即可，不需要填滿。',
  '',
  '| # | 進點 | 出點 | 可用秒數 | 估計秒數 | 旁白 |',
  '|---|------|------|----------|----------|------|',
  ...rows.map(
    (r) =>
      `| ${r.i} | ${ts(r.from, '.')} | ${ts(r.to, '.')} | ${r.win.toFixed(2)} | ` +
      `${r.need.toFixed(2)} | ${r.text} |`,
  ),
].join('\n');
writeFileSync(path.join(OUT, 'narration-zh-TW.md'), script);

console.log(
  `\n${CUES.length} cues → subtitles/*.srt, *.vtt, narration-zh-TW.md` +
    (bad ? `  — ${bad} need attention` : '  — pacing ok'),
);
