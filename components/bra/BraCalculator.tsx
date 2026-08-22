'use client';

import { useEffect, useState } from 'react';
import { calculate } from '@/lib/braSize';
import CameraMirror from './CameraMirror';
import SizeCard from './SizeCard';

const STORE_KEY = 'bra-size-last';

/** 免打字：用 ➖ ➕ 以 0.5 公分調整，也可以直接輸入 */
function Stepper({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const step = (delta: number) => {
    const base = Number(value);
    const next = (Number.isFinite(base) && value !== '' ? base : 75) + delta;
    onChange(String(Math.round(Math.min(160, Math.max(50, next)) * 2) / 2));
  };

  return (
    <div>
      <label htmlFor={id} className="flex items-baseline gap-2">
        <span className="text-sm font-bold text-stone-800">{label}</span>
        <span className="text-xs text-stone-400">{hint}</span>
      </label>

      <div className="mt-2 flex items-stretch gap-2">
        <button
          type="button"
          onClick={() => step(-0.5)}
          aria-label={`${label}減少 0.5 公分`}
          className="w-14 shrink-0 rounded-xl border border-stone-200 text-2xl text-stone-500 transition hover:bg-stone-50 active:bg-stone-100"
        >
          −
        </button>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step="0.5"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="—"
          className="min-w-0 flex-1 rounded-xl border border-stone-200 px-3 py-3 text-center text-xl tabular-nums outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
        />
        <button
          type="button"
          onClick={() => step(0.5)}
          aria-label={`${label}增加 0.5 公分`}
          className="w-14 shrink-0 rounded-xl border border-stone-200 text-2xl text-stone-500 transition hover:bg-stone-50 active:bg-stone-100"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function BraCalculator() {
  const [underbust, setUnderbust] = useState('');
  const [bust, setBust] = useState('');

  // 記住上次的數字，下次打開直接帶入
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { underbust?: string; bust?: string };
      if (saved.underbust) setUnderbust(saved.underbust);
      if (saved.bust) setBust(saved.bust);
    } catch {
      /* 無痕模式等情況下略過 */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ underbust, bust }));
    } catch {
      /* 略過 */
    }
  }, [underbust, bust]);

  const u = Number(underbust);
  const b = Number(bust);
  const filled = underbust !== '' && bust !== '' && !Number.isNaN(u) && !Number.isNaN(b);
  const reversed = filled && b < u;
  const result = filled && !reversed ? calculate(u, b) : null;

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg shadow-rose-100">
      <h1 className="text-2xl font-bold text-stone-900">內衣尺碼計算</h1>
      <p className="mt-1.5 text-sm text-stone-500">量兩個數字就好，單位公分。</p>

      <div className="mt-7 space-y-5">
        <Stepper
          id="underbust"
          label="下胸圍"
          hint="乳房下緣、貼合肋骨一圈"
          value={underbust}
          onChange={setUnderbust}
        />
        <Stepper
          id="bust"
          label="上胸圍"
          hint="通過乳頭最高點一圈"
          value={bust}
          onChange={setBust}
        />
      </div>

      {reversed && (
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          上胸圍應該大於下胸圍，兩個數字是不是寫反了？
        </p>
      )}

      {result && (
        <>
          <div className="mt-7 rounded-2xl bg-rose-50 p-6 text-center">
            <p className="text-xs tracking-widest text-rose-400">你的尺碼</p>
            <p className="mt-1 font-mono text-5xl font-black text-rose-600">{result.label}</p>
            <p className="mt-3 text-sm text-stone-500">
              罩杯差 {result.diffCm.toFixed(1)} 公分 · 英規 {result.uk} · 美規 {result.us}
            </p>
          </div>

          <SizeCard
            data={{
              label: result.label,
              underbust: u,
              bust: b,
              diffCm: result.diffCm,
              date: new Date().toISOString().slice(0, 10),
            }}
          />
        </>
      )}

      <CameraMirror />

      <p className="mt-5 text-xs leading-relaxed text-stone-400">
        站直、穿無襯墊內衣或裸量，皮尺與地面平行；下胸圍拉緊，上胸圍輕貼不壓迫。
        計算在你的瀏覽器完成，不會上傳。各品牌版型有落差，實際以試穿為準；本站不提供醫療建議。
      </p>
    </div>
  );
}
