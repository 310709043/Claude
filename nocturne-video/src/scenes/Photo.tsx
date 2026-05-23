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
import { Device } from "../components/Device";
import { Caption } from "../components/Caption";

const RULES = [
  "雙方都按「我願意」才會互相看到",
  "天亮自動消失 · 無法截圖、無法保存",
  "任何一方撤回，立即雙向關閉",
];

export const Photo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 22, durationInFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const head = spring({ frame: frame - 8, fps, config: { damping: 200, stiffness: 110 } });

  // you agree at ~150, partner at ~230, reveal completes ~330
  const youAgree = spring({ frame: frame - 150, fps, config: { damping: 200, stiffness: 130 } });
  const partnerAgree = spring({ frame: frame - 230, fps, config: { damping: 200, stiffness: 130 } });
  const reveal = interpolate(frame, [300, 380], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const both = youAgree > 0.9 && partnerAgree > 0.9;

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Device accent={C.ember}>
        <div style={{ padding: "44px 40px 0", textAlign: "center" }}>
          <div style={{ opacity: head, transform: `translateY(${(1 - head) * 16}px)`, fontFamily: FONT }}>
            <div style={{ color: C.ember, fontSize: 26, fontWeight: 700, letterSpacing: 2 }}>今晚的照片 · 雙向交換</div>
            <div style={{ color: C.ink, fontSize: 50, fontWeight: 900, marginTop: 10 }}>在見面之前，先看見彼此</div>
          </div>

          {/* two photo cards */}
          <div style={{ marginTop: 40, display: "flex", gap: 22, justifyContent: "center" }}>
            <PhotoCard label="你" agreed={youAgree} reveal={reveal} hue1="#3a2c5e" hue2={C.s1} delay={30} frame={frame} fps={fps} />
            <PhotoCard label="對方" agreed={partnerAgree} reveal={reveal} hue1="#5e2c3a" hue2={C.ember} delay={40} frame={frame} fps={fps} />
          </div>

          {/* status */}
          <div
            style={{
              marginTop: 26,
              fontFamily: FONT,
              fontSize: 30,
              fontWeight: 700,
              color: both ? C.glow : C.sub,
            }}
          >
            {both ? "都同意了 · 互看 ✓" : "已表達意願 · 等對方"}
          </div>

          {/* rules */}
          <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 14, textAlign: "left" }}>
            {RULES.map((r, i) => {
              const sp = spring({ frame: frame - (40 + i * 14), fps, config: { damping: 200, stiffness: 130 } });
              return (
                <div
                  key={i}
                  style={{
                    opacity: sp,
                    transform: `translateX(${(1 - sp) * 26}px)`,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    fontFamily: FONT,
                    fontSize: 27,
                    color: C.ink2,
                  }}
                >
                  <span style={{ color: C.glow, fontSize: 26, flex: "0 0 auto" }}>✓</span>
                  {r}
                </div>
              );
            })}
          </div>

          {/* cost */}
          <div style={{ marginTop: 30, display: "flex", gap: 16, justifyContent: "center" }}>
            {["扣除 · 15 點", "對方也扣 · 15 點"].map((t, i) => (
              <span
                key={i}
                style={{
                  fontFamily: FONT,
                  fontSize: 24,
                  color: C.warn,
                  background: `${C.warn}1a`,
                  border: `1px solid ${C.warn}44`,
                  borderRadius: 999,
                  padding: "8px 20px",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </Device>
      <Caption
        kicker="雙向同意"
        lines={["看見，需要兩個人都點頭。"]}
        accent={C.ember}
        delay={6}
        bottom={120}
        size={42}
      />
    </AbsoluteFill>
  );
};

const PhotoCard: React.FC<{
  label: string;
  agreed: number;
  reveal: number;
  hue1: string;
  hue2: string;
  delay: number;
  frame: number;
  fps: number;
}> = ({ label, agreed, reveal, hue1, hue2, delay, frame, fps }) => {
  const sp = spring({ frame: frame - delay, fps, config: { damping: 200, stiffness: 120 } });
  const blur = interpolate(reveal, [0, 1], [26, 0]);
  const photoOpacity = interpolate(reveal, [0, 1], [0.25, 1]);
  return (
    <div
      style={{
        flex: 1,
        opacity: sp,
        transform: `translateY(${(1 - sp) * 30}px)`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3 / 4",
          borderRadius: 22,
          overflow: "hidden",
          border: `1.5px solid ${agreed > 0.9 ? hue2 + "aa" : C.line}`,
          boxShadow: agreed > 0.9 ? `0 0 34px ${hue2}40` : "none",
        }}
      >
        {/* portrait placeholder */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(120% 90% at 50% 28%, ${hue2}cc, ${hue1} 55%, ${C.bg2})`,
            filter: `blur(${blur}px)`,
            opacity: photoOpacity,
            transform: "scale(1.1)",
          }}
        />
        {/* silhouette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            fontSize: 150,
            opacity: interpolate(reveal, [0, 1], [0.15, 0.55]),
            filter: `blur(${blur * 0.4}px)`,
          }}
        >
          🌙
        </div>
        {reveal < 0.4 ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT,
              fontSize: 24,
              color: C.sub,
            }}
          >
            {agreed > 0.9 ? "等對方…" : ""}
          </div>
        ) : null}
        {/* label */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            fontFamily: FONT,
            fontSize: 24,
            fontWeight: 700,
            color: C.ink,
            background: "rgba(0,0,0,0.4)",
            borderRadius: 999,
            padding: "4px 16px",
          }}
        >
          {label}
        </div>
      </div>
      {/* agree button */}
      <div
        style={{
          marginTop: 14,
          borderRadius: 16,
          padding: "14px 0",
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 28,
          color: agreed > 0.5 ? C.bg : hue2,
          background: agreed > 0.5 ? hue2 : `${hue2}1a`,
          border: `1.5px solid ${hue2}88`,
          boxShadow: agreed > 0.5 ? `0 0 24px ${hue2}55` : "none",
          transition: "all .2s",
        }}
      >
        {agreed > 0.5 ? "我願意 ✓" : "我願意"}
      </div>
    </div>
  );
};
