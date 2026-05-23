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
import { Ring } from "../components/ui";

const ITEMS = [
  { title: "手機號碼", sub: "只用來驗證，不會公開", done: 120 },
  { title: "真人臉部活體驗證", sub: "不會公開照片", done: 200 },
  { title: "選一個常出沒區域", sub: "信義 · 公館 · 西門", done: 250 },
];

export const Verify: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 22, durationInFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const head = spring({ frame: frame - 8, fps, config: { damping: 200, stiffness: 110 } });
  const prog = interpolate(frame, [40, 250], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scanY = interpolate((frame % 70) / 70, [0, 1], [-60, 60]);

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Device accent={C.glow}>
        <div style={{ padding: "48px 44px 0", textAlign: "center" }}>
          <div style={{ opacity: head, transform: `translateY(${(1 - head) * 16}px)`, fontFamily: FONT }}>
            <div style={{ color: C.ink, fontSize: 50, fontWeight: 900, lineHeight: 1.3 }}>
              先確認你是真人。
            </div>
            <div style={{ color: C.sub, fontSize: 26, fontWeight: 500, marginTop: 12 }}>
              為了大家的安全，這一步要驗證一下
            </div>
          </div>

          {/* face scan */}
          <div style={{ marginTop: 40, display: "flex", justifyContent: "center", position: "relative" }}>
            <div style={{ position: "relative", width: 240, height: 240 }}>
              <Ring p={prog} size={240} color={C.glow} stroke={6} />
              <div
                style={{
                  position: "absolute",
                  inset: 30,
                  borderRadius: 999,
                  overflow: "hidden",
                  background: `radial-gradient(circle, ${C.bg3}, ${C.bg2})`,
                  border: `1px solid ${C.line}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 90, opacity: 0.5 }}>🌙</span>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: "50%",
                    height: 3,
                    transform: `translateY(${scanY}px)`,
                    background: C.glow,
                    boxShadow: `0 0 16px ${C.glow}`,
                    opacity: prog < 1 ? 0.9 : 0,
                  }}
                />
              </div>
              {prog >= 1 ? (
                <div
                  style={{
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                    width: 60,
                    height: 60,
                    borderRadius: 999,
                    background: C.glow,
                    color: C.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 36,
                    fontWeight: 900,
                    boxShadow: `0 0 24px ${C.glow}`,
                  }}
                >
                  ✓
                </div>
              ) : null}
            </div>
          </div>

          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 16, textAlign: "left" }}>
            {ITEMS.map((it, i) => {
              const sp = spring({ frame: frame - (30 + i * 16), fps, config: { damping: 200, stiffness: 130 } });
              const done = frame > it.done;
              return (
                <div
                  key={i}
                  style={{
                    opacity: sp,
                    transform: `translateX(${(1 - sp) * 30}px)`,
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    background: C.card2,
                    border: `1.5px solid ${done ? C.glow + "66" : C.line}`,
                    borderRadius: 20,
                    padding: "18px 22px",
                  }}
                >
                  <span
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 999,
                      flex: "0 0 auto",
                      background: done ? C.glow : "transparent",
                      border: `2px solid ${done ? C.glow : C.faint}`,
                      color: C.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 26,
                      fontWeight: 900,
                    }}
                  >
                    {done ? "✓" : ""}
                  </span>
                  <div>
                    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.ink }}>{it.title}</div>
                    <div style={{ fontFamily: FONT, fontSize: 22, color: C.sub, marginTop: 2 }}>{it.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Device>
      <Caption
        kicker="真人驗證"
        lines={["不公開你的長相、姓名、或號碼。", "只確認螢幕另一端是真人。"]}
        accent={C.glow}
        delay={6}
        bottom={96}
        size={38}
      />
    </AbsoluteFill>
  );
};
