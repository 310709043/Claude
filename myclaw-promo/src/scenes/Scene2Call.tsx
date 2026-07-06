import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {APP, COLORS, FONT_FAMILY} from '../theme';
import {ParticleBackground} from '../components/ParticleBackground';
import {CameraRig, SceneFade} from '../components/CameraRig';
import {SceneTitle} from '../components/AppWindow';
import {
  AppCard,
  AppHeader,
  AppSectionLabel,
  AppTabBar,
  PhoneFrame,
} from '../components/PhoneFrame';
import {VoiceWave} from '../components/VoiceWave';
import {Transcript, TranscriptLine} from '../components/Transcript';
import {AIThinking} from '../components/AIThinking';
import {KeywordChip} from '../components/Tag';
import {GlassCard} from '../components/GlassCard';
import {progress} from '../easings';

const ANSWER_AT = 84; // call answered
const TRANSCRIPT_AT = 112;

const LINES: TranscriptLine[] = [
  {
    speaker: '客',
    speakerColor: '#8A93A6',
    text: '我們正在評估 AI 導入,想了解方案。',
    keywords: ['AI 導入'],
    at: TRANSCRIPT_AT,
  },
  {
    speaker: '服',
    speakerColor: APP.orange,
    text: '好的!目前有系統需要整合嗎?',
    keywords: [],
    at: TRANSCRIPT_AT + 62,
  },
  {
    speaker: '客',
    speakerColor: '#8A93A6',
    text: '需要 CRM 串接與知識庫,資料要地端部署。',
    keywords: ['CRM 串接', '知識庫', '地端部署'],
    at: TRANSCRIPT_AT + 118,
  },
  {
    speaker: '客',
    speakerColor: '#8A93A6',
    text: '有 API 就能先做 POC,預算下季啟動。',
    keywords: ['API', 'POC', '預算'],
    at: TRANSCRIPT_AT + 204,
  },
];

const KEYWORDS = [
  {label: 'AI 導入', at: TRANSCRIPT_AT + 40},
  {label: 'CRM 串接', at: TRANSCRIPT_AT + 152},
  {label: '知識庫', at: TRANSCRIPT_AT + 166},
  {label: '地端部署', at: TRANSCRIPT_AT + 180},
  {label: 'API', at: TRANSCRIPT_AT + 236},
  {label: 'POC', at: TRANSCRIPT_AT + 250},
  {label: '預算', at: TRANSCRIPT_AT + 264},
  {label: '時程:下季', at: TRANSCRIPT_AT + 278},
];

