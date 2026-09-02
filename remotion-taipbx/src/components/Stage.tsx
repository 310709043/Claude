import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {layout} from '../theme';

/**
 * 設計座標舞台。
 * 內部一律以 1920×1080 思考版面，Stage 會自動縮放到實際輸出解析度
 * （4K 時 ×2）。Chrome 會在 transform 之後才柵格化文字，
 * 因此 4K 輸出仍是原生銳利，不會有放大模糊。
 *
 * 好處：改輸出解析度時，所有版面數值完全不用動。
 */
export const Stage: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {width, height} = useVideoConfig();
  const scale = Math.min(width / layout.designWidth, height / layout.designHeight);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          width: layout.designWidth,
          height: layout.designHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
