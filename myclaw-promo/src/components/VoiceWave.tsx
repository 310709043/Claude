import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

type VoiceWaveProps = {
  width?: number;
  height?: number;
  bars?: number;
  color?: string;
  /** 0–1 loudness. */
  intensity?: number;
  /** Frame offset so multiple waves don't sync. */
  seed?: number;
};

/** Live voice waveform — layered sine bars with organic motion. */
export const VoiceWave: React.FC<VoiceWaveProps> = ({
  width = 320,
  height = 64,
  bars = 36,
  color = COLORS.orange,
  intensity = 1,
  seed = 0,
}) => {
  const frame = useCurrentFrame();
  const barW = width / bars;

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        gap: barW * 0.35,
      }}
    >
      {new Array(bars).fill(0).map((_, i) => {
        const t = frame * 0.28 + seed;
        // Layered waves for an organic speech envelope
        const envelope =
          0.4 +
          0.6 *
            Math.abs(
              Math.sin(t * 0.35 + i * 0.4) * Math.sin(t * 0.13 + i * 0.15)
            );
        const jitter = 0.7 + 0.3 * Math.sin(t * 1.1 + i * 2.7);
        const h = Math.max(
          height * 0.08,
          height * envelope * jitter * intensity
        );
        return (
          <div
            key={i}
            style={{
              width: barW * 0.65,
              height: h,
              borderRadius: barW,
              background: `linear-gradient(180deg, ${color}, ${color}88)`,
              boxShadow: h > height * 0.55 ? `0 0 8px ${color}66` : undefined,
            }}
          />
        );
      })}
    </div>
  );
};
