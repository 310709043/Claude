import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ChatBubble } from "../ChatBubble";
import { TipCard } from "../TipCard";

type Message = {
  text: string;
  isSender: boolean;
  appearAt: number;
};

type Props = {
  sceneTitle: string;
  sceneNumber: number;
  accentColor: string;
  icon: string;
  messages: Message[];
  tipTitle: string;
  tipDescription: string;
  tipAppearAt: number;
};

export const ChatScene: React.FC<Props> = ({
  sceneTitle,
  sceneNumber,
  accentColor,
  icon,
  messages,
  tipTitle,
  tipDescription,
  tipAppearAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerProgress = spring({ frame, fps, config: { damping: 14, stiffness: 100 }, durationInFrames: 20 });
  const headerOpacity = Math.min(1, frame / 10);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#F0F2F8",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Noto Sans TC', 'PingFang TC', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
          padding: "20px 40px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          transform: `translateY(${(1 - headerProgress) * -60}px)`,
          opacity: headerOpacity,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 700,
            color: "#FFFFFF",
          }}
        >
          {sceneNumber}
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#FFFFFF", letterSpacing: "0.5px" }}>
          {icon} {sceneTitle}
        </div>
      </div>

      {/* Content area */}
      <div style={{ display: "flex", flex: 1, gap: 24, padding: "24px 32px", overflow: "hidden" }}>
        {/* Chat window */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            padding: "20px 24px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            overflow: "hidden",
          }}
        >
          {/* Chat header */}
          <div
            style={{
              borderBottom: "1px solid #F0F0F0",
              paddingBottom: 14,
              marginBottom: 18,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#E8E8E8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🙂</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>小明</div>
              <div style={{ fontSize: 12, color: "#4CAF50" }}>● 線上</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            {messages.map((msg, i) => (
              <ChatBubble
                key={i}
                message={msg.text}
                isSender={msg.isSender}
                appearAt={msg.appearAt}
              />
            ))}
          </div>
        </div>

        {/* Tip card panel */}
        <div
          style={{
            width: 320,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            justifyContent: "center",
          }}
        >
          <TipCard
            icon={icon}
            title={tipTitle}
            description={tipDescription}
            appearAt={tipAppearAt}
            color={accentColor}
          />
        </div>
      </div>
    </div>
  );
};
