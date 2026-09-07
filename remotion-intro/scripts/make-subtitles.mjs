/**
 * Exports subtitles/*.srt, *.vtt and a timed narration script per language from
 * src/captions.ts, and checks that each cue can actually be said — and read —
 * inside the window the picture gives it.
 *
 * The two languages need different yardsticks. A Mandarin narrator reads a
 * measured corporate script at roughly 4.5 characters a second; English runs
 * about 2.6 words a second. Subtitles have a second limit on top: past about
 * 20 characters a second an English line is on screen too briefly to read, and
 * past about 9 a Chinese one is.
 *
 *   node scripts/make-subtitles.mjs
 */
import {mkdirSync, writeFileSync, readFileSync} from 'node:fs';
import path from 'node:path';

const FPS = 30;
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'subtitles');

const src = readFileSync(path.join(ROOT, 'src/captions.ts'), 'utf8');
const CUES = [
  ...src.matchAll(
    /\{from:\s*(\d+),\s*to:\s*(\d+),\s*scene:\s*'([^']+)',\s*\n?\s*zh:\s*'([^']*)',\s*\n?\s*en:\s*'([^']*)'\}/g,
  ),
].map(([, from, to, scene, zh, en]) => ({
  from: Number(from),
  to: Number(to),
  scene,
  zh,
  en,
}));
if (!CUES.length) throw new Error('no cues parsed from src/captions.ts');

const LANGS = {
  zh: {
    tag: 'zh-TW',
    title: '旁白稿（zh-TW）',
    /** Spoken length: CJK glyphs dominate, Latin runs are read as words. */
    spoken: (t) =>
      (t.match(/[㐀-鿿]/g) ?? []).length * 0.222 +
      (t.match(/[A-Za-z]+/g) ?? []).length * 0.45 +
      (t.match(/\d/g) ?? []).length * 0.2,
    /** Reading limit, characters per second. */
    maxCps: 9,
    units: (t) => (t.match(/[㐀-鿿]/g) ?? []).length,
    unitName: '中文字',
    head: ['| # | 進點 | 出點 | 可用秒數 | 估計秒數 | 旁白 |',
           '|---|------|------|----------|----------|------|'],
    note: [
      '「可用秒數」是畫面留給這句話的時間，「估計秒數」是以每秒 4.5 字的沉穩語速估算。',
      '錄音時請對齊「進點」，句與句之間留白即可，不需要填滿。',
    ],
  },
  en: {
    tag: 'en',
    title: 'Narration script (English)',
    spoken: (t) => (t.match(/[A-Za-z0-9'’-]+/g) ?? []).length * 0.38,
    maxCps: 20,
    units: (t) => (t.match(/[A-Za-z0-9'’-]+/g) ?? []).length,
    unitName: 'words',
    head: ['| # | In | Out | Window | Est. read | Line |',
           '|---|----|-----|--------|-----------|------|'],
    note: [
      '"Window" is what the picture gives the line; "Est. read" assumes a measured 2.6 words per second.',
      'Record against the in-points; gaps between lines are fine, there is no need to fill them.',
    ],
  },
};

const ts = (frame, sep) => {
  const total = frame / FPS;
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(Math.floor(total % 60)).padStart(2, '0');
  const ms = String(Math.round((total % 1) * 1000)).padStart(3, '0');
  return `${h}:${m}:${s}${sep}${ms}`;
};

mkdirSync(OUT, {recursive: true});
let problems = 0;

for (const [lang, L] of Object.entries(LANGS)) {
  let prevTo = -1;
  const rows = CUES.map((c, i) => {
    const text = c[lang];
    const win = (c.to - c.from) / FPS;
    const need = L.spoken(text);
    const cps = text.length / win;
    const overlap = c.from < prevTo;
    prevTo = c.to;
    return {i: i + 1, ...c, text, win, need, rate: need / win, cps, overlap};
  });

  for (const r of rows) {
    const issue = r.overlap
      ? 'OVERLAP'
      : r.rate > 1.0
        ? 'TOO FAST to say'
        : r.cps > L.maxCps
          ? `TOO FAST to read (${r.cps.toFixed(1)} cps)`
          : null;
    if (issue) {
      problems++;
      console.log(
        `[${L.tag}] ${String(r.i).padStart(2)} ${r.scene.padEnd(11)} ` +
          `window ${r.win.toFixed(2)}s needs ${r.need.toFixed(2)}s — ${issue}\n     ${r.text}`,
      );
    }
  }

  writeFileSync(
    path.join(OUT, `taipbx-callcenter.${L.tag}.srt`),
    rows.map((r) => `${r.i}\n${ts(r.from, ',')} --> ${ts(r.to, ',')}\n${r.text}\n`).join('\n'),
  );
  writeFileSync(
    path.join(OUT, `taipbx-callcenter.${L.tag}.vtt`),
    'WEBVTT\n\n' +
      rows.map((r) => `${ts(r.from, '.')} --> ${ts(r.to, '.')}\n${r.text}\n`).join('\n'),
  );
  writeFileSync(
    path.join(OUT, `narration-${L.tag}.md`),
    [
      `# TAIPBX Call Center — ${L.title}`,
      '',
      `${(Math.max(...CUES.map((c) => c.to)) / FPS).toFixed(1)}s · ${CUES.length} lines · ` +
        `${rows.reduce((n, r) => n + L.units(r.text), 0)} ${L.unitName}`,
      '',
      ...L.note,
      '',
      ...L.head,
      ...rows.map(
        (r) =>
          `| ${r.i} | ${ts(r.from, '.')} | ${ts(r.to, '.')} | ${r.win.toFixed(2)} | ` +
          `${r.need.toFixed(2)} | ${r.text} |`,
      ),
    ].join('\n'),
  );

  const chars = rows.reduce((n, r) => n + L.units(r.text), 0);
  console.log(`[${L.tag}] ${rows.length} cues · ${chars} ${L.unitName} → .srt .vtt narration-${L.tag}.md`);
}

console.log(problems ? `\n${problems} cue(s) need attention` : '\npacing ok in both languages');
