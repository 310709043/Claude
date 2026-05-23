import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  random,
} from "remotion";
import { C } from "../theme";
import { FONT, MONO } from "../fonts";
import { Device } from "../components/Device";
import { Caption } from "../components/Caption";

const PEOPLE = [
  { id: "0892", x: 470, y: 360, color: C.s4, label: "想一起做點什麼" },
  { id: "0451", x: 200, y: 560, color: C.s2, label: "可以聊，不要約" },
  { id: "1284", x: 560, y: 720, color: C.s3, label: "想找人說話" },
  { id: "2207", x: 250, y: 300, color: C.s1, label: "在，但不想說話" },
  { id: "3380", x: 600, y: 540, color: C.s0, label: "只想一個人" },
  { id: "1099", x: 360, y: 820, color: C.s2, label: "可以聊，不要約" },
];

const CX = 380;
const CY = 560;

export const MapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 22, durationInFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ringPulse = (frame % 90) / 90; // 3s pulse
  const profile = spring({ frame: frame - 250, fps, config: { damping: 200, stiffness: 110, mass: 0.9 } });

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Device accent={C.glow} bob={false}>
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          {/* map base */}
          <svg width="100%" height="100%" viewBox="0 0 732 1434" style={{ position: "absolute", inset: 0 }}>
            <defs>
              <radialGradient id="mapfade" cx="52%" cy="42%" r="62%">
                <stop offset="0%" stopColor={C.bg3} />
                <stop offset="100%" stopColor={C.bg} />
              </radialGradient>
            </defs>
            <rect x={0} y={0} width={732} height={1434} fill="url(#mapfade)" />
            {/* streets */}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={120 + i * 150} x2={732} y2={120 + i * 150 + (random(`h${i}`) - 0.5) * 60} stroke={C.line} strokeWidth={2} />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={`v${i}`} x1={60 + i * 130} y1={0} x2={60 + i * 130 + (random(`v${i}`) - 0.5) * 60} y2={1434} stroke={C.line} strokeWidth={2} />
            ))}
            {/* distance rings */}
            {[0, 1, 2].map((i) => {
              const base = 150 + i * 150;
              const r = base + ringPulse * 150;
              const o = (1 - ringPulse) * 0.5;
              return <circle key={i} cx={CX} cy={CY} r={r} fill="none" stroke={C.glow} strokeWidth={2} opacity={o * 0.5} />;
            })}
            {[160, 320, 480].map((r, i) => (
              <circle key={`s${i}`} cx={CX} cy={CY} r={r} fill="none" stroke={C.line} strokeWidth={1.5} strokeDasharray="3 10" />
            ))}
          </svg>

          {/* people dots */}
          {PEOPLE.map((p, i) => {
            const d = 14 + i * 12;
            const s = spring({ frame: frame - d, fps, config: { damping: 200, stiffness: 140, mass: 0.6 } });
            const halo = 0.5 + 0.5 * Math.sin(frame / 18 + i);
            const focus = p.id === "0892";
            return (
              <div
                key={p.id}
                style={{
                  position: "absolute",
                  left: p.x,
                  top: p.y,
                  transform: `translate(-50%,-50%) scale(${s})`,
                  opacity: s,
                }}
              >
                <div
                  style={{
                    width: focus ? 30 : 22,
                    height: focus ? 30 : 22,
                    borderRadius: 999,
                    background: p.color,
                    boxShadow: `0 0 ${18 + halo * 18}px ${p.color}`,
                    border: "2px solid rgba(255,255,255,0.35)",
                  }}
                />
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 18,
                    color: p.color,
                    marginTop: 6,
                    textAlign: "center",
                    transform: "translateX(-50%)",
                    marginLeft: focus ? 15 : 11,
                    textShadow: "0 1px 6px rgba(0,0,0,0.8)",
                  }}
                >
                  #{p.id}
                </div>
              </div>
            );
          })}

          {/* you pin */}
          <div
            style={{
              position: "absolute",
              left: CX,
              top: CY,
              transform: "translate(-50%,-50%)",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 999,
                background: `radial-gradient(circle, ${C.ember}, ${C.ember}cc)`,
                boxShadow: `0 0 30px ${C.ember}`,
                border: "3px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1a0e04",
                fontWeight: 900,
                fontFamily: FONT,
                fontSize: 22,
              }}
            >
              你
            </div>
          </div>

          {/* mini profile for #0892 */}
          <div
            style={{
              position: "absolute",
              left: 30,
              right: 30,
              bottom: 30,
              transform: `translateY(${(1 - profile) * 60}px)`,
              opacity: profile,
              background: C.card2,
              border: `1.5px solid ${C.s4}66`,
              borderRadius: 26,
              padding: "22px 26px",
              backdropFilter: "blur(10px)",
              boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 40px ${C.s4}22`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ width: 14, height: 14, borderRadius: 999, background: C.s4, boxShadow: `0 0 14px ${C.s4}` }} />
              <span style={{ fontFamily: MONO, fontSize: 30, color: C.ink, fontWeight: 700 }}>#0892</span>
              <span style={{ fontFamily: FONT, fontSize: 24, color: C.s4, fontWeight: 600 }}>想一起做點什麼</span>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 24, color: C.sub, marginTop: 12, paddingLeft: 28 }}>
              女 · 25-34 · 信義區 · 距你 400m
            </div>
          </div>
        </div>
      </Device>
      <Caption
        kicker="今晚的地圖"
        lines={["看見此刻，誰也醒著。"]}
        accent={C.glow}
        delay={6}
        bottom={130}
        size={44}
      />
    </AbsoluteFill>
  );
};
