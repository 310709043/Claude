import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {ease, enter, exit, life} from '../anim';
import {Backdrop} from '../components/Backdrop';
import {Camera, Defocus} from '../components/Camera';
import {Numeral, SectionTitle} from '../components/Atoms';
import {LineSweep, Paragraph} from '../components/KineticText';
import {barriers, barriersSection} from '../content';
import {FONT_LATIN, FONT_TC} from '../fonts';
import {layout, palette, tracking, type} from '../theme';
import {BARRIER_BEATS, SCENE} from '../timeline';

/* ============================================================
 *  第 2 段｜化解企業 AI 導入的三大關卡（32.2 秒）
 * ------------------------------------------------------------
 *  敘事裝置：每張卡都是一次「轉化」——
 *   左欄以冷灰藍呈現現況痛點（失焦、低飽和、向下沉），
 *   一道品牌色光刃橫掃後，右欄的解方以暖橘實體化。
 *  色彩本身就是論述：冷 = 問題，暖 = 一體機。
 * ============================================================ */

const CARD = BARRIER_BEATS.card;
/** 卡片內部節拍 */
const B = {
  numeral: 0,
  theme: 8,
  pain: 26,
  sweep: 152,
  solution: 168,
  detail: 196,
  out: CARD - 70,
} as const;

