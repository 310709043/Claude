import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS, TOKENS } from "../design";

export type Caption = {
  start: number; // frame
  end: number; // frame
  zh: string;
  en: string;
};

type Props = {
  captions: Caption[];
  totalFrames: number;
  chapterStarts: number[];
};

export const CaptionBar: React.FC<Props> = ({ captions, totalFrames, chapterStarts }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const active = captions.find((c) => frame >= c.start && frame < c.end);
  const capOpacity = active
    ? interpolate(frame - active.start, [0, 8, active.end - active.start - 12, active.end - active.start], [0, 1, 1, 0], { extrapolateRight: "clamp" })
    : 0;

  const currentSec = Math.floor(frame / fps);
  const totalSec = Math.floor(totalFrames / fps);
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const progress = Math.min(1, frame / totalFrames);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        background: "rgba(249,247,247,0.85)",
        backdropFilter: "blur(20px)",
        borderTop: `1px solid ${TOKENS.border}`,
        display: "flex",
        alignItems: "center",
        padding: "0 60px",
        gap: 32,
        zIndex: 50,
      }}
    >
      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: TOKENS.border,
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${TOKENS.teal}, ${TOKENS.coral})`,
            transition: "width 80ms linear",
          }}
        />
        {/* Chapter dots */}
        {chapterStarts.map((cs, i) => {
          const pct = (cs / totalFrames) * 100;
          const past = frame >= cs;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${pct}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: past ? TOKENS.teal : TOKENS.card,
                border: `1.5px solid ${past ? TOKENS.teal : TOKENS.faint}`,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            />
          );
        })}
      </div>

      {/* Caption text */}
      <div
        style={{
          flex: 1,
          opacity: capOpacity,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.cnSans,
            fontSize: 18,
            color: TOKENS.navy,
            fontWeight: 600,
            letterSpacing: "0.02em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {active?.zh}
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 11,
            color: TOKENS.muted,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {active?.en}
        </div>
      </div>

      {/* Timer */}
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 13,
          color: TOKENS.muted,
          letterSpacing: "0.08em",
          fontWeight: 500,
          flexShrink: 0,
        }}
      >
        {fmt(currentSec)} <span style={{ opacity: 0.4 }}>/</span> {fmt(totalSec)}
      </div>
    </div>
  );
};
