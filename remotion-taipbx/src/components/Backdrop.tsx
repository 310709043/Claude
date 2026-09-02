import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {drift, ease, enter} from '../anim';
import {palette} from '../theme';

/* ============================================================
 *  場景空間 — 讓每一段都有「實體場域」而不是純色底
 *  所有隨機值皆以 seed 產生，確保每次渲染完全一致。
 * ============================================================ */

/** 遠景：緩慢流動的暖色雲氣，提供景深的最後一層 */
const Aurora: React.FC<{intensity?: number; hueShift?: boolean}> = ({
  intensity = 1,
  hueShift = false,
}) => {
  const frame = useCurrentFrame();
  const blobs = useMemo(
    () =>
      new Array(4).fill(0).map((_, i) => ({
        seed: i,
        size: 620 + random(`s${i}`) * 520,
        x: 12 + random(`x${i}`) * 76,
        y: 14 + random(`y${i}`) * 72,
        period: 420 + random(`p${i}`) * 380,
        amp: 40 + random(`a${i}`) * 70,
        opacity: 0.16 + random(`o${i}`) * 0.2,
      })),
    []
  );

  return (
    <AbsoluteFill style={{filter: 'blur(78px)', opacity: intensity}}>
      {blobs.map((b, i) => {
        const dx = drift(frame, b.period, b.amp, i);
        const dy = drift(frame, b.period * 1.31, b.amp * 0.66, i * 1.7);
        const color =
          hueShift && i % 2 === 1
            ? 'rgba(91,107,127,0.55)' // 冷色（痛點段落用）
            : palette.glow;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: b.size,
              height: b.size,
              marginLeft: -b.size / 2,
              marginTop: -b.size / 2,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${color} 0%, rgba(255,97,0,0.06) 46%, rgba(0,0,0,0) 70%)`,
              opacity: b.opacity,
              transform: `translate(${dx}px, ${dy}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** 透視地面網格：建立空間縱深，科技感的骨架 */
const PerspectiveGrid: React.FC<{speed?: number; opacity?: number}> = ({
  speed = 0.55,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const offset = (frame * speed) % 90;

  return (
    <AbsoluteFill style={{perspective: 900, overflow: 'hidden', opacity}}>
      <div
        style={{
          position: 'absolute',
          left: '-60%',
          right: '-60%',
          bottom: '-32%',
          height: '96%',
          transform: 'rotateX(74deg)',
          transformOrigin: 'bottom center',
          backgroundImage: `
            linear-gradient(to right, ${palette.grid} 1px, transparent 1px),
            linear-gradient(to bottom, ${palette.grid} 1px, transparent 1px)`,
          backgroundSize: '90px 90px',
          backgroundPosition: `0px ${offset}px`,
          maskImage:
            'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.28) 38%, rgba(0,0,0,0) 72%)',
          WebkitMaskImage:
            'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.28) 38%, rgba(0,0,0,0) 72%)',
        }}
      />
    </AbsoluteFill>
  );
};

/** 體積光：由畫面上方斜射而下的光束，塑造光影層次 */
const VolumetricRays: React.FC<{opacity?: number; angle?: number}> = ({
  opacity = 0.5,
  angle = -18,
}) => {
  const frame = useCurrentFrame();
  const rays = useMemo(
    () =>
      new Array(7).fill(0).map((_, i) => ({
        left: 6 + i * 13.5 + random(`rl${i}`) * 6,
        width: 40 + random(`rw${i}`) * 120,
        period: 260 + random(`rp${i}`) * 240,
        base: 0.18 + random(`ro${i}`) * 0.3,
      })),
    []
  );

  return (
    <AbsoluteFill style={{overflow: 'hidden', opacity, mixBlendMode: 'screen'}}>
      <div
        style={{
          position: 'absolute',
          inset: '-30%',
          transform: `rotate(${angle}deg)`,
        }}
      >
        {rays.map((r, i) => {
          const flicker = 0.62 + drift(frame, r.period, 0.38, i * 0.9);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${r.left}%`,
                width: r.width,
                background: `linear-gradient(to bottom, rgba(255,140,63,${
                  r.base * flicker
                }) 0%, rgba(255,97,0,${r.base * flicker * 0.35}) 42%, rgba(0,0,0,0) 82%)`,
                filter: 'blur(26px)',
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** 懸浮微粒：極慢速上升的光塵，讓空氣「有東西」 */
const DustField: React.FC<{count?: number; opacity?: number}> = ({count = 46, opacity = 0.65}) => {
  const frame = useCurrentFrame();
  const dust = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        x: random(`dx${i}`) * 100,
        y: random(`dy${i}`) * 100,
        size: 1.4 + random(`ds${i}`) * 3.6,
        speed: 0.06 + random(`dv${i}`) * 0.2,
        period: 200 + random(`dp${i}`) * 340,
        amp: 8 + random(`da${i}`) * 26,
        alpha: 0.16 + random(`dal${i}`) * 0.55,
        depth: 0.3 + random(`dd${i}`) * 0.7,
      })),
    [count]
  );

  return (
    <AbsoluteFill style={{opacity}}>
      {dust.map((d, i) => {
        const y = (d.y - frame * d.speed * 0.1 + 200) % 110;
        const x = d.x + drift(frame, d.period, d.amp * 0.06, i);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: d.size,
              height: d.size,
              borderRadius: '50%',
              background: palette.ember,
              opacity: d.alpha * d.depth,
              filter: `blur(${(1 - d.depth) * 2.6}px)`,
              boxShadow: `0 0 ${d.size * 3}px ${palette.glowSoft}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** 資料流線條：橫向掠過的細長光線，暗示運算與資料流動 */
const DataStreaks: React.FC<{count?: number; opacity?: number}> = ({count = 9, opacity = 0.5}) => {
  const frame = useCurrentFrame();
  const streaks = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        y: 6 + random(`sy${i}`) * 88,
        len: 160 + random(`sl${i}`) * 420,
        period: 150 + random(`sp${i}`) * 260,
        delay: random(`sd${i}`) * 300,
        thick: 1 + random(`st${i}`) * 1.6,
        alpha: 0.2 + random(`sa${i}`) * 0.5,
      })),
    [count]
  );

  return (
    <AbsoluteFill style={{overflow: 'hidden', opacity, mixBlendMode: 'screen'}}>
      {streaks.map((s, i) => {
        const t = ((frame + s.delay) % s.period) / s.period;
        const x = interpolate(t, [0, 1], [-20, 120]);
        const fade = Math.sin(t * Math.PI);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${s.y}%`,
              left: `${x}%`,
              width: s.len,
              height: s.thick,
              opacity: s.alpha * fade,
              background: `linear-gradient(90deg, rgba(255,97,0,0) 0%, ${palette.primaryLight} 70%, ${palette.ember} 100%)`,
              filter: 'blur(0.6px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- 場景組合 ---------------- */

export type BackdropVariant =
  | 'void'      // 開場：近乎全黑，只有一點餘燼
  | 'chamber'   // 產品主場：體積光 + 地面網格
  | 'tension'   // 痛點：冷色介入，光線壓抑
  | 'grid'      // 技術：網格 + 資料流
  | 'field'     // 產業：開闊、粒子多
  | 'summit';   // 結尾：光量最強，向上升騰

export const Backdrop: React.FC<{
  variant: BackdropVariant;
  /** 進場時整體亮度提升的長度 */
  fadeIn?: number;
}> = ({variant, fadeIn = 30}) => {
  const frame = useCurrentFrame();
  const up = enter(frame, 0, fadeIn, ease.outQuint);

  const base = (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 120% 90% at 50% 118%, ${palette.base} 0%, ${palette.deep} 42%, ${palette.void} 100%)`,
      }}
    />
  );

  return (
    <AbsoluteFill style={{opacity: interpolate(up, [0, 1], [0.55, 1])}}>
      {base}

      {variant === 'void' && (
        <>
          <Aurora intensity={0.45} />
          <DustField count={30} opacity={0.5} />
        </>
      )}

      {variant === 'chamber' && (
        <>
          <Aurora intensity={0.95} />
          <VolumetricRays opacity={0.55} angle={-16} />
          <PerspectiveGrid speed={0.5} opacity={0.9} />
          <DustField count={52} />
        </>
      )}

      {variant === 'tension' && (
        <>
          <Aurora intensity={0.7} hueShift />
          <VolumetricRays opacity={0.24} angle={14} />
          <PerspectiveGrid speed={0.3} opacity={0.5} />
          <DustField count={34} opacity={0.45} />
        </>
      )}

      {variant === 'grid' && (
        <>
          <Aurora intensity={0.7} />
          <PerspectiveGrid speed={0.85} opacity={1} />
          <DataStreaks count={11} opacity={0.55} />
          <DustField count={40} opacity={0.55} />
        </>
      )}

      {variant === 'field' && (
        <>
          <Aurora intensity={0.85} />
          <VolumetricRays opacity={0.4} angle={-24} />
          <DataStreaks count={7} opacity={0.35} />
          <DustField count={58} opacity={0.7} />
        </>
      )}

      {variant === 'summit' && (
        <>
          <Aurora intensity={1.25} />
          <VolumetricRays opacity={0.78} angle={-8} />
          <PerspectiveGrid speed={1.1} opacity={0.75} />
          <DustField count={70} opacity={0.85} />
        </>
      )}
    </AbsoluteFill>
  );
};

export {Aurora, PerspectiveGrid, VolumetricRays, DustField, DataStreaks};
