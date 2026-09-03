import React from 'react';
import {AbsoluteFill, interpolate, interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {color} from '../theme';

/**
 * One continuous background for the whole film. It lives outside the
 * TransitionSeries so that scenes cross-fade over an unbroken environment
 * instead of dissolving between two different backgrounds.
 */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = frame / durationInFrames;

  const stops = [0, 0.18, 0.38, 0.58, 0.78, 1];
  const warm = interpolateColors(
    t,
    stops,
    [color.orange, color.terracotta, color.gold, color.terracotta, color.sky, color.orange],
  );
  const cool = interpolateColors(
    t,
    stops,
    [color.terracotta, color.gold, color.orange, color.sky, color.jade, color.terracotta],
  );

  // Two slow, out-of-phase orbits keep the light moving without ever looping
  // visibly inside the 96 s runtime.
  const ax = 30 + Math.sin(frame / 240) * 22;
  const ay = 18 + Math.cos(frame / 310) * 16;
  const bx = 78 + Math.cos(frame / 275) * 18;
  const by = 84 + Math.sin(frame / 200) * 14;

  const gridShift = (frame * 0.28) % 110;

  return (
    <AbsoluteFill style={{backgroundColor: color.bg}}>
      {/* Ambient light */}
      <AbsoluteFill
        style={{
          backgroundImage: [
            `radial-gradient(58% 62% at ${ax}% ${ay}%, ${warm}42 0%, ${warm}12 42%, transparent 72%)`,
            `radial-gradient(52% 58% at ${bx}% ${by}%, ${cool}30 0%, ${cool}0d 45%, transparent 74%)`,
            `radial-gradient(120% 90% at 50% 120%, ${color.ink}00 0%, ${color.ink}cc 100%)`,
          ].join(','),
        }}
      />

      {/* Measured grid — a nod to the architecture diagrams in the deck */}
      <AbsoluteFill
        style={{
          opacity: 0.5,
          backgroundImage: `linear-gradient(${color.hairSoft} 1px, transparent 1px), linear-gradient(90deg, ${color.hairSoft} 1px, transparent 1px)`,
          backgroundSize: '110px 110px',
          backgroundPosition: `${-gridShift}px ${-gridShift * 0.4}px`,
          maskImage: 'radial-gradient(78% 78% at 50% 46%, #000 12%, transparent 82%)',
          WebkitMaskImage: 'radial-gradient(78% 78% at 50% 46%, #000 12%, transparent 82%)',
        }}
      />

      {/* Fine scanline texture */}
      <AbsoluteFill
        style={{
          opacity: 0.16,
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.055) 0px, rgba(255,255,255,0.055) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(72% 68% at 50% 48%, transparent 40%, rgba(6,5,4,0.55) 100%)',
        }}
      />

      {/* Opening / closing dip to black */}
      <AbsoluteFill
        style={{
          backgroundColor: color.ink,
          opacity: Math.max(
            interpolate(frame, [0, 18], [1, 0], {extrapolateRight: 'clamp'}),
            interpolate(frame, [durationInFrames - 22, durationInFrames - 2], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          ),
        }}
      />
    </AbsoluteFill>
  );
};
