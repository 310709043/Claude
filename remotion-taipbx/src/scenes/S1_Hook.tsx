import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ease, enter, exit, life} from '../anim';
import {Backdrop} from '../components/Backdrop';
import {BrandLogo} from '../components/BrandLogo';
import {Camera, Defocus} from '../components/Camera';
import {BrandMark} from '../components/Atoms';
import {Paragraph, SplitText} from '../components/KineticText';
import {hook} from '../content';
import {FONT_LATIN, FONT_TC} from '../fonts';
import {layout, palette, tracking, type} from '../theme';
import {HOOK_BEATS, SCENE} from '../timeline';

/* ============================================================
 *  第 1 段｜強烈開場 Hook（15.3 秒）
 * ------------------------------------------------------------
 *  節拍設計：
 *   0.0–0.35s  全黑，一道光刃劃過（建立期待）
 *   0.35–4.0s  提問文字：「企業 AI，總是卡在最後一哩路。」
 *   4.4–8.6s   品牌自深處浮現，空間由虛無轉為場域
 *   8.6–10.6s  三大支柱橫向展開
 *   10.6–15.3s 產品主張定格
 * ============================================================ */

/** 開場劃過畫面的第一道光 —— 全片的第一個動作 */
const OpeningStreak: React.FC = () => {
  const frame = useCurrentFrame();
  const p = enter(frame, 0, 34, ease.outExpo);
  const fade = exit(frame, 26, 30);
  const x = interpolate(p, [0, 1], [-30, 130]);

  return (
    <AbsoluteFill style={{overflow: 'hidden', mixBlendMode: 'screen', opacity: fade}}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: `${x}%`,
          width: '46%',
          height: 3,
          marginTop: -1.5,
          background: `linear-gradient(90deg, rgba(255,97,0,0) 0%, ${palette.primary} 55%, ${palette.primaryPale} 100%)`,
          boxShadow: `0 0 30px ${palette.glow}, 0 0 90px ${palette.glowSoft}`,
          filter: 'blur(0.6px)',
        }}
      />
    </AbsoluteFill>
  );
};

export const S1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const D = SCENE.hook;

  // 空間由「虛無」轉為「場域」：兩層背景交叉溶接
  const chamberIn = enter(frame, HOOK_BEATS.titleIn - 30, 90, ease.outQuint);

  const teaseAlive = life(frame, {
    in: HOOK_BEATS.teaseIn,
    inDur: 1,
    out: HOOK_BEATS.teaseOut,
    outDur: 26,
  });

  return (
    <AbsoluteFill style={{backgroundColor: palette.void}}>
      {/* --- 背景層（帶輕微視差，移動幅度小於前景） --- */}
      <Camera move="pushIn" duration={D} depth={0.35} intensity={0.9}>
        <Defocus blur={0}>
          <AbsoluteFill style={{opacity: 1 - chamberIn * 0.85}}>
            <Backdrop variant="void" fadeIn={20} />
          </AbsoluteFill>
          <AbsoluteFill style={{opacity: chamberIn}}>
            <Backdrop variant="chamber" fadeIn={60} />
          </AbsoluteFill>
        </Defocus>
      </Camera>

      <OpeningStreak />

      {/* --- 前景內容層 --- */}
      <Camera move="pushIn" duration={D} depth={1} intensity={0.75}>
        {/* 提問鉤子 */}
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: teaseAlive,
          }}
        >
          <div
            style={{
              fontFamily: FONT_TC,
              fontSize: type.display,
              fontWeight: 700,
              color: palette.textHi,
              letterSpacing: tracking.display,
              textShadow: `0 0 60px rgba(255,97,0,0.28)`,
              transform: `scale(${interpolate(
                enter(frame, HOOK_BEATS.teaseIn, 200, ease.outExpo),
                [0, 1],
                [1.0, 1.045]
              )})`,
            }}
          >
            <SplitText
              text={hook.tease}
              delay={HOOK_BEATS.teaseIn}
              stagger={3.2}
              duration={42}
              from="below"
            />
          </div>
        </AbsoluteFill>

        {/* 品牌主視覺 */}
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: layout.marginX,
            paddingRight: layout.marginX,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: enter(frame, HOOK_BEATS.titleIn - 10, 40, ease.outQuint),
            }}
          >
            {/* 企業識別 */}
            <div style={{marginBottom: 46}}>
              <BrandLogo delay={HOOK_BEATS.titleIn} size={62} />
            </div>

            {/* 分隔光線 */}
            <div
              style={{
                width: 340,
                height: 1,
                marginBottom: 44,
                transformOrigin: 'center',
                transform: `scaleX(${enter(frame, HOOK_BEATS.titleIn + 16, 52, ease.outExpo)})`,
                background: `linear-gradient(90deg, rgba(255,97,0,0) 0%, ${palette.edge} 50%, rgba(255,97,0,0) 100%)`,
              }}
            />

            {/* 產品名 */}
            <BrandMark
              name={hook.titleBrand}
              product={hook.title}
              delay={HOOK_BEATS.titleIn + 8}
              size={type.hero}
            />

            {/* 三大支柱 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 30,
                marginTop: 58,
              }}
            >
              {hook.pillars.map((p, i) => {
                const d = HOOK_BEATS.pillarsIn + i * 9;
                const pr = enter(frame, d, 44, ease.outExpo);
                return (
                  <React.Fragment key={p}>
                    {i > 0 && (
                      <div
                        style={{
                          fontFamily: FONT_LATIN,
                          fontSize: type.subtitle * 0.7,
                          color: palette.primary,
                          opacity: enter(frame, d - 4, 40) * 0.7,
                          transform: `rotate(${(1 - enter(frame, d - 4, 40)) * 90}deg)`,
                        }}
                      >
                        ×
                      </div>
                    )}
                    <div
                      style={{
                        fontFamily: FONT_TC,
                        fontSize: type.subtitle,
                        fontWeight: 500,
                        color: palette.textMid,
                        letterSpacing: '0.05em',
                        opacity: pr,
                        transform: `translateY(${(1 - pr) * 18}px)`,
                        filter: pr < 0.98 ? `blur(${(1 - pr) * 8}px)` : undefined,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {p}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {/* 產品主張 */}
            <div
              style={{
                marginTop: 52,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: FONT_TC,
                  fontSize: type.title * 0.78,
                  fontWeight: 700,
                  color: palette.ember,
                  letterSpacing: '0.04em',
                  opacity: enter(frame, HOOK_BEATS.leadIn, 46, ease.outExpo),
                  transform: `translateY(${
                    (1 - enter(frame, HOOK_BEATS.leadIn, 46)) * 16
                  }px)`,
                  textShadow: `0 0 34px ${palette.glow}`,
                  marginBottom: 20,
                }}
              >
                {hook.lead}
              </div>
              <Paragraph
                text={hook.sub}
                delay={HOOK_BEATS.leadIn + 14}
                lineStagger={7}
                style={{
                  fontSize: type.body,
                  fontWeight: 400,
                  color: palette.textLow,
                  lineHeight: 1.85,
                  letterSpacing: tracking.body,
                }}
              />
            </div>
          </div>
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};
