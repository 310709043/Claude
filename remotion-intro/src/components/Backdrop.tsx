import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {C} from '../theme';

/**
 * The film's continuous stage: a warm off-white canvas with slowly drifting
 * brand-coloured light, a faint engineering grid and a soft vignette.
 * It runs underneath every scene so cuts feel like camera moves on one set.
 */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, width, height} = useVideoConfig();
  const t = frame / durationInFrames;

  const blob = (
    x: number,
    y: number,
    r: number,
    color: string,
    alpha: number,
  ) => ({
    position: 'absolute' as const,
    left: x - r,
    top: y - r,
    width: r * 2,
    height: r * 2,
    borderRadius: '50%',
    background: `radial-gradient(circle at 50% 50%, ${color} 0%, ${color}00 68%)`,
    opacity: alpha,
    filter: 'blur(4px)',
  });

  const drift = (phase: number, amp: number) =>
    Math.sin(t * Math.PI * 2 * 0.7 + phase) * amp;

  return (
    <AbsoluteFill style={{background: `linear-gradient(160deg, ${C.paper} 0%, ${C.canvasWarm} 38%, ${C.canvas} 100%)`}}>
      {/* drifting brand light */}
      <div style={blob(width * 0.16 + drift(0, 70), height * 0.12 + drift(1.4, 46), 720, C.orange, 0.16)} />
      <div style={blob(width * 0.92 + drift(2.1, -60), height * 0.2 + drift(0.6, 40), 620, C.amber, 0.13)} />
      <div style={blob(width * 0.82 + drift(3.4, 55), height * 0.94 + drift(2.7, -38), 760, C.indigo, 0.1)} />
      <div style={blob(width * 0.06 + drift(1.1, -48), height * 0.9 + drift(3.9, 34), 560, C.teal, 0.08)} />

      {/* engineering grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.ink}09 1px, transparent 1px), linear-gradient(90deg, ${C.ink}09 1px, transparent 1px)`,
          backgroundSize: '96px 96px',
          backgroundPosition: `${drift(0.4, 12)}px ${drift(2.2, 12)}px`,
          maskImage: 'radial-gradient(ellipse 78% 70% at 50% 46%, #000 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 78% 70% at 50% 46%, #000 0%, transparent 100%)',
          opacity: 0.85,
        }}
      />

      {/* fine paper grain keeps large flat areas from banding */}
      <AbsoluteFill
        style={{
          opacity: 0.035,
          mixBlendMode: 'multiply',
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/></filter><rect width='180' height='180' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 82% 78% at 50% 44%, transparent 40%, ${C.ink}14 100%)`,
          opacity: interpolate(frame, [0, 40], [0.4, 1], {extrapolateRight: 'clamp'}),
        }}
      />
    </AbsoluteFill>
  );
};
