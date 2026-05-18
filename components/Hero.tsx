'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Download, Mail, MapPin } from 'lucide-react';
import { profile } from '@/lib/data';

export default function Hero() {
  return (
    <section id="top" className="relative pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="container-page grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="chip mb-6">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open to PM / BA opportunities · Taipei · Remote OK</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            <span className="text-ink">Hi, I&apos;m </span>
            <span className="text-gradient">{profile.nameEn}</span>
            <span className="text-muted text-3xl sm:text-4xl lg:text-5xl font-medium ml-2">
              {profile.nameZh}
            </span>
          </h1>

          <p className="mt-6 text-xl sm:text-2xl text-ink/90 font-medium">
            {profile.title}
            <span className="text-muted text-base"> · {profile.titleEn}</span>
          </p>

          <p className="mt-5 max-w-2xl text-muted leading-relaxed">
            “{profile.slogan}”
            <br />
            <span className="text-sm">— 跨國營運分析 × 產品專案管理 × AI 工具應用</span>
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="btn-primary">
              <Mail size={16} /> 聯絡我
            </a>
            <a href="/EricTang_Resume.pdf" className="btn-ghost" download>
              <Download size={16} /> 下載履歷
            </a>
            <a href="#projects" className="btn-ghost">
              查看作品
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <MapPin size={14} /> {profile.location}
            </span>
            <span>·</span>
            <span>MBTI: {profile.mbti}</span>
            <span>·</span>
            <span>{profile.nationality}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mx-auto"
        >
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-accent/40 via-fuchsia-500/30 to-accent2/40 blur-2xl" />
            <div className="relative w-full h-full rounded-full overflow-hidden glow-ring border border-border bg-panel">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.photo}
                alt={profile.nameEn}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-7xl font-bold text-gradient -z-0">
                ET
              </div>
            </div>

            <div className="absolute -bottom-4 -right-2 card px-4 py-3 text-xs">
              <div className="text-muted">currently</div>
              <div className="font-semibold">Operations @ TOPCO</div>
            </div>
            <div className="absolute -top-4 -left-4 card px-4 py-3 text-xs">
              <div className="text-muted">tools</div>
              <div className="font-mono font-semibold">AI · BI · ERP</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="container-page mt-20 flex justify-center text-muted">
        <a href="#about" className="flex flex-col items-center gap-2 text-xs">
          <span>scroll</span>
          <ArrowDown className="animate-bounce" size={16} />
        </a>
      </div>
    </section>
  );
}
