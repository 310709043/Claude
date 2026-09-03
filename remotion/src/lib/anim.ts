import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

type EnterOptions = {
  /** Frames to wait before the element starts moving. */
  delay?: number;
  /** Higher = snappier settle. */
  damping?: number;
  mass?: number;
  stiffness?: number;
  durationInFrames?: number;
};

/** Spring-based 0 → 1 entrance progress. */
export const useEnter = ({
  delay = 0,
  damping = 200,
  mass = 0.7,
  stiffness = 120,
  durationInFrames,
}: EnterOptions = {}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: {damping, mass, stiffness},
    durationInFrames,
  });
};

/** Linear-with-easing 0 → 1 progress between two absolute frames. */
export const useRamp = (from: number, to: number, easing = Easing.out(Easing.cubic)) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
};

/** Fades in at the start of a scene and back out just before it ends. */
export const useSceneFade = (fadeIn = 12, fadeOut = 12) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return Math.min(
    interpolate(frame, [0, fadeIn], [0, 1], {extrapolateRight: 'clamp'}),
    interpolate(frame, [durationInFrames - fadeOut, durationInFrames], [1, 0], {
      extrapolateLeft: 'clamp',
    }),
  );
};

/** Translate-up + fade style object driven by a 0 → 1 progress value. */
export const rise = (progress: number, distance = 42) => ({
  opacity: progress,
  transform: `translateY(${(1 - progress) * distance}px)`,
});

/** Same as `rise`, but the element also settles out of a soft blur. */
export const riseBlur = (progress: number, distance = 42, blur = 10) => ({
  opacity: progress,
  transform: `translateY(${(1 - progress) * distance}px)`,
  filter: progress > 0.995 ? 'none' : `blur(${(1 - progress) * blur}px)`,
});

/** Deterministic pseudo-random in [0, 1) — handy for ambient motion. */
export const noise = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
