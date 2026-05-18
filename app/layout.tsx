import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Eric Tang — Operations Manager & PM',
  description:
    'Eric Tang (曾詳藝) — 跨國營運分析 × 產品專案管理 × AI 應用。從 0 到 1 創造可量化的商業價值。',
  keywords: [
    'Eric Tang',
    '曾詳藝',
    'Product Manager',
    'Operations Manager',
    'Business Analyst',
    '產品經理',
    '營運管理',
  ],
  openGraph: {
    title: 'Eric Tang — Operations Manager & PM',
    description: '跨國營運分析 × 產品專案管理 × AI 應用',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant" className={`${inter.variable} ${mono.variable}`}>
      <body className="bg-bg text-ink antialiased">{children}</body>
    </html>
  );
}
