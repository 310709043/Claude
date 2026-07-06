import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../theme';
import {ParticleBackground} from '../components/ParticleBackground';
import {CameraRig, SceneFade} from '../components/CameraRig';
import {AppWindow, StatusPill} from '../components/AppWindow';
import {ProductBadge, TaiwanMobileLogo} from '../components/BrandLogos';
import {DashboardCard} from '../components/DashboardCard';
import {BarChart, DonutChart, LineChart} from '../components/KPIChart';
import {NumberCount, ProgressBar} from '../components/NumberCount';
import {progress} from '../easings';

/** Small stat tile for the KPI strip. */
const Stat: React.FC<{
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  delta: string;
  deltaColor?: string;
  at: number;
}> = ({label, value, suffix, prefix, decimals = 0, delta, deltaColor = COLORS.green, at}) => (
  <DashboardCard title={label} enterAt={at} width={252} height={120} badge={delta} badgeColor={deltaColor}>
    <NumberCount
      to={value}
      startAt={at + 8}
      duration={38}
      suffix={suffix}
      prefix={prefix}
      decimals={decimals}
      fontSize={38}
    />
  </DashboardCard>
);

/** Compact ranked horizontal-bar list (拒絕原因 / 產業分析). */
const RankBars: React.FC<{
  items: {label: string; value: number}[];
  at: number;
  color?: string;
  width?: number;
  gap?: number;
  fontSize?: number;
}> = ({items, at, color = COLORS.blue, width = 220, gap = 15, fontSize = 13}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap, fontFamily: FONT_FAMILY}}>
      {items.map((it, i) => {
        const p = progress(frame, at + i * 6, at + i * 6 + 12);
        return (
          <div key={i} style={{opacity: p}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize,
                color: COLORS.textSecondary,
                marginBottom: 4,
              }}
            >
              <span>{it.label}</span>
              <span style={{color: COLORS.textTertiary}}>{it.value}%</span>
            </div>
            <ProgressBar value={it.value} startAt={at + i * 6} width={width} height={5} color={color} />
          </div>
        );
      })}
    </div>
  );
};

