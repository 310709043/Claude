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

const GUARD = [
  { k: "緊急聯絡人", v: "媽媽 · 已連結", icon: "👤" },
  { k: "見面地點", v: "信義區 · 7-11 門口", icon: "📍" },
  { k: "預計返回時間", v: "今晚 04:30", icon: "🕓" },
  { k: "最後位置", v: "03:14 · 信義路五段", icon: "🛰" },
];

export const Safety: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 22, durationInFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const head = spring({ frame: frame - 8, fps, config: { damping: 200, stiffness: 110 } });

  // long-press 1.5s fills 200..245, then notified
  const press = interpolate(frame, [205, 250], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const notified = frame > 255;
  const safe = frame > 360;

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Device accent={C.danger}>
        <div style={{ padding: "46px 40px 0" }}>
          <div style={{ opacity: head, transform: `translateY(${(1 - head) * 16}px)`, fontFamily: FONT }}>
            <div style={{ color: C.glow, fontSize: 26, fontWeight: 700, letterSpacing: 2 }}>安全守護 · 已開啟</div>
            <div style={{ color: C.ink, fontSize: 52, fontWeight: 900, marginTop: 8 }}>見面時，有人守著你</div>
          </div>

          {/* guardian rows */}
          <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 14 }}>
            {GUARD.map((g, i) => {
              const sp = spring({ frame: frame - (28 + i * 14), fps, config: { damping: 200, stiffness: 130 } });
              return (
                <div
                  key={i}
                  style={{
                    opacity: sp,
                    transform: `translateX(${(1 - sp) * 28}px)`,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    background: C.card2,
                    border: `1px solid ${C.line}`,
                    borderRadius: 18,
                    padding: "16px 20px",
                  }}
                >
                  <span style={{ fontSize: 30, width: 44, textAlign: "center", flex: "0 0 auto" }}>{g.icon}</span>
                  <span style={{ fontFamily: FONT, fontSize: 28, color: C.sub, flex: "0 0 auto", width: 220 }}>{g.k}</span>
                  <span style={{ fontFamily: FONT, fontSize: 28, color: C.ink, fontWeight: 600 }}>{g.v}</span>
                </div>
              );
            })}
          </div>

          {/* SOS */}
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>
            {!notified ? (
              <>
                <div
                  style={{
                    position: "relative",
                    width: 300,
                    height: 300,
                    borderRadius: 999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width={300} height={300} style={{ position: "absolute", inset: 0 }}>
                    <circle cx={150} cy={150} r={140} fill="none" stroke={`${C.danger}33`} strokeWidth={10} />
                    <circle
                      cx={150}
                      cy={150}
                      r={140}
                      fill="none"
                      stroke={C.danger}
                      strokeWidth={10}
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 140}
                      strokeDashoffset={2 * Math.PI * 140 * (1 - press)}
                      transform="rotate(-90 150 150)"
                      style={{ filter: `drop-shadow(0 0 12px ${C.danger})` }}
                    />
                  </svg>
                  <div
                    style={{
                      width: 230,
                      height: 230,
                      borderRadius: 999,
                      background: `radial-gradient(circle, ${C.danger}, #c0303f)`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      boxShadow: `0 0 ${40 + press * 40}px ${C.danger}aa`,
                      transform: `scale(${1 + press * 0.05})`,
                    }}
                  >
                    <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56 }}>SOS</span>
                    <span style={{ fontFamily: FONT, fontSize: 24, marginTop: 6, opacity: 0.9 }}>通知緊急聯絡人</span>
                  </div>
                </div>
                <div style={{ marginTop: 18, fontFamily: FONT, fontSize: 26, color: C.sub }}>
                  長按 1.5 秒以防誤觸
                </div>
              </>
            ) : (
              <div
                style={{
                  width: "100%",
                  borderRadius: 24,
                  border: `1.5px solid ${safe ? C.glow : C.danger}66`,
                  background: `${safe ? C.glow : C.danger}14`,
                  padding: "30px 26px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 64 }}>{safe ? "🏠" : "✓"}</div>
                <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 900, color: C.ink, marginTop: 10 }}>
                  {safe ? "平安回家" : "已通知緊急聯絡人"}
                </div>
                <div style={{ fontFamily: FONT, fontSize: 26, color: C.sub, marginTop: 12, lineHeight: 1.5 }}>
                  {safe ? "位置紀錄已從伺服器刪除。" : "已記錄目前精確位置 · 已備份對話"}
                </div>
                <div style={{ marginTop: 18, display: "flex", gap: 14, justifyContent: "center" }}>
                  {["110 警察", "119 消防", "113 保護"].map((t) => (
                    <span key={t} style={{ fontFamily: MONO, fontSize: 22, color: C.danger, border: `1px solid ${C.danger}55`, borderRadius: 999, padding: "6px 16px" }}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Device>
      <Caption
        kicker="安全"
        lines={["見面前、見面時、見面後，", "都有人守著你。"]}
        accent={C.danger}
        delay={6}
        bottom={96}
        size={38}
      />
    </AbsoluteFill>
  );
};
