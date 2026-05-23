import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";
import { FONT } from "../fonts";

// Kinetic lower-third caption: a small kicker label + a headline that rises in
// line by line. Used as an overlay on top of scene content.
export const Caption: React.FC<{
  kicker?: string;
  lines: string[];
  accent?: string;
  delay?: number;
  bottom?: number;
  align?: "left" | "center";
  size?: number;
}> = ({
  kicker,
  lines,
  accent = C.ember,
  delay = 0,
  bottom = 150,
  align = "center",
  size = 50,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom,
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        padding: align === "center" ? "0 90px" : "0 110px",
        gap: 14,
        fontFamily: FONT,
        textAlign: align,
        zIndex: 80,
      }}
    >
      {kicker ? (
        <Kicker frame={frame} fps={fps} delay={delay} accent={accent} text={kicker} />
      ) : null}
      {lines.map((ln, i) => {
        const d = delay + 6 + i * 7;
        const s = spring({
          frame: frame - d,
          fps,
          config: { damping: 200, mass: 0.7, stiffness: 130 },
        });
        return (
          <div
            key={i}
            style={{
              opacity: s,
              transform: `translateY(${(1 - s) * 26}px)`,
              fontSize: size,
              lineHeight: 1.32,
              fontWeight: 700,
              color: C.ink,
              letterSpacing: 0.5,
              textShadow: "0 4px 24px rgba(0,0,0,0.6)",
            }}
          >
            {ln}
          </div>
        );
      })}
    </div>
  );
};

const Kicker: React.FC<{
  frame: number;
  fps: number;
  delay: number;
  accent: string;
  text: string;
}> = ({ frame, fps, delay, accent, text }) => {
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, mass: 0.6, stiffness: 140 },
  });
  const w = interpolate(s, [0, 1], [0, 46]);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity: s,
        transform: `translateY(${(1 - s) * 16}px)`,
      }}
    >
      <span
        style={{
          width: w,
          height: 3,
          borderRadius: 2,
          background: accent,
          boxShadow: `0 0 12px ${accent}`,
        }}
      />
      <span
        style={{
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: 6,
          color: accent,
        }}
      >
        {text}
      </span>
    </div>
  );
};
