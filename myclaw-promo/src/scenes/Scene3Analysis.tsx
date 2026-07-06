import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../theme';
import {ParticleBackground} from '../components/ParticleBackground';
import {DataFlow} from '../components/DataFlow';
import {CameraRig, SceneFade} from '../components/CameraRig';
import {AppWindow, StatusPill} from '../components/AppWindow';
import {ProductBadge} from '../components/BrandLogos';
import {LobsterAssistant} from '../components/LobsterAssistant';
import {AIProcessLog} from '../components/AIThinking';
import {GlassCard} from '../components/GlassCard';
import {KeywordChip} from '../components/Tag';
import {NumberCount, ProgressBar} from '../components/NumberCount';
import {DonutChart} from '../components/KPIChart';
import {progress} from '../easings';

const VOICE_AT = 10;
const ANALYZE_AT = 58;

/** Host voice-command bubble above the lobster. */
const VoiceCommand: React.FC = () => {
  const frame = useCurrentFrame();
  const p = progress(frame, VOICE_AT, VOICE_AT + 16);
  const text = '龍蝦,分析這位客戶的需求。';
  const chars = Math.max(0, Math.floor((frame - VOICE_AT - 8) / 1.6));
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 18}px) scale(${0.92 + 0.08 * p})`,
        padding: '18px 30px',
        borderRadius: 22,
        borderBottomLeftRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${COLORS.borderStrong}`,
        boxShadow: '0 16px 48px rgba(0,0,0,0.45)',
        fontFamily: FONT_FAMILY,
        fontSize: 25,
        fontWeight: 700,
        color: COLORS.textPrimary,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <span style={{fontSize: 21}}>🎙️</span>
      {text.slice(0, chars)}
      {chars < text.length ? (
        <span
          style={{
            width: 3,
            height: 24,
            backgroundColor: COLORS.orange,
            opacity: Math.sin(frame * 0.5) > 0 ? 1 : 0.2,
          }}
        />
      ) : null}
    </div>
  );
};

const PROFILE_ROWS: {
  label: string;
  labelEn: string;
  at: number;
  content: (at: number) => React.ReactNode;
}[] = [
  {
    label: '客戶意圖',
    labelEn: 'CUSTOMER INTENT',
    at: ANALYZE_AT + 34,
    content: (at) => (
      <div style={{display: 'flex', gap: 9, flexWrap: 'wrap'}}>
        <KeywordChip label="評估 AI 導入" enterAt={at + 6} fontSize={14.5} />
        <KeywordChip label="尋求系統整合" enterAt={at + 14} fontSize={14.5} color={COLORS.blue} />
      </div>
    ),
  },
  {
    label: '痛點分析',
    labelEn: 'PAIN POINTS',
    at: ANALYZE_AT + 66,
    content: (at) => (
      <div style={{display: 'flex', gap: 9, flexWrap: 'wrap'}}>
        <KeywordChip label="客服量能不足" enterAt={at + 6} fontSize={14.5} color={COLORS.red} />
        <KeywordChip label="資料不可外流" enterAt={at + 14} fontSize={14.5} color={COLORS.red} />
      </div>
    ),
  },
  {
    label: '購買訊號',
    labelEn: 'BUYING SIGNALS',
    at: ANALYZE_AT + 98,
    content: (at) => (
      <div style={{display: 'flex', gap: 9, flexWrap: 'wrap'}}>
        <KeywordChip label="主動詢問 POC" enterAt={at + 6} fontSize={14.5} color={COLORS.green} />
        <KeywordChip label="預算已編列" enterAt={at + 14} fontSize={14.5} color={COLORS.green} />
        <KeywordChip label="時程:下季" enterAt={at + 22} fontSize={14.5} color={COLORS.green} />
      </div>
    ),
  },
  {
    label: '決策角色',
    labelEn: 'DECISION MAKER',
    at: ANALYZE_AT + 134,
    content: (at) => {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontFamily: FONT_FAMILY,
          }}
        >
          <KeywordChip label="陳經理 · IT 部門主管" enterAt={at + 6} fontSize={14.5} color={COLORS.amber} icon="👤" />
          <KeywordChip label="具採購決策權" enterAt={at + 16} fontSize={14.5} color={COLORS.amber} />
        </div>
      );
    },
  },
];

