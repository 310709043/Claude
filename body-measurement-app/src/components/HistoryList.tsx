import React from 'react';
import { Measurement, Unit } from '../types';
import { toCm, convertUnit } from '../utils';

interface Props {
  history: Measurement[];
  displayUnit: Unit;
  onDelete: (id: string) => void;
}

export default function HistoryList({ history, displayUnit, onDelete }: Props) {
  if (history.length === 0) return null;

  return (
    <div className="card">
      <h2 className="section-title">🗂️ 測量記錄</h2>
      <div className="history-list">
        {[...history].reverse().map(m => {
          const lenCm = toCm(m.length, m.unit);
          const girCm = toCm(m.girth, m.unit);
          const displayLen = parseFloat(convertUnit(lenCm, 'cm', displayUnit).toFixed(1));
          const displayGir = parseFloat(convertUnit(girCm, 'cm', displayUnit).toFixed(1));

          return (
            <div key={m.id} className="history-item">
              <div className="history-date">
                {new Date(m.date).toLocaleString('zh-TW', {
                  year: 'numeric', month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </div>
              <div className="history-values">
                <span>長度 <strong>{displayLen} {displayUnit}</strong></span>
                <span>圍度 <strong>{displayGir} {displayUnit}</strong></span>
              </div>
              {m.note && <div className="history-note">📝 {m.note}</div>}
              <button className="btn-delete" onClick={() => onDelete(m.id)} title="刪除">✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
