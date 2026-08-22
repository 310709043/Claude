import { BAND_TABLE, CUP_TABLE } from '@/lib/braSize';

export default function SizeChart() {
  return (
    <section id="chart" className="scroll-mt-24">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-rose-500">對照表</p>
        <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">尺碼怎麼算出來的</h2>
        <p className="mt-3 leading-relaxed text-stone-600">
          底圍看下胸圍，罩杯看「上胸圍 − 下胸圍」。每 2.5 公分（約 1 吋）跳一個罩杯，
          英美系統只是換一套字母、換一種底圍寫法而已。
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
          <div className="border-b border-rose-100 bg-rose-50/60 px-5 py-3">
            <h3 className="font-semibold text-stone-900">罩杯：看差值</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[440px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-stone-400">
                <tr>
                  <th className="px-5 py-3 font-medium">罩杯差（公分）</th>
                  <th className="px-5 py-3 font-medium">台/日/歐</th>
                  <th className="px-5 py-3 font-medium">英規</th>
                  <th className="px-5 py-3 font-medium">美規</th>
                </tr>
              </thead>
              <tbody>
                {CUP_TABLE.map((r) => (
                  <tr key={r.tw} className="border-t border-rose-50">
                    <td className="px-5 py-2.5 text-stone-600">{r.diffCm}</td>
                    <td className="px-5 py-2.5 font-mono font-semibold text-rose-600">{r.tw}</td>
                    <td className="px-5 py-2.5 font-mono text-stone-700">{r.uk}</td>
                    <td className="px-5 py-2.5 font-mono text-stone-700">{r.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="px-5 pb-4 pt-1 text-xs leading-relaxed text-stone-500">
            字母依各品牌尺碼表的慣例對齊（EU 75B = JP 75B = FR 90B）。
            少數歐洲品牌改用 2 公分級距的規範定義，可能會差一個罩杯，試穿時多帶一個尺碼就好。
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
          <div className="border-b border-rose-100 bg-rose-50/60 px-5 py-3">
            <h3 className="font-semibold text-stone-900">底圍：看下胸圍</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-stone-400">
                <tr>
                  <th className="px-5 py-3 font-medium">下胸圍（公分）</th>
                  <th className="px-5 py-3 font-medium">台/日/歐</th>
                  <th className="px-5 py-3 font-medium">英/美尺碼表</th>
                  <th className="px-5 py-3 font-medium">英美實測法</th>
                </tr>
              </thead>
              <tbody>
                {BAND_TABLE.map((r) => (
                  <tr key={r.metric} className="border-t border-rose-50">
                    <td className="px-5 py-2.5 text-stone-600">{r.underbustRange}</td>
                    <td className="px-5 py-2.5 font-mono font-semibold text-rose-600">{r.metric}</td>
                    <td className="px-5 py-2.5 font-mono text-stone-700">{r.chartIn}</td>
                    <td className="px-5 py-2.5 font-mono text-stone-500">{r.modernIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="px-5 pb-4 pt-1 text-xs leading-relaxed text-stone-500">
            英美系統有兩種算法並存：多數品牌尺碼表用「下胸圍 + 4 吋」，歐美專業內衣店則直接用實際下胸圍吋數。
            買國外品牌前，先看一下該品牌自己標的量法。
          </p>
        </div>
      </div>
    </section>
  );
}
