'use client';

import { useState } from 'react';
import { calculate } from '@/lib/braSize';
import CameraMirror from './CameraMirror';

export default function BraCalculator() {
  const [underbust, setUnderbust] = useState('');
  const [bust, setBust] = useState('');

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
        <label className="block">
          <span className="text-sm font-semibold text-stone-800">下胸圍</span>
          <span className="ml-2 text-xs text-stone-400">乳房下緣、貼合肋骨一圈</span>
          <input
            type="number"
            inputMode="decimal"
            step="0.5"
            value={underbust}
            onChange={(e) => setUnderbust(e.target.value)}
            placeholder="例：72"
            className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-lg outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-stone-800">上胸圍</span>
          <span className="ml-2 text-xs text-stone-400">通過乳頭最高點一圈</span>
          <input
            type="number"
            inputMode="decimal"
            step="0.5"
            value={bust}
            onChange={(e) => setBust(e.target.value)}
            placeholder="例：86"
            className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-lg outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
          />
        </label>
      </div>

      {reversed && (
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          上胸圍應該大於下胸圍，兩個數字是不是寫反了？
        </p>
      )}

      {result && (
        <div className="mt-7 rounded-2xl bg-rose-50 p-6 text-center">
          <p className="text-xs tracking-widest text-rose-400">你的尺碼</p>
          <p className="mt-1 font-mono text-5xl font-black text-rose-600">{result.label}</p>
          <p className="mt-3 text-sm text-stone-500">
            罩杯差 {result.diffCm.toFixed(1)} 公分 · 英規 {result.uk} · 美規 {result.us}
          </p>
        </div>
      )}

      <CameraMirror />

      <p className="mt-5 text-xs leading-relaxed text-stone-400">
        站直、穿無襯墊內衣或裸量，皮尺與地面平行；下胸圍拉緊，上胸圍輕貼不壓迫。
        計算在你的瀏覽器完成，不會上傳。各品牌版型有落差，實際以試穿為準；本站不提供醫療建議。
      </p>
    </div>
  );
}
