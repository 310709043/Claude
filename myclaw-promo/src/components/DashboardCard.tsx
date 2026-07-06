import React from 'react';
import {COLORS, FONT_FAMILY} from '../theme';
import {GlassCard} from './GlassCard';

type DashboardCardProps = {
  title: string;
  subtitle?: string;
  enterAt?: number;
  width?: number | string;
  height?: number | string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  style?: React.CSSProperties;
};

/** Standard BI dashboard tile: header row + content region. */
export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  enterAt = 0,
  width,
  height,
  children,
  icon,
  badge,
  badgeColor = COLORS.green,
  style,
}) => (
  <GlassCard
    enterAt={enterAt}
    width={width}
    height={height}
    padding={22}
    radius={18}
    fromY={30}
    style={{fontFamily: FONT_FAMILY, display: 'flex', flexDirection: 'column', ...style}}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 14,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        {icon}
        <div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: COLORS.textPrimary,
              letterSpacing: 0.3,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div style={{fontSize: 11.5, color: COLORS.textTertiary, marginTop: 2}}>
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
      {badge ? (
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: badgeColor,
            backgroundColor: `${badgeColor}1A`,
            border: `1px solid ${badgeColor}44`,
            padding: '3px 9px',
            borderRadius: 999,
            whiteSpace: 'nowrap',
          }}
        >
          {badge}
        </div>
      ) : null}
    </div>
    <div style={{flex: 1, minHeight: 0}}>{children}</div>
  </GlassCard>
);
