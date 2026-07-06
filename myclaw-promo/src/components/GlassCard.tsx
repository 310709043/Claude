import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, glass} from '../theme';

type GlassCardProps = {
  children: React.ReactNode;
  /** Frame (relative to parent Sequence) at which the card enters. */
  enterAt?: number;
  /** Entrance direction offset. */
  fromY?: number;
  fromX?: number;
  fromScale?: number;
  width?: number | string;
  height?: number | string;
  padding?: number;
  radius?: number;
  glow?: boolean;
  accent?: boolean;
  style?: React.CSSProperties;
};

/**
 * Glassmorphism floating card with a springy, cinematic entrance.
 * The base building block of every UI panel in the video.
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  enterAt = 0,
  fromY = 46,
  fromX = 0,
  fromScale = 0.96,
  width,
  height,
  padding = 28,
  radius = 24,
  glow = false,
  accent = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({
    frame: frame - enterAt,
    fps,
    config: {damping: 26, stiffness: 90, mass: 0.9},
  });

  const translateY = (1 - enter) * fromY;
  const translateX = (1 - enter) * fromX;
  const scale = fromScale + (1 - fromScale) * enter;

  return (
    <div
      style={{
        ...glass(0.055),
        width,
        height,
        padding,
        borderRadius: radius,
        opacity: enter,
        transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
        ...(accent
          ? {borderTop: `2px solid ${COLORS.orange}`}
          : null),
        ...(glow
          ? {
              boxShadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 80px ${COLORS.orangeGlow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
            }
          : null),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
