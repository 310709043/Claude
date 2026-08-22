import BraNav from '@/components/bra/BraNav';
import BraHero from '@/components/bra/BraHero';
import BraCalculator from '@/components/bra/BraCalculator';
import MeasureGuide from '@/components/bra/MeasureGuide';
import SizeChart from '@/components/bra/SizeChart';
import FitCheck from '@/components/bra/FitCheck';
import Faq from '@/components/bra/Faq';
import BraFooter from '@/components/bra/BraFooter';

export default function BraSizePage() {
  return (
    <main>
      <BraNav />
      <BraHero />

      <div className="mx-auto max-w-6xl space-y-24 px-6 py-16 sm:py-20">
        <MeasureGuide />
        <section className="scroll-mt-24">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-500">計算器</p>
            <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">換算你的尺碼</h2>
            <p className="mt-3 leading-relaxed text-stone-600">
              數字一邊填，結果一邊更新。單位可以隨時在公分與英吋之間切換。
            </p>
          </div>
          <BraCalculator />
        </section>
        <SizeChart />
        <FitCheck />
        <Faq />
      </div>

      <BraFooter />
    </main>
  );
}
