const FAQS = [
  {
    q: '一定要量俯身 90° 嗎？',
    a: '不一定，但很建議。胸型較柔軟、或站姿量出來的罩杯總覺得偏小的人，俯身值通常更接近真實容量。兩個都填，網站會自動取平均。',
  },
  {
    q: '算出來的尺碼跟我平常穿的差很多？',
    a: '很常見。多數人習慣的尺碼是「底圍偏鬆、罩杯偏小」。可以先從姊妹尺碼試起：底圍小一號、罩杯大一號，穿起來的容量差不多，但支撐會明顯變好。',
  },
  {
    q: '為什麼同一個尺碼，不同品牌穿起來不一樣？',
    a: '各品牌的版型、杯深、鋼圈寬度都不同，落差可以到一個罩杯。把計算結果當成起點，實際仍以試穿為準；線上購買記得看該品牌自己的尺碼表與退換貨規則。',
  },
  {
    q: '多久要重新量一次？',
    a: '建議每 3–6 個月量一次。體重變化、運動習慣改變、懷孕哺乳、更年期都會讓尺碼移動。',
  },
  {
    q: '運動內衣也照這個尺碼買嗎？',
    a: '運動內衣多半只有 S/M/L，可以用下胸圍對照品牌尺碼表。高強度運動選壓縮＋包覆兼具的款式，底圍要比日常再緊一點點。',
  },
  {
    q: '我的資料會被送到哪裡去？',
    a: '哪裡都不會。所有計算都在你的瀏覽器裡完成，沒有後端、沒有分析追蹤；按「記錄」只會存進這台裝置的 localStorage，清除瀏覽器資料就會消失。',
  },
  {
    q: '兩邊胸部大小不一樣怎麼辦？',
    a: '相當普遍。以較大的那一側為準選罩杯，另一側用可調式肩帶或活動式襯墊補足。若短時間內出現明顯變化、腫塊或疼痛，請找乳房外科或婦產科評估——這個網站只處理內衣合身，不做任何健康診斷。',
  },
];

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-24">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-rose-500">常見問題</p>
        <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">還想問的幾件事</h2>
      </div>

      <div className="mx-auto max-w-3xl divide-y divide-rose-100 overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
        {FAQS.map((f) => (
          <details key={f.q} className="group px-6 py-4 open:bg-rose-50/40">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-stone-900 marker:content-none">
              {f.q}
              <span
                aria-hidden
                className="shrink-0 text-xl font-normal text-rose-400 transition group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