const BarrierCard: React.FC<{item: (typeof barriers)[number]}> = ({item}) => {
  const frame = useCurrentFrame();

  // 痛點欄在解方出現後被「奪走焦點」：降低亮度、加深失焦
  const yielded = enter(frame, B.sweep, 46, ease.outQuint);
  const painDim = interpolate(yielded, [0, 1], [1, 0.34]);
  const painBlur = interpolate(yielded, [0, 1], [0, 3.4]);

  const alive = life(frame, {in: B.numeral, inDur: 1, out: B.out, outDur: 34});

  return (
    <AbsoluteFill style={{opacity: alive}}>
      <AbsoluteFill
        style={{
          paddingLeft: layout.marginX,
          paddingRight: layout.marginX,
          paddingTop: layout.marginY,
          paddingBottom: layout.marginY,
          justifyContent: 'center',
        }}
      >
        {/* --- 標頭：巨型序號 + 議題 --- */}
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 58, marginBottom: 54}}>
          <Numeral value={item.no} delay={B.numeral} outAt={B.out} size={140} />
          <div style={{paddingBottom: 12}}>
            <div
              style={{
                fontFamily: FONT_TC,
                fontSize: type.display * 0.82,
                fontWeight: 900,
                color: palette.textHi,
                letterSpacing: tracking.display,
                lineHeight: 1.1,
                opacity: enter(frame, B.theme, 46, ease.outExpo),
                transform: `translateY(${(1 - enter(frame, B.theme, 46)) * 26}px)`,
                filter:
                  enter(frame, B.theme, 46) < 0.98
                    ? `blur(${(1 - enter(frame, B.theme, 46)) * 10}px)`
                    : undefined,
                textShadow: '0 0 50px rgba(255,97,0,0.20)',
              }}
            >
              {item.theme}
            </div>
            <div style={{marginTop: 18, width: 220}}>
              <LineSweep delay={B.theme + 12} duration={50} height={2} outAt={B.out} />
            </div>
          </div>
        </div>

        {/* --- 雙欄：痛點 vs 解方 --- */}
        <div style={{display: 'flex', gap: 96, alignItems: 'stretch'}}>
          {/* 左欄：現況痛點（冷色） */}
          <div
            style={{
              flex: 1,
              opacity: painDim,
              filter: `blur(${painBlur}px) saturate(${interpolate(yielded, [0, 1], [1, 0.4])})`,
              transform: `translateY(${yielded * 10}px)`,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 22,
                opacity: enter(frame, B.pain, 36, ease.outQuint),
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 1.5,
                  background: palette.pain,
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontFamily: FONT_TC,
                  fontSize: type.caption,
                  fontWeight: 500,
                  letterSpacing: '0.30em',
                  color: palette.pain,
                }}
              >
                {item.painLabel}
              </span>
            </div>

            <Paragraph
              text={item.pain}
              delay={B.pain + 8}
              lineStagger={6}
              style={{
                fontSize: type.body * 1.12,
                fontWeight: 400,
                color: 'rgba(200,212,228,0.72)',
                lineHeight: 1.92,
                letterSpacing: tracking.body,
              }}
            />
          </div>

          {/* 中央分隔：光刃在此穿過 */}
          <div style={{width: 2, position: 'relative'}}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(to bottom, rgba(255,97,0,0) 0%, ${palette.edge} 30%, ${palette.edge} 70%, rgba(255,97,0,0) 100%)`,
                opacity: enter(frame, B.pain, 40) * 0.8,
              }}
            />
            {/* 光刃：由上而下貫穿，觸發右欄實體化 */}
            <div
              style={{
                position: 'absolute',
                left: -3,
                width: 8,
                top: `${interpolate(enter(frame, B.sweep, 40, ease.outExpo), [0, 1], [-10, 100])}%`,
                height: '38%',
                background: `linear-gradient(to bottom, rgba(255,97,0,0) 0%, ${palette.primaryPale} 60%, rgba(255,97,0,0) 100%)`,
                boxShadow: `0 0 34px ${palette.glow}`,
                filter: 'blur(2px)',
                opacity: Math.sin(enter(frame, B.sweep, 40) * Math.PI),
              }}
            />
          </div>

          {/* 右欄：一體機解方（暖橘） */}
          <div style={{flex: 1.08, position: 'relative'}}>
            {/* 解方出現前的「待填補」留白：三道暗線，隨光刃掃過而消散。
                它讓構圖在前半段仍然成立，也讓「問題尚未被解決」被看見。 */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 40,
                top: 6,
                opacity: enter(frame, B.pain + 16, 40, ease.outQuint) * exit(frame, B.sweep - 6, 26),
                pointerEvents: 'none',
              }}
            >
              {[0.62, 0.94, 0.44].map((w, i) => (
                <div
                  key={i}
                  style={{
                    height: 2,
                    width: `${w * 100}%`,
                    marginBottom: 30,
                    background: `linear-gradient(90deg, ${palette.painGlow} 0%, rgba(91,107,127,0.04) 100%)`,
                  }}
                />
              ))}
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 22,
                opacity: enter(frame, B.solution, 34, ease.outQuint),
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 1.5,
                  background: palette.primary,
                  display: 'inline-block',
                  boxShadow: `0 0 10px ${palette.glow}`,
                }}
              />
              <span
                style={{
                  fontFamily: FONT_TC,
                  fontSize: type.caption,
                  fontWeight: 700,
                  letterSpacing: '0.30em',
                  color: palette.primary,
                }}
              >
                {item.solutionLabel}
              </span>
            </div>

            {/* 解方標題：從光中「燒」出來 */}
            <div
              style={{
                fontFamily: FONT_TC,
                fontSize: type.title,
                fontWeight: 900,
                color: palette.textHi,
                letterSpacing: tracking.title,
                lineHeight: 1.22,
                marginBottom: 24,
                opacity: enter(frame, B.solution + 6, 44, ease.outExpo),
                transform: `translateX(${(1 - enter(frame, B.solution + 6, 44)) * 26}px)`,
                clipPath: `inset(0% ${(1 - enter(frame, B.solution + 6, 50, ease.outExpo)) * 100}% 0% 0%)`,
                textShadow: `0 0 44px rgba(255,97,0,${
                  0.45 * enter(frame, B.solution + 6, 44)
                })`,
              }}
            >
              {item.solution}
            </div>

            <div style={{width: 128, marginBottom: 26}}>
              <LineSweep delay={B.solution + 14} duration={44} height={2} outAt={B.out} />
            </div>

            <Paragraph
              text={item.detail}
              delay={B.detail}
              lineStagger={6}
              style={{
                fontSize: type.body * 1.12,
                fontWeight: 400,
                color: palette.textMid,
                lineHeight: 1.92,
                letterSpacing: tracking.body,
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 段落結語：核心訴求 */
const ClosingStatement: React.FC = () => {
  const frame = useCurrentFrame();
  const p = enter(frame, 10, 56, ease.outExpo);
  const chars = Array.from(barriersSection.closing);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: layout.marginX + 60,
        paddingRight: layout.marginX + 60,
      }}
    >
      <div
        style={{
          fontFamily: FONT_LATIN,
          fontSize: type.kicker,
          fontWeight: 600,
          letterSpacing: '0.46em',
          color: palette.primary,
          marginBottom: 34,
          opacity: enter(frame, 0, 40, ease.outQuint),
        }}
      >
        THE CORE PROPOSITION
      </div>

      <div
        style={{
          fontFamily: FONT_TC,
          fontSize: type.title * 1.16,
          fontWeight: 700,
          color: palette.textHi,
          lineHeight: 1.6,
          textAlign: 'center',
          letterSpacing: '0.02em',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {chars.map((c, i) => {
          const cp = enter(frame, 14 + i * 2.6, 40, ease.outExpo);
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                whiteSpace: 'pre',
                opacity: cp,
                transform: `translateY(${(1 - cp) * 22}px)`,
                filter: cp < 0.98 ? `blur(${(1 - cp) * 8}px)` : undefined,
                textShadow: `0 0 40px rgba(255,97,0,${0.3 * cp})`,
              }}
            >
              {c}
            </span>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 44,
          width: 300,
          height: 2,
          transformOrigin: 'center',
          transform: `scaleX(${p})`,
          background: `linear-gradient(90deg, rgba(255,97,0,0) 0%, ${palette.primary} 50%, rgba(255,97,0,0) 100%)`,
          boxShadow: `0 0 20px ${palette.glow}`,
        }}
      />
    </AbsoluteFill>
  );
};

export const S2_Barriers: React.FC = () => {
  const D = SCENE.barriers;
  const titleEnd = BARRIER_BEATS.titleCard;

  return (
    <AbsoluteFill style={{backgroundColor: palette.deep}}>
      <Camera move="trackRight" duration={D} depth={0.4} intensity={0.85}>
        <Defocus blur={0}>
          <Backdrop variant="tension" fadeIn={30} />
        </Defocus>
      </Camera>

      <Camera move="panRight" duration={D} depth={1} intensity={0.55}>
        {/* 段落標題卡 */}
        <Sequence durationInFrames={titleEnd + 30} layout="none">
          <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
            <SectionTitle
              kicker={barriersSection.kicker}
              title={barriersSection.title}
              delay={6}
              outAt={titleEnd - 34}
            />
          </AbsoluteFill>
        </Sequence>

        {/* 三張關卡卡片 */}
        {barriers.map((item, i) => (
          <Sequence
            key={item.no}
            from={titleEnd + i * CARD}
            durationInFrames={CARD}
            layout="none"
          >
            <BarrierCard item={item} />
          </Sequence>
        ))}

        {/* 核心訴求 */}
        <Sequence
          from={titleEnd + barriers.length * CARD}
          durationInFrames={BARRIER_BEATS.closing}
          layout="none"
        >
          <ClosingStatement />
        </Sequence>
      </Camera>
    </AbsoluteFill>
  );
};
