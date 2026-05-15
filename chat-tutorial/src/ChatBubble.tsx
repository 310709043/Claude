import { spring, useCurrentFrame, useVideoConfig } from "remotion";

type Props = {
  message: string;
  isSender: boolean;
  appearAt: number;
  senderName?: string;
  avatar?: string;
};

export const ChatBubble: React.FC<Props> = ({
  message,
  isSender,
  appearAt,
  senderName,
  avatar,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
    durationInFrames: 20,
  });

  const opacity = Math.min(1, Math.max(0, (frame - appearAt) / 8));
  const translateX = (1 - progress) * (isSender ? 60 : -60);

  if (frame < appearAt) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isSender ? "row-reverse" : "row",
        alignItems: "flex-end",
        marginBottom: 16,
        transform: `translateX(${translateX}px)`,
        opacity,
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          backgroundColor: isSender ? "#4F8EF7" : "#E8E8E8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0,
          marginLeft: isSender ? 10 : 0,
          marginRight: isSender ? 0 : 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        {avatar ?? (isSender ? "👤" : "🙂")}
      </div>

      <div style={{ maxWidth: "65%", display: "flex", flexDirection: "column", alignItems: isSender ? "flex-end" : "flex-start" }}>
        {senderName && (
          <span
            style={{
              fontSize: 13,
              color: "#888",
              marginBottom: 4,
              fontWeight: 600,
            }}
          >
            {senderName}
          </span>
        )}
        {/* Bubble */}
        <div
          style={{
            backgroundColor: isSender ? "#4F8EF7" : "#FFFFFF",
            color: isSender ? "#FFFFFF" : "#1A1A1A",
            borderRadius: isSender
              ? "20px 20px 4px 20px"
              : "20px 20px 20px 4px",
            padding: "12px 18px",
            fontSize: 20,
            lineHeight: 1.5,
            boxShadow: isSender
              ? "0 4px 12px rgba(79,142,247,0.35)"
              : "0 4px 12px rgba(0,0,0,0.10)",
            fontFamily: "'Noto Sans TC', 'PingFang TC', sans-serif",
          }}
        >
          {message}
        </div>
      </div>
    </div>
  );
};
