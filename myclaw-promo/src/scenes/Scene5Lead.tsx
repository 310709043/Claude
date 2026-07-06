import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {APP, COLORS, FONT_FAMILY} from '../theme';
import {ParticleBackground} from '../components/ParticleBackground';
import {CameraRig, SceneFade} from '../components/CameraRig';
import {SceneTitle} from '../components/AppWindow';
import {AppCard, AppHeader, PhoneFrame} from '../components/PhoneFrame';
import {Pipeline} from '../components/Pipeline';
import {GlassCard} from '../components/GlassCard';
import {NumberCount} from '../components/NumberCount';
import {progress} from '../easings';

const LEAD_AT = 34;
const FLOW_AT = 170;

/** One auto-filled form field inside the lead screen. */
const LeadField: React.FC<{
  label: string;
  value: React.ReactNode;
  at: number;
}> = ({label, value, at}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, at, at + 12);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 12px',
        borderRadius: 12,
        backgroundColor: '#F8F9FB',
        border: `1px solid ${APP.border}`,
        opacity: p,
        transform: `translateY(${(1 - p) * 12}px)`,
      }}
    >
      <div style={{width: 74, flexShrink: 0, fontSize: 10.5, color: APP.textFaint, letterSpacing: 0.4}}>
        {label}
      </div>
      <div style={{fontSize: 13, fontWeight: 700, color: APP.text, display: 'flex', alignItems: 'center', gap: 6}}>
        {value}
      </div>
      <span
        style={{
          marginLeft: 'auto',
          fontSize: 10,
          color: APP.orange,
          fontWeight: 800,
          opacity: progress(frame, at + 8, at + 16),
        }}
      >
        ✦ AI
      </span>
    </div>
  );
};

/** MyClaw app — auto-created lead screen. */
const LeadScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const aiP = progress(frame, LEAD_AT + 92, LEAD_AT + 108);
  const doneP = progress(frame, FLOW_AT + 128, FLOW_AT + 142);

  return (
    <AbsoluteFill style={{backgroundColor: APP.bg, fontFamily: FONT_FAMILY}}>
      <AppHeader title="MyClaw" subtitle="新商機 · LEAD #A-2481" />
      <div style={{padding: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 10}}>
        <AppCard enterAt={LEAD_AT} padding={14}>
          {/* Score header */}
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12}}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 13,
                backgroundColor: APP.orangeTint,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 800,
                color: APP.orangeDeep,
              }}
            >
              宏
            </div>
            <div style={{flex: 1}}>
              <div style={{fontSize: 16, fontWeight: 800, color: APP.text}}>宏遠集團</div>
              <div style={{fontSize: 10.5, color: APP.textSub}}>AI 自動建立 · 來源:TAIPBX 通話</div>
            </div>
            <div style={{textAlign: 'right'}}>
              <div style={{fontSize: 8.5, letterSpacing: 0.8, color: APP.textFaint}}>SCORE</div>
              <NumberCount to={87} startAt={LEAD_AT + 24} duration={36} fontSize={26} color={APP.orangeDeep} />
            </div>
          </div>
          {/* Auto-filled fields */}
          <div style={{display: 'flex', flexDirection: 'column', gap: 7}}>
            <LeadField label="Company" value="宏遠集團" at={LEAD_AT + 12} />
            <LeadField label="Industry" value="金融 · 企業服務" at={LEAD_AT + 24} />
            <LeadField label="需求摘要" value="AI 中台 · 地端 · CRM" at={LEAD_AT + 36} />
            <LeadField
              label="Owner"
              value={
                <>
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      backgroundColor: APP.blue,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 9,
                      fontWeight: 800,
                      color: '#FFF',
                    }}
                  >
                    林
                  </span>
                  林承翰 · 企業事業部
                </>
              }
              at={LEAD_AT + 48}
            />
            <LeadField
              label="Priority"
              value={
                <span
                  style={{
                    color: APP.red,
                    backgroundColor: APP.redTint,
                    border: `1px solid ${APP.red}44`,
                    padding: '2px 9px',
                    borderRadius: 999,
                    fontSize: 10.5,
                    fontWeight: 800,
                  }}
                >
                  HIGH
                </span>
              }
              at={LEAD_AT + 60}
            />
          </div>
          {/* AI summary */}
          <div
            style={{
              marginTop: 10,
              padding: 11,
              borderRadius: 12,
              backgroundColor: APP.orangeTint,
              border: `1px solid ${APP.orange}30`,
              opacity: aiP,
              transform: `translateY(${(1 - aiP) * 10}px)`,
            }}
          >
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 800,
                letterSpacing: 1.2,
                color: APP.orangeDeep,
                marginBottom: 4,
              }}
            >
              ✦ AI SUMMARY
            </div>
            <div style={{fontSize: 11.5, lineHeight: 1.6, color: APP.text}}>
              客戶具明確導入意圖與預算,關注資安與地端部署。建議 48 小時內提供 POC 方案,成交機率高。
            </div>
          </div>
        </AppCard>

        {/* Created toast */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            height: 44,
            borderRadius: 13,
            backgroundColor: APP.greenTint,
            border: `1px solid ${APP.green}55`,
            fontSize: 12.5,
            fontWeight: 800,
            color: APP.green,
            opacity: doneP,
            transform: `translateY(${(1 - doneP) * 12}px)`,
          }}
        >
          ✓ 商機已建立並同步 CRM — 零手動輸入
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** 第五幕 60–73s:App 一鍵建立 Lead → 自動指派、任務、CRM 同步。 */
export const Scene5Lead: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SceneFade fadeIn={12} fadeOut={16}>
      <ParticleBackground count={38} energy={0.5} seed={5} />
      <CameraRig from={{scale: 1.0, x: 10}} to={{scale: 1.05, x: -8}}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 80}}>
            {/* Phone */}
            <PhoneFrame width={380} enterAt={LEAD_AT - 22} tilt={6}>
              <LeadScreen />
            </PhoneFrame>

            {/* Stage column: title + automation checklist */}
            <div style={{display: 'flex', flexDirection: 'column', gap: 26, width: 560}}>
              <SceneTitle
                kicker="STEP 04 · CAPTURE"
                title="對話結束,商機已經建立"
                size={42}
                align="left"
                enterAt={4}
              />
              <GlassCard enterAt={FLOW_AT - 26} width={520} padding={24} radius={22}>
                <div
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 12.5,
                    fontWeight: 800,
                    letterSpacing: 2,
                    color: COLORS.textTertiary,
                    marginBottom: 15,
                  }}
                >
                  AI 自動化 · AUTOMATED ACTIONS
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: 11}}>
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
                          padding: '10px 14px',
                          borderRadius: 14,
                          backgroundColor: done ? 'rgba(52,211,153,0.06)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${done ? 'rgba(52,211,153,0.3)' : COLORS.border}`,
                          opacity: p,
                          transform: `translateX(${(1 - p) * 26}px)`,
                          fontFamily: FONT_FAMILY,
                        }}
                      >
                        <span style={{fontSize: 20}}>{a.icon}</span>
                        <div style={{flex: 1}}>
                          <div style={{fontSize: 15.5, fontWeight: 700, color: COLORS.textPrimary}}>
                            {a.label}
                          </div>
                          <div style={{fontSize: 12, color: COLORS.textTertiary, marginTop: 1}}>{a.sub}</div>
                        </div>
                        <span style={{fontSize: 14, color: COLORS.green, opacity: done ? 1 : 0.15}}>✓</span>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </div>
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
        </AbsoluteFill>
      </CameraRig>
    </SceneFade>
  );
};
