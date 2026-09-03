import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {nowNext} from '../content';
import {color, font, type} from '../theme';
import {rise} from '../lib/anim';
import {Chip, Scene, SceneHead} from '../components/ui';

const ROW_START = 34;
const ROW_STEP = 18;

export const S04NowNext: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const head = spring({frame: frame - 26, fps, config: {damping: 200}, durationInFrames: 20});

  return (
    <Scene>
      <SceneHead
        kicker="AS-IS ／ TO-BE"
        title={nowNext.title}
        accent={color.gold}
      />

      <div
        style={{
          flex: 1,
          display: 'grid',
          alignContent: 'center',
          gridTemplateColumns: '188px 1fr 92px 1.15fr',
          alignItems: 'center',
          columnGap: 26,
          rowGap: 4,
        }}
      >
        <div />
        <div
          style={{
            fontFamily: font.display,
            color: color.dim,
            paddingBottom: 14,
            ...type.micro,
            ...rise(head, 10),
          }}
        >
          {nowNext.headNow}
        </div>
        <div />
        <div
          style={{
            fontFamily: font.display,
            color: color.amber,
            paddingBottom: 14,
            ...type.micro,
            ...rise(head, 10),
          }}
        >
          {nowNext.headNext}
        </div>

        {nowNext.rows.map((row, i) => {
          const delay = ROW_START + i * ROW_STEP;
          const p = spring({frame: frame - delay, fps, config: {damping: 200}, durationInFrames: 24});
          const arrow = spring({
            frame: frame - delay - 8,
            fps,
            config: {damping: 200},
            durationInFrames: 22,
          });

          return (
            <React.Fragment key={row.label}>
              <div
                style={{
                  padding: '26px 0',
                  borderTop: `1px solid ${color.hairSoft}`,
                  color: color.cream,
                  ...type.h4,
                  fontWeight: 700,
                  ...rise(p, 16),
                }}
              >
                {row.label}
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                  padding: '20px 0',
                  borderTop: `1px solid ${color.hairSoft}`,
                }}
              >
                {row.now.map((n) => (
                  <Chip key={n} muted progress={p}>
                    {n}
                  </Chip>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px 0',
                  borderTop: `1px solid ${color.hairSoft}`,
                }}
              >
                <span
                  style={{
                    fontFamily: font.display,
                    fontSize: 30,
                    color: color.orange,
                    opacity: arrow,
                    transform: `translateX(${interpolate(arrow, [0, 1], [-18, 0])}px)`,
                    textShadow: `0 0 24px ${color.orange}77`,
                  }}
                >
                  ⟶
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                  padding: '20px 0',
                  borderTop: `1px solid ${color.hairSoft}`,
                }}
              >
                {row.next.map((n, j) => (
                  <Chip
                    key={n}
                    accent={j % 2 === 0 ? color.orange : color.terracotta}
                    progress={spring({
                      frame: frame - ROW_START - i * ROW_STEP - 14 - j * 3,
                      fps,
                      config: {damping: 200},
                      durationInFrames: 22,
                    })}
                  >
                    {n}
                  </Chip>
                ))}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </Scene>
  );
};
