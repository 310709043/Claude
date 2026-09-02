import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {ease, enter, exit, life} from '../anim';
import {Backdrop} from '../components/Backdrop';
import {Camera, Defocus} from '../components/Camera';
import {SectionTitle} from '../components/Atoms';
import {LineSweep} from '../components/KineticText';
import {industries, industriesSection} from '../content';
import {FONT_LATIN, FONT_TC} from '../fonts';
import {layout, palette, tracking, type} from '../theme';
import {INDUSTRY_BEATS, SCENE} from '../timeline';

/* ============================================================
 *  第 4 段｜橫跨五大產業的全場景 AI 賦能（23 秒）
 * ------------------------------------------------------------
 *  每項僅 3.5 秒，節奏必須極快而不慌亂：
 *  產業名以大字塊瞬間定格，四個應用點如刀切般依序滑入。
 *  背景巨型序號作為水印，提供「章節推進」的方位感。
 * ============================================================ */

const ITEM = INDUSTRY_BEATS.item;
const I = {
  watermark: 0,
  latin: 2,
  name: 8,
  line: 22,
  points: 30,
  pointStagger: 11,
  out: ITEM - 44,
} as const;

const IndustryItem: React.FC<{item: (typeof industries)[number]}> = ({item}) => {
  const frame = useCurrentFrame();
  const alive = life(frame, {in: 0, inDur: 1, out: I.out, outDur: 30});
  const namep = enter(frame, I.name, 44, ease.outExpo);

  return (
    <AbsoluteFill style={{opacity: alive}}>
      {/* 巨型序號水印 */}
      <div
        style={{
          position: 'absolute',
          right: layout.marginX - 78,
          top: '50%',
          transform: `translateY(-50%) translateX(${
            (1 - enter(frame, I.watermark, 60, ease.outExpo)) * 60
          }px)`,
          fontFamily: FONT_LATIN,
          fontSize: 396,
          fontWeight: 900,
          lineHeight: 0.8,
          letterSpacing: '-0.06em',
          color: 'transparent',
          WebkitTextStroke: `2px ${palette.edge}`,
          opacity: enter(frame, I.watermark, 60, ease.outQuint) * 0.55,
        }}
      >
        {item.no}
      </div>

      <AbsoluteFill
        style={{
          paddingLeft: layout.marginX,
          paddingRight: layout.marginX,
          justifyContent: 'center',
        }}
      >
        {/* 英文產業別 */}
        <div
          style={{
            fontFamily: FONT_LATIN,
            fontSize: type.kicker,
            fontWeight: 600,
            letterSpacing: `${interpolate(
              enter(frame, I.latin, 40, ease.outQuint),
              [0, 1],
              [0.8, 0.44]
            )}em`,
            color: palette.primary,
            opacity: enter(frame, I.latin, 40, ease.outQuint),
            marginBottom: 20,
          }}
        >
          {item.latin}
        </div>

        {/* 中文產業名 —— 逐字自下方切入 */}
        <div
          style={{
            fontFamily: FONT_TC,
            fontSize: type.display * 1.16,
            fontWeight: 900,
            color: palette.textHi,
            letterSpacing: tracking.display,
            lineHeight: 1.06,
            display: 'flex',
            marginBottom: 26,
          }}
        >
          {Array.from(item.name).map((c, i) => {
            const p = enter(frame, I.name + i * 3, 40, ease.outExpo);
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  whiteSpace: 'pre',
                  opacity: p,
                  transform: `translateY(${(1 - p) * 44}px)`,
                  filter: p < 0.98 ? `blur(${(1 - p) * 12}px)` : undefined,
                  textShadow: `0 0 54px rgba(255,97,0,${0.26 * p})`,
                }}
              >
                {c}
              </span>
            );
          })}
        </div>

        <div style={{width: 260, marginBottom: 40}}>
          <LineSweep delay={I.line} duration={46} height={2} outAt={I.out} />
        </div>

        {/* 四個應用點：兩欄，如刀切般自左滑入 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '22px 68px',
            maxWidth: 1000,
          }}
        >
          {item.points.map((pt, i) => {
            const d = I.points + i * I.pointStagger;
            const p = enter(frame, d, 40, ease.outExpo);
            const o = exit(frame, I.out + i * 2, 20);
            return (
              <div
                key={pt}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  opacity: p * o,
                  transform: `translateX(${(1 - p) * -40}px)`,
                  clipPath: `inset(0% ${(1 - p) * 100}% 0% 0%)`,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    flex: '0 0 auto',
                    background: palette.primary,
                    transform: `rotate(45deg) scale(${interpolate(p, [0, 1], [0, 1])})`,
                    boxShadow: `0 0 12px ${palette.glow}`,
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT_TC,
                    fontSize: type.body * 1.2,
                    fontWeight: 500,
                    color: 'rgba(251,247,244,0.90)',
                    letterSpacing: '0.03em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {pt}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 收束：五大產業並列 */
const IndustryOutro: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 0}}>
        {industries.map((ind, i) => {
          const p = enter(frame, i * 7, 42, ease.outExpo);
          return (
            <React.Fragment key={ind.no}>
              {i > 0 && (
                <div
                  style={{
                    width: 1,
                    height: 46,
                    margin: '0 34px',
                    background: palette.edge,
                    opacity: enter(frame, i * 7 - 3, 36),
                    transformOrigin: 'center',
                    transform: `scaleY(${enter(frame, i * 7 - 3, 36)})`,
                  }}
                />
              )}
              <div
                style={{
                  fontFamily: FONT_TC,
                  fontSize: type.title * 0.92,
                  fontWeight: 700,
                  color: palette.textHi,
                  letterSpacing: '0.04em',
                  opacity: p,
                  transform: `translateY(${(1 - p) * 22}px)`,
                  textShadow: `0 0 34px rgba(255,97,0,${0.24 * p})`,
                  whiteSpace: 'nowrap',
                }}
              >
                {ind.name}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 44,
          fontFamily: FONT_TC,
          fontSize: type.subtitle,
          fontWeight: 500,
          color: palette.primary,
          letterSpacing: '0.16em',
          opacity: enter(frame, 42, 46, ease.outQuint),
          transform: `translateY(${(1 - enter(frame, 42, 46)) * 16}px)`,
          textShadow: `0 0 30px ${palette.glow}`,
        }}
      >
        一套架構，適配全場景
      </div>
    </AbsoluteFill>
  );
};

