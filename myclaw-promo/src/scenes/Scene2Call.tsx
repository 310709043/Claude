import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {COLORS, FONT_FAMILY} from '../theme';
import {ParticleBackground} from '../components/ParticleBackground';
import {CameraRig, SceneFade} from '../components/CameraRig';
import {AppWindow, SceneTitle, StatusPill} from '../components/AppWindow';
import {ProductBadge, TaiwanMobileLogo} from '../components/BrandLogos';
import {VoiceWave} from '../components/VoiceWave';
import {Transcript, TranscriptLine} from '../components/Transcript';
import {AIThinking} from '../components/AIThinking';
import {KeywordChip} from '../components/Tag';
import {progress} from '../easings';

const ANSWER_AT = 78; // call answered
const TRANSCRIPT_AT = 110;

const LINES: TranscriptLine[] = [
  {
    speaker: '客',
    speakerColor: COLORS.midGray,
    text: '你好,我們公司最近在評估 AI 導入,想了解你們的方案。',
    keywords: ['AI 導入'],
    at: TRANSCRIPT_AT,
  },
  {
    speaker: '服',
    speakerColor: COLORS.orangeDeep,
    text: '沒問題!請問目前有使用中的系統需要整合嗎?',
    keywords: [],
    at: TRANSCRIPT_AT + 70,
  },
  {
    speaker: '客',
    speakerColor: COLORS.midGray,
    text: '我們需要 CRM 串接,還要接內部知識庫,而且資料必須地端部署。',
    keywords: ['CRM 串接', '知識庫', '地端部署'],
    at: TRANSCRIPT_AT + 130,
  },
  {
    speaker: '客',
    speakerColor: COLORS.midGray,
    text: '如果有 API 可以先做 POC,預算下季就能啟動。',
    keywords: ['API', 'POC', '預算'],
    at: TRANSCRIPT_AT + 220,
  },
];

const KEYWORDS = [
  {label: 'AI 導入', at: TRANSCRIPT_AT + 46},
  {label: 'CRM 串接', at: TRANSCRIPT_AT + 168},
  {label: '知識庫', at: TRANSCRIPT_AT + 184},
  {label: '地端部署', at: TRANSCRIPT_AT + 200},
  {label: 'API', at: TRANSCRIPT_AT + 252},
  {label: 'POC', at: TRANSCRIPT_AT + 268},
  {label: '預算', at: TRANSCRIPT_AT + 284},
  {label: '時程:下季', at: TRANSCRIPT_AT + 300},
];

