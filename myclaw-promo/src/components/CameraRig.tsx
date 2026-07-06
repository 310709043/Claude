import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE, ease} from '../easings';

type CameraRigProps = {
  children: React.ReactNode;
  /** Scale at scene start / end — slow push-in or pull-out. */
  from?: {scale?: number; x?: number; y?: number};
  to?: {scale?: number; x?: number; y?: number};
  /** Duration of the camera move (defaults to scene duration). */
  duration?: number;
  /** Add subtle handheld-like float. */
  drift?: boolean;
};

/**
 * Cinematic camera wrapper: slow eased push-ins / pans plus optional
 * micro-drift, applied to a whole scene for depth and life.
 */
export const CameraRig: React.FC<CameraRigProps> = ({
  children,
  from = {scale: 1.04},
  to = {scale: 1.0},
  duration,
  drift = true,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const d = duration ?? durationInFrames;

  const scale = ease(frame, [0, d], [from.scale ?? 1, to.scale ?? 1], EASE);
  const x = ease(frame, [0, d], [from.x ?? 0, to.x ?? 0], EASE);
  const y = ease(frame, [0, d], [from.y ?? 0, to.y ?? 0], EASE);

  const driftX = drift ? Math.sin(frame * 0.017) * 4 : 0;
  const driftY = drift ? Math.cos(frame * 0.013) * 3 : 0;

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale}) translate3d(${x + driftX}px, ${y + driftY}px, 0)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Full-scene fade in/out shell for seamless scene transitions. */
export const SceneFade: React.FC<{
  children: React.ReactNode;
  fadeIn?: number;
  fadeOut?: number;
}> = ({children, fadeIn = 14, fadeOut = 14}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const inP = fadeIn > 0 ? ease(frame, [0, fadeIn], [0, 1]) : 1;
  const outP =
    fadeOut > 0
      ? ease(frame, [durationInFrames - fadeOut, durationInFrames], [1, 0])
      : 1;
  return (
    <AbsoluteFill style={{opacity: Math.min(inP, outP)}}>
      {children}
    </AbsoluteFill>
  );
};
