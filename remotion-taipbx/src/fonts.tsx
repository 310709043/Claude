/**
 * ============================================================
 *  字型載入 — 本地自帶，渲染完全離線、結果永遠一致
 * ------------------------------------------------------------
 *  中文：Noto Sans TC（400 / 500 / 700 / 900）
 *  拉丁與數字：Inter（400 / 600 / 800 / 900）
 *
 *  字型切片存放於 public/fonts/，清單由 scripts/sync-fonts.mjs
 *  自動產生。改完文案後請執行： npm run fonts:sync
 * ============================================================
 */
import React from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import {FONT_FACES} from './fonts.generated';

export const FONT_TC = `"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif`;
export const FONT_LATIN = `"Inter", "Noto Sans TC", "Helvetica Neue", Arial, sans-serif`;

const STYLE_ID = 'taipbx-fonts';

const buildCss = () =>
  FONT_FACES.map(
    (f) => `@font-face{
  font-family:'${f.family}';
  font-style:normal;
  font-weight:${f.weight};
  font-display:block;
  src:url(${staticFile(`fonts/${f.file}`)}) format('woff2');
  unicode-range:${f.unicodeRange};
}`
  ).join('\n');

/** 注入 @font-face（僅執行一次） */
const injectFontFaces = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = buildCss();
  document.head.appendChild(style);
};

injectFontFaces();

/**
 * 掛在影片最外層。它會擋住渲染，直到所有字型真的可用為止 ——
 * 少了這一步，前幾格會拍到 fallback 字型，造成畫面閃動。
 */
export const FontGate: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [ready, setReady] = React.useState(false);
  const [handle] = React.useState(() => delayRender('載入字型中'));

  React.useEffect(() => {
    let cancelled = false;
    injectFontFaces();

    const load = async () => {
      const weights = ['400', '500', '700', '900'];
      await Promise.all([
        ...weights.map((w) => document.fonts.load(`${w} 64px "Noto Sans TC"`, '企業級AI一體機')),
        ...['400', '600', '800', '900'].map((w) =>
          document.fonts.load(`${w} 64px "Inter"`, 'TAIPBX0123456789')
        ),
      ]);
      await document.fonts.ready;
      if (cancelled) return;
      setReady(true);
      continueRender(handle);
    };

    load().catch(() => {
      // 字型載入失敗時不阻擋渲染，改用系統 fallback
      if (cancelled) return;
      setReady(true);
      continueRender(handle);
    });

    return () => {
      cancelled = true;
    };
  }, [handle]);

  return <>{ready ? children : null}</>;
};
