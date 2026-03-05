import React, { useState } from 'react';

export default function HowToMeasure() {
  const [open, setOpen] = useState(false);

  return (
    <div className="card how-to">
      <button className="how-to-toggle" onClick={() => setOpen(o => !o)}>
        ℹ️ 如何正確測量？ {open ? '▲' : '▼'}
      </button>
      {open && (
        <div className="how-to-content">
          <h3>測量長度</h3>
          <ol>
            <li>確保完全勃起狀態</li>
            <li>從恥骨（陰莖根部）到龜頭頂端</li>
            <li>沿著陰莖背側（上方）測量</li>
            <li>捲尺或直尺緊貼皮膚，勿用力壓入脂肪</li>
          </ol>
          <h3>測量圍度（周長）</h3>
          <ol>
            <li>使用軟捲尺或細繩</li>
            <li>在陰莖中段最粗處環繞一圈</li>
            <li>記錄周長數值（非直徑）</li>
          </ol>
          <p className="tip">💡 建議在相同條件下（如同一時段、同一勃起程度）多次測量取平均值以提高準確性。</p>
        </div>
      )}
    </div>
  );
}
