import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C } from "../theme";
import { FONT } from "../fonts";

const PILLARS = ["匿名", "安全", "不留下"];

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const logo = spring({ frame: frame - 14, fps, config: { damping: 200, mass: 1, stiffness: 90 } });
  const tag = spring({ frame: frame - 56, fps, config: { damping: 200, stiffness: 110 } });
  const pill = spring({ frame: frame - 96, fps, config: { damping: 200, stiffness: 120 } });
  const fade = interpolate(frame, [durationInFrames - 50, durationInFrames - 6], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const breathe = 1 + 0.02 * Math.sin(frame / 22);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: fade }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(560px 560px at 50% 46%, ${C.ember}, transparent 60%)`,
          opacity: 0.16 * logo,
          filter: "blur(20px)",
        }}
      />
      <div
        style={{
          opacity: logo,
          transform: `translateY(${(1 - logo) * 24}px) scale(${breathe})`,
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 130, color: C.ink, letterSpacing: 2, textShadow: `0 0 60px ${C.ember}55` }}>
          Nocturne
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 46, color: C.ember, letterSpacing: 20, marginTop: 16, paddingLeft: 20 }}>
          夜 訊
        </div>
      </div>

      <div
        style={{
          marginTop: 70,
          display: "flex",
          gap: 22,
          opacity: pill,
          transform: `translateY(${(1 - pill) * 18}px)`,
        }}
      >
        {PILLARS.map((p, i) => (
          <span
            key={i}
            style={{
              fontFamily: FONT,
              fontSize: 30,
              color: C.ink2,
              border: `1px solid ${C.line}`,
              borderRadius: 999,
              padding: "10px 26px",
              background: C.card,
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <div
        style={{
          marginTop: 60,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 56,
          color: C.ink,
          opacity: tag,
          transform: `translateY(${(1 - tag) * 20}px)`,
          textShadow: "0 4px 24px rgba(0,0,0,0.6)",
        }}
      >
        今晚，<span style={{ color: C.ember }}>你不孤單。</span>
      </div>
    </AbsoluteFill>
  );
};
