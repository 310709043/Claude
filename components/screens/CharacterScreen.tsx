'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PixelSprite } from '@/components/pixel/PixelSprite';
import { StarField } from '@/components/pixel/StarField';
import { LogoImage } from '@/components/ui/LogoImage';
import { LangSwitcher } from '@/components/ui/LangSwitcher';
import { CornerDeco } from '@/components/ui/CornerDeco';
import { useTheme } from '@/components/ThemeProvider';
import { tFor } from '@/lib/i18n';
import { AVATARS } from '@/lib/sprites';
import type { Lang } from '@/components/ThemeProvider';

interface Props {
  onContinue: (p: {
    avatarId?: string;
    name: string;
    age: number;
    region: string;
    interests: string[];
    skills: string[];
    goal: number;
  }) => void;
  onBack: () => void;
}

interface OptionEntry {
  key: string;
  zh: string;
  en: string;
  ko: string;
  ja: string;
  emoji?: string;
}

const INTEREST_OPTIONS: OptionEntry[] = [
  { key: 'coding', zh: '寫程式', en: 'Coding', ko: '코딩', ja: 'プログラミング', emoji: '⌨' },
  { key: 'writing', zh: '寫作', en: 'Writing', ko: '글쓰기', ja: '執筆', emoji: '✎' },
  { key: 'reading', zh: '閱讀', en: 'Reading', ko: '독서', ja: '読書', emoji: '📖' },
  { key: 'art', zh: '畫畫', en: 'Drawing', ko: '그림', ja: '絵', emoji: '🎨' },
  { key: 'music', zh: '音樂', en: 'Music', ko: '음악', ja: '音楽', emoji: '♪' },
  { key: 'lofi', zh: 'lofi', en: 'lofi', ko: 'lofi', ja: 'lofi', emoji: '☁' },
  { key: 'gaming', zh: '遊戲', en: 'Gaming', ko: '게임', ja: 'ゲーム', emoji: '🕹' },
  { key: 'film', zh: '電影', en: 'Film', ko: '영화', ja: '映画', emoji: '🎬' },
  { key: 'photo', zh: '攝影', en: 'Photo', ko: '사진', ja: '写真', emoji: '📷' },
  { key: 'cooking', zh: '料理', en: 'Cooking', ko: '요리', ja: '料理', emoji: '🍳' },
  { key: 'sports', zh: '運動', en: 'Sports', ko: '운동', ja: 'スポーツ', emoji: '⚽' },
  { key: 'travel', zh: '旅行', en: 'Travel', ko: '여행', ja: '旅行', emoji: '✈' },
  { key: 'science', zh: '科學', en: 'Science', ko: '과학', ja: '科学', emoji: '🔬' },
  { key: 'tea', zh: '茶 / 咖啡', en: 'Tea / Coffee', ko: '차/커피', ja: '茶/コーヒー', emoji: '☕' },
  { key: 'plants', zh: '植物', en: 'Plants', ko: '식물', ja: '植物', emoji: '🌿' },
  { key: 'pets', zh: '寵物', en: 'Pets', ko: '반려동물', ja: 'ペット', emoji: '🐾' },
  { key: 'languages', zh: '語言學習', en: 'Languages', ko: '언어', ja: '言語', emoji: '🌐' },
  { key: 'finance', zh: '理財', en: 'Finance', ko: '재테크', ja: '投資', emoji: '💹' },
];

const SKILL_OPTIONS: OptionEntry[] = [
  { key: 'frontend', zh: '前端開發', en: 'Frontend', ko: '프론트엔드', ja: 'フロントエンド' },
  { key: 'backend', zh: '後端開發', en: 'Backend', ko: '백엔드', ja: 'バックエンド' },
  { key: 'design', zh: 'UI / UX 設計', en: 'UI / UX', ko: 'UI / UX 디자인', ja: 'UI / UX' },
  { key: 'product', zh: '產品管理', en: 'Product', ko: '제품관리', ja: 'プロダクト' },
  { key: 'data', zh: '資料分析', en: 'Data', ko: '데이터', ja: 'データ' },
  { key: 'research', zh: '研究', en: 'Research', ko: '연구', ja: '研究' },
  { key: 'marketing', zh: '行銷', en: 'Marketing', ko: '마케팅', ja: 'マーケティング' },
  { key: 'writing', zh: '寫作 / 文案', en: 'Writing', ko: '글쓰기', ja: 'ライティング' },
  { key: 'illust', zh: '插畫', en: 'Illustration', ko: '일러스트', ja: 'イラスト' },
  { key: 'video', zh: '影像剪輯', en: 'Video Editing', ko: '영상편집', ja: '動画編集' },
  { key: 'music_pro', zh: '音樂製作', en: 'Music Prod', ko: '음악제작', ja: '音楽制作' },
  { key: 'teaching', zh: '教學', en: 'Teaching', ko: '교육', ja: '教育' },
  { key: 'study', zh: '學業 / 考試', en: 'Studying', ko: '학업', ja: '学業' },
  { key: 'finance', zh: '財務', en: 'Finance', ko: '재무', ja: '財務' },
  { key: 'language', zh: '外語', en: 'Languages', ko: '외국어', ja: '語学' },
  { key: 'sports', zh: '運動訓練', en: 'Training', ko: '트레이닝', ja: 'トレーニング' },
];

