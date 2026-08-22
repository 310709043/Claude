export default function BraFooter() {
  return (
    <footer className="border-t border-rose-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
          <h2 className="text-sm font-semibold text-stone-800">使用說明與免責聲明</h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            本站提供的是「內衣選購用」的尺碼換算與試穿建議，依據公開的量測慣例計算，
            不構成任何醫療建議，也無法用於健康評估。
            若你察覺胸部出現腫塊、凹陷、皮膚變化、異常分泌物或持續疼痛，
            請直接諮詢乳房外科、婦產科或家庭醫師。
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-2 text-xs text-stone-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} 合身尺 — 開源的內衣尺碼計算工具</p>
          <p>所有計算在瀏覽器本機完成，不蒐集、不傳輸任何個人資料。</p>
        </div>
      </div>
    </footer>
  );
}
