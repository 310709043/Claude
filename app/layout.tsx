import type { Metadata, Viewport } from 'next';
import {
  Noto_Sans_TC,
  Silkscreen,
  Press_Start_2P,
  VT323,
  DotGothic16,
} from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ScanlineOverlay } from '@/components/ScanlineOverlay';
import './globals.css';

const notoTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-tc',
  display: 'swap',
});
const silkscreen = Silkscreen({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-silkscreen',
  display: 'swap',
});
const pressStart = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-press-start',
  display: 'swap',
});
const vt323 = VT323({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-vt323',
  display: 'swap',
});
const dotGothic = DotGothic16({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dot-gothic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LowBatteryTown — 充電中的城市 · 找你的人 · 找你的專注',
  description:
    'LowBatteryTown is a pixel-art focus city. Find your people, find your focus.',
  keywords: ['LowBatteryTown', '專注', 'Pomodoro', 'pixel art', 'lofi'],
};

export const viewport: Viewport = {
  themeColor: '#07041a',
  width: 'device-width',
  initialScale: 1,
};

const fontVars = [
  notoTC.variable,
  silkscreen.variable,
  pressStart.variable,
  vt323.variable,
  dotGothic.variable,
].join(' ');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" className={fontVars} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ScanlineOverlay />
          <div id="root" className="crt" style={{ height: '100%' }}>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
