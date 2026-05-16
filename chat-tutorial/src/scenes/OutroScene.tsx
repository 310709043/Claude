import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS, TOKENS } from "../design";

const STEPS = [
  { num: "01", zh: "別只說「嗨」", en: "Skip the lazy hi", color: "coral" as const },
  { num: "02", zh: "從檔案找線索", en: "Mine the profile", color: "teal" as const },
  { num: "03", zh: "問會引出故事的問題", en: "Ask for stories", color: "teal" as const },
  { num: "04", zh: "答完順手遞球", en: "Pass the ball back", color: "coral" as const },
  { num: "05", zh: "鏡像對方節奏", en: "Mirror the cadence", color: "teal" as const },
  { num: "06", zh: "把對話帶到現實", en: "Make the ask", color: "coral" as const },
];

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kickerOp = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const titleOp = interpolate(frame, [8, 30], [0, 1], { extrapolateRight: "clamp" });
  const titleY = (1 - spring({ frame: frame - 8, fps, durationInFrames: 35 })) * 30;

  const ctaOp = interpolate(frame, [140, 165], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, ${TOKENS.bg} 0%, ${TOKENS.bg2} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 100px",
        position: "relative",
      }}
    >
      {/* Kicker */}
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 16,
          color: TOKENS.teal,
          textTransform: "uppercase",
          letterSpacing: "0.4em",
          fontWeight: 500,
          opacity: kickerOp,
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span style={{ width: 24, height: 1, background: TOKENS.teal, display: "inline-block" }} />
        Recap
        <span style={{ width: 24, height: 1, background: TOKENS.teal, display: "inline-block" }} />
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: FONTS.cnSerif,
          fontSize: 76,
          color: TOKENS.navy,
          fontWeight: 400,
          letterSpacing: "-0.02em",
          textAlign: "center",
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
          marginBottom: 12,
          lineHeight: 1.1,
        }}
      >
        從滑到約 · <span style={{ color: TOKENS.coral, fontStyle: "italic" }}>六步</span>
      </div>
      <div
        style={{
          fontFamily: FONTS.serif,
          fontSize: 24,
          color: TOKENS.muted,
          fontStyle: "italic",
          opacity: titleOp,
          marginBottom: 56,
        }}
      >
        Six moves, swipe to date
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          maxWidth: 1100,
          width: "100%",
        }}
      >
        {STEPS.map((s, i) => {
          const delay = 30 + i * 12;
          const op = interpolate(frame, [delay, delay + 18], [0, 1], { extrapolateRight: "clamp" });
          const progress = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 90 }, durationInFrames: 30 });
          const dy = (1 - progress) * 24;
          const color = s.color === "coral" ? TOKENS.coral : TOKENS.teal;

          return (
            <div
              key={i}
              style={{
                background: TOKENS.card,
                borderRadius: 16,
                padding: "22px 24px",
                boxShadow: "0 10px 30px -10px rgba(17,45,78,0.12), 0 4px 10px rgba(17,45,78,0.04)",
                border: `1px solid ${TOKENS.border}`,
                opacity: op,
                transform: `translateY(${dy}px)`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Accent stripe */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 3,
                  height: "100%",
                  background: color,
                }}
              />

              <div
                style={{
                  fontFamily: FONTS.serif,
                  fontSize: 36,
                  color,
                  fontStyle: "italic",
                  fontWeight: 400,
                  lineHeight: 1,
                  marginBottom: 14,
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontFamily: FONTS.cnSerif,
                  fontSize: 22,
                  color: TOKENS.navy,
                  fontWeight: 500,
                  lineHeight: 1.3,
                  marginBottom: 6,
                }}
              >
                {s.zh}
              </div>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  color: TOKENS.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                {s.en}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: 56,
          fontFamily: FONTS.serif,
          fontSize: 28,
          fontStyle: "italic",
          color: TOKENS.navy,
          opacity: ctaOp,
          textAlign: "center",
        }}
      >
        現在 — 打開 app，
        <span style={{ color: TOKENS.coral }}>傳出那則訊息</span>
      </div>
    </div>
  );
};
