import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {C, FONT} from '../theme';
import {rise, pop, EASE_OUT} from '../anim';
import {Scene} from '../components/Layout';
import {TwmMark} from '../components/Brand';
import {Img, staticFile} from 'remotion';

export const S1Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const markIn = pop(frame, fps, 4, 190, 90);
  const spin = interpolate(frame, [0, 60], [-42, 0], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const wordWipe = rise(frame, 26, 30);
  const ruleP = rise(frame, 48, 26);
  const tagP = rise(frame, 58, 24);

  // A ring of light sweeps out of the mark as it lands.
  const ring = interpolate(frame, [8, 52], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  return (
    <Scene inDur={10} outDur={20} push={0.01}>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 46, position: 'relative'}}>
          <div style={{position: 'relative', display: 'flex'}}>
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 168,
                height: 168,
                marginLeft: -84,
                marginTop: -84,
                borderRadius: '50%',
                border: `2px solid ${C.orange}`,
                transform: `scale(${0.6 + ring * 1.5})`,
                opacity: (1 - ring) * 0.5,
              }}
            />
            <TwmMark
              size={152}
              style={{
                transform: `scale(${markIn}) rotate(${spin}deg)`,
                filter: `drop-shadow(0 18px 34px ${C.orange}44)`,
              }}
            />
          </div>

          <div
            style={{
              overflow: 'hidden',
              width: wordWipe * 470,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Img
              src={staticFile('brand/twm-wordmark-dark.png')}
              style={{height: 128, objectFit: 'contain', minWidth: 470}}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: 54,
            width: ruleP * 640,
            height: 3,
            background: `linear-gradient(90deg, ${C.orange}, ${C.magenta}, ${C.indigo})`,
            borderRadius: 2,
            opacity: 0.85,
          }}
        />

        <div
          style={{
            marginTop: 34,
            fontFamily: FONT.sans,
            fontWeight: 500,
            fontSize: 30,
            letterSpacing: '0.42em',
            color: C.inkSoft,
            opacity: tagP,
            transform: `translateY(${(1 - tagP) * 14}px)`,
            paddingLeft: '0.42em',
          }}
        >
          企業 AI ・ 一體機就緒
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
