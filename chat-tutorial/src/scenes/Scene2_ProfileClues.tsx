import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS, TOKENS } from "../design";
import { SceneFrame, Highlight } from "../components/SceneFrame";

const TAGS = [
  { label: "拉布拉多", note: "養狗的人通常願意聊", x: 38, y: 18, delay: 35, color: "teal" as const },
  { label: "義式手沖", note: "可以約咖啡廳！", x: 62, y: 45, delay: 55, color: "coral" as const },
  { label: "登山照", note: "問最難忘的一次", x: 28, y: 70, delay: 75, color: "teal" as const },
  { label: "Foo Fighters T恤", note: "音樂品味線索", x: 70, y: 78, delay: 95, color: "coral" as const },
];

export const Scene2_ProfileClues: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardProgress = spring({ frame: frame - 20, fps, config: { damping: 18, stiffness: 60, mass: 1.2 }, durationInFrames: 50 });
  const cardOp = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" });

  return (
    <SceneFrame
      subtitle="02 · Read the Profile"
      title={
        <>
          檔案裡<br />都是 <Highlight>線索</Highlight>
        </>
      }
      note="每張照片、每個 bio 字句，都是對方留下的話題鉤子。仔細看，你會發現開啟對話的素材其實到處都是。"
    >
      <div
        style={{
          position: "relative",
          width: 480,
          height: 600,
          transform: `translateY(${(1 - cardProgress) * 40}px) rotateY(-8deg) rotateX(3deg)`,
          transformStyle: "preserve-3d",
          opacity: cardOp,
        }}
      >
        {/* Profile card */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 28,
            background: `linear-gradient(135deg, #5a8bbd 0%, #3F72AF 50%, #2c5d96 100%)`,
            boxShadow: TOKENS.shadowLg,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Photo placeholder visual layers */}
          <div
            style={{
              position: "absolute",
              top: 40,
              left: 40,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONTS.serif,
              fontSize: 44,
              color: "#fff",
              fontStyle: "italic",
            }}
          >
            R
          </div>

          {/* Simulated photo elements */}
          <div style={{ position: "absolute", top: 180, left: 60, right: 60, height: 240, borderRadius: 16, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <div style={{ padding: 20, color: "#fff", fontFamily: FONTS.cnSans, fontSize: 13, opacity: 0.7 }}>
              [ 與拉布拉多在陽明山 ]
            </div>
          </div>

          {/* Bio area */}
          <div
            style={{
              position: "absolute",
              bottom: 30,
              left: 40,
              right: 40,
              color: "#fff",
            }}
          >
            <div style={{ fontFamily: FONTS.serif, fontSize: 32, fontStyle: "italic", marginBottom: 6 }}>
              Riley, 28
            </div>
            <div style={{ fontFamily: FONTS.cnSans, fontSize: 14, opacity: 0.85, lineHeight: 1.5 }}>
              咖啡控 · 假日山系 · 樂團控<br />週末通常在 hiking 或泡咖啡
            </div>
          </div>
        </div>

        {/* Floating annotation tags */}
        {TAGS.map((tag, i) => {
          const tagOp = interpolate(frame, [tag.delay, tag.delay + 15], [0, 1], { extrapolateRight: "clamp" });
          const tagProgress = spring({ frame: frame - tag.delay, fps, config: { damping: 14, stiffness: 100 }, durationInFrames: 25 });
          const tagScale = 0.7 + tagProgress * 0.3;

          const color = tag.color === "coral" ? TOKENS.coral : TOKENS.teal;
          const colorSoft = tag.color === "coral" ? TOKENS.coralSoft : TOKENS.tealSoft;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${tag.x}%`,
                top: `${tag.y}%`,
                transform: `translate(-50%, -50%) translateZ(80px) scale(${tagScale})`,
                opacity: tagOp,
                background: "#fff",
                borderRadius: 12,
                padding: "10px 14px",
                boxShadow: "0 10px 30px rgba(17,45,78,0.25)",
                border: `1px solid ${colorSoft}`,
                minWidth: 160,
              }}
            >
              {/* Pin */}
              <div
                style={{
                  position: "absolute",
                  top: -6,
                  left: -6,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: color,
                  boxShadow: `0 0 0 4px ${colorSoft}`,
                }}
              />
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 9,
                  color,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontWeight: 600,
                  marginBottom: 3,
                }}
              >
                LINE {i + 1}
              </div>
              <div
                style={{
                  fontFamily: FONTS.cnSans,
                  fontSize: 14,
                  color: TOKENS.navy,
                  fontWeight: 600,
                  marginBottom: 2,
                }}
              >
                {tag.label}
              </div>
              <div
                style={{
                  fontFamily: FONTS.cnSans,
                  fontSize: 11,
                  color: TOKENS.muted,
                }}
              >
                {tag.note}
              </div>
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};
