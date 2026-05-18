'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Download, Mail, MapPin } from 'lucide-react';
import { profile } from '@/lib/data';
import { useLang, ui } from '@/lib/i18n';

export default function Hero() {
  const { t } = useLang();
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
            <span>{t(ui.hero.badge)}</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            <span className="text-ink">{t(ui.hero.intro)} </span>
            <span className="text-gradient">{profile.nameEn}</span>
            <span className="text-muted text-3xl sm:text-4xl lg:text-5xl font-medium ml-2">
              {profile.nameZh}
            </span>
          </h1>

          <p className="mt-6 text-xl sm:text-2xl text-ink/90 font-medium">
            {t(profile.title)}
          </p>

          <p className="mt-5 max-w-2xl text-muted leading-relaxed">
            “{t(profile.slogan)}”
            <br />
            <span className="text-sm">— {t(ui.hero.tagline)}</span>
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="btn-primary">
              <Mail size={16} /> {t(ui.hero.contactBtn)}
            </a>
            <a href="/EricTang_Resume.pdf" className="btn-ghost" download>
              <Download size={16} /> {t(ui.hero.resumeBtn)}
            </a>
            <a href="#projects" className="btn-ghost">
              {t(ui.hero.projectsBtn)}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <MapPin size={14} /> {t(profile.location)}
            </span>
            <span>·</span>
            <span>MBTI: {profile.mbti}</span>
            <span>·</span>
            <span>{t(profile.nationality)}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mx-auto"
        >
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
            <div className="absolute -inset-8 rounded-full bg-gradient-to-tr from-accent/40 via-fuchsia-500/30 to-accent2/40 blur-3xl animate-pulse-slow" />
            <div className="absolute -inset-2 rounded-full conic-ring opacity-80" />
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 bg-panel shadow-[0_30px_80px_-20px_rgba(124,92,255,0.6)]">
              <div className="absolute inset-0 z-10 flex items-center justify-center text-7xl font-bold text-gradient pointer-events-none">
                ET
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.photo}
                alt={profile.nameEn}
                className="relative z-20 w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 z-30 rounded-full ring-1 ring-inset ring-white/15 pointer-events-none" />
              <div className="absolute inset-0 z-30 rounded-full bg-gradient-to-t from-bg/40 to-transparent pointer-events-none" />
            </div>

            <div className="absolute -bottom-4 -right-2 card px-4 py-3 text-xs">
              <div className="text-muted">{t(ui.hero.current)}</div>
              <div className="font-semibold">{t(profile.currentRole)}</div>
            </div>
            <div className="absolute -top-4 -left-4 card px-4 py-3 text-xs">
              <div className="text-muted">{t(ui.hero.tools)}</div>
              <div className="font-mono font-semibold">AI · BI · ERP</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="container-page mt-20 flex justify-center text-muted">
        <a href="#about" className="flex flex-col items-center gap-2 text-xs">
          <span>{t(ui.hero.scroll)}</span>
          <ArrowDown className="animate-bounce" size={16} />
        </a>
      </div>
    </section>
  );
}
