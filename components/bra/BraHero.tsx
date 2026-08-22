export default function BraHero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_30rem_at_70%_-10%,rgba(244,63,94,0.16),transparent),radial-gradient(40rem_24rem_at_10%_10%,rgba(251,146,60,0.12),transparent)]"
      />
      <div className="relative mx-auto max-w-6xl px-6 pb-14 pt-16 sm:pt-24">
        <p className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-4 py-1.5 text-xs font-medium text-rose-600">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          全程在瀏覽器計算，不上傳任何資料
        </p>

        <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight text-stone-900 sm:text-6xl">
          三分鐘，量出<span className="text-rose-500">真正合身</span>的內衣尺碼
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">
          研究反覆指出，多數女性長期穿著不合身的內衣——通常是底圍太鬆、罩杯太小。
          拿一條軟皮尺，量兩個數字，這裡幫你換算成台／日、歐、法、英、美五種尺碼，
          並給你姊妹尺碼與試穿檢查清單。
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#calculator"
            className="rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
          >
            直接開始計算
          </a>
          <a
            href="#how"
            className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition hover:border-rose-300 hover:text-rose-600"
          >
            先看怎麼量
          </a>
        </div>

        <dl className="mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            { t: '2 個數字', d: '上胸圍與下胸圍，其餘自動換算' },
            { t: '5 種尺碼', d: '台／日、歐、法、英、美一次列出' },
            { t: '0 筆上傳', d: '沒有後端、沒有追蹤，紀錄只留在本機' },
          ].map((s) => (
            <div key={s.t} className="rounded-2xl border border-rose-100 bg-white/80 p-5 shadow-sm">
              <dt className="text-xl font-bold text-stone-900">{s.t}</dt>
              <dd className="mt-1 text-sm text-stone-600">{s.d}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
