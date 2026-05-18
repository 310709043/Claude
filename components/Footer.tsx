'use client';

import { profile } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="border-t border-border py-10 mt-10">
      <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
        <div>
          © {new Date().getFullYear()} {profile.nameEn} ({profile.nameZh}). All
          rights reserved.
        </div>
        <div className="font-mono">
          Built with Next.js · Tailwind · Deployed on Vercel
        </div>
      </div>
    </footer>
  );
}
