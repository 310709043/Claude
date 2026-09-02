import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {ease, enter, exit, life} from '../anim';
import {Backdrop} from '../components/Backdrop';
import {Camera, Defocus} from '../components/Camera';
import {Numeral, SectionTitle} from '../components/Atoms';
import {Icon, IconName} from '../components/Icons';
import {LineSweep, Paragraph} from '../components/KineticText';
import {capabilities, capabilitiesSection} from '../content';
import {FONT_LATIN, FONT_TC} from '../fonts';
import {layout, palette, tracking, type} from '../theme';
import {CAPABILITY_BEATS, SCENE} from '../timeline';

/* ============================================================
 *  第 3 段｜六大核心技術能力（32.7 秒）
 * ------------------------------------------------------------
 *  版面策略：左側巨型數據焦點（100% / ×4 / 0 …），
 *  右側為技術說明。每項的攝影機方向交替，避免六項看起來像
 *  同一張投影片換字。底部持續顯示 6 格進度指示器。
 * ============================================================ */

const ITEM = CAPABILITY_BEATS.item;
const C = {
  figure: 0,
  icon: 10,
  numeral: 4,
  title: 22,
  body: 40,
  out: ITEM - 52,
} as const;

/** 巨型數據焦點 —— 每項的視覺主體 */
const Figure: React.FC<{value: string; label: string}> = ({value, label}) => {
  const frame = useCurrentFrame();
  const p = enter(frame, C.figure, 52, ease.outExpo);
  const o = exit(frame, C.out, 26);
  const glow = enter(frame, C.figure + 12, 60, ease.outQuint);

  return (
    <div style={{opacity: o}}>
      <div
        style={{
          fontFamily: FONT_LATIN,
          fontSize: 178,
          fontWeight: 900,
          letterSpacing: '-0.045em',
          lineHeight: 0.94,
          color: palette.textHi,
          opacity: p,
          transform: `translateY(${(1 - p) * 34}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
          filter: p < 0.99 ? `blur(${(1 - p) * 16}px)` : undefined,
          textShadow: `0 0 ${52 * glow}px rgba(255,97,0,${0.55 * glow}), 0 0 ${
            130 * glow
          }px rgba(255,97,0,${0.24 * glow})`,
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </div>

      <div style={{width: 148, marginTop: 22, marginBottom: 20}}>
        <LineSweep delay={C.figure + 20} duration={46} height={2} />
      </div>

      <div
        style={{
          fontFamily: FONT_TC,
          fontSize: type.subtitle * 0.76,
          fontWeight: 500,
          letterSpacing: '0.26em',
          color: palette.primary,
          opacity: enter(frame, C.figure + 26, 42, ease.outQuint),
          transform: `translateY(${(1 - enter(frame, C.figure + 26, 42)) * 12}px)`,
        }}
      >
        {label}
      </div>
    </div>
  );
};

const CapabilityItem: React.FC<{
  item: (typeof capabilities)[number];
  index: number;
}> = ({item, index}) => {
  const frame = useCurrentFrame();
  const alive = life(frame, {in: 0, inDur: 1, out: C.out + 20, outDur: 32});
  const iconProgress = enter(frame, C.icon, 56, ease.outQuint);
  const flip = index % 2 === 1;

  return (
    <AbsoluteFill style={{opacity: alive}}>
      <AbsoluteFill
        style={{
          paddingLeft: layout.marginX,
          paddingRight: layout.marginX,
          paddingBottom: 92,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: flip ? 'row-reverse' : 'row',
          gap: 128,
        }}
      >
        {/* 巨型數據焦點 */}
        <div style={{flex: '0 0 auto', minWidth: 480, textAlign: flip ? 'right' : 'left'}}>
          <div style={{display: 'inline-block', textAlign: 'left'}}>
            <Figure value={item.figure} label={item.figureLabel} />
          </div>
        </div>

        {/* 技術說明 */}
        <div style={{flex: 1, maxWidth: 720}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 26, marginBottom: 30}}>
            <div
              style={{
                opacity: enter(frame, C.icon, 30, ease.outQuint) * exit(frame, C.out, 20),
                transform: `scale(${interpolate(
                  enter(frame, C.icon, 44, ease.outExpo),
                  [0, 1],
                  [0.7, 1]
                )})`,
              }}
            >
              <Icon name={item.icon as IconName} size={62} progress={iconProgress} />
            </div>
            <Numeral value={item.no} delay={C.numeral} outAt={C.out} size={72} />
          </div>

          <div
            style={{
              fontFamily: FONT_TC,
              fontSize: type.title * 1.08,
              fontWeight: 900,
              color: palette.textHi,
              letterSpacing: tracking.title,
              lineHeight: 1.24,
              marginBottom: 26,
              opacity: exit(frame, C.out, 24),
              clipPath: `inset(0% ${
                (1 - enter(frame, C.title, 48, ease.outExpo)) * 100
              }% 0% 0%)`,
              transform: `translateY(${(1 - enter(frame, C.title, 44)) * 20}px)`,
              textShadow: '0 0 44px rgba(255,97,0,0.22)',
            }}
          >
            {item.title}
          </div>

          <div style={{opacity: exit(frame, C.out, 22)}}>
            <Paragraph
              text={item.body}
              delay={C.body}
              lineStagger={6}
              style={{
                fontSize: type.body * 1.14,
                fontWeight: 400,
                color: palette.textMid,
                lineHeight: 1.95,
                letterSpacing: tracking.body,
                maxWidth: 660,
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 底部進度指示器：6 格，當前項目亮起並填滿 */
const StepIndicator: React.FC<{total: number; startAt: number; itemLength: number}> = ({
  total,
  startAt,
  itemLength,
}) => {
  const frame = useCurrentFrame();
  const visible = enter(frame, startAt - 20, 40, ease.outQuint);
  const fadeOut = exit(frame, startAt + total * itemLength - 10, 30);

  return (
    <div
      style={{
        position: 'absolute',
        left: layout.marginX,
        right: layout.marginX,
        bottom: 74,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        opacity: visible * fadeOut,
      }}
    >
      {new Array(total).fill(0).map((_, i) => {
        const s = startAt + i * itemLength;
        const fill = interpolate(frame, [s, s + itemLength], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const active = frame >= s && frame < s + itemLength;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: 2,
              background: palette.edgeSoft,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transformOrigin: 'left',
                transform: `scaleX(${fill})`,
                background: palette.primary,
                boxShadow: active ? `0 0 12px ${palette.glow}` : undefined,
              }}
            />
          </div>
        );
      })}
      <div
        style={{
          fontFamily: FONT_LATIN,
          fontSize: type.caption * 0.86,
          fontWeight: 600,
          letterSpacing: '0.22em',
          color: palette.textLow,
          marginLeft: 12,
          minWidth: 76,
          textAlign: 'right',
        }}
      >
        {String(
          Math.min(total, Math.max(1, Math.floor((frame - startAt) / itemLength) + 1))
        ).padStart(2, '0')}
        {' / '}
        {String(total).padStart(2, '0')}
      </div>
    </div>
  );
};

/** 收束：六項圖標匯聚成陣列，象徵「一體」 */
const CapabilityOutro: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '54px 108px',
          marginBottom: 58,
        }}
      >
        {capabilities.map((c, i) => {
          const d = i * 5;
          const p = enter(frame, d, 44, ease.outExpo);
          return (
            <div
              key={c.no}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 14,
                opacity: p,
                transform: `translateY(${(1 - p) * 26}px) scale(${interpolate(
                  p,
                  [0, 1],
                  [0.82, 1]
                )})`,
              }}
            >
              <Icon name={c.icon as IconName} size={54} progress={p} strokeWidth={2} />
              <div
                style={{
                  fontFamily: FONT_TC,
                  fontSize: type.caption * 1.02,
                  fontWeight: 500,
                  color: palette.textMid,
                  letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                }}
              >
                {c.title}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          fontFamily: FONT_TC,
          fontSize: type.title,
          fontWeight: 900,
          color: palette.textHi,
          letterSpacing: tracking.title,
          opacity: enter(frame, 40, 48, ease.outExpo),
          transform: `translateY(${(1 - enter(frame, 40, 48)) * 18}px)`,
          textShadow: '0 0 46px rgba(255,97,0,0.30)',
        }}
      >
        六項能力，整合於一台主機
      </div>
    </AbsoluteFill>
  );
};

export const S3_Capabilities: React.FC = () => {
  const D = SCENE.capabilities;
  const titleEnd = CAPABILITY_BEATS.titleCard;

  return (
    <AbsoluteFill style={{backgroundColor: palette.deep}}>
      <Camera move="craneUp" duration={D} depth={0.35} intensity={0.9}>
        <Defocus blur={0}>
          <Backdrop variant="grid" fadeIn={30} />
        </Defocus>
      </Camera>

      <Camera move="pushIn" duration={D} depth={1} intensity={0.42}>
        <Sequence durationInFrames={titleEnd + 26} layout="none">
          <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
            <SectionTitle
              kicker={capabilitiesSection.kicker}
              title={capabilitiesSection.title}
              subtitle={capabilitiesSection.subtitle}
              delay={4}
              outAt={titleEnd - 30}
            />
          </AbsoluteFill>
        </Sequence>

        {capabilities.map((item, i) => (
          <Sequence
            key={item.no}
            from={titleEnd + i * ITEM}
            durationInFrames={ITEM}
            layout="none"
          >
            <CapabilityItem item={item} index={i} />
          </Sequence>
        ))}

        <Sequence
          from={titleEnd + capabilities.length * ITEM}
          durationInFrames={CAPABILITY_BEATS.outro}
          layout="none"
        >
          <CapabilityOutro />
        </Sequence>
      </Camera>

      <StepIndicator total={capabilities.length} startAt={titleEnd} itemLength={ITEM} />
    </AbsoluteFill>
  );
};
