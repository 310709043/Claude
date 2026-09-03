import {interpolate, spring, Easing} from 'remotion';

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 → 1 over [start, start+dur] with a soft deceleration. */
export const rise = (frame: number, start: number, dur = 22) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

/** Rises, holds, then falls — handy for transient callouts. */
export const pulse = (
  frame: number,
  start: number,
  hold: number,
  dur = 18,
) =>
  Math.min(rise(frame, start, dur), 1 - rise(frame, start + dur + hold, dur));

/** Springy entrance with a configurable stiffness. */
export const pop = (
  frame: number,
  fps: number,
  start: number,
  damping = 200,
  stiffness = 110,
) =>
  spring({
    frame: frame - start,
    fps,
    config: {damping, stiffness, mass: 0.9},
  });

/** Translate helper: eased slide from `px` along an axis. */
export const slide = (p: number, px: number) => (1 - p) * px;

/**
 * Scene-level enter/exit envelope so cuts read as deliberate cross-dissolves
 * rather than hard jumps.
 */
export const envelope = (
  frame: number,
  duration: number,
  inDur = 18,
  outDur = 18,
) => {
  const enter = interpolate(frame, [0, inDur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const exit = interpolate(
    frame,
    [duration - outDur, duration],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_IN_OUT},
  );
  return Math.min(enter, exit);
};