/** TAIPBX full-screen call UI (dark, iOS-call style) inside a phone. */
const CallScreen: React.FC = () => {
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
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(180deg, #101725 0%, #0B0F18 55%, #0D1320 100%)',
        alignItems: 'center',
        fontFamily: FONT_FAMILY,
        paddingTop: 78,
      }}
    >
      {/* TAIPBX badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '6px 14px',
          borderRadius: 999,
          backgroundColor: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.14)',
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: ringing ? '#FFB020' : '#30D678',
            boxShadow: `0 0 8px ${ringing ? '#FFB020' : '#30D678'}`,
          }}
        />
        <span style={{fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: '#DDE3EE'}}>
          TAIPBX 企業雲端總機
        </span>
      </div>

      {/* Caller */}
      <div style={{position: 'relative', width: 132, height: 132, marginTop: 40}}>
        {ringing ? (
          <>
            <div
              style={{
                position: 'absolute',
                inset: -16,
                borderRadius: '50%',
                border: `2px solid ${COLORS.orange}`,
                opacity: ringPulse * 0.5,
                transform: `scale(${1 + 0.1 * Math.sin(frame * 0.42)})`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: -30,
                borderRadius: '50%',
                border: `1.5px solid ${COLORS.orange}`,
                opacity: ringPulse * 0.22,
                transform: `scale(${1 + 0.16 * Math.sin(frame * 0.42 + 1)})`,
              }}
            />
          </>
        ) : null}
        <div
          style={{
            width: 132,
            height: 132,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2B3550, #1A2136)',
            border: `2px solid ${ringing ? COLORS.orange : '#30D678'}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 52,
          }}
        >
          👤
        </div>
      </div>

      <div style={{textAlign: 'center', marginTop: 20}}>
        <div style={{fontSize: 26, fontWeight: 800, color: '#FFFFFF'}}>陳經理</div>
        <div style={{fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 5}}>
          宏遠集團 · +886 2 6635 ****
        </div>
      </div>

      {ringing ? (
        <div
          style={{
            marginTop: 26,
            fontSize: 16,
            fontWeight: 600,
            color: '#FFB020',
            letterSpacing: 2,
            opacity: ringPulse,
          }}
        >
          來電中⋯
        </div>
      ) : (
        <div
          style={{
            marginTop: 22,
            opacity: answered,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#30D678',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: 2,
            }}
          >
            {mm}:{ss}
          </div>
          <VoiceWave width={250} height={46} bars={32} color="#30D678" intensity={0.95} />
        </div>
      )}

      {/* Call actions */}
      <div
        style={{
          position: 'absolute',
          bottom: 96,
          display: 'flex',
          gap: 30,
          alignItems: 'center',
        }}
      >
        {[
          {icon: '🎙️', bg: 'rgba(255,255,255,0.1)', label: '靜音'},
          {
            icon: '📞',
            bg: ringing ? '#30D678' : 'rgba(255,255,255,0.1)',
            label: ringing ? '接聽' : '通話中',
            pulse: ringing,
          },
          {icon: '✕', bg: 'rgba(229,72,77,0.85)', label: '結束'},
        ].map((b, i) => (
          <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7}}>
            <div
              style={{
                width: i === 1 ? 66 : 54,
                height: i === 1 ? 66 : 54,
                borderRadius: '50%',
                backgroundColor: b.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: i === 1 ? 26 : 20,
                transform: b.pulse ? `scale(${1 + 0.07 * Math.sin(frame * 0.42)})` : 'none',
                boxShadow: b.pulse ? '0 0 30px rgba(48,214,120,0.6)' : '0 8px 20px rgba(0,0,0,0.35)',
              }}
            >
              {b.icon}
            </div>
            <span style={{fontSize: 11, color: 'rgba(255,255,255,0.55)'}}>{b.label}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** MyVoca live-transcript screen (light app UI) inside a phone. */
const VocaScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const recP = progress(frame, ANSWER_AT + 8, ANSWER_AT + 22);

  return (
    <AbsoluteFill style={{backgroundColor: APP.bg, fontFamily: FONT_FAMILY}}>
      <AppHeader title="MyVoca" subtitle="智能語音分析 · POWERED BY MyClaw AI" />
      <div style={{padding: '14px 16px 0', display: 'flex', flexDirection: 'column', gap: 12}}>
        {/* Recording banner */}
        <div
          style={{
            opacity: recP,
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '10px 14px',
            borderRadius: 14,
            backgroundColor: APP.orangeTint,
            border: `1px solid ${APP.orange}33`,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: APP.red,
              opacity: 0.5 + 0.5 * Math.sin(frame * 0.3),
            }}
          />
          <span style={{fontSize: 12.5, fontWeight: 800, color: APP.orangeDeep, letterSpacing: 1}}>
            即時逐字稿轉寫中
          </span>
          <div style={{marginLeft: 'auto'}}>
            <VoiceWave width={74} height={18} bars={12} color={APP.orange} seed={30} />
          </div>
        </div>

        {/* Transcript card */}
        <AppCard enterAt={ANSWER_AT + 16} padding={16} style={{minHeight: 296}}>
          <AppSectionLabel text="REAL-TIME TRANSCRIPT" icon="📝" />
          <div style={{marginTop: 12}}>
            <Transcript
              lines={LINES}
              width={300}
              fontSize={13.5}
              charSpeed={0.6}
              textColor={APP.text}
            />
          </div>
        </AppCard>

        {/* Detected intent card */}
        <AppCard enterAt={TRANSCRIPT_AT + 24} padding={16}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <AppSectionLabel text="AI 需求辨識" icon="✦" />
            <span
              style={{
                marginLeft: 'auto',
                fontSize: 10.5,
                fontWeight: 800,
                color: APP.orange,
                letterSpacing: 1,
                opacity: 0.5 + 0.5 * Math.sin(frame * 0.25),
              }}
            >
              ANALYZING
            </span>
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 12}}>
            {KEYWORDS.map((k, i) => (
              <KeywordChip
                key={i}
                label={k.label}
                enterAt={k.at}
                color={i % 3 === 1 ? APP.blue : APP.orangeDeep}
                fontSize={11.5}
              />
            ))}
          </div>
        </AppCard>
      </div>
      <AppTabBar active={1} />
    </AbsoluteFill>
  );
};

/** 第二幕 14–32s:手機來電 → 接聽 → MyVoca App 即時逐字稿與 AI 辨識。 */
export const Scene2Call: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOut = interpolate(frame, [50, 72], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const aiOrbP = progress(frame, TRANSCRIPT_AT + 30, TRANSCRIPT_AT + 48);

  return (
    <SceneFade fadeIn={12} fadeOut={16}>
      <ParticleBackground count={36} energy={0.45} seed={2} />
      <CameraRig from={{scale: 1.06, y: 14}} to={{scale: 1.0, y: 0}}>
        {/* Kicker title */}
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 40, opacity: titleOut}}>
          <SceneTitle
            kicker="STEP 01 · CONNECT"
            title="一通電話進來,AI 已經開始工作"
            size={40}
          />
        </AbsoluteFill>

        <AbsoluteFill
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 180,
            paddingTop: 40,
          }}
        >
          <PhoneFrame width={370} enterAt={6} tilt={7} darkStatusBar glow="rgba(48,214,120,0.22)">
            <CallScreen />
          </PhoneFrame>
          <PhoneFrame width={370} enterAt={20} tilt={-7} glow="rgba(245,130,31,0.32)">
            <VocaScreen />
          </PhoneFrame>
        </AbsoluteFill>

        {/* Floating AI link between the phones */}
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingTop: 40}}>
          <div style={{opacity: aiOrbP, transform: `translateY(${(1 - aiOrbP) * 20}px)`}}>
            <GlassCard enterAt={TRANSCRIPT_AT + 30} padding={14} radius={999} glow>
              <AIThinking size={74} enterAt={TRANSCRIPT_AT + 32} />
            </GlassCard>
          </div>
        </AbsoluteFill>
      </CameraRig>
    </SceneFade>
  );
};
