import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {solutions} from '../content';
import {accents, color, font, type} from '../theme';
import {rise} from '../lib/anim';
import {Panel, Scene, SceneHead} from '../components/ui';

export const S03Solutions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <Scene>
      <SceneHead
        kicker="CORE SOLUTIONS"
        title={solutions.title}
        sub="從渠道整合、座席工作台到 AI 中控，三條產品線可獨立導入，也可組合建置。"
      />

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 38}}>
        {solutions.items.map((item, i) => {
          const accent = accents[i % accents.length];
          const p = spring({
            frame: frame - 26 - i * 13,
            fps,
            config: {damping: 200, mass: 0.8, stiffness: 110},
          });
          const tagBase = 26 + i * 13 + 22;

          return (
            <Panel key={item.no} accent={accent} progress={p} style={{padding: '40px 38px 36px', minHeight: 480}}>
              <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
                <span
                  style={{
                    fontFamily: font.display,
                    fontSize: 62,
                    fontWeight: 800,
                    lineHeight: 1,
                    color: 'transparent',
                    WebkitTextStroke: `1.5px ${accent}aa`,
                  }}
                >
                  {item.no}
                </span>
                <span
                  style={{
                    padding: '8px 16px',
                    borderRadius: 999,
                    border: `1px solid ${accent}55`,
                    color: accent,
                    fontFamily: font.display,
                    ...type.micro,
                  }}
                >
                  {item.time}
                </span>
              </div>

              <h3
                style={{
                  margin: '30px 0 0',
                  color: color.cream,
                  // Two title lines' worth, so every card's body copy starts level.
                  minHeight: 104,
                  ...type.h3,
                }}
              >
                {item.name}
              </h3>

              <p style={{margin: '22px 0 0', color: color.muted, ...type.body}}>{item.desc}</p>

              <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 30}}>
                {item.tags.map((tag, j) => {
                  const tp = spring({
                    frame: frame - tagBase - j * 4,
                    fps,
                    config: {damping: 200},
                    durationInFrames: 18,
                  });
                  return (
                    <span
                      key={tag}
                      style={{
                        padding: '7px 15px',
                        borderRadius: 8,
                        border: `1px solid ${color.hair}`,
                        background: 'rgba(246,242,237,0.04)',
                        color: color.sand,
                        fontFamily: font.display,
                        fontSize: 19,
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        ...rise(tp, 10),
                      }}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </Panel>
          );
        })}
      </div>
    </Scene>
  );
};
