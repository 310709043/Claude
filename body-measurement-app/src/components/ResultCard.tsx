import React from 'react';
import { Measurement } from '../types';
import { toCm, calcPercentile, getPercentileLabel, getPercentileColor, GLOBAL_STATS, convertUnit } from '../utils';

interface Props {
  measurement: Measurement;
}

function PercentileBar({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="percentile-bar-wrap">
      <div className="percentile-bar-label">
        <span>{label}</span>
        <span style={{ color }}>{value}th 百分位</span>
      </div>
      <div className="percentile-bar-track">
        <div
          className="percentile-bar-fill"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
        <div className="percentile-bar-avg" style={{ left: '50%' }} title="全球平均" />
      </div>
      <div className="percentile-status" style={{ color }}>
        {getPercentileLabel(value)}
      </div>
    </div>
  );
}

export default function ResultCard({ measurement }: Props) {
  const { length, girth, unit } = measurement;
  const lengthCm = toCm(length, unit);
  const girthCm = toCm(girth, unit);

  const lengthPct = calcPercentile(lengthCm, 'length');
  const girthPct = calcPercentile(girthCm, 'girth');

  const avgLengthDisplay = unit === 'cm'
    ? `${GLOBAL_STATS.length.average} cm`
    : `${convertUnit(GLOBAL_STATS.length.average, 'cm', 'inch')} inch`;
  const avgGirthDisplay = unit === 'cm'
    ? `${GLOBAL_STATS.girth.average} cm`
    : `${convertUnit(GLOBAL_STATS.girth.average, 'cm', 'inch')} inch`;

  return (
    <div className="card result-card">
      <h2 className="section-title">📊 分析結果</h2>

      <div className="result-values">
        <div className="result-value-item">
          <span className="result-label">長度</span>
          <span className="result-number">{length.toFixed(1)} <small>{unit}</small></span>
          <span className="result-avg">全球平均：{avgLengthDisplay}</span>
        </div>
        <div className="result-divider" />
        <div className="result-value-item">
          <span className="result-label">圍度</span>
          <span className="result-number">{girth.toFixed(1)} <small>{unit}</small></span>
          <span className="result-avg">全球平均：{avgGirthDisplay}</span>
        </div>
      </div>

      <div className="percentile-section">
        <PercentileBar
          value={lengthPct}
          label="長度百分位"
          color={getPercentileColor(lengthPct)}
        />
        <PercentileBar
          value={girthPct}
          label="圍度百分位"
          color={getPercentileColor(girthPct)}
        />
      </div>

      <p className="disclaimer">
        ⚕️ 數據來源：BJUI 2015 全球 15,521 名男性學術研究。個體差異正常，請勿過度焦慮。
      </p>
    </div>
  );
}
