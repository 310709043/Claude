'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  calculate,
  cmToIn,
  inToCm,
  validate,
  type Measurements,
  type SizeResult,
  type Unit,
} from '@/lib/braSize';

type Draft = { underbust: string; bust: string; leanBust: string };

type HistoryItem = {
  date: string;
  underbust: number;
  bust: number;
  leanBust: number | null;
  label: string;
};

const HISTORY_KEY = 'bra-size-history';

/** 依單位把輸入字串轉成公分 */
function toCm(value: string, unit: Unit): number | null {
  if (value.trim() === '') return null;
  const n = Number(value);
  if (Number.isNaN(n)) return null;
  return unit === 'cm' ? n : inToCm(n);
}

function fmt(cm: number, unit: Unit) {
  return unit === 'cm' ? `${cm.toFixed(1)} 公分` : `${cmToIn(cm).toFixed(1)} 吋`;
}

function Field({
  id,
  label,
  hint,
  unit,
  value,
  min,
  max,
  onChange,
  error,
  optional,
}: {
  id: string;
  label: string;
  hint: string;
  unit: Unit;
  value: string;
  min: number;
  max: number;
  onChange: (v: string) => void;
  error?: string;
  optional?: boolean;
}) {
  const sliderMin = unit === 'cm' ? min : Math.round(cmToIn(min));
  const sliderMax = unit === 'cm' ? max : Math.round(cmToIn(max));
  const numeric = Number(value);
  const sliderValue = Number.isNaN(numeric) || value === '' ? sliderMin : numeric;

  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-stone-800">
          {label}
          {optional && <span className="ml-1.5 text-xs font-normal text-stone-400">選填</span>}
        </span>
        <span className="text-xs text-stone-500">{hint}</span>
      </label>

      <div className="mt-2 flex items-center gap-3">
        <div className="relative flex-1">
          <input
            id={id}
            type="number"
            inputMode="decimal"
            step="0.5"
            value={value}
            placeholder="—"
            onChange={(e) => onChange(e.target.value)}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`w-full rounded-xl border bg-white px-4 py-3 pr-14 text-lg font-medium text-stone-900 outline-none transition
              focus:ring-4 focus:ring-rose-200 ${
                error ? 'border-red-400' : 'border-stone-200 focus:border-rose-400'
              }`}
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">
            {unit === 'cm' ? '公分' : '吋'}
          </span>
        </div>
      </div>

      <input
        type="range"
        aria-label={`${label} 滑桿`}
        min={sliderMin}
        max={sliderMax}
        step={unit === 'cm' ? 0.5 : 0.5}
        value={sliderValue}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full accent-rose-500"
      />

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function ResultRow({ system, note, value }: { system: string; note: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-rose-100 py-3 last:border-0">
      <div>
        <p className="text-sm font-semibold text-stone-800">{system}</p>
        <p className="text-xs text-stone-500">{note}</p>
      </div>
      <p className="font-mono text-lg font-bold text-rose-600">{value}</p>
    </div>
  );
}

