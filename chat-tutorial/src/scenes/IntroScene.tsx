import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS, TOKENS } from "../design";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kickerOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const kickerY = (1 - spring({ frame, fps, durationInFrames: 30 })) * 20;

  const titleOp = interpolate(frame, [12, 36], [0, 1], { extrapolateRight: "clamp" });
  const titleY = (1 - spring({ frame: frame - 12, fps, durationInFrames: 40 })) * 30;

  const enTitleOp = interpolate(frame, [28, 52], [0, 1], { extrapolateRight: "clamp" });
  const enTitleY = (1 - spring({ frame: frame - 28, fps, durationInFrames: 40 })) * 24;

  const lineOp = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [40, 75], [0, 280], { extrapolateRight: "clamp" });

  const noteOp = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" });

  // Floating chat bubble decorations
  const t = frame / fps;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, ${TOKENS.bg} 0%, ${TOKENS.bg2} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative floating bubbles in 3D */}
      <div style={{ position: "absolute", inset: 0, perspective: 1800 }}>
        {[
          { x: 12, y: 18, size: 70, color: TOKENS.tealStrong, delay: 0, depth: -200 },
          { x: 82, y: 22, size: 95, color: TOKENS.coralStrong, delay: 0.5, depth: -300 },
          { x: 18, y: 75, size: 110, color: TOKENS.tealSoft, delay: 1, depth: -150 },
          { x: 85, y: 78, size: 80, color: TOKENS.coralSoft, delay: 1.5, depth: -250 },
          { x: 50, y: 12, size: 50, color: TOKENS.tealStrong, delay: 2, depth: -180 },
        ].map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: b.size,
              height: b.size,
              borderRadius: "50%",
              background: b.color,
              transform: `translateZ(${b.depth}px) translateY(${Math.sin((t + b.delay) * 0.8) * 12}px)`,
              filter: "blur(2px)",
              opacity: interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
            }}
          />
        ))}
      </div>

      {/* Center content */}
      <div
        style={{
          textAlign: "center",
          maxWidth: 1100,
          padding: "0 80px",
          zIndex: 2,
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
            transform: `translateY(${kickerY}px)`,
            marginBottom: 40,
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ width: 24, height: 1, background: TOKENS.teal, display: "inline-block" }} />
          A FIELD GUIDE
          <span style={{ width: 24, height: 1, background: TOKENS.teal, display: "inline-block" }} />
        </div>

        {/* Main title - Chinese */}
        <div
          style={{
            fontFamily: FONTS.cnSerif,
            fontSize: 148,
            color: TOKENS.navy,
            fontWeight: 400,
            lineHeight: 1.0,
            letterSpacing: "0.04em",
            opacity: titleOp,
            transform: `translateY(${titleY}px)`,
            marginBottom: 32,
            whiteSpace: "nowrap",
          }}
        >
          交友軟體<span style={{ color: TOKENS.coral, fontStyle: "italic", letterSpacing: "0.06em", marginLeft: 28 }}>聊天指南</span>
        </div>

        {/* Title - English */}
        <div
          style={{
            fontFamily: FONTS.serif,
            fontSize: 38,
            color: TOKENS.muted,
            fontWeight: 400,
            fontStyle: "italic",
            opacity: enTitleOp,
            transform: `translateY(${enTitleY}px)`,
            marginBottom: 30,
          }}
        >
          How to Actually Talk on Dating Apps
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 30,
            opacity: lineOp,
          }}
        >
          <div
            style={{
              width: lineW,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${TOKENS.teal} 30%, ${TOKENS.coral} 70%, transparent)`,
            }}
          />
        </div>

        {/* Note */}
        <div
          style={{
            fontFamily: FONTS.cnSans,
            fontSize: 22,
            color: TOKENS.muted,
            opacity: noteOp,
            letterSpacing: "0.05em",
            fontWeight: 400,
          }}
        >
          六個技巧 · 從滑到配對，從配對到約會
        </div>
      </div>
    </div>
  );
};
