import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {ease} from '../anim';
import {palette} from '../theme';

/* ============================================================
 *  自訂轉場 — 全片不使用任何預設的淡入淡出
 * ============================================================ */

/* ------------------------------------------------------------
 *  1. LightSweep 光刃橫掃
 *  一道熾熱的品牌色光刃橫掃畫面，把舊畫面「切開」、
 *  新畫面在光刃後方被帶出。轉場本身即是視覺高潮。
 * ------------------------------------------------------------ */
type SweepProps = {direction?: 'left-to-right' | 'right-to-left'};

const LightSweepComponent: React.FC<
  TransitionPresentationComponentProps<SweepProps>
> = ({children, presentationProgress, presentationDirection, passedProps}) => {
  const ltr = (passedProps.direction ?? 'left-to-right') === 'left-to-right';
  const p = interpolate(presentationProgress, [0, 1], [0, 1], {easing: ease.outExpo});
  const edge = p * 100;

  if (presentationDirection === 'exiting') {
    // 舊畫面被推開並輕微失焦，製造「被取代」的縱深
    return (
      <AbsoluteFill
        style={{
          transform: `scale(${interpolate(p, [0, 1], [1, 1.06])}) translateX(${
            (ltr ? 1 : -1) * p * 28
          }px)`,
          filter: `blur(${p * 9}px) brightness(${interpolate(p, [0, 1], [1, 0.55])})`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  const clip = ltr
    ? `inset(0% ${100 - edge}% 0% 0%)`
    : `inset(0% 0% 0% ${100 - edge}%)`;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: clip,
          transform: `scale(${interpolate(p, [0, 1], [1.05, 1])})`,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* 光刃本體 */}
      <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute',
            top: '-8%',
            height: '116%',
            width: 190,
            left: ltr ? `calc(${edge}% - 95px)` : undefined,
            right: ltr ? undefined : `calc(${edge}% - 95px)`,
            opacity: Math.sin(Math.min(1, p) * Math.PI) * 1.0,
            background: `linear-gradient(90deg,
              rgba(255,97,0,0) 0%,
              rgba(255,140,63,0.55) 34%,
              ${palette.primaryPale} 50%,
              rgba(255,140,63,0.55) 66%,
              rgba(255,97,0,0) 100%)`,
            filter: 'blur(9px)',
            transform: 'skewX(-7deg)',
          }}
        />
        {/* 光刃拖尾的暖色餘暉 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: Math.sin(Math.min(1, p) * Math.PI) * 0.42,
            background: ltr
              ? `linear-gradient(90deg, rgba(255,97,0,0) ${Math.max(0, edge - 26)}%, ${
                  palette.glowSoft
                } ${edge}%, rgba(255,97,0,0) ${Math.min(100, edge + 8)}%)`
              : `linear-gradient(270deg, rgba(255,97,0,0) ${Math.max(0, edge - 26)}%, ${
                  palette.glowSoft
                } ${edge}%, rgba(255,97,0,0) ${Math.min(100, edge + 8)}%)`,
            mixBlendMode: 'screen',
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const lightSweep = (props: SweepProps = {}): TransitionPresentation<SweepProps> => ({
  component: LightSweepComponent,
  props: {direction: props.direction ?? 'left-to-right'},
});

/* ------------------------------------------------------------
 *  2. IrisZoom 光圈變焦
 *  舊畫面向內塌縮、新畫面自深處推出，接縫處爆出一記暖白閃光。
 *  用於段落之間最大的敘事轉折。
 * ------------------------------------------------------------ */
const IrisZoomComponent: React.FC<TransitionPresentationComponentProps<{}>> = ({
  children,
  presentationProgress,
  presentationDirection,
}) => {
  const p = interpolate(presentationProgress, [0, 1], [0, 1], {easing: ease.inOutCine});
  const flash = Math.sin(Math.min(1, presentationProgress) * Math.PI) ** 2;

  if (presentationDirection === 'exiting') {
    return (
      <AbsoluteFill
        style={{
          transform: `scale(${interpolate(p, [0, 1], [1, 1.28])})`,
          opacity: interpolate(p, [0, 0.7, 1], [1, 0.35, 0]),
          filter: `blur(${p * 16}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: `scale(${interpolate(p, [0, 1], [0.86, 1])})`,
          opacity: interpolate(p, [0, 0.45, 1], [0, 0.6, 1]),
          filter: `blur(${(1 - p) * 22}px)`,
        }}
      >
        {children}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          opacity: flash * 0.85,
          background: `radial-gradient(circle at 50% 50%, ${palette.primaryPale} 0%, ${palette.glow} 26%, rgba(255,97,0,0) 62%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const irisZoom = (): TransitionPresentation<{}> => ({
  component: IrisZoomComponent,
  props: {},
});

/* ------------------------------------------------------------
 *  3. ShutterBars 遮罩百葉
 *  畫面被切成數道橫條依序推開，帶機械的精密感，
 *  適合技術規格類段落的切換。
 * ------------------------------------------------------------ */
type ShutterProps = {bars?: number};

const ShutterComponent: React.FC<TransitionPresentationComponentProps<ShutterProps>> = ({
  children,
  presentationProgress,
  presentationDirection,
  passedProps,
}) => {
  const bars = passedProps.bars ?? 7;

  if (presentationDirection === 'exiting') {
    return (
      <AbsoluteFill
        style={{
          filter: `brightness(${interpolate(presentationProgress, [0, 1], [1, 0.6])})`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      {new Array(bars).fill(0).map((_, i) => {
        // 由中央向外擴散的錯位，比由上到下更有設計感
        const distance = Math.abs(i - (bars - 1) / 2) / ((bars - 1) / 2 || 1);
        const delay = distance * 0.34;
        const local = interpolate(
          presentationProgress,
          [delay, Math.min(1, delay + 0.66)],
          [0, 1],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.outExpo}
        );
        const top = (i / bars) * 100;
        const height = 100 / bars;

        return (
          <AbsoluteFill
            key={i}
            style={{
              clipPath: `inset(${top}% ${100 - local * 100}% ${100 - top - height}% 0%)`,
            }}
          >
            {children}
          </AbsoluteFill>
        );
      })}

      {/* 每道橫條前緣的細光線 */}
      {new Array(bars).fill(0).map((_, i) => {
        const distance = Math.abs(i - (bars - 1) / 2) / ((bars - 1) / 2 || 1);
        const delay = distance * 0.34;
        const local = interpolate(
          presentationProgress,
          [delay, Math.min(1, delay + 0.66)],
          [0, 1],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.outExpo}
        );
        if (local <= 0 || local >= 1) return null;
        return (
          <div
            key={`l${i}`}
            style={{
              position: 'absolute',
              top: `${(i / bars) * 100}%`,
              height: `${100 / bars}%`,
              left: `${local * 100}%`,
              width: 4,
              background: palette.primaryLight,
              boxShadow: `0 0 22px ${palette.glow}`,
              opacity: Math.sin(local * Math.PI),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const shutterBars = (props: ShutterProps = {}): TransitionPresentation<ShutterProps> => ({
  component: ShutterComponent,
  props: {bars: props.bars ?? 7},
});
