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

const STEPS = [
  { icon: "◍", title: "「我也在」", meta: "5 / 晚", color: C.s1, sub: "最輕的一聲招呼" },
  { icon: "💬", title: "文字聊天", meta: "40 / 140 字", color: C.s2, sub: "一段匿名的對話" },
  { icon: "🎙", title: "語音房", meta: "可聽 · 可說", color: C.s3, sub: "聽聽彼此的聲音" },
  { icon: "✦", title: "今晚的一句話", meta: "天亮消失", color: C.ember, sub: "附近的人看得到" },
];

export const Interact: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 22, durationInFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const head = spring({ frame: frame - 8, fps, config: { damping: 200, stiffness: 110 } });

  // ripple on the "我也在" row
  const ripple = (frame % 120) / 120;
  const noteIn = spring({ frame: frame - 260, fps, config: { damping: 200, stiffness: 110 } });
  const typed = "凌晨總是想得太多，但天亮就好了。";
  const chars = Math.floor(interpolate(frame, [285, 380], [0, typed.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Device accent={C.s2}>
        <div style={{ padding: "44px 40px 0" }}>
          <div style={{ opacity: head, transform: `translateY(${(1 - head) * 16}px)`, fontFamily: FONT }}>
            <div style={{ color: C.sub, fontSize: 26, fontWeight: 500 }}>不必馬上見面</div>
            <div style={{ color: C.ink, fontSize: 54, fontWeight: 900, marginTop: 4 }}>今晚，想怎麼開始？</div>
          </div>

          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 18 }}>
            {STEPS.map((s, i) => {
              const d = 28 + i * 16;
              const sp = spring({ frame: frame - d, fps, config: { damping: 200, stiffness: 130, mass: 0.7 } });
              const isFirst = i === 0;
              return (
                <div
                  key={i}
                  style={{
                    opacity: sp,
                    transform: `translateY(${(1 - sp) * 28}px)`,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    background: `linear-gradient(100deg, ${s.color}12, transparent 90%)`,
                    border: `1.5px solid ${isFirst ? s.color + "88" : C.line}`,
                    borderRadius: 22,
                    padding: "18px 22px",
                    overflow: "hidden",
                  }}
                >
                  {isFirst ? (
                    <span
                      style={{
                        position: "absolute",
                        left: 38,
                        top: "50%",
                        width: 200,
                        height: 200,
                        marginLeft: -100,
                        marginTop: -100,
                        borderRadius: 999,
                        border: `2px solid ${s.color}`,
                        opacity: (1 - ripple) * 0.6,
                        transform: `scale(${0.2 + ripple * 1.1})`,
                      }}
                    />
                  ) : null}
                  <span
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: `${s.color}22`,
                      border: `1px solid ${s.color}55`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 30,
                      flex: "0 0 auto",
                    }}
                  >
                    {s.icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: C.ink }}>{s.title}</div>
                    <div style={{ fontFamily: FONT, fontSize: 22, color: C.sub, marginTop: 2 }}>{s.sub}</div>
                  </div>
                  <span
                    style={{
                      fontFamily: FONT,
                      fontSize: 22,
                      color: s.color,
                      background: `${s.color}1a`,
                      border: `1px solid ${s.color}44`,
                      borderRadius: 999,
                      padding: "6px 16px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.meta}
                  </span>
                </div>
              );
            })}
          </div>

          {/* tonight's note input */}
          <div
            style={{
              marginTop: 26,
              opacity: noteIn,
              transform: `translateY(${(1 - noteIn) * 24}px)`,
              background: C.card2,
              border: `1.5px solid ${C.ember}44`,
              borderRadius: 22,
              padding: "22px 24px",
            }}
          >
            <div style={{ fontFamily: FONT, fontSize: 22, color: C.ember, fontWeight: 600, marginBottom: 12 }}>
              ✦ 今晚的一句話
            </div>
            <div style={{ fontFamily: FONT, fontSize: 30, color: C.ink, lineHeight: 1.4, minHeight: 44 }}>
              {typed.slice(0, chars)}
              <span style={{ opacity: Math.sin(frame / 5) > 0 ? 1 : 0, color: C.ember }}>｜</span>
            </div>
          </div>
        </div>
      </Device>
      <Caption
        kicker="輕量接觸"
        lines={["從一句「我也在」開始。", "沒有壓力。"]}
        accent={C.s2}
        delay={6}
        bottom={110}
        size={40}
      />
    </AbsoluteFill>
  );
};
