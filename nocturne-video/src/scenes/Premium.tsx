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

const PERKS = [
  "「我也在」無限",
  "文字聊天無限",
  "語音房可開房 · 60 分鐘",
  "Premium glow 標籤",
];
const NEVER = [
  "看到對你說「我也在」的人是誰",
  "解鎖任何安全資訊",
  "單方面看到對方的臉",
  "看到更多人 / 看更遠",
];

export const Premium: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 22, durationInFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const head = spring({ frame: frame - 8, fps, config: { damping: 200, stiffness: 110 } });
  const shimmer = (frame % 120) / 120;

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Device accent={C.ember}>
        <div style={{ padding: "46px 40px 0", textAlign: "center" }}>
          {/* price card */}
          <div
            style={{
              opacity: head,
              transform: `translateY(${(1 - head) * 18}px)`,
              borderRadius: 28,
              padding: "30px 28px",
              background: `linear-gradient(135deg, ${C.ember}22, #c26bff1a)`,
              border: `1.5px solid ${C.ember}66`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: 160,
                left: `${-30 + shimmer * 130}%`,
                background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.18), transparent)",
                transform: "skewX(-18deg)",
              }}
            />
            <div style={{ fontFamily: FONT, fontSize: 34, fontWeight: 900, color: C.ink }}>夜行者 Premium</div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 10, marginTop: 12 }}>
              <span style={{ fontFamily: FONT, fontSize: 64, fontWeight: 900, color: C.ember }}>NT$149</span>
              <span style={{ fontFamily: FONT, fontSize: 28, color: C.sub }}>/ 月</span>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 23, color: C.sub, marginTop: 6 }}>首月優惠 · 可隨時取消</div>
          </div>

          {/* never */}
          <div
            style={{
              marginTop: 30,
              borderRadius: 24,
              border: `1.5px solid ${C.line}`,
              background: C.card2,
              padding: "24px 24px",
              textAlign: "left",
            }}
          >
            <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 800, color: C.ink, marginBottom: 18 }}>
              這些 <span style={{ color: C.danger }}>不是</span> Premium 換得到的
            </div>
            {NEVER.map((t, i) => {
              const sp = spring({ frame: frame - (40 + i * 14), fps, config: { damping: 200, stiffness: 130 } });
              return (
                <div
                  key={i}
                  style={{
                    opacity: sp,
                    transform: `translateX(${(1 - sp) * 26}px)`,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 14,
                    fontFamily: FONT,
                    fontSize: 27,
                    color: C.ink2,
                  }}
                >
                  <span style={{ color: C.danger, fontWeight: 900, fontSize: 26 }}>✕</span>
                  {t}
                </div>
              );
            })}
            <div style={{ fontFamily: FONT, fontSize: 22, color: C.sub, marginTop: 6, lineHeight: 1.4 }}>
              匿名與安全，是基本權利 — 不是付費功能。
            </div>
          </div>

          {/* points strip */}
          <div
            style={{
              marginTop: 24,
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {["點數 · 一次性儀式", "照片交換", "守夜者曝光", "限定語音房"].map((t, i) => (
              <span
                key={i}
                style={{
                  fontFamily: FONT,
                  fontSize: 22,
                  color: i === 0 ? C.warn : C.ink2,
                  background: i === 0 ? `${C.warn}1a` : C.card,
                  border: `1px solid ${i === 0 ? C.warn + "44" : C.line}`,
                  borderRadius: 999,
                  padding: "8px 18px",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </Device>
      <Caption
        kicker="夜行者 Premium"
        lines={["付費不是為了看更多人的臉，", "是為了在深夜裡更被看見。"]}
        accent={C.ember}
        delay={6}
        bottom={88}
        size={38}
      />
    </AbsoluteFill>
  );
};
