import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../theme';

/** Deterministic pseudo-random (stable across renders). */
const rand = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

type ParticleBackgroundProps = {
  count?: number;
  /** 0–1 how much orange energy in the field. */
  energy?: number;
  /** Show soft grid lines (HUD feel). */
  grid?: boolean;
  seed?: number;
};

/**
 * Ambient cinematic background: dark vignette, drifting glow particles,
 * a faint perspective grid, and two soft brand-light sources.
 */
export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  count = 42,
  energy = 0.5,
  grid = true,
  seed = 1,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const particles = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => {
        const s = seed * 100 + i;
        return {
          x: rand(s) * width,
          y: rand(s + 1) * height,
          size: 1.5 + rand(s + 2) * 3.5,
          speed: 0.15 + rand(s + 3) * 0.5,
          phase: rand(s + 4) * Math.PI * 2,
          isOrange: rand(s + 5) < energy,
          drift: 12 + rand(s + 6) * 30,
        };
      }),
    [count, width, height, seed, energy]
  );

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, overflow: 'hidden'}}>
      {/* Deep radial base */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 70% at 50% 42%, ${COLORS.bgElevated} 0%, ${COLORS.bg} 55%, ${COLORS.black} 100%)`,
        }}
      />
      {/* Brand light sources */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(600px 420px at 18% 88%, rgba(255,107,26,${
            0.07 + energy * 0.06
          }) 0%, transparent 70%), radial-gradient(700px 480px at 84% 10%, rgba(59,158,255,0.05) 0%, transparent 70%)`,
        }}
      />
      {/* Perspective grid */}
      {grid ? (
        <AbsoluteFill style={{opacity: 0.25}}>
          <svg width={width} height={height}>
            {new Array(13).fill(0).map((_, i) => (
              <line
                key={`v${i}`}
                x1={(i * width) / 12}
                y1={0}
                x2={(i * width) / 12}
                y2={height}
                stroke="rgba(255,255,255,0.035)"
                strokeWidth={1}
              />
            ))}
            {new Array(8).fill(0).map((_, i) => (
              <line
                key={`h${i}`}
                x1={0}
                y1={(i * height) / 7}
                x2={width}
                y2={(i * height) / 7}
                stroke="rgba(255,255,255,0.035)"
                strokeWidth={1}
              />
            ))}
          </svg>
        </AbsoluteFill>
      ) : null}
      {/* Drifting particles */}
      {particles.map((p, i) => {
        const t = frame * p.speed * 0.02 + p.phase;
        const x = p.x + Math.sin(t) * p.drift;
        const y = p.y + Math.cos(t * 0.8) * p.drift - frame * p.speed * 0.3;
        const wrappedY = ((y % (height + 80)) + height + 80) % (height + 80) - 40;
        const twinkle = 0.35 + 0.5 * (0.5 + 0.5 * Math.sin(t * 2.1));
        const color = p.isOrange ? COLORS.orange : COLORS.blue;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: wrappedY,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: color,
              opacity: twinkle * 0.5,
              boxShadow: `0 0 ${p.size * 4}px ${color}`,
            }}
          />
        );
      })}
      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 120% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
