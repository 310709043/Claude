import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '內衣尺碼計算',
  description: '輸入上胸圍與下胸圍，立刻算出內衣尺碼。計算在瀏覽器完成，不上傳資料。',
  keywords: ['內衣尺碼', '胸圍測量', '罩杯計算', '下胸圍', '上胸圍'],
};

export default function BraSizeLayout({ children }: { children: React.ReactNode }) {
  return <div className="bra-root min-h-screen bg-rose-50/40 text-stone-800">{children}</div>;
}
