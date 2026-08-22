import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '合身尺 — 女性內衣尺碼計算器｜上胸圍・下胸圍換算',
  description:
    '輸入上胸圍與下胸圍，立刻換算台／日、歐、法、英、美五種內衣尺碼，附姊妹尺碼、量法教學與試穿合身檢查清單。全程在瀏覽器計算，不上傳資料。',
  keywords: [
    '內衣尺碼',
    '胸圍測量',
    '罩杯計算',
    'bra size calculator',
    '下胸圍',
    '上胸圍',
    '姊妹尺碼',
  ],
  openGraph: {
    title: '合身尺 — 女性內衣尺碼計算器',
    description: '量兩個數字，換算五種內衣尺碼；含量法教學與合身檢查清單。',
    type: 'website',
  },
};

export default function BraSizeLayout({ children }: { children: React.ReactNode }) {
  return <div className="bra-root min-h-screen bg-rose-50/40 text-stone-800">{children}</div>;
}