const labelFor = (o: OptionEntry, lang: Lang) => o[lang] || o.en;

export function CharacterScreen({ onContinue, onBack }: Props) {
  const { lang, setLang } = useTheme();
  const t = tFor(lang);
  const [selected, setSelected] = useState(AVATARS[0].id ?? 'designer');
  const [name, setName] = useState('');
  const [age, setAge] = useState(27);
  const [region, setRegion] = useState('TW-TPE');
  const [interests, setInterests] = useState<string[]>(['coding', 'lofi', 'tea']);
  const [skills, setSkills] = useState<string[]>(['frontend', 'design']);
  const [goal, setGoal] = useState(4);
  const [tab, setTab] = useState<'all' | 'role' | 'interests' | 'skills'>('all');
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1280, h: 800 });

  useEffect(() => {
    const update = () => {
      if (wrapRef.current) {
        setSize({ w: wrapRef.current.clientWidth, h: wrapRef.current.clientHeight });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const sel = AVATARS.find((a) => a.id === selected) || AVATARS[0];

  const toggle = (list: string[], setList: (l: string[]) => void, k: string) => () => {
    setList(list.includes(k) ? list.filter((x) => x !== k) : [...list, k]);
  };

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background:
          'radial-gradient(ellipse at 50% 20%, var(--sky-mid) 0%, var(--sky-top) 60%, var(--bg-0) 100%)',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <StarField width={size.w} height={size.h} density={0.0008} />
      </div>

      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          borderBottom: '1px solid var(--panel-stroke)',
          background: 'rgba(7,4,26,0.7)',
          zIndex: 5,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} className="pixel-btn" style={{ padding: '6px 12px', fontSize: 10 }}>
            ◀ {t('back')}
          </button>
          <div
            style={{
              fontFamily: 'var(--font-silkscreen), monospace',
              fontSize: 11,
              color: 'var(--ink-mute)',
              letterSpacing: '0.2em',
            }}
          >
            {t('step')} 02 / 03
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <ProgressDot done />
            <ProgressDot active />
            <ProgressDot />
          </div>
        </div>
        <motion.div layoutId="lbt-logo" transition={{ duration: 0.6, ease: 'easeInOut' }}>
          <LogoImage size={36} />
        </motion.div>
        <LangSwitcher lang={lang} onChange={setLang} compact />
      </div>

      <div
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '380px 1fr',
          gap: 18,
          padding: 18,
          height: 'calc(100% - 50px)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            overflow: 'auto',
            paddingRight: 6,
          }}
        >
          <div
            className="pixel-panel"
            style={{
              padding: 14,
              display: 'flex',
              gap: 14,
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <CornerDeco />
            <div
              style={{
                width: 92,
                height: 92,
                background: 'rgba(0,0,0,0.4)',
                border: '2px solid var(--accent)',
                boxShadow: 'var(--neon-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PixelSprite sprite={sel.sprite} palette={sel.palette} scale={5} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div
                style={{
                  fontFamily: 'var(--font-silkscreen), monospace',
                  fontSize: 9,
                  color: 'var(--ink-mute)',
                  letterSpacing: '0.2em',
                }}
              >
                CITIZEN ID
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-silkscreen), monospace',
                  fontSize: 20,
                  color: 'var(--ink)',
                  minHeight: 24,
                  textShadow: 'var(--neon-glow)',
                }}
              >
                {name || (lang === 'zh' ? '???' : '?????')}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-silkscreen), monospace',
                  fontSize: 11,
                  color: 'var(--accent-3)',
                }}
              >
                {sel.name}
              </div>
              <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                <Chip>LV.1</Chip>
                <Chip>{age} y/o</Chip>
                <Chip color="var(--accent-3)">NEW</Chip>
              </div>
            </div>
          </div>

          <div
            className="pixel-panel"
            style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            <SectionLabel>{t('nickname')}</SectionLabel>
            <input
              className="pixel-input"
              placeholder={t('nicknameHint') as string}
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
            />

            <SectionLabel>
              {t('age')}{' '}
              <span
                style={{
                  color: 'var(--accent-2)',
                  fontSize: 9,
                  fontWeight: 400,
                  letterSpacing: '0.1em',
                }}
              >
                · {t('ageLockedHint')}
              </span>
            </SectionLabel>
            <AgeSlider age={age} setAge={setAge} />

            <SectionLabel>{t('region')}</SectionLabel>
            <RegionSelect region={region} setRegion={setRegion} lang={lang} />
            <div
              style={{
                fontSize: 9,
                fontFamily: 'var(--font-silkscreen), monospace',
                color: 'var(--ink-dim)',
              }}
            >
              {t('regionSub')}
            </div>

            <SectionLabel>{t('dailyGoal')}</SectionLabel>
            <div style={{ display: 'flex', gap: 6 }}>
              {[2, 4, 6, 8].map((n) => (
                <button
                  key={n}
                  onClick={() => setGoal(n)}
                  className={`pixel-btn ${goal === n ? 'primary' : ''}`}
                  style={{ flex: 1, padding: '8px 0', fontSize: 11 }}
                >
                  {n} 🍅
                </button>
              ))}
            </div>
            <div
              style={{
                fontSize: 9,
                fontFamily: 'var(--font-silkscreen), monospace',
                color: 'var(--ink-dim)',
              }}
            >
              {goal} × 25 min = {goal * 25} min/{t('dailyGoal')}
            </div>
          </div>
        </div>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: 4 }}>
              <TabButton active={tab === 'role'} onClick={() => setTab('role')}>
                {t('role')}
              </TabButton>
              <TabButton active={tab === 'interests'} onClick={() => setTab('interests')}>
                {t('interests')} <Badge>{interests.length}</Badge>
              </TabButton>
              <TabButton active={tab === 'skills'} onClick={() => setTab('skills')}>
                {t('skills')} <Badge>{skills.length}</Badge>
              </TabButton>
              <TabButton active={tab === 'all'} onClick={() => setTab('all')}>
                ALL
              </TabButton>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-silkscreen), monospace',
                fontSize: 10,
                color: 'var(--ink-mute)',
                letterSpacing: '0.15em',
              }}
            >
              {t('roleSub')}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              paddingRight: 6,
            }}
          >
            {(tab === 'role' || tab === 'all') && (
              <section>
                <SectionLabel>{t('role')}</SectionLabel>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(108px, 1fr))',
                    gap: 8,
                    marginTop: 8,
                  }}
                >
                  {AVATARS.map((a) => (
                    <AvatarCell
                      key={a.id}
                      avatar={a}
                      selected={selected === a.id}
                      onClick={() => setSelected(a.id ?? 'designer')}
                    />
                  ))}
                </div>
              </section>
            )}

            {(tab === 'interests' || tab === 'all') && (
              <section>
                <SectionLabel>{t('interests')}</SectionLabel>
                <div
                  style={{
                    fontSize: 9,
                    fontFamily: 'var(--font-silkscreen), monospace',
                    color: 'var(--ink-dim)',
                    marginTop: 2,
                  }}
                >
                  {t('interestsSub')}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {INTEREST_OPTIONS.map((o) => (
                    <ToggleChip
                      key={o.key}
                      active={interests.includes(o.key)}
                      onClick={toggle(interests, setInterests, o.key)}
                    >
                      <span style={{ marginRight: 6 }}>{o.emoji}</span>
                      {labelFor(o, lang)}
                    </ToggleChip>
                  ))}
                </div>
              </section>
            )}

            {(tab === 'skills' || tab === 'all') && (
              <section>
                <SectionLabel>{t('skills')}</SectionLabel>
                <div
                  style={{
                    fontSize: 9,
                    fontFamily: 'var(--font-silkscreen), monospace',
                    color: 'var(--ink-dim)',
                    marginTop: 2,
                  }}
                >
                  {t('skillsSub')}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {SKILL_OPTIONS.map((o) => (
                    <ToggleChip
                      key={o.key}
                      active={skills.includes(o.key)}
                      onClick={toggle(skills, setSkills, o.key)}
                      color="var(--accent-3)"
                    >
                      {labelFor(o, lang)}
                    </ToggleChip>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              borderTop: '1px solid var(--panel-stroke)',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 14,
                fontFamily: 'var(--font-silkscreen), monospace',
                fontSize: 10,
                color: 'var(--ink-mute)',
              }}
            >
              <span>
                {t('role')}: <span style={{ color: 'var(--accent)' }}>{sel.name}</span>
              </span>
              <span>
                · {t('interests')}:{' '}
                <span style={{ color: 'var(--accent-2)' }}>{interests.length}</span>
              </span>
              <span>
                · {t('skills')}: <span style={{ color: 'var(--accent-3)' }}>{skills.length}</span>
              </span>
            </div>
            <button
              className="pixel-btn primary"
              disabled={!name}
              onClick={() =>
                onContinue({ avatarId: sel.id, name, age, region, interests, skills, goal })
              }
              style={{
                padding: '12px 22px',
                fontSize: 12,
                opacity: name ? 1 : 0.5,
                cursor: name ? 'pointer' : 'not-allowed',
              }}
            >
              {t('enterTownBtn')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AvatarCell({
  avatar,
  selected,
  onClick,
}: {
  avatar: (typeof AVATARS)[number];
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      style={{
        background: selected ? 'rgba(183,148,246,0.15)' : 'rgba(0,0,0,0.35)',
        border: `2px solid ${selected ? 'var(--accent)' : 'var(--panel-stroke)'}`,
        padding: 8,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        boxShadow: selected ? 'var(--neon-glow)' : 'none',
        position: 'relative',
      }}
    >
      <PixelSprite sprite={avatar.sprite} palette={avatar.palette} scale={2.5} />
      <div
        style={{
          fontFamily: 'var(--font-silkscreen), monospace',
          fontSize: 9,
          color: selected ? 'var(--accent)' : 'var(--ink-mute)',
          textAlign: 'center',
          letterSpacing: '0.05em',
        }}
      >
        {avatar.name}
      </div>
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            width: 16,
            height: 16,
            background: 'var(--accent)',
            color: '#0a0524',
            fontFamily: 'var(--font-silkscreen), monospace',
            fontSize: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✓
        </motion.div>
      )}
    </motion.button>
  );
}

interface Region {
  code: string;
  flag: string;
  zh: string;
  en: string;
  ko: string;
  ja: string;
}
const REGIONS: Region[] = [
  { code: 'TW-TPE', flag: '🇹🇼', zh: '台北 · Taipei', en: 'Taipei, Taiwan', ko: '대만 타이베이', ja: '台湾 台北' },
  { code: 'TW-TXG', flag: '🇹🇼', zh: '台中 · Taichung', en: 'Taichung, Taiwan', ko: '대만 타이중', ja: '台湾 台中' },
  { code: 'TW-KHH', flag: '🇹🇼', zh: '高雄 · Kaohsiung', en: 'Kaohsiung, Taiwan', ko: '대만 가오슝', ja: '台湾 高雄' },
  { code: 'JP-TYO', flag: '🇯🇵', zh: '東京 · Tokyo', en: 'Tokyo, Japan', ko: '일본 도쿄', ja: '日本 東京' },
  { code: 'JP-OSA', flag: '🇯🇵', zh: '大阪 · Osaka', en: 'Osaka, Japan', ko: '일본 오사카', ja: '日本 大阪' },
  { code: 'KR-SEO', flag: '🇰🇷', zh: '首爾 · Seoul', en: 'Seoul, Korea', ko: '한국 서울', ja: '韓国 ソウル' },
  { code: 'HK', flag: '🇭🇰', zh: '香港 · HK', en: 'Hong Kong', ko: '홍콩', ja: '香港' },
  { code: 'SG', flag: '🇸🇬', zh: '新加坡 · SG', en: 'Singapore', ko: '싱가포르', ja: 'シンガポール' },
  { code: 'US-SFO', flag: '🇺🇸', zh: 'SF Bay Area', en: 'SF Bay Area', ko: '미국 SF', ja: '米 SF' },
  { code: 'US-NYC', flag: '🇺🇸', zh: '紐約 · NYC', en: 'New York', ko: '뉴욕', ja: 'ニューヨーク' },
  { code: 'CA-TOR', flag: '🇨🇦', zh: '多倫多', en: 'Toronto', ko: '토론토', ja: 'トロント' },
  { code: 'GB-LON', flag: '🇬🇧', zh: '倫敦', en: 'London', ko: '런던', ja: 'ロンドン' },
  { code: 'DE-BER', flag: '🇩🇪', zh: '柏林', en: 'Berlin', ko: '베를린', ja: 'ベルリン' },
  { code: 'OTHER', flag: '🌍', zh: '其他', en: 'Other', ko: '기타', ja: 'その他' },
];

function RegionSelect({
  region,
  setRegion,
  lang,
}: {
  region: string;
  setRegion: (s: string) => void;
  lang: Lang;
}) {
  const r = REGIONS.find((x) => x.code === region) || REGIONS[0];
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="pixel-input"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          background: 'rgba(0,0,0,0.4)',
          textAlign: 'left',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>{r.flag}</span>
          <span>{r[lang] || r.en}</span>
        </span>
        <span style={{ color: 'var(--accent-3)' }}>▾</span>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 50,
            maxHeight: 240,
            overflowY: 'auto',
            background: 'rgba(7,4,26,0.97)',
            border: '1px solid var(--accent)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
          }}
        >
          {REGIONS.map((rr) => (
            <div
              key={rr.code}
              onClick={() => {
                setRegion(rr.code);
                setOpen(false);
              }}
              style={{
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                fontFamily: 'var(--font-silkscreen), var(--font-noto-tc), monospace',
                fontSize: 11,
                color: rr.code === region ? 'var(--accent)' : 'var(--ink)',
                background: rr.code === region ? 'rgba(183,148,246,0.15)' : 'transparent',
                borderBottom: '1px solid var(--panel-stroke)',
              }}
            >
              <span style={{ fontSize: 16 }}>{rr.flag}</span>
              <span>{rr[lang] || rr.en}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AgeSlider({ age, setAge }: { age: number; setAge: (n: number) => void }) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-silkscreen), monospace',
            fontSize: 20,
            color: 'var(--accent)',
            textShadow: 'var(--neon-glow)',
          }}
        >
          {age}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            className="pixel-btn"
            style={{ padding: '2px 8px', fontSize: 11 }}
            onClick={() => setAge(Math.max(10, age - 1))}
          >
            -
          </button>
          <button
            className="pixel-btn"
            style={{ padding: '2px 8px', fontSize: 11 }}
            onClick={() => setAge(Math.min(99, age + 1))}
          >
            +
          </button>
        </div>
      </div>
      <input
        type="range"
        min={10}
        max={99}
        value={age}
        onChange={(e) => setAge(+e.target.value)}
        style={{ width: '100%', accentColor: 'var(--accent)' }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-silkscreen), monospace',
          fontSize: 8,
          color: 'var(--ink-dim)',
        }}
      >
        <span>10</span>
        <span>99</span>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--font-silkscreen), monospace',
        fontSize: 11,
        color: 'var(--accent)',
        letterSpacing: '0.2em',
      }}
    >
      <span style={{ width: 6, height: 6, background: 'var(--accent)', boxShadow: 'var(--neon-glow)' }} />
      {children}
    </div>
  );
}

