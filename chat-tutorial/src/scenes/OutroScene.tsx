import { spring, useCurrentFrame, useVideoConfig } from "remotion";

const tips = [
  { icon: "👋", text: "用溫暖的開場白破冰" },
  { icon: "❓", text: "提問開放性問題" },
  { icon: "👂", text: "積極傾聽、給予回應" },
  { icon: "💡", text: "分享自己的故事" },
  { icon: "😄", text: "保持輕鬆幽默的語氣" },
];

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 14, stiffness: 80 }, durationInFrames: 25 });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Noto Sans TC', 'PingFang TC', sans-serif",
        padding: "0 80px",
      }}
    >
      {/* Decorative */}
      <div style={{ position: "absolute", top: 60, left: 60, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
      <div style={{ position: "absolute", bottom: 80, right: 80, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />

      <div
        style={{
          fontSize: 52,
          fontWeight: 900,
          color: "#FFFFFF",
          textAlign: "center",
          marginBottom: 12,
          transform: `translateY(${(1 - titleProgress) * -30}px)`,
          opacity: Math.min(1, frame / 15),
          textShadow: "0 4px 16px rgba(0,0,0,0.15)",
        }}
      >
        🎉 你現在是聊天高手了！
      </div>

      <div
        style={{
          fontSize: 20,
          color: "rgba(255,255,255,0.85)",
          marginBottom: 40,
          opacity: Math.min(1, Math.max(0, (frame - 10) / 12)),
        }}
      >
        記住這 5 個技巧，讓每次對話都精彩
      </div>

      {/* Tips list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: 600 }}>
        {tips.map((tip, i) => {
          const tipProgress = spring({
            frame: frame - (i * 8 + 15),
            fps,
            config: { damping: 14, stiffness: 100 },
            durationInFrames: 20,
          });
          const tipOpacity = Math.min(1, Math.max(0, (frame - (i * 8 + 15)) / 10));

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 14,
                padding: "12px 20px",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.3)",
                transform: `translateX(${(1 - tipProgress) * -40}px)`,
                opacity: tipOpacity,
              }}
            >
              <span style={{ fontSize: 28 }}>{tip.icon}</span>
              <span style={{ fontSize: 20, color: "#FFFFFF", fontWeight: 600 }}>{tip.text}</span>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: 36,
          fontSize: 17,
          color: "rgba(255,255,255,0.8)",
          opacity: Math.min(1, Math.max(0, (frame - 60) / 15)),
          letterSpacing: "1px",
        }}
      >
        立刻開始練習吧！ 💪
      </div>
    </div>
  );
};
