import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, random } from "remotion";
import { noise2D } from "@remotion/noise";
import { C } from "../theme";

// Persistent deep-night atmosphere: aurora glows drifting + faint star field + grain.
// Rendered once behind the whole timeline so the mood stays continuous across scenes.

const STARS = new Array(70).fill(0).map((_, i) => ({
  x: random(`sx-${i}`) * 1080,
  y: random(`sy-${i}`) * 1920,
  r: 0.6 + random(`sr-${i}`) * 1.8,
  tw: 0.4 + random(`st-${i}`) * 0.6,
  ph: random(`sp-${i}`) * Math.PI * 2,
}));

export const Background: React.FC<{ tint?: string }> = ({ tint }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  // two slow-drifting aurora orbs
  const ax = 540 + Math.sin(t * 0.18) * 260;
  const ay = 560 + Math.cos(t * 0.13) * 200;
  const bx = 560 + Math.cos(t * 0.11 + 1.5) * 300;
  const by = 1320 + Math.sin(t * 0.16 + 0.6) * 240;

  const emberO = 0.5 + 0.15 * Math.sin(t * 0.5);
  const glowO = 0.42 + 0.14 * Math.cos(t * 0.37);

  const tintLayer = tint
    ? `radial-gradient(900px 900px at 50% 22%, ${tint}22, transparent 70%)`
    : "";

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1200px 1200px at 50% -10%, ${C.bg3}, ${C.bg} 60%)`,
        }}
      />
      {/* stars */}
      <AbsoluteFill>
        <svg width={1080} height={1920}>
          {STARS.map((s, i) => {
            const a = s.tw * (0.45 + 0.55 * Math.sin(t * 1.2 + s.ph));
            return (
              <circle
                key={i}
                cx={s.x}
                cy={s.y}
                r={s.r}
                fill={C.ink}
                opacity={a * 0.5}
              />
            );
          })}
        </svg>
      </AbsoluteFill>
      {/* aurora orbs */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(620px 620px at ${ax}px ${ay}px, ${C.ember}, transparent 65%)`,
          opacity: emberO * 0.22,
          filter: "blur(40px)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(680px 680px at ${bx}px ${by}px, ${C.glow}, transparent 65%)`,
          opacity: glowO * 0.18,
          filter: "blur(46px)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(700px 520px at 50% 120%, ${C.s0}, transparent 60%)`,
          opacity: 0.12,
          filter: "blur(40px)",
        }}
      />
      {tint ? <AbsoluteFill style={{ background: tintLayer }} /> : null}
      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(1100px 1500px at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      {/* subtle moving grain */}
      <AbsoluteFill style={{ opacity: 0.05, mixBlendMode: "overlay" }}>
        <Grain frame={frame} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Grain: React.FC<{ frame: number }> = ({ frame }) => {
  const cells: React.ReactNode[] = [];
  const N = 16;
  const size = 1080 / N;
  for (let y = 0; y < N * 1.78; y++) {
    for (let x = 0; x < N; x++) {
      const v = noise2D("g", x * 0.6 + frame * 0.4, y * 0.6);
      const o = interpolate(v, [-1, 1], [0, 0.5]);
      cells.push(
        <rect
          key={`${x}-${y}`}
          x={x * size}
          y={y * size}
          width={size}
          height={size}
          fill={o > 0.32 ? "#fff" : "#000"}
          opacity={Math.abs(o - 0.25)}
        />
      );
    }
  }
  return (
    <svg width={1080} height={1920}>
      {cells}
    </svg>
  );
};