function Chip({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-silkscreen), monospace',
        fontSize: 9,
        padding: '2px 5px',
        border: `1px solid ${color || 'var(--panel-stroke)'}`,
        color: color || 'var(--ink-mute)',
        letterSpacing: '0.1em',
      }}
    >
      {children}
    </span>
  );
}

function TabButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px',
        background: active ? 'var(--accent)' : 'rgba(0,0,0,0.3)',
        color: active ? '#0a0524' : 'var(--ink-mute)',
        border: `1px solid ${active ? 'var(--accent)' : 'var(--panel-stroke)'}`,
        fontFamily: 'var(--font-silkscreen), monospace',
        fontSize: 11,
        letterSpacing: '0.12em',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {children}
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background: 'rgba(0,0,0,0.3)',
        padding: '0 4px',
        fontSize: 9,
        color: 'inherit',
        border: '1px solid rgba(0,0,0,0.3)',
      }}
    >
      {children}
    </span>
  );
}

function ToggleChip({
  children,
  active,
  onClick,
  color,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  const c = color || 'var(--accent)';
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      style={{
        padding: '6px 10px',
        background: active ? c : 'rgba(0,0,0,0.3)',
        color: active ? '#0a0524' : 'var(--ink-mute)',
        border: `1px solid ${active ? c : 'var(--panel-stroke)'}`,
        fontFamily: 'var(--font-silkscreen), monospace',
        fontSize: 11,
        letterSpacing: '0.05em',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        boxShadow: active ? `0 0 8px ${c}66` : 'none',
        transition: 'all 0.12s steps(2)',
      }}
    >
      {children}
    </motion.button>
  );
}

function ProgressDot({ done, active }: { done?: boolean; active?: boolean }) {
  return (
    <span
      style={{
        width: 10,
        height: 10,
        background: done || active ? 'var(--accent)' : 'rgba(0,0,0,0.3)',
        border: '1px solid var(--accent)',
        boxShadow: active ? 'var(--neon-glow)' : 'none',
      }}
    />
  );
}
