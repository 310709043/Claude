import { ReactNode } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS, TOKENS } from "../design";

type Props = {
  subtitle: string;
  title: ReactNode;
  note?: string;
  children: ReactNode;
  align?: "left" | "right" | "center";
};

export const SceneFrame: React.FC<Props> = ({
  subtitle,
  title,
  note,
  children,
  align = "left",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelProgress = spring({ frame, fps, config: { damping: 18, stiffness: 80 }, durationInFrames: 30 });
  const titleProgress = spring({ frame: frame - 10, fps, config: { damping: 18, stiffness: 70 }, durationInFrames: 35 });
  const noteProgress = spring({ frame: frame - 30, fps, config: { damping: 18, stiffness: 70 }, durationInFrames: 35 });

  const labelOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const titleOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });
  const noteOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });

  const textAlign = align === "center" ? "center" : align === "right" ? "right" : "left";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, ${TOKENS.bg} 0%, ${TOKENS.bg2} 100%)`,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        padding: "80px 100px",
        gap: 60,
      }}
    >
      {/* Left text column */}
      <div
        style={{
          flex: "0 0 42%",
          display: "flex",
          flexDirection: "column",
          textAlign,
          alignItems: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
          zIndex: 2,
        }}
      >
        {/* Subtitle / kicker */}
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 18,
            color: TOKENS.teal,
            textTransform: "uppercase",
            letterSpacing: "0.28em",
            fontWeight: 500,
            opacity: labelOpacity,
            transform: `translateY(${(1 - labelProgress) * 20}px)`,
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 32,
              height: 1,
              background: TOKENS.teal,
            }}
          />
          {subtitle}
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: FONTS.cnSerif,
            fontSize: 84,
            color: TOKENS.navy,
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            opacity: titleOpacity,
            transform: `translateY(${(1 - titleProgress) * 30}px)`,
            marginBottom: 32,
          }}
        >
          {title}
        </div>

        {/* Note */}
        {note && (
          <div
            style={{
              fontFamily: FONTS.cnSans,
              fontSize: 22,
              color: TOKENS.muted,
              lineHeight: 1.55,
              maxWidth: 560,
              opacity: noteOpacity,
              transform: `translateY(${(1 - noteProgress) * 20}px)`,
              fontWeight: 400,
            }}
          >
            {note}
          </div>
        )}
      </div>

      {/* Right visual area */}
      <div
        style={{
          flex: 1,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          perspective: 1800,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const Highlight: React.FC<{ children: ReactNode; color?: "teal" | "coral" }> = ({
  children,
  color = "teal",
}) => (
  <span
    style={{
      color: color === "coral" ? TOKENS.coral : TOKENS.teal,
      fontStyle: "italic",
    }}
  >
    {children}
  </span>
);
