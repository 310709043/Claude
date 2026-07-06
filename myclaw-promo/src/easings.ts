import {Easing, interpolate} from 'remotion';

/** Signature ease-in-out used across the whole video — nothing snaps. */
export const EASE = Easing.bezier(0.4, 0.0, 0.2, 1);
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

/** interpolate() preset with ease-in-out + clamping. */
export const ease = (
  frame: number,
  inputRange: number[],
  outputRange: number[],
  easing = EASE
): number =>
  interpolate(frame, inputRange, outputRange, {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** 0→1 progress between two frames, eased. */
export const progress = (
  frame: number,
  from: number,
  to: number,
  easing = EASE
): number => ease(frame, [from, to], [0, 1], easing);

/** Fade in at `from`, fade out before `end`. */
export const fadeInOut = (
  frame: number,
  from: number,
  end: number,
  fadeIn = 12,
  fadeOut = 12
): number =>
  Math.min(
    progress(frame, from, from + fadeIn),
    progress(frame, end - fadeOut, end, EASE) * -1 + 1
  );