export const S4_Industries: React.FC = () => {
  const D = SCENE.industries;
  const titleEnd = INDUSTRY_BEATS.titleCard;

  return (
    <AbsoluteFill style={{backgroundColor: palette.deep}}>
      <Camera move="panLeft" duration={D} depth={0.35} intensity={1}>
        <Defocus blur={0}>
          <Backdrop variant="field" fadeIn={26} />
        </Defocus>
      </Camera>

      <Camera move="trackRight" duration={D} depth={1} intensity={0.34}>
        <Sequence durationInFrames={titleEnd + 24} layout="none">
          <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
            <SectionTitle
              kicker={industriesSection.kicker}
              title={industriesSection.title}
              delay={2}
              outAt={titleEnd - 28}
            />
          </AbsoluteFill>
        </Sequence>

        {industries.map((item, i) => (
          <Sequence
            key={item.no}
            from={titleEnd + i * ITEM}
            durationInFrames={ITEM}
            layout="none"
          >
            <IndustryItem item={item} />
          </Sequence>
        ))}

        <Sequence
          from={titleEnd + industries.length * ITEM}
          durationInFrames={INDUSTRY_BEATS.outro}
          layout="none"
        >
          <IndustryOutro />
        </Sequence>
      </Camera>
    </AbsoluteFill>
  );
};
