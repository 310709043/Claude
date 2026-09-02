import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {drift, ease} from '../anim';

export type CameraMove =
  | 'pushIn'      // 推：緩慢逼近，建立張力
  | 'pullOut'     // 拉：揭示全貌
  | 'panRight'    // 搖：橫向掃視
  | 'panLeft'
  | 'craneUp'     // 升：由下往上，帶出宏大感
  | 'craneDown'
  | 'trackRight'  // 軌道：橫移＋輕微視差
  | 'hold';       // 定鏡（仍有微幅手持呼吸）

type Props = {
  children: React.ReactNode;
  move?: CameraMove;
  /** 動作總長度（frames），預設為場景長度 */
  duration: number;
  /** 運動強度倍率 */
  intensity?: number;
  /** 景深層級：0 = 最遠（移動最少），1 = 前景（移動最多） */
  depth?: number;
  /** 手持呼吸感，設為 0 可完全靜止 */
  handheld?: number;
};

const MOVES: Record<
  CameraMove,
  {scale: [number, number]; x: [number, number]; y: [number, number]}
> = {
  pushIn:    {scale: [1.0, 1.13],  x: [0, 0],    y: [0, 0]},
  pullOut:   {scale: [1.16, 1.0],  x: [0, 0],    y: [0, 0]},
  panRight:  {scale: [1.08, 1.08], x: [40, -40], y: [0, 0]},
  panLeft:   {scale: [1.08, 1.08], x: [-40, 40], y: [0, 0]},
  craneUp:   {scale: [1.1, 1.04],  x: [0, 0],    y: [46, -18]},
  craneDown: {scale: [1.04, 1.1],  x: [0, 0],    y: [-18, 46]},
  trackRight:{scale: [1.06, 1.11], x: [56, -34], y: [10, -10]},
  hold:      {scale: [1.02, 1.045],x: [0, 0],    y: [0, 0]},
};

/**
 * 虛擬攝影機。
 * 所有場景都包在 Camera 裡 —— 畫面永遠在「呼吸」，
 * 絕不出現完全靜止的死板構圖，這是廣告片與簡報錄影最大的差別。
 *
 * depth 參數可讓同場景的前／中／後景以不同幅度移動，產生真實視差。
 */
export const Camera: React.FC<Props> = ({
  children,
  move = 'hold',
  duration,
  intensity = 1,
  depth = 1,
  handheld = 1,
}) => {
  const frame = useCurrentFrame();
  const spec = MOVES[move];
  const t = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease.inOutCine,
  });

  const k = intensity * depth;
  const scale = 1 + (interpolate(t, [0, 1], spec.scale) - 1) * k;
  const x = interpolate(t, [0, 1], spec.x) * k;
  const y = interpolate(t, [0, 1], spec.y) * k;

  // 手持呼吸：兩組不同週期的正弦波疊加，避免出現機械式的規律循環
  const hx = (drift(frame, 187, 3.2) + drift(frame, 71, 1.1, 1.7)) * handheld * depth;
  const hy = (drift(frame, 149, 2.6, 0.8) + drift(frame, 63, 0.9, 2.4)) * handheld * depth;
  const hr = drift(frame, 233, 0.13, 0.4) * handheld;

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale}) translate(${x + hx}px, ${y + hy}px) rotate(${hr}deg)`,
        transformOrigin: 'center center',
        willChange: 'transform',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * 淺景深層。用於背景元素 —— 真實鏡頭不可能讓前後景同時合焦，
 * 背景保持柔散才有「大光圈電影鏡頭」的味道。
 */
export const Defocus: React.FC<{
  children: React.ReactNode;
  blur?: number;
  /** 從模糊拉到清晰（rack focus，變焦對焦） */
  rackFocus?: {from: number; to: number; start: number; duration: number};
}> = ({children, blur = 8, rackFocus}) => {
  const frame = useCurrentFrame();
  const b = rackFocus
    ? interpolate(
        frame,
        [rackFocus.start, rackFocus.start + rackFocus.duration],
        [rackFocus.from, rackFocus.to],
        {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.outQuint}
      )
    : blur;

  return <AbsoluteFill style={{filter: `blur(${b}px)`}}>{children}</AbsoluteFill>;
};
