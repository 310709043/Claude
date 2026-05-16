import { ReactNode } from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { FONTS, TOKENS } from "../design";

type Props = {
  matchName: string;
  matchSubtitle?: string;
  children: ReactNode;
  tilt?: number;
  appearAt?: number;
  matchInitial?: string;
};

export const Phone: React.FC<Props> = ({
  matchName,
  matchSubtitle = "在線",
  children,
  tilt = -10,
  appearAt = 0,
  matchInitial = "M",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 18, stiffness: 70, mass: 1.2 },
    durationInFrames: 50,
  });
  const opacity = interpolate(frame - appearAt, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const enterY = (1 - progress) * 60;
  const enterScale = 0.85 + progress * 0.15;

  // Subtle idle float
  const idleT = (frame - appearAt) / fps;
  const floatY = Math.sin(idleT * 0.8) * 4;
  const floatRot = Math.sin(idleT * 0.5) * 0.6;

  return (
    <div
      style={{
        transform: `translateY(${enterY + floatY}px) scale(${enterScale}) rotateY(${tilt + floatRot}deg) rotateX(4deg)`,
        transformStyle: "preserve-3d",
        opacity,
        filter: "drop-shadow(0 50px 60px rgba(17,45,78,0.25))",
      }}
    >
      {/* Phone frame */}
      <div
        style={{
          width: 380,
          height: 760,
          borderRadius: 48,
          background: "linear-gradient(145deg, #1f2937 0%, #0f1722 100%)",
          padding: 10,
          boxShadow:
            "inset 0 0 0 2px rgba(255,255,255,0.06), 0 0 0 1px rgba(255,255,255,0.04)",
          position: "relative",
        }}
      >
        {/* Screen */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 40,
            background: TOKENS.card,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Notch */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
              width: 110,
              height: 28,
              background: "#0f1722",
              borderRadius: 14,
              zIndex: 5,
            }}
          />

          {/* Status bar */}
          <div
            style={{
              padding: "16px 28px 6px",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: FONTS.mono,
              fontSize: 12,
              color: TOKENS.navy,
              fontWeight: 600,
            }}
          >
            <span>9:41</span>
            <span style={{ opacity: 0 }}>•</span>
            <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <span style={{ fontSize: 11 }}>●●●●</span>
            </span>
          </div>

          {/* Chat header */}
          <div
            style={{
              padding: "12px 18px 14px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderBottom: `1px solid ${TOKENS.border}`,
              background: TOKENS.card,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${TOKENS.coral}, #f0a78e)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontFamily: FONTS.serif,
                fontSize: 18,
                fontWeight: 500,
              }}
            >
              {matchInitial}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: FONTS.cnSans,
                  fontSize: 15,
                  fontWeight: 600,
                  color: TOKENS.navy,
                  lineHeight: 1.2,
                }}
              >
                {matchName}
              </div>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 10,
                  color: TOKENS.teal,
                  marginTop: 2,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                ● {matchSubtitle}
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div
            style={{
              flex: 1,
              padding: "18px 16px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              background: `linear-gradient(180deg, ${TOKENS.bg} 0%, #ffffff 100%)`,
            }}
          >
            {children}
          </div>

          {/* Input bar */}
          <div
            style={{
              padding: "10px 14px",
              borderTop: `1px solid ${TOKENS.border}`,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                flex: 1,
                background: TOKENS.bg2,
                borderRadius: 18,
                padding: "8px 14px",
                fontFamily: FONTS.cnSans,
                fontSize: 12,
                color: TOKENS.faint,
              }}
            >
              訊息⋯
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: TOKENS.teal,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              ➤
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
