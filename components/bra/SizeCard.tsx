'use client';

import { useEffect, useState } from 'react';
import { TEMPLATES, drawCard, readyForCard, type CardData, type TemplateId } from '@/lib/sizeCard';

const IDS = Object.keys(TEMPLATES) as TemplateId[];

export default function SizeCard({ data }: { data: CardData }) {
  const [open, setOpen] = useState(false);
  const [tpl, setTpl] = useState<TemplateId>('cream');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    (async () => {
      await readyForCard();
      if (cancelled) return;
      const canvas = document.createElement('canvas');
      drawCard(canvas, data, tpl);
      setUrl(canvas.toDataURL('image/png'));
    })();

    return () => {
      cancelled = true;
    };
  }, [open, tpl, data]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-5 w-full rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
      >
        做一張尺碼卡
      </button>
    );
  }

  return (
    <div className="mt-5">
      <div className="flex gap-2">
        {IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTpl(id)}
            aria-pressed={tpl === id}
            className={`flex-1 rounded-xl border px-3 py-2 text-sm transition ${
              tpl === id
                ? 'border-rose-400 bg-rose-50 font-semibold text-rose-600'
                : 'border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {TEMPLATES[id].name}
          </button>
        ))}
      </div>

      {url && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={url}
          alt={`尺碼卡：${data.label}`}
          className="mt-4 w-full rounded-xl border border-stone-200"
        />
      )}

      <a
        href={url || undefined}
        download={`尺碼卡-${data.label}.png`}
        className="mt-3 block rounded-xl bg-rose-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-rose-600"
      >
        存成圖片
      </a>

      <button
        type="button"
        onClick={() => setOpen(false)}
        className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-600 transition hover:bg-stone-50"
      >
        收起來
      </button>

      <p className="mt-3 text-xs text-stone-400">
        在平板或手機上，也可以長按圖片直接儲存。圖片在你的裝置上產生，不會上傳。
      </p>
    </div>
  );
}
