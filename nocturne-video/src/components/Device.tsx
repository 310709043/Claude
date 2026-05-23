import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { FONT, MONO } from "../fonts";

// Floating phone shell. Sized to leave a ~340px bottom band for captions on the
// cinematic background. Children render inside the rounded screen (below the
// status bar). A gentle vertical bob keeps it alive.
export const PHONE_W = 760;
export const PHONE_H = 1520;
export const PHONE_TOP = 52;

export const Device: React.FC<{
  children: React.ReactNode;
  accent?: string;
  time?: string;
  bob?: boolean;
}> = ({ children, accent = C.ember, time = "03:14", bob = true }) => {
  const frame = useCurrentFrame();
  const dy = bob ? Math.sin(frame / 40) * 6 : 0;

  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          marginTop: PHONE_TOP,
          width: PHONE_W,
          height: PHONE_H,
          transform: `translateY(${dy}px)`,
          borderRadius: 68,
          padding: 14,
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))",
          boxShadow: `0 50px 130px rgba(0,0,0,0.65), 0 0 90px ${accent}1f, inset 0 0 0 1.5px rgba(255,255,255,0.08)`,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: 56,
            overflow: "hidden",
            background: `linear-gradient(180deg, ${C.bg2}, ${C.bg})`,
            border: `1px solid ${C.line}`,
          }}
        >
          {/* status bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 58,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 40px",
              zIndex: 50,
              fontFamily: MONO,
              color: C.ink2,
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            <span>{time}</span>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Bars />
              <span style={{ fontFamily: FONT, fontSize: 18 }}>夜</span>
              <Battery />
            </div>
          </div>
          {/* notch */}
          <div
            style={{
              position: "absolute",
              top: 16,
              left: "50%",
              transform: "translateX(-50%)",
              width: 200,
              height: 30,
              borderRadius: 999,
              background: "#000",
              zIndex: 60,
              opacity: 0.9,
            }}
          />
          <AbsoluteFill style={{ paddingTop: 58 }}>{children}</AbsoluteFill>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Bars: React.FC = () => (
  <svg width={32} height={22}>
    {[0, 1, 2, 3].map((i) => (
      <rect
        key={i}
        x={i * 8.5}
        y={14 - i * 4.5}
        width={5.5}
        height={7 + i * 4.5}
        rx={1.5}
        fill={C.ink2}
        opacity={i < 3 ? 1 : 0.4}
      />
    ))}
  </svg>
);

const Battery: React.FC = () => (
  <svg width={44} height={22}>
    <rect x={1} y={4} width={36} height={14} rx={4} fill="none" stroke={C.ink2} strokeWidth={2} opacity={0.7} />
    <rect x={4} y={6.5} width={24} height={9} rx={2} fill={C.glow} />
    <rect x={39} y={8} width={4} height={6} rx={2} fill={C.ink2} opacity={0.7} />
  </svg>
);
