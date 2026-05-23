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
import { Device } from "../components/Device";
import { Caption } from "../components/Caption";

const ENTRIES = [
  { d: "11/02", color: C.s4, t: "和 #0892 走了一段，沒怎麼說話，但很好" },
  { d: "11/07", color: C.s2, t: "和 #0451 聊了 40 分鐘，他講他剛分手的事" },
  { d: "11/12", color: C.ember, t: "收到 8 個「我也在」。世界不孤單。" },
  { d: "11/18", color: C.s3, t: "和 #1284 語音 12 分鐘 · 失戀的人懂失戀的人" },
  { d: "11/23", color: C.s1, t: "去 7-11 吃宵夜，凌晨三點的便利店其實很溫暖" },
];

export const Memory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 22, durationInFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const head = spring({ frame: frame - 8, fps, config: { damping: 200, stiffness: 110 } });

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Device accent={C.s3}>
        <div style={{ padding: "48px 40px 0" }}>
          <div style={{ opacity: head, transform: `translateY(${(1 - head) * 16}px)`, fontFamily: FONT }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
              <div style={{ color: C.ink, fontSize: 50, fontWeight: 900 }}>夜的紀念回憶冊</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12 }}>
              <span style={{ fontFamily: MONO, fontSize: 26, color: C.s3 }}>11 月 · 5 個夜晚</span>
              <span style={{ fontFamily: FONT, fontSize: 22, color: C.sub, border: `1px solid ${C.line}`, borderRadius: 999, padding: "4px 14px" }}>
                只有你看得到
              </span>
            </div>
          </div>

          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 18 }}>
            {ENTRIES.map((e, i) => {
              const sp = spring({ frame: frame - (26 + i * 16), fps, config: { damping: 200, stiffness: 130, mass: 0.7 } });
              return (
                <div
                  key={i}
                  style={{
                    opacity: sp,
                    transform: `translateY(${(1 - sp) * 26}px)`,
                    display: "flex",
                    gap: 18,
                    background: `linear-gradient(100deg, ${e.color}10, transparent 92%)`,
                    border: `1px solid ${C.line}`,
                    borderLeft: `3px solid ${e.color}`,
                    borderRadius: 18,
                    padding: "18px 22px",
                  }}
                >
                  <span style={{ fontFamily: MONO, fontSize: 24, color: e.color, flex: "0 0 auto", paddingTop: 4 }}>{e.d}</span>
                  <span style={{ fontFamily: FONT, fontSize: 30, color: C.ink2, lineHeight: 1.35 }}>{e.t}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Device>
      <Caption
        kicker="夜的紀念"
        lines={["每個夜晚，都被溫柔地留下。"]}
        accent={C.s3}
        delay={6}
        bottom={120}
        size={42}
      />
    </AbsoluteFill>
  );
};