export default function BraCalculator() {
  const [unit, setUnit] = useState<Unit>('cm');
  const [draft, setDraft] = useState<Draft>({ underbust: '', bust: '', leanBust: '' });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw) as HistoryItem[]);
    } catch {
      /* localStorage 不可用時忽略即可 */
    }
  }, []);

  const measured = useMemo(() => {
    return {
      underbust: toCm(draft.underbust, unit),
      bust: toCm(draft.bust, unit),
      leanBust: toCm(draft.leanBust, unit),
    };
  }, [draft, unit]);

  const touched = draft.underbust !== '' || draft.bust !== '';

  const issues = useMemo(() => {
    if (!touched) return [];
    return validate({
      underbust: measured.underbust ?? NaN,
      bust: measured.bust ?? NaN,
      leanBust: measured.leanBust,
    });
  }, [measured, touched]);

  const result: SizeResult | null = useMemo(() => {
    if (measured.underbust == null || measured.bust == null) return null;
    if (issues.length > 0) return null;
    const m: Measurements = {
      underbust: measured.underbust,
      bust: measured.bust,
      leanBust: measured.leanBust,
    };
    return calculate(m);
  }, [measured, issues]);

  const errorFor = (field: string) => issues.find((i) => i.field === field)?.message;
  const formError = issues.find((i) => i.field === 'form')?.message;

  /** 切換單位時換算已輸入的數字，避免數值被誤解讀 */
  function switchUnit(next: Unit) {
    if (next === unit) return;
    const convert = (v: string) => {
      if (v.trim() === '') return '';
      const n = Number(v);
      if (Number.isNaN(n)) return '';
      const cm = next === 'in' ? cmToIn(n) : inToCm(n);
      return String(Math.round(cm * 2) / 2);
    };
    setDraft({
      underbust: convert(draft.underbust),
      bust: convert(draft.bust),
      leanBust: convert(draft.leanBust),
    });
    setUnit(next);
  }

  function saveRecord() {
    if (!result || measured.underbust == null || measured.bust == null) return;
    const item: HistoryItem = {
      date: new Date().toISOString().slice(0, 10),
      underbust: Number(measured.underbust.toFixed(1)),
      bust: Number(measured.bust.toFixed(1)),
      leanBust: measured.leanBust != null ? Number(measured.leanBust.toFixed(1)) : null,
      label: result.tw.label,
    };
    const next = [item, ...history].slice(0, 8);
    setHistory(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {
      /* 無痕模式等情況下略過 */
    }
  }

  function clearHistory() {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      /* 略過 */
    }
  }

  return (
    <div id="calculator" className="scroll-mt-24">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* ---------- 輸入 ---------- */}
        <div className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-stone-900">輸入你的數字</h3>
            <div className="inline-flex rounded-full bg-rose-50 p-1" role="group" aria-label="單位切換">
              {(['cm', 'in'] as Unit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => switchUnit(u)}
                  aria-pressed={unit === u}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    unit === u ? 'bg-rose-500 text-white shadow' : 'text-rose-600 hover:bg-rose-100'
                  }`}
                >
                  {u === 'cm' ? '公分' : '英吋'}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <Field
              id="underbust"
              label="下胸圍"
              hint="乳房下緣、貼合肋骨一圈"
              unit={unit}
              min={55}
              max={130}
              value={draft.underbust}
              onChange={(v) => setDraft((d) => ({ ...d, underbust: v }))}
              error={errorFor('underbust')}
            />
            <Field
              id="bust"
              label="上胸圍（站姿）"
              hint="通過乳頭最高點一圈"
              unit={unit}
              min={60}
              max={170}
              value={draft.bust}
              onChange={(v) => setDraft((d) => ({ ...d, bust: v }))}
              error={errorFor('bust')}
            />
            <Field
              id="leanBust"
              label="上胸圍（俯身 90°）"
              hint="上半身前傾、讓胸部自然下垂"
              unit={unit}
              min={60}
              max={180}
              value={draft.leanBust}
              onChange={(v) => setDraft((d) => ({ ...d, leanBust: v }))}
              error={errorFor('leanBust')}
              optional
            />
            <p className="rounded-xl bg-rose-50/70 px-4 py-3 text-xs leading-relaxed text-stone-600">
              填了俯身數值，計算會取「站姿 × 俯身」的平均值。胸型較柔軟的人，只量站姿容易低估罩杯。
            </p>
          </div>

          {formError && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setDraft({ underbust: '', bust: '', leanBust: '' })}
              className="rounded-full border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
            >
              清除
            </button>
            <button
              type="button"
              onClick={saveRecord}
              disabled={!result}
              className="rounded-full bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none"
            >
              {saved ? '已記錄 ✓' : '記錄這次量測'}
            </button>
          </div>
          <p className="mt-3 text-xs text-stone-400">
            所有計算都在你的瀏覽器完成，紀錄只存在這台裝置，不會上傳。
          </p>
        </div>

        {/* ---------- 結果 ---------- */}
        <div className="rounded-3xl border border-rose-100 bg-gradient-to-b from-rose-50 to-white p-6 shadow-sm sm:p-8">
          <h3 className="text-lg font-bold text-stone-900">你的參考尺碼</h3>

          {!result && (
            <div className="mt-8 flex h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-rose-200 text-center">
              <p className="text-sm text-stone-500">填入上胸圍與下胸圍</p>
              <p className="mt-1 text-sm text-stone-400">結果會即時出現在這裡</p>
            </div>
          )}

          {result && (
            <>
              <div className="mt-4 rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-rose-100">
                <p className="text-xs uppercase tracking-widest text-rose-400">台灣 / 日本 / 歐規</p>
                <p className="mt-2 font-mono text-5xl font-black text-rose-600">{result.tw.label}</p>
                <p className="mt-3 text-sm text-stone-500">
                  罩杯差 {result.diffCm.toFixed(1)} 公分（{result.diffIn.toFixed(1)} 吋）
                </p>
                {result.effectiveBust !== 0 && (
                  <p className="mt-1 text-xs text-stone-400">
                    採用上胸圍：{fmt(result.effectiveBust, unit)}
                  </p>
                )}
              </div>

              <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-rose-100">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-stone-400">
                  其他尺碼系統
                </p>
                <ResultRow system="法規 FR" note="法國、西班牙（底圍 = 歐規 + 15）" value={result.fr.label} />
                <ResultRow system="英規 UK" note="D 之後接 DD、E、F、FF" value={result.uk.label} />
                <ResultRow system="美規 US" note="D 之後接 DD、DDD" value={result.us.label} />
                <ResultRow
                  system="英美實測法"
                  note="部分歐美專業內衣店改用實際下胸圍當底圍"
                  value={result.modern.label}
                />
                <p className="pt-3 text-xs leading-relaxed text-stone-500">
                  英美系統有兩套並行的量法：品牌尺碼表多半沿用「下胸圍 + 4 吋」的底圍，
                  專業內衣店則直接用實際下胸圍。兩者標示可能差好幾號，購買時以該品牌自己的尺碼表為準。
                </p>
              </div>

              {result.sisters && (
              <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-rose-100">
                <p className="text-sm font-semibold text-stone-800">姊妹尺碼（容量相近，可一起試）</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-rose-100 px-4 py-1.5 font-mono text-sm font-semibold text-rose-700">
                    {result.sisters.tighter}
                  </span>
                  <span className="rounded-full bg-rose-500 px-4 py-1.5 font-mono text-sm font-semibold text-white">
                    {result.tw.label}
                  </span>
                  <span className="rounded-full bg-rose-100 px-4 py-1.5 font-mono text-sm font-semibold text-rose-700">
                    {result.sisters.looser}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-stone-500">
                  底圍鬆了就往左（底圍小一號、罩杯大一號）；底圍勒得慌就往右。三個尺碼的杯容量差不多。
                </p>
              </div>
              )}

              <ul className="mt-6 space-y-2">
                {result.notes.map((n) => (
                  <li key={n} className="flex gap-2 text-xs leading-relaxed text-stone-600">
                    <span aria-hidden className="text-rose-400">•</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* ---------- 紀錄 ---------- */}
      {history.length > 0 && (
        <div className="mt-6 rounded-3xl border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-900">量測紀錄</h3>
            <button
              type="button"
              onClick={clearHistory}
              className="text-xs text-stone-400 underline underline-offset-4 hover:text-rose-500"
            >
              全部清除
            </button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-stone-400">
                  <th className="pb-2 font-medium">日期</th>
                  <th className="pb-2 font-medium">下胸圍</th>
                  <th className="pb-2 font-medium">上胸圍</th>
                  <th className="pb-2 font-medium">尺碼</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={`${h.date}-${i}`} className="border-t border-rose-50">
                    <td className="py-2.5 text-stone-500">{h.date}</td>
                    <td className="py-2.5 text-stone-700">{h.underbust} cm</td>
                    <td className="py-2.5 text-stone-700">{h.bust} cm</td>
                    <td className="py-2.5 font-mono font-semibold text-rose-600">{h.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-stone-400">
            身形會隨生理週期、體重與年齡變化，建議每 3–6 個月重新量一次。
          </p>
        </div>
      )}
    </div>
  );
}
