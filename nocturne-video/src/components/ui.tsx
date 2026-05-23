import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE } from "../theme";
import { FONT, MONO } from "../fonts";

// Spring-in helper returning {opacity, translateY, scale}
export const useRise = (delay = 0, dist = 36) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, mass: 0.9, stiffness: 120 },
  });
  return {
    opacity: s,
    transform: `translateY(${(1 - s) * dist}px)`,
  };
};

export const fadeInOut = (
  frame: number,
  inEnd: number,
  outStart: number,
  outEnd: number
) =>
  interpolate(
    frame,
    [0, inEnd, outStart, outEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

export const Pill: React.FC<{
  color: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ color, children, style }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 18px",
      borderRadius: 999,
      fontSize: 24,
      fontWeight: 500,
      color,
      background: `${color}1f`,
      border: `1px solid ${color}55`,
      fontFamily: FONT,
      ...style,
    }}
  >
    <span
      style={{
        width: 11,
        height: 11,
        borderRadius: 999,
        background: color,
        boxShadow: `0 0 14px ${color}`,
      }}
    />
    {children}
  </span>
);

export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  glow?: string;
}> = ({ children, style, glow }) => (
  <div
    style={{
      background: C.card2,
      border: `1px solid ${C.cardB}`,
      borderRadius: 28,
      padding: 28,
      backdropFilter: "blur(8px)",
      boxShadow: glow
        ? `0 20px 60px rgba(0,0,0,0.45), 0 0 50px ${glow}22`
        : "0 18px 50px rgba(0,0,0,0.4)",
      fontFamily: FONT,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Mono: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <span style={{ fontFamily: MONO, letterSpacing: 1, ...style }}>{children}</span>
);

// progress ring 0..1
export const Ring: React.FC<{
  p: number;
  size?: number;
  color?: string;
  stroke?: number;
}> = ({ p, size = 120, color = C.glow, stroke = 8 }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={C.line}
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - p)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />
    </svg>
  );
};

export { C, EASE, FONT, MONO };
