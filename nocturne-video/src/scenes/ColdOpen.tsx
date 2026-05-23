import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C } from "../theme";
import { FONT, MONO } from "../fonts";

export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const timeIn = interpolate(frame, [6, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logo = spring({ frame: frame - 40, fps, config: { damping: 200, mass: 1.1, stiffness: 90 } });
  const sub = spring({ frame: frame - 80, fps, config: { damping: 200, mass: 0.8, stiffness: 110 } });
  const tag = spring({ frame: frame - 120, fps, config: { damping: 200, mass: 0.8, stiffness: 110 } });
  const out = interpolate(frame, [durationInFrames - 26, durationInFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const breathe = 1 + 0.02 * Math.sin(frame / 22);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: out }}>
      {/* central ember halo */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(560px 560px at 50% 44%, ${C.ember}, transparent 60%)`,
          opacity: 0.18 * logo,
          filter: "blur(20px)",
        }}
      />
      <div
        style={{
          fontFamily: MONO,
          color: C.sub,
          fontSize: 30,
          letterSpacing: 8,
          opacity: timeIn,
          transform: `translateY(${(1 - timeIn) * -10}px)`,
          marginBottom: 50,
        }}
      >
        凌晨 03:14
      </div>

      <div
        style={{
          opacity: logo,
          transform: `translateY(${(1 - logo) * 28}px) scale(${0.96 + 0.04 * logo})`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 150,
            color: C.ink,
            letterSpacing: 2,
            lineHeight: 1,
            transform: `scale(${breathe})`,
            textShadow: `0 0 60px ${C.ember}55`,
          }}
        >
          Nocturne
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 54,
            color: C.ember,
            letterSpacing: 22,
            marginTop: 18,
            paddingLeft: 22,
            opacity: sub,
          }}
        >
          夜 訊
        </div>
      </div>

      <div
        style={{
          marginTop: 80,
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 46,
          color: C.ink2,
          opacity: tag,
          transform: `translateY(${(1 - tag) * 22}px)`,
          textShadow: "0 4px 24px rgba(0,0,0,0.6)",
        }}
      >
        今晚，有人和你一樣醒著。
      </div>
    </AbsoluteFill>
  );
};
