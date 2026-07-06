import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {APP, COLORS, FONT_FAMILY} from '../theme';
import {ParticleBackground} from '../components/ParticleBackground';
import {CameraRig, SceneFade} from '../components/CameraRig';
import {SceneTitle} from '../components/AppWindow';
import {AppCard, AppHeader, AppSectionLabel, PhoneFrame} from '../components/PhoneFrame';
import {GlassCard} from '../components/GlassCard';
import {BarChart, LineChart} from '../components/KPIChart';
import {NumberCount, ProgressBar} from '../components/NumberCount';
import {progress} from '../easings';

const PHONE_AT = 14;
const LEFT_AT = 60;
const RIGHT_AT = 84;

/** Small in-app KPI stat. */
const MiniStat: React.FC<{
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  delta: string;
  up?: boolean;
  at: number;
}> = ({label, value, suffix, prefix, decimals = 0, delta, up = true, at}) => (
  <div
    style={{
      flex: 1,
      backgroundColor: '#F8F9FB',
      borderRadius: 13,
      border: `1px solid ${APP.border}`,
      padding: '10px 12px',
    }}
  >
    <div style={{fontSize: 10, color: APP.textSub, marginBottom: 3}}>{label}</div>
    <NumberCount
      to={value}
      startAt={at}
      duration={34}
      suffix={suffix}
      prefix={prefix}
      decimals={decimals}
      fontSize={20}
      color={APP.text}
    />
    <div
      style={{
        fontSize: 9.5,
        fontWeight: 800,
        color: up ? APP.green : APP.red,
        marginTop: 2,
      }}
    >
      {delta}
    </div>
  </div>
);

/** MyClaw app — manager insight screen (mobile BI). */
const InsightScreen: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: APP.bg, fontFamily: FONT_FAMILY}}>
      <AppHeader title="MyClaw" subtitle="主管洞察 · MANAGER INSIGHTS" />
      <div style={{padding: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 10}}>
        {/* KPI row */}
        <AppCard enterAt={PHONE_AT + 14} padding={12}>
          <div style={{display: 'flex', gap: 8}}>
            <MiniStat label="本月商機" value={247} delta="+18%" at={PHONE_AT + 22} />
            <MiniStat label="成交率" value={34.2} suffix="%" decimals={1} delta="+5.1%" at={PHONE_AT + 28} />
          </div>
          <div style={{display: 'flex', gap: 8, marginTop: 8}}>
            <MiniStat label="平均 Follow-up" value={1.8} suffix=" 天" decimals={1} delta="-42%" at={PHONE_AT + 34} />
            <MiniStat label="Pipeline 總值" value={8.6} prefix="$" suffix="M" decimals={1} delta="+23%" at={PHONE_AT + 40} />
          </div>
        </AppCard>

        {/* Trend */}
        <AppCard enterAt={PHONE_AT + 30} padding={14}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <AppSectionLabel text="成交率趨勢 · 近 8 週" icon="📈" />
            <span
              style={{
                marginLeft: 'auto',
                fontSize: 10.5,
                fontWeight: 800,
                color: APP.green,
                backgroundColor: APP.greenTint,
                padding: '2px 8px',
                borderRadius: 999,
              }}
            >
              ↑ 34.2%
            </span>
          </div>
          <div style={{marginTop: 10}}>
            <LineChart
              points={[22, 24, 23, 27, 29, 28, 32, 34.2]}
              width={300}
              height={110}
              startAt={PHONE_AT + 44}
              color={APP.orange}
            />
          </div>
        </AppCard>

        {/* Pipeline */}
        <AppCard enterAt={PHONE_AT + 46} padding={14}>
          <AppSectionLabel text="PIPELINE 階段分佈" icon="🧭" />
          <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10}}>
            {[
              {label: 'Qualified', value: 92},
              {label: 'Proposal', value: 61},
              {label: 'Negotiation', value: 38},
              {label: 'Closing', value: 24},
            ].map((s, i) => {
              const p = progress(frame, PHONE_AT + 56 + i * 7, PHONE_AT + 68 + i * 7);
              return (
                <div key={i} style={{opacity: p}}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 11,
                      color: APP.textSub,
                      marginBottom: 3,
                    }}
                  >
                    <span>{s.label}</span>
                    <span style={{fontWeight: 700, color: APP.text}}>{s.value}%</span>
                  </div>
                  <ProgressBar
                    value={s.value}
                    startAt={PHONE_AT + 56 + i * 7}
                    width={296}
                    height={5}
                    color={APP.orange}
                    track="#EEEFF4"
                  />
                </div>
              );
            })}
          </div>
        </AppCard>

        {/* High-potential list */}
        <AppCard enterAt={PHONE_AT + 66} padding={14}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <AppSectionLabel text="高潛力客戶 · AI SCORE ≥ 85" icon="⭐" />
            <span
              style={{
                marginLeft: 'auto',
                fontSize: 10.5,
                fontWeight: 800,
                color: APP.orangeDeep,
                backgroundColor: APP.orangeTint,
                padding: '2px 8px',
                borderRadius: 999,
              }}
            >
              12
            </span>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10}}>
            {[
              {name: '宏遠集團', ind: '金融', score: 87},
              {name: '大正製造', ind: '製造', score: 91},
              {name: '康泰醫療', ind: '醫療', score: 86},
            ].map((c, i) => {
              const p = progress(frame, PHONE_AT + 76 + i * 8, PHONE_AT + 88 + i * 8);
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    padding: '7px 10px',
                    borderRadius: 11,
                    backgroundColor: '#F8F9FB',
                    border: `1px solid ${APP.border}`,
                    opacity: p,
                    transform: `translateY(${(1 - p) * 8}px)`,
                  }}
                >
                  <span style={{fontSize: 12, fontWeight: 700, color: APP.text}}>{c.name}</span>
                  <span style={{fontSize: 10, color: APP.textFaint}}>{c.ind}</span>
                  <span style={{marginLeft: 'auto', fontSize: 13, fontWeight: 800, color: APP.orangeDeep}}>
                    {c.score}
                  </span>
                </div>
              );
            })}
          </div>
        </AppCard>
      </div>
    </AbsoluteFill>
  );
};

