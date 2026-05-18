'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type Lang = 'zh' | 'en';
export type Bi<T = string> = { zh: T; en: T };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: <T>(b: Bi<T> | T) => T;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('zh');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
    if (stored === 'zh' || stored === 'en') setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== 'undefined') localStorage.setItem('lang', l);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = l === 'zh' ? 'zh-Hant' : 'en';
    }
  };

  const toggle = () => setLang(lang === 'zh' ? 'en' : 'zh');

  function t<T>(b: Bi<T> | T): T {
    if (b && typeof b === 'object' && 'zh' in (b as object) && 'en' in (b as object)) {
      return (b as Bi<T>)[lang];
    }
    return b as T;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): Ctx {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}

/** UI label strings used outside data.ts */
export const ui = {
  nav: {
    about: { zh: '關於', en: 'About' },
    skills: { zh: '技能', en: 'Skills' },
    experience: { zh: '經歷', en: 'Experience' },
    projects: { zh: '專案', en: 'Projects' },
    education: { zh: '學歷', en: 'Education' },
    contact: { zh: '聯絡', en: 'Contact' },
    cta: { zh: '聯絡我', en: "Let's talk" },
  },
  hero: {
    badge: {
      zh: '開放 PM / BA 機會 · 台北 · 可遠距',
      en: 'Open to PM / BA roles · Taipei · Remote OK',
    },
    intro: { zh: '哈囉，我是', en: "Hi, I'm" },
    contactBtn: { zh: '聯絡我', en: 'Contact' },
    resumeBtn: { zh: '下載履歷', en: 'Resume' },
    projectsBtn: { zh: '查看作品', en: 'Projects' },
    scroll: { zh: '向下滾動', en: 'scroll' },
    current: { zh: '現職', en: 'currently' },
    tools: { zh: '工具', en: 'tools' },
    tagline: {
      zh: '跨國營運分析 × 產品專案管理 × AI 工具應用',
      en: 'Cross-border ops × Product management × AI-powered workflow',
    },
  },
  about: {
    eyebrow: { zh: '01 — 關於我', en: '01 — About' },
    title: { zh: '關於我', en: 'About Me' },
    subtitle: {
      zh: '從營運分析師到產品經理，我相信用數據說故事，並以使用者價值為核心驅動商業決策。',
      en: 'From ops analyst to PM — I believe in data-driven storytelling and user-centric decisions.',
    },
  },
  skills: {
    eyebrow: { zh: '02 — 技能', en: '02 — Skills' },
    title: { zh: '專業技能', en: 'Skills' },
    subtitle: {
      zh: '商業 × 產品 × AI — 跨領域工具箱，協助我快速從問題識別到解決方案落地。',
      en: 'Business × Product × AI — a cross-domain toolkit from problem to ship.',
    },
  },
  experience: {
    eyebrow: { zh: '03 — 經歷', en: '03 — Experience' },
    title: { zh: '工作經歷', en: 'Experience' },
    subtitle: {
      zh: '從跨國營運分析到產品專案管理，持續驗證並擴展商業價值。',
      en: 'From multi-region operations to product execution.',
    },
    visit: { zh: '前往公司網站', en: 'Visit company site' },
  },
  projects: {
    eyebrow: { zh: '04 — 競賽與專案', en: '04 — Projects & Awards' },
    title: { zh: '競賽與專案', en: 'Projects & Awards' },
    subtitle: {
      zh: '從 0 到 1 的提案、原型與落地經驗 — 由跨領域團隊驅動的創新實踐。',
      en: '0-to-1 proposals, prototypes, and shipping — cross-functional in nature.',
    },
    role: { zh: '擔任角色', en: 'Role' },
  },
  education: {
    eyebrow: { zh: '05 — 學歷', en: '05 — Education' },
    title: { zh: '學歷 · 證照 · 語言', en: 'Education · Certifications · Languages' },
    education: { zh: '學歷', en: 'Education' },
    certs: { zh: '證照', en: 'Certifications' },
    langs: { zh: '語言', en: 'Languages' },
  },
  contact: {
    eyebrow: { zh: '06 — 聯絡', en: '06 — Contact' },
    title: { zh: '聯絡我', en: 'Get in Touch' },
    subtitle: {
      zh: '無論是工作機會、專案合作或想聊聊產品與 AI 的應用，歡迎留言給我。',
      en: 'Open for opportunities, collaborations, or just a chat about product and AI.',
    },
    name: { zh: '姓名', en: 'Name' },
    email: { zh: 'Email', en: 'Email' },
    message: { zh: '訊息', en: 'Message' },
    placeholder: {
      zh: '聊聊你的需求或專案...',
      en: 'Tell me about your project or opportunity...',
    },
    send: { zh: '送出訊息', en: 'Send message' },
    sending: { zh: '傳送中...', en: 'Sending...' },
    success: { zh: '已收到，將盡快回覆！', en: "Got it — I'll reply soon!" },
    failError: { zh: '送出失敗', en: 'Failed to send' },
    getInTouch: { zh: '聯絡資訊', en: 'Get in touch' },
    fallbackNote: {
      zh: '小提示：若表單無法送出，可直接寄信到上方 Email。',
      en: 'Tip: if the form fails, just email me directly above.',
    },
  },
} as const;