/** TAIPBX softphone panel: incoming ring → answered call with waves. */
const CallPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const ringing = frame < ANSWER_AT;
  const ringPulse = 0.6 + 0.4 * Math.sin(frame * 0.42);
  const answered = spring({
    frame: frame - ANSWER_AT,
    fps,
    config: {damping: 20, stiffness: 120, mass: 0.8},
  });

  const callSec = Math.max(0, Math.floor((frame - ANSWER_AT) / fps));
  const mm = String(Math.floor(callSec / 60)).padStart(2, '0');
  const ss = String(callSec % 60).padStart(2, '0');

  return (
    <AppWindow
      title="TAIPBX 雲端總機"
      badge={<ProductBadge name="TAIPBX" accent={COLORS.blue} size={12} />}
      status={
        ringing ? (
          <StatusPill label="INCOMING" color={COLORS.amber} />
        ) : (
          <StatusPill label="ON CALL" color={COLORS.green} />
        )
      }
      enterAt={4}
      width={520}
      height={640}
    >
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 22,
          fontFamily: FONT_FAMILY,
          padding: 30,
        }}
      >
        {/* Caller avatar with ring pulse */}
        <div style={{position: 'relative', width: 150, height: 150}}>
          {ringing ? (
            <>
              <div
                style={{
                  position: 'absolute',
                  inset: -18,
                  borderRadius: '50%',
                  border: `2px solid ${COLORS.orange}`,
                  opacity: ringPulse * 0.5,
                  transform: `scale(${1 + 0.12 * Math.sin(frame * 0.42)})`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: -34,
                  borderRadius: '50%',
                  border: `1.5px solid ${COLORS.orange}`,
                  opacity: ringPulse * 0.25,
                  transform: `scale(${1 + 0.18 * Math.sin(frame * 0.42 + 1)})`,
                }}
              />
            </>
          ) : null}
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${COLORS.midGray}, ${COLORS.darkGray})`,
              border: `2px solid ${ringing ? COLORS.orange : COLORS.green}66`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 60,
            }}
          >
            👤
          </div>
        </div>

        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: 27, fontWeight: 800, color: COLORS.textPrimary}}>
            陳經理
          </div>
          <div style={{fontSize: 16, color: COLORS.textTertiary, marginTop: 4}}>
            宏遠集團 · +886 2 6635 ****
          </div>
        </div>

        {ringing ? (
          <div
            style={{
              fontSize: 19,
              fontWeight: 600,
              color: COLORS.amber,
              letterSpacing: 2,
              opacity: ringPulse,
            }}
          >
            來電中⋯
          </div>
        ) : (
          <div
            style={{
              opacity: answered,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 18,
            }}
          >
            <div
              style={{
                fontSize: 30,
                fontWeight: 700,
                color: COLORS.green,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: 2,
              }}
            >
              {mm}:{ss}
            </div>
            <VoiceWave width={330} height={62} bars={38} color={COLORS.green} intensity={0.95} />
          </div>
        )}

        {/* Answer / controls */}
        <div style={{display: 'flex', gap: 22, marginTop: 6}}>
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: '50%',
              backgroundColor: ringing ? COLORS.green : 'rgba(255,255,255,0.06)',
              border: `1px solid ${ringing ? COLORS.green : COLORS.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 25,
              transform: ringing ? `scale(${1 + 0.06 * Math.sin(frame * 0.42)})` : 'none',
              boxShadow: ringing ? `0 0 30px ${COLORS.green}66` : undefined,
            }}
          >
            📞
          </div>
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: `1px solid ${COLORS.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              opacity: 0.75,
            }}
          >
            🎙️
          </div>
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: '50%',
              backgroundColor: 'rgba(248,113,113,0.14)',
              border: '1px solid rgba(248,113,113,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              opacity: 0.85,
            }}
          >
            ✕
          </div>
        </div>

        {/* Footer brand */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            opacity: 0.55,
          }}
        >
          <TaiwanMobileLogo size={22} />
          <span style={{fontSize: 12.5, color: COLORS.textTertiary, letterSpacing: 1}}>
            Taiwan Mobile Enterprise Cloud
          </span>
        </div>
      </div>
    </AppWindow>
  );
};

/** MyVoca real-time transcript + AI keyword extraction panel. */
const VocaPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const analysisP = progress(frame, TRANSCRIPT_AT + 30, TRANSCRIPT_AT + 48);

  return (
    <AppWindow
      title="MyVoca 智能語音分析"
      badge={<ProductBadge name="MyVoca" accent={COLORS.orange} size={12} />}
      status={<StatusPill label="TRANSCRIBING" color={COLORS.orange} />}
      enterAt={16}
      width={880}
      height={640}
    >
      <div style={{display: 'flex', height: '100%'}}>
        {/* Transcript stream */}
        <div
          style={{
            flex: 1,
            padding: '26px 30px',
            borderRight: `1px solid ${COLORS.border}`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 12.5,
              fontWeight: 800,
              letterSpacing: 2,
              color: COLORS.textTertiary,
              marginBottom: 18,
            }}
          >
            即時逐字稿 · REAL-TIME TRANSCRIPT
          </div>
          <Transcript lines={LINES} width={520} fontSize={19.5} charSpeed={0.62} />
        </div>

        {/* AI extraction rail */}
        <div
          style={{
            width: 300,
            padding: '26px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            opacity: analysisP,
          }}
        >
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 12.5,
              fontWeight: 800,
              letterSpacing: 2,
              color: COLORS.textTertiary,
            }}
          >
            AI 需求辨識 · DETECTED INTENT
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <AIThinking size={104} label="ANALYZING" enterAt={TRANSCRIPT_AT + 34} />
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 10}}>
            {KEYWORDS.map((k, i) => (
              <KeywordChip
                key={i}
                label={k.label}
                enterAt={k.at}
                color={i % 3 === 1 ? COLORS.blue : COLORS.orange}
                fontSize={14.5}
              />
            ))}
          </div>
        </div>
      </div>
    </AppWindow>
  );
};

/** 第二幕 14–32s:來電 → 接聽 → MyVoca 逐字稿 → AI 即時分析。 */
export const Scene2Call: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOut = interpolate(frame, [46, 66], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneFade fadeIn={12} fadeOut={16}>
      <ParticleBackground count={34} energy={0.45} seed={2} />
      <CameraRig from={{scale: 1.05, y: 10}} to={{scale: 1.0, y: 0}}>
        {/* Kicker title, fades before UI takes focus */}
        <AbsoluteFill
          style={{
            alignItems: 'center',
            paddingTop: 44,
            opacity: titleOut,
          }}
        >
          <SceneTitle kicker="STEP 01 · CONNECT" title="一通電話進來,AI 已經開始工作" size={40} />
        </AbsoluteFill>

        <AbsoluteFill
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 36,
            paddingTop: 54,
          }}
        >
          <CallPanel />
          <VocaPanel />
        </AbsoluteFill>
      </CameraRig>
    </SceneFade>
  );
};