/** Customer profile builder panel with staged AI-computed rows. */
const ProfilePanel: React.FC = () => {
  const frame = useCurrentFrame();
  const scoresAt = ANALYZE_AT + 170;
  const scoresP = progress(frame, scoresAt, scoresAt + 16);

  return (
    <AppWindow
      title="MyClaw AI · Customer Profile"
      badge={<ProductBadge name="MyClaw AI" accent={COLORS.orange} size={12} />}
      status={<StatusPill label="AI COMPUTING" color={COLORS.orange} />}
      enterAt={ANALYZE_AT - 10}
      width={860}
      height={660}
    >
      <div style={{display: 'flex', height: '100%'}}>
        {/* Profile rows */}
        <div
          style={{
            flex: 1,
            padding: '26px 30px',
            display: 'flex',
            flexDirection: 'column',
            gap: 21,
            borderRight: `1px solid ${COLORS.border}`,
          }}
        >
          {PROFILE_ROWS.map((row, i) => {
            const p = progress(frame, row.at, row.at + 14);
            return (
              <div
                key={i}
                style={{
                  opacity: p,
                  transform: `translateY(${(1 - p) * 16}px)`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 9,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_FAMILY,
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 10,
                  }}
                >
                  <span style={{fontSize: 16.5, fontWeight: 800, color: COLORS.textPrimary}}>
                    {row.label}
                  </span>
                  <span style={{fontSize: 11, letterSpacing: 1.5, color: COLORS.textTertiary}}>
                    {row.labelEn}
                  </span>
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: 11,
                      color: COLORS.green,
                      fontWeight: 700,
                      opacity: progress(frame, row.at + 24, row.at + 34),
                    }}
                  >
                    ✓ ANALYZED
                  </span>
                </div>
                {row.content(row.at)}
              </div>
            );
          })}

          {/* Profile completion */}
          <div style={{marginTop: 'auto', fontFamily: FONT_FAMILY}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 12.5,
                color: COLORS.textTertiary,
                marginBottom: 7,
              }}
            >
              <span>PROFILE COMPLETENESS</span>
              <NumberCount
                to={96}
                startAt={ANALYZE_AT + 30}
                duration={160}
                suffix="%"
                fontSize={13}
                fontWeight={700}
                color={COLORS.orange}
              />
            </div>
            <ProgressBar value={96} startAt={ANALYZE_AT + 30} duration={160} width={480} height={6} />
          </div>
        </div>

        {/* Score rail */}
        <div
          style={{
            width: 262,
            padding: 26,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 26,
            opacity: scoresP,
            fontFamily: FONT_FAMILY,
          }}
        >
          <div
            style={{
              fontSize: 12.5,
              fontWeight: 800,
              letterSpacing: 2,
              color: COLORS.textTertiary,
              alignSelf: 'flex-start',
            }}
          >
            AI 評分 · SCORING
          </div>
          <DonutChart value={87} size={150} startAt={scoresAt + 8} label="Opportunity Score" />
          <DonutChart
            value={92}
            size={150}
            startAt={scoresAt + 26}
            label="AI Confidence"
            color={COLORS.blue}
          />
        </div>
      </div>
    </AppWindow>
  );
};

/** 第三幕 32–46s:主持人下指令,MyClaw AI 建立完整客戶輪廓。 */
export const Scene3Analysis: React.FC = () => {
  const frame = useCurrentFrame();
  const lobsterMode = frame < ANALYZE_AT ? 'idle' : 'thinking';

  return (
    <SceneFade fadeIn={12} fadeOut={16}>
      <ParticleBackground count={44} energy={0.62} seed={3} />
      <DataFlow streams={7} opacity={0.5} seed={11} />
      <CameraRig from={{scale: 1.0, x: -14}} to={{scale: 1.045, x: 6}}>
        <AbsoluteFill
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 40,
          }}
        >
          {/* Lobster assistant + host command */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 30,
              width: 480,
            }}
          >
            <VoiceCommand />
            <LobsterAssistant size={300} enterAt={0} mode={lobsterMode} />
            <GlassCard enterAt={ANALYZE_AT + 4} padding={20} radius={18} width={400}>
              <AIProcessLog
                steps={[
                  '解析逐字稿語意',
                  '比對歷史客戶輪廓',
                  '偵測購買訊號',
                  '計算商機分數',
                ]}
                startAt={ANALYZE_AT + 10}
                interval={44}
                fontSize={14.5}
                width={352}
              />
            </GlassCard>
          </div>

          <ProfilePanel />
        </AbsoluteFill>
      </CameraRig>
    </SceneFade>
  );
};
