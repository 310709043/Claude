// Single source of truth for scene order + durations (frames @30fps).
export const TRANSITION = 20;

export const SCENES = [
  { id: "coldopen", dur: 270 },
  { id: "positioning", dur: 270 },
  { id: "tiers", dur: 480 },
  { id: "map", dur: 420 },
  { id: "interact", dur: 450 },
  { id: "verify", dur: 300 },
  { id: "photo", dur: 480 },
  { id: "safety", dur: 480 },
  { id: "privacy", dur: 360 },
  { id: "premium", dur: 330 },
  { id: "memory", dur: 270 },
  { id: "outro", dur: 240 },
] as const;

export const TOTAL =
  SCENES.reduce((a, s) => a + s.dur, 0) - TRANSITION * (SCENES.length - 1);
