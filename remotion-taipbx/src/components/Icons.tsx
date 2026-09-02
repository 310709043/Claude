import React from 'react';
import {interpolate} from 'remotion';
import {palette} from '../theme';

/**
 * 技術能力圖標 — 全部為手繪 SVG path，
 * 支援「描邊繪製」動畫（stroke-dashoffset），比淡入更有工藝感。
 */
export type IconName = 'shield' | 'layers' | 'container' | 'chip' | 'search' | 'expand';

const PATHS: Record<IconName, React.ReactNode> = {
  shield: (
    <>
      <path d="M32 6 L54 15 V32 C54 45 44 54 32 58 C20 54 10 45 10 32 V15 Z" />
      <path d="M23 32 L29 38 L42 25" />
    </>
  ),
  layers: (
    <>
      <path d="M32 8 L56 20 L32 32 L8 20 Z" />
      <path d="M8 32 L32 44 L56 32" />
      <path d="M8 43 L32 55 L56 43" />
    </>
  ),
  container: (
    <>
      <rect x="8" y="14" width="20" height="16" rx="2" />
      <rect x="8" y="34" width="20" height="16" rx="2" />
      <rect x="36" y="14" width="20" height="16" rx="2" />
      <rect x="36" y="34" width="20" height="16" rx="2" />
    </>
  ),
  chip: (
    <>
      <rect x="16" y="16" width="32" height="32" rx="4" />
      <rect x="26" y="26" width="12" height="12" rx="1.5" />
      <path d="M24 8 V16 M32 8 V16 M40 8 V16 M24 48 V56 M32 48 V56 M40 48 V56" />
      <path d="M8 24 H16 M8 32 H16 M8 40 H16 M48 24 H56 M48 32 H56 M48 40 H56" />
    </>
  ),
  search: (
    <>
      <circle cx="28" cy="28" r="17" />
      <path d="M40 40 L56 56" />
      <path d="M21 26 H35 M21 32 H31" />
    </>
  ),
  expand: (
    <>
      <path d="M8 24 V8 H24" />
      <path d="M40 8 H56 V24" />
      <path d="M56 40 V56 H40" />
      <path d="M24 56 H8 V40" />
      <rect x="24" y="24" width="16" height="16" rx="2" />
    </>
  ),
};

export const Icon: React.FC<{
  name: IconName;
  size?: number;
  /** 0–1 描邊繪製進度 */
  progress?: number;
  color?: string;
  strokeWidth?: number;
}> = ({name, size = 64, progress = 1, color = palette.primary, strokeWidth = 2.2}) => {
  const dash = interpolate(progress, [0, 1], [1, 0]);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        filter: `drop-shadow(0 0 10px ${palette.glow}) drop-shadow(0 0 26px ${palette.glowSoft})`,
        // 以 pathLength 正規化，讓所有 path 用同一組 dash 值
        strokeDasharray: 1,
        strokeDashoffset: dash,
      }}
    >
      <g style={{pathLength: 1} as React.CSSProperties}>
        {React.Children.map(PATHS[name], (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement, {pathLength: 1})
            : child
        )}
      </g>
    </svg>
  );
};
