import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ease, enter, exit} from '../anim';
import {Backdrop} from '../components/Backdrop';
import {BrandLogo} from '../components/BrandLogo';
import {Camera, Defocus} from '../components/Camera';
import {cta} from '../content';
import {FONT_LATIN, FONT_TC} from '../fonts';
import {palette, tracking, type} from '../theme';
import {SCENE} from '../timeline';

/* ============================================================
 *  第 6 段｜結尾與行動呼籲（5.1 秒）
 * ------------------------------------------------------------
 *  收在一個「呼吸」上：主張句 → 品牌鎖定 → 行動呼籲，
 *  最後以一次暖白光暈收束，留下品牌殘影。
 * ============================================================ */

const T = {
  statement: 4,
  brand: 62,
  action: 116,
  bloom: 200,
} as const;

export const S6_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const D = SCENE.cta;

  // 結尾光暈：由中心緩慢綻放，象徵「就緒」
  const bloom = enter(frame, T.bloom, 90, ease.outQuint);

  return (
    <AbsoluteFill style={{backgroundColor: palette.deep}}>
      <Camera move="pushIn" duration={D} depth={0.4} intensity={0.8}>
        <Defocus blur={0}>
          <Backdrop variant="summit" fadeIn={20} />
        </Defocus>
      </Camera>

      <Camera move="pushIn" duration={D} depth={1} intensity={0.3} handheld={0.7}>
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
          {/* 主張句 */}
          <div
            style={{
              display: 'flex',
              fontFamily: FONT_TC,
              fontSize: type.display * 1.02,
              fontWeight: 900,
              letterSpacing: tracking.display,
              lineHeight: 1.2,
              marginBottom: 56,
            }}
          >
            {Array.from(cta.statement).map((c, i) => {
              const p = enter(frame, T.statement + i * 2.6, 42, ease.outExpo);
              return (
                <span
                  key={`a${i}`}
                  style={{
                    display: 'inline-block',
                    whiteSpace: 'pre',
                    color: palette.textHi,
                    opacity: p,
                    transform: `translateY(${(1 - p) * 30}px)`,
                    filter: p < 0.98 ? `blur(${(1 - p) * 10}px)` : undefined,
                  }}
                >
                  {c}
                </span>
              );
            })}
            {Array.from(cta.statementAccent).map((c, i) => {
              const d = T.statement + (cta.statement.length + i) * 2.6;
              const p = enter(frame, d, 42, ease.outExpo);
              return (
                <span
                  key={`b${i}`}
                  style={{
                    display: 'inline-block',
                    whiteSpace: 'pre',
                    color: palette.primary,
                    opacity: p,
                    transform: `translateY(${(1 - p) * 30}px)`,
                    filter: p < 0.98 ? `blur(${(1 - p) * 10}px)` : undefined,
                    textShadow: `0 0 46px ${palette.glow}, 0 0 100px ${palette.glowSoft}`,
                  }}
                >
                  {c}
                </span>
              );
            })}
          </div>

          {/* 品牌鎖定組 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 38,
              opacity: enter(frame, T.brand, 50, ease.outExpo),
              transform: `translateY(${(1 - enter(frame, T.brand, 50)) * 20}px)`,
            }}
          >
            <BrandLogo delay={T.brand} size={58} />
            <div
              style={{
                width: 1,
                height: 62,
                background: palette.edge,
                transformOrigin: 'center',
                transform: `scaleY(${enter(frame, T.brand + 14, 40, ease.outExpo)})`,
              }}
            />
            <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
              <div
                style={{
                  fontFamily: FONT_LATIN,
                  fontSize: 46,
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: palette.textHi,
                  textShadow: `0 0 32px ${palette.glowSoft}`,
                }}
              >
                {cta.brand}
              </div>
              <div
                style={{
                  fontFamily: FONT_TC,
                  fontSize: type.body * 1.02,
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  color: palette.textMid,
                }}
              >
                {cta.product}
              </div>
            </div>
          </div>

          {/* 行動呼籲 */}
          <div
            style={{
              marginTop: 58,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 16,
              padding: '15px 38px',
              border: `1px solid ${palette.primary}`,
              background: `linear-gradient(135deg, rgba(255,97,0,0.20), rgba(255,97,0,0.04))`,
              opacity: enter(frame, T.action, 46, ease.outExpo),
              transform: `translateY(${(1 - enter(frame, T.action, 46)) * 18}px) scale(${interpolate(
                enter(frame, T.action, 46),
                [0, 1],
                [0.94, 1]
              )})`,
              boxShadow: `0 0 40px ${palette.glowSoft}, inset 0 0 24px rgba(255,97,0,0.10)`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_TC,
                fontSize: type.subtitle * 0.82,
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: palette.ember,
              }}
            >
              {cta.action}
            </span>
            <span
              style={{
                fontFamily: FONT_LATIN,
                fontSize: type.subtitle * 0.72,
                color: palette.primary,
                transform: `translateX(${enter(frame, T.action + 16, 40, ease.outExpo) * 4}px)`,
              }}
            >
              →
            </span>
          </div>

          <div
            style={{
              marginTop: 34,
              fontFamily: FONT_LATIN,
              fontSize: type.caption * 0.94,
              fontWeight: 500,
              letterSpacing: '0.5em',
              color: palette.textLow,
              opacity: enter(frame, T.action + 24, 44, ease.outQuint) * 0.9,
            }}
          >
            {cta.latin}
          </div>
        </AbsoluteFill>
      </Camera>

      {/* 收尾光暈 */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          opacity: bloom * 0.5,
          background: `radial-gradient(circle at 50% 52%, ${palette.glow} 0%, rgba(255,97,0,0.10) 34%, rgba(0,0,0,0) 66%)`,
        }}
      />
    </AbsoluteFill>
  );
};
