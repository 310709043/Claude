import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {ease, enter, exit} from '../anim';
import {FONT_TC} from '../fonts';
import {palette} from '../theme';

/**
 * ============================================================
 *  企業標誌 — 台灣大哥大 企業服務
 * ------------------------------------------------------------
 *  ★ 使用官方 Logo：
 *     1. 將官方檔案放入  public/logo.svg （或 logo.png，去背）
 *     2. 把下方 useLogoFile 改成 true
 *  在此之前會渲染一個「多彩切面圓形」向量佔位標記，
 *  構圖與動畫時間點皆已就位，換檔即完成。
 * ============================================================
 */
export const LOGO_CONFIG = {
  /** ← 放入官方檔案後改成 true */
  useLogoFile: false,
  /** public/ 底下的檔名 */
  fileName: 'logo.svg',
  /** 中文字樣（官方檔案模式下不使用） */
  wordmark: '台灣大哥大',
  subMark: '企業服務',
} as const;

/**
 * 多彩幾何切面圓形圖標（佔位用向量）
 * 以 8 道帶間隙的稜面環繞中心，交錯內外半徑製造「切面」的立體感，
 * 而非平面的圓餅分割。進場時每道稜面依序旋轉歸位。
 */
const FacetedMark: React.FC<{size: number; progress: number}> = ({size, progress}) => {
  const CX = 56;
  const CY = 56;
  const GAP = 3.4;          // 稜面之間的角度間隙（度）
  const R_LONG = 50;        // 長稜面半徑
  const R_SHORT = 43;       // 短稜面半徑（交錯出切面）
  const R_INNER = 13;       // 中心留白

  const facets = [
    {c0: '#FF6100', c1: '#FF8C3F'},
    {c0: '#FDA430', c1: '#FFD07A'},
    {c0: '#41D189', c1: '#8CE8BC'},
    {c0: '#3BB0F4', c1: '#8AD3FA'},
    {c0: '#F43939', c1: '#FF7A6E'},
    {c0: '#CC4D00', c1: '#FF6100'},
    {c0: '#FF8C3F', c1: '#FFD07A'},
    {c0: '#3BB0F4', c1: '#41D189'},
  ];

  const rad = (d: number) => ((d - 90) * Math.PI) / 180;
  const pt = (a: number, r: number) => `${CX + r * Math.cos(rad(a))} ${CY + r * Math.sin(rad(a))}`;

  const step = 360 / facets.length;

  return (
    <svg width={size} height={size} viewBox="0 0 112 112" style={{overflow: 'visible'}}>
      <defs>
        {facets.map((f, i) => (
          <linearGradient key={i} id={`facet${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={f.c0} />
            <stop offset="100%" stopColor={f.c1} />
          </linearGradient>
        ))}
      </defs>

      <g style={{filter: `drop-shadow(0 0 16px ${palette.glowSoft})`}}>
        {facets.map((f, i) => {
          const a0 = i * step + GAP / 2;
          const a1 = (i + 1) * step - GAP / 2;
          const aMid = (a0 + a1) / 2;
          // 交錯長短半徑 → 外緣呈現稜線起伏，而非平滑的圓
          const rOuter = i % 2 === 0 ? R_LONG : R_SHORT;

          const d = [
            `M ${pt(a0, R_INNER)}`,
            `L ${pt(a0, rOuter)}`,
            `L ${pt(aMid, rOuter + (i % 2 === 0 ? 0 : 5))}`,
            `L ${pt(a1, rOuter)}`,
            `L ${pt(a1, R_INNER)}`,
            'Z',
          ].join(' ');

          const local = interpolate(progress, [i * 0.055, i * 0.055 + 0.52], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: ease.outExpo,
          });

          return (
            <path
              key={i}
              d={d}
              fill={`url(#facet${i})`}
              opacity={local}
              style={{
                transformOrigin: '56px 56px',
                transform: `rotate(${(1 - local) * -40}deg) scale(${interpolate(
                  local,
                  [0, 1],
                  [0.5, 1]
                )})`,
              }}
            />
          );
        })}

        {/* 中心稜面高光：讓整體讀起來是「立體切面」而不是平面色塊 */}
        <circle
          cx={CX}
          cy={CY}
          r={R_INNER - 2}
          fill="none"
          stroke={palette.primaryLight}
          strokeWidth={1.6}
          opacity={progress * 0.75}
        />
      </g>
    </svg>
  );
};

export const BrandLogo: React.FC<{
  delay?: number;
  outAt?: number;
  /** 圖標高度（設計座標 px） */
  size?: number;
  layout?: 'horizontal' | 'stacked';
  /** 暗場中的文字顏色 */
  color?: string;
}> = ({delay = 0, outAt, size = 76, layout = 'horizontal', color = palette.textHi}) => {
  const frame = useCurrentFrame();
  const p = enter(frame, delay, 50, ease.outExpo);
  const o = outAt === undefined ? 1 : exit(frame, outAt, 20);

  if (LOGO_CONFIG.useLogoFile) {
    return (
      <Img
        src={staticFile(LOGO_CONFIG.fileName)}
        style={{
          height: size * 1.5,
          opacity: p * o,
          transform: `translateY(${(1 - p) * 16}px)`,
          filter: `drop-shadow(0 0 26px ${palette.glowSoft})`,
        }}
      />
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: layout === 'horizontal' ? 'row' : 'column',
        alignItems: 'center',
        gap: layout === 'horizontal' ? size * 0.28 : size * 0.22,
        opacity: o,
      }}
    >
      <FacetedMark size={size} progress={p} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: layout === 'horizontal' ? 'flex-start' : 'center',
          gap: size * 0.06,
        }}
      >
        <div
          style={{
            fontFamily: FONT_TC,
            fontSize: size * 0.46,
            fontWeight: 700,
            letterSpacing: '0.03em',
            color,
            opacity: enter(frame, delay + 12, 42, ease.outQuint),
            transform: `translateY(${(1 - enter(frame, delay + 12, 42)) * 10}px)`,
            whiteSpace: 'nowrap',
          }}
        >
          {LOGO_CONFIG.wordmark}
        </div>
        <div
          style={{
            fontFamily: FONT_TC,
            fontSize: size * 0.245,
            fontWeight: 500,
            letterSpacing: '0.30em',
            color: palette.textLow,
            opacity: enter(frame, delay + 20, 42, ease.outQuint),
            whiteSpace: 'nowrap',
          }}
        >
          {LOGO_CONFIG.subMark}
        </div>
      </div>
    </div>
  );
};
