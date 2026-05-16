import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS, TOKENS } from "../design";
import { SceneFrame, Highlight } from "../components/SceneFrame";

type Card = {
  label: string;
  bad: string;
  good: string;
  delay: number;
};

const CARDS: Card[] = [
  {
    label: "音樂",
    bad: "你喜歡音樂嗎？",
    good: "什麼歌最近聽到會循環播放？",
    delay: 30,
  },
  {
    label: "旅行",
    bad: "你常出國嗎？",
    good: "去過最不想再回去的地方是？",
    delay: 65,
  },
  {
    label: "週末",
    bad: "週末有空嗎？",
    good: "理想週末的早上九點在做什麼？",
    delay: 100,
  },
];

export const Scene3_OpenQuestions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame
      subtitle="03 · Open the Door"
      title={
        <>
          問<br /><Highlight>會引出故事</Highlight>的問題
        </>
      }
      note="是非題只能回答「對」或「不對」。把它換成需要描述、需要回憶的問題，對方才會願意說下去。"
    >
      <div
        style={{
          width: "100%",
          maxWidth: 620,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          perspective: 1800,
        }}
      >
        {CARDS.map((card, i) => {
          const op = interpolate(frame, [card.delay, card.delay + 20], [0, 1], { extrapolateRight: "clamp" });
          const progress = spring({ frame: frame - card.delay, fps, config: { damping: 18, stiffness: 80 }, durationInFrames: 40 });
          const dx = (1 - progress) * 60;

          return (
            <div
              key={i}
              style={{
                background: TOKENS.card,
                borderRadius: 18,
                padding: "20px 26px",
                boxShadow: "0 20px 50px -20px rgba(17,45,78,0.18), 0 6px 16px rgba(17,45,78,0.06)",
                border: `1px solid ${TOKENS.border}`,
                opacity: op,
                transform: `translateX(${dx}px) rotateY(${-6 + i * 2}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Label */}
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  color: TOKENS.teal,
                  textTransform: "uppercase",
                  letterSpacing: "0.25em",
                  fontWeight: 600,
                  marginBottom: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ width: 16, height: 1, background: TOKENS.teal }} />
                Topic · {card.label}
              </div>

              {/* Bad question */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 11,
                    color: TOKENS.coral,
                    fontWeight: 700,
                    marginTop: 4,
                    width: 24,
                    flexShrink: 0,
                  }}
                >
                  ✕
                </div>
                <div
                  style={{
                    fontFamily: FONTS.cnSans,
                    fontSize: 17,
                    color: TOKENS.muted,
                    textDecoration: "line-through",
                    flex: 1,
                  }}
                >
                  {card.bad}
                </div>
              </div>

              {/* Good question */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 11,
                    color: TOKENS.teal,
                    fontWeight: 700,
                    marginTop: 4,
                    width: 24,
                    flexShrink: 0,
                  }}
                >
                  ✓
                </div>
                <div
                  style={{
                    fontFamily: FONTS.cnSerif,
                    fontSize: 22,
                    color: TOKENS.navy,
                    fontWeight: 500,
                    lineHeight: 1.4,
                    flex: 1,
                  }}
                >
                  {card.good}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};
