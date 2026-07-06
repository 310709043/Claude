import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../theme';
import {ParticleBackground} from '../components/ParticleBackground';
import {CameraRig, SceneFade} from '../components/CameraRig';
import {SceneTitle} from '../components/AppWindow';
import {LeadCard} from '../components/LeadCard';
import {Pipeline} from '../components/Pipeline';
import {GlassCard} from '../components/GlassCard';
import {progress} from '../easings';

const LEAD_AT = 30;
const FLOW_AT = 168;

/** 第五幕 60–73s:一鍵建立 Lead → 自動指派、任務、CRM 同步。 */
export const Scene5Lead: React.FC = () => {
  const frame = useCurrentFrame();
  const syncP = progress(frame, FLOW_AT + 118, FLOW_AT + 140);

  return (
    <SceneFade fadeIn={12} fadeOut={16}>
      <ParticleBackground count={36} energy={0.5} seed={5} />
      <CameraRig from={{scale: 1.0, x: 10}} to={{scale: 1.05, x: -8}}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <SceneTitle
            kicker="STEP 04 · CAPTURE"
            title="對話結束,商機已經建立"
            size={44}
            enterAt={4}
          />

          <div
            style={{
              display: 'flex',
              gap: 40,
              marginTop: 36,
              alignItems: 'flex-start',
            }}
          >
            <LeadCard
              company="宏遠集團"
              industry="金融 · 企業服務"
              summary="AI 中台導入 · 地端部署 · CRM 整合"
              score={87}
              owner="林承翰 · 企業事業部"
              priority="HIGH"
              aiSummary="客戶具明確導入意圖與預算,關注資安與地端部署。建議 48 小時內提供 POC 方案並安排架構師會議,成交機率高。"
              enterAt={LEAD_AT}
              width={620}
            />

            {/* Auto-actions checklist */}
            <GlassCard enterAt={FLOW_AT - 24} width={430} padding={26} radius={22}>
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 12.5,
                  fontWeight: 800,
                  letterSpacing: 2,
                  color: COLORS.textTertiary,
                  marginBottom: 16,
                }}
              >
                AI 自動化 · AUTOMATED ACTIONS
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: 13}}>
                {[
                  {icon: '👥', label: 'Assign Sales', sub: '指派 林承翰(企業事業部)', at: FLOW_AT},
                  {icon: '✅', label: 'Create Task', sub: '48hr 內寄送 POC 提案', at: FLOW_AT + 24},
                  {icon: '🔔', label: 'Follow-up', sub: '週四 14:00 電話追蹤提醒', at: FLOW_AT + 48},
                  {icon: '📊', label: 'Pipeline Stage', sub: 'Qualified → Proposal', at: FLOW_AT + 72},
                  {icon: '🔄', label: 'CRM Sync', sub: '已同步至企業 CRM', at: FLOW_AT + 96},
                ].map((a, i) => {
                  const p = progress(frame, a.at, a.at + 14);
                  const done = frame > a.at + 20;
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 13,
                        padding: '11px 14px',
                        borderRadius: 14,
                        backgroundColor: done
                          ? 'rgba(52,211,153,0.06)'
                          : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${done ? 'rgba(52,211,153,0.3)' : COLORS.border}`,
                        opacity: p,
                        transform: `translateX(${(1 - p) * 26}px)`,
                        fontFamily: FONT_FAMILY,
                      }}
                    >
                      <span style={{fontSize: 21}}>{a.icon}</span>
                      <div style={{flex: 1}}>
                        <div style={{fontSize: 16, fontWeight: 700, color: COLORS.textPrimary}}>
                          {a.label}
                        </div>
                        <div style={{fontSize: 12.5, color: COLORS.textTertiary, marginTop: 1}}>
                          {a.sub}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 15,
                          color: COLORS.green,
                          opacity: done ? 1 : 0.15,
                        }}
                      >
                        ✓
                      </span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* Workflow pipeline strip */}
          <div style={{marginTop: 34}}>
            <Pipeline
              width={1240}
              startAt={FLOW_AT}
              stepInterval={24}
              steps={[
                {icon: '🎯', label: '建立商機', sublabel: 'Lead Created'},
                {icon: '👥', label: '指派業務', sublabel: 'Assign Sales'},
                {icon: '✅', label: '建立任務', sublabel: 'Create Task'},
                {icon: '🔔', label: '追蹤提醒', sublabel: 'Follow-up'},
                {icon: '📊', label: 'Pipeline', sublabel: 'Stage Update'},
                {icon: '🔄', label: 'CRM 同步', sublabel: 'CRM Sync'},
              ]}
            />
          </div>

          {/* Sync confirmation */}
          <div
            style={{
              marginTop: 22,
              opacity: syncP,
              transform: `translateY(${(1 - syncP) * 12}px)`,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 24px',
              borderRadius: 999,
              backgroundColor: 'rgba(52,211,153,0.1)',
              border: '1px solid rgba(52,211,153,0.4)',
              fontFamily: FONT_FAMILY,
              fontSize: 16.5,
              fontWeight: 700,
              color: COLORS.green,
            }}
          >
            ✓ 商機 #A-2481 已建立並同步 — 全程自動,零手動輸入
          </div>
        </AbsoluteFill>
      </CameraRig>
    </SceneFade>
  );
};
