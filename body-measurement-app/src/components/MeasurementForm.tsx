import React, { useState } from 'react';
import { Measurement, Unit } from '../types';
import { convertUnit } from '../utils';

interface Props {
  onSave: (m: Omit<Measurement, 'id' | 'date'>) => void;
}

export default function MeasurementForm({ onSave }: Props) {
  const [unit, setUnit] = useState<Unit>('cm');
  const [length, setLength] = useState('');
  const [girth, setGirth] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<{ length?: string; girth?: string }>({});

  const maxLength = unit === 'cm' ? 30 : 12;
  const minVal = unit === 'cm' ? 1 : 0.5;

  function validate(): boolean {
    const errs: { length?: string; girth?: string } = {};
    const l = parseFloat(length);
    const g = parseFloat(girth);
    if (!length || isNaN(l) || l < minVal || l > maxLength) {
      errs.length = `請輸入 ${minVal}–${maxLength} ${unit} 的數值`;
    }
    if (!girth || isNaN(g) || g < minVal || g > maxLength) {
      errs.girth = `請輸入 ${minVal}–${maxLength} ${unit} 的數值`;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleUnitToggle(newUnit: Unit) {
    if (newUnit === unit) return;
    if (length) {
      const converted = convertUnit(parseFloat(length) || 0, unit, newUnit);
      setLength(converted ? String(converted) : '');
    }
    if (girth) {
      const converted = convertUnit(parseFloat(girth) || 0, unit, newUnit);
      setGirth(converted ? String(converted) : '');
    }
    setUnit(newUnit);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave({ length: parseFloat(length), girth: parseFloat(girth), unit, note: note || undefined });
    setLength('');
    setGirth('');
    setNote('');
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 className="section-title">📏 輸入測量數據</h2>

      <div className="unit-toggle">
        <button
          type="button"
          className={`toggle-btn ${unit === 'cm' ? 'active' : ''}`}
          onClick={() => handleUnitToggle('cm')}
        >
          公分 (cm)
        </button>
        <button
          type="button"
          className={`toggle-btn ${unit === 'inch' ? 'active' : ''}`}
          onClick={() => handleUnitToggle('inch')}
        >
          英寸 (inch)
        </button>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>勃起長度</label>
          <div className="input-wrapper">
            <input
              type="number"
              step="0.1"
              min={minVal}
              max={maxLength}
              value={length}
              onChange={e => setLength(e.target.value)}
              placeholder={`例：13.0`}
            />
            <span className="unit-label">{unit}</span>
          </div>
          {errors.length && <p className="error">{errors.length}</p>}
        </div>

        <div className="form-group">
          <label>勃起圍度 (周長)</label>
          <div className="input-wrapper">
            <input
              type="number"
              step="0.1"
              min={minVal}
              max={maxLength}
              value={girth}
              onChange={e => setGirth(e.target.value)}
              placeholder={`例：11.5`}
            />
            <span className="unit-label">{unit}</span>
          </div>
          {errors.girth && <p className="error">{errors.girth}</p>}
        </div>
      </div>

      <div className="form-group">
        <label>備注 (可選)</label>
        <input
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="例：早晨測量"
          maxLength={100}
        />
      </div>

      <button type="submit" className="btn-primary">
        儲存測量
      </button>
    </form>
  );
}
