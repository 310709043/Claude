import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Measurement, Unit } from './types';
import { loadHistory, saveHistory } from './utils';
import MeasurementForm from './components/MeasurementForm';
import ResultCard from './components/ResultCard';
import HistoryChart from './components/HistoryChart';
import HistoryList from './components/HistoryList';
import HowToMeasure from './components/HowToMeasure';
import './App.css';

function App() {
  const [history, setHistory] = useState<Measurement[]>(() => loadHistory());
  const [latest, setLatest] = useState<Measurement | null>(() => {
    const h = loadHistory();
    return h.length > 0 ? h[h.length - 1] : null;
  });
  const [displayUnit, setDisplayUnit] = useState<Unit>('cm');

  const handleSave = useCallback((data: Omit<Measurement, 'id' | 'date'>) => {
    const m: Measurement = { ...data, id: uuidv4(), date: new Date().toISOString() };
    const updated = [...history, m];
    setHistory(updated);
    saveHistory(updated);
    setLatest(m);
  }, [history]);

  const handleDelete = useCallback((id: string) => {
    const updated = history.filter(m => m.id !== id);
    setHistory(updated);
    saveHistory(updated);
    if (latest?.id === id) {
      setLatest(updated.length > 0 ? updated[updated.length - 1] : null);
    }
  }, [history, latest]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>📏 男性生殖器測量工具</h1>
          <p className="subtitle">基於學術數據的私密健康追蹤</p>
        </div>
        <div className="unit-display-toggle">
          <span>顯示單位：</span>
          <button
            className={`toggle-btn small ${displayUnit === 'cm' ? 'active' : ''}`}
            onClick={() => setDisplayUnit('cm')}
          >cm</button>
          <button
            className={`toggle-btn small ${displayUnit === 'inch' ? 'active' : ''}`}
            onClick={() => setDisplayUnit('inch')}
          >inch</button>
        </div>
      </header>

      <main className="app-main">
        <HowToMeasure />
        <MeasurementForm onSave={handleSave} />
        {latest && <ResultCard measurement={latest} />}
        <HistoryChart history={history} displayUnit={displayUnit} />
        <HistoryList history={history} displayUnit={displayUnit} onDelete={handleDelete} />
      </main>

      <footer className="app-footer">
        <p>🔒 所有數據儲存於本機，不上傳伺服器 · 僅供個人健康參考，非醫療診斷</p>
      </footer>
    </div>
  );
}

export default App;
