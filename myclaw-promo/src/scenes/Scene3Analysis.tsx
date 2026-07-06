import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {APP, COLORS, FONT_FAMILY} from '../theme';
import {ParticleBackground} from '../components/ParticleBackground';
import {DataFlow} from '../components/DataFlow';
import {CameraRig, SceneFade} from '../components/CameraRig';
import {
  AppCard,
  AppHeader,
  AppSectionLabel,
  PhoneFrame,
} from '../components/PhoneFrame';
import {LobsterAssistant} from '../components/LobsterAssistant';
import {AIProcessLog} from '../components/AIThinking';
import {GlassCard} from '../components/GlassCard';
import {KeywordChip} from '../components/Tag';
import {NumberCount, ProgressBar} from '../components/NumberCount';
import {DonutChart} from '../components/KPIChart';
import {progress} from '../easings';

const VOICE_AT = 10;
const ANALYZE_AT = 62;

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

type ProfileRow = {
  label: string;
  labelEn: string;
  at: number;
  chips: {text: string; color: string; icon?: string}[];
};

const ROWS: ProfileRow[] = [
  {
    label: '客戶意圖',
    labelEn: 'CUSTOMER INTENT',
    at: ANALYZE_AT + 30,
    chips: [
      {text: '評估 AI 導入', color: APP.orangeDeep},
      {text: '尋求系統整合', color: APP.blue},
    ],
  },
  {
    label: '痛點分析',
    labelEn: 'PAIN POINTS',
    at: ANALYZE_AT + 62,
    chips: [
      {text: '客服量能不足', color: APP.red},
      {text: '資料不可外流', color: APP.red},
    ],
  },
  {
    label: '購買訊號',
    labelEn: 'BUYING SIGNALS',
    at: ANALYZE_AT + 94,
    chips: [
      {text: '主動詢問 POC', color: APP.green},
      {text: '預算已編列', color: APP.green},
      {text: '時程:下季', color: APP.green},
    ],
  },
  {
    label: '決策角色',
    labelEn: 'DECISION MAKER',
    at: ANALYZE_AT + 128,
    chips: [
      {text: '陳經理 · IT 主管', color: '#B07A10', icon: '👤'},
      {text: '具採購決策權', color: '#B07A10'},
    ],
  },
];

/** MyClaw app — customer profile screen assembled by AI. */
const ProfileScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const scoresAt = ANALYZE_AT + 158;

  return (
    <AbsoluteFill style={{backgroundColor: APP.bg, fontFamily: FONT_FAMILY}}>
      <AppHeader title="MyClaw" subtitle="客戶輪廓 · CUSTOMER PROFILE" />
      <div style={{padding: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 10}}>
        {/* Customer header card */}
        <AppCard enterAt={ANALYZE_AT} padding={14}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: APP.orangeTint,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 19,
                fontWeight: 800,
                color: APP.orangeDeep,
              }}
            >
              宏
            </div>
            <div style={{flex: 1}}>
              <div style={{fontSize: 17, fontWeight: 800, color: APP.text}}>宏遠集團</div>
              <div style={{fontSize: 11.5, color: APP.textSub, marginTop: 2}}>
                金融 · 企業服務 · 通話來源 TAIPBX
              </div>
            </div>
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 800,
                color: APP.orange,
                letterSpacing: 0.8,
                opacity: 0.5 + 0.5 * Math.sin(frame * 0.25),
              }}
            >
              ✦ AI 分析中
            </div>
          </div>
          {/* Completeness */}
          <div style={{marginTop: 12}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 10.5,
                color: APP.textFaint,
                marginBottom: 5,
                letterSpacing: 0.8,
              }}
            >
              <span>PROFILE COMPLETENESS</span>
              <NumberCount
                to={96}
                startAt={ANALYZE_AT + 20}
                duration={150}
                suffix="%"
                fontSize={11}
                fontWeight={800}
                color={APP.orangeDeep}
              />
            </div>
            <ProgressBar
              value={96}
              startAt={ANALYZE_AT + 20}
              duration={150}
              width={296}
              height={5}
              color={APP.orange}
              track="#EEEFF4"
            />
          </div>
        </AppCard>

        {/* AI-computed rows */}
        {ROWS.map((row, i) => {
          const p = progress(frame, row.at, row.at + 14);
          return (
            <AppCard key={i} enterAt={row.at} padding={13}>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 8}}>
                <span style={{fontSize: 13.5, fontWeight: 800, color: APP.text}}>
                  {row.label}
                </span>
                <span style={{fontSize: 9, letterSpacing: 1, color: APP.textFaint}}>
                  {row.labelEn}
                </span>
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: 9.5,
                    fontWeight: 800,
                    color: APP.green,
                    opacity: progress(frame, row.at + 22, row.at + 32),
                  }}
                >
                  ✓ ANALYZED
                </span>
              </div>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 9, opacity: Math.max(0.001, p)}}>
                {row.chips.map((c, j) => (
                  <KeywordChip
                    key={j}
                    label={c.text}
                    enterAt={row.at + 6 + j * 8}
                    color={c.color}
                    icon={c.icon}
                    fontSize={11}
                  />
                ))}
              </div>
            </AppCard>
          );
        })}

        {/* Scores */}
        <AppCard enterAt={scoresAt} padding={14}>
          <AppSectionLabel text="AI 評分 · SCORING" icon="📊" />
          <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 10}}>
            <DonutChart
              value={87}
              size={104}
              startAt={scoresAt + 8}
              label="Opportunity"
              color={APP.orange}
              textColor={APP.text}
              subColor={APP.textSub}
              track="#EEEFF4"
              thickness={9}
            />
            <DonutChart
              value={92}
              size={104}
              startAt={scoresAt + 24}
              label="AI Confidence"
              color={APP.blue}
              textColor={APP.text}
              subColor={APP.textSub}
              track="#EEEFF4"
              thickness={9}
            />
          </div>
        </AppCard>
      </div>
    </AbsoluteFill>
  );
};

