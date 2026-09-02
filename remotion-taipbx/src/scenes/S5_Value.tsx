import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {ease, enter, exit} from '../anim';
import {Backdrop} from '../components/Backdrop';
import {Camera, Defocus} from '../components/Camera';
import {SectionTitle} from '../components/Atoms';
import {LineSweep, Paragraph} from '../components/KineticText';
import {values, valueSection} from '../content';
import {FONT_LATIN, FONT_TC} from '../fonts';
import {layout, palette, tracking, type} from '../theme';
import {SCENE, VALUE_BEATS} from '../timeline';

/* ============================================================
 *  第 5 段｜一次投資、長期增值（14.3 秒）
 * ------------------------------------------------------------
 *  情感升華段。四項價值以 2×2 網格漸次落位，
 *  落位後畫面不再切換，讓觀眾在緩慢推鏡中「看完整體」——
 *  這是全片唯一一次讓資訊同時並存的構圖，象徵「整合」。
 * ============================================================ */

const ValueCard: React.FC<{
  item: (typeof values)[number];
  delay: number;
}> = ({item, delay}) => {
  const frame = useCurrentFrame();
  const p = enter(frame, delay, 50, ease.outExpo);
  // 落位後持續的極輕微發光呼吸，避免畫面「死掉」
  const breathe = 0.5 + 0.5 * Math.sin((frame - delay) / 46);

  return (
    <div
      style={{
        position: 'relative',
        padding: '32px 36px 34px 38px',
        background: `linear-gradient(150deg, rgba(36,34,32,0.62) 0%, rgba(16,14,13,0.34) 100%)`,
        border: `1px solid ${palette.edgeSoft}`,
        borderRadius: 3,
        opacity: p,
        transform: `translateY(${(1 - p) * 34}px)`,
        clipPath: `inset(0% 0% ${(1 - p) * 100}% 0%)`,
        boxShadow: `0 26px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* 左緣品牌光條 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          transformOrigin: 'top',
          transform: `scaleY(${enter(frame, delay + 8, 44, ease.outExpo)})`,
          background: `linear-gradient(to bottom, ${palette.primary}, rgba(255,97,0,0.05))`,
          boxShadow: `0 0 ${12 + breathe * 8}px ${palette.glow}`,
        }}
      />

      <div
        style={{
          fontFamily: FONT_LATIN,
          fontSize: type.caption * 1.06,
          fontWeight: 800,
          letterSpacing: '0.28em',
          color: palette.primary,
          opacity: enter(frame, delay + 6, 38, ease.outQuint),
          marginBottom: 14,
        }}
      >
        {item.no}
      </div>

      <div
        style={{
          fontFamily: FONT_TC,
          fontSize: type.title * 0.86,
          fontWeight: 900,
          color: palette.textHi,
          letterSpacing: tracking.title,
          lineHeight: 1.24,
          marginBottom: 16,
          clipPath: `inset(0% ${(1 - enter(frame, delay + 10, 46, ease.outExpo)) * 100}% 0% 0%)`,
          textShadow: `0 0 34px rgba(255,97,0,${0.18 + breathe * 0.06})`,
        }}
      >
        {item.title}
      </div>

      <div style={{width: 74, marginBottom: 18}}>
        <LineSweep delay={delay + 18} duration={40} height={1.5} />
      </div>

      <Paragraph
        text={item.body}
        delay={delay + 22}
        lineStagger={5}
        style={{
          fontSize: type.body * 0.99,
          fontWeight: 400,
          color: palette.textMid,
          lineHeight: 1.9,
          letterSpacing: tracking.body,
        }}
      />
    </div>
  );
};

export const S5_Value: React.FC = () => {
  const D = SCENE.value;
  const titleEnd = VALUE_BEATS.titleCard;

  return (
    <AbsoluteFill style={{backgroundColor: palette.deep}}>
      <Camera move="pushIn" duration={D} depth={0.32} intensity={1}>
        <Defocus blur={0}>
          <Backdrop variant="summit" fadeIn={30} />
        </Defocus>
      </Camera>

      <Camera move="pushIn" duration={D} depth={1} intensity={0.3}>
        {/* 標題卡 */}
        <Sequence durationInFrames={titleEnd + 24} layout="none">
          <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
            <SectionTitle
              kicker={valueSection.kicker}
              title={valueSection.title}
              subtitle={valueSection.subtitle}
              delay={0}
              outAt={titleEnd - 26}
            />
          </AbsoluteFill>
        </Sequence>

        {/* 2×2 價值網格 */}
        <Sequence from={titleEnd} durationInFrames={D - titleEnd} layout="none">
          <ValueGrid />
        </Sequence>
      </Camera>
    </AbsoluteFill>
  );
};

const ValueGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const headerP = enter(frame, 0, 44, ease.outExpo);

  return (
    <AbsoluteFill
      style={{
        paddingLeft: layout.marginX,
        paddingRight: layout.marginX,
        paddingTop: 96,
        paddingBottom: 96,
        justifyContent: 'center',
      }}
    >
      {/* 段落表頭（標題卡收起後保留的錨點） */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 24,
          marginBottom: 40,
          opacity: headerP,
          transform: `translateY(${(1 - headerP) * -14}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT_TC,
            fontSize: type.title * 0.96,
            fontWeight: 900,
            color: palette.textHi,
            letterSpacing: tracking.title,
          }}
        >
          {valueSection.title}
        </div>
        <div
          style={{
            fontFamily: FONT_LATIN,
            fontSize: type.kicker,
            fontWeight: 600,
            letterSpacing: '0.4em',
            color: palette.primary,
            opacity: enter(frame, 10, 40, ease.outQuint),
          }}
        >
          {valueSection.kicker}
        </div>
        <div
          style={{
            flex: 1,
            height: 1,
            background: `linear-gradient(90deg, ${palette.edge} 0%, rgba(255,97,0,0) 100%)`,
            transformOrigin: 'left',
            transform: `scaleX(${enter(frame, 14, 52, ease.outExpo)})`,
          }}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px 34px',
        }}
      >
        {values.map((v, i) => (
          <ValueCard key={v.no} item={v} delay={VALUE_BEATS.gridIn + i * VALUE_BEATS.itemStagger} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
