import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {ease} from './anim';
import {AUDIO} from './audio';
import {CinematicGrade} from './components/CinematicGrade';
import {Stage} from './components/Stage';
import {irisZoom, lightSweep, shutterBars} from './transitions';
import {S1_Hook} from './scenes/S1_Hook';
import {S2_Barriers} from './scenes/S2_Barriers';
import {S3_Capabilities} from './scenes/S3_Capabilities';
import {S4_Industries} from './scenes/S4_Industries';
import {S5_Value} from './scenes/S5_Value';
import {S6_CTA} from './scenes/S6_CTA';
import {FONT_LATIN, FontGate} from './fonts';
import {layout, palette} from './theme';
import {SCENE, TOTAL_FRAMES, TRANSITION} from './timeline';

/* ============================================================
 *  主時間軸
 * ------------------------------------------------------------
 *  轉場語彙的分配邏輯：
 *   1→2  lightSweep  光刃橫掃（進入問題論述）
 *   2→3  shutterBars 機械百葉（進入技術規格，最「硬」的一段）
 *   3→4  irisZoom    光圈變焦（從技術跳到應用，敘事跨度最大）
 *   4→5  lightSweep  光刃反向（回收，帶向結論）
 *   5→6  irisZoom    光圈變焦（推向最終定格）
 * ============================================================ */

/** 全片持續的右上角品牌浮水印（第 2–5 段） */
const Watermark: React.FC = () => {
  const frame = useCurrentFrame();
  const start = SCENE.hook - TRANSITION.hookToBarriers;
  const end = TOTAL_FRAMES - SCENE.cta;
  const o =
    interpolate(frame, [start, start + 40], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: ease.outQuint,
    }) *
    interpolate(frame, [end - 50, end], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  return (
    <div
      style={{
        position: 'absolute',
        top: layout.marginY - 44,
        right: layout.marginX,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        opacity: o * 0.42,
      }}
    >
      <div
        style={{
          width: 5,
          height: 5,
          background: palette.primary,
          transform: 'rotate(45deg)',
          boxShadow: `0 0 8px ${palette.glow}`,
        }}
      />
      <div
        style={{
          fontFamily: FONT_LATIN,
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: '0.36em',
          color: palette.textMid,
        }}
      >
        TAIPBX
      </div>
    </div>
  );
};

/** 配樂軌（無聲版時不掛載） */
const Score: React.FC = () => {
  if (!AUDIO.enabled) return null;
  return (
    <Audio
      src={staticFile(AUDIO.file)}
      startFrom={AUDIO.offsetInFrames}
      volume={(f) =>
        AUDIO.volume *
        interpolate(f, [0, AUDIO.fadeInFrames], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }) *
        interpolate(
          f,
          [TOTAL_FRAMES - AUDIO.fadeOutFrames, TOTAL_FRAMES],
          [1, 0],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
        )
      }
    />
  );
};

export const Film: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: palette.void}}>
      <FontGate>
      <Score />

      <Stage>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={SCENE.hook}>
            <S1_Hook />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={lightSweep({direction: 'left-to-right'})}
            timing={linearTiming({
              durationInFrames: TRANSITION.hookToBarriers,
              easing: ease.inOutCine,
            })}
          />

          <TransitionSeries.Sequence durationInFrames={SCENE.barriers}>
            <S2_Barriers />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={shutterBars({bars: 7})}
            timing={linearTiming({
              durationInFrames: TRANSITION.barriersToCapabilities,
              easing: ease.inOutCine,
            })}
          />

          <TransitionSeries.Sequence durationInFrames={SCENE.capabilities}>
            <S3_Capabilities />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={irisZoom()}
            timing={linearTiming({
              durationInFrames: TRANSITION.capabilitiesToIndustries,
              easing: ease.inOutCine,
            })}
          />

          <TransitionSeries.Sequence durationInFrames={SCENE.industries}>
            <S4_Industries />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={lightSweep({direction: 'right-to-left'})}
            timing={linearTiming({
              durationInFrames: TRANSITION.industriesToValue,
              easing: ease.inOutCine,
            })}
          />

          <TransitionSeries.Sequence durationInFrames={SCENE.value}>
            <S5_Value />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={irisZoom()}
            timing={linearTiming({
              durationInFrames: TRANSITION.valueToCta,
              easing: ease.inOutCine,
            })}
          />

          <TransitionSeries.Sequence durationInFrames={SCENE.cta}>
            <S6_CTA />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        <Watermark />
      </Stage>

      {/* 電影調色與底片後製 —— 疊在所有畫面之上 */}
      <CinematicGrade />
      </FontGate>
    </AbsoluteFill>
  );
};
