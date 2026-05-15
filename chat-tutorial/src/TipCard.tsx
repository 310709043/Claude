import { spring, useCurrentFrame, useVideoConfig } from "remotion";

type Props = {
  icon: string;
  title: string;
  description: string;
  appearAt: number;
  color: string;
};

export const TipCard: React.FC<Props> = ({
  icon,
  title,
  description,
  appearAt,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 14, stiffness: 100, mass: 1 },
    durationInFrames: 25,
  });

  const opacity = Math.min(1, Math.max(0, (frame - appearAt) / 10));
  const scale = 0.7 + progress * 0.3;

  if (frame < appearAt) return null;

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
        borderLeft: `5px solid ${color}`,
        transform: `scale(${scale})`,
        opacity,
        fontFamily: "'Noto Sans TC', 'PingFang TC', sans-serif",
      }}
    >
      <div style={{ fontSize: 36 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ fontSize: 15, color: "#555", lineHeight: 1.5 }}>
          {description}
        </div>
      </div>
    </div>
  );
};
