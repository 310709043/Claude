import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { FONTS, TOKENS } from "../design";

type Props = {
  text: string;
  side: "left" | "right";
  appearAt: number;
  time?: string;
  highlight?: boolean;
  strikethrough?: boolean;
  fontSize?: number;
};

export const Bubble: React.FC<Props> = ({
  text,
  side,
  appearAt,
  time,
  highlight,
  strikethrough,
  fontSize = 17,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < appearAt) return null;

  const progress = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 16, stiffness: 110, mass: 0.7 },
    durationInFrames: 22,
  });
  const opacity = interpolate(frame - appearAt, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const dy = (1 - progress) * 12;
  const dx = (1 - progress) * (side === "right" ? 20 : -20);

  const isRight = side === "right";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isRight ? "flex-end" : "flex-start",
        marginBottom: 10,
        transform: `translate(${dx}px, ${dy}px)`,
        opacity,
      }}
    >
      <div
        style={{
          maxWidth: "82%",
          display: "flex",
          flexDirection: "column",
          alignItems: isRight ? "flex-end" : "flex-start",
        }}
      >
        <div
          style={{
            background: isRight
              ? `linear-gradient(135deg, ${TOKENS.teal} 0%, #4f86c7 100%)`
              : TOKENS.bg2,
            color: isRight ? "#fff" : TOKENS.navy,
            padding: "10px 14px",
            borderRadius: isRight ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            fontSize,
            fontFamily: FONTS.cnSans,
            lineHeight: 1.45,
            fontWeight: 400,
            boxShadow: isRight
              ? "0 6px 18px rgba(63,114,175,0.35)"
              : "0 4px 12px rgba(17,45,78,0.08)",
            border: highlight ? `2px solid ${TOKENS.coral}` : "none",
            position: "relative",
            textDecoration: strikethrough ? "line-through" : "none",
            opacity: strikethrough ? 0.55 : 1,
          }}
        >
          {text}
          {highlight && (
            <div
              style={{
                position: "absolute",
                top: -10,
                right: isRight ? "auto" : -8,
                left: isRight ? -8 : "auto",
                background: TOKENS.coral,
                color: "#fff",
                fontSize: 10,
                fontFamily: FONTS.mono,
                padding: "2px 8px",
                borderRadius: 10,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              ✨
            </div>
          )}
        </div>
        {time && (
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 10,
              color: TOKENS.faint,
              marginTop: 4,
              letterSpacing: "0.1em",
            }}
          >
            {time}
          </div>
        )}
      </div>
    </div>
  );
};
