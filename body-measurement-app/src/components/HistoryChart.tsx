import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Measurement, Unit } from '../types';
import { toCm, convertUnit, GLOBAL_STATS } from '../utils';

interface Props {
  history: Measurement[];
  displayUnit: Unit;
}

export default function HistoryChart({ history, displayUnit }: Props) {
  if (history.length < 2) {
    return (
      <div className="card">
        <h2 className="section-title">📈 歷史趨勢</h2>
        <p className="empty-msg">儲存 2 筆以上數據後顯示趨勢圖</p>
      </div>
    );
  }

  const avgLength = displayUnit === 'cm' ? GLOBAL_STATS.length.average : convertUnit(GLOBAL_STATS.length.average, 'cm', 'inch');
  const avgGirth = displayUnit === 'cm' ? GLOBAL_STATS.girth.average : convertUnit(GLOBAL_STATS.girth.average, 'cm', 'inch');

  const data = history.map(m => {
    const lenCm = toCm(m.length, m.unit);
    const girCm = toCm(m.girth, m.unit);
    return {
      date: new Date(m.date).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' }),
      長度: parseFloat(convertUnit(lenCm, 'cm', displayUnit === 'inch' ? 'inch' : 'cm').toFixed(2)),
      圍度: parseFloat(convertUnit(girCm, 'cm', displayUnit === 'inch' ? 'inch' : 'cm').toFixed(2)),
    };
  });

  return (
    <div className="card">
      <h2 className="section-title">📈 歷史趨勢</h2>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
          <XAxis dataKey="date" stroke="#a0aec0" tick={{ fontSize: 12 }} />
          <YAxis stroke="#a0aec0" tick={{ fontSize: 12 }} unit={` ${displayUnit}`} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ background: '#1a202c', border: '1px solid #4a5568', borderRadius: 8 }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Legend wrapperStyle={{ color: '#a0aec0' }} />
          <ReferenceLine y={avgLength} stroke="#60a5fa" strokeDasharray="4 4" label={{ value: `平均長度 ${avgLength.toFixed(1)}`, fill: '#60a5fa', fontSize: 11 }} />
          <ReferenceLine y={avgGirth} stroke="#f472b6" strokeDasharray="4 4" label={{ value: `平均圍度 ${avgGirth.toFixed(1)}`, fill: '#f472b6', fontSize: 11 }} />
          <Line type="monotone" dataKey="長度" stroke="#60a5fa" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="圍度" stroke="#f472b6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
