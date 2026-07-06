import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY} from '../theme';

/** Detected-keyword chip that pops in with a spring. */
export const KeywordChip: React.FC<{
  label: string;
  enterAt?: number;
  color?: string;
  icon?: string;
  fontSize?: number;
}> = ({label, enterAt = 0, color = COLORS.orange, icon, fontSize = 16}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({
    frame: frame - enterAt,
    fps,
    config: {damping: 15, stiffness: 160, mass: 0.6},
  });
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: `${fontSize * 0.42}px ${fontSize * 0.85}px`,
        borderRadius: 999,
        backgroundColor: `${color}16`,
        border: `1px solid ${color}66`,
        color,
        fontFamily: FONT_FAMILY,
        fontSize,
        fontWeight: 600,
        opacity: s,
        transform: `scale(${0.5 + 0.5 * s})`,
        boxShadow: `0 0 18px ${color}22`,
        whiteSpace: 'nowrap',
      }}
    >
      {icon ? <span style={{fontSize: fontSize * 0.9}}>{icon}</span> : null}
      {label}
    </div>
  );
};

/** Small label:value row used in profile/lead cards. */
export const FieldRow: React.FC<{
  label: string;
  value: React.ReactNode;
  enterAt?: number;
  labelWidth?: number;
  fontSize?: number;
}> = ({label, value, enterAt = 0, labelWidth = 110, fontSize = 16}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({
    frame: frame - enterAt,
    fps,
    config: {damping: 22, stiffness: 120, mass: 0.7},
  });
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        opacity: s,
        transform: `translateX(${(1 - s) * 18}px)`,
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          width: labelWidth,
          flexShrink: 0,
          fontSize: fontSize * 0.82,
          color: COLORS.textTertiary,
          letterSpacing: 0.5,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize,
          fontWeight: 600,
          color: COLORS.textPrimary,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {value}
      </div>
    </div>
  );
};
