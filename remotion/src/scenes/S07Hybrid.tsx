import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {hybrid} from '../content';
import {color, font, type} from '../theme';
import {rise} from '../lib/anim';
import {Panel, Scene, SceneHead} from '../components/ui';

const Side: React.FC<{
  head: string;
  note: string;
  badge: string;
  items: string[];
  accent: string;
  delay: number;
}> = ({head, note, badge, items, accent, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: {damping: 200, mass: 0.8, stiffness: 110}});

  return (
    <Panel accent={accent} progress={p} style={{padding: '38px 36px 34px'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div>
          <div style={{color: color.cream, fontFamily: font.display, ...type.h3, fontSize: 36}}>
            {head}
          </div>
          <div style={{marginTop: 8, color: color.muted, ...type.small}}>{note}</div>
        </div>
        <span
          style={{
            padding: '9px 18px',
            borderRadius: 999,
            border: `1px solid ${accent}66`,
            background: `${accent}1f`,
            color: accent,
            fontFamily: font.display,
            ...type.micro,
          }}
        >
          {badge}
        </span>
      </div>

      <div style={{marginTop: 30, display: 'flex', flexDirection: 'column', gap: 14}}>
        {items.map((item, i) => {
          const ip = spring({
            frame: frame - delay - 14 - i * 6,
            fps,
            config: {damping: 200},
            durationInFrames: 22,
          });
          return (
            <div
              key={item}
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
                padding: '16px 20px',
                borderRadius: 12,
                background: 'rgba(246,242,237,0.035)',
                border: `1px solid ${color.hairSoft}`,
                ...rise(ip, 16),
              }}
            >
              <span
                style={{
                  marginTop: 11,
                  width: 7,
                  height: 7,
                  borderRadius: 999,
                  flex: '0 0 auto',
                  background: accent,
                  boxShadow: `0 0 14px ${accent}`,
                }}
              />
              <span style={{color: color.sand, ...type.small, fontSize: 23}}>{item}</span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

const FlowArrow: React.FC<{
  label: string;
  accent: string;
  direction: 1 | -1;
  delay: number;
}> = ({label, accent, direction, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: {damping: 200}, durationInFrames: 26});
  const dash = ((frame * 1.7) % 26) * direction;

  return (
    <div style={{opacity: p, transform: `translateY(${(1 - p) * 12}px)`}}>
      <div
        style={{
          fontFamily: font.body,
          color: accent,
          textAlign: 'center',
          fontSize: 18,
          fontWeight: 600,
          marginBottom: 10,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </div>
      <svg viewBox="0 0 220 18" style={{width: 208, height: 18, overflow: 'visible'}}>
        <line
          x1={direction === 1 ? 0 : 220}
          y1={9}
          x2={direction === 1 ? 200 : 20}
          y2={9}
          stroke={accent}
          strokeWidth={2}
          strokeDasharray="10 8"
          strokeDashoffset={-dash}
          opacity={0.9}
        />
        <path
          d={
            direction === 1
              ? 'M 200 2 L 214 9 L 200 16 Z'
              : 'M 20 2 L 6 9 L 20 16 Z'
          }
          fill={accent}
        />
      </svg>
    </div>
  );
};

export const S07Hybrid: React.FC = () => {
  const frame = useCurrentFrame();
  const boundary = interpolate(frame, [34, 66], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Scene>
      <SceneHead
        kicker="HYBRID DEPLOYMENT"
        title={hybrid.title}
        sub={hybrid.sub}
        accent={color.sky}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 312px 1fr',
          alignItems: 'stretch',
          gap: 0,
        }}
      >
        <Side
          head={hybrid.onprem.head}
          note={hybrid.onprem.note}
          badge={hybrid.onprem.badge}
          items={hybrid.onprem.items}
          accent={color.terracotta}
          delay={26}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 54,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '50%',
              width: 0,
              borderLeft: `2px dashed ${color.hair}`,
              transform: `scaleY(${boundary})`,
              transformOrigin: 'center top',
            }}
          />
          <FlowArrow label={hybrid.flowUp} accent={color.amber} direction={1} delay={72} />
          <div
            style={{
              fontFamily: font.display,
              color: color.dim,
              textAlign: 'center',
              opacity: boundary,
              ...type.micro,
              fontSize: 16,
              lineHeight: 1.8,
              whiteSpace: 'pre-line',
            }}
          >
            {hybrid.boundary.replace('　', '\n')}
          </div>
          <FlowArrow label={hybrid.flowDown} accent={color.sky} direction={-1} delay={92} />
        </div>

        <Side
          head={hybrid.cloud.head}
          note={hybrid.cloud.note}
          badge={hybrid.cloud.badge}
          items={hybrid.cloud.items}
          accent={color.sky}
          delay={44}
        />
      </div>
    </Scene>
  );
};
