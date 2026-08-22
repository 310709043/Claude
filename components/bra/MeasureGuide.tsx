const STEPS = [
  {
    n: '01',
    title: '穿上沒有厚墊的內衣，或不穿',
    body: '厚海綿墊會讓上胸圍虛增 2–4 公分。最準的做法是穿無襯墊的軟杯內衣，或直接裸量。',
  },
  {
    n: '02',
    title: '站直、雙手自然下垂',
    body: '對著鏡子確認皮尺前後同高、和地面平行。含胸或聳肩都會讓數字失真。',
  },
  {
    n: '03',
    title: '量下胸圍：貼合、拉緊',
    body: '皮尺放在乳房下緣、緊貼肋骨，稍微收緊到「可以呼吸但不滑動」。正常吐氣後再讀數。',
  },
  {
    n: '04',
    title: '量上胸圍：自然、不壓迫',
    body: '皮尺通過乳頭最高點一圈，只要輕輕貼著就好，壓進去會少算一個罩杯。',
  },
  {
    n: '05',
    title: '加量俯身 90°（推薦）',
    body: '身體前傾到上半身與地面平行，讓胸部自然垂下再量一次上胸圍。柔軟胸型用這個值最準。',
  },
  {
    n: '06',
    title: '重複量 2–3 次取平均',
    body: '每次拉緊程度都會有一點差異。同一個位置量三次、取中間值，誤差最小。',
  },
];

function TorsoDiagram() {
  return (
    <svg
      viewBox="0 0 260 300"
      role="img"
      aria-label="示意圖：上胸圍量在乳頭最高點一圈，下胸圍量在乳房下緣貼合肋骨一圈"
      className="h-auto w-full max-w-[260px]"
    >
      {/* 抽象人體軀幹輪廓 */}
      <path
        d="M130 18c-16 0-28 9-32 22-3 10-14 14-27 19-14 5-21 12-21 26 0 20 6 38 8 58 2 22-2 44-4 66-2 20-2 40 0 62 1 10 5 15 16 15h120c11 0 15-5 16-15 2-22 2-42 0-62-2-22-6-44-4-66 2-20 8-38 8-58 0-14-7-21-21-26-13-5-24-9-27-19-4-13-16-22-32-22z"
        fill="#fde8ec"
        stroke="#f3b6c2"
        strokeWidth="2"
      />
      {/* 胸型示意 */}
      <path d="M78 118a26 24 0 1 0 52 0" fill="none" stroke="#f0a3b4" strokeWidth="1.8" />
      <path d="M130 118a26 24 0 1 0 52 0" fill="none" stroke="#f0a3b4" strokeWidth="1.8" />

      {/* 上胸圍線 */}
      <line x1="34" y1="118" x2="226" y2="118" stroke="#e11d48" strokeWidth="2.5" strokeDasharray="7 5" />
      <circle cx="34" cy="118" r="4" fill="#e11d48" />
      <circle cx="226" cy="118" r="4" fill="#e11d48" />
      <text x="130" y="108" textAnchor="middle" fontSize="14" fontWeight="700" fill="#e11d48">
        上胸圍
      </text>

      {/* 下胸圍線 */}
      <line x1="40" y1="152" x2="220" y2="152" stroke="#0f766e" strokeWidth="2.5" strokeDasharray="7 5" />
      <circle cx="40" cy="152" r="4" fill="#0f766e" />
      <circle cx="220" cy="152" r="4" fill="#0f766e" />
      <text x="130" y="172" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0f766e">
        下胸圍
      </text>
    </svg>
  );
}

export default function MeasureGuide() {
  return (
    <section id="how" className="scroll-mt-24">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-rose-500">量法</p>
        <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
          兩個數字，決定你的尺碼
        </h2>
        <p className="mt-3 leading-relaxed text-stone-600">
          內衣尺碼只需要「下胸圍」和「上胸圍」：下胸圍決定底圍數字，兩者的差值決定罩杯字母。
          準備一條軟皮尺，跟著下面六步走一次就好。
        </p>
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="flex justify-center rounded-3xl border border-rose-100 bg-white p-6 shadow-sm">
          <TorsoDiagram />
        </div>

        <ol className="grid gap-4 sm:grid-cols-2">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
              <span className="font-mono text-xs font-bold text-rose-400">{s.n}</span>
              <h3 className="mt-1 font-semibold text-stone-900">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <p className="text-sm font-semibold text-amber-900">量測小提醒</p>
        <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-amber-800">
          <li>• 生理期前一週胸部可能脹大 1–2 公分，避開這幾天量會更穩定。</li>
          <li>• 找不到人幫忙也沒關係，對著鏡子自己量完全可行。</li>
          <li>• 皮尺用久會鬆掉，建議用新的軟尺；用繩子量再拿尺比對也可以。</li>
        </ul>
      </div>
    </section>
  );
}
