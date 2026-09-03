import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {stages} from '../content';
import {color, font, type} from '../theme';
import {rise} from '../lib/anim';
import {Kicker, Scene, SplitHeading} from '../components/ui';

const INTRO = 24;
const PER_STAGE = 119;
const HOLD = 96; // frames a stage stays fully visible before it hands over

const stageAccent = [color.orange, color.terracotta, color.gold, color.sky];
const stageTag = ['多渠道進線', '機器人互動', '智能路由', '數據與質檢'];

const StageBlock: React.FC<{index: number; localFrame: number}> = ({index, localFrame}) => {
  const {fps} = useVideoConfig();
  const stage = stages[index];
  const accent = stageAccent[index];

  const inP = spring({
    frame: localFrame - 4,
    fps,
    config: {damping: 200, mass: 0.7, stiffness: 110},
  });
  const out = interpolate(localFrame, [HOLD, HOLD + 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = Math.min(inP, 1 - out);

  return (
    <AbsoluteFill
      style={{
        opacity,
        justifyContent: 'center',
        paddingBottom: 60,
        transform: `translateY(${(1 - inP) * 34 - out * 26}px)`,
        pointerEvents: 'none',
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
        <span
          style={{
            padding: '10px 20px',
            borderRadius: 10,
            background: `${accent}22`,
            border: `1px solid ${accent}66`,
            color: accent,
            fontFamily: font.display,
            ...type.micro,
          }}
        >
          {stage.step}
        </span>
        <h3 style={{margin: 0, color: color.cream, ...type.h2, fontSize: 62}}>
          <SplitHeading text={stage.title} delay={6} stagger={1.3} distance={26} />
        </h3>
      </div>

      <p style={{margin: '24px 0 0', color: color.muted, ...type.body}}>{stage.lead}</p>

      <div
        style={{
          marginTop: 46,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 22,
        }}
      >
        {stage.items.map((item, i) => {
          const p = spring({
            frame: localFrame - 16 - i * 6,
            fps,
            config: {damping: 200},
            durationInFrames: 24,
          });
          return (
            <div
              key={item.k}
              style={{
                padding: '28px 26px 30px',
                borderRadius: 16,
                border: `1px solid ${color.hair}`,
                background: 'linear-gradient(160deg, rgba(246,242,237,0.06), rgba(246,242,237,0.015))',
                ...rise(p, 26),
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 3,
                  borderRadius: 2,
                  background: accent,
                  marginBottom: 20,
                }}
              />
              <div style={{color: color.cream, ...type.h4, fontWeight: 700, fontSize: 27}}>
                {item.k}
              </div>
              <div style={{marginTop: 12, color: color.muted, ...type.small}}>{item.v}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const S05Stages: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const k = spring({frame, fps, config: {damping: 200}, durationInFrames: 20});
  const railP = interpolate(frame, [INTRO - 10, INTRO + PER_STAGE * 3 + 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const active = Math.min(
    stages.length - 1,
    Math.max(0, Math.floor((frame - INTRO) / PER_STAGE)),
  );

  return (
    <Scene>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Kicker progress={k}>ROADMAP ／ FOUR STAGES</Kicker>
        <span
          style={{
            fontFamily: font.display,
            color: color.dim,
            opacity: k,
            ...type.micro,
          }}
        >
          客服中心智能化推進路徑
        </span>
      </div>

      {/* Stage rail */}
      <div style={{position: 'relative', margin: '46px 0 46px', height: 74}}>
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 0,
            right: 0,
            height: 2,
            background: color.hairSoft,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 0,
            height: 2,
            width: `${railP * 100}%`,
            background: `linear-gradient(90deg, ${color.orange}, ${color.terracotta}, ${color.gold}, ${color.sky})`,
          }}
        />
        {stages.map((stage, i) => {
          const on = i <= active;
          const isActive = i === active;
          const accent = stageAccent[i];
          return (
            <div
              key={stage.step}
              style={{
                position: 'absolute',
                top: 0,
                left: `${(i / stages.length) * 100}%`,
                opacity: on ? 1 : 0.32,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: isActive ? 1 : 3,
                  left: isActive ? -8 : -6,
                  width: isActive ? 16 : 12,
                  height: isActive ? 16 : 12,
                  borderRadius: 999,
                  background: on ? accent : color.dim,
                  boxShadow: isActive ? `0 0 26px ${accent}` : 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 34,
                  left: -8,
                  whiteSpace: 'nowrap',
                  fontFamily: font.display,
                  color: isActive ? color.cream : color.dim,
                  ...type.micro,
                }}
              >
                {stage.step}
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: 58,
                  left: -8,
                  whiteSpace: 'nowrap',
                  color: isActive ? accent : color.dim,
                  fontSize: 17,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                }}
              >
                {stageTag[i]}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{position: 'relative', flex: 1}}>
        {stages.map((stage, i) => {
          const local = frame - INTRO - i * PER_STAGE;
          if (local < -6 || local > PER_STAGE + 26) {
            return null;
          }
          return <StageBlock key={stage.step} index={i} localFrame={local} />;
        })}
      </div>
    </Scene>
  );
};
