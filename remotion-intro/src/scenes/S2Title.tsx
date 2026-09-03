import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {C, FONT} from '../theme';
import {rise, pop, EASE_OUT} from '../anim';
import {Scene} from '../components/Layout';
import {CornerBrand} from '../components/Brand';
import {Screen} from '../components/Screen';

const PILLARS = ['全渠道', '智能交互', 'AI 中控', '雲地混合'];

export const S2Title: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const kick = rise(frame, 2, 20);
  const t1 = rise(frame, 10, 28);
  const t2 = rise(frame, 20, 28);
  const t3 = rise(frame, 34, 26);
  const stackP = pop(frame, fps, 22, 210, 78);
  const float = Math.sin(frame / 42) * 8;

  return (
    <Scene inDur={16} outDur={18}>
      <AbsoluteFill style={{padding: '0 112px', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        {/* left: the title block */}
        <div style={{width: 900, flexShrink: 0}}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '9px 20px',
              borderRadius: 999,
              border: `1px solid ${C.orange}55`,
              background: `${C.orange}12`,
              opacity: kick,
              transform: `translateY(${(1 - kick) * 16}px)`,
            }}
          >
            <span style={{width: 8, height: 8, borderRadius: '50%', background: C.orange}} />
            <span
              style={{
                fontFamily: FONT.sans,
                fontWeight: 700,
                fontSize: 20,
                letterSpacing: '0.2em',
                color: C.orangeDeep,
              }}
            >
              台灣大哥大企業服務
            </span>
          </div>

          <h1
            style={{
              margin: '34px 0 0',
              fontFamily: FONT.latin,
              fontWeight: 800,
              fontSize: 96,
              lineHeight: 1.0,
              letterSpacing: '-0.035em',
              color: C.ink,
              opacity: t1,
              transform: `translateY(${(1 - t1) * 34}px)`,
            }}
          >
            TAIPBX
            <br />
            <span
              style={{
                background: `linear-gradient(96deg, ${C.orange}, ${C.magenta} 62%, ${C.indigo})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Call Center
            </span>
          </h1>

          <p
            style={{
              margin: '30px 0 0',
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 42,
              lineHeight: 1.35,
              color: C.ink,
              opacity: t2,
              transform: `translateY(${(1 - t2) * 24}px)`,
            }}
          >
            客服中心智能客服發展藍圖
          </p>
          <p
            style={{
              margin: '18px 0 0',
              fontFamily: FONT.sans,
              fontSize: 26,
              lineHeight: 1.65,
              color: C.inkSoft,
              maxWidth: 760,
              opacity: t2,
            }}
          >
            以企業級通訊與 AI 服務，協助企業打造全渠道智能客服；
            <br />
            透過雲端、地端與混合雲架構，推動客服中心智能化升級。
          </p>

          <div style={{display: 'flex', gap: 12, marginTop: 36}}>
            {PILLARS.map((p, i) => {
              const q = rise(frame, 34 + i * 5, 20);
              return (
                <span
                  key={p}
                  style={{
                    fontFamily: FONT.sans,
                    fontWeight: 500,
                    fontSize: 21,
                    color: C.inkMid,
                    padding: '10px 20px',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.82)',
                    border: `1px solid ${C.line}`,
                    opacity: q * t3,
                    transform: `translateY(${(1 - q) * 14}px)`,
                  }}
                >
                  {p}
                </span>
              );
            })}
          </div>
        </div>

        {/* right: a stack of live platform screens */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            height: 760,
            opacity: stackP,
          }}
        >
          <Screen
            shot="agent-status"
            width={800}
            tilt={-3.2}
            label="全渠道值機台"
            style={{
              position: 'absolute',
              left: 20,
              top: 74 + float * 0.5,
              transform: `rotate(-3.2deg) translateY(${(1 - stackP) * 60}px) scale(${0.94 + stackP * 0.06})`,
            }}
          />
          <Screen
            shot="ai-copilot"
            width={720}
            tilt={2.4}
            label="AI Copilot 值機介面"
            style={{
              position: 'absolute',
              left: 150,
              top: 336 - float,
              transform: `rotate(2.4deg) translateY(${(1 - stackP) * 96}px) scale(${0.94 + stackP * 0.06})`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: -80,
              background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${C.orange}18, transparent 70%)`,
              zIndex: -1,
            }}
          />
        </div>
      </AbsoluteFill>
      <CornerBrand opacity={interpolate(frame, [40, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT})} />
    </Scene>
  );
};
