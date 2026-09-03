import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {aiApps} from '../content';
import {color, font, type} from '../theme';
import {rise} from '../lib/anim';
import {Scene, SceneHead} from '../components/ui';

/** Eight abstract line marks — one per optional AI module. */
const GLYPHS: string[][] = [
  ['M4 7 L12 3 L20 7 L12 11 Z', 'M4 12 L12 16 L20 12', 'M4 17 L12 21 L20 17'],
  ['M4 12 V12', 'M6 9 V15', 'M10 5 V19', 'M14 7 V17', 'M18 10 V14'],
  ['M12 3 L20 6 V12 C20 17 16 20 12 21 C8 20 4 17 4 12 V6 Z', 'M9 12 L11.5 14.5 L16 10'],
  ['M4 5 H11 M4 12 H11 M4 19 H11', 'M15 5.5 L17 7.5 L21 3.5', 'M15 12.5 L17 14.5 L21 10.5'],
  ['M4 5 H20 V15 H12 L7 19 V15 H4 Z', 'M8 10 H16'],
  ['M6 3 H15 L19 7 V21 H6 Z', 'M15 3 V7 H19', 'M9 12 H16 M9 16 H14'],
  ['M11 4 A7 7 0 1 0 11 18 A7 7 0 1 0 11 4', 'M11 8 A3 3 0 1 0 11 14 A3 3 0 1 0 11 8', 'M16 16 L21 21'],
  ['M3 14 H7 L10 6 L14 19 L17 12 H21'],
];

const Glyph: React.FC<{index: number; accent: string}> = ({index, accent}) => (
  <svg viewBox="0 0 24 24" width={40} height={40} fill="none">
    {GLYPHS[index].map((d, i) => (
      <path
        key={i}
        d={d}
        stroke={accent}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ))}
  </svg>
);

const tileAccents = [
  color.orange,
  color.amber,
  color.terracotta,
  color.gold,
  color.orange,
  color.terracotta,
  color.sky,
  color.jade,
];

export const S08AiApps: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const band = spring({frame: frame - 130, fps, config: {damping: 200}, durationInFrames: 30});

  return (
    <Scene>
      <SceneHead kicker="AI MODULES" title={aiApps.title} sub={aiApps.sub} accent={color.gold} />

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24}}>
        {aiApps.items.map((item, i) => {
          const row = Math.floor(i / 4);
          const col = i % 4;
          const p = spring({
            frame: frame - 28 - (col * 7 + row * 12),
            fps,
            config: {damping: 200, mass: 0.7, stiffness: 120},
          });
          const accent = tileAccents[i];

          return (
            <div
              key={item.n}
              style={{
                padding: '26px 26px 28px',
                borderRadius: 18,
                border: `1px solid ${color.hair}`,
                background: 'linear-gradient(155deg, rgba(246,242,237,0.07), rgba(246,242,237,0.018))',
                boxShadow: '0 26px 60px -40px rgba(0,0,0,0.9)',
                ...rise(p, 32),
              }}
            >
              <div
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `${accent}18`,
                  border: `1px solid ${accent}44`,
                }}
              >
                <Glyph index={i} accent={accent} />
              </div>
              <div style={{marginTop: 20, color: color.cream, ...type.h4, fontWeight: 700, fontSize: 28}}>
                {item.n}
              </div>
              <div style={{marginTop: 12, color: color.muted, ...type.small, fontSize: 21}}>
                {item.d}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 28,
          padding: '24px 34px',
          borderRadius: 16,
          border: `1px solid ${color.hair}`,
          background: `linear-gradient(90deg, ${color.orange}1a, rgba(246,242,237,0.02))`,
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          ...rise(band, 22),
        }}
      >
        <span
          style={{
            fontFamily: font.display,
            color: color.amber,
            whiteSpace: 'nowrap',
            ...type.h4,
            fontSize: 30,
          }}
        >
          模型可換
        </span>
        <span style={{width: 1, height: 34, background: color.hair}} />
        <span style={{color: color.sand, ...type.small, fontSize: 23}}>
          GPT／Claude／地端 LLM 互換，換模型只動設定，不重做整合。
        </span>
      </div>
    </Scene>
  );
};