/** 第六幕 73–82s:主管視角 — 企業級 BI Dashboard 全景。 */
export const Scene6Dashboard: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SceneFade fadeIn={12} fadeOut={16}>
      <ParticleBackground count={30} energy={0.42} seed={6} grid={false} />
      <CameraRig from={{scale: 1.1, y: 20}} to={{scale: 1.0, y: 0}} duration={110}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <AppWindow
            title="MyClaw AI · Sales Intelligence Dashboard"
            badge={<ProductBadge name="MANAGER VIEW" accent={COLORS.blue} size={11} />}
            status={
              <>
                <TaiwanMobileLogo size={20} />
                <StatusPill label="LIVE DATA" color={COLORS.green} />
              </>
            }
            enterAt={0}
            width={1780}
            height={930}
          >
            <div
              style={{
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                height: '100%',
              }}
            >
              {/* KPI strip */}
              <div style={{display: 'flex', gap: 16}}>
                <Stat label="本月新商機" value={247} delta="+18%" at={14} />
                <Stat label="成交率" value={34.2} suffix="%" decimals={1} delta="+5.1%" at={20} />
                <Stat label="平均 Follow-up" value={1.8} suffix=" 天" decimals={1} delta="-42%" at={26} />
                <Stat label="Pipeline 總值" value={8.6} prefix="$" suffix="M" decimals={1} delta="+23%" at={32} />
                <DashboardCard
                  title="AI Insights"
                  subtitle="本週摘要"
                  enterAt={38}
                  width={708}
                  height={120}
                  icon={<span style={{fontSize: 16}}>✦</span>}
                  badge="3 NEW"
                  badgeColor={COLORS.orange}
                >
                  <div
                    style={{
                      fontFamily: FONT_FAMILY,
                      fontSize: 14.5,
                      lineHeight: 1.55,
                      color: COLORS.textSecondary,
                      opacity: progress(frame, 48, 66),
                    }}
                  >
                    「地端部署」需求較上月成長{' '}
                    <span style={{color: COLORS.orange, fontWeight: 700}}>+65%</span>
                    ,集中於金融與醫療產業。建議業務團隊優先主打資安合規案例。
                  </div>
                </DashboardCard>
              </div>

              {/* Middle row */}
              <div style={{display: 'flex', gap: 16, flex: 1}}>
                <DashboardCard title="熱門需求 Top 5" subtitle="依 AI 辨識次數" enterAt={44} width={400}>
                  <BarChart
                    data={[
                      {label: 'AI 導入', value: 86},
                      {label: 'CRM', value: 64},
                      {label: '地端', value: 58},
                      {label: '知識庫', value: 44},
                      {label: 'API', value: 37},
                    ]}
                    width={352}
                    height={300}
                    startAt={54}
                    highlightIndex={0}
                  />
                </DashboardCard>

                <DashboardCard title="產業分析" subtitle="商機來源分佈" enterAt={50} width={330}>
                  <RankBars
                    at={60}
                    width={276}
                    items={[
                      {label: '金融 / 保險', value: 28},
                      {label: '製造', value: 22},
                      {label: '零售 / 百貨', value: 17},
                      {label: '醫療', value: 13},
                      {label: '科技 / SaaS', value: 11},
                    ]}
                  />
                </DashboardCard>

                <DashboardCard title="成交率趨勢" subtitle="近 8 週" enterAt={56} width={430} badge="↑ 34.2%">
                  <LineChart
                    points={[22, 24, 23, 27, 29, 28, 32, 34.2]}
                    width={380}
                    height={280}
                    startAt={66}
                  />
                </DashboardCard>

                <DashboardCard title="Pipeline" subtitle="階段分佈" enterAt={62} width={300}>
                  <RankBars
                    at={72}
                    width={246}
                    color={COLORS.orange}
                    items={[
                      {label: 'Qualified', value: 92},
                      {label: 'Proposal', value: 61},
                      {label: 'Negotiation', value: 38},
                      {label: 'Closing', value: 24},
                    ]}
                  />
                </DashboardCard>

                <DashboardCard title="高潛力客戶" subtitle="AI Score ≥ 85" enterAt={68} width={252} badge="12">
                  <div style={{display: 'flex', flexDirection: 'column', gap: 9, fontFamily: FONT_FAMILY}}>
                    {[
                      {name: '宏遠集團', score: 87},
                      {name: '大正製造', score: 91},
                      {name: '康泰醫療', score: 86},
                      {name: '博立科技', score: 89},
                      {name: '全通物流', score: 85},
                      {name: '遠成百貨', score: 88},
                    ].map((c, i) => {
                      const p = progress(frame, 78 + i * 7, 90 + i * 7);
                      return (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 11px',
                            borderRadius: 10,
                            backgroundColor: 'rgba(255,255,255,0.045)',
                            border: `1px solid ${COLORS.border}`,
                            opacity: p,
                            transform: `translateY(${(1 - p) * 8}px)`,
                          }}
                        >
                          <span style={{fontSize: 13.5, fontWeight: 600, color: COLORS.textPrimary}}>
                            {c.name}
                          </span>
                          <span style={{fontSize: 14, fontWeight: 800, color: COLORS.orange}}>
                            {c.score}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </DashboardCard>
              </div>

              {/* Bottom row */}
              <div style={{display: 'flex', gap: 16, height: 208}}>
                <DashboardCard title="拒絕原因" subtitle="Top 4" enterAt={74} width={330}>
                  <RankBars
                    at={84}
                    width={276}
                    gap={7}
                    fontSize={12}
                    color={COLORS.red}
                    items={[
                      {label: '預算不足', value: 34},
                      {label: '時程未定', value: 26},
                      {label: '既有系統綁定', value: 21},
                      {label: '需上層核准', value: 14},
                    ]}
                  />
                </DashboardCard>

                <DashboardCard title="Trending Topics" subtitle="對話熱詞" enterAt={80} width={430}>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: 9, alignContent: 'flex-start'}}>
                    {[
                      {t: '地端部署', s: 19, hot: true},
                      {t: 'AI Agent', s: 17, hot: true},
                      {t: '資料合規', s: 15, hot: false},
                      {t: 'POC', s: 15, hot: false},
                      {t: 'RAG 知識庫', s: 14, hot: true},
                      {t: 'API 整合', s: 13, hot: false},
                      {t: '導入時程', s: 12.5, hot: false},
                    ].map((k, i) => {
                      const p = progress(frame, 90 + i * 5, 100 + i * 5);
                      return (
                        <span
                          key={i}
                          style={{
                            fontFamily: FONT_FAMILY,
                            fontSize: k.s,
                            fontWeight: 700,
                            padding: '6px 13px',
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
                </DashboardCard>

                <DashboardCard
                  title="Manager Suggestions"
                  subtitle="AI 管理建議"
                  enterAt={86}
                  width={694}
                  icon={<span style={{fontSize: 16}}>🧭</span>}
                  badge="ACTIONABLE"
                  badgeColor={COLORS.blue}
                >
                  <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                    {[
                      '金融產業商機成長最快 — 建議增派 2 名資深業務支援北區團隊。',
                      '「預算不足」拒絕案件中,68% 未被推薦彈性方案 — 建議更新報價策略。',
                      '高潛力客戶平均 Follow-up 1.8 天,較上月縮短 42% — 維持現行 AI 派工節奏。',
                    ].map((s, i) => {
                      const p = progress(frame, 96 + i * 10, 108 + i * 10);
                      return (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            gap: 10,
                            fontFamily: FONT_FAMILY,
                            fontSize: 14.5,
                            lineHeight: 1.5,
                            color: COLORS.textSecondary,
                            opacity: p,
                            transform: `translateX(${(1 - p) * 14}px)`,
                          }}
                        >
                          <span style={{color: COLORS.blue}}>▸</span>
                          {s}
                        </div>
                      );
                    })}
                  </div>
                </DashboardCard>
              </div>
            </div>
          </AppWindow>
        </AbsoluteFill>
      </CameraRig>
    </SceneFade>
  );
};