/** 第三幕 32–46s:主持人下指令,龍蝦 AI 在 App 中建立客戶輪廓。 */
export const Scene3Analysis: React.FC = () => {
  const frame = useCurrentFrame();
  const lobsterMode = frame < ANALYZE_AT ? 'idle' : 'thinking';
  const scoreTileP = progress(frame, ANALYZE_AT + 190, ANALYZE_AT + 210);

  return (
    <SceneFade fadeIn={12} fadeOut={16}>
      <ParticleBackground count={46} energy={0.62} seed={3} />
      <DataFlow streams={7} opacity={0.5} seed={11} />
      <CameraRig from={{scale: 1.0, x: -14}} to={{scale: 1.045, x: 6}}>
        <AbsoluteFill
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 90,
          }}
        >
          {/* Lobster assistant + host command + process log */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 28,
              width: 500,
            }}
          >
            <VoiceCommand />
            <LobsterAssistant size={290} enterAt={0} mode={lobsterMode} />
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

          {/* Phone with profile screen */}
          <div style={{position: 'relative'}}>
            <PhoneFrame width={390} enterAt={ANALYZE_AT - 16} tilt={-6}>
              <ProfileScreen />
            </PhoneFrame>

            {/* Floating stage score tile */}
            <div
              style={{
                position: 'absolute',
                right: -210,
                top: '30%',
                opacity: scoreTileP,
                transform: `translateX(${(1 - scoreTileP) * 30}px)`,
              }}
            >
              <GlassCard enterAt={ANALYZE_AT + 190} padding={22} radius={20} glow width={230}>
                <div
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 11.5,
                    fontWeight: 800,
                    letterSpacing: 1.6,
                    color: COLORS.textTertiary,
                    marginBottom: 6,
                  }}
                >
                  OPPORTUNITY SCORE
                </div>
                <NumberCount
                  to={87}
                  startAt={ANALYZE_AT + 196}
                  duration={40}
                  fontSize={58}
                  color={COLORS.orange}
                />
                <div
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 13,
                    color: COLORS.textSecondary,
                    marginTop: 4,
                  }}
                >
                  高潛力商機 · 建議立即跟進
                </div>
              </GlassCard>
            </div>
          </div>
        </AbsoluteFill>
      </CameraRig>
    </SceneFade>
  );
};
