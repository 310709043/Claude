import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS, TOKENS } from "../design";
import { SceneFrame, Highlight } from "../components/SceneFrame";

type Beat = {
  label: string;
  desc: string;
  isYou: boolean;
  delay: number;
};

const BEATS: Beat[] = [
  { label: "14:02", desc: "你發訊息", isYou: true, delay: 30 },
  { label: "14:18", desc: "對方回覆", isYou: false, delay: 50 },
  { label: "14:24", desc: "你回應", isYou: true, delay: 70 },
  { label: "15:10", desc: "對方回覆", isYou: false, delay: 90 },
  { label: "15:15", desc: "你回應", isYou: true, delay: 110 },
];

export const Scene5_Rhythm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineOp = interpolate(frame, [20, 60], [0, 1], { extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [20, 80], [0, 100], { extrapolateRight: "clamp" });

  return (
    <SceneFrame
      subtitle="05 · Match the Tempo"
      title={
        <>
          回覆的<br /><Highlight>節奏感</Highlight>
        </>
      }
      note="對方花十分鐘想的訊息，別用三十秒丟回去；對方剛回完，也別讓他等三天。讓節奏自然鏡像彼此。"
    >
      <div
        style={{
          width: "100%",
          maxWidth: 620,
          height: 500,
          position: "relative",
          perspective: 1800,
        }}
      >
        {/* Center axis line */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 40,
            bottom: 40,
            width: 2,
            transform: "translateX(-50%)",
            background: `linear-gradient(180deg, transparent, ${TOKENS.faint} 10%, ${TOKENS.faint} 90%, transparent)`,
            opacity: lineOp,
          }}
        />

        {/* Top label */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            fontFamily: FONTS.mono,
            fontSize: 11,
            color: TOKENS.faint,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            opacity: lineOp,
          }}
        >
          <span>You</span>
          <span>Them</span>
        </div>

        {/* Beats */}
        {BEATS.map((beat, i) => {
          const top = 50 + i * 80;
          const op = interpolate(frame, [beat.delay, beat.delay + 15], [0, 1], { extrapolateRight: "clamp" });
          const progress = spring({ frame: frame - beat.delay, fps, config: { damping: 16, stiffness: 100 }, durationInFrames: 25 });
          const dx = (1 - progress) * (beat.isYou ? -40 : 40);

          return (
            <div key={i} style={{ position: "absolute", top, left: 0, right: 0, opacity: op }}>
              {/* Dot on axis */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: beat.isYou ? TOKENS.teal : TOKENS.coral,
                  boxShadow: `0 0 0 6px ${beat.isYou ? TOKENS.tealSoft : TOKENS.coralSoft}`,
                  zIndex: 2,
                }}
              />

              {/* Connecting line to card */}
              <div
                style={{
                  position: "absolute",
                  left: beat.isYou ? "auto" : "50%",
                  right: beat.isYou ? "50%" : "auto",
                  top: "50%",
                  width: 50,
                  height: 1,
                  background: TOKENS.faint,
                  transform: "translateY(-50%)",
                  opacity: 0.7,
                }}
              />

              {/* Card */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: beat.isYou ? "auto" : "calc(50% + 60px)",
                  right: beat.isYou ? "calc(50% + 60px)" : "auto",
                  transform: `translateY(-50%) translateX(${dx}px)`,
                  background: TOKENS.card,
                  borderRadius: 12,
                  padding: "10px 16px",
                  boxShadow: TOKENS.shadow,
                  border: `1px solid ${TOKENS.border}`,
                  minWidth: 180,
                  textAlign: beat.isYou ? "right" : "left",
                }}
              >
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 11,
                    color: beat.isYou ? TOKENS.teal : TOKENS.coral,
                    letterSpacing: "0.15em",
                    fontWeight: 600,
                  }}
                >
                  {beat.label}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.cnSans,
                    fontSize: 15,
                    color: TOKENS.navy,
                    fontWeight: 500,
                    marginTop: 2,
                  }}
                >
                  {beat.desc}
                </div>
              </div>
            </div>
          );
        })}

        {/* Bottom rule */}
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: FONTS.mono,
            fontSize: 11,
            color: TOKENS.muted,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: interpolate(frame, [120, 150], [0, 1], { extrapolateRight: "clamp" }),
            width: `${lineW}%`,
            textAlign: "center",
            maxWidth: 400,
          }}
        >
          鏡像對方的節奏 · Mirror the cadence
        </div>
      </div>
    </SceneFrame>
  );
};
