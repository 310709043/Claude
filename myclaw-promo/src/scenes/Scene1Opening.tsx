import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {COLORS, FONT_FAMILY} from '../theme';
import {ParticleBackground} from '../components/ParticleBackground';
import {CameraRig, SceneFade} from '../components/CameraRig';
import {GlassCard} from '../components/GlassCard';
import {VoiceWave} from '../components/VoiceWave';
import {StatusPill} from '../components/AppWindow';
import {EASE_OUT, progress} from '../easings';

type Vignette = {
  icon: string;
  place: string;
  placeEn: string;
  quote: string;
  accent: string;
};

const VIGNETTES: Vignette[] = [
  {
    icon: '🎧',
    place: 'Call Center',
    placeEn: 'INBOUND · 09:41',
    quote: '「我們希望了解 AI 導入的方式。」',
    accent: COLORS.orange,
  },
  {
    icon: '🏬',
    place: '門市服務',
    placeEn: 'RETAIL STORE · 11:20',
    quote: '「你們能整合我們現有的 CRM 嗎?」',
    accent: COLORS.blue,
  },
  {
    icon: '💼',
    place: '業務拜訪',
    placeEn: 'FIELD SALES · 14:05',
    quote: '「系統可以做地端部署嗎?」',
    accent: COLORS.orange,
  },
  {
    icon: '🖥️',
    place: '視訊會議',
    placeEn: 'VIDEO MEETING · 15:30',
    quote: '「能不能串接我們內部的知識庫?」',
    accent: COLORS.blue,
  },
  {
    icon: '🛎️',
    place: '客戶服務中心',
    placeEn: 'SERVICE CENTER · 16:47',
    quote: '「我們想先做一個 POC 試試。」',
    accent: COLORS.orange,
  },
];

const VIGNETTE_DUR = 58; // ~1.9s each
const CONVERGE_AT = VIGNETTES.length * VIGNETTE_DUR; // frame 290

/** One rapid-cut enterprise scenario with speech bubble + voice wave. */
const VignetteShot: React.FC<{v: Vignette; index: number}> = ({v, index}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: {damping: 22, stiffness: 130, mass: 0.7},
  });
  // Alternate cut direction for rhythm
  const dir = index % 2 === 0 ? 1 : -1;
  const slideX = (1 - enter) * 90 * dir;
  // Quick punch-in per shot
  const punch = interpolate(frame, [0, VIGNETTE_DUR], [1.0, 1.06], {
    extrapolateRight: 'clamp',
  });

  const quoteP = progress(frame, 12, 26);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        transform: `scale(${punch})`,
      }}
    >
      <div
        style={{
          opacity: enter,
          transform: `translateX(${slideX}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 34,
        }}
      >
        {/* Location plate */}
        <GlassCard
          enterAt={0}
          padding={0}
          radius={30}
          fromY={30}
          style={{
            width: 1060,
            height: 520,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 26,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Accent wash */}
          <AbsoluteFill
            style={{
              background: `radial-gradient(600px 300px at 50% 110%, ${v.accent}14 0%, transparent 70%)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 26,
              left: 34,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              fontFamily: FONT_FAMILY,
            }}
          >
            <div
              style={{
                fontSize: 17,
                fontWeight: 800,
                letterSpacing: 2,
                color: COLORS.textSecondary,
              }}
            >
              {v.placeEn}
            </div>
          </div>
          <div style={{position: 'absolute', top: 22, right: 30}}>
            <StatusPill label="LIVE" color={v.accent} />
          </div>

          <div style={{fontSize: 84}}>{v.icon}</div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 34,
              fontWeight: 800,
              color: COLORS.textPrimary,
              letterSpacing: 2,
            }}
          >
            {v.place}
          </div>

          {/* Quote bubble */}
          <div
            style={{
              opacity: quoteP,
              transform: `translateY(${(1 - quoteP) * 16}px) scale(${
                0.94 + 0.06 * quoteP
              })`,
              padding: '20px 38px',
              borderRadius: 22,
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: `1px solid ${v.accent}55`,
              boxShadow: `0 12px 40px rgba(0,0,0,0.4), 0 0 40px ${v.accent}18`,
              fontFamily: FONT_FAMILY,
              fontSize: 30,
              fontWeight: 600,
              color: COLORS.textPrimary,
            }}
          >
            {v.quote}
          </div>

          <VoiceWave
            width={280}
            height={36}
            bars={30}
            color={v.accent}
            seed={index * 40}
          />
        </GlassCard>
      </div>
    </AbsoluteFill>
  );
};

/** Convergence finale: quotes contract into a single statement. */
const Convergence: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const gather = spring({
    frame,
    fps,
    config: {damping: 30, stiffness: 60, mass: 1.1},
  });
  const titleP = progress(frame, 34, 58);
  const subP = progress(frame, 52, 74);

  // Five chips fly from screen edges toward center then fade
  const chipAngles = [-160, -80, 0, 80, 160];

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      {VIGNETTES.map((v, i) => {
        const angle = ((chipAngles[i] - 90) * Math.PI) / 180;
        const dist = (1 - gather) * 620;
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist * 0.6;
        const fade = interpolate(gather, [0.75, 1], [1, 0], {
          extrapolateLeft: 'clamp',
        });
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              transform: `translate(${x}px, ${y}px) scale(${1 - gather * 0.5})`,
              opacity: fade * 0.9,
              padding: '12px 24px',
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: `1px solid ${v.accent}55`,
              fontFamily: FONT_FAMILY,
              fontSize: 19,
              color: COLORS.textSecondary,
              whiteSpace: 'nowrap',
            }}
          >
            {v.icon} {v.quote}
          </div>
        );
      })}

      {/* Center flare */}
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.orangeGlow} 0%, transparent 65%)`,
          opacity: interpolate(gather, [0.6, 1], [0, 0.7], {
            extrapolateLeft: 'clamp',
          }),
          transform: `scale(${0.5 + gather})`,
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          fontFamily: FONT_FAMILY,
          textAlign: 'center',
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontSize: 74,
            fontWeight: 800,
            letterSpacing: 1,
            color: COLORS.white,
            opacity: titleP,
            transform: `translateY(${(1 - titleP) * 30}px)`,
            textShadow: '0 8px 60px rgba(0,0,0,0.6)',
          }}
        >
          Every Conversation{' '}
          <span style={{color: COLORS.orange}}>Starts Here.</span>
        </div>
        <div
          style={{
            fontSize: 25,
            fontWeight: 500,
            color: COLORS.textSecondary,
            letterSpacing: 4,
            opacity: subP,
            transform: `translateY(${(1 - subP) * 16}px)`,
          }}
        >
          每一次對話,都是商機的起點
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** 第一幕 0–14s:多產業客戶情境快切 → Every Conversation Starts Here. */
export const Scene1Opening: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  return (
    <SceneFade fadeIn={10} fadeOut={16}>
      <ParticleBackground count={40} energy={0.5} seed={1} />
      <CameraRig from={{scale: 1.0}} to={{scale: 1.05}}>
        {VIGNETTES.map((v, i) => (
          <Sequence
            key={i}
            from={i * VIGNETTE_DUR}
            durationInFrames={VIGNETTE_DUR + 8}
            name={`Vignette ${v.place}`}
          >
            <VignetteShot v={v} index={i} />
          </Sequence>
        ))}
        <Sequence
          from={CONVERGE_AT}
          durationInFrames={durationInFrames - CONVERGE_AT}
          name="Convergence"
        >
          <Convergence />
        </Sequence>
      </CameraRig>
    </SceneFade>
  );
};
