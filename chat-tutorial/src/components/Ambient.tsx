import { useCurrentFrame, useVideoConfig } from "remotion";
import { TOKENS } from "../design";

const PARTICLES = Array.from({ length: 24 }).map((_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const rnd = seed / 233280;
  const seed2 = (i * 1234567) % 9999;
  const rnd2 = (seed2 % 1000) / 1000;
  return {
    x: rnd * 100,
    y: rnd2 * 100,
    size: 2 + (rnd * 5),
    drift: 30 + rnd2 * 80,
    delay: rnd * 6,
    opacity: 0.12 + rnd * 0.18,
    isCoral: i % 4 === 0,
  };
});

export const Ambient: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Large blurred background shapes */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${TOKENS.tealStrong}, transparent 70%)`,
          filter: "blur(60px)",
          top: `${20 + Math.sin(t * 0.2) * 8}%`,
          left: `${-15 + Math.cos(t * 0.15) * 6}%`,
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${TOKENS.coralStrong}, transparent 70%)`,
          filter: "blur(70px)",
          bottom: `${10 + Math.cos(t * 0.18) * 6}%`,
          right: `${-10 + Math.sin(t * 0.22) * 5}%`,
          opacity: 0.6,
        }}
      />

      {/* Floating particles */}
      {PARTICLES.map((p, i) => {
        const y = p.y + Math.sin((t + p.delay) * 0.6) * 3;
        const x = p.x + Math.cos((t + p.delay) * 0.4) * 2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.isCoral ? TOKENS.coral : TOKENS.teal,
              opacity: p.opacity,
              filter: "blur(0.5px)",
            }}
          />
        );
      })}
    </div>
  );
};
