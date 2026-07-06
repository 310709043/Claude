import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../theme';

const rand = (seed: number): number => {
  const x = Math.sin(seed * 91.7 + 47.3) * 24634.5453;
  return x - Math.floor(x);
};

type DataFlowProps = {
  /** Number of flowing streams. */
  streams?: number;
  /** 'converge' pulls all streams toward the center point. */
  mode?: 'ambient' | 'converge';
  /** 0–1 progress of convergence (for the ending). */
  convergeProgress?: number;
  opacity?: number;
  seed?: number;
};

/**
 * Data-flow layer: glowing bezier streams with travelling light pulses.
 * In 'converge' mode all streams bend into the screen center —
 * used for the ending where data forms the enterprise AI network.
 */
export const DataFlow: React.FC<DataFlowProps> = ({
  streams = 9,
  mode = 'ambient',
  convergeProgress = 0,
  opacity = 1,
  seed = 7,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const cx = width / 2;
  const cy = height / 2;

  const defs = useMemo(
    () =>
      new Array(streams).fill(0).map((_, i) => {
        const s = seed * 10 + i;
        const fromLeft = rand(s) > 0.5;
        const y1 = rand(s + 1) * height;
        const y2 = rand(s + 2) * height;
        const midY = rand(s + 3) * height;
        return {
          x1: fromLeft ? -60 : width + 60,
          y1,
          x2: fromLeft ? width + 60 : -60,
          y2,
          midY,
          speed: 0.5 + rand(s + 4) * 0.9,
          phase: rand(s + 5),
          isOrange: rand(s + 6) > 0.35,
          w: 1 + rand(s + 7) * 1.4,
        };
      }),
    [streams, width, height, seed]
  );

  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="dfOrange" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.orange} stopOpacity={0} />
            <stop offset="50%" stopColor={COLORS.orange} stopOpacity={0.5} />
            <stop offset="100%" stopColor={COLORS.orange} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="dfBlue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0} />
            <stop offset="50%" stopColor={COLORS.blue} stopOpacity={0.4} />
            <stop offset="100%" stopColor={COLORS.blue} stopOpacity={0} />
          </linearGradient>
        </defs>
        {defs.map((d, i) => {
          const cp = mode === 'converge' ? convergeProgress : 0;
          // Control point bends toward center as convergence grows
          const ctrlX = cx;
          const ctrlY = d.midY + (cy - d.midY) * cp;
          const endX = d.x2 + (cx - d.x2) * cp;
          const endY = d.y2 + (cy - d.y2) * cp;
          const path = `M ${d.x1} ${d.y1} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`;
          const t = ((frame * 0.006 * d.speed + d.phase) % 1 + 1) % 1;
          // Quadratic bezier point at t
          const qx =
            (1 - t) * (1 - t) * d.x1 + 2 * (1 - t) * t * ctrlX + t * t * endX;
          const qy =
            (1 - t) * (1 - t) * d.y1 + 2 * (1 - t) * t * ctrlY + t * t * endY;
          const color = d.isOrange ? COLORS.orange : COLORS.blue;
          return (
            <g key={i}>
              <path
                d={path}
                fill="none"
                stroke={d.isOrange ? 'url(#dfOrange)' : 'url(#dfBlue)'}
                strokeWidth={d.w}
              />
              <circle
                cx={qx}
                cy={qy}
                r={2.5 + d.w}
                fill={color}
                opacity={0.9}
                style={{filter: `drop-shadow(0 0 8px ${color})`}}
              />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
