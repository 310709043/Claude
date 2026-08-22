const CHECKS = [
  {
    title: '後扣帶會往上跑',
    cause: '底圍太鬆',
    fix: '底圍小一號、罩杯大一號（例：75B → 70C）。合身的底圍應該水平環繞，只塞得進兩指。',
  },
  {
    title: '肩帶勒出深痕',
    cause: '支撐都靠肩帶',
    fix: '內衣約 80% 的支撐來自底圍。先把底圍收緊一號，再把肩帶放鬆。',
  },
  {
    title: '罩杯上緣被擠出一圈',
    cause: '罩杯太小',
    fix: '罩杯升一級。若只有靠近腋下的位置溢出，換全罩杯或側比較高的版型。',
  },
  {
    title: '罩杯上方有空隙、會皺',
    cause: '罩杯太大或杯型不合',
    fix: '罩杯降一級；若換小仍有空隙，代表是杯型問題，試試 3/4 罩杯或薄墊款。',
  },
  {
    title: '中央鋼圈沒有貼到胸骨',
    cause: '罩杯太小或杯寬不足',
    fix: '中心點應該平貼胸骨。浮起來多半是罩杯不夠大，先升一級再看。',
  },
  {
    title: '鋼圈壓在乳房組織上',
    cause: '杯寬太窄',
    fix: '鋼圈應該落在乳房外圍的肋骨上。壓到肉就換更寬的杯型或大一級罩杯。',
  },
];

export default function FitCheck() {
  return (
    <section id="fit" className="scroll-mt-24">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-rose-500">合身檢查</p>
        <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">穿上之後，這樣判斷合不合</h2>
        <p className="mt-3 leading-relaxed text-stone-600">
          數字只是起點。試穿時對照下面六個常見狀況，就知道該往哪個方向調整。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHECKS.map((c) => (
          <div key={c.title} className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-stone-900">{c.title}</h3>
            <p className="mt-2 inline-block rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
              {c.cause}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">{c.fix}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
        <h3 className="font-semibold text-stone-900">30 秒自我檢查</h3>
        <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-stone-600 sm:grid-cols-2">
          <li>☐ 扣在最鬆的那一排時，剛好合身（之後鬆了還能往內收）</li>
          <li>☐ 後扣帶與前面中心點在同一水平線上</li>
          <li>☐ 底圍只塞得進兩根手指</li>
          <li>☐ 舉起雙手，內衣不會整件往上跑</li>
          <li>☐ 罩杯表面平整，沒有溢出也沒有空皺</li>
          <li>☐ 脫掉後身上沒有紅腫壓痕</li>
        </ul>
      </div>
    </section>
  );
}
