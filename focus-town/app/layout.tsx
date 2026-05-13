import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Focus Town – Lofi Pixel Focus Platform',
  description: 'A cozy lofi pixel-art city where you focus, connect, and grow together.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-512.png',
  },
  openGraph: {
    title: 'Focus Town',
    description: 'Lofi Pixel Focus Social Platform',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0f0c29',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-mono overflow-hidden">
        {/* CRT Overlay */}
        <div className="crt-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
