import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, TIERS } from "../theme";
import { FONT } from "../fonts";
import { Device } from "../components/Device";
import { Caption } from "../components/Caption";

export const Tiers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const head = spring({ frame: frame - 8, fps, config: { damping: 200, stiffness: 110, mass: 0.8 } });
  // selection sweeps to tier 4 ("想一起做點什麼") near the end
  const selected = frame > 300 ? 4 : -1;
  const out = interpolate(frame, [durationInFrames - 22, durationInFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Device accent={C.s4}>
        <div style={{ padding: "48px 44px 0" }}>
          <div
            style={{
              opacity: head,
              transform: `translateY(${(1 - head) * 18}px)`,
              fontFamily: FONT,
            }}
          >
            <div style={{ color: C.sub, fontSize: 28, fontWeight: 500 }}>現在的你，</div>
            <div style={{ color: C.ink, fontSize: 58, fontWeight: 900, marginTop: 4 }}>
              是哪一種？
            </div>
          </div>

          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 20 }}>
            {TIERS.map((t, i) => {
              const d = 26 + i * 14;
              const s = spring({ frame: frame - d, fps, config: { damping: 200, stiffness: 130, mass: 0.7 } });
              const isSel = selected === t.id;
              const selP = isSel
                ? spring({ frame: frame - 304, fps, config: { damping: 200, stiffness: 120 } })
                : 0;
              return (
                <div
                  key={t.id}
                  style={{
                    opacity: s,
                    transform: `translateX(${(1 - s) * 40}px) scale(${1 + selP * 0.02})`,
                    background: `linear-gradient(100deg, ${t.color}${isSel ? "26" : "12"}, transparent 88%)`,
                    border: `1.5px solid ${isSel ? t.color : C.line}`,
                    borderRadius: 22,
                    padding: "20px 22px",
                    boxShadow: isSel ? `0 0 38px ${t.color}40` : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 999,
                        background: t.color,
                        boxShadow: `0 0 16px ${t.color}`,
                        flex: "0 0 auto",
                      }}
                    />
                    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 36, color: C.ink }}>
                      {t.title}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontSize: 24,
                      color: C.sub,
                      marginTop: 8,
                      paddingLeft: 32,
                      lineHeight: 1.35,
                    }}
                  >
                    {t.rule}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Device>
      <Caption
        kicker="選擇你的狀態"
        lines={["先誠實選一個。", "別人看到你時，會知道該不該打擾你。"]}
        accent={C.s4}
        delay={6}
        bottom={120}
        size={40}
      />
    </AbsoluteFill>
  );
};
