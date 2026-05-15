import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 14, stiffness: 80 }, durationInFrames: 30 });
  const subtitleProgress = spring({ frame: frame - 20, fps, config: { damping: 14, stiffness: 80 }, durationInFrames: 25 });
  const iconsProgress = spring({ frame: frame - 35, fps, config: { damping: 14, stiffness: 100 }, durationInFrames: 20 });

  const icons = ["💬", "😊", "🤝", "✨"];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Noto Sans TC', 'PingFang TC', sans-serif",
      }}
    >
      {/* Decorative circles */}
      <div style={{ position: "absolute", top: 80, left: 80, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
      <div style={{ position: "absolute", bottom: 100, right: 100, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
      <div style={{ position: "absolute", top: 200, right: 150, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />

      {/* Icons row */}
      <div style={{ display: "flex", gap: 20, marginBottom: 32, opacity: Math.min(1, Math.max(0, (frame - 35) / 12)), transform: `translateY(${(1 - iconsProgress) * 20}px)` }}>
        {icons.map((icon, i) => (
          <div
            key={i}
            style={{
              fontSize: 40,
              background: "rgba(255,255,255,0.15)",
              borderRadius: 16,
              padding: "10px 14px",
              backdropFilter: "blur(4px)",
            }}
          >
            {icon}
          </div>
        ))}
      </div>

      {/* Main title */}
      <div
        style={{
          fontSize: 72,
          fontWeight: 900,
          color: "#FFFFFF",
          textAlign: "center",
          letterSpacing: "-1px",
          textShadow: "0 4px 20px rgba(0,0,0,0.2)",
          transform: `translateY(${(1 - titleProgress) * 40}px)`,
          opacity: Math.min(1, frame / 20),
          lineHeight: 1.15,
        }}
      >
        聊天技巧教學
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: 26,
          color: "rgba(255,255,255,0.85)",
          marginTop: 20,
          textAlign: "center",
          transform: `translateY(${(1 - subtitleProgress) * 30}px)`,
          opacity: Math.min(1, Math.max(0, (frame - 20) / 15)),
          letterSpacing: "2px",
        }}
      >
        讓對話更有趣、更深入的秘訣
      </div>

      {/* Bottom badge */}
      <div
        style={{
          marginTop: 48,
          background: "rgba(255,255,255,0.2)",
          borderRadius: 50,
          padding: "10px 28px",
          fontSize: 16,
          color: "#FFFFFF",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.3)",
          opacity: Math.min(1, Math.max(0, (frame - 40) / 15)),
        }}
      >
        5 個實用技巧
      </div>
    </div>
  );
};