/** Floating stage panel: top demands + industries (left of phone). */
const DemandPanel: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 22, width: 470}}>
      <SceneTitle
        kicker="STEP 05 · INSIGHT"
        title="主管視角,決策更快"
        size={40}
        align="left"
        enterAt={2}
      />
      <GlassCard enterAt={LEFT_AT} width={470} padding={24} radius={20}>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 12.5,
            fontWeight: 800,
            letterSpacing: 2,
            color: COLORS.textTertiary,
            marginBottom: 14,
          }}
        >
          熱門需求 TOP 5 · 依 AI 辨識次數
        </div>
        <BarChart
          data={[
            {label: 'AI 導入', value: 86},
            {label: 'CRM', value: 64},
            {label: '地端', value: 58},
            {label: '知識庫', value: 44},
            {label: 'API', value: 37},
          ]}
          width={420}
          height={190}
          startAt={LEFT_AT + 10}
          highlightIndex={0}
        />
      </GlassCard>
      <GlassCard enterAt={LEFT_AT + 22} width={470} padding={24} radius={20}>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 12.5,
            fontWeight: 800,
            letterSpacing: 2,
            color: COLORS.textTertiary,
            marginBottom: 14,
          }}
        >
          產業分析 · 商機來源
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 11, fontFamily: FONT_FAMILY}}>
          {[
            {label: '金融 / 保險', value: 28},
            {label: '製造', value: 22},
            {label: '零售 / 百貨', value: 17},
            {label: '醫療', value: 13},
          ].map((it, i) => {
            const p = progress(frame, LEFT_AT + 32 + i * 6, LEFT_AT + 44 + i * 6);
            return (
              <div key={i} style={{opacity: p}}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 13,
                    color: COLORS.textSecondary,
                    marginBottom: 4,
                  }}
                >
                  <span>{it.label}</span>
                  <span style={{color: COLORS.textTertiary}}>{it.value}%</span>
                </div>
                <ProgressBar value={it.value} startAt={LEFT_AT + 32 + i * 6} width={420} height={5} color={COLORS.blue} />
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};

/** Floating stage panel: rejections, trending, AI suggestions (right). */
const InsightPanel: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 22, width: 470}}>
      <GlassCard enterAt={RIGHT_AT} width={470} padding={24} radius={20}>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 12.5,
            fontWeight: 800,
            letterSpacing: 2,
            color: COLORS.textTertiary,
            marginBottom: 14,
          }}
        >
          拒絕原因 TOP 3 / TRENDING TOPICS
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 9, fontFamily: FONT_FAMILY}}>
          {[
            {label: '預算不足', value: 34},
            {label: '時程未定', value: 26},
            {label: '既有系統綁定', value: 21},
          ].map((it, i) => {
            const p = progress(frame, RIGHT_AT + 10 + i * 6, RIGHT_AT + 22 + i * 6);
            return (
              <div key={i} style={{opacity: p}}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 13,
                    color: COLORS.textSecondary,
                    marginBottom: 4,
                  }}
                >
                  <span>{it.label}</span>
                  <span style={{color: COLORS.textTertiary}}>{it.value}%</span>
                </div>
                <ProgressBar value={it.value} startAt={RIGHT_AT + 10 + i * 6} width={420} height={5} color={COLORS.red} />
              </div>
            );
          })}
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16}}>
          {[
            {t: '地端部署', hot: true},
            {t: 'AI Agent', hot: true},
            {t: '資料合規', hot: false},
            {t: 'POC', hot: false},
            {t: 'RAG 知識庫', hot: true},
            {t: 'API 整合', hot: false},
          ].map((k, i) => {
            const p = progress(frame, RIGHT_AT + 34 + i * 5, RIGHT_AT + 44 + i * 5);
            return (
              <span
                key={i}
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 13.5,
                  fontWeight: 700,
                  padding: '5px 12px',
                  borderRadius: 999,
                  color: k.hot ? COLORS.orange : COLORS.textSecondary,
                  backgroundColor: k.hot ? 'rgba(255,107,26,0.1)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${k.hot ? COLORS.orange + '55' : COLORS.border}`,
                  opacity: p,
                  transform: `scale(${0.7 + 0.3 * p})`,
                }}
              >
                {k.t}
              </span>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard enterAt={RIGHT_AT + 24} width={470} padding={24} radius={20} accent>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 12.5,
            fontWeight: 800,
            letterSpacing: 2,
            color: COLORS.orange,
            marginBottom: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 7,
          }}
        >
          ✦ AI INSIGHTS · MANAGER SUGGESTIONS
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 11}}>
          {[
            '「地端部署」需求較上月成長 +65%,集中於金融與醫療產業。',
            '金融產業商機成長最快 — 建議增派 2 名資深業務支援北區。',
            '「預算不足」案件中 68% 未被推薦彈性方案 — 建議更新報價策略。',
          ].map((s, i) => {
            const p = progress(frame, RIGHT_AT + 36 + i * 12, RIGHT_AT + 50 + i * 12);
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 10,
                  fontFamily: FONT_FAMILY,
                  fontSize: 14.5,
                  lineHeight: 1.55,
                  color: COLORS.textSecondary,
                  opacity: p,
                  transform: `translateX(${(1 - p) * 14}px)`,
                }}
              >
                <span style={{color: COLORS.orange}}>▸</span>
                {s}
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};

/** 第六幕 73–82s:主管手機洞察畫面 + 浮動 BI 圖表。 */
export const Scene6Dashboard: React.FC = () => {
  return (
    <SceneFade fadeIn={12} fadeOut={16}>
      <ParticleBackground count={32} energy={0.42} seed={6} grid={false} />
      <CameraRig from={{scale: 1.09, y: 18}} to={{scale: 1.0, y: 0}} duration={110}>
        <AbsoluteFill
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 60,
          }}
        >
          <DemandPanel />
          <PhoneFrame width={385} enterAt={PHONE_AT - 10} tilt={0} glow="rgba(59,158,255,0.25)">
            <InsightScreen />
          </PhoneFrame>
          <InsightPanel />
        </AbsoluteFill>
      </CameraRig>
    </SceneFade>
  );
};
