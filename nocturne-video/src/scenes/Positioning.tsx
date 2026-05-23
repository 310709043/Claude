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

const NOS = ["沒有自我介紹", "沒有照片牆", "沒有按讚數", "沒有人氣排序"];

export const Positioning: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const head = spring({ frame: frame - 10, fps, config: { damping: 200, stiffness: 110, mass: 0.8 } });
  const tail = spring({ frame: frame - 190, fps, config: { damping: 200, stiffness: 110, mass: 0.8 } });
  const out = interpolate(frame, [durationInFrames - 22, durationInFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: out,
        padding: "0 110px",
      }}
    >
      <div
        style={{
          opacity: head,
          transform: `translateY(${(1 - head) * 26}px)`,
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 44, color: C.sub }}>
          這不是一個
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 116,
            color: C.ink,
            marginTop: 8,
            letterSpacing: 1,
          }}
        >
          dating app<span style={{ color: C.ember }}>。</span>
        </div>
      </div>

      <div style={{ marginTop: 90, display: "flex", flexDirection: "column", gap: 26, width: "100%" }}>
        {NOS.map((t, i) => {
          const d = 40 + i * 16;
          const s = spring({ frame: frame - d, fps, config: { damping: 200, stiffness: 130, mass: 0.7 } });
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                opacity: s,
                transform: `translateX(${(1 - s) * -30}px)`,
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: 50,
                color: C.ink2,
              }}
            >
              <Cross color={C.danger} p={s} />
              {t}
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 96,
          opacity: tail,
          transform: `translateY(${(1 - tail) * 22}px)`,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 52,
          color: C.ink,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        你今晚是誰，<br />
        <span style={{ color: C.ember }}>由你今晚決定。</span>
      </div>
    </AbsoluteFill>
  );
};

const Cross: React.FC<{ color: string; p: number }> = ({ color, p }) => (
  <svg width={48} height={48} style={{ flex: "0 0 auto" }}>
    <circle cx={24} cy={24} r={22} fill="none" stroke={`${color}66`} strokeWidth={2} />
    <line x1={16} y1={16} x2={32} y2={32} stroke={color} strokeWidth={4} strokeLinecap="round" strokeDasharray={24} strokeDashoffset={24 * (1 - p)} />
    <line x1={32} y1={16} x2={16} y2={32} stroke={color} strokeWidth={4} strokeLinecap="round" strokeDasharray={24} strokeDashoffset={24 * (1 - p)} />
  </svg>
);
