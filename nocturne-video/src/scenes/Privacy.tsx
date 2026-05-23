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

const NO = ["你的真名", "精確 GPS 位置", "你的照片", "對話內容", "訊息歷史"];
const NO_SUB = ["驗證後即刪除", "只用區域", "P2P，不存伺服器", "端對端加密", "天亮自動刪除"];
const YES = ["手機號碼 hash", "常出沒區域", "檢舉紀錄"];
const YES_SUB = ["防止重複註冊", "顯示在地圖上", "聚合而非個案"];

export const Privacy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 22, durationInFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const head = spring({ frame: frame - 8, fps, config: { damping: 200, stiffness: 110 } });

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Device accent={C.glow}>
        <div style={{ padding: "48px 36px 0", textAlign: "center" }}>
          <div style={{ opacity: head, transform: `translateY(${(1 - head) * 16}px)`, fontFamily: FONT }}>
            <div style={{ color: C.glow, fontSize: 26, fontWeight: 700, letterSpacing: 2 }}>隱私與資料</div>
            <div style={{ color: C.ink, fontSize: 50, fontWeight: 900, marginTop: 8 }}>對你的資料，很嚴格</div>
          </div>

          <div style={{ marginTop: 38, display: "flex", gap: 18 }}>
            {/* don't collect */}
            <Column
              title="我們不收集"
              color={C.danger}
              items={NO}
              subs={NO_SUB}
              mark="✕"
              base={26}
              frame={frame}
              fps={fps}
            />
            {/* keep */}
            <Column
              title="我們會保留"
              color={C.glow}
              items={YES}
              subs={YES_SUB}
              mark="✓"
              base={36}
              frame={frame}
              fps={fps}
            />
          </div>

          <div
            style={{
              marginTop: 36,
              fontFamily: FONT,
              fontSize: 38,
              fontWeight: 700,
              color: C.ink,
            }}
          >
            天亮，<span style={{ color: C.glow }}>一切自動消失。</span>
          </div>
        </div>
      </Device>
      <Caption
        kicker="承諾"
        lines={["你今晚是誰，不會被留下。"]}
        accent={C.glow}
        delay={6}
        bottom={130}
        size={42}
      />
    </AbsoluteFill>
  );
};

const Column: React.FC<{
  title: string;
  color: string;
  items: readonly string[];
  subs: readonly string[];
  mark: string;
  base: number;
  frame: number;
  fps: number;
}> = ({ title, color, items, subs, mark, base, frame, fps }) => (
  <div
    style={{
      flex: 1,
      background: `${color}0e`,
      border: `1.5px solid ${color}44`,
      borderRadius: 24,
      padding: "22px 20px",
      textAlign: "left",
    }}
  >
    <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 800, color, marginBottom: 18 }}>{title}</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {items.map((it, i) => {
        const sp = spring({ frame: frame - (base + i * 12), fps, config: { damping: 200, stiffness: 140 } });
        return (
          <div key={i} style={{ opacity: sp, transform: `translateY(${(1 - sp) * 18}px)`, display: "flex", gap: 12 }}>
            <span style={{ color, fontSize: 26, fontWeight: 900, flex: "0 0 auto", lineHeight: 1.3 }}>{mark}</span>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 28, color: C.ink, fontWeight: 600, lineHeight: 1.25 }}>{it}</div>
              <div style={{ fontFamily: FONT, fontSize: 20, color: C.sub, marginTop: 2 }}>{subs[i]}</div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
