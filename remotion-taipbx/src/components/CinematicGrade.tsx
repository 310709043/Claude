import React, {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {grade, palette} from '../theme';

/**
 * ============================================================
 *  電影調色與後製層 — 疊在所有畫面之上
 * ------------------------------------------------------------
 *  由四層構成，模擬真實電影鏡頭與底片的成像特性：
 *   1. Halation  暖色光暈（亮部向外滲色，底片特有）
 *   2. Vignette  邊角壓暗（引導視線至畫面中心）
 *   3. Grain     底片顆粒（消除數位平滑感、掩蓋色帶）
 *   4. Bloom     整體柔光（讓橘色光源「發亮」而非只是「著色」）
 * ============================================================
 */

/** 底片顆粒：以 SVG turbulence 生成，逐格位移避免靜止的髒點 */
const Grain: React.FC<{opacity?: number}> = ({opacity = grade.grainOpacity}) => {
  const frame = useCurrentFrame();
  // 每 2 格換一次種子，接近真實 24/30fps 底片的顆粒跳動頻率
  const seed = Math.floor(frame / 2);
  const dx = random(`gx-${seed}`) * 100;
  const dy = random(`gy-${seed}`) * 100;

  return (
    <AbsoluteFill
      style={{
        opacity,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
        transform: `translate(${-dx / 2}px, ${-dy / 2}px)`,
        width: '130%',
        height: '130%',
        left: '-15%',
        top: '-15%',
      }}
    >
      <svg width="100%" height="100%">
        <filter id="filmgrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
            seed={seed}
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#filmgrain)" />
      </svg>
    </AbsoluteFill>
  );
};

/** 邊角壓暗 + 輕微的暖色邊緣渲染 */
const Vignette: React.FC<{strength?: number}> = ({strength = grade.vignetteStrength}) => (
  <>
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        background: `radial-gradient(ellipse 78% 72% at 50% 48%, rgba(0,0,0,0) 42%, rgba(0,0,0,${
          0.5 * strength
        }) 76%, rgba(0,0,0,${0.88 * strength}) 100%)`,
      }}
    />
    {/* 頂／底的細微暗帶，模仿寬螢幕鏡頭的自然衰減 */}
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        background:
          'linear-gradient(to bottom, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0) 16%, rgba(0,0,0,0) 84%, rgba(0,0,0,0.40) 100%)',
      }}
    />
  </>
);

/** 暖色光暈：讓品牌橘在暗場中「溢光」 */
const Halation: React.FC<{strength?: number}> = ({strength = grade.halationStrength}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      mixBlendMode: 'screen',
      opacity: strength,
      background: `radial-gradient(ellipse 62% 54% at 50% 46%, ${palette.glowSoft} 0%, rgba(255,140,63,0.06) 45%, rgba(0,0,0,0) 72%)`,
    }}
  />
);

/** 底片色調曲線：壓低純黑、把高光推向暖白，是「電影感」最核心的一步 */
const ToneCurve: React.FC = () => (
  <>
    {/* lifted blacks：暗部不死黑，帶一點暖 */}
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        background: 'rgba(46, 30, 20, 0.16)',
      }}
    />
    {/* 高光暖化 */}
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        mixBlendMode: 'soft-light',
        background:
          'linear-gradient(160deg, rgba(255,150,80,0.13) 0%, rgba(0,0,0,0) 48%, rgba(20,30,50,0.16) 100%)',
      }}
    />
  </>
);

export const CinematicGrade: React.FC<{
  /** 0–1，可在特定場景減弱後製（例如純白閃光時） */
  intensity?: number;
}> = ({intensity = 1}) => {
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: intensity}}>
      <Halation />
      <ToneCurve />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/**
 * 色差（chromatic aberration）包裝器。
 * 將內容以紅／青兩個方向極微位移重疊，模擬鏡頭色散。
 * 用量必須極克制 —— 過量會變成廉價的「故障風」。
 */
export const ChromaticWrap: React.FC<{
  children: React.ReactNode;
  amount?: number;
}> = ({children, amount = grade.chromaticAberration}) => {
  const layers = useMemo(
    () => [
      {dx: -amount, color: 'rgba(255,60,0,0.55)', blend: 'screen' as const},
      {dx: amount, color: 'rgba(0,180,255,0.40)', blend: 'screen' as const},
    ],
    [amount]
  );

  return (
    <AbsoluteFill>
      {layers.map((l, i) => (
        <AbsoluteFill
          key={i}
          style={{
            transform: `translateX(${l.dx}px)`,
            mixBlendMode: l.blend,
            opacity: 0.35,
            filter: 'blur(0.4px)',
          }}
        >
          {children}
        </AbsoluteFill>
      ))}
      <AbsoluteFill>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
