/**
 * ============================================================
 *  字型同步腳本  —  npm run fonts:sync
 * ------------------------------------------------------------
 *  作用：
 *   1. 掃描 src/ 底下所有原始碼，收集實際會出現在畫面上的字元
 *   2. 向 Google Fonts 取得 Noto Sans TC / Inter 的 @font-face 定義
 *   3. 只下載「unicode-range 與這些字元有交集」的 woff2 切片
 *   4. 產生 src/fonts.generated.ts 供執行期組出 @font-face
 *
 *  ★ 改完文案後請重跑一次，確保新字有對應的字型切片。
 *  ★ 想一次抓齊全部切片（約 25MB，日後改任何字都不必再跑）：
 *       node scripts/sync-fonts.mjs --all
 * ============================================================
 */
import {createWriteStream} from 'node:fs';
import {mkdir, readdir, readFile, writeFile} from 'node:fs/promises';
import {pipeline} from 'node:stream/promises';
import path from 'node:path';
import {Readable} from 'node:stream';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src');
const OUT_DIR = path.join(ROOT, 'public', 'fonts');
const GENERATED = path.join(SRC, 'fonts.generated.ts');
const ALL = process.argv.includes('--all');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const FAMILIES = [
  {
    name: 'Noto Sans TC',
    slug: 'notosanstc',
    css: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=block',
  },
  {
    name: 'Inter',
    slug: 'inter',
    css: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=block',
  },
];

/* ---------- 1. 收集原始碼中出現的所有字元 ---------- */
const walk = async (dir) => {
  const out = [];
  for (const e of await readdir(dir, {withFileTypes: true})) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(ts|tsx)$/.test(e.name) && !e.name.endsWith('.generated.ts')) out.push(p);
  }
  return out;
};

const collectCodepoints = async () => {
  const files = await walk(SRC);
  const set = new Set();
  for (const f of files) {
    const text = await readFile(f, 'utf8');
    for (const ch of text) set.add(ch.codePointAt(0));
  }
  // 一定要涵蓋的基本拉丁與常用符號，避免數字／標點漏字
  for (let c = 0x20; c <= 0x7e; c++) set.add(c);
  for (const ch of '×→、，。：；（）「」／－–—…％°') set.add(ch.codePointAt(0));
  return set;
};

/* ---------- 2. 解析 CSS 的 @font-face ---------- */
const parseFaces = (css) => {
  const faces = [];
  const blocks = css.split('@font-face').slice(1);
  for (const b of blocks) {
    const weight = /font-weight:\s*(\d+)/.exec(b)?.[1];
    const url = /src:\s*url\((https:[^)]+)\)/.exec(b)?.[1];
    const range = /unicode-range:\s*([^;]+);/.exec(b)?.[1];
    if (!weight || !url || !range) continue;
    faces.push({weight, url, range: range.trim()});
  }
  return faces;
};

const rangeMatches = (rangeStr, codepoints) => {
  for (const part of rangeStr.split(',')) {
    const t = part.trim().replace(/^U\+/i, '');
    if (t.includes('-')) {
      const [a, b] = t.split('-');
      const lo = parseInt(a, 16);
      const hi = parseInt(b, 16);
      for (const c of codepoints) if (c >= lo && c <= hi) return true;
    } else if (t.includes('?')) {
      const lo = parseInt(t.replace(/\?/g, '0'), 16);
      const hi = parseInt(t.replace(/\?/g, 'f'), 16);
      for (const c of codepoints) if (c >= lo && c <= hi) return true;
    } else {
      const v = parseInt(t, 16);
      if (codepoints.has(v)) return true;
    }
  }
  return false;
};

/* ---------- 3. 下載並產生 manifest ---------- */
const download = async (url, dest) => {
  const res = await fetch(url, {headers: {'User-Agent': UA}});
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
};

const main = async () => {
  await mkdir(OUT_DIR, {recursive: true});
  const codepoints = await collectCodepoints();
  console.log(`原始碼中偵測到 ${codepoints.size} 個不同字元`);

  const manifest = [];
  let downloaded = 0;

  for (const fam of FAMILIES) {
    const css = await (await fetch(fam.css, {headers: {'User-Agent': UA}})).text();
    const faces = parseFaces(css);
    const needed = ALL ? faces : faces.filter((f) => rangeMatches(f.range, codepoints));
    console.log(`${fam.name}: ${needed.length} / ${faces.length} 個切片需要下載`);

    for (const f of needed) {
      const idx = /\.(\d+)\.woff2$/.exec(f.url)?.[1] ?? '0';
      const file = `${fam.slug}-${f.weight}-${idx}.woff2`;
      await download(f.url, path.join(OUT_DIR, file));
      downloaded++;
      manifest.push({family: fam.name, weight: f.weight, file, unicodeRange: f.range});
    }
  }

  const ts = `/* 由 scripts/sync-fonts.mjs 自動產生 — 請勿手動編輯 */
export type FontFace = {
  family: string;
  weight: string;
  file: string;
  unicodeRange: string;
};

export const FONT_FACES: FontFace[] = ${JSON.stringify(manifest, null, 2)};
`;
  await writeFile(GENERATED, ts, 'utf8');
  console.log(`完成：${downloaded} 個 woff2 → public/fonts/，manifest → src/fonts.generated.ts`);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
